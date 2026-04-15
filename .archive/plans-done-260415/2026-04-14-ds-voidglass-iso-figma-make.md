---
id: 2026-04-14-ds-voidglass-iso-figma-make
title: DS Void Glass iso Figma Make — composants reutilisables partout
created: 2026-04-14
status: in_progress (blocage : composants atomiques livres mais stories a ecrire + Supernova UI a verifier)
priority: P0 (Kevin frustre, 15+ iterations, ceci doit reussir)
---

# DS Void Glass iso Figma Make

## Demande Kevin (source de verite absolue)

> "Je t'ai donne des fichiers avec des composants, des tokens. Tout est nickel visuellement, c'est exactement ce que je souhaite. Je te demande d'en faire un design system avec la stack qu'on a decide, qui ressemble exactement a ce que je t'ai donne a 100%, que tu l'utilises pour construire le dashboard (ce que tu as l'air d'avoir deja fait et qui fonctionne bien), parce que visuellement c'est ce que je voulais, mais qu'en plus on le retrouve sur Supernova et sur Storybook."

**Regle absolue** : tout doit etre **VISUELLEMENT IDENTIQUE PARTOUT** :
- Fichiers Figma Make (zip) = source de verite
- Dashboard Foundation OS (app) = utilise le DS
- Storybook = affiche le DS
- Supernova = affiche le DS
- **ZERO** divergence visuelle

## Source de verite

**Chemin** : `modules/design-system/base DS/src/`

Structure :
- `app/components/ui/` : 46 shadcn primitives **VANILLA** (button.tsx, card.tsx, badge.tsx, etc). Identiques au DS actuel. **Ce ne sont PAS les composants glass**.
- `app/components/Dashboard*.tsx` : 7 fichiers (DashboardHome, DashboardDesignSystem 1788L, DashboardAI, DashboardLayout, DashboardSettings, DashboardTxs, DashboardWallet). **Les VRAIS composants glass** sont la, mais **codes inline** dans ces pages (classes Tailwind hand-coded, pas abstraites en composants reutilisables).
- `styles/theme.css` : tokens CSS (primitives + DS tokens `--ds-surface-*`, `--ds-fg`, `--ds-blue`, `--ds-purple`, etc. + `@theme inline` pour Tailwind utilities comme `bg-ds-surface-2`, `text-ds-fg/40`).

## Erreurs faites dans cette session (NE PAS REFAIRE)

1. **Dit "analyze push = Components live"** alors que `supernova analyze` alimente le backend AI, PAS la section Components UI visible. Kevin a corrige. Rectifie via SDK `createComponent`.
2. **Copie-colle les 7 Dashboard*.tsx comme pages dans Storybook** au lieu d'extraire les composants atomiques. Kevin "c'est pas ce que je t'ai demande, je veux des composants pas des pages".
3. **Claim fait sans verification visuelle** → regle ajoutee dans CLAUDE.md : screenshot obligatoire avant de dire "fait" pour toute tache UI.
4. **Token Supernova transmis en chat** — acceptable pour solo mais non-ideal.

## Etat actuel (2026-04-14, avant compactage contexte)

### ✅ Deja fait et verifie

