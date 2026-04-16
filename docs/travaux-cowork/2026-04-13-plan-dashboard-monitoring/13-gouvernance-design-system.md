# 13 — Gouvernance Design System (contrainte absolue)

**Regle maitresse** : 100% du dashboard DOIT consommer le design system Void Glass nouvellement mis en place. Aucune exception stylistique. Tout nouveau composant cree est ajoute au DS, documente sur Supernova, et story-ifie dans Storybook — dans le meme flux de travail, jamais en retard.

Lentilles mobilisees : design-system-manager, lead-design, ui-expert, foundation-os-orchestrator.

## 1. Principe intangible

> Le dashboard n'est pas un "client" du DS, c'est une **vitrine** du DS. Il demontre la maturite du systeme. Si un besoin UI apparait dans le dashboard qui n'existe pas dans le DS, c'est le DS qui s'etend — pas le dashboard qui devie.

Corollaires :
- Zero classe Tailwind arbitraire (ex: `bg-[#123456]` interdit, `text-[14px]` interdit)
- Zero valeur hardcodee (couleur, spacing, radius, duree, typo)
- Zero composant UI reinvente : si shadcn en a un, on l'utilise
- Zero "quick hack CSS" dans `modules/app/` pour contourner le DS

## 2. Consommation du DS existant (46 composants shadcn/ui)

Imports obligatoires depuis `@fos/design-system/ui/*` (alias workspace), jamais depuis `shadcn` CLI direct ni copie locale :

```tsx
import { Button } from '@fos/design-system/ui/button'
import { Card, CardHeader, CardContent } from '@fos/design-system/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@fos/design-system/ui/tabs'
```

Liste des 46 composants a privilegier (a completer par le CLI en lisant `modules/design-system/src/components/ui/`) : accordion, alert, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner (toast), switch, table, tabs, textarea, toggle, toggle-group, tooltip + quelques autres.

### 2.1 Mapping dashboard -> DS (exhaustif)

| Besoin dashboard | Composant DS | Notes |
|------------------|--------------|-------|
| HealthRing | **nouveau** (cf section 3) | SVG custom sur tokens DS |
| ModuleCard | Card + Badge + Progress | Composition, pas nouveau composant |
| PlanCard | Card + Badge + Progress | Idem |
| IdeaCard | Card + Textarea (inline edit) | Idem |
| InboxMessage | Card + Avatar | Idem |
| TokenSwatch | **nouveau** (cf section 3) | Atomique pour DS page |
| SearchCommand (Cmd+K) | **Command** (deja DS) | zero nouveau |
| Sidebar | NavigationMenu + Tooltip | composition |
| Header breadcrumb | Breadcrumb | direct |
| Footer | Separator + Badge + Label | composition |
| Verrou badge | Badge + Tooltip | direct |
| Verdict sante (textuel) | Badge | direct |
| Loading | Skeleton | direct |
| Toasts | Sonner | direct |
| Modals confirmation | AlertDialog | direct |
| Modals content | Dialog | direct |
| Drawers lateraux | Sheet / Drawer | direct |
| Hover info | HoverCard | direct |
| Tooltips | Tooltip | direct |
| Tabs Arsenal | Tabs | direct |
| Accordion knowledge | Accordion | direct |
| Filter chips | ToggleGroup | direct |
| Settings toggles | Switch | direct |
| Inputs globaux | Input + Label | direct |
| Select module/status | Select | direct |
| Date range | Calendar + Popover | composition |
| Pagination listes | Pagination | direct |
| Scroll zones | ScrollArea | direct |
| Tables (decisions, tools) | Table | direct |
| Form briefs | Form + Input + Textarea + Select | composition |
| OTP (si 2FA un jour) | InputOtp | direct |
| Context menu droits | ContextMenu | direct |
| Dropdown user menu | DropdownMenu | direct |
| Avatar user | Avatar | direct |
| Carousel onboarding | Carousel | direct |
| Slider densite settings | Slider | direct |
| Radio mode a11y | RadioGroup | direct |
| Checkbox options | Checkbox | direct |
| Resizable panels | Resizable | direct |
| Collapsible zones | Collapsible | direct |
| Popover rapide | Popover | direct |

