# S19 — Synthese transversale + Roadmap fixes

> **Status** : DONE 2026-04-10
> **Phase** : XI (Synthese) — **GATE G1 obligatoire avant S20**
> **Mode** : MOI
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section S19
> **Branche** : audit-massif-cycle3

---

## 1. Vue d'ensemble executive

**Cycle 3 audit massif** : 18 sessions (S1-S18) sur branche `audit-massif-cycle3`, tag baseline `pre-audit-cycle3` (a8519c8).

**Perimetre audite** : structure repo, composants, fondations Core OS, architecture, workflows, orchestration, agents, commands, scripts/hooks, skills/BMAD, communication/securite, memoire/anti-compactage, module App Builder (code), suggestions techniques, suggestions strategiques, recherche externe, cross-check.

**Volume** : ~160+ findings identifies sur 18 livrables, ~4500 lignes de code scannees (module app), 9 scripts Foundation audites, 4 agents + 4 commands + 88 skills inventories.

**Bilan sante post-cross-check (S18)** :
- **P1 actifs : 4** (3 code confirmes + 1 escalade)
- **P1 resolus : 6** (5 documentaires + 1 script, fixes par housekeeping commit 7952834)
- **P2 ajustes** : -4 retrogrades en P3 (cross-check S18), ~25 actifs
- **P3** : ~100+ (majoritairement cosmetic/doc)
- **Zero code casse** : build OK, 19/19 tests verts, health DEGRADED baseline stable

## 2. Findings consolides — P1 critiques (4 actifs)

### Batch S20 — Tous les P1

