# 03 — Detail de chaque page

Specification exhaustive : contenu, composants, sources de donnees, interactions.

---

## PAGE 1 : Home — Nerve Center (`/`)

**Role** : Vue synoptique de l'OS entier en un seul ecran. Kevin ouvre le dashboard, il voit tout en 5 secondes.

### Layout

```
+--------------------------------------------------+
|  HEALTH RING          |  SESSION ACTIVE           |
|  (cercle anime        |  Verrou : CLI / Cowork    |
|   SAIN/DEGRADED/      |  Depuis : il y a 12 min   |
|   BROKEN avec         |  Derniere action : ...     |
|   sous-indicateurs)   |  Cap : ...                 |
+--------------------------------------------------+
|  MODULES (cards miniatures)                       |
|  [App Builder]  [Design System]  [+Finance]       |
|   OK 253ms       46 comps         prevu           |
|   19/19 tests    tokens OK                        |
+--------------------------------------------------+
|  PLANS EN COURS        |  DERNIERE SESSION         |
|  [=====----] Finition  |  [DONE_WITH_CONCERNS]     |
|  [====-----] DS F8-F9  |  DS finition F1-F7        |
|                         |  il y a 6h                |
+--------------------------+-------------------------+
|  QUICK ACTIONS          |  IDEES RECENTES           |
|  [+ Idee] [+ Note]     |  - MCP custom CONTEXT.md  |
|  [Plan-os] [Sync]      |  - Agent SDK Anthropic    |
|                         |  - Supabase MCP           |
+--------------------------------------------------+
|  INBOX (si messages)                               |
|  [!] 1 message de Claude en attente               |
+--------------------------------------------------+
```

### Composants

| Composant | Donnees | Source |
|-----------|---------|--------|
| HealthRing | Verdict global (SAIN/DEGRADED/BROKEN), indicateurs par categorie | `scripts/health-check.sh` output parse |
| SessionActive | Verrou actif, owner, TTL, derniere action | `.fos-session.lock` + CONTEXT.md Cap |
| ModuleCards | Nom, status, build time, tests, metriques cles | CONTEXT.md Modules + `npm run build` output |
| PlansEnCours | Plans avec status "executing", barre de progression | `docs/plans/*.md` frontmatter |
| DerniereSession | Status, resume, date | CONTEXT.md Sessions recentes[0] |
| QuickActions | Boutons raccourcis vers actions frequentes | Statique (liens) |
| IdeesRecentes | 3 dernieres idees du parking | CONTEXT.md Idees & Parking |
| InboxPreview | Nombre de messages non lus | `modules/app/data/inbox.md` (a creer) |

### Interactions
- Clic sur HealthRing → `/pulse`
- Clic sur un module → `/modules/[slug]`
- Clic sur un plan → `/plans/[slug]`
- Clic sur "+ Idee" → ouvre un modal d'ecriture, sauvegarde dans fichier MD
- Clic sur Inbox → `/lab/inbox`

---

## PAGE 2 : Pulse — Sante temps reel (`/pulse`)

**Role** : Dashboard de monitoring pur. Equivalent visuel de `health-check.sh`.

### Layout

```
+--------------------------------------------------+
|  VERDICT GLOBAL : SAIN                           |
|  Derniere verification : 2026-04-13 14:30         |
+--------------------------------------------------+
|                                                    |
|  --- CRITICAL ---                                  |
|  [OK] Build modules/app (253ms)                   |
|  [OK] Build modules/design-system (tokens)        |
|  [OK] Structure racine (5 fichiers)               |
|  [OK] TypeScript (0 erreur)                       |
|                                                    |
|  --- WARNING ---                                   |
|  [OK] TSX sizes (max 432 lignes)                  |
|  [OK] Void Glass (0 violation)                    |
|  [OK] Tests Vitest (19/19 + 2/2)                  |
|  [OK] Refs intactes                                |
|                                                    |
|  --- INFO ---                                      |
|  [OK] CONTEXT.md sync (142 lignes)                |
|  [OK] Decisions datees (17/17)                    |
|  [OK] Bundle: 473KB JS, 25KB CSS                  |
|  [OK] Build time: 253ms (seuil 2000ms)            |
|                                                    |
+--------------------------------------------------+
|  SEUILS                                            |
|  Build time : [====---------] 253 / 2000ms        |
|  Bundle JS  : [======-------] 473 / 600 KB        |
|  Bundle CSS : [=====--------] 25 / 40 KB          |
|  CONTEXT.md : [========-----] 142 / 200 lignes    |
|  Decisions  : [==========---] 17 / 15 (!)         |
+--------------------------------------------------+
```

