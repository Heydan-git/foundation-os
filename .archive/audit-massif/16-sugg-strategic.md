# Cycle 3 — S16 SUGG strategic (doc cognitif + anti-bullshit + multi-modules)

> **Status** : DONE 2026-04-10
> **Mode** : MOI (analyse directe)
> **Scope** : SUGG-2 doc cognitif test, SUGG-9 anti-bullshit historique, SUGG-12 multi-modules readiness
> **Branche** : `audit-massif-cycle3` | **Baseline** : DEGRADED 83 refs cassees (zero drift)
> **Cross-refs** : S12 (memory tiers), S13 (app code), S14/S15 (tech), D-S11-14 (RLS multi-user)
> **Commits** : `<S16>` (ce livrable)
> **Note** : SUGG-10 BMAD verdict deja couvert S10, SUGG-11 memory tiers deja couvert S12

## 1. Objectif

Audit strategique 3 axes : (1) test cognitif "Kevin part 6 mois" — la doc permet-elle de reprendre sans oral ?, (2) verification anti-bullshit — les metriques/promesses dans CONTEXT.md sont-elles encore vraies ?, (3) strategie multi-modules — que faut-il pour ajouter Finance/Sante/Trading ?

## 2. Methodologie

- Lecture exhaustive docs/ (13 fichiers racine, 5 fichiers core/, plans/, specs/)
- Cross-ref CONTEXT.md metriques vs health-check reel
- Cross-ref decisions-log.md vs etat actuel
- Projection architecture 4 modules

---

## 3. SUGG-2 — Test cognitif "Kevin part 6 mois"

**Scenario** : Kevin revient apres 6 mois. Il n'a que le repo git. Pas de conversation Claude, pas de memoire orale.

### 3.1 Ce qui fonctionne

| Question | Reponse dans docs/ | Source |
|----------|---------------------|--------|
| C'est quoi ce projet ? | Oui | docs/architecture.md, docs/manifeste.md, README.md |
| Comment installer ? | Oui | docs/setup-guide.md (7 etapes claires) |
| Comment lancer en dev ? | Oui | setup-guide.md + CLAUDE.md section Build |
| Quelle stack ? | Oui | architecture.md table, CLAUDE.md section Stack |
| Ou est le code ? | Oui | docs/index.md (carte complete) |
| Quels agents/commands ? | Oui | CLAUDE.md sections Agents/Commands |
| Quel design system ? | Oui | docs/design-system.md (Void Glass) |
| Ou en est le projet ? | Oui | CONTEXT.md (source de verite) |
| Quelles decisions passees ? | Oui | CONTEXT.md + docs/decisions-log.md |
| Comment fonctionne le Core OS ? | Oui | docs/core/ (4 specs) |

### 3.2 Ce qui manque ou est fragile

| Question sans reponse | Impact | Priorite |
|-----------------------|--------|----------|
| **Comment deployer manuellement ?** | Vercel auto-deploy OK mais si ca casse, aucun guide de rollback ou deploy manuel | P2 |
| **Comment ajouter un module ?** | `scripts/module-scaffold.sh --help` existe mais pas documente dans setup-guide ni index.md section dediee | P3 |
| **Quels secrets/env sont necessaires ?** | `.env.local.example` existe (5 vars) mais setup-guide.md ne le mentionne pas | P2 |
| **Comment lancer les tests ?** | Pas dans setup-guide.md (seulement `npm run dev` et `npm run build`) | P3 |
| **Que faire si health-check BROKEN ?** | monitor.md explique les verdicts mais pas les actions de remediation | P3 |
| **Design System : comment ajouter un token/composant ?** | modules/design-system/ existe, pas de CONTRIBUTING ou guide dev DS | P3 |
| **Quelle est la roadmap ?** | CONTEXT.md section Prochaine action = court terme. Pas de vue 3-6 mois lisible hors specs | P3 |
| **Historique des incidents ?** | Aucun fichier. Les incidents sont noyes dans les livrables audit-massif/ | P3 |

### 3.3 Verdict cognitif

**7/10** — Kevin peut reprendre le projet. Les fondamentaux sont documentes (stack, structure, state, decisions). Les gaps sont operationnels (deploy, env, tests, remediation) pas conceptuels. Un dev externe aurait plus de mal : le projet suppose une familiarite avec Claude Code et le workflow /session-start / /session-end.

---

## 4. SUGG-9 — Anti-bullshit historique

Verification des metriques et promesses dans CONTEXT.md et decisions-log.md vs etat reel.

### 4.1 Metriques verifiees (health-check 2026-04-10)

