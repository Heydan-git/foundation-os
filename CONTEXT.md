# Foundation OS — Contexte

> Source de verite. Lu en debut de session, mis a jour en fin.

## Modules

| Module | Status | Detail |
|--------|--------|--------|
| App Builder | MVP | 5 routes, Vercel live, Supabase connecte |
| Finance | — | Pas commence |
| Sante | — | Pas commence |

## Dernieres sessions

| Date | Resume |
|------|--------|
| 2026-04-05 | Reorganisation complete : monorepo modules/, archivage, anti-bullshit gates, design-system.md, purge archives inutiles |

## Prochaine action
Mettre a jour le Root Directory Vercel : app/ → modules/app/ (Settings > General > Root Directory)

## Decisions actives

| Decision | Detail |
|----------|--------|
| Stack | Vite + React + TS + Tailwind + Supabase + Vercel |
| Design | Void Glass — voir docs/design-system.md |
| Architecture | Monorepo avec modules/ (app, finance, health) |
| Memoire | CONTEXT.md + auto-memory Claude native |
| Commits | Conventional commits type(scope): description |
| Anti-bullshit | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /dashboard, /crud-test, /phase1-demo
- **Build** : OK (807ms, 440KB bundle)
- **Deploy** : https://foundation-os.vercel.app/ (root dir a changer vers modules/app)
- **DB** : Supabase connecte (sessions, decisions, risks, next_steps, context_blocks)
- **MD pairs** : modules/app/data/ (commander, graph, index, sync, toolbox)
- **Donnees stales** : Dashboard.tsx et quelques JSX artifacts referencent des fichiers renommes/archives

## MCP — Comptes connectes

| Service | ID / Info |
|---------|-----------|
| Asana | workspace: 1213280972575193, user: kevin.noel.divers@gmail.com |
| Notion | user: 4f1b99db-9655-40a7-b59a-a9e8af210dfb |
| Figma | 16 tools disponibles |
| Monday.com | 42 tools disponibles |
| Gmail | Auth requise |

## Outils installes

- **Claude Code** : CLAUDE.md + 4 agents + 4 commands + 2 hooks
- **OMC** : oh-my-claudecode (team, autopilot, ralph, ultrawork, etc.)
- **BMAD v6** : _bmad/ — 12 modules (brainstorming, elicitation, distillator, reviews, etc.)
- **MCP** : Notion(14), Asana(22), Figma(16), Monday(42), ClickUp(48), Computer Use(27)
- **Context7** : doc live anti-hallucination

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
