---
type: concept
title: "Shadcn Block Libraries Landscape (Avril 2026)"
date: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - shadcn
  - ui-library
  - design-system
  - comparison
  - landscape
  - 2026-04
status: mature
related:
  - "[[index-concepts]]"
  - "[[index-sources]]"
  - "[[Foundation OS]]"
  - "[[Void Glass]]"
  - "[[vinihvc-shark-ui]]"
  - "[[stowdev-stow-build]]"
  - "[[nolly-studio-cult-ui-pro]]"
  - "[[hamish-oneill-shadcncraft]]"
  - "[[ademking-cascader-shadcn]]"
  - "[[vzkiss-flowkit-ui]]"
sources:
  - "[[vinihvc-shark-ui]]"
  - "[[stowdev-stow-build]]"
  - "[[nolly-studio-cult-ui-pro]]"
  - "[[hamish-oneill-shadcncraft]]"
  - "[[ademking-cascader-shadcn]]"
  - "[[vzkiss-flowkit-ui]]"
---

# Shadcn Block Libraries Landscape (Avril 2026)

## Context

Kevin a balance 6 bibliotheques shadcn/ui trouvees sur **shoogle.dev** (aggregateur). Ces libs representent une **snapshot Avril 2026** du paysage des produits etendant shadcn/ui. Analyse individuelle dans les pages [[index-sources]], synthese croisee ici.

Objectif de la synthese : eviter de re-evaluer individuellement chaque lib a chaque fois qu'une question sur "quelle lib shadcn adopter pour FOS ?" se pose. Cette page = reference persistante dans le wiki.

## Taxonomy

3 familles distinctes emergent :

### 1. Lib generique multi-framework open-source

| Nom | Caracteristiques |
|-----|------------------|
| [[vinihvc-shark-ui\|Shark UI]] | 110+ composants, MIT, Ark UI + Tailwind, multi-framework (React/Vue/Svelte/Solid), solo maintainer |

### 2. Marketplaces / paid products commerciaux

| Nom | Modele | Prix | Aligne FOS stack |
|-----|--------|------|------------------|
| [[stowdev-stow-build\|Stow Build]] | Marketplace token-based | $9/mois pour 100 tokens (~$2/bloc) | Multi-framework (OK pour React) |
| [[nolly-studio-cult-ui-pro\|Cult UI Pro]] | Lifetime | $179 (vs $279) | **Non** (Next.js-only) |
| [[hamish-oneill-shadcncraft\|Shadcncraft]] | Lifetime 4 tiers | $0 / $119 / $299 / $499 | **Oui** (React + Tailwind + shadcn) |

### 3. Single-component repos open-source

| Nom | Gap shadcn comble | Maturite |
|-----|-------------------|----------|
| [[ademking-cascader-shadcn\|Cascader ShadCN]] | Hierarchical multi-level select (pays > region > ville) | 76 stars, Dec 2025 |
| [[vzkiss-flowkit-ui\|Flowkit UI]] | Creatable Combobox (multiselect + autocomplete + creatable) | 10 stars, early-stage |

## Tableau comparatif complet

| Lib | Type | Assets | Pricing | Primitives | Framework | FOS compat | Effort | Verdict |
|-----|------|--------|---------|------------|-----------|-----------|--------|---------|
| **Shark UI** | Lib generique | 110+ | Free MIT | Ark UI | React/Vue/Svelte/Solid | Low | L | Defer / inspire |
| **Stow Build** | Marketplace | 500+ | $9/mois token | shadcn standard | React/Vue/Svelte | Medium | M | Defer |
| **Cult UI Pro** | Paid lifetime | 239+ | $179 one-time | Radix + Framer | **Next.js only** | Low | XL | Nogo stack / Inspire AI |
| **Shadcncraft** | Paid lifetime | 333+ | $119-$499 | Radix | React | **Medium-high** | M | Defer favorable |
| **Cascader ShadCN** | Single | 1 | Free MIT | Radix + cmdk | React | **High** | S | Conditional go |
| **Flowkit UI** | Single early | 1 | Free MIT | Base UI | React | Medium | S-M | Nogo lib / Inspire pattern |

