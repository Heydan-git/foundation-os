#!/usr/bin/env bash
# wiki-counts-sync.sh — Regenere wiki/meta/counts.md depuis le filesystem
# Usage : bash scripts/wiki-counts-sync.sh [--check]
#
# --check : mode dry-run — compare counts.md aux valeurs filesystem, exit 1 si drift
# (sans argument) : regenere counts.md avec les valeurs reelles
#
# Spec : docs/core/knowledge.md + audit v2 Phase 4 (source unique counts)
# Refs : wiki/meta/counts.md
set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

if [ ! -d wiki/ ]; then
  echo "[INFO] Wiki absent — nothing to sync"
  exit 0
fi

# Mesure filesystem
PAGES_TOTAL=$(find wiki -name "*.md" | wc -l | tr -d ' ')
CONCEPTS=$(find wiki/concepts -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ENTITIES=$(find wiki/entities -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
SOURCES=$(find wiki/sources -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
META=$(find wiki/meta -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
TEMPLATES=$(find wiki/meta/templates -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAIN_CONTENT=$(find wiki/domains -mindepth 2 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAINS_INDEX=$(find wiki/domains -maxdepth 2 -name "index-*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAIN_CONCEPTS=$(( DOMAIN_CONTENT - DOMAINS_INDEX ))
WIKILINKS=$(grep -rho "\[\[[^]]*\]\]" wiki/ 2>/dev/null | wc -l | tr -d ' ')
FUNCTIONAL=$(( PAGES_TOTAL - TEMPLATES ))
DATE=$(date +%Y-%m-%d)

if [ "${1:-}" = "--check" ]; then
  # Verifier que counts.md reflete les valeurs reelles
  if [ ! -f wiki/meta/counts.md ]; then
    echo "[DRIFT] wiki/meta/counts.md n'existe pas. Regenerer avec 'bash $0' sans --check."
    exit 1
  fi
  DOC_PAGES=$(grep -m1 "Pages physiques" wiki/meta/counts.md | grep -oE "[0-9]+" | head -1)
  if [ "$DOC_PAGES" != "$PAGES_TOTAL" ]; then
    echo "[DRIFT] counts.md dit $DOC_PAGES pages physiques, filesystem en a $PAGES_TOTAL."
    echo "  Regenerer : bash $0"
    exit 1
  fi
  DOC_LINKS=$(grep -m1 "Wikilinks totaux" wiki/meta/counts.md | grep -oE "\| [0-9]+" | grep -oE "[0-9]+")
  if [ -n "$DOC_LINKS" ] && [ "$DOC_LINKS" != "$WIKILINKS" ]; then
    echo "[DRIFT] counts.md dit $DOC_LINKS wikilinks, filesystem en a $WIKILINKS."
    echo "  Regenerer : bash $0"
    exit 1
  fi
  echo "[OK] counts.md sync ($PAGES_TOTAL pages, $WIKILINKS wikilinks)"
  exit 0
fi

# Mode ecriture : regenerer counts.md
cat > wiki/meta/counts.md << INNER_EOF
---
type: meta
title: "Wiki Counts — Source unique"
updated: $DATE
tags:
  - meta
  - counts
  - source-of-truth
status: evergreen
related:
  - "[[index-wiki]]"
  - "[[hot]]"
  - "[[foundation-os-map]]"
  - "[[overview]]"
---

# Wiki Counts

> **Source unique** des compteurs wiki Foundation OS. Auto-regenere par
> \`scripts/wiki-counts-sync.sh\`.

## Mise a jour : $DATE

### Pages

| Metrique | Valeur | Commande verification |
|----------|--------|-----------------------|
| Pages physiques | $PAGES_TOTAL | \`find wiki -name "*.md" \| wc -l\` |
| Pages fonctionnelles (hors templates) | $FUNCTIONAL | $PAGES_TOTAL - $TEMPLATES templates |
| Concepts racine | $CONCEPTS | \`find wiki/concepts -maxdepth 1 -name "*.md"\` |
| Entities | $ENTITIES | \`find wiki/entities -maxdepth 1 -name "*.md"\` |
| Sources | $SOURCES | \`find wiki/sources -maxdepth 1 -name "*.md"\` |
| Meta (hors templates) | $META | \`find wiki/meta -maxdepth 1 -name "*.md"\` |
| Templates | $TEMPLATES | \`find wiki/meta/templates -name "*.md"\` |
| Domain indexes | $DOMAINS_INDEX | \`find wiki/domains -maxdepth 2 -name "index-*.md"\` |
| Domain content (hors index) | $DOMAIN_CONCEPTS | $DOMAIN_CONTENT total - $DOMAINS_INDEX indexes |

### Wikilinks

| Metrique | Valeur | Commande |
|----------|--------|----------|
| Wikilinks totaux | $WIKILINKS | \`grep -rho "\\[\\[[^]]*\\]\\]" wiki/ \| wc -l\` |

## Consumers (pages qui pointent ici, source unique)

- \`wiki/hot.md\` (section Key Recent Facts)
- \`wiki/overview.md\` (section Stats)
- \`wiki/index-wiki.md\` (header + section Statistiques)
- \`wiki/log.md\` (resultats cumules)
- \`wiki/meta/foundation-os-map.md\` (section Statistiques)

Toute page qui affiche des counts wiki DOIT pointer vers \`counts.md\` via wikilink, pas dupliquer les chiffres.

## Comment regenerer

\`\`\`bash
bash scripts/wiki-counts-sync.sh        # regenere counts.md
bash scripts/wiki-counts-sync.sh --check # verifie sync sans ecrire
\`\`\`
INNER_EOF

echo "[OK] wiki/meta/counts.md regenere ($PAGES_TOTAL pages, $WIKILINKS wikilinks, $DATE)"
