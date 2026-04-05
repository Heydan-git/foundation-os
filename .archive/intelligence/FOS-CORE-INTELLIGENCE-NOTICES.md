# FOS Core Intelligence System - User Guide & Maintenance

**Version:** 1.0 (Pre-repair state)  
**Status:** FUNCTIONAL BUT NOT AUTO-ACTIVATING  
**Last Updated:** 2026-04-05

---

## What Is Available NOW (Without Repair)

The Core Intelligence System has **working subsystems** you can use immediately:

### Working: Config Module
**Use case:** Resolve FOS paths dynamically

```bash
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
import sys
sys.path.append('.fos/memory')
from config import FOS_ROOT, MEMORY_DIR

print(f"Foundation OS Root: {FOS_ROOT}")
print(f"Memory Directory: {MEMORY_DIR}")
EOF
```

**Output:**
```
Foundation OS Root: /Users/kevinnoel/foundation-os
Memory Directory: /Users/kevinnoel/foundation-os/.fos/memory
```

### Working: Contradiction Detection (Status Sync Detector)
**Use case:** Scan FOS-*.md files for contradictions

```bash
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
import sys
sys.path.append('.fos/memory')
from status_sync_detector import FOSCommunicationEnhancer

enhancer = FOSCommunicationEnhancer()
report, context = enhancer.run_full_analysis()

print(f"Files scanned: {report['total_files_scanned']}")
print(f"Contradictions found: {report['contradictions_found']}")
if report['contradiction_details']:
    for i, contradiction in enumerate(report['contradiction_details'][:3], 1):
        print(f"\n{i}. {contradiction}")
EOF
```

**Expected output:**
```
Files scanned: 47
Contradictions found: [number]
[Contradiction details...]
```

### Working: Semantic Memory (ChromaDB)
**Use case:** Vector-based storage and retrieval (lazy load)

```bash
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
import sys
sys.path.append('.fos/memory')

# The semantic memory is available but not auto-populated yet
# Location: /Users/kevinnoel/foundation-os/.fos/memory/semantic/

import os
semantic_dir = "/Users/kevinnoel/foundation-os/.fos/memory/semantic"
if os.path.exists(semantic_dir):
    size_mb = sum(
        os.path.getsize(os.path.join(dirpath, filename))
        for dirpath, dirnames, filenames in os.walk(semantic_dir)
        for filename in filenames
    ) / 1024 / 1024
    print(f"✅ Semantic memory ready: {size_mb:.1f} MB")
else:
    print("⏳ Semantic memory not yet initialized")
EOF
```

### Working: Regex Pattern Matching
**Use case:** Extract patterns from text

```bash
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
import sys
sys.path.append('.fos/memory')
from regex_patterns import FILE_PATTERNS

# Pre-compiled patterns available
print(f"Available patterns: {len(FILE_PATTERNS)}")
for category, pattern in list(FILE_PATTERNS.items())[:3]:
    print(f"  - {category}")
EOF
```

**Output:**
```
Available patterns: 10
  - fos_files
  - import_statements
  - [more...]
```

### NOT Working (Blocked by Import Issue)
```python
# ❌ These will fail with ImportError:
from short_term_memory import FOSShortTermMemory
from master_communication_system import activate
from master_communication_system import validate
```

---

## Workaround: Manual Contradiction Scanning

Until the system is fully repaired, you can manually scan for contradictions:

```bash
cd /Users/kevinnoel/foundation-os

# Find all FOS-*.md files and manually scan them
grep -l "deprecated\|FIXME\|TODO\|inconsistent\|broken" FOS-*.md

# Search for specific contradiction patterns
grep -n "was\|is now\|should be" FOS-*.md | head -20

# Compare multiple docs for conflicts
grep -h "status.*complete\|status.*incomplete" FOS-*.md | sort | uniq
```

---

## Workaround: Memory File Direct Access

Until the memory API is available, you can read the memory files directly:

```bash
cd /Users/kevinnoel/foundation-os

# Check working memory
cat .fos/memory/working_memory.json | python3 -m json.tool | head -50

# Check session state
cat .fos/memory/current_session.json | python3 -m json.tool

# Check contradiction log
cat .fos/memory/contradiction_detector.json | python3 -m json.tool
```

---

## Temporary Workaround: Manual Activation Script

Create this temporary script to work around the import issue:

**File:** `/Users/kevinnoel/foundation-os/manual_activate.py`

