# Changelog

All notable changes to the Foundation OS Design System.

## [Unreleased] - 2026-04-17

### Changed
- Narrative alignee : "46 shadcn/ui iso base DS" → "46 composants derives `base DS/src.zip` puis retravailles pour matcher template visuel DashboardDesignSystem (Void Glass fork)". 46/46 divergent de base DS (forks legitimes avec variants custom).
- Storybook 8 → 9 : package.json devDependencies sur 9.1.20 depuis 2026-04-13, README + .storybook + CHANGELOG mis a jour en narrative v9.
- `package.json` refonte : exports `./tokens.*` retires (tokens/ inexistant), `build` no-op (DS consomme directement `src/styles/tokens.css`), scripts `build:tokens` + `check:contrast` archives vers `.archive/ds-tokens-scripts-260417/`.

### Known issues
- 0 tests unitaires `.test.tsx` dans `src/` (claim historique "23/23 tests DS" etait faux).
- 5 tests e2e Playwright `e2e/visual-a11y.spec.ts` stale (story IDs `primitives-*` obsoletes, composants Text/Icon n'existent plus — a reecrire en `ui-button--default`, etc.).

## [0.0.1] - 2026-04-13

### Added
- 46 composants UI derives `base DS/src.zip` (Figma Make, archivee 2026-04-17 dans `.archive/ds-reference-base-260417/`) puis retravailles pour matcher template visuel DashboardDesignSystem (Void Glass fork — Button 9 variants custom, Card avec glow, Badge avec live pulse, etc.).
- 7 patterns Dashboard (src/components/patterns/)
- Tokens CSS directs dans `src/styles/tokens.css` (variables `--ds-*`) — **pas** de pipeline Style Dictionary DTCG.
- Storybook 9.1.20 preview (port 6006)
- Figma Make preview standalone (port 6007, duplica `base DS/`)
- Biome linter avec Tailwind CSS support

### Changed
- Prefix `--fos-*` retire — output uses `--ds-*`
- App migrated to tokens DS via `@foundation-os/design-system/styles.css`
- Dark-only mode (Void Glass)

### Removed
- Old turquoise DS (`#5EEAD4`, 5 hand-crafted primitives)
- Legacy `--fos-color-*` bridge
