# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ iso base DS | `modules/app/` | Tokens `ds-*` partout (0 legacy). Build ~300ms, 19/19 tests. Verif visuelle chrome-devtools : IndexPage + Commander + Knowledge iso base DS. |
| Design System | ✅ iso base DS | `modules/design-system/` | Rebuild DONE 2026-04-15. 46 ui iso + 7 patterns Dashboard + 53 stories SB (62 total avec app). Build-storybook 5.87s. [[index-wiki]] |
| Core OS | 7/7 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2, Planner, Worktrees, Knowledge. + Cockpit orchestrateur. |
| Knowledge | ✅ actif Phase 7 | `wiki/` | Plugin claude-obsidian v1.4.3. 5 domaines + 7 cross-domain. Couplage modules <-> wiki. Brief v12 HOT+WIKI. D-WIKI-01. [[index-wiki]] |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Finance | prevu | — | Phase 5 |
| Sante | prevu | — | Phase 5 |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-16 | **[DONE] Audit profondeur + nettoyage fantômes + worktrees** |
|            | Audit complet 128 fichiers (7 agents opus, contenu lu ligne par ligne). 5 fantômes Obsidian supprimés (fichiers physiques A/X/file/page). 4 worktrees legacy nettoyés. v11→v12 propagé ~25 fichiers. cortex.md 4→7 modules. 6 mémoires obsolètes → _deprecated. Brief v11.md → Brief v12.md. CLAUDE.md +4 impératifs qualité. 3 commits, 37 fichiers. |
| 2026-04-16 | **[DONE] Hygiene OS — DEGRADED→SAIN** (26 refs, 3 drifts, 5 warnings→0). 1 commit `b1d7501`. |
| 2026-04-16 | **[DONE] Audit Mapping + Méga Audit Final Foundation OS** |
|            | Audit mapping 29 findings (5 phases DONE, 5 concepts créés, +173 wikilinks). Méga audit 63 findings + 9 innovations (scripts, docs, wiki, commands, routines, CI). 3 scripts créés (wiki-suggest-links, wiki-metrics, wiki-recall-reminder). Session commands alignées 14 sections. 13 commits, 53 fichiers, +1400 lignes. |
|            | Decisions : D-NAMING-02 espaces wiki, D-VAULT-01 vault racine. Plans archivés : audit-mapping + mega-audit. |
| 2026-04-16 | **[DONE] Adoption Wiki + Neuroplasticité + 14 Routines** — D-WIKI-01, 19 commits. |
| 2026-04-15 | **[DONE] Level Up Foundation OS — audit + 7 phases** |
|            | Audit exhaustif OS (69 fichiers lus), 21 findings P0/P1/P2, 15 propositions priorisees. |
|            | 7 phases livrees : hygiene settings.local (159→81L) + ref-checker extended (16→0 refs cassees) + manifeste/README syncrones + auto-archive plans retrofit (plan migration archive) + branch-name-check dans pre-commit + 2 branches legacy cleaned (tags archive/* preserves) + memory/_deprecated/ (2 memoires SUPERSEDED/DONE) + CONTEXT compression + CLAUDE compression + tools catalogue regen + drift-detector.sh + docs-sync-check.sh + hook SessionStart + cadre SYNC brief v11 + chain drift health-check. |
|            | Plan : `.archive/plans-done-260415/2026-04-15-level-up-foundation-os.md` (7 phases, 7 commits). |
|            | Decisions : D-LEVELUP-01 organicite detection-only, D-LEVELUP-02 plans ultra detailles, D-LEVELUP-03 claude/jolly-wescoff merge-then-delete. |
|            | Memoire creee : `feedback_plans_ultra_detailles.md`. |
> Sessions plus anciennes (Migration Desktop 9 phases DONE 2026-04-15, DS iso visuel 46 composants) (DS iso visuel 2026-04-15 DONE_COTE_CLAUDE/EN_COURS_KEVIN 46 composants) (S0-S14 Cycle 3 + DS finition + Planner MVP + App UI refactor + Storybook S1/S2 + Audit Core OS) : voir `git log` + `.archive/audit-massif/23-rapport-final.md` + `.archive/plans-done-260415/`.

## Cap

**Direction** : Foundation OS = OS de travail + second-brain knowledge unifié + autopilote 14 routines. Wiki Obsidian opérationnel (36 pages content, 762+ wikilinks, graph connecté). Neuroplasticité active. Health-check SAIN (0 warning). OS cohérent et prêt pour Phase 5.

**Prochaine action** :
  - **Configurer 9 groupes couleur Obsidian** : Kevin dans UI graph (voir instructions session).
  - **Créer 14 routines Desktop** : prompts dans `wiki/meta/routines-setup.md` (Kevin `/schedule` × 14).
  - **Décider sort 2 worktrees legacy** : sleepy-ellis (2 commits uniques) + suspicious-khayyam (8 non-commités).
  - **Decision Phase 5** : Finance / Santé / Trading — lequel lancer ?

> Note 2026-04-15 : auto-rename session Desktop verifie inexistant. Remplace par bloc SESSION RENAME dans `/plan-os` (Kevin copie-colle manuellement sidebar). Worktrees Desktop auto-cree avec noms random `claude/*` : comportement non-controlable. Seuls worktrees `/wt` explicites respectent convention `wt/*`.

## Idees & Parking

- 💡 **Agent SDK Anthropic** : explorer formalisation Cortex en natif. Pre-requis : SDK mature + evaluation.
- 💡 **MCP custom CONTEXT.md** : anti-compactage via contexte a la demande.
- 🔮 **modules/shared** : extraction auth+DB. A faire quand 2e module.
- 💡 **P5 auto-maintenance.sh mega-script** : attendre feedback drift-detector avant d'ajouter orchestrateur (YAGNI).
- 💡 **P11 generate-brief.sh** : si drift v11 trop frequent, automatiser generation.
- 🔧 **CSS 55KB** : sous seuil 65KB (gzip 9KB). Re-evaluer si > 65KB apres Phase 5.
- ❓ **Cowork : methodo ou produit ?** : a trancher avant Sprint 1.

## En attente Kevin

- **Test manuel DS composants** : 46 ui Storybook (http://localhost:6006).
- **Validation workflow Desktop** : tester /cockpit + /plan-os sur vraie tache, confirmer bloc SESSION RENAME affiche.
- **Decision Phase 5** : Finance / Sante / Trading — lequel lancer ?
- Activer "Email confirmations" dans Supabase Auth.
- OMC update v4.12.0 (actuel v4.10.1).

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-WIKI-01 Adoption claude-obsidian + 5 tiers memoire | 2026-04-15 | Plan `.archive/plans-done-260416/2026-04-15-wiki-obsidian-adoption.md` (12 phases, Option B inline). Vault Obsidian pre-scaffolde 5 domaines (trading/finance/sante/design/dev) + 7 cross-domain. Plugin v1.4.3 (10 skills + 4 commands + 2 agents + 5 templates). Hooks integres (auto-commit DESACTIVE). Couplage modules <-> wiki via frontmatter `implementation:`. Brief v12 enrichi (tuiles HOT + WIKI). Spec `docs/core/knowledge.md`. Repo reste prive (Phase 5 donnees perso). |
| D-LEVELUP-01 Organicite detection-only | 2026-04-15 | Scripts `drift-detector.sh` + `docs-sync-check.sh` **detectent** les drifts (MEMORY count, CONTEXT sessions, branches, docs syncrones). Corrections cosmetiques uniquement via `--fix-cosmetic`. Fix structurel exige validation Kevin. Raison : feedback_no_auto_archive (ne jamais auto-deplacer fichiers Kevin). |
| D-LEVELUP-02 Plans ultra detailles | 2026-04-15 | Tout plan multi-session : 6 elements par phase (pre-conditions, etat repo, actions atomiques avec snippets, verification, rollback, commit message preformate). Memoire `feedback_plans_ultra_detailles.md`. Spec `docs/core/planner.md`. Anti-perte-de-contexte post-compactage. |
| D-LEVELUP-03 Worktree legacy merge-then-delete | 2026-04-15 | claude/jolly-wescoff (session level-up) non-migre en cours. Workflow : finir → merge main → worktree remove → delete branche. Nouvelle convention s'applique a la prochaine branche via `/wt new`. |
| D-DESKTOP-01 Foundation OS calibre Claude Code Desktop | 2026-04-15 | Migration workflow OS pour exploiter features natives Desktop : plan window UI, tasks pane, worktrees actifs, sessions 🪐 (rename manuel via bloc /plan-os — feature auto-rename Desktop verifiee inexistante 2026-04-15). Plan archive `.archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md`. 9 phases, 9 commits. |
| D-NAMING-01 Conventions nommage unifiees | 2026-04-15 | Spec `docs/core/naming-conventions.md`. Branches `<type>/<scope>-<desc>[-yymmdd]`. Worktrees `wt/<desc>-<yymmdd>` via `/wt new`. Sessions `🪐 <mini-detail> (DD-MM-YYYY)` via titre plan. Hook `branch-name-check.sh` dans pre-commit. |
| D-PLAN-02 /plan-os orchestrateur skills | 2026-04-15 | Orchestrateur intelligent qui route vers le meilleur skill (brainstorming / writing-plans / ralplan) + finalise EnterPlanMode natif + dual-path versionnement. Skills tiers gardes intacts. Supersede D-PLAN-01. |
| D-NAMING-02 Convention nommage wiki espaces | 2026-04-16 | Wiki concepts/entities gardent espaces dans noms fichiers (Obsidian natif). Kebab-case pour sources/meta. Pas de renommage massif. |
| D-VAULT-01 Obsidian vault = racine projet | 2026-04-16 | Vault Obsidian configuré sur `/Users/kevinnoel/foundation-os/` (pas juste wiki/). Tous les .md du repo visibles dans graph. 9 groupes couleurs (5 tags + 4 path:). |
| D-DS-REBUILD Remplacement total shadcn | 2026-04-11 | Option C : supprimer ancien DS + reconstruire from scratch depuis Figma Make `base DS/src.zip`. Dark-only, tokens `--ds-*` (retire `--fos-*`). Plan `.archive/plans/2026-04-11-ds-shadcn-finition.md`. |
| D-WT-01 Worktrees integres Core OS | 2026-04-11 | Feature native Claude Code documentee `docs/core/worktrees.md`. `.claude/worktrees/` dans `.gitignore` + exclu `ref-checker.sh`. |
| D-PLAN-01 Planner MVP wrapper Superpowers | 2026-04-11 | SUPERSEDE par D-PLAN-02. |
| D-TOOLS-01 Catalogue modulaire v2 | 2026-04-10 | 109 outils documentes, routing etendu (35 regles), `tool-register.sh` CLI. |
| D-COCKPIT-01 Point d'entree unique | 2026-04-10 | /cockpit = super-pilote optionnel. Coexiste avec session-start/end/sync/new-project. |
| D-BRIEF-01 Format v11 TDAH | 2026-04-10 | Cadres box-drawing, zones visuelles, alignement strict. Remplace v10. |
| D-COM-01 Module Communication | 2026-04-10 | Remplace Memory. 5 tiers persistance (D-WIKI-01) + brief v11. |
| D-HK-02 Deps upgrade | 2026-04-10 | React 19, Vite 8, Tailwind 4. Build -74%. |
| Compactage → re-audit | 2026-04-07 | Si compactage risque → refaire cycle audit complet avant de continuer. |

## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK ~300ms | 184KB | 55KB | 19/19 | 5 |
| Design System | OK | — | — | 23/23 | — |
| Storybook | OK 5.87s | — | — | — | 62 stories (53 DS + 9 app) |

Seuils : voir `docs/core/monitor.md` section 4.
Health-check : SAIN (0 critical, 0 warning). Seuil CSS releve 40→65KB, Vitest DS "No test files" gere.
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
