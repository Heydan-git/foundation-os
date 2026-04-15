#!/usr/bin/env bash
# auto-archive-plans.sh — Archive automatique des plans DONE dans docs/plans/
# Detection : tous les `[x]` dans Execution log (zero `[ ]`) OU status:done/closed dans frontmatter
# Appele par hook SessionEnd + manuellement via /session-end
# Spec : docs/core/planner.md + CLAUDE.md "Plans termines = auto-archive"

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

PLANS_DIR="docs/plans"
TODAY_YMD=$(date +%y%m%d)
ARCHIVE_DIR=".archive/plans-done-${TODAY_YMD}"

if [ ! -d "$PLANS_DIR" ]; then
  exit 0
fi

ARCHIVED_COUNT=0
ARCHIVED_LIST=()

for plan in "$PLANS_DIR"/*.md; do
  [ -f "$plan" ] || continue
  basename=$(basename "$plan")

  # Skip template
  case "$basename" in
    _template-plan.md|_*) continue ;;
  esac

  # Check frontmatter status (done/closed)
  if grep -qE "^status:\s*(done|closed)$" "$plan"; then
    mkdir -p "$ARCHIVE_DIR"
    git mv "$plan" "$ARCHIVE_DIR/$basename" 2>/dev/null || mv "$plan" "$ARCHIVE_DIR/$basename"
    ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
    ARCHIVED_LIST+=("$basename (status:done)")
    continue
  fi

  # Check Execution log : contient-il au moins un [ ] (non coche) ?
  # Si non (tous coches OU section absente mais autres sections cochees), c'est DONE.
  UNCHECKED=$(grep -cE "^[[:space:]]*-[[:space:]]*\[ \]" "$plan" 2>/dev/null | head -1 | tr -d '[:space:]')
  CHECKED=$(grep -cE "^[[:space:]]*-[[:space:]]*\[x\]" "$plan" 2>/dev/null | head -1 | tr -d '[:space:]')
  UNCHECKED=${UNCHECKED:-0}
  CHECKED=${CHECKED:-0}

  # Plan considere DONE si :
  # - Au moins 3 cases cochees (le plan a ete execute)
  # - ET 0 case non cochee
  if [ "$UNCHECKED" -eq 0 ] && [ "$CHECKED" -ge 3 ]; then
    mkdir -p "$ARCHIVE_DIR"
    git mv "$plan" "$ARCHIVE_DIR/$basename" 2>/dev/null || mv "$plan" "$ARCHIVE_DIR/$basename"
    ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
    ARCHIVED_LIST+=("$basename (${CHECKED} cases [x], 0 restante)")
  fi
done

# Output pour la session en cours
if [ "$ARCHIVED_COUNT" -gt 0 ]; then
  echo ""
  echo "[auto-archive] $ARCHIVED_COUNT plan(s) DONE archive(s) vers $ARCHIVE_DIR :"
  for item in "${ARCHIVED_LIST[@]}"; do
    echo "  - $item"
  done
  echo ""
fi

exit 0