| Promesse CONTEXT.md | Valeur reelle | Match |
|---------------------|---------------|-------|
| Build 728ms | 791-883ms (varie) | **DRIFT** — 728ms date du moment de la mesure, la valeur fluctue. Non faux mais misleading car presente comme fixe |
| JS 457.15kB | 457.15kB | OK |
| CSS 22.12kB | 22.12kB | OK |
| 19 tests | 19 tests | OK |
| 8 routes | 8 routes | OK |
| Navbar 4 items | 4 items | OK |
| 0 artifact JSX | 0 | OK |
| 6 tables Supabase | 6 tables | OK |
| 7 MD pairs | 7/7 | OK |

### 4.2 Decisions archivees verifiees

| Decision archivee | Encore valide ? | Note |
|-------------------|-----------------|------|
| Stack Vite+React+TS+Tailwind+Supabase | Oui | Pas de migration effectuee |
| Void Glass design | Oui | Actif via hooks |
| Monorepo modules/ | Oui | 2 modules (app + design-system) |
| Conventional commits | Oui | Hook actif |
| Anti-bullshit gates | Oui | Dans CLAUDE.md |
| Schema DB 6 tables | Oui | 1 migration, pas de changement |
| BMAD garde dormant | Oui | Reconfirme S10 |
| Phase 1-4 DONE | Oui | Pas de regression |
| module-scaffold | Oui | Script present et executable |
| Core OS 4 modules | Oui | Specs a jour |

### 4.3 Findings anti-bullshit

| Finding | Severite |
|---------|----------|
| Build time "728ms" dans CONTEXT.md = snapshot, pas valeur stable. Varie 750-900ms selon charge. Devrait dire "~800ms" ou "< 1s" | P3 |
| "0 artifact JSX" est vrai mais la mention est obsolete — les artifacts ont ete archives il y a 10+ sessions, plus besoin de le tracker | P3 |
| 73 refs cassees au dernier session-end vs 83 maintenant = drift non documente (mais forward-refs connues, pas grave) | P3 |

**Verdict anti-bullshit : PROPRE.** Aucune metrique fausse. 3 imprécisions mineures (snapshot vs range, info obsolete, drift refs). Pas de promesse inventee, pas de "100%" non prouve. Les gates CLAUDE.md fonctionnent.

---

## 5. SUGG-12 — Strategie multi-modules

**Projection** : 4 modules co-existants (App Builder + Finance + Sante + Trading).

### 5.1 Ce qui doit etre partage

| Ressource | Etat actuel | Readiness |
|-----------|-------------|-----------|
| **Auth (Supabase)** | AuthContext.tsx dans modules/app/src/lib/ | **Non partage** — chaque module devrait importer un AuthContext commun. Candidat modules/shared/ ou package workspace |
| **DB client (Supabase)** | supabase.ts dans modules/app/src/lib/ | **Non partage** — meme probleme, client init duplique si chaque module copie |
| **Design System** | modules/design-system/ (workspace) | **Pret** — deja package @foundation-os/design-system, consommable par tout module |
| **Tokens CSS** | tokens.css via DS build | **Pret** — importable via workspace dep |
| **Deploy config** | Vercel root dir = modules/app | **Non pret** — deployer 4 modules = 4 projets Vercel OU monorepo Vercel multi-app |
| **CI** | ci.yml hardcode modules/app | **Non pret** — devra etre matrice ou multi-job |
| **Types DB** | database.types.ts dans modules/app | **Non partage** — chaque module aura ses propres tables + besoin des types shared |
| **Navigation** | Navbar dans modules/app | **Ambigu** — navigation inter-modules (app-switcher) non pensee |
| **Health check** | scripts/health-check.sh hardcode modules/app | **Non pret** — devra iterer sur modules/*/  |

### 5.2 Ce qui doit etre isole

| Ressource | Pourquoi |
|-----------|----------|
| Business logic (composants, pages, hooks) | Chaque module a son domaine |
| Tables DB specifiques | Finance a ses propres tables (transactions, accounts, budgets) |
| Routes | Chaque module a son router |
| Tests | Chaque module a ses propres tests |
| Package.json | Chaque module = son propre workspace |

### 5.3 Architecture cible proposee

```
foundation-os/
  modules/
    shared/              NOUVEAU — package @foundation-os/shared
      src/
        auth/            AuthContext, useAuth
        db/              supabase client, base types
        layout/          AppShell, AppSwitcher nav
    design-system/       EXISTE — tokens, primitives
    app/                 EXISTE — App Builder
    finance/             FUTUR — module Finance
    sante/               FUTUR — module Sante
  supabase/
    migrations/
      001_create_tables.sql      EXISTE — tables app
      002_finance_tables.sql     FUTUR
      003_sante_tables.sql       FUTUR
  scripts/
    health-check.sh      ADAPTER — iterer modules/*/
  .github/workflows/
    ci.yml               ADAPTER — matrix strategy modules
