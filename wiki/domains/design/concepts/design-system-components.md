---
type: concept
title: "Design System — 46 Composants + 6 Foundations"
domain: design
complexity: advanced
aliases:
  - "DS Components"
  - "Void Glass Components"
  - "Foundation OS Design System"
created: 2026-04-16
updated: 2026-04-17
tags:
  - concept
  - design-system
  - components
  - void-glass
status: mature
confidence: high
related:
  - "[[index-concepts]]"
  - "[[foundation-os-map]]"
  - "[[tools-foundation-os]]"
sources: []
---

# Design System Foundation OS — Composants + Foundations

> 46 composants UI iso base DS + 6 foundations. Dark-only [[Void Glass]] (#030303).
> Storybook : 62 stories (53 DS + 9 app). Build-storybook 5.87s.
> Docs auto-generees : `modules/design-system/docs-supernova/`

> [!note] **Refs composants = paths module, pas wikilinks vault**
> Les composants UI et foundations sont documentes dans `modules/design-system/docs-supernova/` (genere par Supernova SDK). Les refs ci-dessous sont des **paths** (backticks), pas des wikilinks wiki. Raison : frontiere claire entre vault `wiki/` (knowledge atemporel) et module code + docs Supernova (derive du code).

## Foundations (6)

- `modules/design-system/docs-supernova/foundations/01-colors.md` — Tokens couleurs Void Glass (ds-surface-0 #030303, ds-accent, ds-muted, etc.)
- `modules/design-system/docs-supernova/foundations/02-typography.md` — Figtree UI + JetBrains Mono code
- `modules/design-system/docs-supernova/foundations/03-spacing.md` — Tokens spacing
- `modules/design-system/docs-supernova/foundations/04-radius.md` — Tokens radius
- `modules/design-system/docs-supernova/foundations/05-motion.md` — Tokens motion/transitions
- `modules/design-system/docs-supernova/foundations/06-icons.md` — Iconographie Foundation OS

## Composants UI (46)

### Formulaires

- `modules/design-system/docs-supernova/components/01-button.md` — Button (primary, secondary, ghost, link, destructive, outline)
- `modules/design-system/docs-supernova/components/02-input.md` — Input text
- `modules/design-system/docs-supernova/components/03-textarea.md` — Textarea
- `modules/design-system/docs-supernova/components/04-label.md` — Label
- `modules/design-system/docs-supernova/components/05-checkbox.md` — Checkbox
- `modules/design-system/docs-supernova/components/06-switch.md` — Switch toggle
- `modules/design-system/docs-supernova/components/07-toggle.md` — Toggle button
- `modules/design-system/docs-supernova/components/08-toggle-group.md` — Toggle group
- `modules/design-system/docs-supernova/components/09-radio-group.md` — Radio group
- `modules/design-system/docs-supernova/components/10-select.md` — Select dropdown
- `modules/design-system/docs-supernova/components/11-slider.md` — Slider range
- `modules/design-system/docs-supernova/components/12-input-otp.md` — Input OTP (code verification)
- `modules/design-system/docs-supernova/components/13-form.md` — Form wrapper (validation)

### Feedback

- `modules/design-system/docs-supernova/components/14-alert.md` — Alert message
- `modules/design-system/docs-supernova/components/15-alert-dialog.md` — Alert dialog modal
- `modules/design-system/docs-supernova/components/22-sonner.md` — Toast notifications (Sonner)
- `modules/design-system/docs-supernova/components/31-progress.md` — Progress bar
- `modules/design-system/docs-supernova/components/32-skeleton.md` — Skeleton loading

### Overlays

- `modules/design-system/docs-supernova/components/16-dialog.md` — Dialog modal
- `modules/design-system/docs-supernova/components/17-drawer.md` — Drawer (panneau lateral)
- `modules/design-system/docs-supernova/components/18-sheet.md` — Sheet (overlay)
- `modules/design-system/docs-supernova/components/19-popover.md` — Popover
- `modules/design-system/docs-supernova/components/20-tooltip.md` — Tooltip
- `modules/design-system/docs-supernova/components/21-hover-card.md` — Hover card

### Layout

- `modules/design-system/docs-supernova/components/23-card.md` — Card container
- `modules/design-system/docs-supernova/components/24-accordion.md` — Accordion
- `modules/design-system/docs-supernova/components/25-collapsible.md` — Collapsible section
- `modules/design-system/docs-supernova/components/26-tabs.md` — Tabs navigation
- `modules/design-system/docs-supernova/components/27-separator.md` — Separator line
- `modules/design-system/docs-supernova/components/28-aspect-ratio.md` — Aspect ratio container
- `modules/design-system/docs-supernova/components/29-scroll-area.md` — Scroll area custom
- `modules/design-system/docs-supernova/components/30-resizable.md` — Resizable panels

### Navigation

- `modules/design-system/docs-supernova/components/33-breadcrumb.md` — Breadcrumb trail
- `modules/design-system/docs-supernova/components/34-command.md` — Command palette (cmdk)
- `modules/design-system/docs-supernova/components/35-context-menu.md` — Context menu (clic droit)
- `modules/design-system/docs-supernova/components/36-dropdown-menu.md` — Dropdown menu
- `modules/design-system/docs-supernova/components/37-menubar.md` — Menu bar
- `modules/design-system/docs-supernova/components/38-navigation-menu.md` — Navigation menu
- `modules/design-system/docs-supernova/components/39-pagination.md` — Pagination
- `modules/design-system/docs-supernova/components/40-sidebar.md` — Sidebar navigation

### Data Display

- `modules/design-system/docs-supernova/components/41-avatar.md` — Avatar user
- `modules/design-system/docs-supernova/components/42-badge.md` — Badge label
- `modules/design-system/docs-supernova/components/43-table.md` — Table data
- `modules/design-system/docs-supernova/components/44-calendar.md` — Calendar picker
- `modules/design-system/docs-supernova/components/45-chart.md` — Chart visualization
- `modules/design-system/docs-supernova/components/46-carousel.md` — Carousel slider

## Specs techniques

- **Stack** : React 19 + TypeScript + Tailwind 4
- **Tokens** : CSS `--ds-*` source unique `modules/design-system/src/styles/tokens.css` (Void Glass fork, pas DTCG)
- **Theme** : Dark-only Void Glass (#030303 ds-surface-0)
- **Fonts** : Figtree (UI) + JetBrains Mono (code)
- **Storybook** : 62 stories total (53 DS + 9 app)
- **Build** : build-storybook 5.87s

## Documentation module

- `modules/design-system/README-design-system.md` — Description module, setup, scripts
- `modules/design-system/CHANGELOG.md` — Historique versions + breaking changes
- `modules/design-system/docs-supernova/README-supernova-docs.md` — Documentation auto-generee Supernova SDK

## Connexions

- [[tools-foundation-os]] — toolchain DS (Supernova SDK sync)
- [[foundation-os-map]] — carte complete projet
- [[Void Glass]] — theme dark-only #030303
