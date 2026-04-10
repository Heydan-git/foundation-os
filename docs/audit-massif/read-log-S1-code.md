# Read-log S1 — Code vivant (modules/app/src)

> **STATUT** : Scratchpad de travail S1 (non consolide). Source de findings code-level pour S6 / S13 / S20.
> **Pas un livrable** : le livrable consolide S1 est `01-carto-repo.md` (cross-ref vers ce fichier).
> **Cree** : 2026-04-07 (fin de S1 carto repo) | **Integre au repo** : 2026-04-08 (post-S3)

Date : 2026-04-07
Méthode : lecture directe Read tool + extraction bash pour métadonnées (LOC, imports, exports).
Règle anti-compactage : chaque fichier lu est résumé ici, puis relâché du contexte conversationnel.

## Inventaire

- Total fichiers code : 43 (.tsx + .ts + .css + d.ts)
- Répartition : 7 pages, 8 composants généraux, 7 Commander panels, 3 forms, 5 lib, 7 tests, 3 entrée/config
- Stack : React 18 + TypeScript + Vite + Tailwind + react-router-dom + @supabase/supabase-js

---

## Entrée & config

### `src/main.tsx` — 11 LOC
- Rôle : bootstrap React 18 StrictMode → `App` dans `#root`
- Imports : react, react-dom/client, App, ./index.css
- Rien d'exotique. ▸ Conforme.

### `src/vite-env.d.ts` — 11 LOC
- Déclare `ImportMetaEnv` : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Typage env Vite uniquement. ▸ Conforme.

### `src/index.css` — 22 LOC
- Tailwind directives + reset body avec `background-color: #06070C` (Void Glass ✓)
- Scrollbar custom turquoise `rgba(94,234,212,.15)`
- Focus-visible `#5EEAD4` outline 2px
- ▸ Conforme Void Glass strict. Aucun #0A0A0B ou autre couleur interdite.

---

## Pages (src/pages/)

### `Commander.tsx` — 117 LOC
- Rôle : page principale Commander, tabs Sessions/Décisions/Risques/NextSteps/Contextes/Docs
- Hook central : `useCommander()` (lib) → `{ sessions, decisions, risks, docs, contextBlocks, nextSteps, loading, source }`
- Constante META codée en dur : version v0.1, phase "00 — Fondation", dataVersion 1.3.0, lastSync 2026-04-04
- 6 panels importés depuis `@/components/Commander`
- LoadingSkeleton interne (3 blocs pulse)
- Composition : PageContainer → PageHeader (avec 4 pills stats) → StatsBar → TabBar → section active → Footer
- ⚠ lastSync hardcodé 2026-04-04 alors qu'on est 2026-04-07 → dérive normale mais à noter
- ⚠ Beaucoup de styles inline (ex : pills header) plutôt que classes réutilisables → incohérence avec design system
- Void Glass : fontFamily JetBrains Mono OK, couleurs pastel tokens OK

### `Dashboard.tsx` — 258 LOC
- Rôle : dashboard pipeline 8 phases (P00 → P07) + duplicata onglets Sessions/Decisions/Risques/Contextes/Docs
- PIPELINE_PHASES constante 8 objets hardcodés — P00 active, P01→P07 pending
- Utilise `useCommander()` (même source que Commander.tsx)
- Indicateur LIVE/SEED basé sur `source` (supabase vs local)
- Helpers locaux : `impactColor`, sections inlined (PipelineSection, SessionsSection, etc.)
- ⚠ Duplication logique avec Commander.tsx (SessionsSection, DecisionsSection, etc. re-codés alors que les panels existent) → dette technique, ~120 LOC dupliquées
- ⚠ Formatage date `new Date().toISOString().split('T')[0]` inline
- Void Glass : conforme
- Red flag : la page reprend les mêmes data que Commander mais réimplémente l'affichage. **Candidate à refactor / suppression.**

