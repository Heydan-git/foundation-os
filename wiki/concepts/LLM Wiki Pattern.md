---
type: concept
title: "LLM Wiki Pattern"
complexity: intermediate
domain: dev
aliases:
  - "Karpathy Wiki Pattern"
  - "Wiki-based memory"
  - "Pre-compiled knowledge base"
created: 2026-04-15
updated: 2026-04-16
tags:
  - concept
  - llm
  - memory
  - knowledge-management
  - pattern
status: mature
confidence: high
related:
  - "[[Hot Cache]]"
  - "[[Compounding Knowledge]]"
  - "[[../entities/Andrej Karpathy]]"
  - "[[../entities/AgriciDaniel]]"
  - "[[../entities/Obsidian]]"
  - "[[../entities/Pinecone]]"
  - "[[../domains/dev/concepts/foundation-os-desktop-migration]]"
sources:
  - "[[../sources/karpathy-llm-wiki-pattern]]"
  - "[[../sources/agricidaniel-claude-obsidian]]"
---

# LLM Wiki Pattern

## Definition

Pattern d'architecture memoire pour LLMs propose par [[../entities/Andrej Karpathy]] (avril 2026) : au lieu de donner des documents bruts a un LLM, lui faire pre-compiler les sources dans un wiki Markdown structure, puis operer le LLM sur ce wiki.

Le wiki est l'artefact persistant. Les cross-references sont deja la. Les contradictions sont flaggees. La synthese reflete deja tout ce qui a ete lu. Le knowledge se compose comme des interets.

## How It Works

1. **Source ingestion** : drop PDF/URL/transcript dans `.raw/`
2. **Pre-compilation** : LLM extrait concepts, entities, cross-refs → pages wiki structurees
3. **Hot cache** : `wiki/hot.md` (~500 mots) resume la derniere session, lu en priorite
4. **Index** : `wiki/index.md` (1 ligne par page) pour navigation rapide
5. **On-demand loading** : seules les pages pertinentes a la question sont chargees
6. **Session update** : fin de session, hot.md + index + log mis a jour

## Why It Matters

- **Pas besoin de RAG/embeddings** pour < 1000 pages (Markdown structure suffit)
- **Token cost stable** : hot.md (~500 tokens) + index (scan) + pages pertinentes only
- **Knowledge compounds** : chaque source ajoutee renforce le reseau existant via cross-refs
- **Persistent across sessions** : survit aux compactages, changements de session, multi-projets
- **Human-readable** : le wiki est navigable dans [[../entities/Obsidian]] (graph view, search, canvas)

## Difference avec RAG

| Aspect | LLM Wiki Pattern | RAG (embeddings) |
|--------|-----------------|-------------------|
| Structure | Markdown structure, wikilinks | Vecteurs numeriques |
| Lisibilite | Humain + LLM | LLM seulement |
| Cross-refs | Explicites (wikilinks) | Implicites (similarite) |
| Contradictions | Flaggees par LLM | Non detectees |
| Cout scaling | Lineaire (pages) | Sublineaire mais opaque |
| Seuil | < 1000 pages | > 1000 pages |

## Implementation Foundation OS

Adoption 2026-04-15 (D-WIKI-01) via plugin [[../entities/AgriciDaniel|claude-obsidian]].

5 tiers memoire : conversation / CONTEXT.md / auto-memory / docs/ / **wiki/** (ce tier).
Spec : `docs/core/knowledge.md`.

## Examples

- Foundation OS wiki/ avec 5 domaines pre-scaffoldes (trading, finance, sante, design, dev)
- [[../entities/AgriciDaniel|claude-obsidian]] vault avec concepts/, entities/, sources/, comparisons/, questions/
- Second brain personnel navigable dans [[../entities/Obsidian]] graph view

## Connections

- [[Hot Cache]] — composant cle du pattern (cache 500 mots derniere session)
- [[Compounding Knowledge]] — propriete emergente du pattern (knowledge compose)
- [[../entities/Pinecone]] — extension pour archivage > 1000 pages (vector DB)

## Sources

- [[../sources/karpathy-llm-wiki-pattern]] — article original Karpathy
- [[../sources/agricidaniel-claude-obsidian]] — implementation reference