## Compat FOS stack (reference)

FOS stack (ref : [[Foundation OS]]) :
- **Build** : Vite (pas Next.js)
- **Runtime** : React 19 + TypeScript
- **Styling** : Tailwind 4 + tokens CSS `--ds-*` ([[Void Glass]])
- **Theme** : **dark-only** (#030303 ds-surface-0, retrait light mode obligatoire)
- **Primitives** : Radix UI (via shadcn origin)
- **Forms** : react-hook-form + zod

Implications pour adoption lib externe :
- **Next.js-lock tue l'adoption** (Cult UI Pro) → XL effort → nogo par defaut
- **Ark UI / Base UI primitives differentes** = porting vers Radix manuel
- **Dark-only FOS** = retrait light mode obligatoire pour chaque bloc
- **Tokens `--ds-*`** = re-theme obligatoire (les 6 utilisent tokens shadcn standard `--background`/`--foreground`)
- **Multi-framework** (Vue/Svelte/Solid) = bruit (FOS React only)

## Gaps FOS actuels que ces libs peuvent combler

FOS DS actuel : **46 primitives ui** + 7 patterns dashboard (modules/design-system/).

| Gap FOS | Meilleur candidat | Effort | Priorite |
|---------|-------------------|--------|----------|
| Marketing blocks (heroes, pricing, testimonials, FAQ, CTAs) | [[hamish-oneill-shadcncraft\|Shadcncraft]] $119 Base | M (per bloc) | Conditionnel landing publique |
| Cascader hierarchical | [[ademking-cascader-shadcn\|Cascader ShadCN]] gratuit | S | Conditionnel Phase 5 |
| Creatable Combobox | [[vzkiss-flowkit-ui\|Flowkit UI]] (inspire, pas adopter) | S-M reecriture | Conditionnel form dynamique |
| Advanced data-table | **Non couvert** par ces 6 libs | — | A chercher ailleurs |
| Tree component | **Non couvert** par ces 6 libs | — | A chercher ailleurs |
| AI agent patterns | [[nolly-studio-cult-ui-pro\|Cult UI Pro]] (inspire, docs Anthropic/Vercel gratuits suffisent probablement) | XL si porting | Conditionnel Phase 5 AI |

## Recommandations priorisees

**Aucune adoption immediate necessaire**. FOS DS Void Glass est **operationnel** (46 ui + 7 patterns, 15/15 tests, CSS 55KB). Les libs externes sont **options** pour combler des **gaps futurs**, pas besoins actuels.

Ordre de priorite si besoin se materialise :

1. **[[ademking-cascader-shadcn\|Cascader ShadCN]] gratuit** — si cas d'usage hierarchical concret apparait (Phase 5 Trading categories > paires, Sante specialites, Finance comptes). Effort S, MIT, adoption triviale.
2. **[[hamish-oneill-shadcncraft\|Shadcncraft Base $119]]** — si Kevin lance landing publique (App Builder publique ou Phase 5 produit grand public). Seul produit commercial vraiment aligne stack FOS.
3. **[[vinihvc-shark-ui\|Shark UI]]** comme **source d'inspiration** code (MIT) — checker si composants FOS absents (tree, stepper, data-table advanced) existent chez Shark, adapter sous Radix.
4. **[[vzkiss-flowkit-ui\|Flowkit Creatable Combobox]]** — reecrire pattern from scratch sur Radix si besoin form dynamique FOS. **Ne pas adopter** la lib (early-stage risk).
5. **[[nolly-studio-cult-ui-pro\|Cult UI Pro AI patterns]]** — **en dernier recours** si docs Anthropic/Vercel AI SDK insuffisantes pour Phase 5 AI. Lire docs gratuites d'abord, achat uniquement si value unique demontree.

**Jamais en priorite 1** : [[stowdev-stow-build\|Stow]] (marketplace community qualite variable, recurring $9/mois).

## Lessons learned

### 1. Paywall = bet
4 des 6 libs (Stow, Cult, Shadcncraft, Flowkit indirect) necessitent achat ou exploration payante sans preview code complet. Accepter ce risk avec budget test ou chercher alternatives gratuites. Recommandation : **preview toujours 1-2 blocs publics** avant engagement.

### 2. Stack mismatch est le tueur #1
[[nolly-studio-cult-ui-pro\|Cult UI Pro]] est probablement le **meilleur produit** (239+ resources, AI patterns, Supabase CEO endorsement) **mais Next.js-lock** = XL porting = **nogo stack** pour FOS. Verifier stack **avant** le contenu.

### 3. Solo maintainer = bus factor
Shark (solo), Cascader (solo), Flowkit (solo) → tous risque abandonware. Seuil minimum : 100+ stars + activite 12 derniers mois + fork ecosystem.

### 4. Gaps shadcn officiels sont des opportunites
Cascader, tree, creatable combobox, marketing blocks = **multiples projets independents** comblent ces gaps. Pattern du **"ecosysteme satellite shadcn"**. Pas de monopole, choix libre.

### 5. "Components shadcn doesn't cover" = positioning recurrent
Flowkit + autres projets similaires. Niche valide mais **execution depend du maintainer**. Prefer pattern + reecriture vs adoption directe pour eviter dep fragile.

### 6. Multi-framework = souvent bruit
Shark, Stow vendent React/Vue/Svelte/Solid. Pour FOS (React only), **50% du contenu marketing est hors scope**. Ne pas payer le premium multi-framework.

## Decision framework reutilisable

Avant d'adopter **n'importe quelle lib shadcn externe** a FOS :

```
1. Stack match ?
   - React ? Tailwind ? Radix ? Vite-compatible ?
   - Si mismatch majeur (Next.js-only) → XL effort → skip

2. Tokens ?
   - Tokens shadcn standard (--background/--foreground) : OK re-theme --ds-*
   - Tokens custom proprietaires : bloat + porting complexe → penalty

3. Dark mode natif ou light-first ?
   - Dark natif : OK
   - Light-first avec dark "aussi" : +30% effort Void Glass porting

4. Preview code public ?
   - Oui : evaluer qualite + alignment avant achat/adoption
   - Non (paywall total) : risk eleve, budget test maximum $50

5. Maintainer ?
   - Solo : bus factor = risk. Seuil : 100+ stars + activite 12m
   - Backed (company, collective) : safer

6. Besoin concret FOS ?
   - Besoin existe actuellement : GO si autres criteres OK
   - Besoin hypothetique futur : DEFER, ne pas adopter prophylactiquement
```

## Related concepts

- [[Foundation OS]] — contexte OS complet
- [[Void Glass]] — design system FOS dark-only
- [[LLM Wiki Pattern]] — pattern de stockage sources pour retrieval

## Notes

Cette page est **snapshot Avril 2026**. A reviewer si :
- Une des 6 libs passe mise a jour majeure (ex : Shark UI devient payant)
- FOS change de stack (improbable short-term)
- Kevin decide de lancer une landing publique (reactiver la decision Shadcncraft)

**Pattern wiki retenu** : pour tout batch de refs balancees par Kevin (6 refs en l'espece) sur un meme theme, produire :
1. N pages [[index-sources]] individuelles (analyse complete + Foundation OS Analysis + verdict)
2. 1 page [[index-concepts]] synthese croisee (cette page-ci) avec tableau comparatif + recommandations priorisees + decision framework

Ce pattern **supporte l'objectif** de la conversation alim-only : stocker pour decision future, pas executer dans la meme session.
