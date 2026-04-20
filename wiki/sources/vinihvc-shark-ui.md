---
type: source
title: "Shark UI (Vinicius Vicentini)"
source_type: repo
author: "Vinicius Vicentini (@vinihvc)"
date_published: 2026-04-19
url: "https://shark.vini.one"
repo: "https://github.com/vinihvc/shark-ui"
confidence: high
fos_compat: low
effort_estime: L
decision: defer
key_claims:
  - "110+ composants UI accessibles"
  - "Multi-framework : React, Vue, Svelte, Solid"
  - "Base sur Ark UI (pas Radix) + Tailwind + tailwind-variants"
  - "Distribution CLI/registry/copy-paste a la shadcn/ui"
  - "MIT license, open-source"
  - "Maintainer solo (Vinicius Vicentini)"
  - "132 commits visibles, projet actif"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - shadcn
  - ui-library
  - multi-framework
  - ark-ui
  - open-source
status: seed
related:
  - "[[index-sources]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
  - "[[Foundation OS]]"
  - "[[Vinicius Vicentini]]"
  - "[[Ark UI]]"
  - "[[Tailwind CSS]]"
  - "[[shadcn|shadcn/ui]]"
  - "[[Radix UI]]"
sources: []
---

# Shark UI (Vinicius Vicentini)

## Summary

Shark UI est une bibliotheque open-source de 110+ composants UI accessibles, positionnee comme "alternative shadcn/ui multi-framework" (React + Vue + Svelte + Solid). Construite par Vinicius Vicentini (vinihvc), developpeur solo. Base technique : **Ark UI** (primitive headless, different de Radix) + **Tailwind CSS** + **tailwind-variants**. Distribution : CLI + registry + copy-paste (meme DX que shadcn/ui). Licence MIT. Projet actif avec 132 commits.

Positionnement : combler le gap "shadcn-like" pour les stacks non-React (Vue/Svelte/Solid) tout en offrant une alternative React avec Ark UI.

## Key Claims

- 110+ composants UI
- Multi-framework natif (React, Vue, Svelte, Solid)
- Ark UI comme headless primitives (plutot que Radix)
- Tailwind + tailwind-variants pour styling
- CSS variables standards (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--success`, `--info`, `--warning`)
- DX identique shadcn (CLI, registry, copy-paste)
- Dark mode toggle visible dans la demo site
- Mention "7-day trial" sur le site (mais MIT GitHub — ambiguite sur modele futur)
- 76.4% TypeScript + 20.9% MDX

## Entities Mentioned

- **[[Vinicius Vicentini]]** (@vinihvc) — maintainer solo, developpeur bresilien
- **[[Ark UI]]** — framework headless accessibility/behavior (alternative a [[Radix UI]])
- **[[Tailwind CSS]]** — styling
- `tailwind-variants` — utility pour variantes composants (pas de page dediee)
- **[[shadcn|shadcn/ui]]** — pattern source (CLI/registry/copy-paste)

## Concepts Introduced

- **Multi-framework shadcn-like library** — pattern etendu a Vue/Svelte/Solid
- **Ark UI vs Radix tradeoff** — choix primitive engine

## Foundation OS Analysis

### Compat OS

**Low**. FOS = React 19 + Tailwind 4 + primitives Radix (shadcn origin). Shark UI = Ark UI (primitive engine different) + tokens shadcn standard (`--background`/`--foreground` etc. — FOS utilise `--ds-*` Void Glass). Le multi-framework est hors scope FOS (React only).

Porting d'un composant Shark vers FOS exige :
1. Swap Ark UI → Radix (reecriture primitive)
2. Re-theme tokens shadcn standard → tokens `--ds-*` Void Glass
3. Retrait light-mode (FOS dark-only)
4. Tests + Storybook story

### Effort integration

**L** (3-5h par composant si porting integral). Pour 10-20 composants specifiques, compte 40-100h. Non-justifie sauf si Shark a un composant unique non-trouvable ailleurs.

### Ce qui existe deja dans FOS

FOS couvre **46 ui composants** (base shadcn complete) : accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle, toggle-group, tooltip, etc. + 7 patterns dashboard.

**Gap FOS** : pas de tree, pas de data-table advanced (virtualization), pas de stepper, pas de marketing blocks (heroes, pricing tables, testimonials), pas de cascader.

Shark UI **pourrait** avoir des composants dans ces gaps mais confidence moyenne (j'ai pas audit le registry.json exhaustif).

### Limites Claude declarees

- **Fetch** : home page (shark.vini.one) + GitHub README. N'ai **pas** navigue `/docs/components/*` exhaustivement (trop de pages). N'ai **pas** lu `registry.json` qui listerait les 110+ composants precis.
- **Confidence liste composants** : medium (le chiffre "110+" est declare mais pas verifie fichier par fichier).
- **Pas teste** le code localement.
- **Ne connais pas** Ark UI en profondeur (training : familier avec Radix, moins avec Ark).

### Risques / pieges

1. **Solo maintainer** (1 personne) → risque abandonware si Vinicius drop. Pas de backing company.
2. **Ark UI** moins etabli que Radix → moins de community support si issues. Dependance technique moins safe.
3. **"7-day trial"** mention sur le site suggere un potentiel pivot commercial futur (actuellement MIT GitHub, mais ambiguite).
4. **Porting coûteux** : si Kevin porte 10 composants, c'est 40h+ qui auraient pu ecrire 10 composants from scratch sur Radix.
5. **Multi-framework inutile** pour FOS (React only).

### Verdict

**Defer / inspire**. Pas d'adoption directe recommandee.

**Usage propose** : **veille competitive** (checker Shark quand FOS a besoin d'un composant absent, pour **s'inspirer** du code — MIT permet copie propre avec attribution). Ne pas adopter comme dep/registry. Ne pas porter au-dela de 1-2 composants tres specifiques.

### Questions ouvertes

- Shark a-t-il un composant **tree** ? Un **data-table avance** (virtualization + filters + sorting) ? Un **stepper** ?
- La version React a-t-elle les 110+ composants, ou la lib est-elle asymetrique entre frameworks ?
- Ark UI vs Radix : benchmark accessibility/perf ? (hypothese : equivalent, mais Radix plus mainstream)
- Le site mentionne "7-day trial" — va-t-il passer payant futurement ?

## Raw Source

- Site : https://shark.vini.one
- GitHub : https://github.com/vinihvc/shark-ui
- Author : https://vini.one

## Notes

Referrable comme exemple de **multi-framework shadcn-like** dans toute analyse comparative future. Pattern interessant en tant que concept (un seul wiki de composants pour plusieurs frameworks), mais adoption directe non justifiee pour FOS.
