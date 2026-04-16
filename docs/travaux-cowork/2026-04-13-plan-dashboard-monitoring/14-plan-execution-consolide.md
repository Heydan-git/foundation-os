# 14 — Plan d'execution consolide (source de verite CLI)

Produit par Cowork le 2026-04-13 apres audit de coherence cross-fichiers.

## 0. Statut et role de ce fichier

Ce fichier est la **source de verite unique** pour Claude Code CLI. Il consolide les 3 listes de blocs dispersees dans le plan initial :
- 40 blocs du fichier `06-plan-execution.md`
- 6 blocs bonus de `09-dynamisme-auto-sync.md` §11
- 9 blocs DS de `13-gouvernance-design-system.md` §8

**Total reel : 55 blocs / ~33h / 10-12 sessions de 2h30.**

Le fichier `06-plan-execution.md` reste la source pour le detail de chaque bloc B1-B40 (livrables, observables, dependances). Les fichiers 09 et 13 restent la source pour les blocs `*bis` et `*-DS` / `B-*`. Ce fichier 14 donne **l'ordre d'execution consolide** et **leve les ambiguites**.

## 1. Decisions arbitrees par Kevin (2026-04-13)

### 1.1 Gate G1 — Strategie executor shell (levee)

**Decision** : Claude applique la recommandation du fichier `09-dynamisme-auto-sync.md` §6.4 — **Option C hybride zero-serveur** :
- Dev : Vite HMR + watcher filesystem
- Prod : pre-build snapshot JSON (`public/fos-snapshot.json`) + hook git `post-commit` qui regenere le snapshot
- SSE optionnel derriere flag (`VITE_ENABLE_SSE`) — desactive par defaut

**Impact** : B9 n'est plus bloquant. Le CLI avance. Pas de API Node obligatoire en v1.

### 1.2 Gate G2 — Strategie persistance (levee)

**Decision** : fichiers MD dans `modules/app/data/` avec frontmatter YAML (schema 11 §2.2) :
- `data/ideas/YYYYMMDD-HHMMSS-slug.md`
- `data/inbox/YYYYMMDD-HHMMSS-from.md`
- `data/notes/YYYYMMDD-slug.md`
- `data/briefs/module-X.md`
- `data/settings.json`

Ecriture via API minimaliste Vercel Edge Function (`api/write.ts`) OU via commit direct (CLI) selon contexte. Pas de Supabase pour le dashboard en v1.

**Impact** : B28 n'est plus bloquant. Le CLI avance.

### 1.3 Gates actifs restants

| Gate | Apres bloc | Decision attendue Kevin |
|------|------------|-------------------------|
| G3 | B17 | Review Home dashboard conforme a la vision ? |
| G4 | B35 | Test E2E session flow complet valide ? |
| G5 | B39 | Revue opus : go deploy ? |

## 2. Sequence d'execution consolidee (P1 → P8)

Ordre strict. Un bloc = un livrable observable = un commit. Max 3 blocs par session.

### Phase 1 — Fondations techniques (~2h15)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 1 | B1 — Arborescence 10 routes | 06 | sonnet | non | 30min |
| 2 | **B2-DS** — Alias workspace `@fos/design-system` verifie/etendu | 13 §8 | sonnet | non | 15min |
| 3 | B2 — Layout dashboard + sidebar 3 zones | 06 | sonnet | non | 45min |
| 4 | B3 — Header + breadcrumb + Cmd+K placeholder | 06 | sonnet | non | 30min |
| 5 | B4 — Footer contextuel (placeholder) | 06 | haiku | oui | 15min |
| 6 | **B3-DS** — Motion tokens + status tokens au DS | 13 §8 | sonnet | oui | 30min |

**Gate technique P1** : `npm run build` vert, 10 routes rendent placeholder, sidebar visible, alias DS fonctionne.

