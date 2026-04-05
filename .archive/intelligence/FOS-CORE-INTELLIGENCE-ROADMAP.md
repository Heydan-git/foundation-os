# FOS Core Intelligence System - Implementation Roadmap

**Version:** 1.0 → 2.0  
**Timeline:** 3 phases across 2-3 months  
**Release Cadence:** Phase 1 (critical fixes), Phase 2 (optimizations), Phase 3 (enhancements)

---

## Phase 1: Critical Fixes (Weeks 1-2)

**Goal:** Make system functional and auto-activating  
**Effort:** 4-6 hours  
**Success Metric:** `activate()` works without errors, hooks trigger automatically

### Phase 1.1: Fix Import Mode Mismatch

**Deliverable:** Package restructuring OR absolute import conversion

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Restructure to package mode** | 1a. Create `.fos/foundation_os/` dir<br>2b. Move all .py files<br>3c. Create __init__.py files | All modules import via `from foundation_os.memory import` | 2-3h |
| **OR: Convert to absolute imports** | 1. Find all relative imports<br>2. Update to absolute paths<br>3. Verify no duplicate paths | `from memory.config import` works everywhere | 1-1.5h |
| **Test imports** | 1. Test each module individually<br>2. Test entire API surface<br>3. Run test suite | All 8 convenience functions callable | 1h |

**Test Command:**
```bash
cd /Users/kevinnoel/foundation-os
python3 << 'EOF'
import sys
from pathlib import Path
fos = Path.cwd()
sys.path.insert(0, str(fos / ".fos"))
from foundation_os.memory import activate, validate, status, get_memory
print("✅ Phase 1.1 PASSED: All imports work")
EOF
```

### Phase 1.2: Create Activation Entry Point

**Deliverable:** `/Users/kevinnoel/foundation-os/activate_intelligence.py`

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Write entry point script** | 1. Handle FOS_ROOT resolution<br>2. Add sys.path manipulation<br>3. Call activate() and report status | Script runs without ImportError | 1h |
| **Make executable** | 1. `chmod +x activate_intelligence.py`<br>2. Test from any directory | Works from any cwd with FOS_ROOT env var | 15min |
| **Documentation** | 1. Add usage examples<br>2. Document environment vars<br>3. Add error messages | Clear instructions for users | 30min |

**Test Command:**
```bash
cd /Users/kevinnoel/foundation-os
python3 activate_intelligence.py
# Expected: System activation confirmation + stats
```

### Phase 1.3: Claude Code Hook Integration

**Deliverable:** Updated `~/.claude/settings.json` with startup hooks

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Register hooks** | 1. Add startup section to settings.json<br>2. Point to activate_intelligence.py<br>3. Test JSON validity | Hook registered; no JSON syntax errors | 30min |
| **Test auto-activation** | 1. Restart Claude Code session<br>2. Verify system activates<br>3. Check memory files updated | working_memory.json has new interaction | 30min |

**Verification:**
```bash
# After restart, verify hook triggered:
ls -la /Users/kevinnoel/foundation-os/.fos/memory/working_memory.json
# Check: last modified timestamp = now
```

### Phase 1 Success Criteria

**All must pass:**
```
✅ python3 activate_intelligence.py runs without errors
✅ activate() returns system_active: true
✅ working_memory.json updated automatically
✅ Claude Code hook triggers on startup
✅ No ImportError in any module
```

---

## Phase 2: Optimizations (Weeks 3-4)

**Goal:** Performance, reliability, thread safety  
**Effort:** 8-12 hours  
**Success Metric:** System handles 100+ file scans/sec, thread-safe writes

### Phase 2.1: Thread Safety & Concurrency

**Deliverable:** Thread-safe memory access + concurrent file operations

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Add locking to memory class** | 1. Use threading.RLock for memory state<br>2. Wrap all read/write operations<br>3. Test deadlock scenarios | Multiple threads can access memory safely | 2h |
| **Batch operation queue** | 1. Implement operation queue in batch_operations.py<br>2. Atomic commit of batches<br>3. Rollback on failure | Batch writes 50x faster than individual writes | 2h |
| **File lock improvements** | 1. Add timeout to file locks<br>2. Detect stale locks<br>3. Auto-cleanup on timeout | Stale locks auto-released after 30s | 1.5h |

