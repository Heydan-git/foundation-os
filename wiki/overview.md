---
type: meta
title: "Wiki Overview"
updated: 2026-04-15
tags:
  - meta
  - overview
status: evergreen
related:
  - "[[index-wiki]]"
  - "[[log]]"
  - "[[hot]]"
---

# Foundation OS Wiki — Overview

Le wiki Foundation OS est la couche **knowledge** de l'OS de travail IA-driven de Kevin.

## Mission

Accumuler, structurer, rendre navigable le knowledge cross-modules pour :

1. **App Builder** (actif) — patterns React/TS, design system tokens, heuristiques UX
2. **Trading** (Phase 5) — strategies backtestees, papers academic, regulations, market microstructure, backtest engine, trading auto
3. **Finance** (Phase 5) — patrimoine, fiscalite, decisions d'investissement, regulations
4. **Sante** (Phase 5) — bilans biologiques synthetises, protocoles, papers medicaux, conseil sante multi-agents
5. **Dev** (transversal) — frameworks, patterns code, architecture

## Pattern : [[LLM Wiki Pattern|Karpathy LLM Wiki]]

Pre-compiler sources brutes en wiki Markdown structure ([[Obsidian]]) puis operer Claude sur ce wiki (pas du RAG embeddings).

Workflow de lecture Claude : `hot.md` (500 mots) + `index.md` (1 ligne/page) + pages pertinentes only → contexte minimal meme avec 1000+ pages.

## 5 tiers memoire Foundation OS

| Tier | Support | Role |
|------|---------|------|
| 1 | Conversation Claude | Volatile 1 session |
| 2 | CONTEXT.md | Etat operationnel projet |
| 3 | auto-memory (~/.claude/projects/...) | Profile Kevin + feedback comportement |
| 4 | docs/ | Specs techniques OS |
| 5 | **wiki/ (ici)** | **Knowledge externe atemporel** |

Voir `docs/core/communication.md` section 1 + section 1.5 (test arbitral) — Phase 3 du plan adoption.

## Couplage modules <-> wiki

Exemple :

```yaml
# wiki/domains/trading/strategies/momentum.md
---
type: strategy
implementation: ../../../../modules/trading/strategies/momentum.ts
backtest_runs: ../../../../modules/trading/backtests/
sharpe_ratio: 1.2
max_drawdown: 0.15
---
```

Regle d'or : code executable dans `modules/`, doc+hypotheses+refs dans `wiki/domains/`.

## Workflows

- `/wiki` — scaffold/check vault (deja fait Phase 2)
- `/save [name]` — sauver conversation courante en wiki page
- `/autoresearch [topic]` — web research 3-5 rounds + synthese
- `/canvas [desc]` — Obsidian canvas visual

## Stats (init Phase 2)

- Pages : 4 (hot, index, log, overview)
- Sources : 0
- Domaines : 5 (pre-scaffolde vides)
- Templates : 5
- .raw/ : 6 dossiers

## Navigation

- [[foundation-os-map]] — Carte neuronale complete du projet
