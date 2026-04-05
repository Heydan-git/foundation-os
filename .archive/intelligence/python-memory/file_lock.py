#!/usr/bin/env python3
"""
Cross-platform file locking for Foundation OS Core Intelligence
Prevents corruption during concurrent access

ARCHITECTURE:
- Always lock on a SIDECAR .lock file, never on the data file itself
- This prevents inode confusion when atomic rename replaces the data file
- The .lock file is stable: it is never renamed or replaced
"""

import os
import time
import json
import tempfile
from pathlib import Path
from contextlib import contextmanager

try:
    import fcntl
    FCNTL_AVAILABLE = True
except ImportError:
    FCNTL_AVAILABLE = False

try:
    import portalocker
    PORTALOCKER_AVAILABLE = True
except ImportError:
    PORTALOCKER_AVAILABLE = False


class FileLockError(Exception):
    """Exception raised when file locking fails"""
    pass


def _lock_path_for(file_path: Path) -> Path:
    """
    Return the sidecar .lock file path for a given data file.
    The lock file lives next to the data file with a .lock suffix appended.
    """
    return file_path.with_name(file_path.name + ".lock")


@contextmanager
def file_lock(file_path, timeout=10.0, exclusive=True):
    """
    Cross-platform file locking context manager.

    IMPORTANT: Locks a sidecar .lock file, NOT the data file itself.
    This is critical because atomic writes (write-to-temp + rename) replace
    the data file's inode, which would silently release an inode-based lock.

    Args:
        file_path: Path to the data file to protect
        timeout: Maximum wait time for lock (seconds)
        exclusive: True for exclusive lock, False for shared

    Yields:
        Path to the data file (NOT a file handle -- callers open the data
        file themselves after acquiring the lock)

    Usage:
        with file_lock("/path/to/file.json"):
            data = json.loads(Path("/path/to/file.json").read_text())
            # ... mutate data ...
            atomic_write(...)
    """
    file_path = Path(file_path)
    lock_file = _lock_path_for(file_path)

    # Ensure parent directory exists
    file_path.parent.mkdir(parents=True, exist_ok=True)

    if PORTALOCKER_AVAILABLE:
        yield from _portalocker_lock(lock_file, file_path, timeout, exclusive)
    elif FCNTL_AVAILABLE:
        yield from _fcntl_lock(lock_file, file_path, timeout, exclusive)
    else:
        yield from _lockfile_lock(lock_file, file_path, timeout)


def _ensure_lock_file(lock_file: Path):
    """Create lock file if it does not exist. Uses 'a' mode which is safe on empty files."""
    if not lock_file.exists():
        lock_file.parent.mkdir(parents=True, exist_ok=True)
        # 'a' mode creates the file if missing, does nothing if it exists
        with open(lock_file, "a"):
            pass


def _portalocker_lock(lock_file, data_path, timeout, exclusive):
    """Portalocker-based locking on sidecar file"""
    lock_mode = portalocker.LOCK_EX if exclusive else portalocker.LOCK_SH

    _ensure_lock_file(lock_file)

    with open(lock_file, "a+") as f:
        try:
            portalocker.lock(f, lock_mode | portalocker.LOCK_NB, timeout)
            yield data_path
        except portalocker.LockException:
            raise FileLockError(f"Could not acquire lock on {data_path} within {timeout}s")
        finally:
            try:
                portalocker.unlock(f)
            except Exception:
                pass


def _fcntl_lock(lock_file, data_path, timeout, exclusive):
    """fcntl-based locking on sidecar file (POSIX only)"""
    lock_mode = fcntl.LOCK_EX if exclusive else fcntl.LOCK_SH

    _ensure_lock_file(lock_file)

    with open(lock_file, "a+") as f:
        start_time = time.time()
        acquired = False

        while True:
            try:
                fcntl.flock(f.fileno(), lock_mode | fcntl.LOCK_NB)
                acquired = True
                yield data_path
                return
            except (IOError, OSError):
                if time.time() - start_time >= timeout:
                    raise FileLockError(
                        f"Could not acquire lock on {data_path} within {timeout}s"
                    )
                time.sleep(0.05)
            finally:
                if acquired:
                    try:
                        fcntl.flock(f.fileno(), fcntl.LOCK_UN)
                    except Exception:
                        pass


def _lockfile_lock(lock_file, data_path, timeout):
    """
    Simple exclusive lock file mechanism (fallback for platforms without
    fcntl or portalocker). Uses O_CREAT|O_EXCL for atomic creation.
    """
    # Use a separate sentinel so we don't collide with the sidecar
    sentinel = lock_file.with_suffix(".sentinel")
    start_time = time.time()

    while True:
        try:
            fd = os.open(str(sentinel), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.write(fd, str(os.getpid()).encode())
            os.close(fd)
            break
        except FileExistsError:
            if time.time() - start_time >= timeout:
                # Check for stale sentinel
                try:
                    pid = int(sentinel.read_text().strip())
                    try:
                        os.kill(pid, 0)
                    except ProcessLookupError:
                        sentinel.unlink(missing_ok=True)
                        continue
                except (ValueError, FileNotFoundError, OSError):
                    sentinel.unlink(missing_ok=True)
                    continue

                raise FileLockError(
                    f"Could not acquire lock on {data_path} within {timeout}s"
                )
            time.sleep(0.05)

    try:
        yield data_path
    finally:
        try:
            sentinel.unlink(missing_ok=True)
        except Exception:
            pass


def safe_json_write_with_lock(file_path, data, timeout=10.0):
    """
    Thread-safe JSON write: sidecar lock + atomic temp-file rename.

    The lock protects against concurrent writers.
    The atomic rename protects against partial writes / corruption.
    """
    file_path = Path(file_path)

    with file_lock(file_path, timeout=timeout):
        temp_dir = file_path.parent
        temp_dir.mkdir(parents=True, exist_ok=True)

        with tempfile.NamedTemporaryFile(
            mode="w",
            dir=temp_dir,
            suffix=".tmp",
            prefix=f".{file_path.name}_",
            delete=False,
            encoding="utf-8",
        ) as tmp_file:
            json.dump(data, tmp_file, indent=2, ensure_ascii=False)
            tmp_file.flush()
            os.fsync(tmp_file.fileno())
            temp_path = Path(tmp_file.name)

        try:
            temp_path.replace(file_path)
        except Exception as e:
            try:
                temp_path.unlink()
            except Exception:
                pass
            raise e


def safe_json_read_with_lock(file_path, default=None, timeout=10.0):
    """
    Thread-safe JSON read with shared sidecar lock.
    """
    file_path = Path(file_path)

    try:
        with file_lock(file_path, timeout=timeout, exclusive=False):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except (FileNotFoundError, json.JSONDecodeError, PermissionError):
                return default
    except FileLockError:
        # Fallback: read without lock rather than crash
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, PermissionError):
            return default
