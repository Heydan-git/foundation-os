---
type: source
title: "Shadcncraft (Hamish O'Neill)"
source_type: website
author: "Hamish O'Neill"
date_published: 2026-04-19
url: "https://shadcncraft.com"
confidence: high
fos_compat: medium-high
effort_estime: M
decision: defer-favorable
key_claims:
  - "Extension officielle de shadcn/ui (endorsed par shadcn creator)"
  - "224 production-ready blocks + 109 components"
  - "1:1 Figma + React alignment"
  - "Figma plugin gratuit (theming + MCP pour design-to-code)"
  - "4 tiers : Free / Base $119 / Pro $299 / Pro + React $499"
  - "3500+ users actifs"
  - "Categories : Marketing + Application + E-Commerce + Official shadcn/ui"
  - "Stack aligne FOS : React + Tailwind + shadcn-ui (PAS de Next.js-lock)"
  - "No AI-generated layouts (qualite structurelle verifiee)"
  - "Lifetime updates sur tous les tiers"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - paid
  - shadcn
  - figma-kit
  - ui-library
  - blocks
  - production-ready
  - fos-compatible
status: seed
related:
  - "[[index-sources]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
  - "[[Foundation OS]]"
  - "[[Hamish O'Neill]]"
  - "[[shadcn|shadcn/ui]]"
  - "[[Figma]]"
  - "[[Figma Make]]"
  - "[[MCP]]"
  - "[[Radix UI]]"
  - "[[Tailwind CSS]]"
sources: []
---

# Shadcncraft (Hamish O'Neill)

## Summary

Shadcncraft est un **produit commercial** par Hamish O'Neill (background : "years building design systems for large product teams"). **Extension officielle** de shadcn/ui (endorsed par le createur original de shadcn). Produit 1:1 Figma + React : **224 blocks + 109 components** (~333 assets). 4 tiers : Free / Base $119 / Pro $299 / Pro + React $499 (lifetime, one-time). Inclut un **Figma plugin gratuit** pour theming + React code generation + MCP design-to-code.

Categories : Marketing (404 pages, activity feeds, banners, 13 benefits, blog, 31 calendars, careers, checkout, contact, CTAs, dashboards, FAQ, file uploads, footers, headers, 10 heroes, modals, pricing, product, 11 testimonials) + Application + E-Commerce + Official shadcn/ui. 3500+ users actifs. **Stack aligne FOS** (React + Tailwind + shadcn-ui, pas de Next.js-lock).

Claim differentiant fort : "No AI-generated layouts" (verified structural integrity, real spacing/hierarchy, design-to-code alignment).

## Key Claims

- 224 production-ready blocks
- 109 production-ready components avec deeper states
- Breakdown : Pro Marketing 26 + Pro Application 22 + Pro E-Commerce 5 + Official shadcn 56 + Free tier 15
- 4 tiers pricing : $0 / $119 / $299 / $499
- One-time payment, lifetime updates, upgrade paying only the difference
- Figma plugin gratuit (theming, MCP design-to-code)
- Design-to-code alignment 1:1 Figma / React
- Dark/light mode full support
- Endorsed par shadcn creator original
- Categories extensives (heroes x10, testimonials x11, benefits x13, calendars x31...)
- 3500+ users trusted
- Support : 24h email (Base), 12h (Pro/Pro+React), Discord community
- No AI-generated layouts claim

## Entities Mentioned

