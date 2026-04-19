#!/usr/bin/env bash
# po-init.sh — Orchestrateur P1 : archive + scaffold Notion + Asana
# Spec : docs/core/product.md section 9 (Execution flow)
# Pattern honnete P-11 : bash ne peut invoquer MCP directement.
#   Script genere manifest JSON d'actions, Claude lit + execute MCP calls.
# Decision : D-PRODUCT-01
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
# (validees 2026-04-19, pre-plan D-PRODUCT-01)

NOTION_EXISTING_SPACE_ID="33721e30-0c7b-812d-923a-f0f229508a24"
ASANA_WORKSPACE_GID="1213280972575193"

# --- Detection conditions actuelles (Kevin a peut-etre deja nettoye) ---

NOTION_STATE="unknown"
ASANA_STATE="unknown"

echo -e "${YELLOW}[INFO]${NC} po-init.sh — Orchestrateur archive + scaffold Notion + Asana"
echo "  Workspace Asana : ${ASANA_WORKSPACE_GID}"
echo "  Notion space existant : ${NOTION_EXISTING_SPACE_ID}"
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
  "version": "1.0",
  "dry_run": ${DRY_RUN},
  "decision": "D-PRODUCT-01",
  "phase": "P1",
  "state_before": {
    "notion_existing_space_id": "${NOTION_EXISTING_SPACE_ID}",
    "asana_workspace_gid": "${ASANA_WORKSPACE_GID}",
    "asana_projects_existing": "verifies via MCP avant exec"
  },
  "actions": [
    {
      "id": "1-notion-archive-rename",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-update-page",
      "params": {
        "data": {
          "page_id": "${NOTION_EXISTING_SPACE_ID}",
          "properties": {
            "title": "🪐 Foundation OS — Archive 2026-04"
          }
        }
      },
      "description": "Rename espace Notion existant (9 sous-pages stale preservees)",
      "skip_if": "page renamed deja (title contient 'Archive')"
    },
    {
      "id": "2-notion-create-new-root",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-pages",
      "params_hint": "Create page '🪐 Foundation OS' at root avec icon 🪐 + description overview",
      "description": "Nouveau espace root propre"
    },
    {
      "id": "3-notion-create-db-decisions",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-database",
      "params_hint": "DB 'Decisions' dans nouveau root. Proprietes : Title (title), Code (rich_text D-XXX-NN), Date (date), Module (select), Status (select: Active/Superseded/Archive), Source ref (url)",
      "description": "DB Decisions miroir CONTEXT.md section Decisions"
    },
    {
      "id": "4-notion-create-db-plans",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-database",
      "params_hint": "DB 'Plans' dans nouveau root. Proprietes : Title (title), Slug (rich_text), Decision ref (rich_text), Status (select: draft/active/done/archived), Phases total (number), Phases done (number), Effort (rich_text), Path (rich_text)",
      "description": "DB Plans miroir docs/plans/ + .archive/plans-done-*/"
    },
    {
      "id": "5-notion-create-db-sessions",
      "tool": "mcp__e8eb411f-9903-4db1-86de-94c7ef74367d__notion-create-database",
      "params_hint": "DB 'Sessions' dans nouveau root. Proprietes : Date (date), Duration (rich_text), Scope (rich_text), Commits (rich_text), Decisions ref (rich_text), Livraison (rich_text), Revelations (rich_text)",
      "description": "DB Sessions miroir wiki/meta/sessions-recent.md"
    },
    {
      "id": "6-asana-create-project-preview",
      "tool": "mcp__4458e48d-de09-4bf1-a4d5-be4fab8409f7__create_project_preview",
      "params_hint": "project_name='Foundation OS', sections = 6 modules (🧠 Core OS, 💻 App Builder, 🎨 Design System, 📚 Knowledge, 🤝 Cowork, 🚀 Phase 5), 1+ tasks par section avec priorite + dates",
      "description": "Preview projet Asana → confirmation UI Kevin → projet cree",
      "note": "MCP ne supporte pas create_project direct. Preview declenche UI confirmation."
    }
  ],
  "expected_results": {
    "notion_new_root_id": "TBD (fill after action 2)",
    "notion_db_decisions_id": "TBD (fill after action 3)",
    "notion_db_plans_id": "TBD (fill after action 4)",
    "notion_db_sessions_id": "TBD (fill after action 5)",
    "asana_new_project_gid": "TBD (fill after Kevin confirm preview action 6)",
    "asana_project_sections_gids": "TBD (6 sections)"
  },
  "persist_target": ".omc/product-config.json",
  "notes": [
    "Pattern honnete P-11 : bash ne peut invoquer MCP, Claude execute calls.",
    "Apres chaque action, remplir expected_results avec IDs reels.",
    "Archive projets Asana anciens : MANUEL Kevin (MCP limite, pas update_project).",
    "create_project_preview requiert confirmation UI Kevin (clic dans Asana app).",
    "Idempotence : re-invoque po-init.sh -> nouveau manifest timestamp distinct. Actions MCP doivent verifier existence avant create (ex: notion-search 'Foundation OS' avant create_pages)."
  ]
}
EOF

echo -e "${GREEN}[OK]${NC} Manifest genere : $MANIFEST_FILE"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}[DRY-RUN]${NC} Pas d'execution MCP. Claude doit lire manifest + executer."
  echo "  cat $MANIFEST_FILE | jq .actions"
else
  echo -e "${GREEN}Next step${NC} : Claude lit $MANIFEST_FILE et execute MCP calls :"
  echo "  1. notion-update-page (archive rename espace existant)"
  echo "  2. notion-create-pages (nouveau root)"
  echo "  3. notion-create-database x3 (Decisions / Plans / Sessions)"
  echo "  4. create_project_preview (Kevin confirme UI -> projet Asana cree)"
  echo ""
  echo "Apres execution : persister IDs dans .omc/product-config.json"
fi

exit 0
