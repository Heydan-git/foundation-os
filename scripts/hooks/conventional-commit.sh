#!/bin/bash
# FOS Hook — Conventional commit enforcement
# Vérifie le format des messages de commit

set -euo pipefail

# Ce hook est appelé après un commit pour vérifier le format
# Il peut aussi être utilisé de manière préventive

if git rev-parse --git-dir >/dev/null 2>&1; then
    # Récupère le dernier message de commit
    last_commit=$(git log -1 --pretty=format:%s 2>/dev/null || echo "")

    if [[ -n "$last_commit" ]]; then
        # Pattern conventional commits
        if [[ "$last_commit" =~ ^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?\!?:\ .+ ]]; then
            echo "✅ Commit conventionnel: $last_commit"
        else
            echo "⚠️  Format commit non-conventionnel: $last_commit"
            echo "💡 Format attendu: type(scope): description"
            echo "   Types: feat|fix|docs|style|refactor|test|chore"
        fi
    fi
fi

exit 0