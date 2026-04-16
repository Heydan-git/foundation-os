---
type: concept
title: "Compounding Knowledge"
complexity: intermediate
domain: dev
aliases:
  - "Knowledge composé"
  - "Compound interest of knowledge"
created: 2026-04-15
updated: 2026-04-16
tags:
  - concept
  - knowledge-management
  - network-effects
  - dev
status: mature
confidence: high
related:
  - "[[index-concepts]]"
  - "[[LLM Wiki Pattern]]"
  - "[[Hot Cache]]"
  - "[[Andrej Karpathy]]"
  - "[[Obsidian]]"
  - "[[Pinecone]]"
  - "[[Foundation OS]]"
sources:
  - "[[karpathy-llm-wiki-pattern]]"
---

# Compounding Knowledge

## Definition

Propriete emergente du [[LLM Wiki Pattern]] : chaque source ajoutee au wiki renforce les pages existantes via cross-references, resolutions de contradictions, et synthese enrichie. Le knowledge se compose comme des interets financiers.

## How It Works

1. **Source A** ingeree → 8 pages wiki crees (concepts, entities, cross-refs)
2. **Source B** ingeree → 10 pages crees, dont 4 qui enrichissent des pages de Source A
3. **Source C** ingeree → 12 pages, dont 6 qui cross-referencent A et B
4. **Resultat** : le wiki devient plus intelligent que la somme de ses sources

Chaque nouvelle source ne cree pas des pages isolees. Elle **tisse des liens** avec le knowledge existant.

## Why It Matters

- **Rendements croissants** : plus le wiki grandit, plus chaque nouvelle source a de valeur (plus de cross-refs possibles)
- **Contradictions detectees** : si Source B contredit Source A, le LLM peut le flagger avec `[!contradiction]` callout
- **Synthese automatique** : le LLM met a jour les pages existantes avec les nouvelles infos
- **Navigation naturelle** : le graph view [[Obsidian]] montre visuellement les clusters de knowledge

## Limites

- **Rendements decroissants au-dela de ~500 pages** : le LLM commence a manquer des cross-refs dans un index trop long
- **Qualite depends de la source** : garbage in, garbage out — meme avec compounding
- **Maintenance necessaire** : wikilinks casses, pages orphelines → `wiki-lint` skill

## Analogie financiere

| Finance | Knowledge |
|---------|-----------|
| Capital initial | Premieres sources ingerees |
| Taux d'interet | Densite de cross-refs par page |
| Interets composes | Knowledge enrichi par chaque ajout |
| Diversification | Multi-domaines (trading, sante, finance, etc.) |
| Rebalancing | wiki-lint + revision periodique |

## Connections

- [[LLM Wiki Pattern]] — pattern parent
- [[Hot Cache]] — accelere l'acces au knowledge recent (cache chaud)
- [[Pinecone]] — extension archivage quand le vault depasse les rendements Markdown

## Sources

- [[karpathy-llm-wiki-pattern]]
