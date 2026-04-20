---
type: source
title: "Flowkit UI (vzkiss)"
source_type: repo
author: "vzkiss"
date_published: 2026-04-19
url: "https://flowkit-ui.vzkiss.com"
repo: "https://github.com/vzkiss/flowkit-ui"
confidence: medium
fos_compat: medium
effort_estime: S-M
decision: nogo-for-lib-inspire-pattern
key_claims:
  - "Composant unique visible : Creatable Combobox (multiselect + autocomplete + creatable)"
  - "Principe : 'components shadcn doesn't cover'"
  - "Base UI primitives (accessibility framework, different de Radix)"
  - "Tailwind CSS"
  - "MIT license"
  - "Next.js config detecte (next.config.mjs)"
  - "10 stars, 70 commits, 0 forks — projet tres jeune"
  - "Catalog 'is small today and will grow over time'"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - shadcn
  - base-ui
  - complement
  - early-stage
  - mit
status: seed
related:
  - "[[index-sources]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
  - "[[Foundation OS]]"
  - "[[vzkiss]]"
  - "[[Creatable Combobox]]"
  - "[[Shadcn-complement library]]"
  - "[[Base UI]]"
  - "[[shadcn|shadcn/ui]]"
sources: []
---

# Flowkit UI (vzkiss)

## Summary

Flowkit UI par vzkiss est une **bibliotheque naissante** positionnee comme "components shadcn doesn't cover". Actuellement **1 composant documente** : **Creatable Combobox** (multiselect + autocomplete + items creables a la volee — pattern utile pour forms dynamiques type tags, assignees, custom values). Construit sur **Base UI primitives** (framework accessibility different de Radix) + Tailwind. **10 stars**, 70 commits, 0 forks, 1 open issue — projet **tres early stage**. MIT license. Next.js config detecte.

Philosophy differentiante : "no second design system to learn" (conventions shadcn), "patterns teams rebuild on every project".

## Key Claims

- 1 composant documente (Creatable Combobox)
- "components shadcn doesn't cover" positioning
- Base UI primitives (vs Radix)
- Tailwind CSS
- MIT license
- Next.js detected (next.config.mjs)
- 87.7% TypeScript + 6.1% MDX + 4.9% CSS
- 70 commits
- 10 stars / 0 forks
- 1 open issue
- No releases published
- "Catalog is small today and will grow over time" (aveu early-stage explicite)

## Entities Mentioned

- **[[vzkiss]]** — maintainer solo
- **[[Base UI]]** — primitives framework (alternative a [[Radix UI]], par Material-UI team)
- **[[shadcn|shadcn/ui]]** — convention source
- **[[Tailwind CSS]]** — styling

## Concepts Introduced

- **[[Shadcn-complement library]]** — pattern "fill the gaps"
- **[[Creatable Combobox]]** — pattern form dynamique (multiselect + autocomplete + creatable)
- **[[Base UI]] primitives** — framework headless alternative a [[Radix UI]] (developpe par Material-UI team)

## Foundation OS Analysis

### Compat OS

**Medium**. Mismatch primitive : Base UI ≠ Radix (FOS utilise Radix via shadcn). Deux options :
- **Porting vers Radix** : reecrire le composant avec Radix equivalent (Popover + Command + Checkbox). Effort M.
- **Ajouter Base UI comme dep** : bloat pour 1 composant (Base UI = +500KB typique). Non-recommande.

Tailwind + shadcn conventions = compatible. Tokens CSS a re-theme `--ds-*`.

Next.js config dans le repo est transparent pour porting (fichier source React pur, `next.config.mjs` ne pollue pas).

### Effort integration

**S-M** (~1-2h) pour porter Creatable Combobox vers Radix. Process :
1. Lire le code Flowkit (Base UI implementation)
2. Reecrire en Radix + cmdk (pattern shadcn Combobox + creatable logic custom)
3. Re-theme `--ds-*`
4. Story Storybook avec exemples (tags, assignees)
5. Test manuel

### Ce qui existe deja dans FOS

- **command** (search palette classique via cmdk)
- **combobox** pas visible dans les 46 ui (shadcn/ui n'a pas de "combobox" standalone — c'est typiquement assemblage Popover + Command)
- **Creatable** pattern **absent** de FOS

Pattern utile pour : tags dynamiques, assignees libres, custom categories, tout form ou l'user peut taper une valeur non-preexistante.

### Limites Claude declarees

- **Pas lu le code** du Creatable Combobox (pas clone repo). Confidence "medium" sur le pattern, **"low" sur la qualite implementation**.
- **Base UI** : je connais l'existence (Material-UI team) mais pas les details API vs Radix.
- **Production-ready ?** : aveu explicite du maintainer "catalog is small today and will grow" = declaration early-stage. Pas production-grade claim.

### Risques / pieges

1. **Projet tres jeune** (10 stars, 0 forks, no releases) = **risque abandonware extremement eleve**. Solo maintainer (vzkiss) + pas de traction.
2. **Base UI dep differente** de Radix → bloat si juste 1 composant.
3. **1 composant ne justifie pas** d'adopter la lib entiere.
4. **API non stabilisee** : pas de releases = breaking changes possibles a chaque commit.
5. **0 forks** = signal fort que la lib n'est **pas utilisee en production** par d'autres.

### Verdict

**Nogo pour adoption lib**. **Inspire pour pattern** (Creatable Combobox).

**Strategie recommandee** :
- Si Kevin a besoin d'un Creatable Combobox pour FOS (tags, assignees, custom values) :
  1. **NE PAS adopter Flowkit** comme dep
  2. **Regarder le code source** (MIT, gratuit) pour comprendre le pattern
  3. **Reecrire from scratch** sur Radix + cmdk (align FOS stack)
  4. Effort : 2-4h pour un composant production-grade sous FOS
- Alternative : **shadcn/ui officiel Combobox** (existe-t-il ?) + logique creatable custom
- Alternative : **v0 generation** (prompt : "React combobox creatable multiselect shadcn Radix")

### Questions ouvertes

- Pattern Creatable Combobox utile pour quel besoin FOS concret ?
  - App Builder : tagger sections/pages custom ?
  - Phase 5 Trading : tagger paires personnalisees ?
  - Phase 5 Sante : symptomes custom ?
- Existe-t-il une version **shadcn/ui officielle** du pattern creatable ? (si oui, preferer ca)
- Base UI va-t-il gagner en adoption vs Radix dans les 12 prochains mois ? (trend a surveiller)
- vzkiss maintient-il un blog / Twitter / autres projets qui donneraient credibility ?

## Raw Source

- Site : https://flowkit-ui.vzkiss.com
- GitHub : https://github.com/vzkiss/flowkit-ui

## Notes

**Pattern a retenir** : **"components shadcn doesn't cover"** est un **positioning niche valide** (il y a des vrais gaps shadcn : cascader, tree, advanced data-table, creatable combobox). Plusieurs projets similaires existent (Shark UI, originui.com, etc.). Pas de monopole.

**Signal faible** : Base UI vs Radix debate — Base UI est porte par Material-UI team (MUI), donc potentiel long-terme reel. Mais actuellement, adoption marginal.