| # | Finding | Fichier | Description | Effort | Risque |
|---|---------|---------|-------------|--------|--------|
| 1 | **F-S13-01** | mutations.ts | 21x `any` bypass `database.types.ts` Insert/Update | M (~1h) | Faible |
| 2 | **F-S13-02** | 001_create_tables.sql | 0 DELETE RLS sur 6 tables. Delete bloque par defaut mais mutations fait des .delete() | S (~18L SQL) | Nul |
| 3 | **F-S13-03** | forms/*.tsx | Modals sans role="dialog", aria-modal, aria-label | S (~3 attrs) | Nul |
| 4 | **F-S13-08** | mutations.ts + Phase1Demo.tsx | clearAllData() wipe 5 tables, seul guard = confirm(). Escalade P2→P1 (S18). Combine avec F-S13-02 (no DELETE RLS) = irrecuperable | S (guard DEV) | Nul |

**Verification apres chaque fix** : `npm run build` + `npx vitest run` + `bash scripts/health-check.sh`.

## 3. Findings consolides — P2 importants (~25 actifs)

### Batch S21 — P2 classes par theme

#### 3.1 Code quality (6 fixes)

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| 5 | F-S13-05 | Supprimer ~20 console.log inutiles (garder console.error) | S |
| 6 | F-S13-09 | Phase1Demo double export → garder default seul | S |
| 7 | F-S13-11 | 38x any total dans 6 fichiers (couple F-S13-01, traiter ensemble) | Inclus dans #1 |
| 8 | F-S13-21 | SupabaseCRUDTest.tsx exclure du prod build (lazy-load ou route DEV) | S |
| 9 | F-S13-10 | useCommander 65L seed data → extraire fichier separe | S |
| 10 | F-S13-12 | Inline functions JSX re-renders (NextStepActions) | S |

#### 3.2 UI / duplication (7 fixes)

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| 11 | F-S13-06 | Dashboard.tsx doublon Commander → supprimer Dashboard, redirect /dashboard → /commander | S |
| 12 | F-S13-07 | App.tsx globalStyles duplique index.css → supprimer duplication | S |
| 13 | F-S13-14 | LoadingSkeleton duplique Dashboard/Commander → extraire composant partage | S |
| 14 | F-S13-15 | META constantes dupliquees → extraire config partagee | S |
| 15 | F-S13-16 | Google Fonts @import en JS → deplacer dans index.html | S |
| 16 | F-S13-17 | KnowledgePage 347L dont 145L donnees statiques stale → extraire | M |
| 17 | F-S13-20 | Dates hardcodees Commander/Knowledge stale → dynamiser ou supprimer | S |

#### 3.3 CI/CD (3 fixes)

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| 18 | F-S15-02 | CI ne build pas Design System → ajouter step DS build | S (~10L YAML) |
| 19 | F-S15-05 | CI cache-dependency-path pointe modules/app → pointer racine (npm workspaces) | S (1L) |
| 20 | F-S15-04 | 0 updated_at sur 6 tables → migration ajout colonne + trigger | M |

#### 3.4 Docs / specs (5 fixes)

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| 21 | F-S8-01/02 | session-start.md + session-end.md aligner brief v9 | M |
| 22 | F-S8-03 | sync.md reduire a "lancer script + interpreter verdicts" | S |
| 23 | D-S7-04 | Batch jargon/refs agents : PAUL, "P1", Phase 2.4 → refs explicites | S |
| 24 | F-S3-01 | CLAUDE.md liste outils obsolete → mettre a jour | S |
| 25 | F-S14-01 | 2 vulns dev-only (vite+esbuild) → noter, fix = migration vite@8 (hors scope) | S (doc) |

#### 3.5 Deps / perf (2 fixes)

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| 26 | F-S14-02 | 7 packages major outdated → documenter plan migration post-cycle3 | S (doc) |
| 27 | F-S13-18 | PASSWORD_MIN duplique Login/Reset → extraire constante partagee | S |

## 4. Findings P3 — Batch S22 (selection)

P3 = cosmetic, faible risque, faible impact. **Selection des plus utiles a traiter** :

| # | Finding | Fix | Effort |
|---|---------|-----|--------|
| 28 | F-S13-03 ARIA (deja P1) | — | — |
| 29 | F-S13-19 | 3x import React inutile → supprimer | S |
| 30 | F-S7-01 | Agents sans model:/tools: frontmatter → ajouter | S |
| 31 | F-S8-04..12 | Specs commands cosmetic (numerotation, jargon, format) | S |
| 32 | F-S5-01..19 | Workflows routing cosmetic → lot de 5-10 les plus impactants | M |
| 33 | F-S16-04..10 | Strategic suggestions cosmetic (setup-guide, module-scaffold doc) | S |
| 34 | F-S15-08..10 | CI lint/VG gate + tests naming + .DS_Store | S |

**Estimation P3** : ~15-20 fixes cosmetic, effort total ~1-2h. Beaucoup sont des one-liners.

## 5. Propositions architecture (refonte moderee)

### 5.1 A traiter dans S20-S22

| Proposition | Impact | Risque | Decision requise Kevin |
|-------------|--------|--------|----------------------|
| Supprimer Dashboard.tsx (doublon Commander) | UI simplifie, -260L | Nul si redirect /dashboard → /commander | Non (evident) |
| Extraire LoadingSkeleton + META constants partagees | DRY, maintenabilite | Nul | Non |
| Guard DEV sur clearAllData + DELETE RLS | Securite data | Nul | Non |
| CI: ajouter DS build + branches + cache fix | CI robuste | Nul | Non |
| updated_at + trigger sur 6 tables | Audit trail DB | Migration simple | Non |

### 5.2 Hors scope — Phase 5

| Proposition | Pourquoi hors scope | Pre-requis |
|-------------|-------------------|------------|
| **DS-6** migration 221 couleurs → var(--fos-*) | 25 fichiers, risque visuel, pre-requis tokens consommables | Build DS + import dans app + fichier par fichier |
| **Extraction modules/shared** (auth+DB) | 1 seul module actif, premature | 2e module concret |
| **Migration vite@8 + react@19 + tailwind@4** | Breaking changes multiples, chantier dedie | Apres cycle 3 complet (D-S14-01) |
| **Agent SDK Anthropic** | Explorer formalisation Cortex en natif | SDK mature + evaluation |
| **MCP custom CONTEXT.md** | Anti-compactage via contexte a la demande | Spec + implementation |
| **Supabase MCP + Vercel MCP** | Quick wins connexion post-cycle3 | Installation simple |

## 6. Ce qui ne sera PAS fixe et pourquoi

| Element | Raison |
|---------|--------|
| DS-6 couleurs (221 hex) | Chantier Phase 5, hors refonte moderee |
| modules/shared extraction | Premature, 1 seul module |
| Migration deps majeures | Breaking changes, chantier dedie post-cycle3 |
| Plugins OMC ajout massif | Ratio usage 7.2%, pas de besoin concret |
| Sentry MCP | App pas en prod |
| AutoGPT-like autonomie | Human-in-loop = force, pas limite |
| Findings HORS SCOPE (F-S10-03/04/09) | Responsabilite mainteneurs externes (superpowers, gstack) |

## 7. Roadmap d'execution — 3 batches

### S20 — Batch P1 critiques (4 fixes)

| Fix | Quoi modifier | Comment verifier | Effort |
|-----|--------------|-----------------|--------|
| F-S13-01 | mutations.ts: remplacer 21x `any` par types Insert/Update/unknown | `tsc --noEmit` + vitest | M |
| F-S13-02 | Nouvelle migration SQL: 6x DELETE RLS policies | `supabase db diff` + vitest | S |
| F-S13-03 | 3 forms: ajouter role="dialog", aria-modal, aria-labelledby | Build + visual check | S |
| F-S13-08 | mutations.ts clearAllData: guard `import.meta.env.DEV` | Build + vitest clearAllData test | S |

**Effort S20 estime** : ~2h. **Verification** : build + tests + health-check apres chaque fix.

### S21 — Batch P2 importants (~23 fixes)

Decoupe en 5 lots :

| Lot | Fixes | Effort |
|-----|-------|--------|
| Code quality | #5-10 (console.log, double export, seed data, CRUD test, inline fn) | ~1h |
| UI duplication | #11-17 (Dashboard suppression, globalStyles, LoadingSkeleton, META, fonts, Knowledge, dates) | ~1.5h |
| CI/CD | #18-20 (DS build, cache path, updated_at migration) | ~1h |
| Docs/specs | #21-25 (brief v9, sync.md, jargon, CLAUDE.md, vulns doc) | ~1h |
| Deps/misc | #26-27 (plan migration doc, PASSWORD_MIN) | ~30min |

**Effort S21 estime** : ~5h total (~2 sessions). **Verification** : idem S20.

### S22 — Batch P3 cosmetic (~15-20 fixes)

| Lot | Fixes | Effort |
|-----|-------|--------|
| Code | #29 (import React), minor cleanups | ~30min |
| Docs | #30-34 (agents frontmatter, commands specs, workflows, strategic) | ~1.5h |

**Effort S22 estime** : ~2h. **Verification** : health-check final.

### Effort total S20-S22

| Session | Fixes | Effort estime |
|---------|-------|---------------|
| S20 P1 | 4 | ~2h (1 session) |
| S21 P2 | ~23 | ~5h (2 sessions) |
| S22 P3 | ~15 | ~2h (1 session) |
| **Total** | **~42** | **~9h (4 sessions)** |

## 8. Findings S19

### F-S19-01 (P2) — Debt reelle plus faible qu'estimee

La dette batch S21 etait estimee a ~66 fixes dans CONTEXT.md. Apres consolidation S19 : **~42 fixes actionnables** (4 P1 + 23 P2 + 15 P3). La difference vient de (a) 6 P1 deja fixes, (b) doublons entre sessions consolides, (c) findings hors scope retires. L'estimation initiale surestimait de ~36%.

### F-S19-02 (P3) — Pattern meta positif : cycle auto-correctif

Le cycle audit-then-fix lineaire (D-S7-01) s'est avere auto-correctif : les housekeeping entre sessions ont resolu des P1 avant meme le batch formel. Le modele strict "pas de fix pendant l'audit" a ete assoupli de facto par les housekeeping, avec un resultat positif.

## 9. Decisions

| ID | Decision |
|----|----------|
| D-S19-01 | Roadmap fixes validee : S20 (4 P1) → S21 (23 P2) → S22 (15 P3) |
| D-S19-02 | Hors scope Phase 5 : DS-6, shared extraction, deps majeures, Agent SDK, MCP custom |
| D-S19-03 | Escalade F-S13-08 P2→P1 confirmee (cross-ref D-S18-01) |
| D-S19-04 | Retrogradations P2→P3 confirmees : F-S4-02, F-S5-20, F-S15-01, F-S16-03 |

## 10. GATE G1 — Validation Kevin requise

**Avant de commencer S20, Kevin doit valider :**

1. **Batch P1 (4 fixes)** — OK pour appliquer ? Specifiquement :
   - Guard DEV sur clearAllData (F-S13-08 escalade) → on garde la fonction mais on la protege, OK ?
   - DELETE RLS policies → nouvelle migration SQL, OK ?

2. **Batch P2 (23 fixes)** — Scope OK ? Specifiquement :
   - Supprimer Dashboard.tsx et redirect → Commander, OK ?
   - updated_at migration sur 6 tables, OK ?

3. **Hors scope Phase 5** — DS-6, shared extraction, deps majeures → confirme parking ?

4. **Effort ~9h (4 sessions S20-S22)** — rythme OK ?

**STOP — en attente validation Kevin.**