```python
#!/usr/bin/env python3
"""
Temporary workaround for import issue - activates what we can
Remove this file after Phase 1 repairs are complete
"""

import sys
import os
import json
from pathlib import Path

def activate_workaround():
    """Activate available subsystems"""
    
    fos_root = Path(__file__).parent
    os.environ["FOS_ROOT"] = str(fos_root)
    sys.path.append(str(fos_root / ".fos" / "memory"))
    
    print("="*60)
    print("CORE INTELLIGENCE - PARTIAL ACTIVATION (Workaround)")
    print("="*60)
    
    # 1. Load config
    try:
        from config import FOS_ROOT, MEMORY_DIR
        print(f"\n✅ Config loaded")
        print(f"   FOS_ROOT: {FOS_ROOT}")
    except ImportError as e:
        print(f"\n❌ Config failed: {e}")
        return False
    
    # 2. Run contradiction detection
    try:
        from status_sync_detector import FOSCommunicationEnhancer
        enhancer = FOSCommunicationEnhancer()
        report, context = enhancer.run_full_analysis()
        print(f"\n✅ Contradiction detection ran")
        print(f"   Files scanned: {report['total_files_scanned']}")
        print(f"   Contradictions found: {report['contradictions_found']}")
    except Exception as e:
        print(f"\n⚠️  Contradiction detection failed: {e}")
    
    # 3. Check semantic memory
    semantic_dir = MEMORY_DIR / "semantic"
    if semantic_dir.exists():
        print(f"\n✅ Semantic memory available")
        print(f"   Path: {semantic_dir}")
    else:
        print(f"\n⏳ Semantic memory not initialized")
    
    # 4. Check checkpoints
    checkpoints_dir = FOS_ROOT / ".fos" / "checkpoints"
    if checkpoints_dir.exists():
        checkpoints = list(checkpoints_dir.glob("*.json"))
        print(f"\n✅ Anti-compactage system")
        print(f"   Checkpoints available: {len(checkpoints)}")
    
    print("\n" + "="*60)
    print("⚠️  PARTIAL ACTIVATION - Full system requires Phase 1 repairs")
    print("="*60)
    print("\nNext steps:")
    print("  1. See FOS-CORE-INTELLIGENCE-REPAIR.md for fixes")
    print("  2. Run: python3 activate_intelligence.py (after repairs)")
    print("="*60 + "\n")
    
    return True

if __name__ == "__main__":
    activate_workaround()
```

**Run it:**
```bash
cd /Users/kevinnoel/foundation-os
python3 manual_activate.py
```

---

## Maintenance: Backup & Restore

### Backup Memory Files
```bash
cd /Users/kevinnoel/foundation-os

# Create backup directory
mkdir -p .fos/memory_backups/backup_$(date +%Y%m%d_%H%M%S)

# Copy all memory files
cp -r .fos/memory/*.json .fos/memory_backups/backup_$(date +%Y%m%d_%H%M%S)/
cp -r .fos/memory/semantic .fos/memory_backups/backup_$(date +%Y%m%d_%H%M%S)/

# Verify backup
ls -lah .fos/memory_backups/backup_*/
```

### Restore from Backup
```bash
cd /Users/kevinnoel/foundation-os

# List available backups
ls -d .fos/memory_backups/backup_*

# Restore from specific backup
BACKUP_DIR=".fos/memory_backups/backup_20260405_120000"
cp $BACKUP_DIR/*.json .fos/memory/
cp -r $BACKUP_DIR/semantic .fos/memory/

# Verify restoration
cat .fos/memory/working_memory.json | python3 -m json.tool | head -10
```

---

## Debugging: Troubleshooting Guide

### Problem: ImportError on module import

**Symptom:**
```
ImportError: attempted relative import with no known parent package
```

**Cause:** Using standalone import mode (`sys.path.append`) with package-style imports

**Workaround:** Use the workaround script above until Phase 1 repairs are complete

**Permanent fix:** See FOS-CORE-INTELLIGENCE-REPAIR.md

### Problem: working_memory.json not updating

**Symptom:**
```
$ ls -la .fos/memory/working_memory.json
-rw-r--r--  1 user  staff  1024 2026-04-04 10:00
# (timestamp is old)
```

**Cause:** Memory class not instantiated due to import error

**Workaround:** Manually update JSON file:
```bash
python3 << 'EOF'
import json
from datetime import datetime
from pathlib import Path

memory_file = Path(".fos/memory/working_memory.json")
data = json.load(open(memory_file))

# Update timestamp
data["last_updated"] = datetime.now().isoformat()

# Write back
with open(memory_file, 'w') as f:
    json.dump(data, f, indent=2)

print("✅ Memory file updated")
EOF
```

### Problem: Checkpoints not being created

**Symptom:**
```
$ ls -la .fos/checkpoints/
# (empty or missing)
```

**Cause:** Anti-compactage system not activated (depends on broken imports)

**Workaround:** Manually create checkpoint:
```bash
cd /Users/kevinnoel/foundation-os

# Create checkpoints directory
mkdir -p .fos/checkpoints

# Create manual checkpoint
CHECKPOINT_NAME="checkpoint_manual_$(date +%Y%m%d_%H%M%S).json"
cp .fos/memory/working_memory.json .fos/checkpoints/$CHECKPOINT_NAME

echo "✅ Manual checkpoint created: $CHECKPOINT_NAME"
```

### Problem: Semantic memory not responding

**Symptom:**
```
ChromaDB query fails or returns empty
```

**Cause:** May not be initialized yet (lazy load)