### Phase 2 — Parsers, event bus et watcher (~3h30)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 7 | B5 — Parser CONTEXT.md | 06 | sonnet | oui | 45min |
| 8 | B6 — Parser plans (frontmatter + checkboxes) | 06 | sonnet | oui | 45min |
| 9 | B7 — Parser tools/index.json + routing.json | 06 | haiku | oui | 20min |
| 10 | B8 — Parser session-lock | 06 | haiku | oui | 20min |
| 11 | B9 — Executor shell (Option C arbitree G1) | 06 | sonnet | non | 45min |
| 12 | **B9bis** — Watcher FS (Vite HMR dev + polling prod + SSE optionnel) | 09 §11 | sonnet | non | 30min |
| 13 | **B9ter** — EventBus Zustand + Providers (DataProvider, WatcherProvider, BusProvider, LockProvider) | 09 §11 | sonnet | non | 45min |

**Gate technique P2** : tests parseurs verts sur fichiers reels, event bus emet evenements au changement.

### Phase 3 — Composants custom DS (~5h)

Chaque composant nouveau = code + story + test + a11y + Supernova + changelog dans le meme commit (regle 13 §3.3).

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 14 | **B10-DS** — HealthRing dans DS + story + Supernova | 13 §8 | sonnet | oui | 1h |
| 15 | B11 — ModuleCard (composition Card+Badge+Progress) | 06 | haiku | oui | 20min |
| 16 | B12 — PlanCard (composition) | 06 | haiku | oui | 20min |
| 17 | B13 — IdeaCard (composition + inline edit) | 06 | sonnet | oui | 30min |
| 18 | B14 — InboxMessage (composition Card+Avatar) | 06 | haiku | oui | 20min |
| 19 | **B15-DS** — TokenSwatch dans DS + story + Supernova | 13 §8 | sonnet | oui | 1h |
| 20 | **B-STATUS-DOT** — StatusDot primitive DS + story + Supernova | 13 §8 | haiku | oui | 1h |
| 21 | **B-METRIC-GAUGE** — MetricGauge primitive DS + story + Supernova | 13 §8 | sonnet | oui | 1h30 |
| 22 | **B-TIMELINE-ITEM** — TimelineItem primitive DS + story + Supernova | 13 §8 | sonnet | oui | 1h30 |
| 23 | B16 — SearchCommand Cmd+K (Fuse.js global) | 06 | sonnet | non | 45min |

**Gate technique P3** : Storybook build vert, 5 composants DS nouveaux publies Supernova, Cmd+K ouvre et cherche.

### Phase 4 — Pages Observer + auto-sync (~4h30)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 24 | B17 — Page Home | 06 | sonnet | non | 1h |
| 25 | **B17bis** — Hook `useFosSnapshot()` auto-parse mount + re-parse cible sur event | 09 §11 | sonnet | non | 30min |
| 26 | 🚦 **Gate G3** — Review Home avec Kevin | — | — | — | validation |
| 27 | B18 — Page Pulse + sous-pages | 06 | sonnet | oui sous-pages | 45min |
| 28 | B19 — Page Modules + detail | 06 | sonnet | non | 45min |
| 29 | B20 — Page Arsenal + tabs | 06 | sonnet | oui par tab | 45min |
| 30 | **B20bis** — Auto-sync /arsenal/tools sur event `fos:tool-added` | 09 §11 | haiku | oui | 20min |
| 31 | B21 — Page Design System + sous-pages | 06 | sonnet | oui | 45min |
| 32 | B22 — Integration footer reel (lock + git + verdict) | 06 | haiku | oui | 20min |

**Gate technique P4** : 5 pages Observer fonctionnelles avec donnees reelles, auto-sync /arsenal verifie (ajouter un outil → visible sans refresh).

### Phase 5 — Pages Piloter (~3h)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 33 | B23 — Page Plans catalogue + Kanban drag&drop | 06 | sonnet | non | 1h |
| 34 | B24 — Page Plan detail | 06 | sonnet | oui | 30min |
| 35 | B25 — Page Knowledge + sous-pages | 06 | sonnet | oui | 30min |
| 36 | B26 — Page Sessions + sous-pages | 06 | sonnet | oui | 30min |
| 37 | B27 — Page Memory + sous-pages | 06 | sonnet | oui | 30min |

**Gate technique P5** : toutes les 10 pages accessibles et pilotables.

