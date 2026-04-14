# Checkbox

> Form · `checkbox` · Foundation OS DS

## Role

Case a cocher binaire ou indeterminee. Taille 16px, check icone Lucide, support controlled/uncontrolled.

## Import

```tsx
import { Checkbox } from '@foundation-os/design-system';
```

## Variants / Stories disponibles

- `Default`
- `With Label`
- `Checked`
- `Disabled`
- `Disabled Checked`
- `Error`

## Usage

Consulter le Storybook hebergé pour le rendu interactif :
https://storybook.supernova.io/design-systems/790241/alias/foundation-os-ds/index.html

## Do

- Respecter le pattern semantique (header/body/footer quand applicable).
- Utiliser les props de variants exposees plutot que des overrides CSS.
- Associer un label accessible (`aria-label` ou `<Label htmlFor>`) a tout controle sans texte visible.
- Tester au clavier : Tab, Shift+Tab, Enter/Space, Escape, ArrowKeys si pertinent.

## Don't

- Reimplementer un composant equivalent avec du Tailwind brut — enrichir celui-ci.
- Detourner le composant vers un usage hors-perimetre (ex: utiliser Tooltip comme Popover interactif).
- Remplacer une icone Lucide par une autre librairie iconographique.

## Code

Source : `modules/design-system/src/components/ui/checkbox.tsx`
Stories : `modules/design-system/src/components/ui/checkbox.stories.tsx`

## Voir aussi

- Foundations · Colors · Typography · Spacing · Radius · Motion · Icons
