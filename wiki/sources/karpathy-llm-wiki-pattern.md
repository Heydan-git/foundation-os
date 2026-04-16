---
type: source
title: "Karpathy LLM Wiki Pattern"
source_type: article
author: "Andrej Karpathy"
date_published: 2026-04
url: "https://mindstudio.io/posts/karpathy-llm-wiki"
confidence: high
key_claims:
  - "LLMs raisonnent tres bien sur du Markdown long et structure"
  - "Pas besoin de RAG/embeddings pour < 1000 pages"
  - "Hot cache (~500 mots) elimine le probleme 'chaque session repart de zero'"
  - "Knowledge compounds like interest via cross-references"
  - "Pinecone comme extension archivage long terme"
created: 2026-04-15
updated: 2026-04-16
tags:
  - source
  - article
  - llm
  - memory
  - karpathy
status: mature
related:
  - "[[index-sources]]"
  - "[[agricidaniel-claude-obsidian]]"
  - "[[Andrej Karpathy]]"
  - "[[Obsidian]]"
  - "[[Pinecone]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Hot Cache]]"
  - "[[Compounding Knowledge]]"
sources: []
---

# Karpathy LLM Wiki Pattern

## Summary

Article d'[[Andrej Karpathy]] (avril 2026) qui propose le [[LLM Wiki Pattern]] : pre-compiler sources brutes en wiki Markdown structure puis operer le LLM sur ce wiki. Idee simple mais puissante qui evite la complexite RAG/embeddings pour des volumes < 1000 pages.

## Key Claims

- LLMs raisonnent tres bien sur du texte Markdown long et structure
- Pas besoin d'embeddings ou de RAG complexe pour < 1000 pages
- [[Hot Cache]] (~500 mots) elimine "chaque session repart de zero"
- [[Compounding Knowledge]] : le wiki se renforce avec chaque source ajoutee
- [[Pinecone]] comme extension archivage quand vault depasse les limites Markdown

## Entities Mentioned

- [[Andrej Karpathy]] — auteur, AI researcher
- [[Obsidian]] — editeur recommande pour le vault
- [[Pinecone]] — vector DB pour archivage long terme

## Concepts Introduced

- [[LLM Wiki Pattern]] — pattern central de l'article
- [[Hot Cache]] — cache 500 mots session-to-session
- [[Compounding Knowledge]] — propriete emergente du wiki structure

## Raw Source

`.raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md`

## Notes

Source fondatrice de toute l'architecture knowledge Foundation OS (D-WIKI-01). Validee par implementation reelle via [[agricidaniel-claude-obsidian|claude-obsidian]] (1279 stars).
