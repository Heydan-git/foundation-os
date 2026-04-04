#!/bin/bash
# FOS Hook — MD-first rule enforcement
# Vérifie qu'un fichier JSX a son pair MD avant modification

set -euo pipefail

# Si aucun argument, pas d'erreur (hook peut être appelé sans contexte)
if [[ $# -eq 0 ]]; then
    exit 0
fi

file_path="$1"

# Vérifie seulement les fichiers JSX
if [[ "$file_path" == *.jsx ]]; then
    md_pair="${file_path%.jsx}-DATA.md"
    md_pair_alt="${file_path%.jsx}.md"

    if [[ ! -f "$md_pair" ]] && [[ ! -f "$md_pair_alt" ]]; then
        echo "❌ ERREUR MD-FIRST: $file_path n'a pas de fichier MD pair"
        echo "📝 Créez d'abord ${md_pair} puis modifiez le JSX"
        exit 1
    fi

    echo "✅ MD-first OK: Pair trouvé pour $file_path"
fi

exit 0