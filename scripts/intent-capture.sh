#!/usr/bin/env bash
# intent-capture.sh — Genere un fichier intent `.omc/intent/YYYY-MM-DD-<slug>.md`
# Spec: docs/core/body.md section 3 (Couche C2 Intent capture)
# Integration: /plan-os Tour 1 bis (OBLIGATOIRE), /cockpit (opt-in), taches atypiques (manuel)
#
# Usage:
#   bash scripts/intent-capture.sh <slug>
#   bash scripts/intent-capture.sh <slug> --demand "texte verbatim Kevin"
#
# Exit codes:
#   0 : fichier cree OK
#   1 : slug invalide ou manquant
#   2 : fichier existe deja (pas d'overwrite)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

# --- Validation args ---

SLUG="${1:-}"
DEMAND=""

if [ -z "$SLUG" ]; then
  echo "ERREUR : slug manquant" >&2
  echo "Usage : bash scripts/intent-capture.sh <slug> [--demand \"texte\"]" >&2
  exit 1
fi

# Slug validation : lowercase, [a-z0-9-], max 40 chars
if ! echo "$SLUG" | grep -qE '^[a-z0-9-]{1,40}$'; then
  echo "ERREUR : slug invalide '$SLUG'" >&2
  echo "Pattern attendu : [a-z0-9-]{1,40}" >&2
  exit 1
fi

# Parse --demand si present
if [ "${2:-}" = "--demand" ]; then
  DEMAND="${3:-}"
  if [ -z "$DEMAND" ]; then
    echo "ERREUR : --demand requiert un texte en 3e argument" >&2
    exit 1
  fi
fi

# --- Construction path ---

TODAY=$(date +%Y-%m-%d)
INTENT_DIR=".omc/intent"
INTENT_FILE="${INTENT_DIR}/${TODAY}-${SLUG}.md"

# Detection worktree (pattern D-CONCURRENCY-01 pre-compaction-snapshot.sh)
WORKTREE_SUFFIX=""
PWD_BASE=$(basename "$PWD")
if echo "$PWD" | grep -q "/.claude/worktrees/"; then
  WORKTREE_SUFFIX=" (worktree: ${PWD_BASE})"
fi

# --- Creation dir + guard overwrite ---

mkdir -p "$INTENT_DIR"

if [ -f "$INTENT_FILE" ]; then
  echo "ATTENTION : $INTENT_FILE existe deja" >&2
  echo "Supprime-le manuellement si tu veux regenerer (evite perte donnees)" >&2
  exit 2
fi

# --- Branche courante ---

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# --- Template 5 champs ---

VERBATIM_BLOCK="> <copier-coller exact de la demande Kevin, preserver typos et style>"
if [ -n "$DEMAND" ]; then
  VERBATIM_BLOCK="> ${DEMAND}"
fi

cat > "$INTENT_FILE" << EOF
# Intent — ${SLUG}

**Date** : ${TODAY}
**Session / branche** : ${BRANCH}${WORKTREE_SUFFIX}
**Spec** : [docs/core/body.md](../../docs/core/body.md) section 3 (Couche C2)

## 1. Verbatim Kevin

${VERBATIM_BLOCK}

## 2. Ce que je comprends

<reformulation 2-3 lignes, claire, pas de jargon>

## 3. Scope (ce que je VAIS faire)

- <action 1 concrete>
- <action 2 concrete>
- <...>

## 4. Anti-scope (ce que je ne VAIS PAS faire)

- <exclusion 1, ce qui serait une derive>
- <exclusion 2>
- <...>

## 5. Signaux de drift anticipes

- Si je modifie plus de N fichiers hors scope → alerte
- Si je passe plus de X heures → alerte
- Si je me retrouve a faire Y au lieu de Z → stop et reouvrir l'intent

---

**Apres completion** : ce fichier sera lu par \`alignment-auditor\` (subagent clean-slate) au \`/session-end\` Phase 7ter, qui comparera scope declare vs actions reelles (git diff) pour produire un rapport JSON append \`.omc/alignment/auditor-${TODAY}-${SLUG}.json\`.
EOF

# --- Confirmation ---

echo "✅ Intent cree : $INTENT_FILE"
echo ""
echo "Remplir les 5 champs avant d'executer. Pattern :"
echo "  1. Verbatim Kevin (deja pre-fill si --demand fourni)"
echo "  2. Reformulation (ta comprehension)"
echo "  3. Scope (liste actions concretes)"
echo "  4. Anti-scope (ce qui serait derive)"
echo "  5. Signaux drift (red flags anticipes)"
echo ""
echo "Integration : alignment-auditor lira ce fichier au /session-end Phase 7ter"

exit 0
