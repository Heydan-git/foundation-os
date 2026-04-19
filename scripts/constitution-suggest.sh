#!/usr/bin/env bash
# constitution-suggest.sh — Scan wiki/meta/lessons-learned.md pour flag "🎯 to-constitute" → propose P-XX drafts
# Spec: docs/core/body.md section 5 (Couche C4 Learning loop)
# Integration: invoque manuellement par Claude ou Kevin quand lessons accumulees (D-BODY-01 P3)
#
# Usage:
#   bash scripts/constitution-suggest.sh           (verbose : drafts P-XX proposes)
#   bash scripts/constitution-suggest.sh --quiet   (compteur flags only, chain)

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

QUIET=0
[ "${1:-}" = "--quiet" ] && QUIET=1

LESSONS="wiki/meta/lessons-learned.md"
CONSTITUTION="docs/core/constitution.md"

# --- Guard : fichiers absents ---

if [ ! -f "$LESSONS" ]; then
  if [ "$QUIET" -eq 1 ]; then
    echo "Constitution suggest : 0 flags (lessons-learned absent)"
    exit 0
  fi
  echo "Pas de $LESSONS trouve"
  exit 0
fi

# --- Compte flags 🎯 to-constitute ---

COUNT=$(grep -c "🎯" "$LESSONS" 2>/dev/null | tr -d ' \n')
COUNT=${COUNT:-0}

if [ "$QUIET" -eq 1 ]; then
  echo "Constitution suggest : $COUNT flags 🎯"
  exit 0
fi

if [ "$COUNT" -eq 0 ]; then
  echo ""
  echo "CONSTITUTION SUGGEST — $(date +%Y-%m-%d)"
  echo ""
  echo "  0 flag 🎯 to-constitute dans $LESSONS"
  echo ""
  echo "Convention (D-BODY-01 P3) :"
  echo "  Pour proposer un nouveau principe P-XX depuis une lesson :"
  echo "  1. Prefixer titre section lesson avec 🎯 (ex: '## 🎯 Titre (YYYY-MM-DD)')"
  echo "  2. Relancer ce script → proposition draft P-XX formate"
  echo "  3. Kevin refine + append manuellement docs/core/constitution.md"
  echo ""
  exit 0
fi

# --- Derniere P-XX utilisee dans constitution ---

LAST_P=0
if [ -f "$CONSTITUTION" ]; then
  LAST_P=$(grep -oE "^## P-[0-9]+" "$CONSTITUTION" 2>/dev/null | grep -oE "[0-9]+" | sort -n | tail -1)
  LAST_P=${LAST_P:-0}
fi

echo ""
echo "CONSTITUTION SUGGEST — $(date +%Y-%m-%d)"
echo ""
echo "  $COUNT flags 🎯 detectes dans $LESSONS"
echo "  Derniere P-XX dans constitution : P-$(printf '%02d' $LAST_P)"
echo ""

# --- Extract flagged sections + format drafts via python3 ---

python3 - "$LESSONS" "$LAST_P" <<'PYEOF'
import sys
import re

lessons_path = sys.argv[1]
last_p = int(sys.argv[2])

with open(lessons_path) as f:
    content = f.read()

# Split by ## headers (level 2 sections)
parts = re.split(r'^(## .+)$', content, flags=re.MULTILINE)
# parts alternates : preamble, title, body, title, body, ...

flagged = []
for i in range(1, len(parts) - 1, 2):
    title = parts[i].strip()
    body = parts[i + 1] if (i + 1) < len(parts) else ""
    if "🎯" in title:
        # Extract first 5 non-empty lines for context
        body_lines = [l.rstrip() for l in body.split('\n') if l.strip()][:5]
        flagged.append((title, body_lines))

if not flagged:
    print("  (aucune section avec 🎯 dans les titres)")
    sys.exit(0)

print(f"--- {len(flagged)} drafts P-XX proposes ---\n")

for i, (title, body) in enumerate(flagged, 1):
    p_num = last_p + i
    # Clean title : remove ## and 🎯
    clean_title = title.replace("## ", "").replace("🎯 ", "").replace("🎯", "")
    print(f"## P-{p_num:02d} {clean_title}")
    print()
    print(f"**Regle** : <formuler en imperatif 1 ligne depuis la lesson>")
    print(f"**Pourquoi** : <raison racine dans lesson, 1-2 lignes>")
    print(f"**Done** : <exemple concret comportement aligne>")
    print(f"**Not-done** : <exemple concret anti-pattern>")
    print(f"**Source** : `wiki/meta/lessons-learned.md` section \"{clean_title}\"")
    print()
    print("Contexte lesson (5 premieres lignes) :")
    for line in body:
        print(f"  {line}")
    print()
    print("---")
    print()

print(f"Action Kevin : pour chaque draft, refine Regle/Done/Not-done et append {sys.argv[0].replace('.sh', '')}... Append-only, jamais renumerotation.")
PYEOF

echo ""

exit 0
