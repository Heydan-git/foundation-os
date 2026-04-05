#!/bin/bash
# health-check.sh — Run all Monitor indicators (docs/core/monitor.md)
# Usage: bash scripts/health-check.sh
# Exit codes: 0=SAIN, 1=BROKEN, 2=DEGRADED

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
DIM='\033[0;90m'
RST='\033[0m'

CRITICAL=0
WARNING=0

echo ""
echo "HEALTH — $(date +%Y-%m-%d)"
echo ""

# ── CRITICAL ──────────────────────────────────────────────────────

echo "[CRITICAL]"

# Build
BUILD_OUT=$(cd modules/app && npm run build 2>&1)
if echo "$BUILD_OUT" | grep -q "built in"; then
  BUILD_TIME=$(echo "$BUILD_OUT" | grep "built in" | sed 's/.*built in //')
  echo -e "  ${GRN}[OK]${RST} Build modules/app ($BUILD_TIME)"
else
  echo -e "  ${RED}[KO]${RST} Build modules/app FAILED"
  CRITICAL=$((CRITICAL + 1))
fi

# Structure
ORPHANS=$(ls -1 | grep -v '^\.' | grep -v -E '^(CLAUDE\.md|CONTEXT\.md|README\.md|_bmad|docs|modules|scripts|supabase)$' || true)
if [ -z "$ORPHANS" ]; then
  echo -e "  ${GRN}[OK]${RST} Structure racine (0 orphelin)"
else
  echo -e "  ${RED}[KO]${RST} Orphelins: $ORPHANS"
  CRITICAL=$((CRITICAL + 1))
fi

# TypeScript
TS_OUT=$(cd modules/app && npx tsc --noEmit 2>&1)
if [ $? -eq 0 ]; then
  echo -e "  ${GRN}[OK]${RST} TypeScript compile (0 erreur)"
else
  TS_ERRORS=$(echo "$TS_OUT" | grep "error TS" | wc -l | tr -d ' ')
  echo -e "  ${RED}[KO]${RST} TypeScript $TS_ERRORS erreurs"
  CRITICAL=$((CRITICAL + 1))
fi

echo ""

# ── WARNING ─────────────���──────────────────────��──────────────────

echo "[WARNING]"

# JSX sizes
MAX_JSX=0
OVER_700=""
for f in modules/app/src/artifacts/fos-*.jsx; do
  LINES=$(wc -l < "$f" | tr -d ' ')
  [ "$LINES" -gt "$MAX_JSX" ] && MAX_JSX=$LINES
  [ "$LINES" -ge 700 ] && OVER_700="$OVER_700 $(basename $f):${LINES}L"
done
if [ -z "$OVER_700" ]; then
  echo -e "  ${GRN}[OK]${RST} JSX sizes (max ${MAX_JSX}L)"
else
  echo -e "  ${YEL}[WARN]${RST} JSX > 700L:$OVER_700"
  WARNING=$((WARNING + 1))
fi

# Void Glass
VG=$(grep -rn "#0A0A0B\|#08080A" modules/app/src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l | tr -d ' ')
if [ "$VG" -eq 0 ]; then
  echo -e "  ${GRN}[OK]${RST} Void Glass (0 violation)"
else
  echo -e "  ${YEL}[WARN]${RST} Void Glass $VG violations"
  WARNING=$((WARNING + 1))
fi

# MD pairs
MD_COUNT=$(ls -1 modules/app/data/*.md 2>/dev/null | wc -l | tr -d ' ')
ART_COUNT=$(ls -1 modules/app/src/artifacts/fos-*.jsx 2>/dev/null | wc -l | tr -d ' ')
if [ "$MD_COUNT" -eq "$ART_COUNT" ]; then
  echo -e "  ${GRN}[OK]${RST} MD pairs ($MD_COUNT/$ART_COUNT)"
else
  echo -e "  ${YEL}[WARN]${RST} MD pairs ($MD_COUNT MD vs $ART_COUNT artifacts)"
  WARNING=$((WARNING + 1))
fi

echo ""

# ── INFO ───────────────���──────────────────────────────────────────

echo "[INFO]"

# Bundle size
JS_SIZE=$(echo "$BUILD_OUT" | grep "\.js " | awk '{print $3 $4}' | head -1)
CSS_SIZE=$(echo "$BUILD_OUT" | grep "\.css " | awk '{print $3 $4}' | head -1)
echo -e "  ${DIM}[OK]${RST} Bundle: JS ${JS_SIZE:-?} / CSS ${CSS_SIZE:-?}"

# Decisions dated
DATED=$(grep "^| .* | 2026-" CONTEXT.md 2>/dev/null | wc -l | tr -d ' ')
echo -e "  ${DIM}[OK]${RST} Decisions datees: $DATED"

echo ""

# ── VERDICT ────────────��──────────────────────────────────────────

if [ "$CRITICAL" -gt 0 ]; then
  echo -e "${RED}Verdict : BROKEN${RST} ($CRITICAL critical, $WARNING warning)"
  exit 1
elif [ "$WARNING" -gt 0 ]; then
  echo -e "${YEL}Verdict : DEGRADED${RST} (0 critical, $WARNING warning)"
  exit 2
else
  echo -e "${GRN}Verdict : SAIN${RST}"
  exit 0
fi
