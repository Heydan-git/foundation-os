#!/bin/bash
# error-monitor.sh - Error pattern detection and auto-correction
# Surveillance et correction automatique des patterns d'erreurs récurrents

set -e

ACTION="${1:-monitor}"
ERROR_LOG="/Users/kevinnoel/foundation-os/.omc/error-monitor.log"
PATTERN_DB="/Users/kevinnoel/foundation-os/.omc/error-patterns.db"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Initialiser base de données patterns d'erreurs
init_pattern_db() {
    mkdir -p "$(dirname "$PATTERN_DB")"

    cat > "$PATTERN_DB" << 'EOF'
# Foundation OS Error Patterns Database
# Format: ERROR_PATTERN|AUTO_FIX_COMMAND|DESCRIPTION

Error editing file|read_file_first|File not read before editing attempt
Build failed|npm_install_and_build|Build dependencies or syntax error
Command not found|chmod_plus_x|Script not executable
Permission denied|fix_permissions|File permissions issue
Module not found|npm_install|Missing npm dependencies
Cannot read property|check_file_exists|Undefined variable/property
Unexpected token|syntax_check|JavaScript/TypeScript syntax error
ENOENT.*package\.json|cd_to_correct_dir|Wrong working directory
\.jsx.*not found|check_artifact_path|Artifact file path incorrect
violates.*constraint|check_database_schema|Database constraint violation
EOF

    echo -e "${GREEN}[INIT] Error patterns database initialized${NC}"
}

# Logger une erreur
log_error() {
    local error_msg="$1"
    local context="$2"
    local timestamp=$(date -Iseconds)

    mkdir -p "$(dirname "$ERROR_LOG")"
    echo "[$timestamp] ERROR: $error_msg | CONTEXT: $context" >> "$ERROR_LOG"

    echo -e "${RED}[ERROR LOGGED] $error_msg${NC}"
}

# Analyser patterns d'erreurs
analyze_patterns() {
    local timeframe="${1:-1h}"

    echo -e "${YELLOW}[ANALYZE] Checking error patterns in last $timeframe...${NC}"

    if [ ! -f "$ERROR_LOG" ]; then
        echo -e "${GREEN}[ANALYZE] No errors logged yet${NC}"
        return 0
    fi

    # Dernières erreurs selon timeframe
    local since_time
    case "$timeframe" in
        "1h") since_time="-1 hour" ;;
        "1d") since_time="-1 day" ;;
        "1w") since_time="-1 week" ;;
        *) since_time="-1 hour" ;;
    esac

    local recent_errors=$(awk -v since="$(date -d "$since_time" -Iseconds 2>/dev/null || date -v-1H -Iseconds)" '$0 > since' "$ERROR_LOG" 2>/dev/null | wc -l)

    echo -e "${YELLOW}[ANALYZE] Found $recent_errors errors in last $timeframe${NC}"

    if [ "$recent_errors" -gt 0 ]; then
        echo -e "${YELLOW}[PATTERNS] Most common error types:${NC}"

        # Extract error patterns (simple approach for macOS compatibility)
        tail -20 "$ERROR_LOG" | grep -o 'ERROR: [^|]*' | sort | uniq -c | sort -nr | head -5
    fi
}

# Auto-correction basée sur patterns
auto_correct() {
    local error_pattern="$1"
    local context_path="$2"

    echo -e "${YELLOW}[AUTO-CORRECT] Attempting fix for: $error_pattern${NC}"

    [ ! -f "$PATTERN_DB" ] && init_pattern_db

    # Chercher pattern correspondant
    while IFS='|' read -r pattern fix_cmd description; do
        # Skip comments
        [[ "$pattern" =~ ^# ]] && continue

        if [[ "$error_pattern" =~ $pattern ]]; then
            echo -e "${YELLOW}[MATCH] Found pattern: $description${NC}"

            case "$fix_cmd" in
                "read_file_first")
                    if [ -n "$context_path" ] && [ -f "$context_path" ]; then
                        echo -e "${GREEN}[FIX] File exists, recommend Read before Edit${NC}"
                        return 0
                    fi
                    ;;

                "npm_install_and_build")
                    if [ -f "/Users/kevinnoel/foundation-os/app/package.json" ]; then
                        echo -e "${YELLOW}[FIX] Running npm install...${NC}"
                        cd /Users/kevinnoel/foundation-os/app
                        npm install >/dev/null 2>&1 && echo -e "${GREEN}[FIX] npm install completed${NC}"
                        cd /Users/kevinnoel/foundation-os
                        return 0
                    fi
                    ;;

                "chmod_plus_x")
                    if [ -n "$context_path" ] && [ -f "$context_path" ]; then
                        chmod +x "$context_path"
                        echo -e "${GREEN}[FIX] Made executable: $context_path${NC}"
                        return 0
                    fi
                    ;;

                "fix_permissions")
                    if [ -n "$context_path" ]; then
                        chmod 644 "$context_path" 2>/dev/null || chmod 755 "$context_path" 2>/dev/null
                        echo -e "${GREEN}[FIX] Fixed permissions: $context_path${NC}"
                        return 0
                    fi
                    ;;

                "check_file_exists")
                    if [ -n "$context_path" ]; then
                        if [ -f "$context_path" ]; then
                            echo -e "${GREEN}[FIX] File exists: $context_path${NC}"
                        else
                            echo -e "${RED}[FIX] File missing: $context_path${NC}"
                        fi
                        return 0
                    fi
                    ;;

                *)
                    echo -e "${YELLOW}[FIX] Custom fix: $fix_cmd${NC}"
                    ;;
            esac

            return 0
        fi
    done < "$PATTERN_DB"

    echo -e "${RED}[AUTO-CORRECT] No pattern match found for: $error_pattern${NC}"
    return 1
}

