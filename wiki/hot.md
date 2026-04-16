---
type: meta
title: "Hot Cache Foundation OS"
updated: 2026-04-15T00:00:00
tags:
  - meta
  - hot-cache
status: evergreen
related:
  - "[[index]]"
  - "[[log]]"
  - "[[overview]]"
---

# Hot Cache

Navigation: [[index]] | [[log]] | [[overview]]

## Last Updated

2026-04-15 : Vault initialise. Foundation OS adoption claude-obsidian Phase 2 scaffold.

## Plugin State

- **Plugin**: claude-obsidian v1.4.3 installe (Phase 1 OK)
- **Obsidian app**: /Applications/Obsidian.app (installee, verifiee)
- **Skills**: 10 disponibles (wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown)
- **Commands**: 4 (/wiki, /save, /autoresearch, /canvas)
- **Agents**: 2 (wiki-ingest, wiki-lint — compatibles Task tool)
- **Templates**: 5 (concept, source, entity, comparison, question)
- **Domaines pre-scaffoldes**: trading, finance, sante, design, dev

## Key Recent Facts

- Foundation OS = OS de travail IA-driven (code app/design-system) + second-brain knowledge (wiki/)
- 5 tiers memoire : conversation / CONTEXT.md / auto-memory / docs/ / wiki/
- Regle d'or : une info = un seul tier (zero duplication)
- Couplage modules/ <-> wiki/domains/ via frontmatter `implementation:`
- Phase 5 modules futurs (Finance, Trading auto, Sante conseil multi-agents) vont intensement utiliser wiki/

## Recent Changes

- 2026-04-15 Phase 0 : worktree `wt/wiki-adoption-260415` cree (commit `be7af11`)
- 2026-04-15 Phase 1 : plugin claude-obsidian v1.4.3 installe globalement (patch settings.json HTTPS + git insteadOf AgriciDaniel)
- 2026-04-15 Phase 2 : scaffold vault (31 dossiers wiki/ + 6 .raw/ + 28 .gitkeep + 4 fichiers MD racine + 5 _index domaines + 5 templates)
- 2026-04-15 Phase 3 : documentation 5 tiers + module Knowledge Core OS (docs/core/knowledge.md)
- 2026-04-15 Phase 4 : hooks integres (SessionStart wrapper + PostCompact + Stop ; PostToolUse DESACTIVE)
- 2026-04-16 Phase 5 : migration selective auto-memory (2 pages migrees → wiki/, 27 restent auto-memory)

## Active Threads

- Plan adoption wiki : `docs/plans/2026-04-15-wiki-obsidian-adoption.md` (12 phases, 5/12 done)
- Prochaine phase : 6 (adoption 10 skills + documentation Core Tools)
- Premier ingest test (Phase 7) : Karpathy LLM Wiki + AgriciDaniel claude-obsidian
- Brief v11 enrichi (Phase 8) : cadres HOT + WIKI

## Next Action

Phase 3 : update `docs/core/communication.md` section 1 (4 tiers → 5 tiers) + ajout section 1.5 (test arbitral) + creation `docs/core/knowledge.md` (spec module Knowledge Phase 7 Core OS).
