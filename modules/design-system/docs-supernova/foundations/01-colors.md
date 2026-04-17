# Colors — Foundation OS DS

> Palette Void Glass — dark-only, verre glassmorphique, profondeur par transparence.

## Philosophie

Le Void Glass est un systeme dark-only construit autour de quatre surfaces empilees (`ds-surface-0` a `ds-surface-3`) et d'accents mesures (bleu, violet, vert, ambre, rouge). Aucune variante claire : la clarte vient de la typographie et de l'espacement, pas du fond.

## Tokens primitifs

| Token | Hex | Role |
|-------|-----|------|
| `--ds-surface-0` | `#030303` | Fond racine de l'app |
| `--ds-surface-1` | `#0d0d0f` | Sidebar, card de base |
| `--ds-surface-2` | `#17171a` | Elevation 1 (panel, modal) |
| `--ds-surface-3` | `#222225` | Elevation 2 (hover, focus) |
| `--ds-blue` | `#60a5fa` | Accent primaire, liens, CTA |
| `--ds-purple` | `#c084fc` | Accent secondaire, highlights |
| `--ds-green` | `#4ade80` | Success, etat positif |
| `--ds-amber` | `#fbbf24` | Warning, avertissement |
| `--ds-red` | `#f87171` | Error, destructive |

## Regles

- **Contraste AA minimum** : tout texte sur `surface-0` doit passer WCAG AA (4.5:1).
- **Pas d'accent sature en aplat** : les accents sont des traits, des icones, des etats — jamais des fonds larges.
- **Glow orbs** : uniquement deux orbs radiaux (bleu + violet), 40% opacity max, toujours derriere le contenu.

## Do

- Utiliser les tokens semantiques (`--ds-text-primary`, `--ds-border-subtle`) dans le code applicatif.
- Empiler les surfaces pour signifier la profondeur (0 → 1 → 2 → 3).
- Reserver le rouge aux actions destructives verifiees.

## Don't

- **Interdit** : `#0A0A0B`, `#08080A`, `#06070C`. Utiliser `--ds-surface-0` = `#030303`.
- Ne jamais utiliser un accent en fond plein d'une card ou d'une section.
- Ne pas introduire une palette claire "au cas ou" — Void Glass est dark-only par design.

## Voir aussi

- Typography · Spacing · Radius · Motion · Icons
- Source : `modules/design-system/src/styles/tokens.css` (source unique, CSS vars --ds-*)
