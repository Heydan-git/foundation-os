#!/bin/bash
# post-action-validation.sh - Validation après chaque action critique
# Détecte en temps réel les gaps entre promesses et réalité

set -e

ACTION="$1"
FILE_PATH="$2"
EXPECTED_CONTENT="$3"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[POST-ACTION] Validating $ACTION on $FILE_PATH${NC}"

case "$ACTION" in
    "Write")
        # Vérifier que le fichier existe après écriture
        if [ ! -f "$FILE_PATH" ]; then
            echo -e "${RED}[FAIL] File not created: $FILE_PATH${NC}"
            exit 1
        fi

        # Vérifier taille non nulle
        FILE_SIZE=$(wc -c < "$FILE_PATH")
        if [ "$FILE_SIZE" -eq 0 ]; then
            echo -e "${RED}[FAIL] File empty after write: $FILE_PATH${NC}"
            exit 1
        fi

        echo -e "${GREEN}[SUCCESS] File created: $FILE_PATH ($FILE_SIZE bytes)${NC}"
        ;;

    "Edit")
        # Vérifier que le fichier existe
        if [ ! -f "$FILE_PATH" ]; then
            echo -e "${RED}[FAIL] File not found for edit: $FILE_PATH${NC}"
            exit 1
        fi

        # Vérifier contenu attendu si fourni
        if [ -n "$EXPECTED_CONTENT" ]; then
            if ! grep -q "$EXPECTED_CONTENT" "$FILE_PATH"; then
                echo -e "${RED}[FAIL] Expected content not found in $FILE_PATH${NC}"
                echo -e "${RED}Expected: $EXPECTED_CONTENT${NC}"
                exit 1
            fi
        fi

        echo -e "${GREEN}[SUCCESS] File edited: $FILE_PATH${NC}"
        ;;

    "Build")
        # Tester build après modifications
        cd "$(dirname "$FILE_PATH")" || exit 1
        if npm run build >/dev/null 2>&1; then
            echo -e "${GREEN}[SUCCESS] Build passes after changes${NC}"
        else
            echo -e "${RED}[FAIL] Build broken after changes${NC}"
            exit 1
        fi
        ;;

    "Phase")
        # Validation completion de phase
        PHASE="$FILE_PATH"
        echo -e "${YELLOW}[VALIDATION] Checking Phase $PHASE completion...${NC}"

        # Score attendu vs réel
        if [ "$PHASE" = "Phase0" ]; then
            # Vérifier artifacts
            ARTIFACTS_COUNT=$(find /Users/kevinnoel/foundation-os/app/src/artifacts -name "*.jsx" | wc -l)
            if [ "$ARTIFACTS_COUNT" -lt 7 ]; then
                echo -e "${RED}[FAIL] Phase 0: Only $ARTIFACTS_COUNT/7 artifacts found${NC}"
                exit 1
            fi

            # Vérifier hooks
            HOOKS_COUNT=$(find /Users/kevinnoel/foundation-os/scripts/hooks -name "*.sh" | wc -l)
            if [ "$HOOKS_COUNT" -lt 3 ]; then
                echo -e "${RED}[FAIL] Phase 0: Only $HOOKS_COUNT/3 hooks found${NC}"
                exit 1
            fi

            echo -e "${GREEN}[SUCCESS] Phase 0 validation passed${NC}"

        elif [ "$PHASE" = "Phase1" ]; then
            # Vérifier mutations.ts
            if [ ! -f "/Users/kevinnoel/foundation-os/app/src/lib/mutations.ts" ]; then
                echo -e "${RED}[FAIL] Phase 1: mutations.ts missing${NC}"
                exit 1
            fi

            # Vérifier au moins un form
            FORMS_COUNT=$(find /Users/kevinnoel/foundation-os/app/src/components/forms -name "*.tsx" 2>/dev/null | wc -l || echo 0)
            if [ "$FORMS_COUNT" -eq 0 ]; then
                echo -e "${RED}[FAIL] Phase 1: No forms found${NC}"
                exit 1
            fi

            echo -e "${GREEN}[SUCCESS] Phase 1 validation passed${NC}"
        fi
        ;;

    *)
        echo -e "${YELLOW}[INFO] No specific validation for action: $ACTION${NC}"
        ;;
esac

echo -e "${GREEN}[POST-ACTION] Validation completed successfully${NC}"
exit 0