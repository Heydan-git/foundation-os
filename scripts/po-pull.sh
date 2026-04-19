#!/usr/bin/env bash
# po-pull.sh — Orchestrateur pull Notion -> FOS (propose updates)
# Spec : docs/core/product.md section 9 (scenario pull)
# Pattern honnete P-11 : genere manifest JSON lecture, Claude execute MCP queries.
# Decision : D-PRODUCT-01 (pivot Notion-only P1.5)
#
# Usage :
#   bash scripts/po-pull.sh [--preview|--apply|--interactive] [--quiet]
#
# Modes :
#   --preview (default) : affiche diff sans apply
#   --apply : auto-apply updates triviales (Status change, priorite kanban)
#   --interactive : demande confirmation par update (via AskUserQuestion si Claude)
#
# Exit codes :
#   0 : manifest genere, aucune divergence
#   1 : erreur preconditions
#   2 : divergences detectees (apply requis pour sync)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Colors ---

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[0;90m'
NC='\033[0m'

# --- Parse args ---

MODE="preview"
QUIET=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --preview) MODE="preview"; shift ;;
    --apply) MODE="apply"; shift ;;
    --interactive) MODE="interactive"; shift ;;
    --quiet) QUIET=true; shift ;;
    *)
      [[ "$QUIET" = false ]] && echo -e "${RED}[ERROR]${NC} Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

log() { [[ "$QUIET" = false ]] && echo -e "$@"; }

# --- Preconditions ---

if ! command -v jq &>/dev/null; then
  log "${RED}[ERROR]${NC} jq required (brew install jq)"
  exit 1
fi

CONFIG_FILE=".omc/product-config.json"
if [[ ! -f "$CONFIG_FILE" ]]; then
  log "${RED}[ERROR]${NC} $CONFIG_FILE missing. Run 'bash scripts/po-init.sh' first."
  exit 1
fi

DB_DECISIONS=$(jq -r '.notion.databases.decisions.data_source_id // empty' "$CONFIG_FILE")
DB_PLANS=$(jq -r '.notion.databases.plans.data_source_id // empty' "$CONFIG_FILE")
DB_SESSIONS=$(jq -r '.notion.databases.sessions.data_source_id // empty' "$CONFIG_FILE")
DB_TASKS=$(jq -r '.notion.databases.tasks.data_source_id // empty' "$CONFIG_FILE")

if [[ -z "$DB_DECISIONS" ]]; then
  log "${RED}[ERROR]${NC} Notion DB IDs missing in $CONFIG_FILE"
  exit 1
fi

# --- Last sync timestamps ---

LAST_SYNC_FILE=".omc/po-last-sync.json"
if [[ ! -f "$LAST_SYNC_FILE" ]]; then
  echo '{"last_pull": null, "last_push": null}' > "$LAST_SYNC_FILE"
fi
LAST_PULL=$(jq -r '.last_pull // "never"' "$LAST_SYNC_FILE")
LAST_PUSH=$(jq -r '.last_push // "never"' "$LAST_SYNC_FILE")

# --- Manifest generation ---

MANIFEST_DIR=".omc/po-manifests"
mkdir -p "$MANIFEST_DIR"
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
MANIFEST_FILE="${MANIFEST_DIR}/${TIMESTAMP}-pull.json"

log "${YELLOW}[INFO]${NC} po-pull.sh — Pull Notion -> FOS"
log "  ${DIM}Mode : ${MODE}${NC}"
log "  ${DIM}Last pull : ${LAST_PULL}${NC}"
log "  ${DIM}Last push : ${LAST_PUSH}${NC}"
log ""

