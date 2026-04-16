# Cowork ↔ Claude Code CLI — Protocole anti-collision

> 🎯 Empêcher les deux têtes (Cowork desktop et Claude Code CLI) de se marcher dessus sur le même repo `foundation-os/`.
> 🔗 Document jumeau : `docs/travaux-cowork/2026-04-08-instructions-cowork/01-project-instructions.md` (§5 renvoie ici).
> 🛠️ Outil associé : `scripts/session-lock.sh`.

---

## 1. 🧱 Mécanismes empilés (du plus simple au plus robuste)

| # | Mécanisme | État | Effort | Couvre |
|---|-----------|------|--------|--------|
| 1 | Discipline temporelle (une tête à la fois) | actif (règle) | 0 | 80 % des cas |
| 2 | Git comme arbitre (Cowork ne commit jamais) | actif (règle) | 0 | écrasement via commit |
| 3 | Zones exclusives par propriétaire | actif (table §2) | 0 | conflits de zone |
| 4 | Lockfile `.fos-session.lock` | actif (`session-lock.sh`) | faible | parallèle accidentel |
| 5 | Read-before-Edit systématique | actif (par défaut) | 0 | écriture aveugle |
| 6 | Branches Git séparées | optionnel | moyen | gros chantiers |
| 7 | Hook pre-commit qui lit le lock | non installé | faible | commit pendant session Cowork |

En production : 1 + 2 + 3 + 4 + 5 suffisent. 6 + 7 si on observe des collisions résiduelles.

---

## 2. 🗂️ Zones exclusives — qui touche quoi

| Zone | Propriétaire | Cowork | Claude Code CLI |
|---|---|---|---|
| `.claude/agents/*` | CLI | 🚫 read-only | ✅ |
| `.claude/commands/*` | CLI | 🚫 read-only | ✅ |
| `scripts/*.sh` | CLI | 🟡 exécution seulement | ✅ écriture + exécution |
| `CLAUDE.md` | CLI | 🟡 read-only sauf demande Kévin | ✅ |
| Git (commit, push, branch, hooks) | CLI | 🚫 jamais | ✅ |
| `modules/app/src/**` (code prod) | CLI | 🚫 sauf demande explicite Kévin | ✅ |
| `CONTEXT.md` | partagé | ✅ avec verrou | ✅ avec verrou |
| `docs/core/*` | partagé | 🟡 lecture, écriture sur demande | ✅ |
| `docs/travaux-cowork/**` | partagé | ✅ | ✅ |
| `docs/specs/`, `docs/plans/`, `.archive/audit-massif/` | partagé | ✅ livrables | ✅ livrables |
| `modules/app/data/*.md` (MD pairs) | partagé | ✅ | ✅ |
| `.archive/artifacts-jsx/*` | gelé | 🟡 read | 🟡 read |
| `_bmad/` | dormant | 🚫 | 🚫 |
| MCPs (Notion, Asana, Figma, Monday, ClickUp) | Cowork | ✅ | 🟡 via OMC |
| Skills (médicaux, design, finance, etc.) | Cowork | ✅ | 🟡 gstack minimal |
| Computer-use desktop (apps natives) | Cowork | ✅ | 🚫 |
| Livrables docx/xlsx/pptx/pdf | Cowork | ✅ | 🚫 |

🔑 **Règle d'arbitrage** : doute → AskUserQuestion à Kévin avant écriture.

---

## 3. 🔧 Git — règles d'or

1. 🚫 **Cowork ne commit jamais.** Pas de `git commit`, `git push`, `git merge`, `git rebase`, `git checkout` de branche.
2. ✅ Cowork peut faire `git status`, `git log`, `git diff`, `git show` (lecture seule).
3. 📖 Avant toute écriture sur un fichier "chaud" (CONTEXT.md, code, doc partagée) :
   ```bash
   git status <fichier>
   git log -1 --format="%ar — %an — %s" <fichier>
   ```
   Si un commit < 5 min existe d'une autre tête → **relire le fichier** avant Edit, jamais d'écrasement brut.
4. 🧹 En fin de session Cowork, le repo doit être **dirty propre** : modifications visibles, prêtes pour review + commit côté CLI ou Kévin manuel.
5. 🛡️ Si Claude Code CLI démarre et voit `git status` non-vide → c'est le signal qu'une session Cowork a tourné. Review d'abord, code ensuite.

---

## 4. 🔁 Verrou doux — `CONTEXT.md`

Avant chaque écriture sur `CONTEXT.md` :

1. `git log -1 --format="%ar — %s" CONTEXT.md`
2. Si dernière modif < 5 min par l'autre tête → **Read** le fichier intégralement, merger à la main
3. Si conflit visible (sections incompatibles) → **stopper**, afficher le diff à Kévin, demander l'arbitrage

