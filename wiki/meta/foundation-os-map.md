---
type: meta
title: "Foundation OS — Carte Complete"
updated: 2026-04-16
tags:
  - meta
  - map
  - index
status: evergreen
related:
  - "[[index-wiki]]"
  - "[[hot]]"
  - "[[overview]]"
---

# Foundation OS — Carte Neuronale Complete

> Hub central qui connecte CHAQUE fichier du projet au graph Obsidian.
> Mis a jour automatiquement par Claude en fin de session.

Navigation: [[index-wiki]] | [[hot]] | [[overview]] | [[log]]

---

## Fichiers racine

- [[CLAUDE]] — Instructions Claude Code (charge auto chaque session, regles, imperatifs, automations)
- [[CONTEXT]] — Etat operationnel projet (source de verite : modules, sessions, cap, decisions, metriques)
- [[README|README (racine)]] — Description projet + structure + setup

## Core OS — Specs (docs/core/)

- [[architecture-core]] — Architecture 7 modules Core OS (Cortex, Communication, Monitor, Tools, Planner, Worktrees, Knowledge)
- [[cortex]] — Module Phase 1 : routing tache → agent, contexte CONTEXT.md lifecycle, orchestration commands
- [[communication]] — Module Phase 2 : 5 tiers memoire, nomenclature, journalisation, indexation, lecture, briefing v12
- [[monitor]] — Module Phase 3 : health indicators par severite (critical/warning/info), verdicts SAIN/DEGRADED/BROKEN
- [[tools]] — Module Phase 4 : validators, scripts, CI/CD, catalogue 109 outils, routing 35 regles
- [[planner]] — Module Phase 5 : orchestrateur /plan-os, EnterPlanMode natif, dual-path plans
- [[worktrees]] — Module Phase 6 : plomberie native Desktop, /wt new|list|clean, convention wt/<desc>-<yymmdd>
- [[knowledge]] — Module Phase 7 : wiki layer persistant claude-obsidian, 10 skills, couplage modules <-> wiki
- [[naming-conventions]] — Conventions nommage transversales (branches, worktrees, sessions, plans, specs, memoires)

## Core OS — Agents (.claude/agents/)

- [[.claude/agents/os-architect|os-architect]] — Agent Opus : architecture, decisions, stack, schema DB
- [[.claude/agents/dev-agent|dev-agent]] — Agent Sonnet : code React/TS, composants, Supabase, Void Glass
- [[.claude/agents/doc-agent|doc-agent]] — Agent Sonnet : documentation, CONTEXT.md, traces
- [[.claude/agents/review-agent|review-agent]] — Agent Sonnet : coherence, audit, zero regression, pre-deploy

## Core OS — Commands (.claude/commands/)

- [[.claude/commands/cockpit|cockpit]] — /cockpit : point d'entree unique (scan + brief + routing + cloture)
- [[.claude/commands/session-start|session-start]] — /session-start : protocole debut session (collecte + brief v12 14 sections)
- [[.claude/commands/session-end|session-end]] — /session-end : protocole fin session (inventaire + CONTEXT + hot.md + brief cloture)
- [[.claude/commands/plan-os|plan-os]] — /plan-os : orchestrateur plans (brainstorming → writing-plans → EnterPlanMode)
- [[.claude/commands/wt|wt]] — /wt : worktrees Foundation OS (new/list/clean)
- [[.claude/commands/new-project|new-project]] — /new-project : scaffold nouveau module
- [[.claude/commands/sync|sync]] — /sync : audit coherence full-repo

## Documentation (docs/)

- [[docs/architecture|architecture (globale)]] — Architecture globale projet
- [[docs/manifeste|manifeste]] — Manifeste vivant Foundation OS (identite, vision, realite)
- [[docs/setup-guide|setup-guide]] — Guide setup developpeur
- [[docs/decisions-log|decisions-log]] — Archive decisions techniques stables (> 30 jours)
- [[docs/index-documentation|index (docs)]] — Navigation documentation
- [[docs/core/tools/README-tools-catalogue|README Tools]] — Vue lisible catalogue outils

### Specs historiques (docs/specs/)

- [[2026-04-05-foundation-os-v2-design]] — Design V2 Foundation OS
- [[2026-04-10-cockpit-design]] — Design cockpit super-pilote
- [[2026-04-10-tools-module-v2-design]] — Design module Tools V2

### Plans (docs/plans/)

- 2026-04-16-mega-audit-final (archivé) — Méga audit final Foundation OS (63 findings + 9 innovations, 8 phases)
- [[_template-plan]] — Template plan Foundation OS (frontmatter + structure 12 sections)

## Travaux Cowork (docs/travaux-cowork/)

- [[docs/travaux-cowork/COWORK-CONTEXT|COWORK-CONTEXT]] — Contexte Cowork Desktop + CLI
- [[docs/travaux-cowork/README-cowork|README Cowork]] — Description travaux cowork
- [[docs/travaux-cowork/2026-04-13-evolution-core-os/index-evolution-core-os|index evolution Core OS]] — Index evolution Core OS
- [[docs/travaux-cowork/2026-04-14-briefs-foundation-os/index-briefs-foundation-os|index briefs FOS]] — Index briefs Foundation OS

### Plan Dashboard Monitoring

- [[docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/index-dashboard-monitoring|index dashboard monitoring]] — Index plan dashboard monitoring
- [[01-vision-et-cartographie]]
- [[02-architecture-navigation]]
- [[03-pages-detail]]
- [[04-donnees-et-liaisons]]
- [[05-ux-et-design-system]]
- [[06-plan-execution]]
- [[07-features-avancees]]
- [[08-ux-ergonomie-a11y]]
- [[09-dynamisme-auto-sync]]
- [[10-motion-microcopy-details]]
- [[11-tech-data-qa-security]]
- [[12-roadmap-metrics-futur]]
- [[13-gouvernance-design-system]]
- [[14-plan-execution-consolide]]

