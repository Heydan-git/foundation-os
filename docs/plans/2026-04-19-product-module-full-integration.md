---
title: "🪐 D-PRODUCT-01 Module Product Full Integration Notion+Asana (19-04-2026)"
decision: D-PRODUCT-01
created: 2026-04-19
status: draft
phases_total: 5
effort_estimated: 22-29h
dual_path: docs/plans/2026-04-19-product-module-full-integration.md
---

# 🪐 D-PRODUCT-01 Module Product — Full Integration Notion + Asana

## Context

Kevin a délaissé Notion+Asana depuis début 2026 malgré MCP connectés. Objectif : réintégrer via un **9e module Core OS "Product"** avec agent PO + skill `/po` bidirectionnel, qui reflète l'état FOS (décisions, plans, sessions) dans Notion+Asana **sans casser l'autonomie FOS**.

**Décisions prises (Kevin, pré-plan)** :
- Q1-a Espace Notion dédié (après archive existant stale)
- Q2-a 1 projet Asana unique avec sections par module (après archive 2 projets existants)
- Q3 compromis : **EPIC Asana=plan, US=phase, subtasks=6 éléments** (fin sans usine à gaz)
- Q4-b Full d'un coup méticuleux (22-29h en 1 session Opus 4.7, pattern D-BODY-01)
- Q5-a Archive Notion + reset propre
- Q6-a Archive les 2 projets Asana + crée nouveau unique

**Pre-check MCP (fait pendant Plan Mode)** :
- ✅ Notion MCP callable. Espace "🪐 Foundation OS" (`33721e30-0c7b-812d-923a-f0f229508a24`) existe avec 9 sous-pages stale (ADR D-PLAN-01/D-WT-01/D-TOOLS-01, Roadmap obsolète, 2x Phase 5 Connected Demo historiques). **À archiver en bloc**.
- ✅ Asana MCP callable. Workspace `1213280972575193`. 2 projets existants :
  - "Foundation OS — Setup" (`1213918098666338`) : **22/22 tasks done, clos 2026-04-14**. Historique valuable.
  - "Foundation OS — Build" (`1214059589666268`) : **0/0 tasks, vide**. Créé mais jamais utilisé.

**Règle source of truth (immuable)** :
- **FOS MD gagne structure** (schema, décisions spec, code)
- **Notion/Asana gagnent ordre/priorité humaine** (Kevin drag cards, ajoute commentaires)
- **Last-write-wins par champ** sur conflit (pas de 3-way merge, YAGNI solo)

**Inspirations FOS existantes** : `docs/core/body.md` (pattern 11 sections 4 couches), `docs/core/planner.md` (workflow commands), `docs/core/knowledge.md` (5 tiers zero duplication), pattern D-BODY-01 (dogfooding + stubs forward refs + 5 phases 6 éléments).

---

## Objectifs (mesurables)

1. ✅ 9e module Core OS `docs/core/product.md` + agent `po-agent` + skill `/po`
2. ✅ Bidirectionnel : FOS → Notion+Asana (push) + Notion+Asana → FOS (pull)
3. ✅ Mapping : 1 plan = 1 EPIC Asana, 1 phase = 1 US, 6 éléments phase = 6 subtasks
4. ✅ Notion DB : Decisions / Plans / Sessions miroir FOS
5. ✅ Tuile brief v12 #16 📊 PRODUCT
6. ✅ Hooks opt-in (PRODUCT_MCP_SYNC=1) + offline fallback
7. ✅ Zero régression : FOS marche sans Notion/Asana (tous les checks health SAIN)

---

## Architecture cible

