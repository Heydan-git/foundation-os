# 02 — Architecture et Navigation

## 1. Concept de navigation

Le dashboard utilise la sidebar collapsible du DashboardLayout existant (Figma Make).
La navigation est organisee en **3 zones** qui correspondent aux 3 axes de la vision :

```
OBSERVER     COMMUNIQUER     PILOTER
   |              |              |
   v              v              v
Sante         Inbox          Roadmap
Modules       Notes          Plans
Arsenal       Idees          Sessions
DS            Feedback       Cap
```

## 2. Arborescence complete des pages

```
/                           Home — Vue synoptique (Nerve Center)
|
+-- /pulse                  Pulse — Sante temps reel de l'OS
|   +-- /pulse/modules      Detail sante par module
|   +-- /pulse/core-os      Detail sante Core OS
|   +-- /pulse/history      Historique des verdicts health-check
|
+-- /modules                Modules — Catalogue de tous les modules
|   +-- /modules/app        Detail App Builder
|   +-- /modules/ds         Detail Design System
|   +-- /modules/finance    Module prevu — brief editable
|   +-- /modules/sante      Module prevu — brief editable
|   +-- /modules/[slug]     Tout nouveau module (dynamique)
|
+-- /arsenal                Arsenal — Tout l'outillage
|   +-- /arsenal/skills     Skills Cowork (par domaine)
|   +-- /arsenal/agents     Agents Claude Code
|   +-- /arsenal/commands   Commandes disponibles
|   +-- /arsenal/scripts    Scripts et hooks
|   +-- /arsenal/plugins    Plugins installes
|   +-- /arsenal/mcp        Connexions MCP
|
+-- /plans                  Plans & Roadmap
|   +-- /plans/[slug]       Detail d'un plan (progression, blocs)
|   +-- /plans/roadmap      Vue timeline/kanban de tous les plans
|
+-- /knowledge              Knowledge — Docs, specs, decisions
|   +-- /knowledge/specs    Specs du projet
|   +-- /knowledge/docs     Documentation Core OS
|   +-- /knowledge/decisions Decisions (actives + archives)
|   +-- /knowledge/travaux  Travaux Cowork
|
+-- /lab                    Lab — Espace creatif et communication
|   +-- /lab/ideas          Boite a idees (lecture + ecriture)
|   +-- /lab/notes          Notes libres (par sujet)
|   +-- /lab/inbox          Messages Kevin <-> Claude
|   +-- /lab/briefs         Briefs de futurs modules
|
+-- /design-system          Design System — Vitrine Void Glass
|   +-- /design-system/tokens     Tokens (primitives + semantiques)
|   +-- /design-system/components Composants (46 shadcn/ui)
|   +-- /design-system/palette    Palette complete
|
+-- /sessions               Sessions — Historique de travail
|   +-- /sessions/current   Session en cours (verrou, brief)
|   +-- /sessions/history   Historique des sessions
|   +-- /sessions/git       Etat Git (branches, commits)
|
+-- /memory                 Memory — Systeme de memoire
|   +-- /memory/context     CONTEXT.md (lecture + metriques)
|   +-- /memory/auto        Auto-memory (fichiers)
|   +-- /memory/learning    Apprentissage outils (routing.json)
|
+-- /commander              Commander — (existant, integre)
+-- /login                  Login — (existant)
+-- /reset-password         Reset — (existant)
```

**Total : 10 sections de niveau 1 + ~30 sous-pages**

## 3. Layout et structure visuelle

### 3.1 Sidebar (gauche, collapsible)

```
+-----------------------------------+
|  [LOGO] Foundation OS             |
|  v0.2 · SAIN                     |
+-----------------------------------+
|                                   |
|  --- OBSERVER ---                 |
|  [icone] Home                     |
|  [icone] Pulse                    |
|  [icone] Modules        [badge 2]|
|  [icone] Arsenal        [badge ~] |
|  [icone] Design System            |
|                                   |
|  --- PILOTER ---                  |
|  [icone] Plans           [badge 2]|
|  [icone] Knowledge                |
|  [icone] Sessions                 |
|  [icone] Memory                   |
|                                   |
|  --- COMMUNIQUER ---              |
|  [icone] Lab             [badge!] |
|  [icone] Commander                |
|                                   |
+-----------------------------------+
|  [verrou] CLI · 12 min            |
|  [user] Kevin                     |
+-----------------------------------+
```

Badges dynamiques :
- Modules : nombre de modules actifs
- Arsenal : nombre total d'outils
- Plans : nombre de plans en cours
- Lab : point rouge si idee non lue ou message en attente

### 3.2 Header (haut)

```
+-------------------------------------------------------+
| [Breadcrumb: Home > Pulse > Modules]                  |
|                                          [Search] [?] |
+-------------------------------------------------------+
```

- Breadcrumb dynamique
- Recherche globale (chercher dans tous les fichiers, decisions, plans, notes)
- Bouton aide contextuelle

### 3.3 Zone de contenu (centre)

Chaque page a sa propre mise en page, detaillee dans le fichier 03.

### 3.4 Footer contextuel (optionnel, bas)

Barre d'etat discrete :
```
SAIN · main · a6f37a2 · il y a 2h · 19 tests · Build 253ms
```

## 4. Navigation et interactions cles

### 4.1 Raccourcis

| Raccourci | Action |
|-----------|--------|
| Cmd+K | Recherche globale (command palette) |
| Cmd+P | Aller a Pulse |
| Cmd+I | Nouvelle idee (lab) |
| Cmd+N | Nouvelle note |

### 4.2 Command Palette (Cmd+K)

Inspiree de VS Code / Linear / Raycast. Permet de :
- Naviguer vers n'importe quelle page
- Chercher dans les decisions, plans, specs, notes
- Executer des actions rapides (nouvelle idee, nouveau brief)
- Voir le status rapide (SAIN/DEGRADED/BROKEN)

### 4.3 Notifications

Systeme de notifications internes (pas push) :
- Nouvelle session detectee (via CONTEXT.md)
- Plan qui passe de "executing" a "done"
- Seuil Monitor depasse
- Message Claude en attente dans l'inbox

## 5. Responsive

| Viewport | Layout |
|----------|--------|
| Desktop (> 1280px) | Sidebar + contenu plein |
| Tablet (768-1280px) | Sidebar collapsee (icones only) + contenu |
| Mobile (< 768px) | Bottom tab bar + contenu empile |

## 6. Deep links et partage

Chaque element a une URL stable :
- `/plans/2026-04-11-ds-shadcn-finition` → va direct au plan
- `/knowledge/decisions#D-DS-REBUILD` → va a la decision
- `/lab/ideas#idee-mcp-custom` → va a l'idee
- `/modules/app` → va au module

Utile pour : coller un lien dans une note, un message inbox, un brief.