Resultat : **~40 besoins UI couverts par composants existants**, **3-5 nouveaux composants** a creer (section 3).

## 3. Composants nouveaux autorises (et leur process)

### 3.1 Liste fermee des composants nouveaux pour le dashboard

Apres audit UI, ces nouveaux composants sont necessaires et **doivent** etre ajoutes au DS :

1. **HealthRing** — anneau SVG anime (3 etats : SAIN/DEG/BROKEN)
2. **TokenSwatch** — visualisation d'un token DS (couleur/typo/space)
3. **StatusDot** — point colore avec label (utilise pour modules, plans, plugins)
4. **MetricGauge** — jauge lineaire 0-100 avec seuils (utilisee pour CONTEXT.md budget, coverage, progression)
5. **TimelineItem** — primitive pour /sessions, /plans timelines et /memory decisions

Tout nouveau composant au-dela de cette liste **necessite validation Kevin** avant creation. Regle stricte : pas d'invention en cours de route.

### 3.2 Process de creation d'un nouveau composant (obligatoire)

Chaque nouveau composant suit **exactement** cette sequence, sans sauter d'etape :

1. **Proposer** : decrire composant dans un bref (`docs/travaux-cowork/YYYY-MM-DD-new-ds-component-X/00-INDEX.md`) avec : nom, raison d'etre, variants, props, anti-patterns, placement dans le DS.
2. **Valider** : Kevin approuve (gate).
3. **Creer** : code dans `modules/design-system/src/components/ui/<nom>.tsx`. Consommation 100% tokens DS. Types TS stricts. Zero dependance externe non approuvee.
4. **Tokens** : si besoin nouveaux tokens (couleur, duree, radius) : ajouter dans `modules/design-system/src/tokens/` selon DTCG, pas en valeurs hardcodees.
5. **Storybook** : story `<nom>.stories.tsx` dans le meme commit. Tous les variants + controls.
6. **Supernova** : publier sur Supernova (via CLI `npx supernova publish` OU upload manuel si process manuel). Descriptif, props, do/don't, code snippets.
7. **Tests** : `<nom>.test.tsx` unitaire + story snapshot.
8. **A11y** : verifier role, aria, keyboard nav. Axe passe.
9. **Export** : ajouter l'export dans `modules/design-system/src/index.ts` (barrel).
10. **Changelog DS** : ajouter entree dans `modules/design-system/CHANGELOG.md` (semver patch/minor).
11. **Consommer** : utiliser dans le dashboard (pas avant).

Un composant n'est **pas considere "cree"** tant que les 11 etapes ne sont pas faites. Pas de "je finalise Storybook plus tard", c'est dans le meme flow, meme session.

### 3.3 Regle du meme flow
> Si tu crees un composant, tu fais Storybook + Supernova + test + a11y + changelog dans le **meme commit** ou une suite de commits de la meme session. Jamais de dette technique "je ferai plus tard".

## 4. Tokens DS — contrat strict

### 4.1 Tokens deja existants (source de verite `modules/design-system/src/tokens/`)
- **Primitives** : raw values (couleurs brutes, pixels, etc.)
- **Semantic** : usages (ds-surface-0/1/2, ds-foreground, ds-accent, ds-border, ds-muted-foreground, etc.)
- **Bridge** : mapping Tailwind (consommes via classes `bg-ds-surface-0`, `text-ds-foreground`, `border-ds-border`)

### 4.2 Ajouts de tokens necessaires au dashboard

