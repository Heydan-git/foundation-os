#!/bin/bash
# sync-check.sh — Audit complet de coherence Foundation OS
# Usage: bash scripts/sync-check.sh
# Exit codes: 0=SAIN, 1=BROKEN, 2=DEGRADED
# Spec: .claude/commands/sync.md + docs/core/monitor.md

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
DIM='\033[0;90m'
RST='\033[0m'

CRITICAL=0
WARNING=0

echo ""
echo "SYNC — $(date +%Y-%m-%d)"
echo ""

# ── 1. Base health-check (Critical + Warning + Info de Monitor) ────

HEALTH_OUT=$(bash scripts/health-check.sh 2>&1)
HEALTH_EXIT=$?
echo "$HEALTH_OUT"
if [ $HEALTH_EXIT -eq 1 ]; then
  CRITICAL=$((CRITICAL + 1))
elif [ $HEALTH_EXIT -eq 2 ]; then
  WARNING=$((WARNING + 1))
fi

echo ""
echo "[EXTENDED]"

# ── 2. Modules actifs vs CONTEXT.md ────────────────────────────────

FS_ACTIVE=$(ls -1 modules/*/package.json 2>/dev/null | awk -F'/' '{print $2}')
MISSING_CTX=""
for m in $FS_ACTIVE; do
  if ! grep -qiw "$m" CONTEXT.md; then
    MISSING_CTX="$MISSING_CTX $m"
  fi
done
if [ -z "$MISSING_CTX" ]; then
  COUNT=$(echo "$FS_ACTIVE" | wc -w | tr -d ' ')
  echo -e "  ${GRN}[OK]${RST} Modules actifs refs dans CONTEXT.md ($COUNT/$COUNT)"
else
  echo -e "  ${YEL}[WARN]${RST} Modules actifs sans ref CONTEXT.md:$MISSING_CTX"
  WARNING=$((WARNING + 1))
fi

# ── 3. Refs — scan suppressions du dernier commit seulement ────────
# Heuristique minimale (HEAD vs HEAD~1) : on cherche les refs vers les
# fichiers supprimes dans le dernier commit, dans les repertoires vivants.
# Scope full-history = trop de faux positifs (voir ref-checker backlog
# docs/core/tools.md pour un outil dedie).

# Verifier explicitement que HEAD~1 existe (single-commit repo cas particulier)
HEAD1_EXISTS=$(git rev-parse --verify HEAD~1 2>/dev/null || echo "")
if [ -z "$HEAD1_EXISTS" ]; then
  echo -e "  ${DIM}[SKIP]${RST} Refs last commit (single-commit repo, HEAD~1 absent)"
  DELETED_HEAD=""
else
  DELETED_HEAD=$(git diff --diff-filter=D --name-only HEAD~1 HEAD 2>/dev/null \
    | grep -v -E '^(node_modules|\.omc|\.archive|dist|\.git|_bmad)/' \
    | grep -v -E '(^|/)(package|package-lock|tsconfig)\.json$' \
    | grep -v -E '(^|/)(README|CHANGELOG|LICENSE|license)\.md$' \
    | grep -v -E '(^|/)index\.(js|ts|tsx|jsx)$' \
    || true)
fi

BROKEN_REFS=""
BROKEN_COUNT=0
if [ -n "$DELETED_HEAD" ]; then
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    bname=$(basename "$f")
    [ ${#bname} -lt 6 ] && continue
    refs=$(grep -rl "$bname" \
      .claude/ docs/ scripts/ \
      modules/app/src modules/app/*.json modules/app/*.ts \
      CLAUDE.md CONTEXT.md 2>/dev/null \
      | grep -v '^\.archive/' \
      | head -3)
    if [ -n "$refs" ]; then
      BROKEN_REFS="$BROKEN_REFS\n    - $bname → $(echo "$refs" | tr '\n' ',' | sed 's/,$//')"
      BROKEN_COUNT=$((BROKEN_COUNT + 1))
    fi
  done <<< "$DELETED_HEAD"
fi

if [ $BROKEN_COUNT -eq 0 ]; then
  if [ -z "$DELETED_HEAD" ]; then
    SCAN_COUNT=0
  else
    SCAN_COUNT=$(printf '%s\n' "$DELETED_HEAD" | grep -c .)
  fi
  echo -e "  ${GRN}[OK]${RST} Refs last commit ($SCAN_COUNT suppressions utiles scannees, 0 cassee)"
else
  echo -e "  ${YEL}[WARN]${RST} Refs possibles vers fichiers supprimes last commit ($BROKEN_COUNT):"
  echo -e "$BROKEN_REFS"
  WARNING=$((WARNING + 1))
fi

# ── 4. Core OS coherence (agents + commands) ───────────────────────

EXPECTED_AGENTS="dev-agent doc-agent os-architect review-agent"
EXPECTED_COMMANDS="session-start session-end new-project sync"

MISS_AGENTS=""
for a in $EXPECTED_AGENTS; do
  [ -f ".claude/agents/${a}.md" ] || MISS_AGENTS="$MISS_AGENTS $a"
done
MISS_COMMANDS=""
for c in $EXPECTED_COMMANDS; do
  [ -f ".claude/commands/${c}.md" ] || MISS_COMMANDS="$MISS_COMMANDS $c"
done
if [ -z "$MISS_AGENTS" ] && [ -z "$MISS_COMMANDS" ]; then
  echo -e "  ${GRN}[OK]${RST} Core OS coherence (4 agents + 4 commands)"
else
  [ -n "$MISS_AGENTS" ] && echo -e "  ${RED}[KO]${RST} Agents manquants:$MISS_AGENTS"
  [ -n "$MISS_COMMANDS" ] && echo -e "  ${RED}[KO]${RST} Commands manquantes:$MISS_COMMANDS"
  CRITICAL=$((CRITICAL + 1))
fi

# ── 5. Specs docs/core/ coherence ──────────────────────────────────

EXPECTED_SPECS="cortex memory monitor tools architecture-core"
MISS_SPECS=""
for s in $EXPECTED_SPECS; do
  [ -f "docs/core/${s}.md" ] || MISS_SPECS="$MISS_SPECS $s"
done
if [ -z "$MISS_SPECS" ]; then
  echo -e "  ${GRN}[OK]${RST} Specs Core OS (5/5 presentes)"
else
  echo -e "  ${RED}[KO]${RST} Specs Core OS manquantes:$MISS_SPECS"
  CRITICAL=$((CRITICAL + 1))
fi

# ── 6. Routes CONTEXT.md vs App.tsx ────────────────────────────────

APP_TSX="modules/app/src/App.tsx"
CTX_ROUTES_RAW=$(grep -E "^- \*\*Routes\*\*" CONTEXT.md 2>/dev/null | head -1 | sed 's/^[^:]*: //')
CTX_ROUTES=$(printf '%s' "$CTX_ROUTES_RAW" | tr ',' '\n' | sed 's/([^)]*)//g; s/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$' | sort -u)
if [ -f "$APP_TSX" ]; then
  CODE_ROUTES=$(grep -oE 'Route path="[^"]+"' "$APP_TSX" | sed 's/Route path="//; s/"$//' | grep -v '^\*$' | sort -u)
else
  CODE_ROUTES=""
fi

if [ -z "$CTX_ROUTES" ]; then
  echo -e "  ${YEL}[WARN]${RST} Routes: ligne CONTEXT.md introuvable (pattern '- **Routes**')"
  WARNING=$((WARNING + 1))
elif [ -z "$CODE_ROUTES" ]; then
  echo -e "  ${YEL}[WARN]${RST} Routes: $APP_TSX introuvable ou sans <Route path>"
  WARNING=$((WARNING + 1))
else
  CTX_COUNT=$(printf '%s\n' "$CTX_ROUTES" | grep -c .)
  CODE_COUNT=$(printf '%s\n' "$CODE_ROUTES" | grep -c .)
  MISS_CODE=$(comm -23 <(printf '%s\n' "$CTX_ROUTES") <(printf '%s\n' "$CODE_ROUTES"))
  MISS_CTX=$(comm -13 <(printf '%s\n' "$CTX_ROUTES") <(printf '%s\n' "$CODE_ROUTES"))
  if [ -z "$MISS_CODE" ] && [ -z "$MISS_CTX" ]; then
    echo -e "  ${GRN}[OK]${RST} Routes CONTEXT.md <-> App.tsx ($CTX_COUNT match)"
  else
    echo -e "  ${YEL}[WARN]${RST} Routes CONTEXT.md vs App.tsx (diff):"
    [ -n "$MISS_CODE" ] && echo -e "    manquantes dans code: $(printf '%s' "$MISS_CODE" | tr '\n' ' ')"
    [ -n "$MISS_CTX" ]  && echo -e "    manquantes dans CONTEXT: $(printf '%s' "$MISS_CTX" | tr '\n' ' ')"
    WARNING=$((WARNING + 1))
  fi
fi

# ── 7. Fonts (Void Glass) ──────────────────────────────────────────
# Interdictions design-system.md :
#   - Outfit ou Inter dans font-family/fontFamily (toujours interdit)
#   - system-ui dans font-family/fontFamily sans Figtree sur la meme
#     ligne (system-ui seul interdit, OK uniquement en fallback apres
#     Figtree)

FONT_VIOL_FILE=$(mktemp)
grep -rnE '(font-family|fontFamily).*(Outfit|Inter)' \
  modules/app/src --include="*.css" --include="*.tsx" --include="*.ts" 2>/dev/null \
  >> "$FONT_VIOL_FILE" || true
grep -rnE '(font-family|fontFamily).*system-ui' \
  modules/app/src --include="*.css" --include="*.tsx" --include="*.ts" 2>/dev/null \
  | grep -v 'Figtree' >> "$FONT_VIOL_FILE" || true
FONT_VIOL=$(wc -l < "$FONT_VIOL_FILE" | tr -d ' ')

if [ "$FONT_VIOL" -eq 0 ]; then
  echo -e "  ${GRN}[OK]${RST} Fonts Void Glass (Figtree primaire, 0 violation)"
else
  echo -e "  ${YEL}[WARN]${RST} Fonts violations Void Glass ($FONT_VIOL):"
  while IFS= read -r vline; do
    [ -n "$vline" ] && echo -e "    - $vline"
  done < "$FONT_VIOL_FILE"
  WARNING=$((WARNING + 1))
fi
rm -f "$FONT_VIOL_FILE"

echo ""

# ── VERDICT ────────────────────────────────────────────────────────

if [ "$CRITICAL" -gt 0 ]; then
  echo -e "${RED}Verdict : BROKEN${RST} ($CRITICAL critical, $WARNING warning)"
  exit 1
elif [ "$WARNING" -gt 0 ]; then
  echo -e "${YEL}Verdict : DEGRADED${RST} (0 critical, $WARNING warning)"
  exit 2
else
  echo -e "${GRN}Verdict : SAIN${RST}"
  exit 0
fi
