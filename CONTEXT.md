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
| 2026-04-07 | **Audit OS profond + 13 fixes (24 etapes A0-A9 + T1-T10 + P1-P3, zero regression)**. Decouverte critique : **21 commits LOCAUX non pushed vers origin/main** → CI ci.yml jamais valide ces commits, Vercel deploy obsolete sur 02a6b3c "phase 2.4". Fixes appliques en 3 vagues : **P1 (5 critiques)** = F11 grep case-insensitive (health-check.sh + validate-void-glass.sh, fix lowercase #0a0a0b), F1 /new-project pointe vers module-scaffold.sh, F2 /session-start invoque health-check, A4.1 nouveau scripts/git-hooks/commit-msg version-controlled (etend types feat/fix/docs/refactor/chore/test/style + build/ci/perf/revert), A1.3 health-check invoque ref-checker (refs intactes en WARNING). **P2 (6 importants)** = A1.1 build time WARN >1500ms (parser robuste 845ms/1.23s), A3.1 Y2027 regex 20[0-9]{2}-, A3.2 sync-check HEAD~1 explicit check, A8.2 ci.yml timeout-minutes 10, A8.3 supabase-ping curl --max-time 30 + timeout 5, F19/dev-agent/doc-agent notes hooks et delegations. **P3 (cosmetique)** = A1.2 architecture-core.md actualise, sync.md cleanup historique, os-architect note non-regression. **Tests reussis** : T1 8/8, T2 6/7, T3 6/6, T4 6/7, T5 6/6, T6 4/4, T7 8/8, T8 3/3, T9 8/8, T10 3/3. **Verdict final** : SAIN (build 847ms, 19/19, 0 violations, refs 38/38, sync 6/6). **Modifies** : 4 agents (.md), 3 commands (.md), 2 workflows (.yml), 3 scripts (health-check, sync-check, validate-void-glass), 1 doc (architecture-core), 1 nouveau (scripts/git-hooks/commit-msg). 1 regression introduite et corrigee (parser BUILD_TIME suffix ms). |
| 2026-04-07 | Plan Finition OS execute en 1 session (S1+S2+S3 + cleanup baseline) : sync-check 6/6 fonts auto Void Glass (commit 17ed8af, section 7 ajoutee + sync.md/tools.md alignes), ref-checker.sh full-repo broken refs detector pure-bash code-block-aware (e021312, 178L, baseline 9 reduit a 6 puis 0), modules/app/README rewrite -345L AI-slop -> 30L factuel (01662a3), tools.md eval C2/C3 drops bundle-tracker + context-diff (ebfb66e, overlap health-check + sync-check), housekeeping decisions-log 16→6 actives + 10 archives nouvelles (7677487), cleanup ref-checker baseline 6→0 + Prochaine action post-Finition (98b8418, formatting 5 lignes specs/plans historiques). 6 commits propres. Build 902ms, 19/19 tests, health-check SAIN, sync-check 6/6 SAIN, ref-checker 0 broken. Foundation OS pret pour Phase 5 Expansion. |
| 2026-04-07 | Dette Tools cloturee + plan Finition OS DONE : module-scaffold.sh (170L, automatise /new-project, idempotent, --help, valide kebab-case, gere upgrade ligne CONTEXT.md "prevu" → "initialise", Python embedded via env vars pour edition robuste, commit 025615c) + plan multi-session docs/plans/2026-04-07-finition-os.md (296L, decoupage 3 sessions : S1 sync-check 6/6 fonts auto, S2 ref-checker full-repo, S3 eval bundle-tracker/context-diff + housekeeping decisions-log, commit 2fd1c6d). Sort module-scaffold du backlog Tools moyenne priorite. 7 tests scaffold passes (--help, no-args, bad-name, neuf, idempotent, upgrade, cleanup). Build 903ms, 19/19 tests, SAIN. |
| 2026-04-07 | Chantier OS suite DONE : 3 phases en 3 commits (39b85f6 vitest dans health-check, de19c2c sync-check.sh executable, 6d4e1b0 sync-check routes). scripts/sync-check.sh nouveau (180L) — 5 checks auto : health-check + modules vs CONTEXT + refs HEAD~1..HEAD + Core OS (4 agents + 4 commands + 5 specs) + routes CONTEXT.md <-> App.tsx. 5/6 sections /sync automatisees (reste manuel : artifacts details + fonts). Pre-commit catch maintenant tests vitest casses en DEGRADED. Build 854ms, 19/19 tests, SAIN. |
| 2026-04-07 | Affinement Foundation OS DONE : 3 phases (A Core OS specs, B Agents/Commands, C Audit nettoyage) + suite C (MD first supprime, data/ marques historique) en 4 commits (3d3cae2, b8b33a9, 8ab0844, 73dc63b). 19 fichiers touches. Desyncs JSX→TSX fixes, seuils CSS 40KB aligne source unique monitor.md, de-dup tables Core OS dans CLAUDE.md (-34 mots), regle "MD first" morte supprimee, 7 decisions 2026-04-01 archivees dans docs/decisions-log.md (19→12 actives), 7 data/*.md marques "Historique — artifact archive". Build 739ms, 19/19 tests, SAIN. |
| 2026-04-07 | Phase 4 Monitoring DONE : pre-commit hook (scripts/git-hooks/pre-commit installe vers .git/hooks/, BROKEN bloque + DEGRADED warn), fix bundle extraction health-check ($3 $4 → $2, valeurs reelles JS 457.15kB / CSS 17.22kB), seuils JS>600KB/CSS>40KB → WARNING, section Token-awareness ajoutee CLAUDE.md (951 mots, sous limite 1500). 3 cas hook testes (SAIN/BROKEN/DEGRADED). |

## Prochaine action
1. **Commit + push 22 commits locaux** : 21 commits historiques (Phase 3 → Finition OS) + 1 commit a venir pour les 13 fixes audit. Etat actuel : main ahead 21 vs origin/main, donc CI ci.yml + Vercel deploy desynchronises. Action : creer commit "feat(os): audit profond + 13 fixes zero-regression" puis `git push origin main` → declenche CI + Vercel rebuild.
2. **Phase 5 Expansion** : choisir module Finance / Sante / Trading. Ref : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 5

### Actions manuelles Kevin (hors code)
- **`git push origin main`** : 21 commits locaux + le commit audit a creer doivent etre pushed pour debloquer CI + Vercel deploy. Action critique anti-regression.
- Activer "Email confirmations" dans Supabase Auth settings (UI Supabase Dashboard → Authentication → Providers → Email → Confirm email). Pendant depuis Phase 2.3.
- OMC update disponible v4.10.1 → v4.11.0 (`omc update`). Lateral, pas urgent.

## Decisions actives

> 17 decisions stabilisees (7 du 2026-04-01 + 10 specs/phases/livrables) archivees dans `docs/decisions-log.md` (toujours actives, sorties de la vue chaude — protocole Memory).

| Decision | Date | Detail |
|----------|------|--------|
| Dashboard | 2026-04-05 | Commander evolue vers monitoring Core OS (futur) |
| BMAD garde | 2026-04-07 | _bmad/ reste dormant (overrule Kevin sur verdict audit ARCHIVER). |
| Code review | 2026-04-07 | review-agent custom = outil principal. Coderabbit / code-review Anthropic / OMC code-reviewer = installes mais non invoques. |
| Affinement OS | 2026-04-07 | 3 phases desyncs/dedup Core OS + agents/commands + audit (commits 3d3cae2, b8b33a9, 8ab0844, 73dc63b). Decisions-log cree, MD first supprime, data/ figes. |
| Chantier OS suite | 2026-04-07 | sync-check.sh executable (180L, 5 checks auto, 5/6 sections /sync automatisees) + vitest integre pre-commit (DEGRADED si fail). Commits 39b85f6, de19c2c, 6d4e1b0. |
| Finition OS plan | 2026-04-07 | 3 sessions programmees pour cloturer dette Tools + housekeeping avant Phase 5. Plan : `docs/plans/2026-04-07-finition-os.md`. S1 sync-check 6/6, S2 ref-checker, S3 polish + decisions-log. |
| Audit OS profond | 2026-04-07 | 24 etapes A0-A9 + T1-T10 + P1-P3 executees en 1 session. 13 fixes appliques (5 P1 critiques + 6 P2 importants + 2 P3 cosmetiques). health-check enrichi (refs intactes via ref-checker, build time WARN >1500ms, decisions regex Y2027-safe). validate-void-glass case-insensitive. commit-msg etend a 11 types via scripts/git-hooks/commit-msg version-controlled. ci.yml + supabase-ping timeouts. Verdict SAIN, zero regression fonctionnelle. Decouverte : 21 commits ahead origin/main. |
| Compactage → re-audit | 2026-04-07 | Si la conversation Claude approche du compactage (perte de contexte risquee), refaire un cycle complet d'audit + test (A0-A9 + T1-T10) pour rebatir un baseline propre avant de continuer. Permet de detecter toute regression introduite avant la perte de contexte et de garantir que CONTEXT.md reflete l'etat reel. |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /knowledge, /dashboard, /crud-test, /phase1-demo, /login, /reset-password
- **Build** : OK (854ms, JS 457.15kB / CSS 17.22kB, 107 modules) — sous seuils 600KB/40KB
- **Tests** : 19 (6 fichiers : app, supabase, mutations, useCommander, AuthContext, forms)
- **Navbar** : sticky top, NavLink active state (Home / Commander / Knowledge / Dashboard), bouton deconnexion integre
- **Artifacts JSX** : 0 dans src/artifacts/ (supprime). Tous archives dans `.archive/artifacts-jsx/` (7 fichiers)
- **Deploy** : https://foundation-os.vercel.app/ (root dir modules/app, live)
- **DB** : Supabase, 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- **MD pairs** : 7 dans data/ — alignes avec .archive/artifacts-jsx/ (7/7)
- **Refs stales** : 0 confirmed via `bash scripts/ref-checker.sh` (baseline 0, 38 .md scannes full-repo, code-block aware)

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
- **Tests** : Vitest 19 tests, 6 fichiers (app, supabase, mutations, useCommander, AuthContext, forms) + health-check.sh (Monitor + vitest) + sync-check.sh (/sync audit 6/6 sections auto, fonts Void Glass inclus) + ref-checker.sh (full-repo broken refs detector, baseline 0)
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
