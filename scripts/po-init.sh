#!/usr/bin/env bash
# po-init.sh — Orchestrateur P1/P1.5 : archive + scaffold Notion (Notion-only post-pivot P1.5)
# Spec : docs/core/product.md section 9 (Execution flow)
# Pattern honnete P-11 : bash ne peut invoquer MCP directement.
#   Script genere manifest JSON d'actions, Claude lit + execute MCP calls.
# Decision : D-PRODUCT-01 (pivot Notion-only P1.5 2026-04-19)
#
# Usage :
#   bash scripts/po-init.sh [--dry-run]
#
# Exit codes :
#   0 : manifest genere OK
#   1 : erreur preconditions (jq manquant, pas dans un repo git, etc.)
#   2 : manifest deja existant cette minute (evite overwrite)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Colors ---

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DRY_RUN=false
if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
fi

# --- Preconditions ---

if ! command -v jq &>/dev/null; then
  echo -e "${RED}[ERROR]${NC} jq required (brew install jq)" >&2
  exit 1
fi

# --- IDs decouverts au pre-check MCP ---
# (validees 2026-04-19, pre-plan D-PRODUCT-01, updated pivot P1.5)

NOTION_EXISTING_SPACE_ID="33721e30-0c7b-812d-923a-f0f229508a24"
NOTION_NEW_SPACE_ID="34721e30-0c7b-8109-ad34-cc6baec0f265"
NOTION_DB_DECISIONS_ID="8abb85ef-8806-49a0-ba08-c58b464ce4c9"
NOTION_DB_PLANS_ID="47fda921-85b6-43cf-a7ec-efbc03d3b953"
NOTION_DB_SESSIONS_ID="218baff4-e4fe-4e9d-b59d-ccdcc130d355"
NOTION_DB_TASKS_ID="716e6844-eca0-4a33-9c40-7a52f6ed07b3"

# --- Info ---

echo -e "${YELLOW}[INFO]${NC} po-init.sh — Orchestrateur archive + scaffold Notion"
echo "  Pivot P1.5 : Notion-only (Asana abandonne)"
echo "  Notion space actif : ${NOTION_NEW_SPACE_ID}"
echo "  Notion 4 DB : Decisions / Plans / Sessions / Tasks"
echo ""

# --- Manifest generation ---

MANIFEST_DIR=".omc/po-manifests"
mkdir -p "$MANIFEST_DIR"
TIMESTAMP=$(date +%Y-%m-%d-%H%M)
MANIFEST_FILE="${MANIFEST_DIR}/${TIMESTAMP}-init.json"

if [ -f "$MANIFEST_FILE" ]; then
  echo -e "${YELLOW}[WARN]${NC} Manifest deja existant : $MANIFEST_FILE"
  echo "Re-invoque dans 1 minute (timestamp YYYY-MM-DD-HHMM)"
  exit 2
fi

cat > "$MANIFEST_FILE" << EOF
{
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "script": "po-init.sh",
  "version": "1.1",
  "dry_run": ${DRY_RUN},
  "decision": "D-PRODUCT-01",
  "phase": "P1.5 pivot Notion-only",
  "state_current": {
    "notion_new_space_id": "${NOTION_NEW_SPACE_ID}",
    "notion_archived_space_id": "${NOTION_EXISTING_SPACE_ID}",
    "notion_db_decisions_id": "${NOTION_DB_DECISIONS_ID}",
    "notion_db_plans_id": "${NOTION_DB_PLANS_ID}",
    "notion_db_sessions_id": "${NOTION_DB_SESSIONS_ID}",
    "notion_db_tasks_id": "${NOTION_DB_TASKS_ID}",
    "asana_status": "ABANDONED P1.5 (payant + MCP limite)"
  },
  "actions_optional_views": [
    {
      "id": "view-tasks-kanban-status",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-view",
      "params_hint": "DB Tasks view layout=board group_by=Status. Kanban Todo|In Progress|Done|Blocked.",
      "description": "Kanban vue principal Tasks (groupe par Status)",
      "required": false
    },
    {
      "id": "view-tasks-kanban-module",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-view",
      "params_hint": "DB Tasks view layout=board group_by=Module. Kanban par module (Core OS, App Builder, etc).",
      "description": "Kanban alternatif Tasks (groupe par Module)",
      "required": false
    },
    {
      "id": "view-tasks-timeline",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-view",
      "params_hint": "DB Tasks view layout=timeline date=Due date. Gantt.",
      "description": "Timeline Tasks par Due date",
      "required": false
    },
    {
      "id": "view-plans-timeline",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-view",
      "params_hint": "DB Plans view layout=timeline date=Created. Vue historique des plans.",
      "description": "Timeline Plans par Created date",
      "required": false
    }
  ],
  "persist_target": ".omc/product-config.json",
  "notes": [
    "P1 initial fait : archive Notion + create new root + 3 DB (Decisions/Plans/Sessions) + stubs scripts/agent/skill.",
    "P1.5 pivot Notion-only : add DB Tasks (pivot, remplace ex-Asana kanban) + rewrite po-agent/po/product.md. Abandon Asana.",
    "Views optionnelles : Kanban by Status, Kanban by Module, Timeline Tasks, Timeline Plans. A creer en P2 ou manuellement via Notion UI.",
    "Archive projet Asana (si Kevin avait cree) : manuel UI Kevin (MCP Asana ne supporte pas archive)."
  ]
}
EOF

echo -e "${GREEN}[OK]${NC} Manifest genere : $MANIFEST_FILE"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}[DRY-RUN]${NC} Pas d'execution MCP. Claude doit lire manifest + executer actions optionnelles (views)."
  echo "  cat $MANIFEST_FILE | jq ."
else
  echo -e "${GREEN}Etat${NC} : Notion-only setup complete."
  echo "  - Archive : ${NOTION_EXISTING_SPACE_ID} (🪐 Foundation OS — Archive 2026-04)"
  echo "  - Root actif : ${NOTION_NEW_SPACE_ID} (🪐 Foundation OS)"
  echo "  - DB Decisions : ${NOTION_DB_DECISIONS_ID}"
  echo "  - DB Plans : ${NOTION_DB_PLANS_ID}"
  echo "  - DB Sessions : ${NOTION_DB_SESSIONS_ID}"
  echo "  - DB Tasks : ${NOTION_DB_TASKS_ID} (pivot P1.5)"
  echo ""
  echo -e "${GREEN}Next${NC} : Claude peut creer views (optionnel) via notion-create-view."
  echo "  Config persistee dans .omc/product-config.json"
fi

exit 0
