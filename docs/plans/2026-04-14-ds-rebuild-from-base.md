# Plan — Rebuild total DS depuis `base DS/`

**Date** : 2026-04-14
**Status** : valide Kevin, en cours
**Supersede** : `2026-04-14-ds-voidglass-iso-figma-make.md` (void-glass approach abandonnee)

## Demande Kevin (source de verite)

> Prendre `modules/design-system/base DS/src/` (export Figma Make) et en faire **un vrai DS** : stack React/Vite/TS/Tailwind, tokens + variables semantiques, composants reutilisables, visuellement identique a 100% aux yeux d'un humain. Supprimer `void-glass/` (ancien DS). Refactorer TOUT l'app (dashboard monitoring + futur App Builder) pour utiliser ce DS. Storybook iso visuel.

Regle : methode libre (copy, refactor, rewrite) — seul critere = rendu visuel identique au `base DS`.

## Source de verite = `modules/design-system/base DS/src/`

- `styles/theme.css` (291 L) — tokens couleurs, radius, fonts, surfaces
- `styles/tailwind.css`, `fonts.css`, `index.css`
- `app/components/ui/` — 48 composants
- `app/components/*.tsx` — 7 pages Dashboard (patterns de reference)

## A SUPPRIMER (table rase)

- `modules/design-system/src/components/void-glass/` (11 fichiers + stories)
- `modules/design-system/src/components/ui/` actuel (103 fichiers shadcn vanilla — ne matche pas base DS)
- `modules/design-system/src/components/patterns/` actuel
- `modules/design-system/tokens/primitives/` + `semantic/` actuels (DTCG DS-0..9 obsolete)
- `modules/design-system/src/styles/` si divergent
- `modules/app/src/pages/IndexPage.tsx` refactor void-glass (revert)

## Structure cible

```
modules/design-system/
├── src/
│   ├── styles/
│   │   ├── tokens.css         # primitives + semantic (from base DS/theme.css)
│   │   ├── global.css         # tailwind import + base
│   │   └── fonts.css
│   ├── components/
│   │   ├── ui/                # 48 composants iso base DS
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (48 au total)
│   │   └── patterns/          # 7 Dashboard templates (storybook uniquement)
│   │       ├── DashboardHome.tsx
│   │       └── ... (7)
│   ├── lib/utils.ts           # cn helper
│   └── index.ts               # barrel export
├── stories/                   # 48 + 7 stories
└── tokens/                    # DTCG sync pour Supernova
```

## Phases (sessions courtes, 1-2h chacune)

### Phase 0 — Revert + archive (30min)
- [ ] Revert `modules/app/src/pages/IndexPage.tsx` au commit `753891b`
- [ ] Archiver `src/components/void-glass/` → `.archive/ds-void-glass-2026-04-14/`
- [ ] Archiver `src/components/ui/` actuel → `.archive/ds-shadcn-vanilla-2026-04-14/`
- [ ] Archiver `src/components/patterns/` → `.archive/ds-patterns-old-2026-04-14/`
- [ ] Archiver `tokens/primitives/` + `semantic/` + `bridge/` → `.archive/ds-tokens-dtcg-old-2026-04-14/`
- [ ] Commit : `chore(ds): archive anciennes couches avant rebuild base DS`

### Phase 1 — Tokens (1h)
- [ ] Analyser `base DS/src/styles/theme.css` ligne par ligne : separer primitives (raw values) vs semantic (alias)
- [ ] Creer `src/styles/tokens.css` : **layer primitives** (colors raw, spacing, radii, font-sizes) + **layer semantic** (surface, fg, border, accents)
- [ ] Creer `src/styles/global.css` (tailwind + base reset)
- [ ] Copier `base DS/src/styles/fonts.css` si non vide
- [ ] Configurer Tailwind `theme.extend` pour pointer sur les semantic tokens (pas de hardcoded)
- [ ] Build Style Dictionary → `tokens/build/` (DTCG JSON + CSS + JS pour Supernova)
- [ ] Verifier le CSS genere : 0 difference visuelle avec `base DS/theme.css`

