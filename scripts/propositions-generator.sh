#!/usr/bin/env bash
# propositions-generator.sh — Genere 0-3 propositions Claude pour la tuile #15 brief v12
#
# Usage :
#   bash scripts/propositions-generator.sh           # output markdown table
#   bash scripts/propositions-generator.sh --check   # exit 0 si propositions, 1 sinon
#
# Triggers :
#   1. Drift-detector exit != 0 → fix drift
#   2. Hot.md age > 3 jours → refresh hot.md
#   3. Plans actifs inactifs (mtime > 7j) → reprendre plan
#   4. Lessons-learned ajout recent → consulter avant action similaire
#   5. Idees en parking CONTEXT.md > 7j → trancher
#
# Output : lignes markdown "| emoji | proposition | raison | action |"
# Max 3 propositions (prioritisees).
#
# Refs : audit v2 rapport-comportement.md I-04 + C-05

set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

PROPS=()

# 1. Drift detecte ?
if ! bash scripts/drift-detector.sh > /dev/null 2>&1; then
  PROPS+=("| 🔧 | Fixer drifts cosmetiques detectes | Drift-detector flag warnings | \`bash scripts/drift-detector.sh --fix-cosmetic\` |")
fi

# 2. Hot.md age > 3j ?
if [ -f wiki/hot.md ]; then
  HOT_MOD=$(stat -f %m wiki/hot.md 2>/dev/null || stat -c %Y wiki/hot.md 2>/dev/null || echo 0)
  NOW=$(date +%s)
  AGE_DAYS=$(( (NOW - HOT_MOD) / 86400 ))
  if [ "$AGE_DAYS" -gt 3 ]; then
    PROPS+=("| 📝 | Rafraichir wiki/hot.md (cache flash derniere session) | hot.md age ${AGE_DAYS}j > 3j (regle wiki) | Lancer \`/session-end\` ou editer manuellement |")
  fi
fi

# 3. Plans actifs inactifs (mtime > 7j) ?
if [ -d docs/plans ]; then
  while IFS= read -r plan; do
    [ -z "$plan" ] && continue
    [[ "$plan" == *_template* ]] && continue
    PLAN_MOD=$(stat -f %m "$plan" 2>/dev/null || stat -c %Y "$plan" 2>/dev/null || echo 0)
    PLAN_AGE=$(( (NOW - PLAN_MOD) / 86400 ))
    if [ "$PLAN_AGE" -gt 7 ]; then
      PLAN_NAME=$(basename "$plan" .md)
      PROPS+=("| 📋 | Reprendre plan \`${PLAN_NAME}\` | Inactif depuis ${PLAN_AGE}j | Lire plan + decider continuer/archiver |")
    fi
  done < <(find docs/plans -maxdepth 1 -name "*.md" 2>/dev/null)
fi

# 4. Lessons-learned ajout cette semaine ? (rappel consulter)
if [ -f wiki/meta/lessons-learned.md ]; then
  LL_MOD=$(stat -f %m wiki/meta/lessons-learned.md 2>/dev/null || stat -c %Y wiki/meta/lessons-learned.md 2>/dev/null || echo 0)
  LL_AGE=$(( (NOW - LL_MOD) / 86400 ))
  if [ "$LL_AGE" -le 7 ]; then
    # Compter les entries (##)
    LL_COUNT=$(grep -c "^### " wiki/meta/lessons-learned.md 2>/dev/null || echo 0)
    if [ "$LL_COUNT" -gt 5 ]; then
      PROPS+=("| 💡 | Consulter lessons-learned.md avant action similaire | ${LL_COUNT} lecons capturees (MAJ il y a ${LL_AGE}j) | \`Grep wiki/meta/lessons-learned.md\` |")
    fi
  fi
fi

# 5. Idees en parking > 7j ? (via CONTEXT.md section Idees)
if [ -f CONTEXT.md ]; then
  IDEES_COUNT=$(awk '/^## Idees/,/^## / {if ($0 ~ /^- /) print}' CONTEXT.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$IDEES_COUNT" -ge 5 ]; then
    PROPS+=("| 🤔 | Trancher idees en parking (CONTEXT.md) | ${IDEES_COUNT} idees accumulees | Review + decider ce qu'on garde/fait/rejette |")
  fi
fi

# Mode --check : exit 0 si propositions, 1 sinon
if [ "${1:-}" = "--check" ]; then
  [ ${#PROPS[@]} -gt 0 ] && exit 0 || exit 1
fi

# Output : header + max 3 propositions
if [ ${#PROPS[@]} -eq 0 ]; then
  echo "(aucune proposition Claude — tout est sain)"
  exit 0
fi

echo "| | Proposition | Raison | Action |"
echo "|-|-------------|--------|--------|"
COUNT=0
for prop in "${PROPS[@]}"; do
  echo "$prop"
  COUNT=$((COUNT + 1))
  [ "$COUNT" -ge 3 ] && break
done
