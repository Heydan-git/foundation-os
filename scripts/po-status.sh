#!/usr/bin/env bash
# po-status.sh — Diff FOS vs Notion+Asana externe
# Spec : docs/core/product.md section 9
# Decision : D-PRODUCT-01
#
# STUB P1 — Implementation complete en P3 (plan docs/plans/2026-04-19-product-module-full-integration.md).
# Chainable dans scripts/health-check.sh section INFO (--quiet mode).
#
# Usage (apres P3) :
#   bash scripts/po-status.sh [--quiet]
#
# Exit codes :
#   0 : FOS et externe synchronises
#   1 : erreur preconditions
#   2 : divergences detectees

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

QUIET=false
for arg in "$@"; do
  if [ "$arg" = "--quiet" ]; then
    QUIET=true
  fi
done

if [ "$QUIET" = false ]; then
  echo "po-status.sh — STUB P1 pending (impl P3)"
  echo "  Mode : compte decisions/plans/sessions FOS vs externe"
  echo "  Output : table divergences + conflits log + last-sync timestamp"
  echo "  Plan : docs/plans/2026-04-19-product-module-full-integration.md (P3)"
else
  # Mode quiet (chain health-check INFO) : 1-ligne
  echo "  [0;90m[OK][0m Product : stub P1 (pending P2-P3)"
fi

exit 0
