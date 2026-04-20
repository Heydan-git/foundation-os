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
| Product | ✅ COMPLET 5/5 Phase 9 | `docs/core/product.md` | 9e Core OS — Integration FOS ↔ **Notion only** (pivot P1.5, Asana abandonne). Agent `po-agent` expert Notion 100% (PO elargi FOS + modules + apps futures). Skill `/po init\|sync\|pull\|status`. Notion 4 DB (Decisions 16 / Plans 1 / Sessions 5 / Tasks 6) + 4 views natives (Kanban by Status + Module, Timeline Tasks + Plans). Hooks opt-in PRODUCT_MCP_SYNC=1. Tuile brief v12 #17 PRODUCT. Chain health-check INFO. D-PRODUCT-01 COMPLET 2026-04-19. |
| Model | ✅ COMPLET Phase 10 | `docs/core/model.md` | 10e Core OS — Conscience version modele IA (Claude Opus 4.7 1M context, knowledge cutoff Jan 2026). Spec 11 sections : forces/faiblesses/optimisations FOS (layered L0-L3, subagent < 500 mots, pre-compaction, caching 5-min, parallel tool calls). Integration 9 autres modules. Workflow upgrade modele. D-MODEL-01 adopte 2026-04-19. |
| Cowork | actif (non-branche) | `docs/travaux-cowork/` | Co-work Desktop + CLI. Non branche a /session-start /session-end |
| Trading | ✅ Backtest engine v1.1 | `modules/finance/trading/` | Socle Python 3.12 + Pine v5 bridge + 3Commas webhook FastAPI + **Nautilus Bridge skeleton** (B1) + **NautilusLiveEngine skeleton** (B2, lifecycle + KillSwitch). **5 strategies** : EMA cross, Donchian breakout, RSI mean-reversion, Multi-TF trend, Bollinger breakout. Harnesses anti-biais (WF/PurgedCV/MC/PBO/DSR) + HTMLReport tearsheet. **94/94 tests** + ruff/mypy clean + CI GH Actions. Nautilus full migration V1.2 : [roadmap spec](docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md). [[index-trading]] |
| Finance Patrimoine | prevu | — | Phase 5 (PEA/PER/SCPI/fiscalite) |
| Sante | prevu | — | Phase 5 |

## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-19/20 | **[DONE] D-AUDIT-TOTAL-01 Audit total FOS 14 phases + D-MODEL-01 10e Core OS (Opus 4.7 1M, 15+ commits atomiques, ~10h)** |
|            | Scope : audit exhaustif FORME + FONCTION + META sur 11 axes (fondation / core os / wiki / automation / outils / memoire / historique / comportement / mapping routes / tokens / model awareness) + cross-worktree read-only + fixes quick-wins + refactors majeurs. Session longue Opus 4.7 1M anti-compactage proof. |
|            | Livrables : `docs/audits/2026-04-19-audit-total-foundation-os/` (12 findings-Px + rapport-master 864L) + nouveau module Core OS `docs/core/model.md` (D-MODEL-01, Opus 4.7 doc Anthropic) + architecture-core 9→10 modules + P11 fixes (regen counts 47→53, graph 44→49, cleanup 14 branches, foundation-os-map 7→10 modules, cortex table 4→6 agents) + P12 refactors (CLAUDE.md P-01 a P-14 cross-refs, tools.md Tools v2 clarifie + 42 scripts categorie, brief v12 SANTE worktrees). |
|            | Verifs : health SAIN chaque phase, ref-checker 0 cassee post-cleanup, wiki-health SAIN 53 pages 0 orphelin, 15+ commits atomiques P0-P13, zero regression. Preuve Opus 4.7 1M context : 50+ files lus + 12 ecrits + 3 subagents + 30+ Bash + AskUserQuestion x2 SANS compactage. |
|            | Decisions : D-AUDIT-TOTAL-01 + D-MODEL-01. Plan `.archive/plans-done-260419/2026-04-19-audit-total-foundation-os.md` (apres archive hook). |
|            | Revelations : (1) Pattern declaratif non-enforced = candidate D-ENFORCE-01 11e Core OS futur. (2) Phase 5 Trading deja demarree jovial-jemison 45 commits D-TRADING-01. (3) CONTEXT.md systematiquement en retard vs realite multi-worktree. (4) Subagent prompt > 1500 mots garantit thrashing (Agent A preuve). (5) Stubs forward refs = zero regression pattern valide 2x. |
| 2026-04-19 (soir) | **[DONE] Extension module trading v1.1 (Opus 4.7, strategy library C + Nautilus skeletons B, 8 commits)** |
|            | Scope : livrer tout ce qui etait reporte au backlog V1.1. 4 nouvelles strategies (Donchian/RSI/Multi-TF/Bollinger) + Nautilus Bridge skeleton (B1) + NautilusLiveEngine skeleton event-driven + KillSwitch (B2) + V1.2 migration roadmap spec. |
|            | Livrables : C.1-C.4 strategies (`5552990`/`b8748b6`/`e28bf2b`/`e938b65`), C.5 wiki pages 4 strategies + index update (`eb7f70c`), B1 nautilus_bridge transforms + runner skeleton (`f91ba58`), B2 NautilusLiveEngine + LiveOrder/Position/Fill + KillSwitch (`38ffe5a`), V1.2 roadmap spec 263L (`589d139`). |
|            | Tests : 94/94 (72 existants + 22 nouveaux). ruff + mypy strict clean partout. Zero regression. |
|            | Decision : Strategy library v1 livree. Nautilus event-driven full migration formellement **reportee V1.2** (voir roadmap 263L qui cartographie les NotImplementedError + 11-16 sessions estimees). |
| 2026-04-19 (matin) | **[DONE] D-TRADING-01 Backtest engine crypto v1 socle (Opus 4.7, 8 phases, 27+ commits, subagent-driven) + research specs 3Commas/Dashboard** |
|            | Scope : livrer `modules/finance/trading/` — socle complet data pipeline + strategy framework + backtest runner + harnesses anti-biais + analysis + execution bridges + tests + CI + wiki. Plus 2 research specs V1.2+/V1.3+ (3Commas maison + Finance Dashboard maison). |
|            | Livrables : design spec 471L `cf12c8a` + plan 3957L `4ac5bd1` (8 phases 30 tasks 150 steps TDD) + 27+ commits implementation. Subagent-driven (implementer + spec-review + code-review par task), zero compactage. 2 research specs (303L + 314L) ranges au backlog V1.2+/V1.3+. |
|            | Verifs : 50/50 tests cumulatifs, coverage 82.86%, ruff clean, mypy strict clean, CLI `trading` 6 sub-commands operationnels. |
|            | Decision : **D-TRADING-01 Backtest engine crypto v1 socle**. Task 3.5 Nautilus + Task 6.3 NautilusLive reportes V1.1 (executes en session soir extension). |
|            | Revelations : approche C hybride pragmatique (Nautilus deps + pipeline custom autour, runner pandas suffit v1). Subagent-driven tres efficace sur plan long. TDD rigoureux a prevenu bugs subtils. |
| 2026-04-19 | **[DONE] D-BODY-01 Module Body 8e Core OS COMPLET 5/5 (Opus 4.7, 6 commits, ~3h+)** |
|            | Scope : 8e module Core OS "Body" (Proprioception Kevin-Claude, alignement intention-action). 4 couches C1-C4 livrees integralement : Constitution (41 P-XX) + Intent capture + Feedback structure + Learning loop (alignment-analyze + constitution-suggest + alignment-auditor subagent). |
|            | Livrables : `docs/core/body.md` + `docs/core/constitution.md` + `scripts/intent-capture.sh` + 4 stubs forward refs + 5 edits integration (architecture-core 7→8, plan-os Tour 1 bis, session-end Phase 7bis/7ter, brief v12 tuile #14). 3 pages wiki concepts. 6 commits `5d26166` → `fae30aa`. |
|            | Verifs : health SAIN chaque phase, ref-checker 146/0. |
|            | Revelations : stubs forward refs = pattern zero regression. Dogfooding intrinseque (intent-capture cree l'intent de sa propre phase). Constitution seedee, zero invente. |
| 2026-04-19 | **[DONE] D-CONCURRENCY-01 Multi-session safety (Opus 4.7, 2 commits, ~2h)** |
|            | Scope : audit concurrence multi-session + livraison minimaliste B-lite. Reponse honnete livree (audit 7 hotspots + YAGNI). |
|            | Livrables : `scripts/hooks/pre-compaction-snapshot.sh` fix suffix worktree, `docs/core/concurrency.md` (252L), CLAUDE.md section Multi-session. |
|            | Verifs : snapshot teste live, health SAIN, ref-checker 141/0. Commits `4ff56e0` + `117be29`. |
|            | Revelations : FOS 70% pret multi-session, 30% discipline. Regle d'or = "cloture en serie". YAGNI > defensive engineering pour dev solo. |
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

**Direction** : **D-AUDIT-TOTAL-01 COMPLET 14/14** (20-04-2026) + **D-MODEL-01 10e Core OS** + **D-TRADING-01 v1 + Extension V1.1 trading** livres en sessions concurrentes Opus 4.7 1M context. Foundation OS valide SAIN. Architecture : 10 modules Core OS + 1 orchestrateur Cockpit. 15 ameliorations mesurables audit + module Trading Phase 5 lance. Rapport audit master : `docs/audits/2026-04-19-audit-total-foundation-os/rapport-master.md`.

**Cross-worktree reality check** (resolu via merge 2026-04-20) : 3 worktrees actifs avec commits ahead main :
- `jovial-jemison-d31676` : **45+ commits Phase 5 Trading** (D-TRADING-01 Phase 8/8 + extension V1.1 library + Nautilus V1.2 skeletons + 3 research specs) = **Phase 5 DEMARREE** ET mergee main
- `determined-torvalds-903dc3` : 14 commits wiki ingest (awesome-claude-code + RTK + UI UX Pro Max + D-CCCONFIG-01) — a merger
- `condescending-ardinghelli-4d7d0a` : 15 commits D-AUDIT-TOTAL-01 — deja sur main

**Reporte V1.2+ trading** (Nautilus migration complete) : voir [roadmap spec 263L](docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md). 2 phases : A (backtest migration 6-9 sessions : data catalog Nautilus natif + Strategy adapter + BacktestNode integration + harnesses validation + CLI --engine nautilus), B (live integration 5-7 sessions : exchange adapter Binance natif ou ccxt Pro + connect_to_exchange + send_order_to_exchange + reconcile + monitoring + paper trading). Prerequis : D-TRADING-01 v1 prouve + 1-3 mois usage 3Commas live + budget paper 2 mois min par strategie. Cartographie NotImplementedError actuels B1/B2 vers V1.2 phases A/B explicite dans roadmap.

**Reporte V1.2+ trading** : **3Commas maison (OMS/EMS self-hosted)** — recherche faite 2026-04-19, spec `docs/superpowers/specs/2026-04-19-3commas-alternative-research.md` (303L). Range au backlog jusqu'a V1.1 livre + 3 mois live 3Commas pour savoir precisement quoi remplacer. Hybride recommande : maison Signal Bot + 3Commas DCA/Grid. Concept wiki [[Order Execution Management System]].

**Reporte V1.3+ trading** : **Finance Dashboard Maison** (portfolio tracker cross-exchange + wallets + bots monitor) — recherche faite 2026-04-19, spec `docs/superpowers/specs/2026-04-19-finance-dashboard-research.md` (314L). Option D hybride recommandee : commencer par P1 bots monitor dans App Builder. En attendant, CoinStats SaaS. Concept wiki [[Portfolio Aggregator]].

**Reporte V1.2+ autres** : VectorBT parameter sweeps massifs, tardis.dev L2 orderbook, ML features engineering, auto-deploy pipeline, drift monitoring live vs backtest OOS.

**Prochaine action** (post-audit) :
  - **A** — **Merge jovial-jemison trading main** (cloture serie D-CONCURRENCY-01, conflits attendus CLAUDE.md + CONTEXT.md : recette concurrency.md section 8)
  - **B** — Decision merger determined-torvalds wiki ingest OU garder parallele
  - **C** — Cleanup 2 worktrees legacy (bold-neumann + vibrant-poitras) : `--force` apres verif
  - **D** — Test live alignment-auditor subagent au prochain `/plan-os` (D-BODY-01 Phase E pending)
  - **E** — Test live D-PRODUCT-01 (`PRODUCT_MCP_SYNC=1` + observer hooks + pull Notion reel)
  - **F** — OMC update v4.10.1 → v4.13.0 (3 versions de retard)
  - **G** — Candidate D-ENFORCE-01 11e module Core OS (pattern declaratif 5e iteration)
  - **H** — **Execute D-PRODUCT-02 Module Product Autonomie** nouvelle conversation (plan prep 2026-04-19 : `docs/plans/2026-04-19-product-autonomie.md`, 5 phases × 15-20h, po-agent prompt elargi + /plan-os auto-push + post-commit debounced 30s + 3 routines daily/weekly/monthly + smart triggers). 9 stubs forward refs scripts deja crees.

**Reporte** : routines Cloud I-08 (14 documentees mais inertes), hook wiki-recall I-01 (API CLAUDE_USER_PROMPT inexistante), cortex enforcement I-05, brief adaptatif I-03.

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
| D-AUDIT-TOTAL-01 Audit total Foundation OS | 2026-04-19/20 | Audit exhaustif 11 axes + fixes + refactors + nouveau module 10e. 14 phases × 6 elements stricts anti-compactage. Livrables : 12 findings-Px + rapport-master 864L dans `docs/audits/2026-04-19-audit-total-foundation-os/` + 15+ commits atomiques (df4244a → P13). 15 ameliorations mesurables (wiki regen, cleanup 14 branches, foundation-os-map 10 modules, cortex 6 agents, CLAUDE.md P-XX cross-refs, tools.md Tools v2, brief v12 SANTE worktrees). 3 worktrees divergents documentees (jovial-jemison trading 45 commits, determined-torvalds 14 commits, condescending-ardinghelli 15 commits). Plan `.archive/plans-done-260419/2026-04-19-audit-total-foundation-os.md`. |
| D-MODEL-01 Module Model Awareness 10e Core OS | 2026-04-19 | 10e module Core OS — conscience version modele IA active. Spec `docs/core/model.md` (11 sections, Opus 4.7 1M context derive doc Anthropic officielle). Forces/faiblesses/optimisations FOS specifiques (layered loading L0-L3, subagent < 500 mots, pre-compaction snapshot, prompt caching 5-min TTL, parallel tool calls). Integration 9 autres modules Core OS. Workflow model upgrade documente. Architecture 9 → 10 modules. Pattern coherent body.md/product.md. Adopte dans le cadre D-AUDIT-TOTAL-01 Phase P9. |
| D-PRODUCT-01 Module Product 9e Core OS COMPLET 5/5 (Notion-only) | 2026-04-19 | 9e module Core OS "Product" — Integration bidirectionnelle FOS ↔ **Notion only** (pivot P1.5 apres abandon Asana payant + MCP limite). Agent `po-agent` sonnet expert Notion 100% (PO elargi : Foundation OS + modules + apps builder + apps futures a revendre). Skill `/po init\|sync\|pull\|status`. Hooks opt-in `PRODUCT_MCP_SYNC=1` (P4). Notion : archive ancien espace "🪐 Foundation OS" (→ "Archive 2026-04") + nouveau espace + **4 DB** (Decisions / Plans / Sessions / **Tasks**). DB Tasks absorbe ex-kanban Asana (Type=Phase\|Element\|US\|Task, Status enum, relation Plans). Mapping : 1 plan=1 row Plans, 1 phase=1 row Tasks Type=Phase, 6 elements=6 rows Tasks Type=Element. Views kanban Notion natives a creer P2 (board groupe par Status ou Module, timeline). Limites honnetes P-11 : rate limit Notion 3 req/s → batching, pas webhooks → pull session-start, last-write-wins conflits. Pattern orchestrateurs manifest-driven (bash ne peut invoquer MCP). Plan 5 phases ~18-22h post-pivot. Plan : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md`. |
| D-BODY-01 Module Body 8e Core OS COMPLET 5/5 | 2026-04-19 | 8e module Core OS "Body" (Proprioception Kevin-Claude, alignement intention ↔ action) livre integralement. 4 couches C1-C4 : Constitution `docs/core/constitution.md` (41 P-XX) + Intent capture `.omc/intent/` + Feedback structure `.omc/alignment/*.jsonl` (schema enrichi + retro-compat ratings.jsonl) + Learning loop (`scripts/alignment-analyze.sh` chain health-check INFO + `scripts/constitution-suggest.sh` flag 🎯 to-constitute + `.claude/agents/alignment-auditor.md` subagent clean-slate sonnet READ-ONLY). Integration : `/plan-os` Tour 1 bis intent-capture OBLIGATOIRE + `/session-end` Phase 7bis enrichie 4 questions + Phase 7ter auditor + Layered Loading L2 + CLAUDE.md section pre-action check (200L) + brief v12 tuile #14 🧭 ALIGNMENT. Inspire Constitutional AI (Anthropic) + Reflexion framework + IFEval + AlignmentCheck (Meta 41.77% drift). 3 pages wiki concepts (Body + Alignment + Constitution FOS). 6 commits `5d26166` + `c40a6de` + `c441b90` + `f0bf499` + `c67ffc0` + `fae30aa`. Plan `.archive/plans-done-260419/2026-04-19-body-module-complet.md` archive. |
| D-CONCURRENCY-01 Multi-session safety | 2026-04-19 | Audit concurrence + livraison minimaliste (B-lite). Spec `docs/core/concurrency.md` (7 hotspots + regle cloture serie + recette resolution). Fix snapshot collision (suffix worktree). CLAUDE.md section Multi-session. YAGNI : pas de lock par fichier (complexite > benefit dev solo, reevaluer si equipe). Commits `4ff56e0` + `117be29`. |
| D-TRADING-01 Backtest engine crypto v1 + Extension V1.1 | 2026-04-19 | Socle `modules/finance/trading/` operationnel + extension V1.1. Pipeline end-to-end : data (ccxt + Binance direct + Catalog Parquet + QualityChecker) → strategy framework (BaseStrategy Pydantic + 5 strategies : EMA cross + Donchian breakout + RSI mean-reversion + Multi-TF trend + Bollinger breakout + EMA/RSI/ATR indicators) → backtest runner pandas (fees/slippage vol-based/latency/funding) → harnesses anti-biais (WF/PurgedCV/MC/PBO/DSR) → analysis (PerformanceMetrics/HTMLReport tearsheet/RegimeClassifier) → execution bridges (PineGenerator v5 + 3Commas API HMAC + WebhookReceiver FastAPI + Nautilus Bridge skeleton B1 + NautilusLiveEngine skeleton B2 + KillSwitch). **94/94 tests + cov 86%** + CI GitHub Actions + ruff/mypy strict clean. Design `docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md` (471L) + plan `docs/plans/2026-04-19-finance-trading-backtest-engine.md` (3957L, 8 phases). Research specs futures : V1.2 Nautilus migration roadmap (263L), V1.2+ 3Commas maison (303L), V1.3+ Finance Dashboard maison (314L). Wiki : 6 concepts anti-biais + OMS/EMS + Portfolio Aggregator + 5 strategy pages + backtest smoke. Approche C hybride pragmatique. Subagent-driven-development execution. 45+ commits sur branche `claude/jovial-jemison-d31676` mergee main 2026-04-20. |
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