### Phase 6 — Pages Communiquer / Lab (~4h)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 38 | B28 — Infrastructure data/ (MD files, schema G2 arbitree) | 06 | sonnet | non | 45min |
| 39 | **B28bis** — Hook git `post-commit` + regeneration `public/fos-snapshot.json` | 09 §11 | sonnet | oui | 30min |
| 40 | B29 — Page Lab / ideas (CRUD fichier) | 06 | sonnet | non | 45min |
| 41 | B30 — Page Lab / notes | 06 | sonnet | oui | 45min |
| 42 | B31 — Page Lab / inbox | 06 | sonnet | oui | 45min |
| 43 | B32 — Page Lab / briefs | 06 | sonnet | oui | 30min |

**Gate technique P6** : creer une idee/note/message persiste en fichier MD reel, apparait apres commit sans action.

### Phase 7 — Integration session-start/end (~2h)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 44 | B33 — Extension `.claude/commands/session-start.md` (Phase 1b : lire inbox/ideas/feedback nouveaux) | 06 | sonnet | non | 30min |
| 45 | **B33bis** — Mention dans session-end.md : commit = refresh dashboard auto | 09 §11 | haiku | oui | 15min |
| 46 | B34 — Extension session-end.md (Phase 3b : creer message Claude, marquer inbox lue) | 06 | sonnet | non | 30min |
| 47 | B35 — Test E2E integration (session courte reelle, screenshot avant/apres) | 06 | sonnet | non | 30min |
| 48 | 🚦 **Gate G4** — Validation flow E2E avec Kevin | — | — | — | validation |

**Gate technique P7** : session-start lit nouveaux messages, session-end ecrit resume inbox, dashboard refletue.

### Phase 8 — Polissage, compliance DS et livraison (~4h)

| # | Bloc | Source | Modele | Sub-agent | Duree |
|---|------|--------|--------|-----------|-------|
| 49 | B36 — Command Palette final (index TOUT : decisions, plans, outils, skills, notes, ideas, messages, composants DS) | 06 | sonnet | non | 45min |
| 50 | B37 — Animations et motion final (fade-in staggered, orbes, glow) | 06 | haiku | oui | 45min |
| 51 | B38 — Accessibilite WCAG AA (axe-core zero erreur critique) | 06 | sonnet | oui (a11y-specialist) | 1h |
| 52 | **B-DS-AUDIT** — Audit : tout fichier dashboard importe `@fos/design-system/*` uniquement | 13 §8 | sonnet | oui | 1h |
| 53 | **B-DS-SYNC** — Verification finale Storybook + Supernova alignes + changelog DS coherent | 13 §8 | sonnet | oui | 45min |
| 54 | B39 — Revue globale opus (coherence Void Glass, zero regression, anti-bullshit) | 06 | **opus** | non | 45min |
| 55 | 🚦 **Gate G5** — Validation revue opus avec Kevin | — | — | — | validation |
| 56 | B40 — Deploy + update CONTEXT.md + README dashboard | 06 | sonnet | non | 30min |

**Gate technique P8 (livraison)** : 12 criteres de "termine absolu" coches avec preuve (cf 06 §8).

## 3. Routing modele — consolide

| Niveau | Blocs | Nombre |
|--------|-------|--------|
| haiku | B4, B7, B8, B11, B12, B14, B22, B37, B20bis, B33bis, B-STATUS-DOT | 11 |
| sonnet | tout le reste (y compris nouveaux DS et bonus auto-sync) | 40 |
| opus | B39 | 1 |
| gates validation Kevin | G3, G4, G5 | 3 (hors blocs) |

**Total blocs executes : 52** (+ 3 gates validation humaine). 55 blocs si on compte chaque ligne de la sequence.

## 4. Regle sub-agent — rappel

Reference officielle : `docs/core/planner.md` §4 (routing sub-agent). Voir aussi `docs/core/cortex.md` pour le routing global signaux → agents.

3 conditions cumulatives pour sub-agent :
1. Zone isolee (pas de contexte global necessaire)
2. Faits observables (test ou build decide)
3. Pas de decision architecturale

