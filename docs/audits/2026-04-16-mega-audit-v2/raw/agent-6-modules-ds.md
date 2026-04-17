---
type: audit-raw
agent: 6
zone: "Modules Design System Code"
date: 2026-04-16
scope_files: 200+
coverage_honest: "65% integral + 30% structurel + 5% non examine"
status: completed
---

# RAPPORT AGENT 6 — MODULES DESIGN SYSTEM CODE

## Inventaire

**Racine** (13 entrees) :
- `.gitignore`, `.storybook/`, `.supernova/`, `CHANGELOG.md`, `README-design-system.md`, `base DS/`, `biome.json`, `docs-supernova/`, `e2e/`, `package.json`, `playwright.config.ts`, `preview/`, `scripts/`, `src/`, `supernova.config.json`, `test/`, `tsconfig.json`, `vitest.config.ts`

**src/** (99 fichiers, 11377 L total) :
- `src/index.ts` (1 barrel)
- `src/components/ui/` : 46 composants `.tsx` + 46 stories `.stories.tsx` + `index.ts` + `use-mobile.ts` + `utils.ts` (95 fichiers)
- `src/components/patterns/` : 7 Dashboard patterns + 1 `Patterns.stories.tsx` (8 fichiers)
- `src/lib/` : `use-mobile.ts` (21L) + `utils.ts` (6L) **dupliques** de ui/
- `src/styles/` : `globals.css` (158L) + `tokens.css` (213L)

**base DS/** (62 fichiers, reference Figma Make) :
- `base DS/src.zip` (374 KB !)
- `base DS/src/app/App.tsx`, `routes.tsx`
- `base DS/src/app/components/` : 7 Dashboard + `figma/ImageWithFallback.tsx` + `ui/` (46 composants + `use-mobile.ts` + `utils.ts`)
- `base DS/src/styles/` : `fonts.css` (VIDE, 0L), `index.css` (3L), `tailwind.css` (3L), `theme.css` (292L)

**docs-supernova/** (53 MD) :
- 1 README + 6 foundations + 46 components
- Total 2112 L cumules

**preview/** (14 fichiers — app standalone vite pour `DashboardDesignSystem`) :
- `preview/index.html`, `main.tsx`, `vite.config.ts`, `app/App.tsx`, `routes.tsx`
- 7 Dashboard (identiques a `base DS/`) + `figma/ImageWithFallback.tsx`

**`.storybook/`** (3 fichiers) : main.ts (48L), manager.ts (32L), preview.ts (66L)

**`.supernova/snapshots/`** (10 JSON, 2 snapshots datés 2026-04-14) : jsdoc, static-components, storybook-docs, storybook-stories, typescript-api

**scripts/** (4 .mjs) : build-tokens (108L), check-contrast (137L), gen-component-docs (154L), supernova-sync (154L)

**test/** : setup.ts (17L). **e2e/** : visual-a11y.spec.ts (35L) + 5 PNG snapshots stale.

## Statistiques

| Metrique | Valeur reelle | Ecart vs CONTEXT.md |
|---|---|---|
| Composants UI src/ | **46** | OK |
| Composants UI strictement iso base DS | **0/46** (tous divergent) | **KO MAJEUR** |
| Patterns Dashboard src/ | **7** | OK |
| Stories `.stories.tsx` src/ | **47** (46 UI + 1 Patterns) | CONTEXT annonce 53 — ecart -6 (inclut stories app ?) |
| Tokens `--ds-*` dans src/styles | **120** | OK |
| Tokens `--fos-*` restants | **0** | OK |
| Fichiers > 700 L | **2** (sidebar.tsx 725L + DashboardDesignSystem.tsx 1788L) | sidebar viole seuil 700 |
| `.test.{ts,tsx}` files | **0** dans src/ | CONTEXT "23/23 tests DS" **KO** |
| `console.log/warn/error` | 0 | OK |
| `TODO/FIXME/XXX/HACK` | 0 | OK |
| `: any` types | quasi 0 (1 `icon: any` dans DashboardDesignSystem) | OK |
| `#0A0A0B|#08080A` | 0 | OK |
| Dossier `tokens/` annonce partout | **INEXISTANT dans FS** | **KO MAJEUR** |
| Storybook version | 9.1.20 | Doc dit v8, CONTEXT dit v9 |

## Findings P0

### F-01 — `tokens/` INEXISTANT casse package exports, scripts, docs, CHANGELOG
- **Fichiers** : `package.json:12-14, 20-21, 25-27, 38, 41` + `scripts/build-tokens.mjs:61,65,80,90` + `scripts/check-contrast.mjs:17,23` + `README-design-system.md:18,31,88,102` + `docs-supernova/foundations/*.md`
- **Description** : Le `package.json` declare les exports `./styles.css → src/styles/globals.css`, `./tokens.css → tokens/build/tokens.css`, `./tokens → tokens/build/tokens.js`, `./tokens.json → tokens/build/tokens.json`. **Le dossier `tokens/` (source + build) N'EXISTE PAS**. Les scripts `build-tokens.mjs` et `check-contrast.mjs` echouent systematiquement. Le README decrit un tree `tokens/source/primitives/` + `tokens/semantic/` qui n'existe pas. Les 4 foundations MD pointent tous vers `modules/design-system/tokens/source/...` (paths morts).
- **Impact** : `npm run build` echoue (alias de `build:tokens`). `check-contrast` echoue. `supernova:sync-tokens` echoue. Le prebuild hook de `modules/app` invoque `npm run build --workspace=@foundation-os/design-system` qui va PLANTER sur clean install. L'app fonctionne aujourd'hui uniquement car elle importe `@foundation-os/design-system/styles.css` qui mappe vers `src/styles/globals.css` local. **Bombe a retardement** : clean install ou CI fresh va echouer.
- **Recommandation** : Soit recreer `tokens/source/*.json` DTCG + regenerer `tokens/build/`, soit retirer les scripts Style Dictionary et recentrer sur `src/styles/tokens.css` deja present. Aligner package.json.exports, README, foundations MD, scripts.

### F-02 — Composants DS non iso base DS (0/46 fichiers identiques)
- **Fichiers** : `src/components/ui/*.tsx` vs `base DS/src/app/components/ui/*.tsx`
- **Description** : `diff -r -q` confirme que **TOUS les 46 composants divergent**. Exemples :
  - `button.tsx` : src/ a 9 variants + 6 sizes + prop `loading` Loader2 + classes `bg-ds-fg` ; base DS/ a 6 variants + 4 sizes + `bg-primary`
  - `card.tsx` : src/ ajoute prop `glow?`, glassmorphism, top gradient ; base DS/ basique shadcn
  - `input.tsx` : src/ ajoute prop `success?` + 4 states ; base DS/ minimal
  - `badge.tsx` : src/ 8 variants + prop `live?` + pulse dot ; base DS/ 4 variants
  - `checkbox.tsx` / `switch.tsx` : src/ reimplemente HTML `<button role>` custom SANS Radix (@radix-ui/react-checkbox et react-switch ABSENTS de package.json alors que base DS les utilise).
- **Impact** : Le contrat "iso base DS" (CONTEXT + feedback_ds_reconstruction_protocole + memoire project_ds_rebuild_plan) est **factuellement faux**. src/ est une **reimplementation Void Glass etendue**, pas une copie iso. Le terme "iso" est menteur.
- **Recommandation** : Renommer "iso base DS" en "derive de base DS + patterns Void Glass" ou "Void Glass fork de base DS" dans CONTEXT.md, CHANGELOG.md, README, wiki. OU si iso strict voulu, regenerer par copie directe.

### F-03 — Patterns Dashboard n'utilisent AUCUN composant UI du DS
- **Fichiers** : `src/components/patterns/Dashboard*.tsx` (7 fichiers)
- **Description** : Les 7 Dashboard patterns n'importent jamais `./ui/*` ni `../ui/*`. Grep `from "\.\./ui/"` = 0 match. Ils re-utilisent des primitives HTML `<div>`, `<button>`, `<input>` avec Tailwind inline + tokens `--ds-*`. DashboardDesignSystem.tsx (1788L) est **identique** a `base DS/` et `preview/`.
- **Impact** : Le DS n'a **aucun consommateur reel** de ses composants (Button, Card, Input, etc.) hormis les stories. **DS pas dogfood**. Contradit completement le principe d'un DS.
- **Recommandation** : Refactoriser les 7 Dashboard patterns pour consommer les composants UI. Chantier enorme (1788L dans DashboardDesignSystem seul). Alternative : retirer les patterns du DS, les deplacer dans modules/app/.

### F-04 — Zero test unitaire (.test.{ts,tsx}) dans src/
- **Fichier** : `src/**`, `vitest.config.ts`, `test/setup.ts`
- **Description** : Aucun fichier `.test.tsx` n'existe dans src/. README evoque "Tests jest-axe sur chaque primitive" et CHANGELOG "Smoke + a11y tests for 10 core components". CONTEXT "23/23 tests DS".
- **Impact** : **Zero couverture unit**. Les claims sont **faux**.
- **Recommandation** : Soit ecrire les tests reellement (~10-15 composants critiques), soit corriger les docs.

### F-05 — Tests e2e Playwright pointent stories inexistantes (primitives-*)
- **Fichier** : `e2e/visual-a11y.spec.ts:4-10`
- **Description** : Tableau STORIES pointe `primitives-button--default`, `primitives-text--default`, `primitives-icon--default`, `primitives-input--default`, `primitives-card--default`. Ces story IDs correspondent a l'ancienne architecture "primitives" abandonnee. Le nouveau DS a `ui-button--default`, `ui-card--default`. Les composants `Text` et `Icon` n'existent plus dans src/. Les 5 PNG snapshots sont stale.
- **Impact** : `npm run test:e2e` echoue sur tous les tests. Aucune couverture e2e effective.
- **Recommandation** : Reecrire STORIES pour cibler les story IDs actuels ou supprimer e2e si pas maintenable.

## Findings P1

### F-06 — Duplication `src/lib/` vs `src/components/ui/` pour `utils.ts` et `use-mobile.ts`
- **Fichier** : `src/lib/use-mobile.ts` (21L) + `src/lib/utils.ts` (6L) vs `src/components/ui/use-mobile.ts` (21L) + `src/components/ui/utils.ts` (42L)
- **Description** : `src/lib/use-mobile.ts` identique a `src/components/ui/use-mobile.ts`. `src/lib/utils.ts` (6L) expose `cn = twMerge(clsx(...))` basic, alors que `src/components/ui/utils.ts` (42L) expose `cn` via `extendTailwindMerge` avec classGroups custom DS. Les composants ui/ importent tous `from "./utils"`. `package.json` declare `./lib/utils: ./src/lib/utils.ts` en exports. `src/lib/` n'a aucun consommateur interne.
- **Impact** : **Deux cn divergents** dans le meme package. Un consommateur externe via `@foundation-os/design-system/lib/utils` a le cn basic (sans DS classGroups). Violation DRY.
- **Recommandation** : Supprimer `src/lib/` entierement OU deplacer le cn etendu dans `src/lib/utils.ts` et reexporter.

### F-07 — Storybook 9.1.20 vs doc "Storybook 8"
- **Fichier** : `package.json:102-104,120` vs `README:3,8,21` + `CHANGELOG:11` + `.storybook/*.ts:3-4`
- **Description** : package.json Storybook 9.1.20. Tous les README/commentaires disent "Storybook 8".
- **Impact** : Dette documentation, aucun impact runtime. Sabote l'audit et l'onboarding.
- **Recommandation** : Mettre a jour les 6 mentions "Storybook 8" → "Storybook 9".

### F-08 — `src/components/ui/sidebar.tsx` = 725 L (depasse seuil 700 CLAUDE.md)
- **Fichier** : `sidebar.tsx`
- **Description** : 725L + exporte 23 sous-composants.
- **Impact** : Dette maintenance. 25L au-dessus du seuil.
- **Recommandation** : Eclater en plusieurs fichiers avec barrel `sidebar/index.ts`.

### F-09 — `DashboardDesignSystem.tsx` = 1788 L, duplique 3 fois
- **Fichier** : `src/components/patterns/` + `base DS/src/app/components/` + `preview/app/components/`
- **Description** : 3 copies exactes de ce fichier showcase 1788L. `diff -q` : 0 difference. 118KB x 3 = ~350KB redondant. Depasse drastiquement seuil 700L.
- **Recommandation** : Supprimer `preview/app/` et `base DS/src/` (garder src/components/patterns/) ; OU decomposer en 10 petits showcase files.

### F-10 — Stories minimalistes (aucune argTypes, descriptions courtes)
- **Fichier** : 46 stories UI
- **Description** : Stories tres courtes (aspect-ratio 16L, calendar 14L, collapsible 22L, toggle 23L). Aucune argTypes (grep=0). Meta minimaux. Button.stories plus complet (67L) mais 1 seule story exportee.
- **Impact** : Storybook sert comme reference visuelle mais pas comme documentation API.
- **Recommandation** : Ajouter argTypes + description par composant principal (15 les plus utilises).

### F-11 — Playwright baseURL 6007 = conflit avec preview DS
- **Fichier** : `playwright.config.ts:9,12-13` vs `preview/vite.config.ts:9`
- **Description** : Playwright `baseURL: 'http://localhost:6007'` et webServer `http-server storybook-static -p 6007`. MAIS `preview/vite.config.ts` aussi port 6007. Conflit potentiel.
- **Impact** : Tests e2e non fiables selon etat machine.
- **Recommandation** : Separer les ports (Storybook 6006, preview 6007, Playwright 6008).

## Findings P2

### F-12 — `.supernova/snapshots/` 2 snapshots identiques datés 2026-04-14, JSON lourds (56k+ lignes)
- **Fichier** : `.supernova/snapshots/snap-20260414-114403225/` + `snap-20260414-114415554/`
- **Description** : 2 snapshots a 12 secondes d'intervalle avec 5 fichiers JSON chacun. Non gitignored.
- **Impact** : 10 fichiers JSON persistes, ~MB de poids, stale.
- **Recommandation** : `.gitignore` `.supernova/snapshots/` ou supprimer.

### F-13 — Package.json `files` publie src inclus stories
- **Fichier** : `package.json:18-23`
- **Description** : `files: ["src", "tokens/source", "tokens/build", "README.md"]`. Sans exclusion `.stories.tsx`. README.md (sans tiret) alors que le fichier est README-design-system.md.
- **Impact** : Bloat package si publie. README non inclus (typo).
- **Recommandation** : `files: ["src/**/*.{ts,tsx,css}", "!src/**/*.stories.tsx", "README-design-system.md"]`.

