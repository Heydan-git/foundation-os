#!/usr/bin/env bash
# worktree-clean.sh — Ferme un worktree Foundation OS proprement
# Spec : docs/core/naming-conventions.md section 2
# Phase 3 migration Foundation OS Desktop (2026-04-15)

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: worktree-clean.sh <desc-ou-nom-complet>"
  echo "  Exemples:"
  echo "    worktree-clean.sh migration-desktop       # cherche migration-desktop-*"
  echo "    worktree-clean.sh migration-desktop-260415 # nom complet"
  exit 1
fi

ARG="$1"

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo "Erreur: pas dans un repo git."
  exit 1
fi

# Depuis la racine repo
cd "$REPO_ROOT"

# Trouver le worktree matching
MATCHES=$(git worktree list --porcelain | grep -E "^worktree .*/\.claude/worktrees/${ARG}" | awk '{print $2}')

if [ -z "$MATCHES" ]; then
  # Fallback : essayer avec glob
  MATCHES=$(git worktree list --porcelain | grep -E "^worktree .*/\.claude/worktrees/${ARG}-[0-9]{6}" | awk '{print $2}')
fi

if [ -z "$MATCHES" ]; then
  echo "Erreur: aucun worktree trouve matchant '$ARG'."
  echo ""
  echo "Worktrees actifs :"
  git worktree list
  exit 1
fi

COUNT=$(echo "$MATCHES" | wc -l | tr -d ' ')
if [ "$COUNT" -gt 1 ]; then
  echo "Erreur: plusieurs worktrees matchent '$ARG' :"
  echo "$MATCHES"
  echo "Precise le nom complet avec date."
  exit 1
fi

WT_PATH="$MATCHES"
WT_NAME=$(basename "$WT_PATH")
BRANCH="wt/${WT_NAME}"

echo "Fermeture worktree Foundation OS :"
echo "  Chemin   : $WT_PATH"
echo "  Branche  : $BRANCH"
echo ""

# Avertir si modifications non-commitees
cd "$WT_PATH" 2>/dev/null && UNCOMMITTED=$(git status --porcelain | wc -l | tr -d ' ') || UNCOMMITTED=0
cd "$REPO_ROOT"

if [ "$UNCOMMITTED" -gt 0 ]; then
  echo "Attention : $UNCOMMITTED fichiers non-commites dans $WT_PATH."
  echo "Continuer va perdre ces changements."
  read -p "Continuer ? (oui/non) : " CONFIRM
  if [ "$CONFIRM" != "oui" ]; then
    echo "Abandonne."
    exit 1
  fi
fi

git worktree remove "$WT_PATH" "${2:-}" || git worktree remove --force "$WT_PATH"

# Delete branche si mergee dans main
if git branch --merged main | grep -q "$BRANCH"; then
  git branch -d "$BRANCH"
  echo "Branche '$BRANCH' deletee (mergee)."
else
  echo "Branche '$BRANCH' conservee (non-mergee)."
  echo "  Pour forcer : git branch -D $BRANCH"
fi

echo ""
echo "Worktree ferme."