Blocs sub-agent OK dans cette sequence : **29 blocs** (parsers, composants isoles, stories, sous-pages simples, audits isoles).
Blocs main-agent obligatoires : **23 blocs** (decisions architecturales, integrations globales, CONTEXT.md, commandes CLI, revue opus).

## 5. Regles de session (rappel)

- Jamais plus de 3 blocs par session (anti-compactage)
- Chaque session : `session-start` → brief v11 → 2-3 blocs → `session-end` avec build vert → update CONTEXT.md
- Verrou : CLI acquiert le verrou, Cowork lit sans modifier
- Commits : un commit par bloc atomique, conventional commits (`feat(dashboard): ...`)
- Creation composant DS = code + story + test + a11y + Supernova + changelog dans le **meme commit** (regle 13 §3.3, non-negociable)

## 6. Criteres "termine absolu" (12 cases)

- [ ] Toutes les 10 pages principales accessibles et fonctionnelles
- [ ] CONTEXT.md parse et rendu sans erreur sur la Home
- [ ] health-check.sh executable depuis /pulse, verdict reel affiche
- [ ] Cmd+K indexe > 200 elements, recherche < 50ms
- [ ] Creer une idee depuis /lab/ideas cree un fichier MD reel
- [ ] session-start lit les nouveaux messages et les mentionne
- [ ] session-end cree un message Claude dans /lab/inbox
- [ ] Revue opus (B39) sans red flag
- [ ] Deploy Vercel reussi, URL publique fonctionne
- [ ] Zero violation Void Glass (hook `validate-void-glass.sh` pass)
- [ ] axe-core zero erreur critique
- [ ] CONTEXT.md mis a jour avec le nouveau module dashboard

Plus les 10 criteres "dashboard vivant" du fichier 09 §12 et les 10 de compliance DS du fichier 13 §9.

## 7. Risques et mitigations (resume)

| Risque | Mitigation |
|--------|------------|
| CLI oublie un bloc bonus (09 §11 ou 13 §8) | Ce fichier 14 fusionne toutes les listes en une seule sequence |
| Composant DS cree sans Storybook/Supernova | Regle 13 §3.3 "meme commit" + B-DS-SYNC en P8 |
| Bundle > 500kb | Code splitting par route, lazy loading parsers |
| Auto-sync laggy (trop d'evenements) | Throttle 200ms, re-parse cible uniquement (B17bis) |
| Incoherence tokens dashboard vs DS | `validate-void-glass.sh` en pre-commit + B-DS-AUDIT en P8 |
| Ecriture concurrente CLI/Cowork | Verrou `.fos-session.lock` obligatoire (deja en place) |

## 8. Livraison CLI — protocole

Claude Code CLI doit :
1. Lire CE fichier 14 comme sequence d'execution
2. Lire `06-plan-execution.md` pour le detail de chaque bloc B1-B40
3. Lire `09-dynamisme-auto-sync.md` pour le detail des blocs `*bis` et principes auto-sync
4. Lire `13-gouvernance-design-system.md` pour le detail des blocs DS et process composant
5. Creer une branche `feat/dashboard-monitoring`
6. Executer les 52 blocs dans l'ordre P1 → P8
7. Respecter les 3 gates G3/G4/G5 (validation Kevin)
8. Un PR par phase (8 PRs) pour review progressive
9. Aucun merge tant que Kevin n'a pas valide chaque gate

## 9. Liens de reference

- Detail blocs B1-B40 : `06-plan-execution.md`
- Detail blocs `*bis` et regles auto-sync : `09-dynamisme-auto-sync.md` §3, §6, §11
- Detail blocs `*-DS` / `B-*` et process composant : `13-gouvernance-design-system.md` §3, §8
- Types TS et architecture tech : `11-tech-data-qa-security.md` §1
- Schemas data (ideas, inbox, notes, briefs) : `11-tech-data-qa-security.md` §2
- A11y checklist : `08-ux-ergonomie-a11y.md`
- Motion tokens et microcopy : `10-motion-microcopy-details.md`
- Roadmap post-v1 : `12-roadmap-metrics-futur.md`

Fin du plan consolide.