### Sous-pages

#### `/pulse/modules` — Sante par module

Table detaillee :

| Module | Build | TS | Tests | Bundle JS | Bundle CSS | TSX max | Void Glass |
|--------|-------|----|-------|-----------|-----------|---------|------------|
| App Builder | OK 253ms | 0 err | 19/19 | 473 KB | 25 KB | 432L | 0 violation |
| Design System | OK | 0 err | 2/2 | — | — | — | 0 violation |

Chaque ligne cliquable → detail du module.

#### `/pulse/core-os` — Sante Core OS

Pour chaque module Core OS :
- Spec existe et est a jour (date de derniere modif)
- Liens entre modules (cortex utilise communication, etc.)
- Scripts associes fonctionnels

#### `/pulse/history` — Historique verdicts

Timeline des verdicts health-check :
```
2026-04-13 : SAIN (session DS finition)
2026-04-11 : DEGRADED (7 refs plan finition)
2026-04-11 : SAIN (post cleanup)
2026-04-10 : SAIN (audit Core OS)
...
```

Source : git log des messages de commit mentionnant health-check + CONTEXT.md sessions.

---

## PAGE 3 : Modules (`/modules`)

**Role** : Catalogue de tous les modules. Vue portfolio.

### Layout

```
+--------------------------------------------------+
|  MODULES                                          |
+--------------------------------------------------+
|  ACTIFS                                            |
|  +------------------+  +------------------+       |
|  | App Builder      |  | Design System    |       |
|  | [status OK]      |  | [status OK]      |       |
|  | 5 routes         |  | 46 composants    |       |
|  | 19 tests         |  | 117 tokens       |       |
|  | 253ms build      |  | F7/F9 done       |       |
|  | → Voir detail    |  | → Voir detail    |       |
|  +------------------+  +------------------+       |
|                                                    |
|  PREVUS                                            |
|  +------------------+  +------------------+       |
|  | Finance          |  | Sante            |       |
|  | [pas cree]       |  | [pas cree]       |       |
|  | → Editer brief   |  | → Editer brief   |       |
|  +------------------+  +------------------+       |
|                                                    |
|  IDEES                                             |
|  +------------------+                              |
|  | Trading          |                              |
|  | [idee]           |                              |
|  | → Editer brief   |                              |
|  +------------------+                              |
|                                                    |
|  [+ Proposer un module]                            |
+--------------------------------------------------+
```

### Sous-page : `/modules/app` — Detail App Builder

```
+--------------------------------------------------+
|  APP BUILDER                              [ACTIF] |
+--------------------------------------------------+
|  METRIQUES                                        |
|  Build: OK 253ms | JS: 473 KB | CSS: 25 KB       |
|  Tests: 19/19    | Routes: 5  | Components: ~15   |
+--------------------------------------------------+
|  ROUTES                                            |
|  /              IndexPage (home)                   |
|  /commander     Commander                          |
|  /knowledge     KnowledgePage                      |
|  /login         LoginPage                          |
|  /reset-password ResetPasswordPage                 |
+--------------------------------------------------+
|  COMPOSANTS                                        |
|  DashboardLayout · Card · Badge · LoadingSkeleton  |
|  Navbar · TabBar · Commander/*                     |
+--------------------------------------------------+
|  DATA FILES (modules/app/data/)                    |
|  commander.md · graph.md · index.md · knowledge.md |
|  scale-orchestrator.md · sync.md · toolbox.md      |
+--------------------------------------------------+
|  DEPENDENCIES                                      |
|  react 19, vite 8, tailwind 4, supabase, motion   |
+--------------------------------------------------+
|  GIT                                               |
|  Dernier commit: a6f37a2 (il y a 6h)              |
|  Fichiers modifies: 12 dans cette session          |
+--------------------------------------------------+
```

### Sous-page : `/modules/finance` (ou autre prevu) — Brief editable

