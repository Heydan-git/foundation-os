#!/usr/bin/env bash
# worktree-new.sh — Cree un worktree Foundation OS selon convention <desc>-<yymmdd>
# Spec : docs/core/naming-conventions.md section 2
# Phase 3 migration Foundation OS Desktop (2026-04-15)

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: worktree-new.sh <desc-courte>"
  echo "  desc-courte : 2-4 mots kebab-case (ex: migration-desktop, fix-auth-ui)"
  echo ""
  echo "Cree :"
  echo "  - Branche : wt/<desc>-<yymmdd>"
  echo "  - Dossier : .claude/worktrees/<desc>-<yymmdd>/"
  exit 1
fi

DESC="$1"

# Validation format desc : lowercase, kebab-case, max 30 chars
if ! echo "$DESC" | grep -qE "^[a-z0-9]+(-[a-z0-9]+)*$"; then
  echo "Erreur: desc '$DESC' invalide. Attendu : lowercase kebab-case (ex: migration-desktop)."
  exit 1
fi

if [ ${#DESC} -gt 30 ]; then
  echo "Erreur: desc trop longue (${#DESC} chars > 30)."
  exit 1
fi

# Date courte yymmdd
YYMMDD=$(date +%y%m%d)
NAME="${DESC}-${YYMMDD}"
BRANCH="wt/${NAME}"
WT_PATH=".claude/worktrees/${NAME}"

# Depuis la racine repo (pas d'un worktree existant)
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo "Erreur: pas dans un repo git."
  exit 1
fi

cd "$REPO_ROOT"

# Verifier qu'on n'est pas deja dans un worktree
if [ "$REPO_ROOT" != "$(git worktree list | head -1 | awk '{print $1}')" ]; then
  echo "Warn: tu es dans un worktree ($REPO_ROOT). Retourne sur main avant."
  echo "Commande : cd $(git worktree list | head -1 | awk '{print $1}')"
  exit 1
fi

# Verifier que la branche n'existe pas deja
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  echo "Erreur: branche '$BRANCH' existe deja."
  exit 1
fi

if [ -d "$WT_PATH" ]; then
  echo "Erreur: dossier '$WT_PATH' existe deja."
  exit 1
fi

echo "Creation worktree Foundation OS :"
echo "  Nom      : $NAME"
echo "  Branche  : $BRANCH"
echo "  Chemin   : $WT_PATH"
echo ""

git worktree add -b "$BRANCH" "$WT_PATH" main

echo ""
echo "Worktree cree. Pour ouvrir dans nouvelle fenetre Desktop :"
echo "  Option A (Claude Code Desktop) : Ouvrir le dossier $REPO_ROOT/$WT_PATH depuis la sidebar sessions"
echo "  Option B (terminal)            : cd $REPO_ROOT/$WT_PATH && claude ."
echo ""
echo "Pour fermer plus tard : ./scripts/worktree-clean.sh $DESC"