### `IndexPage.tsx` — 257 LOC
- Rôle : home publique, grille de 5 cartes modules (Commander, Knowledge, Dashboard, CRUD Test, Phase1 Demo)
- MODULES array hardcodé avec status `functional` | `static`
- 2 stats pills (count functional / static)
- Style inline intensif (pas Tailwind pur)
- Label prototype explicite "Prototype honnete / CRUD Supabase reel / Zero features simulees" — aligné anti-bullshit CLAUDE.md ✓
- ⚠ Pas de hook, pas de fetch — page 100% statique
- Void Glass : conforme (#06070C, Figtree, JetBrains Mono, turquoise hover)

### `KnowledgePage.tsx` — 347 LOC
- Rôle : base de connaissances statique (Manifeste, Journal, Frameworks, Stack L1→L4, Roadmap 6 phases)
- En-tête JSDoc : "Source de verite : modules/app/data/knowledge.md" + origine "conversion stricte de src/artifacts/fos-knowledge.jsx (archive Phase 2.4)"
- Types locaux : Principle, JournalEntry, Framework, StackSublayer, StackLayer, RoadmapItem
- MANIFESTE const : visionLT, visionCT, modeOperatoire, 4 principes (Coopération, Traçabilité, Évolutivité, Garde-fous)
- JOURNAL : 16 entrées CONV-01→CONV-10 (historique conversations passées)
- FRAMEWORKS : BMAD v6, Claudify, Hybride
- STACK : L1 (Claude.ai + Cowork) files_ready, L2 (Claude Code) configured, L3 (BMAD) installed, L4 (MCP Plugins) connected
- ROADMAP : v0.1 done, phase1 done, phase2 active, phase3-5 pending
- ⚠ Contradiction avec CONTEXT.md qui mentionne "Phase 4 complete" → KnowledgePage retarde (phase2 active)
- ⚠ Pas câblé à knowledge.md : la donnée est dupliquée dans le TSX et le MD (violation règle MD-first)
- ⚠ Dépasse 700 LOC ? Non, 347 — OK

### `LoginPage.tsx` — 149 LOC
- Rôle : auth Supabase, modes login/signup togglables
- Hook : `useAuth()` (AuthContext)
- Password min 8 chars en mode signup uniquement
- Navigate vers `/` si user déjà connecté
- Link vers `/reset-password`
- Gestion error + info states
- Styles inline, pas de Tailwind pur
- ▸ Conforme, minimal, pas de red flag

### `Phase1Demo.tsx` — 545 LOC
- Rôle : suite de tests CRUD automatisés (CREATE/READ/UPDATE/DELETE sessions, décisions, risks, steps)
- Hook : `useCommanderMutations()` + direct `supabase` client
- State : testResults[], isRunning, dbConnectionStatus
- Teste : createSession, createDecision, createNextStep, addRisk, getAllData, updateDecision, markStepDone, deleteSession, clearAllData
- Affiche success rate dynamique
- Utilise `confirm()` natif pour clearAllData
- ⚠ Interdictions CLAUDE.md : plusieurs `console.error` (L34) + `any` explicites (L14, L91, L125, L159, L193…) → violations typage strict
- ⚠ Mélange styles : Tailwind intensif ici (contrairement aux autres pages qui utilisent inline) → incohérence
- ⚠ Ajoute un champ `timestamp: Date.now()` à l'objet TestResult alors que le type ne le déclare pas
- ⚠ Plus grosse page du projet (545 LOC) → dépasse la moitié du seuil 700
- Red flag global : page de debug/dev qui devrait être garded par env dev, pas exposée en /phase1-demo en prod

### `ResetPasswordPage.tsx` — 155 LOC
- Rôle : reset password 2 modes (anonyme = demande lien / authentifié = set nouveau mdp)
- Hooks : useAuth, useNavigate
- Utilise `supabase.auth.resetPasswordForEmail` + `supabase.auth.updateUser`
- redirectTo construit depuis `window.location.origin`
- Styles inline consolidés en const en tête
- ▸ Propre, minimal, pas de red flag

---

## Synthèse pages

| Page | LOC | Data source | Red flags |
|---|---|---|---|
| Commander | 117 | useCommander (Supabase) | lastSync hardcodé |
| Dashboard | 258 | useCommander (Supabase) | duplication Commander, reimplémente panels |
| IndexPage | 257 | statique | aucun |
| KnowledgePage | 347 | statique (pas de fetch knowledge.md) | contradiction roadmap vs CONTEXT.md, violation MD-first |
| LoginPage | 149 | useAuth | aucun |
| Phase1Demo | 545 | supabase direct + mutations | `any` explicites, console.error, exposée en prod, plus gros fichier |
| ResetPasswordPage | 155 | supabase direct | aucun |
| **Total pages** | **1828** | | |

---

## Composants généraux (src/components/)

### `Badge.tsx` — 21 LOC
- Mini pill coloré (variant + label), Void Glass OK. ▸ Conforme.

### `Card.tsx` — 28 LOC
- Wrapper div avec border rgba(255,255,255,.055), background rgba(255,255,255,.025), padding 20px. ▸ Conforme.

### `StatPill.tsx` — 16 LOC
- Pill JetBrains Mono pour afficher une valeur numérique + label. ▸ Conforme.

### `TabBar.tsx` — 31 LOC
- Barre d'onglets contrôlée, active = turquoise #5EEAD4, inactive = #52525B. Props `tabs[] + activeId + onChange`. ▸ Conforme.

### `Layout.tsx` — 96 LOC
- Exports : `Layout`, `PageContainer`, `PageHeader`, `Footer`
- PageHeader : title + subtitle + version + meta (lastSync etc.)
- Footer : 3 pills (Prototype honnête / CRUD Supabase réel / Zero features simulées) + version
- ⚠ Duplique le pattern du Footer d'IndexPage → cohérence partielle (IndexPage n'utilise PAS Layout)
- Void Glass strict OK

