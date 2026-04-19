#!/usr/bin/env bash
# po-pull.sh — Orchestrateur pull Notion + Asana -> FOS (propose updates)
# Spec : docs/core/product.md section 9 (Execution flow scenario pull)
# Decision : D-PRODUCT-01
#
# STUB P1 — Implementation complete en P3 (plan docs/plans/2026-04-19-product-module-full-integration.md).
#
# Usage (apres P3) :
#   bash scripts/po-pull.sh [--preview|--apply|--interactive] [--quiet]
#
# Exit codes :
#   0 : manifest genere OK (stub P1 : exit 0 avec message pending)
#   1 : erreur preconditions
#   2 : diff detecte, apply requis

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

QUIET=false
for arg in "$@"; do
  if [ "$arg" = "--quiet" ]; then
    QUIET=true
  fi
done

if [ "$QUIET" = false ]; then
  echo "po-pull.sh — STUB P1 pending (impl P3)"
  echo "  Mode : detect Notion DB + Asana tasks changes -> diff vs FOS -> TodoWrite propose"
  echo "  Modes prevus : --preview / --apply / --interactive"
  echo "  Plan : docs/plans/2026-04-19-product-module-full-integration.md (P3)"
fi

exit 0
