#!/bin/bash
# file-tracker.sh - Exhaustive file monitoring and gap detection
# Track promesses vs fichiers réellement créés

set -e

ACTION="${1:-status}"
MANIFEST_FILE="/Users/kevinnoel/foundation-os/.omc/file-manifeste.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Créer manifeste si inexistant
init_manifest() {
    mkdir -p "$(dirname "$MANIFEST_FILE")"
    cat > "$MANIFEST_FILE" << 'EOF'
{
  "metadata": {
    "created": "",
    "last_updated": "",
    "version": "1.0"
  },
  "expected_files": {
    "phase0": [
      "FOS-PLAN-MASTER-v2.md",
      "FOS-AUDIT-REVOLUTIONNAIRE-v2.md",
      "FOS-MEMORY-STRATEGY.md",
      "FOS-TECH-ARCHITECTURE.md",
      "FOS-MANIFESTE.md",
      "app/src/artifacts/fos-commander.jsx",
      "app/src/artifacts/fos-knowledge.jsx",
      "app/src/artifacts/fos-index.jsx",
      "app/src/artifacts/fos-scale-orchestrator.jsx",
      "app/src/artifacts/fos-graph.jsx",
      "app/src/artifacts/fos-sync.jsx",
      "app/src/artifacts/fos-toolbox.jsx",
      "scripts/hooks/check-md-pair.sh",
      "scripts/hooks/validate-void-glass.sh",
      "scripts/hooks/conventional-commit.sh"
    ],
    "phase1": [
      "app/src/lib/mutations.ts",
      "app/src/components/forms/AddSessionForm.tsx",
      "app/src/components/forms/EditDecisionModal.tsx",
      "app/src/components/forms/NextStepActions.tsx",
      "app/src/contexts/AuthContext.tsx",
      "app/src/hooks/useAuth.ts",
      "supabase/migrations/001_create_tables.sql"
    ],
    "safeguards": [
      "scripts/safeguards/checkpoint-manager.sh",
      "scripts/safeguards/execution-validator.sh",
      "scripts/safeguards/file-tracker.sh",
      "scripts/safeguards/recovery-manager.sh",
      "scripts/safeguards/error-monitor.sh",
      "scripts/safeguards/pre-execution-check.sh",
      "scripts/safeguards/post-action-validation.sh",
      "scripts/safeguards/emergency-backup.sh"
    ]
  },
  "tracking": {
    "created_files": [],
    "missing_files": [],
    "last_check": ""
  }
}
EOF

    # Set timestamps
    local timestamp=$(date -Iseconds)
    # Use a more compatible sed syntax for macOS
    sed -i '' "s/\"created\": \"\"/\"created\": \"$timestamp\"/" "$MANIFEST_FILE"
    sed -i '' "s/\"last_updated\": \"\"/\"last_updated\": \"$timestamp\"/" "$MANIFEST_FILE"

    echo -e "${GREEN}[INIT] File manifest initialized${NC}"
}

# Scanner les fichiers existants
scan_files() {
    local phase="$1"
    local base_dir="/Users/kevinnoel/foundation-os"

    echo -e "${YELLOW}[SCAN] Scanning $phase files...${NC}"

    # Extract expected files for phase (simple grep approach)
    local expected_files=()
    local in_phase=false

    while IFS= read -r line; do
        if [[ "$line" =~ \"$phase\": ]]; then
            in_phase=true
            continue
        fi

        if [[ "$in_phase" == true ]]; then
            if [[ "$line" =~ ^\s*] ]]; then
                in_phase=false
                break
            fi

            if [[ "$line" =~ \"([^\"]+)\" ]]; then
                local file_path="${BASH_REMATCH[1]}"
                expected_files+=("$file_path")
            fi
        fi
    done < "$MANIFEST_FILE"

    # Check each expected file
    local found=0
    local missing=0
    local missing_list=()

    for file_path in "${expected_files[@]}"; do
        local full_path="$base_dir/$file_path"

        if [ -f "$full_path" ]; then
            echo -e "${GREEN}[FOUND] $file_path${NC}"
            found=$((found + 1))
        else
            echo -e "${RED}[MISSING] $file_path${NC}"
            missing=$((missing + 1))
            missing_list+=("$file_path")
        fi
    done

    local total=$((found + missing))
    local percentage=0
    if [ "$total" -gt 0 ]; then
        percentage=$(( (found * 100) / total ))
    fi

    echo -e "${YELLOW}[SUMMARY] $phase: $found/$total files ($percentage%) ${NC}"

    # Store missing files for gap detection
    if [ "${#missing_list[@]}" -gt 0 ]; then
        echo -e "${RED}[GAPS] Missing files for $phase:${NC}"
        for missing_file in "${missing_list[@]}"; do
            echo -e "${RED}  - $missing_file${NC}"
        done
    fi

    return $missing
}

# Actions principales
case "$ACTION" in
    "init")
        init_manifest
        ;;

    "status")
        [ ! -f "$MANIFEST_FILE" ] && init_manifest

        echo -e "${YELLOW}[FILE TRACKER] Status check...${NC}"

        total_missing=0

        for phase in "phase0" "phase1" "safeguards"; do
            scan_files "$phase"
            total_missing=$((total_missing + $?))
        done

        if [ "$total_missing" -eq 0 ]; then
            echo -e "${GREEN}[STATUS] All expected files present!${NC}"
        else
            echo -e "${RED}[STATUS] $total_missing files missing total${NC}"
            exit 1
        fi
        ;;

    "phase0"|"phase1"|"safeguards")
        [ ! -f "$MANIFEST_FILE" ] && init_manifest
        scan_files "$ACTION"
        ;;

    "add")
        FILE_PATH="$2"
        if [ -z "$FILE_PATH" ]; then
            echo "Usage: $0 add <file_path>"
            exit 1
        fi

        echo -e "${YELLOW}[ADD] Adding $FILE_PATH to tracking${NC}"
        # Simple implementation - just record that file was added
        echo "$(date): Added $FILE_PATH" >> "/Users/kevinnoel/foundation-os/.omc/file-tracker.log"
        ;;

    *)
        echo "Usage: $0 {init|status|phase0|phase1|safeguards|add <file>}"
        exit 1
        ;;
esac

# Update last check timestamp
if [ -f "$MANIFEST_FILE" ]; then
    local timestamp=$(date -Iseconds)
    sed -i '' "s/\"last_check\": \"[^\"]*\"/\"last_check\": \"$timestamp\"/" "$MANIFEST_FILE"
fi

exit 0