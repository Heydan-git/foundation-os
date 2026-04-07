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
| 2026-04-07 | Chantier OS suite DONE : 3 phases en 3 commits (39b85f6 vitest dans health-check, de19c2c sync-check.sh executable, 6d4e1b0 sync-check routes). scripts/sync-check.sh nouveau (180L) — 5 checks auto : health-check + modules vs CONTEXT + refs HEAD~1..HEAD + Core OS (4 agents + 4 commands + 5 specs) + routes CONTEXT.md <-> App.tsx. 5/6 sections /sync automatisees (reste manuel : artifacts details + fonts). Pre-commit catch maintenant tests vitest casses en DEGRADED. Build 854ms, 19/19 tests, SAIN. |
| 2026-04-07 | Affinement Foundation OS DONE : 3 phases (A Core OS specs, B Agents/Commands, C Audit nettoyage) + suite C (MD first supprime, data/ marques historique) en 4 commits (3d3cae2, b8b33a9, 8ab0844, 73dc63b). 19 fichiers touches. Desyncs JSX→TSX fixes, seuils CSS 40KB aligne source unique monitor.md, de-dup tables Core OS dans CLAUDE.md (-34 mots), regle "MD first" morte supprimee, 7 decisions 2026-04-01 archivees dans docs/decisions-log.md (19→12 actives), 7 data/*.md marques "Historique — artifact archive". Build 739ms, 19/19 tests, SAIN. |
| 2026-04-07 | Phase 4 Monitoring DONE : pre-commit hook (scripts/git-hooks/pre-commit installe vers .git/hooks/, BROKEN bloque + DEGRADED warn), fix bundle extraction health-check ($3 $4 → $2, valeurs reelles JS 457.15kB / CSS 17.22kB), seuils JS>600KB/CSS>40KB → WARNING, section Token-awareness ajoutee CLAUDE.md (951 mots, sous limite 1500). 3 cas hook testes (SAIN/BROKEN/DEGRADED). |
| 2026-04-07 | Phase 3 OS Intelligence DONE : session-end 4 niveaux (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED), docs/index.md re-aligne (8 routes, Navbar, KnowledgePage, .archive/), docs/tools-audit.md. Decisions Kevin : BMAD garde dormant, review-agent = code review principal. health-check SAIN, build 676ms, 19/19 tests. |
| 2026-04-07 | Phase 2.4 DONE : KnowledgePage.tsx (conversion fos-knowledge.jsx, type strict, 5 sections), 7 artifacts JSX archives dans .archive/artifacts-jsx/, route /knowledge + Navbar. health-check.sh adapte (TSX sizes + MD pairs vs archive). Build 862ms. **Phase 2 DONE**. |

## Prochaine action
1. **Decision Kevin** : continuer dette Tools (module-scaffold prepare Phase 5 / ref-checker full) OU demarrer Phase 5 Expansion directement
2. Si Phase 5 : choisir premier nouveau module (Finance / Sante / Trading), ecrire plan avant execution
3. Reference : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 5
4. Action manuelle pendante : activer "Email confirmations" dans Supabase Auth settings (UI Supabase, hors code)

## Decisions actives

> 7 decisions stabilisees du 2026-04-01 archivees dans `docs/decisions-log.md` (toujours actives, sorties de la vue chaude — protocole Memory).

| Decision | Date | Detail |
|----------|------|--------|
| Memoire | 2026-04-05 | 4 tiers (session/contexte/reference/auto-memory) — docs/core/memory.md |
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
| Phase 4 DONE | 2026-04-07 | Monitoring : pre-commit health-check (BROKEN bloque), bundle thresholds JS>600KB/CSS>40KB, token-awareness rules dans CLAUDE.md. |
| Affinement OS | 2026-04-07 | 3 phases desyncs/dedup Core OS + agents/commands + audit (commits 3d3cae2, b8b33a9, 8ab0844, 73dc63b). Decisions-log cree, MD first supprime, data/ figes. |
| Chantier OS suite | 2026-04-07 | sync-check.sh executable (180L, 5 checks auto, 5/6 sections /sync automatisees) + vitest integre pre-commit (DEGRADED si fail). Commits 39b85f6, de19c2c, 6d4e1b0. |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /knowledge, /dashboard, /crud-test, /phase1-demo, /login, /reset-password
- **Build** : OK (854ms, JS 457.15kB / CSS 17.22kB, 107 modules) — sous seuils 600KB/40KB
- **Tests** : 19 (6 fichiers : app, supabase, mutations, useCommander, AuthContext, forms)
- **Navbar** : sticky top, NavLink active state (Home / Commander / Knowledge / Dashboard), bouton deconnexion integre
- **Artifacts JSX** : 0 dans src/artifacts/ (supprime). Tous archives dans `.archive/artifacts-jsx/` (7 fichiers)
- **Deploy** : https://foundation-os.vercel.app/ (root dir modules/app, live)
- **DB** : Supabase, 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- **MD pairs** : 7 dans data/ — alignes avec .archive/artifacts-jsx/ (7/7)
- **Refs stales** : 0 (audit 2026-04-07 — hors historique fige docs/plans, docs/specs, modules/app/data)

## MCP — Comptes connectes

| Service | ID / Info |
|---------|-----------|
| Asana | workspace: 1213280972575193, user: kevin.noel.divers@gmail.com |
| Notion | user: 4f1b99db-9655-40a7-b59a-a9e8af210dfb |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils installes

- **Claude Code** : CLAUDE.md v2 (868 mots, imperatifs integres, tables Core OS condensees vers specs) + 4 agents + 4 commands + 2 hooks PreToolUse (Void Glass + security) + 1 git hook (pre-commit)
- **CI** : GitHub Actions (Node 24, build + TS + tests sur push) + supabase-ping (cron hebdo)
- **Tests** : Vitest 19 tests, 6 fichiers (app, supabase, mutations, useCommander, AuthContext, forms) + health-check.sh (Monitor + vitest) + sync-check.sh (/sync audit 5/6 sections auto)
- **OMC** : oh-my-claudecode (team, autopilot, ralph, ultrawork, etc.)
- **Superpowers** : v5.0.7 (TDD, brainstorming, executing-plans, verification)
- **gstack** : ~/.claude/skills/gstack/ (qa, cso, careful, freeze, guard, ship)
- **BMAD v6** : _bmad/ (12 modules, dormant — audit Phase 3 DONE, voir docs/tools-audit.md)
- **MCP** : Notion, Asana, Figma, Monday, ClickUp, Computer Use, Context7

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Changer root dir vers modules/app |
