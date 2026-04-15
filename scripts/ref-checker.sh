#!/bin/bash
# ref-checker.sh — Detect broken file refs full-repo
# Usage : bash scripts/ref-checker.sh [--help]
# Exit codes : 0 = clean, 1 = broken refs trouvees
# Spec : docs/core/tools.md, plan docs/plans/2026-04-07-finition-os.md (S2)

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
  cat <<EOF
ref-checker.sh — Detect broken file refs full-repo

Scans all .md files (excluding .archive, node_modules, dist, .git,
.omc, _bmad, .claude/worktrees, modules/app/dist, docs/travaux-cowork)
for two ref patterns:

  1. Markdown links: [text](path/to/file.ext)
     Resolved relative to the source file directory
     Skipped: http(s)://, mailto:, anchors (#), empty refs, refs
     containing glob/template chars (*, <, >, {, }, [, ])
     Inline code (\`...\`) is stripped from the line before matching
     Fenced code blocks (\`\`\`...\`\`\`) are skipped entirely

  2. Backtick paths: \`scripts/foo.sh\`, \`docs/core/tools.md\`
     Must start with a known repo dir prefix
     (scripts|docs|modules|.claude|_bmad|supabase|.github|.archive)
     Resolved relative to repo root
     Strips :line, #anchor, ?query suffixes
     Skipped: refs containing glob/template chars

Scope vs sync-check.sh : sync-check ne scanne que les suppressions
HEAD~1..HEAD (heuristique minimale). ref-checker fait un audit
full-repo a un instant T, complementaire.

Exit codes :
  0 — no broken refs
  1 — at least one broken ref found

Usage :
  bash scripts/ref-checker.sh
  bash scripts/ref-checker.sh --help
EOF
  exit 0
fi

RED='\033[0;31m'
GRN='\033[0;32m'
DIM='\033[0;90m'
RST='\033[0m'

KNOWN_DIRS_RE='^(scripts|docs|modules|\.claude|_bmad|supabase|\.github|\.archive)/'

# Paths a ignorer (faux positifs : existent dans main repo mais pas dans un worktree,
# OU sont gitignored mais legitimement referenced).
# Pattern : prefixe de chemin qui sera "ignored" dans le check d'existence.
IGNORE_REFS_RE='^(\.claude/worktrees/|docs/travaux-cowork/|\.archive/settings-local-before-migration\.json|\.archive/memory\.md|\.archive/worktrees-orphelins/admiring-sutherland-20260411/|modules/design-system/base DS/|modules/design-system/src/components/void-glass/|modules/design-system/tokens/(primitives|semantic|bridge|source/primitives|source/semantic)/|modules/app/src/layouts/|\.archive/(ds-void-glass|ds-shadcn-vanilla|ds-patterns-old|ds-tokens-dtcg-old|travaux-cowork)|docs/plans/2026-04-XX-)'

# Returns 0 if ref contains glob/template chars (* < > { } [ ])
has_glob_chars() {
  case "$1" in
    *'*'*|*'<'*|*'>'*|*'{'*|*'}'*|*'['*|*']'*) return 0 ;;
    *) return 1 ;;
  esac
}

BROKEN_FILE=$(mktemp)
trap 'rm -f "$BROKEN_FILE"' EXIT
SCAN_COUNT=0

echo ""
echo "REF-CHECKER — $(date +%Y-%m-%d)"
echo ""

# Subroutine : process one source file (line-by-line, code-block-aware).
# Pure bash parameter expansion — no per-line subprocess.
process_file() {
  local f="$1"
  local src_dir
  src_dir=$(dirname "$f")
  local in_code_block=0
  local lineno=0
  local line clean_line remainder before ref ref_clean target

  while IFS= read -r line; do
    lineno=$((lineno + 1))

    # Toggle fenced code block on lines starting with ``` (allow indent)
    if [[ "$line" =~ ^[[:space:]]*\`\`\` ]]; then
      in_code_block=$((1 - in_code_block))
      continue
    fi
    [ "$in_code_block" -eq 1 ] && continue

    # ── Strip inline code `...` from a copy of the line ─────────
    clean_line="$line"
    while [[ "$clean_line" == *'`'*'`'* ]]; do
      before="${clean_line%%\`*}"
      remainder="${clean_line#*\`}"   # past first `
      remainder="${remainder#*\`}"    # past second `
      clean_line="${before}${remainder}"
    done

    # ── Pattern 1 : markdown links [text](path) ─────────────────
    remainder="$clean_line"
    while [[ "$remainder" == *']('* ]]; do
      remainder="${remainder#*\](}"   # past ](
      case "$remainder" in
        *')'*) : ;;
        *) break ;;
      esac
      ref="${remainder%%)*}"
      remainder="${remainder#*)}"
      [ -z "$ref" ] && continue
      case "$ref" in
        http://*|https://*|mailto:*|'#'*) continue ;;
      esac
      has_glob_chars "$ref" && continue
      ref_clean="${ref%%#*}"
      ref_clean="${ref_clean%%\?*}"
      [ -z "$ref_clean" ] && continue
      if [[ "$ref_clean" == /* ]]; then
        target=".${ref_clean}"
      else
        target="${src_dir}/${ref_clean}"
      fi
      target="${target#./}"
      if [ ! -e "$target" ] && [ ! -e "./$target" ]; then
        echo "$f:$lineno → [md] $ref" >> "$BROKEN_FILE"
      fi
    done

    # ── Pattern 2 : backtick refs `dir/...` ────────────────────
    remainder="$line"
    while [[ "$remainder" == *'`'*'`'* ]]; do
      remainder="${remainder#*\`}"    # past opening `
      ref="${remainder%%\`*}"
      remainder="${remainder#*\`}"    # past closing `
      [[ "$ref" =~ $KNOWN_DIRS_RE ]] || continue
      has_glob_chars "$ref" && continue
      ref_clean="${ref%%:*}"
      ref_clean="${ref_clean%%#*}"
      ref_clean="${ref_clean%%\?*}"
      ref_clean="${ref_clean%% *}"
      [ -z "$ref_clean" ] && continue
      [[ "$ref_clean" =~ $IGNORE_REFS_RE ]] && continue
      if [ ! -e "$ref_clean" ]; then
        echo "$f:$lineno → [bt] $ref" >> "$BROKEN_FILE"
      fi
    done

  done < "$f"
}

while IFS= read -r f; do
  SCAN_COUNT=$((SCAN_COUNT + 1))
  process_file "$f"
done < <(find . -type f -name "*.md" \
  -not -path './.archive/*' \
  -not -path './node_modules/*' \
  -not -path './dist/*' \
  -not -path './.git/*' \
  -not -path './.omc/*' \
  -not -path './_bmad/*' \
  -not -path './.claude/worktrees/*' \
  -not -path './docs/travaux-cowork/*' \
  -not -path './modules/app/dist/*' \
  -not -path './modules/*/node_modules/*')

BROKEN_LINES=()
if [ -s "$BROKEN_FILE" ]; then
  while IFS= read -r ln; do
    BROKEN_LINES+=("$ln")
  done < "$BROKEN_FILE"
fi
BROKEN_COUNT=${#BROKEN_LINES[@]}

if [ "$BROKEN_COUNT" -eq 0 ]; then
  echo -e "  ${GRN}[OK]${RST} $SCAN_COUNT .md scannes, 0 ref cassee"
  exit 0
else
  echo -e "  ${RED}[KO]${RST} $SCAN_COUNT .md scannes, $BROKEN_COUNT refs cassees:"
  for ln in "${BROKEN_LINES[@]}"; do
    echo "    - $ln"
  done
  exit 1
fi
