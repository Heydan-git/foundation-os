#!/usr/bin/env bash
# neuroplasticity-score.sh — Mesure l'application des 4 reflexes neuroplasticite
# sur les 7 derniers jours (ou periode specifiee).
#
# Usage :
#   bash scripts/neuroplasticity-score.sh           # 7 derniers jours (defaut)
#   bash scripts/neuroplasticity-score.sh --days=14 # 14 derniers jours
#   bash scripts/neuroplasticity-score.sh --quiet   # output 1 ligne seulement
#
# 4 reflexes (CLAUDE.md) :
#   1. Recall wiki : Grep/Read wiki/ avant reponse technique
#   2. Consolidation : callout [!updated] dans wiki/ apres ingest
#   3. Lessons learned : commits sur wiki/meta/lessons-learned.md
#   4. Self-check : commits sur wiki/meta/sessions-recent.md ou thinking.md
#
# Output : score % + detail par reflexe. Chain dans health-check.sh.
#
# Refs : audit v2 rapport-comportement.md I-07 + C-16

set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

DAYS=7
QUIET=0
for arg in "$@"; do
  case $arg in
    --days=*) DAYS="${arg#--days=}" ;;
    --quiet|-q) QUIET=1 ;;
  esac
done

TRANSCRIPTS_DIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os"
SINCE_TS=$(( $(date +%s) - DAYS * 86400 ))

# Reflex 1 : Grep wiki/ dans les transcripts recents
# (compte les invocations Grep avec path wiki/)
REFLEX_1=0
if [ -d "$TRANSCRIPTS_DIR" ]; then
  for f in "$TRANSCRIPTS_DIR"/*.jsonl; do
    [ -f "$f" ] || continue
    MOD=$(stat -f %m "$f" 2>/dev/null || stat -c %Y "$f" 2>/dev/null || echo 0)
    [ "$MOD" -lt "$SINCE_TS" ] && continue
    # Compte les Grep/Read avec wiki/ dans input
    COUNT=$(grep -ao '"tool_use"[^}]*"name":"\(Grep\|Read\)"[^}]*"input":{[^}]*"\(path\|file_path\)":"[^"]*wiki/' "$f" 2>/dev/null | wc -l | tr -d ' ')
    REFLEX_1=$((REFLEX_1 + COUNT))
  done
fi

# Reflex 2 : callouts [!updated] dans wiki/ (toute date — inventaire cumule)
REFLEX_2=$(grep -rh "\[!updated\]" wiki/ 2>/dev/null | wc -l | tr -d ' ')

# Reflex 3 : commits touchant lessons-learned.md dans la periode
REFLEX_3=$(git log --since="${DAYS} days ago" --oneline --format="%H" -- wiki/meta/lessons-learned.md 2>/dev/null | wc -l | tr -d ' ')

# Reflex 4 : commits touchant sessions-recent.md OU thinking.md dans la periode
REFLEX_4=$(git log --since="${DAYS} days ago" --oneline --format="%H" -- wiki/meta/sessions-recent.md wiki/meta/thinking.md 2>/dev/null | wc -l | tr -d ' ')

# Score : pondere par attendu minimum hebdo
# Attendu semaine active : 10 recall wiki + 2 consolidations + 2 lessons + 3 self-check = 17
# Score = min(100, somme ponderee * 100 / 17)
TOTAL=$((REFLEX_1 + REFLEX_2 + REFLEX_3 + REFLEX_4))
EXPECTED=17
SCORE=$((TOTAL * 100 / EXPECTED))
[ $SCORE -gt 100 ] && SCORE=100

# Color based on score
if [ $SCORE -ge 70 ]; then
  EMOJI="🟢"
  VERDICT="actif"
elif [ $SCORE -ge 30 ]; then
  EMOJI="🟡"
  VERDICT="partiel"
else
  EMOJI="🔴"
  VERDICT="faible"
fi

if [ "$QUIET" -eq 1 ]; then
  echo "Neuroplasticite ${DAYS}j : ${SCORE}% ${EMOJI} ${VERDICT}"
  exit 0
fi

echo "NEUROPLASTICITE — derniers ${DAYS} jours"
echo ""
echo "Score global : ${EMOJI} ${SCORE}% (${VERDICT})"
echo ""
echo "Reflexes appliques :"
echo "  1. Recall wiki (Grep/Read wiki/)     : ${REFLEX_1} (attendu >= 10/semaine)"
echo "  2. Consolidation [!updated] callouts : ${REFLEX_2} (total cumule)"
echo "  3. Lessons-learned commits           : ${REFLEX_3} (attendu >= 2/semaine)"
echo "  4. Self-check (sessions/thinking)    : ${REFLEX_4} (attendu >= 3/semaine)"
echo ""
if [ $SCORE -lt 50 ]; then
  echo "Warnings :"
  [ $REFLEX_1 -lt 5 ] && echo "  - Faible recall wiki : lire wiki/ plus souvent avant reponses techniques"
  [ $REFLEX_3 -eq 0 ] && echo "  - Zero lesson-learned cette periode : capturer les erreurs/pieges"
  [ $REFLEX_4 -eq 0 ] && echo "  - Zero self-check : update sessions-recent.md en /session-end"
fi
