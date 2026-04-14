---
id: 2026-04-14-ds-audit-etats
plan_parent: 2026-04-13-ds-showcase-tooling-sync
bloc: 8
date: 2026-04-14
---

# Audit etats Storybook DS + App (Bloc 8)

## Methode

Pour chaque fichier `.stories.tsx` :
1. Lister les exports `export const XXX: Story`
2. Identifier la presence de ces etats via noms d'exports ET args/render :
   - **variants** : variant=X, render multi-composants (Destructive, Outline, AllVariants)
   - **sizes** : size=sm|lg|icon, Small/Large/AllSizes
   - **disabled** : disabled=true, Disabled
   - **loading** : loading=true, spinner, Skeleton
   - **error** : error=true, destructive, invalid, Error state
   - **empty** : zero items, placeholder, Empty state
   - **active/selected** : active=true, selected=true, aria-current, isActive
   - **hover/focus** : play fn, pseudo-state addon, story dediee

Notation : `[x]`=present, `[ ]`=absent, `[-]`=non-applicable.

## Couverture par composant (46 DS)

| # | Composant | Stories | Variants | Sizes | Disabled | Loading | Error | Empty | Active | Hover/Focus |
|---|-----------|---------|----------|-------|----------|---------|-------|-------|--------|-------------|
| 1 | Button | 10 | [x] | [x] | [x] | [ ] | [-] | [-] | [-] | [ ] |
| 2 | Badge | 5 | [x] | [ ] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 3 | Alert | 2 | [x] | [-] | [-] | [-] | [x] | [-] | [-] | [ ] |
| 4 | AlertDialog | 1 | [-] | [-] | [-] | [-] | [x] | [-] | [-] | [ ] |
| 5 | Accordion | 2 | [x] | [-] | [-] | [-] | [-] | [-] | [x] | [ ] |
| 6 | Avatar | 3 | [ ] | [x] | [-] | [-] | [ ] | [-] | [-] | [ ] |
| 7 | AspectRatio | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 8 | Breadcrumb | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 9 | Card | 3 | [ ] | [ ] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 10 | Carousel | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 11 | Chart | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 12 | Checkbox | 5 | [-] | [-] | [x] | [-] | [-] | [-] | [x] | [ ] |
| 13 | Collapsible | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [x] | [ ] |
| 14 | Command | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 15 | ContextMenu | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 16 | Dialog | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 17 | Drawer | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 18 | DropdownMenu | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 19 | Form | 1 | [-] | [-] | [-] | [-] | [ ] | [-] | [-] | [ ] |
| 20 | HoverCard | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [x] |
| 21 | Input | 5 | [ ] | [-] | [x] | [-] | [-] | [-] | [-] | [ ] |
| 22 | InputOTP | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 23 | Label | 3 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 24 | Menubar | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 25 | NavigationMenu | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 26 | Pagination | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [x] | [ ] |
| 27 | Popover | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [x] |
| 28 | Progress | 3 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 29 | RadioGroup | 2 | [-] | [-] | [x] | [-] | [-] | [-] | [x] | [ ] |
| 30 | Resizable | 2 | [-] | [ ] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 31 | ScrollArea | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 32 | Select | 4 | [-] | [-] | [x] | [-] | [-] | [-] | [-] | [ ] |
| 33 | Separator | 2 | [ ] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 34 | Sheet | 2 | [ ] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 35 | Sidebar | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [x] | [ ] |
| 36 | Skeleton | 3 | [-] | [ ] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 37 | Slider | 5 | [ ] | [ ] | [x] | [-] | [-] | [-] | [-] | [ ] |
| 38 | Sonner | 4 | [ ] | [-] | [-] | [-] | [x] | [-] | [-] | [ ] |
| 39 | Switch | 4 | [-] | [-] | [x] | [-] | [-] | [-] | [x] | [ ] |
| 40 | Table | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 41 | Tabs | 1 | [-] | [-] | [-] | [-] | [-] | [-] | [x] | [ ] |
| 42 | Textarea | 4 | [ ] | [-] | [x] | [-] | [-] | [-] | [-] | [ ] |
| 43 | Toggle | 7 | [x] | [x] | [x] | [-] | [-] | [-] | [-] | [ ] |
| 44 | ToggleGroup | 2 | [x] | [-] | [-] | [-] | [-] | [-] | [-] | [ ] |
| 45 | Tooltip | 2 | [-] | [-] | [-] | [-] | [-] | [-] | [-] | [x] |
| 46 | HoverCard | voir #20 | - | - | - | - | - | - | - | - |

