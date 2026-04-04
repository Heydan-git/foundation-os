#!/bin/bash
# validate-void-glass.sh - Vérifie Void Glass compliance

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[FOS Hook] Vérification Void Glass...${NC}"

TARGET_FILE="$1"
if [ -z "$TARGET_FILE" ]; then
    TARGET_FILE=$(git diff --cached --name-only | head -1 2>/dev/null || echo "")
fi

if [[ "$TARGET_FILE" =~ \.(jsx|tsx|css|scss)$ ]]; then
    VIOLATIONS=""
    
    # Couleurs interdites
    if grep -q "#0A0A0B\|#08080A" "$TARGET_FILE" 2>/dev/null; then
        VIOLATIONS="${VIOLATIONS}❌ Couleur interdite (#0A0A0B/#08080A)\n"
    fi
    
    # Fonts interdites
    if grep -q "font.*Outfit\|font.*Inter\|fontFamily.*Outfit\|fontFamily.*Inter" "$TARGET_FILE" 2>/dev/null; then
        VIOLATIONS="${VIOLATIONS}❌ Font interdite (Outfit/Inter)\n"
    fi
    
    if [ ! -z "$VIOLATIONS" ]; then
        echo -e "${RED}[FOS Hook] Violations Void Glass:${NC}"
        echo -e "${RED}$VIOLATIONS${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}[FOS Hook] ✅ Void Glass OK${NC}"
fi

exit 0
