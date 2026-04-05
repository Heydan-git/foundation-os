#!/bin/bash
# recovery-manager.sh - Disaster recovery protocols
# Reconstruction automatique en cas d'échec système

set -e

ACTION="${1:-status}"
RECOVERY_TYPE="${2:-auto}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_DIR="/Users/kevinnoel/.claude/emergency-backups"
CHECKPOINT_DIR="/Users/kevinnoel/.claude/checkpoints"
PROJECT_DIR="/Users/kevinnoel/foundation-os"

# Fonction évaluation santé système
assess_health() {
    local score=0
    local issues=()

    echo -e "${YELLOW}[HEALTH CHECK] Assessing system health...${NC}"

    # Check critical files
    [ -f "$PROJECT_DIR/FOS-PLAN-MASTER-v2.md" ] && score=$((score + 10)) || issues+=("Plan Master missing")
    [ -f "$PROJECT_DIR/FOS-AUDIT-REVOLUTIONNAIRE-v2.md" ] && score=$((score + 10)) || issues+=("Audit missing")

    # Check artifacts
    local artifacts_count=$(find "$PROJECT_DIR/app/src/artifacts" -name "*.jsx" 2>/dev/null | wc -l)
    if [ "$artifacts_count" -ge 7 ]; then
        score=$((score + 20))
    else
        issues+=("Only $artifacts_count/7 artifacts found")
    fi

    # Check hooks
    local hooks_count=$(find "$PROJECT_DIR/scripts/hooks" -name "*.sh" 2>/dev/null | wc -l)
    if [ "$hooks_count" -ge 3 ]; then
        score=$((score + 15))
    else
        issues+=("Only $hooks_count/3 hooks found")
    fi

    # Check safeguards
    local safeguards_count=$(find "$PROJECT_DIR/scripts/safeguards" -name "*.sh" 2>/dev/null | wc -l)
    if [ "$safeguards_count" -ge 8 ]; then
        score=$((score + 15))
    else
        issues+=("Only $safeguards_count/8+ safeguards found")
    fi

    # Check build
    if cd "$PROJECT_DIR/app" && npm run build >/dev/null 2>&1; then
        score=$((score + 20))
    else
        issues+=("Build failing")
    fi
    cd "$PROJECT_DIR"

    # Check git state
    if git rev-parse --git-dir >/dev/null 2>&1; then
        score=$((score + 10))
    else
        issues+=("Git repository corrupted")
    fi

    echo -e "${YELLOW}[HEALTH] Score: $score/100${NC}"

    if [ "${#issues[@]}" -gt 0 ]; then
        echo -e "${RED}[ISSUES] Found ${#issues[@]} problems:${NC}"
        for issue in "${issues[@]}"; do
            echo -e "${RED}  - $issue${NC}"
        done
    fi

    echo "$score"
}

# Recovery automatique
auto_recovery() {
    local health_score=$(assess_health)

    if [ "$health_score" -ge 80 ]; then
        echo -e "${GREEN}[RECOVERY] System healthy ($health_score/100) - no recovery needed${NC}"
        return 0
    fi

    if [ "$health_score" -ge 50 ]; then
        echo -e "${YELLOW}[RECOVERY] Partial recovery needed ($health_score/100)${NC}"
        partial_recovery
    else
        echo -e "${RED}[RECOVERY] Full recovery needed ($health_score/100)${NC}"
        full_recovery
    fi
}

# Recovery partiel
partial_recovery() {
    echo -e "${YELLOW}[PARTIAL RECOVERY] Restoring missing components...${NC}"

    # Restore from latest checkpoint if available
    if [ -L "$CHECKPOINT_DIR/latest-checkpoint" ]; then
        echo -e "${YELLOW}[RESTORE] Using latest checkpoint...${NC}"
        restore_from_checkpoint "$(readlink "$CHECKPOINT_DIR/latest-checkpoint")"
    elif [ -L "$BACKUP_DIR/latest" ]; then
        echo -e "${YELLOW}[RESTORE] Using emergency backup...${NC}"
        restore_from_backup "$(readlink "$BACKUP_DIR/latest")"
    else
        echo -e "${RED}[ERROR] No recovery source available${NC}"
        exit 1
    fi
}

# Recovery complet
full_recovery() {
    echo -e "${RED}[FULL RECOVERY] Complete system reconstruction...${NC}"

    # Use emergency backup first
    if [ -L "$BACKUP_DIR/latest" ]; then
        echo -e "${YELLOW}[RESTORE] Emergency backup restoration...${NC}"
        restore_from_backup "$(readlink "$BACKUP_DIR/latest")"
    else
        echo -e "${RED}[CRITICAL] No backup available for full recovery${NC}"
        exit 1
    fi

    # Reinitialize critical systems
    reinitialize_systems
}

