# Plan de Finition — DS shadcn/ui (Void Glass Figma Make)

Plan pluri-sessions pour finaliser le Design System reconstruit depuis Figma Make.
Genere le 2026-04-11. Version 1.0.

## Contexte

Le DS a ete remplace integralement a partir du fichier Figma Make `base DS/src.zip` :
- 46 composants shadcn/ui copies verbatim dans `modules/design-system/src/components/ui/`
- Tokens DTCG extraits de `theme.css` dans `tokens/source/primitives/` (5 fichiers, 89 vars)
- Bridge `src/styles/globals.css` shadcn + `--ds-*` → `--fos-*`
- Preview Figma Make iso dans `modules/design-system/preview/` (port 6007)

**Etat commits** :
- `a6f37a2` — tokens control/border/size + refactor anciens primitives
- `3547b48` — remplacement shadcn/ui + Tailwind 4 + bridge
- `311ae9a` — tokens from scratch + preview Figma Make (WIP — ce plan)

## Gaps identifies (audit 2026-04-11)

| # | Gap | Impact | Phase |
|---|-----|--------|-------|
| 1 | modules/app casse : 75 refs old `--fos-*` dans 22 fichiers | Visuel casse | F4 |
| 2 | Pas de couche semantic (tokens/source/semantic/ vide) | Non-propre | F2 |
| 3 | Primitives manquants : border-width, motion, line-height, letter-spacing, control-height | Couverture | F1 |
| 4 | Prefixe `--fos-color-ds-surface-0` (double prefixe) | Cosmetique | F3 |
| 5 | .storybook/preview.ts : refs old `--fos-color-bg-canvas`/`-text-primary` | Storybook casse | F5 |
| 6 | `modules/design-system/base DS/` folder (src.zip + old config) | Bloat | F6 |
| 7 | CLAUDE.md, docs/core/tools.md, docs/design-system.md : refs #06070C/#5EEAD4 | Doc obsolete | F6 |
| 8 | src/index.ts header "Void Glass" legacy | Cosmetique | F6 |
| 9 | 1 seul test (button smoke) — zero couverture reelle | Qualite | F7 / F8 |
| 10 | Composants manquants (ou etats manquants) vs vrai DS pro | Maturite | F9 |
| 11 | Pas de demo site vrai, preview = Figma Make iso | Showcase | F9 |

## Decisions confirmees (Kevin 2026-04-11)

1. **App migration** : migrer `modules/app` sur les nouveaux tokens (pas de compat layer).
2. **Prefixe** : retirer `--fos-*` → sortie directe `--ds-*`, `--shadcn-*`, `--space-*`, etc.
3. **Delete old** : supprimer toute trace de l'ancien DS turquoise `#5EEAD4`.
4. **Dark only** : pas de light mode.
5. **Figtree + JetBrains Mono** : polices officielles du DS.

## Decoupage en sessions

| Session | Phases | Duree estimee | Objectif |
|---------|--------|---------------|----------|
| S+1 | F1 → F7 | 1 session complete | DS propre + app migree + builds verts |
| S+2 | F8 | 1/2 session | Nettoyage code + tests etendus |
| S+3 | F9 | 1 session complete | Affinage DS + site demo |

---

## Phase F1 — Completer les primitives

**Objectif** : ajouter les primitives DTCG absentes pour couvrir 100% des besoins design.

**Fichiers a creer** :
- `tokens/source/primitives/border.json`
  - `border.width.hairline` = 1px
  - `border.width.thick` = 2px
  - `border.width.heavy` = 4px
- `tokens/source/primitives/motion.json`
  - `motion.duration.instant` = 0ms
  - `motion.duration.fast` = 150ms
  - `motion.duration.base` = 250ms
  - `motion.duration.slow` = 400ms
  - `motion.curve.linear` / `ease` / `easeIn` / `easeOut` / `easeInOut`
- `tokens/source/primitives/lineHeight.json`
  - `lineHeight.tight` = 1.2 (headings)
  - `lineHeight.normal` = 1.5 (body, UI)
  - `lineHeight.relaxed` = 1.75 (long-form)
- `tokens/source/primitives/letterSpacing.json`
  - `letterSpacing.tight` = -0.02em
  - `letterSpacing.normal` = 0
  - `letterSpacing.wide` = 0.05em
- `tokens/source/primitives/control.json` (sizes de base control)
  - `control.size.sm.height` = 28px
  - `control.size.md.height` = 36px
  - `control.size.lg.height` = 44px

