#!/usr/bin/env python3
"""
Foundation OS Core Intelligence - Configuration centralisee
Remplace tous les hardcoded paths par resolution dynamique

ZERO import-time side effects:
- No print() at import
- No crash if directories missing (creates them lazily)
- Lazy root resolution cached after first call
"""

import os
from pathlib import Path
from functools import lru_cache


@lru_cache(maxsize=1)
def get_fos_root() -> Path:
    """
    Resolves the Foundation OS root directory dynamically.

    Priority:
    1. FOS_ROOT environment variable
    2. Relative resolution from this file (.fos/memory/ -> foundation-os/)
    3. Filesystem scan upward from cwd
    """

    # Option 1: Environment variable
    if "FOS_ROOT" in os.environ:
        fos_root = Path(os.environ["FOS_ROOT"]).resolve()
        if (fos_root / ".fos" / "memory").exists():
            return fos_root
        else:
            raise RuntimeError(
                f"FOS_ROOT env var points to invalid directory: {fos_root}"
            )

    # Option 2: Relative resolution from this file
    # This file is at: foundation-os/.fos/memory/config.py
    # So: config.py -> memory/ -> .fos/ -> foundation-os/
    current_file = Path(__file__).resolve()
    fos_root = current_file.parent.parent.parent

    required_markers = [
        ".fos/memory",
        "CLAUDE.md",
    ]

    if all((fos_root / marker).exists() for marker in required_markers):
        return fos_root

    # Option 3: Scan filesystem upward from cwd
    current_dir = Path.cwd()
    for parent in [current_dir] + list(current_dir.parents):
        if all((parent / marker).exists() for marker in required_markers):
            return parent

    raise RuntimeError(
        f"Cannot locate Foundation OS root directory.\n"
        f"Tried: FOS_ROOT env var, relative from {current_file}, cwd scan.\n"
        f"Solution: export FOS_ROOT=/path/to/foundation-os"
    )


def _ensure_dir(path: Path) -> Path:
    """Create directory if it does not exist. Returns the path."""
    path.mkdir(parents=True, exist_ok=True)
    return path


# --- Derived paths (computed lazily via module-level access) ---

FOS_ROOT = get_fos_root()
MEMORY_DIR = _ensure_dir(FOS_ROOT / ".fos" / "memory")
CHECKPOINTS_DIR = FOS_ROOT / ".fos" / "checkpoints"
TRANSCRIPTS_DIR = FOS_ROOT / ".fos" / "transcripts"
SEMANTIC_DIR = MEMORY_DIR / "semantic"

# Data files
WORKING_MEMORY_FILE = MEMORY_DIR / "working_memory.json"
ENHANCED_CONTEXT_FILE = MEMORY_DIR / "enhanced_context.json"
COMMUNICATION_LOG_FILE = MEMORY_DIR / "communication_log.json"
CURRENT_SESSION_FILE = MEMORY_DIR / "current_session.json"
CONTRADICTION_DETECTOR_FILE = MEMORY_DIR / "contradiction_detector.json"
