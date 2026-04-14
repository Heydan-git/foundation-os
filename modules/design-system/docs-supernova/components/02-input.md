# Input

> Form · `input` · Foundation OS DS

## Role

Champ texte simple. Types text/email/password/number/search. Etats focus/disabled/invalid geres via aria-invalid.

## Import

```tsx
import { Input } from '@foundation-os/design-system';
```

## Variants / Stories disponibles

- `Default`
- `With Label`
- `Disabled`
- `With Value`
- `File`
- `Error`
- `With Icon`

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

Source : `modules/design-system/src/components/ui/input.tsx`
Stories : `modules/design-system/src/components/ui/input.stories.tsx`

## Voir aussi

- Foundations · Colors · Typography · Spacing · Radius · Motion · Icons
