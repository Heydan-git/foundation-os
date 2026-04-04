#!/bin/bash
# validate-void-glass.sh - Validation design system Void Glass
# Hook PreToolUse(Write|Edit) pour Foundation OS

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[Void Glass] Validation design system...${NC}"

TARGET_FILE="$1"
if [ -z "$TARGET_FILE" ]; then
    exit 0
fi

# Vérifier si fichier JSX/TSX/CSS
if [[ "$TARGET_FILE" =~ \.(jsx|tsx|css)$ ]]; then

    # Couleurs interdites
    FORBIDDEN_COLORS=(
        "#0A0A0B"
        "#08080A"
        "#0A0B0D"
        "#000000"
        "rgb(10,10,11)"
        "rgb(8,8,10)"
    )

    # Fonts interdites
    FORBIDDEN_FONTS=(
        "Outfit"
        "Inter"
        "system-ui"
        "sans-serif"
    )

    # Scanner couleurs interdites
    for color in "${FORBIDDEN_COLORS[@]}"; do
        if grep -q "$color" "$TARGET_FILE" 2>/dev/null; then
            echo -e "${RED}[Void Glass] ERREUR: Couleur interdite '$color' dans $TARGET_FILE${NC}"
            echo -e "${RED}[Void Glass] Utilisez #06070C pour les fonds${NC}"
            exit 1
        fi
    done

    # Scanner fonts interdites
    for font in "${FORBIDDEN_FONTS[@]}"; do
        if grep -q "$font" "$TARGET_FILE" 2>/dev/null; then
            echo -e "${RED}[Void Glass] ERREUR: Font interdite '$font' dans $TARGET_FILE${NC}"
            echo -e "${RED}[Void Glass] Utilisez Figtree pour UI, JetBrains Mono pour code${NC}"
            exit 1
        fi
    done

    echo -e "${GREEN}[Void Glass] ✅ Design system compliance OK${NC}"
fi

exit 0