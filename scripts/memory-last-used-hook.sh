#!/usr/bin/env bash
# Hook PreToolUse Read : update last_used: dans frontmatter si path = memory/*.md
# Input : stdin JSON Claude Code avec { tool_input: { file_path: "..." } }
# Idempotent : update uniquement si last_used != TODAY (evite write spam)
# Refs : Mega audit v2 FONCTION I-09 (plan 2026-04-17-audit-v2-s3-phase-16-18.md Phase 16)

set -euo pipefail

INPUT=$(cat 2>/dev/null || echo "{}")
FILEPATH=$(echo "$INPUT" | python3 -c 'import sys,json
try:
  d=json.load(sys.stdin)
  print(d.get("tool_input",{}).get("file_path",""))
except Exception:
  print("")
' 2>/dev/null)

MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"

# Guards
[ -z "$FILEPATH" ] && exit 0
[[ "$FILEPATH" != "$MEMDIR"/* ]] && exit 0
[ "$(basename "$FILEPATH")" = "MEMORY.md" ] && exit 0
[ ! -f "$FILEPATH" ] && exit 0

TODAY=$(date +%Y-%m-%d)
CURRENT=$(grep "^last_used:" "$FILEPATH" 2>/dev/null | head -1 | awk '{print $2}')

# Skip si deja a jour (debounce journalier)
[ "$CURRENT" = "$TODAY" ] && exit 0

# Skip si pas de frontmatter avec last_used (evite mutation silencieuse de memoires non-prepared)
[ -z "$CURRENT" ] && exit 0

# Update via awk (BSD/GNU-safe)
awk -v today="$TODAY" '
  /^last_used:/ && !done { print "last_used: " today; done=1; next }
  { print }
' "$FILEPATH" > "$FILEPATH.tmp" && mv "$FILEPATH.tmp" "$FILEPATH"

exit 0
