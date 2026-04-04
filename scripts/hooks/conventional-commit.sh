#!/bin/bash
# conventional-commit.sh - Validation format conventional commits
# Hook PreToolUse(git commit) pour Foundation OS

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[Conventional] Validation format commit...${NC}"

COMMIT_MSG="$1"
if [ -z "$COMMIT_MSG" ]; then
    exit 0
fi

# Pattern conventional commit
PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}"

if [[ "$COMMIT_MSG" =~ $PATTERN ]]; then
    echo -e "${GREEN}[Conventional] ✅ Format commit OK${NC}"
    exit 0
else
    echo -e "${RED}[Conventional] ERREUR: Format commit incorrect${NC}"
    echo -e "${RED}Format attendu: type(scope): description${NC}"
    echo -e "${RED}Types: feat, fix, docs, style, refactor, test, chore${NC}"
    echo -e "${RED}Exemple: feat(auth): add login functionality${NC}"
    exit 1
fi