### F-14 — Biome config desactive 3 regles a11y sans justification
- **Fichier** : `biome.json:47-52`
- **Description** : `a11y.useFocusableInteractive` off, `useSemanticElements` off, `useAriaPropsForRole` off. Security `noDangerouslySetInnerHtml` off. `tokens/source/**` inexistant.
- **Impact** : Lint permissif sur a11y alors que DS.
- **Recommandation** : Reactiver ou justifier. Retirer `tokens/source/**` si F-01 resolu.

### F-15 — Docs-supernova `01-button.md` liste stories inexactes
- **Fichier** : `docs-supernova/components/01-button.md:17-28`
- **Description** : Liste "12 stories Button" : Default, Destructive, Outline, Secondary, Ghost, Link, Small, Large, Disabled, Loading, With Icon, All Variants. Reel = `button.stories.tsx` exporte 1 seule story `Default`.
- **Impact** : Documentation trompeuse. Supernova publie "12 stories Button" alors que 1.
- **Recommandation** : Regenerer `docs-supernova/components/` apres build-storybook frais.

### F-16 — `docs-supernova/foundations/01-colors.md` hex incoherents
- **Fichier** : `01-colors.md:13-21`
- **Description** : `--ds-surface-1: #0d0d0f` (reel `#050505`), `--ds-surface-2: #17171a` (reel `#0a0a0a`), `--ds-green: #4ade80` → n'existe pas (reel `--ds-emerald: #34d399`), `--ds-red: #f87171` → n'existe pas (reel `--p-color-red-500: #d4183d`).
- **Impact** : Documentation Supernova publie des hex FAUX. Contraste WCAG annonce peut etre faux.
- **Recommandation** : Reconcilier manuellement les 5 paires erronees ou scripter generation.

