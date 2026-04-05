# FOS Core Intelligence System - Repair Specification

**Target Version:** 1.1  
**Status:** SPECIFICATION (not yet implemented)  
**Estimated Effort:** 4-6 hours  
**Risk Level:** Low (isolated changes, no architectural restructuring)

---

## Repair Strategy Overview

**Decision Point:** Two options for fixing the import mode mismatch.

### Option A: Package Mode (Recommended)
- Convert `.fos/memory/` to a proper Python package
- All modules use relative imports (`from .config import`)
- Entry point uses package-style import (`from foundation_os.memory import activate`)
- **Pros:** Clean, Pythonic, professional structure
- **Cons:** Requires renaming directory (`memory/` → `foundation_os/`)
- **Implementation time:** 2-3 hours

### Option B: Absolute Mode (Faster)
- Keep `.fos/memory/` as-is
- Convert all relative imports to absolute imports
- Entry point uses `sys.path.append` + absolute imports
- **Pros:** Minimal structural changes, quick fix
- **Cons:** Less professional, not ideal for long-term
- **Implementation time:** 1-2 hours

**Recommendation:** **Option A (Package Mode)** — More professional, future-proof, and aligns with Python best practices.

---

## Option A: Package Mode (Complete Specification)

### Phase 1: Directory Restructuring

#### Step 1a: Create new package structure
```bash
cd /Users/kevinnoel/foundation-os/.fos

# Create foundation_os package directory
mkdir -p foundation_os/memory

# Move all Python files
cp -r memory/*.py foundation_os/memory/
cp -r memory/semantic foundation_os/memory/  # Copy ChromaDB

# Create __init__.py files
touch foundation_os/__init__.py
touch foundation_os/memory/__init__.py
```

#### Step 1b: Update __init__.py files

**File:** `/Users/kevinnoel/foundation-os/.fos/foundation_os/__init__.py`
```python
"""Foundation OS Core Intelligence Package"""

__version__ = "1.1"
__author__ = "Foundation OS Development"

from .memory import activate, validate, status, resync

__all__ = [
    "activate",
    "validate", 
    "status",
    "resync"
]
```

**File:** `/Users/kevinnoel/foundation-os/.fos/foundation_os/memory/__init__.py`
```python
"""Foundation OS Short-Term Memory & Communication System"""

from .master_communication_system import (
    get_master_system,
    activate,
    validate,
    status,
    resync,
    master_system
)

from .short_term_memory import (
    get_memory,
    update_conversation,
    add_contradiction,
    add_decision,
    track_file,
    set_action,
    get_context
)

__all__ = [
    # Master system
    "get_master_system",
    "activate",
    "validate",
    "status",
    "resync",
    "master_system",
    # Memory API
    "get_memory",
    "update_conversation",
    "add_contradiction",
    "add_decision",
    "track_file",
    "set_action",
    "get_context"
]
```

#### Step 1c: Verify no broken imports
```bash
cd /Users/kevinnoel/foundation-os/.fos

# Test package import
python3 -c "from foundation_os.memory import activate; print('✅ Package imports work')"

# Should print: ✅ Package imports work
```

---

### Phase 2: Module Import Updates

#### Step 2a: Update config.py
**Current:** All absolute, no changes needed ✅

#### Step 2b: Update short_term_memory.py

**Change from:**
```python
from .config import MEMORY_DIR, WORKING_MEMORY_FILE, CURRENT_SESSION_FILE
```

**Change to:**
```python
from .config import MEMORY_DIR, WORKING_MEMORY_FILE, CURRENT_SESSION_FILE
# ^^ Already correct for package mode ✅
```

✅ **No changes needed** — relative import is correct in package mode

#### Step 2c: Update master_communication_system.py

**Current line 12-18:**
```python
from .status_sync_detector import FOSCommunicationEnhancer
from .communication_protocol_v2 import (
    get_protocol,
    validate_communication,
    format_validation_for_user,
)
from .short_term_memory import get_memory, add_contradiction, get_context, update_conversation
```

✅ **No changes needed** — relative imports are correct in package mode

#### Step 2d: Update auto_activate_on_startup.py

**Current line 18-24:**
```python
try:
    from .config import FOS_ROOT
    current_dir = Path.cwd()

    if current_dir == FOS_ROOT or FOS_ROOT in current_dir.parents or current_dir in FOS_ROOT.parents:
        try:
            from .master_communication_system import get_master_system
```

✅ **No changes needed** — relative imports correct in package mode

#### Step 2e: Update other modules (use grep to find all)

```bash
cd /Users/kevinnoel/foundation-os/.fos/foundation_os/memory

# Check all relative imports
grep -n "^from \." *.py | head -20
```

**All relative imports are correct for package mode — no changes needed** ✅

---

### Phase 3: Entry Point Creation

#### Step 3a: Create activation entry point

