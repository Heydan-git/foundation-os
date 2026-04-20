---
type: source
title: "Cascader ShadCN (Ademking)"
source_type: repo
author: "Ademking (@kouki__adem)"
date_published: 2026-04-19
url: "https://cascader-shadcn.surge.sh"
repo: "https://github.com/Ademking/cascader-shadcn"
confidence: medium
fos_compat: high
effort_estime: S
decision: defer-conditional-go
key_claims:
  - "Single component (cascader hierarchical dropdown)"
  - "React + TypeScript + shadcn ecosystem"
  - "76 stars GitHub"
  - "Derniere update Decembre 2025"
  - "MIT license (likely)"
  - "Use cases : country > region > city, category > subcategory"
  - "Alternative Vue 3 existe (Hanggesimida/shadcn-vue-cascader, 0 stars)"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - component
  - cascader
  - single
  - hierarchical
  - shadcn
  - mit
status: seed
related:
  - "[[index-sources]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
  - "[[Foundation OS]]"
  - "[[Ademking]]"
  - "[[Cascader pattern]]"
  - "[[Shadcn-complement library]]"
  - "[[shadcn|shadcn/ui]]"
  - "[[Radix UI]]"
sources: []
---

# Cascader ShadCN (Ademking)

## Summary

Cascader-ShadCN par Ademking (@kouki__adem) est un **composant unique** implementant le **pattern cascader** : un dropdown hierarchical multi-niveau (par ex. selectionner Pays → Region → Ville, ou Categorie → Sous-categorie → Item). Construit pour l'ecosysteme shadcn : React + TypeScript. **76 stars GitHub**, derniere update **Decembre 2025**. Demo deploye sur surge.sh. Alternative Vue 3 : `shadcn-vue-cascader` par Hanggesimida (0 stars, peu adopte).

Le cascader est un pattern **absent de shadcn/ui officiel** — il n'y a pas de composant natif pour les selects hierarchical multi-niveau. Le composant natif le plus proche est Combobox (flat) ou Command (search palette).

## Key Claims

- Composant unique : cascader hierarchical dropdown
- React + TypeScript
- Base : shadcn-ui ecosystem (Radix + Tailwind probable)
- 76 stars GitHub
- Derniere activite : Dec 2025
- MIT license (standard pour shadcn components, a verifier)
- Cas d'usage typiques : location pickers (country > region > city), category pickers
- Alternative Vue 3 existe mais peu maintenue

## Entities Mentioned

- **[[Ademking]]** (@kouki__adem) — maintainer
- `Hanggesimida` — auteur du port Vue 3 (mention, pas page dediee)
- **[[shadcn|shadcn/ui]]** — ecosysteme base
- **[[Radix UI]]** (Popover + cmdk probable comme primitives) + **[[Tailwind CSS]]**
- `Surge.sh` — hosting demo (tool, pas page dediee)

## Concepts Introduced

- **[[Cascader pattern]]** — hierarchical select multi-niveau
- **[[Shadcn-complement library]]** — pattern du "1 composant + registry" comblant un gap shadcn officiel

## Foundation OS Analysis

### Compat OS

**High**. Composant unique shadcn-standard. React + TS. Copy-paste + re-theme `--ds-*` trivial. Aucun impact architectural.

Probablement base sur Radix (a verifier en clonant) : Popover + Command + Button. Dependencies attendues : `@radix-ui/react-popover`, `cmdk` (pour recherche), `class-variance-authority`. Tout ca est deja dans FOS (les 46 ui en utilisent).

### Effort integration

**S** (~30min-1h). Process :
1. Clone repo + lire le .tsx du composant
2. Copy dans le dossier `modules/design-system/src/components/ui/` sous le nom cascader.tsx
3. Re-theme tokens `--background` → `--ds-bg-*` etc.
4. Retrait light mode
5. Story Storybook avec 2-3 exemples (country picker, category picker)
6. Test manuel

### Ce qui existe deja dans FOS

- **Command** (search palette via cmdk) — different use case
- **Select** (flat, single-level)
- **Dropdown-menu** (menu, pas form input)
- **Context-menu** — right-click menus

**Aucun cascader** dans FOS. Ce serait un nouveau composant net, pas un remplacement.

### Limites Claude declarees

- **Pas lu le code source precis** (pas clone repo). Je sais c'est un cascader + React + shadcn, mais **pas les details d'API** (props exacts, events, async loading support, integration react-hook-form).
- **License** : MIT likely mais **non verifiee** explicitement (je n'ai pas fetch LICENSE file).
- **Maintenance** : 76 stars + update Dec 2025 = stable mais petit.

### Risques / pieges

1. **Solo maintainer** (Ademking) → bus factor. Si Ademking drop, pas d'updates/fixes.
2. **76 stars** = petit community support. Issues potentiellement non-repondus.
3. **Pattern niche** : si Kevin n'a **pas de cas d'usage hierarchical**, c'est **code mort**. Pas adopter prophylactiquement.
4. **API non-standard shadcn** possible — le cascader n'est pas dans la spec officielle shadcn, donc l'API est choisie par Ademking (pas de garantie de stabilite).
5. **Integration react-hook-form** non-garantie. A verifier (critical pour FOS qui utilise react-hook-form).

### Verdict

**Defer / conditional go**. **Adoption tres facile** mais **conditionnel a un besoin concret** :

**Cas d'usage FOS potentiels** :
- **Phase 5 Trading** : selectionner paire > timeframe > strategy (cascade 3 niveaux)
- **Phase 5 Sante** : specialite > symptome > protocole
- **Phase 5 Finance** : compte > sous-compte > categorie transaction
- **App Builder** : projet > page > section (navigation)

Si **un seul** de ces cas se materialise : **GO**, adoption 1h.

Si **aucun** cas concret dans les 3 prochains mois : **skip**, re-evaluer plus tard (le composant restera disponible MIT).

### Questions ouvertes

- Quel cas d'usage concret Kevin verra-t-il pour un cascader ? (lister maintenant, eviter decision prematuree)
- API du composant : compatible react-hook-form + zod ?
- Support async loading (fetch niveaux a la demande, utile pour grosses hierarchies type categories e-commerce) ?
- Les alternatives : **writable a la main** en ~2h si le cascader d'Ademking ne suffit pas ? (via Popover + nested Commands)
- License LICENSE file exacte (MIT ? Apache ? autre ?)

## Raw Source

- Demo : https://cascader-shadcn.surge.sh
- GitHub : https://github.com/Ademking/cascader-shadcn
- Vue 3 port : https://github.com/Hanggesimida/shadcn-vue-cascader

## Notes

**Pattern a retenir** : **single-component repos** (1 composant specifique + demo Surge) est un format legere pour combler les gaps shadcn. Reutilisable pour FOS : si Kevin veut partager un composant custom FOS, ce pattern est leger + MIT-friendly.

**Gap officiel shadcn** : le cascader est reclamed regulierement dans les issues shadcn/ui (GitHub). Plusieurs ports communautaires existent — Ademking est le plus populaire (76 stars).
