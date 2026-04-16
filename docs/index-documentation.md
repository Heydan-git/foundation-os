# Foundation OS — Index

> Carte de navigation du projet. Mis a jour a chaque session-end.
> Derniere mise a jour : 2026-04-15 (migration Claude Code Desktop)

## Code (modules/app/src/)

| Dossier | Contenu |
|---------|---------|
| pages/ | 7 fichiers / 8 routes : IndexPage (`/`), Commander (`/commander`), KnowledgePage (`/knowledge`), Dashboard (`/dashboard`), Phase1Demo (`/phase1-demo`), LoginPage (`/login`), ResetPasswordPage (`/reset-password`) + route `/crud-test` |
| components/ | UI : Layout, Navbar, Card, Badge, StatPill, TabBar, SupabaseCRUDTest, index.ts |
| components/Commander/ | 7 panels : Stats, Sessions, Decisions, Risks, Context, NextSteps, Docs |
| components/forms/ | AddSessionForm, EditDecisionModal, NextStepActions |
| lib/ | supabase.ts, database.types.ts, mutations.ts, AuthContext.tsx, useCommander.ts |
| test/ | 6 fichiers + setup.ts + mocks/supabase.ts (19/19 passants) |

## Code (modules/design-system/src/)

| Dossier | Contenu |
|---------|---------|
| components/ui/ | 46 composants iso base DS Figma Make + utils.ts + use-mobile.ts |
| components/patterns/ | 7 Dashboard*.tsx (templates Figma Make) |
| stories/ | 53 stories DS (1 par composant ui + Patterns) |
| styles/ | tokens.css (primitives + semantic dark-only) + globals.css |

## Data (modules/app/data/)

7 fichiers MD : commander, graph, index, knowledge, scale-orchestrator, sync, toolbox

## Archive (.archive/)

| Dossier | Contenu |
|---------|---------|
| audit-massif/ | 22 docs audit Cycle 3 (2026-04-07) |
| artifacts-jsx/ | 7 JSX archives Phase 2.4 |
| ds-rebuild-2026-04-14/ | Backup ancien DS pre-rebuild base DS |
| fos-legacy/ | Code legacy pre-Foundation v2 |
| hooks-legacy/ | Hooks Claude obsoletes |
| intelligence/ | Notes brainstorm pre-spec |
| settings-local-before-migration-260415.json | Backup .claude/settings.local.json pre-purge migration Desktop |

## Config (`.claude/`)

| Fichier | Role |
|---------|------|
| settings.json | Permissions + hooks PreToolUse (commit) |
| settings.local.json | Permissions locales (gitignored, 71 lignes apres purge migration) |
| agents/ | 4 agents : os-architect (opus), dev-agent, doc-agent, review-agent (sonnet) |
| commands/ | 7 commands : cockpit, plan-os, session-start, session-end, new-project, sync, wt |
| worktrees/ | Worktrees actifs (gitignored, gere par /wt) |

## Config (modules)

| Fichier | Role |
|---------|------|
| modules/app/package.json | React 19, Vite 8, Supabase, Tailwind 4, Vitest |
| modules/app/vite.config.ts | Vite config (alias @, React plugin) |
| modules/app/tailwind.config.js | Fonts Figtree + JetBrains Mono |
| modules/app/vercel.json | SPA rewrites |
| modules/design-system/package.json | Storybook 9, Style Dictionary 4 |
| modules/design-system/.storybook/ | Storybook config (port 6006, themes Void Glass) |
| .github/workflows/ci.yml | CI Node 24 (build + TS + tests) |
| .github/workflows/supabase-ping.yml | Cron hebdo Supabase liveness |
| .github/workflows/supernova-sync.yml | Sync DS → Supernova SDK |

## Specs & Docs

