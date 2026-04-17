# Cockpit — Spec Design

> Point d'entree unique Foundation OS. Zero friction, zero choix intermediaire.
> Approuve par Kevin le 2026-04-10.

## Probleme

Kevin est TDAH. Chaque decision = friction = risque de decrochage.

Frictions actuelles :
1. **Trop de portes d'entree** — `/session-start`, `/session-end`, `/sync`, `/new-project`, 4 agents : lequel utiliser ?
2. **Routing manuel** — Kevin doit savoir quel agent invoquer (dev, doc, architect, review)
3. **Re-orientation post-pause** — apres une coupure, il faut se rappeler ou on en etait

## Solution

Un skill `/cockpit` qui orchestre tout en un seul appel :
- Brief automatique (health + build + git + CONTEXT.md)
- Routing automatique vers le bon agent
- Cloture automatique (commit + CONTEXT.md + health final)

**Coexistence** : les commandes existantes restent intactes. Le cockpit est un super-pilote optionnel.

## Flow

```
Kevin tape: /cockpit
        │
        ▼
┌─ PHASE 1 : SCAN ──────────────┐
│  health-check.sh (parallele)   │
│  build modules actifs          │
│  git status + log              │
│  lire CONTEXT.md               │
└────────────┬───────────────────┘
             │
             ▼
┌─ PHASE 2 : BRIEF v12 ─────────┐
│  Genere le brief TDAH complet  │
│  (meme template v11 que        │
│  session-start)                │
│  Affiche alertes si any        │
└────────────┬───────────────────┘
             │
             ▼
╔═ PHASE 3 : INPUT ═════════════╗
║  "On fait quoi ?"              ║
║  Kevin repond en langage libre ║
╚════════════┬═══════════════════╝
             │
             ▼
┌─ PHASE 4 : ROUTE ─────────────┐
│  Parse l'intent de Kevin       │
│  Mappe vers le bon agent       │
│  OU traite directement si      │
│  trivial (< 1 fichier)        │
│  Annonce le choix, Kevin peut  │
│  overrider                     │
└────────────┬───────────────────┘
             │
             ▼
┌─ PHASE 5 : EXECUTE ───────────┐
│  L'agent (ou moi) travaille    │
│  Kevin valide                  │
└────────────┬───────────────────┘
             │
             ▼
┌─ PHASE 6 : CLOTURE ───────────┐
│  Propose commit conventionnel  │
│  Propose update CONTEXT.md     │
│  Health-check final            │
│  Si DEGRADED/BROKEN → signaler │
└────────────────────────────────┘
```

## Phase 1 — SCAN

Lancer en parallele (memes commandes que `/session-start`) :

