#!/usr/bin/env bash
# Audit auto-memories : detect memoires non-utilisees > 30j (rapport only, non-bloquant)
# Refs : Mega audit v2 FONCTION I-09 (plan 2026-04-17-audit-v2-s3-phase-16-18.md Phase 16)

set -euo pipefail

MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"
TODAY=$(date +%s)
STALE_COUNT=0
TOTAL=0
THRESHOLD_DAYS=${MEMORY_STALE_DAYS:-30}

if [ ! -d "$MEMDIR" ]; then
  echo "[ERROR] Dossier memoire introuvable : $MEMDIR"
  exit 0
fi

for f in "$MEMDIR"/*.md; do
  [ "$(basename "$f")" = "MEMORY.md" ] && continue
  TOTAL=$((TOTAL + 1))
  LAST_USED=$(grep "^last_used:" "$f" 2>/dev/null | head -1 | awk '{print $2}')
  if [ -z "$LAST_USED" ]; then
    echo "[MISSING last_used] $(basename "$f")"
    continue
  fi
  LAST_USED_TS=$(date -j -f "%Y-%m-%d" "$LAST_USED" +%s 2>/dev/null || echo 0)
  DIFF_DAYS=$(( (TODAY - LAST_USED_TS) / 86400 ))
  if [ $DIFF_DAYS -gt $THRESHOLD_DAYS ]; then
    echo "[STALE > ${THRESHOLD_DAYS}j] $(basename "$f") (last_used $LAST_USED, ${DIFF_DAYS}j)"
    STALE_COUNT=$((STALE_COUNT + 1))
  fi
done

echo "---"
echo "Total memoires : $TOTAL"
echo "Stale > ${THRESHOLD_DAYS}j : $STALE_COUNT"
exit 0
