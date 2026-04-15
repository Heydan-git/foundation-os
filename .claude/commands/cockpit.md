# /cockpit — Point d'entree unique Foundation OS

> **IMPERATIF** — Quand cette command est invoquee, tu DOIS executer les tool calls suivants dans CET ORDRE avant toute reponse texte :
>
> **Tour 1 (parallele, OBLIGATOIRE)** :
> 1. `Read CONTEXT.md` — etat projet
> 2. `Bash git status --short && git log -1 --format="%cr · %h · %s" && git branch --show-current && git worktree list` — etat git + worktree
> 3. `Bash bash scripts/health-check.sh 2>&1 | tail -25` — sante
> 4. `Glob docs/plans/*.md` — lister plans existants
>
> **Tour 2 (OBLIGATOIRE apres Tour 1)** :
> 5. `Read` chaque plan actif identifie (non-DONE, non-SUPERSEDED)
> 6. `TodoWrite` avec UNE todo par plan actif (ex: "Plan DS Showcase — blocs 13-14 pending", "Plan migration Desktop — 9 phases DONE") + todo "Attendre input Kevin"
>
> **Tour 3** :
> 7. Produire le brief v11 au format `docs/core/communication.md` section 6.1
>
> PAS DE QUESTION CLARIFICATION AVANT TOUR 3. PAS DE "laisse-moi d'abord..." AVANT TOUR 3. Les tool calls tours 1-2 sont NON-NEGOCIABLES.

Super-pilote TDAH-friendly. Un seul appel, zero friction.
Coexiste avec /session-start, /session-end, /sync, /new-project (qui restent intactes).

Spec design : `docs/specs/2026-04-10-cockpit-design.md`

## Phase 1 — SCAN (parallele)

Lancer en parallele :

1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti)
2. **Git** : `git status --short` + `git log -1 --format="%cr · %h · %s"` + `git branch --show-current`
3. **Worktree actif** : `git worktree list` (detecter si on est dans main ou dans un worktree). Extraire le nom du worktree courant (basename du cwd si dans `.claude/worktrees/*/`). Inclure dans le brief v11 cadre Sante : ligne `Worktree` avec le nom (ou `main (base)` sinon).
4. **Build modules** : pour chaque `modules/*/package.json` → `npm run build -w modules/[nom]`
5. **Health-check** : `bash scripts/health-check.sh`
6. **Plans actifs** : lire CHAQUE `docs/plans/*.md` non archive. Exclure les plans dont toutes les cases `Execution log` sont `[x]` OU status `done`/`closed`. Pour chaque plan restant, extraire : titre, progression (N/M), dernier `[x]` coche (= hier), prochains `[ ]`, sessions restantes. Rendre dans le cadre **PLANS ACTIFS** du brief (format spec `docs/core/communication.md` section 6.1). Un sous-cadre par plan. Obligatoire meme si un seul plan actif.
7. **Tasks pane** : creer un TodoWrite initial avec les plans actifs en tâches (1 todo = 1 plan en cours). Kevin voit l'avancement dans la tasks pane Desktop.

Si CONTEXT.md absent → abort avec erreur explicite.
Si health-check BROKEN ou build failure → signaler les erreurs critiques, ne pas produire le brief (fixer d'abord).

## Phase 2 — BRIEF v11

Generer le brief TDAH-friendly au format v11.

**Format brief** : voir `docs/core/communication.md` section 6.1 (template debut), 6.3 (regles rendu), 6.4 (sources). **SOURCE UNIQUE.** Ne pas dupliquer ici.

Le cockpit utilise le meme template que `/session-start` (debut de session) avec adaptation Phase INPUT (question ouverte au lieu de menu).

**Difference avec /session-start** : la section INPUT ne pose pas de questions projet. Elle affiche uniquement :

```
╔═ INPUT ══════════════════════════════════╗
║                                          ║
║   On fait quoi ?                         ║
║                                          ║
╚══════════════════════════════════════════╝
```

Attendre la reponse de Kevin en langage libre. Pas de menu, pas de choix multiples.

## Phase 3 — ROUTE

Analyser la reponse de Kevin et router vers le bon agent.

Table de routing (source : `docs/core/cortex.md` section 1) :

| Signaux | Agent | Modele |
|---------|-------|--------|
| code, composant, page, fix, CSS, React, Supabase, build, Tailwind | dev-agent | sonnet |
| documente, note, trace, journalise, CONTEXT, met a jour | doc-agent | sonnet |
| architecture, ADR, stack, schema, structurer, option A vs B | os-architect | opus |
| verifie, audit, check, revue, regression, deployer | review-agent | sonnet |

### Regles de routing

1. **Match explicite** sur mots-cles → deleguer a l'agent correspondant
2. **Multi-domaine** (ex: code + archi) → sequentiel (agent 1 puis agent 2)
3. **Trivial** (< 1 fichier, 1 domaine) → traiter directement, pas d'agent
4. **Ambiguite** → poser 1 question a Kevin (pas plus)
5. **Annonce** : toujours dire "Je route vers [agent] pour [raison]" — Kevin peut overrider

## Phase 4 — EXECUTE

L'agent ou le cockpit directement execute le travail. Kevin valide.

## Phase 5 — CLOTURE

Apres que Kevin valide le travail :

1. **Commit** : proposer un commit conventionnel (`type(scope): description`)
2. **CONTEXT.md** : proposer les updates necessaires (sessions, decisions, metriques)
3. **Health final** : `bash scripts/health-check.sh`
4. Si DEGRADED ou BROKEN → signaler, ne pas pretendre que c'est fini
5. Kevin peut refuser le commit ou les updates. Rien n'est force.
