# Foundation OS — Architecture

## Vue d'ensemble

OS de travail personnel IA-driven. **3 couches** depuis la migration Claude Code Desktop (2026-04-15) :

```
┌─────────────────────────────────────────────────────────┐
│  COUCHE 1 — CLAUDE CODE DESKTOP (shell natif)           │
│  Sidebar sessions multi · Plan window UI · Tasks pane   │
│  Worktrees natifs · Sessions 🪐 (rename manuel)         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  COUCHE 2 — FOUNDATION OS CORE (cerveau methodologique) │
│  Cortex (routing) · Communication (briefs v11 + memory) │
│  Monitor (health) · Tools (catalogue) · Planner (orch)  │
│  Worktrees workflow · Cockpit orchestrator              │
│  4 agents · 7 commands (cockpit, plan-os, session-*,    │
│    new-project, sync, wt) · 5 hooks · auto-memory       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  COUCHE 3 — MODULES (projets concrets)                  │
│  App Builder (modules/app, React+Vite+TS+Tailwind)      │
│  Design System (modules/design-system, Storybook 9)     │
│  Finance (prevu) · Sante (prevu) · Trading (prevu)      │
└─────────────────────────────────────────────────────────┘
```

## Couche 1 — Claude Code Desktop (shell)

Features natives utilisees activement par Foundation OS :

| Feature | Integration Foundation OS |
|---|---|
| **Sidebar sessions multi** | Une fenetre par worktree |
| **Plan window** | `/plan-os` → `EnterPlanMode` → plan affiche dans la pane |
| **Tasks pane** | `TodoWrite` peuple en debut session (plans actifs) + en execution (phases) |
| **Worktrees natifs** | `/wt` command + scripts `worktree-{new,clean,list}.sh` |
| **Rename session (manuel)** | Titre plan `🪐 <mini-detail> (DD-MM-YYYY)` affiche par `/plan-os` en fin de flow, a copier-coller dans sidebar |

Memoire auto : `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/` (29 fichiers `feedback_*` / `project_*` + index `MEMORY.md`). Charge automatiquement a chaque session.

## Couche 2 — Foundation OS Core

### Modules Core OS

| Module | Spec | Role |
|---|---|---|
| **Cortex** | `docs/core/cortex.md` | Routing demande Kevin → agent ou direct |
| **Communication** | `docs/core/communication.md` | 4 tiers persistance + briefs v11 (source unique) |
| **Monitor** | `docs/core/monitor.md` | Health indicators (SAIN/DEGRADED/BROKEN), seuils |
| **Tools** | `docs/core/tools.md` | Catalogue 98 outils, routing |
| **Planner** | `docs/core/planner.md` | Orchestrateur skills plan + EnterPlanMode |
| **Worktrees** | `docs/core/worktrees.md` | Plomberie + workflow `/wt` |
| **Cockpit** | `docs/specs/2026-04-10-cockpit-design.md` | Point d'entree unique super-pilote |

### Agents (`.claude/agents/`)

| Agent | Modele | Triggers |
|---|---|---|
| os-architect | opus | architecture, ADR, stack, schema |
| dev-agent | sonnet | code, composant, page, React, CSS, Supabase |
| doc-agent | sonnet | documente, note, trace, CONTEXT.md |
| review-agent | sonnet | verifie, audit, regression, deployer |

### Commands (`.claude/commands/`)

| Command | Role |
|---|---|
| `/cockpit` | Super-pilote scan + brief v11 + routing + cloture |
| `/plan-os` | Orchestrateur skills plan + EnterPlanMode natif |
| `/session-start` | Brief v11 debut session (parallele scan) |
| `/session-end` | Cloture session + check tasks pane + commit |
| `/sync` | Audit coherence (ref-checker + sync-check) |
| `/new-project` | Scaffold nouveau module dans `modules/` |
| `/wt` | Gestion worktrees (new/list/clean) |

### Hooks (`scripts/hooks/`)

- `validate-void-glass.sh` (PreToolUse) — bloque couleurs/fonts interdites
- `security-reminder.py` (PreToolUse) — detecte XSS/injection (9 patterns)
- `branch-name-check.sh` (optionnel) — warning si branche hors convention
- Git hooks : `pre-commit` + `commit-msg` (conventional commits)

### Scripts utilitaires (`scripts/`)

