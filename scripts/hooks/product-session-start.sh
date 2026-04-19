#!/usr/bin/env bash
# product-session-start.sh — Hook SessionStart Product module (pull leger)
# Spec : docs/core/product.md section 9 (Execution flow scenario hooks auto)
# Decision : D-PRODUCT-01
#
# STUB P1 — Implementation complete en P4.
# Pattern : opt-in via env PRODUCT_MCP_SYNC=1. Best-effort non-bloquant (timeout 10s, skip si MCP down).
#
# Usage : invoque automatiquement au SessionStart si PRODUCT_MCP_SYNC=1.
#
# Exit codes :
#   0 : toujours (non-bloquant, log erreurs sans faire echouer la session)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# Opt-in check
if [ "${PRODUCT_MCP_SYNC:-0}" != "1" ]; then
  exit 0
fi

# STUB P1 : pas d'action, exit 0
# P4 implementera : bash scripts/po-pull.sh --quiet avec timeout 10s + log .omc/logs/product-sync-errors.log
echo "product-session-start.sh STUB P1 (impl P4) — PRODUCT_MCP_SYNC=1 detected" >> .omc/logs/product-sync.log 2>/dev/null || true

exit 0
