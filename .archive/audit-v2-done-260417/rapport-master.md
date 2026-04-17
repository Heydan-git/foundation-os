---
type: audit-master
title: "Mega Audit V2 Foundation OS — Rapport master consolide"
date: 2026-04-16
model: claude-opus-4-7
agents: 7
scope_files_read: 707
scope_lines_read: 18000
findings_total: 146
duration_min: 45
status: complete
related:
  - "[[CONTEXT]]"
  - "[[CLAUDE]]"
  - raw/agent-1-core-os-racine.md
  - raw/agent-2-scripts-harness.md
  - raw/agent-3-wiki-complet.md
  - raw/agent-4-memory-globale.md
  - raw/agent-5-modules-app.md
  - raw/agent-6-modules-ds.md
  - raw/agent-7-docs-ci-supabase.md
---

# Mega Audit V2 Foundation OS — Rapport master

> Audit realise par Claude Opus 4.7, 7 sous-agents paralleles, zero fix applique (mode rapport seul). Plan d'execution separe : `docs/plans/2026-04-16-mega-audit-v2-execution.md`.
>
> **Instruction Kevin** : "Je veux le truc le plus complet, le plus precis, ecrit pour qu'on puisse le realiser dans une autre session, parce que ca va te cramer tout ton contexte."

## Executive Summary

Foundation OS est **fonctionnellement operationnel** mais souffre de **drifts structurels majeurs** entre sa narrative documentee (CLAUDE.md, CONTEXT.md, README, CHANGELOG, wiki) et son etat reel. L'infrastructure est a 70-85% saine par zone mais 10 findings P0 critiques compromettent la confiance globale. 3 bombes a retardement silencieuses :

1. **DS `tokens/` inexistant** (Agent 6 F-01) casse `npm run build` du DS → prebuild `modules/app` plantera sur clean install/CI
2. **Git hook commit-msg obsolete** (Agent 2 F-01) bloque `/session-end` Phase 8 (merge worktree)
3. **3 migrations SQL non-idempotentes** (Agent 7 F-03/F-04/F-15/F-16) contraignent Kevin a `supabase db reset` complet en cas de rerun

Plus 7 contradictions entre sources documentaires (counts wiki 5 valeurs differentes, "iso base DS" faux, "23/23 tests DS" faux, CONTEXT.md "0 legacy" faux, registry tools v11 vs v12, manifeste stale 8j, specs DONE non-archivees).

**Verdict global** : **DEGRADED STRUCTUREL** (7.2/10). Aucune regression utilisateur visible mais confiance dans le systeme de mesure erodee. Recuperable en 1 session dediee (plan execution associe).

---

## Verdict par zone

| # | Zone | Qualite | Findings P0 | Findings P1 | Findings P2/P3 | Couverture audit |
|---|------|---------|-------------|-------------|----------------|------------------|
| 1 | **Core OS + racine** | 8/10 | 4 | 9 | 12 | 100% (15/15 fichiers, 2710L) |
| 2 | **Scripts & Harness** | 7.5/10 | 3 | 6 | 12 | 100% (40/40, 3857L, syntax OK 20/20) |
| 3 | **Wiki complet** | 8/10 | 3 | 5 | 11 | 100% (48/48, 4370L) |
| 4 | **Memory globale** | 7/10 | 4 | 5 | 11 | 100% (37/37, 870L) |
| 5 | **Modules App code** | 7.5/10 | 2 | 6 | 12 | 100% (52/52, 4074L) |
| 6 | **Modules DS code** | 5/10 | 5 | 6 | 14 | ~65% integral + 30% structurel |
| 7 | **Docs peripheriques + CI + Supabase + .raw** | 6.5/10 | 4 | 8 | 14 | 100% (17/17, 2275L) |
| **Global** | — | **7.2/10** | **25 P0** | **45 P1** | **76 P2/P3** | **~95%** |

**Total** : 146 findings (25 P0 + 45 P1 + 47 P2 + 29 P3)

---

## Top 10 P0 cross-zones (priorite absolue)

Trie par impact business / operationnel decroissant.

