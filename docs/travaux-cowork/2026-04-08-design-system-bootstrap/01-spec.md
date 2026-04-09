# 01 — Spec Design System Foundation OS

Date : 2026-04-08
Statut : PROPOSITION
Dependances : `docs/design-system.md` (Void Glass), decisions D-DS-01..04 (voir 00-INDEX.md)

---

## 1. Vision

Un Design System Foundation OS :

- Source unique de verite pour tokens, primitives, patterns.
- 100 pourcent iso entre Storybook (documentation vivante) et code produit consomme par les modules (App Builder, Finance, Sante futurs).
- Conforme WCAG 2.2 niveau AA, verifie automatiquement en CI (axe-core gate bloquant).
- Visual regression automatisee (Playwright snapshots) pour detecter toute derive silencieuse.
- Tokens exportables au format DTCG standard W3C, compatible Figma (export/import natif depuis 2025) et Penpot (implementation native DTCG).
- 100 pourcent open source, zero dependance SaaS externe. Chromatic ecarte volontairement.
- Coherent Void Glass : fond #06070C, Figtree, JetBrains Mono, interdictions connues respectees.

---

## 2. Portee du bootstrap (non-negociable)

### Inclus

- Module isole `modules/design-system/` avec package.json propre.
- Tokens sources en DTCG JSON, genere en CSS variables + TypeScript typed export via Style Dictionary.
- 5 primitives atomiques : Button, Text, Icon, Input, Card. Stories + tests unitaires + tests a11y par primitive.
- Storybook 8 configure avec preview Void Glass (fond, fonts, theme dark default).
- Pipeline CI GitHub Actions : build Storybook + test-runner + Playwright visual snapshots + axe-core gate AA.
- Consommation par `modules/app` du package design-system via workspace local.
- Pont Figma/Penpot : export tokens au format DTCG JSON spec-compliant, pret a etre importe dans Figma (export natif 2025) ou Penpot (implementation native DTCG par Tokens Studio + Penpot).
- README module + CONTEXT.md update.

### Exclus (explicitement hors scope DS bootstrap)

