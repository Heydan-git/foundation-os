# Foundation OS — Contexte

> Source de verite. Lu en debut de session, mis a jour en fin.

## Modules

| Module | Status | Detail |
|--------|--------|--------|
| App Builder | MVP | 5 routes, build OK 832ms, 7 artifacts, Supabase connecte |
| Core OS | 4/4 actif | Cortex (routing), Memory (tiers), Monitor (health), Tools (automation). Specs : docs/core/ |
| Finance | prevu | Pas encore cree |
| Sante | prevu | Pas encore cree |

## Dernieres sessions

| Date | Resume |
|------|--------|
| 2026-04-05 | Reorg + audit deep : 76 fichiers racine → 3, -34750 lignes. |
| 2026-04-05 | Audit fonctionnel (85+ fichiers) : database.types.ts reecrit (match SQL, +Relationships), mutations.ts zero as any, seed data alignee, docs corrigees, package.json nettoye, artifacts line counts corriges. |
| 2026-04-05 | Cleanup final + plan Core OS : Dashboard data corrige, forms font-sans/font-mono, plan 4 modules (Cortex, Memory, Monitor, Tools) valide. 18 fichiers modifies, 2 commits, build OK 832ms. |

## Prochaine action
1. Kevin : mettre a jour Root Directory Vercel (app/ → modules/app/)
2. Core OS complet (4/4). Prochaine etape : construire les outils backlog (health-check, supabase-ping) ou commencer un nouveau module (Finance/Sante)

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
| Core OS | 2026-04-05 | 4 modules — Cortex actif, Memory actif, Monitor/Tools prevus. Specs : docs/core/ |
| Dashboard | 2026-04-05 | Commander evolue vers monitoring Core OS (futur) |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /dashboard, /crud-test, /phase1-demo
- **Build** : OK (832ms, 440KB JS + 21KB CSS)
- **Deploy** : https://foundation-os.vercel.app/ (root dir a changer vers modules/app)
- **DB** : Supabase, 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- **Artifacts** : 7 dans src/artifacts/ (commander, graph, index, knowledge, scale-orchestrator, sync, toolbox)
- **MD pairs** : 5 dans data/ (commander, graph, index, sync, toolbox) — knowledge et scale-orchestrator n'ont pas de MD pair
- **Refs stales** : corrigees (line counts, statuts, refs fantomes fos-pipeline supprimees)

## MCP — Comptes connectes

| Service | ID / Info |
|---------|-----------|
| Asana | workspace: 1213280972575193, user: kevin.noel.divers@gmail.com |
| Notion | user: 4f1b99db-9655-40a7-b59a-a9e8af210dfb |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils installes

- **Claude Code** : CLAUDE.md (enrichi Cortex routing) + 4 agents (refactores) + 4 commands (module-aware) + 1 hook PreToolUse + 1 git hook
- **OMC** : oh-my-claudecode (team, autopilot, ralph, ultrawork, etc.)
- **BMAD v6** : _bmad/ (12 modules)
- **MCP** : Notion, Asana, Figma, Monday, ClickUp, Computer Use, Context7

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Changer root dir vers modules/app |
