#!/bin/bash
# wiki-health.sh — Health-check specifique wiki/
# Checks : hot.md existence + age, index.md existence, pages count, broken wikilinks estimation
# Usage : bash scripts/wiki-health.sh
# Exit codes : 0=SAIN, 1=DEGRADED (warnings), 2=BROKEN (critical missing)
# Spec : docs/core/knowledge.md section 9 (maintenance)

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
DIM='\033[0;90m'
RST='\033[0m'

WARN=0
BROKEN=0

if [ ! -d wiki/ ]; then
  echo -e "${DIM}[INFO]${RST} Wiki absent (pas d'adoption claude-obsidian)"
  exit 0
fi

echo "WIKI-HEALTH — $(date +%Y-%m-%d)"
echo ""

# 1. hot.md existence + age
if [ -f wiki/hot.md ]; then
  # macOS stat: -f %m (mod time epoch)
  HOT_MOD=$(stat -f %m wiki/hot.md 2>/dev/null || stat -c %Y wiki/hot.md 2>/dev/null || echo 0)
  NOW=$(date +%s)
  HOT_AGE_DAYS=$(( (NOW - HOT_MOD) / 86400 ))
  if [ "$HOT_AGE_DAYS" -gt 7 ]; then
    echo -e "  ${YEL}[WARN]${RST} hot.md age : ${HOT_AGE_DAYS}j (> 7j, update via /session-end)"
    WARN=$((WARN + 1))
  else
    echo -e "  ${GRN}[OK]${RST} hot.md age : ${HOT_AGE_DAYS}j"
  fi
else
  echo -e "  ${RED}[BROKEN]${RST} wiki/hot.md manquant"
  BROKEN=$((BROKEN + 1))
fi

# 2. index.md existence
if [ -f wiki/index.md ]; then
  echo -e "  ${GRN}[OK]${RST} index.md present"
else
  echo -e "  ${RED}[BROKEN]${RST} wiki/index.md manquant"
  BROKEN=$((BROKEN + 1))
fi

# 3. Pages count (contenu uniquement, exclut meta/templates/_index)
TOTAL_MD=$(find wiki/ -name "*.md" -not -path "*/\.*" | wc -l | tr -d ' ')
CONCEPTS=$(find wiki/concepts wiki/domains/*/concepts 2>/dev/null -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ENTITIES=$(find wiki/entities -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
SOURCES=$(find wiki/sources wiki/domains/*/sources 2>/dev/null -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAINS=$(find wiki/domains -maxdepth 1 -type d 2>/dev/null | tail -n +2 | wc -l | tr -d ' ')
echo -e "  ${GRN}[OK]${RST} Pages : ${TOTAL_MD} total (${CONCEPTS} concepts, ${ENTITIES} entities, ${SOURCES} sources)"
echo -e "  ${DIM}[OK]${RST} Domaines : ${DOMAINS}"

# 4. Broken wikilinks estimation (sample 20 premiers fichiers)
BROKEN_LINKS=0
CHECKED=0
for f in $(find wiki/concepts wiki/entities wiki/sources -name "*.md" 2>/dev/null | head -20); do
  [ -f "$f" ] || continue
  CHECKED=$((CHECKED + 1))
  # Extract wikilinks [[Target]] or [[path/Target]]
  grep -oE '\[\[[^]|]+' "$f" 2>/dev/null | sed 's/\[\[//' | sort -u | while IFS= read -r link; do
    [ -z "$link" ] && continue
    # Normalize : get basename (handles spaces in names)
    BASENAME=$(basename "$link")
    [ -z "$BASENAME" ] && continue
    # Quote properly for find (handles spaces like "Andrej Karpathy")
    FOUND=$(find wiki/ -name "${BASENAME}.md" 2>/dev/null | head -1)
    if [ -z "$FOUND" ]; then
      # Try without .md extension (might already have it)
      FOUND=$(find wiki/ -name "${BASENAME}" 2>/dev/null | head -1)
    fi
    if [ -z "$FOUND" ]; then
      BROKEN_LINKS=$((BROKEN_LINKS + 1))
    fi
  done
done

if [ "$BROKEN_LINKS" -gt 0 ]; then
  echo -e "  ${YEL}[WARN]${RST} Wikilinks casses : ~$BROKEN_LINKS (scan $CHECKED pages)"
  WARN=$((WARN + 1))
else
  echo -e "  ${GRN}[OK]${RST} Wikilinks coherents ($CHECKED pages scannees)"
fi

# 5. .raw/ sources count
RAW_COUNT=$(find .raw/ -name "*.md" -o -name "*.pdf" -o -name "*.txt" 2>/dev/null | wc -l | tr -d ' ')
echo -e "  ${DIM}[OK]${RST} Sources brutes .raw/ : ${RAW_COUNT}"

echo ""
if [ $BROKEN -gt 0 ]; then
  echo -e "Verdict : ${RED}BROKEN${RST} ($BROKEN critical, $WARN warning)"
  exit 2
elif [ $WARN -gt 0 ]; then
  echo -e "Verdict : ${YEL}DEGRADED${RST} ($WARN warning, ${TOTAL_MD} pages)"
  exit 1
else
  echo -e "Verdict : ${GRN}SAIN${RST} (${TOTAL_MD} pages, ${DOMAINS} domaines, hot.md ${HOT_AGE_DAYS:-0}j)"
  exit 0
fi