### Autres travaux Cowork

- [[02-analyse-sources-externes]] — Evolution Core OS
- [[01-project-instructions-v3]] — Reorg project instructions
- [[01-specs-morning-brief]] — Briefs Foundation OS morning
- [[02-specs-hebdo-synthesis]] — Briefs hebdo synthesis
- [[03-sources-et-regles]] — Sources et regles briefs

## Modules Code

### App Builder (modules/app/)

- [[modules/app/README-app-builder|README App Builder]] — Description module App
- [[modules/app/data/commander|commander (app page)]] — Page app Commander (pilotage OS)
- [[modules/app/data/graph|graph (app page)]] — Page app Graph (visualisation)
- [[modules/app/data/index-app-pages|index (app pages)]] — Index pages app
- [[modules/app/data/knowledge|knowledge (app page)]] — Page app Knowledge (base de connaissances UI)
- [[modules/app/data/scale-orchestrator|scale-orchestrator (app page)]] — Page app Scale Orchestrator
- [[modules/app/data/sync|sync (app page)]] — Page app Sync (synchronisation)
- [[modules/app/data/toolbox|toolbox (app page)]] — Page app Toolbox (outils)

### Design System (modules/design-system/)

- [[CHANGELOG|CHANGELOG DS]] — Changelog Design System
- [[index-design|Design (domaine wiki)]] — Knowledge layer design (UX research, patterns)

## Wiki — Knowledge Layer

### Neuroplasticite (auto-amelioration memoire)

- [[thinking]] — Reflexions autonomes, hypotheses, connexions cross-domain
- [[sessions-recent]] — 5 dernieres sessions (memoire court terme, append)
- [[lessons-learned]] — Auto-apprentissage erreurs/pieges
- [[hot]] — Cache flash derniere session (overwrite)
- [[log]] — Chronological operations log
- [[foundation-os-map]] — Cette carte (hub central graph)
- [[routines-guardrails]] — Garde-fous communs des 14 routines (lu avant chaque routine)
- [[routines-setup]] — Prompts des 14 routines Desktop autopilote

Spec : `docs/core/knowledge.md` section 8. Reflexes CLAUDE.md : recall wiki + consolidation + lessons + self-check.

### Concepts

- [[LLM Wiki Pattern]] — Pattern Karpathy : pre-compiler sources en wiki Markdown pour LLMs
- [[Hot Cache]] — Cache 500 mots session-to-session via wiki/hot.md
- [[Compounding Knowledge]] — Knowledge compose via cross-refs wiki
- [[Void Glass]] — Design system dark-only #030303 Foundation OS
- [[Foundation OS]] — OS de travail personnel IA-driven de Kevin
- [[Core OS]] — Architecture 7 modules operationnels
- [[Brief v12]] — Format brief session TDAH-friendly 14 tuiles Markdown
- [[Neuroplasticite]] — Systeme auto-amelioration memoire 4 reflexes
- [[TDAH workflow]] — Adaptations workflow pour profil TDAH Kevin
- [[foundation-os-desktop-migration]] — Migration Foundation OS → Desktop natif (2026-04-15)

### Entities

- [[Andrej Karpathy]] — AI researcher, createur LLM Wiki Pattern
- [[AgriciDaniel]] — Developer plugin claude-obsidian
- [[Obsidian]] — Editeur Markdown local gratuit (vault knowledge)
- [[Pinecone]] — Vector DB managee (extension archivage > 1000 pages)
- [[tools-foundation-os]] — Foundation OS toolchain complete

### Sources

- [[karpathy-llm-wiki-pattern]] — Article Karpathy LLM Wiki Pattern (2026-04)
- [[agricidaniel-claude-obsidian]] — Repo claude-obsidian (GitHub, 1279 stars)
- [[session-2026-04-16-wiki-adoption]] — Session adoption wiki Obsidian (2026-04-15/16)
- [[session-2026-04-16-neuroplasticity-audit]] — Session audit neuroplasticite (7 failles + 4 reflexes)

### Domaines

- [[wiki/domains/trading/index-trading|Trading]] — Strategies, backtests, whitepapers, instruments
- [[wiki/domains/finance/index-finance|Finance]] — Patrimoine, fiscalite, decisions
- [[wiki/domains/sante/index-sante|Sante]] — Bilans bio, protocoles, papers medicaux
- [[wiki/domains/design/index-design|Design]] — UX research, patterns, heuristiques
- [[wiki/domains/dev/index-dev|Dev]] — Frameworks, patterns code, architecture

### Meta

- [[overview]] — Executive summary wiki
- [[log]] — Chronological operations log
- [[hot]] — Hot cache derniere session (500 mots)
- [[index-wiki]] — Master catalog wiki

---

## Statistiques

| Type | Count |
|------|-------|
| Fichiers racine | 3 |
| Core OS specs | 9 |
| Core OS agents | 4 |
| Core OS commands | 7 |
| Documentation | 4 |
| Specs historiques | 3 |
| Plans | 3 |
| Travaux Cowork | 19 |
| App Builder data | 6 |
| Design System | 1 |
| Wiki concepts | 11 |
| Wiki entities | 5 |
| Wiki sources | 4 |
| Wiki domaines | 5 |
| Wiki meta | 4 |
| **Total connecte** | **84** |
