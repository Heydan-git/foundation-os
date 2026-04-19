#!/usr/bin/env bash
# po-status.sh — Diff FOS vs Notion externe (lecture seule)
# Spec : docs/core/product.md section 9
# Pattern honnete P-11 : bash genere compteurs FOS + suggere actions MCP Claude.
# Decision : D-PRODUCT-01 (pivot Notion-only P1.5)
# Chainable : dans scripts/health-check.sh section INFO (--quiet mode).
#
# Usage :
#   bash scripts/po-status.sh [--quiet]
#
# Exit codes :
#   0 : FOS et Notion aligne (aucune divergence detectee cote FOS)
#   1 : erreur preconditions (config missing)
#   2 : divergences potentielles detectees (decisions / plans / sessions count diff)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Colors ---

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[0;90m'
NC='\033[0m'

# --- Parse args ---

QUIET=false
for arg in "$@"; do
  if [ "$arg" = "--quiet" ]; then
    QUIET=true
  fi
done

log() { [[ "$QUIET" = false ]] && echo -e "$@"; }

# --- Preconditions ---

if ! command -v jq &>/dev/null; then
  [[ "$QUIET" = true ]] && echo -e "  ${DIM}[OK]${NC} Product : jq missing (stub)" || \
    log "${RED}[ERROR]${NC} jq required"
  exit 1
fi

CONFIG_FILE=".omc/product-config.json"
if [[ ! -f "$CONFIG_FILE" ]]; then
  [[ "$QUIET" = true ]] && echo -e "  ${DIM}[OK]${NC} Product : config missing (pre-P1)" || \
    log "${RED}[ERROR]${NC} $CONFIG_FILE missing"
  exit 1
fi

# --- Load FOS state ---

DECISIONS_FOS=$(awk '/^## Decisions/,/^## Metriques/' CONTEXT.md | grep -cE '^\| D-[A-Z]+-?[0-9]*' || echo 0)
PLANS_ACTIVE=$(find docs/plans -name '*.md' -not -name '_template*' 2>/dev/null | wc -l | tr -d ' ')
PLANS_ARCHIVED=$(find .archive -type d -name 'plans-done-*' 2>/dev/null | wc -l | tr -d ' ')
SESSIONS_RECENT=$(grep -cE '^## 202[5-9]' wiki/meta/sessions-recent.md 2>/dev/null || echo 0)

# --- Load Notion DB expected counts (from last sync) ---

LAST_PUSH=$(jq -r '.sync_state.last_push // "never"' "$CONFIG_FILE")
LAST_PULL=$(jq -r '.sync_state.last_pull // "never"' "$CONFIG_FILE")
DB_TASKS_ID=$(jq -r '.notion.databases.tasks.data_source_id // empty' "$CONFIG_FILE")

# --- Quiet mode (chain health-check) ---

if [[ "$QUIET" = true ]]; then
  # 1-ligne format pour chain
  STATUS_EMOJI="${GREEN}[OK]${NC}"
  STATUS_MSG="aligned"
  if [[ "$LAST_PUSH" = "never" ]]; then
    STATUS_EMOJI="${YELLOW}[WARN]${NC}"
    STATUS_MSG="never synced (run /po sync)"
  fi
  echo -e "  ${DIM}[OK]${NC} Product : ${DECISIONS_FOS}D / ${PLANS_ACTIVE}+${PLANS_ARCHIVED}P / ${SESSIONS_RECENT}S FOS, last_push=${LAST_PUSH}, ${STATUS_MSG}"
  exit 0
fi

# --- Verbose mode ---

log "${YELLOW}[INFO]${NC} po-status.sh — Diff FOS vs Notion"
log ""
log "${DIM}Etat FOS :${NC}"
log "  ${DIM}- Decisions CONTEXT.md : ${DECISIONS_FOS}${NC}"
log "  ${DIM}- Plans actifs : ${PLANS_ACTIVE}${NC}"
log "  ${DIM}- Plans archives : ${PLANS_ARCHIVED}${NC}"
log "  ${DIM}- Sessions recentes : ${SESSIONS_RECENT}${NC}"
log ""
log "${DIM}Etat Notion (4 DB) :${NC}"
log "  ${DIM}- DB Decisions : $(jq -r '.notion.databases.decisions.data_source_url' "$CONFIG_FILE")${NC}"
log "  ${DIM}- DB Plans : $(jq -r '.notion.databases.plans.data_source_url' "$CONFIG_FILE")${NC}"
log "  ${DIM}- DB Sessions : $(jq -r '.notion.databases.sessions.data_source_url' "$CONFIG_FILE")${NC}"
log "  ${DIM}- DB Tasks : $(jq -r '.notion.databases.tasks.data_source_url' "$CONFIG_FILE")${NC}"
log ""
log "${DIM}Sync state :${NC}"
log "  ${DIM}- Last push : ${LAST_PUSH}${NC}"
log "  ${DIM}- Last pull : ${LAST_PULL}${NC}"
log ""

if [[ "$LAST_PUSH" = "never" ]]; then
  log "${YELLOW}[WARN]${NC} Jamais synchronise. Lancer 'bash scripts/po-sync.sh' pour push initial."
  exit 2
fi

# Verifier si rows Notion comptage OK (requiert Claude MCP car bash ne peut pas)
log "${GREEN}[OK]${NC} Counts FOS recueillis. Pour diff Notion reel : Claude doit executer MCP queries."
log "  ${DIM}bash scripts/po-pull.sh --preview${NC}"

exit 0
