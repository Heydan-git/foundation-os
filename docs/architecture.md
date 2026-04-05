# Foundation OS — Architecture

## Vue d'ensemble

OS de travail personnel IA-driven. 3 couches :

```
MODULES (app, finance, sante)     Les projets concrets
TOOLKIT (OMC, BMAD, MCP)          Les outils installes
CORE (CLAUDE.md, CONTEXT.md,      Le cerveau
  memory, commands, hooks, agents)
```

## Stack technique

| Couche | Composant | Detail |
|--------|-----------|--------|
| App | Vite + React + TypeScript + Tailwind | Frontend |
| DB | Supabase (supabase-js SDK direct) | 5 tables : sessions, decisions, risks, next_steps, context_blocks |
| Deploy | Vercel (auto-deploy sur git push) | Root dir : modules/app |
| Design | Void Glass | docs/design-system.md |
| AI | Claude Code + OMC + BMAD | Multi-agent orchestration |
| MCP | Notion, Asana, Figma, Monday, ClickUp, Computer Use | Connecteurs externes |

## Structure monorepo

```
foundation-os/
  CLAUDE.md          Instructions Claude (52 lignes)
  CONTEXT.md         Source de verite (etat, sessions, decisions)
  README.md          Description projet
  modules/app/       Module App Builder (React)
  modules/finance/   Module Finance (futur)
  modules/health/    Module Sante (futur)
  docs/              Documentation de reference
  scripts/hooks/     Hooks (validate-void-glass)
  supabase/          Migrations DB
  _bmad/             BMAD v6 (12 modules)
  .claude/           4 agents, 4 commands, settings
  .omc/              OMC runtime
  .archive/          Historique
```

## Decisions actives

Toutes les decisions sont dans CONTEXT.md section "Decisions actives".
Les nouvelles decisions y sont ajoutees directement.

## Principes

- CONTEXT.md = source de verite unique
- Monorepo : un dossier par module dans modules/
- Jamais de fichier a la racine (sauf CLAUDE.md, CONTEXT.md, README.md)
- Build verifie avant toute affirmation
- Conventional commits : type(scope): description
