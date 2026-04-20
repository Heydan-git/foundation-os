---
type: entity
title: "Tailwind CSS"
entity_type: product
aliases:
  - "Tailwind"
url: "https://tailwindcss.com"
github: "https://github.com/tailwindlabs/tailwindcss"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - css-framework
  - utility-first
  - foundation-os-dependency
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[shadcn/ui]]"
  - "[[Void Glass]]"
  - "[[Foundation OS]]"
sources: []
---

# Tailwind CSS

## What

Framework CSS utility-first par Tailwind Labs. Generation de classes utilitaires atomiques pour styling inline dans les composants. Standard de facto pour design systems React modernes.

## Why It Matters

**Dependency cle de Foundation OS** (modules/app + modules/design-system utilisent Tailwind 4). Base de tokens CSS pour le theme [[Void Glass]]. Tous les composants shadcn/ui et derives (Shark, Cult, Shadcncraft, Stow, etc.) utilisent Tailwind — portabilite garantie dans l'ecosysteme.

## Key Facts

- Version actuelle FOS : Tailwind 4
- Maintainer : Tailwind Labs (Adam Wathan, Steve Schoger)
- Modele : utility-first (classes atomiques)
- Dark mode natif via `dark:` prefix (Foundation OS = dark-only, pas de switching)
- Tokens via CSS variables (`--color-*`, `--spacing-*`, etc.)
- License : MIT
- Tooling : PostCSS plugin + Vite plugin natif (Tailwind 4)

## Connections

- [[shadcn/ui]] — utilise Tailwind comme styling
- [[Void Glass]] — theme FOS construit sur Tailwind + tokens `--ds-*`
- [[Foundation OS]] — dependance directe
- Tout l'ecosysteme [[Shadcn Block Libraries Landscape 2026-04]]

## External Refs

- Site : https://tailwindcss.com
- GitHub : https://github.com/tailwindlabs/tailwindcss
