# Worktrees — Feature Claude Code

> Module Core OS. Documentation de la feature native Claude Code pour travailler en parallele sur plusieurs branches via git worktrees isoles.
>
> Reference officielle : [Common workflows — git worktrees](https://code.claude.com/docs/en/common-workflows.md#run-parallel-claude-code-sessions-with-git-worktrees)

## 1. Qu'est-ce que c'est

**Git worktrees natifs de Claude Code CLI.** Pas un plugin, pas un skill — c'est une fonctionnalite core de la harness Claude Code. Permet d'avoir plusieurs copies de travail liees du meme repo, chacune sur sa propre branche, sans jamais polluer main ni les autres worktrees.

Cas d'usage Foundation OS :
- **Isolation** : bosser sur un plan risque sans toucher main
- **Parallele** : laisser Claude coder en autonomie sur un worktree pendant que Kevin travaille sur main
- **Experimentation** : tester une refactorisation multi-module sans casser le build principal
- **Sub-agents isoles** : un agent qui fait du travail destructif peut tourner dans son propre worktree

## 2. Comment ca marche

### Creation

**Via flag CLI** au lancement de Claude Code :
```bash
claude --worktree feature-auth       # Nom explicite
claude --worktree                    # Nom auto-genere (ex: admiring-sutherland)
claude -w feature-auth               # Alias court
```

**En cours de session**, en demandant a Claude :
> "Travaille dans un worktree"
> "Cree un worktree pour ce plan"

### Emplacement

Par defaut : `.claude/worktrees/<nom>/`

Chaque worktree :
- A son propre dossier
- A sa propre branche git (format `worktree-<nom>` ou `claude/<nom>` selon version)
- Demarre depuis `origin/HEAD` (la branche par defaut du remote, donc main ici)
- A son propre contexte de session Claude (pas de collision)

### Nommage auto

Les noms auto-generes utilisent des paires **adjectif-nom** : `admiring-sutherland`, `bright-running-fox`, `keen-turing`. Pas de controle sur l'algorithme — Claude Code les genere. Si tu veux un nom precis, passe-le explicitement (`--worktree mon-nom`).

### Nettoyage

**Automatique** quand Claude Code finit la session sur le worktree :
- **Si aucun changement** : worktree + branche supprimes automatiquement
- **Si des commits existent** : Claude demande s'il faut garder ou supprimer
- **Si orphelin** : auto-cleanup apres `cleanupPeriodDays` jours (reglage Claude Code) sauf s'il y a des commits non-pushes

**Manuel** via git standard :
```bash
git worktree list                                    # Lister
git worktree remove .claude/worktrees/<nom>          # Supprimer (si propre)
git worktree remove .claude/worktrees/<nom> --force  # Forcer (meme avec modifs)
git branch -D claude/<nom>                           # Supprimer la branche associee
```

## 3. Integration Foundation OS

### .gitignore

Le dossier `.claude/worktrees/` est dans `.gitignore`. Raisons :
- Les worktrees sont des copies locales, pas du contenu a versionner
- Chaque worktree a son propre `.git` qui pointe vers le repo parent
- Eviter de pousser des copies de travail sur le remote

### ref-checker.sh

`.claude/worktrees/` est exclu du scan `ref-checker.sh`. Raisons :
- Les worktrees peuvent contenir des snapshots a des etats differents de main
- Les refs qu'ils contiennent pointent parfois vers des paths qui ont evolue depuis
- Scanner ces refs generait des faux positifs sans valeur

Si un jour tu veux verifier la coherence d'un worktree specifique, utilise `cd .claude/worktrees/<nom> && bash ../../../scripts/ref-checker.sh` (le script tourne dans le contexte du worktree).

### Planner (/plan-os)

Le Planner Foundation OS (`docs/core/planner.md`) peut proposer un worktree pour les plans a fort risque de regression multi-module. Regle : si un bloc modifie 3+ fichiers cross-module, le planner affiche `⚠ suggestion: worktree isolation` et demande confirmation a Kevin avant execution.

### Session-end

`/session-end` ne verifie pas les worktrees. Si tu bosses dans un worktree, cloture la session de ce worktree avec `/session-end` local, puis `git worktree remove` depuis le repo principal.

## 4. Bonnes pratiques

| Faire | Ne pas faire |
|-------|--------------|
| Utiliser un worktree pour les refactors multi-module | Utiliser un worktree pour un simple bugfix |
| Nettoyer les worktrees orphelins (`git worktree list` + `remove`) | Laisser des worktrees zombis s'accumuler |
| Archiver le contenu avant suppression si doute | Supprimer `--force` sans verifier le travail |
| Commit + merge regulierement vers main | Laisser un worktree diverger pendant des jours |

## 5. Diagnostic worktrees orphelins

**Commande rapide** :
```bash
git worktree list
```

**Criteres d'un worktree orphelin** :
- Commit HEAD du worktree est un **ancestre** de main (→ deja integre)
- Aucune modification non-commitee substantielle (hors state runtime)
- Derniere activite > 7 jours
- Aucun autre worktree ni script ne le reference

**Action** : archiver le contenu unique (si existe) dans `.archive/worktrees-orphelins/<nom>-<date>/`, puis `git worktree remove --force`.

## 6. Historique des worktrees Foundation OS

| Date | Nom | Branche | Origine | Destin |
|------|-----|---------|---------|--------|
| 2026-04-10 | admiring-sutherland | claude/admiring-sutherland | Session Tools v2 scaffold (c979262) | Archive 2026-04-11 (`.archive/worktrees-orphelins/admiring-sutherland-20260411/`) — contenu duplique avec main, 0 travail unique |

## 7. Workflow Foundation OS (actif depuis 2026-04-15)

Plomberie technique OK de longue date. Workflow actif introduit en Phase 3 de la migration Claude Code Desktop : commands et scripts qui orchestrent la creation/fermeture selon convention `wt/<desc>-<yymmdd>`.

### Quand creer un worktree

| Situation | Worktree ? | Pourquoi |
|---|---|---|
| Tache isolee qui risque casser le workspace principal | **Oui** | Isolation, rollback safe |
| Feature parallele avec session Desktop dediee | **Oui** | Fenetres Desktop separees, multi-session |
| Experimentation destructible | **Oui** | Rollback = `git worktree remove` |
| Migration massive ou refactor invasif | **Oui** | Cette session de migration elle-meme |
| Fix rapide < 1h sur main | Non | Pas besoin, overhead |
| Doc simple | Non | Direct main |
| Review PR locale | Non | `git checkout <pr-branch>` suffit |

### Lifecycle type

```bash
# 1. Creation (depuis main)
./scripts/worktree-new.sh migration-desktop
# -> .claude/worktrees/migration-desktop-260415/ sur wt/migration-desktop-260415

# 2. Ouverture (Desktop app)
# Option A : sidebar sessions Desktop -> nouveau dossier -> pointer sur le worktree
# Option B : nouvelle fenetre Desktop directement sur le path

# 3. Travail dans le worktree (sessions courtes, commits conventionnels)
cd .claude/worktrees/migration-desktop-260415
# ... travail ...
git add . && git commit -m "feat(os): ..."

# 4. Merge dans main (depuis main)
cd /Users/kevinnoel/foundation-os
git merge --no-ff wt/migration-desktop-260415
git push

# 5. Fermeture (depuis main)
./scripts/worktree-clean.sh migration-desktop
# -> git worktree remove + delete branche si mergee
```

### Integration commands Foundation OS

- **`/wt`** (command dediee) : `new`, `list`, `clean`. Spec : `.claude/commands/wt.md`.
- **`/cockpit`** : Phase 1 SCAN detecte le worktree actif et l'affiche dans le brief v11 (cadre Sante).
- **`/session-end`** : Phase 1 rappelle le worktree actif, propose `/wt clean` apres merge dans main.
- **Scripts bash** : `scripts/worktree-new.sh`, `scripts/worktree-clean.sh`, `scripts/worktree-list.sh`.

### Regles imperatives

- **Jamais** `git worktree add` manuel : utiliser `/wt new`.
- **Jamais** de nom random auto-genere (plus de `claude/agitated-wilson`).
- Nom worktree = nom branche = `<desc>-<yymmdd>` (convention `docs/core/naming-conventions.md` section 2).
- Worktree cree depuis `main` toujours.
- Apres merge dans main et push, fermer le worktree avec `/wt clean`.

### Limites

- Impossible de **renommer** un worktree cree. Si nom errone : `/wt clean` + `/wt new` avec bon nom.
- Le switch entre worktrees dans une meme fenetre Desktop se fait via la sidebar sessions native.
- Un worktree par branche (git worktree n'autorise pas deux worktrees sur la meme branche).

## 8. References

- Doc officielle : https://code.claude.com/docs/en/common-workflows.md#run-parallel-claude-code-sessions-with-git-worktrees
- Spec Sessions : https://code.claude.com/docs/en/how-claude-code-works.md#work-with-sessions
- Archive orphelins : `.archive/worktrees-orphelins/` (vide depuis Phase 1 migration 2026-04-15)
- Exclusion ref-checker : `scripts/ref-checker.sh` ligne find filter
- .gitignore : `.claude/worktrees/`
- Conventions nommage : `docs/core/naming-conventions.md` section 2
- Spec /wt : `.claude/commands/wt.md`

## Voir aussi

- [[planner]] — module Planner (plans dans worktrees)
- [[naming-conventions]] — conventions nommage worktrees wt/<desc>-<yymmdd>
- [[tools]] — module Tools (scripts worktree-*)