**Test:**
```python
import concurrent.futures
# Verify 10 concurrent writers complete without corruption
memory = get_memory()
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    futures = [
        ex.submit(update_conversation, f"Query {i}", f"Response {i}")
        for i in range(100)
    ]
    concurrent.futures.wait(futures)
# Verify no exceptions + memory file valid
```

### Phase 2.2: Performance Profiling & Optimization

**Deliverable:** <100ms activation time, <20ms per scan

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Profile activation flow** | 1. Time each step<br>2. Identify bottlenecks<br>3. Optimize hot paths | Activation < 500ms (was unlimited) | 2h |
| **Lazy load non-critical modules** | 1. Defer ChromaDB load until needed<br>2. Defer semantic_memory_setup<br>3. Lazy-load communication protocol | Startup time < 100ms | 2h |
| **Cache compilation results** | 1. Pre-compile all regex patterns ✅ (already done)<br>2. Cache protocol validation rules<br>3. Memoize path resolution | Regex matching 10x faster via cache | 1.5h |

**Benchmark:**
```bash
time python3 activate_intelligence.py
# Target: < 500ms total
# Breakdown: config load < 10ms, protocol < 20ms, scan < 50ms, total < 100ms
```

### Phase 2.3: Error Handling & Resilience

**Deliverable:** Graceful degradation, detailed error messages

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Add error context** | 1. Stack traces with line numbers<br>2. Suggest fixes for common errors<br>3. Log to error file | Users can debug their own issues | 1.5h |
| **Fallback strategies** | 1. If ChromaDB unavailable: use file-based<br>2. If lock fails: retry with backoff<br>3. If scan incomplete: use cached results | System continues functioning at degraded level | 2h |
| **Health check** | 1. Implement health() function<br>2. Detect corrupted state<br>3. Auto-recover or alert | System self-heals or alerts clearly | 1.5h |

**Test:**
```python
from foundation_os.memory import health_check
status = health_check()
assert status["healthy"] or status["recoverable"]
```

### Phase 2 Success Criteria

**All must pass:**
```
✅ 10 concurrent threads write safely (no corruption)
✅ Batch operations 50x faster than individual
✅ Activation time < 500ms
✅ File lock timeout works correctly
✅ Error messages are actionable
✅ System continues at degraded performance if subsystems fail
```

---

## Phase 3: Enhancements (Weeks 5-8)

**Goal:** Advanced intelligence, better context understanding  
**Effort:** 20+ hours  
**Success Metric:** Semantic understanding of contradictions, smart context prioritization

### Phase 3.1: Advanced Semantic Memory

**Deliverable:** Multi-index search, semantic similarity, context clustering

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Semantic similarity search** | 1. Embed all FOS-*.md files<br>2. Query by semantic meaning<br>3. Find related contradictions | `query("memory issue")` finds related contradictions | 3h |
| **Context clustering** | 1. Group related contradictions<br>2. Identify patterns<br>3. Suggest root causes | System suggests "these 5 contradictions are related" | 3h |
| **Temporal analysis** | 1. Track contradiction timeline<br>2. Detect regression cycles<br>3. Predict future issues | System warns "this type of issue occurs every 3 sessions" | 2h |

### Phase 3.2: Intelligent Context Injection

**Deliverable:** Smart context prioritization for Claude

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Context ranking** | 1. Score context by relevance<br>2. Rank by recency + frequency<br>3. Select top-K for injection | Top-3 contradictions always correct | 2h |
| **Format optimization** | 1. Compress context for token efficiency<br>2. Highlight critical items<br>3. Hide less relevant details | Context injection < 500 tokens | 2h |
| **Query optimization** | 1. Rewrite ambiguous queries<br>2. Add missing context<br>3. Fix incomplete requests | `validate()` pre-processes queries | 2h |

### Phase 3.3: Self-Learning System

**Deliverable:** System improves over time based on feedback

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Feedback loop** | 1. Track which contradictions were resolved<br>2. Learn from resolutions<br>3. Avoid similar future contradictions | System catches 80% of issues before validation | 3h |
| **Configuration learning** | 1. User preferences tracked<br>2. Adapt response format<br>3. Personalize context depth | System adapts to user's communication style | 2h |
| **Metric tracking** | 1. Track validation accuracy over time<br>2. Measure false positive rate<br>3. Alert if accuracy drops | Dashboard shows system health metrics | 2h |