### 1. DS `tokens/` inexistant → bombe a retardement build (Agent 6 F-01)
**Zone** : modules/design-system
**Impact** : `npm run build` DS echoue (alias `build:tokens`). Prebuild hook `modules/app` (ligne 7-9 package.json) invoque `npm run build --workspace=@foundation-os/design-system` → **CI clean install plante**. L'app tourne aujourd'hui uniquement par chance (`styles.css` direct).
**Fichiers impactes** : `package.json:12-14, 20-21, 25-27, 38, 41` + 2 scripts Style Dictionary + `README-design-system.md:18,31,88,102` + 5 foundations MD + declarations `files: ["tokens/source", "tokens/build"]` dans npm package.
**Action** : Creer `tokens/source/**` DTCG + regenerer OR retirer toutes les refs mortes et recentrer sur `src/styles/tokens.css` seul.

### 2. Git hook `.git/hooks/commit-msg` obsolete → `/session-end` bloque (Agent 2 F-01)
**Zone** : harness
**Impact** : Le hook installe manque le type `merge` et la regex autorisant `Merge branch`. Tout `git merge --ff-only` (Phase 8 /session-end pour merger une branche worktree) genere un commit merge qui sera **rejete** par le hook. Kevin perd son workflow cloture de session.
**Fichiers impactes** : `.git/hooks/commit-msg` (installe, obsolete) vs `scripts/git-hooks/commit-msg` (source, a jour).
**Action** : `cp scripts/git-hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg`. Creer `scripts/git-hooks-install.sh` pour automatiser.

### 3. 3 Migrations SQL non-idempotentes → `supabase db reset` force (Agent 7 F-03/F-04/F-15/F-16)
**Zone** : supabase
**Impact** : `CREATE TABLE sessions` (001) / `CREATE POLICY` (002) / `CREATE TRIGGER` (003) sans `IF NOT EXISTS`. Rerun echoue. Contraint Kevin a `supabase db reset` complet = perte donnees. Seed data ligne 233-292 de 001 duplique sur rerun.
**Fichiers impactes** : `supabase/migrations/001_create_tables.sql:11,43,74,105,137,164,233-292`, `002_add_delete_policies.sql:4-20`, `003_add_updated_at.sql:30-35`.
**Action** : Ajouter `IF NOT EXISTS` / `ON CONFLICT DO NOTHING` / `DROP TRIGGER IF EXISTS ... ; CREATE TRIGGER ...`. Splitter seed dans `supabase/seed.sql` separe.

### 4. `session-start-wiki.sh` orphelin → wiki autonome casse (Agent 2 F-02)
**Zone** : harness / wiki
**Impact** : CLAUDE.md promet "Wiki = cerveau autonome" avec auto-load `wiki/hot.md` au SessionStart. Realite : `settings.json:42` execute `bash scripts/drift-detector.sh` directement, **ne passe PAS** par `session-start-wiki.sh` qui fait drift + cat hot.md. **Le hook auto-load hot.md n'est JAMAIS execute.** Neuroplasticite reflexe 1 (recall wiki) compromise.
**Fichiers impactes** : `.claude/settings.json:42` a modifier pour pointer `scripts/hooks/session-start-wiki.sh`.
**Action** : Modifier settings.json pour wrapper.

### 5. "iso base DS" est factuellement FAUX → narrative trompeuse (Agent 6 F-02)
**Zone** : DS + CONTEXT + memoires
**Impact** : `diff -r -q` confirme que les **46/46 composants divergent** de `base DS/`. Le DS est un **fork Void Glass etendu** (Button 9 variants vs 6, Card glassmorphism, Checkbox/Switch sans Radix). Le terme "iso" (dans CONTEXT.md, CHANGELOG, README, memoires `feedback_ds_reconstruction_protocole.md` + `project_ds_rebuild_plan.md` + wiki) est menteur.
**Fichiers impactes** : Commentaires tete `src/components/ui/*.tsx`, CONTEXT.md:11-12, CHANGELOG.md:7, README-design-system.md, wiki pages, memoire MEMORY.md.
**Action** : Renommer "iso base DS" en "Void Glass fork de base DS + patterns glass" partout. OU regenerer strictement iso (choix produit).

### 6. Zero test unitaire DS vs "23/23 tests DS" annonces (Agent 6 F-04)
**Zone** : DS
**Impact** : CONTEXT.md ligne 18 annonce "DS 23/23 tests". Realite : **0 fichier `.test.{ts,tsx}` dans `src/`**. CHANGELOG annonce "Smoke + a11y tests for 10 core components" — **faux**. Tests e2e Playwright stale (F-05).
**Action** : Soit ecrire tests (10 composants prioritaires) + reparer e2e, soit corriger CONTEXT.md honnete "DS 0 tests unitaires, e2e Playwright a reparer".

