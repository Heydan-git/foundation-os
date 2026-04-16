---
type: concept
title: "Foundation OS — Migration Claude Code Desktop natif"
domain: dev
complexity: advanced
aliases:
  - "Desktop migration"
  - "D-DESKTOP-01"
  - "Migration Desktop 2026-04-15"
created: 2026-04-15
updated: 2026-04-16
tags:
  - concept
  - foundation-os
  - desktop
  - migration
  - architecture
status: mature
confidence: high
related:
  - "[[LLM Wiki Pattern]]"
  - "[[tools-foundation-os]]"
sources: []
migrated_from: "auto-memory/project_migration_desktop.md (2026-04-16, D-WIKI-01 Phase 5)"
---

# Foundation OS — Migration Claude Code Desktop natif

> Knowledge architecture atemporel : comment Foundation OS a migre du CLI terminal vers le Desktop app natif.
> Source originale : auto-memory `project_migration_desktop.md` (DONE 2026-04-15). Migre vers wiki D-WIKI-01 Phase 5.

Migration Foundation OS (poste de travail IA-driven Kevin) du CLI terminal Claude Code vers le **nouveau Claude Code Desktop app** (redesign sorti ~2026-04-14 : tasks pane, plan window UI natif, worktrees natifs ameliores, sidebar multi-sessions). Note 2026-04-15 : feature auto-rename sessions depuis plan presumee existante mais verifiee inexistante. Remplacee par bloc SESSION RENAME affiche par `/plan-os` + rename manuel Kevin.

**Why:** Foundation OS etait calibre pour le CLI terminal. Plomberie worktrees OK mais zero integration active. Plans generes par 6 workflows concurrents. Branches nommees aleatoirement. Dette accumulee (settings.local.json bloated, refs stale, orphelin worktree).

## 9 phases sessions courtes

1. Fixes + clean debris + branches orphelines cleanup (Phase 1 : settings.local.json purge, archive orphelin rm, branches)
2. Conventions nommage (branches + worktrees + sessions)
3. Worktrees actifs (scripts + /wt command + integration cockpit)
4. /plan-os orchestrateur (combine skills, fin EnterPlanMode)
5. TodoWrite systematique + tasks pane
6. Docs CLI-centric -> Desktop (setup-guide, architecture, index)
7. Refs stales + Cockpit registered + baselines actualises
8. Brief v11 source unique (docs/core/communication.md)
9. CONTEXT.md + commit final

## Hors scope

Memory tool API / Memory Keeper MCP (abandonne), modules/ code applicatif (zero impact), _bmad/ (dormant), Phase 5 Expansion (en attente).

## Decisions documentees

- D-DESKTOP-01 Foundation OS calibre Claude Code Desktop app
- D-NAMING-01 Conventions branches/worktrees/sessions unifiees
- D-PLAN-02 /plan-os orchestrateur EnterPlanMode (supersede D-PLAN-01)

## Verification end-to-end

health-check SAIN, sync-check passe, /cockpit detecte worktree, /plan-os ouvre plan window Desktop + affiche bloc SESSION RENAME format 🪐 pour rename manuel.

## Etat

DONE 2026-04-15. Les 9 phases livrees + validation Kevin level-up OS (audit + plan level-up 7 phases execute). Plan archive : `.archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md`.