**File:** `/Users/kevinnoel/foundation-os/activate_intelligence.py`
```python
#!/usr/bin/env python3
"""
Foundation OS Core Intelligence System - Activation Entry Point

Usage:
    python3 activate_intelligence.py          # Run in current directory
    python3 /path/to/activate_intelligence.py # From anywhere with FOS env var
    
Environment:
    FOS_ROOT (optional): Path to foundation-os directory
    If not set, automatically resolved from script location
"""

import sys
import os
from pathlib import Path

def main():
    """Activate Core Intelligence System"""
    
    # Resolve FOS_ROOT
    if "FOS_ROOT" not in os.environ:
        # Assume this script is in foundation-os/
        script_dir = Path(__file__).parent.resolve()
        os.environ["FOS_ROOT"] = str(script_dir)
    
    fos_root = Path(os.environ["FOS_ROOT"])
    fos_memory_pkg = fos_root / ".fos" / "foundation_os"
    
    if not fos_memory_pkg.exists():
        print(f"ERROR: Cannot find .fos/foundation_os at {fos_root}")
        print("Make sure you're in the foundation-os directory")
        sys.exit(1)
    
    # Add package to path
    sys.path.insert(0, str(fos_root / ".fos"))
    
    try:
        # Import and activate
        from foundation_os.memory import activate, get_context
        
        result = activate()
        
        print("\n" + "="*60)
        print("CORE INTELLIGENCE SYSTEM ACTIVATED")
        print("="*60)
        print(f"System active: {result['system_active']}")
        print(f"Files monitored: {result['files_monitored']}")
        print(f"Contradictions found: {result['contradictions_found']}")
        print(f"Communication guaranteed: {result['communication_guaranteed']}")
        print("="*60 + "\n")
        
        return 0
        
    except ImportError as e:
        print(f"ERROR: Import failed: {e}")
        print("\nDebugging info:")
        print(f"  FOS_ROOT: {fos_root}")
        print(f"  .fos/foundation_os exists: {fos_memory_pkg.exists()}")
        print(f"  sys.path[0]: {sys.path[0]}")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Activation failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    sys.exit(main())
```

#### Step 3b: Make script executable
```bash
chmod +x /Users/kevinnoel/foundation-os/activate_intelligence.py
```

---

### Phase 4: Claude Code Hook Integration

#### Step 4a: Register startup hook in ~/.claude/settings.json

**Current state:** No hooks registered

**Update required:**
```json
{
  "hooks": {
    "startup": {
      "commands": [
        {
          "command": "cd $FOS_ROOT && python3 activate_intelligence.py",
          "optional": true,
          "description": "Auto-activate Core Intelligence System"
        }
      ]
    }
  }
}
```

**Implementation:**
```bash
# Read current settings
cat ~/.claude/settings.json | jq . > /tmp/settings_backup.json

# Update with hook (use jq to preserve existing settings)
jq '.hooks.startup = {
  "commands": [
    {
      "command": "cd $FOS_ROOT && python3 activate_intelligence.py",
      "optional": true,
      "description": "Auto-activate Core Intelligence System"
    }
  ]
}' /tmp/settings_backup.json > ~/.claude/settings.json.tmp

# Validate JSON
python3 -c "import json; json.load(open('~/.claude/settings.json.tmp'))"

# Swap
mv ~/.claude/settings.json.tmp ~/.claude/settings.json
```

#### Step 4b: Verify hook registration
```bash
cd /Users/kevinnoel/foundation-os
# Hook should trigger automatically on next Claude Code session start
# Or manually: python3 activate_intelligence.py
```

---

### Phase 5: Acceptance Tests

#### Test 5a: Import all modules (MUST PASS)
```python
#!/usr/bin/env python3
import sys
import os
from pathlib import Path

# Setup
fos_root = Path("/Users/kevinnoel/foundation-os")
sys.path.insert(0, str(fos_root / ".fos"))
os.environ["FOS_ROOT"] = str(fos_root)

# Test 1: Direct imports
print("Test 1: Direct module imports...")
try:
    from foundation_os.memory import config
    from foundation_os.memory import regex_patterns
    from foundation_os.memory import file_lock
    from foundation_os.memory import atomic_utils
    from foundation_os.memory import short_term_memory
    from foundation_os.memory import communication_protocol_v2
    from foundation_os.memory import status_sync_detector
    from foundation_os.memory import master_communication_system
    print("  ✅ All modules import successfully")
except ImportError as e:
    print(f"  ❌ Import failed: {e}")
    sys.exit(1)

# Test 2: API functions
print("\nTest 2: API function availability...")
try:
    from foundation_os.memory import (
        activate,
        validate,
        status,
        get_memory,
        update_conversation,
        add_contradiction
    )
    print("  ✅ All API functions available")
except ImportError as e:
    print(f"  ❌ API import failed: {e}")
    sys.exit(1)

# Test 3: Config resolution
print("\nTest 3: Config resolution...")
try:
    from foundation_os.memory.config import FOS_ROOT, MEMORY_DIR
    assert FOS_ROOT == fos_root
    print(f"  ✅ FOS_ROOT: {FOS_ROOT}")
    print(f"  ✅ MEMORY_DIR: {MEMORY_DIR}")
except AssertionError:
    print(f"  ❌ FOS_ROOT mismatch")
    sys.exit(1)

print("\n✅ All acceptance tests PASSED")
```