```
┌─────────────────── FOS (source structure) ────────────────────┐
│  CONTEXT.md / docs/plans/ / wiki/meta/sessions-recent.md       │
└──────────────┬─────────────────────────────┬──────────────────┘
               │ push                        │ push
               ▼                             ▼
┌─────────── Notion "🪐 Foundation OS" ──┐  ┌── Asana "Foundation OS" ──┐
│  DB Decisions                           │  │ Sections = modules         │
│  DB Plans                               │  │ EPICs = plans              │
│  DB Sessions                            │  │ US = phases                │
│  Page Roadmap (derive CONTEXT.md Cap)   │  │ Subtasks = 6 éléments      │
└──┬──────────────────────────────────────┘  │ Kanban = custom field      │
   │                                         │   Status                   │
   │         pull (priorité humaine)         └──┬─────────────────────────┘
   │                                            │ pull (ordre kanban)
   ▼                                            ▼
┌──────────────── FOS update proposé via TodoWrite ──────────────┐
│  Brief v12 tuile #16 📊 PRODUCT                                 │
│  /po pull --preview → diff                                      │
│  /po pull --apply → update CONTEXT.md ordre priorité            │
└────────────────────────────────────────────────────────────────┘
```

---

## Composants livrés

| # | Chemin | Type | Rôle |
|---|--------|------|------|
| 1 | `docs/core/product.md` | Spec canonique | 11 sections module, règles sync, mapping, limites |
| 2 | `.claude/agents/po-agent.md` | Agent FOS sonnet | Task invocable gestion produit + MCP Notion/Asana |
| 3 | `.claude/commands/po.md` | Skill FOS | `/po init\|sync\|pull\|status` |
| 4 | `scripts/po-init.sh` | Script bash | Archive existants + scaffold nouveaux via MCP |
| 5 | `scripts/po-sync.sh` | Script bash | Push FOS → Notion+Asana (avec batching + dry-run) |
| 6 | `scripts/po-pull.sh` | Script bash | Pull Notion+Asana → propose updates FOS |
| 7 | `scripts/po-status.sh` | Script bash | Diff FOS vs externe (chain health-check INFO) |
| 8 | `scripts/hooks/product-session-start.sh` | Hook | Pull léger < 10s non-bloquant (opt-in) |
| 9 | `scripts/hooks/product-session-end.sh` | Hook | Push best-effort avec retry 1x |
| 10 | `docs/core/communication.md` | Edit | Tuile brief v12 #16 📊 PRODUCT |
| 11 | `docs/core/architecture-core.md` | Edit | Table 8→9 modules Core OS |
| 12 | `CONTEXT.md` | Edit | Row Module Product + decision D-PRODUCT-01 |
| 13 | `CLAUDE.md` | Edit | Section Core OS ref Product |
| 14 | `.claude/settings.json` | Edit | 2 hooks Product opt-in env flag |
| 15 | `wiki/concepts/Product Management.md` | Nouveau | Concept core |
| 16 | `wiki/concepts/Notion integration.md` | Nouveau | Concept impl rate limits + workflow |
| 17 | `wiki/concepts/Asana integration.md` | Nouveau | Concept impl EPIC/US/subtasks kanban |

---

## Phases (5 × 6 éléments stricts — anti-compactage)

### P1 — Bootstrap + Spec + Archive existants (4-5h)

