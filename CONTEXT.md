# Foundation OS — Contexte

> Source de verite. Lu en debut de session, mis a jour en fin.

## Modules

| Module | Status | Detail |
|--------|--------|--------|
| App Builder | MVP+ | 6 routes (+login), Dashboard dynamique, Auth Supabase, Vitest 19 tests, build 687ms |
| Core OS | 4/4 actif | Cortex (routing), Memory (tiers), Monitor (health), Tools (automation). Specs : docs/core/ |
| Finance | prevu | Pas encore cree |
| Sante | prevu | Pas encore cree |

## Dernieres sessions

| Date | Resume |
|------|--------|
| 2026-04-07 | Phase 2.1 Tests : helper mocks Supabase + 16 tests (mutations 5, useCommander 3, AuthContext 4, forms 4). 19 tests total, 0 failure. Build 687ms. SAIN. Plan Phase 2 ecrit (3 sessions). |
| 2026-04-05 | Phase 1 Fondations DONE : CLAUDE.md v2 (902 mots), directive sauvegardee, safeguards.json supprime, settings.local trimme (144→40L), security-guidance hook installe, gstack installe, docs/index.md cree. CI fix Node 24. 8 commits. health-check SAIN. |
| 2026-04-05 | Brainstorm directive Kevin : 5 agents d'analyse (projet+code+tools+21 repos), spec v2 design (5 phases iteratives), plan Phase 1 (8 tasks). Approche C validee. |
| 2026-04-05 | Core OS 4/4 + Approche A+B : Dashboard dynamique, Auth Supabase, Vitest, CI, health-check, Vercel deploy. App live. |
| 2026-04-05 | Core OS 4/4 implemente (Cortex, Memory, Monitor, Tools). Audit operationnel 6/6 OK. |
| 2026-04-05 | Reorg + audit deep : 76 fichiers racine → 3, -34750 lignes. |

## Prochaine action
1. Phase 2 Session 2 — Navigation (NavLink dans Layout) + Auth complete (email verification, password reset, min 8 char)
2. Plan : `docs/plans/2026-04-07-phase2-app-hardening.md` section "Session 2"
3. Apres : Session 3 = integration fos-commander.tsx + fos-knowledge.tsx

## Decisions actives

| Decision | Date | Detail |
|----------|------|--------|
| Stack | 2026-04-01 | Vite + React + TS + Tailwind + Supabase + Vercel |
| Design | 2026-04-01 | Void Glass — docs/design-system.md |
| Architecture | 2026-04-01 | Monorepo modules/ (seul app/ existe, finance et sante prevus) |
| Memoire | 2026-04-05 | 4 tiers (session/contexte/reference/auto-memory) — docs/core/memory.md |
| Commits | 2026-04-01 | Conventional commits type(scope): description |
| Anti-bullshit | 2026-04-01 | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |
| Garde-fous | 2026-04-01 | Jamais de fichier a la racine, jamais sans demande, grep+fix apres rename |
| Schema DB | 2026-04-01 | supabase/migrations/001_create_tables.sql = source de verite (6 tables) |
| Core OS | 2026-04-05 | 4 modules actifs (Cortex, Memory, Monitor, Tools). Specs : docs/core/ |
| Dashboard | 2026-04-05 | Commander evolue vers monitoring Core OS (futur) |
| Foundation v2 | 2026-04-05 | Approche C iterative 5 phases. Spec : docs/specs/2026-04-05-foundation-os-v2-design.md |
| Phase 1 DONE | 2026-04-05 | Fondations : CLAUDE.md v2, security-guidance, gstack, index navigation |
| Phase 2.1 DONE | 2026-04-07 | Tests : 16 nouveaux, mocks Supabase via vi.hoisted, 19 total. Plan Phase 2 ecrit. |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /dashboard, /crud-test, /phase1-demo, /login
- **Build** : OK (687ms, 439KB JS + 21.5KB CSS)
- **Tests** : 19 (6 fichiers : app, supabase, mutations, useCommander, AuthContext, forms)
- **Deploy** : https://foundation-os.vercel.app/ (root dir modules/app, live)
- **DB** : Supabase, 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- **Artifacts** : 7 dans src/artifacts/ (commander, graph, index, knowledge, scale-orchestrator, sync, toolbox)
- **MD pairs** : 7 dans data/ — tous alignes (7/7)
- **Refs stales** : 0 (audit 2026-04-05)

## MCP — Comptes connectes

| Service | ID / Info |
|---------|-----------|
| Asana | workspace: 1213280972575193, user: kevin.noel.divers@gmail.com |
| Notion | user: 4f1b99db-9655-40a7-b59a-a9e8af210dfb |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils installes

- **Claude Code** : CLAUDE.md v2 (902 mots, imperatifs integres) + 4 agents + 4 commands + 2 hooks PreToolUse (Void Glass + security) + 1 git hook
- **CI** : GitHub Actions (Node 24, build + TS + tests sur push) + supabase-ping (cron hebdo)
- **Tests** : Vitest (3 tests, coverage logique metier prevu Phase 2), health-check.sh (Monitor indicators)
- **OMC** : oh-my-claudecode (team, autopilot, ralph, ultrawork, etc.)
- **Superpowers** : v5.0.7 (TDD, brainstorming, executing-plans, verification)
- **gstack** : ~/.claude/skills/gstack/ (qa, cso, careful, freeze, guard, ship)
- **BMAD v6** : _bmad/ (12 modules — a auditer Phase 3)
- **MCP** : Notion, Asana, Figma, Monday, ClickUp, Computer Use, Context7

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Changer root dir vers modules/app |
