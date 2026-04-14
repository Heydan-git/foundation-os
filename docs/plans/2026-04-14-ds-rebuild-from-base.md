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

- [ ] Phase 0 — Revert + archive
- [ ] Phase 1 — Tokens
- [ ] Phase 2a — UI batch Form & inputs
- [ ] Phase 2b — UI batch Layout & nav
- [ ] Phase 2c — UI batch Data & feedback
- [ ] Phase 3 — Stories Storybook
- [ ] Phase 4a — DashboardLayout + IndexPage
- [ ] Phase 4b — Commander + Knowledge
- [ ] Phase 4c — Login + ResetPassword + cleanup
- [ ] Phase 5 — Verification visuelle + Supernova + CONTEXT
