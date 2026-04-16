# 06 — Plan d'execution

> ⚠️ **Mise a jour 2026-04-13** : ce fichier reste la reference pour le **detail de chaque bloc B1-B40** (livrables, observables, dependances). Mais la **sequence d'execution consolidee** (incluant les 6 blocs bonus de 09 §11 et les 9 blocs DS de 13 §8, et levant les gates G1/G2) vit desormais dans `14-plan-execution-consolide.md`. Le CLI doit lire 14 en premier puis venir ici pour les details.

## 1. Philosophie d'execution

Ce plan est destine a **Claude Code CLI** (dev-agent principalement). Il respecte les regles Foundation OS :

- Decoupage en sessions courtes (anti-compactage, max ~30 min / bloc)
- Un bloc = un livrable observable (build vert, route accessible, composant rendu)
- Routing modele explicite (haiku / sonnet / opus) avec justification
- Regle sub-agent : zone isolee + faits observables + pas besoin memoire globale → sub-agent. Sinon → main.
- Plan avant execution : chaque bloc demarre par validation Kevin si non-trivial
- Zero bullshit : pas de "TERMINE" sans `npm run build` + test manuel + screenshot

## 2. Vue d'ensemble — Phases

| Phase | Objectif | Blocs | Duree estimee | Modele dominant |
|-------|----------|-------|---------------|-----------------|
| P1 | Fondations techniques | B1-B4 | ~2h | sonnet |
| P2 | Parsers et utilitaires | B5-B9 | ~2h30 | sonnet + sub-agents haiku |
| P3 | Composants custom | B10-B16 | ~3h30 | sonnet |
| P4 | Pages Observer | B17-B22 | ~4h | sonnet |
| P5 | Pages Piloter | B23-B27 | ~3h | sonnet |
| P6 | Pages Communiquer (Lab) | B28-B32 | ~3h30 | sonnet |
| P7 | Integration session-start/end | B33-B35 | ~1h30 | sonnet |
| P8 | Polissage et livraison | B36-B40 | ~2h30 | sonnet + opus pour revue |
| **TOTAL** | | **40 blocs** | **~22h** | |

Soit environ **8 a 10 sessions** de travail (~2h30 chacune), sur 2 a 3 semaines selon rythme.

## 3. Detail par phase

### Phase 1 — Fondations techniques (~2h)

**Objectif** : preparer le terrain dans `modules/app/` sans rien casser.

#### B1 — Arborescence des routes
- **Livrable** : 10 nouvelles routes declarees dans `modules/app/src/App.tsx` (pulse, modules, arsenal, plans, knowledge, lab, design-system, sessions, memory, home dashboard). Placeholder page par route.
- **Modele** : sonnet
- **Sub-agent** : non (touche App.tsx, fichier central)
- **Fin observable** : `npm run build` vert, chaque route rend un placeholder "Page X — WIP"
- **Dependances** : aucune

#### B2 — Layout dashboard avec sidebar 3 zones
- **Livrable** : `modules/app/src/layouts/DashboardLayout.tsx` etend le layout existant Figma Make avec sidebar structuree en 3 zones (OBSERVER / PILOTER / COMMUNIQUER). Badges dynamiques placeholder (0).
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : sidebar visible sur toutes les routes, collapsible, zones distinctes, screenshot
- **Dependances** : B1

#### B3 — Header avec breadcrumb et Cmd+K placeholder
- **Livrable** : composant Header avec breadcrumb dynamique (hook `useBreadcrumb`), bouton search qui ouvre dialog vide
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : breadcrumb correct sur chaque route, Cmd+K ouvre un dialog
- **Dependances** : B2

#### B4 — Footer contextuel
- **Livrable** : barre d'etat en bas affichant status verrou (placeholder), branche git (placeholder), dernier commit (placeholder). Donnees reelles en B9.
- **Modele** : haiku
- **Sub-agent** : oui (composant isole, pas de contexte global)
- **Fin observable** : footer visible, style Void Glass
- **Dependances** : B2

### Phase 2 — Parsers et utilitaires (~2h30)

