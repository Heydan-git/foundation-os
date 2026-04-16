---
type: entity
title: "Obsidian"
entity_type: product
aliases:
  - "Obsidian.md"
  - "Obsidian app"
url: "https://obsidian.md"
created: 2026-04-15
updated: 2026-04-16
tags:
  - entity
  - product
  - tool
  - markdown-editor
  - knowledge-management
status: mature
confidence: high
related:
  - "[[index-entities]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Andrej Karpathy]]"
  - "[[AgriciDaniel]]"
  - "[[Pinecone]]"
  - "[[tools-foundation-os]]"
  - "[[Compounding Knowledge]]"
  - "[[Hot Cache]]"
sources:
  - "[[karpathy-llm-wiki-pattern]]"
  - "[[agricidaniel-claude-obsidian]]"
---

# Obsidian

## What

Editeur Markdown local, gratuit, sans vendor lock-in. Le vault est un dossier de fichiers texte sur le filesystem. Support natif wikilinks, graph view, canvas, plugins community.

## Why It Matters

Choix naturel pour le [[LLM Wiki Pattern]] : Claude Code ecrit des fichiers Markdown, Obsidian les rend navigables visuellement (graph view, canvas, search). Foundation OS utilise Obsidian pour visualiser le wiki/ knowledge layer.

## Key Facts

- Editeur Markdown local gratuit (obsidian.md)
- Vault = dossier de fichiers .md (zero lock-in)
- Wikilinks natifs → graph view connectee
- Plugins : calendar, banners, excalidraw, thino, bases (Dataview replacement)
- Canvas : fichiers .canvas pour visualisation spatiale
- Multi-plateforme (macOS, Windows, Linux, mobile)
- Foundation OS : installe `/Applications/Obsidian.app`, vault = `wiki/`

## Graph View

Obsidian graph view affiche les pages wiki comme noeuds et les wikilinks comme aretes. Les clusters de pages fortement connectees forment des groupes visuels. Utile pour :
- Voir les domaines de knowledge (trading, sante, finance)
- Detecter les pages orphelines (sans connexions)
- Explorer les cross-refs entre concepts

## Connections

- [[LLM Wiki Pattern]] — pattern utilise dans le vault
- [[AgriciDaniel]] — createur plugin claude-obsidian pour Obsidian
- [[Pinecone]] — extension archivage complementaire quand vault > 1000 pages
- [[tools-foundation-os]] — integre dans toolchain

## Sources

- [[karpathy-llm-wiki-pattern]]
- [[agricidaniel-claude-obsidian]]
