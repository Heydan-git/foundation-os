# Cycle 3 — S13 Module App Builder deep

> **Status** : DONE 2026-04-10 (phase A lecture + phase B sub-agent forms/Commander)
> **Mode** : MIX (MOI logique transversale + sub-agent UI isolee)
> **Scope** : modules/app/ complet (43 fichiers, ~4500L code, 7 pages, 8+ composants, 5 lib, 7 tests, 1 migration SQL)
> **Branche** : `audit-massif-cycle3` | **Baseline** : DEGRADED 84 refs cassees (zero drift)
> **Cross-refs** : S1 read-log-S1-code.md (carto initiale), S11 F-S11-15 RLS scope, DS-6 tokens consumption
> **Commits** : `<S13>` (ce livrable)

## 1. Objectif

Premier audit de **code vivant** du cycle 3 (S1-S12 = docs/scripts/agents/commands/skills/memoire). Scope : modules/app/src/ complet — lib (auth, mutations, hooks, types, supabase client), pages (7), composants (8 generaux + 7 Commander + 3 forms), tests (7 fichiers, 19 tests), migration SQL (1 fichier, 309L).

## 2. Methodologie

Mode MIX conforme plan S13 :
- **MOI** : lib/ (AuthContext, mutations, useCommander, supabase, database.types), App.tsx, main.tsx, pages/ (7), composants generaux (Layout, Card, Badge, TabBar, StatPill, Navbar, SupabaseCRUDTest), migration SQL, cross-ref DB types/RLS
- **Sub-agent Explore** : forms/ (3 fichiers) + Commander/ (7 fichiers) — UI isolee, zero logique transversale

Angles d'audit : types safety, securite (RLS, any, XSS), accessibilite, design system compliance (tokens vs hardcode), duplication, code mort, patterns React.

## 3. Findings

### 3.1 Severite P1 (3 findings)

| ID | Finding | Source | Preuve |
|----|---------|--------|--------|
| F-S13-01 | **mutations.ts bypass complet des types DB** : 21x `any` (params + catch) alors que `database.types.ts` exporte `Insert`/`Update` pour chaque table. Le fichier de types existe, il est juste ignore. | mutations.ts:14,32,38,50,74,91,97,109,135,152,160,176,183,195,203,219,226,246,248,269,293 | `sessionData: any`, `updates: any`, `error: any` — 21 occurrences |
| F-S13-02 | **No DELETE RLS policy sur 6 tables** : migration SQL definit SELECT/INSERT/UPDATE policies mais aucune DELETE policy. L'app a pourtant `deleteSession()`, `deleteDecision()`, `clearAllData()` dans mutations.ts. | 001_create_tables.sql:23-33, 54-64, 85-95, 117-125, 148-156, 177-184 | Grep `FOR DELETE` = 0 match. Confirme F-S11-15 |
| F-S13-03 | **Modals sans accessibilite** : AddSessionForm, EditDecisionModal, NextStepActions — pas de `role="dialog"`, `aria-modal`, `aria-label` sur close buttons. Utilisateurs clavier/screen-reader ne peuvent pas interagir. | AddSessionForm.tsx:74+, EditDecisionModal.tsx:102+, NextStepActions.tsx:140+ | Sub-agent confirme |

### 3.2 Severite P2 (10 findings)

