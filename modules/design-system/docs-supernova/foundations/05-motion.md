# Motion — Foundation OS DS

> Rapide, lisible, jamais decoratif. Si on ne remarque pas l'animation, elle est bien faite.

## Tokens

| Token | Valeur | Usage |
|-------|--------|-------|
| `--ds-duration-fast` | 120ms | Hover, focus, toggle |
| `--ds-duration-base` | 200ms | Apparition, transition d'etat |
| `--ds-duration-slow` | 320ms | Modal, sheet, transitions de route |
| `--ds-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Entree |
| `--ds-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Sortie |
| `--ds-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Rebond leger (toast, pill) |

## Regles

- **Sub-300ms par defaut**. Au dela, l'interaction semble bloquee.
- **Easing asymetrique** : entree plus rapide que sortie.
- **`prefers-reduced-motion`** : fallback `transition: none` systematique.

## Do

- Animer `transform` et `opacity`. Tout le reste est couteux.
- Declencher l'animation a l'action, pas au chargement.
- Utiliser le spring pour les micro-recompenses (toast success).

## Don't

- Animer `width`, `height`, `top`, `left`. Utiliser `transform: scale/translate`.
- Ajouter une animation par defaut a tous les hovers — ne bouger que ce qui doit bouger.
- Duree > 500ms pour une transition UI — c'est une cinematique, pas une UI.

## Voir aussi

- `modules/design-system/tokens/source/primitives/motion.json`