| Fichier | Contenu |
|---------|---------|
| CLAUDE.md | Regles operationnelles (imperatifs, gates, conventions, Core OS routing, TodoWrite systematique) |
| CONTEXT.md | Etat actuel projet (modules, sessions, decisions, prochaine action) |
| README.md | Description projet |
| docs/architecture.md | Architecture 3-couches Desktop (cette migration) |
| docs/manifeste.md | Manifeste projet |
| docs/setup-guide.md | Setup Claude Code Desktop |
| docs/index.md | Carte navigation (ce fichier) |
| docs/decisions-log.md | Decisions stables archivees |
| docs/core/cortex.md | Routing + agents protocol |
| docs/core/communication.md | 4 tiers persistance + briefs v11 source unique |
| docs/core/monitor.md | Health indicators + verdicts |
| docs/core/tools.md | Catalogue 98 outils + routing |
| docs/core/planner.md | Spec /plan-os orchestrateur skills + EnterPlanMode |
| docs/core/worktrees.md | Plomberie + workflow Foundation OS |
| docs/core/architecture-core.md | Architecture Core OS detaillee |
| docs/core/naming-conventions.md | Conventions branches/worktrees/sessions/plans/specs/memoires |
| docs/specs/2026-04-05-foundation-os-v2-design.md | Design spec v2 (5 phases iteratives) |
| docs/specs/2026-04-10-cockpit-design.md | Spec design Cockpit |
| docs/specs/2026-04-10-tools-module-v2-design.md | Spec Tools v2 |
| docs/plans/2026-04-15-migration-foundation-desktop.md | Plan actif migration Claude Code Desktop |
| docs/plans/_template-plan.md | Template plan format orchestrateur |

## Scripts

| Script | Role |
|--------|------|
| scripts/health-check.sh | Monitor health (SAIN/DEGRADED/BROKEN) |
| scripts/sync-check.sh | Audit coherence etendu |
| scripts/ref-checker.sh | Detection refs cassees |
| scripts/worktree-new.sh | Cree worktree convention wt/<desc>-<yymmdd> |
| scripts/worktree-clean.sh | Ferme worktree + delete branche si mergee |
| scripts/worktree-list.sh | Liste worktrees + status ahead/behind main |
| scripts/hooks/validate-void-glass.sh | PreToolUse — bloque couleurs/fonts interdites |
| scripts/hooks/security-reminder.py | PreToolUse — detecte XSS/injection (9 patterns) |
| scripts/hooks/branch-name-check.sh | Warning si branche hors convention nommage |

## Database

`supabase/migrations/` — 3 fichiers :
- `001_create_tables.sql` — 6 tables avec RLS (sessions, decisions, risks, next_steps, context_blocks, docs)
- `002_add_delete_policies.sql` — RLS policies
- `003_add_updated_at.sql` — Trigger updated_at

## Outils externes

| Outil | Path | Status |
|-------|------|--------|
| OMC | plugin oh-my-claudecode | Actif (skills custom Foundation auto-detectes) |
| Superpowers | plugin superpowers | Actif (writing-plans, brainstorming, executing-plans, TDD, etc.) |
| Notion MCP | mcp__claude_ai_Notion | Actif (search, fetch, create-pages, update-page) |
| Asana MCP | mcp__claude_ai_Asana | Actif (workspace 1213280972575193) |
| Figma MCP | plugin_figma_figma | Actif |
| chrome-devtools MCP | plugin_chrome-devtools-mcp | Actif (verification visuelle) |
| context7 MCP | npx @upstash/context7-mcp | Actif (doc tech) |
| neon-browser MCP | mcp__neon-browser | Actif |
| BMAD v6 | _bmad/ (12 modules) | Dormant (decision Kevin 2026-04-07) |
| review-agent | .claude/agents/review-agent.md | Outil principal de code review |

## Features natives Claude Code Desktop exploitees

| Feature | Module Foundation OS qui l'utilise |
|---|---|
| Sidebar sessions multi | Worktrees (`/wt new` + nouvelle fenetre Desktop) |
| Plan window UI | `/plan-os` orchestrateur (EnterPlanMode) |
| Tasks pane | `/cockpit` + `/session-start` (TodoWrite avec plans actifs) + `/plan-os` (todos par phase) |
| Worktrees natifs | `/wt` command + scripts |
| Auto-rename sessions | `/plan-os` titre format `🪐 <mini-detail> (DD-MM-YYYY)` |

## Deploy

- Production : https://foundation-os.vercel.app/
- Root dir Vercel : `modules/app`
- Auto-deploy sur push main
- Storybook (local) : `cd modules/design-system && npm run storybook` → http://localhost:6006

## References croisees

- Migration Desktop en cours : `.archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md`
- Memoires permanentes : `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` (29 entrees)
- Health-check actuel : `bash scripts/health-check.sh`
