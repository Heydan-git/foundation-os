#!/bin/bash
# wiki-recall-reminder.sh — Hook rappel wiki domaine
# Si le fichier edite/lu contient un nom de domaine wiki,
# affiche un rappel pour considerer la lecture du domaine.
# Usage : bash scripts/hooks/wiki-recall-reminder.sh <chemin-fichier>
# NE PAS configurer dans settings.json pour l'instant (opt-in, Kevin activera manuellement).

FILE="${1:-}"
[ -z "$FILE" ] && exit 0

cd "$(git rev-parse --show-toplevel)" 2>/dev/null || exit 0

for domain in trading finance sante design dev; do
  if echo "$FILE" | grep -qi "$domain"; then
    if [ -d "wiki/domains/$domain" ]; then
      echo "wiki/domains/$domain/ existe — considerer lecture avant reponse"
    fi
  fi
done
