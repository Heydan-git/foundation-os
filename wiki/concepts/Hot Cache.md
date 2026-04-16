---
type: concept
title: "Hot Cache"
complexity: basic
domain: dev
aliases:
  - "hot.md"
  - "Session cache"
  - "Context cache"
created: 2026-04-15
updated: 2026-04-16
tags:
  - concept
  - memory
  - cache
  - performance
status: mature
confidence: high
related:
  - "[[LLM Wiki Pattern]]"
  - "[[Compounding Knowledge]]"
  - "[[../entities/Andrej Karpathy]]"
sources:
  - "[[../sources/karpathy-llm-wiki-pattern]]"
  - "[[../sources/agricidaniel-claude-obsidian]]"
---

# Hot Cache

## Definition

Fichier `wiki/hot.md` (~500 mots) qui resume la derniere session de travail. Lu en priorite au demarrage de chaque session pour restaurer le contexte recent sans charger tout le wiki.

C'est la feature la plus sous-estimee du [[LLM Wiki Pattern]]. Elle elimine le probleme "chaque session repart de zero".

## How It Works

1. **Fin de session** : Claude ecrit/met a jour `wiki/hot.md` avec un resume structure
2. **Debut session suivante** : hook SessionStart lit `wiki/hot.md` en premier (avant tout)
3. **Post-compactage** : hook PostCompact re-lit `wiki/hot.md` (le contexte injecte par hooks ne survit pas au compactage)
4. **Format standard** : Last Updated / Key Recent Facts / Recent Changes / Active Threads / Next Action

## Format (Foundation OS)

```markdown
---
type: meta
title: "Hot Cache Foundation OS"
updated: YYYY-MM-DDTHH:MM:SS
tags: [meta, hot-cache]
status: evergreen
---

# Hot Cache

## Last Updated
YYYY-MM-DD : [ce qui s'est passe]

## Key Recent Facts
- [fait stable 1]
- [fait stable 2]

## Recent Changes
- [change 1]

## Active Threads
- [thread en cours]

## Next Action
[prochaine action probable]
```

## Why It Matters

- **500 mots = ~500 tokens** : cout negligeable, gain enorme en coherence
- **Survit aux compactages** : hook PostCompact re-injecte le cache
- **Multi-projet** : chaque projet a son propre `wiki/hot.md`
- **Humain-lisible** : Kevin peut lire hot.md directement dans [[../entities/Obsidian]]

## Connections

- [[LLM Wiki Pattern]] — pattern parent dont Hot Cache est un composant cle
- [[Compounding Knowledge]] — hot.md accumule le contexte recent, les sessions longues composent

## Sources

- [[../sources/karpathy-llm-wiki-pattern]]
- [[../sources/agricidaniel-claude-obsidian]]
