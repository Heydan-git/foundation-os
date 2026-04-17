# modules/design-system/preview/ — Archive 2026-04-17

## Contexte

App Vite standalone qui rendait `DashboardDesignSystem.tsx` sur port 6007. Contenait une copie EXACTE de `base DS/src/app/components/` (duplica 100%, verifie par `diff -q`).

## Motifs de l'archive

1. **Duplica 100%** : `preview/app/components/DashboardDesignSystem.tsx` (1788L) = identique a `src/components/patterns/DashboardDesignSystem.tsx` = identique a `base DS/src/app/components/DashboardDesignSystem.tsx`. 3 copies du meme fichier pour rien.
2. **Storybook suffit** : la story `src/components/patterns/Patterns.stories.tsx` rend DashboardDesignSystem via Storybook port 6006 — mode preview standalone redondant.
3. **Script package.json `preview:ds` retire** : plus d'entrypoint Vite pour ce dossier.

## Contenu

- `preview/index.html`, `main.tsx`, `vite.config.ts`
- `preview/app/App.tsx`, `routes.tsx`
- `preview/app/components/` : 7 Dashboard + `figma/ImageWithFallback.tsx` (duplica base DS/)

## Refs audit v2

- `docs/audits/2026-04-16-mega-audit-v2/raw/agent-6-modules-ds.md` F-09 (duplica 3x DashboardDesignSystem), obsolescence preview/

## Restauration (si besoin)

```bash
mv .archive/ds-preview-260417/preview modules/design-system/preview
# Re-ajouter dans modules/design-system/package.json :
# "preview:ds": "vite --config preview/vite.config.ts"
```