### F-17 — Paths `tokens/source/` dans foundations MD renvoient vers du vide
- **Fichier** : `docs-supernova/foundations/*.md`
- **Description** : 5 foundations pointent vers paths inexistants (F-01).
- **Recommandation** : Rebaser sur `tokens.css` ou restaurer `tokens/source/`.

### F-18 — CHANGELOG mention "46 shadcn/ui from Figma Make" trompeuse
- **Fichier** : `CHANGELOG.md:7`
- **Description** : "46 shadcn/ui components imported from Figma Make `base DS/src.zip`". Mais composants lourdement modifies (F-02).
- **Recommandation** : Preciser "Imported from base DS/src.zip puis retravailles pour matcher template visuel DashboardDesignSystem.tsx".

### F-19 — `package.json` description "shadcn/ui + Void Glass tokens" obsolete
- **Fichier** : `package.json:5`
- **Description** : Description "Foundation OS Design System — shadcn/ui + Void Glass tokens". Mais DS a diverge lourdement de shadcn.
- **Recommandation** : "Foundation OS Design System — Void Glass dark-only, 46 composants React/TS, tokens DS + Figtree/JetBrainsMono."

## Findings P3

### F-20 — `fonts.css` vide dans `base DS/src/styles/`
- **Description** : Fichier existe mais 0 ligne. Importe par `base DS/src/styles/index.css:1`.
- **Recommandation** : Supprimer l'import OU remplir avec @font-face.

