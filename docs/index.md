# Foundation OS — Index

> Carte de navigation du projet. Mis a jour a chaque session-end.
> Derniere mise a jour : 2026-04-10

## Code (modules/app/src/)

| Dossier | Contenu |
|---------|---------|
| pages/ | 7 fichiers / 8 routes : IndexPage (`/`), Commander (`/commander`), KnowledgePage (`/knowledge`), Dashboard (`/dashboard`), Phase1Demo (`/phase1-demo`), LoginPage (`/login`), ResetPasswordPage (`/reset-password`) + route `/crud-test` (SupabaseCRUDTest component) |
| components/ | UI : Layout, Navbar (sticky top, NavLink active), Card, Badge, StatPill, TabBar, SupabaseCRUDTest, index.ts |
| components/Commander/ | 7 panels : Stats, Sessions, Decisions, Risks, Context, NextSteps, Docs |
| components/forms/ | AddSessionForm, EditDecisionModal, NextStepActions |
| lib/ | supabase.ts, database.types.ts, mutations.ts, AuthContext.tsx, useCommander.ts |
| test/ | 6 fichiers : app, supabase, mutations, useCommander, AuthContext, forms (+ setup.ts + mocks/supabase.ts) |

## Data (modules/app/data/)

7 fichiers MD : commander, graph, index, knowledge, scale-orchestrator, sync, toolbox

## Archive (.archive/)

| Dossier | Contenu |
|---------|---------|
| artifacts-jsx/ | 7 JSX archives Phase 2.4 (commander, graph, index, knowledge, scale-orchestrator, sync, toolbox) |
| fos-legacy/ | Code legacy pre-Foundation v2 |
| hooks-legacy/ | Hooks Claude obsoletes |
| intelligence/ | Notes brainstorm pre-spec |
| ARCHIVE-LOG.md | Journal des archivages |

## Config

| Fichier | Role |
|---------|------|
| .claude/settings.json | Permissions + hooks (Void Glass, security) |
| .claude/settings.local.json | Permissions locales (gitignored) |
| .claude/agents/ | 4 agents (os-architect, dev-agent, doc-agent, review-agent) |
| .claude/commands/ | 5 commands (session-start, session-end, new-project, sync, cockpit) |
| modules/app/package.json | Dependencies (React 19, Vite 8, Supabase, Tailwind 4) |
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
| docs/core/cortex.md | Routing + agents protocol + cockpit |
| docs/core/communication.md | Journalisation, indexation, lecture, briefing (ex-Memory) |
| docs/core/monitor.md | Health indicators + verdicts |
| docs/core/tools.md | Automation + scripts |
| docs/core/architecture-core.md | Architecture Core OS |
| docs/architecture.md | Architecture globale |
| docs/design-system.md | Void Glass tokens (#06070C, Figtree, JetBrains Mono) |
| docs/manifeste.md | Manifeste projet |
| docs/setup-guide.md | Guide setup dev |
| docs/directive-v1.md | Directive Claude Code originale (reference) |
| docs/specs/2026-04-05-foundation-os-v2-design.md | Design spec v2 (5 phases iteratives) |
| docs/plans/2026-04-05-phase1-fondations.md | Plan Phase 1 (DONE 2026-04-05) |
| docs/plans/2026-04-07-phase2-app-hardening.md | Plan Phase 2 (DONE 2026-04-07) |
| docs/plans/2026-04-07-phase3-os-intelligence.md | Plan Phase 3 (DONE 2026-04-07) |
| docs/plans/2026-04-07-phase4-monitoring.md | Plan Phase 4 (DONE 2026-04-07) |
| docs/tools-audit.md | Audit BMAD/OMC/Coderabbit — Phase 3.3 |

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
| OMC | plugin oh-my-claudecode | Actif (skills custom Foundation : session-start, session-end, new-project, sync) |
| Superpowers | plugin superpowers | Actif (writing-plans, executing-plans, brainstorming, TDD) |
| gstack | ~/.claude/skills/gstack/ | Actif (qa, cso, careful, freeze, guard, ship) |
| BMAD v6 | _bmad/ (12 modules) | Garde dormant (decision Kevin 2026-04-07) — voir tools-audit.md |
| Coderabbit | ~/.claude/plugins/cache/.../coderabbit | Installe mais **non invoque** (decision 2026-04-07) |
| code-review | ~/.claude/plugins/cache/.../code-review | Installe mais **non invoque** (decision 2026-04-07) |
| feature-dev | ~/.claude/plugins/cache/.../feature-dev | Installe (feature-dev workflow) |
| **review-agent** | .claude/agents/review-agent.md | **Outil principal de code review** (decision 2026-04-07) |

## Deploy

- Production : https://foundation-os.vercel.app/
- Root dir Vercel : `modules/app`
- Auto-deploy sur push main