- `health-check.sh` — verdict sante (build, TS, tests, refs, bundle)
- `sync-check.sh` — audit etendu (modules vs CONTEXT, refs, agents/commands, specs)
- `ref-checker.sh` — detection refs cassees (markdown links + backtick paths)
- `worktree-new.sh` / `worktree-clean.sh` / `worktree-list.sh` — gestion worktrees Foundation OS

## Couche 3 — Modules

Code applicatif autonome, **zero dependance CLI Claude Code** (tous les `npm run *` tournent identiquement).

| Module | Status | Path | Detail |
|---|---|---|---|
| App Builder | iso base DS | `modules/app/` | React 19, Vite 8, TS, Tailwind 4. 7 routes. 19/19 tests. |
| Design System | iso base DS | `modules/design-system/` | Storybook 9, 62 stories (53 DS + 9 app). Tokens DTCG. |
| Finance | prevu | — | Pas encore cree |
| Sante | prevu | — | Pas encore cree |
| Trading | prevu | — | Pas encore cree |

## Stack technique

| Couche | Composant | Detail |
|---|---|---|
| Frontend | Vite + React 19 + TypeScript + Tailwind 4 | App Builder + Design System |
| DB | Supabase (`@supabase/supabase-js`) | 6 tables + RLS + triggers updated_at |
| Deploy | Vercel auto-deploy push main | Root dir : modules/app |
| Design | Void Glass (dark-only #030303 + Figtree + JetBrains Mono) | tokens DTCG semantic |
| AI shell | Claude Code Desktop app (Mac/Windows) | sessions multi, plan window, tasks pane |
| AI methodo | Foundation OS Core (4 agents + 7 commands + auto-memory) | spec dans `docs/core/` |
| MCP | Notion, Asana, Figma, chrome-devtools, context7, neon-browser | connecteurs externes |

## Structure monorepo

```
foundation-os/
  CLAUDE.md          Instructions (charge auto chaque session)
  CONTEXT.md         Source de verite (etat, sessions, decisions)
  README.md          Description projet
  package.json       npm workspace root
  modules/app/       App Builder (React)
  modules/design-system/  Design System (Storybook)
  docs/              Documentation
  docs/core/         Specs Core OS (cortex, communication, monitor, tools, planner, worktrees, naming-conventions)
  docs/plans/        Plans versionnes (YYYY-MM-DD-<slug>.md)
  docs/specs/        Specs detaillees (design + plans)
  scripts/           Scripts bash + hooks
  scripts/hooks/     Hooks PreToolUse + git hooks
  supabase/          Migrations DB (source de verite schema)
  _bmad/             BMAD v6 (12 modules dormant)
  .claude/agents/    4 agents
  .claude/commands/  7 commands
  .claude/settings.json   Permissions + hooks (commit)
  .claude/settings.local.json  Permissions locales (gitignored)
  .claude/worktrees/ Worktrees actifs (gitignored)
  .omc/              OMC runtime state
  .archive/          Historique
```

## Decisions actives

Toutes dans CONTEXT.md section "Decisions". Decisions stables (>30j ou supersedees) archivees dans `docs/decisions-log.md`.

Decisions structurantes recentes :
- **D-DESKTOP-01** (2026-04-15) — Foundation OS calibre Claude Code Desktop natif (plan mode, tasks pane, worktrees actifs, sessions 🪐 rename manuel)
- **D-NAMING-01** (2026-04-15) — Conventions branches/worktrees/sessions/plans unifiees
- **D-PLAN-02** (2026-04-15) — `/plan-os` orchestrateur EnterPlanMode (supersede D-PLAN-01)

## Principes

- **CONTEXT.md = source de verite unique** projet
- **Auto-memory `feedback_*.md` = regles permanentes** (chargees auto chaque session)
- **Monorepo** : un dossier par module dans `modules/`
- **Jamais de fichier a la racine** (sauf CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json)
- **Conventions nommage strictes** (branches, worktrees, sessions, plans, specs, commits)
- **Sessions courtes** : jamais de monolithe, decoupage en phases
- **Build verifie** avant toute affirmation "fait"
- **Conventional commits** : `<type>(<scope>): description`
- **Verification visuelle** obligatoire pour tache UI (screenshot avant claim "fait")

## References

- Setup : `docs/setup-guide.md`
- Manifeste : `docs/manifeste.md`
- Index navigation : `docs/index.md`
- Conventions : `docs/core/naming-conventions.md`
- Cockpit spec : `docs/specs/2026-04-10-cockpit-design.md`
- Plan migration Desktop : `.archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md`
