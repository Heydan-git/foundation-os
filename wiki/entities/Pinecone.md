---
type: entity
title: "Pinecone"
entity_type: product
aliases:
  - "Pinecone.io"
  - "Vector DB"
url: "https://pinecone.io"
created: 2026-04-15
updated: 2026-04-16
tags:
  - entity
  - product
  - tool
  - vector-database
  - embeddings
status: seed
confidence: medium
related:
  - "[[index-entities]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Compounding Knowledge]]"
  - "[[Obsidian]]"
  - "[[Andrej Karpathy]]"
sources:
  - "[[karpathy-llm-wiki-pattern]]"
---

# Pinecone

## What

Base de donnees vectorielle managee. Stocke textes sous forme d'embeddings (vecteurs) et fait des recherches par similarite semantique. Plan Starter gratuit.

## Why It Matters

Extension complementaire au [[LLM Wiki Pattern]] quand le vault depasse ~500-1000 pages. [[Obsidian]] gere le contexte actif (reflexion, projets en cours), Pinecone gere l'archivage long terme et la recherche semantique.

## Key Facts

- Vector DB managee (pinecone.io)
- Plan Starter gratuit
- Dimensions : 1536 (OpenAI embeddings) ou 1024 (Cohere)
- Metric : cosine similarity
- Use-case Foundation OS : differe 12+ mois (quand wiki > 500 pages)

## Flux avec Foundation OS (futur)

1. Session Claude Code → lit [[Obsidian]] wiki/ (contexte actif)
2. Besoin context ancien → recherche Pinecone (archivage)
3. Fin session → met a jour wiki/ + archive vieilles pages dans Pinecone
4. Resultat : memoire infinie a cout controle

## Connections

- [[LLM Wiki Pattern]] — pattern parent (Pinecone = extension scaling)
- [[Compounding Knowledge]] — Pinecone preserve le knowledge compose sur longue duree
- [[Obsidian]] — couche active complementaire

## Sources

- [[karpathy-llm-wiki-pattern]]