cat > "$MANIFEST_FILE" << EOF
{
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "script": "po-pull.sh",
  "version": "1.0",
  "decision": "D-PRODUCT-01",
  "phase": "P3+",
  "mode": "${MODE}",
  "last_pull": "${LAST_PULL}",
  "last_push": "${LAST_PUSH}",
  "targets": {
    "db_decisions": "${DB_DECISIONS}",
    "db_plans": "${DB_PLANS}",
    "db_sessions": "${DB_SESSIONS}",
    "db_tasks": "${DB_TASKS}"
  },
  "actions_suggested": [
    {
      "order": 1,
      "source_db": "tasks",
      "operation": "query filtered by modified_at > last_pull (detect Kevin drag kanban Status)",
      "mcp_tool": "notion-fetch on data_source_url + filter",
      "map_to_fos": "TodoWrite state (Status Todo/In Progress/Done)"
    },
    {
      "order": 2,
      "source_db": "tasks",
      "operation": "query tasks with new comments (Kevin feedback sur US/Phase)",
      "mcp_tool": "notion-get-comments per task page_id",
      "map_to_fos": "append commentaires dans .omc/product-state.json pour brief tuile #17"
    },
    {
      "order": 3,
      "source_db": "plans",
      "operation": "query plans Status changed (Kevin force archive OR reactive)",
      "mcp_tool": "notion-fetch data_source",
      "map_to_fos": "Update docs/plans/<slug>.md frontmatter status si Kevin a change"
    },
    {
      "order": 4,
      "source_db": "decisions",
      "operation": "query decisions Status changed (Kevin force Superseded)",
      "mcp_tool": "notion-fetch data_source",
      "map_to_fos": "Update CONTEXT.md table Decisions Status column"
    }
  ],
  "diff_detection_rules": [
    "Pour chaque entity Notion, comparer modified_at vs last_pull timestamp",
    "Si modified_at > last_pull -> flag comme 'Kevin edited'",
    "Pour DB Tasks Status : si valeur diffère de FOS TodoWrite correspondant -> diff",
    "Pour DB Plans Status : si valeur diffère de frontmatter plan MD -> diff",
    "Generer .omc/po-diffs/YYYY-MM-DD-HHMM-diff.json avec liste diffs"
  ],
  "apply_rules_if_mode_apply": [
    "Status Todo/In Progress/Done kanban -> update TodoWrite equivalent",
    "Comments Notion -> append dans .omc/product-state.json (pour brief #17)",
    "Priority change -> reorder TodoWrite si High",
    "Jamais auto-apply si conflit detecte (FOS MD modifie ET Notion modifie depuis last_push)"
  ],
  "conflict_rule": "last-write-wins par champ (timestamp modified_at le plus recent). Log .omc/po-conflicts.log avec diff avant/apres. Pas de 3-way merge.",
  "rate_limit_rules": {
    "notion_max_req_per_sec": 3,
    "queries_estimated": "4 (1 par DB)",
    "sleep_between_queries_ms": 350
  },
  "notes": [
    "Pattern honnete P-11 : bash ne peut invoquer MCP, Claude execute queries.",
    "Modes --preview / --apply / --interactive guident le comportement de Claude post-lecture manifest.",
    "Apres execution, Claude ecrit resultats .omc/po-results/ + update .omc/po-last-sync.json.",
    "Tuile brief v12 #17 PRODUCT source les donnees depuis .omc/product-state.json."
  ]
}
EOF

log "${GREEN}[OK]${NC} Manifest genere : ${MANIFEST_FILE}"
log ""
log "${DIM}4 actions suggerees :${NC}"
log "  ${DIM}1. Query DB Tasks modifies (kanban Status drag)${NC}"
log "  ${DIM}2. Query DB Tasks comments (Kevin feedback)${NC}"
log "  ${DIM}3. Query DB Plans Status changes${NC}"
log "  ${DIM}4. Query DB Decisions Status changes${NC}"
log ""
log "${GREEN}Next step${NC} : Claude lit manifest + execute MCP queries Notion."
log "  ${DIM}cat ${MANIFEST_FILE} | jq .actions_suggested${NC}"

case "$MODE" in
  preview) log "${YELLOW}[PREVIEW]${NC} Affiche diff sans apply. Kevin doit relancer --apply pour sync." ;;
  apply) log "${YELLOW}[APPLY]${NC} Updates triviales auto-appliquees (Status, comments)." ;;
  interactive) log "${YELLOW}[INTERACTIVE]${NC} Claude demandera confirmation par update via AskUserQuestion." ;;
esac

exit 0
