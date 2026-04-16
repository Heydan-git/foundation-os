# 04 — Donnees et Liaisons

## 1. Modele de donnees

Le dashboard n'a pas sa propre base de donnees. Il lit les sources existantes et les affiche.

### 1.1 Sources de donnees — Classification

| Source | Type | Format | Frequence MAJ |
|--------|------|--------|---------------|
| CONTEXT.md | fichier | Markdown parse | Chaque session-end |
| `docs/plans/*.md` | fichiers | Markdown avec frontmatter YAML | Par plan, quand modifie |
| `docs/specs/*.md` | fichiers | Markdown | Rarement |
| `docs/core/*.md` | fichiers | Markdown | Rarement |
| `docs/travaux-cowork/` | dossiers | Markdown | Par travail |
| `docs/decisions-log.md` | fichier | Markdown table | Quand decision archivee |
| `docs/core/tools/index.json` | fichier | JSON | Quand outil ajoute |
| `docs/core/tools/routing.json` | fichier | JSON | Quand regle ajoutee |
| `.claude/agents/*.md` | fichiers | Markdown | Rarement |
| `.claude/commands/*.md` | fichiers | Markdown | Rarement |
| `.claude/settings.json` | fichier | JSON | Rarement |
| `.fos-session.lock` | fichier | Texte | Chaque session-start/end |
| `modules/app/package.json` | fichier | JSON | Quand dep change |
| `modules/design-system/` | dossier | Fichiers TS/CSS | Quand DS modifie |
| `scripts/health-check.sh` | script | Sortie stdout | Chaque execution |
| `git log` / `git status` | commande | Texte | Temps reel |
| Supabase | API | JSON | Temps reel |
| Auto-memory | fichiers | Markdown | Quand memoire ajoutee |

### 1.2 Donnees crees par le dashboard (bidirectionnel)

Le dashboard cree aussi des fichiers que Claude Code peut lire :

| Donnee creee | Fichier destination | Qui ecrit | Qui lit |
|--------------|--------------------|-----------|---------| 
| Idees | `modules/app/data/ideas/*.md` | Kevin (via UI) | Claude (session-start) |
| Notes | `modules/app/data/notes/*.md` | Kevin (via UI) | Claude (session-start) |
| Messages inbox | `modules/app/data/inbox/*.md` | Kevin (via UI) | Claude (session-start) |
| Briefs modules | `modules/app/data/briefs/*.md` | Kevin (via UI) | Claude (/new-project) |
| Feedback | `modules/app/data/feedback/*.md` | Kevin (via UI) | Claude (auto-memory sync) |

### 1.3 Schema des fichiers bidirectionnels

#### Idee (fichier MD)
```markdown
---
id: idea-2026-04-13-001
title: MCP custom CONTEXT.md
type: concrete | future | question
created: 2026-04-13T15:00:00
status: active | tranchee | archivee
source: session S17
---

Anti-compactage via contexte a la demande.
Spec + implementation necessaire.
```

#### Note (fichier MD)
```markdown
---
id: note-2026-04-13-001
title: Reflexion architecture Finance
module: finance | global
created: 2026-04-13T15:00:00
updated: 2026-04-13T16:00:00
---

Contenu libre en markdown.
```

#### Message inbox (fichier MD)
```markdown
---
id: msg-2026-04-13-001
from: kevin | claude
to: claude | kevin
created: 2026-04-13T15:00:00
read: false
---

Contenu du message.
```

#### Brief module (fichier MD)
```markdown
---
id: brief-finance
module: finance
created: 2026-04-13
updated: 2026-04-13
status: draft | ready
---

## Description
Dashboard budget, tracking depenses, projections.

## Stack envisagee
React + Supabase (meme que App Builder)

## Inspirations
- Dexter (virattt/dexter)

## Notes
Contenu libre.
```

## 2. Integration session-start / session-end

### 2.1 Ce que session-start lit depuis le dashboard

Au demarrage d'une session Claude Code, le protocole session-start (`.claude/commands/session-start.md`) doit etre etendu pour lire les donnees creees par Kevin dans le dashboard :

```
Phase 1 — Collecte existante (inchangee)
  - CONTEXT.md
  - git status / log / branch
  - Build modules actifs
  - health-check.sh

Phase 1b — Collecte dashboard (NOUVEAU)
  - Lire modules/app/data/inbox/*.md (messages non lus, read: false)
  - Lire modules/app/data/ideas/*.md (nouvelles idees depuis derniere session)
  - Lire modules/app/data/feedback/*.md (nouveau feedback)
  - Si message ou idee trouvee → les mentionner dans le brief
```

