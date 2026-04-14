# Radius — Foundation OS DS

> Coins doux, jamais carres. Jamais surdimensionnes.

## Echelle

| Token | Valeur | Usage |
|-------|--------|-------|
| `--ds-radius-sm` | 6px | Badge, input, boutons petits |
| `--ds-radius-md` | 10px | Bouton standard, toggle |
| `--ds-radius-lg` | 14px | Card, panel |
| `--ds-radius-xl` | 20px | Modal, sheet |
| `--ds-radius-full` | 9999px | Avatar, pill |

## Regles

- **Aucun coin a `0`** en dehors de primitives de grille interne.
- **Consistance de famille** : dans un meme composite, les enfants ont un radius ≤ parent.
- **Radius = echelle visuelle** : petits elements = `sm`, grandes surfaces = `lg/xl`.

## Do

- Utiliser `--ds-radius-md` par defaut pour les boutons.
- `--ds-radius-full` uniquement pour formes circulaires ou pills explicites.
- Combiner avec `--ds-shadow-*` pour creer la sensation de verre.

## Don't

- Arrondir tout a `full` "par style" — casse la lisibilite des cards.
- Utiliser `0` pour coller des elements : preferer `gap: 0` sur le parent.
- Melanger `sm` et `xl` dans un meme groupe visuel.

## Voir aussi

- `modules/design-system/tokens/source/primitives/radius.json`
