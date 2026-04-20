---
type: entity
title: "Figma Make"
entity_type: product
url: "https://www.figma.com/make"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - ai-design
  - figma-feature
  - design-to-code
status: seed
confidence: medium
related:
  - "[[index-entities]]"
  - "[[Figma]]"
  - "[[MCP]]"
  - "[[Void Glass]]"
sources: []
---

# Figma Make

## What

Feature AI de [[Figma]] permettant de generer designs + code React depuis prompts naturels ou reference images. Positionnee comme concurrent de v0 et Cursor pour le **design-to-code workflow**.

## Why It Matters

**Source historique du base DS Foundation OS**. Le module `modules/design-system/src/components/` derive d'un template genere via Figma Make ("base DS" ref 2026-04-14), avec 41 composants `ui/` ayant des commentaires header "iso DashboardDesignSystem.tsx lignes X-Y" pointant vers le template showcase.

Mentionne par [[hamish-oneill-shadcncraft|Shadcncraft]] comme AI builder integre (avec v0 + Cursor).

## Key Facts

- Owner : [[Figma]]
- Category : AI design-to-code
- Concurrents : v0 (Vercel), Cursor, Claude Code + [[MCP]]
- Usage FOS : genere le template `base DS` initial (2026-04) puis refork/rebuild manuel
- Pattern : design-first → export React

## Connections

- [[Figma]] — produit parent
- [[MCP]] — integration design-to-code generique
- [[Void Glass]] — DS FOS initial derive de Figma Make template
- D-DS-REBUILD (2026-04-11) — decision FOS de rebuild DS from scratch from Figma Make template

## External Refs

- Site : https://www.figma.com/make
