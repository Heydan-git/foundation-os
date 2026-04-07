#!/bin/bash
# module-scaffold.sh — Scaffold un nouveau module Foundation OS
# Usage: bash scripts/module-scaffold.sh <nom-module>
# Exemple: bash scripts/module-scaffold.sh finance
# Exit codes: 0=OK, 1=erreur (mauvais arg, conflit, ecriture ratee)
# Spec: docs/core/tools.md, .claude/commands/new-project.md

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
DIM='\033[0;90m'
RST='\033[0m'

# ── --help ─────────────────────────────────────────────────────────
if [ $# -eq 0 ] || [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  cat <<'EOF'
module-scaffold.sh — Scaffold un nouveau module Foundation OS

Usage:
  bash scripts/module-scaffold.sh <nom-module>

Exemples:
  bash scripts/module-scaffold.sh finance
  bash scripts/module-scaffold.sh sante

Cree:
  modules/<nom>/
  ├── README.md       (template Foundation OS, status "En cours de definition")
  ├── package.json    (skeleton minimal: name, version, private)
  └── src/.gitkeep    (dossier vide, prêt à coder)

Effets de bord:
  - Update CONTEXT.md table Modules:
      * si la ligne | <Nom> | ... existe deja → status passe a "initialise"
      * sinon → ajoute une ligne "| <Nom> | initialise | Cree YYYY-MM-DD |"

Refuse si:
  - Aucun argument fourni
  - Nom invalide (kebab-case requis: a-z, 0-9, -, commence par lettre)
  - modules/<nom>/ existe deja sur disque

Exit codes:
  0 = OK
  1 = erreur
EOF
  [ $# -eq 0 ] && exit 1 || exit 0
fi

NAME="$1"

# ── Validation nom (kebab-case) ────────────────────────────────────
if ! echo "$NAME" | grep -qE '^[a-z][a-z0-9-]*$'; then
  echo -e "${RED}[KO]${RST} Nom invalide: '$NAME' (kebab-case requis: a-z, 0-9, -, commence par lettre)"
  exit 1
fi

TARGET="modules/$NAME"

# ── Idempotence : refuse si dossier existe ─────────────────────────
if [ -e "$TARGET" ]; then
  echo -e "${RED}[KO]${RST} $TARGET existe deja — abandon (script idempotent)"
  exit 1
fi

# Capitalisation pour CONTEXT.md (finance → Finance, app-builder → App builder)
NAME_CAP=$(echo "$NAME" | awk '{print toupper(substr($0,1,1)) substr($0,2)}' | tr '-' ' ')
TODAY=$(date +%Y-%m-%d)

echo ""
echo "SCAFFOLD — modules/$NAME ($TODAY)"
echo ""

# ── Creation arborescence ──────────────────────────────────────────
mkdir -p "$TARGET/src" || { echo -e "${RED}[KO]${RST} mkdir $TARGET/src"; exit 1; }
touch "$TARGET/src/.gitkeep"
echo -e "  ${GRN}[OK]${RST} mkdir $TARGET/src + .gitkeep"

# ── README.md ──────────────────────────────────────────────────────
cat > "$TARGET/README.md" <<EOF
# $NAME_CAP
> Module Foundation OS — Cree le $TODAY

## Objectif
A definir.

## Stack
A decider avec Kevin avant de coder.

## Etat
En cours de definition.
EOF
echo -e "  ${GRN}[OK]${RST} README.md cree"

# ── package.json minimal ───────────────────────────────────────────
cat > "$TARGET/package.json" <<EOF
{
  "name": "$NAME",
  "version": "0.0.0",
  "private": true,
  "description": "Module Foundation OS — $NAME_CAP"
}
EOF
echo -e "  ${GRN}[OK]${RST} package.json cree"

# ── Update CONTEXT.md table Modules ────────────────────────────────
LINE_TO_ADD="| $NAME_CAP | initialise | Cree $TODAY |"

NAME_CAP="$NAME_CAP" LINE_TO_ADD="$LINE_TO_ADD" python3 <<'PYEOF'
import os, re, sys

name_cap = os.environ["NAME_CAP"]
line_to_add = os.environ["LINE_TO_ADD"]

with open("CONTEXT.md", "r", encoding="utf-8") as f:
    content = f.read()

# Capture la table Modules : header (titre + ligne titres + separateur) puis n lignes "| ... |", puis blank
section_re = re.compile(
    r"(## Modules\n\n\| Module \| Status \| Detail \|\n\|[-| ]+\|\n)"  # header
    r"((?:\|[^\n]*\|\n)+)"                                              # rows
    r"(\n)"                                                             # trailing blank
)
m = section_re.search(content)
if not m:
    print("[KO] Section ## Modules introuvable dans CONTEXT.md", file=sys.stderr)
    sys.exit(1)

header, rows_text, trailer = m.group(1), m.group(2), m.group(3)
rows = [r for r in rows_text.split("\n") if r]

escaped = re.escape(name_cap)
row_pat = re.compile(rf"^\| {escaped} \|")

updated = False
new_rows = []
for r in rows:
    if row_pat.match(r):
        new_rows.append(line_to_add)
        updated = True
    else:
        new_rows.append(r)
if not updated:
    new_rows.append(line_to_add)

new_section = header + "\n".join(new_rows) + "\n" + trailer
new_content = content[:m.start()] + new_section + content[m.end():]

with open("CONTEXT.md", "w", encoding="utf-8") as f:
    f.write(new_content)

verb = "ligne mise a jour" if updated else "ligne ajoutee"
print(f"  [OK] CONTEXT.md ({verb})")
PYEOF

PY_RC=$?
if [ $PY_RC -ne 0 ]; then
  echo -e "${RED}[KO]${RST} Update CONTEXT.md a echoue (rc=$PY_RC) — rollback $TARGET"
  rm -rf "$TARGET"
  exit 1
fi

echo ""
echo -e "${GRN}Module $NAME_CAP scaffold dans $TARGET${RST}"
echo -e "${DIM}Prochaine etape : decider stack avec Kevin avant de coder${RST}"
exit 0