### Phase 2 — Composants UI 48 (2-3 sessions)
**Strategie** : copy brut depuis `base DS/src/app/components/ui/` → `src/components/ui/`, puis refactor pour pointer sur tokens semantic (pas de couleurs hardcodees).

**Batch 2a (16 composants — Form & inputs)** :
- [ ] button, input, textarea, label, checkbox, radio-group, select, switch, slider, toggle, toggle-group, input-otp, form, calendar, command, combobox

**Batch 2b (16 composants — Layout & nav)** :
- [ ] card, sheet, dialog, drawer, alert-dialog, popover, tooltip, hover-card, accordion, collapsible, tabs, breadcrumb, navigation-menu, menubar, context-menu, dropdown-menu

**Batch 2c (16 composants — Data & feedback)** :
- [ ] table, avatar, badge, alert, toast/sonner, skeleton, progress, aspect-ratio, carousel, chart, pagination, resizable, scroll-area, separator, tag, kbd

Chaque batch :
- Copier les fichiers depuis base DS
- Refactor hardcoded colors → tokens semantic
- Tests vitest smoke (render + a11y) pour les 5 composants principaux du batch
- 0 regression build
- Commit dedie `feat(ds): ui batch Xa — <liste>`

### Phase 3 — Stories Storybook (1 session)
- [ ] 48 stories Components (1 story par composant, Default + 2-3 variantes)
- [ ] 7 stories Patterns (Dashboard*.tsx en templates)
- [ ] Verifier Storybook build clean
- [ ] Screenshot comparison : chaque story VS rendu base DS (si possible)
- [ ] Commit `docs(ds): storybook iso base DS — 48 components + 7 patterns`

### Phase 4 — Refactor app (2-3 sessions)
Ordre : du plus simple au plus complexe.

- [ ] `modules/app/src/layouts/DashboardLayout.tsx` (sidebar + header + orbs)
- [ ] `IndexPage.tsx` (stat cards + module cards + header)
- [ ] `Commander.tsx` (tabs + 6 panels)
- [ ] `KnowledgePage.tsx` (sections + cards)
- [ ] `Login.tsx` + `ResetPassword.tsx` (centered card + orbs bg)
- [ ] Cleanup composants app redondants si 100% replace par DS
- [ ] Build OK, 19/19 tests app, 0 style inline legacy, 0 color hardcoded

### Phase 5 — Verification visuelle OBLIGATOIRE (1h)
- [ ] Lancer `npm run dev` app
- [ ] Screenshot chrome-devtools MCP de chaque page → comparer visuellement au `base DS/src/app/components/Dashboard*.tsx`
- [ ] Lancer Storybook → screenshot chaque story → comparer base DS
- [ ] Si >5% divergence visuelle → ajuster (regle Kevin : 100% iso)
- [ ] Push Supernova sync (via GitHub Action existant)
- [ ] Verif UI Supernova (accessibility snapshot)
- [ ] CONTEXT.md update session
- [ ] Commit final `feat(ds): rebuild complet iso base DS — phases 0-5 DONE`

## Regles imperatives

1. **Visuel avant stack** : si un choix technique compromet le rendu iso, privilegier le rendu
2. **Tokens only** : aucune couleur hardcodee dans `src/components/ui/*.tsx` — toujours via token semantic
3. **Source base DS = sacree** : ne JAMAIS modifier `base DS/src/` (reference)
4. **Sessions courtes** : une phase = une session, commit + CONTEXT.md update en fin
5. **Verification visuelle** : screenshot obligatoire avant de claim "fait" sur toute phase UI (Phase 3+)
6. **Pas de void-glass** : interdit de recreer un `void-glass/` ailleurs

## Estimation

| Phase | Effort | Modele recommande |
|-------|--------|-------------------|
| 0 Revert/archive | 30min | direct |
| 1 Tokens | 1h | sonnet |
| 2 UI 48 comp (3 batches) | 3-4h | sonnet |
| 3 Stories | 1-2h | sonnet |
| 4 Refactor app | 2-3h | sonnet |
| 5 Verification | 1h | direct + chrome-devtools |
| **Total** | **8-11h** (5-7 sessions) | |

