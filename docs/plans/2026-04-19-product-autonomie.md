---
title: "🪐 D-PRODUCT-02 Module Product Autonomie & Intégration Profonde (19-04-2026)"
decision: D-PRODUCT-02
created: 2026-04-19
status: draft
phases_total: 5
effort_estimated: 15-20h
predecessor: D-PRODUCT-01
dual_path: docs/plans/2026-04-19-product-autonomie.md
---

# 🪐 D-PRODUCT-02 Module Product — Autonomie & Intégration Profonde

> **Plan écrit 2026-04-19 en session `bold-neumann-7e682b` après D-PRODUCT-01 COMPLET 5/5 (commit `9b102c4` sur main). Kevin demande de passer de "sync de surface" à "PO qui vit le projet en continu".**
>
> **Auto-contenu** : ce plan contient TOUT le contexte nécessaire pour qu'une NOUVELLE session Claude puisse l'exécuter sans connaître la conversation précédente. Pattern `feedback_plans_ultra_detailles.md` appliqué (6 éléments stricts par phase).

---

## 🔄 Pour reprendre dans une nouvelle conversation

**Commande Kevin dans nouvelle session** : `"On execute D-PRODUCT-02 plan docs/plans/2026-04-19-product-autonomie.md"`

**Pré-requis Claude nouvelle session (Tours obligatoires)** :

