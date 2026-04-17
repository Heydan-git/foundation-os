# @foundation-os/design-system

Design System package for Foundation OS — **Void Glass dark-only**, 46 composants UI derives `base DS/` (Figma Make, reworked fork) + 7 patterns Dashboard + Storybook 9.

## Narrative

- **Fork Void Glass de base DS** : les 46 composants UI sont derives de `base DS/src.zip` (Figma Make), puis retravailles pour matcher le template visuel `DashboardDesignSystem` (Void Glass dark-only, tokens `--ds-*`, glassmorphism, glow).
- **Tokens CSS directs** : pas de Style Dictionary / DTCG build pipeline. La source unique est `src/styles/tokens.css` (variables CSS `--ds-*`) consomme directement par `modules/app` via `@foundation-os/design-system/styles.css`.
- **Dark-only** : fond `#030303` (`ds-surface-0`). Figtree UI + JetBrains Mono. Pas de mode clair.

## Scripts

```bash
npm run build             # No-op (DS consomme directement src/styles/tokens.css)
npm run storybook         # Dev server Storybook 9 (port 6006)
npm run build-storybook   # Build statique Storybook (storybook-static/)
npm run typecheck         # tsc --noEmit
npm test                  # Vitest run
npm run test:watch        # Vitest watch mode
npm run preview:ds        # Preview standalone (port 6007)
npm run lint              # Biome lint src/
npm run lint:fix          # Biome lint src/ --fix
```

## Structure

```
modules/design-system/
├── src/
│   ├── index.ts                 # Barrel top-level
│   ├── components/
│   │   ├── ui/                  # 46 composants derives base DS + stories
│   │   └── patterns/            # 7 Dashboard patterns + Patterns.stories.tsx
│   ├── lib/                     # utils.ts + use-mobile.ts (deprecated, voir src/components/ui/)
│   └── styles/
│       ├── globals.css          # Import tokens.css + resets Tailwind (exporte via ./styles.css)
│       └── tokens.css           # CSS vars --ds-* — source unique
├── .storybook/                  # Framework react-vite + addons (a11y, docs)
├── test/
│   └── setup.ts                 # Vitest + jest-dom + jest-axe
├── e2e/                         # Playwright visual-a11y (stale, a re-tester)
├── docs-supernova/              # 6 foundations + 46 component docs (publie Supernova)
├── biome.json                   # Linter
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── supernova.config.json        # Config Supernova DS ID 790241
└── package.json
```

## Exports publics

```ts
// Barrel complet (composants UI + types)
import { Button, Card, Badge, ... } from '@foundation-os/design-system'

// Tokens CSS (import global dans modules/app/src/main.tsx)
import '@foundation-os/design-system/styles.css'

// Utilitaires
import { cn } from '@foundation-os/design-system/lib/utils'
```

## Principes

- **Void Glass dark-only** : fond `#030303` (ds-surface-0), accent bleu/violet, Figtree + JBMono.
- **Tokens CSS directs** : `src/styles/tokens.css` = source unique (pas de build DTCG).
- **46 composants UI** : derives `base DS/src.zip` (Figma Make) puis reworked (Button 9 variants vs 6, Card avec glow, Badge avec live pulse, etc.).
- **7 patterns Dashboard** : `src/components/patterns/Dashboard*.tsx` — showcase du DS (certains dupliques de `base DS/`).
- **Storybook 9** : 47 stories DS + 9 app = 56 stories totales.

## Consommation par modules/app

`modules/app/src/main.tsx` importe les tokens globaux :

```ts
import '@foundation-os/design-system/styles.css'
```

Le prebuild hook de `modules/app` invoque `npm run build --workspace=@foundation-os/design-system` qui est un no-op (DS consomme directement `src/styles/tokens.css`).

## Tests

- **Unitaires** : 0 test `.test.tsx` dans `src/` (roadmap : smoke + a11y sur 15 composants core).
- **E2E** : `e2e/visual-a11y.spec.ts` Playwright — **stale** (story IDs obsoletes `primitives-*`, a reecrire pour `ui-*`).

## Refs

- Base reference : `base DS/` (Figma Make export fig, fige, derivation source)
- Storybook local : http://localhost:6006/ (apres `npm run storybook`)
- Preview standalone : http://localhost:6007/ (apres `npm run preview:ds`)
- Spec wiki : `wiki/domains/design/concepts/design-system-components.md`
- Audit v2 : `docs/audits/2026-04-16-mega-audit-v2/raw/agent-6-modules-ds.md`
