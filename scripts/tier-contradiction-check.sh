#!/usr/bin/env bash
# tier-contradiction-check.sh — Detecte phrases >= 40 chars dupliquees entre 5 tiers
# Spec: audit v2 S3 Phase 17 I-06 (plan docs/plans/2026-04-17-audit-v2-s3-phase-16-18.md)
# Enforce D-WIKI-01 "une info = un seul tier"
# Exit 0 toujours (rapport only, non-bloquant). Affiche count dans INFO.
# Usage: bash scripts/tier-contradiction-check.sh [--quiet]

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1

MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"

TIER_1="CLAUDE.md"
TIER_2="CONTEXT.md"
TIER_3_DIR="$MEMDIR"
TIER_4_DIR="docs/core"
TIER_5_DIR="wiki/meta"

# Seuils (configurables via env)
MIN_LEN="${CONTRADICTION_MIN_LEN:-40}"
MAX_LEN="${CONTRADICTION_MAX_LEN:-300}"

# Tmp files (pattern lesson-learned : subshell safe)
TMPFILE=$(mktemp)
DUPFILE=$(mktemp)
trap "rm -f $TMPFILE $DUPFILE" EXIT

# Extrait phrases significatives : skip headers/tables/lists/code/blank
# Split sur "." puis filtre longueur
extract_sentences() {
  local file="$1"
  [ ! -f "$file" ] && return 0
  grep -vE '^(#|>|\||-|\*|\s*$|`|    |\t)' "$file" 2>/dev/null \
    | tr '.' '\n' \
    | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' \
    | awk -v min="$MIN_LEN" -v max="$MAX_LEN" 'length >= min && length <= max'
}

# Scan une phrase contre un dossier (ou fichier unique)
# $1 = sentence, $2 = target (file or dir), $3 = tier_label
scan_sentence() {
  local sent="$1"
  local target="$2"
  local label="$3"
  local matches=""
  if [ -d "$target" ]; then
    matches=$(grep -lF "$sent" "$target"/*.md 2>/dev/null || true)
  elif [ -f "$target" ]; then
    grep -qF "$sent" "$target" 2>/dev/null && matches="$target" || true
  fi
  if [ -n "$matches" ]; then
    echo "[DUP $label] ${sent:0:120}..." >> "$DUPFILE"
    while IFS= read -r m; do
      [ -n "$m" ] && echo "  -> $m" >> "$DUPFILE"
    done <<< "$matches"
  fi
}

# Pair 1 : TIER_1 (CLAUDE.md) vs TIER_3 (memory)
if [ -f "$TIER_1" ] && [ -d "$TIER_3_DIR" ]; then
  extract_sentences "$TIER_1" > "$TMPFILE"
  while IFS= read -r SENT; do
    [ -z "$SENT" ] && continue
    scan_sentence "$SENT" "$TIER_3_DIR" "CLAUDE<->memory"
  done < "$TMPFILE"
fi

# Pair 2 : TIER_1 (CLAUDE.md) vs TIER_4 (docs/core)
if [ -f "$TIER_1" ] && [ -d "$TIER_4_DIR" ]; then
  extract_sentences "$TIER_1" > "$TMPFILE"
  while IFS= read -r SENT; do
    [ -z "$SENT" ] && continue
    scan_sentence "$SENT" "$TIER_4_DIR" "CLAUDE<->docs/core"
  done < "$TMPFILE"
fi

# Pair 3 : TIER_2 (CONTEXT.md) vs TIER_4 (docs/core)
if [ -f "$TIER_2" ] && [ -d "$TIER_4_DIR" ]; then
  extract_sentences "$TIER_2" > "$TMPFILE"
  while IFS= read -r SENT; do
    [ -z "$SENT" ] && continue
    scan_sentence "$SENT" "$TIER_4_DIR" "CONTEXT<->docs/core"
  done < "$TMPFILE"
fi

# Pair 4 : TIER_2 (CONTEXT.md) vs TIER_5 (wiki/meta)
if [ -f "$TIER_2" ] && [ -d "$TIER_5_DIR" ]; then
  extract_sentences "$TIER_2" > "$TMPFILE"
  while IFS= read -r SENT; do
    [ -z "$SENT" ] && continue
    scan_sentence "$SENT" "$TIER_5_DIR" "CONTEXT<->wiki/meta"
  done < "$TMPFILE"
fi

# Compte + affiche
DUP_COUNT=0
if [ -s "$DUPFILE" ]; then
  DUP_COUNT=$(grep -c "^\[DUP" "$DUPFILE" 2>/dev/null || echo 0)
fi

if [ "$QUIET" -eq 1 ]; then
  echo "Contradictions 5 tiers : $DUP_COUNT duplications (seuil >= ${MIN_LEN} chars)"
  exit 0
fi

echo ""
echo "TIER-CONTRADICTION — $(date +%Y-%m-%d)"
echo ""
if [ "$DUP_COUNT" -eq 0 ]; then
  echo "  [OK] Aucune duplication >= ${MIN_LEN} chars detectee (5 tiers scannes)"
else
  cat "$DUPFILE"
  echo ""
  echo "---"
  echo "  [WARN] Total duplications : $DUP_COUNT (seuil >= ${MIN_LEN} chars)"
  echo "  Regle d'or D-WIKI-01 : une info = un seul tier"
  echo "  Review manuelle : chaque duplication = choisir le tier canonique + supprimer des autres"
fi

exit 0
