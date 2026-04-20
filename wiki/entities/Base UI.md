---
type: entity
title: "Base UI"
entity_type: product
url: "https://base-ui.com"
github: "https://github.com/mui/base-ui"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - headless-primitives
  - accessibility
  - mui-team
status: seed
confidence: medium
related:
  - "[[index-entities]]"
  - "[[Radix UI]]"
  - "[[Ark UI]]"
  - "[[vzkiss-flowkit-ui]]"
  - "[[vzkiss]]"
sources: []
---

# Base UI

## What

Librarie de primitives UI headless React par l'equipe **Material-UI (MUI)**. Extraction des headless primitives de MUI v6, packagees independamment pour usage sans le design system Material. Alternative a [[Radix UI]] et [[Ark UI]].

## Why It Matters

Primitive engine de [[vzkiss-flowkit-ui|Flowkit UI]]. Backing **MUI team** = signal de serieux long-terme (Material-UI = lib UI React la plus mature depuis 2014). Mais adoption actuelle **marginale** vs Radix (2026-04).

Pour Foundation OS, Base UI n'apporte aucun benefit direct. Prefer Radix (standard shadcn + maturity + ecosystem). Signal faible a surveiller : si MUI pousse Base UI comme standalone, adoption pourrait accelerer.

## Key Facts

- Maintainer : MUI team (Olivier Tassinari, Matt Brookes, etc.)
- Heritage : extract MUI Base v6 en standalone
- Category : headless primitives React
- License : MIT
- Adoption 2026-04 : marginale vs Radix
- Potential : backing MUI = serieux long-terme

## Connections

- [[Radix UI]] — alternative concurrente (mainstream shadcn)
- [[Ark UI]] — autre alternative (multi-framework)
- [[vzkiss-flowkit-ui]] — utilise Base UI
- [[vzkiss]] — createur Flowkit

## External Refs

- Site : https://base-ui.com
- GitHub : https://github.com/mui/base-ui
