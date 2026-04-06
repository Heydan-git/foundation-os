# Foundation OS — Index

> Carte de navigation du projet. Mis a jour a chaque session-end.
> Derniere mise a jour : 2026-04-05

## Code (modules/app/src/)

| Dossier | Contenu |
|---------|---------|
| pages/ | 5 routes : IndexPage, Dashboard, Commander, LoginPage, Phase1Demo |
| components/ | UI : Layout, Card, Badge, StatPill, TabBar, SupabaseCRUDTest |
| components/Commander/ | 7 panels : Stats, Sessions, Decisions, Risks, Context, NextSteps, Docs |
| components/forms/ | AddSessionForm, EditDecisionModal, NextStepActions |
| lib/ | supabase.ts, database.types.ts, mutations.ts, AuthContext.tsx, useCommander.ts |
| artifacts/ | 7 JSX interactifs (commander, graph, index, knowledge, scale-orchestrator, sync, toolbox) |
| test/ | app.test.tsx, supabase.test.ts, setup.ts |

## Data (modules/app/data/)

7 fichiers MD — pairs des artifacts : commander, graph, index, knowledge, scale-orchestrator, sync, toolbox

## Config

| Fichier | Role |
|---------|------|
| .claude/settings.json | Permissions + hooks (Void Glass, security) |
| .claude/settings.local.json | Permissions locales (gitignored) |
| .claude/agents/ | 4 agents (os-architect, dev-agent, doc-agent, review-agent) |
| .claude/commands/ | 4 commands (session-start, session-end, new-project, sync) |
| modules/app/package.json | Dependencies (React 18, Vite 5, Supabase, Tailwind) |
| modules/app/vite.config.ts | Vite config (alias @, React plugin) |
| modules/app/tailwind.config.js | Fonts Figtree + JetBrains Mono |
| modules/app/vercel.json | SPA rewrites |
| .github/workflows/ci.yml | CI (Node 24, build, TS, tests) |
| .github/workflows/supabase-ping.yml | Cron hebdo Supabase liveness |

## Specs & Docs

| Fichier | Contenu |
|---------|---------|
| CLAUDE.md | Regles operationnelles (imperatifs, gates, Core OS routing) |
| CONTEXT.md | Etat actuel du projet, modules, decisions, prochaine action |
| README.md | Description projet |
| docs/core/cortex.md | Routing + agents protocol |
| docs/core/memory.md | 4 tiers de memoire |
| docs/core/monitor.md | Health indicators + verdicts |
| docs/core/tools.md | Automation + scripts |
| docs/core/architecture-core.md | Architecture Core OS |
| docs/architecture.md | Architecture globale |
| docs/design-system.md | Void Glass tokens (#06070C, Figtree, JetBrains Mono) |
| docs/manifeste.md | Manifeste projet |
| docs/setup-guide.md | Guide setup dev |
| docs/directive-v1.md | Directive Claude Code originale (reference) |
| docs/specs/2026-04-05-foundation-os-v2-design.md | Design spec v2 (5 phases iteratives) |
| docs/plans/2026-04-05-phase1-fondations.md | Plan Phase 1 (8 tasks) |

## Scripts

| Script | Role |
|--------|------|
| scripts/health-check.sh | Monitor health (SAIN/DEGRADED/BROKEN) |
| scripts/hooks/validate-void-glass.sh | PreToolUse — bloque couleurs/fonts interdites |
| scripts/hooks/security-reminder.py | PreToolUse — detecte XSS/injection (9 patterns) |

## Database

`supabase/migrations/001_create_tables.sql` — 6 tables avec RLS :
sessions, decisions, risks, next_steps, context_blocks, docs

## Outils externes

| Outil | Path | Status |
|-------|------|--------|
| OMC | plugin oh-my-claudecode | Actif |
| Superpowers | plugin superpowers v5.0.7 | Actif |
| gstack | ~/.claude/skills/gstack/ | Actif (qa, cso, careful, freeze, guard, ship) |
| BMAD v6 | _bmad/ (12 modules) | A auditer (Phase 3) |
| Coderabbit | plugin coderabbit | A evaluer (Phase 3) |

## Deploy

- Production : https://foundation-os.vercel.app/
- Root dir Vercel : `modules/app`
- Auto-deploy sur push main
