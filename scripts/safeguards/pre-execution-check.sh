#!/bin/bash
# pre-execution-check.sh - Garde-fou validation avant exécution Phase
# Évite les erreurs "Error editing file" et promesses non tenues

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PHASE="$1"
ACTION="$2"

echo -e "${YELLOW}[SAFEGUARD] Pre-execution check for Phase $PHASE - Action: $ACTION${NC}"

# Fonction validation
check_file_exists() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo -e "${RED}[BLOCKER] File missing: $file${NC}"
        return 1
    fi
    echo -e "${GREEN}[OK] File exists: $file${NC}"
    return 0
}

check_file_readable() {
    local file="$1"
    if [ ! -r "$file" ]; then
        echo -e "${RED}[BLOCKER] File not readable: $file${NC}"
        return 1
    fi
    echo -e "${GREEN}[OK] File readable: $file${NC}"
    return 0
}

check_git_clean() {
    if ! git diff --quiet HEAD; then
        echo -e "${YELLOW}[WARNING] Uncommitted changes detected${NC}"
        git status --porcelain
        echo -e "${YELLOW}Consider committing before major phase${NC}"
    else
        echo -e "${GREEN}[OK] Git working tree clean${NC}"
    fi
}

# Validations spécifiques par phase
case "$PHASE" in
    "Phase1")
        echo "Checking Phase 1 Write Capability prerequisites..."

        # Vérifier fichiers de base existent
        check_file_exists "app/src/lib/supabase.ts" || exit 1
        check_file_exists "app/src/lib/database.types.ts" || exit 1
        check_file_exists "app/.env.local" || exit 1

        # Vérifier que les fichiers peuvent être lus avant modification
        if [[ "$ACTION" == *"Edit"* ]]; then
            echo -e "${YELLOW}[CHECK] Validating files can be read before editing${NC}"
            check_file_readable "app/src/lib/useCommander.ts" || exit 1
        fi

        # Vérifier build passe avant modifications
        echo -e "${YELLOW}[CHECK] Validating build passes before changes${NC}"
        cd app && npm run build >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}[OK] Build passes${NC}"
        else
            echo -e "${RED}[BLOCKER] Build fails - fix before proceeding${NC}"
            exit 1
        fi
        cd ..
        ;;

    "Phase0")
        echo "Checking Phase 0 Foundation prerequisites..."
        check_file_exists "FOS-PLAN-MASTER-v2.md" || exit 1
        check_file_exists "FOS-AUDIT-REVOLUTIONNAIRE-v2.md" || exit 1
        ;;

    *)
        echo "Generic pre-execution checks..."
        ;;
esac

# Validation git état
check_git_clean

# Vérification contexte Claude
CONTEXT_SIZE=$(find . -name "*.md" -o -name "*.tsx" -o -name "*.ts" | wc -l)
if [ "$CONTEXT_SIZE" -gt 100 ]; then
    echo -e "${YELLOW}[WARNING] Large context ($CONTEXT_SIZE files) - compaction risk${NC}"
    echo -e "${YELLOW}Consider /compact before major changes${NC}"
else
    echo -e "${GREEN}[OK] Context size reasonable ($CONTEXT_SIZE files)${NC}"
fi

echo -e "${GREEN}[SAFEGUARD] Pre-execution validation PASSED for Phase $PHASE${NC}"
exit 0