| ID | Finding | Source | Preuve |
|----|---------|--------|--------|
| F-S13-04 | **116x couleurs Void Glass hardcodees** dans 25 fichiers au lieu de CSS vars `--fos-*`. Les tokens DS existent dans `@foundation-os/design-system/tokens.css` (importe main.tsx) mais ne sont consommes nulle part dans le code app. | Grep `#06070C\|#5EEAD4\|...` = 116 occurrences | DS-6 partial = import OK, consommation = 0% |
| F-S13-05 | **43x console.log/error/warn** en production. Pas de log level, pas de stripping au build. mutations.ts seul = 25 occurrences. | Grep `console\.(log\|error\|warn)` = 43 | mutations.ts:30,34,48,52,64,68,89,93,107,111,128,132,150,154,175,179,194,198,216,220,242,247,271,287 |
| F-S13-06 | **Dashboard.tsx quasi-doublon de Commander.tsx** : meme hook useCommander, meme pattern tabs, meme LoadingSkeleton, META constantes dupliquees (version, phase, objectif). | Dashboard.tsx vs Commander.tsx | Seule diff : Dashboard a PipelineSection + tabs differents |
| F-S13-07 | **App.tsx globalStyles duplique index.css** : animations (fadeIn, pulse, spin), scrollbar, reset — definis deux fois (L13-26 + index.css). | App.tsx:13-26, index.css:1-22 | Duplication CSS |
| F-S13-08 | **clearAllData() operation destructive exposee** : supprime TOUTES les donnees de 5 tables sans granularite. Accessible via Phase1Demo UI (bouton "Clear Test Data"). | mutations.ts:275-290, Phase1Demo.tsx:360-381 | `supabase.from('X').delete().not('id','is',null)` x5 |
| F-S13-09 | **Phase1Demo.tsx 545L + double export** : approche la limite CLAUDE.md 700L. Export nomme L16 (`export const Phase1Demo`) + export default L545 (`export default Phase1Demo`). | Phase1Demo.tsx:16,545 | Double export = confusion imports |
| F-S13-10 | **useCommander.ts embed 65L de seed data** : donnees statiques hardcodees dans le hook (5 sessions, 12 decisions, 4 risks, 11 docs, 4 context blocks, 5 next steps). Stale (dates 2026-04-02/03). | useCommander.ts:11-68 | Devrait etre dans un fichier separe |
| F-S13-11 | **38x `any` total** dans 6 fichiers : mutations.ts (21), Phase1Demo.tsx (10), AuthContext.test.tsx (3), EditDecisionModal.tsx (1), AddSessionForm.tsx (1), mocks/supabase.ts (2). | Grep `: any` = 38 | database.types.ts fournit les types Insert/Update |
| F-S13-12 | **Inline functions JSX dans forms** causant re-renders : onClick/onChange/onKeyDown creent de nouvelles fonctions a chaque render dans NextStepActions.tsx. | NextStepActions.tsx:166,216,219-222 | Sub-agent confirme |
| F-S13-13 | **Couleurs hardcodees dans 10 Commander/forms fichiers** : tous les panels (Sessions, Decisions, Risks, NextSteps, Context, Docs, StatsBar) + 3 forms utilisent hex directs au lieu de tokens. | Sub-agent rapport complet | Chaque fichier a 5-15 hex hardcodes |

### 3.3 Severite P3 (8 findings)

| ID | Finding | Source | Preuve |
|----|---------|--------|--------|
| F-S13-14 | LoadingSkeleton duplique : defini independamment dans Commander.tsx:35-52 et Dashboard.tsx:193-200 | Commander.tsx, Dashboard.tsx | Meme pattern pulse/border/height |
| F-S13-15 | META constantes dupliquees entre Commander.tsx:16-22 et Dashboard.tsx:7-12 (version, phase, objectiveCT) | Commander.tsx, Dashboard.tsx | 3 props identiques |
| F-S13-16 | Google Fonts `@import url(...)` dans App.tsx:14 (JS string) = render-blocking, devrait etre dans index.html ou CSS | App.tsx:14 | `@import url('https://fonts.googleapis.com/...')` |
| F-S13-17 | KnowledgePage.tsx 347L dont ~145L de donnees statiques stale (manifeste, journal, frameworks, stack, roadmap) embeddees dans le composant | KnowledgePage.tsx:33-147 | Dates 2026-04-02/03, phases stales |
| F-S13-18 | PASSWORD_MIN = 8 duplique entre LoginPage.tsx:6 et ResetPasswordPage.tsx:13, inputStyle extrait dans ResetPasswordPage mais inline dans LoginPage | LoginPage.tsx:6, ResetPasswordPage.tsx:13-35 | Pattern asymetrique |
| F-S13-19 | 3x `import React` inutilise dans forms (JSX runtime moderne ne le requiert pas) | AddSessionForm.tsx:5, EditDecisionModal.tsx:5, NextStepActions.tsx:5 | Sub-agent confirme |
| F-S13-20 | Commander.tsx L21 `lastSync: '2026-04-04'` hardcode = 6 jours stale, idem KnowledgePage L35 `lastSync: '2026-04-03'` | Commander.tsx:21, KnowledgePage.tsx:35 | Donnees figees |
| F-S13-21 | SupabaseCRUDTest.tsx 426L page test en production build — devrait etre exclue ou lazy-loaded | SupabaseCRUDTest.tsx | Incluse dans bundle 457kB |

