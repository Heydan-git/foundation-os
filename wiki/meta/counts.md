---
type: meta
title: "Wiki Counts — Source unique"
updated: 2026-04-17
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

> **Source unique** des compteurs wiki Foundation OS. Tous les autres fichiers
> (hot.md, overview.md, index-wiki.md, foundation-os-map.md, CONTEXT.md) doivent
> pointer ici au lieu de dupliquer des chiffres qui derivent.
>
> Auto-regenere par `bash scripts/wiki-counts-sync.sh` (Phase 6 audit v2).

## Mise a jour : 2026-04-17

### Pages

| Metrique | Valeur | Commande verification |
|----------|--------|-----------------------|
| Pages physiques | 48 | `find wiki -name "*.md" \| wc -l` |
| Pages fonctionnelles (hors templates) | 43 | 48 - 5 templates |
| Concepts racine | 9 | `find wiki/concepts -maxdepth 1 -name "*.md"` |
| Entities | 5 | `find wiki/entities -maxdepth 1 -name "*.md"` |
| Sources | 4 | `find wiki/sources -maxdepth 1 -name "*.md"` |
| Meta (hors templates) | 14 | `find wiki/meta -maxdepth 1 -name "*.md"` |
| Templates | 5 | `find wiki/meta/templates -name "*.md"` |
| Domain indexes | 5 | `find wiki/domains -maxdepth 2 -name "index-*.md"` |
| Domain content (hors index) | 2 | domains/design/concepts + domains/dev/concepts |
| Questions | 0 | Phase 5 non demarree |
| Comparisons | 0 | Phase 5 non demarree |

**Verification somme** : 9 concepts + 5 entities + 4 sources + 14 meta + 5 templates + 5 domain indexes + 2 domain concepts + 4 racine (hot, index-wiki, log, overview) = **48**. ✓

### Wikilinks

| Metrique | Valeur | Commande |
|----------|--------|----------|
| Wikilinks totaux | 791 | `grep -rho "\[\[[^]]*\]\]" wiki/ \| wc -l` |
| Wikilinks `../` residuels | 0 | Regle D-NAMING-02 respectee (audit v2 Agent 3) |
| Cross-vault wikilinks (vers modules/, docs/) | Inclus dans 791 | Grace a D-VAULT-01 vault=racine |

### Domaines

| Domaine | Index | Concepts | Sources | Pages totales | Maturite |
|---------|-------|----------|---------|---------------|----------|
| Trading | ✅ | 0 | 0 | 1 | 🔴 Vide (Phase 5) |
| Finance | ✅ | 0 | 0 | 1 | 🔴 Vide (Phase 5) |
| Sante | ✅ | 0 | 0 | 1 | 🔴 Vide (Phase 5) |
| Design | ✅ | 1 | 0 | 2 | 🟡 Seed |
| Dev | ✅ | 1 | 0 | 2 | 🟡 Seed |
| Cross-domain | — | 9 | 4 | 18 | 🟢 Actif |

### Pages par statut

| Statut | Count | Exemples |
|--------|-------|----------|
| mature | ~8 | LLM Wiki Pattern, Hot Cache, Andrej Karpathy, Obsidian, Foundation OS (canonical) |
| seed | ~12 | Core OS, Brief v12, Neuroplasticite, TDAH workflow, Void Glass, Pinecone |
| evergreen | ~20 | Meta pages (hot, sessions-recent, lessons-learned, thinking, indexes) |
| draft | 0 | — |

## Comment regenerer

```bash
# Mode ecriture (regenere counts.md)
bash scripts/wiki-counts-sync.sh

# Mode verification (detecte drift sans ecrire)
bash scripts/wiki-counts-sync.sh --check
```

Script cree en Phase 6 audit v2.

## Historique drift (resolu 2026-04-17)

Avant cette source unique :
- `hot.md` : "41 pages, 762+ wikilinks"
- `overview.md` : "36 pages"
- `index-wiki.md` : "Total pages: 43"
- `foundation-os-map.md` : "93 connectes"
- `filesystem` : 48 pages

**5 sources contradictoires.** Resolu par `wiki/meta/counts.md` source unique + alignement de toutes les autres pages.

Refs audit v2 : `docs/audits/2026-04-16-mega-audit-v2/raw/agent-3-wiki-complet.md` F-P0-01/F-P0-02/F-P0-03/F-P1-01.