```
+--------------------------------------------------+
|  FINANCE                              [PREVU]     |
+--------------------------------------------------+
|  BRIEF (editable par Kevin)                       |
|  +----------------------------------------------+|
|  | Nom: Finance                                  ||
|  | Description: Dashboard budget, tracking       ||
|  | depenses, projections                         ||
|  | Stack envisagee: React + Supabase (meme que   ||
|  | App Builder)                                   ||
|  | Inspirations: Dexter (virattt/dexter)          ||
|  | Priorite: Phase 5                              ||
|  | Notes libres:                                  ||
|  | _________________________                     ||
|  | _________________________                     ||
|  +----------------------------------------------+|
|  [Sauvegarder le brief]                           |
+--------------------------------------------------+
```

Ce brief est sauvegarde dans un fichier MD que Claude Code peut lire au moment de creer le module.

---

## PAGE 4 : Arsenal (`/arsenal`)

**Role** : Inventaire complet de tout l'outillage. La boite a outils de Foundation OS.

### Layout principal

```
+--------------------------------------------------+
|  ARSENAL                        [98 outils total] |
+--------------------------------------------------+
|  [Tab: Skills] [Tab: Agents] [Tab: Commands]      |
|  [Tab: Scripts] [Tab: Plugins] [Tab: MCP]         |
+--------------------------------------------------+
```

### Tab Skills (`/arsenal/skills`)

Grille filtrable par domaine :

```
FILTRE: [Tous] [Sante] [Design] [Finance] [Dev] [FOS] [Docs] [Science]

+------------------+  +------------------+  +------------------+
| medecin-         |  | product-design-  |  | crypto-trader    |
| generaliste      |  | uxui             |  |                  |
| [Sante]          |  | [Design]         |  | [Finance]        |
| Diagnostic,      |  | Product design   |  | Pine Script,     |
| symptomes...     |  | complet          |  | TradingView...   |
+------------------+  +------------------+  +------------------+
```

Chaque card montre : nom, domaine (tag couleur), description courte (1 ligne), triggers principaux.

### Tab Agents (`/arsenal/agents`)

```
+--------------------------------------------------+
| os-architect                                      |
| Scope: architecture, ADR, stack, schema           |
| Fichier: .claude/agents/os-architect.md           |
| Derniere invocation estimee: session 2026-04-13   |
+--------------------------------------------------+
| dev-agent                                         |
| Scope: code React/TS, composants, Supabase        |
| ...                                                |
+--------------------------------------------------+
| doc-agent                                         |
| ...                                                |
+--------------------------------------------------+
| review-agent                                      |
| ...                                                |
+--------------------------------------------------+
```

### Tab Commands (`/arsenal/commands`)

| Commande | Role | Quand l'utiliser |
|----------|------|------------------|
| /cockpit | Point d'entree unique | Debut de session |
| /session-start | Charger contexte | Debut de session (si pas cockpit) |
| /session-end | Cloturer session | Fin de session |
| /plan-os | Generer un plan | Avant un gros chantier |
| /new-project | Scaffold module | Creer un nouveau module |
| /sync | Verifier coherence | Doute sur l'etat |

### Tab Scripts (`/arsenal/scripts`)

Table avec : nom, fichier, role, derniere execution connue, resultat.

Inclut aussi les hooks (validate-void-glass, security-reminder, pre-commit, commit-msg).

### Tab Plugins (`/arsenal/plugins`)

| Plugin | Version | Skills | Status |
|--------|---------|--------|--------|
| OMC | v4.10.1 | 36 skills | [update dispo v4.11.4] |
| Superpowers | v5.0.7 | 14 skills (dont writing-plans) | OK |
| gstack | — | — | OK |
| BMAD v6 | — | 12 modules | Dormant |

### Tab MCP (`/arsenal/mcp`)

| Service | Status | Info |
|---------|--------|------|
| Asana | Connecte | workspace 1213280972575193 |
| Notion | Connecte | user 4f1b99db |
| Figma | Connecte | — |
| Monday.com | Connecte | — |
| Gmail | Auth requise | — |

---

## PAGE 5 : Plans & Roadmap (`/plans`)

**Role** : Vue complete de tous les plans — passes, en cours, a venir.

### Layout principal — Vue Kanban

