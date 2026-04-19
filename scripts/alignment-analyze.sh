#!/usr/bin/env bash
# alignment-analyze.sh — Analyze .omc/alignment/*.jsonl (ratings enrichis D-BODY-01 P2)
# Spec: docs/core/body.md section 4 (Couche C3 Feedback structure)
# Input : .omc/alignment/*.jsonl (schema enrichi : rating + drift_categories + principles_violated)
# Output : distribution rating + top drift categories + top P-XX violated + streak + patterns
#
# Usage:
#   bash scripts/alignment-analyze.sh          (verbose : distribution + streaks + patterns)
#   bash scripts/alignment-analyze.sh --quiet  (1-ligne stats pour chain health-check INFO)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1

ALIGN_DIR=".omc/alignment"

# --- Guard : dossier absent ---

if [ ! -d "$ALIGN_DIR" ]; then
  if [ "$QUIET" -eq 1 ]; then
    echo "Alignment : 0 rated (dir empty)"
    exit 0
  fi
  echo "Pas encore d'alignment traces (.omc/alignment/ inexistant)"
  echo "Cree automatiquement au prochain /session-end Phase 7bis enrichi (D-BODY-01 P2)"
  exit 0
fi

# --- Collect all .jsonl lines dans un tmpfile ---

TMP_ALL=$(mktemp)
trap "rm -f $TMP_ALL" EXIT
find "$ALIGN_DIR" -name "*.jsonl" -type f -exec cat {} + > "$TMP_ALL" 2>/dev/null

TOTAL=$(wc -l < "$TMP_ALL" | tr -d ' ')
TOTAL=${TOTAL:-0}

if [ "$TOTAL" -eq 0 ]; then
  if [ "$QUIET" -eq 1 ]; then
    echo "Alignment : 0 rated"
    exit 0
  fi
  echo "Alignment vide (.omc/alignment/*.jsonl existent mais 0 ligne)"
  exit 0
fi

# --- Count ratings (grep simple, JSONL flat) ---

Y=$(grep -c '"rating":"Y"' "$TMP_ALL" 2>/dev/null | tr -d ' \n')
N=$(grep -c '"rating":"N"' "$TMP_ALL" 2>/dev/null | tr -d ' \n')
P=$(grep -c '"rating":"partial"' "$TMP_ALL" 2>/dev/null | tr -d ' \n')
Y=${Y:-0}
N=${N:-0}
P=${P:-0}

Y_PCT=$((Y * 100 / TOTAL))
N_PCT=$((N * 100 / TOTAL))
P_PCT=$((P * 100 / TOTAL))

# --- Mode --quiet : 1-ligne stats pour chain health-check ---

if [ "$QUIET" -eq 1 ]; then
  echo "Alignment : $TOTAL rated · Y=${Y} N=${N} partial=${P}"
  exit 0
fi

# --- Mode verbose ---

echo ""
echo "ALIGNMENT ANALYZE — $(date +%Y-%m-%d)"
echo ""
echo "  Total sessions ratees : $TOTAL"
echo "  Y (bien)     : $Y (${Y_PCT}%)"
echo "  N (mal)      : $N (${N_PCT}%)"
echo "  partial      : $P (${P_PCT}%)"
echo ""

# --- Drift categories + principles (python3 inline pour robust JSON parse) ---

python3 - "$TMP_ALL" <<'PYEOF'
import json
import sys
from collections import Counter

path = sys.argv[1]
with open(path) as f:
    lines = [l.strip() for l in f if l.strip()]

cats = Counter()
principles = Counter()
parse_errors = 0

for line in lines:
    try:
        d = json.loads(line)
        for c in (d.get("drift_categories") or []):
            cats[c] += 1
        for p in (d.get("principles_violated") or []):
            principles[p] += 1
    except Exception:
        parse_errors += 1

print("--- Drift categories (top 5) ---")
if cats:
    for cat, count in cats.most_common(5):
        print(f"  {cat:20s} : {count}")
else:
    print("  (aucune drift category enregistree)")

print("")
print("--- Principes les plus violes (top 5) ---")
if principles:
    for p, count in principles.most_common(5):
        print(f"  {p:10s} : {count}")
else:
    print("  (aucun principe viole enregistre)")

if parse_errors > 0:
    print("")
    print(f"  [WARN] {parse_errors} lignes JSONL invalides (skipped)")
PYEOF

echo ""

# --- Streak detection (3 N consecutifs en fin de fichier) ---

LAST3=$(tail -3 "$TMP_ALL" 2>/dev/null)
LAST3_N=$(echo "$LAST3" | grep -c '"rating":"N"' 2>/dev/null | tr -d ' \n')
LAST3_N=${LAST3_N:-0}
if [ "$LAST3_N" -eq 3 ]; then
  echo "  [ALERTE] 3 sessions N consecutives -> retrospective recommandee"
  echo "  Lire : tail -3 ${ALIGN_DIR}/*.jsonl"
  echo ""
fi

# --- Pattern 7-dernieres si total >= 10 ---

if [ "$TOTAL" -ge 10 ]; then
  echo "--- Patterns (N >= 10) ---"
  LAST7_Y=$(tail -7 "$TMP_ALL" | grep -c '"rating":"Y"' 2>/dev/null | tr -d ' \n')
  LAST7_N=$(tail -7 "$TMP_ALL" | grep -c '"rating":"N"' 2>/dev/null | tr -d ' \n')
  LAST7_Y=${LAST7_Y:-0}
  LAST7_N=${LAST7_N:-0}
  echo "  7 dernieres : Y=${LAST7_Y} N=${LAST7_N}"
  if [ "$LAST7_N" -gt "$LAST7_Y" ]; then
    echo "  [TREND] Tendance recente defavorable (N > Y sur 7)"
  fi
fi

exit 0
