# Concurrency — Spec multi-session Foundation OS

Module Core OS qui definit comment travailler en parallele sur **plusieurs sessions Claude Code** simultanement, sur le meme repo Foundation OS, sans se marcher dessus.

> Ce module documente **ce qui est isole vs partage** entre worktrees, **les 7 hotspots de contention**, **les regles d'or** de cloture, et **comment resoudre un conflit** si l'on survient. Ajoute 2026-04-19 (D-CONCURRENCY-01).

## 1. Contexte

Kevin travaille souvent **plusieurs sessions Claude Code Desktop en parallele**, chacune dans son propre worktree (feature native, spec `docs/core/worktrees.md`). Cas d'usage :

- Session A sur `modules/finance/` + Session B sur `modules/trading/` (modules differents)
- Session A sur `modules/app/` (feature) + Session B sur `modules/app/` (fix urgent)
- Session A (code) + Session B (audit/research/docs)

**La question** : est-ce que Kevin peut faire ca **sans perdre de travail** et **sans se retrouver avec un repo casse** ?

**Reponse courte** : oui pendant le travail, **avec discipline** pour la cloture. Ce doc explique pourquoi et comment.

## 2. Modele mental — isole vs partage

### 2.1 Isole par worktree (zero collision)

| Element | Scope |
|---------|-------|
| Fichiers source (`modules/`, `docs/`, `wiki/`, `scripts/`) | Copie physique par worktree |
| Branche git (`wt/<desc>-<yymmdd>` ou `claude/<auto>` Desktop) | Une par worktree |
| Index git, HEAD local | Par worktree |
| `node_modules/`, `dist/`, `storybook-static/` | Par worktree (gitignored) |
| Contexte session Claude, TodoWrite | Par fenetre Desktop |
| Build / tests | Par worktree |

**Implication** : tu peux editer, builder, tester, commit dans N worktrees en parallele sans collision de fichiers.

### 2.2 Partage entre TOUS les worktrees (contention possible)

| Path | Type | Pourquoi partage |
|------|------|-------------------|
| `.git/` (objets, refs, packs) | Git interne | Un seul `.git/` pour N worktrees (design git) |
| `.omc/ratings.jsonl` | Append state | Hors git mais filesystem partage |
| `.omc/snapshots/` | Hors git | Filesystem partage (rotation globale) |
| `.omc/project-memory.json` | Hors git | Filesystem partage |
| `.omc/sessions/*.json` | Hors git | Par session-id (safe) |
| `~/.claude/projects/.../memory/` | Auto-memory | Global user (hors repo) |
| `~/.claude/plans/*.md` | Plans natifs | Global user (hors repo) |
| Remote `origin/main` | Git remote | Push concurrent = conflit |

**Implication** : meme si les fichiers code sont isoles par worktree, tu peux avoir des conflits **git logiques** (2 branches editent le meme fichier) ou des **races filesystem** (2 snapshots meme minute).

## 3. Les 7 hotspots de contention

Files list des fichiers que **toute session Claude Code touche** au demarrage ou a la cloture. Ce sont les points de contention principaux.

| # | Fichier | Role | Qui ecrit | Risque proba |
|---|---------|------|-----------|--------------|
| 1 | `CONTEXT.md` | Etat operationnel | Chaque `/session-end` (Tour 3) | 🔴 Haute |
| 2 | `wiki/hot.md` | Cache flash derniere session | Chaque `/session-end` (overwrite) | 🔴 Haute |
| 3 | `wiki/meta/sessions-recent.md` | Append 5 dernieres sessions | Chaque `/session-end` | 🟡 Moyenne |
| 4 | `wiki/meta/thinking.md` | Insights | Append si pertinent | 🟡 Moyenne |
| 5 | `wiki/meta/lessons-learned.md` | Erreurs | Append si pertinent | 🟢 Faible |
| 6 | `docs/plans/*.md` | Plans actifs | Auto-archive SessionEnd + edits | 🟡 Moyenne |
| 7 | `origin/main` (remote) | Push concurrent | Chaque merge/push | 🟡 Moyenne |

Fichiers hors-git partages mais de moindre impact (state runtime) :

| Fichier | Risque |
|---------|--------|
| `.omc/ratings.jsonl` (append-only) | 🟢 Faible (atomic < 4KB) |
| `.omc/snapshots/YYYYMMDD-HHMM-<worktree>.md` | 🟢 Fixe post-D-CONCURRENCY-01 |
| `.omc/project-memory.json` | 🟡 Moyenne (overwrite complet) |
| `~/.claude/projects/.../memory/*.md` (hook last_used) | 🟢 Faible (idempotent day-scoped) |

