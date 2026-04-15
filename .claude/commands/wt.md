# /wt — Gestion worktrees Foundation OS

Wrapper slash-command autour des scripts `scripts/worktree-*.sh`. Applique la convention de nommage `wt/<desc>-<yymmdd>` (voir `docs/core/naming-conventions.md`).

## Usage

### `/wt new <desc>`

Cree un nouveau worktree selon convention Foundation OS.

- Desc : lowercase kebab-case, 2-4 mots (ex: `migration-desktop`, `fix-auth-ui`)
- Execution : `bash scripts/worktree-new.sh <desc>`
- Resultat :
  - Branche : `wt/<desc>-<yymmdd>` (ex: `wt/migration-desktop-260415`)
  - Dossier : `.claude/worktrees/<desc>-<yymmdd>/`
  - Base : `main` (toujours)

Apres creation, afficher a Kevin les instructions pour ouvrir une nouvelle fenetre Desktop app pointant sur le worktree.

### `/wt list`

Liste tous les worktrees actifs avec branche, dernier commit, status (ahead/behind main).

- Execution : `bash scripts/worktree-list.sh`
- Affichage : table 4 colonnes (PATH / BRANCH / DERNIER COMMIT / STATUS).

### `/wt clean <desc>`

Ferme un worktree proprement.

- Execution : `bash scripts/worktree-clean.sh <desc>`
- Actions : `git worktree remove`, delete branche si mergee dans main.
- Avertissement si fichiers non-commites (confirmation requise).
- Argument accepte soit le nom court (`migration-desktop`) soit le nom complet (`migration-desktop-260415`).

## Regles imperatives

- **Jamais** de `git worktree add` manuel : toujours `/wt new` pour respecter la convention.
- **Jamais** de nom random auto-genere (plus de `claude/agitated-wilson`).
- Worktree cree depuis `main` toujours (pas depuis un autre worktree).
- Apres un `/wt clean`, verifier `git branch -a` pour confirmer delete branche.

## Integration workflow

Ces commandes sont detectees automatiquement par :

- **`/cockpit`** Phase SCAN — affiche le worktree actif dans le brief v11 (cadre Sante, ligne Worktree).
- **`/session-end`** — si worktree != main, rappelle de merge/push depuis main apres review avant de proposer `/wt clean`.

## Limites

- Impossible de **renommer** un worktree deja cree (limite git). Si le nom initial est errone, `/wt clean` + `/wt new` avec bon nom.
- Le switch entre worktrees dans la meme fenetre Desktop se fait via la sidebar sessions (feature native Claude Code Desktop), pas via `/wt`.

## Exemples

```
/wt new migration-desktop
# -> .claude/worktrees/migration-desktop-260415/ sur wt/migration-desktop-260415

/wt list
# -> table avec les 2 worktrees actifs (main + migration-desktop-260415)

/wt clean migration-desktop
# -> git worktree remove + delete branche si mergee
```

Spec complete : `docs/core/naming-conventions.md` section 2 + `docs/core/worktrees.md` section "Workflow Foundation OS".