1. `/session-start` normal — Tour 1 (parallèle) : Read CONTEXT.md + hot.md + sessions-recent + lessons-learned + thinking + constitution + Bash git status + health-check + wiki-health + Glob docs/plans/*.md
2. Read `docs/plans/2026-04-19-product-autonomie.md` (ce plan) — CRITIQUE
3. Read `docs/core/product.md` (spec D-PRODUCT-01 livrée)
4. Read `.omc/product-config.json` (IDs Notion courants)
5. Read `.claude/agents/po-agent.md` (prompt actuel à enrichir P1)
6. `bash scripts/po-status.sh` (vérifier état Notion sync : 16D / 1+5P / 5S / 6T attendus)
7. `bash scripts/intent-capture.sh d-product-02-autonomie --demand "<verbatim Kevin depuis brief D-PRODUCT-02>"`
8. TodoWrite 5 phases P1-P5
9. Créer nouveau worktree via `/wt new product-autonomie-260420` OU reprendre bold-neumann-7e682b

**Si conflit contexte** : lire ce plan + spec product.md suffit pour reprendre. Les IDs Notion sont dans `.omc/product-config.json`.

---

## Context

### Ce qu'on a (D-PRODUCT-01 COMPLET 5/5, 2026-04-19, commit `9b102c4`)

4 DB Notion peuplées + 4 views + agent `po-agent` (prompt surface) + skill `/po` (manuel) + hooks opt-in (stubs légers).

**État honnête** : la plomberie est posée, mais **le PO ne vit pas le projet**. Kevin doit appeler `/po sync` manuellement. Aucune automatisation de workflow.

### Ce qu'on veut (D-PRODUCT-02 AUTONOMIE 5/5)

Le PO **agit en continu**, intégré à tous les événements FOS :
- **`/plan-os` → auto-push** : nouveau plan créé = Notion peuplé dans la même session
- **Commit → debounced 30s** : commit avec pattern `D-XXX-NN PN` = update DB Tasks Status=Done
- **Routines `/schedule`** : daily brief + weekly review + monthly retro → pages Notion auto-générées
- **Smart triggers** : `/save` décision = link DB Decisions / plan archive = Status=archived / lessons 🎯 = notification
- **Prompt PO enrichi** : invoque agents externes (os-architect, dev-agent, review-agent) + skills (product-management:*)

### 4 décisions validées Kevin (2026-04-19)

- **Q1-c** : Autonomie **mixte** — auto pour création structure (EPIC, US, subtasks), **propose via TodoWrite** pour destructif (delete, archive)
- **Q2-b** : Post-commit **debounced 30s** — pas live (rate limit), pas uniquement session-end (trop tard)
- **Q3-b** : Routines `/schedule` Desktop — cron natif Claude Code (pas GitHub Actions, trop compliqué avec tokens Notion)
- **Q4-a** : Full d'un coup **15-20h en 1 session** Opus 4.7 1M context (pattern D-BODY-01 + D-PRODUCT-01 validé 3× avec commits atomiques par phase)

---

## IDs Notion persistants (référence critique)

**Source canonique** : `.omc/product-config.json` — à lire systématiquement au début.

| Ressource | ID |
|-----------|-----|
| Notion workspace user | `4f1b99db` |
| Root espace "🪐 Foundation OS" | `34721e30-0c7b-8109-ad34-cc6baec0f265` |
| Archive espace "Archive 2026-04" | `33721e30-0c7b-812d-923a-f0f229508a24` |
| DB Decisions data_source | `8abb85ef-8806-49a0-ba08-c58b464ce4c9` |
| DB Plans data_source | `47fda921-85b6-43cf-a7ec-efbc03d3b953` |
| DB Sessions data_source | `218baff4-e4fe-4e9d-b59d-ccdcc130d355` |
| DB Tasks data_source | `716e6844-eca0-4a33-9c40-7a52f6ed07b3` |
| View Kanban by Status | `view://34721e30-0c7b-812b-b464-000c6ff41456` |
| View Kanban by Module | `view://34721e30-0c7b-8113-a706-000c8fe33035` |
| View Timeline Tasks | `view://34721e30-0c7b-8121-b03e-000cbb628d88` |
| View Timeline Plans | `view://34721e30-0c7b-8147-88c0-000c44de4437` |

---

## Objectifs mesurables D-PRODUCT-02

1. ✅ Prompt `po-agent` enrichi : contexte cognitif obligatoire (6 fichiers lus avant action) + agents/skills invocables (5 agents + 7 skills)
2. ✅ Integration `/plan-os` : nouveau plan → Notion auto-peuplé en 1 tour (EPIC + 5 US + optionnel 30 subtasks)
3. ✅ Post-commit debounced 30s : commit pattern `D-XXX-NN PN` → task Status update
4. ✅ 3 routines Notion : daily-brief + weekly-review + monthly-retro (pages auto-générées)
5. ✅ Smart triggers : `/save` décision + plan archive + lessons 🎯 to-constitute + tuile brief v12 #17 enrichie
6. ✅ Zero régression : FOS marche sans `PRODUCT_MCP_SYNC=1` (default OFF, hooks opt-in)
7. ✅ Tests live 4 scénarios validés (plan-os auto-push, commit debounce, routine daily, smart trigger)

---

## Architecture cible

```
┌──────────────────────── Événements FOS (auto-triggers) ────────────────────────┐
│                                                                                  │
│  /plan-os ExitPlanMode  ─────→  Task po-agent "structure ce plan Notion"        │
│                                 → create EPIC + US + subtasks DB Tasks           │
│                                                                                  │
│  git commit (pattern PN) ─────→ debounce 30s ─→ scripts/po-commit-sync.sh       │
│                                 → manifest update DB Tasks Status=Done           │
│                                                                                  │
│  /session-start          ─────→ hook pull léger → brief v12 tuile #17 enrichie  │
│  /session-end            ─────→ hook push progress + session summary Notion      │
│                                                                                  │
│  /schedule daily         ─────→ scripts/po-daily-brief.sh → page Notion          │
│  /schedule weekly        ─────→ scripts/po-weekly-review.sh → page + metrics     │
│  /schedule monthly       ─────→ scripts/po-monthly-retro.sh → page + lessons     │
│                                                                                  │
│  /save décision          ─────→ link DB Decisions + wiki page (smart trigger)    │
│  Plan archive            ─────→ DB Plans Status=archived + timeline close        │
│  Lessons 🎯 to-constitute  ───→ comment Notion row Decisions correspondante     │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌──────────────────────── Agent po-agent enrichi ─────────────────────────────────┐
│  CONTEXTE COGNITIF (lit AVANT chaque action) :                                   │
│  - CONTEXT.md (état modules + decisions)                                          │
│  - docs/core/body.md + constitution.md (principes P-XX)                           │
│  - docs/core/product.md (spec)                                                    │
│  - wiki/meta/thinking.md + lessons-learned.md (insights)                          │
│                                                                                  │
│  AGENTS INVOCABLES (Task spawn) :                                                │
│  - os-architect (opus) : decisions tech stack/schema                             │
│  - dev-agent (sonnet) : code React/TS                                            │
│  - doc-agent (sonnet) : documentation                                            │
│  - review-agent (sonnet) : audit + zero regression                               │
│  - alignment-auditor (sonnet, clean-slate) : verif alignment                     │
│                                                                                  │
│  SKILLS INVOCABLES (Skill tool) :                                                │
│  - product-management:sprint-planning                                            │
│  - product-management:synthesize-research                                        │
│  - product-management:write-spec                                                 │
│  - product-management:roadmap-update                                             │
│  - product-management:metrics-review                                             │
│  - product-management:competitive-brief                                          │
│  - product-management:stakeholder-update                                         │
│                                                                                  │
│  OUTPUTS STRUCTURÉS :                                                            │
│  1. Actions MCP Notion (create/update rows/pages/views)                          │
│  2. Changements FOS (TodoWrite + edits CONTEXT/plans)                            │
│  3. Rapport compact brief v12 tuile #17                                          │
│  4. Metriques (velocity, cycle time, divergences, commentaires Kevin)            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phases (5 × 6 éléments stricts — anti-compactage)

### P1 — Prompt po-agent enrichi + agents/skills invocables (~3h)

**1. Pre-conditions**
- D-PRODUCT-01 COMPLET (commit `9b102c4` sur main, vérifier avec `git log --oneline -3 main`)
- `.claude/agents/po-agent.md` existe (version D-PRODUCT-01 "surface")
- `.omc/product-config.json` v1.1 présent avec IDs Notion
- Health-check SAIN (warnings cosmétiques acceptés)
- Intent-capture fait en début nouvelle session

**2. État repo avant**
- `po-agent.md` : ~180 lignes, prompt scope + mission + hors scope + expertise Notion
- Pas de contexte cognitif obligatoire
- Pas d'agents invocables
- Pas de skills externes référencés
- Outputs format basique

**3. Actions atomiques**
- Read `.claude/agents/po-agent.md` (intégral)
- Read `.claude/agents/os-architect.md`, `dev-agent.md`, `doc-agent.md`, `review-agent.md`, `alignment-auditor.md` (pattern)
- Rewrite `po-agent.md` avec sections enrichies :
  - **Section "CONTEXTE COGNITIF OBLIGATOIRE"** : liste 6 fichiers à Read en début de chaque invocation (CONTEXT.md, docs/core/body.md, constitution.md, product.md, wiki/meta/thinking.md, lessons-learned.md). Format Markdown liste avec pourquoi chaque fichier.
  - **Section "AGENTS INVOCABLES VIA TASK"** : 5 agents listés avec triggers (quand invoquer chacun) + exemple prompt
  - **Section "SKILLS EXTERNES INVOCABLES"** : 7 skills product-management:* listés avec use cases
  - **Section "TRIGGERS AUTOMATIQUES"** : 6 événements qui réveillent PO (plan-os, commit, session, schedule, save, archive)
  - **Section "OUTPUTS STRUCTURÉS"** : format rapport 6 sections (actions MCP, changes FOS, rapport brief, metrics, divergences, next steps)
  - **Section "RULES IMMUABLES"** : garder les 10 règles existantes + ajout "JAMAIS d'action destructive auto (propose via TodoWrite)"
- Update `docs/core/product.md` section 5 (Components) : ajouter colonne "Invocation pattern" (auto/manuel/Task)
- Ajouter section 12 `docs/core/product.md` "Autonomie & Triggers" : spec des 6 triggers + règle Q1-c mixte
- Test Task po-agent simple : `Task(po-agent, "lis docs/core/product.md et résume en 3 bullets")`. Vérifier que le po-agent :
  - Lit les 6 fichiers contexte cognitif
  - Produit rapport format structuré
  - Ne viole aucune règle
- Commit ce prompt enrichi seul

**4. Vérification**
- `.claude/agents/po-agent.md` ~350 lignes (was 180) avec 6 sections ajoutées
- Task test retourne un rapport structuré 6 sections
- Grep dans po-agent.md : "CONTEXTE COGNITIF", "AGENTS INVOCABLES", "SKILLS EXTERNES", "TRIGGERS AUTOMATIQUES", "OUTPUTS STRUCTURÉS" tous présents
- `docs/core/product.md` section 12 ajoutée (100-150L)
- health-check SAIN + ref-checker 0 broken
- TodoWrite P1 = completed, P2 = in_progress

**5. Rollback**
- Si po-agent prompt cassé (Task fail) : `git checkout HEAD~ -- .claude/agents/po-agent.md`
- Si section product.md 12 casse structure : revert edit
- Commit atomique = rollback propre d'1 commit

**6. Commit message préformate**
```
feat(os): P1 po-agent prompt enrichi + agents/skills invocables (D-PRODUCT-02 1/5)

- .claude/agents/po-agent.md : rewrite +170L (6 sections enrichies)
  * CONTEXTE COGNITIF OBLIGATOIRE : 6 fichiers FOS à Read avant chaque action
  * AGENTS INVOCABLES : 5 agents FOS via Task (os-architect, dev-agent, doc-agent, review-agent, alignment-auditor)
  * SKILLS EXTERNES : 7 skills product-management:* (sprint-planning, synthesize-research, write-spec, roadmap-update, metrics-review, competitive-brief, stakeholder-update)
  * TRIGGERS AUTOMATIQUES : 6 événements FOS (plan-os, commit, session-start, session-end, schedule, save)
  * OUTPUTS STRUCTURÉS : format rapport 6 sections (actions MCP, changes FOS, rapport brief, metrics, divergences, next steps)
  * RULES : ajout "JAMAIS action destructive auto, propose via TodoWrite"
- docs/core/product.md : section 12 "Autonomie & Triggers" (100L) avec spec 6 triggers + règle Q1-c mixte

Verifs : Task po-agent test retourne rapport structuré OK, po-agent ~350L, health SAIN.

Decision : D-PRODUCT-02 Module Product Autonomie & Intégration Profonde
Plan : docs/plans/2026-04-19-product-autonomie.md
```

---

### P2 — `/plan-os` auto-push Notion (~3-4h)

**1. Pre-conditions**
- P1 commit réussi (po-agent enrichi + product.md section 12)
- `scripts/intent-capture.sh` fonctionnel (D-BODY-01 livré)
- DB Plans + DB Tasks Notion accessibles (IDs dans product-config.json)

**2. État repo avant**
- `.claude/commands/plan-os.md` : workflow Tours 1-4 (EnterPlanMode, intent-capture, Write plan, ExitPlanMode)
- Pas de Tour 5 auto-push Notion
- Scripts `scripts/po-*.sh` existants : init/sync/pull/status (stubs fonctionnels manifest-driven)

**3. Actions atomiques**
- Read `.claude/commands/plan-os.md` (intégral)
- Edit `plan-os.md` : ajouter **Tour 5 "Auto-push Notion"** après ExitPlanMode + intent-capture :
  - Si plan frontmatter contient `decision: D-XXX-NN` valide
  - Et si `PRODUCT_MCP_SYNC=1` OU Kevin dit explicitement "auto-push" OR default : propose via TodoWrite
  - Invoquer Task po-agent avec prompt "Lis plan `docs/plans/<slug>.md` + structure dans Notion DB Plans (1 row) + DB Tasks (N phases Type=Phase, optionnel N×6 elements Type=Element). Utilise Plan ref relation vers row Plans créé. Retourne URLs Notion."
- Créer `scripts/plan-os-to-notion.sh` :
  - Input : path vers plan file
  - Parse frontmatter YAML (title, decision, phases_total, status, effort_estimated, created)
  - Parse sections `### P1 —`, `### P2 —`, etc. jusqu'à P{phases_total}
  - Génère manifest `.omc/po-manifests/YYYY-MM-DD-HHMM-planos-autopush.json` avec :
    - Action create Plans row
    - Actions create Tasks rows (1 par phase détectée)
    - Plan ref relation entre Tasks et Plans
  - Mode `--dry-run` pour preview
- Dogfooding : exécuter `bash scripts/plan-os-to-notion.sh docs/plans/2026-04-19-product-autonomie.md` dans cette même session → push ce plan D-PRODUCT-02 lui-même vers Notion (1 row Plans + 5 rows Tasks phases P1-P5)
- Update `docs/core/product.md` section 9 (Execution flow) : ajouter scenario "Push auto via /plan-os"
- Test end-to-end : créer plan bidon `docs/plans/test-autopush.md` avec 3 phases → /plan-os → vérifier Notion peuplé → delete plan bidon

**4. Vérification**
- `scripts/plan-os-to-notion.sh` executable + `--dry-run` OK
- Test dogfooding : row DB Plans "D-PRODUCT-02 Module Product Autonomie" + 5 rows DB Tasks (P1 Todo, P2 Todo, P3 Todo, P4 Todo, P5 Todo) visibles dans Notion
- Task po-agent "structure plan X" retourne URLs Notion créées
- `.claude/commands/plan-os.md` Tour 5 documenté avec exemple
- health-check SAIN + ref-checker 0 broken
- TodoWrite P2 = completed, P3 = in_progress

**5. Rollback**
- Si Tour 5 casse /plan-os : revert `.claude/commands/plan-os.md`
- Si rows Notion créés en test dogfooding erronés : supprimer via MCP ou Kevin UI
- Script `plan-os-to-notion.sh` cassé : delete fichier + revert
- Commit atomique = rollback 1 commit

**6. Commit message préformate**
```
feat(os): P2 /plan-os auto-push Notion + po-agent structure plans (D-PRODUCT-02 2/5)

- .claude/commands/plan-os.md : ajout Tour 5 "Auto-push Notion" après ExitPlanMode + intent-capture
  * Trigger : plan frontmatter decision valide + (PRODUCT_MCP_SYNC=1 OR Kevin opt-in OR propose TodoWrite)
  * Action : Task po-agent "structure plan dans Notion DB Plans + DB Tasks"
- scripts/plan-os-to-notion.sh : parse plan YAML + sections P1-PN, génère manifest JSON actions MCP
  * Mode --dry-run preview
  * Plan ref relation automatique entre Tasks et Plans
- docs/core/product.md section 9 : scenario "Push auto via /plan-os" documenté
- Dogfooding : plan D-PRODUCT-02 lui-même pushé vers Notion (1 Plan + 5 Tasks phases)

Verifs : dogfooding D-PRODUCT-02 rows visibles Notion, plan test bidon→Notion→delete OK, health SAIN.

Decision : D-PRODUCT-02 Module Product Autonomie
Plan : docs/plans/2026-04-19-product-autonomie.md
```

---

### P3 — Post-commit debounced 30s (~2-3h)

**1. Pre-conditions**
- P2 commit réussi (/plan-os auto-push fonctionnel)
- Git hooks `pre-commit` + `commit-msg` existants (conventional commits)
- Pas de conflit avec hooks existants

**2. État repo avant**
- `.git/hooks/post-commit` : absent ou basique
- Pas de script de sync post-commit
- `.omc/po-manifests/` : contient manifests P2 dogfooding

**3. Actions atomiques**
- Créer `scripts/hooks/post-commit-product-sync.sh` :
  - Parse commit message via `git log -1 --pretty=%B`
  - Regex match : `D-[A-Z]+-?\d+\s+P\d+(\.\d+)?` OU `P\d+/\d+\s+(COMPLET|DONE)` OU `feat\(os\):\s+P\d+`
  - Si match : extraire decision code + phase number
  - Écrire fichier lock `.omc/po-commit-debounce.lock` avec timestamp + phase + commit hash
  - Si lock existant et < 30s ancien : skip (debounce)
  - Si lock > 30s ou absent : spawn background process (nohup) qui :
    - Sleep 30s
    - Re-lit lock pour récupérer dernier commit (batch si plusieurs)
    - Génère manifest `.omc/po-manifests/YYYY-MM-DD-HHMM-commit-sync.json` avec action update DB Tasks Status=Done pour phase correspondante
    - Clean lock file
  - Exit 0 toujours (non-bloquant)
- Créer `scripts/po-commit-sync-applier.sh` (le script lancé en background) :
  - Lit manifest le plus récent
  - Exécute logique de sync (mais ne peut pas invoquer MCP direct : génère manifest pour Claude next session)
- Installer hook via `scripts/git-hooks-install.sh` (update ce script pour inclure post-commit)
- Option : ajouter dans `.claude/settings.json` matcher Bash `git commit` PostToolUse hook qui invoque `post-commit-product-sync.sh` (alternative si git hooks pas utilisé)
- Documentation `docs/core/product.md` section 9 : scenario "Post-commit debounce" + limites (bash ne peut MCP, donc manifest-driven + Claude execute next session)
- Test : 3 commits rapides en <30s → vérifier 1 seul manifest généré après 30s

**4. Vérification**
- `scripts/hooks/post-commit-product-sync.sh` executable + parse regex OK
- Test 3 commits rapides → 1 manifest post-debounce (pas 3)
- Lock file comportement OK (écriture + cleanup)
- health-check SAIN (chain po-status inchangé)
- Documentation product.md section 9 à jour

**5. Rollback**
- Si hook casse commit : `chmod -x scripts/hooks/post-commit-product-sync.sh` + remove from git hooks
- Si lock file corrompu : `rm .omc/po-commit-debounce.lock`
- Commit atomique = rollback propre

**6. Commit message préformate**
```
feat(os): P3 post-commit debounced 30s + manifest update DB Tasks (D-PRODUCT-02 3/5)

- scripts/hooks/post-commit-product-sync.sh : parse commit message, match regex D-XXX-NN PN, debounce 30s via lock file
  * Match patterns : "D-[A-Z]+-?\d+ P\d+", "P\d+/\d+ COMPLET", "feat(os): P\d+"
  * Debounce : lock .omc/po-commit-debounce.lock, < 30s = skip, > 30s = spawn bg
  * Background : sleep 30s + lit dernier commit + manifest update Status=Done
  * Exit 0 toujours (non-bloquant)
- scripts/po-commit-sync-applier.sh : background runner, génère manifest pour Claude next session
- scripts/git-hooks-install.sh : update pour inclure post-commit hook (opt-in)
- .claude/settings.json : hook PostToolUse matcher Bash "git commit" (alternative)
- docs/core/product.md section 9 : scenario "Post-commit debounce" + limites manifest-driven

Verifs : 3 commits rapides → 1 manifest post-debounce 30s, lock file clean, health SAIN.

Decision : D-PRODUCT-02 Module Product Autonomie
Plan : docs/plans/2026-04-19-product-autonomie.md
```

---

### P4 — 3 routines Notion via `/schedule` (~4-5h)

**1. Pre-conditions**
- P3 commit réussi (post-commit hook fonctionnel)
- Feature `/schedule` Desktop testée (Kevin peut configurer cron locaux)
- `wiki/meta/routines-setup.md` documenté pour routines Cloud existantes

**2. État repo avant**
- 3 routines Product inexistantes
- `wiki/meta/routines-setup.md` documente routines Cloud GitHub Actions (non-Product)
- Pas de pages "Daily Brief" / "Weekly Review" / "Monthly Retro" dans Notion

**3. Actions atomiques**
- Créer `scripts/po-daily-brief.sh` :
  - Parse CONTEXT.md (modules status, active threads, next action)
  - Parse plans actifs + phases in-progress
  - Parse TodoWrite state (si disponible)
  - Parse `.omc/po-last-sync.json` pour timestamp
  - Génère manifest `.omc/po-manifests/YYYY-MM-DD-daily-brief.json` avec action create Notion page "Daily Brief YYYY-MM-DD" contenant :
    - Kanban state snapshot (counts Todo/In Progress/Done/Blocked)
    - Plans actifs + phases en cours
    - Next action A-F (depuis CONTEXT.md)
    - Top 3 lessons récentes
  - Parent page : nouveau espace Foundation OS Notion
- Créer `scripts/po-weekly-review.sh` :
  - Calcul metrics via git log :
    - Velocity : plans terminés / 7j
    - Cycle time : durée moyenne des phases (commit 1er phase → commit dernier phase)
    - Burn-down : tasks Done ce semaine
  - Parse sessions-recent.md pour patterns
  - Génère manifest create Notion page "Weekly Review YYYY-WWW" avec tables metrics
- Créer `scripts/po-monthly-retro.sh` :
  - Consolidation lessons-learned 🎯 to-constitute (tag flag)
  - Consolidation thinking insights du mois
  - Propose roadmap update (next modules à lancer, decisions à archiver)
  - Génère manifest create Notion page "Monthly Retro YYYY-MM"
- Chmod +x sur les 3 scripts
- Test `--dry-run` sur les 3
- Update `wiki/meta/routines-setup.md` : section "Routines Product (D-PRODUCT-02)" avec 3 routines + commandes `/schedule` à copier-coller par Kevin
- Documentation `docs/core/product.md` section 11 (Limits + Maintenance) : ajout routines fréquence

**4. Vérification**
- 3 scripts `--dry-run` retournent manifests valides
- `wiki/meta/routines-setup.md` contient section Product avec 3 commandes `/schedule` claires
- Test dogfooding : exécuter `po-daily-brief.sh` en live → page "Daily Brief 2026-04-19" créée Notion
- health-check SAIN
- TodoWrite P4 = completed, P5 = in_progress

**5. Rollback**
- Si scripts cassent : `chmod -x` + remove
- Si pages Notion test erronées : delete via MCP ou Kevin UI
- Commit atomique rollback propre

**6. Commit message préformate**
```
feat(os): P4 3 routines Product (daily/weekly/monthly) + /schedule setup (D-PRODUCT-02 4/5)

- scripts/po-daily-brief.sh : parse CONTEXT + plans + TodoWrite → page Notion "Daily Brief YYYY-MM-DD"
  * Kanban state snapshot, plans actifs, next action, top 3 lessons
- scripts/po-weekly-review.sh : metrics git log (velocity, cycle time, burn-down) → page "Weekly Review YYYY-WWW"
- scripts/po-monthly-retro.sh : consolidation lessons 🎯 + thinking + roadmap propose → page "Monthly Retro YYYY-MM"
- wiki/meta/routines-setup.md : section "Routines Product" + 3 commandes /schedule à copier-coller
- docs/core/product.md section 11 : fréquences routines documentées

Verifs : 3 scripts --dry-run OK, dogfooding daily-brief live crée page Notion, health SAIN.

Decision : D-PRODUCT-02 Module Product Autonomie
Plan : docs/plans/2026-04-19-product-autonomie.md
```

---

### P5 — Smart triggers + tuile v12 #17 enrichie + archive (~3-4h)

**1. Pre-conditions**
- P1-P4 commits réussis
- Notion DB peuplées + routines fonctionnelles

**2. État repo avant**
- Pas de smart triggers (save/archive/lessons)
- Tuile brief v12 #17 PRODUCT basique (état kanban counts seulement)
- Plan courant `docs/plans/2026-04-19-product-autonomie.md` actif

**3. Actions atomiques**
- Créer `scripts/hooks/plan-archive-product-sync.sh` :
  - Trigger : fichier plan bascule `status:done` ou `cases[x] >= phases_total`
  - Génère manifest update DB Plans Status=archived + set Timeline close date
  - Update DB Tasks : tous tasks liées Plan ref → Status=Done (si pas déjà)
  - Hook dans `scripts/auto-archive-plans.sh` existant (ajout 1 ligne invocation)
- Créer `scripts/lessons-to-constitute-notion.sh` :
  - Scan `wiki/meta/lessons-learned.md` pour sections avec emoji 🎯
  - Pour chaque, chercher decision liée (grep code D-XXX-NN dans section)
  - Si trouve, génère manifest add comment Notion row DB Decisions "Draft P-XX disponible : [titre lesson]"
  - Alternatively : créer row DB Tasks Type=Task "Constitutionalize lesson XXX" avec lien wiki
- `/save` wiki skill enrichissement :
  - Modifier `plugin claude-obsidian` skill `/save` ? Complexe car plugin externe
  - Alternative : créer `scripts/hooks/post-save-product-check.sh` qui scan la page wiki créée, détecte patterns "decision" / "D-XXX-NN" / "architecture choice" → propose link Notion via TodoWrite
- Enrichir tuile brief v12 #17 PRODUCT dans `docs/core/communication.md` :
  - Metrics live : velocity (plans/sem derniers 30j), cycle time (jours moyens par phase), burn-down week (tasks Done this week)
  - Divergences : N tasks Notion avec Status différent vs FOS TodoWrite
  - Top 3 actions : from kanban In Progress sorted by priority
  - Commentaires Kevin récents : 3 derniers comments toutes DB confondues
  - Source : `scripts/po-status.sh --quiet --full-metrics` (mode enrichi à ajouter)
- Update `scripts/po-status.sh` : flag `--full-metrics` pour output enrichi
- Update `wiki/concepts/Product Management.md` : section "Orchestration événementielle" (100L) décrivant les 6 triggers + tuile #17 enrichie
- Archive plan : `mv docs/plans/2026-04-19-product-autonomie.md .archive/plans-done-260420/` (ou 260419 si même jour)
- Update frontmatter status:done + phases_done:5 avant archive
- Update CONTEXT.md Module Product → "✅ COMPLET Autonome 5/5 Phase 9"
- Update wiki/hot.md avec last updated D-PRODUCT-02
- Append wiki/meta/sessions-recent.md (nouvelle session)
- Append wiki/meta/lessons-learned.md (si lessons découvertes durant P1-P4)

**4. Vérification**
- Tests e2e 4 scénarios :
  - **S1 plan-os auto-push** : créer plan bidon → /plan-os → Notion peuplé (validé P2)
  - **S2 commit debounce** : 3 commits rapides avec pattern → 1 update Status Done après 30s
  - **S3 routine daily** : `bash scripts/po-daily-brief.sh` → page Notion créée
  - **S4 smart trigger archive** : plan passe status:done → DB Plans Status=archived auto
- health-check SAIN + ref-checker 0 broken
- wiki-health SAIN (+1 wiki concept section P5)
- Tuile brief v12 #17 rendue avec metrics live + divergences + top 3 actions
- Plan archivé `.archive/plans-done-*/`
- CONTEXT.md Module Product "COMPLET Autonome 5/5"

**5. Rollback**
- Si scripts smart triggers cassent : `chmod -x` + remove
- Si tuile v12 #17 mal rendue : revert communication.md
- Si archive prématuré : `mv .archive/plans-done-*/plan.md docs/plans/`
- Commit atomique rollback 1 commit

**6. Commit message préformate**
```
feat(os): P5 smart triggers + tuile #17 enrichie + archive (D-PRODUCT-02 5/5 COMPLET)

