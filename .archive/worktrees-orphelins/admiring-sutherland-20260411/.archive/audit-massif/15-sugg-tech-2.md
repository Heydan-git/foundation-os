# Cycle 3 — S15 SUGG tech part 2 (coverage + CI/CD + DB + naming)

> **Status** : DONE 2026-04-10
> **Mode** : MOI (commandes directes)
> **Scope** : SUGG-3 coverage gap analysis, SUGG-4 CI/CD pipeline, SUGG-5 DB schema, SUGG-8 naming conventions
> **Branche** : `audit-massif-cycle3` | **Baseline** : DEGRADED 83 refs cassees (zero drift vs S14)
> **Cross-refs** : S13 F-S13-03 (no DELETE RLS), S14 F-S14-01/02 (deps), S9 D-S9-12 (no unit tests scripts)
> **Commits** : `<S15>` (ce livrable)

## 1. Objectif

Audit technique 4 axes : coverage gap analysis (quels fichiers critiques sans tests), CI/CD pipeline review (failure modes, gaps), DB schema deep (indexes, RLS, drift types), naming conventions coherence.

## 2. Methodologie

Commandes directes (mode MOI — tests mecaniques) :
- `npx vitest run --coverage` (tentative — dep manquante)
- Inventaire source files vs test files (cross-ref manuel)
- Lecture ci.yml + supabase-ping.yml (pipeline complete)
- Lecture 001_create_tables.sql vs database.types.ts (drift check)
- `find` + `basename` naming patterns par categorie

## 3. Findings

### 3.1 SUGG-3 Coverage gap analysis

**Inventaire** : 42 fichiers source (.ts/.tsx) dont 6 test files + 1 mock + 1 setup = **34 fichiers production**.

**Tests existants** (6 fichiers, 19 tests) :

| Test file | Couvre | Criticite |
|-----------|--------|-----------|
| app.test.tsx | App.tsx (render, routing) | haute |
| AuthContext.test.tsx | AuthContext.tsx (auth state) | haute |
| forms.test.tsx | AddSessionForm, EditDecisionModal, NextStepActions | haute |
| mutations.test.ts | mutations.ts (CRUD ops) | haute |
| supabase.test.ts | supabase.ts (client init) | moyenne |
| useCommander.test.ts | useCommander.ts (hook) | haute |

**Fichiers critiques SANS tests** :

