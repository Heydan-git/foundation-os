---
type: entity
title: "Radix UI"
entity_type: product
aliases:
  - "Radix"
  - "radix-ui"
url: "https://www.radix-ui.com"
github: "https://github.com/radix-ui/primitives"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - headless-primitives
  - accessibility
  - react
  - foundation-os-dependency
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[shadcn/ui]]"
  - "[[Ark UI]]"
  - "[[Base UI]]"
  - "[[Foundation OS]]"
sources: []
---

# Radix UI

## What

Librarie de primitives React **headless** (sans styling) pour composants UI accessibles. Par WorkOS (anciennement Modulz). Fournit la **logique de comportement** + **accessibility** (ARIA, keyboard navigation) sans opinions visuelles.

## Why It Matters

**Primitive engine de shadcn/ui**, donc **dependance transitive de Foundation OS**. Les 46 primitives ui du DS FOS utilisent Radix (Dialog, Dropdown, Popover, Select, Tabs, etc.) pour le comportement. Comparer a [[Ark UI]] (Shark UI) et [[Base UI]] (Flowkit) qui sont des alternatives concurrentes.

## Key Facts

- Maintainer : WorkOS (Vlad Moroz, Benoit Grelard, etc.)
- Category : headless component primitives
- Accessibility : WAI-ARIA compliant, keyboard-first
- Split packages : `@radix-ui/react-dialog`, `@radix-ui/react-popover`, etc.
- License : MIT
- Alternatives : [[Ark UI]] (multi-framework), [[Base UI]] (par Material-UI team)
- Adoption massive : shadcn/ui, Shadcncraft, Cult UI, Cascader, etc.

## Connections

- [[shadcn/ui]] — construit sur Radix
- [[Ark UI]] — alternative primitive engine (multi-framework)
- [[Base UI]] — alternative primitive engine (MUI team)
- [[Foundation OS]] — dependance transitive via shadcn
- Tout l'ecosysteme [[Shadcn Block Libraries Landscape 2026-04]] (sauf Shark UI et Flowkit UI)

## External Refs

- Site : https://www.radix-ui.com
- GitHub : https://github.com/radix-ui/primitives
