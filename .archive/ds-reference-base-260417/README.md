# modules/design-system/base DS/ — Archive 2026-04-17

## Contexte

Reference figee Figma Make (`base DS/src.zip`, 374KB) + code source export. Servait de reference visuelle pour reconstruire le DS Void Glass (Phase DS-rebuild 2026-04-13 a 04-15).

## Motifs de l'archive

1. **Reference figee** : `base DS/src.zip` est le snapshot original Figma Make, jamais modifie. Plus necessaire dans le module actif apres reconstruction DS DONE.
2. **Package Figma Make brut** : `base DS/package.json` declare `"name": "@figma/my-make-file"` avec deps @mui/material, canvas-confetti, react-dnd — n'a RIEN a voir avec Foundation OS.
3. **fonts.css VIDE** (0 ligne) : fichier bugge dans le package original, importe par `base DS/src/styles/index.css:1`.
4. **Divergence confirmee** : 46/46 composants UI actuels divergent du base DS original (Void Glass fork). `base DS/` n'est plus "iso" avec `src/`.

## Contenu

- `base DS/src.zip` (374KB) — snapshot original Figma Make
- `base DS/package.json` — package Figma Make brut
- `base DS/src/app/App.tsx`, `routes.tsx`
- `base DS/src/app/components/` : 7 Dashboard + ui/ (46 composants version originale) + figma/ImageWithFallback.tsx
- `base DS/src/styles/` : fonts.css (VIDE), index.css, tailwind.css, theme.css (292L source Void Glass originale)

## Refs audit v2

- `docs/audits/2026-04-16-mega-audit-v2/raw/agent-6-modules-ds.md` F-02 (46/46 divergent), F-20 (fonts.css vide), obsolescences base DS/

## Wiki refs

- Concept `wiki/domains/design/concepts/design-system-components.md` pointe vers cette archive
- Page canonique `wiki/concepts/Void Glass.md` mentionne la derivation

## Restauration (si besoin — non recommande)

```bash
mv ".archive/ds-reference-base-260417/base DS" "modules/design-system/base DS"
```

Attention : refs `tokens/source/` dans `base DS/` pointent aussi vers vide. La restauration requiert re-alignement avec l'etat DS actuel.
