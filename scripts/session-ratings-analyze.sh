#!/usr/bin/env bash
# session-ratings-analyze.sh — Analyse .omc/ratings.jsonl (feedback post-session Kevin)
# Spec: audit v2 S3 Phase 18 I-10 (plan docs/plans/2026-04-17-audit-v2-s3-phase-16-18.md)
# Output : distribution Y/N/partial + streak detection + patterns si >= 10 sessions
# Usage: bash scripts/session-ratings-analyze.sh [--quiet]

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1

RATINGS=".omc/ratings.jsonl"

if [ ! -f "$RATINGS" ]; then
  [ "$QUIET" -eq 1 ] && echo "Session ratings : 0 rated" && exit 0
  echo "Pas encore de ratings (.omc/ratings.jsonl inexistant)"
  echo "Cree automatiquement au prochain /session-end (Phase 7bis AskUserQuestion)"
  exit 0
fi

TOTAL=$(wc -l < "$RATINGS" | tr -d ' ')
if [ "${TOTAL:-0}" -eq 0 ]; then
  [ "$QUIET" -eq 1 ] && echo "Session ratings : 0 rated" && exit 0
  echo "Ratings vides (.omc/ratings.jsonl present mais 0 entree)"
  exit 0
fi

# Compte par rating (grep simple car JSONL plat)
Y=$(grep -c '"rating":"Y"' "$RATINGS" 2>/dev/null || echo 0)
N=$(grep -c '"rating":"N"' "$RATINGS" 2>/dev/null || echo 0)
P=$(grep -c '"rating":"partial"' "$RATINGS" 2>/dev/null || echo 0)

# Sanitize (trim newlines/whitespace)
Y=$(echo "$Y" | tr -d ' \n')
N=$(echo "$N" | tr -d ' \n')
P=$(echo "$P" | tr -d ' \n')

Y_PCT=$((Y * 100 / TOTAL))
N_PCT=$((N * 100 / TOTAL))
P_PCT=$((P * 100 / TOTAL))

if [ "$QUIET" -eq 1 ]; then
  echo "Session ratings : $TOTAL rated · Y=${Y} N=${N} partial=${P}"
  exit 0
fi

echo ""
echo "SESSION RATINGS — $(date +%Y-%m-%d)"
echo ""
echo "  Total sessions ratees : $TOTAL"
echo "  Y (bien)     : $Y (${Y_PCT}%)"
echo "  N (mal)      : $N (${N_PCT}%)"
echo "  partial      : $P (${P_PCT}%)"
echo ""

# Streak detection (3 N consecutifs en fin de fichier)
LAST3=$(tail -3 "$RATINGS" 2>/dev/null)
LAST3_N=$(echo "$LAST3" | grep -c '"rating":"N"' 2>/dev/null || echo 0)
LAST3_N=$(echo "$LAST3_N" | tr -d ' \n')
if [ "${LAST3_N:-0}" -eq 3 ]; then
  echo "  [ALERTE] 3 sessions N consecutives -> retrospective recommandee"
  echo "  Lire : tail -3 $RATINGS"
  echo ""
fi

# Pattern detection (apres >= 10 sessions)
if [ "$TOTAL" -ge 10 ]; then
  echo "--- Patterns (N >= 10) ---"
  # 7 dernieres ratings (distribution recente)
  LAST7_Y=$(tail -7 "$RATINGS" | grep -c '"rating":"Y"' 2>/dev/null || echo 0)
  LAST7_N=$(tail -7 "$RATINGS" | grep -c '"rating":"N"' 2>/dev/null || echo 0)
  LAST7_Y=$(echo "$LAST7_Y" | tr -d ' \n')
  LAST7_N=$(echo "$LAST7_N" | tr -d ' \n')
  echo "  7 dernieres : Y=${LAST7_Y} N=${LAST7_N}"
  if [ "${LAST7_N:-0}" -gt "${LAST7_Y:-0}" ]; then
    echo "  [TREND] Tendance recente defavorable (N > Y sur 7)"
  fi
fi

exit 0
