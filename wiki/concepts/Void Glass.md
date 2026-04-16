---
type: concept
title: "Void Glass"
complexity: intermediate
domain: design
aliases:
  - "Dark theme Foundation OS"
  - "ds-surface-0"
  - "#030303"
created: 2026-04-16
updated: 2026-04-16
tags:
  - concept
  - design-system
  - dark-theme
  - void-glass
status: mature
confidence: high
related:
  - "[[design-system-components]]"
  - "[[index-design]]"
  - "[[tools-foundation-os]]"
sources: []
---

# Void Glass

## Definition

Theme dark-only du Design System Foundation OS. Surface principale `#030303` (token `ds-surface-0`). Esthetique verre sombre avec effets glow subtils. Interdit : `#0A0A0B`, `#08080A`, Outfit, Inter, system-ui seul (OK fallback CSS).

## How It Works

- Surface de base : `#030303` (ds-surface-0) — noir profond, pas pur noir
- Tokens DTCG prefixe `ds-*` (zero legacy `fos-*`)
- Fonts : Figtree (UI) + JetBrains Mono (code)
- 46 composants UI iso base DS (voir [[design-system-components]])
- Effets glow via box-shadow tokens sur cards, sidebar, hover states

## Why It Matters

Identite visuelle unique de Foundation OS. Chaque composant, page, et dashboard suit le theme Void Glass. La coherence dark-only simplifie le DS (pas de mode switching) et donne un rendu premium.

## Regles (CLAUDE.md)

- Dark-only `#030303` (ds-surface-0)
- Figtree UI, JetBrains Mono code
- Tokens DTCG `ds-*` uniquement
- Interdit : `#0A0A0B`, `#08080A`, Outfit, Inter, system-ui seul
- TSX < 700 lignes (decouper si plus)

## Connections

- [[design-system-components]] — 46 composants + 6 foundations Void Glass
- [[index-design]] — domaine design wiki
- [[tools-foundation-os]] — Supernova SDK sync tokens

## Sources

Spec originale dans CLAUDE.md section "Stack & Regles code".