**Verification** : `npm run build:tokens` — les nouvelles vars apparaissent dans `tokens/build/tokens.css`.

---

## Phase F2 — Creer la couche semantic

**Objectif** : introduire la couche `semantic` qui aliase les primitives a des noms porteurs d'intention.

**Fichiers a creer** :
- `tokens/source/semantic/color.json`
  - `bg.canvas` → `color.ds.surface.0`
  - `bg.sidebar` → `color.ds.surface.1`
  - `bg.card` → `color.ds.surface.2`
  - `bg.elevated` → `color.ds.surface.3`
  - `text.primary` → `color.ds.fg` (100%)
  - `text.secondary` → `color.ds.fg/80`
  - `text.muted` → `color.ds.fg/60`
  - `text.faint` → `color.ds.fg/40`
  - `text.ghost` → `color.ds.fg/20`
  - `border.default` → `color.ds.border/5`
  - `border.strong` → `color.ds.border/15`
  - `accent.info` → `color.ds.blue`
  - `accent.success` → `color.ds.emerald`
  - `accent.warning` → `color.ds.amber`
  - `accent.danger` → `color.ds.rose`
  - `accent.brand.primary` → `color.ds.blue`
  - `accent.brand.secondary` → `color.ds.purple`
- `tokens/source/semantic/typography.json`
  - Roles : `display`, `h1`, `h2`, `h3`, `h4`, `bodyLarge`, `body`, `bodySmall`, `label`, `caption`, `code`
  - Chaque role : family + size + weight + lineHeight + letterSpacing
- `tokens/source/semantic/space.json`
  - `inset.xs/sm/md/lg/xl` (padding interieur controls/cards)
  - `stack.xs/sm/md/lg/xl` (gap vertical)
  - `inline.xs/sm/md/lg/xl` (gap horizontal)
- `tokens/source/semantic/radius.json`
  - `control` → `ds.radius.sm` (6px)
  - `card` → `ds.radius.md` (8px)
  - `modal` → `ds.radius.lg` (12px)
  - `pill` → `ds.radius.full`
- `tokens/source/semantic/motion.json`
  - `enter` / `exit` / `hover` / `focus` / `modal`

**Verification** : tous les semantic resolvent via `{}` references Style Dictionary, build OK.

---

## Phase F3 — Rebuild tokens + retirer prefixe fos-

**Objectif** : sortie CSS propre sans `--fos-*`, avec noms courts.

**Modifications** :
- `scripts/build-tokens.mjs`
  - Retirer `prefix: 'fos'`
  - Garder `attribute/cti` ou introduire transform custom pour namespacing
- Restructurer JSON si besoin pour obtenir :
  - `--ds-surface-0`, `--ds-fg`, `--ds-blue`
  - `--shadcn-background`, `--shadcn-primary-bg`
  - `--space-4`, `--text-base`, `--radius-md`
  - `--border-width-hairline`, `--motion-duration-fast`
- `src/styles/globals.css`
  - Reecrire le bridge sans `--fos-*`
  - Exposer les semantic en CSS vars pures : `--color-bg-canvas`, `--color-text-primary`, etc.
  - `@theme inline` : generer utilites Tailwind depuis les semantic

**Verification** :
- `npm run build:tokens` OK
- Preview Figma Make toujours iso (`http://127.0.0.1:6007/`)
- Aucune var `--fos-*` dans `tokens/build/tokens.css`

---

## Phase F4 — Migrer modules/app

**Objectif** : remplacer les 75 refs aux anciens tokens dans 22 fichiers app.

**Table de migration** :

| Ancien | Nouveau |
|--------|---------|
| `--fos-color-bg-canvas` | `--color-bg-canvas` (semantic) |
| `--fos-color-accent-brand` | `--color-accent-brand-primary` (semantic) |
| `--fos-color-text-bright` | `--color-text-primary` |
| `--fos-color-text-primary` | `--color-text-primary` |
| `--fos-color-text-body` | `--color-text-secondary` |
| `--fos-color-text-subtle` | `--color-text-muted` |
| `--fos-color-text-faint` | `--color-text-faint` |
| `--fos-color-text-ghost` | `--color-text-ghost` |
| `--fos-color-border-default` | `--color-border-default` |
| `--fos-color-status-wip` | `--color-accent-info` |
| `--fos-color-status-done` | `--color-accent-success` |
| `--fos-color-status-paused` | `--color-accent-warning` |
| `--fos-color-status-parking` | `--color-accent-brand-secondary` |
| `--fos-space-scale-N` | `--space-N` |
| `--fos-font-family-sans` | `--font-sans` |
| `--fos-radius-component-card` | `--radius-card` |

