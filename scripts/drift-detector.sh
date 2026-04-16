#!/bin/bash
# drift-detector.sh — Detecte les desynchros multi-sources
# Usage :
#   bash scripts/drift-detector.sh                    # detection only
#   bash scripts/drift-detector.sh --fix-cosmetic     # fix cosmetique non-destructif
# Spec : plan level-up foundation os (D-LEVELUP-01 organicite detection)
# Exit codes : 0 = sync, 1 = drift detecte, 2 = drift fixe en mode --fix-cosmetic

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

FIX_MODE=0
[ "${1:-}" = "--fix-cosmetic" ] && FIX_MODE=1

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RST='\033[0m'

DRIFT=0
FIXED=0

echo ""
echo "DRIFT-DETECTOR — $(date +%Y-%m-%d)"
[ $FIX_MODE -eq 1 ] && echo "Mode : --fix-cosmetic (actions cosmetiques uniquement)"
echo ""

# 1. CONTEXT.md sessions count vs spec (max 5)
CTX_SESSIONS=$(grep -c "^| 2026-" CONTEXT.md 2>/dev/null || echo 0)
if [ "$CTX_SESSIONS" -gt 5 ]; then
  echo -e "  ${YEL}[DRIFT]${RST} CONTEXT.md Sessions recentes : $CTX_SESSIONS entrees (max 5 selon spec)"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} CONTEXT.md Sessions ($CTX_SESSIONS/5)"
fi

# 2. CONTEXT.md lines
CTX_LINES=$(wc -l < CONTEXT.md | tr -d ' ')
if [ "$CTX_LINES" -gt 200 ]; then
  echo -e "  ${RED}[DRIFT]${RST} CONTEXT.md $CTX_LINES L (garde-fou 200L)"
  DRIFT=$((DRIFT + 1))
elif [ "$CTX_LINES" -gt 150 ]; then
  echo -e "  ${YEL}[DRIFT]${RST} CONTEXT.md $CTX_LINES L (budget 150L)"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} CONTEXT.md $CTX_LINES L"
fi

# 3. CLAUDE.md lines
CLAUDE_LINES=$(wc -l < CLAUDE.md | tr -d ' ')
if [ "$CLAUDE_LINES" -gt 200 ]; then
  echo -e "  ${YEL}[DRIFT]${RST} CLAUDE.md $CLAUDE_LINES L (cible < 200)"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} CLAUDE.md $CLAUDE_LINES L"
fi

# 4. MEMORY.md index vs filesystem
MEM_DIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"
if [ -d "$MEM_DIR" ]; then
  MEM_REAL=$(ls "$MEM_DIR"/*.md 2>/dev/null | grep -v MEMORY.md | wc -l | tr -d ' ')
  MEM_IDX=$(grep -c "^- \[" "$MEM_DIR/MEMORY.md" 2>/dev/null || echo 0)
  if [ "$MEM_IDX" -ne "$MEM_REAL" ]; then
    DELTA=$((MEM_REAL - MEM_IDX))
    echo -e "  ${YEL}[DRIFT]${RST} MEMORY.md : $MEM_IDX entrees vs $MEM_REAL fichiers (delta $DELTA)"
    DRIFT=$((DRIFT + 1))
  else
    echo -e "  ${GRN}[OK]${RST} MEMORY.md index ($MEM_REAL)"
  fi
fi

# 5. settings.local.json size vs baseline
if [ -f .claude/settings.local.json ]; then
  SL_LINES=$(wc -l < .claude/settings.local.json | tr -d ' ')
  if [ "$SL_LINES" -gt 100 ]; then
    echo -e "  ${YEL}[DRIFT]${RST} settings.local.json $SL_LINES L (cible < 100 post-purge)"
    DRIFT=$((DRIFT + 1))
  else
    echo -e "  ${GRN}[OK]${RST} settings.local.json $SL_LINES L"
  fi
fi

# 6. Branch name check
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
VALID_REGEX="^(main|(feat|fix|docs|refactor|chore|audit|wt)/[a-z0-9]+[-a-z0-9]*(-[0-9]{6})?)$"
LEGACY_REGEX="^claude/[a-z]+-[a-z]+$"
if echo "$BRANCH" | grep -qE "$VALID_REGEX"; then
  echo -e "  ${GRN}[OK]${RST} branche '$BRANCH' (convention OK)"
elif echo "$BRANCH" | grep -qE "$LEGACY_REGEX"; then
  echo -e "  ${YEL}[DRIFT]${RST} branche '$BRANCH' (legacy claude/*)"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${RED}[DRIFT]${RST} branche '$BRANCH' (hors convention D-NAMING-01)"
  DRIFT=$((DRIFT + 1))
fi

# 7. Plans actifs
ACTIVE_PLANS=$(ls docs/plans/*.md 2>/dev/null | grep -v _template-plan.md | wc -l | tr -d ' ')
echo -e "  ${GRN}[OK]${RST} plans actifs : $ACTIVE_PLANS"

# 8. Worktrees
WT_COUNT=$(git worktree list | wc -l | tr -d ' ')
echo -e "  ${GRN}[OK]${RST} worktrees : $WT_COUNT (main + $((WT_COUNT - 1)) actifs)"

# 9. Wiki hot.md age (D-WIKI-01)
if [ -f wiki/hot.md ]; then
  HOT_MOD=$(stat -f %m wiki/hot.md 2>/dev/null || stat -c %Y wiki/hot.md 2>/dev/null || echo 0)
  NOW=$(date +%s)
  HOT_AGE_DAYS=$(( (NOW - HOT_MOD) / 86400 ))
  if [ "$HOT_AGE_DAYS" -gt 7 ]; then
    echo -e "  ${YEL}[DRIFT]${RST} wiki/hot.md age : ${HOT_AGE_DAYS}j (> 7j, update recommande)"
    DRIFT=$((DRIFT + 1))
  else
    echo -e "  ${GRN}[OK]${RST} wiki/hot.md age : ${HOT_AGE_DAYS}j"
  fi
fi

# 10. Wiki index.md sync avec filesystem (page count)
if [ -f wiki/index.md ]; then
  WIKI_PAGES_FS=$(find wiki/ -name "*.md" -not -path "*/\.*" | wc -l | tr -d ' ')
  WIKI_PAGES_IDX=$(grep -oE "Total pages: [0-9]+" wiki/index.md | grep -oE "[0-9]+" | head -1)
  if [ -n "$WIKI_PAGES_IDX" ] && [ "$WIKI_PAGES_IDX" -ne "$WIKI_PAGES_FS" ] 2>/dev/null; then
    echo -e "  ${YEL}[DRIFT]${RST} wiki/index.md : $WIKI_PAGES_IDX listees vs $WIKI_PAGES_FS filesystem"
    DRIFT=$((DRIFT + 1))
  elif [ -n "$WIKI_PAGES_IDX" ]; then
    echo -e "  ${GRN}[OK]${RST} wiki pages : $WIKI_PAGES_FS (index sync)"
  fi
fi

echo ""
if [ "$DRIFT" -eq 0 ]; then
  echo -e "${GRN}Verdict : SYNC${RST}"
  exit 0
elif [ $FIXED -gt 0 ]; then
  echo -e "${YEL}Verdict : DRIFT FIXED${RST} ($FIXED fixes cosmetiques, $((DRIFT - FIXED)) restants)"
  exit 2
else
  echo -e "${YEL}Verdict : DRIFT${RST} ($DRIFT drifts detectes)"
  [ $FIX_MODE -eq 0 ] && echo "  Utiliser --fix-cosmetic pour fix auto (jamais destructif)"
  exit 1
fi
