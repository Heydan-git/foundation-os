#!/bin/bash
# conventional-commit.sh - Vérifie format conventional commits

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
    echo -e "${GREEN}[FOS Hook] Pas de commit message à vérifier${NC}"
    exit 0
fi

# Pattern conventional: type(scope): description
if [[ "$COMMIT_MSG" =~ ^(feat|fix|docs|refactor|chore|test|style)(\(.+\))?:\ .+ ]]; then
    echo -e "${GREEN}[FOS Hook] ✅ Conventional commit OK${NC}"
    exit 0
else
    echo -e "${RED}[FOS Hook] ERREUR: Format conventional commit invalide${NC}"
    echo -e "${RED}Format requis: type(scope): description${NC}"
    echo -e "${RED}Types: feat, fix, docs, refactor, chore, test, style${NC}"
    exit 1
fi
