#!/usr/bin/env python3
"""
Atomic file operations utilities
Prevents corruption of JSON files during write operations
"""

import json
import tempfile
import os
from pathlib import Path


def atomic_json_write(file_path, data, indent=2, use_lock=True):
    """
    Write JSON data atomically with optional file locking

    Uses write-to-temp + rename + sidecar file locking for maximum safety
    """
    file_path = Path(file_path)

    if use_lock:
        from .file_lock import safe_json_write_with_lock
        safe_json_write_with_lock(file_path, data)
        return True

    # Fallback to basic atomic write without locking
    temp_dir = file_path.parent
    temp_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(
        mode='w',
        dir=temp_dir,
        suffix='.tmp',
        prefix=f'.{file_path.name}_',
        delete=False,
        encoding='utf-8'
    ) as tmp_file:
        json.dump(data, tmp_file, indent=indent, ensure_ascii=False)
        tmp_file.flush()
        os.fsync(tmp_file.fileno())
        temp_path = Path(tmp_file.name)

    try:
        temp_path.replace(file_path)
        return True
    except Exception as e:
        try:
            temp_path.unlink()
        except Exception:
            pass
        raise e


def safe_json_read(file_path, default=None, use_lock=True):
    """
    Safely read JSON with proper error handling and optional file locking
    """
    file_path = Path(file_path)

    if use_lock:
        from .file_lock import safe_json_read_with_lock
        return safe_json_read_with_lock(file_path, default=default)

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError, PermissionError) as e:
        if default is not None:
            return default
        else:
            raise e