- **[[Hamish O'Neill]]** — founder Shadcncraft, DS background
- **[[shadcn|shadcn/ui]]** — base framework
- **[[Figma]]** — design tool integre via plugin (Figma community inclus)
- `v0` + `Cursor` — AI builders integres (tech bien connues)
- **[[Figma Make]]** — integration AI design
- **[[MCP]]** (Model Context Protocol) — bridge design-to-code
- **[[Radix UI]]** (primitive via shadcn) + **[[Tailwind CSS]]**

## Concepts Introduced

- **Figma-React 1:1 alignment** — pattern design-to-code (voir [[Figma Make]] + [[MCP]])
- **[[MCP]] design-to-code** — bridge Figma plugin → React
- **Production-ready blocks taxonomy** — Marketing / Application / E-Commerce
- **Multi-tier lifetime pricing** — Base / Pro / Pro+React (business model)

## Foundation OS Analysis

### Compat OS

**Medium-High**. **Le plus aligne FOS de la liste des 6 libs**. Stack identique : React + Tailwind + shadcn-ui. **Pas de Next.js-lock**. Les blocks sont assembles avec primitives shadcn standard (les memes que les 46 ui FOS utilise).

Porting standard :
1. Re-theme tokens `--background`/`--foreground` → `--ds-*` Void Glass
2. Retrait light-mode (FOS dark-only)
3. Import dans `modules/design-system/src/components/patterns/` ou dans un nouveau dossier blocks (a creer si adoption)
4. Adapt react-hook-form / form schemas si necessaire

### Effort integration

**M** par bloc (~30-60min : tokens + dark-only + story Storybook). Pour 20-30 blocs cles (3 heroes + 2 pricing + 2 testimonials + 1 FAQ + 2 CTAs + 3 features + 1 footer + 1 404), compte **15-25h total**. Raisonnable sur 1 week-end ou 2-3 sessions Desktop.

### Ce qui existe deja dans FOS

- FOS = primitives (46 ui) + 7 patterns dashboard.
- **Gap total** : marketing blocks (heroes, pricing, testimonials, FAQ, CTAs, features, footers).
- Shadcncraft comble **exactement** ce gap.

Si Kevin construit un jour une **landing page App Builder** ou un **site vitrine Phase 5**, Shadcncraft serait le **candidate #1**.

### Limites Claude declarees

- **Fetch** : overview + pricing + liste categories. **N'ai pas** acces catalogue Pro (paywall) → **pas lu le code reel**. Confidence "high" sur positioning, "medium" sur qualite code.
- **"Endorsed par shadcn creator"** : vague — lequel exactement ? shadcn lui-meme (le pseudonyme) ? Ben Eckrich (qui serait le vrai nom selon certaines sources) ? A verifier.
- **Figma workflow** : je sais le plugin existe, mais n'ai pas teste (pas acces Figma Kevin).

### Risques / pieges

1. **Paywall bloquant preview** — $119/$299/$499 sans voir le code reel. Bet partiel sur screenshots + testimonials.
2. **Endorsement "shadcn creator" vague** — source d'autorite pas 100% verifiable.
3. **Figma plugin utile mais Kevin n'a pas de workflow Figma actuel** (FOS = React + Storybook). L'avantage 1:1 Figma n'apporte rien sauf si Kevin passe par Figma Make (module `base DS/` ancien).
4. **3500+ users** = base moyenne (moins que Cult UI 416 ? non : Cult 416, Shadcncraft 3500 = **8x plus**). Shadcncraft a **meilleure base install**.
5. **Dark mode natif vs d'abord light** : le site dit "full light/dark" mais les mockups sont probablement light-first. Verifier qualite dark avant achat.
6. **"No AI-generated layouts" claim** a verifier (peut etre vrai ou marketing).

### Verdict

**Defer favorable / Go si besoin marketing blocks**. **Le plus aligne FOS de la liste**. Candidate #1 si Kevin decide construire landing/marketing pages pour publier App Builder ou Phase 5 produits.

**Recommandations specifiques** :
- **Pas maintenant** (pas de besoin immediat FOS — App Builder reste interne, Phase 5 pas lancee)
- **Base tier $119** si achat futur — couvre tous blocks officiels shadcn Figma, suffisant si Kevin prefere coder les blocs specifiques
- **Pro $299** si Kevin veut les 224 blocks pro (Marketing + Application + E-Commerce)
- **Pro + React $499** = overkill **si** Kevin n'utilise pas le workflow Figma (sans workflow Figma, paye le plugin inutilise)

**Benchmark vs autres** :
- vs Cult UI Pro ($179) : **Shadcncraft mieux aligne stack** (pas Next.js-lock) mais pas d'AI patterns
- vs Stow ($9/mois) : **Shadcncraft one-time plus safe** (pas de recurring) et qualite likely superieure (single-creator curation vs community marketplace)

### Questions ouvertes

- Le Figma plugin export React utilise-t-il les tokens `--background`/`--foreground` standard ? (si oui, remap `--ds-*` rapide et automatable)
- Preview publique d'1 bloc Pro dispo ? (screenshot detail code ? vidéo ?)
- Les blocks sont-ils dark-mode natif ou **designed light d'abord** ? (impact effort Void Glass)
- Hamish O'Neill est-il sur Twitter/LinkedIn pour verifier background DS ?
- Quelle est la licence exacte des blocks achetes ? (commercial use ? resell ?)

## Raw Source

- Site : https://shadcncraft.com
- Free tier : Figma community library

## Notes

**Candidate #1 pour adoption FOS** parmi les 6 libs. Decision depend entierement du **besoin futur en marketing blocks**. Tant que FOS est cerveau interne + App Builder prive, pas de besoin. Si Kevin passe en mode produit public (Phase 5 ou beyond), $119 Base = ROI tres bon.

**A surveiller** : changelog publique, nouveaux blocks ajoutes, eventuels discounts Black Friday ou launch promo.
