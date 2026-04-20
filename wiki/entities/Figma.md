---
type: entity
title: "Figma"
entity_type: product
aliases:
  - "Figma community"
url: "https://www.figma.com"
created: 2026-04-19
updated: 2026-04-19
tags:
  - entity
  - product
  - design-tool
  - collaboration
  - design-systems
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[Figma Make]]"
  - "[[MCP]]"
  - "[[hamish-oneill-shadcncraft]]"
  - "[[Void Glass]]"
sources: []
---

# Figma

## What

Tool de design collaboratif cloud. Standard industry pour design systems, prototyping, design-to-code workflows. Acquis par Adobe (deal annule en 2023), independant a nouveau.

## Why It Matters

**Source historique de Foundation OS DS** : le base DS actuel (46 ui + tokens [[Void Glass]]) derive du pattern **Figma Make** (voir `modules/design-system/src/components/ui/` commentaires "iso DashboardDesignSystem.tsx lignes X-Y"). [[hamish-oneill-shadcncraft|Shadcncraft]] utilise un **Figma plugin + [[MCP]]** pour bridge design-to-code — pattern potentiellement pertinent si Kevin veut relancer workflow Figma.

**Figma community** = distribution gratuite de librairies partielles (Shadcncraft offre son free tier via Figma community).

## Key Facts

- Founder : Dylan Field, Evan Wallace
- Modele : Cloud-native design + prototyping + handoff
- Plugins : ecosysteme massif (incl. Shadcncraft plugin)
- [[Figma Make]] : feature AI design generation
- Figma community : marketplace gratuit de librairies
- MCP support : bridge design-to-code (Shadcncraft, v0, etc.)

## Connections

- [[Figma Make]] — feature AI design
- [[MCP]] — integration design-to-code
- [[hamish-oneill-shadcncraft]] — Figma plugin gratuit
- [[Void Glass]] — DS FOS initial derive d'un workflow Figma Make

## External Refs

- Site : https://www.figma.com
- Community : https://www.figma.com/community