**Run it:**
```bash
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
# ... test code above ...
EOF
```

#### Test 5b: Activation flow (MUST PASS)
```bash
cd /Users/kevinnoel/foundation-os
python3 activate_intelligence.py

# Expected output:
# ============================================================
# CORE INTELLIGENCE SYSTEM ACTIVATED
# ============================================================
# System active: True
# Files monitored: [count]
# Contradictions found: [count]
# Communication guaranteed: [bool]
# ============================================================
```

#### Test 5c: Memory persistence (MUST PASS)
```python
#!/usr/bin/env python3
import sys
from pathlib import Path
import json

fos_root = Path("/Users/kevinnoel/foundation-os")
sys.path.insert(0, str(fos_root / ".fos"))

from foundation_os.memory import get_memory, update_conversation, add_contradiction

# Test memory write
memory = get_memory()
update_conversation("Test query", "Test response", "test_action")
add_contradiction({"type": "test", "item": "test_item", "severity": "low"})
memory.flush()

# Verify files exist and contain data
working_memory_file = fos_root / ".fos" / "memory" / "working_memory.json"
assert working_memory_file.exists(), "working_memory.json not created"

with open(working_memory_file) as f:
    data = json.load(f)
    assert len(data["conversation_context"]["progress"]) > 0
    assert len(data["active_contradictions"]) > 0

print("✅ Memory persistence test PASSED")
```

---

## Option B: Absolute Mode (Quick Fix Specification)

If speed is critical and directory restructuring is not acceptable:

### Changes Required

#### Step 1: Convert all relative imports to absolute
```bash
cd /Users/kevinnoel/foundation-os/.fos/memory

# Find all relative imports
grep -n "^from \." *.py

# For each file, replace:
# OLD: from .config import ...
# NEW: from memory.config import ...
```

#### Step 2: Update config paths
All modules that reference MEMORY_DIR need adjustment:
```python
# OLD
from .config import MEMORY_DIR

# NEW
from memory.config import MEMORY_DIR
```

#### Step 3: Update entry point
```python
import sys
sys.path.append('/Users/kevinnoel/foundation-os/.fos')

from memory.master_communication_system import activate
result = activate()
```

**Advantage:** 15 minutes of edits  
**Disadvantage:** Less professional structure, harder to scale

---

## Validation Criteria

### Success Definition

| Criterion | Pass Condition |
|-----------|----------------|
| **Imports** | All 14 modules import without ImportError |
| **Activation** | `activate()` returns dict with `system_active: true` |
| **Memory** | `working_memory.json` writes and reads correctly |
| **API** | All 8 convenience functions available and callable |
| **Performance** | Activation completes in < 2 seconds |
| **Claude integration** | Hook triggers on Claude Code startup |

### Test Commands (Comprehensive)

```bash
# 1. Import test
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
import sys
from pathlib import Path
fos_root = Path.cwd()
sys.path.insert(0, str(fos_root / ".fos"))
from foundation_os.memory import activate, validate, status
print("✅ All imports successful")
EOF

# 2. Activation test
python3 activate_intelligence.py

# 3. API test
python3 << 'EOF'
import sys
from pathlib import Path
fos_root = Path.cwd()
sys.path.insert(0, str(fos_root / ".fos"))
from foundation_os.memory import get_memory, update_conversation
m = get_memory()
update_conversation("Test", "Response")
assert len(m.working_memory["conversation_context"]["progress"]) > 0
print("✅ API functional")
EOF

# 4. Hook test
# Restart Claude Code and verify system auto-activates
```

---

## Rollback Plan

If repair fails at any stage:

```bash
# Restore original directory structure
cd /Users/kevinnoel/foundation-os/.fos

# If in the middle of Option A:
rm -rf foundation_os/  # Remove new structure
# memory/ directory still exists with original code

# Option B has no rollback needed (only text changes)
```

---

## Estimated Timeline

| Phase | Duration | Critical |
|-------|----------|----------|
| Phase 1: Directory restructuring | 1 hour | Yes |
| Phase 2: Import verification | 30 min | Yes |
| Phase 3: Entry point creation | 1 hour | Yes |
| Phase 4: Hook integration | 30 min | No |
| Phase 5: Acceptance testing | 1.5 hours | Yes |
| **Total** | **4.5 hours** | |

---

## Dependencies & Prerequisites

- Python 3.8+ (verify: `python3 --version`)
- Write access to `~/.claude/settings.json`
- ChromaDB already installed in semantic memory
- No external dependencies needed

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Import still fails | Low | High | Test each module individually before committing |
| Hook doesn't trigger | Low | Medium | Verify settings.json JSON validity before swap |
| Memory file corruption | Very low | Medium | Backup before modifications; use atomic writes |
| Path resolution issues | Low | Medium | Test FOS_ROOT env var resolution thoroughly |

---

*This specification is detailed enough for a single developer to execute without ambiguity. All steps are testable and can be rolled back independently.*
