# @foundation-os/design-system

Design System package for Foundation OS — Void Glass tokens (DTCG W3C) + primitives atomiques Button / Text / Icon / Input / Card + Storybook 8 preview.

## Status actuel

- **DS-1** (2026-04-09) — Scaffold module + tokens DTCG 2-tier (primitives + semantic) + Style Dictionary 4.
- **DS-2** (2026-04-09) — Storybook 8.6.18 + preview Void Glass + Welcome story (tokens showcase) + addon-a11y.
- **DS-3** (2026-04-09) — Primitives P1 Button + Text + Icon (forwardRef, CSS Modules, stories, tests).
- **DS-4** (2026-04-09) — Primitives P2 Input + Card (forwardRef, slots, interactive keyboard, stories, tests).
- **DS-6 partial** (2026-04-09) — Consommation tokens.css par modules/app via prebuild workspace chain.

**Reste a faire** : DS-5 CI Playwright visual regression + axe gate (housekeeping), DS-6 complet (scripts/export-dtcg.mjs pour Figma/Penpot import natif).

## Scripts

```bash
npm run build:tokens      # Genere tokens/build/ (tokens.css + tokens.js + tokens.json)
npm run check:contrast    # Verifie ratios WCAG AA sur les paires fond/texte semantic
npm run build             # Alias de build:tokens
npm run storybook         # Dev server Storybook 8 (port 6006)
npm run build-storybook   # Build statique Storybook (storybook-static/)
npm test                  # Vitest run (tests unitaires + a11y jest-axe)
npm run test:watch        # Vitest watch mode
```

## Structure

```
modules/design-system/
├── tokens/
│   ├── source/             # DTCG JSON source de verite
│   │   ├── primitives/     # Palettes brutes (color, typography, spacing, radius, elevation, motion)
│   │   └── semantic/       # Intentions via aliases DTCG (bg, text, border, accent, status, glow)
│   └── build/              # Outputs generes — GITIGNORED, recalcules par build:tokens
│       ├── tokens.css      # CSS vars --fos-* (consommable par n'importe quel CSS)
│       ├── tokens.js       # ESM export pour runtime JS/TS
│       └── tokens.json     # Flat JSON pour outils externes (Figma import, CI)
├── scripts/
│   ├── build-tokens.mjs    # Style Dictionary 4 runner (custom transforms pour preserver alpha)
│   └── check-contrast.mjs  # Validation WCAG AA (8 paires semantic)
├── src/
│   ├── index.ts            # Barrel top-level
│   └── primitives/
│       ├── index.ts        # Barrel primitives (5 composants)
│       ├── Button.{tsx,module.css,stories.tsx,test.tsx}
│       ├── Text.{tsx,module.css,stories.tsx,test.tsx}
│       ├── Icon.{tsx,stories.tsx,test.tsx}                  # Wrapper lucide-react tree-shakeable (21 icones curees)
│       ├── Input.{tsx,module.css,stories.tsx,test.tsx}
│       └── Card.{tsx,module.css,stories.tsx,test.tsx}
├── .storybook/
│   ├── main.ts             # Framework react-vite + addons (essentials + a11y)
│   ├── preview.ts          # Preview global Void Glass (tokens.css import + Figtree + a11y rules)
│   └── manager.ts          # Theme dark manager (sidebar + toolbar Void Glass)
├── test/
│   └── setup.ts            # Vitest + jest-dom + jest-axe + cleanup auto
├── vitest.config.ts        # jsdom + CSS Modules non-scoped
├── tsconfig.json
├── package.json            # Workspace member @foundation-os/design-system
└── README.md               # Ce fichier
```

## Exports publics

```ts
import {
  // Primitives
  Button, Text, Icon, Input, Card,
  // Icons helpers
  ICON_NAMES,
  // Types
  type ButtonProps, type ButtonVariant, type ButtonSize,
  type TextProps, type TextVariant, type TextWeight, type TextColor,
  type IconProps, type IconName,
  type InputProps, type InputType,
  type CardProps, type CardVariant, type CardElement,
} from '@foundation-os/design-system'

// Tokens
import '@foundation-os/design-system/tokens.css'                  // CSS vars --fos-*
import tokens from '@foundation-os/design-system/tokens'          // ESM object
import tokensJson from '@foundation-os/design-system/tokens.json' // Flat JSON
```

## Principes

- **Zero SaaS** : pas de Chromatic, pas de Supernova, pas d'externe. Tout en local/CI GitHub Actions.
- **DTCG W3C format** : tokens/source/*.json suivent la spec Community Group. Compatible Figma Variables import natif + Penpot + tout outil DTCG-compliant.
- **CSS Modules** pour les primitives — decouple du Tailwind de `modules/app`, portable vers futurs modules Finance / Sante / Trading.
- **Void Glass inviolable** : fond #06070C, accent #5EEAD4, Figtree + JetBrains Mono. Voir `docs/design-system.md` (source canonique).
- **WCAG AA par defaut** : toutes les paires semantic sont verifiees via `npm run check:contrast`. Tests jest-axe sur chaque primitive.
- **Alpha precision preservee** : custom Style Dictionary transforms (voir scripts/build-tokens.mjs commentaires F-DS1-01) pour garder les rgba alpha exacts des tokens Void Glass canoniques (0.025, 0.055, 0.42, 0.88).

## Consommation par modules/app

`modules/app/src/main.tsx` importe les tokens globaux :

```ts
import '@foundation-os/design-system/tokens.css'
```

Le prebuild hook de `modules/app` invoque automatiquement `npm run build --workspace=@foundation-os/design-system` avant tout `build` / `dev` / `test`, garantissant que `tokens/build/tokens.css` existe a chaque execution (le dossier `tokens/build/` est gitignore).

Les primitives (Button, Text, etc.) sont disponibles pour import nomme des que `modules/app` en aura besoin.

## Refs

- Spec DS bootstrap : `docs/travaux-cowork/2026-04-08-design-system-bootstrap/01-spec.md`
- Plan 6 sessions   : `docs/travaux-cowork/2026-04-08-design-system-bootstrap/02-plan.md`
- Void Glass source : `docs/design-system.md`
- Storybook local   : http://localhost:6006/ (apres `npm run storybook`)