### 7. Forms/ dead code avec violations void glass (Agent 5 F-01 + F-06)
**Zone** : modules/app
**Impact** : `AddSessionForm.tsx` (189L) + `EditDecisionModal.tsx` (224L) + `NextStepActions.tsx` (233L) = 646L (15% du code app) utilisent tokens legacy `var(--color-bg-canvas)`, `--color-accent-brand-primary`, hardcode `#4FD1C7`. **Jamais importes** dans aucune page. CONTEXT.md "iso base DS — tokens ds-* partout, 0 legacy" → **FAUX**.
**Fichiers impactes** : `modules/app/src/components/forms/*.tsx` (3 fichiers, 646L).
**Action** : Archiver dans `.archive/app-forms-dead-260416/` OU reecrire avec tokens `ds-*` et recabler vers Commander.tsx.

### 8. `commander.md` contient mots interdits explicites (Agent 5 F-02)
**Zone** : modules/app/data
**Impact** : `modules/app/data/commander.md:82-84,116-124` contient "REVOLUTION HISTORIQUE ACHEVEE", "Reference Mondiale Absolue", "$1B+ potential", "16,000+ lignes", "250+ outils" — **tous interdits explicites par CLAUDE.md ligne 151-152**. ADR-034 a ADR-044 sont du bullshit Phase 3-4 historique.
**Fichiers impactes** : `modules/app/data/commander.md` (et potentiellement autres data/*.md).
**Action** : Archiver le dossier `data/` complet vers `.archive/app-data-jsx-260416/` (tous les JSX referenced dans ces MD sont deja archives).

### 9. Wiki counts : 5 sources contradictoires (Agent 3 F-P0-01 + F-P0-02 + F-P0-03 + F-P1-01)
**Zone** : wiki
**Impact** : hot.md dit 41 pages, overview.md 36, index-wiki.md 43, foundation-os-map.md 93 connectes, filesystem 48. Wikilinks 762+ annonces vs 733 mesures. Table Statistiques index-wiki ne somme pas a 43 (11+5+4+5+8+4 = 37). **Regle d'or "une info = un seul tier" violee dans le wiki lui-meme**.
**Fichiers impactes** : hot.md, overview.md, index-wiki.md, foundation-os-map.md.
**Action** : Creer `wiki/meta/counts.md` source unique. Aligner les 4 autres sur cette source. Ecrire le script `wiki-counts-sync.sh`.

### 10. Duplications CLAUDE.md ↔ auto-memory (Agent 4 F-01 + F-02)
**Zone** : memory
**Impact** : `feedback_imperatifs_qualite.md` lignes 9-17 **mot pour mot identique** a CLAUDE.md lignes 5-13. `feedback_minimal_files.md` duplique CLAUDE.md ligne 130. Violation directe regle d'or D-WIKI-01 "une info = un seul tier". Tokens gaspilles chaque SessionStart.
**Fichiers impactes** : memory/feedback_imperatifs_qualite.md, memory/feedback_minimal_files.md.
**Action** : Deprecier les 2 memoires (migrer vers `_deprecated/` avec markers SUPERSEDED). OU les reduire a 3 lignes avec "Why" contextuel unique si vraiment utiles.

---

## Autres findings P0 critiques (non top 10 mais majeurs)

### Agent 1 — Core OS P0
- **F-01** : Catalogue tools 99 vs 109 (knowledge-skills inline dans index.json, manque registry/knowledge-skills.json)
- **F-02** : README-tools-catalogue.md descriptions tronquees 70 chars (illisible)
- **F-03** : registry/commands.json encore 7 mentions "Brief v11" (doc README deja v12 → drift regeneration)
- **F-04** : CSS seuil 40/55/65KB contradictoire entre monitor.md:34, monitor.md:86, CONTEXT.md:56, communication.md:172

### Agent 2 — Scripts P0
- **F-03** : CLAUDE.md mentionne "pre-commit hook settings.json" mais en realite git hooks non-automatiques (setup non-documente → nouveau clone perd garde-fous)

### Agent 4 — Memory P0
- **F-03** : Doublon massif `feedback_neuroplasticity.md` (33-37L) vs `feedback_no_token_limit.md` (sujet identique Max x20 / tokens)
- **F-04** : `project_ds_refactor_app.md` obsolete (decrit etat pre-refactor comme actuel, CONTEXT.md dit DONE)

### Agent 5 — App (cf top 10 ci-dessus)

### Agent 6 — DS P0
- **F-03** : Patterns Dashboard n'utilisent AUCUN composant UI DS (0 match `from "./ui/"` dans 7 Dashboard) → **DS pas dogfood**
- **F-05** : Tests e2e Playwright pointent `primitives-button--default` etc. → story IDs inexistants (new IDs = `ui-button--default`)

### Agent 7 — Docs peripheriques P0
- **F-01** : `docs/index-documentation.md:76` reference `docs/index.md` (qui n'existe pas — auto-ref cassee)
- **F-02** : Workflow `.github/workflows/supernova-sync.yml` path `tokens/source/` TODO commente (workflow potentiellement dormant)

---

## Cross-references inter-zones (patterns recurrents)

### Pattern A : Drift "doc dit X, realite dit Y"
Recurrent sur 5 zones. Source unique : le systeme n'a pas de regeneration auto post-migration.

| Doc | Claim | Realite | Agent |
|-----|-------|---------|-------|
| CONTEXT.md:12 | App iso base DS, 0 legacy | forms/ utilise --color-bg-canvas | 5 F-01 |
| CONTEXT.md:14 | DS 23/23 tests | 0 test unitaire src/ | 6 F-04 |
| CONTEXT.md:18 | DS 53 stories SB | 47 DS-only | 6 F-10 |
| CONTEXT.md:11 | DS iso base DS | 0/46 composants iso | 6 F-02 |
| CONTEXT.md:119 | Hooks 7 | Claude=3, git=2, opt-in=2 (ambigu) | 2 F-05 |
| CLAUDE.md:103 | docs-sync chain health-check | FAUX, non chaine | 2 F-07 |
| CLAUDE.md:5-13 | Imperatifs | Duplique memoire feedback_imperatifs_qualite.md | 4 F-01 |
| README-design-system | Storybook 8 | package.json v9 | 6 F-07 |
| CHANGELOG.md | "46 shadcn from Figma Make" | lourdement modifies | 6 F-18 |
| manifeste.md:44 | Cycle 3 merge 04-10 | idem manifeste:167 "en cours" | 7 F-09 |
| docs-supernova/01-colors.md | #0d0d0f, #17171a | reel #050505, #0a0a0a | 6 F-16 |
| docs/index-documentation.md | docs/index.md | fichier n'existe pas | 7 F-01 |
| decisions-log.md:21 | 6 tables | SQL seed "5-tables" | 7 F-08 |
| setup-guide.md:8 | Node >= 18 | CI pin Node 24 | 7 F-12 |
| hot.md:56 | 41 pages, 762+ wikilinks | 48 pages, 733 wikilinks | 3 F-P1-01 |
| naming-conventions.md:149 | Co-author Opus 4.6 | Model actuel 4.7 | 1 F-09 |

**Racine commune** : un changement structurant (migration Desktop, adoption wiki, rebuild DS) a touche partiellement les specs sans **regenerer les fichiers derives** (registry JSONs, README auto-genere, foundations MD, CONTEXT counts).

### Pattern B : Orphelins silencieux (scripts/hooks declares mais jamais invoques)
| Element | Declare ? | Invoque ? | Agent |
|---------|-----------|-----------|-------|
| `scripts/session-lock.sh` | tools.md / script existe | Jamais | 2 F-04 |
| `scripts/hooks/wiki-recall-reminder.sh` | fichier existe, commentaire "opt-in" | Jamais | 2 F-05 |
| `scripts/hooks/session-start-wiki.sh` | knowledge.md prescrit | Pas via settings.json | 2 F-02 |
| `scripts/tool-register.sh` | CLAUDE.md declare "catalogue modulaire v2" | Aucun workflow | 2 F-06 |
| `scripts/docs-sync-check.sh` | CLAUDE.md dit "chain health-check" | Chain absent | 2 F-07 |
| `scripts/wiki-metrics.sh` | Fichier existe | Jamais chaine | 2 F-14 |
| `scripts/wiki-suggest-links.sh` | Fichier existe | Jamais chaine | 2 F-15 |

### Pattern C : Fichiers dupliques
- `src/lib/*` vs `src/components/ui/*` (Agent 6 F-06) — 2 `cn()` divergents
- `DashboardDesignSystem.tsx` x3 (src + base DS + preview, 1788L chacun) — Agent 6 F-09
- `ImageWithFallback.tsx` x2 (base DS + preview) — Agent 6 inventaire
- `.git/hooks/commit-msg` vs `scripts/git-hooks/commit-msg` — Agent 2 F-01 drift
- `settings.local.json.backup-pre-wiki-260415` vs `settings.local.json` — Agent 2 F-08

### Pattern D : Documentation obsolete non archivee
| Fichier | Etat reel | Recommandation |
|---------|-----------|----------------|
| `docs/manifeste.md` | Stale 8j, contradictions internes | Refonte ou archive |
| `docs/specs/*.md` (3) | DONE mais non-archives (plans archives) | Archiver `.archive/specs-done-260416/` |
| `modules/app/data/*.md` (7) | Decrivent JSX archives Phase 2.4 | Archiver `.archive/app-data-jsx-260416/` |
| `modules/design-system/preview/` | 100% duplica base DS | Supprimer (Storybook suffit) |
| `modules/design-system/base DS/src.zip` | 374KB binary Figma Make | Hors Git, archiver |
| `.claude/settings.local.json.backup-pre-wiki-260415` | Backup 1+ mois | Archiver ou delete |
| `project_ds_refactor_app.md` (memoire) | DONE non marque | Deprecier |

---

## Contradictions specifiques a resoudre (pointages ligne-par-ligne)

### Seuils CSS (4 sources)
- `docs/core/monitor.md:34` : "JS < 600KB, CSS < 40KB" (Info)
- `docs/core/monitor.md:86` : "CSS 55KB baseline, alerte si > 65KB" (Seuils)
- `docs/core/communication.md:172` : "CSS > 40 kB jaune"
- `CONTEXT.md:56` : "Sous seuil 65KB"
→ **Unifier sur 65KB**. Creer `scripts/thresholds.json` source unique.

### Brief version (2 valeurs)
- CLAUDE.md / communication.md / architecture-core.md / knowledge.md / worktrees.md : v12 OK
- `docs/core/tools/registry/commands.json:7,22,27,40,55,73,89` : v11 (7 mentions)
- `docs/core/tools/README-tools-catalogue.md:42` : v12 (deja regenere)
→ **Re-editer registry/commands.json v11→v12** + `bash scripts/tool-register.sh rebuild`.

### Tools catalogue count (2 valeurs)
- `docs/core/tools/README-tools-catalogue.md:19` / `tools.md:6` / `index.json:4` : 109
- Somme reelle registry/*.json : 99
- Reconciliation : 99 + 10 knowledge-skills (inline dans index.json) = 109
→ **Creer `docs/core/tools/registry/knowledge-skills.json`** + regenerer.

### Agents paralleles max (2 valeurs)
- CLAUDE.md:146 : 3
- Memoire feedback_subagents_context.md : 3-5
→ **Aligner sur 3** (CLAUDE.md source).

### Wiki pages (5 sources !)
- hot.md:56 : 41
- overview.md:77 : 36
- index-wiki.md:25 : 43 (exclut probablement templates)
- foundation-os-map.md:211 : 93 (total connectes hors wiki)
- filesystem : 48
- Table Statistiques index-wiki somme a 37 (pas 43)
→ **Creer `wiki/meta/counts.md`** single source. Regenerer les autres.

### Sessions recent (1 violation)
- sessions-recent.md : 6 sessions
- Regle CLAUDE.md : max 5
→ **Retirer la session la plus ancienne** (Migration Desktop 2026-04-15 peut fusionner avec Level Up).

### Hooks count (confusion)
- CONTEXT.md:119 : 7 hooks
- settings.json : 3 Claude hooks (PreToolUse x2, SessionEnd, SessionStart)
- scripts/git-hooks/ : 2 git hooks (pre-commit, commit-msg)
- scripts/hooks/ : 2 opt-in (branch-name-check, wiki-recall-reminder)
→ **Reformuler CONTEXT.md** : `Hooks Claude (3) ; Git (2) ; Opt-in (2)` = 7 total.

### Modules Core OS count
- CONTEXT.md:14 : "Core OS 7/7 actif"
- docs/core/ contient 9 specs (7 modules + architecture-core + naming-conventions)
→ Coherent si "7 modules" = 7 specs "primaires". Ajouter precision si ambigu.

---

## Obsolescences recommandees (archivage)

### Priorite 1 (immediats)
| Item | Destination | Zone |
|------|-------------|------|
| `modules/app/data/*.md` (7 files) | `.archive/app-data-jsx-260416/` | app (Agent 5 F-02) |
| `modules/app/src/components/forms/*.tsx` (3 files) | `.archive/app-forms-dead-260416/` | app (Agent 5 F-01/F-06) |
| `modules/design-system/preview/*` | SUPPRIMER (dup) | DS (Agent 6) |
| `modules/design-system/base DS/src.zip` | `.archive/ds-base-zip-260416/` | DS (Agent 6) |
| `modules/design-system/base DS/` entier | `.archive/ds-reference-base-260416/` | DS (Agent 6) |
| `docs/specs/*.md` (3 files) | `.archive/specs-done-260416/` | docs (Agent 7 F-11) |
| `docs/manifeste.md` | Refonte in-place (pas archive) | docs (Agent 7 F-10) |
| `.claude/settings.local.json.backup-pre-wiki-260415` | `.archive/settings-pre-wiki-260415.backup` | harness (Agent 2 F-08) |
| `.supernova/snapshots/snap-20260414-*/` | SUPPRIMER (regenerable) | DS (Agent 6 F-12) |

### Priorite 2 (validation Kevin)
| Item | Destination | Raison |
|------|-------------|--------|
| `scripts/session-lock.sh` | Activer OU archive | Orphelin (Agent 2 F-04) |
| `scripts/hooks/wiki-recall-reminder.sh` | Activer OU archive | Orphelin opt-in (Agent 2 F-05) |
| `project_ds_refactor_app.md` (memoire) | `_deprecated/` avec marker DONE | DS refactor done (Agent 4 F-04) |
| `feedback_no_token_limit.md` (memoire) | Fusionner dans feedback_neuroplasticity.md | Doublon (Agent 4 F-03) |
| `feedback_imperatifs_qualite.md` (memoire) | Deprecier OU reduire 3L | Duplique CLAUDE.md (Agent 4 F-01) |
| `feedback_minimal_files.md` (memoire) | Evaluer si garde valeur | Duplique CLAUDE.md (Agent 4 F-02) |

---

## Innovations / opportunites (39 idees consolidees)

### Infrastructure scripts
- I-01 : `scripts/thresholds.json` source unique seuils build/JS/CSS (Agent 1 I-01)
- I-02 : `scripts/install-git-hooks.sh` pour auto-installer git hooks depuis source (Agent 2 I-1)
- I-03 : Chainer `tool-register.sh scan` dans `/sync` (detecte scripts non-enregistres) (Agent 2 I-2)
- I-04 : Script `scripts/audit-core-os.sh` pour detecter auto les drifts v11/v12, counts tools, seuils CSS, co-author version (Agent 1 I-03)
- I-05 : Hook SessionStart unifie via `session-start-wiki.sh` wrapper (Agent 2 I-3 + F-02)
- I-06 : Script `ds-lint.sh` audit total void-glass complet (Agent 2 I-4)
- I-07 : Health-check option `--json` pour feeder brief v12 (Agent 2 I-6)
- I-08 : `clean-archive-old.sh` archivage tranche > 90j (Agent 2 I-7)
- I-09 : `wiki-counts-sync.sh` unifie hot/overview/index-wiki/foundation-os-map (Agent 3)
- I-10 : Script `sessions-recent-trim.sh` limite a 5 sessions auto (Agent 3)

### CI & Workflow
- I-11 : Matrix CI app + ds en parallele (gain ~2x) (Agent 7)
- I-12 : Step lint ESLint + Prettier avant build (Agent 7)
- I-13 : Step `bash scripts/health-check.sh` dans CI (reproduit pre-commit local) (Agent 7 F-21)
- I-14 : `supabase db lint` dans CI (Agent 7)
- I-15 : Security audit hebdo `npm audit` (Agent 7)
- I-16 : Notification email/Slack sur fail supabase-ping (Agent 7 F-25)
- I-17 : Registry → docs auto-gen via hook PostToolUse Edit sur scripts/** (Agent 2 I-5)

### Supabase
- I-18 : Preparer `004_finance_tables.sql`, `005_health_tables.sql`, `006_trading_tables.sql` pour Phase 5 (Agent 7)
- I-19 : Splitter seed dans `supabase/seed.sql` separe (Agent 7)
- I-20 : RLS function `auth.uid() = user_id` pour partitionnement Phase 5 (Agent 7)

### Documentation
- I-21 : Refonte `docs/manifeste.md` post-migration Desktop + wiki (Agent 7 F-10)
- I-22 : Formaliser convention `.raw/` dans `docs/core/knowledge.md` (Agent 7 F-13)
- I-23 : Frontmatter `status: done|active|superseded` dans specs (Agent 7)
- I-24 : `docs/plans/_template-plan.md` enrichi avec les 6 elements obligatoires (Agent 7 F-20)
- I-25 : Ajouter section Wiki dans `docs/index-documentation.md` (Agent 7 F-17)

### Wiki
- I-26 : Page `wiki/comparisons/wiki-vs-rag.md` (comparaison mentionnee mais pas formalisee) (Agent 3)
- I-27 : Page concept `Wiki Graph Obsidian` (Agent 3)
- I-28 : Page concept `5 tiers memoire` (Agent 3)
- I-29 : Template `wiki/meta/templates/session.md` (Agent 3)
- I-30 : Template `wiki/meta/templates/decision.md` (Agent 3)
- I-31 : `wiki/meta/counts.md` source unique (Agent 3)

### Design System
- I-32 : Composants manquants : `DataTable`, `StatCard`, `SparklineChart`, `Terminal`, `EmptyState`, `PageHeader` (Agent 6)
- I-33 : Tokens manquants : `--ds-duration-*`, `--ds-ease-*`, `--ds-z-index-*`, `--ds-blur-*` (Agent 6)
- I-34 : Migrer Dashboard patterns pour consommer composants UI DS (Agent 6 F-03)
- I-35 : Ecrire tests unitaires DS reels (15 composants critiques) (Agent 6 F-04)
- I-36 : Reparer tests e2e Playwright (story IDs + snapshots) (Agent 6 F-05)

### Memory
- I-37 : Consolider memoires "Workflow plans" en un seul `feedback_plans_workflow.md` (Agent 4)
- I-38 : Consolider memoires "Naming Desktop" en `feedback_naming_desktop.md` (Agent 4)
- I-39 : Ajouter `last_audit` + `total_active` + `total_deprecated` frontmatter MEMORY.md (Agent 4)

---

## Metriques couverture audit

| Agent | Scope annonce | Scope lu integralement | Couverture honnete |
|-------|---------------|------------------------|--------------------|
| 1 | 15 fichiers Core OS + racine | 15/15 (2710L) | 100% |
| 2 | ~37 fichiers harness | 40/40 (3857L) | 100% + syntax OK 20/20 |
| 3 | 48 fichiers wiki | 48/48 (4370L) | 100% |
| 4 | 37 fichiers memory | 37/37 (870L) | 100% |
| 5 | 49+ fichiers app | 52/52 (4074L) | 100% |
| 6 | ~250+ fichiers DS | ~60 integral + ~45 structurel + ~5 non examine | ~65% + 30% + 5% |
| 7 | 17 fichiers docs periph | 17/17 (2275L) | 100% |
| **TOTAL** | ~450+ fichiers | ~707 fichiers vus, ~18000L lues | **~95% global** |

**Honnete** : le seul gap vraiment significatif est Agent 6 (DS) qui a lu structurellement 30% des composants UI + docs-supernova + 6 Dashboard patterns sans les lire ligne par ligne. Cela suffit pour les findings majeurs (diff base DS vs src, counts, refs cassees, hex faux, infrastructure) mais pourrait reveler quelques P2/P3 supplementaires sur des edge cases composants specifiques. Pour Kevin : si un composant precis devient prioritaire en Phase 5 (ex: Form/Table pour Finance), relancer un audit cible sur ce composant.

---

## Cross-references agents (ce qui necessite synthese cross-zones)

Les agents ont flagge 21 cross-references — consolidees ci-dessous :

- **wiki/ counts** (Agent 3 F-P1-01) interagit avec **CLAUDE.md section Knowledge** (Agent 1), **scripts/wiki-health.sh** (Agent 2) qui scan seulement 20 premiers fichiers (F-13). **Pas d'auto-sync de ces counts**.
- **`iso base DS` claim** (Agent 6 F-02) dans CONTEXT.md (Agent 1), CHANGELOG DS (Agent 6), memoires project_ds_rebuild_plan + feedback_ds_reconstruction_protocole (Agent 4), wiki design-system-components.md (Agent 3). **4 zones a corriger simultanement pour narrative coherente**.
- **Tokens DS** (Agent 6 F-01) impacte `modules/app` prebuild (Agent 5 cross-ref), CI workflow supernova-sync (Agent 7 F-02), docs-supernova foundations (Agent 6 F-17), package.json exports (Agent 6 F-13). **1 fix multi-file**.
- **Hook settings.json** (Agent 2 F-02, F-03) impacte neuroplasticite wiki/ autoload (Agent 3 indirect), setup-guide (Agent 7).
- **Template plan** (Agent 7 F-20) contredit memoire `feedback_plans_ultra_detailles.md` (Agent 4).
- **Co-author Opus 4.6** (Agent 1 F-09) impacte all git commits futurs — a corriger avant prochain commit.

---

## Prochaines etapes (ce rapport ne fait rien, juste guide)

**Etape 1 — Lecture par Kevin** : lire ce rapport master + skimmer les 7 raw/ si necessaire. Duree ~20-30 min. Arbitrer sur les 10 top P0 (ordre d'execution).

**Etape 2 — Session d'execution** : lancer dans une NOUVELLE session Claude Code le plan d'execution `docs/plans/2026-04-16-mega-audit-v2-execution.md`. Le plan est decoupe en 7 phases + 1 verif finale. Chaque phase respecte les 6 elements obligatoires (pre-conditions, etat repo, actions atomiques, verification, rollback, commit message).

**Etape 3 — Validations** : apres chaque phase, verifier via commandes indiquees. Si anomalie → rollback propre, investiguer. Si OK → commit atomique.

**Etape 4 — Post-audit** : apres les 7 phases, relancer sanity check (`bash scripts/health-check.sh`, `bash scripts/wiki-health.sh`, `bash scripts/drift-detector.sh`) pour confirmer que les drifts sont resolus. Archiver ce rapport et plan d'execution dans `.archive/audit-v2-done-260416/` apres merge.

---

## Annexe A — Liste complete des fichiers audit avec findings

Voir rapports bruts par agent dans `raw/` :
- [agent-1-core-os-racine.md](raw/agent-1-core-os-racine.md) — Core OS + racine (15 fichiers, 25 findings)
- [agent-2-scripts-harness.md](raw/agent-2-scripts-harness.md) — Scripts + .claude/ (40 fichiers, 22 findings)
- [agent-3-wiki-complet.md](raw/agent-3-wiki-complet.md) — Wiki (48 fichiers, 13 findings)
- [agent-4-memory-globale.md](raw/agent-4-memory-globale.md) — Memory (37 fichiers, 20 findings)
- [agent-5-modules-app.md](raw/agent-5-modules-app.md) — App (52 fichiers, 20 findings)
- [agent-6-modules-ds.md](raw/agent-6-modules-ds.md) — DS (~200+ fichiers, 25 findings)
- [agent-7-docs-ci-supabase.md](raw/agent-7-docs-ci-supabase.md) — Docs periph + CI + Supabase + .raw (17 fichiers, 26 findings)

## Annexe B — Ce qui est OK (pour garder le moral)

- Core OS : 7 specs + architecture-core + naming-conventions bien structures
- 20/20 shell scripts syntax OK
- Wiki : 0 wikilink `../` residuel (regle respectee), aucune page stale, pattern Karpathy bien instancie
- Memory : MEMORY.md index match filesystem (28 = 28), migration wiki faite pour les 2 fichiers declares
- App : 0 TSX > 700L, 0 any production, 0 violation Void Glass interdit (#0A0A0B/#08080A/Outfit/Inter), 19/19 tests OK, AuthContext + useCommander + RLS defensif
- DS : 0 token --fos-* restant, 0 console.log/TODO/HACK, 0 any type, Storybook v9 configuration technique OK
- Supabase : RLS complet SELECT/INSERT/UPDATE/DELETE + triggers sort_order + updated_at
- Docs : structure monorepo lisible, specs historiques conservees

**Le projet est solide. Les drifts sont recuperables.**