### 2.2 Ce que session-end ecrit vers le dashboard

```
Phase 3 — Journalisation existante (inchangee)
  - Mettre a jour CONTEXT.md (sessions, decisions, cap, metriques)

Phase 3b — Journalisation dashboard (NOUVEAU)
  - Creer un message inbox Claude → Kevin (resume session)
  - Marquer les messages inbox Kevin → Claude comme read: true
  - Si idees tranchees → mettre a jour le status dans le fichier idee
```

### 2.3 Flux de donnees complet

```
                  SESSION-START
                       |
         +-------------+-------------+
         |             |             |
    CONTEXT.md    inbox/*.md    ideas/*.md
    (etat OS)    (messages     (nouvelles
                  Kevin)        idees)
         |             |             |
         v             v             v
    +---------------------------------+
    |        BRIEF DE SESSION         |
    +---------------------------------+
                    |
                    v
              [TRAVAIL SESSION]
                    |
                    v
    +---------------------------------+
    |        SESSION-END              |
    +---------------------------------+
         |             |             |
         v             v             v
    CONTEXT.md    inbox/*.md    ideas/*.md
    (MAJ etat)   (message       (status
                  Claude)        MAJ)
         |
         v
    DASHBOARD (lu par Kevin)
```

## 3. Persistance Supabase (optionnel, Phase 2)

Actuellement, les donnees du dashboard vivent en fichiers MD (coherent avec la philosophie de l'OS). En Phase 2, on pourrait migrer vers Supabase pour :
- Historique des verdicts health-check
- Compteurs de sessions
- Metriques build dans le temps (courbes)

Mais pour la v1 : **tout en fichiers MD**. Zero nouvelle table Supabase. C'est plus simple, plus coherent, et Claude Code peut lire/ecrire directement.

## 4. Parsing des sources

### 4.1 Parser CONTEXT.md

Un utilitaire `parseContextMd(content: string)` qui retourne :

```typescript
interface ContextData {
  modules: Module[]           // Table modules
  sessions: Session[]         // Sessions recentes (max 5)
  cap: Cap                    // Direction + pourquoi + prochaine action
  ideas: Idea[]               // Idees & Parking
  waitingKevin: string[]      // En attente Kevin
  decisions: Decision[]       // Decisions actives
  metrics: ModuleMetrics[]    // Table metriques
  risks: Risk[]               // Risques
  mcpConnections: MCP[]       // MCP comptes connectes
  tools: ToolInfo             // Outils
}
```

### 4.2 Parser les plans (frontmatter YAML)

```typescript
interface PlanData {
  id: string
  title: string
  created: string
  status: 'draft' | 'validated' | 'executing' | 'done'
  modelsUsed: string[]
  blocksTotal: number
  blocksSubagent: number
  blocksMain: number
  estimatedDuration: string
  blocks: PlanBlock[]          // Parse du markdown corps
  executionLog: LogEntry[]     // Checkboxes [ ] / [x]
}
```

### 4.3 Parser tools/index.json

Deja en JSON, directement importable. 98 outils, 9 categories.

### 4.4 Parser le lockfile

```typescript
interface SessionLock {
  owner: 'cowork' | 'cli' | null
  acquiredAt: Date | null
  ttl: number                  // en secondes
  active: boolean
}
```

## 5. Rafraichissement des donnees

| Donnee | Strategie de rafraichissement |
|--------|-------------------------------|
| CONTEXT.md | Re-parse au chargement de chaque page (fichier petit, < 150L) |
| Plans | Parse au chargement de /plans (lazy) |
| health-check | Execute au chargement de /pulse (bouton "re-executer") |
| Git | Execute au chargement de /sessions (git status, git log) |
| Fichiers inbox/ideas/notes | Scan du dossier au chargement de /lab |
| Design System | Parse statique (tokens + liste composants) |
| tools/index.json | Parse au chargement de /arsenal |

Pas de polling automatique. Le dashboard est un **snapshot** au moment ou Kevin le consulte, actualise manuellement ou a chaque navigation de page.

## 6. Recherche globale (Cmd+K)

Index de recherche construit a partir de :
- Titres et contenus des decisions
- Titres des plans
- Titres des specs
- Noms des outils (98)
- Noms des skills (~80)
- Titres des notes et idees
- Messages inbox
- Noms des composants DS (46)

Implementation : index en memoire, pas de moteur externe. Recherche fuzzy simple (Fuse.js ou equivalent).
