#!/usr/bin/env bash
# branch-name-check.sh — Warning non-bloquant si branche hors convention
# Spec : docs/core/naming-conventions.md section 1
# Phase 2 migration Foundation OS Desktop (2026-04-15)

set -u

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Branches autorisees (main + format convention)
# Pattern : main OU <type>/<scope>-<desc>[-yymmdd]
VALID_PREFIXES="feat|fix|docs|refactor|chore|audit|wt"
VALID_REGEX="^(main|(${VALID_PREFIXES})/[a-z0-9]+[-a-z0-9]*(-[0-9]{6})?)$"

# Exceptions tolerees (branches historiques, avant migration 2026-04-15)
LEGACY_REGEX="^claude/[a-z]+-[a-z]+$"

if echo "$BRANCH" | grep -qE "$VALID_REGEX"; then
  exit 0
fi

if echo "$BRANCH" | grep -qE "$LEGACY_REGEX"; then
  echo "[warn branch-name] Branche '$BRANCH' au format legacy claude/*. Nouvelle convention depuis 2026-04-15 : <type>/<scope>-<desc>. Voir docs/core/naming-conventions.md"
  exit 0
fi

echo "[warn branch-name] Branche '$BRANCH' ne matche pas la convention Foundation OS."
echo "  Format attendu : <type>/<scope>-<desc>[-yymmdd]"
echo "  Types autorises : feat, fix, docs, refactor, chore, audit, wt"
echo "  Exemple : feat/ds-void-glass, wt/migration-desktop-260415"
echo "  Spec : docs/core/naming-conventions.md"
echo "  (warning non-bloquant)"
exit 0
