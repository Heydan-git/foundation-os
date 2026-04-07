# Foundation OS — Contexte

> Source de verite. Lu en debut de session, mis a jour en fin.

## Modules

| Module | Status | Detail |
|--------|--------|--------|
| App Builder | production-ready | 8 routes, Navbar 4 items, KnowledgePage integree, 0 artifact JSX, Vitest 19 tests, build 862ms |
| Core OS | 4/4 actif | Cortex (routing), Memory (tiers), Monitor (health), Tools (automation). Specs : docs/core/ |
| Finance | prevu | Pas encore cree |
| Sante | prevu | Pas encore cree |

## Dernieres sessions

| Date | Resume |
|------|--------|
| 2026-04-07 | Phase 3 OS Intelligence DONE : session-end 4 niveaux (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED), docs/index.md re-aligne (8 routes, Navbar, KnowledgePage, .archive/), docs/tools-audit.md. Decisions Kevin : BMAD garde dormant, review-agent = code review principal. health-check SAIN, build 676ms, 19/19 tests. |
| 2026-04-07 | Phase 2.4 DONE : KnowledgePage.tsx (conversion fos-knowledge.jsx, type strict, 5 sections), 7 artifacts JSX archives dans .archive/artifacts-jsx/, route /knowledge + Navbar. health-check.sh adapte (TSX sizes + MD pairs vs archive). Build 862ms. **Phase 2 DONE**. |
| 2026-04-07 | Phase 2.2+2.3 : Navbar (NavLink active state), LoginPage min 8 char + lien reset, ResetPasswordPage 2 modes (request/update). 7 routes. 19 tests OK. Build 843ms. SAIN. |
| 2026-04-07 | Phase 2.1 Tests : helper mocks Supabase + 16 tests (mutations 5, useCommander 3, AuthContext 4, forms 4). 19 tests total, 0 failure. Build 687ms. SAIN. Plan Phase 2 ecrit (3 sessions). |
| 2026-04-05 | Phase 1 Fondations DONE : CLAUDE.md v2 (902 mots), directive sauvegardee, safeguards.json supprime, settings.local trimme (144→40L), security-guidance hook installe, gstack installe, docs/index.md cree. CI fix Node 24. 8 commits. health-check SAIN. |

## Prochaine action
1. **Phase 4 — Monitoring** : health-check.sh en pre-commit hook, bundle size tracking, regles token-awareness
2. Reference : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 4
3. Plan Phase 4 a ecrire avant execution
4. Action manuelle pendante : activer "Email confirmations" dans Supabase Auth settings (UI Supabase, hors code)

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
| Phase 2.2/2.3 DONE | 2026-04-07 | Navbar (NavLink, sticky top, Void Glass), LoginPage min 8 char, ResetPasswordPage (request+update modes). 7 routes. |
| Phase 2 DONE | 2026-04-07 | App Hardening complet : 16 tests, Navbar+Auth, KnowledgePage. Artifacts JSX archives. App production-ready. |
| Phase 3 DONE | 2026-04-07 | OS Intelligence : session-end 4 niveaux, docs/index.md re-aligne, audit BMAD/OMC/Coderabbit (docs/tools-audit.md). |
| BMAD garde | 2026-04-07 | _bmad/ reste dormant (overrule Kevin sur verdict audit ARCHIVER). |
| Code review | 2026-04-07 | review-agent custom = outil principal. Coderabbit / code-review Anthropic / OMC code-reviewer = installes mais non invoques. |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /knowledge, /dashboard, /crud-test, /phase1-demo, /login, /reset-password
- **Build** : OK (862ms, 457KB JS + 17.2KB CSS, 107 modules)
- **Tests** : 19 (6 fichiers : app, supabase, mutations, useCommander, AuthContext, forms)
- **Navbar** : sticky top, NavLink active state (Home / Commander / Knowledge / Dashboard), bouton deconnexion integre
- **Artifacts JSX** : 0 dans src/artifacts/ (supprime). Tous archives dans `.archive/artifacts-jsx/` (7 fichiers)
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