# Monitor en temps réel
monitor_realtime() {
    echo -e "${YELLOW}[MONITOR] Starting real-time error monitoring...${NC}"

    # Monitor build errors
    check_build_health() {
        if cd /Users/kevinnoel/foundation-os/app 2>/dev/null; then
            if ! npm run build >/dev/null 2>&1; then
                log_error "Build failed" "app directory"
                auto_correct "Build failed" "/Users/kevinnoel/foundation-os/app"
            fi
            cd /Users/kevinnoel/foundation-os
        fi
    }

    # Monitor file system health
    check_file_health() {
        local critical_files=(
            "FOS-PLAN-MASTER-v2.md"
            "FOS-MONITORING.md"
            "app/src/lib/supabase.ts"
        )

        for file in "${critical_files[@]}"; do
            if [ ! -f "/Users/kevinnoel/foundation-os/$file" ]; then
                log_error "Critical file missing" "$file"
            fi
        done
    }

    # Monitor git health
    check_git_health() {
        if ! git rev-parse --git-dir >/dev/null 2>&1; then
            log_error "Git repository corrupted" "$(pwd)"
        fi
    }

    # Run all health checks
    check_build_health
    check_file_health
    check_git_health

    echo -e "${GREEN}[MONITOR] Health check completed${NC}"
}

# Health status
health_status() {
    echo -e "${YELLOW}[HEALTH] Foundation OS Error Monitor Status${NC}"

    # Check error log size
    if [ -f "$ERROR_LOG" ]; then
        local error_count=$(wc -l < "$ERROR_LOG")
        local log_size=$(ls -lh "$ERROR_LOG" | awk '{print $5}')
        echo -e "${YELLOW}[STATUS] Total errors logged: $error_count ($log_size)${NC}"

        # Recent errors
        local recent_errors=$(tail -20 "$ERROR_LOG" | wc -l)
        echo -e "${YELLOW}[STATUS] Recent errors: $recent_errors${NC}"

        if [ "$error_count" -gt 100 ]; then
            echo -e "${RED}[WARNING] High error count - consider investigation${NC}"
        fi
    else
        echo -e "${GREEN}[STATUS] No errors logged${NC}"
    fi

    # Check pattern database
    if [ -f "$PATTERN_DB" ]; then
        local pattern_count=$(grep -v '^#' "$PATTERN_DB" | wc -l)
        echo -e "${GREEN}[STATUS] $pattern_count error patterns loaded${NC}"
    else
        echo -e "${YELLOW}[WARNING] Pattern database not initialized${NC}"
    fi
}

# Actions principales
case "$ACTION" in
    "init")
        init_pattern_db
        mkdir -p "$(dirname "$ERROR_LOG")"
        echo -e "${GREEN}[INIT] Error monitor initialized${NC}"
        ;;

    "log")
        error_msg="$2"
        context="$3"
        if [ -z "$error_msg" ]; then
            echo "Usage: $0 log \"error message\" [context]"
            exit 1
        fi
        log_error "$error_msg" "$context"
        ;;

    "analyze")
        timeframe="$2"
        analyze_patterns "$timeframe"
        ;;

    "fix")
        error_pattern="$2"
        context_path="$3"
        auto_correct "$error_pattern" "$context_path"
        ;;

    "monitor")
        monitor_realtime
        ;;

    "health")
        health_status
        ;;

    "clear")
        [ -f "$ERROR_LOG" ] && rm "$ERROR_LOG"
        echo -e "${GREEN}[CLEAR] Error log cleared${NC}"
        ;;

    *)
        echo "Usage: $0 {init|log <msg> [context]|analyze [timeframe]|fix <pattern> [path]|monitor|health|clear}"
        exit 1
        ;;
esac

exit 0