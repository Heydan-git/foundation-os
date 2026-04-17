# Core OS — Architecture

7 modules + 1 orchestrateur qui forment le cerveau de Foundation OS (post-migration Claude Code Desktop 2026-04-15).

## Couches

```
DESKTOP SHELL  (Claude Code Desktop)    Sidebar sessions · Plan window · Tasks pane · Worktrees natifs
COCKPIT        (/cockpit)               Super-pilote (point d'entree unique)
MODULES        (app, design-system,...) Projets concrets
CORE OS        (cortex, communication,  Intelligence methodologique
                monitor, tools, planner,
                worktrees)
TOOLKIT        (OMC, BMAD, MCP)         Outils externes
```

Cockpit est un wrapper au-dessus de Cortex. Il automatise scan → brief → routing → execution → cloture. Les commands /plan-os, /session-start, /session-end, /sync, /new-project, /wt restent utilisables independamment. Spec : `.archive/specs-done-260417/2026-04-10-cockpit-design.md`.

## Modules

| Module | Role | Phase | Status | Runtime |
|--------|------|-------|--------|---------|
| Cortex | Routing, contexte, orchestration | 1 | actif | CLAUDE.md, .claude/agents/, .claude/commands/ |
| Communication | Journalisation, indexation, lecture, briefing v12 | 2 | actif | CONTEXT.md, docs/, auto-memory |
| Monitor | Health indicators, severite, seuils | 3 | actif | Integre dans /sync et review-agent |
| Tools | Validators, scripts, CI/CD | 4 | actif | scripts/, .github/, hooks |
| Planner | Orchestrateur skills plan + EnterPlanMode natif | 5 | actif | /plan-os + skills tiers reutilises |
| Worktrees | Plomberie + workflow `/wt new|list|clean` | 6 | actif | scripts/worktree-*.sh + .claude/worktrees/ |
| Knowledge | Wiki layer persistant (claude-obsidian) | 7 | actif | wiki/ + .raw/ + 10 skills + hooks integres |

Conventions de nommage transversales : `docs/core/naming-conventions.md` (branches, worktrees, sessions, plans, specs, memoires).

## Cortex (Phase 1)

Le cerveau actif. Trois responsabilites :

1. **Routing** — tache → agent (arbre de decision dans CLAUDE.md)
2. **Contexte** — CONTEXT.md lifecycle (lecture, mise a jour, coherence)
3. **Orchestration** — commands qui coordonnent les workflows

Spec complete : [docs/core/cortex.md](cortex.md)

## Communication (Phase 2 — actif)

Spec : [docs/core/communication.md](communication.md)
- 5 tiers (session/contexte/auto-memory/reference/wiki)
- Decisions avec dates et lifecycle
- Protocole "quoi va ou" — une info = un seul tier

## Monitor (Phase 3 — actif)

Spec : [docs/core/monitor.md](monitor.md)
- Health indicators par severite (critical/warning/info)
- Verdicts : SAIN / DEGRADED / BROKEN
- Integre dans /sync et review-agent

## Tools (Phase 4 — actif)

Spec : [docs/core/tools.md](tools.md)
- Validators existants (Void Glass, conventional commits, security-reminder)
- Scripts actifs : health-check, sync-check, ref-checker, module-scaffold, worktree-*
- CI/CD : ci.yml (build/tsc/vitest), supabase-ping (cron lundi), supernova-sync (push DS)
- Conventions : scripts/, idempotent, exit codes standards

## Planner (Phase 5 — actif depuis 2026-04-15)

Spec : [docs/core/planner.md](planner.md)
- Orchestrateur de generation de plans via `/plan-os` command.
- Route vers le meilleur skill selon contexte (`superpowers:brainstorming`, `writing-plans`, `oh-my-claudecode:ralplan`, etc.).
- Sortie finale toujours `EnterPlanMode` natif Claude Code Desktop → plan visible dans plan window UI.
- Dual-path : `~/.claude/plans/<slug>.md` (natif) + `docs/plans/YYYY-MM-DD-<slug>.md` (versionne projet).
- Titre format `🪐 <mini-detail> (DD-MM-YYYY)` → nom affiche par `/plan-os` en fin de flow, rename manuel Desktop.

## Worktrees (Phase 6 — actif depuis 2026-04-15)

Spec : [docs/core/worktrees.md](worktrees.md)
- Plomberie native Claude Code Desktop + workflow Foundation OS.
- Command `/wt new|list|clean` (wrapper scripts).
- Convention nommage `wt/<desc>-<yymmdd>` (jamais de noms aleatoires `claude/agitated-wilson`).
- Detection auto par `/cockpit` Phase SCAN (affiche dans brief v12 cadre Sante).
- `/session-end` rappelle workflow merge/clean.

## Knowledge (Phase 7 — actif depuis 2026-04-15)

Spec : [docs/core/knowledge.md](knowledge.md)
- Wiki layer persistant via plugin `claude-obsidian` v1.4.3 (pattern [[LLM Wiki Pattern|Karpathy LLM Wiki]]).
- 5 domaines pre-scaffoldes (trading, finance, sante, design, dev) + 7 cross-domain.
- **Neuroplasticite** (section 8 knowledge.md) : 4 reflexes auto (recall wiki, consolidation, [[lessons-learned|lessons learned]], self-check), 3 pages meta ([[thinking]], [[sessions-recent]], [[lessons-learned]]), routines cloud autonomes, loop.md.
- Couplage modules/ <-> wiki/domains/ via frontmatter `implementation:`.
- Integration brief v12 (cadres HOT + WIKI).
- Auto-commit hook DESACTIVE (respect regle Kevin-valide).
- 10 skills + 4 commands + 2 agents + 5 templates.

## Conventions transversales

Spec : [docs/core/naming-conventions.md](naming-conventions.md)
- Branches, worktrees, sessions Desktop, plans, specs, memoires.
- Source unique. CLAUDE.md pointe ici.
- Hook `branch-name-check.sh` warning si branche hors format.

## Principes Core OS

- Chaque module a une spec dans docs/core/
- Pas de code sans spec validee
- Un module n'impacte pas les autres sans coordination
- CONTEXT.md reste la source de verite pour l'etat
