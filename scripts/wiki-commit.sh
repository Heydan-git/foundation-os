#!/bin/bash
# wiki-commit.sh — Commit manuel wiki/ + .raw/ (remplace PostToolUse auto-commit desactive)
# Usage : bash scripts/wiki-commit.sh [--message "custom"] [--dry-run]
# Spec : docs/core/knowledge.md section 5 (scripts custom)
# Regle Kevin-valide : jamais de commit automatique, toujours valide manuellement.
# Exit codes : 0 = commit fait ou rien a commit, 1 = erreur

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RST='\033[0m'

DRY_RUN=0
CUSTOM_MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --message) CUSTOM_MSG="$2"; shift 2 ;;
    --help)
      echo "Usage: bash scripts/wiki-commit.sh [--message \"custom\"] [--dry-run]"
      echo "Commit manuel de wiki/ + .raw/ avec message conventional."
      echo "  --dry-run   Affiche ce qui serait commit sans executer"
      echo "  --message   Message de commit custom (sinon auto-genere)"
      exit 0
      ;;
    *) echo "Unknown option: $1. Use --help."; exit 1 ;;
  esac
done

# Check si wiki/ ou .raw/ modifies (tracked)
CHANGED=$(git diff --name-only HEAD 2>/dev/null | grep -E "^(wiki/|\.raw/)" | wc -l | tr -d ' ')
# Check untracked
UNTRACKED=$(git ls-files --others --exclude-standard | grep -E "^(wiki/|\.raw/)" | wc -l | tr -d ' ')

TOTAL=$((CHANGED + UNTRACKED))

if [ "$TOTAL" -eq 0 ]; then
  echo -e "${GRN}[OK]${RST} wiki/ + .raw/ clean (rien a commit)"
  exit 0
fi

echo -e "${YEL}[INFO]${RST} Wiki changes detectes : $CHANGED modifies + $UNTRACKED untracked"
echo ""
echo "Fichiers :"
git diff --name-only HEAD 2>/dev/null | grep -E "^(wiki/|\.raw/)" | sed 's/^/  M /'
git ls-files --others --exclude-standard | grep -E "^(wiki/|\.raw/)" | sed 's/^/  ? /'
echo ""

# Commit message
if [ -n "$CUSTOM_MSG" ]; then
  MSG="$CUSTOM_MSG"
else
  DATE=$(date +"%Y-%m-%d %H:%M")
  MSG="feat(wiki): manual commit $DATE ($CHANGED modified + $UNTRACKED added)"
fi

echo "Commit message : $MSG"
echo ""

if [ $DRY_RUN -eq 1 ]; then
  echo -e "${YEL}[DRY-RUN]${RST} Pas de commit effectue."
  exit 0
fi

git add wiki/ .raw/
git commit -m "$MSG"
RC=$?

if [ $RC -eq 0 ]; then
  echo ""
  echo -e "${GRN}[OK]${RST} Commit cree : $(git log -1 --format='%h %s')"
else
  echo -e "${RED}[KO]${RST} Commit echoue (exit $RC)"
  exit 1
fi