### `Navbar.tsx` — 117 LOC
- Sticky nav, 4 NavLink (Home/Commander/Knowledge/Dashboard), bouton Déconnexion
- Hide si `!user` ou pathname=/login
- Active state : turquoise + border-bottom
- ⚠ Pas de lien vers /phase1-demo ni /crud-test alors que ces routes existent → incohérence
- Void Glass OK

### `SupabaseCRUDTest.tsx` — 425 LOC
- Composant inline de tests CRUD (vs Phase1Demo qui est une page complète)
- 7 `console.*` calls (violation anti-bullshit)
- Tailwind intensif (incohérence avec inline-style des pages)
- ⚠ Duplication fonctionnelle avec Phase1Demo.tsx → 2 outils CRUD test pour la même chose
- Red flag : candidat à suppression ou fusion avec Phase1Demo

---

## Commander panels (src/components/Commander/)

| Panel | LOC | Data | Red flags |
|---|---|---|---|
| ContextPanel | 26 | contextBlocks[] | aucun |
| DecisionsPanel | 32 | decisions[] + onEdit | aucun |
| DocsPanel | 32 | docs[] | aucun |
| NextStepsPanel | 51 | nextSteps[] + actions | aucun |
| RisksPanel | 39 | risks[] | aucun |
| SessionsPanel | 37 | sessions[] | aucun |
| StatsBar | 43 | compteurs | aucun |

▸ Tous conformes Void Glass, compositionnels, petits, lisibles. Zone saine du projet.

---

## Forms (src/components/forms/)

### `AddSessionForm.tsx` — 190 LOC
- Form contrôlé → createSession via useCommanderMutations
- ⚠ 1 `any` explicite (catch err) + 1 console.error
- Styles inline consolidés

### `EditDecisionModal.tsx` — 225 LOC
- Modal contrôlée, updateDecision
- ⚠ 1 `any` (catch) + 1 console.error
- Portal-like (fixed overlay)