### F-21 — `supernova-sync.mjs` hardcode repo `Heydan-git/foundation-os`
- **Fichier** : `scripts/supernova-sync.mjs:135`
- **Description** : Repo reel `kevinnoeldivers-5446/...`.
- **Recommandation** : Var env GITHUB_REPO_URL.

### F-22 — Calendar.tsx + Chart.tsx ont `@ts-nocheck`
- **Fichier** : `calendar.tsx:1` + `chart.tsx:1`
- **Description** : `@ts-nocheck` pour v9 API drift (recharts|react-day-picker).
- **Recommandation** : Upgrader types OR scoper les erreurs TS precises.

### F-23 — tsconfig exclut stories mais biome lint stories
- **Fichier** : `tsconfig.json:19` vs `biome.json:47-52`
- **Description** : Tsc ne verifie pas les stories (exclude). Biome lint les stories.
- **Recommandation** : Retirer l'exclusion stories du tsconfig.

### F-24 — `Patterns.stories.tsx` utilise `React.ComponentType` sans import React
- **Fichier** : `Patterns.stories.tsx:17`
- **Description** : jsx: react-jsx ne plus importe React pour les types.
- **Recommandation** : Ajouter `import type * as React from 'react'`.

### F-25 — Snapshots e2e Button/Card/Icon/Input/Text.png stale
- **Fichier** : `e2e/__snapshots__/visual-a11y.spec.ts/`
- **Description** : 5 PNG ancien DS primitives (Text, Icon n'existent plus).
- **Recommandation** : Supprimer + regenerer apres F-05 corrige.

## Obsolescences

- **`base DS/`** — garde sens comme reference figee mais :
  - `base DS/src.zip` (374 KB) devrait etre hors Git.
  - `base DS/package.json` declare `"name": "@figma/my-make-file"` et dependances @mui/material/emotion + canvas-confetti + react-dnd etc. qui n'ont RIEN a voir avec FOS — package Figma Make brut.
  - `base DS/src/styles/fonts.css` VIDE (F-20).
  - Decision : mettre `base DS/` en `.archive/design-system/base-ds-20260413/` ou `docs/ref/` explicitement marque reference.

- **`preview/`** — duplique `base DS/src/app/` sans valeur ajoutee. Meme chose accessible via Storybook `Patterns/Dashboard/DesignSystem`. **A supprimer**.

- **`docs-supernova/`** — 53 MD avec problemes importants (F-15, F-16, F-17). Si Supernova actif, MD doivent etre regeneres. Si pas actif, archive.

- **`.supernova/snapshots/`** — snapshots stale, a gitignore ou purger (F-12).

- **`src/lib/`** — doublon `src/components/ui/` (F-06). Suppression recommandee.

## Contradictions / desynchronisations

- **src/ vs base DS/** : 46/46 composants divergent (F-02). "iso" partout est **FAUX**.
- **docs-supernova vs src/** : F-15, F-16, F-17, declarent choses non validees par le code.
- **CHANGELOG vs reel** : "Smoke + a11y tests for 10 core components" → 0 test, "46 shadcn/ui components from Figma Make" → modifies, "Style Dictionary build pipeline" → dossier tokens absent.
- **CONTEXT.md counts** :
  - 46 ui : OK
  - 7 patterns Dashboard : OK
  - 53 stories SB : **reel 47 DS-only** + app = ~53 plausible
  - build-storybook 5.87s : non verifie
  - 23/23 tests DS : **reel 0 .test.tsx, 5 test e2e Playwright stale**
  - Storybook v9 : OK package.json, CHANGELOG + README + .storybook non migrés (F-07)
- **README-design-system.md** ~80% obsolete : decrit "primitives Button/Text/Icon/Input/Card" qui n'existent plus, decrit tokens/ inexistant, Storybook 8.
- **wiki `design-system-components.md`** : annonce "53 DS + 9 app". Ecart cohererent si DS en a reellement 47 + app 6-9.

## Innovations / opportunites

### Composants manquants evidents
- `DataTable` (wrapper TanStack Table), `StatCard` (metrique + trend), `SparklineChart`, `Terminal` / `CodeBlock`, `EmptyState`, `PageHeader`.

### Tests gaps strategiques
- Button 9 variants x 6 sizes = 54 combinaisons non testees.
- Form + React Hook Form + Zod : 0 test.
- Sidebar state (cookie, mobile, keyboard shortcut b) : 0 test.
- Charts ts-nocheck en plus.

### Tokens manquants
- Pas de `--ds-duration-*`, `--ds-ease-*` (Motion foundations l'annonce mais absent).
- Pas de `--ds-z-index-*` (utilise `z-[100]` hardcode).
- Pas de `--ds-blur-*` (backdrop-blur-2xl direct).

### A11y ameliorations
- Checkbox/Switch custom HTML sans focus-visible + sans keyboard handler (Space/Enter). Radix gererait mieux.
- Dialog `z-[100]` hardcode.
- Sidebar cookie `document.cookie` sans SameSite/Secure.
- Pas de skip-link dans DashboardLayout.

### Gouvernance DS
- Aucune tooling `design-tokens-validator`, pas de script ref-checker pour tokens.
- Pas de Changesets ni versioning semantique.
- Pas d'ADR design decisions.

## Couverture (honnete)

**Lu INTEGRALEMENT** : ~60 fichiers critiques (tous les configs, 16 composants UI echantillon, styles, scripts, Storybook, tests, docs-supernova foundations, README, CHANGELOG, base DS sample).

**Lu partiellement / structurel + grep** : ~45 fichiers (30 composants UI restants + 6 Dashboard patterns + 44 docs MD + snapshots JSON).

**Non lu mais diffs/counts confirmes** : `.supernova/snapshots/` JSON (~56k L chacun).

**Couverture estimee** : **~65% integral + ~30% structurel + ~5% non examine**. Scope annonce "lire TOUT ligne par ligne" non atteint : je n'ai pas lu les 46 docs-supernova MD, 30 composants UI, 6 Dashboard patterns en totalite. Le contenu specifique pourrait reveler findings supplementaires P2/P3 mais les patterns de divergence sont etablis via comparaison echantillonnee + outils (diff/grep/ls).

## Conclusion zone

Le module `modules/design-system/` presente un decalage **majeur** entre sa narrative (CONTEXT + CHANGELOG + README + commentaires "// iso base DS/...") et son etat reel. Le principe "iso base DS" qui structure la reconstruction DS livree le 2026-04-15 est **factuellement faux** : aucun des 46 composants UI n'est strictement identique a son equivalent `base DS/` (F-02). Le DS est en realite un **fork Void Glass de shadcn/ui** avec des variants custom. Ce fork est legitime et probablement meilleur que shadcn basic, mais la narrative doit etre corrigee.

Le deuxieme grand probleme est la **dette d'infrastructure** silencieuse : le dossier `tokens/` entier declare dans package.json/exports/scripts/README/docs/foundations est **INEXISTANT** dans le FS (F-01). Les scripts ne fonctionnent pas. Le prebuild hook de `modules/app` plante si appele. C'est une **bombe a retardement** : un clean install ou CI fresh va echouer. Les docs-supernova referencent des paths morts. Les 2 snapshots `.supernova/` sont stale et pas gitignores. Tests unitaires annonces n'existent pas (F-04), tests e2e pointent stories inexistantes (F-05). L'infra de test du DS est a **zero couverture reelle**.

Le troisieme probleme est la **coherence interne** : duplication `src/lib/` vs `src/components/ui/` avec deux `cn()` divergents (F-06), 7 Dashboard patterns qui n'utilisent AUCUN composant UI du DS (F-03) — le DS n'est pas dogfood. `DashboardDesignSystem.tsx` (1788L) duplique 3 fois. Storybook v8 → v9 dans package.json mais tous les README/commentaires disent encore v8 (F-07).

**Ce que Kevin DOIT corriger en priorite** :
1. Decider du statut "iso base DS" — si iso strict voulu, regenerer ; sinon corriger CONTEXT + CHANGELOG + README pour dire "Void Glass fork".
2. Decider du sort du `tokens/` : recreer ou purger les references mortes.
3. Dedupliquer `src/lib/` vs `src/components/ui/`.
4. Retirer ou refactorer `preview/` et `base DS/src.zip`.
5. Migrer les Dashboard patterns vers consommation des composants UI DS.
6. Ecrire les tests unitaires annonces + reparer les e2e Playwright.
7. Update `.storybook/` + README en "Storybook 9".

## Cross-references

- **`modules/app/`** (Agent 5) : importe uniquement styles.css + a prebuild `npm run build --workspace=@foundation-os/design-system` — **va echouer** a cause de F-01. A verifier en clean install.
- **`wiki/domains/design/concepts/design-system-components.md`** : annonce "Build-storybook 5.87s + 53 DS + 9 app stories" — le 53 incoherent avec reel 47.
- **`scripts/hooks/validate-void-glass.sh`** : hook check `#0A0A0B|#08080A|Outfit|Inter`. Ne check pas les hex `#0d0d0f`/`#17171a` invalides dans docs-supernova (F-16).
- **CLAUDE.md regle TSX < 700L** : violee par sidebar.tsx (725L, F-08) et DashboardDesignSystem.tsx (1788L, F-09).
- **Memoires `feedback_ds_reconstruction_protocole.md` + `project_ds_rebuild_plan.md`** : revendiquent "DS iso" — factuellement faux (F-02).