## Taux de couverture global (46 composants DS)

| Etat | Couverts | Total applicable | % |
|------|----------|------------------|---|
| Variants | 10 | 46 | 22% |
| Sizes | 11 | 46 | 24% |
| Disabled | 13 | 46 | 28% |
| Loading | 1 | 46 | 2% |
| Error | 3 | 46 | 7% |
| Empty | 0 | 46 | 0% |
| Active/Selected | 8 | 46 | 17% |
| Hover/Focus | 4 | 46 | 9% |

**Couverture moyenne : 21%**

## Gaps prioritaires (Top 10)

1. **Empty states** (100% manquant) — Select, Table, Command, Pagination, Combobox, ListBox — state vide = experience critique
2. **Loading states** (98% manquant) — Form submit, Button async, Table, Dialog, Select — manque systematique
3. **Hover/Focus interactions** (91% manquant) — 42 composants sans play fn — besoin addon-interactions
4. **Error/validation states** (93% manquant) — Input, Textarea, Select, RadioGroup, Form — aria-invalid absent
5. **Variants manquants** — Avatar, Card, Separator, Sheet, Chart, Input, Badge (cas usage)
6. **Active/Selected** (83% manquant) — Button, Tabs, DropdownMenu, NavigationMenu items
7. **Sizes** (76% manquant) — 35 composants sans Small/Large (hormis Button, Badge, Toggle, Avatar, Skeleton, Slider)
8. **Disabled** — Input, Checkbox, Select, Slider, Switch, Textarea, Toggle couverts; reste manque
9. **Open/Close states** — Popover, HoverCard, Dialog, Drawer, Sheet — animation d'entree non montree
10. **Composition patterns** — zero story combinant 2+ composants (ex: Button+Input, Label+Select)

## Recommandations

1. **Prioriser 4 etats critiques** avant Supernova : Empty, Loading, Error, Disabled (ajoutent de la valeur documentaire)
2. **Play functions** pour hover/focus via `@storybook/addon-interactions` + `userEvent.hover` — decoratif ou sur 10 composants phares
3. **Stories de composition** : 1 par domaine (Form, Data Table, Dashboard) — montrer composites reels
4. **Addon pseudo-states** (optionnel) pour voir hover/focus au selecteur dans Storybook UI
5. **a11y stories** : aucune ne verifie ARIA dynamique — couverture a11y via vitest+axe (fait F8)
6. **Accepter 21% pour le DS actuel** : suffisant pour Supernova import, iteratif apres
7. **Stories App dashboard** (9 fichiers) deja couvrent les patterns app principaux → pas d'action necessaire cote app

## Decision (Kevin a valider)

**Option A** — Combler 4 etats critiques (Empty/Loading/Error/Disabled) AVANT Supernova. Effort : ~2h (bloc additionnel S3.0 avant S3 actuel).
**Option B** — Passer a Supernova (Blocs 9-10) avec couverture actuelle 21%. Rattraper les etats en iteratif apres import.
**Option C** — Skip audit, passer direct aux sync Asana/Notion (blocs 13-15) pour debloquer integration session-start/end.

Recommendation : **Option B** — import Supernova d'abord (le DS est deja assez mature pour etre documente), etats en iteratif. Eviter le perfectionnisme qui bloque la sortie.
