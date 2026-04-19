#!/usr/bin/env bash
# product-session-start.sh — Hook SessionStart Product (pull leger)
# Spec : docs/core/product.md section 9 scenario hooks auto
# Pattern : opt-in via PRODUCT_MCP_SYNC=1 env. Best-effort non-bloquant.
# Decision : D-PRODUCT-01 (pivot Notion-only P1.5)
#
# Comportement :
#   - Invoque po-pull.sh --preview --quiet avec timeout 10s
#   - Genere manifest pull pour que Claude puisse executer MCP queries si pertinent
#   - Si timeout OR erreur : log + skip (exit 0, FOS continue)
#
# Invocation auto :
#   Via .claude/settings.json hook SessionStart (seulement si PRODUCT_MCP_SYNC=1).
#
# Exit codes :
#   0 : toujours (non-bloquant, log erreurs sans faire echouer la session)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Opt-in check ---

if [ "${PRODUCT_MCP_SYNC:-0}" != "1" ]; then
  # Default OFF : ne rien faire
  exit 0
fi

# --- Log dir ---

LOG_DIR=".omc/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_DIR}/product-sync.log"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)

# --- Check preconditions ---

if [ ! -f .omc/product-config.json ]; then
  echo "${TIMESTAMP} SessionStart product : config missing, skip" >> "$LOG_FILE"
  exit 0
fi

if [ ! -x scripts/po-pull.sh ]; then
  echo "${TIMESTAMP} SessionStart product : po-pull.sh not executable, skip" >> "$LOG_FILE"
  exit 0
fi

# --- Run po-pull.sh with timeout 10s ---

# macOS n'a pas `timeout` nativement, on utilise gtimeout si dispo (coreutils) ou fallback perl
if command -v timeout &>/dev/null; then
  TIMEOUT_CMD="timeout 10"
elif command -v gtimeout &>/dev/null; then
  TIMEOUT_CMD="gtimeout 10"
else
  # Fallback : pas de timeout strict, on laisse courir mais log duree
  TIMEOUT_CMD=""
fi

START_MS=$(date +%s)
OUTPUT=$($TIMEOUT_CMD bash scripts/po-pull.sh --preview --quiet 2>&1)
EXIT_CODE=$?
END_MS=$(date +%s)
DURATION=$((END_MS - START_MS))

if [ $EXIT_CODE -eq 0 ]; then
  echo "${TIMESTAMP} SessionStart product : pull preview OK (${DURATION}s)" >> "$LOG_FILE"
elif [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 137 ]; then
  # Timeout (124 = SIGTERM timeout, 137 = SIGKILL)
  echo "${TIMESTAMP} SessionStart product : TIMEOUT apres ${DURATION}s, skip" >> "$LOG_FILE"
else
  echo "${TIMESTAMP} SessionStart product : ERROR exit=${EXIT_CODE} duree=${DURATION}s, skip" >> "$LOG_FILE"
  echo "  output: ${OUTPUT}" >> "$LOG_FILE"
fi

# Toujours exit 0 (hook non-bloquant)
exit 0