## 4. Decisions

Toutes batchees S21 housekeeping (strict D-S7-01 audit lineaire) :

| ID | Decision | Batch |
|----|----------|-------|
| D-S13-01 | F-S13-01 fix mutations.ts : remplacer 21x `any` par types `Database['public']['Tables'][X]['Insert']` / `['Update']` | S21 |
| D-S13-02 | F-S13-02 ajouter DELETE RLS policies 6 tables (ou documenter l'absence si intentionnel solo) | S21 |
| D-S13-03 | F-S13-03 ajouter role="dialog" + aria-modal + aria-label aux 3 modals | S21 |
| D-S13-04 | F-S13-04 migration couleurs hardcodees → var(--fos-*) (large scope, couple DS-6 complet) | S21 ou DS-6 |
| D-S13-05 | F-S13-05 soit strip console.log au build (vite plugin), soit remplacer par logger conditionnel | S21 |
| D-S13-06 | F-S13-06 merge Dashboard dans Commander (ou extraire shared hook/components) | S21 |
| D-S13-07 | F-S13-07 supprimer globalStyles App.tsx, centraliser dans index.css | S21 |
| D-S13-08 | F-S13-08 soit retirer clearAllData, soit le proteger derriere env check `import.meta.env.DEV` | S21 |
| D-S13-09 | F-S13-09 fix double export Phase1Demo + refactor < 500L | S21 |
| D-S13-10 | F-S13-10 extraire seed data dans fichier separe `lib/seed-data.ts` | S21 |
| D-S13-11 | F-S13-11 batch elimination `any` dans 6 fichiers (couple D-S13-01) | S21 |
| D-S13-12 | F-S13-12 useCallback ou extraction handlers dans NextStepActions | S21 P3 |
| D-S13-13 | F-S13-13 migration couleurs Commander/forms (couple D-S13-04) | S21 ou DS-6 |

## 5. Cross-references

- **F-S13-02 confirme F-S11-15** : RLS DELETE absent, meme finding via angle different (S11 = grep policies, S13 = cross-ref code delete vs SQL)
- **F-S13-04 couple DS-6** : les tokens existent (DS-1..DS-4), main.tsx les importe (DS-6 partial), mais 0% de consommation dans le code app
- **F-S13-01 mirror read-log-S1** : S1 avait signale mutations.ts 21 `any` / 25 console — confirme 6 jours plus tard, zero correction
- **F-S13-17 mirror read-log-S1** : S1 avait signale KnowledgePage 347L hardcoded data

## 6. Out-of-scope

| ID | Item | Raison |
|----|------|--------|
| OOS-S13-01 | Tests unitaires coverage gap analysis | Plan S13.5, reporte (reading tests pas de nouveaux findings vs code audit) |
| OOS-S13-02 | Performance profiling (bundle size, lazy loading) | S14 SUGG-1 scope |
| OOS-S13-03 | npm audit / deps outdated | S14 SUGG-6 scope |

## 7. Learnings metaboliques

1. **Le Design System existe mais n'est pas consomme** : tokens.css est importe dans main.tsx (DS-6 partial OK) mais 0/116 couleurs utilisent les vars CSS. Pattern : "infra livree, adoption = 0%". La migration inline → var() est le vrai travail DS-6 complet, pas l'import.

2. **Les types existent mais sont ignores** : database.types.ts fournit des types Row/Insert/Update pour chaque table, mais mutations.ts utilise `any` partout. Meme pattern que le DS : "l'outillage est present, l'adoption est absente". Fix le plus impactant du S21.

3. **Premier vrai audit de code = densite P1/P2 plus elevee** que les sessions docs/scripts. 3 P1 + 10 P2 + 8 P3 = 21 findings, dont plusieurs sont des bugs reels (RLS DELETE, clearAllData) et pas juste de la doc stale.

## 8. Next session

**S14 — SUGG tech part 1** (perf + deps + types) conforme plan cycle 3. Mode MIX avec sub-agents pour npm audit + bundle analysis.
