---
type: index
title: "Core OS — Index des 7 modules"
updated: 2026-04-16
tags:
  - index
  - core-os
status: evergreen
confidence: high
related:
  - "[[foundation-os-map]]"
  - "[[index-wiki]]"
  - "[[Core OS]]"
---

# Core OS — 7 Modules

> Hub de navigation pour les specs des 7 modules operationnels Foundation OS.
> Chaque module a sa spec dans `docs/core/`. Carte complete : [[foundation-os-map]].

Navigation : [[foundation-os-map]] | [[index-wiki]] | [[Core OS]]

---

## Modules (7)

| Module | Spec | Phase | Role |
|--------|------|-------|------|
| Cortex | [[cortex]] | Phase 1 | Routing tache → agent, orchestration commands |
| Communication | [[communication]] | Phase 2 | 5 tiers memoire, brief v12, journalisation |
| Monitor | [[monitor]] | Phase 3 | Health indicators, verdicts SAIN/DEGRADED/BROKEN |
| Tools | [[tools]] | Phase 4 | Catalogue outils, routing, scripts, CI/CD |
| Planner | [[planner]] | Phase 5 | Orchestrateur /plan-os, EnterPlanMode natif |
| Worktrees | [[worktrees]] | Phase 6 | Isolation travail, /wt new/list/clean |
| Knowledge | [[knowledge]] | Phase 7 | Wiki layer, claude-obsidian, neuroplasticite |

## Transversal

| Fichier | Role |
|---------|------|
| [[architecture-core]] | Architecture globale 7 modules (couches, phases, interactions) |
| [[naming-conventions]] | Conventions nommage (branches, worktrees, sessions, plans) |

## Concept wiki associe

- [[Core OS]] — page concept wiki decrivant l'architecture 7 modules
