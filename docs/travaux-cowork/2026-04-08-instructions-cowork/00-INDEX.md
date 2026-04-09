# Instructions Cowork — Index

> 🎯 **But** : faire cohabiter Cowork Desktop (L1b) et Claude Code CLI sur le même repo `foundation-os/` avec les mêmes règles, sans collision.
> 📅 **Ouverte** : 2026-04-08
> 📌 **Statut** : actif

## 📦 Contenu

| Fichier | Rôle |
|---|---|
| `01-project-instructions.md` | Instructions complètes à coller dans Cowork → Settings du projet "🪐 FoundationOS" → champ Instructions (12 sections, iso `CLAUDE.md`) |
| `02-anti-collision.md` | Protocole détaillé verrou + git + zones exclusives + lockfile `scripts/session-lock.sh` |

## 🛠️ Outils associés (hors dossier)

- `scripts/session-lock.sh` — verrou local TTL 30 min (acquire / release / status / force)
- `.fos-session.lock` — lockfile à la racine (gitignoré, créé par le script)
- `.gitignore` — ligne `.fos-session.lock` ajoutée

## 🔗 Jumeaux (sync obligatoire)

- `CLAUDE.md` à la racine — règles CLI miroir de `01-project-instructions.md`
- `docs/core/*.md` — specs Core OS (cortex, memory, monitor, tools) référencées par les deux têtes

## ✅ Checklist d'installation

1. ☐ Copier `01-project-instructions.md` dans Claude Desktop → Cowork → Settings FoundationOS → Instructions
2. ☐ Vérifier que `scripts/session-lock.sh` est exécutable (`chmod +x` si besoin)
3. ☐ Ajouter dans `.claude/commands/session-start.md` côté CLI : `bash scripts/session-lock.sh acquire cli`
4. ☐ Ajouter dans `.claude/commands/session-end.md` côté CLI : `bash scripts/session-lock.sh release cli`
5. ☐ Tester un cycle : `acquire cowork` → `status` → `release cowork`
6. ☐ Commit (côté CLI uniquement) : `feat(core): cowork integration + session lockfile`

## 📝 Historique

- **2026-04-08** — création initiale. Fichiers produits à plat dans `docs/cowork/` puis rangés ici pour respecter la convention `docs/travaux-cowork/<initiative>/`.
