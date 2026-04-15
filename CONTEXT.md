# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ iso base DS | `modules/app/` | Tokens `ds-*` partout (0 legacy). Build ~300ms, 19/19 tests. Verif visuelle chrome-devtools : IndexPage + Commander + Knowledge iso base DS. |
| Design System | ✅ iso base DS | `modules/design-system/` | Rebuild DONE 2026-04-15. 46 ui iso + 7 patterns Dashboard + 53 stories SB (62 total avec app). Build-storybook 5.87s. |
| Core OS | 6/6 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner, Worktrees. + Cockpit orchestrateur. |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Finance | prevu | — | Phase 5 |
| Sante | prevu | — | Phase 5 |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-15 | **[DONE] Level Up Foundation OS — audit + 7 phases** |
|            | Audit exhaustif OS (69 fichiers lus), 21 findings P0/P1/P2, 15 propositions priorisees. |
|            | 7 phases livrees : hygiene settings.local (159→81L) + ref-checker extended (16→0 refs cassees) + manifeste/README syncrones + auto-archive plans retrofit (plan migration archive) + branch-name-check dans pre-commit + 2 branches legacy cleaned (tags archive/* preserves) + memory/_deprecated/ (2 memoires SUPERSEDED/DONE) + CONTEXT compression + CLAUDE compression + tools catalogue regen + drift-detector.sh + docs-sync-check.sh + hook SessionStart + cadre SYNC brief v11 + chain drift health-check. |
|            | Plan : `.archive/plans-done-260415/2026-04-15-level-up-foundation-os.md` (7 phases, 7 commits). |
|            | Decisions : D-LEVELUP-01 organicite detection-only, D-LEVELUP-02 plans ultra detailles, D-LEVELUP-03 claude/jolly-wescoff merge-then-delete. |
|            | Memoire creee : `feedback_plans_ultra_detailles.md`. |
| 2026-04-15 | **[DONE] Migration Foundation OS → Claude Code Desktop natif (9 phases)** |
|            | Plan archive `.archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md`. 9 commits. |
|            | Features natives Desktop exploitees : plan window UI (/plan-os orchestrateur), tasks pane (TodoWrite systematique), worktrees actifs (/wt), sessions auto-nommees 🪐, conventions nommage unifiees. |
|            | 8 memoires permanentes creees + MEMORY.md index update. |
|            | Decisions : D-DESKTOP-01, D-NAMING-01, D-PLAN-02 (supersede D-PLAN-01). |
| 2026-04-15 | **[DONE_COTE_CLAUDE / EN_COURS_KEVIN] DS iso visuel + typography critique** |
|            | 3 causes racines (font tokens @theme, tailwind-merge dedup, @layer base regles bruyantes) + rewrite 46 composants ui iso template via 8 sub-agents paralleles. Test manuel Kevin en attente sur 46 ui Storybook. |
| 2026-04-14 | **[DONE] DS Rebuild iso base DS — phases 0-5 + 3b complet** (archive) |
|            | Plan : `.archive/plans-done-260415/2026-04-14-ds-rebuild-from-base.md`. 8 commits. 62 stories total. |
| 2026-04-14 | **[DONE] Supernova 46 Components SDK + sync auto** (`2c9403d`) — 46 composants visibles UI Supernova. GitHub Action sync push main DS. |

> Sessions plus anciennes (S0-S14 Cycle 3 + DS finition + Planner MVP + App UI refactor + Storybook S1/S2 + Audit Core OS) : voir `git log` + `.archive/audit-massif/23-rapport-final.md` + `.archive/plans-done-260415/`.

## Cap

**Direction** : Foundation OS level-up DONE (audit + 7 phases). L'OS se maintient maintenant automatiquement : drift detection au SessionStart, auto-archive plans fonctionnel, refs cassees 0, mémoires obsoletes dans `_deprecated/`. Attente validation Kevin sur le nouveau workflow Desktop + test DS composants.

**Prochaine action** :
  - **Merge main + cleanup worktree** : `cd /Users/kevinnoel/foundation-os` puis `git merge --no-ff claude/jolly-wescoff`, push, `git worktree remove`, delete branche + tag archive.
  - **Test `/cockpit` depuis main** : brief v11 avec cadre SYNC clean (0 drift).
  - **Test `/plan-os "test trivial"`** : verifier auto-rename 🪐 + frontmatter genere + auto-archive fin.
  - **Test manuel DS composants** (en parallele) : 46 ui Storybook, bugs residuels.
  - **Ensuite** : Phase 5 Expansion (Finance / Sante / Trading).

## Idees & Parking

- 💡 **Agent SDK Anthropic** : explorer formalisation Cortex en natif. Pre-requis : SDK mature + evaluation.
- 💡 **MCP custom CONTEXT.md** : anti-compactage via contexte a la demande.
- 🔮 **modules/shared** : extraction auth+DB. A faire quand 2e module.
- 💡 **P5 auto-maintenance.sh mega-script** : attendre feedback drift-detector avant d'ajouter orchestrateur (YAGNI).
- 💡 **P11 generate-brief.sh** : si drift v11 trop frequent, automatiser generation.
- 🔧 **CSS>40KB** (55.66) : investigation Tailwind purge, chantier DS separe.
- 🔧 **Vitest DS output illisible** : parsing health-check fragile, chantier separe.
- ❓ **Cowork : methodo ou produit ?** : a trancher avant Sprint 1.

## En attente Kevin

- **Test manuel DS composants** : 46 ui Storybook (http://localhost:6006).
- **Validation workflow Desktop** : tester /cockpit + /plan-os sur vraie tache, confirmer auto-rename 🪐.
- **Decision Phase 5** : Finance / Sante / Trading — lequel lancer ?
- Activer "Email confirmations" dans Supabase Auth.
- OMC update v4.11.6 (actuel v4.10.1).

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-LEVELUP-01 Organicite detection-only | 2026-04-15 | Scripts `drift-detector.sh` + `docs-sync-check.sh` **detectent** les drifts (MEMORY count, CONTEXT sessions, branches, docs syncrones). Corrections cosmetiques uniquement via `--fix-cosmetic`. Fix structurel exige validation Kevin. Raison : feedback_no_auto_archive (ne jamais auto-deplacer fichiers Kevin). |
| D-LEVELUP-02 Plans ultra detailles | 2026-04-15 | Tout plan multi-session : 6 elements par phase (pre-conditions, etat repo, actions atomiques avec snippets, verification, rollback, commit message preformate). Memoire `feedback_plans_ultra_detailles.md`. Spec `docs/core/planner.md`. Anti-perte-de-contexte post-compactage. |
| D-LEVELUP-03 Worktree legacy merge-then-delete | 2026-04-15 | claude/jolly-wescoff (session level-up) non-migre en cours. Workflow : finir → merge main → worktree remove → delete branche. Nouvelle convention s'applique a la prochaine branche via `/wt new`. |
| D-DESKTOP-01 Foundation OS calibre Claude Code Desktop | 2026-04-15 | Migration workflow OS pour exploiter features natives Desktop : plan window UI, tasks pane, worktrees actifs, sessions auto-nommees 🪐. Plan archive `.archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md`. 9 phases, 9 commits. |
| D-NAMING-01 Conventions nommage unifiees | 2026-04-15 | Spec `docs/core/naming-conventions.md`. Branches `<type>/<scope>-<desc>[-yymmdd]`. Worktrees `wt/<desc>-<yymmdd>` via `/wt new`. Sessions `🪐 <mini-detail> (DD-MM-YYYY)` via titre plan. Hook `branch-name-check.sh` dans pre-commit. |
| D-PLAN-02 /plan-os orchestrateur skills | 2026-04-15 | Orchestrateur intelligent qui route vers le meilleur skill (brainstorming / writing-plans / ralplan) + finalise EnterPlanMode natif + dual-path versionnement. Skills tiers gardes intacts. Supersede D-PLAN-01. |
| D-DS-REBUILD Remplacement total shadcn | 2026-04-11 | Option C : supprimer ancien DS + reconstruire from scratch depuis Figma Make `base DS/src.zip`. Dark-only, tokens `--ds-*` (retire `--fos-*`). Plan `.archive/plans/2026-04-11-ds-shadcn-finition.md`. |
| D-WT-01 Worktrees integres Core OS | 2026-04-11 | Feature native Claude Code documentee `docs/core/worktrees.md`. `.claude/worktrees/` dans `.gitignore` + exclu `ref-checker.sh`. |
| D-PLAN-01 Planner MVP wrapper Superpowers | 2026-04-11 | SUPERSEDE par D-PLAN-02. |
| D-TOOLS-01 Catalogue modulaire v2 | 2026-04-10 | 98 outils documentes, routing etendu (26 regles), `tool-register.sh` CLI. |
| D-COCKPIT-01 Point d'entree unique | 2026-04-10 | /cockpit = super-pilote optionnel. Coexiste avec session-start/end/sync/new-project. |
| D-BRIEF-01 Format v11 TDAH | 2026-04-10 | Cadres box-drawing, zones visuelles, alignement strict. Remplace v10. |
| D-COM-01 Module Communication | 2026-04-10 | Remplace Memory. 4 tiers persistance + brief v11. |
| D-HK-02 Deps upgrade | 2026-04-10 | React 19, Vite 8, Tailwind 4. Build -74%. |
| Compactage → re-audit | 2026-04-07 | Si compactage risque → refaire cycle audit complet avant de continuer. |

## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK ~300ms | 184KB | 55KB | 19/19 | 5 |
| Design System | OK | — | — | 23/23 | — |
| Storybook | OK 5.87s | — | — | — | 62 stories (53 DS + 9 app) |

Seuils : voir `docs/core/monitor.md` section 4.
Health-check : DEGRADED permanent (2 warn hors scope : Vitest DS output illisible, CSS>40KB).
Deploy : https://foundation-os.vercel.app/
DB : Supabase, 6 tables + triggers.

## MCP — Comptes connectes

| Service | Info |
|---------|------|
| Asana | workspace 1213280972575193, kevin.noel.divers@gmail.com |
| Notion | user 4f1b99db |
| Figma | disponible |
| Monday.com | disponible |
| Gmail | Auth requise |

## Outils

- **CI** : GitHub Actions (Node 24, build + TS + tests) + supabase-ping cron + supernova-sync
- **Tests** : Vitest (app 19 + DS 23) + health-check + sync-check + ref-checker + drift-detector + docs-sync-check
- **Hooks** : validate-void-glass + security-reminder + branch-name-check + pre-commit + commit-msg + SessionEnd auto-archive + SessionStart drift-detector
- **Plugins** : OMC, Superpowers v5.0.7, gstack, BMAD v6 (dormant)

## Travaux Cowork

| Titre | Chemin | Status |
|-------|--------|--------|
| Plan Dashboard Monitoring | `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/` | valide Kevin — pret pour handoff CLI. Effort ~33h. |

## Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Supabase pause 7j inactif | low | GitHub Actions cron ping hebdo |
| Vercel deploy casse | medium | Root dir = modules/app |
