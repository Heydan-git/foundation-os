#!/usr/bin/env bash
# po-sync.sh — Orchestrateur push FOS -> Notion (4 DB)
# Spec : docs/core/product.md section 9 (scenario push)
# Pattern honnete P-11 : genere manifest JSON, Claude execute MCP calls.
# Decision : D-PRODUCT-01 (pivot Notion-only P1.5)
#
# Usage :
#   bash scripts/po-sync.sh [--dry-run] [--plan <slug>] [--since YYYY-MM-DD] [--quiet]
#
# Exit codes :
#   0 : manifest genere (actions suggerees pour Claude)
#   1 : erreur preconditions (config missing, jq absent)
#   2 : rien a sync (no delta, tous items deja presents)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Colors ---

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[0;90m'
NC='\033[0m'

# --- Parse args ---

DRY_RUN=false
QUIET=false
PLAN_FILTER=""
SINCE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=true; shift ;;
    --quiet) QUIET=true; shift ;;
    --plan) PLAN_FILTER="${2:-}"; shift 2 ;;
    --since) SINCE="${2:-}"; shift 2 ;;
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

# --- Load config IDs ---

DB_DECISIONS=$(jq -r '.notion.databases.decisions.data_source_id // empty' "$CONFIG_FILE")
DB_PLANS=$(jq -r '.notion.databases.plans.data_source_id // empty' "$CONFIG_FILE")
DB_SESSIONS=$(jq -r '.notion.databases.sessions.data_source_id // empty' "$CONFIG_FILE")
DB_TASKS=$(jq -r '.notion.databases.tasks.data_source_id // empty' "$CONFIG_FILE")

if [[ -z "$DB_DECISIONS" ]]; then
  log "${RED}[ERROR]${NC} Notion DB IDs missing in $CONFIG_FILE"
  exit 1
fi

# --- Parse FOS state ---

DECISIONS_COUNT=$(awk '/^## Decisions/,/^## Metriques/' CONTEXT.md | grep -cE '^\| D-[A-Z]+-?[0-9]*' || echo 0)
PLANS_ACTIVE=$(find docs/plans -name '*.md' -not -name '_template*' 2>/dev/null | wc -l | tr -d ' ')
PLANS_ARCHIVED=$(find .archive -type d -name 'plans-done-*' 2>/dev/null | wc -l | tr -d ' ')
SESSIONS_RECENT=$(grep -cE '^## 202[5-9]' wiki/meta/sessions-recent.md 2>/dev/null || echo 0)

# --- Manifest path ---

MANIFEST_DIR=".omc/po-manifests"
mkdir -p "$MANIFEST_DIR"
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
MANIFEST_FILE="${MANIFEST_DIR}/${TIMESTAMP}-sync.json"

# --- Info header ---

log "${YELLOW}[INFO]${NC} po-sync.sh — Push FOS -> Notion"
log "  ${DIM}Mode : ${DRY_RUN:+dry-run}${NC}"
[[ -n "$PLAN_FILTER" ]] && log "  ${DIM}Filter plan : $PLAN_FILTER${NC}"
[[ -n "$SINCE" ]] && log "  ${DIM}Since : $SINCE${NC}"
log ""

# --- Generate manifest ---