**Objectif** : construire les fonctions qui lisent les sources de donnees. Tous testables independamment.

#### B5 — Parser CONTEXT.md
- **Livrable** : `modules/app/src/lib/parsers/contextMd.ts` avec `parseContextMd(content: string): ContextData`. Interface TypeScript complete (modules, sessions, cap, ideas, decisions, metrics, risks, mcp, tools).
- **Modele** : sonnet
- **Sub-agent** : oui (zone isolee, testable unitairement)
- **Fin observable** : test unitaire `contextMd.test.ts` passe sur le CONTEXT.md reel
- **Dependances** : aucune

#### B6 — Parser plans (frontmatter YAML + corps MD)
- **Livrable** : `modules/app/src/lib/parsers/planMd.ts`. Utilise `gray-matter` pour le frontmatter, parse les checkboxes pour calculer progression.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : parse les 8 plans reels, retourne status + progression correcte
- **Dependances** : aucune

#### B7 — Parser tools/index.json + routing.json
- **Livrable** : `modules/app/src/lib/parsers/tools.ts`. Import direct JSON, types TS pour les 98 outils et 26 regles.
- **Modele** : haiku
- **Sub-agent** : oui (trivial, JSON deja structure)
- **Fin observable** : retourne 98 outils groupes en 9 categories
- **Dependances** : aucune

#### B8 — Parser session-lock
- **Livrable** : `modules/app/src/lib/parsers/sessionLock.ts`. Lit `.fos-session.lock`, retourne owner/acquiredAt/ttl/active.
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : test sur lockfile present et absent
- **Dependances** : aucune

#### B9 — Executor commandes shell (health-check, git)
- **Livrable** : `modules/app/src/lib/executors/shell.ts`. Wrapper qui execute `bash scripts/health-check.sh`, `git status`, `git log` cote client (via API Node si SSR, sinon via fichier statique pre-genere). **Decision requise Kevin** : API server-side ou pre-generation ?
- **Modele** : sonnet
- **Sub-agent** : non (decision architecturale)
- **Fin observable** : peut retourner un verdict health-check reel
- **Dependances** : aucune. **Gate** : validation Kevin sur la strategie.

### Phase 3 — Composants custom (~3h30)

**Objectif** : les 7 composants specifiques au dashboard, reutilisables partout.

#### B10 — HealthRing
- **Livrable** : `modules/app/src/components/dashboard/HealthRing.tsx`. SVG anime, props `verdict: 'SAIN' | 'DEGRADED' | 'BROKEN'`, `indicators: Array<{...}>`. Couleurs DS, rotation subtle 20s.
- **Modele** : sonnet
- **Sub-agent** : oui (composant isole)
- **Fin observable** : story Storybook avec 3 etats + screenshot
- **Dependances** : aucune

#### B11 — ModuleCard
- **Livrable** : carte pour module avec Badge status + Progress + metriques. Consomme Card/Badge/Progress du DS.
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : story avec 3 variants (actif, prevu, idee)
- **Dependances** : aucune

#### B12 — PlanCard
- **Livrable** : carte plan avec progression, status, blocs expandables.
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : story avec plan reel parse (B6)
- **Dependances** : B6

