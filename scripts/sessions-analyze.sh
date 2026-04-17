#!/usr/bin/env bash
# sessions-analyze.sh — Wrapper bash pour scripts/_sessions-analyze.py
# Analyse les transcripts JSONL de sessions Claude Code Foundation OS.
#
# Usage :
#   bash scripts/sessions-analyze.sh                  # analyse complete
#   bash scripts/sessions-analyze.sh --limit=10       # dev : 10 sessions plus recentes
#   bash scripts/sessions-analyze.sh --period=7d      # sessions derniers 7 jours
#   bash scripts/sessions-analyze.sh --help
#
# Source : audit v2 rapport-comportement.md I-02 (transcripts inexploites)
# Transcripts : ~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl
# Output : wiki/meta/session-patterns.md (hebdo auto-regenere si routine activee)

set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

for arg in "$@"; do
  if [ "$arg" = "-h" ] || [ "$arg" = "--help" ]; then
    head -14 "$0" | grep "^#" | sed 's/^# \?//'
    exit 0
  fi
done

python3 scripts/_sessions-analyze.py "$@"
