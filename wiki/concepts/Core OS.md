---
type: concept
title: "Core OS"
complexity: advanced
domain: dev
aliases:
  - "Core Foundation OS"
  - "7 modules Core"
created: 2026-04-16
updated: 2026-04-16
tags:
  - concept
  - core-os
  - architecture
status: seed
confidence: high
related:
  - "[[Foundation OS]]"
  - "[[cortex]]"
  - "[[communication]]"
  - "[[monitor]]"
  - "[[tools]]"
  - "[[planner]]"
  - "[[worktrees]]"
  - "[[knowledge]]"
sources: []
---

# Core OS

## Definition

Architecture de 7 modules qui forment le cerveau operationnel de [[Foundation OS]]. Chaque module a une spec dans `docs/core/` et remplit une fonction precise dans le cycle de vie d'une session de travail.

## How It Works

### Les 7 modules

1. **[[cortex|Cortex]]** (Phase 1) — routing tache vers agent, contexte CONTEXT.md lifecycle, orchestration commands
2. **[[communication|Communication]]** (Phase 2) — 5 tiers memoire, nomenclature, journalisation, indexation, lecture, briefing v12
3. **[[monitor|Monitor]]** (Phase 3) — health indicators par severite (critical/warning/info), verdicts SAIN/DEGRADED/BROKEN
4. **[[tools|Tools]]** (Phase 4) — validators, scripts, CI/CD, catalogue 109 outils, routing 35 regles
5. **[[planner|Planner]]** (Phase 5) — orchestrateur /plan-os, EnterPlanMode natif, dual-path plans
6. **[[worktrees|Worktrees]]** (Phase 6) — plomberie native Desktop, /wt new|list|clean, convention wt/<desc>-<yymmdd>
7. **[[knowledge|Knowledge]]** (Phase 7) — wiki layer persistant claude-obsidian, 10 skills, couplage modules <-> wiki

### Flux typique session

Cortex route la commande initiale (/cockpit, /session-start) → Communication charge les 5 tiers memoire + brief v12 → Monitor verifie la sante → Tools execute les scripts → Planner orchestre les plans → Worktrees isole le travail → Knowledge persiste le savoir.

## Why It Matters

Sans Core OS, chaque session Claude serait ad-hoc. Core OS garantit : continuite (memoire 5 tiers), qualite (health-check automatique), conventions (nommage, commits, briefs), et scalabilite (modules Phase 5 s'integrent sans refonte).

## Connections

- [[Foundation OS]] — systeme parent
- [[architecture-core]] — spec technique detaillee des 7 modules
- [[foundation-os-map]] — carte neuronale complete

## Sources

- [[session-2026-04-16-neuroplasticity-audit]]
