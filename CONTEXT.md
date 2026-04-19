# Foundation OS — Contexte

> Source de verite operationnelle. Lu en debut de session, mis a jour en fin.
> Spec format : docs/core/communication.md

## Modules

| Module | Status | Path | Detail |
|--------|--------|------|--------|
| App Builder | ✅ Void Glass dark-only | `modules/app/` | Tokens `ds-*` partout (forms/ dead code archive 2026-04-17). Build ~250ms, 15/15 tests. 6 routes + catchall. Verif visuelle chrome-devtools : IndexPage + Commander + Knowledge Void Glass OK. |
| Design System | ✅ Void Glass fork base DS | `modules/design-system/` | Rebuild DONE 2026-04-15. 46 ui derives `base DS/` (Figma Make) + 7 patterns Dashboard + 53 stories DS + 9 app = 62 total Storybook. 0 unit test + 5 e2e stale (a reecrire). [[index-wiki]] |
| Core OS | 7/7 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2, Planner, Worktrees, Knowledge. + Cockpit orchestrateur. |
| Knowledge | ✅ actif Phase 7 | `wiki/` | Plugin claude-obsidian v1.4.3. 5 domaines + 7 cross-domain. Couplage modules <-> wiki. Brief v12 HOT+WIKI. D-WIKI-01. [[index-wiki]] |
| Body | ✅ COMPLET 5/5 Phase 8 | `docs/core/body.md` | Proprioception Kevin-Claude (alignement intention-action). 4 couches C1-C4 : Constitution 41 P-XX + intent capture + rating enrichi + subagent alignment-auditor. D-BODY-01 COMPLET 2026-04-19. |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Finance | prevu | — | Phase 5 |
| Sante | prevu | — | Phase 5 |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-19 | **[DONE] D-BODY-01 P1 Constitution + Intent (Opus 4.7, 1 commit `5d26166`, ~3h)** |
|            | Scope : 8e module Core OS "Body" (Proprioception Kevin-Claude, alignement intention-action). 3 questions front-loadees (nom Body / Option C ambitieuse / intent obligatoire /plan-os). Recherche externe Constitutional AI + Reflexion + IFEval + AlignmentCheck. Plan 5 phases × 6 elements. |
|            | Livrables : `docs/core/body.md` (spec 11 sections 4 couches C1-C4) + `docs/core/constitution.md` (~41 P-XX seedees CLAUDE+lessons+pieges+feedback) + `scripts/intent-capture.sh` (teste 4 cas) + 4 stubs forward refs zero regression (alignment-analyze/constitution-suggest/alignment-auditor/constitution-archive) + 5 edits integration (architecture-core 7→8, communication L2, plan-os Tour 1 bis, session-start/cockpit). Decision D-BODY-01. |
|            | Verifs : health SAIN (0 critical, 0 warning), ref-checker 146/0, intent-capture teste 4 cas, stubs P2-P4 exit 0. Commit `5d26166`. Plan `.archive/plans-done-260419/2026-04-19-body-module-complet.md`. |
|            | Revelations : stubs forward refs = pattern zero regression (evite DEGRADED intermediaire). Dogfooding intrinseque (intent-capture.sh cree l'intent de sa propre phase). Constitution seedee (41 P-XX derives sources existantes, zero invente). Option C ambitieuse + minutie 6-elements = orthogonal (scope vs comment). |
| 2026-04-19 | **[DONE] D-CONCURRENCY-01 Multi-session safety (Opus 4.7, 2 commits atomiques, ~2h)** |
|            | Scope : audit complet concurrence multi-session + livraison minimaliste (B-lite validee). Questions Kevin : "puis-je travailler N sessions en parallele sans regression ?". Reponse honnete livree (audit 7 hotspots + limites + YAGNI). |
|            | Livrables : `scripts/hooks/pre-compaction-snapshot.sh` fix suffix worktree (evite overwrite meme minute), `docs/core/concurrency.md` (252L, spec canonique 11 sections), CLAUDE.md +4L section Multi-session. Decision D-CONCURRENCY-01 (safety via discipline documentee, pas de lock YAGNI). |
|            | Verifs : snapshot teste live (`20260419-1108-strange-dhawan-e61b96.md`), health SAIN, ref-checker 141/0, CLAUDE.md 199L (sous garde-fou 200L). |
|            | Commits : `4ff56e0` feat(os): fix snapshot collision + `117be29` docs(os): spec concurrency. Merge main + push pendant. |
|            | Revelations : FOS 70% pret multi-session, 30% discipline. Regle d'or = "cloture en serie" (jamais 2 `/session-end` meme minute). YAGNI > defensive engineering pour dev solo (lock par fichier rejete, complexite > benefit). Auto-critique honnete a paye (Kevin a challenge proposition initiale, reduit a minimaliste). |
| 2026-04-18 | **[DONE] D-INTEG-01 Phases 2-5 COMPLET (Opus 4.7, 4 commits + 4 merges, ~5-6h enchainees)** |
|            | Scope : executer Phases 2-5 du plan D-INTEG-01 apres Phase 1 preparatoire. 4 livrables + backfill 22 pages + graph report auto-gen. |
|            | Livrables : INT-1 pre-compaction snapshot (hook + rotation 14), INT-2 confidence tagging (41h/1m/3l), INT-3 graph report auto, INS-1 layered loading L0-L3 section 6.5. Commits 2534137 + cc6d3c4 + 1010887 + 9418661 (+ merges e861abf). |
| 2026-04-17 (mapping refactor) | **[DONE] Refactor radical mapping/routage cerveau OS (Opus 4.7, 14 commits Session A+B+C)** |
|            | Scope : audit exhaustif 128 fichiers (lecture ligne par ligne) + rapport ecrit 720L + plan execution 15 phases 6 elements anti-compactage. Resolution 15 findings (3 🔴 + 10 🟡 + 2 🟢). Phase 12 SKIP (enforcement routing decoratif garde). |
|            | Livrables cles : `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` (13 axes audites), source unique counts.md, foundation-os-map compresse 205L->74L (pattern etoile->mesh 2 niveaux), graph.json Obsidian 12->9 groupes, 4 journals->2, index-app.md + log.md + session-dna.md archives, categories mortes (comparisons/questions/canvases) supprimees, domains Phase 5 `[!placeholder]`, SessionStart unifie cockpit+session-start (9 reads), 52 wikilinks DS hors-vault -> backtick paths. |
|            | Verifs : **SAIN** post-refactor. Health-check 0 critical 0 warning. Drift SYNC. Wiki-health SAIN (45 pages, 640 wikilinks). Ref-checker 138 .md scannes 0 cassee. Tier-contradiction 0. Neuroplasticite 100%. Tests 15/15 app. Build 244ms. |
|            | Commits : 005703d 15bd8fe 6193d7e dd0825c d2c4af3 d425ea9 d872aa2 b461e82 14a7714 604fbe3 5129f13 (Phase 1-11) + Phase 13-14 en cours. Decision D-MAPPING-01 Refactor mapping/routage cerveau. |
| 2026-04-17 (cleanup) | **[DONE] Cleanup drifts + refs + TSX legacy (Opus 4.7, 6 commits atomiques)** |
|            | Scope : post-audit v2 S3, nettoyage complet. Plan `parsed-swimming-torvalds.md` (8 phases 6 elements). Archivage rapports audit v2 (10 fichiers -> `.archive/audit-v2-done-260417/`), recablage 31 refs cassees vers `.archive/`, resolution 1 contradiction CLAUDE<->knowledge.md, seuils TSX ajustes (800L ui/ DS shadcn, 2000L patterns/ DS showcase), CONTEXT.md compression 179->133L + trim sessions 9->5, CLAUDE.md compression 220->195L, drift-detector regex fix (worktrees Desktop hex suffix), wiki/index-wiki count sync (48->45). |
|            | Verifs : health-check = **SAIN** (0 critical, 0 warning), ref-checker 88->0, tier-contradiction 0, drift-detector SYNC, 15/15 tests app, 0 erreur TS DS. Commits 9f9bf4c + 2f78d5c + 64fd1a7 + 205a1e4 + 570846f + c26ef46. |
|            | Decisions implicites : tier canonique refs renommage = knowledge.md section 5 (pas CLAUDE.md), patterns/ DS accepte >1500L (template showcase reference par ligne 41 ui/). |
> Session "2026-04-17 (nuit) · Audit v2 S3 Phase 17+18 Contradiction + Feedback" trimee 2026-04-19 D-BODY-01 P1 (regle max 5). 2 commits (7466910 + 8190abc). Scripts tier-contradiction-check + session-ratings-analyze. Phase 7bis AskUserQuestion rating. S3 complete 3/3 phases, FONCTION ~7/10.
> Session "2026-04-17 soir · Audit v2 S3 Phase 16 I-09 Memory auto-priorisation" trimee 2026-04-19 (regle max 5). 25 auto-memories `last_used:` + memory-audit.sh + hook PreToolUse Read. Commit 98817e7 merge a42b5f5.
> Session "2026-04-17 Audit v2 execution S1+S2" trimee 2026-04-18 (regle max 5). 10 commits FORME+FONCTION. Scripts git-hooks-install + wiki-counts-sync + sessions-analyze + propositions-generator + neuroplasticity-score. Tuile #15 brief v12. Lecon CLAUDE_USER_PROMPT inexistante.
> Sessions plus anciennes (Mega Audit V2 FORME+FONCTION 2026-04-16 166 findings, Audit profondeur + fantomes 2026-04-16 12 commits, Hygiene OS 2026-04-16 `b1d7501`, Audit Mapping + Mega Audit Final 2026-04-16 D-NAMING-02+D-VAULT-01, Adoption Wiki D-WIKI-01 2026-04-16 19 commits, Level Up OS 7 phases 2026-04-15 D-LEVELUP-01/02/03, Migration Desktop 9 phases 2026-04-15, DS iso visuel 46 composants, S0-S14 Cycle 3 + DS finition + Planner MVP + App UI refactor + Storybook S1/S2 + Audit Core OS) : voir `git log` + `.archive/audit-massif/` + `.archive/plans-done-260415/` + `.archive/plans-done-260416/` + `.archive/plans-done-260417/`.

## Cap

**Direction** : **D-BODY-01 COMPLET 5/5** (19-04-2026) — 8e module Core OS "Body" (Proprioception Kevin-Claude) livre integralement en 1 session Opus 4.7 (Option C ambitieuse, 6 commits, ~10h). 4 couches C1 Constitution + C2 Intent + C3 Feedback + C4 Learning loop. Inspire Constitutional AI + Reflexion + IFEval + AlignmentCheck. Commits `5d26166` + `c40a6de` + `c441b90` + `f0bf499` + `c67ffc0` + `fae30aa`. Plan archive (a deplacer `.archive/plans-done-260419/`).

**Prochaine action** (post-Body) :
  - **A** — Decision Phase 5 modules (Finance / Sante / Trading)
  - **B** — Configurer 14 routines Desktop UI `/schedule`
  - **C** — Cleanup 10 worktrees legacy
  - **D** — OMC update v4.10.1 → v4.12.1
  - **E** — Test live alignment-auditor subagent au prochain `/plan-os` (validation end-to-end)

**Reporte** : SQL migrations, routines Cloud I-08, hook wiki-recall I-01 (API CLAUDE_USER_PROMPT inexistante), cortex enforcement I-05, brief adaptatif I-03.

**Backlog** : 10e groupe couleur Obsidian graph pour `#auto-generated` (graph-report).

## Idees & Parking

- 💡 **Agent SDK Anthropic** : explorer formalisation Cortex en natif. Pre-requis : SDK mature + evaluation.
- 💡 **MCP custom CONTEXT.md** : anti-compactage via contexte a la demande.
- 🔮 **modules/shared** : extraction auth+DB. A faire quand 2e module.
- 💡 **P5 auto-maintenance.sh mega-script** : attendre feedback drift-detector avant d'ajouter orchestrateur (YAGNI).
- 💡 **P11 generate-brief.sh** : si drift v11 trop frequent, automatiser generation.
- 🔧 **CSS 55KB** : sous seuil 65KB (gzip 9KB). Re-evaluer si > 65KB apres Phase 5.
- ❓ **Cowork : methodo ou produit ?** : a trancher avant Sprint 1.

## En attente Kevin

- **Test live D-BODY-01 end-to-end** (important — report Kevin 2026-04-19) : au prochain `/plan-os` reel, valider (1) subagent `alignment-auditor` invocation Task + rapport JSON genere, (2) Phase 7bis enrichie 4 questions AskUserQuestion live, (3) tuile brief v12 #14 🧭 ALIGNMENT rendue en `/session-start`. Tant que ces 3 valides, "Body COMPLET" = implementation-done + documente, pas teste end-to-end.
- **Test manuel DS composants** : 46 ui Storybook (http://localhost:6006).
- **Validation workflow Desktop** : tester /cockpit + /plan-os sur vraie tache, confirmer bloc SESSION RENAME affiche.
- **Decision Phase 5** : Finance / Sante / Trading — lequel lancer ?
- Activer "Email confirmations" dans Supabase Auth.
- OMC update v4.12.0 (actuel v4.10.1).

## Decisions

> Decisions stables (> 30 jours ou supersedees) archivees dans `docs/decisions-log.md`.

| Decision | Date | Detail |
|----------|------|--------|
| D-BODY-01 Module Body 8e Core OS COMPLET 5/5 | 2026-04-19 | 8e module Core OS "Body" (Proprioception Kevin-Claude, alignement intention ↔ action) livre integralement. 4 couches C1-C4 : Constitution `docs/core/constitution.md` (41 P-XX) + Intent capture `.omc/intent/` + Feedback structure `.omc/alignment/*.jsonl` (schema enrichi + retro-compat ratings.jsonl) + Learning loop (`scripts/alignment-analyze.sh` chain health-check INFO + `scripts/constitution-suggest.sh` flag 🎯 to-constitute + `.claude/agents/alignment-auditor.md` subagent clean-slate sonnet READ-ONLY). Integration : `/plan-os` Tour 1 bis intent-capture OBLIGATOIRE + `/session-end` Phase 7bis enrichie 4 questions + Phase 7ter auditor + Layered Loading L2 + CLAUDE.md section pre-action check (200L) + brief v12 tuile #14 🧭 ALIGNMENT. Inspire Constitutional AI (Anthropic) + Reflexion framework + IFEval + AlignmentCheck (Meta 41.77% drift). 3 pages wiki concepts (Body + Alignment + Constitution FOS). 6 commits `5d26166` + `c40a6de` + `c441b90` + `f0bf499` + `c67ffc0` + `fae30aa`. Plan `.archive/plans-done-260419/2026-04-19-body-module-complet.md` archive. |
| D-CONCURRENCY-01 Multi-session safety | 2026-04-19 | Audit concurrence + livraison minimaliste (B-lite). Spec `docs/core/concurrency.md` (7 hotspots + regle cloture serie + recette resolution). Fix snapshot collision (suffix worktree). CLAUDE.md section Multi-session. YAGNI : pas de lock par fichier (complexite > benefit dev solo, reevaluer si equipe). Commits `4ff56e0` + `117be29`. |
| D-MAPPING-01 Refactor mapping/routage cerveau OS | 2026-04-17 | Audit exhaustif 128 fichiers + rapport 720L + plan 15 phases. Wiki 45 pages, navigation 2 niveaux (foundation-os-map 205L->74L), sources uniques (counts.md), 4 journals->2, categories mortes supprimees (comparisons/questions/canvases), domains Phase 5 [!placeholder], SessionStart unifie cockpit+session-start (9 reads), hook session-start-wiki cat complet, graph.json 12->9 color groups. Rapport `docs/audits/2026-04-17-mapping-routage-audit/rapport.md`. Plan apres archive : `.archive/plans-done-260417/2026-04-17-mapping-routage-refactor.md`. |
| D-INTEG-01 Integration sources externes | 2026-04-17 | Apres audit surface SAIN + lecture 5 sources (MemPalace / Octogent / Graphify / Penpax.ai / MemPalace site). 4 enhancements integres sur 5 sessions : INT-1 pre-compaction snapshot (Phase 2), INT-2 confidence tagging systematique (Phase 3), INT-3 graph report auto (Phase 4), INS-1 layered loading formel (Phase 5). Plan : `.archive/plans-done-260418/2026-04-17-integration-sources-externes.md`. Concepts : [[Confidence Tagging]] [[Graph Report]] [[Layered Loading]] [[Pre-compaction Snapshot]]. Spec : `docs/core/knowledge.md` section 12. Phase 1/5 DONE (preparation architecturale). |
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
> Decisions anciennes archivees dans `docs/decisions-log.md` : D-PLAN-01 SUPERSEDE (2026-04-11), D-TOOLS-01 catalogue 109 outils (2026-04-10), D-COCKPIT-01 point d'entree unique (2026-04-10), D-BRIEF-01 v11 TDAH → supersede par v12 (2026-04-10), D-COM-01 module Communication (2026-04-10), D-HK-02 deps upgrade React 19/Vite 8 (2026-04-10), Compactage → re-audit (2026-04-07).

## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK ~250ms | 184KB | 55KB | 15/15 | 6 |
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
- **Hooks Claude (3)** : PreToolUse validate-void-glass + security-reminder (sur Write|Edit|MultiEdit), SessionEnd auto-archive-plans, SessionStart drift-detector. **Git hooks (2)** : pre-commit health-check, commit-msg conventional (install via `bash scripts/git-hooks-install.sh`). **Opt-in (2, non-actives)** : branch-name-check, wiki-recall-reminder.
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