## 4. Regles d'or (discipline)

### 4.1 Regle cle : "cloture en serie"

**Ne jamais faire `/session-end` dans 2 sessions dans la meme minute.**

Protocole :
1. Termine ton travail dans session A.
2. Lance `/session-end` dans session A.
3. **Attends** que le merge dans main + push origin soient termines (verifier `git log -1 main`).
4. Ensuite, lance `/session-end` dans session B.

Entre les deux, session B peut rester ouverte. Zero probleme : le travail continue sur la branche B isolee.

### 4.2 Regle complementaire : "1 session = 1 module majeur"

Ne travaille **pas** 2 sessions en parallele sur le **meme module**. Si tu dois :

- 2 sessions Finance → elles editeront probablement les memes fichiers (tokens, composants partages) → conflit garanti au merge.
- 1 session Finance + 1 session Trading → modules independants, aucun conflit code.

Exceptions acceptables :
- Session A "active" (tu codes) + Session B "passive" (lecture, audit, research, pas de write).

### 4.3 Regle garde-fou : "push main atomique"

Apres un merge, push **immediatement** (`git push origin main`) pour que les autres sessions puissent synchroniser. Ne laisse pas un merge local non-push pendant des heures — c'est une **mine silencieuse**.

## 5. Workflow visuel

### 5.1 ✅ Workflow sain

```
09h   [Session A finance]   [Session B trading]    ← 2 sessions ouvertes en parallele
          |                      |
12h   code/test/edit       code/test/edit          ← travail en parallele = OK
          |                      |
18h   /session-end A             |                 ← cloture A SEULE
          ↓                      |
          merge main             |
          push origin            |
          FINI ✅                  |
                                 |
19h   ───────────────────  /session-end B          ← cloture B APRES
                                 ↓
                                 merge main (deja rebased)
                                 push origin
                                 FINI ✅
```

### 5.2 🔴 Workflow risque (a eviter)

```
18h00:30   /session-end A   /session-end B         ← simultane
              ↓                  ↓
              edit CONTEXT       edit CONTEXT      ← 🔴 race conditions
              ↓                  ↓
              merge main    ←→   merge main        ← 🔴 conflit push
              push rejete        push accept
```

Resultat : conflit git manuel a resoudre sur CONTEXT.md, wiki/hot.md, wiki/meta/sessions-recent.md. 5-15 min de friction.

## 6. Ce que tu peux / ne peux pas

### ✅ Tu peux (pendant le travail)

- Ouvrir N sessions Desktop en parallele (1 par worktree).
- Editer du code dans chaque session pendant des heures.
- Builder, tester, typechecker en parallele.
- Faire `git commit` dans chaque session (branches differentes).
- Lire wiki/ et docs/ depuis chaque session (lecture = zero conflit).
- Utiliser TodoWrite dans chaque session (scoped par session).

### ⚠️ Tu dois eviter

| Action | Risque |
|--------|--------|
| `/session-end` simultanes (meme minute) | Conflit CONTEXT.md + hot.md |
| `git push main` simultanes | Le 2e push rejete (pull+merge requis) |
| 2 sessions sur le meme module (meme fichier) | Conflits merge classiques |
| Editer CONTEXT.md / CLAUDE.md / wiki/hot.md **a la main** pendant qu'une autre session tourne | Race non-detectable |
| Modifier `.claude/settings.json` depuis un worktree et s'attendre a ce que l'autre worktree le voit | Le fichier est **gitignored partage** — les edits manuels doivent etre fait apres coordination |

### 🚫 Tu ne peux pas (limite git)

- Avoir 2 worktrees sur la **meme branche** (`git worktree add` refusera).
- Renommer un worktree existant (il faut `/wt clean` + `/wt new`).

## 7. Protections actives (post-D-CONCURRENCY-01)

| Protection | Ou | Quand elle joue |
|------------|-----|------------------|
| Snapshot suffix worktree | `scripts/hooks/pre-compaction-snapshot.sh` | Compaction 2 sessions meme minute → 2 snapshots distincts |
| `worktree-new.sh` refuse duplicate | `scripts/worktree-new.sh` | Meme nom → erreur explicite |
| `worktree-clean.sh` refuse non-committed | `scripts/worktree-clean.sh` | Demande confirmation |
| Drift-detector tolere branches worktree | `scripts/drift-detector.sh` | `claude/<auto>` pas flagge en drift si `pwd` dans worktree |
| Ref-checker exclut worktrees | `scripts/ref-checker.sh` | Pas de faux positif sur state snapshot |
| Pre-compaction snapshot atomique | `scripts/hooks/pre-compaction-snapshot.sh` | Backup avant compaction contexte |