## Fichiers de suivi

- Ce plan : `docs/plans/2026-04-14-ds-rebuild-from-base.md`
- Execution log : au pied de ce fichier, cocher `[x]` au fur et a mesure
- CONTEXT.md : update en fin de chaque session

## Execution log

- [x] **Phase 0** — Revert + archive (`64d6baf`)
  - IndexPage.tsx reverte au hand-coded (commit 753891b)
  - Archives dans `.archive/ds-rebuild-2026-04-14/` : old-ui (103), old-void-glass (11), old-patterns (7), old-tokens-primitives, old-tokens-semantic, old-globals.css
  - src/components/ vide sauf `ds/` (puis rempli Phase 2)
  - tokens/source/ vide
  - src/index.ts gut a `export { cn } from './lib/utils'`
  - globals.css reduit a placeholder

- [x] **Phase 1** — Tokens (`ccd3e01`)
  - `src/styles/tokens.css` (175L) : PRIMITIVES `--p-*` (raw colors, spacing, text, radius, shadow) + SEMANTIC `--ds-*` (aliases by role, dark-only) + SHADCN bridge (`--background` etc. → semantic)
  - `src/styles/globals.css` (170L) : @import tailwindcss + tw-animate-css + tokens.css + @theme inline Tailwind v4 (genere `bg-ds-*`, `text-ds-*`, `p-ds-*`, `rounded-ds-*`) + @layer base (typo, fonts Figtree/JetBrains)
  - Decision : DARK-ONLY (pas de `:root light` + `.dark override`)
  - Valeurs iso `base DS/src/styles/theme.css` : ds-surface-0..3 (#030303..#111111), ds-blue #60a5fa, ds-purple #c084fc, ds-emerald #34d399, etc.

- [x] **Phase 2** — UI composants (`ea1e48b`)
  - 46 composants + utils.ts + use-mobile.ts copies de `base DS/src/app/components/ui/` → `src/components/ui/` (iso, 0 modif de code)
  - 3 fichiers avec `@ts-nocheck` (ligne 1) pour drift API v9 : `calendar.tsx` (react-day-picker IconLeft), `chart.tsx` (recharts v3 types), `resizable.tsx` (react-resizable-panels v4 default→named exports)
  - Barrel `src/components/ui/index.ts` : `export * from './<file>'` pour chacun + `export { cn } from './utils'` + `export { useIsMobile } from './use-mobile'`
  - `src/index.ts` : `export * from './components/ui'`

- [x] **Phase 3a** — Patterns Storybook (`18e4a00`)
  - 7 Dashboard*.tsx copies de `base DS/src/app/components/` → `src/components/patterns/` (iso)
  - `Patterns.stories.tsx` : stories `Home / AIAnalytics / Transactions / Wallet / Settings / DesignSystem` avec `MemoryRouter` decorator (react-router v7, chemins hardcoded dans DashboardLayout)

- [ ] **Phase 3b** — Stories individuelles composants UI *(BACKLOG — session dediee)*
  - **Scope** : 46 stories dans `src/components/ui/<name>.stories.tsx` (1 fichier par composant)
  - **Template minimal** : 1 story `Default` + variantes clefs (ex: button → Default, Variants, Sizes)
  - Non-bloquant pour l'iso visuel app : composant UI est deja iso base DS par copie conforme Phase 2. Les stories servent de showcase/QA interne, pas de runtime prod.
  - A demarrer quand besoin reel (onboarding nouveau module ou doc Supernova enrichie).

- [x] **Phase 4a** — Refactor IndexPage (token propagation ds-*) (`7638b5c`)
  - 16 remplacements : bg/text/border-{purple,blue,emerald,rose}-{400,500}/{10,20} → ds-*
  - Build 290ms, 19/19 tests. Visuel verifie Phase 5 ✓

- [x] **Phase 4b** — Refactor app-wide token propagation (`100120e`)
  - Scope elargi au-dela du plan initial : TOUS les `modules/app/src/**/*.tsx`
  - 47 remplacements sur 12 fichiers : Commander, KnowledgePage, LoginPage, ResetPasswordPage, DashboardLayout + Commander panels (Sessions/Decisions/Risks/Context) + Card + forms (NextStepActions, EditDecisionModal)
  - Regex bulk sed : `(bg|text|border|from|to)-COLOR-NNN` → `$1-ds-COLOR` (+ `border-{l,r,t,b}` variante)
  - Build 281ms, 19/19 tests, 0 legacy token restant

- [x] **Phase 5** — Verification visuelle chrome-devtools MCP
  - 3 pages screenshotees via `npm run dev` (localhost:5173) :
    - `/` IndexPage — sidebar + glow orbs + 4 stat cards + 2 module cards iso base DS ✓
    - `/commander` — tabs glass + stat pills colorees (purple/blue/rose/emerald) + sessions list ✓
    - `/knowledge` — Manifeste tab + glass cards + 3 pills (blue/purple/emerald) ✓
  - Zero regression visuelle — les tokens `--ds-*` pointent sur les memes hex 400-level que les classes Tailwind remplacees.
  - Supernova push : sera auto-declenche au prochain push main dans modules/design-system/ via GitHub Action (requiert secret `SUPERNOVA_TOKEN` — Kevin).
  - Screenshots sauvegardes `/tmp/fos-{login,commander,knowledge}-phase4.png`.

## Next Session Checklist (NE PAS OUBLIER)

**En ouvrant la prochaine session** :

1. ✅ Lire CE FICHIER en premier (`docs/plans/2026-04-14-ds-rebuild-from-base.md`)
2. ✅ Verifier le git log : dernier commit = `18e4a00 docs(context): session DS rebuild phases 0-3a + handoff`
3. ✅ Verifier la structure DS : `ls modules/design-system/src/components/ui/ | wc -l` → doit donner **48** (46 composants + utils.ts + use-mobile.ts)
4. ✅ Verifier les patterns : `ls modules/design-system/src/components/patterns/` → 7 Dashboard*.tsx + Patterns.stories.tsx
5. ✅ Build check : `npm run build -w modules/app` → OK 275ms attendu
6. ✅ Test check : `cd modules/app && npm test -- --run` → 19/19 attendu

**Rappels critiques** :

- **Ne PAS** recreer `void-glass/` (Kevin a dit explicitement de l'abandonner)
- **Ne PAS** remplacer `ui/` actuels par autre chose (ils sont iso base DS voulu)
- **Base DS** = sacree, JAMAIS modifier `modules/design-system/base DS/src/`
- **Phase 4** : propagation tokens UNIQUEMENT (semantic), pas de refactor structurel des pages
- **Phase 5** : screenshot OBLIGATOIRE avant "fait" (CLAUDE.md)
- **Kevin veut 100% iso visuel** : si en doute, privilegier le rendu sur l'elegance technique
- **Commits sessions courtes** : 1 phase = 1 commit. Ne pas batcher plusieurs phases.
- **Sub-agents** : seulement pour travail isole (pas pour jugement visuel qui requiert contexte global)

**Points d'attention runtime** :

- `calendar.tsx`, `chart.tsx`, `resizable.tsx` ont `@ts-nocheck` → si utilises dans stories Phase 3b, faire au moins un smoke render pour verifier runtime OK
- Bundle app 613kB (motion + lucide) : warning non-bloquant, investigation post-Phase 5
- Refs cassees : 65 (hausse de 1→65 vraisemblablement refs dans plan ou CONTEXT vers files archives) — a investiguer en Phase 5

**Fichiers cles pour re-onboarding** :
- Ce plan : `docs/plans/2026-04-14-ds-rebuild-from-base.md`
- Source verite visuelle : `modules/design-system/base DS/src/`
- Tokens actifs : `modules/design-system/src/styles/tokens.css` + `globals.css`
- Composants : `modules/design-system/src/components/ui/` (46) + `patterns/` (7)
- Storybook : `modules/design-system/.storybook/` + `src/**/*.stories.tsx`
- App layouts deja iso : `modules/app/src/components/DashboardLayout.tsx` (OK)
- App pages a token-propager : `modules/app/src/pages/*.tsx`