#### Motion tokens (a ajouter)
```
motion.duration.instant: 0ms
motion.duration.fast: 120ms
motion.duration.base: 200ms
motion.duration.slow: 400ms
motion.duration.breath: 1200ms
motion.easing.standard: cubic-bezier(0.4, 0, 0.2, 1)
motion.easing.enter: cubic-bezier(0.16, 1, 0.3, 1)
motion.easing.exit: cubic-bezier(0.7, 0, 0.84, 0)
motion.easing.spring: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

#### Status tokens (a verifier, ajouter si absent)
```
status.healthy: <couleur verte semantique DS>
status.warning: <couleur jaune semantique DS>
status.critical: <couleur rouge semantique DS>
status.info: <couleur bleue semantique DS>
status.neutral: <couleur grise semantique DS>
```

#### Dashboard-specific (prefixe `dashboard.*` dans tokens pour isoler)
```
dashboard.ring.stroke.width: 8
dashboard.widget.padding: <reuse space token>
dashboard.sidebar.width.collapsed: 64
dashboard.sidebar.width.expanded: 240
```

### 4.3 Interdits absolus
- Aucun `#hex` en dur dans le code dashboard
- Aucun `px` en dur (utiliser `space-*` tokens ou Tailwind scale)
- Aucune duree d'animation en dur (utiliser motion tokens)
- Aucune typo en dur (Figtree / JetBrains Mono via tokens)
- Aucun shadow / radius hardcode (tokens DS)

### 4.4 Outil de garde-fou
Script `scripts/hooks/validate-void-glass.sh` (deja existant, a etendre) :
- Bloque commit si `#xxxxxx` dans fichiers `.tsx` du dashboard hors tokens
- Bloque si `font-family: ` en CSS inline
- Bloque si `#0A0A0B`, `#08080A`, `Outfit`, `Inter` (couleurs/typos interdites projet)
- Peut s'etendre pour bloquer `duration-[` ou autres valeurs Tailwind arbitraires

## 5. Storybook — obligatoire pour chaque composant

