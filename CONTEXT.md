# Foundation OS — Contexte

> Source de verite. Lu en debut de session, mis a jour en fin.

## Modules

| Module | Status | Detail |
|--------|--------|--------|
| App Builder | MVP | 5 routes, build OK 761ms, 7 artifacts, Supabase connecte |
| Finance | prevu | Pas encore cree |
| Sante | prevu | Pas encore cree |

## Dernieres sessions

| Date | Resume |
|------|--------|
| 2026-04-05 | Reorganisation complete + audit deep : 76 fichiers racine → 3, -34750 lignes, 5 commits. .gitignore complet, chromadb retire, 5 artifacts morts supprimes, supabase duplicates supprimes, agents/commands/docs reecrits, memoire Claude enrichie (6 fichiers). Build OK, CSS -30%. |

## Prochaine action
1. Kevin : mettre a jour Root Directory Vercel (app/ → modules/app/)
2. Decider du prochain chantier : ameliorer l'app existante ou demarrer un module

## Decisions actives

| Decision | Detail |
|----------|--------|
| Stack | Vite + React + TS + Tailwind + Supabase + Vercel |
| Design | Void Glass — docs/design-system.md |
| Architecture | Monorepo modules/ (seul app/ existe, finance et sante prevus) |
| Memoire | CONTEXT.md + auto-memory Claude native (6 fichiers) |
| Commits | Conventional commits type(scope): description |
| Anti-bullshit | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |
| Garde-fous | Jamais de fichier a la racine, jamais sans demande, grep+fix apres rename |
| Schema DB | supabase/migrations/001_create_tables.sql = source de verite (6 tables) |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /dashboard, /crud-test, /phase1-demo
- **Build** : OK (761ms, 440KB JS + 21KB CSS)
- **Deploy** : https://foundation-os.vercel.app/ (root dir a changer vers modules/app)
- **DB** : Supabase, 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- **Artifacts** : 7 dans src/artifacts/ (commander, graph, index, knowledge, scale-orchestrator, sync, toolbox)
- **MD pairs** : 5 dans data/ (commander, graph, index, sync, toolbox) — knowledge et scale-orchestrator n'ont pas de MD pair
- **Refs stales** : fos-toolbox.jsx, fos-knowledge.jsx, fos-scale-orchestrator.jsx (descriptions workflows, cosmetic)

## MCP — Comptes connectes

| Service | ID / Info |
|---------|-----------|
| Asana | workspace: 1213280972575193, user: kevin.noel.divers@gmail.com |
| Notion | user: 4f1b99db-9655-40a7-b59a-a9e8af210dfb |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils installes

- **Claude Code** : CLAUDE.md + 4 agents + 4 commands + 1 hook PreToolUse + 1 git hook
- **OMC** : oh-my-claudecode (team, autopilot, ralph, ultrawork, etc.)
- **BMAD v6** : _bmad/ (12 modules)
- **MCP** : Notion, Asana, Figma, Monday, ClickUp, Computer Use, Context7

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Changer root dir vers modules/app |
