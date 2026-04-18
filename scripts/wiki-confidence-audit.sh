#!/usr/bin/env bash
# wiki-confidence-audit.sh — Audit frontmatter `confidence:` sur toutes les pages wiki/*.md
# Role : detecter les pages sans clef `confidence:` (drift INT-2 / D-INTEG-01)
# Usage :
#   bash scripts/wiki-confidence-audit.sh          # dry-run, liste pages sans confidence + stats
#   bash scripts/wiki-confidence-audit.sh --quiet  # 1-ligne stats, exit 0/1 (pour chain health-check)
#   bash scripts/wiki-confidence-audit.sh --check  # silent, exit 0 si OK, 1 si drift
# Spec : docs/core/knowledge.md section 12.1 + [[Confidence Tagging]]
# Exit : 0 toutes pages tagged, 1 drift detecte (au moins 1 page sans confidence)
# Scale attendue : high|medium|low (definition knowledge.md section 12.1)

set -uo pipefail

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

MODE="${1:-default}"

TOTAL=0
MISSING=0
HIGH=0
MEDIUM=0
LOW=0
INVALID=0
MISSING_FILES=()
INVALID_FILES=()

while IFS= read -r f; do
  TOTAL=$((TOTAL + 1))
  CONF=$(awk '/^---$/{count++; if(count==2) exit} count==1 && /^confidence:/{print $2; exit}' "$f" 2>/dev/null)
  if [ -z "$CONF" ]; then
    MISSING=$((MISSING + 1))
    MISSING_FILES+=("$f")
  else
    case "$CONF" in
      high)   HIGH=$((HIGH + 1)) ;;
      medium) MEDIUM=$((MEDIUM + 1)) ;;
      low)    LOW=$((LOW + 1)) ;;
      *)
        INVALID=$((INVALID + 1))
        INVALID_FILES+=("$f:$CONF")
        ;;
    esac
  fi
done < <(find wiki -name "*.md" -not -path "*/.raw/*" -not -path "*/templates/*" 2>/dev/null)

# Templates : audit separe (devraient avoir confidence: medium comme default)
TEMPLATES_TOTAL=0
TEMPLATES_MISSING=0
while IFS= read -r f; do
  TEMPLATES_TOTAL=$((TEMPLATES_TOTAL + 1))
  CONF=$(awk '/^---$/{count++; if(count==2) exit} count==1 && /^confidence:/{print $2; exit}' "$f" 2>/dev/null)
  if [ -z "$CONF" ]; then
    TEMPLATES_MISSING=$((TEMPLATES_MISSING + 1))
    MISSING_FILES+=("$f (template)")
  fi
done < <(find wiki/meta/templates -name "*.md" 2>/dev/null)

TOTAL_ALL=$((TOTAL + TEMPLATES_TOTAL))
MISSING_ALL=$((MISSING + TEMPLATES_MISSING))
EXIT_CODE=0
[ "$MISSING_ALL" -gt 0 ] && EXIT_CODE=1
[ "$INVALID" -gt 0 ] && EXIT_CODE=1

case "$MODE" in
  --quiet)
    echo "wiki-confidence: $TOTAL_ALL pages, $MISSING_ALL sans confidence, $HIGH high / $MEDIUM medium / $LOW low / $INVALID invalid"
    exit $EXIT_CODE
    ;;
  --check)
    exit $EXIT_CODE
    ;;
  *)
    echo "WIKI CONFIDENCE AUDIT — $(date +%Y-%m-%d)"
    echo ""
    echo "Pages scannees : $TOTAL (+ $TEMPLATES_TOTAL templates)"
    echo "Distribution  : $HIGH high / $MEDIUM medium / $LOW low"
    if [ "$MISSING_ALL" -gt 0 ]; then
      echo ""
      echo "Pages sans confidence ($MISSING_ALL) :"
      for f in "${MISSING_FILES[@]}"; do
        echo "  - $f"
      done
    fi
    if [ "$INVALID" -gt 0 ]; then
      echo ""
      echo "Valeurs invalides ($INVALID) :"
      for f in "${INVALID_FILES[@]}"; do
        echo "  - $f (attendu high|medium|low)"
      done
    fi
    echo ""
    if [ $EXIT_CODE -eq 0 ]; then
      echo "Verdict : SAIN (0 drift)"
    else
      echo "Verdict : DRIFT ($MISSING_ALL manquant, $INVALID invalide). Spec : docs/core/knowledge.md section 12.1"
    fi
    exit $EXIT_CODE
    ;;
esac
