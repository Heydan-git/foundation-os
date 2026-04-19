# Intent — body-p1-constitution

**Date** : 2026-04-19
**Session / branche** : claude/vibrant-poitras-28155e (worktree: vibrant-poitras-28155e)
**Spec** : [docs/core/body.md](../../docs/core/body.md) section 3 (Couche C2)

## 1. Verbatim Kevin

> construire les bases d'un nouveau module core, un module corps, dont l'objectif sera de s'assurer de l'alignement entre toi et moi. En fait, il faudra qu'il soit adaptatif, qui apprenne de nouvelles choses.

## 2. Ce que je comprends

<reformulation 2-3 lignes, claire, pas de jargon>

## 3. Scope (ce que je VAIS faire)

- <action 1 concrete>
- <action 2 concrete>
- <...>

## 4. Anti-scope (ce que je ne VAIS PAS faire)

- <exclusion 1, ce qui serait une derive>
- <exclusion 2>
- <...>

## 5. Signaux de drift anticipes

- Si je modifie plus de N fichiers hors scope → alerte
- Si je passe plus de X heures → alerte
- Si je me retrouve a faire Y au lieu de Z → stop et reouvrir l'intent

---

**Apres completion** : ce fichier sera lu par `alignment-auditor` (subagent clean-slate) au `/session-end` Phase 7ter, qui comparera scope declare vs actions reelles (git diff) pour produire un rapport JSON append `.omc/alignment/auditor-2026-04-19-body-p1-constitution.json`.