### `NextStepActions.tsx` — 236 LOC
- Actions sur un next_step : markDone, delete
- ⚠ 7 `console.*` calls
- ⚠ **TODO ligne 54** : "implement updateStep for non-done transitions" → feature incomplète documentée dans le code
- Red flag : plus gros form + plus de console calls que les autres

---

## Lib (src/lib/)

### `supabase.ts` — 17 LOC
- `createClient(url, anonKey)` depuis env Vite
- console.warn si env manquante
- ▸ Propre, minimal.

### `database.types.ts` — 175 LOC
- Type `Database` complet pour 6 tables (sessions, decisions, risks, next_steps, context_blocks, docs)
- Row/Insert/Update pour chaque
- Types de convenance exportés : Session, Decision, Risk, Doc, ContextBlock, NextStep
- ▸ Conforme, généré proprement.

### `useCommander.ts` — 157 LOC
- Hook qui fetch 6 tables en parallèle via Promise.all
- Fallback SEED quand erreur OU données vides
- SEED : 5 sessions + 12 décisions + 4 risks + 11 docs + 4 context blocks + 5 next_steps **hardcodés dans le fichier**
- `source: 'supabase' | 'seed'` exposé
- ⚠ SEED data = violation MD-first : la donnée de démo est dans le TS, pas dans un MD sourcé
- ⚠ Pas de distinction "pas de user / pas de connexion / vraie erreur" → tout devient SEED

### `mutations.ts` — 309 LOC
- Hook `useCommanderMutations`
- Méthodes : createSession, updateSession, deleteSession, createDecision, updateDecision, markStepDone, createNextStep, batchCreateNextSteps, addRisk, updateRisk, addContext, getAllData, clearAllData
- ⚠⚠ **21 `any` explicites** (records, payloads, erreurs)
- ⚠⚠ **25 `console.*` calls**
- Red flag MAJEUR : ce fichier viole directement les règles CLAUDE.md (anti-bullshit + typage strict). **Candidat #1 au refactor.**

### `AuthContext.tsx` — 61 LOC
- AuthProvider + useAuth hook
- Abstrait supabase.auth : signIn, signUp, signOut, user, loading
- supabase.auth.onAuthStateChange subscription propre
- ▸ Propre, minimal, zéro red flag.

---

## Tests (src/test/)

| Fichier | LOC | Couvre | Red flags |
|---|---|---|---|
| setup.ts | 1 | import jest-dom | aucun |
| app.test.tsx | 15 | IndexPage render title | test surface uniquement |
| supabase.test.ts | 18 | client + 6 tables typées | smoke test |
| useCommander.test.ts | 91 | SEED fallback (empty/error) + supabase OK | 3 tests, OK |
| AuthContext.test.tsx | 93 | signIn ok/ko, signUp, signOut | 4 tests, OK |
| forms.test.tsx | 96 | AddSessionForm + NextStepActions | couverture partielle |
| mutations.test.ts | 89 | create/update/delete session uniquement | **couvre ~3/13 méthodes de mutations.ts** |
| mocks/supabase.ts | 58 | helpers createSupabaseMock + queryBuilder | OK |

**Total tests : 361 LOC**

▸ Red flag : mutations.ts = 309 LOC de code avec 13 méthodes → seules 3 testées (~23% couverture). Les méthodes critiques (markStepDone, batchCreateNextSteps, clearAllData, addRisk) ne sont pas testées.

---

## Synthèse transverse S1

### Architecture observée

- **Pattern principal** : page React → hook `useCommander()` → Supabase (6 tables) → fallback SEED hardcodé
- **State management** : local `useState` + hooks custom, **pas de Redux/Zustand/Jotai** (cohérent avec prototype)
- **Styles** : **mix incohérent** inline-style (pages) + Tailwind (Phase1Demo, SupabaseCRUDTest) + classes CSS custom (index.css)
- **Auth** : AuthContext propre, RLS-ready
- **Routing** : react-router-dom, routes : /, /login, /reset-password, /commander, /knowledge, /dashboard, /crud-test, /phase1-demo