```
+--------------------------------------------------+
|  [Vue: Kanban] [Vue: Timeline] [Vue: Liste]       |
+--------------------------------------------------+

   DONE              EN COURS           A FAIRE
+------------+   +------------+   +------------+
| Phase 1    |   | Finition   |   | Phase 5    |
| Fondations |   | OS         |   | Expansion  |
| 100%       |   | [====--]   |   | En attente |
+------------+   | 60%        |   | Kevin      |
| Phase 2    |   +------------+   +------------+
| App Hard.  |   | DS F8-F9   |   | Evolution  |
| 100%       |   | [===---]   |   | Core OS    |
+------------+   | 50%        |   | (cowork)   |
| Phase 3    |   +------------+   +------------+
| OS Intel.  |
| 100%       |
+------------+
| Phase 4    |
| Monitoring |
| 100%       |
+------------+
| Audit C3   |
| 100%       |
+------------+
| Cycle 3    |
| 83%        |
+------------+
```

### Vue Timeline (`/plans/roadmap`)

Timeline horizontale :
```
Avr 5 -------- Avr 7 -------- Avr 10 -------- Avr 11 -------- Avr 13 ------>
  |              |               |                |                |
  P1 Fond.      P2 App          Audit            DS shadcn        Dashboard
                P3 Intel.       Cockpit          Finition OS      (ce plan)
                P4 Monitor      Tools v2
                Audit C3
```

### Sous-page : `/plans/[slug]` — Detail d'un plan

```
+--------------------------------------------------+
|  DS shadcn finition          [EXECUTING]          |
|  Cree: 2026-04-11 | Derniere modif: 2026-04-13   |
+--------------------------------------------------+
|  PROGRESSION                                      |
|  [=======---] 70% (7/9 phases done)               |
|                                                    |
|  F1 Primitives         [DONE]                     |
|  F2 Semantiques        [DONE]                     |
|  F3 Prefixe retire     [DONE]                     |
|  F4 App migree         [DONE]                     |
|  F5 Storybook migre    [DONE]                     |
|  F6 Cleanup            [DONE]                     |
|  F7 Health check       [DONE]                     |
|  F8 Nettoyage + tests  [A FAIRE]                  |
|  F9 Polish + site demo [A FAIRE]                  |
+--------------------------------------------------+
|  MODELES UTILISES : opus (archi) + sonnet (exec)  |
|  DUREE ESTIMEE : 90 min | REELLE : 120 min       |
+--------------------------------------------------+
```

---

## PAGE 6 : Knowledge (`/knowledge`)

**Role** : Acces a toute la documentation, les specs, les decisions.

### Layout

```
+--------------------------------------------------+
|  KNOWLEDGE                                        |
+--------------------------------------------------+
|  [Tab: Specs] [Tab: Core OS] [Tab: Decisions]     |
|  [Tab: Travaux Cowork]                            |
+--------------------------------------------------+
```

### Tab Specs

Liste des specs avec : titre, date, resume 1 ligne, lien vers le fichier.

### Tab Core OS

6 cartes pour les 6 modules Core OS, chacune montrant :
- Nom + icone
- Resume du role (1 ligne)
- Lien vers la spec
- Nombre de sections
- Date derniere modification

### Tab Decisions

Table searchable :

| ID | Date | Titre | Detail court |
|----|------|-------|-------------|
| D-DS-REBUILD | 2026-04-11 | Remplacement total shadcn | Option C from scratch... |
| D-WT-01 | 2026-04-11 | Worktrees integres Core OS | Feature native... |
| ... | ... | ... | ... |

Avec filtre par date, par scope, et toggle "actives / archivees".

### Tab Travaux Cowork

Liste des dossiers `docs/travaux-cowork/` :
- Nom, date, resume (depuis 00-INDEX.md), nombre de fichiers

---

## PAGE 7 : Lab — Espace creatif (`/lab`)

**Role** : C'est LA page innovation. L'espace ou Kevin reflechit, note, communique avec Claude.

### `/lab/ideas` — Boite a idees