**Fichiers a toucher** (22 fichiers, 75 occurences) :
- `modules/app/src/index.css` (3 refs)
- `modules/app/src/App.tsx` (5 refs)
- `modules/app/src/pages/IndexPage.tsx` (9 refs)
- `modules/app/src/pages/LoginPage.tsx` (8 refs)
- `modules/app/src/pages/ResetPasswordPage.tsx` (5 refs)
- `modules/app/src/pages/KnowledgePage.tsx` (9 refs)
- `modules/app/src/components/{TabBar,Card,Layout,Navbar}.tsx` (~12 refs)
- `modules/app/src/components/Commander/*.tsx` (~10 refs)
- `modules/app/src/components/forms/*.tsx` (~14 refs)

**Strategie** : script de remplacement sed + verif visuelle apres via `npm run dev` cote app.

**Verification** :
- `npm run build` cote modules/app OK
- `npm run test` cote modules/app : 19/19 tests passent
- Visuel identique (screenshot avant/apres)

---

## Phase F5 — Fix Storybook preview.ts

**Objectif** : retirer les refs `--fos-color-bg-canvas` / `-text-primary` / `-font-family-sans` et utiliser les nouveaux tokens semantiques.

**Fichier** : `modules/design-system/.storybook/preview.ts`

**Changes** :
- Remplacer les fallback values obsoletes
- Supprimer la palette `void-glass: #06070C` dans `backgrounds.values`
- Utiliser `var(--color-bg-canvas)` avec fallback `#030303`

**Verification** : `npm run storybook` demarre sans erreur.

---

## Phase F6 — Cleanup residuals

**Objectif** : eradiquer toute trace de l'ancien DS.

**Actions** :
1. `rm -rf modules/design-system/base\ DS/` (src.zip + old config — sauvegarde dans .archive/ si besoin)
2. `modules/design-system/src/index.ts` : retirer mention "Void Glass dark via --fos-*"
3. `CLAUDE.md` : remplacer "Void Glass : fond #06070C, Figtree..." par "Void Glass : Figma Make dark, Figtree + JetBrains Mono, tokens DTCG semantic (docs/design-system-v2.md)"
4. `docs/design-system.md` : archiver dans `.archive/docs-old/` et ecrire `docs/design-system-v2.md` a partir de zero (structure DTCG, composants shadcn, bridge)
5. `docs/core/tools.md` : retirer mentions `#06070C`/turquoise si presentes
6. Verifier `.omc/` et autres fichiers techniques pour refs residuels

**Verification** : `grep -r "5EEAD4\|06070C\|turquoise" modules/ docs/ CLAUDE.md` retourne 0 match (sauf archives).

---

## Phase F7 — Verifications finales

**Objectif** : garantir zero regression et etat SAIN.

**Commandes** :
```bash
# DS
cd modules/design-system
npm run build:tokens
npm run typecheck
npm test

# App
cd modules/app
npm run build
npm test

# Global
bash scripts/health-check.sh

# Preview
cd modules/design-system
npm run preview:ds  # verif visuelle sur localhost:6007
```

**Criteres** :
- Health-check : SAIN (0 critical, 0 warning)
- DS typecheck : 0 erreur
- DS test : tous verts
- App build : OK
- App test : 19/19
- Preview : iso Figma Make

**Commit atomique** : `feat(ds): finition complete — semantic layer + app migration + cleanup`

---

## Phase F8 — Nettoyage final + tests etendus

**Objectif** : resserrer la qualite du DS.

**Actions** :
1. Audit exports inutiles (`src/components/ui/index.ts` peut exposer trop)
2. Verifier qu'aucun composant shadcn ne contient de `@ts-nocheck` (sauf `chart.tsx` si toujours necessaire)
3. Supprimer deps non-utilisees (si carousel/chart/form ne servent pas → retirer leurs deps)
4. Ajouter smoke tests a minima pour :
   - button (✅ existe)
   - input, textarea
   - dialog, alert-dialog, sheet
   - select, tabs
   - card, badge, avatar
5. Tests a11y (jest-axe) sur les 10 composants les plus utilises
6. Lint check sur tout le DS (eslint ou biome a introduire ?)
7. Mettre a jour `docs/design-system-v2.md` avec :
   - Architecture 3 couches (primitives / semantic / component)
   - Liste des composants exposes
   - Exemple de consommation
   - Procedure de mise a jour des tokens
