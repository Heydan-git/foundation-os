#!/usr/bin/env bash
# Foundation OS — Install git hooks depuis scripts/git-hooks/ vers .git/hooks/
#
# Usage : bash scripts/git-hooks-install.sh
#
# A executer apres chaque clone / worktree si les hooks ne sont pas installes.
# Idempotent : peut etre rerun sans effet de bord.
#
# Spec : docs/core/tools.md section 1 "Git hooks"
# Refs : audit v2 Agent 2 F-01/F-03 (hook installe obsolete sans 'merge' → bloque /session-end)

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HOOKS_SRC="$REPO_ROOT/scripts/git-hooks"
HOOKS_DST="$(git rev-parse --git-common-dir 2>/dev/null || echo "$REPO_ROOT/.git")/hooks"

if [ ! -d "$HOOKS_SRC" ]; then
    echo "ERREUR: $HOOKS_SRC introuvable"
    exit 1
fi

mkdir -p "$HOOKS_DST"

INSTALLED=0
SKIPPED=0
for hook_path in "$HOOKS_SRC"/*; do
    [ -f "$hook_path" ] || continue
    hook_name="$(basename "$hook_path")"
    dst="$HOOKS_DST/$hook_name"
    cp "$hook_path" "$dst"
    chmod +x "$dst"
    echo "[INSTALLED] $dst"
    INSTALLED=$((INSTALLED + 1))
done

echo ""
echo "OK: $INSTALLED hooks installes dans $HOOKS_DST"
echo ""
echo "Hooks actifs :"
ls -1 "$HOOKS_DST" | grep -Ev '\.sample$' || echo "  (aucun)"
