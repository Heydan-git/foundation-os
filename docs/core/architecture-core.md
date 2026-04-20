# Core OS — Architecture

10 modules + 1 orchestrateur qui forment le cerveau de Foundation OS (post-migration Claude Code Desktop 2026-04-15, post-adoption Body D-BODY-01 2026-04-19, post-adoption Product D-PRODUCT-01 2026-04-19, post-adoption Model D-MODEL-01 2026-04-19).

## Couches

```
DESKTOP SHELL  (Claude Code Desktop)    Sidebar sessions · Plan window · Tasks pane · Worktrees natifs
COCKPIT        (/cockpit)               Super-pilote (point d'entree unique)
MODULES        (app, design-system,...) Projets concrets
CORE OS        (cortex, communication,  Intelligence methodologique
                monitor, tools, planner,
                worktrees, knowledge,
                body, product, model)
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
| Body | Proprioception Kevin-Claude (alignement intention ↔ action) | 8 | actif | docs/core/body.md + docs/core/constitution.md + .omc/intent/ + .omc/alignment/ |
| Product | Integration bidirectionnelle FOS ↔ Notion (100%, Asana abandonne) | 9 | actif (P1.5) | docs/core/product.md + .claude/agents/po-agent.md + .claude/commands/po.md + scripts/po-*.sh + .omc/product-config.json |
| Model | Conscience version modele IA + optimisation tokens | 10 | actif (P1) | docs/core/model.md (Opus 4.7 1M context) |

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

## Body (Phase 8 — actif depuis 2026-04-19)

Spec : [docs/core/body.md](body.md)
- Proprioception Kevin-Claude : ancrage intention ↔ action (8e module Core OS).
- 4 couches : Constitution (`docs/core/constitution.md`, ~41 principes P-XX) / Intent capture (`.omc/intent/YYYY-MM-DD-<slug>.md`) / Feedback structure (`.omc/alignment/YYYY-MM-DD-<session>.jsonl`) / Learning loop (subagent `alignment-auditor` + scripts `alignment-analyze.sh` + `constitution-suggest.sh`).
- Integration : brief v12 tuile #15 `🧭 ALIGNMENT`, chain `health-check.sh` INFO, subagent clean-slate invoque `/session-end` Phase 7ter.
- Intent capture OBLIGATOIRE sur `/plan-os` (Tour 1 bis). Opt-in ailleurs.
- Lecture `docs/core/constitution.md` ajoutee dans Layered Loading L2 (`docs/core/communication.md` section 6.5).
- Decision D-BODY-01 (2026-04-19). Plan execution : `.archive/plans-done-260419/2026-04-19-body-module-complet.md`.

## Product (Phase 9 — actif depuis 2026-04-19, pivot P1.5 Notion-only)

Spec : [docs/core/product.md](product.md)
- Integration bidirectionnelle FOS ↔ **Notion only** (9e module Core OS). Asana abandonne P1.5 (payant + MCP limite create_project/section).
- 3 surfaces : agent `po-agent` (Task invocable sonnet, expert Notion 100%) / skill `/po` (init/sync/pull/status) / hooks opt-in `PRODUCT_MCP_SYNC=1`.
- Mapping : 1 plan = 1 row DB Plans, 1 phase = 1 row DB Tasks Type=Phase, 6 elements par phase = 6 rows DB Tasks Type=Element.
- Notion **4 DB** : Decisions / Plans / Sessions / Tasks (miroir CONTEXT.md + docs/plans/ + wiki/meta/sessions-recent.md + TodoWrite state).
- Views kanban natives Notion : board groupe par Status (Todo/In Progress/Done/Blocked) ou Module. Timeline Gantt. Creees P2 via `notion-create-view`.
- Pattern orchestrateurs manifest-driven : `scripts/po-*.sh` generent JSON, Claude execute MCP calls (honnete P-11 : bash ne peut invoquer MCP direct).
- Source of truth : FOS MD gagne sur structure, Notion gagne sur ordre/priorite humaine (kanban drag). Last-write-wins par champ sur conflit.
- Limites honnetes : rate limit Notion 3 req/s → batching fin session. Pas de webhooks → pull session-start. Nouveau root Notion temporairement enfant archive (limite MCP workspace-level creation).
- Config persistante : `.omc/product-config.json` (IDs 4 DB Notion + views).
- Decision D-PRODUCT-01 (2026-04-19, pivot P1.5). Plan execution : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md` (5 phases post-pivot ~18-22h).

## Model (Phase 10 — actif depuis 2026-04-19, D-MODEL-01)

Spec : [docs/core/model.md](model.md)
- Conscience version modele IA active (Claude Opus 4.7 1M context, knowledge cutoff Jan 2026).
- 11 sections : Architecture / Version active / Forces / Faiblesses / Optimisations FOS / Files / Integration / Workflows / Regle d'or / Limites / Maintenance.
- Transverse : informe Cortex (routing) + Communication (brief v12 + layered) + Tools (subagents strategy) + Monitor (health-check) + Planner (cost estime) + Worktrees + Knowledge + Body + Product.
- Optimisations FOS specifiques : layered loading L0-L3, subagent prompt < 500 mots, pre-compaction snapshot, prompt caching 5-min TTL, parallel tool calls.
- Regle d'or : chaque upgrade modele = nouvelle D-MODEL-0N + revision sections forces/faiblesses/optimisations.
- Decision D-MODEL-01 (2026-04-19). Plan execution : `.archive/plans-done-260419/2026-04-19-audit-total-foundation-os.md` Phase P9.

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
