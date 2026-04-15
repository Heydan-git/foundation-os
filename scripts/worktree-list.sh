#!/usr/bin/env bash
# worktree-list.sh — Liste les worktrees Foundation OS avec etat
# Spec : docs/core/naming-conventions.md section 2
# Phase 3 migration Foundation OS Desktop (2026-04-15)

set -eu

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo "Erreur: pas dans un repo git."
  exit 1
fi

cd "$REPO_ROOT"

printf "%-50s %-35s %-20s %s\n" "PATH" "BRANCH" "DERNIER COMMIT" "STATUS"
printf "%-50s %-35s %-20s %s\n" "----" "------" "--------------" "------"

git worktree list --porcelain | awk '
  /^worktree / { wt_path=$2 }
  /^branch / { branch=$2; gsub("refs/heads/","",branch); print wt_path "|" branch }
' | while IFS="|" read -r wt_path branch; do
  # Relatif si possible
  rel_path="${wt_path#$REPO_ROOT/}"
  [ "$rel_path" = "$wt_path" ] && rel_path="$wt_path"

  # Dernier commit
  last_commit=$(cd "$wt_path" 2>/dev/null && git log -1 --format="%cr · %h" 2>/dev/null || echo "?")

  # Status ahead/behind vs main
  if [ "$branch" = "main" ]; then
    status="(base)"
  else
    ahead=$(git rev-list --count main.."$branch" 2>/dev/null || echo "?")
    behind=$(git rev-list --count "$branch"..main 2>/dev/null || echo "?")
    if [ "$ahead" = "0" ] && [ "$behind" = "0" ]; then
      status="sync main"
    elif [ "$behind" = "0" ]; then
      status="ahead $ahead"
    else
      status="ahead $ahead / behind $behind"
    fi
  fi

  printf "%-50s %-35s %-20s %s\n" "$rel_path" "$branch" "$last_commit" "$status"
done
