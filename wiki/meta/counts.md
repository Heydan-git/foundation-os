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

> **Source unique** des compteurs wiki Foundation OS. Auto-regenere par
> `scripts/wiki-counts-sync.sh`.

## Mise a jour : 2026-04-17

### Pages

| Metrique | Valeur | Commande verification |
|----------|--------|-----------------------|
| Pages physiques | 45 | `find wiki -name "*.md" \| wc -l` |
| Pages fonctionnelles (hors templates) | 42 | 45 - 3 templates |
| Concepts racine | 9 | `find wiki/concepts -maxdepth 1 -name "*.md"` |
| Entities | 5 | `find wiki/entities -maxdepth 1 -name "*.md"` |
| Sources | 4 | `find wiki/sources -maxdepth 1 -name "*.md"` |
| Meta (hors templates) | 14 | `find wiki/meta -maxdepth 1 -name "*.md"` |
| Templates | 3 | `find wiki/meta/templates -name "*.md"` |
| Domain indexes | 5 | `find wiki/domains -maxdepth 2 -name "index-*.md"` |
| Domain content (hors index) | 2 | 7 total - 5 indexes |

### Wikilinks

| Metrique | Valeur | Commande |
|----------|--------|----------|
| Wikilinks totaux | 706 | `grep -rho "\[\[[^]]*\]\]" wiki/ \| wc -l` |

## Consumers (pages qui pointent ici, source unique)

- `wiki/hot.md` (section Key Recent Facts)
- `wiki/overview.md` (section Stats)
- `wiki/index-wiki.md` (header + section Statistiques)
- `wiki/log.md` (resultats cumules)
- `wiki/meta/foundation-os-map.md` (section Statistiques)

Toute page qui affiche des counts wiki DOIT pointer vers `counts.md` via wikilink, pas dupliquer les chiffres.

## Comment regenerer

```bash
bash scripts/wiki-counts-sync.sh        # regenere counts.md
bash scripts/wiki-counts-sync.sh --check # verifie sync sans ecrire
```