- Supernova DS 790241 : 197 tokens synchronises (visibles dans UI).
- Supernova Components UI : 46 entites Component creees via SDK avec Name + Description + Status Healthy + Documented=Yes + Repository URL GitHub (verifie via accessibility snapshot).
- Storybook 209 stories importees dans Supernova + doc publiee.
- Projet Asana "Foundation OS — Build" cree (gid 1214059589666268) avec 4 sections + 18 taches. Projet "Setup" cloture.
- Notion wiki 🪐 Foundation OS enrichi : +9 sessions, +14 decisions, Update Roadmap 2026-04-14.
- GitHub Actions workflow `.github/workflows/supernova-sync.yml` : push sur main → sync auto. Secret `SUPERNOVA_TOKEN` configure par Kevin. Run #1 reussi (2m21s).
- 7 Dashboard*.tsx copies du zip dans `modules/design-system/src/components/patterns/` + stories (affiche les pages completes).
- **11 composants atomiques extraits** dans `modules/design-system/src/components/void-glass/` :
  - `GlassCard.tsx` (conteneur rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl + hover glow)
  - `IconBox.tsx` (w-8 h-8 rounded-md bg-[#050505] border glass + inset shadow)
  - `StatusDot.tsx` (dot pulsant emerald/blue/purple/amber/rose/white)
  - `NeonBadge.tsx` (pill mono uppercase avec tones default/emerald/blue/purple/amber/rose/cyan/outline)
  - `SubLabel.tsx` (texte mono uppercase 9px white/40)
  - `SectionHeader.tsx` (icon glow + line gradient + label)
  - `StatCard.tsx` (composite : IconBox + SubLabel + value gradient + NeonBadge change)
  - `HashPill.tsx` (code pill mono avec copy button)
  - `ProgressBar.tsx` (gradient blue→purple avec glow, ou emerald si 100%)
  - `LiveIndicator.tsx` (StatusDot + label type "SYNC: 100%" / "SUPABASE LIVE")
  - `GlowButton.tsx` (variants primary white+glow / glass / ghost)
  - `index.ts` (barrel export)

### ⏳ A finir (priorite ordonnee)

1. **Stories Storybook pour chaque void-glass component** (1 story par composant, toutes les variants visibles).
2. **Export void-glass depuis DS `src/index.ts`** (actuellement n'exporte que `ui/`).
3. **Supprimer ou deplacer les stories pages** (`patterns/Dashboard.stories.tsx`) — Kevin les refuse comme stories principales. Les garder dans un namespace `Examples/` si utile.
4. **Refactor app** pour utiliser les composants DS void-glass au lieu du code hand-coded dans `modules/app/src/pages/*.tsx` (IndexPage, LoginPage, etc).
5. **Build + push** → GitHub Action auto-sync Supernova.
6. **Verification visuelle** (chrome-devtools screenshot OU accessibility snapshot) que :
   - Storybook montre chaque composant avec son look glass iso Figma Make
   - Supernova montre les 46 Components + les nouveaux composants void-glass dans sa liste
   - Dashboard Foundation OS (vercel) continue d'afficher correctement (non-regression)

### ❌ Blocage connu

- **Plan Supernova Free = 20 doc pages max** : impossible de creer 1 page doc par composant (46 = trop). Les 52 md narratifs restent dans `docs-supernova/` en attente d'upgrade plan (si Kevin veut).
- **SDK Supernova `linkElementType` enum** : n'inclut PAS `StorybookEntry`. Impossible de linker un Component a une Story via ElementProperty. Workaround : la section "Storybook stories" sidebar Supernova liste les 209 stories mais sans link explicite.
- **Figma component link** : necessite OAuth manuel Figma → Supernova. Non-automatisable via API.

## Plan d'execution prochaine session

1. Lire ce plan integralement.
2. Lire MEMORY.md (dont `feedback_ds_iso_figma.md`, `feedback_visual_verification.md`, `feedback_no_bullshit.md`).
3. Ecrire les stories Storybook pour les 11 void-glass components (1 story par composant, montrant toutes les variants).
4. Update `modules/design-system/src/index.ts` pour exporter `./components/void-glass`.
5. Supprimer ou renommer `patterns/Dashboard.stories.tsx` en `Examples/` (secondaire).
6. Rebuild Storybook local, verifier visuellement via chrome-devtools screenshot (resolution jpeg 75% pour eviter timeout).
7. Si OK : commit + push. GitHub Action declenche sync Supernova.
8. Verifier dans l'UI Supernova authentifiee que les nouveaux composants apparaissent.
9. Refactor app (IndexPage.tsx d'abord) pour importer depuis DS au lieu de hand-coded.
10. Build app, verifier non-regression via vercel deploy.
11. Mettre a jour CONTEXT.md avec session DONE.

## Regles imperatives (ne JAMAIS oublier)

- **Verification visuelle obligatoire** avant de dire "fait" (CLAUDE.md + memory `feedback_visual_verification`).
- **Zero bullshit** (CLAUDE.md anti-bullshit gates). Si je ne peux pas verifier, le dire explicitement.
- **Iso Figma Make = source de verite** absolue. Le zip `base DS/src/` est la reference.
- **Kevin veut des COMPOSANTS reutilisables**, pas des pages copie-collees.
- **Ne pas proposer des options pendant qu'il attend** — executer et poser les questions groupees AU DEBUT (memoire `feedback_frontload_questions`).
- **Decouper en phases courtes** (CLAUDE.md) pour eviter compactage.

## Fichiers touches (pour diff rapide en nouvelle session)

- `modules/design-system/src/components/void-glass/` (nouveau, 11 composants + index)
- `modules/design-system/src/components/patterns/` (pages zip + stories — a deprecier)
- `modules/design-system/scripts/supernova-sync.mjs` (nouveau, 46 Components SDK)
- `modules/design-system/package.json` (scripts supernova:analyze, supernova:components)
- `.github/workflows/supernova-sync.yml` (auto-sync push main)
- `modules/design-system/.env.local` (SUPERNOVA_TOKEN, gitignore)
- `CLAUDE.md` (regle verification visuelle)

## Commits recents

- `8d561ec` ci(supernova): widen trigger paths
- `5f6ae13` feat(ds): import Dashboard*.tsx patterns from Figma Make zip
- `2c9403d` feat(ds): 46 Components visibles dans Supernova UI
- `cde5ead` feat(ds): Supernova components live via analyze CLI
- `8246e79` docs(context): fix ref path
- `f451885` docs(ds): narratif Supernova + tooling sync Asana/Notion
