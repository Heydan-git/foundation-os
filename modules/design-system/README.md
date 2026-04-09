# @foundation-os/design-system

Design System package for Foundation OS — Void Glass tokens (DTCG W3C) + primitives atomiques.

## Status actuel

**DS-1** — Scaffold module + tokens DTCG + Style Dictionary build.

Primitives (Button, Text, Icon, Input, Card) et Storybook arrivent a partir de DS-2.

## Scripts

```bash
npm run build:tokens    # Genere tokens/build/ (CSS + JS + JSON)
npm run check:contrast  # Verifie ratios WCAG AA sur les paires fond/texte
npm run build           # Alias de build:tokens (extensible DS-3+)
```

## Structure

```
tokens/
  source/              # DTCG JSON source de verite (color, typography, spacing, radius, elevation, motion)
  build/               # Outputs generes (gitignored, recalcules par build:tokens)
scripts/
  build-tokens.mjs     # Style Dictionary 4 runner
  check-contrast.mjs   # Validation AA
README.md              # Ce fichier
package.json           # Workspace member @foundation-os/design-system
```

## Principes

- **Zero SaaS** : pas de Chromatic, pas de Supernova, pas d'externe. Tout en local/CI GitHub Actions.
- **DTCG W3C format** : tokens/source/*.json suivent la spec Community Group. Compatible Figma export natif + Penpot + tout outil DTCG-compliant.
- **CSS Modules** pour les primitives (DS-3+) — decouple du Tailwind de `modules/app`, portable vers futurs modules.
- **Void Glass inviolable** : fond #06070C, accent #5EEAD4, Figtree + JetBrains Mono. Toute violation = PR rejete.

## Consommation par modules/app (DS-6)

A terme, `modules/app/src/main.tsx` importera :

```ts
import '@foundation-os/design-system/tokens.css'
```

Les primitives seront consommees via imports nommes depuis `@foundation-os/design-system`.

## Refs

- Spec DS bootstrap : `docs/travaux-cowork/2026-04-08-design-system-bootstrap/01-spec.md`
- Plan 6 sessions : `docs/travaux-cowork/2026-04-08-design-system-bootstrap/02-plan.md`
- Design System Void Glass source : `docs/design-system.md`
