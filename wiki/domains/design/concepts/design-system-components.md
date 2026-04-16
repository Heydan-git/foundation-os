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
updated: 2026-04-16
tags:
  - concept
  - design-system
  - components
  - void-glass
status: mature
confidence: high
related:
  - "[[foundation-os-map]]"
  - "[[tools-foundation-os]]"
  - "[[CHANGELOG|CHANGELOG DS]]"
sources: []
---

# Design System Foundation OS — Composants + Foundations

> 46 composants UI iso base DS + 6 foundations. Dark-only Void Glass (#030303).
> Storybook : 62 stories (53 DS + 9 app). Build-storybook 5.87s.
> Docs auto-generees : `modules/design-system/docs-supernova/`

## Foundations (6)

- [[01-colors]] — Tokens couleurs Void Glass (ds-surface-0 #030303, ds-accent, ds-muted, etc.)
- [[02-typography]] — Figtree UI + JetBrains Mono code
- [[03-spacing]] — Tokens spacing DTCG
- [[04-radius]] — Tokens radius DTCG
- [[05-motion]] — Tokens motion/transitions
- [[06-icons]] — Iconographie Foundation OS

## Composants UI (46)

### Formulaires

- [[01-button]] — Button (primary, secondary, ghost, link, destructive, outline)
- [[02-input]] — Input text
- [[03-textarea]] — Textarea
- [[04-label]] — Label
- [[05-checkbox]] — Checkbox
- [[06-switch]] — Switch toggle
- [[07-toggle]] — Toggle button
- [[08-toggle-group]] — Toggle group
- [[09-radio-group]] — Radio group
- [[10-select]] — Select dropdown
- [[11-slider]] — Slider range
- [[12-input-otp]] — Input OTP (code verification)
- [[13-form]] — Form wrapper (validation)

### Feedback

- [[14-alert]] — Alert message
- [[15-alert-dialog]] — Alert dialog modal
- [[22-sonner]] — Toast notifications (Sonner)
- [[31-progress]] — Progress bar
- [[32-skeleton]] — Skeleton loading

### Overlays

- [[16-dialog]] — Dialog modal
- [[17-drawer]] — Drawer (panneau lateral)
- [[18-sheet]] — Sheet (overlay)
- [[19-popover]] — Popover
- [[20-tooltip]] — Tooltip
- [[21-hover-card]] — Hover card

### Layout

- [[23-card]] — Card container
- [[24-accordion]] — Accordion
- [[25-collapsible]] — Collapsible section
- [[26-tabs]] — Tabs navigation
- [[27-separator]] — Separator line
- [[28-aspect-ratio]] — Aspect ratio container
- [[29-scroll-area]] — Scroll area custom
- [[30-resizable]] — Resizable panels

### Navigation

- [[33-breadcrumb]] — Breadcrumb trail
- [[34-command]] — Command palette (cmdk)
- [[35-context-menu]] — Context menu (clic droit)
- [[36-dropdown-menu]] — Dropdown menu
- [[37-menubar]] — Menu bar
- [[38-navigation-menu]] — Navigation menu
- [[39-pagination]] — Pagination
- [[40-sidebar]] — Sidebar navigation

### Data Display

- [[41-avatar]] — Avatar user
- [[42-badge]] — Badge label
- [[43-table]] — Table data
- [[44-calendar]] — Calendar picker
- [[45-chart]] — Chart visualization
- [[46-carousel]] — Carousel slider

## Specs techniques

- **Stack** : React 19 + TypeScript + Tailwind 4
- **Tokens** : DTCG format, prefixe `ds-*` (zero legacy)
- **Theme** : Dark-only Void Glass (#030303 ds-surface-0)
- **Fonts** : Figtree (UI) + JetBrains Mono (code)
- **Storybook** : 62 stories total (53 DS + 9 app)
- **Build** : build-storybook 5.87s

## Documentation module

- [[modules/design-system/README|README Design System]] — Description module, setup, scripts
- [[modules/design-system/CHANGELOG|CHANGELOG Design System]] — Historique versions + breaking changes

## Connexions

- [[tools-foundation-os]] — toolchain DS (Supernova SDK sync)
- [[foundation-os-map]] — carte complete projet
