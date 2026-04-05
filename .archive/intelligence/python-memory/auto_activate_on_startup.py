#!/usr/bin/env python3
"""
Auto-activation Communication System
Activates automatically at Claude Code startup.

ZERO import-time side effects.
"""

import sys
import os
from pathlib import Path


def auto_activate():
    """Auto-activate communication system if in Foundation OS directory"""

    try:
        from .config import FOS_ROOT
        current_dir = Path.cwd()

        if current_dir == FOS_ROOT or FOS_ROOT in current_dir.parents or current_dir in FOS_ROOT.parents:
            try:
                from .master_communication_system import get_master_system
                system = get_master_system()
                result = system.activate_system()
                return True
            except Exception:
                return False

        return False

    except Exception:
        return False


if __name__ == "__main__":
    auto_activate()
