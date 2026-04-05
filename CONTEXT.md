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
| 2026-04-05 | Reorganisation complete du projet — monorepo modules/, 76 fichiers racine reduits a 3, CLAUDE.md reecrit (52L, anti-bullshit gates), CONTEXT.md cree, docs/ cree (design-system, architecture, manifeste, setup-guide), .fos/ supprime (11MB), archives purgees (166→67 fichiers), hooks simplifies (8→2), refs stales corrigees dans Dashboard/commander/sync/index, memoire Claude native configuree (4 fichiers), 2 commits. Build OK 786ms. |

## Prochaine action
1. Kevin : mettre a jour Root Directory Vercel (app/ → modules/app/)
2. Corriger refs stales restantes dans fos-toolbox.jsx et fos-scale-orchestrator.jsx (descriptions de workflows)
3. Decider du prochain chantier : ameliorer l'app existante ou demarrer un nouveau module

## Decisions actives

| Decision | Detail |
|----------|--------|
| Stack | Vite + React + TS + Tailwind + Supabase + Vercel |
| Design | Void Glass — voir docs/design-system.md |
| Architecture | Monorepo avec modules/ (app, finance, health) |
| Memoire | CONTEXT.md + auto-memory Claude native |
| Commits | Conventional commits type(scope): description |
| Anti-bullshit | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |
| Garde-fous | Jamais de fichier a la racine, jamais de fichier sans demande, grep+fix apres rename |

## App Builder — Etat technique

- **Routes** : / (index), /commander, /dashboard, /crud-test, /phase1-demo
- **Build** : OK (786ms, 440KB bundle)
- **Deploy** : https://foundation-os.vercel.app/ (root dir a changer vers modules/app)
- **DB** : Supabase connecte (sessions, decisions, risks, next_steps, context_blocks)
- **MD pairs** : modules/app/data/ (commander, graph, index, sync, toolbox)
- **Refs stales restantes** : fos-toolbox.jsx et fos-scale-orchestrator.jsx (descriptions workflows)

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
| Vercel deploy casse | medium | Changer root dir vers modules/app |
