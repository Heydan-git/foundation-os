#!/bin/bash
# check-md-pair.sh - Vérifie MD-first compliance
# Hook PreToolUse(Write|Edit) pour Foundation OS

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[FOS Hook] Vérification MD-first compliance...${NC}"

TARGET_FILE="$1"
if [ -z "$TARGET_FILE" ]; then
    TARGET_FILE=$(git diff --cached --name-only | head -1 2>/dev/null || echo "")
fi

if [ -z "$TARGET_FILE" ]; then
    echo -e "${GREEN}[FOS Hook] Aucun fichier détecté${NC}"
    exit 0
fi

# Vérifier si JSX/TSX
if [[ "$TARGET_FILE" =~ \.(jsx|tsx)$ ]]; then
    BASE_NAME=$(basename "$TARGET_FILE" .jsx)
    BASE_NAME=$(basename "$BASE_NAME" .tsx)
    
    # Chercher MD pair
    MD_PAIR=""
    for pattern in "${BASE_NAME}-DATA.md" "$(echo ${BASE_NAME} | tr '[:lower:]' '[:upper:]')-DATA.md" "FOS-$(echo ${BASE_NAME#fos-} | tr '[:lower:]' '[:upper:]')-DATA.md"; do
        if [ -f "$pattern" ]; then
            MD_PAIR="$pattern"
            break
        fi
    done
    
    if [ -z "$MD_PAIR" ]; then
        echo -e "${RED}[FOS Hook] ERREUR: MD pair manquant pour $TARGET_FILE${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}[FOS Hook] ✅ MD-first OK: $MD_PAIR${NC}"
fi

exit 0