| Fichier | Criticite | Raison |
|---------|-----------|--------|
| pages/Commander.tsx | haute | Page principale, orchestre 6 panels + state |
| pages/LoginPage.tsx | haute | Auth flow, redirect logic |
| pages/ResetPasswordPage.tsx | haute | Password reset flow |
| pages/Dashboard.tsx | moyenne | Affichage stats |
| components/Commander/*.tsx (6 panels) | moyenne | UI rendering, data display |
| components/Navbar.tsx | moyenne | Navigation, NavLink active state |
| components/Layout.tsx | basse | Wrapper simple |
| pages/IndexPage.tsx | basse | Page statique |
| pages/KnowledgePage.tsx | basse | Contenu hardcode (couple S13 F-S13-07) |
| pages/Phase1Demo.tsx | basse | Demo page |
| database.types.ts | basse | Types purs, pas de logique |

**Coverage estimee** : ~6/34 fichiers production = **18%**. Les 6 fichiers testes couvrent le coeur (auth, mutations, hook, forms) mais les pages et composants UI sont a zero.

**Dep manquante** : `@vitest/coverage-v8` non installe — impossible de mesurer le coverage line-by-line. Seul le coverage file-level est observable.

### 3.2 SUGG-4 CI/CD pipeline review

**ci.yml** (push main + PR main) :

| Step | Present | Verdict |
|------|---------|---------|
| checkout | oui | OK |
| Node 24 + npm cache | oui | OK |
| npm ci | oui | OK |
| tsc --noEmit | oui | OK |
| npm run build | oui | OK |
| vitest run | oui | OK |
| Lint (eslint) | **non** | Gap |
| Coverage gate | **non** | Gap |
| Void Glass check | **non** | Gap (local seulement via hook) |
| Security audit | **non** | Gap |
| Design System build | **non** | Gap (prebuild local, pas en CI) |
| timeout | 10 min | OK |

**supabase-ping.yml** (cron lundi 8h UTC + manual) :
- Ping REST endpoint, accept 200 ou 401. Timeout 5min. OK.
- Graceful si secrets absents. OK.

**Failure modes identifies** :

1. **Branches non-main sans CI** : la branche `audit-massif-cycle3` (active depuis 3 jours, ~30 commits ahead) n'a aucun run CI. Un push casse pourrait merger sans detection.
2. **npm ci sans workspace** : ci.yml fait `npm ci` dans modules/app/ mais ne build pas le Design System d'abord. Si modules/app depend de @foundation-os/design-system (DS-6), le build CI pourrait echouer apres merge. Le prebuild local (D-DS-20) ne se replique pas en CI.
3. **Pas de lint CI** : les hooks locaux (Void Glass, security-reminder) ne sont pas repliques en CI. Un contributeur sans les hooks passerait a travers.
4. **Cache basee sur modules/app/package-lock.json** : avec npm workspaces (root package-lock.json), le cache-dependency-path pointe vers un fichier qui n'existe plus ou est secondaire.

### 3.3 SUGG-5 DB schema audit

**6 tables** : sessions, decisions, risks, next_steps, context_blocks, docs.

| Aspect | Etat | Verdict |
|--------|------|---------|
| RLS enabled | 6/6 tables | OK |
| SELECT policy | 6/6 | OK |
| INSERT policy | 6/6 | OK |
| UPDATE policy | 6/6 | OK |
| **DELETE policy** | **0/6** | **P1 confirme S13 F-S13-03** |
| Indexes | 14 indexes sur colonnes filtrees | OK |
| GIN index (tags) | docs.tags | OK |
| Foreign keys | **0** (6 tables independantes) | P3 design choice |
| updated_at | **0/6 tables** | P2 manquant |
| soft delete | **0** (hard delete implicite) | P3 design choice |
| Triggers | 3 (sort_order auto sur insert) | OK |
| Seed data | 1 session + 2 decisions + 5 next_steps + 2 risks + 1 context_block | OK |

**Types drift** : database.types.ts vs migration SQL — **zero drift**. Les types TS mirrorent exactement le schema SQL (memes colonnes, memes enums CHECK, memes nullables). Le commentaire en-tete `Source: supabase/migrations/001_create_tables.sql` est correct.

**RLS pattern uniforme** : `auth.role() = 'authenticated'` sur les 18 policies (6 tables x 3 ops). Pas de filtrage user_id — acceptable scope solo, confirme D-S11-14 (re-audit obligatoire avant Finance/Sante multi-user).

### 3.4 SUGG-8 Naming conventions

| Categorie | Convention | Fichiers | Violations |
|-----------|-----------|----------|------------|
| TSX composants | PascalCase | 20 | 0 |
| TSX pages | PascalCase + suffixe Page/Demo | 7 | 0 |
| TSX tests | camelCase (app.test, forms.test) | 3 | mixte (AuthContext.test = PascalCase) |
| TS modules | camelCase (mutations, supabase) | 5 | 0 |
| TS types | kebab-dot (database.types) | 1 | OK (convention Supabase) |
| TS hooks | camelCase prefixe use | 1 | 0 |
| TS barrels | index.ts | 2 | 0 |
| MD docs | kebab-case | ~40 | 0 |
| MD livrables audit | NN-kebab-case | 14 | 0 |
| Scripts bash | kebab-case.sh | 6 | 0 |
| Git hooks | no-extension | 2 | 0 (convention git) |
| Scripts Python | kebab-case.py | 1 | 0 |
| Dirs src | lowercase | 5 (components/lib/pages/styles/test) | 0 |
| Dirs Commander | PascalCase | 1 | OK (convention composant) |
| .env | .env.local / .env.local.example | 2 | 0 |

**Anomalies mineures** :

1. **Tests TSX mixte** : `app.test.tsx` et `forms.test.tsx` (camelCase) vs `AuthContext.test.tsx` (PascalCase match du fichier source). Inconsistant mais suit la convention "match source file name".
2. **Fichier .DS_Store dans scripts/** : artefact macOS, devrait etre gitignore (deja note, couvert par D-S11-03 batch .gitignore).

**Verdict naming : COHERENT.** Les conventions sont implicites mais respectees. Pas de violations structurelles.

## 4. Findings consolides

| ID | Severite | Finding |
|----|----------|---------|
| F-S15-01 | P2 | Coverage ~18% (6/34 fichiers). Pages et composants UI a zero. `@vitest/coverage-v8` non installe |
| F-S15-02 | P2 | CI ne build pas le Design System (prebuild local D-DS-20 non replique). Risque build fail post-merge DS-6 |
| F-S15-03 | P2 | CI branches non-main sans run. audit-massif-cycle3 ~30 commits ahead sans aucun check |
| F-S15-04 | P2 | 0/6 tables ont `updated_at`. Impossible de tracer les modifications sans audit log |
| F-S15-05 | P2 | CI cache-dependency-path pointe modules/app/package-lock.json. Avec npm workspaces, le lock est a la racine |
| F-S15-06 | P3 | 0 DELETE RLS policy — confirme S13 F-S13-03, couple D-S13-03 |
| F-S15-07 | P3 | 0 FK entre les 6 tables (design isolees). Acceptable solo mais fragile si relations ajoutees |
| F-S15-08 | P3 | CI sans lint/Void Glass/security gate. Hooks locaux non repliques |
| F-S15-09 | P3 | Tests naming mixte camelCase/PascalCase. Mineur, suit convention "match source" |
| F-S15-10 | P3 | .DS_Store dans scripts/ — couple D-S11-03 .gitignore batch |

## 5. Decisions

| ID | Decision | Batch |
|----|----------|-------|
| D-S15-01 | Installer `@vitest/coverage-v8` + ajouter coverage gate CI (seuil 30% initial, incrementer) | S21 |
| D-S15-02 | Ajouter step CI `npm run build --workspace=@foundation-os/design-system` avant build app | S21 |
| D-S15-03 | Etendre ci.yml trigger a `branches: [main, audit-massif-cycle3]` ou `branches: ['**']` pour PR | S21 |
| D-S15-04 | Ajouter `updated_at TIMESTAMPTZ DEFAULT now()` + trigger `before update` aux 6 tables. Migration 002 | S21 |
| D-S15-05 | Corriger cache-dependency-path vers `package-lock.json` (racine) | S21 |
| D-S15-06 | DELETE policies + `updated_at` = meme migration 002 batch. Couple D-S13-03 | S21 |
| D-S15-07 | Convention naming tests = match source file. Documenter dans CLAUDE.md si besoin post-cycle3 | parking |
| D-S15-08 | Lint CI (eslint ou biome) + Void Glass check = post-cycle3 chantier CI | post-cycle3 |

## 6. Cross-references

- F-S15-01 couple S9 D-S9-12 (aucun test unitaire scripts) — coverage gap generalise
- F-S15-02 couple D-DS-20 (prebuild workspace chain) — local-only, pas replique CI
- F-S15-04 couple D-S11-14 (RLS re-audit avant multi-user) — `updated_at` aussi necessaire
- F-S15-05 implicite depuis D-DS-10 (npm workspaces root package.json) — CI non adapte
- F-S15-06 confirme S13 F-S13-03 (zero DELETE, meme finding)
- F-S15-08 couple S11 D-S11-01 (hooks locaux vs CI) — meme pattern "local guard not in CI"
- F-S15-10 couple D-S11-03 (.gitignore batch)

## 7. Learnings metaboliques

1. **L-S15-01 Coverage sans outil = estimation manuelle** : sans `@vitest/coverage-v8`, le coverage est une approximation file-level. L'installer est prerequis a toute gate serieuse.

2. **L-S15-02 CI local-first = dette CI differee** : chaque ajout local (prebuild DS, hooks Void Glass, security-reminder) creuse l'ecart avec le pipeline CI. Pattern recurrent : 4 gaps CI identifies, tous causes par des features ajoutees localement sans miroir CI.

3. **L-S15-03 Schema Supabase = snapshot figee** : 1 seule migration, pas de `updated_at`, pas de FK. Coherent pour un MVP solo mais chaque table ajoutee sans migration incrementale (002, 003...) augmente le risque de drift. Le types TS etant manuels (pas genere par `supabase gen types`), la coherence depend de la discipline.

4. **L-S15-04 Naming implicite mais coherent** : aucune convention documentee, pourtant 0 violation structurelle sur ~60 fichiers. La convention est emergente (habitudes du dev) pas prescrite. Documenter post-cycle3 si l'equipe grandit.

## 8. Next session

**S16 — SUGG strategic** (doc cognitif + anti-bullshit historique + multi-modules readiness) conforme plan cycle 3.
