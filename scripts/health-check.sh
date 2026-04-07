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

# Build (alerte WARNING si > 1500ms, BROKEN si fail — seuils source : docs/core/monitor.md)
BUILD_OUT=$(cd modules/app && npm run build 2>&1)
if echo "$BUILD_OUT" | grep -q "built in"; then
  BUILD_TIME=$(echo "$BUILD_OUT" | grep "built in" | sed 's/.*built in //')
  # Convertit en ms (parse "845ms", "845 ms", "1.23s", "1.23 s")
  BT_NS="${BUILD_TIME// /}"
  BUILD_MS_INT=0
  case "$BT_NS" in
    *ms) BUILD_MS_INT=$(awk "BEGIN{printf \"%d\", ${BT_NS%ms}}" 2>/dev/null) ;;
    *s)  BUILD_MS_INT=$(awk "BEGIN{printf \"%d\", ${BT_NS%s} * 1000}" 2>/dev/null) ;;
  esac
  if [ "${BUILD_MS_INT:-0}" -gt 1500 ] 2>/dev/null; then
    echo -e "  ${YEL}[WARN]${RST} Build modules/app ($BUILD_TIME — derive >1500ms, baseline ~800ms)"
    WARNING=$((WARNING + 1))
  else
    echo -e "  ${GRN}[OK]${RST} Build modules/app ($BUILD_TIME)"
  fi
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

# TSX/JSX component sizes (pages + components)
MAX_TSX=0
OVER_700=""
TSX_FILES=$(find modules/app/src/pages modules/app/src/components -type f \( -name "*.tsx" -o -name "*.jsx" \) 2>/dev/null)
for f in $TSX_FILES; do
  [ -f "$f" ] || continue
  LINES=$(wc -l < "$f" | tr -d ' ')
  [ "$LINES" -gt "$MAX_TSX" ] && MAX_TSX=$LINES
  [ "$LINES" -ge 700 ] && OVER_700="$OVER_700 $(basename $f):${LINES}L"
done
if [ -z "$OVER_700" ]; then
  echo -e "  ${GRN}[OK]${RST} TSX sizes (max ${MAX_TSX}L)"
else
  echo -e "  ${YEL}[WARN]${RST} TSX > 700L:$OVER_700"
  WARNING=$((WARNING + 1))
fi

# Void Glass (case-insensitive : #0A0A0B == #0a0a0b)
VG=$(grep -rni "#0A0A0B\|#08080A" modules/app/src/ --include="*.tsx" --include="*.ts" --include="*.css" 2>/dev/null | wc -l | tr -d ' ')
if [ "$VG" -eq 0 ]; then
  echo -e "  ${GRN}[OK]${RST} Void Glass (0 violation)"
else
  echo -e "  ${YEL}[WARN]${RST} Void Glass $VG violations"
  WARNING=$((WARNING + 1))
fi

# MD pairs (artifacts archived in .archive/artifacts-jsx/ since Phase 2.4)
MD_COUNT=$(ls -1 modules/app/data/*.md 2>/dev/null | wc -l | tr -d ' ')
ART_COUNT=$(ls -1 .archive/artifacts-jsx/fos-*.jsx 2>/dev/null | wc -l | tr -d ' ')
if [ "$MD_COUNT" -eq "$ART_COUNT" ]; then
  echo -e "  ${GRN}[OK]${RST} MD pairs ($MD_COUNT/$ART_COUNT in archive)"
else
  echo -e "  ${YEL}[WARN]${RST} MD pairs ($MD_COUNT MD vs $ART_COUNT artifacts in archive)"
  WARNING=$((WARNING + 1))
fi

# Refs intactes (full-repo broken refs detector — invoque ref-checker.sh)
REF_OUT=$(bash scripts/ref-checker.sh 2>&1); REF_RC=$?
if [ $REF_RC -eq 0 ]; then
  REF_SCAN=$(echo "$REF_OUT" | grep -oE '[0-9]+ \.md scannes' | head -1)
  echo -e "  ${GRN}[OK]${RST} Refs intactes ($REF_SCAN)"
else
  REF_BROKEN=$(echo "$REF_OUT" | grep -oE '[0-9]+ refs cassees' | head -1)
  echo -e "  ${YEL}[WARN]${RST} Refs cassees ($REF_BROKEN)"
  WARNING=$((WARNING + 1))
fi

# Tests vitest (modules/app)
TEST_OUT=$(cd modules/app && npm test --silent 2>&1 || true)
TEST_LINE=$(echo "$TEST_OUT" | grep -E "^[[:space:]]*Tests[[:space:]]+" | head -1 | sed 's/^[[:space:]]*//')
if echo "$TEST_LINE" | grep -q "failed"; then
  echo -e "  ${YEL}[WARN]${RST} $TEST_LINE"
  WARNING=$((WARNING + 1))
elif [ -n "$TEST_LINE" ]; then
  echo -e "  ${GRN}[OK]${RST} Vitest — $TEST_LINE"
else
  echo -e "  ${YEL}[WARN]${RST} Vitest — output illisible"
  WARNING=$((WARNING + 1))
fi

echo ""

# ── INFO ───────────────���──────────────────────────────────────────

echo "[INFO]"

# Bundle size
JS_SIZE=$(echo "$BUILD_OUT" | grep "\.js " | awk '{print $2}' | head -1)
CSS_SIZE=$(echo "$BUILD_OUT" | grep "\.css " | awk '{print $2}' | head -1)
JS_INT=${JS_SIZE%.*}
CSS_INT=${CSS_SIZE%.*}
BUNDLE_WARN=""
[ "${JS_INT:-0}" -gt 600 ] && BUNDLE_WARN="$BUNDLE_WARN JS>600KB"
[ "${CSS_INT:-0}" -gt 40 ] && BUNDLE_WARN="$BUNDLE_WARN CSS>40KB"
if [ -z "$BUNDLE_WARN" ]; then
  echo -e "  ${DIM}[OK]${RST} Bundle: JS ${JS_SIZE:-?}kB / CSS ${CSS_SIZE:-?}kB"
else
  echo -e "  ${YEL}[WARN]${RST} Bundle: JS ${JS_SIZE:-?}kB / CSS ${CSS_SIZE:-?}kB —$BUNDLE_WARN"
  WARNING=$((WARNING + 1))
fi

# Decisions dated (annee any 20XX, evite Y2027 bug)
DATED=$(grep -E "^\| .* \| 20[0-9]{2}-[0-9]{2}-[0-9]{2}" CONTEXT.md 2>/dev/null | wc -l | tr -d ' ')
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
