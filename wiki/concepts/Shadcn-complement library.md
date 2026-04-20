---
type: concept
title: "Shadcn-complement library"
complexity: intermediate
domain: dev
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - ui-library
  - design-system
  - ecosystem
  - shadcn
status: seed
related:
  - "[[index-concepts]]"
  - "[[shadcn/ui]]"
  - "[[vzkiss-flowkit-ui]]"
  - "[[Cascader pattern]]"
  - "[[Creatable Combobox]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
sources:
  - "[[vzkiss-flowkit-ui]]"
  - "[[ademking-cascader-shadcn]]"
---

# Shadcn-complement library

## Definition

**Categorie de libs** se positionnant explicitement comme **"components shadcn doesn't cover"**. Comble les gaps du catalog officiel [[shadcn/ui]] via des composants tiers maintenus par la communaute.

Pattern recurrent 2025-2026 :
- Identifier un pattern frequemment demandee mais **absent de shadcn officiel** (cascader, creatable combobox, tree, advanced data-table, etc.)
- Publier un ou N composants shadcn-compatible (meme conventions, meme stack React + Radix + Tailwind)
- Distribuer via GitHub MIT + demo Surge/Netlify/Vercel

## Why It Matters

**Signal ecosysteme** : shadcn/ui est assez mature pour avoir un **ecosystem satellite** — plusieurs libs independantes comblent les memes gaps. Pas de monopole.

Pour **Foundation OS**, ces libs sont :
- **Inspiration** pour completer le DS (tree, cascader, creatable combobox non-dispo FOS)
- **Pas adoption directe** comme dep (bus factor eleve, early-stage majoritairement)
- **Pattern code source** MIT → copier + re-theme `--ds-*` [[Void Glass]]

## Exemples identifies (batch 2026-04-19)

| Lib | Gap comble | Maturite |
|-----|-----------|----------|
| [[vzkiss-flowkit-ui\|Flowkit UI]] | [[Creatable Combobox]] | Early-stage (10 stars) |
| [[ademking-cascader-shadcn\|Cascader ShadCN]] | [[Cascader pattern]] | Stable (76 stars) |

## Concurrents de meme categorie (non audites dans ce batch)

- **originui.com** — mentionne mais pas audit
- Autres projets "shadcn extensions" sur GitHub (search `shadcn-extensions`, `shadcn-components`, `shadcn-plus`)

## Decision framework FOS

Avant d'adopter une shadcn-complement library :

1. **Besoin concret FOS ?** (pas prophylactique)
2. **Seuil maturity** : min 100 stars + activite 12m + pas solo maintainer
3. **Primitive match** : Radix prefere (aligne shadcn standard). Base UI, Ark UI = penalty.
4. **MIT license** : confirme + pas de paywall futur previsible
5. **Reecriture preferee a adoption** : copier code source MIT + porter sous `--ds-*` evite dep fragile

## Lessons learned

**Pattern "solo maintainer + 1 composant + 10-100 stars"** = bus factor tres eleve. Eviter adoption comme dep. Prefer code source copy + attribution.

**Pattern "bibliotheque complete multi-framework"** (type [[vinihvc-shark-ui|Shark UI]]) = scope plus large mais primitive mismatch probable (Ark UI != Radix) = porting lourd.

## Connections

- [[shadcn/ui]] — ecosysteme parent
- [[vzkiss-flowkit-ui]] / [[ademking-cascader-shadcn]] — exemples de la categorie
- [[Cascader pattern]] / [[Creatable Combobox]] — gaps combles
- [[Shadcn Block Libraries Landscape 2026-04]] — batch analyse complet

## Sources

- [[vzkiss-flowkit-ui]] — Flowkit UI positioning explicite
- [[ademking-cascader-shadcn]] — cascader community solution