```
+--------------------------------------------------+
|  IDEES                          [+ Nouvelle idee] |
+--------------------------------------------------+
|  FILTRE: [Toutes] [Concretes] [Futures] [?]       |
+--------------------------------------------------+
|                                                    |
|  [Concrete] Agent SDK Anthropic                   |
|  Explorer formalisation Cortex en natif.           |
|  Pre-requis: SDK mature + evaluation.              |
|  Source: Session S17                               |
|  [Editer] [Transformer en plan] [Archiver]         |
|                                                    |
|  [Concrete] MCP custom CONTEXT.md                  |
|  Anti-compactage via contexte a la demande.        |
|  [Editer] [Transformer en plan] [Archiver]         |
|                                                    |
|  [Future] modules/shared                           |
|  Extraction auth+DB. Quand 2e module actif.        |
|  [Editer] [Transformer en plan] [Archiver]         |
|                                                    |
|  [?] Cowork : methodo ou produit ?                  |
|  Foundation OS = apprentissage ou produit ?          |
|  [Editer] [Trancher] [Archiver]                    |
|                                                    |
+--------------------------------------------------+
```

Interactions :
- "+ Nouvelle idee" ouvre un formulaire (titre, description, type, source)
- "Transformer en plan" cree un fichier dans `docs/plans/` (pre-rempli)
- "Archiver" deplace l'idee
- "Trancher" (pour les ?) permet de convertir en decision

### `/lab/notes` — Notes libres

```
+--------------------------------------------------+
|  NOTES                          [+ Nouvelle note] |
+--------------------------------------------------+
|  [Global] [App Builder] [Finance] [Sante] [DS]    |
+--------------------------------------------------+
|                                                    |
|  Note: Reflexion architecture Finance              |
|  2026-04-12 · 3 paragraphes                       |
|  "J'ai regarde Dexter, l'approche est..."         |
|                                                    |
|  Note: Idee pour le DS motion                      |
|  2026-04-11 · 1 paragraphe                        |
|  "Les transitions devraient utiliser..."           |
|                                                    |
+--------------------------------------------------+
```

Chaque note = un fichier MD dans un dossier dedie. Editable inline.
Filtrable par module/sujet. Markdown supporte.

### `/lab/inbox` — Messages Kevin <-> Claude

```
+--------------------------------------------------+
|  INBOX                                             |
+--------------------------------------------------+
|                                                    |
|  [Kevin → Claude] 2026-04-13 10:30                |
|  "Pour la prochaine session, pense a verifier     |
|   les refs cassees dans le plan finition."          |
|                                                    |
|  [Claude → Kevin] 2026-04-13 14:00                |
|  "Session terminee. F1-F7 done. F8-F9 restent.    |
|   Attention : 7 refs dans le plan pre-existantes   |
|   → health DEGRADED. A traiter en F8."             |
|                                                    |
|  [Kevin → Claude] 2026-04-13 15:00                |
|  "OK pour les refs. Priorite F8 avant F9."         |
|                                                    |
+--------------------------------------------------+
|  [Ecrire un message...]                 [Envoyer] |
+--------------------------------------------------+
```

Mecanisme : les messages sont des fichiers MD. Au session-start, Claude lit les messages non lus. Au session-end, Claude peut ecrire un message.

### `/lab/briefs` — Briefs de futurs modules

Meme concept que les fiches modules prevus (`/modules/finance`) mais avec un espace d'ecriture plus libre, orientee brainstorming.

---

## PAGE 8 : Design System (`/design-system`)

**Role** : Vitrine du DS Void Glass. Montre que le DS est vivant.

### Layout principal

```
+--------------------------------------------------+
|  VOID GLASS DESIGN SYSTEM                         |
|  46 composants · 117 tokens · dark-only           |
+--------------------------------------------------+
|  [Tab: Palette] [Tab: Tokens] [Tab: Composants]   |
+--------------------------------------------------+
```

### Tab Palette (`/design-system/palette`)

