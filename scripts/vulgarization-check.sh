#!/bin/bash
#
# vulgarization-check.sh — Garde-fou D-VULGARIZE-01
#
# Usage:
#   bash scripts/vulgarization-check.sh <file.md>              # check 1 fichier
#   bash scripts/vulgarization-check.sh --quiet <file.md>      # output minimal
#   bash scripts/vulgarization-check.sh --self-test            # scan templates + wiki/hot.md
#
# Verifie qu'un document destine a Kevin respecte les regles de vulgarisation
# integrale (D-VULGARIZE-01, P-42 constitution, docs/core/communication.md 6.0).
#
# Detecte :
#   - D-XXX-NN non-traduits (sans explication en langage naturel a proximite)
#   - Acronymes bruts (FOS, MCP, OMC, DB, PO, TDAH, DS) sans developpement
#   - Hash git bruts (7+ caracteres hex)
#   - Termes tech sans parentheses (worktree, hook, cherry-pick, scheduled task, drift, refs cassees)
#   - Variables env brutes (PRODUCT_MCP_SYNC=1, OMC_SYNC_EXTERNAL=1)
#
# Exit codes:
#   0 = OK, conforme D-VULGARIZE-01
#   1 = Violations detectees, document pas vulgarise
#   2 = Erreur d'invocation (fichier manquant/introuvable)

set -o pipefail
# Note: volontairement PAS set -u (tableaux vides geres sans plantage)

QUIET=0
SELF_TEST=0
TARGETS=()

# Parse args
while [ $# -gt 0 ]; do
  case "$1" in
    --quiet|-q) QUIET=1 ;;
    --self-test) SELF_TEST=1 ;;
    -h|--help)
      sed -n '3,20p' "$0"
      exit 0
      ;;
    *) TARGETS+=("$1") ;;
  esac
  shift
done

# Colors
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
GRAY='\033[0;90m'
NC='\033[0m'

