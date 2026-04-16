# Foundation OS

OS de travail personnel IA-driven.

## Modules

- **App Builder** — Dashboard React pour piloter Foundation OS (Vite + TypeScript + Tailwind + Supabase + Vercel)
- **Design System** — Tokens DTCG + 46 composants UI iso base DS (Storybook 9)
- **Finance** — Dashboard de suivi et trading automatise (prevu, Phase 5)
- **Sante** — Agents virtuels conseil + dashboard de suivi (prevu, Phase 5)

## Structure

```
CLAUDE.md              Instructions Claude Code (charge auto chaque session)
CONTEXT.md             Etat actuel du projet (source de verite)
README.md              Description projet
package.json           npm workspace root
modules/app/           Module App Builder (React + Vite + TS + Tailwind)
modules/design-system/ Module Design System (Storybook + tokens)
docs/                  Documentation (core, plans, specs, manifeste)
docs/core/             Specs Core OS (cortex, communication, monitor, tools, planner, worktrees, knowledge, naming-conventions)
wiki/                  Knowledge layer Obsidian (pattern Karpathy LLM Wiki, D-WIKI-01) — [[index-wiki]]
.raw/                  Archive sources brutes pour ingestion wiki
scripts/               Scripts bash + hooks (health-check, sync-check, ref-checker, wiki-commit, wiki-health, worktree-*, module-scaffold)
supabase/              Migrations DB
.claude/               Agents (4), commands (7), settings
.archive/              Historique (ne pas toucher sauf demande)
```

## Setup

Voir [docs/setup-guide.md](docs/setup-guide.md) pour le guide complet Claude Code Desktop.

## Dev

```bash
cd modules/app
npm install
npm run dev      # localhost:5173
npm run build    # production

cd ../design-system
npm run storybook   # localhost:6006
```

## Stack

Vite + React 19 + TypeScript + Tailwind 4 + Supabase + Vercel

## Design

Void Glass : dark-only #030303 (ds-surface-0), Figtree (UI), JetBrains Mono (code), tokens DTCG semantic dans `modules/design-system/`.
