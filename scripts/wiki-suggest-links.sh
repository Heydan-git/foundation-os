#!/bin/bash
# wiki-suggest-links.sh — Suggere les wikilinks manquants dans wiki/
# Pour chaque page wiki, verifie si des basenames d'autres pages sont
# mentionnes en texte brut sans [[wikilink]].
# Usage : bash scripts/wiki-suggest-links.sh
# Chainable dans routine R1 Wiki Maintenance.

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

# 1. Collecter tous les basenames de pages wiki
PAGES=()
while IFS= read -r f; do
  bn=$(basename "$f" .md)
  PAGES+=("$bn")
done < <(find wiki/ -name "*.md" -not -path "*/meta/templates/*" -not -name "_index.md")

SUGGESTIONS=0

# 2. Pour chaque page, chercher les basenames non-linkes
for f in $(find wiki/concepts wiki/entities wiki/sources wiki/domains -name "*.md" 2>/dev/null); do
  content=$(cat "$f")
  for page in "${PAGES[@]}"; do
    [ ${#page} -le 3 ] && continue  # ignorer noms courts (hot, log)
    bn_file=$(basename "$f" .md)
    [ "$bn_file" = "$page" ] && continue  # pas se linker soi-meme
    # Verifier : le basename apparait dans le contenu MAIS PAS comme [[wikilink]]
    if echo "$content" | grep -qi "$page" 2>/dev/null; then
      if ! echo "$content" | grep -q "\[\[.*${page}" 2>/dev/null; then
        echo "SUGGEST: $f → [[${page}]]"
        SUGGESTIONS=$((SUGGESTIONS + 1))
      fi
    fi
  done
done

echo ""
echo "Total suggestions : $SUGGESTIONS"