- scripts/hooks/plan-archive-product-sync.sh : trigger status:done → DB Plans archived + Tasks Done
- scripts/lessons-to-constitute-notion.sh : scan 🎯 to-constitute → Notion comments/tasks
- scripts/hooks/post-save-product-check.sh : detect decisions in wiki page → TodoWrite propose link
- docs/core/communication.md section 6 : tuile #17 PRODUCT enrichie (metrics + divergences + top 3 actions)
- scripts/po-status.sh : flag --full-metrics pour brief enrichi
- wiki/concepts/Product Management.md : section "Orchestration événementielle" (+100L)
- CONTEXT.md : Module Product COMPLET Autonome 5/5 Phase 9
- wiki/hot.md + sessions-recent.md + lessons-learned.md : mise à jour
- Archive plan : .archive/plans-done-260419/2026-04-19-product-autonomie.md

Tests e2e : S1 plan-os auto-push OK, S2 commit debounce OK, S3 daily routine OK, S4 plan archive OK.
Verifs : health SAIN, wiki-health SAIN, tuile #17 enrichie rendue, plan archive.

Decision : D-PRODUCT-02 COMPLET 5/5 Module Product Autonomie & Intégration Profonde
Plan : .archive/plans-done-260419/2026-04-19-product-autonomie.md
Next : Kevin test live PRODUCT_MCP_SYNC=1 activé + observe hooks réels en session.
```

---

## Verification end-to-end globale (post-P5)

```bash
# Pre-flight
bash scripts/health-check.sh    # SAIN
bash scripts/wiki-health.sh      # SAIN
bash scripts/ref-checker.sh      # 0 broken