# Self-test : scan les fichiers briefs/templates cles
if [ "$SELF_TEST" -eq 1 ]; then
  TARGETS=(
    "wiki/hot.md"
    "docs/plans/_template-plan.md"
    "docs/audits/_template-audit.md"
  )
  # Ajouter plans actifs s'ils existent
  for plan in docs/plans/*.md; do
    basename=$(basename "$plan")
    if [ "$basename" != "_template-plan.md" ] && [ -f "$plan" ]; then
      TARGETS+=("$plan")
    fi
  done
fi

if [ "${#TARGETS[@]}" -eq 0 ]; then
  echo "Usage: bash scripts/vulgarization-check.sh <file.md> [--quiet|--self-test]" >&2
  exit 2
fi

# Terms a detecter (tech terms qui doivent avoir explication entre parentheses a proximite)
TECH_TERMS=(
  "worktree" "hook" "cherry-pick" "scheduled task" "drift" "refs cassees"
  "subagent" "MCP" "commit hash" "cron"
)

# Acronymes a detecter (doivent etre developpes au moins 1 fois)
ACRONYMS=(
  "FOS" "OMC" "TDAH" "PO"
)

# Regex pour D-XXX-NN
DXXX_RE='D-[A-Z]+-[0-9]+'

# Regex pour hash git (7+ caracteres hex standalone)
HASH_RE='\b[a-f0-9]{7,40}\b'

# Regex variables env (MAJUSCULES_AVEC_UNDERSCORE=valeur)
ENV_VAR_RE='\b[A-Z][A-Z0-9_]{5,}=[0-9a-zA-Z]+\b'

total_violations=0
total_files=0
total_ok=0

for file in "${TARGETS[@]}"; do
  if [ ! -f "$file" ]; then
    if [ "$QUIET" -eq 0 ]; then
      echo -e "${RED}[ERREUR]${NC} Fichier introuvable : $file"
    fi
    continue
  fi

  total_files=$((total_files + 1))
  violations=0
  warnings=()

  # Skip fichiers < 20 lignes (trop petits pour brief)
  lines=$(wc -l < "$file")
  if [ "$lines" -lt 20 ]; then
    if [ "$QUIET" -eq 0 ]; then
      echo -e "${GRAY}[SKIP]${NC} $file ($lines lignes, trop court)"
    fi
    continue
  fi

  # 1. Check "En bref (pour Kevin)" en tete (regle CLAUDE.md + P-42)
  first_50=$(head -50 "$file" | tr '[:upper:]' '[:lower:]')
  if ! echo "$first_50" | grep -qE 'en bref.{0,30}kevin'; then
    warnings+=("❌ Pas de section \"En bref (pour Kevin)\" dans les 50 premieres lignes")
    violations=$((violations + 1))
  fi

  # 2. Check D-XXX-NN : chaque occurrence doit avoir une explication proche (parentheses)
  # Dedup par code : 1 warning par code D-XXX-NN, meme s'il apparait N fois
  seen_codes=""
  unique_codes=$(grep -oE "$DXXX_RE" "$file" | sort -u)
  for code in $unique_codes; do
    line_num=$(grep -n "$code" "$file" | head -1 | cut -d: -f1)
    if [ -n "$line_num" ]; then
      context=$(sed -n "${line_num},$((line_num + 2))p" "$file")
      # Si pas de parenthese explicative dans les 2 lignes suivant le code
      if ! echo "$context" | grep -qE "$code[^a-zA-Z0-9].{0,200}\("; then
        warnings+=("⚠️  $code cite ligne $line_num sans traduction entre parentheses a proximite")
        violations=$((violations + 1))
      fi
    fi
  done

  # 3. Check acronymes : chaque acronyme doit avoir son developpement au moins 1 fois
  for acr in "${ACRONYMS[@]}"; do
    if grep -qE "\b$acr\b" "$file"; then
      # Si jamais developpe (pattern "ACR (...)" ou "ACR = ...")
      if ! grep -qE "\b$acr\s*\(" "$file" && ! grep -qE "\b$acr\s*=" "$file"; then
        warnings+=("⚠️  Acronyme $acr utilise mais jamais developpe dans le document")
        violations=$((violations + 1))
      fi
    fi
  done

  # 4. Check termes tech : doivent apparaitre avec une explication entre parentheses au moins 1 fois
  for term in "${TECH_TERMS[@]}"; do
    if grep -qiE "\b$term\b" "$file"; then
      # Si jamais entre parentheses explicatives
      if ! grep -qiE "$term[^a-zA-Z0-9]{0,50}\(" "$file"; then
        warnings+=("⚠️  Terme tech \"$term\" utilise sans explication entre parentheses a proximite")
        violations=$((violations + 1))
      fi
    fi
  done

  # 5. Check variables env brutes
  env_vars=$(grep -oE "$ENV_VAR_RE" "$file" | sort -u | head -5)
  if [ -n "$env_vars" ]; then
    while IFS= read -r var; do
      # Si la variable est citee sans explication
      if ! grep -qE "$var.{0,100}\(" "$file"; then
        warnings+=("⚠️  Variable env \"$var\" citee sans explication")
        violations=$((violations + 1))
      fi
    done <<< "$env_vars"
  fi

  # 6. Check hash git bruts (indicatif, non-bloquant si peu)
  hash_count=$(grep -oE "$HASH_RE" "$file" 2>/dev/null | wc -l | tr -d ' ')
  hash_count=${hash_count:-0}
  if [ "$hash_count" -gt 3 ] 2>/dev/null; then
    warnings+=("ℹ️  $hash_count hash git bruts detectes (prefere 'dernier commit' ou explication)")
    # Pas incremente violations (non-bloquant)
  fi

  # Affichage resultat pour ce fichier
  if [ "$violations" -eq 0 ]; then
    total_ok=$((total_ok + 1))
    if [ "$QUIET" -eq 0 ]; then
      echo -e "${GREEN}[OK]${NC} $file ($lines lignes, conforme D-VULGARIZE-01)"
    fi
  else
    total_violations=$((total_violations + violations))
    if [ "$QUIET" -eq 0 ]; then
      echo -e "${YELLOW}[WARN]${NC} $file ($violations violations)"
      for w in "${warnings[@]}"; do
        echo -e "  $w"
      done
    fi
  fi
done

# Resume final
if [ "$QUIET" -eq 0 ]; then
  echo ""
  echo "───────────────────────────────────────────────────"
  if [ "$total_violations" -eq 0 ]; then
    echo -e "${GREEN}Verdict : D-VULGARIZE-01 CONFORME${NC}"
    echo "  $total_files fichiers scannes, $total_ok conformes, 0 violation"
  else
    echo -e "${YELLOW}Verdict : D-VULGARIZE-01 VIOLATIONS${NC}"
    echo "  $total_files fichiers scannes, $total_ok conformes, $total_violations violations total"
    echo ""
    echo "Spec : docs/core/communication.md section 6.0"
    echo "Check-list (8 questions) : section 6.0.3"
  fi
fi

# Exit code
if [ "$total_violations" -gt 0 ]; then
  exit 1
else
  exit 0
fi