### Écarts Void Glass

- ▸ Core strict : `index.css` + composants Commander = OK, zéro couleur interdite
- ⚠ Coexistence Tailwind + inline-style → pas de source unique de design tokens côté code
- ⚠ Pas de fichier `design-tokens.ts` ou similaire → valeurs Void Glass dupliquées (couleurs, tailles, fonts) dans N fichiers
- ⚠ Les forms et Phase1Demo ont leur propre façon de faire

### Red flags globaux (par sévérité)

◆ **CRITIQUES** (violation CLAUDE.md directe)
1. `lib/mutations.ts` — 21 `any` + 25 `console.*` → viole anti-bullshit + typage strict
2. `pages/Phase1Demo.tsx` — 545 LOC + plusieurs `any` + exposée en prod
3. `pages/KnowledgePage.tsx` — 347 LOC de data hardcoded → viole MD-first
4. `pages/KnowledgePage.tsx` — roadmap "phase2 active" **contredit CONTEXT.md "Phase 4 complete"**

◆ **MAJEURS** (dette technique)
5. `pages/Dashboard.tsx` — ~120 LOC dupliquées de Commander.tsx (SessionsSection, DecisionsSection…)
6. `components/SupabaseCRUDTest.tsx` — doublon fonctionnel avec Phase1Demo.tsx (2 outils pour le même job)
7. `lib/useCommander.ts` — SEED data hardcodée = violation MD-first en interne
8. `components/Navbar.tsx` — pas de lien vers /phase1-demo et /crud-test (routes orphelines)
9. Tests mutations.ts — ~23% couverture (3/13 méthodes)

◆ **MINEURS** (hygiène)
10. `pages/Commander.tsx` — lastSync hardcodé 2026-04-04 (dérive vs aujourd'hui 2026-04-07)
11. `components/forms/NextStepActions.tsx` — TODO ligne 54 "implement updateStep for non-done transitions"
12. `forms/*` — `any` dans catch blocks + console.error
13. Mix stylistique (inline vs Tailwind vs CSS) sans règle documentée

### Fichiers > 700 LOC

**Zéro.** Le plus gros fichier est Phase1Demo.tsx à **545 LOC**. Règle CLAUDE.md respectée.

### Fichiers > 300 LOC (zone à surveiller)

- Phase1Demo.tsx 545
- SupabaseCRUDTest.tsx 425
- KnowledgePage.tsx 347
- mutations.ts 309

### Violations MD-first

- `KnowledgePage.tsx` : manifeste/journal/frameworks/stack/roadmap hardcoded dans le TSX alors que `data/knowledge.md` existe
- `useCommander.ts` : SEED data hardcodée (pourrait venir d'un seed.md ou seed.json versionné)

### Questions ouvertes à lever en S2/S3

1. La route /phase1-demo est-elle volontairement exposée en prod ou doit-elle être env-gated ?
2. Dashboard.tsx vs Commander.tsx — garder les deux ou fusionner ?
3. SupabaseCRUDTest.tsx vs Phase1Demo.tsx — garder les deux ou fusionner ?
4. knowledge.md est-il vraiment la source de vérité ou le TSX l'est ?
5. Roadmap réelle : phase2 (KnowledgePage) ou phase4 (CONTEXT.md) ? → à résoudre en S3 en lisant CONTEXT.md + plans
6. Pourquoi mutations.ts n'a pas été typé strictement alors que database.types.ts fournit tous les types nécessaires ?

### État S1

- Pages lues : **7/7** ✓
- Composants généraux : **8/8** ✓
- Commander panels : **7/7** ✓
- Forms : **3/3** ✓
- Lib : **5/5** ✓
- Tests : **8/8** ✓ (incluant mocks)
- Entrée/config : **3/3** ✓

**Total lu : 41 fichiers code + 2 config = 43/43 ✓**

▸ S1 complet. Scratchpad verrouillé. Prochaine étape : S2 — ops layer (commands, agents, scripts, hooks, workflows).
