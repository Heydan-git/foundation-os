# Spacing — Foundation OS DS

> Grille 4px. Rythme constant. Densite en tension controlee.

## Echelle

| Token | Valeur | Usage typique |
|-------|--------|---------------|
| `--ds-space-0` | 0 | Reset |
| `--ds-space-1` | 4px | Gap icone/texte |
| `--ds-space-2` | 8px | Padding inline dense |
| `--ds-space-3` | 12px | Gap entre champs |
| `--ds-space-4` | 16px | Padding card, gap section |
| `--ds-space-5` | 20px | Padding modal |
| `--ds-space-6` | 24px | Espace section |
| `--ds-space-8` | 32px | Espace bloc majeur |
| `--ds-space-10` | 40px | Respirations de page |
| `--ds-space-12` | 48px | Header, hero |

## Regles

- **Multiples de 4px uniquement**. Pas de 5, 7, 11.
- **Inside ≤ outside** : le padding interieur d'un composant est inferieur ou egal a l'espace qui le separe des voisins.
- **Gap > margin** : preferer `gap` (flex/grid) aux marges externes, sauf exceptions documentees.

## Do

- Utiliser `--ds-space-*` dans tous les composants, pas de valeurs litterales.
- Construire les layouts par empilement de boites avec `gap`.
- Laisser respirer au-dessus d'une titre : `--ds-space-8` entre sections.

## Don't

- Inventer des valeurs intermediaires (`padding: 14px`) pour "compenser" un defaut de design.
- Coller deux cards sans gap — toujours au moins `--ds-space-4`.
- Retirer les marges internes pour gagner de la place : re-scoper le contenu a la place.

## Voir aussi

- `modules/design-system/tokens/source/primitives/spacing.json`