```

### 5.4 Chantiers pre-expansion identifies

| Chantier | Effort | Prerequis |
|----------|--------|-----------|
| Extraire modules/shared/ (auth + db + layout) | 1-2 sessions | npm workspaces deja en place |
| Adapter CI matrix multi-modules | 1 session | D-S15-02/03 (CI gaps) |
| Adapter health-check.sh multi-modules | 0.5 session | D-S9-01 (regex fix) |
| RLS user_id filtering | 1 session | D-S11-14 (obligatoire multi-user) |
| Vercel multi-app ou monorepo deploy | 1 session | Evaluer Vercel monorepo support |
| App-switcher navigation inter-modules | 0.5 session | modules/shared/ layout |
| Migration incrementale DB (002+) | par module | Workflow Supabase migrations |

**Effort total estime** : 5-7 sessions de prep avant le premier module supplementaire.

---

## 6. Findings consolides

| ID | Severite | Finding |
|----|----------|---------|
| F-S16-01 | P2 | setup-guide.md ne mentionne pas .env.local.example ni les secrets necessaires |
| F-S16-02 | P2 | Pas de guide deploy manuel / rollback si Vercel casse |
| F-S16-03 | P2 | Auth + DB client non extractibles — bloquant pour multi-modules |
| F-S16-04 | P3 | setup-guide.md ne mentionne pas `npm test` / `npx vitest run` |
| F-S16-05 | P3 | module-scaffold.sh non documente dans setup-guide ni index.md |
| F-S16-06 | P3 | Build time "728ms" = snapshot pas valeur stable |
| F-S16-07 | P3 | "0 artifact JSX" dans CONTEXT.md = info obsolete, plus pertinente |
| F-S16-08 | P3 | health-check.sh hardcode modules/app, non pret multi-modules |
| F-S16-09 | P3 | Pas de CONTRIBUTING ou guide dev pour Design System |
| F-S16-10 | P3 | CI hardcode modules/app, non pret multi-modules |

## 7. Decisions

| ID | Decision | Batch |
|----|----------|-------|
| D-S16-01 | Enrichir setup-guide.md : ajouter .env.local.example + npm test + module-scaffold ref | S21 |
| D-S16-02 | Documenter procedure deploy/rollback Vercel (1 paragraphe dans setup-guide ou doc dediee) | S21 |
| D-S16-03 | Pre-expansion : extraire modules/shared/ (auth + db) = premier chantier Phase 5 | post-cycle3 |
| D-S16-04 | Nettoyer CONTEXT.md : remplacer "728ms" par "< 1s", retirer "0 artifact JSX" | S21 |
| D-S16-05 | Adapter CI + health-check multi-modules = chantier Phase 5 prep | post-cycle3 |
| D-S16-06 | CONTRIBUTING.md Design System = post-cycle3 si besoin | parking |

## 8. Cross-references

- F-S16-01 couple S15 F-S15-08 (hooks locaux vs CI) — meme pattern "local setup non documente"
- F-S16-03 couple D-S11-14 (RLS user_id multi-user) — meme prerequis expansion
- F-S16-08/10 couple S15 F-S15-02/03 (CI non pret workspace/branches)
- F-S16-06 couple S14 section 3.1 (perf mesure variable)

## 9. Learnings metaboliques

1. **L-S16-01 Doc cognitif 7/10 = suffisant solo, insuffisant equipe** : le projet est reprendable par Kevin seul grace a CONTEXT.md + CLAUDE.md. Un dev externe aurait besoin de 2-3h d'onboarding oral. Les gaps sont operationnels (comment deployer, comment tester) pas conceptuels (quoi, pourquoi).

2. **L-S16-02 Anti-bullshit gates fonctionnent** : zero metrique inventee apres 15 sessions d'audit. Les gates CLAUDE.md (verification obligatoire, mots interdits) sont efficaces. Les seules imprecisions sont des snapshots presentes comme valeurs fixes — un probleme de format pas de veracite.

3. **L-S16-03 Multi-modules = 5-7 sessions de prep** : le monorepo est structure (npm workspaces, DS package), mais le code partage (auth, db, layout) est encore dans modules/app. L'extraction est le goulot d'etranglement, pas l'architecture.

4. **L-S16-04 decisions-log.md = archive saine** : les 17 decisions archivees sont toutes encore valides. Aucune decision contredite par l'etat actuel. Le protocole d'archivage fonctionne.

## 10. Next session

**S17 — External research** (mode SUB : best practices OS personnels, MCP/OMC nouveaux, frameworks emergents) conforme plan cycle 3.
