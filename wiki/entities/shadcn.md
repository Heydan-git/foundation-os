---
type: entity
title: "shadcn/ui"
entity_type: product
aliases:
  - "shadcn"
  - "shadcn-ui"
url: "https://ui.shadcn.com"
github: "https://github.com/shadcn-ui/ui"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - design-system
  - framework
  - react
  - radix
  - tailwind
  - foundation-os-dependency
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[Radix UI]]"
  - "[[Tailwind CSS]]"
  - "[[Void Glass]]"
  - "[[Foundation OS]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
  - "[[Shadcn-complement library]]"
sources: []
---

# shadcn/ui

## What

Collection de composants React reutilisables construits sur [[Radix UI]] + [[Tailwind CSS]]. Modele distinctif : **"not a component library"** — pas d'installation npm, mais un registry + CLI pour **copy-paste** du code directement dans son projet. L'user possede le code, le modifie librement.

## Why It Matters

**Source direct de Foundation OS DS**. Les 46 primitives ui du module `modules/design-system/src/components/ui/` sont derivees de shadcn/ui (base + re-theming [[Void Glass]]). **Pattern copy-paste + registry** inspire toute l'organisation du DS Foundation OS. Standard de facto 2024-2026 pour DS React.

## Key Facts

- Createur : shadcn (pseudonyme, vrai nom probable : Ben Eckrich)
- Base : React + TypeScript + [[Radix UI]] + [[Tailwind CSS]]
- Modele : registry + CLI copy-paste (pas un package npm)
- Tokens CSS variables standards : `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`
- License : MIT
- Ecosysteme : 100+ projets satellite (Shark UI, Shadcncraft, Cult UI, Stow, Cascader, Flowkit, etc.)
- Endorse Shadcncraft comme extension officielle

## Connections

- [[Radix UI]] — headless primitives base
- [[Tailwind CSS]] — styling framework
- [[Foundation OS]] — adopte via copy-paste re-theme Void Glass
- [[Void Glass]] — override dark-only tokens `--ds-*` Foundation OS
- [[Shadcn-complement library]] — pattern de libs comblant les gaps shadcn
- [[Shadcn Block Libraries Landscape 2026-04]] — ecosysteme de produits derives

## External Refs

- Site : https://ui.shadcn.com
- GitHub : https://github.com/shadcn-ui/ui