1. `bash scripts/health-check.sh`
2. `npm run build -w modules/app` (+ tout module actif dans CONTEXT.md)
3. `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
4. Lire `CONTEXT.md` entier

Si health-check BROKEN ou build fail → afficher les erreurs, ne pas produire le brief. Fixer d'abord.

## Phase 2 — BRIEF v12

Generer le brief TDAH-friendly au format v11 :
- 11 sections dans cadres box-drawing (`┌─ TITRE ─┐ ... └─┘`)
- Entete/input en double trait (`╔═══╗`)
- Emojis couleur, barres progression, tendance
- Template complet : voir `/session-start` (source de verite du format)

## Phase 3 — INPUT

Afficher :

```
╔═ INPUT ══════════════════════════════════╗
║                                          ║
║   On fait quoi ?                         ║
║                                          ║
╚══════════════════════════════════════════╝
```

Attendre la reponse de Kevin en langage libre. Pas de choix multiples, pas de menu.

## Phase 4 — ROUTE

Table de routing (source : `docs/core/cortex.md` section 1) :

| Signaux | Agent | Modele |
|---------|-------|--------|
| code, composant, page, fix, CSS, React, Supabase, build, Tailwind | dev-agent | sonnet |
| documente, note, trace, journalise, CONTEXT, met a jour | doc-agent | sonnet |
| architecture, ADR, stack, schema, structurer, option A vs B | os-architect | opus |
| verifie, audit, check, revue, regression, deployer | review-agent | sonnet |

**Regles :**

1. **Match explicite** → deleguer a l'agent correspondant
2. **Multi-domaine** (ex: code + archi) → sequentiel (agent 1 puis agent 2)
3. **Trivial** (< 1 fichier, 1 domaine) → traiter directement, pas d'agent
4. **Ambiguite** → poser 1 question a Kevin (pas plus)
5. **Annonce** : toujours dire "Je route vers [agent] pour [raison]" — Kevin peut overrider

## Phase 5 — EXECUTE

L'agent ou le cockpit directement execute le travail. Rien de special ici — meme comportement qu'aujourd'hui, juste le routing est automatique.

## Phase 6 — CLOTURE

Apres que Kevin valide le travail :

1. **Commit** : proposer un commit conventionnel (`type(scope): description`)
2. **CONTEXT.md** : proposer les updates (session, decisions, metriques si changees)
3. **Health final** : `bash scripts/health-check.sh`
4. Si DEGRADED ou BROKEN → signaler, ne pas pretendre que c'est fini

Kevin peut refuser le commit ou les updates. Rien n'est force.

## Harmonisation (en parallele du skill)

### CLAUDE.md — Compression (~130L → ~90L)

Sections "Core OS — Cortex/Communication/Monitor/Tools" : remplacer les resumes par 1 ligne pointeur chacune.

Avant :
```
## Core OS — Routing
Cortex route les taches vers l'agent adapte. Table signaux → agents : ...
Agents : os-architect, dev-agent, doc-agent, review-agent.
Priorite : match explicite → deleguer. ...
Multi-agent → sequentiel. Trivial → direct.
```

Apres :
```
## Core OS — Routing
Spec complete : `docs/core/cortex.md`. Table signaux → agents section 1.
```

Meme pattern pour Communication, Monitor, Tools.

### Agents — Simplification

Chaque agent herite des regles globales de CLAUDE.md. Retirer les copies :
- Regles Void Glass (deja dans CLAUDE.md + hook)
- Regles commits conventionnels (deja dans CLAUDE.md + hook commit-msg)
- Regles fichiers racine (deja dans CLAUDE.md)

Garder seulement : role, signaux de declenchement, regles specifiques a l'agent.

### Archives

| Fichier | Action | Raison |
|---------|--------|--------|
| `.archive/directive-v1.md` | → `.archive/` | Doublon de CLAUDE.md |
| `.archive/tools-audit.md` | → `.archive/` | Doublon de `docs/core/tools.md` |

### Documentation cockpit

Ajouter une section "Cockpit" dans `docs/core/cortex.md` (pas de nouveau fichier) :
- Description du skill comme point d'entree optionnel
- Reference vers cette spec pour le detail

## Livrables

| # | Fichier | Action |
|---|---------|--------|
| 1 | `.claude/commands/cockpit.md` | Creer |
| 2 | `CLAUDE.md` | Editer (compresser, ajouter mention cockpit) |
| 3 | `.claude/agents/dev-agent.md` | Editer (simplifier) |
| 4 | `.claude/agents/doc-agent.md` | Editer (simplifier) |
| 5 | `.claude/agents/os-architect.md` | Editer (simplifier) |
| 6 | `.claude/agents/review-agent.md` | Editer (simplifier) |
| 7 | `docs/core/cortex.md` | Editer (ajouter section cockpit) |
| 8 | `.archive/directive-v1.md` | Deplacer → `.archive/` |
| 9 | `.archive/tools-audit.md` | Deplacer → `.archive/` |
| 10 | `CONTEXT.md` | Editer (decisions + session) |

## Contraintes

- **Zero regression** : memes scripts, memes hooks, memes builds
- **Zero nouveau fichier doc** : le skill vit dans commands/, la doc dans cortex.md
- **Coexistence** : `/session-start`, `/session-end`, `/sync`, `/new-project` intactes
- **TDAH-friendly** : 1 commande → brief → "on fait quoi ?" → boulot → cloture