# Tests scenarios
# S1 : /plan-os → Notion peuplé
# S2 : git commit "feat(os): P3 foo (D-PRODUCT-02 3/5)" → 30s → DB Tasks Status=Done
# S3 : bash scripts/po-daily-brief.sh → page Notion créée
# S4 : plan passe status:done → DB Plans archived

# Verifs commandes
/po status                        # état Notion + counts FOS
/po sync                          # push batch manuel
/po pull                          # pull preview diff

# Live session test (opt-in)
PRODUCT_MCP_SYNC=1 /session-start  # hooks réels
```

---

## Files to modify (priorités)

| Priority | File | Action | Phase |
|----------|------|--------|-------|
| 🔴 | `.claude/agents/po-agent.md` | Rewrite enrichi | P1 |
| 🔴 | `docs/core/product.md` | +section 12 Autonomie + maj sections 5/9/11 | P1-P5 |
| 🔴 | `.claude/commands/plan-os.md` | +Tour 5 auto-push | P2 |
| 🔴 | `scripts/plan-os-to-notion.sh` | Nouveau | P2 |
| 🔴 | `scripts/hooks/post-commit-product-sync.sh` | Nouveau | P3 |
| 🔴 | `scripts/po-commit-sync-applier.sh` | Nouveau | P3 |
| 🔴 | `scripts/po-daily-brief.sh` | Nouveau | P4 |
| 🔴 | `scripts/po-weekly-review.sh` | Nouveau | P4 |
| 🔴 | `scripts/po-monthly-retro.sh` | Nouveau | P4 |
| 🔴 | `scripts/hooks/plan-archive-product-sync.sh` | Nouveau | P5 |
| 🔴 | `scripts/lessons-to-constitute-notion.sh` | Nouveau | P5 |
| 🔴 | `scripts/hooks/post-save-product-check.sh` | Nouveau | P5 |
| 🟡 | `scripts/po-status.sh` | +flag --full-metrics | P5 |
| 🟡 | `scripts/git-hooks-install.sh` | +post-commit | P3 |
| 🟡 | `scripts/auto-archive-plans.sh` | +invoke archive-sync | P5 |
| 🟡 | `.claude/settings.json` | Hooks post-commit (alt) | P3 |
| 🟡 | `docs/core/communication.md` | Tuile #17 enrichie | P5 |
| 🟡 | `wiki/meta/routines-setup.md` | Section Product | P4 |
| 🟡 | `wiki/concepts/Product Management.md` | Section Orchestration | P5 |
| 🟡 | `CONTEXT.md` | Module Product + Decision D-PRODUCT-02 | P5 |
| 🟡 | `CLAUDE.md` | Ref PO autonome | P5 |
| 🟡 | `docs/core/architecture-core.md` | Update section Product | P5 |
| 🟢 | `wiki/hot.md` | Last updated | P5 |
| 🟢 | `wiki/meta/sessions-recent.md` | Append session | P5 |
| 🟢 | `wiki/meta/lessons-learned.md` | Append si lessons | P5 |

---

## Limites honnêtes (P-10 + P-11)

1. **Bash ne peut pas invoquer MCP** : tous les scripts génèrent manifests JSON, Claude execute. Si Kevin n'ouvre pas de session Claude → manifests restent en queue (pas de daemon). Pattern déjà validé D-PRODUCT-01.
2. **Rate limit Notion 3 req/s** : debounce 30s post-commit respecte. Routines `--dry-run` avant live pour mesurer count API calls.
3. **Pas de webhooks Notion** : pas de détection instantanée des changements Kevin (move card, commentaire). Pull au session-start seulement.
4. **Hooks opt-in** : `PRODUCT_MCP_SYNC=1` default OFF. Si Kevin n'active pas → hooks inactifs. Docs product.md clair.
5. **`/save` plugin claude-obsidian** : pas modifiable facilement (plugin externe). Fallback = hook post-hoc qui scan page créée.
6. **Routines `/schedule` Desktop** : feature native Claude Code. Si Claude Code pas actif (Kevin pas ouvert app) → cron ne tourne pas. Alternative GitHub Actions rejetée (complexité tokens).
7. **Post-commit hook sur TOUS commits** : impact minimal car debounce 30s + skip si pas match pattern. Safe.
8. **`po-agent` invoque agents via Task** : consomme tokens. Documenté cost dans prompt, Kevin peut override.

---

## Dogfooding intrinsèque

- **P2** : `scripts/plan-os-to-notion.sh` utilisé pour pousser ce plan D-PRODUCT-02 lui-même vers Notion. Validation pattern "self".
- **P5** : tests e2e scenarios S1-S4 utilisent D-PRODUCT-02 comme subject (créer/archiver son propre plan).
- **Post-P5** : au prochain `/plan-os` (tout autre D-XXX-NN), le Tour 5 enrichi auto-push fonctionnera sans que Kevin le demande.

---

## Decision

**D-PRODUCT-02** Module Product Autonomie & Intégration Profonde. Prédécesseur : D-PRODUCT-01 COMPLET 5/5 (commit `9b102c4` sur main).

---

## Red flags surveillés

- [ ] Health check DEGRADED → stop + fix avant phase suivante
- [ ] Plus de MD que de code (P-19) : target ~45% code + script / 55% MD (justifié : 3 routines + hooks + enrichissement)
- [ ] Tokens context > 60% → pre-compaction snapshot (INT-1 actif)
- [ ] Rate limit 429 → debounce à ajuster (30s → 60s si nécessaire)
- [ ] Task po-agent consomme > 20% tokens session → simplifier prompt
- [ ] Routines `--dry-run` générent manifests > 100 actions → batching à revoir

---

## Effort résumé

| Phase | Effort | Dépendances | Checkpoint |
|-------|--------|-------------|-----------|
| P1 Prompt élargi | 3h | D-PRODUCT-01 livré | Task po-agent retourne rapport structuré |
| P2 /plan-os auto-push | 3-4h | P1 | Dogfooding D-PRODUCT-02 rows Notion visibles |
| P3 Post-commit debounced | 2-3h | P2 | 3 commits → 1 manifest post-30s |
| P4 3 Routines | 4-5h | P3 | 3 scripts --dry-run OK + dogfooding daily live |
| P5 Smart triggers + archive | 3-4h | P4 | 4 scenarios e2e validés |
| **TOTAL** | **15-20h** | Full d'un coup Opus 4.7 1M context | Zero régression à chaque phase |

---

## References

- Predecessor : D-PRODUCT-01 (commit `9b102c4` sur main, 2026-04-19)
- Spec canonique : `docs/core/product.md` (v1.1 Notion-only)
- Config IDs : `.omc/product-config.json` (source unique)
- Agent actuel : `.claude/agents/po-agent.md` (surface, à enrichir P1)
- Pattern plans ultra-detailles : `feedback_plans_ultra_detailles.md` (mémoire)
- Pattern manifest-driven : `docs/core/product.md` section 7
- Constitution FOS : `docs/core/constitution.md` (41 P-XX, Layered Loading L2)
- Brief v12 spec : `docs/core/communication.md` section 6
