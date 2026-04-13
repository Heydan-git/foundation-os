# Changelog

All notable changes to the Foundation OS Design System.

## [0.0.1] - 2026-04-13

### Added
- 46 shadcn/ui components (from Figma Make `base DS/src.zip`)
- DTCG tokens: 3 layers (primitives, semantic, bridge)
- Style Dictionary build pipeline (`scripts/build-tokens.mjs`)
- Storybook 8.6 preview (port 6006)
- Figma Make iso preview (port 6007)
- Biome linter with Tailwind CSS support
- Smoke + a11y tests for 10 core components (vitest + jest-axe)
- Contrast checker (`scripts/check-contrast.mjs`)

### Changed
- Prefix `--fos-*` removed — output uses `--ds-*`, `--shadcn-*`, `--space-*`
- App migrated to semantic tokens (F4)
- Dark-only mode (Void Glass)

### Removed
- Old turquoise DS (`#5EEAD4`, 5 hand-crafted primitives)
- Legacy `--fos-color-*` bridge
