#!/usr/bin/env bash
# product-session-end.sh — Hook SessionEnd Product (push best-effort)
# Spec : docs/core/product.md section 9 scenario hooks auto
# Pattern : opt-in via PRODUCT_MCP_SYNC=1 env. Best-effort avec retry 1x.
# Decision : D-PRODUCT-01 (pivot Notion-only P1.5)
#
# Comportement :
#   - Invoque po-sync.sh --quiet avec timeout 30s
#   - Si fail : retry 1x apres 5s de sleep
#   - Si fail 2x : log + skip (exit 0, FOS continue)
#   - Genere manifest sync pour que Claude puisse executer MCP calls post-session (si pertinent)
#
# Invocation auto :
#   Via .claude/settings.json hook SessionEnd (seulement si PRODUCT_MCP_SYNC=1).
#
# Exit codes :
#   0 : toujours (non-bloquant, log erreurs sans faire echouer la session)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Opt-in check ---

if [ "${PRODUCT_MCP_SYNC:-0}" != "1" ]; then
  exit 0
fi

# --- Log dir ---

LOG_DIR=".omc/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_DIR}/product-sync.log"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)

# --- Check preconditions ---

if [ ! -f .omc/product-config.json ]; then
  echo "${TIMESTAMP} SessionEnd product : config missing, skip" >> "$LOG_FILE"
  exit 0
fi

if [ ! -x scripts/po-sync.sh ]; then
  echo "${TIMESTAMP} SessionEnd product : po-sync.sh not executable, skip" >> "$LOG_FILE"
  exit 0
fi

# --- Timeout helper ---

if command -v timeout &>/dev/null; then
  TIMEOUT_CMD="timeout 30"
elif command -v gtimeout &>/dev/null; then
  TIMEOUT_CMD="gtimeout 30"
else
  TIMEOUT_CMD=""
fi

# --- Attempt 1 : sync ---

run_sync() {
  $TIMEOUT_CMD bash scripts/po-sync.sh --quiet 2>&1
  return $?
}

START_MS=$(date +%s)
OUTPUT=$(run_sync)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  END_MS=$(date +%s)
  DURATION=$((END_MS - START_MS))
  echo "${TIMESTAMP} SessionEnd product : push manifest OK (${DURATION}s, try 1)" >> "$LOG_FILE"
  exit 0
fi

# --- Retry 1x si fail ---

echo "${TIMESTAMP} SessionEnd product : try 1 failed (exit=${EXIT_CODE}), retry in 5s" >> "$LOG_FILE"
sleep 5

OUTPUT=$(run_sync)
EXIT_CODE=$?
END_MS=$(date +%s)
DURATION=$((END_MS - START_MS))

if [ $EXIT_CODE -eq 0 ]; then
  echo "${TIMESTAMP} SessionEnd product : push manifest OK retry (${DURATION}s total)" >> "$LOG_FILE"
else
  echo "${TIMESTAMP} SessionEnd product : FAIL 2 tries (exit=${EXIT_CODE}, ${DURATION}s total), skip" >> "$LOG_FILE"
  echo "  output: ${OUTPUT}" >> "$LOG_FILE"
fi

# Toujours exit 0 (hook non-bloquant)
exit 0
