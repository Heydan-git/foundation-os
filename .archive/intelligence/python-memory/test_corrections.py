#!/usr/bin/env python3
"""
Test suite for Core Intelligence corrections.
Validates: file locking, regex usage, import hygiene, concurrency safety.

Run from foundation-os root:
    python3 -c "exec(open('.fos/memory/test_corrections.py').read())"
"""

import sys
import os
import importlib
import importlib.util
import types
import json
import tempfile
import threading
import time
import re
import ast
import inspect
from pathlib import Path

base = Path(__file__).resolve().parent

# Wire up fake package so relative imports work
pkg = types.ModuleType("_fos_memory")
pkg.__path__ = [str(base)]
pkg.__package__ = "_fos_memory"
sys.modules["_fos_memory"] = pkg


def load_mod(name):
    spec = importlib.util.spec_from_file_location(
        f"_fos_memory.{name}", str(base / f"{name}.py"), submodule_search_locations=[]
    )
    mod = importlib.util.module_from_spec(spec)
    mod.__package__ = "_fos_memory"
    sys.modules[f"_fos_memory.{name}"] = mod
    spec.loader.exec_module(mod)
    return mod


PASS = 0
FAIL = 0


def test(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  PASS: {name}")
    else:
        FAIL += 1
        print(f"  FAIL: {name} -- {detail}")


# Load all modules
config = load_mod("config")
regex = load_mod("regex_patterns")
fl = load_mod("file_lock")
au = load_mod("atomic_utils")
stm = load_mod("short_term_memory")
cp = load_mod("communication_protocol_v2")
ssd = load_mod("status_sync_detector")
bo = load_mod("batch_operations")
mcs = load_mod("master_communication_system")

# ===== TEST 1: Import hygiene =====
print("\n=== TEST 1: Import hygiene ===")
test("All 9 modules loaded", True)
test("__init__.py exists", (base / "__init__.py").exists())

# ===== TEST 2: Config creates dirs =====
print("\n=== TEST 2: Config ===")
test("FOS_ROOT resolved", config.FOS_ROOT.exists())
test("MEMORY_DIR exists", config.MEMORY_DIR.exists())
with tempfile.TemporaryDirectory() as tmpdir:
    td = Path(tmpdir) / "a" / "b"
    r = config._ensure_dir(td)
    test("_ensure_dir creates nested", td.exists())
    test("_ensure_dir returns path", r == td)

# ===== TEST 3: Sidecar locking =====
print("\n=== TEST 3: Sidecar file locking ===")
with tempfile.TemporaryDirectory() as tmpdir:
    df = Path(tmpdir) / "test.json"
    lf = fl._lock_path_for(df)
    test("Lock is sidecar", lf.name == "test.json.lock")
    test("Lock same dir", lf.parent == df.parent)

    with fl.file_lock(df) as result:
        test("Yields Path not filehandle", isinstance(result, Path))
        test("Yields data path", result == df)
        test("Sidecar created", lf.exists())

    test_data = {"key": "value", "num": 42}
    fl.safe_json_write_with_lock(df, test_data)
    test("Data written", df.exists())
    rb = fl.safe_json_read_with_lock(df)
    test("JSON roundtrip", rb == test_data, f"got {rb}")

    missing = Path(tmpdir) / "nope.json"
    test("Missing returns default", fl.safe_json_read_with_lock(missing, default={"d": 1}) == {"d": 1})

# ===== TEST 4: Concurrency =====
print("\n=== TEST 4: Concurrent write safety ===")
with tempfile.TemporaryDirectory() as tmpdir:
    cf = Path(tmpdir) / "concurrent.json"
    fl.safe_json_write_with_lock(cf, {"counter": 0})
    errors = []
    NT = 8
    WPT = 15
    barrier = threading.Barrier(NT)

    def writer(tid):
        try:
            barrier.wait(timeout=5)
            for i in range(WPT):
                d = fl.safe_json_read_with_lock(cf, default={"counter": 0})
                d["counter"] += 1
                d[f"t{tid}_w{i}"] = True
                fl.safe_json_write_with_lock(cf, d)
        except Exception as e:
            errors.append(f"T{tid}: {e}")

    threads = [threading.Thread(target=writer, args=(t,)) for t in range(NT)]
    for t in threads:
        t.start()
    for t in threads:
        t.join(timeout=30)

    test("No thread errors", len(errors) == 0, "; ".join(errors[:3]))
    final = fl.safe_json_read_with_lock(cf)
    test("Valid JSON after concurrent writes", final is not None)
    test("Has counter key", "counter" in (final or {}))

# ===== TEST 5: Regex pre-compiled =====
print("\n=== TEST 5: Pre-compiled regex ===")
for name, coll in [
    ("FILE_PATTERNS", regex.FILE_PATTERNS),
    ("SOURCE_PATTERNS", regex.SOURCE_PATTERNS),
    ("CHECKPOINT_PATTERNS", regex.CHECKPOINT_PATTERNS),
    ("INTENT_PATTERNS", regex.INTENT_PATTERNS),
]:
    test(f"{name} is dict", isinstance(coll, dict))
    first_val = next(iter(coll.values()))
    test(f"{name} values are compiled", isinstance(first_val, re.Pattern))

# ===== TEST 6: Modules use pre-compiled =====
print("\n=== TEST 6: Modules use pre-compiled patterns ===")
src = inspect.getsource(stm.FOSShortTermMemory.extract_files_mentioned)
test("STM uses FILE_PATTERNS", "FILE_PATTERNS" in src)
test("STM no inline re.compile", "re.compile" not in src)

src2 = inspect.getsource(cp.FOSCommunicationProtocol.identify_sources)
test("CommProto uses SOURCE_PATTERNS", "SOURCE_PATTERNS" in src2)
test("CommProto no inline re.findall", "re.findall" not in src2)

src3 = inspect.getsource(ssd.FOSCommunicationEnhancer.extract_status_info)
test("StatusSync uses STATUS_PATTERNS", "STATUS_PATTERNS" in src3)

# ===== TEST 7: Lazy singletons =====
print("\n=== TEST 7: Lazy singletons ===")
mem = stm.get_memory()
test("get_memory returns instance", isinstance(mem, stm.FOSShortTermMemory))
test("get_memory is singleton", stm.get_memory() is mem)

proto = cp.get_protocol()
test("get_protocol returns instance", isinstance(proto, cp.FOSCommunicationProtocol))
test("get_protocol is singleton", cp.get_protocol() is proto)

master = mcs.get_master_system()
test("get_master_system returns instance", isinstance(master, mcs.MasterCommunicationSystem))

# ===== TEST 8: No bare except =====
print("\n=== TEST 8: No bare except clauses ===")
bare = []
for f in base.glob("*.py"):
    if f.name == "test_corrections.py":
        continue
    try:
        tree = ast.parse(f.read_text())
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                bare.append(f"{f.name}:{node.lineno}")
    except SyntaxError as e:
        bare.append(f"{f.name}: SYNTAX ERROR {e}")
test("No bare except", len(bare) == 0, f"Found: {bare}")

# ===== TEST 9: End-to-end =====
print("\n=== TEST 9: End-to-end activation ===")
try:
    result = master.activate_system()
    test("System activates", result["system_active"])
    test("Returns file count", result["files_monitored"] >= 0)
    test("Returns contradiction count", "contradictions_found" in result)
except Exception as e:
    test("System activation", False, str(e))

# ===== SUMMARY =====
print(f"\n{'=' * 50}")
print(f"RESULTS: {PASS} passed, {FAIL} failed out of {PASS + FAIL} tests")
print(f"{'=' * 50}")

sys.exit(0 if FAIL == 0 else 1)
