#!/bin/bash
# docs-sync-check.sh — Verifie coherence docs structurelles vs realite
# Spec : plan level-up foundation os (D-LEVELUP-01 organicite via detection)
# Exit codes : 0 = sync, 1 = drift detecte

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RST='\033[0m'

DRIFT=0

echo ""
echo "DOCS-SYNC-CHECK — $(date +%Y-%m-%d)"
echo ""

# 1. Commands count vs docs/architecture.md + docs/index.md
CMD_REAL=$(ls .claude/commands/*.md 2>/dev/null | wc -l | tr -d ' ')
CMD_ARCH=$(grep -cE "^\| \`?/[a-z-]+\`? \|" docs/architecture.md 2>/dev/null || echo 0)

if [ "$CMD_ARCH" -ne "$CMD_REAL" ]; then
  echo -e "  ${YEL}[DRIFT]${RST} docs/architecture.md commands : $CMD_ARCH vs reel $CMD_REAL"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} architecture.md commands ($CMD_REAL)"
fi

# 2. Agents count
AGT_REAL=$(ls .claude/agents/*.md 2>/dev/null | wc -l | tr -d ' ')
AGT_ARCH=$(grep -cE "^\| [a-z-]+ \| (opus|sonnet) \|" docs/architecture.md 2>/dev/null || echo 0)
if [ "$AGT_ARCH" -ne "$AGT_REAL" ]; then
  echo -e "  ${YEL}[DRIFT]${RST} docs/architecture.md agents : $AGT_ARCH vs reel $AGT_REAL"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} architecture.md agents ($AGT_REAL)"
fi

# 3. Modules count
MOD_REAL=$(ls -d modules/*/ 2>/dev/null | wc -l | tr -d ' ')
echo -e "  ${GRN}[OK]${RST} modules reels ($MOD_REAL)"

# 4. Memory files count vs MEMORY.md index
MEM_DIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"
if [ -d "$MEM_DIR" ]; then
  MEM_REAL=$(ls "$MEM_DIR"/*.md 2>/dev/null | grep -v MEMORY.md | wc -l | tr -d ' ')
  MEM_IDX=$(grep -c "^- \[" "$MEM_DIR/MEMORY.md" 2>/dev/null || echo 0)
  if [ "$MEM_IDX" -ne "$MEM_REAL" ]; then
    echo -e "  ${YEL}[DRIFT]${RST} MEMORY.md index : $MEM_IDX entrees vs reel $MEM_REAL"
    DRIFT=$((DRIFT + 1))
  else
    echo -e "  ${GRN}[OK]${RST} MEMORY.md index ($MEM_REAL)"
  fi
fi

# 5. README.md : mots-cles obsoletes
if grep -qE "#06070C|#08080A" README.md 2>/dev/null; then
  echo -e "  ${RED}[DRIFT]${RST} README.md contient couleurs obsoletes (#06070C/#08080A)"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} README.md couleurs a jour"
fi

# 6. manifeste.md : ref "4 commands" obsolete
if grep -q "4 commands" docs/manifeste.md 2>/dev/null; then
  echo -e "  ${RED}[DRIFT]${RST} manifeste.md refere '4 commands' (reel=$CMD_REAL)"
  DRIFT=$((DRIFT + 1))
else
  echo -e "  ${GRN}[OK]${RST} manifeste.md commands count a jour"
fi

# Verdict
echo ""
if [ "$DRIFT" -eq 0 ]; then
  echo -e "${GRN}Verdict : DOCS SYNC${RST}"
  exit 0
else
  echo -e "${YEL}Verdict : DRIFT${RST} ($DRIFT drifts detectes)"
  exit 1
fi