Grille visuelle de toutes les couleurs :
- Surface: ds-surface-0 (#030303) → ds-surface-3
- Accent: ds-blue (#60a5fa), ds-purple (#c084fc), ds-green, ds-rose, ds-amber
- Semantic: success, warning, error, info
- Avec : hex, CSS var name, usage recommande

### Tab Tokens (`/design-system/tokens`)

```
PRIMITIVES (22 vars)
  color.surface.0    #030303
  color.surface.1    rgba(255,255,255,0.025)
  ...
  typography.family.ui    Figtree
  typography.family.mono  JetBrains Mono
  ...

SEMANTIQUES (95 vars)
  ds-surface-0       → color.surface.0
  ds-text-primary    → ...
  ds-radius-sm       → ...
  ...
```

Avec une barre de recherche et des filtres par categorie (color, typography, space, radius, motion).

### Tab Composants (`/design-system/components`)

Grille des 46 composants shadcn/ui :

```
+----------+ +----------+ +----------+ +----------+
| Button   | | Card     | | Dialog   | | Input    |
| 3 var.   | | 5 parts  | | modal    | | text     |
| [voir]   | | [voir]   | | [voir]   | | [voir]   |
+----------+ +----------+ +----------+ +----------+
```

Clic → affiche le composant avec ses variants, props, usage.
Lien vers Storybook (port 6007) si disponible.

---

## PAGE 9 : Sessions (`/sessions`)

**Role** : Historique du travail. Qui a fait quoi, quand.

### `/sessions/current` — Session en cours

```
+--------------------------------------------------+
|  SESSION EN COURS                                  |
+--------------------------------------------------+
|  Verrou: cowork (Kevin)                           |
|  Depuis: 2026-04-13 15:00 (il y a 45 min)        |
|  TTL: 30 min (refresh a 15:30)                    |
+--------------------------------------------------+
|  CE QUI A CHANGE DEPUIS LE DEBUT                  |
|  + docs/travaux-cowork/2026-04-13-plan-dashboard/ |
|  ~ CONTEXT.md (si modifie)                        |
+--------------------------------------------------+
```

### `/sessions/history` — Historique

Table scrollable :

| Date | Status | Resume | Commits |
|------|--------|--------|---------|
| 2026-04-13 | DONE_WITH_CONCERNS | DS finition F1-F7 | 45869af |
| 2026-04-11 | DONE | DS shadcn rebuild | a6f37a2, 3547b48, 311ae9a |
| 2026-04-11 | DONE | Planner + Worktrees | 6413ac9, 962c174 |
| ... | ... | ... | ... |

Avec : details expandables, lien vers le commit, decisions prises dans la session.

### `/sessions/git` — Etat Git

```
Branche: main
Dernier commit: a6f37a2 · il y a 6h
Fichiers non commites: 3
  M CONTEXT.md
  ? docs/travaux-cowork/2026-04-13-plan-dashboard/
Branches: main, audit-massif-cycle3 (merged)
```

---

## PAGE 10 : Memory (`/memory`)

**Role** : Vue sur le systeme de memoire de l'OS.

### `/memory/context` — CONTEXT.md

Affichage formate de CONTEXT.md avec :
- Metriques : taille actuelle vs budget (< 150L)
- Sections et leur taille relative
- Fraicheur (derniere mise a jour)
- Alertes si budget depasse

```
CONTEXT.MD                          142 / 200 lignes
+--------------------------------------------------+
|  [============------] 71% du budget               |
+--------------------------------------------------+
|  Modules        : 15 lignes  [====----------]     |
|  Sessions       : 22 lignes  [======---------]    |
|  Cap            : 8 lignes   [===-----------]     |
|  Idees          : 12 lignes  [====-----------]    |
|  En attente     : 6 lignes   [==-----------]     |
|  Decisions      : 45 lignes  [===========----]    |
|  Metriques      : 8 lignes   [===-----------]     |
+--------------------------------------------------+
```

### `/memory/auto` — Auto-memory

Liste des fichiers de memoire :
- Cowork : `/mnt/.auto-memory/` (MEMORY.md + fichiers)
- CLI : reference vers `~/.claude/projects/.../memory/`

Pour chaque fichier : nom, type (user/feedback/project/reference), description, date.

### `/memory/learning` — Apprentissage outils

Vue sur `docs/core/tools/routing.json` :
- 26 regles de routing
- 9 categories d'outils
- 98 outils documentes
- Patterns detectes (`docs/core/tools/patterns.json`)

```
ROUTING INTELLIGENCE
+--------------------------------------------------+
|  26 regles actives                                |
|  9 categories : agents, ci, commands, hooks, mcp, |
|  scripts, skills-bmad, skills-omc, skills-super   |
|  98 outils documentes                             |
+--------------------------------------------------+
|  TOP REGLES                                        |
|  1. architecture → os-architect                   |
|  2. code react   → dev-agent                      |
|  3. documentation → doc-agent                      |
|  ...                                               |
+--------------------------------------------------+
```
