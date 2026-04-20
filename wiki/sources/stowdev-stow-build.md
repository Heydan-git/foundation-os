---
type: source
title: "Stow Build — Marketplace 500+ blocks shadcn"
source_type: marketplace
author: "@stowdev (platform) + multi-creator community (ApexLogic, Echo, hanzala-comps, etc.)"
date_published: 2026-04-19
url: "https://stow.build"
confidence: high
fos_compat: medium
effort_estime: M
decision: defer
key_claims:
  - "500+ blocks disponibles"
  - "Modele token : $9/mois pour 100 tokens, ~$2/bloc"
  - "Lifetime ownership par bloc achete"
  - "Multi-framework : React, Vue, Svelte, shadcn-based"
  - "Marketplace community (creators multiples)"
  - "Installation via npx shadcn CLI + ZIP download"
  - "Cible : SaaS founders, indie hackers, freelancers"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - marketplace
  - shadcn
  - blocks
  - paid
  - commercial
  - multi-creator
status: seed
related:
  - "[[index-sources]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
  - "[[Foundation OS]]"
  - "[[shadcn|shadcn/ui]]"
  - "[[Tailwind CSS]]"
sources: []
---

# Stow Build — Marketplace 500+ blocks shadcn

## Summary

Stow est un **marketplace premium** de blocks shadcn, operant via un modele **token-based subscription**. 500+ blocks disponibles, fournis par une communaute de creators (ApexLogic, Echo, hanzala-comps, etc.). Token economy : $9/mois pour 100 tokens, chaque bloc coute en moyenne ~$2. **Lifetime ownership** : une fois achete, le code est a toi pour toujours. Multi-framework (React + Vue + Svelte), installation via `npx shadcn add` ou ZIP. Cible : SaaS founders, indie hackers, freelancers, "design-averse developers".

Se positionne entre shadcn/ui gratuit et design systems enterprise : **curation + monetization** d'un ecosysteme de blocks prets-a-coller.

## Key Claims

- 500+ blocks (explicitement declares)
- Token economy : $9 = 100 tokens = ~50 blocks (~$2/bloc)
- "Buy Once, Own Forever" (pas de recurring par bloc)
- Multi-framework : React, Vue, Svelte, shadcn-based
- Multi-creator marketplace (community economy)
- Interactive live previews avant achat
- Paiement Stripe, cancellable
- Installation : `npx shadcn add` + ZIP download
- Categories confirmees : Data Tables, Hero Sections (SaaS + general), Dashboards, Testimonials/Editorial, FAQ Accordions, Product Features
- TypeScript-ready

## Entities Mentioned

- **Stow** — plateforme marketplace (pas de page dediee — marketplace, pas entity clef)
- **@stowdev** — compte principal
- `ApexLogic`, `Echo`, `hanzala-comps` — creators visibles (tags, pas pages)
- `Stripe` — payments (tech bien connue)
- **[[shadcn|shadcn/ui]]** — base framework

## Concepts Introduced

- **Token-based marketplace** — modele hybride abonnement + achat individuel
- **Community block economy** — creators multiples monetises sur meme plateforme
- **"Copy, paste, and own your code forever"** — philosophie anti-lock-in

## Foundation OS Analysis

### Compat OS

**Medium**. Chaque bloc est shadcn-standard (React + Tailwind + tokens `--background`/`--foreground`). Import bloc individuel **possible** mais exige :
1. Re-theme tokens shadcn standard → `--ds-*` Void Glass
2. Retrait light mode (dark-only FOS)
3. Adapt TypeScript types si necessaire
4. Multi-framework → prendre **uniquement** React

Le pattern `npx shadcn add` est compatible avec le workflow copy-paste FOS (meme CLI).

### Effort integration

**M** (par bloc individuel). ~30-60min de porting par bloc (theme + dark-only + story Storybook). Pour un bloc marketing (hero, pricing table, testimonials section), raisonnable.

**S'il s'agit d'importer 10 blocks** : compte 5-10h total. Abordable sur 1 week-end.

### Ce qui existe deja dans FOS

FOS a les **primitives** (46 ui : card, button, table, form, avatar, badge, etc.) mais **aucun bloc marketing assemble** (pas de hero, pas de pricing table, pas de testimonials, pas de FAQ block). C'est un **gap reel** que Stow comblerait.

FOS a 7 patterns dashboard (DashboardHome, DashboardAI, DashboardDesignSystem, DashboardLayout, DashboardSettings, DashboardTxs, DashboardWallet) = couvre l'app interne, mais rien pour landing publique.

### Limites Claude declarees

- **Fetch** : home page + exemples de creators visibles publiquement. N'ai **pas** parcouru le catalogue reel (paywall). Ne peux pas juger la **qualite du code** sans acces aux blocks.
- **Qualite multi-creator** : par definition variable selon creator. Pas audit qualite.
- **Confidence sur 500+** : medium (chiffre declare, pas verifie fichier par fichier).

### Risques / pieges

1. **Marketplace community** → qualite variable selon creator. Besoin de curation manuelle avant achat.
2. **$9/mois recurrent** si on veut parcourir et decouvrir en continu. Alternativement achat a la carte (mais moins de tokens = moins de browsing).
3. **Dependance plateforme** : si Stow ferme, blocs deja telecharges restent (lifetime) mais **pas d'updates** futurs.
4. **Tokens shadcn non-standard** dans le code potentiel → si un creator utilise des custom tokens hors `--background`/`--foreground`, porting casse.
5. **Multi-framework bloat** : si le bloc est fourni en 3 versions (React + Vue + Svelte), le ZIP peut etre pollue — verifier qu'on telecharge juste le React.
6. **Pas d'audit qualite public** : pas de system de reviews/ratings visible sur le site.

### Verdict

**Defer**. FOS n'a **pas de besoin urgent** de marketing blocks actuellement (App Builder n'est pas une landing publique, modules/design-system est un showcase interne).

**Reconsiderer si** :
- Kevin decide de publier App Builder comme produit public (landing page)
- Phase 5 produits (Finance / Sante / Trading) necessitent un site vitrine
- Kevin veut proposer FOS publiquement a d'autres devs (landing devtools)

**Budget test raisonnable** : $9 une fois pour explorer 2-3 blocs, comparer qualite vs Shadcncraft. **Pas d'engagement mensuel recurrent** avant de voir le ROI reel.

### Questions ouvertes

- Qualite reelle des blocks (preview code public existe-t-il ?) 
- Top creators recommandes par la communaute shadcn ?
- Reviews/ratings visibles au public ?
- Mecanisme refund si bloc casse ?
- Comment Stow se compare-t-il qualitativement a Shadcncraft ($119 one-time) ?

## Raw Source

- Site : https://stow.build
- Twitter : @stowdev

## Notes

Le **token model** est interessant comme pattern economic : reduce friction (vs acheter bloc par bloc) sans enfermer dans un all-you-can-eat. Referrable dans toute analyse business model SaaS.

**Concurrents a benchmarker** : Shadcncraft ($119 lifetime base), Cult UI Pro ($179 lifetime), v0 (gratuit + generation AI).
