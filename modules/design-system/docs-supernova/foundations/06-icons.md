# Icons — Foundation OS DS

> Librairie unique : Lucide. Style filaire, stroke-width constant, alignement pixel.

## Regles

- **Librairie unique** : `lucide-react`. Pas de mix avec Heroicons, Phosphor, etc.
- **Tailles canoniques** : 14 / 16 / 20 / 24 px. Jamais d'icone en 13 ou 18.
- **`stroke-width: 1.75`** par defaut. `2` pour les boutons pleins (meilleure presence).
- **`currentColor`** : une icone herite toujours du texte environnant.

## Tailles

| Contexte | Taille |
|----------|--------|
| Texte inline | 14px |
| Bouton compact, input | 16px |
| Bouton standard, nav | 20px |
| Bouton icon-only, header | 24px |

## Do

- Associer toujours un `aria-label` aux icones sans texte visible.
- Utiliser l'icone a gauche du texte, sauf convention inverse explicite (fleche "next").
- Centrer l'icone avec `display: inline-flex; align-items: center`.

## Don't

- Colorer une icone en aplat : elle doit etre lisible sur le fond, pas un accent decoratif.
- Utiliser deux icones dans un meme bouton (trop charge).
- Redimensionner avec `transform: scale` — modifier la prop `size` de `Lucide`.

## Voir aussi

- https://lucide.dev
- `modules/design-system/src/components/ui/` (composants qui exposent un slot icone)
