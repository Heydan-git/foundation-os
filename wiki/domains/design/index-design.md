---
type: domain-index
title: "design"
updated: 2026-04-15
tags:
  - domain-index
  - design
status: evergreen
related:
  - "[[index-wiki]]"
---

# Domaine : design

Knowledge layer transversal pour `modules/app/` + `modules/design-system/` : UX research, patterns, heuristiques, accessibility.

## Sous-dossiers

- `concepts/` — heuristiques UX (Nielsen, etc.), Fitts law, Hick law, lois d'affordance, accessibility WCAG, design tokens
- `sources/` — articles UX (NN/g, Smashing Magazine), livres design, recherche Figma/Material/Apple HIG, transcripts conferences

## Couplage code

Modules consultent wiki :
- `modules/app/` utilise `wiki/domains/design/concepts/heuristiques.md` pour decisions UI
- `modules/design-system/` reference `wiki/domains/design/concepts/design-tokens.md` pour semantique DTCG

## Pages recentes

Aucune pour l'instant.

## Cross-references cles

- [[Void Glass|Void Glass]] (si existe) — design system dark-only
- [[dev/_index|Dev]] (crossover composants UI)

## Workflows specifiques

- Article UX web → `.raw/articles/` → `wiki-ingest` → concept + source
- Decision visuelle → `/save decision design [nom]`
- Review Figma Make → `/canvas` pour flow visual
