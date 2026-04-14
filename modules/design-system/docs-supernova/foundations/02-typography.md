# Typography — Foundation OS DS

> Deux familles : Figtree (UI) + JetBrains Mono (code). Rien d'autre.

## Familles

| Role | Police | Fallback |
|------|--------|----------|
| UI (texte, titres, boutons) | **Figtree** | `-apple-system, BlinkMacSystemFont, sans-serif` |
| Code, ID, valeurs techniques | **JetBrains Mono** | `ui-monospace, SFMono-Regular, monospace` |

Interdits : Inter, Outfit, `system-ui` seul (OK en fallback CSS uniquement).

## Echelle semantique

| Token | Taille | Line-height | Usage |
|-------|--------|-------------|-------|
| `--ds-text-display` | 32px / 2rem | 1.2 | Titre de page |
| `--ds-text-heading-1` | 24px | 1.3 | Section majeure |
| `--ds-text-heading-2` | 20px | 1.35 | Sous-section |
| `--ds-text-body-lg` | 16px | 1.5 | Texte lead |
| `--ds-text-body` | 14px | 1.5 | Texte courant |
| `--ds-text-body-sm` | 13px | 1.5 | Aide, legende |
| `--ds-text-caption` | 12px | 1.4 | Label, badge |
| `--ds-text-code` | 13px | 1.5 | Code inline + bloc |

## Poids

- `400` — corps de texte
- `500` — emphase, labels
- `600` — titres, boutons primaires
- `700` — display uniquement

Jamais de `300` ni `800+` : trop fragiles ou trop lourds sur fond sombre.

## Do

- Un seul poids par hierarchie (display 700, heading 600, body 400).
- `letter-spacing: -0.01em` sur les tailles ≥ 20px, `0` sinon.
- Chiffres en tabulaire (`font-variant-numeric: tabular-nums`) pour les tableaux et metriques.

## Don't

- Melanger plus de deux tailles dans un meme bloc.
- Utiliser `font-style: italic` avec JetBrains Mono (faible lisibilite sur fond sombre).
- Importer une police tierce "pour l'esthetique" — Figtree + JBMono couvrent tout.

## Voir aussi

- `modules/design-system/tokens/source/primitives/typography.json`
- `modules/design-system/tokens/source/semantic/typography.json`