cat > "$MANIFEST_FILE" << EOF
{
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "script": "po-sync.sh",
  "version": "1.0",
  "decision": "D-PRODUCT-01",
  "phase": "P2+",
  "args": {
    "dry_run": ${DRY_RUN},
    "plan_filter": "${PLAN_FILTER}",
    "since": "${SINCE}"
  },
  "targets": {
    "db_decisions": "${DB_DECISIONS}",
    "db_plans": "${DB_PLANS}",
    "db_sessions": "${DB_SESSIONS}",
    "db_tasks": "${DB_TASKS}"
  },
  "fos_state_parsed": {
    "decisions_count": ${DECISIONS_COUNT},
    "plans_active_count": ${PLANS_ACTIVE},
    "plans_archived_count": ${PLANS_ARCHIVED},
    "sessions_recent_count": ${SESSIONS_RECENT},
    "todowrite_state": "voir .omc/state/mission-state.json ou TodoWrite tool live"
  },
  "actions_suggested": [
    {
      "order": 1,
      "target_db": "decisions",
      "source_fos": "CONTEXT.md section Decisions table",
      "operation": "push (create si absent, update si present match par Code)",
      "batching": "1 call create_pages max 100 pages, sleep 350ms si > 1 call",
      "mapping": "| Title | Code | Date | Module | Status | Source ref | -> proprietes Notion"
    },
    {
      "order": 2,
      "target_db": "plans",
      "source_fos": "docs/plans/*.md (actifs) + .archive/plans-done-*/ (optionnel)",
      "operation": "push row par plan, parse frontmatter YAML",
      "mapping": "title, slug, decision, status, phases_total, phases_done, effort, path -> proprietes"
    },
    {
      "order": 3,
      "target_db": "sessions",
      "source_fos": "wiki/meta/sessions-recent.md (top 5 sections ## YYYY)",
      "operation": "push 5 rows",
      "mapping": "title extrait H2, date, duration, scope, commits, decisions ref, livraison, revelations"
    },
    {
      "order": 4,
      "target_db": "tasks",
      "source_fos": "phases des plans actifs + elements 6-stricts + TodoWrite state",
      "operation": "push rows Type=Phase (1 par phase), Type=Element (optionnel, 6 par phase), Type=Task (TodoWrite courant)",
      "mapping": "Plan ref relation vers row Plans, Phase P1-PN, Element 1-6, Status Todo/In Progress/Done/Blocked, Priority, Module, Type"
    }
  ],
  "rate_limit_rules": {
    "notion_max_req_per_sec": 3,
    "batch_create_pages_max": 100,
    "sleep_between_batches_ms": 350,
    "retry_on_429": "abort + log (pas de retry aggressif)",
    "timeout_per_call_ms": 10000
  },
  "idempotence_rules": [
    "Match par Code pour Decisions (D-XXX-NN unique)",
    "Match par Slug pour Plans",
    "Match par Date+Scope pour Sessions",
    "Match par Title+Phase pour Tasks",
    "Si match -> update via notion-update-page (properties)",
    "Si pas match -> create via notion-create-pages",
    "Update Synced at timestamp a chaque sync"
  ],
  "conflict_handling": {
    "rule": "last-write-wins par champ (timestamp modified_at le plus recent gagne)",
    "log_file": ".omc/po-conflicts.log",
    "no_3_way_merge": true
  },
  "notes": [
    "Pattern honnete P-11 : bash ne peut invoquer MCP, Claude execute les actions suggerees.",
    "Apres execution, ecrire resultats dans .omc/po-results/YYYY-MM-DD-HHMM-sync-results.json.",
    "Update .omc/product-config.json sync_state.last_push avec timestamp fin de sync.",
    "P2 initial (2026-04-19) : 16 decisions + 1 plan + 5 sessions + 6 tasks phases deja pushes via MCP direct."
  ]
}
EOF

log "${GREEN}[OK]${NC} Manifest genere : ${MANIFEST_FILE}"
log ""
log "${DIM}Etat FOS :${NC}"
log "  ${DIM}- ${DECISIONS_COUNT} decisions dans CONTEXT.md${NC}"
log "  ${DIM}- ${PLANS_ACTIVE} plans actifs + ${PLANS_ARCHIVED} archives${NC}"
log "  ${DIM}- ${SESSIONS_RECENT} sessions recentes${NC}"
log ""
log "${GREEN}Next step${NC} : Claude lit manifest + execute 4 actions MCP Notion."
log "  ${DIM}cat ${MANIFEST_FILE} | jq .actions_suggested${NC}"

if [[ "$DRY_RUN" = true ]]; then
  log ""
  log "${YELLOW}[DRY-RUN]${NC} Pas d'execution MCP. Manifest pret pour Claude post-analysis."
fi

exit 0