**Workaround:** Initialize manually:
```bash
cd /Users/kevinnoel/foundation-os

# Check if semantic directory exists
ls -la .fos/memory/semantic/ || echo "Not initialized"

# Manual initialization (requires full system activation)
# See FOS-CORE-INTELLIGENCE-REPAIR.md
```

---

## Performance Optimization (Interim)

While waiting for Phase 2 optimizations, you can manually optimize:

### Clear Old Memory Entries
```bash
python3 << 'EOF'
import json
from pathlib import Path

memory_file = Path(".fos/memory/working_memory.json")
data = json.load(open(memory_file))

# Keep only last 20 interactions (vs 20 stored)
data["conversation_context"]["progress"] = data["conversation_context"]["progress"][-20:]
data["active_contradictions"] = data["active_contradictions"][-10:]
data["recent_decisions"] = data["recent_decisions"][-10:]

# Write back
with open(memory_file, 'w') as f:
    json.dump(data, f, indent=2)

print("✅ Memory compacted")
EOF
```

### Archive Old Checkpoints
```bash
cd /Users/kevinnoel/foundation-os

# Archive checkpoints older than 30 days
find .fos/checkpoints -name "*.json" -mtime +30 -exec mkdir -p .fos/checkpoints/.archive \; -exec mv {} .fos/checkpoints/.archive/ \;

echo "✅ Old checkpoints archived"
```

---

## Timeline to Full System

| Phase | Status | When | What You Get |
|-------|--------|------|--------------|
| **Current** | 🔧 Partial | Now | Workarounds above, config works |
| **Phase 1** | 🛠️ Planned | Week 1-2 | Full auto-activation, hooks |
| **Phase 2** | 📋 Planned | Week 3-4 | 50x faster, thread-safe |
| **Phase 3** | 🎯 Planned | Week 5-8 | Semantic intelligence |

---

## File Cleanup & Maintenance

### Safe to Delete
- `.fos/checkpoints/.archive/` — archived old checkpoints
- Backup directories older than 90 days: `.fos/memory_backups/backup_YYYYMM*`

### Never Delete
- `.fos/memory/working_memory.json` — session state
- `.fos/memory/semantic/` — vector database
- `.fos/memory/contradiction_detector.json` — tracked issues

### Optional Cleanup
```bash
# Remove files older than 180 days
find .fos/memory_backups -name "*.json" -mtime +180 -delete

# Archive old communication logs (keep recent)
find .fos/memory -name "communication_log*.json" -mtime +30 -exec gzip {} \;
```

---

## FAQ & Common Questions

**Q: Why isn't the system auto-activating?**  
A: Import mode mismatch blocks entry points. See FOS-CORE-INTELLIGENCE-REPAIR.md for Phase 1 fix.

**Q: Can I use the system now?**  
A: Partially. Config, contradiction detection, and semantic storage work. Full API blocked by imports.

**Q: How long until it's fixed?**  
A: Phase 1 takes 4-6 hours. Timeline in FOS-CORE-INTELLIGENCE-ROADMAP.md.

**Q: Will repairs break my existing data?**  
A: No. Repairs are code-only. All JSON files and checkpoints preserved.

**Q: Can I test Phase 1 fixes myself?**  
A: Yes. Use commands in FOS-CORE-INTELLIGENCE-REPAIR.md "Acceptance Tests" section.

**Q: What if Phase 1 fails?**  
A: Rollback is simple (revert directory changes). See rollback section in repair doc.

---

## Support & Escalation

### Debug Information to Collect
If you encounter issues:
```bash
# Collect debug info
python3 << 'EOF'
import sys
from pathlib import Path

print("Debug Information:")
print(f"  Python version: {sys.version}")
print(f"  Working directory: {Path.cwd()}")
print(f"  FOS_ROOT env: {os.environ.get('FOS_ROOT', 'NOT SET')}")

# Check file structure
fos = Path.cwd()
print(f"\n  .fos/memory exists: {(fos / '.fos' / 'memory').exists()}")
print(f"  Config loadable: ", end="")
try:
    sys.path.append(str(fos / '.fos' / 'memory'))
    import config
    print("YES")
except:
    print("NO")
EOF
```

### Report Issues to
- **Import problems:** See FOS-CORE-INTELLIGENCE-REPAIR.md
- **Data corruption:** Restore from backup (see section above)
- **Performance:** See FOS-CORE-INTELLIGENCE-ROADMAP.md Phase 2

---

## Contact & Timeline

- **Current date:** 2026-04-05
- **Phase 1 target:** Week of 2026-04-05 (4-6 hours)
- **Full system ready:** Week of 2026-04-19 (all phases)
- **Status document:** See FOS-CORE-INTELLIGENCE-STATE.md
- **Repair instructions:** See FOS-CORE-INTELLIGENCE-REPAIR.md
- **Roadmap:** See FOS-CORE-INTELLIGENCE-ROADMAP.md

---

*This guide provides workarounds for current limitations and clear upgrade paths. Use the workaround script immediately; it will be replaced by the real system after Phase 1.*