# Restore depuis checkpoint
restore_from_checkpoint() {
    local checkpoint_path="$1"

    echo -e "${YELLOW}[RESTORE] From checkpoint: $checkpoint_path${NC}"

    if [ ! -d "$checkpoint_path" ]; then
        echo -e "${RED}[ERROR] Checkpoint not found: $checkpoint_path${NC}"
        return 1
    fi

    # Copy files back
    cp "$checkpoint_path"/*.md "$PROJECT_DIR/" 2>/dev/null || true
    cp -R "$checkpoint_path/app-state"/* "$PROJECT_DIR/app/src/" 2>/dev/null || true
    cp -R "$checkpoint_path/scripts"/* "$PROJECT_DIR/scripts/" 2>/dev/null || true

    echo -e "${GREEN}[RESTORE] Checkpoint restoration completed${NC}"
}

# Restore depuis backup
restore_from_backup() {
    local backup_path="$1"

    echo -e "${YELLOW}[RESTORE] From backup: $backup_path${NC}"

    if [ ! -f "$backup_path/RECOVERY-INSTRUCTIONS.md" ]; then
        echo -e "${RED}[ERROR] Invalid backup: $backup_path${NC}"
        return 1
    fi

    # Execute recovery commands from backup
    cp "$backup_path"/*.md "$PROJECT_DIR/" 2>/dev/null || true
    cp -R "$backup_path/app-src"/* "$PROJECT_DIR/app/src/" 2>/dev/null || true
    cp -R "$backup_path/scripts"/* "$PROJECT_DIR/scripts/" 2>/dev/null || true

    echo -e "${GREEN}[RESTORE] Backup restoration completed${NC}"
}

# Réinitialisation systèmes critiques
reinitialize_systems() {
    echo -e "${YELLOW}[REINIT] Reinitializing critical systems...${NC}"

    # Recreate essential directories
    mkdir -p "$PROJECT_DIR/app/src/artifacts"
    mkdir -p "$PROJECT_DIR/app/src/lib"
    mkdir -p "$PROJECT_DIR/scripts/hooks"
    mkdir -p "$PROJECT_DIR/scripts/safeguards"

    # Fix permissions
    find "$PROJECT_DIR/scripts" -name "*.sh" -exec chmod +x {} \;

    # Validate critical files exist
    local critical_files=(
        "FOS-PLAN-MASTER-v2.md"
        "FOS-MONITORING.md"
        "FOS-JOURNAL.md"
    )

    for file in "${critical_files[@]}"; do
        if [ ! -f "$PROJECT_DIR/$file" ]; then
            echo -e "${RED}[MISSING] Critical file after recovery: $file${NC}"
        fi
    done

    echo -e "${GREEN}[REINIT] System reinitialization completed${NC}"
}

# Actions principales
case "$ACTION" in
    "status")
        health_score=$(assess_health)
        if [ "$health_score" -ge 80 ]; then
            echo -e "${GREEN}[STATUS] System healthy${NC}"
            exit 0
        elif [ "$health_score" -ge 50 ]; then
            echo -e "${YELLOW}[STATUS] System needs attention${NC}"
            exit 1
        else
            echo -e "${RED}[STATUS] System critical - recovery recommended${NC}"
            exit 2
        fi
        ;;

    "recover")
        case "$RECOVERY_TYPE" in
            "auto")
                auto_recovery
                ;;
            "partial")
                partial_recovery
                ;;
            "full")
                full_recovery
                ;;
            *)
                echo "Usage: $0 recover {auto|partial|full}"
                exit 1
                ;;
        esac
        ;;

    "test")
        echo -e "${YELLOW}[TEST] Testing recovery capabilities...${NC}"

        # Test backup availability
        if [ -L "$BACKUP_DIR/latest" ]; then
            echo -e "${GREEN}[TEST] Emergency backup available${NC}"
        else
            echo -e "${RED}[TEST] No emergency backup${NC}"
        fi

        # Test checkpoint availability
        if [ -L "$CHECKPOINT_DIR/latest-checkpoint" ]; then
            echo -e "${GREEN}[TEST] Latest checkpoint available${NC}"
        else
            echo -e "${RED}[TEST] No checkpoint available${NC}"
        fi

        # Test health assessment
        health_score=$(assess_health)
        echo -e "${YELLOW}[TEST] Health assessment completed ($health_score/100)${NC}"
        ;;

    *)
        echo "Usage: $0 {status|recover {auto|partial|full}|test}"
        exit 1
        ;;
esac

echo -e "${GREEN}[RECOVERY MANAGER] Operation completed${NC}"
exit 0