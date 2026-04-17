#!/usr/bin/env bash
# pre-compaction-snapshot.sh — Snapshot atomique avant compactage contexte
# Role : dump wiki/hot.md + CONTEXT Cap + dernier TodoWrite dans .omc/snapshots/YYYYMMDD-HHMM.md
# Usage : declenche auto via .claude/settings.json hook PreCompact (fallback manuel : `bash scripts/hooks/pre-compaction-snapshot.sh`)
# Spec : docs/core/knowledge.md section 12.4 + [[Pre-compaction Snapshot]]
# Regle : aucun exit != 0 (hooks non-bloquants pour ne pas casser la session).
# Rotation : garde 14 derniers snapshots, prune plus anciens.

set -uo pipefail

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

SNAPSHOT_DIR=".omc/snapshots"
mkdir -p "$SNAPSHOT_DIR" 2>/dev/null || exit 0

TS=$(date +%Y%m%d-%H%M)
OUT="$SNAPSHOT_DIR/${TS}.md"

{
  echo "# Pre-compaction snapshot — $TS"
  echo ""
  echo "> Snapshot atomique avant compactage contexte. Spec : docs/core/knowledge.md section 12.4."
  echo "> Recovery : \`cat .omc/snapshots/\$(ls -t .omc/snapshots | head -1)\`"
  echo ""
  echo "## wiki/hot.md"
  echo ""
  if [ -f wiki/hot.md ]; then
    cat wiki/hot.md
  else
    echo "_(wiki/hot.md absent)_"
  fi
  echo ""
  echo "## CONTEXT.md — Cap + Prochaine action"
  echo ""
  if [ -f CONTEXT.md ]; then
    sed -n '/^## Cap/,/^## Idees/p' CONTEXT.md 2>/dev/null | sed '/^## Idees/d'
  else
    echo "_(CONTEXT.md absent)_"
  fi
  echo ""
  echo "## TodoWrite (last known state)"
  echo ""
  LATEST_JSONL=$(ls -t "$HOME/.claude/projects/-Users-kevinnoel-foundation-os/"*.jsonl 2>/dev/null | head -1)
  if [ -n "${LATEST_JSONL:-}" ] && [ -f "$LATEST_JSONL" ]; then
    LAST_TODO=$(grep -h '"TodoWrite"' "$LATEST_JSONL" 2>/dev/null | tail -1)
    if [ -n "$LAST_TODO" ]; then
      echo '```json'
      echo "$LAST_TODO" | head -c 3000
      echo ""
      echo '```'
    else
      echo "_(aucun TodoWrite trouve dans transcript courant)_"
    fi
  else
    echo "_(transcript JSONL introuvable)_"
  fi
  echo ""
  echo "---"
  echo ""
  echo "_Snapshot genere par scripts/hooks/pre-compaction-snapshot.sh_"
} > "$OUT" 2>/dev/null

# Rotation : garder 14 derniers, prune plus anciens
ls -t "$SNAPSHOT_DIR"/*.md 2>/dev/null | tail -n +15 | xargs rm -f 2>/dev/null

exit 0