🚫 **Jamais d'écrasement brut** sur `CONTEXT.md`. Toujours Read récent + Edit ciblé, jamais Write.

---

## 5. 🔐 Verrou dur — `scripts/session-lock.sh`

Lockfile à `.fos-session.lock` (racine repo, gitignoré, TTL 30 min, format `key=value`).

### Commandes

| Commande | Effet | Exit |
|---|---|---|
| `bash scripts/session-lock.sh acquire <head>` | Pose le lock si libre, refresh si déjà tenu par moi | 0 OK / 1 BLOCKED / 3 expiré récupéré |
| `bash scripts/session-lock.sh release <head>` | Libère le lock si je le tiens | 0 OK / 1 refus (pas à moi) |
| `bash scripts/session-lock.sh status` | Affiche `FREE` / `HELD <head>` / `EXPIRED` | 0 |
| `bash scripts/session-lock.sh force <head>` | Override, à n'utiliser qu'avec OK Kévin | 0 |
| `bash scripts/session-lock.sh --help` | Usage | 2 |

`<head>` ∈ `{cowork, cli}`. TTL configurable via `LOCK_TTL_MIN` (env, défaut 30).

### Protocole Cowork (à appliquer à chaque session non-triviale)

```bash
# 🟢 Session-start
bash scripts/session-lock.sh acquire cowork
# → exit 1 BLOCKED ? stopper, prévenir Kévin, demander arbitrage

# 🛠️ ... travail ...

# ♻️ Si session > 25 min : refresh
bash scripts/session-lock.sh acquire cowork

# 🛑 Session-end (toujours, même en cas d'abandon)
bash scripts/session-lock.sh release cowork
```

### Protocole Claude Code CLI (miroir)

À ajouter dans `.claude/commands/session-start.md` et `session-end.md` :

```bash
# session-start
bash scripts/session-lock.sh acquire cli || {
  echo "BLOCKED — Cowork tient le lock. Stop, prévenir Kévin."
  exit 1
}

# session-end
bash scripts/session-lock.sh release cli
```

### Règles d'usage

- 🚫 **Jamais `force`** sans OK explicite de Kévin
- ✅ Lecture seule reste autorisée même si lock détenu par l'autre — le verrou protège les **écritures**
- ✅ Crash de session → lock expire seul après 30 min, l'autre tête peut le récupérer (exit 3 = warning)
- 🔄 Le lock est local : pas committé, jamais poussé sur Git, ne traverse pas les machines

---

## 6. 🧪 Cas d'usage testés

| Scénario | Commande | Résultat attendu |
|---|---|---|
| Lock libre | `acquire cowork` | exit 0, lock posé |
| Lock pris par moi-même | `acquire cowork` | exit 0, refresh TTL |
| Lock pris par l'autre | `acquire cli` (alors que cowork tient) | exit 1, BLOCKED |
| Override volontaire | `force cli` | exit 0, warning |
| Release par le bon owner | `release cowork` | exit 0 |
| Release par le mauvais owner | `release cli` (alors que cowork tient) | exit 1, refus |
| Lock expiré (>30 min) | `acquire cli` | exit 3, warning, lock récupéré |
| Status libre | `status` | `FREE aucun lock` |
| Status pris | `status` | `HELD <head> depuis <iso> (reste ~Nmin)` |

✅ Tous validés (smoke tests 2026-04-08, voir `CONTEXT.md` Dernières sessions).

---

## 7. 🚨 Que faire en cas de collision détectée

1. **Stopper immédiatement** toute écriture
2. `git status` + `git diff` pour voir l'état
3. Identifier la tête fautive via `bash scripts/session-lock.sh status` et `git log -5`
4. Afficher le résumé à Kévin via AskUserQuestion (3-4 options : `resoudre manuel / reset --hard / forcer release / annuler la session`)
5. Ne **rien commit** tant que Kévin n'a pas tranché
6. Loguer l'incident dans `CONTEXT.md` section "Risques" avec date + cause racine

---

## 8. 📎 Références

- 🔧 `scripts/session-lock.sh` — implémentation
- 📜 `docs/travaux-cowork/2026-04-08-instructions-cowork/01-project-instructions.md` — instructions Cowork (renvoie ici §5)
- 📜 `CLAUDE.md` — règles CLI miroir
- 📌 `CONTEXT.md` — état courant
- 🧠 `docs/core/cortex.md`, `memory.md`, `monitor.md`, `tools.md` — specs Core OS

---

_Créé : 2026-04-08 — à tenir iso avec `scripts/session-lock.sh`._