**1. Pre-conditions**
- Health-check SAIN confirmé en début phase
- MCP Notion+Asana callable (fait ✓)
- Worktree `bold-neumann-7e682b` propre (commit `.omc/project-memory.json` d'abord si uncommitted)

**2. État repo avant**
- 0 plan actif `docs/plans/`, 8 modules Core OS
- Notion : espace "🪐 Foundation OS" ancien avec 9 sous-pages
- Asana : "Setup" 22/22 + "Build" 0/0 (non-archivés)

**3. Actions atomiques**
- `bash scripts/intent-capture.sh d-product-01-bootstrap --demand "Module Product 9e Core OS — archive Notion+Asana existants + scaffold spec/agent/skill/scripts"`
- Créer `docs/core/product.md` (11 sections canoniques style body.md, ~400L)
- Créer `.claude/agents/po-agent.md` stub (frontmatter `name: po-agent, model: sonnet, description: ...` + placeholder scope)
- Créer `.claude/commands/po.md` stub (format `# /po — desc` + subcommandes init/sync/pull/status placeholders)
- Créer `scripts/po-init.sh` (MCP calls complets : archive Notion + Asana + scaffold nouveaux)
- Créer stubs forward refs : `scripts/po-sync.sh`, `po-pull.sh`, `po-status.sh` (exit 0 + echo "pending PN", `--quiet` mode)
- Exécuter `bash scripts/po-init.sh` :
  - Notion : rename "🪐 Foundation OS" → "🪐 Foundation OS — Archive 2026-04" (via MCP `notion-update-page`)
  - Notion : créer nouveau espace "🪐 Foundation OS" avec 3 databases (Decisions/Plans/Sessions) via `mcp notion-create-database`
  - Asana : `update_project archived=true` sur gid `1213918098666338` (Setup) et `1214059589666268` (Build)
  - Asana : `create_project name="Foundation OS"` + sections (Core OS, App Builder, Design System, Knowledge, Body, Phase 5) + custom field Status enum
- Update `CONTEXT.md` section Modules : ajouter row Product
- Update `docs/core/architecture-core.md` : table 8→9 modules + section Product 10L
- Ajouter decision D-PRODUCT-01 dans `CONTEXT.md` section Decisions
- Copier plan dual-path : `cp ~/.claude/plans/sunny-sauteeing-truffle.md docs/plans/2026-04-19-product-module-full-integration.md`

**4. Vérification**
- `bash scripts/health-check.sh` → SAIN (0 critical, 0 warning) — **bloquant**
- `bash scripts/ref-checker.sh` → 0 broken refs (stubs forward empêchent cassure) — **bloquant**
- `mcp notion-search "Foundation OS"` → retourne NOUVEAU espace + archive distinct
- `mcp asana get_projects` → "Foundation OS" (nouveau) actif + "Setup"+"Build" archivés
- `bash scripts/po-init.sh --dry-run` → log actions sans exécuter
- `cat docs/core/product.md | wc -l` → ~400L, 11 sections présentes
- `TodoWrite` créé : 5 todos P1-P5 (P1 in_progress)

**5. Rollback**
- Si archive Notion fail : `notion-update-page` revert title
- Si archive Asana fail : `update_project archived=false` sur les 2 projets
- Si création Notion DB/Asana fail : `notion-delete` / `delete_project` sur les nouveaux
- Si stubs cassent health : `git checkout HEAD -- .` (commit atomique non-fait)

**6. Commit message préformate**
```
feat(os): P1 bootstrap module Product + archive Notion/Asana (D-PRODUCT-01 1/5)

- docs/core/product.md : spec canonique 11 sections module non-foundational
- .claude/agents/po-agent.md : stub sonnet (Task invocable)
- .claude/commands/po.md : skill /po stub (init/sync/pull/status)
- scripts/po-init.sh : archive + scaffold MCP (idempotent, --dry-run mode)
- scripts/po-sync.sh, po-pull.sh, po-status.sh : stubs forward refs
- Notion : archive espace existant + création propre avec 3 DB (Decisions/Plans/Sessions)
- Asana : archive Setup (22/22) + Build (vide) + création projet unique avec sections par module
- CONTEXT.md : row Product + decision D-PRODUCT-01
- docs/core/architecture-core.md : 8→9 modules

Verifs : health SAIN, ref-checker 0, MCP calls idempotents, intent-capture OK.
Plan : docs/plans/2026-04-19-product-module-full-integration.md
```

---

### P2 — Push FOS → Notion+Asana (6-8h)

**1. Pre-conditions** : P1 commité, MCP calls réussis, nouveaux espaces propres

**2. État repo avant** : stubs po-sync/pull/status, agent sans prompt, skill subcommandes vides

**3. Actions atomiques**
- `scripts/po-sync.sh` implémentation :
  - Parse `CONTEXT.md` section Decisions → push vers Notion DB Decisions (idempotent : match par Title = D-XXX-NN, update si existe)
  - Parse `docs/plans/*.md` + `.archive/plans-done-*/*.md` → push vers Notion DB Plans
  - Parse `wiki/meta/sessions-recent.md` → push vers Notion DB Sessions
  - Parse plans actifs + TodoWrite → créer EPIC Asana = plan (name = slug plan, description = titre)
  - Phases du plan (ex: P1 P2 P3 P4 P5) → US Asana (1 task par phase, section = module détecté)
  - 6 éléments stricts par phase → subtasks Asana (sous chaque US)
  - Custom field Status : Todo par défaut, "Done" si phase commitée (detect via `[x]` dans Execution log ou frontmatter phases_done)
  - Batching : 10 req/s Notion max, 100/min Asana max (sleep adapté)
  - Modes : `--dry-run`, `--plan <slug>` (1 seul plan), `--since YYYY-MM-DD` (decisions/sessions récentes seulement)
- `.claude/agents/po-agent.md` prompt complet : scope push + règles + tools whitelist (Read, Glob, Grep, Bash, MCP Notion+Asana)
- `.claude/commands/po.md` `/po sync [--dry-run|--plan]` subcommande
- Templates Notion : schemas DB avec propriétés typées (Title, Date, Select, Multi-select, Relation)

**4. Vérification**
- `bash scripts/po-sync.sh --dry-run` → log actions attendues
- `bash scripts/po-sync.sh` → live sync
- Notion DB Decisions : 15+ rows (D-BODY-01, D-CONCURRENCY-01, D-INTEG-01, D-MAPPING-01, etc. — voir CONTEXT.md L91-105)
- Asana : EPIC "D-PRODUCT-01" créé avec 5 US (P1-P5) + 30 subtasks (6 par phase)
- `mcp notion-fetch <db_id>` → rows présentes
- `mcp asana get_tasks --project <new_project_gid>` → tasks cohérentes
- Idempotence : `bash scripts/po-sync.sh` relancé → 0 duplicate (update seulement)
- Rate limit : aucun 429 dans logs

**5. Rollback**
- Si sync partielle : `bash scripts/po-unsync.sh` (supprime rows/tasks marquées tag "d-product-01")
- Si erreur 429 : backoff exponentiel 3 retries, puis abort avec log

**6. Commit message préformate**
```
feat(os): P2 push FOS→Notion+Asana + agent po-agent complet (D-PRODUCT-01 2/5)

- scripts/po-sync.sh : impl Decisions/Plans/Sessions→Notion DB, Plans/Phases/Eléments→Asana EPIC/US/subtasks
- .claude/agents/po-agent.md : prompt push + tools whitelist + règles
- .claude/commands/po.md : /po sync impl
- Templates Notion : 3 DB schemas (Decisions, Plans, Sessions) propriétés typées
- Mapping : 1 plan=1 EPIC, 1 phase=1 US, 6 éléments=6 subtasks

Verifs : --dry-run ok, live sync 15 decisions + 5 EPICs + 30 subtasks sans 429, idempotence par tag.
```

---

### P3 — Pull Notion+Asana → FOS + Tuile brief v12 #16 (6-8h)

**1. Pre-conditions** : P2 commité, données réelles Notion+Asana présentes

**2. État repo avant** : scripts po-pull stub, règle conflit doc non implémentée, brief 15 tuiles

**3. Actions atomiques**
- `scripts/po-pull.sh` implémentation :
  - Lire Notion DB Decisions : détecter rows modifiées par Kevin (updated_at > `.omc/po-last-sync.json`)
  - Lire Asana tasks : détecter `status` change, nouveaux commentaires, priorité modifiée
  - Générer diff vs CONTEXT.md + plans actuels
  - Mode `--preview` : afficher diff sans apply
  - Mode `--apply` : auto-apply updates triviales (ordre priorité → TodoWrite order, commentaires Asana → append brief tuile #16)
  - Mode `--interactive` : demande confirmation par update
  - Persistance : `.omc/po-last-sync.json` (timestamp par source)
- `docs/core/communication.md` ajout tuile #16 📊 PRODUCT :
  - Position : après 📦 MODULES (#6), avant ⚠️ ATTENTION (#7)
  - Contenu : table Kanban état (N Todo / M In Progress / K Done / L Blocked) + divergences FOS↔Externe + 3 derniers commentaires Asana
  - Section 6.1 (template), 6.3 (rendu), 6.4 (sources)
- `docs/core/product.md` section "Source of truth + Conflit resolution" complétée (exemples concrets)

**4. Vérification**
- Test manuel : Kevin déplace card Asana Todo→In Progress (via MCP simulable)
- `bash scripts/po-pull.sh --preview` → détecte 1 change, propose update
- `bash scripts/po-pull.sh --apply` → update TodoWrite + log
- Re-exécuter `/session-start` → brief v12 tuile #16 📊 PRODUCT rendue + data-driven
- Test conflit : modifier CONTEXT.md décision + `mcp notion-update` même row → last-write gagne par champ, log warning

**5. Rollback**
- Si pull casse CONTEXT.md : `git checkout HEAD -- CONTEXT.md`
- Si tuile mal rendue : revert section 6.1 communication.md

**6. Commit message préformate**
```
feat(os): P3 pull Notion+Asana→FOS + tuile brief v12 #16 PRODUCT (D-PRODUCT-01 3/5)

- scripts/po-pull.sh : detect changes, diff, modes preview/apply/interactive
- .claude/commands/po.md : /po pull + /po status impl
- docs/core/communication.md : tuile #16 📊 PRODUCT (section 6.1 template + 6.3 rendu + 6.4 sources)
- docs/core/product.md : section "Source of truth + Conflit" complétée
- .omc/po-last-sync.json : persistance timestamps

Verifs : Kevin move card → pull detecte → TodoWrite propose, tuile #16 affichee brief, conflit last-write par champ.
```

---

### P4 — Hooks auto + offline fallback (3-4h)

**1. Pre-conditions** : P3 commité, push+pull fonctionnels en manuel

**2. État repo avant** : 3 hooks actifs (drift-detector, auto-archive-plans, pre-compaction-snapshot). Pas de hook Product.

**3. Actions atomiques**
- `scripts/hooks/product-session-start.sh` :
  - Invoque `bash scripts/po-pull.sh --preview` avec timeout 10s
  - Si timeout OR MCP offline : log `.omc/logs/product-sync-errors.log` + skip (exit 0)
  - Sinon : mise à jour données brief tuile #16 dans `.omc/product-state.json`
- `scripts/hooks/product-session-end.sh` :
  - Invoque `bash scripts/po-sync.sh --since <session_start>` avec timeout 30s
  - Retry 1x si erreur transitoire
  - Si MCP down : log + skip
- `.claude/settings.json` : ajout hooks avec `enabled: true` si env `PRODUCT_MCP_SYNC=1`, sinon skip
- Documentation `docs/core/product.md` section "Hooks + Offline fallback" (pattern + env flag + rollback safe)

**4. Vérification**
- `PRODUCT_MCP_SYNC=1 bash scripts/hooks/product-session-end.sh` → push ok
- Simuler MCP offline (disable network 30s) → hook skip + log, exit 0
- `/session-start` sans env flag → pas d'appel hook (default OFF)
- `PRODUCT_MCP_SYNC=1 /session-start` → brief v12 tuile #16 data-driven via hook pull

**5. Rollback**
- `.claude/settings.json` : revert entries hooks
- `scripts/hooks/product-*.sh` : delete ou no-op

**6. Commit message préformate**
```
feat(os): P4 hooks auto Product + offline fallback (D-PRODUCT-01 4/5)

- scripts/hooks/product-session-start.sh : pull léger timeout 10s non-bloquant
- scripts/hooks/product-session-end.sh : push best-effort retry 1x
- .claude/settings.json : 2 hooks opt-in via PRODUCT_MCP_SYNC=1
- docs/core/product.md : section Hooks + Offline fallback

Verifs : hooks online (sync ok) + offline (skip + log), session-start/end non cassées sans flag env.
```

---

### P5 — Wiki concepts + Test end-to-end + Archive (3-4h)

**1. Pre-conditions** : P1-P4 commités, push+pull+hooks fonctionnels

**2. État repo avant** : 51 pages wiki, 0 pages Product. Plan actif dans `~/.claude/plans/`.

**3. Actions atomiques**
- Créer `wiki/concepts/Product Management.md` (concept core, confidence high, wikilinks [[Foundation OS]] + [[Core OS]] + [[Body]] + [[Alignment]])
- Créer `wiki/concepts/Notion integration.md` (concept impl : rate limits, workflow, mapping, limites)
- Créer `wiki/concepts/Asana integration.md` (concept impl : EPIC/US/subtasks, kanban, custom fields, sections)
- Test end-to-end scénarios :
  - **S1** : créer plan nouveau (stub) → `/po sync` → Asana EPIC/US/subtasks + Notion DB Plans row créée
  - **S2** : `mcp asana update_tasks` déplace 1 task Todo→In Progress → `/po pull --preview` détecte → TodoWrite propose update
  - **S3** : MCP offline (simulé) → hooks skip, FOS autonome (health SAIN conservé)
  - **S4** : conflit `CONTEXT.md edit` + `mcp notion-update` même row simultané → last-write par champ, log warning
- Update `CONTEXT.md` Modules : Product = ✅ COMPLET 5/5
- Update `wiki/hot.md` section Last Updated : D-PRODUCT-01 COMPLET
- Append `wiki/meta/sessions-recent.md` : nouvelle session (trim ancienne si > 5)
- Append `wiki/meta/lessons-learned.md` si découvertes durant P1-P4 (pattern MCP batching, gestion 429, offline fallback)
- Archive plan : `mv ~/.claude/plans/sunny-sauteeing-truffle.md .archive/plans-done-260419/2026-04-19-product-module-full-integration.md`

**4. Vérification**
- `bash scripts/wiki-health.sh` → 54 pages, SAIN, hot.md 0j — **bloquant**
- `bash scripts/health-check.sh` → SAIN, 0 regression — **bloquant**
- `bash scripts/ref-checker.sh` → 0 broken
- Tests S1-S4 documentés avec sortie attendue
- `git log --oneline` → 5 commits atomiques P1-P5 conventional format
- `/po status` → état sync cohérent

**5. Rollback**
- Si tests fail : revert commit P5, fix avant nouvelle session (pas cascade sur P1-P4 qui restent commités)
- Si wiki concepts cassent wiki-health : delete + relancer

**6. Commit message préformate**
```
feat(os): P5 wiki concepts + test e2e + archive (D-PRODUCT-01 5/5 COMPLET)

- wiki/concepts/Product Management.md : concept core 9e module
- wiki/concepts/Notion integration.md : concept impl bidirectionnel
- wiki/concepts/Asana integration.md : concept impl EPIC/US/subtasks
- Tests end-to-end : 4 scenarios (push S1, pull S2, offline S3, conflit S4) validés
- CONTEXT.md : Product COMPLET + decision D-PRODUCT-01 actée
- wiki/hot.md + sessions-recent.md + lessons-learned.md : update
- Archive plan .archive/plans-done-260419/2026-04-19-product-module-full-integration.md

Verifs : wiki-health 54 pages SAIN, health-check SAIN, 4 scenarios e2e OK, /po status complet.
Decision : D-PRODUCT-01 COMPLET Module Product Full Integration Notion+Asana (9e Core OS).
```

---

## Notion + Asana : structure cible détaillée

### Notion workspace "🪐 Foundation OS" (nouveau, après archive de l'ancien)

**3 databases** :

| DB | Propriétés |
|----|-----------|
| **Decisions** | Title (text), Code (text D-XXX-NN), Date (date), Module (select), Status (select: Actif/Superseded/Archive), Source ref (URL) |
| **Plans** | Title (text), Slug (text), Decision ref (relation Decisions), Status (select: draft/active/done/archived), Phases total (number), Phases done (number), Effort estimé (text), Path archive (text) |
| **Sessions** | Date (date), Duration (text), Scope (text), Commits (text), Decisions ref (relation Decisions), Livraison summary (text rich), Revelations (text rich) |

**Pages** :
- `🗺️ Roadmap` (derive auto CONTEXT.md section Cap via `/po sync`)
- `📋 Architecture` (pointer vers `docs/core/architecture-core.md`)

### Asana project "Foundation OS" (nouveau)

**Sections** (= modules) :
- 🧠 Core OS (9 modules)
- 💻 App Builder
- 🎨 Design System
- 📚 Knowledge / Wiki
- 🤝 Cowork
- 🚀 Phase 5 (Finance/Sante/Trading)

**Custom fields** :
- **Status** (enum) : Todo / In Progress / Done / Blocked
- **Phase** (text) : P1-PN
- **Decision ref** (text) : D-XXX-NN
- **Module** (enum) : derivé automatiquement de section

**Vues** :
- Kanban (groupé par Status)
- List (groupé par Section=Module)
- Timeline (groupé par Decision ref)

---

## Limites explicites (P-10 pragmatisme, P-11 conscience)

1. **Rate limits MCP** : Notion 3 req/s, Asana 150/min → batching en fin session
2. **Pas de webhooks** : pull au session-start, **pas temps réel**
3. **Conflits** : last-write-wins par champ (pas de 3-way merge)
4. **Offline fallback** : FOS continue autonome, hooks skip + log
5. **Opt-in hooks** : `PRODUCT_MCP_SYNC=1` default OFF pour éviter casse session si MCP down
6. **Pas de wiki→Notion sync P1-P5** : reporté (wiki=second-brain, Notion=miroir structure, séparation claire)
7. **Subtasks Asana = 6 éléments par phase** : si Asana limite subtasks par task, fallback en description task (raison : Asana max 20 subtasks/task, 6 OK)
8. **Archive Notion = rename** (pas delete) : garde historique récupérable

---

## Verification end-to-end globale (post-P5)

```bash
# Pre-flight health
bash scripts/health-check.sh    # SAIN
bash scripts/wiki-health.sh      # SAIN 54 pages
bash scripts/ref-checker.sh      # 0 broken

# Commandes /po
/po init       # déjà fait P1
/po sync       # push FOS → Notion+Asana
/po pull       # pull Notion+Asana → propose
/po status     # diff FOS vs externe

# Hooks (avec PRODUCT_MCP_SYNC=1)
/session-start  # pull léger → brief v12 tuile #16 data-driven
/session-end    # push decisions + session

# Scenarios e2e (P5)
# S1 new plan → sync → Asana EPIC/US/subtasks + Notion DB row
# S2 Kevin move card → pull → TodoWrite update + brief tuile
# S3 MCP offline → hooks skip, FOS autonome
# S4 conflit edit parallèle → last-write gagne par champ
```

---

## Effort total

| Phase | Effort | Dépendances | Checkpoint |
|-------|--------|-------------|-----------|
| P1 Bootstrap + Archive | 4-5h | Pre-checks MCP (fait ✓) | Health SAIN + MCP archives OK |
| P2 Push | 6-8h | P1 | 15 decisions + 5 EPICs synced |
| P3 Pull + Brief tuile | 6-8h | P2 | Tuile #16 data-driven + conflit testé |
| P4 Hooks auto | 3-4h | P3 | Online + offline testés |
| P5 Wiki + Tests + Archive | 3-4h | P4 | 4 scenarios e2e + archive |
| **TOTAL** | **22-29h** | Full d'un coup Opus 4.7 1M context | Zero régression à chaque phase |

---

## Red flags surveillés (P-03 anti-bullshit)

- [ ] Health check DEGRADED → stop + fix avant phase suivante
- [ ] Plus de MD que de code (P-19) : target ~50% code+script / 50% MD (justifié : spec Core OS + agent + skill + wiki)
- [ ] Tokens context > 60% → pre-compaction snapshot (hook INT-1 actif)
- [ ] Rate limit 429 → batching à ajuster immédiatement
- [ ] Kevin challenge cadrage → stop + réévaluer (pas défense)

---

## Dogfooding (intrinsèque D-BODY-01 pattern)

- P1 : `intent-capture.sh` utilisé pour ce plan (verbatim Kevin + scope + anti-scope)
- P2 : première utilisation de `/po sync` pour pousser le plan D-PRODUCT-01 lui-même dans Asana
- P5 : `/po status` vérification finale cohérence

---

## Decision

**D-PRODUCT-01** Module Product Full Integration Notion+Asana (9e Core OS). Pattern Option C ambitieuse (5 phases d'un coup) + minutie 6-éléments stricts (D-BODY-01 validé).