**Ce qui n'est pas automatise (discipline requise)** :
- Detection "un autre worktree a commit sur CONTEXT.md recemment" — non-implemente (gadget).
- Lock optimiste sur fichiers meta — **YAGNI** decide 2026-04-19 (complexity > benefit pour dev solo).

## 8. Resolution d'un conflit multi-session (recette)

Si ca arrive (2 `/session-end` simultanes) :

### 8.1 Symptomes

- `git merge` refuse avec message "CONFLICT (content)" sur CONTEXT.md / wiki/hot.md / wiki/meta/*
- `git push` rejete avec "Updates were rejected because the remote contains work that you do not have locally"

### 8.2 Procedure (session B, celle qui arrive apres)

```bash
# 1. Depuis la session B, pull main
cd /Users/kevinnoel/foundation-os
git pull origin main

# 2. Merger main dans ta branche worktree
git checkout <branche-b>
git merge main

# 3. Resoudre les conflits manuellement
# CONTEXT.md : garder les 2 entrees Sessions recentes, garder les decisions des 2
# wiki/hot.md : reecrire le cache combine A+B ou garder le plus recent
# wiki/meta/sessions-recent.md : append les 2 sessions dans l'ordre chronologique

# 4. Marquer resolu + commit
git add CONTEXT.md wiki/hot.md wiki/meta/sessions-recent.md
git commit -m "chore(os): resolve conflict session A+B"

# 5. Retourner sur main et merger
cd /Users/kevinnoel/foundation-os
git merge <branche-b> --no-ff
git push origin main
```

Temps : 5-15 min selon l'ampleur des conflits. Non-destructif si on fait attention.

### 8.3 Pattern a retenir

Un conflit de merge **n'est pas une catastrophe**. C'est de la plomberie git normale. Le vrai danger est de **ne pas remarquer** qu'il y a eu un conflit et commit a moitie quelque chose de casse. D'ou l'insistance sur `git status` + `git log -1 main` apres chaque merge pour verifier.

## 9. Integration Foundation OS

### 9.1 CLAUDE.md

CLAUDE.md contient une section "Multi-session (concurrence)" qui pointe vers ce doc et enonce la regle "cloture en serie" (3-4 lignes, pas plus).

### 9.2 `/session-end`

Le command `/session-end` ne bloque pas en cas de conflit potentiel (par design, c'est de la discipline humaine). Il rappelle en fin de brief : "Si une autre session tourne, verifier qu'elle a bien termine avant push main."

### 9.3 Drift-detector

Pas de check specifique multi-session aujourd'hui. Pas de telemetry "combien de sessions ont tourne en parallele cette semaine". A voir si utile Phase 5.

## 10. Limites / hors scope

- **Pas de lock automatique par fichier** : decide YAGNI 2026-04-19 pour dev solo. Re-evaluer si Kevin a une equipe.
- **Pas de detection "stale CONTEXT.md"** : decide gadget 2026-04-19 (alerte non-bloquante ignoree).
- **Pas de telemetrie multi-session** : `.omc/sessions/*.json` existe mais pas agregee.
- **Pas de protocole merge queue** (comme GitHub merge queue) : overkill pour dev solo.
- **Cowork + Claude Code CLI simultanes** : geres par `scripts/session-lock.sh` (2 heads : cowork/cli). Complementaire a ce doc mais scope different.

## 11. References

- Spec worktrees : `docs/core/worktrees.md`
- Session-lock (Cowork vs CLI) : `scripts/session-lock.sh`
- Snapshot worktree-aware : `scripts/hooks/pre-compaction-snapshot.sh`
- Regle push main apres merge : `wiki/meta/lessons-learned.md` section "Push main apres merge"
- Decision : D-CONCURRENCY-01 (2026-04-19)

## Voir aussi

- [[worktrees]] — feature git isolation par branche
- [[communication]] — persistance 5 tiers + format CONTEXT.md
- [[knowledge]] — wiki 5 tiers memoire
- [[lessons-learned]] — retour d'experience multi-session
