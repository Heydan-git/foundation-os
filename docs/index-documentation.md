# Foundation OS — Index

> Carte de navigation du projet. Mis a jour a chaque session-end.
> Derniere mise a jour : 2026-04-17 (audit v2 Phase 3 — archivages)

## Code (modules/app/src/)

| Dossier | Contenu |
|---------|---------|
| pages/ | 5 fichiers / 6 routes : IndexPage (`/`), Commander (`/commander`), KnowledgePage (`/knowledge`), LoginPage (`/login`), ResetPasswordPage (`/reset-password`) + catchall |
| components/ | UI : Badge, Card, DashboardLayout, LoadingSkeleton + Commander/* (6 panels) |
| components/Commander/ | Panels Sessions, Decisions, Risks, NextSteps, Context, Stats |
| lib/ | supabase.ts, database.types.ts, mutations.ts, AuthContext.tsx, useCommander.ts, knowledge-data.ts, seed-data.ts, constants.ts |
| test/ | 5 fichiers + setup.ts + mocks/supabase.ts (15/15 passants post-archive forms) |

## Code (modules/design-system/src/)

| Dossier | Contenu |
|---------|---------|
| components/ui/ | 46 composants derives `base DS/` (Void Glass fork) + utils.ts + use-mobile.ts |
| components/patterns/ | 7 Dashboard*.tsx (showcase DS) |
| styles/ | tokens.css (primitives + semantic dark-only) + globals.css |
| stories/ | 47 stories DS (dans src/components/ui/*.stories.tsx + Patterns.stories.tsx) |

## Archive (.archive/)

| Dossier | Contenu |
|---------|---------|
| audit-massif/ | 22 docs audit Cycle 3 (2026-04-07) |
| artifacts-jsx/ | 7 JSX archives Phase 2.4 |
| app-data-jsx-260417/ | 7 MD doc JSX archives (mots interdits) |
| app-forms-dead-260417/ | 3 forms dead code + test |
| specs-done-260417/ | 3 specs DONE (V2 design, Cockpit, Tools V2) |
| ds-preview-260417/ | Preview DS duplica base DS |
| ds-reference-base-260417/ | base DS/src.zip reference Figma Make figee |
| ds-tokens-scripts-260417/ | Scripts Style Dictionary DTCG non utilises |
| settings-backups-260415/ | Backup settings pre-wiki |
| plans-done-260415/ | Plans Cycle 3 + migration Desktop DONE |
| plans-done-260416/ | Plans mega-audit + wiki + DS rebuild DONE |
| specs-done-260415/ | Plans cockpit + tools v2 DONE |

## Config (`.claude/`)

| Fichier | Role |
|---------|------|
| settings.json | Permissions + hooks (PreToolUse Write\|Edit\|MultiEdit, SessionStart drift-detector, SessionEnd auto-archive) |
| settings.local.json | Permissions locales (gitignored, ~86 lignes) |
| agents/ | 4 agents : os-architect (opus), dev-agent, doc-agent, review-agent (sonnet) |
| commands/ | 7 commands : cockpit, plan-os, session-start, session-end, new-project, sync, wt |
| worktrees/ | Worktrees actifs (gitignored, gere par /wt) |

## Config (modules)

| Fichier | Role |
|---------|------|
| modules/app/package.json | React 19, Vite 8, Supabase, Tailwind 4, Vitest |
| modules/app/vite.config.ts | Vite config (alias @, React plugin) |
| modules/app/vercel.json | SPA rewrites |
| modules/design-system/package.json | Storybook 9, build no-op (tokens CSS directs) |
| modules/design-system/.storybook/ | Storybook 9 config (port 6006, themes Void Glass) |
| .github/workflows/ci.yml | CI Node 24 (build + TS + tests) |
| .github/workflows/supabase-ping.yml | Cron hebdo Supabase liveness |
| .github/workflows/supernova-sync.yml | Sync DS → Supernova SDK |

## Specs & Docs

| Fichier | Contenu |
|---------|---------|
| CLAUDE.md | Regles operationnelles (imperatifs, gates, conventions, Core OS routing, TodoWrite systematique) |
| CONTEXT.md | Etat actuel projet (modules, sessions, decisions, prochaine action) |
| README.md | Description projet |
| docs/architecture.md | Architecture 3-couches Desktop |
| docs/manifeste.md | Manifeste projet |
| docs/setup-guide.md | Setup Claude Code Desktop |
| docs/index-documentation.md | Carte navigation (ce fichier) |
| docs/decisions-log.md | Decisions stables archivees |
| docs/core/cortex.md | Routing + agents protocol |
| docs/core/communication.md | 5 tiers persistance + briefs v12 source unique |
| docs/core/monitor.md | Health indicators + verdicts |
| docs/core/tools.md | Catalogue 109 outils + routing |
| docs/core/planner.md | Spec /plan-os orchestrateur skills + EnterPlanMode |
| docs/core/worktrees.md | Plomberie + workflow Foundation OS |
| docs/core/architecture-core.md | Architecture Core OS detaillee |
| docs/core/naming-conventions.md | Conventions branches/worktrees/sessions/plans/specs/memoires |
| docs/core/knowledge.md | Spec module Knowledge (wiki + neuroplasticite) |
| docs/specs/README.md | Pointeur vers specs archivees |
| docs/plans/_template-plan.md | Template plan format orchestrateur |

## Wiki (knowledge layer, D-WIKI-01)

- `wiki/hot.md` — Cache flash derniere session
- `wiki/index-wiki.md` — Master index pages wiki
- `wiki/overview.md` — Executive summary
- `wiki/meta/foundation-os-map.md` — Carte neuronale complete du projet
- `wiki/meta/sessions-recent.md` — 5 dernieres sessions (memoire court terme)
- `wiki/meta/lessons-learned.md` — Auto-apprentissage erreurs
- `wiki/meta/thinking.md` — Reflexions autonomes
- `wiki/concepts/Foundation OS.md` — **Definition canonique** (LIRE EN PREMIER)
- `wiki/domains/` — 5 domaines pre-scaffoldes (trading, finance, sante, design, dev)

## Scripts

| Script | Role |
|--------|------|
| scripts/health-check.sh | Monitor health (SAIN/DEGRADED/BROKEN) |
| scripts/sync-check.sh | Audit coherence etendu |
| scripts/ref-checker.sh | Detection refs cassees |
| scripts/drift-detector.sh | Detection drifts metadata |
| scripts/docs-sync-check.sh | Sync docs vs CONTEXT / filesystem |
| scripts/auto-archive-plans.sh | Archive plans DONE (hook SessionEnd) |
| scripts/wiki-commit.sh | Commit manuel wiki/ (Kevin-valide) |
| scripts/wiki-health.sh | Health wiki (hot.md age, index sync) |
| scripts/wiki-metrics.sh | Metriques wiki |
| scripts/wiki-suggest-links.sh | Suggestions wikilinks |
| scripts/worktree-new.sh | Cree worktree convention wt/<desc>-<yymmdd> |
| scripts/worktree-clean.sh | Ferme worktree + delete branche si mergee |
| scripts/worktree-list.sh | Liste worktrees + status ahead/behind main |
| scripts/git-hooks-install.sh | Install .git/hooks depuis scripts/git-hooks/ |
| scripts/session-lock.sh | Lock anti-collision Cowork<->CLI (orphelin, a activer ou archiver) |
| scripts/tool-register.sh | Rebuild tools catalogue (scan + rebuild + add) |
| scripts/module-scaffold.sh | Scaffold modules/<nom>/ + update CONTEXT.md |
| scripts/hooks/validate-void-glass.sh | PreToolUse — bloque couleurs/fonts interdites |
| scripts/hooks/security-reminder.py | PreToolUse — detecte secrets/XSS (9 patterns) |
| scripts/hooks/session-start-wiki.sh | Wrapper SessionStart (drift + hot.md) |
| scripts/hooks/wiki-recall-reminder.sh | Opt-in (orphelin, neuroplasticite manuelle) |
| scripts/hooks/branch-name-check.sh | Warning si branche hors convention nommage |

## Database

`supabase/migrations/` — 3 fichiers :
- `001_create_tables.sql` — 6 tables avec RLS (sessions, decisions, risks, next_steps, context_blocks, docs)
- `002_add_delete_policies.sql` — RLS DELETE policies
- `003_add_updated_at.sql` — Triggers updated_at sur les 6 tables

## Outils externes

| Outil | Path | Status |
|-------|------|--------|
| OMC | plugin oh-my-claudecode | Actif (skills custom Foundation auto-detectes) |
| Superpowers | plugin superpowers | Actif (writing-plans, brainstorming, executing-plans, TDD, etc.) |
| claude-obsidian | plugin v1.4.3 | Actif (10 skills + 4 commands + 2 agents) |
| Notion MCP | mcp__claude_ai_Notion | Actif (installe, usage manuel seulement) |
| Asana MCP | mcp__claude_ai_Asana | Actif (installe, usage manuel seulement) |
| Figma MCP | plugin_figma_figma | Actif |
| chrome-devtools MCP | plugin_chrome-devtools-mcp | Actif (verification visuelle) |
| context7 MCP | npx @upstash/context7-mcp | Actif (doc tech) |
| BMAD v6 | _bmad/ (12 modules) | Dormant (decision Kevin 2026-04-07) |

## Features natives Claude Code Desktop exploitees

| Feature | Module Foundation OS qui l'utilise |
|---------|------------------------------------|
| Sidebar sessions multi | Worktrees (`/wt new` + nouvelle fenetre Desktop) |
| Plan window UI | `/plan-os` orchestrateur (EnterPlanMode) |
| Tasks pane | `/cockpit` + `/session-start` (TodoWrite avec plans actifs) + `/plan-os` (todos par phase) |
| Worktrees natifs | `/wt` command + scripts |
| Session rename manuel | `/plan-os` affiche titre format `🪐 <mini-detail> (DD-MM-YYYY)`, Kevin colle sidebar |

## Deploy

- Production : https://foundation-os.vercel.app/
- Root dir Vercel : `modules/app`
- Auto-deploy sur push main
- Storybook (local) : `cd modules/design-system && npm run storybook` → http://localhost:6006

## References croisees

- Audit v2 : `docs/audits/2026-04-16-mega-audit-v2/rapport-master-v2.md`
- Plan master : `docs/plans/2026-04-16-mega-audit-v2-master.md`
- Memoires permanentes : `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` (28 entrees)
- Health-check actuel : `bash scripts/health-check.sh`
