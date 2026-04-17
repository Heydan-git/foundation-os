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
SUGGEST_MODE=0
for arg in "$@"; do
  [ "$arg" = "--fix-cosmetic" ] && FIX_MODE=1
  [ "$arg" = "--suggest" ] && SUGGEST_MODE=1
done

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RST='\033[0m'

DRIFT=0
FIXED=0

echo ""
echo "DRIFT-DETECTOR — $(date +%Y-%m-%d)"
[ $FIX_MODE -eq 1 ] && echo "Mode : --fix-cosmetic (actions cosmetiques uniquement)"
[ $SUGGEST_MODE -eq 1 ] && echo "Mode : --suggest (ecriture suggestions dans .omc/suggestions.md)"
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
if [ "$CLAUDE_LINES" -gt 250 ]; then
  echo -e "  ${YEL}[DRIFT]${RST} CLAUDE.md $CLAUDE_LINES L (cible < 250)"
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
# LEGACY_REGEX : noms Desktop auto-generes (claude/<word>-<word> et claude/<word>-<word>-<hex>)
# ex: claude/jolly-wescoff, claude/beautiful-darwin-8782be (hex suffix quand multiple worktrees)
LEGACY_REGEX="^claude/[a-z]+-[a-z]+(-[a-z0-9]+)?$"
# Desktop auto-creates worktrees with claude/* branch names — not controllable.
# Only flag as drift on the main working tree, not inside .claude/worktrees/.
IS_WORKTREE=0
[[ "$(pwd)" == *"/.claude/worktrees/"* ]] && IS_WORKTREE=1
if echo "$BRANCH" | grep -qE "$VALID_REGEX"; then
  echo -e "  ${GRN}[OK]${RST} branche '$BRANCH' (convention OK)"
elif echo "$BRANCH" | grep -qE "$LEGACY_REGEX" && [ "$IS_WORKTREE" -eq 1 ]; then
  echo -e "  ${GRN}[OK]${RST} branche '$BRANCH' (worktree Desktop, convention non-applicable)"
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

# 10. Wiki index-wiki.md sync avec filesystem (page count)
if [ -f wiki/index-wiki.md ]; then
  WIKI_PAGES_FS=$(find wiki/ -name "*.md" -not -path "*/\.*" -not -path "*/meta/templates/*" -not -name "_index.md" | wc -l | tr -d ' ')
  WIKI_PAGES_IDX=$(grep -oE "Total pages: [0-9]+" wiki/index-wiki.md | grep -oE "[0-9]+" | head -1)
  if [ -n "$WIKI_PAGES_IDX" ] && [ "$WIKI_PAGES_IDX" -ne "$WIKI_PAGES_FS" ] 2>/dev/null; then
    echo -e "  ${YEL}[DRIFT]${RST} wiki/index-wiki.md : $WIKI_PAGES_IDX listees vs $WIKI_PAGES_FS filesystem"
    DRIFT=$((DRIFT + 1))
  elif [ -n "$WIKI_PAGES_IDX" ]; then
    echo -e "  ${GRN}[OK]${RST} wiki pages : $WIKI_PAGES_FS (index sync)"
  fi
fi

echo ""

# --suggest : ecrire les suggestions dans .omc/suggestions.md
if [ $SUGGEST_MODE -eq 1 ] && [ "$DRIFT" -gt 0 ]; then
  mkdir -p .omc
  {
    echo "## Suggestions $(date +%Y-%m-%d)"
    echo ""
    [ "$CTX_SESSIONS" -gt 5 ] 2>/dev/null && echo "- CONTEXT.md sessions > 5 : compresser la ${CTX_SESSIONS}eme"
    [ "$CTX_LINES" -gt 150 ] 2>/dev/null && echo "- CONTEXT.md ${CTX_LINES}L : compresser (garde-fou 200L)"
    [ "$CLAUDE_LINES" -gt 250 ] 2>/dev/null && echo "- CLAUDE.md ${CLAUDE_LINES}L : reduire (cible < 250)"
    if [ -n "${WIKI_PAGES_IDX:-}" ] && [ -n "${WIKI_PAGES_FS:-}" ] && [ "$WIKI_PAGES_IDX" -ne "$WIKI_PAGES_FS" ] 2>/dev/null; then
      echo "- wiki/index-wiki.md : Total pages $WIKI_PAGES_IDX vs $WIKI_PAGES_FS filesystem"
    fi
    echo "$BRANCH" | grep -qE "$LEGACY_REGEX" && echo "- branche '$BRANCH' : renommer selon convention D-NAMING-01"
    [ "${HOT_AGE_DAYS:-0}" -gt 7 ] 2>/dev/null && echo "- wiki/hot.md : ${HOT_AGE_DAYS}j sans update (> 7j)"
    echo ""
  } > .omc/suggestions.md
  echo -e "  ${GRN}[OK]${RST} Suggestions ecrites dans .omc/suggestions.md"
fi

if [ "$DRIFT" -eq 0 ]; then
  echo -e "${GRN}Verdict : SYNC${RST}"
  exit 0
elif [ $FIXED -gt 0 ]; then
  echo -e "${YEL}Verdict : DRIFT FIXED${RST} ($FIXED fixes cosmetiques, $((DRIFT - FIXED)) restants)"
  exit 2
else
  echo -e "${YEL}Verdict : DRIFT${RST} ($DRIFT drifts detectes)"
  [ $FIX_MODE -eq 0 ] && echo "  Utiliser --fix-cosmetic pour fix auto (jamais destructif)"
  [ $SUGGEST_MODE -eq 0 ] && echo "  Utiliser --suggest pour ecrire dans .omc/suggestions.md"
  exit 1
fi