#### B13 — IdeaCard
- **Livrable** : carte idee avec inline edit (contenteditable). Actions Transformer / Archiver.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : edition fonctionne, blur sauvegarde (vers localStorage pour l'instant, fichier en B28)
- **Dependances** : aucune

#### B14 — InboxMessage
- **Livrable** : bulle message avec avatar, date, MD render, status lu/non lu.
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : story avec 3 messages
- **Dependances** : aucune

#### B15 — TokenSwatch
- **Livrable** : visualisation d'un token DS (couleur / typo / space) avec preview.
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : rendu correct des 3 variants
- **Dependances** : aucune

#### B16 — SearchCommand (Cmd+K)
- **Livrable** : command palette avec Fuse.js, index en memoire. Ouvre avec Cmd+K, navigation clavier.
- **Modele** : sonnet
- **Sub-agent** : non (integration globale)
- **Fin observable** : Cmd+K ouvre, recherche fuzzy fonctionne sur ~5 sources de test
- **Dependances** : B5, B6, B7

### Phase 4 — Pages Observer (~4h)

**Objectif** : Home, Pulse, Modules, Arsenal, Design System.

#### B17 — Page Home (dashboard)
- **Livrable** : `/` affiche HealthRing + SessionActive + ModuleCards + PlansEnCours + QuickActions + IdeesRecentes + InboxPreview.
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : screenshot du dashboard avec donnees reelles parse
- **Dependances** : B5, B6, B10, B11, B12, B14

#### B18 — Page Pulse + sous-pages
- **Livrable** : `/pulse` verdict global + seuils + indicateurs. Sous-pages modules/core-os/history.
- **Modele** : sonnet
- **Sub-agent** : oui pour sous-pages individuelles
- **Fin observable** : verdict reel affiche, bouton "re-executer" fonctionne
- **Dependances** : B9, B10

#### B19 — Page Modules + detail
- **Livrable** : `/modules` catalogue 3 sections (Actifs / Prevus / Idees). Detail par module avec brief editable.
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : App Builder et DS affiches, brief editable pour Finance/Sante
- **Dependances** : B11

#### B20 — Page Arsenal + tabs
- **Livrable** : `/arsenal` avec tabs Skills / Agents / Commands / Scripts / Plugins / MCP. Filtre par domaine via URL param.
- **Modele** : sonnet
- **Sub-agent** : oui par tab
- **Fin observable** : 98 outils affiches, filtres URL fonctionnent
- **Dependances** : B7

#### B21 — Page Design System + sous-pages
- **Livrable** : `/design-system` palette / tokens / composants. 46 composants listes avec preview.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : tous les tokens semantic rendus, composants cliquables
- **Dependances** : B15

#### B22 — Integration footer reel
- **Livrable** : footer affiche verdict reel + branche git + dernier commit
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : donnees reelles visibles
- **Dependances** : B4, B8, B9

### Phase 5 — Pages Piloter (~3h)

#### B23 — Page Plans catalogue + Kanban
- **Livrable** : `/plans` avec vue liste + Kanban drag & drop. 4 colonnes status.
- **Modele** : sonnet
- **Sub-agent** : non (drag & drop global)
- **Fin observable** : drag carte entre colonnes met a jour le fichier plan (frontmatter)
- **Dependances** : B6, B12

#### B24 — Page Plan detail
- **Livrable** : `/plans/[slug]` avec progression bloc par bloc, log execution, modeles utilises.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : plan DS shadcn finition affiche correctement F1-F9
- **Dependances** : B6

#### B25 — Page Knowledge + sous-pages
- **Livrable** : `/knowledge` specs / docs / decisions / travaux. Accordions, recherche locale.
- **Modele** : sonnet
- **Sub-agent** : oui par sous-page
- **Fin observable** : toutes les specs et decisions affichees, deep link fonctionne
- **Dependances** : aucune

#### B26 — Page Sessions + sous-pages
- **Livrable** : `/sessions` current / history / git.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : session en cours affichee, historique git log 20 derniers commits
- **Dependances** : B8, B9

#### B27 — Page Memory + sous-pages
- **Livrable** : `/memory` context / auto / learning. Preview CONTEXT.md avec metriques (taille, L/150).
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : CONTEXT.md rendu, auto-memory lue, routing.json visualise
- **Dependances** : B5, B7

### Phase 6 — Pages Communiquer / Lab (~3h30)

**Objectif** : partie bidirectionnelle (ecriture Kevin).

#### B28 — Infrastructure data/ (fichiers MD)
- **Livrable** : creer `modules/app/data/{ideas,notes,inbox,briefs,feedback}/.gitkeep`. Fonctions read/write wrappees dans `modules/app/src/lib/data/*.ts`.
- **Modele** : sonnet
- **Sub-agent** : non (decision de persistance)
- **Fin observable** : ecrire un idea depuis la UI cree un vrai fichier MD avec frontmatter
- **Dependances** : B9 (executor shell ou API)
- **Gate** : validation Kevin sur API vs fichier direct

#### B29 — Page Lab / ideas
- **Livrable** : `/lab/ideas` liste des ideas + creation inline (Cmd+I). Inline edit fonctionnel.
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : creer, editer, archiver une idee persiste en fichier
- **Dependances** : B13, B28

#### B30 — Page Lab / notes
- **Livrable** : `/lab/notes` notes libres par module ou global. MD editor.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : creer une note, ecrire, rafraichir, note persistee
- **Dependances** : B28

#### B31 — Page Lab / inbox
- **Livrable** : `/lab/inbox` timeline messages Kevin <-> Claude. Ecrire un message cree un fichier.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : message persisted, read: true apres ouverture
- **Dependances** : B14, B28

#### B32 — Page Lab / briefs
- **Livrable** : `/lab/briefs` briefs futurs modules (Finance, Sante) editables.
- **Modele** : sonnet
- **Sub-agent** : oui
- **Fin observable** : brief Finance editable et persiste
- **Dependances** : B28

### Phase 7 — Integration session-start / session-end (~1h30)

**Objectif** : boucler le cercle, rendre le dashboard vraiment dynamique.

#### B33 — Extension session-start.md
- **Livrable** : editer `.claude/commands/session-start.md` pour ajouter Phase 1b (lire inbox, ideas, feedback nouveaux). Zero code, juste prompt.
- **Modele** : sonnet
- **Sub-agent** : non (touche commande critique)
- **Fin observable** : relire la commande, valider avec Kevin
- **Dependances** : B28, B29, B31

#### B34 — Extension session-end.md
- **Livrable** : editer `.claude/commands/session-end.md` pour Phase 3b (creer message Claude, marquer inbox lue).
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : test E2E : session-start lit nouveaux messages, session-end ecrit resume
- **Dependances** : B33

#### B35 — Test E2E integration
- **Livrable** : faire une vraie session courte CLI, verifier que le dashboard reflete les changements.
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : screenshot avant/apres, message Claude visible dans `/lab/inbox`
- **Dependances** : B34

### Phase 8 — Polissage et livraison (~2h30)

#### B36 — Command Palette final
- **Livrable** : Cmd+K indexe TOUT (decisions, plans, specs, outils, skills, notes, idees, messages, composants DS).
- **Modele** : sonnet
- **Sub-agent** : non
- **Fin observable** : recherche "ring" trouve HealthRing, recherche "finance" trouve module + brief
- **Dependances** : B16

#### B37 — Animations et motion final
- **Livrable** : fade-in staggered, orbes background, glow cards uniformes.
- **Modele** : haiku
- **Sub-agent** : oui
- **Fin observable** : screenshot animation en cours
- **Dependances** : toutes les pages

#### B38 — Accessibilite WCAG AA
- **Livrable** : audit a11y complet, fix contrastes, aria-labels, focus visible.
- **Modele** : sonnet
- **Sub-agent** : oui via skill a11y-specialist
- **Fin observable** : axe-core zero erreur critique, navigation clavier complete
- **Dependances** : toutes les pages

#### B39 — Revue globale (opus)
- **Livrable** : revue complete cross-module par review-agent / opus. Coherence Void Glass, zero regression, anti-bullshit.
- **Modele** : **opus** (jugement large, memoire projet)
- **Sub-agent** : non (besoin contexte global)
- **Fin observable** : rapport review-agent sans red flag
- **Dependances** : B38

#### B40 — Documentation et deploy
- **Livrable** : update CONTEXT.md (module dashboard integre), update README, deploy Vercel. Ajouter ligne Travaux Cowork dans CONTEXT.md.
- **Modele** : sonnet
- **Sub-agent** : non (touche CONTEXT.md)
- **Fin observable** : dashboard en prod sur foundation-os.vercel.app, URL accessible
- **Dependances** : B39

## 4. Routing modele — resume

| Niveau | Modele | Justification | Nombre blocs |
|--------|--------|---------------|--------------|
| Composants isoles, parsers, stories | haiku | Faible complexite, zone isolee | 9 |
| Pages, integrations, decisions | sonnet | Standard projet, contexte moyen | 29 |
| Revue globale, arbitrages | opus | Memoire et jugement cross-module | 1 |
| Decisions Kevin (architecture) | — | Validation humaine requise | 2 gates |

Total hors gates : 39 blocs (9 haiku + 29 sonnet + 1 opus).

## 5. Gates de validation Kevin

Points d'arret obligatoires AVANT de continuer :

| Gate | Apres bloc | Decision attendue |
|------|-----------|-------------------|
| G1 | B9 | ✅ ARBITREE 2026-04-13 — Option C hybride zero-serveur (cf 14 §1.1) |
| G2 | B28 | ✅ ARBITREE 2026-04-13 — Fichiers MD dans `modules/app/data/` (cf 14 §1.2) |
| G3 | B17 | 🔵 Actif — Review Home dashboard conforme a la vision ? |
| G4 | B35 | 🔵 Actif — Test E2E session flow complet valide ? |
| G5 | B39 | 🔵 Actif — Revue opus : go deploy ? |

## 6. Regle sub-agent appliquee

Rappel des 3 conditions cumulatives (docs/core/planner.md §4) :
1. Zone isolee (pas de contexte global necessaire)
2. Faits observables (test ou build decide)
3. Pas de decision architecturale

Blocs sub-agent OK : **23 blocs** (parsers, composants isoles, stories, sous-pages simples).
Blocs main-agent obligatoires : **17 blocs** (decisions architecturales, integrations globales, CONTEXT.md, commandes CLI).

## 7. Regles de session

- **Jamais plus de 3 blocs par session** pour eviter le compactage
- **Chaque session** : session-start → brief v11 → 2-3 blocs → session-end avec build vert → update CONTEXT.md
- **Verrou** : CLI acquiert le verrou, Cowork lit pendant ce temps sans modifier
- **Commits** : un commit par bloc atomique, conventional commits (`feat(dashboard): ...`)
- **Pas de monolithe** : si un bloc depasse 45 min, splitter en 2 sous-blocs

## 8. Critere de "termine" absolu

Le dashboard est considere termine quand :
- [ ] Toutes les 10 pages principales accessibles et fonctionnelles
- [ ] CONTEXT.md parse et rendu sans erreur sur la Home
- [ ] health-check.sh executable depuis /pulse, verdict reel affiche
- [ ] Cmd+K indexe > 200 elements, recherche < 50ms
- [ ] Creer une idee depuis /lab/ideas cree un fichier MD reel
- [ ] session-start lit les nouveaux messages et les mentionne
- [ ] session-end cree un message Claude dans /lab/inbox
- [ ] Revue opus (B39) sans red flag
- [ ] Deploy Vercel reussi, URL publique fonctionne
- [ ] Zero violation Void Glass (hook validate-void-glass pass)
- [ ] axe-core zero erreur critique
- [ ] CONTEXT.md mis a jour avec le nouveau module

Zero "TERMINE" sans ces 12 cases cochees avec preuve.

## 9. Risques identifies

| Risque | Probabilite | Mitigation |
|--------|-------------|------------|
| Executor shell impossible cote client | Moyenne | Gate G1, fallback pre-generation JSON au build |
| Persistance fichiers MD bloquee par sandbox | Faible | Gate G2, fallback API Node minimaliste |
| Bundle trop gros (> 500kb) | Moyenne | Code splitting par route, lazy loading parsers |
| Incoherence avec DS (tokens manquants) | Faible | DS en 46 composants, eprouve en Phase 7 DS shadcn |
| Session-start/end cassent le CLI existant | Moyenne | B33 en dry-run, test isole avant merge |

## 10. Livraison

Ce plan d'execution (fichier 06) est la source de verite pour le CLI. Claude Code CLI doit :
1. Lire ce fichier avant de demarrer
2. Creer une branche `feat/dashboard-monitoring`
3. Executer les blocs dans l'ordre
4. Respecter les gates
5. Faire un PR par phase (8 PRs) pour que Kevin puisse reviewer
6. Ne pas fusionner tant que Kevin n'a pas valide chaque gate

Fin du plan.