### Phase 3.4: Integration Expansion

**Deliverable:** Connect to more data sources

| Task | Subtasks | Acceptance Criteria | Effort |
|------|----------|-------------------|--------|
| **Git history scanning** | 1. Parse commit messages<br>2. Extract decision reasoning<br>3. Correlate with contradictions | Contradictions linked to decision history | 3h |
| **Claude Code hook expansion** | 1. Integrate with file watcher<br>2. Real-time contradiction detection<br>3. Proactive alerts | System alerts before contradiction causes issue | 2h |
| **Multi-source validation** | 1. Cross-check against codebase<br>2. Validate against commit history<br>3. Compare with documentation changes | Validation accuracy improved 30% | 2h |

### Phase 3 Success Criteria

**All must pass:**
```
✅ Semantic search finds related contradictions
✅ Context clustering identifies patterns
✅ Smart context injection reduces token usage 40%
✅ System accuracy improves with each resolution
✅ Git integration provides decision context
✅ Real-time detection triggers before problems
✅ Multi-source validation improves accuracy
```

---

## Milestone Gates & Decision Points

### Gate 1: After Phase 1 (EOW 2)
**Decision:** Proceed to Phase 2?
- **Go:** If Phase 1.3 hooks work and system activates automatically
- **No-go:** If importerrors persist or hooks don't trigger
- **Action on no-go:** Fix issues before moving forward (blocking)

### Gate 2: After Phase 2 (EOW 4)
**Decision:** Proceed to Phase 3?
- **Go:** If all optimization tests pass + 50x batch speedup achieved
- **No-go:** If performance doesn't meet targets
- **Action on no-go:** Refactor bottleneck + retest

### Gate 3: After Phase 3 (EOW 8)
**Decision:** Production release?
- **Go:** If all enhancement tests pass + no regressions
- **Release:** v2.0 with full semantic intelligence
- **Maintain:** Bug fixes in v1.x branch if issues arise

---

## Testing Strategy by Phase

### Phase 1: Functional Testing
```
Import tests (unit)
  ↓
Activation tests (integration)
  ↓
Hook tests (system)
  ↓
Manual verification (smoke test)
```

### Phase 2: Performance Testing
```
Benchmark baseline
  ↓
Concurrency tests (10+ threads)
  ↓
Stress tests (1000s of files)
  ↓
Profile & optimize
  ↓
Regression tests (Phase 1 still works)
```

### Phase 3: Intelligence Testing
```
Semantic search validation
  ↓
Clustering correctness (manual review)
  ↓
Learning feedback loop (long-running)
  ↓
Integration smoke tests
  ↓
End-to-end system test
```

---

## Resource Allocation

| Phase | Dev | QA | Docs | Total |
|-------|-----|-----|------|-------|
| Phase 1 | 4-6h | 1h | 1h | 6-8h |
| Phase 2 | 8-12h | 2h | 1h | 11-15h |
| Phase 3 | 15-20h | 3h | 2h | 20-25h |
| **Total** | **27-38h** | **6h** | **4h** | **37-48h** |

---

## Rollback Plan by Phase

**Phase 1:** 
- Revert directory structure (keep `.fos/memory/` original)
- Remove hook from settings.json
- No data loss

**Phase 2:**
- Disable threading features via config flag
- Revert to individual write operations
- No data loss

**Phase 3:**
- Disable semantic features via config flag
- Return to simple contradiction detection
- No data loss (vectors can be rebuilt)

---

## Success Metrics Summary

| Metric | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|
| **System activation** | Works | < 500ms | < 100ms |
| **Concurrency** | Sequential | Thread-safe | High-throughput |
| **Contradiction detection** | Pattern-based | Pattern-based | Semantic-based |
| **False positive rate** | Unknown | < 5% | < 2% |
| **User satisfaction** | Functional | Responsive | Intelligent |

---

## Dependencies & Blockers

### No External Blockers
- All required libraries already installed
- Python 3.8+ available
- ChromaDB already functional
- No infrastructure changes needed

### Internal Dependencies
```
Phase 1 → (blocks) Phase 2 (import fix required first)
Phase 2 → (blocks) Phase 3 (optimization required before enhancement)
```

---

*This roadmap is detailed enough for team execution but flexible enough to adapt to learnings from each phase.*
