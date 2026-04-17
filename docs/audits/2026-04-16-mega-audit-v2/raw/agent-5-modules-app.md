---
type: audit-raw
agent: 5
zone: "Modules App Code"
date: 2026-04-16
scope_files: 52
lines_read: 4074
status: completed
---

# RAPPORT AGENT 5 — MODULES APP CODE

## Inventaire

**TOTAL** : 49 fichiers .ts/.tsx dans `src/` (**4074 lignes totales**).
- **Code production** (pages + components + lib + App + main) : 36 fichiers.
- **Tests** : 6 fichiers de tests + 2 fichiers support = 8 fichiers.
- **Stories Storybook** : 9 fichiers (importent `@storybook/react-vite` mais Storybook non declare dans package.json devDependencies).
- **Data documentation** (`data/`) : 7 fichiers MD (historique fige).

Structure principale :
- `modules/app/src/App.tsx` (45L), `main.tsx` (12L), `index.css` (7L)
- `src/components/` : Badge, Card, DashboardLayout (315L), LoadingSkeleton + Commander/* (6 panels + stories) + forms/ (3 fichiers 646L)
- `src/lib/` : AuthContext (61L), constants, database.types (175L), knowledge-data (129L), mutations (311L), seed-data (64L), supabase, useCommander (100L)
- `src/pages/` : Commander (141L), IndexPage (222L), KnowledgePage (327L), LoginPage (154L), ResetPasswordPage (149L)
- `src/test/` : setup, app.test, AuthContext.test (93L), forms.test (96L), mutations.test (89L), supabase.test, useCommander.test (91L), mocks/supabase
- `modules/app/data/` : commander.md (256L), graph.md (196L), index-app-pages.md (138L), knowledge.md (36L), scale-orchestrator.md (37L), sync.md (226L), toolbox.md (150L)
- Configs : package.json, vite.config.ts, vitest.config.ts, tsconfig.json, tsconfig.node.json, vercel.json, postcss.config.js, index.html, README-app-builder.md, .env.local.example, .gitignore

## Statistiques

- **Fichiers TSX > 700 lignes (interdit Kevin)** : **AUCUN**. Max = `KnowledgePage.tsx` (327L), `DashboardLayout.tsx` (315L), `mutations.ts` (311L).
- **Fichiers avec `any` explicite en production** : **AUCUN**. Tous les `any` sont limites aux tests/mocks.
- **Imports vers `@ds/*`** : **AUCUN**. La consommation du DS passe par `@foundation-os/design-system` (seulement 1 import : `main.tsx` ligne 5 pour styles globaux). Pas de consommation de composants DS exportes.
- **Imports `@/` (alias src)** : ~30 occurrences.
- **Tokens `ds-*` / `--ds-*`** : 72 occurrences reparties sur 13 fichiers. Usage coherent.
- **Tokens legacy `--color-bg-canvas` / `--color-accent-brand-primary`** : **5 fichiers encore concernes** : `seed-data.ts`, `knowledge-data.ts` (dans contenu texte), `forms/NextStepActions.tsx`, `forms/EditDecisionModal.tsx`, `forms/AddSessionForm.tsx`. **Les 3 fichiers `forms/` utilisent reellement le token dans le markup = violation.**
- **Couleurs hardcodees `#0a0a0a`** : 9 occurrences dans 7 fichiers.
- **Interdits violation (`#0A0A0B`, `#08080A`, Outfit, Inter, system-ui seul)** : **AUCUN**.
- **#030303 / ds-surface-0** : 5 occurrences.
- **Tests : nombre** : 19 tests `it()` repartis sur 6 fichiers. **CONFIRME 19/19**.
- **Routes `<Route>`** : 6 declarees + catchall. CONTEXT.md dit "5 routes" — ambigu.
- **Bundle reel (dist/assets)** : main 184KB, CSS 54KB. Mais chunk supabase = 228KB, proxy = 130KB (non compte dans annonce).

---

## Findings P0 (app casse, void glass violations, TSX > 700L)

### F-01 — Violations Void Glass dans forms/ : tokens legacy `--color-bg-canvas` / `--color-accent-brand-primary`
- **Fichiers** :
  - `modules/app/src/components/forms/AddSessionForm.tsx:75,78,112,125,147,162,163,164,179`
  - `modules/app/src/components/forms/EditDecisionModal.tsx:92,93,103,107,145,160,161,162,163,177,179,180,181,214`
  - `modules/app/src/components/forms/NextStepActions.tsx:110,111,123,141,215,225`
- **Description** : Les 3 composants `forms/` utilisent l'ancien schema de tokens (`var(--color-bg-canvas)`, `var(--color-accent-brand-primary)`, `bg-[#4FD1C7]`) qui n'existe pas dans le DS courant `ds-*`. Mix avec `text-ds-blue`, `bg-ds-emerald/20`, `border-l-ds-orange` : **incoherence totale** entre DS legacy et DS actuel iso base DS.
- **Impact** : P0. CONTEXT.md affirme "iso base DS — tokens ds-* partout, 0 legacy" — **FAUX**. De plus, ces forms sont **jamais importes par aucune page ni aucun autre composant** — dead code actif avec violations.
- **Recommandation** : Les reecrire avec tokens `ds-*` ou les archiver puisque non utilises (voir F-06 dead code).

### F-02 — SESSION-FINALE contient mots interdits explicites "REVOLUTION HISTORIQUE" / "Reference Mondiale Absolue"
- **Fichiers** :
  - `modules/app/data/commander.md:82-84` + ADRs 040-044 lignes 116-124
- **Description** : CLAUDE.md gardefou "mots interdits : revolution, historique, reference mondiale, premier au monde, $XB, accomplish". Or `data/commander.md` contient **tous** ces mots : "REVOLUTION HISTORIQUE ACHEVEE — Reference Mondiale Absolue", "Premier OS IA-driven commercial mondial", "$1B+ potential", "16,000+ lignes", "250+ outils". ADR-034 parle de Phase 5, ADR-040-044 de "Revolution achevee / reference mondiale absolue".
- **Impact** : P0 qualitatif. Viole explicitement les regles anti-bullshit. Ces donnees sont statiques mais restent visibles et contagieux pour la generation de contenus derives.
- **Recommandation** : Purger/archiver ces ADRs fantaisistes. `commander.md` doit refleter la realite du projet.

---

## Findings P1 (architecture, couplage DS, dead code majeur)

### F-03 — Couplage DS minimal : app ne consomme aucun composant DS
- **Fichiers** : `modules/app/src/main.tsx:5` (seul import DS)
- **Description** : L'app importe uniquement `@foundation-os/design-system/styles.css` pour les tokens CSS. **Aucun composant DS n'est importe**. Tous les composants app (Badge, Card, LoadingSkeleton, DashboardLayout, Commander/*) sont reinventes localement. `KnowledgePage.tsx` redefinit `GlassCard` et `GlassBadge` localement (lignes 17-54) exactement comme `components/Card.tsx` + `Badge.tsx`.
- **Impact** : P1. Le DS comme source unique n'est que partiel : tokens OK, composants dupliques.
- **Recommandation** : Etablir un catalogue partage (Button, Card, Badge, Modal) dans le DS; migrer progressivement.

### F-04 — TODO non-tenu : `updateStep` pour transitions non-done
- **Fichier** : `modules/app/src/components/forms/NextStepActions.tsx:53`
- **Description** : Commentaire `// TODO: implement updateStep for non-done transitions`. Le cycle todo -> in_progress -> done ne persiste en base que la transition vers "done". Les transitions intermediaires sont uniquement optimistic local, jamais sauvees.
- **Impact** : P1 (latent, car dead code). Si ces forms sont recables dans Commander.tsx, la feature sera cassee.
- **Recommandation** : Soit implementer, soit archiver avec le reste des forms.

### F-05 — `vite.config.ts` : alias `@ds/*` absent, seulement `@/`
- **Fichier** : `modules/app/vite.config.ts:5-11`
- **Description** : Le brief attend `@ds/*` ou equivalent. L'app n'a que `@/`. Reglage `external: ['fs', 'path']` avec `globals: { fs: 'undefined', path: 'undefined' }` dans vite.config.ts:13-22 est suspect.
- **Impact** : P1 information. Configuration fragile.
- **Recommandation** : Verifier source du probleme, tenter de le retirer ou documenter.

### F-06 — Dead code confirme : `forms/*` + `database.types.ts` tables jamais utilisees en UI
- **Fichiers** :
  - `modules/app/src/components/forms/AddSessionForm.tsx` (189L) — jamais importe (sauf test).
  - `modules/app/src/components/forms/EditDecisionModal.tsx` (224L) — jamais importe nulle part.
  - `modules/app/src/components/forms/NextStepActions.tsx` (233L) — jamais importe (sauf test).
- **Description** : Grep confirme : uniquement leur propre definition et les tests forms.test.tsx. Commander.tsx (la page) affiche seulement les panels read-only, pas de CTA visible. Les 3 fichiers (~646L combines) avec violations Void Glass F-01 sont **dead code actif**.
- **Impact** : P1. 15% du code total `src/` (646/4074L) est dead.
- **Recommandation** : Archiver ou recabler vers Commander.tsx avec CTA visible.

### F-07 — Supabase : fallback "placeholder" silent
- **Fichier** : `modules/app/src/lib/supabase.ts:14-17`
- **Description** : Si VITE_SUPABASE_URL/ANON_KEY manquent, fallback 'https://placeholder.supabase.co' + 'placeholder' avec console.warn. Les requetes vont planter silencieusement, mais useCommander catch avec fallback SEED.
- **Impact** : P1. Pas de crash, mais mystification possible.
- **Recommandation** : Ajouter un banner UX plus voyant en mode seed.

### F-08 — Routes : incoherence CONTEXT.md (5) vs reel (6)
- **Fichiers** : `modules/app/src/App.tsx:24-40`
- **Description** : 6 `<Route>` dont 1 redirect + 1 catchall. CONTEXT.md dit 5 routes. Ambiguite.
- **Recommandation** : Preciser dans CONTEXT.md.

---

## Findings P2 (qualite code)

### F-09 — IndexPage.tsx : division par zero potentielle protegee mais fragile
- **Fichier** : `IndexPage.tsx:19-22`
- **Description** : `const todoPct = nextSteps.length ? ... : 0`. Protegee mais pattern a surveiller.

### F-10 — Console.error partout dans mutations.ts
- **Description** : 15 occurrences + 4 dans NextStepActions.tsx. Pas de toast ni systeme d'erreur global. Pas de Sentry.
- **Recommandation** : Upgrade avant distribution.

### F-11 — useCommander : loading ne se met pas en position correcte au demontage initial
- **Description** : Code defensif `if (!cancelled) setLoading(false)` present. OK structurellement complexe.

### F-12 — Champ `phase: null` vs `phase: 'P6-e20'` incoherences
- **Fichiers** : `seed-data.ts:8-13` (sessions phase: null), `seed-data.ts:59-63` (next_steps phase: 'P6-e20').

### F-13 — Badge.tsx utilise concatenation hex pour alpha
- **Description** : `backgroundColor: color + '18'`. Fragile si `color` n'est pas un hex 6-char.
- **Recommandation** : Typer plus strictement.

### F-14 — Tests 19 confirme mais couverture limitee
- **Couverture** : AuthContext 4 tests, mutations 5, forms 4, useCommander 3, supabase 2, app 1.
- **Gaps** : DashboardLayout (315L) 0 test, pages Commander/Knowledge/Reset 0 test, KnowledgePage (327L) 0 test, integration multi-page 0 test, Commander panels 0 test.
- **Recommandation** : Au moins 1 test par composant visible.

---

## Findings P3 (cosmetique)

### F-15 — IndexPage `u2019` dans NAV_ITEMS
- **Fichier** : `DashboardLayout.tsx:19` — `'Vue d\u2019ensemble'`.

### F-16 — Typos francais inconsistants (accents)
- Mix "Decision"/"Decision", "Cooperation"/"Cooperation".

### F-17 — `ds-orange` reference mais pas verifiee
- **Fichier** : `forms/NextStepActions.tsx:130,187,188`.
- **Recommandation** : cross-reference DS.

### F-18 — knowledge-data.ts date erronee "02.04.26"
- **Description** : Format dd.mm.yy inconsistant avec autres dates ISO.

### F-19 — Bundle chunks : supabase-*.js 228KB non mentionne dans CONTEXT.md
- **Description** : Annonce 184KB = main entry seulement, total bundle ~600KB.

### F-20 — `index-app-pages.md` duplication ligne 25-26
- **Description** : `fos-toolbox.jsx` liste 2 fois identique.

---

## Obsolescences

**A archiver** :
- `modules/app/src/components/forms/` (3 fichiers, 646L) — dead code jamais monte, tokens legacy.
- `modules/app/data/` **tout le dossier** — 7 MD decrivent des JSX archives ("Ne plus modifier : referentiel fige"). Verite = code React + Supabase.
- `knowledge-data.ts` — contenu statique avec dates 02-07.04.26 obsolete. Devrait migrer en base Supabase.
- `seed-data.ts` — fallback utile pour dev, OK a garder mais desuet.
- `README-app-builder.md:7` : "React 18" alors que package.json `react: ^19.2.5`.

---

## Contradictions / desynchronisations

1. **CONTEXT.md "iso base DS, 0 legacy" vs `forms/*`** : FAUX totalement pour ces 3 fichiers + tokens hardcoded `#4FD1C7`.
2. **CONTEXT.md "5 routes" vs App.tsx 6 Routes** : Ambigu.
3. **CONTEXT.md "bundle 184KB / 55KB" vs reel** : total ~600KB.
4. **README-app-builder.md:7 "React 18" vs package.json `react: ^19.2.5`**.
5. **`data/commander.md` decrit 42 ADRs incluant ADR-034 a ADR-044 (Phase 4-6)** : seed-data.ts n'en charge que 12 (ADR-001 a ADR-012). Code real != doc.
6. **`data/index-app-pages.md:25-26` duplique fos-toolbox.jsx**.
7. **`data/sync.md` "fos-index.jsx livre 431" vs realite** : tous les JSX sont archives.
8. **AuthContext.tsx:22** : potentiel bug theorique loading stale si getSession echoue.
9. **supabase.test.ts:12 6 tables OK coherent**.
10. **package.json workspaces prebuild** : DS doit build avant l'app (couplage fort).

---

## Innovations / opportunites

**Refactors** :
- Extraire `KnowledgePage.tsx` `GlassCard` + `GlassBadge` locaux → reutiliser `Card` + `Badge` de components/.
- `DashboardLayout.tsx` (315L) splittable en Sidebar + Header + MobileMenu.
- Centraliser handlers d'erreur Supabase dans mutations.ts (gain ~70 lignes).
- Panels Commander/* : extraire un `Panel<T>` generique.

**Patterns** :
- ErrorBoundary React global dans App.tsx.
- Systeme toast d'erreur global.

**Tests manquants strategiques** :
- Integration IndexPage → Commander.
- DashboardLayout collapse.
- Commander/Knowledge tab switching.

**A11y** :
- DashboardLayout.tsx:219 input search sans aria-label ni onChange (UI morte).
- DashboardLayout.tsx:232-235 Bell button sans aria-label.
- Tabs Commander/Knowledge : pas de role="tablist" / role="tab" / aria-selected.
- Navigation clavier sur cards cliquables : IndexPage.tsx:157-198 MODULES cards, KnowledgePage.tsx:26 — clavier inaccessible.

**Security** :
- Pas de SQL injection (Supabase SDK parametrise).
- Pas de XSS evident.
- `clearAllData` gate sur `import.meta.env.DEV` OK.

---

## Couverture

**52 fichiers lus en integralite sur 52 cibles. 100% couverture.**

---

## Conclusion zone

L'App Builder Foundation OS est un **prototype honnete et fonctionnel** : architecture claire, 19 tests Vitest bien construits avec mocks solides, code concis (~4074 lignes) sans un seul fichier depassant 700L. Les tokens `ds-*` dominent (72 occurrences sur 13 fichiers). AuthContext + useCommander avec fallback SEED + RLS via SDK = pattern defensif bien pense.

Cependant, la prescription CONTEXT.md "iso base DS, 0 legacy" est **FAUSSE dans les faits** : `components/forms/*` (646L = 15% du code) utilise encore les tokens legacy. Ces 3 fichiers forms (AddSessionForm, EditDecisionModal, NextStepActions) sont **dead code actif** — jamais importes. Le plus gros chantier de nettoyage est la.

Le dossier `data/` (7 MD) est une **relique historique** : `commander.md` notamment contient 42 ADRs dont ADR-034 a ADR-044 mentionnant "REVOLUTION HISTORIQUE", "Reference Mondiale Absolue", "$1B+ potential" — **mots interdits CLAUDE.md combines**. Archive vers `.archive/data-jsx/`.

L'a11y est un **gap significatif** : aucun role="tablist", cards cliquables sans tabIndex/role="button", inputs sans aria-label, UI morte (recherche DashboardLayout).

Les tests passent (19/19) mais couverture **minimaliste** : 0 test pour DashboardLayout/KnowledgePage/Commander/panels/routing. Le bundle annonce "184KB JS" = main chunk seulement; total ~600KB.

---

## Cross-references (DS, Supabase, configs)

### DS (Design System module)
- **Aucun import** de composants DS. Question pour Agent 6 : l'app devrait-elle importer des composants DS ?
- Tokens `--ds-*` largement utilises dans classnames Tailwind : depend de la config DS.
- `DashboardLayout.tsx:45-46` utilise `rounded-ds-full` — a verifier.
- `NextStepActions.tsx:130` utilise `border-l-ds-orange` — verifier existence.
- Prebuild script : DS doit build avant app.

### Supabase
- Client `createClient<Database>` type-safe via `database.types.ts`.
- 6 tables coherentes (sessions, decisions, risks, next_steps, context_blocks, docs).
- RLS : **non verifiable depuis app**. Question Agent supabase.

### Configs
- **package.json** : deps React 19.2.5 + Vite 8.0.8 + Tailwind 4.2.2 + Supabase 2.39 + motion + react-router 7.14 + lucide. **Storybook non declare en devDep** alors que 9 `.stories.tsx` importent `@storybook/react-vite` — incoherence.
- **vite.config.ts** : externals fs/path avec globals undefined — fragile.
- **vitest.config.ts** : OK.
- **tsconfig.json** : strict, noUnusedLocals, noUnusedParameters — excellent.
- **index.html** : Figtree + JetBrains Mono via CDN — conforme.
- **.env.local.example** : URL + ANON_KEY, pas de SERVICE_ROLE_KEY (OK securite).
