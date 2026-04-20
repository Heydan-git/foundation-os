---
type: entity
title: "Ark UI"
entity_type: product
url: "https://ark-ui.com"
github: "https://github.com/chakra-ui/ark"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - headless-primitives
  - multi-framework
  - accessibility
status: seed
confidence: medium
related:
  - "[[index-entities]]"
  - "[[Radix UI]]"
  - "[[vinihvc-shark-ui]]"
  - "[[Vinicius Vicentini]]"
sources: []
---

# Ark UI

## What

Librarie de primitives UI headless **multi-framework** (React, Vue, Solid, Svelte) par l'equipe Chakra UI. Alternative a [[Radix UI]] positionnee pour des codebases non-React ou multi-framework.

## Why It Matters

Primitive engine de [[vinihvc-shark-ui|Shark UI]] (110+ composants). Represente le **tradeoff** cle pour les libs shadcn-like multi-framework : accepter Ark UI (plus jeune, moins de community) contre **portabilite multi-framework** (Vue/Svelte/Solid).

Pour Foundation OS (React only), Ark UI n'apporte aucun benefit direct. [[Radix UI]] reste le choix optimal (shadcn standard + community massive).

## Key Facts

- Maintainer : Chakra UI team (Segun Adebayo et al.)
- Category : headless primitives multi-framework
- Frameworks supportes : React, Vue, Solid, Svelte
- License : MIT
- Adoption : plus jeune que Radix, moins de community support
- Tradeoff : multi-framework vs maturity

## Connections

- [[Radix UI]] — alternative concurrente (React only, mainstream)
- [[Base UI]] — autre alternative (par MUI team)
- [[vinihvc-shark-ui]] — utilise Ark UI comme primitive engine
- [[Vinicius Vicentini]] — createur Shark UI

## External Refs

- Site : https://ark-ui.com
- GitHub : https://github.com/chakra-ui/ark
