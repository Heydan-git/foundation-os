#!/bin/bash
# wiki-metrics.sh — Calcule 4 metriques de sante du wiki
# Metriques :
#   1. Connectivite moyenne (wikilinks sortants / page content)
#   2. Ratio orphelins (pages sans lien entrant / total)
#   3. Fraicheur moyenne (jours depuis derniere modif par page)
#   4. Bidirectionnalite (% paires A<->B completes)
# Usage : bash scripts/wiki-metrics.sh
# Opt-in dans brief via WIKI_METRICS=1

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

echo ""
echo "WIKI-METRICS — $(date +%Y-%m-%d)"
echo ""

# Collecter les pages wiki (hors templates)
PAGES=()
while IFS= read -r f; do
  PAGES+=("$f")
done < <(find wiki/ -name "*.md" -not -path "*/meta/templates/*" -not -name "_index.md")

TOTAL=${#PAGES[@]}
if [ "$TOTAL" -eq 0 ]; then
  echo "Aucune page wiki trouvee."
  exit 0
fi

# --- 1. Connectivite moyenne (wikilinks sortants / page) ---
TOTAL_LINKS=0
CONTENT_PAGES=0
for f in "${PAGES[@]}"; do
  links=$(grep -oE '\[\[[^]]+\]\]' "$f" 2>/dev/null | wc -l | tr -d ' ')
  TOTAL_LINKS=$((TOTAL_LINKS + links))
  # Compter uniquement les pages "content" (concepts, entities, sources, domains)
  if echo "$f" | grep -qE "(concepts|entities|sources|domains)"; then
    CONTENT_PAGES=$((CONTENT_PAGES + 1))
  fi
done

if [ "$CONTENT_PAGES" -gt 0 ]; then
  AVG_LINKS=$(awk "BEGIN {printf \"%.1f\", $TOTAL_LINKS / $CONTENT_PAGES}")
else
  AVG_LINKS="0.0"
fi
echo "  Connectivite : $AVG_LINKS wikilinks/page content ($TOTAL_LINKS liens, $CONTENT_PAGES pages content)"

# --- 2. Ratio orphelins (pages sans lien entrant) ---
ORPHANS=0
for f in "${PAGES[@]}"; do
  bn=$(basename "$f" .md)
  [ ${#bn} -le 3 ] && continue  # ignorer noms courts
  # Chercher si au moins une autre page linke vers celle-ci
  incoming=$(grep -rl "\[\[.*${bn}" wiki/ 2>/dev/null | grep -v "$f" | head -1)
  if [ -z "$incoming" ]; then
    ORPHANS=$((ORPHANS + 1))
  fi
done
ORPHAN_RATIO=$(awk "BEGIN {printf \"%.0f\", ($ORPHANS / $TOTAL) * 100}")
echo "  Orphelins   : $ORPHANS/$TOTAL ($ORPHAN_RATIO%)"

# --- 3. Fraicheur moyenne (jours depuis derniere modif) ---
NOW=$(date +%s)
TOTAL_AGE=0
AGED_PAGES=0
for f in "${PAGES[@]}"; do
  # Utiliser git log pour la date de derniere modif
  LAST_MOD=$(git log -1 --format="%ct" -- "$f" 2>/dev/null)
  if [ -n "$LAST_MOD" ] && [ "$LAST_MOD" -gt 0 ] 2>/dev/null; then
    AGE_DAYS=$(( (NOW - LAST_MOD) / 86400 ))
    TOTAL_AGE=$((TOTAL_AGE + AGE_DAYS))
    AGED_PAGES=$((AGED_PAGES + 1))
  fi
done
if [ "$AGED_PAGES" -gt 0 ]; then
  AVG_AGE=$(awk "BEGIN {printf \"%.1f\", $TOTAL_AGE / $AGED_PAGES}")
else
  AVG_AGE="?"
fi
echo "  Fraicheur   : ${AVG_AGE}j age moyen ($AGED_PAGES pages trackees)"

# --- 4. Bidirectionnalite (sample: concepts + entities) ---
SAMPLE_PAGES=()
while IFS= read -r f; do
  SAMPLE_PAGES+=("$f")
done < <(find wiki/concepts wiki/entities -name "*.md" 2>/dev/null | head -15)

PAIRS=0
BIDI=0
for f in "${SAMPLE_PAGES[@]}"; do
  bn_src=$(basename "$f" .md)
  # Trouver les pages linkees
  while IFS= read -r target; do
    # Nettoyer le target (enlever [[ ]] et |alias)
    clean=$(echo "$target" | sed 's/\[\[//;s/\]\]//;s/|.*//')
    target_bn=$(basename "$clean" .md)
    [ "$target_bn" = "$bn_src" ] && continue
    # Chercher le fichier target
    target_file=$(find wiki/ -name "${target_bn}.md" -not -path "*/meta/templates/*" 2>/dev/null | head -1)
    if [ -n "$target_file" ] && [ -f "$target_file" ]; then
      PAIRS=$((PAIRS + 1))
      # Verifier si le target linke en retour vers src
      if grep -q "\[\[.*${bn_src}" "$target_file" 2>/dev/null; then
        BIDI=$((BIDI + 1))
      fi
    fi
  done < <(grep -oE '\[\[[^]]+\]\]' "$f" 2>/dev/null)
done

if [ "$PAIRS" -gt 0 ]; then
  BIDI_PCT=$(awk "BEGIN {printf \"%.0f\", ($BIDI / $PAIRS) * 100}")
else
  BIDI_PCT="N/A"
fi
echo "  Bidirection : ${BIDI_PCT}% ($BIDI/$PAIRS paires reciproques, sample ${#SAMPLE_PAGES[@]} pages)"

echo ""
echo "Done. (opt-in brief via WIKI_METRICS=1)"