- Sync live bi-directionnel Figma/Penpot (l'export DTCG est statique, regeneration manuelle). Sync live = chantier Phase DS-7+ futur.
- Composants complexes (Table, Modal, Tabs, Toast, DropdownMenu, etc.). Ce sont des patterns, pas des primitives atomiques. Backlog DS-7+.
- Theming multiple (light mode). Dark Void Glass uniquement. Light mode = backlog.
- Motion/animation library. Backlog.
- i18n. Backlog.
- Icon set custom. On wrappe lucide-react (deja utilise dans modules/app).

---

## 3. Architecture cible

### 3.1 Arborescence `modules/design-system/`

```
modules/design-system/
  package.json                    # Workspace package @foundation-os/design-system
  tsconfig.json
  vite.config.ts                  # Build lib mode (ESM + DTS)
  README.md
  .storybook/
    main.ts                       # Config SB 8
    preview.ts                    # Preview global Void Glass
    manager.ts                    # Theme SB dark
  tokens/
    source/
      color.json                  # DTCG source (couleurs Void Glass)
      typography.json             # DTCG source (fonts, sizes, weights, line-heights)
      spacing.json                # DTCG source
      radius.json                 # DTCG source
      elevation.json              # DTCG source
      motion.json                 # DTCG source (durations, easings)
    build/                        # Generated par Style Dictionary (gitignored + committed ?)
      tokens.css                  # CSS variables
      tokens.ts                   # TypeScript typed export
      tokens.json                 # DTCG W3C compliant flat, pret Figma/Penpot import
  src/
    index.ts                      # Barrel export public API
    primitives/
      Button/
        Button.tsx
        Button.module.css         # ou CSS-in-JS selon Q-DS-02
        Button.stories.tsx
        Button.test.tsx           # Vitest unit + @testing-library/react
        Button.a11y.test.tsx      # jest-axe pour a11y unit
        index.ts
      Text/
      Icon/
      Input/
      Card/
    hooks/                        # Hooks partages (useReducedMotion, etc.) — backlog
  tests/
    playwright.config.ts
    visual/                       # Tests visual regression
    __snapshots__/                # Baselines images (committees)
  scripts/
    build-tokens.mjs              # Style Dictionary build
```

### 3.2 Flux tokens

```
tokens/source/*.json (DTCG W3C)
     |
     | style-dictionary build
     v
tokens/build/tokens.css         -> consomme par Storybook + modules/app
tokens/build/tokens.ts          -> consomme par primitives (typage)
tokens/build/tokens.json        -> export DTCG pour Figma/Penpot (manuel, DS-6)
```

### 3.3 Consommation par `modules/app`

Au bout de DS-6 :

- `modules/app/package.json` ajoute `"@foundation-os/design-system": "workspace:*"` (ou equivalent npm workspaces).
- `modules/app/src/main.tsx` importe `@foundation-os/design-system/tokens.css`.
- Les composants de app/ qui dupliquent Button/Input/Card migrent vers les primitives DS. Ce chantier migration = hors scope DS bootstrap, a faire en DS-6 partiellement ou en chantier follow-up.

---

## 4. Imperatifs qualite

### 4.1 Accessibilite AA (non-negociable)

- Chaque primitive passe `@axe-core/react` + `jest-axe` en test unitaire sans violation.
- Chaque story passe `@storybook/addon-a11y` + `axe-playwright` via test-runner en CI.
- Contrastes : ratio minimum 4.5:1 pour texte normal, 3:1 pour large text et composants UI. Verifie sur token couleurs en DS-1.
- Navigation clavier complete sur Button, Input, Card interactif. Focus visible (outline Void Glass token dedie).
- Attributs ARIA explicites sur Icon (aria-hidden=true si decoratif, aria-label si informatif).
- prefers-reduced-motion respecte sur toute animation (hook `useReducedMotion` ou media query CSS).

### 4.2 Iso Storybook <-> code produit

- Une primitive = un seul import public depuis `@foundation-os/design-system`. Storybook importe la meme source que modules/app, pas de fork.
- Tokens = un seul tokens.css genere. Storybook et modules/app importent le meme fichier.
- Visual regression CI bloque tout diff non-committe sur snapshots baseline.

### 4.3 Void Glass strict

- Respect `docs/design-system.md` : #06070C fond, Figtree UI, JetBrains Mono code, interdictions #0A0A0B / #08080A / Outfit / Inter / system-ui seul.
- Hook `validate-void-glass.sh` doit continuer a passer sur le nouveau module. Si limitation design-by-stdin (F-S6-B-01), voir Q-DS-06.

### 4.4 Token budget

- Sessions DS-1 a DS-6 bite-sized : chaque session 1 objectif concret, 1 commit final, ~30 pourcent session audit normale max.
- Pattern WIP+phase F autorise si compactage menace (valide en Cycle 3 S6).

---

## 5. Stack technique definitive

| Couche | Choix | Raison |
|--------|-------|--------|
| Runtime | React 18 + TypeScript 5 | Iso modules/app |
| Bundler lib | Vite 5 library mode | Iso modules/app, generation ESM + DTS |
| Storybook | Storybook 8 (builder Vite) | Standard industrie, addon-a11y natif |
| Test unit | Vitest + @testing-library/react + jest-axe | Iso modules/app Vitest 19 tests, jest-axe pour unit a11y |
| Test interaction | @storybook/test | Interactions stories |
| Test runner | @storybook/test-runner | Executer toutes les stories en CI comme tests |
| Visual regression | Playwright test (via storybook test-runner hooks ou playwright direct sur SB buildee) | Decision finale Q-DS-04 |
| A11y auto CI | axe-playwright + @storybook/addon-a11y | Deux couches : unit via jest-axe, CI via axe-playwright |
| Tokens | Style Dictionary 4 | Standard DTCG, supporte W3C spec stable octobre 2025 |
| Format tokens | DTCG JSON W3C | Compat Figma (natif 2025) + Penpot (natif) |
| Icons | lucide-react (wrappe) | Deja utilise modules/app |
| Styles primitives | CSS Modules (decision Q-DS-02) | Simple, portable, zero runtime |

---

## 6. Decisions D-DS-*

| ID | Decision | Date | Statut |
|----|----------|------|--------|
| D-DS-01 | Pause Dashboard monitor D2/D3 | 2026-04-08 | Valide Kevin AskUserQuestion |
| D-DS-02 | Nouveau module modules/design-system/ workspace | 2026-04-08 | Valide Kevin |
| D-DS-03 | Stack Storybook 8 + Playwright visual + axe-core (zero SaaS) | 2026-04-08 | Valide Kevin |
| D-DS-04 | Scope complet : tokens + 5 primitives + Storybook + CI + pont Figma/Penpot | 2026-04-08 | Valide Kevin |
| D-DS-05 | Format tokens : DTCG JSON W3C (stable octobre 2025) | 2026-04-08 | Propose, attend validation |
| D-DS-06 | Style Dictionary 4 pour build tokens | 2026-04-08 | Propose, attend validation |
| D-DS-07 | CSS Modules pour primitives (pas Tailwind dans DS lib) | 2026-04-08 | Propose, voir Q-DS-02 |
| D-DS-08 | Visual regression = Playwright direct sur SB statique (pas test-runner hooks) | 2026-04-08 | Propose, voir Q-DS-04 |

---

## 7. Questions ouvertes bloquantes (Q-DS-*)

Ces questions doivent etre tranchees avant DS-1. Kevin choisira.

### Q-DS-01 — Outil de workspace : npm workspaces vs pnpm vs Turborepo ?

- **Option A — npm workspaces** (recommande pour demarrer) : natif, zero install, le repo est deja npm. Suffisant a 2-3 modules. Simple.
- **Option B — pnpm workspaces** : plus rapide, store content-addressable, meilleur tree-shaking hoisting. Ajoute un outil. Migration necessaire pour modules/app existant.
- **Option C — Turborepo + pnpm** : cache distant, build incremental. Overkill a 2 modules, justifie a 5+. Report a Phase 5.

**Impact :** Option A = rapide, peu de refactor. Option C = plus scalable mais plus de plomberie.

### Q-DS-02 — Styles primitives : CSS Modules vs Tailwind vs CSS-in-JS vs vanilla-extract ?

- **Option A — CSS Modules** (recommande) : zero runtime, scoped automatique, simple, marche avec Vite + Storybook nativement. Cohere avec philosophie "zero runtime" du dashboard monitor.
- **Option B — Tailwind** : deja utilise dans modules/app. Permet coherence DS <-> app. Mais couple le DS a Tailwind pour toujours, rend le DS moins portable pour Finance/Sante si ceux-ci partent sur autre chose.
- **Option C — vanilla-extract** : typed CSS-in-TS zero-runtime. Excellent mais ajoute complexite.

**Impact :** Option A decouple DS de Tailwind. Option B garde la coherence actuelle mais lie pour toujours.

### Q-DS-03 — Tokens build/ committes ou gitignores ?

- **Option A — committes** : reproductibilite immediate, pas besoin de build step au clone, visible en code review.
- **Option B — gitignores** : unique source = JSON source, build genere. Risque de derive si build local != build CI.

**Recommandation :** A (committes) avec un CI check qui valide que le build est a jour (rebuilde et diff).

### Q-DS-04 — Visual regression : test-runner hooks vs Playwright direct ?

- **Option A — @storybook/test-runner avec postVisit hook** : integre officiellement Storybook, simple a mettre en place, utilise le framework Jest + Playwright sous-jacent.
- **Option B — Playwright test direct sur SB buildee statique** : separe test-runner (interaction + a11y) de visual regression (Playwright pur). Plus de controle, snapshots nommes explicitement. Plus simple a debugger.

**Recommandation :** B. Separe clairement les couches : test-runner fait a11y + interactions, Playwright fait visual. Moins de magie, plus deterministe.

### Q-DS-05 — CI : branche cible pour declencher visual + a11y ?

- Actuellement `ci.yml` = main + PR. Branche courante `audit-massif-cycle3` n'est pas couverte (F-S6-D-01).
- **Option A** : etendre ci.yml a inclure push sur toutes les branches de travail (audit-massif-cycle3, ds-bootstrap, etc.).
- **Option B** : nouveau workflow `design-system.yml` scope aux changements `modules/design-system/**` (paths filter).
- **Recommandation** : B. Workflow dedie triggered sur changes du module DS uniquement, evite d'executer visual regression a chaque commit hors DS.

### Q-DS-06 — `validate-void-glass.sh` (pre-commit hook) sur nouveau module ?

- F-S6-B-01 indique que le hook lit le fichier disque pre-edit, donc sur un fichier nouvellement cree par Write, le hook lit la version non-ecrite. Bug actuel documente.
- **Option A** : ignorer le hook pour modules/design-system/ jusqu'a fix F-S6-B-01.
- **Option B** : fixer F-S6-B-01 avant DS-1 (mini chantier hook rework).
- **Option C** : accepter le hook tel quel (faux negatifs sur create).

**Recommandation :** C pour DS bootstrap (risque faible, on controle manuellement), et logger F-DS-01 equivalent a F-S6-B-01 pour tracer. Fix F-S6-B-01 reste dans le batch S21 housekeeping.

### Q-DS-07 — Baselines visual : committees comment ?

- Si baselines sont committees (standard Playwright), elles doivent etre stables cross-OS.
- CI Linux vs Mac local peuvent produire des diffs de 1-2 pixels sur font rendering.
- **Option A** : baselines generees en CI Linux, Mac local accepte les diffs comme informatifs (pas bloquant en local).
- **Option B** : Docker local pour matcher CI. Plus lourd.
- **Recommandation** : A, avec un script `npm run visual:update` qui relance les snapshots en CI via GitHub Actions workflow_dispatch, puis Kevin reviewe et merge.

### Q-DS-08 — Integration tokens.css existant planifie pour Dashboard monitor ?

- Le plan Dashboard monitor D2.1 prevoyait `docs/design-system/tokens.css`. Ce chantier est paused mais le plan subsiste.
- Si le DS module cree `modules/design-system/tokens/build/tokens.css`, le dashboard monitor (quand reprise) doit-il :
  - **Option A** : importer depuis `modules/design-system/tokens/build/tokens.css` (dependance inversee : doc depend d'un module).
  - **Option B** : conserver `docs/design-system/tokens.css` comme copie independante (risque de derive).
  - **Option C** : Dashboard monitor lit le meme fichier `modules/design-system/tokens/build/tokens.css` via path relatif au repo (../../modules/design-system/...).
- **Recommandation** : C. Source unique, zero duplication, path relatif accepte pour un outil interne.

---

## 8. Plan d'attaque resume

Voir `02-plan.md` pour le detail.

Sessions DS-1 a DS-6, chacune ~30-40 pourcent d'une session audit normale, un commit final par session, pattern WIP+phase F si compactage menace.

---

## 10. Mode atelier visuel live (exigence Kevin 2026-04-08)

Kevin veut pouvoir, au cours d'une session, affiner visuellement le DS en direct avec aide de Cowork, avec la possibilite de se brancher sur MCP Figma ou Penpot.

### 10.1 Forme concrete de l'atelier

Une "session atelier" = Kevin lance le Storybook en local, Cowork itere avec lui sur primitives/tokens en voyant le rendu en direct.

Canaux de feedback visuel disponibles cote Cowork :

1. **Screenshots manuels Kevin** : Kevin prend un screenshot, le depose dans la conversation, Cowork voit le rendu et commente/corrige. Fiable, simple, deja outille.
2. **Computer-use MCP** : Cowork peut demander access a Chrome/Safari, prendre un screenshot lui-meme via `mcp__computer-use__screenshot` sur la fenetre Storybook. Attention tier "read" sur navigateurs donc **lecture seule** (clicks bloques).
3. **Claude in Chrome MCP** : si Kevin a installe l'extension, Cowork peut naviguer dans Storybook via `mcp__Claude_in_Chrome__*`, lire le DOM, prendre des screenshots, interagir. Plus rapide que computer-use sur un navigateur. **Recommande** pour l'atelier visuel.
4. **Playwright headed local** : script `npm run visual:workshop` qui lance Playwright headed sur une story, Cowork lit les snapshots generes. Fonctionne meme sans Chrome MCP.

### 10.2 Branche MCP Figma

- MCP Figma est **disponible** dans l'environnement Cowork (tools `mcp__3fc76df9..._*`). Fonctions visibles : `get_design_context`, `get_screenshot`, `get_variable_defs`, `search_design_system`, `get_metadata`, `create_design_system_rules`, `use_figma`, `get_code_connect_*`.
- Usage possible dans une session atelier : Cowork lit des variables, composants, screenshots depuis un fichier Figma de reference que Kevin aura cree ou pointe, et les compare aux primitives DS en cours.
- **Prerequis Kevin** : un fichier Figma source partage et accessible par le compte MCP Figma.

### 10.3 Branche MCP Penpot

- Aucun MCP Penpot n'est declare dans les tools disponibles Cowork aujourd'hui (verifie 2026-04-08).
- Action cote Cowork : lancer `search_mcp_registry` avec `["penpot", "design", "token"]` au debut de la premiere session atelier pour voir si un connector existe. Si oui, `suggest_connectors`. Si non, fallback : Penpot export JSON DTCG local + lecture fichier par Cowork via Read tool.
- Penpot + DTCG : Penpot supporte natif l'import/export DTCG JSON via Tokens Studio. Workflow : Kevin edite tokens dans Penpot -> exporte JSON DTCG -> Cowork lit le JSON depuis foundation-os/ ou un dossier monte -> compare/merge avec `tokens/source/*.json` du module DS.

### 10.4 Forme de la session atelier

Session type "DS-atelier" (non numerotee, a appeler a la demande apres DS-3 primitives P1) :

1. **Prep (Cowork)** : Cowork relit etat DS, lance lecture du ou des fichiers Figma/Penpot cibles si fournis, identifie les points a travailler avec Kevin.
2. **Boot (Kevin)** : Kevin lance `npm run storybook` en local. Partage l'URL localhost ou prend des screenshots au fil de l'eau.
3. **Iteration** : pour chaque primitive ou token a affiner :
   - Cowork propose une modif precise (ex : "Button primary : passer le radius de 6 a 8, augmenter le weight a 600, clarifier le focus ring").
   - Kevin valide ou re-screenshot.
   - Cowork applique via Edit tool (ou l'annonce pour CLI si fichier dans modules/design-system/).
   - Kevin reload Storybook, visuel confirme ou nouveau tour.
4. **Cloture atelier** : Cowork liste les changes, propose un commit `refactor(ds): atelier visual DS — [scope]`, met a jour CONTEXT.md.

### 10.5 Regles anti-collision atelier

- Rappel CLAUDE.md §4 : `modules/**` est zone **Claude Code CLI proprietaire**. Cowork ne doit pas ecrire directement dans `modules/design-system/src/` sans OK Kevin explicite par action.
- Mode atelier = **exception explicitement demandee par Kevin** : Cowork peut editer les fichiers primitives/tokens en temps reel, mais chaque edit doit etre annonce et le commit final est propose (pas execute).
- Le verrou `scripts/session-lock.sh` doit etre acquis (refresh TTL tous les 25min).

### 10.6 Impact sur le plan

- Nouvelle session optionnelle **DS-atelier** (sur demande), plugable apres DS-3 (quand il y a assez de primitives pour valoir le coup).
- Pas de contraine sur l'ordre DS-1 a DS-6. L'atelier est orthogonal et peut etre appele plusieurs fois.
- Prerequis pour le 1er atelier : DS-1 (scaffold + tokens) + DS-2 (Storybook boot) + au moins une primitive (DS-3 partielle).

### 10.7 Nouvelles questions ouvertes

#### Q-DS-09 — Canal principal de feedback visuel pour l'atelier ?

- **Option A — Screenshots manuels Kevin** : simple, fiable, fonctionne avec toutes les configurations.
- **Option B — Claude in Chrome MCP** (recommande si extension installee) : interaction fluide, Cowork prend ses propres screenshots Storybook, iteration plus rapide.
- **Option C — Computer-use MCP en tier read** : Cowork voit Storybook dans Chrome/Safari mais clicks bloques, donc Kevin pilote le navigateur et Cowork observe. Fiable mais plus lent.

#### Q-DS-10 — Reference design source pour l'atelier ?

- **Option A** : Atelier from scratch, Void Glass + recherche + gout Kevin comme reference. Pas de fichier Figma/Penpot initial.
- **Option B** : Kevin cree un fichier Figma source "Foundation OS DS — Reference" qu'il partage avec le compte MCP Figma. Cowork lit les components Figma et aligne les primitives code dessus.
- **Option C** : Kevin cree dans Penpot (alternative open source, native DTCG). Necessite MCP Penpot ou export JSON manuel.

---

## 9. Anti-bullshit gates specifiques DS

- Aucune affirmation "Storybook configure" sans `npm run storybook` execute avec succes et screenshot visible.
- Aucune affirmation "primitive Button AA" sans test jest-axe vert ET axe-playwright vert.
- Aucune affirmation "visual regression en place" sans workflow GitHub Actions qui a execute avec succes au moins une fois et a genere des baselines committees.
- Chaque metrique (duree build, nombre primitives, nombre tests) avec commande de verification executable.
- Aucune primitive merge sans story + test unit + test a11y + visual snapshot baseline.
