#!/bin/bash
# FOS Hook — Void Glass compliance enforcement
# Vérifie la conformité design system

set -euo pipefail

# Si aucun argument, pas d'erreur
if [[ $# -eq 0 ]]; then
    exit 0
fi

file_path="$1"

# Vérifie seulement les fichiers JSX/TSX
if [[ "$file_path" == *.jsx ]] || [[ "$file_path" == *.tsx ]]; then
    if [[ -f "$file_path" ]]; then
        # Couleurs interdites
        if grep -q "#0A0A0B\|#08080A\|#0A0B0D" "$file_path"; then
            echo "❌ ERREUR VOID GLASS: Couleur interdite dans $file_path"
            echo "🎨 Utilisez #06070C pour le fond"
            exit 1
        fi

        # Fonts interdites
        if grep -q "font.*Outfit\|font.*Inter\|font.*system-ui" "$file_path"; then
            echo "❌ ERREUR VOID GLASS: Font interdite dans $file_path"
            echo "🔤 Utilisez Figtree (UI) ou JetBrains Mono (code)"
            exit 1
        fi

        echo "✅ Void Glass OK: $file_path conforme"
    fi
fi

exit 0