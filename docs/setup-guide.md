# Foundation OS — Guide Setup (Claude Code Desktop)

> Ecrit pour le Claude Code Desktop app (redesign 2026-04). Pour le CLI terminal, les commandes npm restent identiques mais l'experience native (sidebar sessions, plan window, tasks pane) n'est pas disponible.

## Prerequis

- macOS ou Windows (Desktop app supporte les deux)
- Node.js >= 18
- Claude Code Desktop app installee (https://claude.com/claude-code, app native Mac/Windows)
- Comptes : GitHub, Supabase, Vercel

## Installation

```bash
git clone git@github.com:kevinnoeldivers-5446/foundation-os.git
cd foundation-os
```

Puis ouvrir Claude Code Desktop :
1. Sidebar sessions a gauche → New Session.
2. Pointer sur le dossier `foundation-os/`.
3. Claude charge automatiquement `CLAUDE.md` + auto-memory (29 fichiers `feedback_*` / `project_*` dans `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/`).

## Features natives Claude Code Desktop utilisees

| Feature | Usage Foundation OS |
|---|---|
| **Sidebar sessions multi** | Une session par worktree, navigation rapide |
| **Plan window UI** | `/plan-os` ouvre le plan dans la fenetre dediee, validation visuelle |
| **Tasks pane** | TodoWrite peuple la pane (tasks par phase de plan, plans actifs en debut de session) |
| **Worktrees natifs** | `/wt new` cree un worktree, ouvrir nouvelle fenetre Desktop dessus |
| **Rename session (manuel)** | Titre plan `🪐 <mini-detail> (DD-MM-YYYY)` affiche par `/plan-os` en fin de flow, a coller dans sidebar |

## Premiere session

```
/cockpit
```

Le brief v12 (TDAH-friendly, cadres box-drawing) s'affiche avec :
- Sante (build, tests, refs, worktree actif)
- Trajectoire (avancement plans actifs)
- Modules (App Builder, Design System, Core OS)
- Plans actifs avec progression
- Tasks pane peuplee (1 todo = 1 plan en cours)

A la fin du brief : `On fait quoi ?` — Kevin repond en langage libre.

## Workflow type

### 1. Demarrer une tache isolee → worktree

```
/wt new <desc-courte>
```

Cree `.claude/worktrees/<desc>-<yymmdd>/` sur branche `wt/<desc>-<yymmdd>`. Convention `docs/core/naming-conventions.md` section 2.

Ouvrir une **nouvelle fenetre Desktop** sur ce worktree (sidebar sessions → New Session → pointer sur le dossier worktree). Travail isole.

### 2. Generer un plan → /plan-os

```
/plan-os "<description tache>"
```

L'orchestrateur (`docs/core/planner.md`) :
- Analyse les signaux (ambiguite, ampleur, type, scope).
- Route vers le meilleur skill : `superpowers:brainstorming`, `superpowers:writing-plans`, `oh-my-claudecode:ralplan`, etc.
- Finalise via `EnterPlanMode` natif → plan visible dans la **plan window UI**.
- Titre force au format `🪐 <mini-detail> (DD-MM-YYYY)` → `/plan-os` affiche le nom en fin de flow, Kevin colle dans sidebar Desktop.
- Plan file dual-path : `~/.claude/plans/<slug>.md` (natif) + `docs/plans/YYYY-MM-DD-<slug>.md` (versionne).

Kevin valide via `ExitPlanMode`.

### 3. Executer → TodoWrite + commits par phase

A l'execution :
- 1 todo par phase (visibilite tasks pane).
- 1 commit conventionnel par phase : `<type>(scope): phase N/<total> ...`.
- Sessions courtes (regle "jamais monolithe" CLAUDE.md).

### 4. Fermer la session → /session-end

```
/session-end
```

- Inventaire changes
- Verification coherence + build + tests + health-check
- Rappel worktree (si != main, proposer `/wt clean` apres merge)
- Check zero todo `in_progress` orpheline
- Update CONTEXT.md
- Proposition commit

### 5. Cloturer le worktree → /wt clean

Apres merge dans main + push :

```
/wt clean <desc>
```

`git worktree remove` + delete branche `wt/...` si mergee.

## Dev local applicatif

```bash
cd modules/app
npm install
npm run dev      # localhost:5173
npm run build    # production
npm test         # vitest
```

Design System Storybook :

```bash
cd modules/design-system
npm install
npm run storybook    # localhost:6006 (62 stories : 53 DS + 9 app)
npm run build-storybook
```

## Vercel deploy

Root Directory = `modules/app` (configure dans Vercel). Auto-deploy sur push main.

## Outils installes

- **Hooks** : `validate-void-glass` (PreToolUse design system) + `security-reminder.py` (PreToolUse XSS/injection)
- **Scripts** : `health-check.sh`, `sync-check.sh`, `ref-checker.sh`, `worktree-{new,clean,list}.sh`
- **Plugins Claude Code** : OMC (oh-my-claudecode), superpowers, BMAD v6 (dormant), Notion MCP, Asana MCP, Figma MCP, chrome-devtools MCP, context7 MCP, neon-browser MCP
- **Agents Foundation OS** : os-architect (opus), dev-agent, doc-agent, review-agent (sonnet)

## Migration depuis CLI terminal

Si tu utilisais auparavant `claude .` dans le terminal, voici les changements :

| Avant (CLI terminal) | Maintenant (Desktop app) |
|---|---|
| `claude .` dans terminal | Sidebar sessions Desktop → ouvrir dossier |
| Briefs en texte plein | Briefs v12 + tasks pane native peuplee en parallele |
| `git worktree add` manuel | `/wt new <desc>` (convention nommage forcee) |
| Plans dans `docs/plans/` seul | Plans dual-path natif + versionne |
| Session sans nom (claude/agitated-wilson auto) | Nom `🪐 ...` genere par `/plan-os`, rename manuel sidebar |
| Multi-tache via tmux ou tabs | Multi-fenetre Desktop, une par worktree |

Le code applicatif (`modules/app`, `modules/design-system`) tourne identiquement : tous les `npm run *` sont CLI-agnostic.

## Reference

- Conventions nommage : `docs/core/naming-conventions.md`
- Architecture : `docs/architecture.md`
- Cortex routing : `docs/core/cortex.md`
- Worktrees : `docs/core/worktrees.md`
- Planner : `docs/core/planner.md`
- Communication briefs v12 : `docs/core/communication.md`