8. Ajouter un `CHANGELOG.md` au DS

**Commit** : `chore(ds): nettoyage + tests + doc v2`

---

## Phase F9 — Affinage DS + Site demo (session dediee)

**Objectif** : transformer le DS en produit vendable et creer un vrai site demo.

**Tache 9.1 — Audit composants manquants / etats manquants**

Pour chaque composant shadcn, verifier :
- Variants couverts (primary / secondary / outline / ghost / destructive / link)
- Tailles (sm / md / lg / icon / xs pour certains)
- Etats (default / hover / active / focus / disabled / loading / error / success)
- Accessibility : WCAG AA (contraste, aria, keyboard nav)
- Responsive : mobile-first

Composants a ajouter si manquants :
- Skeleton avances
- Empty states
- Banner / CTA
- Data table avance
- Stat card / KPI card
- File upload / dropzone
- Date range picker (sur calendar)
- Multi-select combobox
- Rich text editor (minimal)
- Code block avec syntax highlight

Etats a ajouter :
- Loading skeletons par composant
- Error boundaries
- Empty / zero state
- Success confirmations

**Tache 9.2 — Refactor des composants qui ont du vieux code**
- Retirer `@ts-nocheck` de chart.tsx si recharts v3 peut etre type proprement
- Upgrade calendar.tsx pour utiliser pleinement react-day-picker v9
- Ameliorer resizable.tsx (react-resizable-panels v4 API complete)
- Ajouter les props manquantes (size, variant) sur les composants trop simples

**Tache 9.3 — Site demo**

Remplacer `preview/` par un vrai site showcase :
- Route `/` — Hero + pitch "Design System Foundation OS"
- Route `/foundations` — Tokens (couleurs, typo, spacing, radius, shadow)
- Route `/components` — Index des composants
  - `/components/:name` — Page par composant avec :
    - Description
    - Props
    - Variants
    - Etats
    - Exemples
    - Playground interactif
    - Accessibility checklist
- Route `/patterns` — Patterns reutilisables (forms, navigation, feedback, layouts)
- Route `/guidelines` — Regles de design (do/don't, quand utiliser)
- Route `/changelog` — Versions
- Route `/resources` — Figma link, Github, contact

**Structure technique** :
- Vite + React 19 + TypeScript
- Framer Motion pour transitions
- Syntax highlighter pour code blocks
- Recherche rapide (cmdk)
- Dark mode only (Void Glass)
- Deploy sur Vercel (`demo.foundation-os.vercel.app`)

**Commit** : `feat(ds): affinage v2 + site demo complete`

---

## Conditions d'entree pour S+1

Avant de demarrer F1 :
1. Verifier que le commit `311ae9a` est bien present (`git log --oneline -3`)
2. `cd modules/design-system && npm run build:tokens` OK
3. `npm run preview:ds` demarre (verifier visuel http://127.0.0.1:6007/)
4. Lire ce plan integralement avant de toucher au code
5. Pas de blocage sur le prefixe (`--fos-*` → `--ds-*` est confirme)

## Conditions de sortie pour S+1

A la fin de F1-F7 :
1. `git log --oneline -10` — 7 commits atomiques minimum
2. Health-check SAIN
3. App et DS buildent
4. Preview Figma Make toujours iso
5. CONTEXT.md mis a jour avec la section "DS v2 finition termine"
6. docs/plans/2026-04-11-ds-shadcn-finition.md : marquer F1-F7 comme DONE

## Risques & mitigations

| Risque | Probabilite | Mitigation |
|--------|-------------|------------|
| Retirer prefixe fos- casse Style Dictionary | Moyen | Tester sur un fichier primitif avant de migrer tout |
| App migration introduit regressions visuelles | Eleve | Screenshot avant/apres, comparaison visuelle |
| Semantic layer trop ambitieux | Moyen | Commencer par color.json, itérer |
| F9 site demo explose en scope | Eleve | Timebox strict, une section par iteration |
| Sidebar.tsx depasse 700L (CLAUDE.md regle) | Moyen | Decouper en sous-composants si besoin |

## Reference

- Commits : `a6f37a2`, `3547b48`, `311ae9a`
- Preview : `http://127.0.0.1:6007/` (via `npm run preview:ds`)
- Base Figma Make : `modules/design-system/base DS/src.zip` (a supprimer en F6)
- Design System v2 (a ecrire) : `docs/design-system-v2.md`