### 5.1 Conventions Stories
Chaque composant a :
- Story `Default` (props minimales)
- Story par variant (ex: `HealthRing.Sain`, `HealthRing.Degraded`, `HealthRing.Broken`)
- Story `Interactive` avec controls
- Story `Edge cases` (empty, loading, error)
- Docs page avec guidelines inclusion/exclusion (do/don't)

### 5.2 Chromatic (optionnel v1.5)
Visual regression : chaque PR compare screenshots. Integration CI.

### 5.3 Accessibilite Storybook
Addon `@storybook/addon-a11y` actif sur toutes les stories. Zero violation critique sans justification documentee.

## 6. Supernova — documentation vitrine

### 6.1 Presence obligatoire
Pour chaque composant (existant et nouveau) :
- Page composant avec description, do/don't, props, variants, code React snippet, design specs (spacing, couleurs, typo, radius)
- Tokens consommes listes explicitement
- Lien vers Storybook story
- Lien vers source code (GitHub)

### 6.2 Process publication
A chaque release DS (patch/minor/major) :
1. Update changelog
2. Sync tokens -> Supernova (via plugin Figma-Supernova ou export manuel)
3. Sync components docs -> Supernova
4. Version tag (semver)

### 6.3 Rituel
En fin de session ayant touche au DS : verifier que Storybook build et Supernova est a jour. Si l'un est en retard : sub-bloc "sync DS" avant de passer a autre chose.

## 7. Governance — decisions DS

### 7.1 Ownership
- **Kevin** : approbateur final sur ajout tokens, nouveaux composants, breaking changes
- **Claude (CLI + Cowork)** : propose, implemente, documente, maintient

### 7.2 ADR (Architecture Decision Records)
Decisions DS tracees dans `docs/decisions-log.md` avec prefixe `D-DS-*` :
- D-DS-REBUILD (existe deja)
- D-DS-MOTION : ajout motion tokens (a creer si validee)
- D-DS-NEW-HEALTHRING : creation HealthRing (a creer quand validee)
- etc.

### 7.3 Breaking changes
Un composant DS ne doit **jamais** break sans migration path. Si change d'API necessaire :
1. Ajouter nouvelle API
2. Deprecater ancienne (warning console)
3. Migrer consumers sur 1-2 sprints
4. Retirer ancienne en major version

### 7.4 Review
Avant merge d'un PR touchant le DS :
- [ ] Tous les tests passent (y compris Storybook)
- [ ] axe-core : zero critique
- [ ] Storybook stories complets
- [ ] Supernova update planifie
- [ ] Changelog a jour
- [ ] Aucun consumer existant casse

## 8. Integration dans le plan d'execution (06)

Nouveaux blocs a ajouter / etendre dans `06-plan-execution.md` :

| Bloc | Phase | Description | Effort |
|------|-------|-------------|--------|
| **B2-DS** | P1 | Verifier et etendre alias workspace `@fos/design-system` dans modules/app | 15min |
| **B3-DS** | P1 | Ajouter motion tokens + status tokens manquants au DS | 30min |
| **B10-DS** | P3 | HealthRing **au sein du DS** (pas dans app) + story + Supernova | +1h vs estimation initiale |
| **B15-DS** | P3 | TokenSwatch **au sein du DS** + story + Supernova | +1h |
| **B-STATUS-DOT** | P3 | StatusDot primitive DS + story + Supernova | 1h |
| **B-METRIC-GAUGE** | P3 | MetricGauge primitive DS + story + Supernova | 1h30 |
| **B-TIMELINE-ITEM** | P3 | TimelineItem primitive DS + story + Supernova | 1h30 |
| **B-DS-AUDIT** | P8 | Audit final : tout fichier dashboard importe `@fos/design-system/*` uniquement | 1h |
| **B-DS-SYNC** | P8 | Verification finale Storybook + Supernova alignes | 45min |

Ajout total : ~8h au plan d'execution. Passage de 25h a ~33h.

## 9. Checklist compliance DS (avant livraison)

- [ ] Aucun fichier du dashboard n'importe un composant ui hors de `@fos/design-system`
- [ ] Aucun hex / px / duration hardcode dans fichiers dashboard
- [ ] validate-void-glass.sh passe sans erreur
- [ ] Chaque nouveau composant DS a : code + story + tests + a11y + Supernova page + changelog
- [ ] Storybook build green
- [ ] Supernova synchronise (meme version que codebase)
- [ ] Changelog DS coherent avec commits
- [ ] Zero composant nouveau cree sans proposition + validation
- [ ] Index `modules/design-system/src/index.ts` exporte tous les nouveaux composants
- [ ] Tous les tokens du dashboard consomment `ds-*`

## 10. Alerte rouge — interdictions explicites

Aucun de ces patterns ne doit jamais apparaitre dans `modules/app/` :

```tsx
// INTERDIT
<div className="bg-[#0a0a0b] p-[17px] text-[13px] font-[Inter]">
<button style={{ background: '#ff00ff', borderRadius: '7px' }}>
<div className="transition-[300ms] ease-[cubic-bezier(0.1,0.2,0.3,0.4)]">

// Composant UI local non DS
// modules/app/src/components/MyCustomButton.tsx   ← INTERDIT
```

Si un besoin apparait → etendre le DS, pas contourner.

## 11. Continuous compliance

### 11.1 Hook pre-commit
Active `validate-void-glass.sh` en pre-commit pour bloquer toute violation.

### 11.2 CI guard
Job GitHub Actions specifique : scan du dashboard, echec si import UI hors DS detecte.

### 11.3 Review periodique
Tous les 2 mois : audit DS / dashboard. Nouveaux composants ont-ils bien ete ajoutes ? Supernova reflete bien le code ? Storybook couvre tout ?

## 12. Message pour Claude Code CLI

Claude, quand tu construis ce dashboard :
- **Commence par verifier le DS** : ouvre `modules/design-system/src/components/ui/`, liste les 46 composants.
- **Avant d'ecrire un composant custom** : cherche dans le DS. Si deja present, utilise. Si absent mais proche : compose. Si vraiment absent : propose a Kevin avant de coder.
- **Pas de commit "je finirai Storybook apres"** : creation d'un composant = story + test + Supernova + changelog **dans la meme session**.
- **Tokens** : jamais de valeur en dur, toujours via `@fos/design-system/tokens`.
- **Si tu hesites** : `grep -r "ds-" modules/design-system/src/` te montre les conventions existantes.
- **Si un besoin UI te semble manquant** : ecris une proposition dans `data/inbox/` pour Kevin avant d'avancer.

Le dashboard doit etre la meilleure vitrine du DS Void Glass. Zero concession.
