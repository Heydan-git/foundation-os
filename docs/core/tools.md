# Tools — Spec

Utilitaires et automation de Foundation OS. Validators, scripts, CI/CD helpers.

## 1b. Catalogue complet (Tools v2)

Inventaire exhaustif de tous les outils : `docs/core/tools/index.json` (109 outils, 10 categories).
Registres par categorie : `docs/core/tools/registry/*.json`.
Routing etendu : `docs/core/tools/routing.json` (35 regles, 14 domaines).
Vue lisible : `docs/core/tools/README-tools-catalogue.md`.
Script CLI : `bash scripts/tool-register.sh --help`.

Le catalogue est la source de verite pour le routing intelligent.

## 1. Inventaire des outils existants

### Validators (scripts/hooks/)

| Outil | Fichier | Role |
|-------|---------|------|
| Void Glass validator | scripts/hooks/validate-void-glass.sh | PreToolUse hook — bloque les couleurs/fonts interdites |
| Security reminder | scripts/hooks/security-reminder.py | PreToolUse hook — rappel de ne pas commit de secrets |

### Scripts

| Outil | Fichier | Role |
|-------|---------|------|
| health-check | scripts/health-check.sh | Execute les indicateurs Monitor et sort le rapport SAIN/DEGRADED/BROKEN (appele par pre-commit et /session-end) |
| sync-check | scripts/sync-check.sh | Audit complet /sync : 6 checks auto (health-check + modules vs CONTEXT.md + refs last commit + Core OS coherence + routes vs App.tsx + fonts Void Glass) |
| ref-checker | scripts/ref-checker.sh | Audit full-repo des refs cassees dans les .md : markdown links `[text](path)` resolus relatif au src + backticks `` `dir/...` `` resolus relatif racine. Code-block aware, glob/template chars filtres. Complementaire de sync-check (qui ne scanne que HEAD~1..HEAD) |
| module-scaffold | scripts/module-scaffold.sh | Scaffold un nouveau module : `modules/<nom>/{README.md, package.json, src/}` + update CONTEXT.md table Modules. Idempotent, kebab-case, --help |

### Git hooks

| Hook | Source | Role |
|------|--------|------|
| commit-msg | .git/hooks/commit-msg | Enforce conventional commits (type(scope): description) |
| pre-commit | scripts/git-hooks/pre-commit (installe vers .git/hooks/) | Run health-check ; BROKEN bloque le commit (exit 1), DEGRADED warn (exit 0), SAIN passe |

### CI/CD

| Outil | Plateforme | Role |
|-------|-----------|------|
| Auto-deploy | Vercel | Deploy sur git push vers main (root dir modules/app) |
| Supabase ping | GitHub Actions (.github/workflows/) | Cron hebdo — SELECT 1 pour eviter la pause 7j inactif |

## 1c. Skills Knowledge (claude-obsidian v1.4.3 — D-WIKI-01)

Plugin `claude-obsidian` adopte 2026-04-15. 10 skills + 4 commands + 2 agents + 5 templates. Spec complete : `docs/core/knowledge.md`.

### Skills

| Skill | Role | Trigger | Allowed tools |
|-------|------|---------|---------------|
| wiki | Scaffold vault + router | `/wiki`, "set up wiki", "obsidian vault" | Read Write Edit Glob Grep Bash |
| wiki-ingest | Ingest source (URL/PDF/image) → pages wiki | "ingest [file]", "ingest this URL" | Read Write Edit Glob Grep Bash WebFetch |
| wiki-query | Search multi-depth dans vault | Question sur contenu wiki | Read Glob Grep |
| wiki-lint | Qualite vault (broken links, orphans) | "lint wiki", "check vault" | Read Write Edit Glob Grep |
| save | Conversation → wiki page | `/save [name]`, `/save session` | Read Write Edit Glob Grep |
| autoresearch | Web research loop 3-5 rounds | `/autoresearch [topic]` | Read Write Edit Glob Grep Bash WebFetch |
| canvas | Obsidian canvas visual | `/canvas [desc]` | Read Write Edit Glob |
| defuddle | Clean article web (ads/nav removal) | Ingest URL avec defuddle available | Read Bash |
| obsidian-bases | Dataview replacement natif Obsidian | Utilisation bases dashboards | Read Write Edit Glob Grep |
| obsidian-markdown | Syntax kepano (Obsidian creator) | Standardisation Obsidian markdown | Read Write Edit |

### Commands associees

| Command | Skill | Objectif |
|---------|-------|----------|
| `/wiki` | wiki | Bootstrap ou check vault |
| `/save [name]` | save | Sauver conversation en wiki page |
| `/autoresearch [topic]` | autoresearch | Research loop web |
| `/canvas [desc]` | canvas | Canvas visual Obsidian |

### Agents

| Agent | Role |
|-------|------|
| wiki-ingest | Ingestion source complete (compatible Task tool) |
| wiki-lint | Audit qualite vault (compatible Task tool) |

### Hooks (voir `docs/core/knowledge.md` section 5)

| Hook | Etat | Role |
|------|------|------|
| SessionStart | INTEGRE | Wrapper `scripts/hooks/session-start-wiki.sh` (drift-detector + cat wiki/hot.md) |
| PostCompact | ACTIF | Re-cat wiki/hot.md apres compactage |
| PostToolUse Write\|Edit | **DESACTIVE** | Auto-commit wiki/ — casse regle Kevin-valide. Remplace par `scripts/wiki-commit.sh` |
| Stop | ACTIF | Notif WIKI_CHANGED si wiki/ modifie |

### Scripts custom

| Script | Role |
|--------|------|
| `scripts/wiki-commit.sh` | Commit manuel wiki/ + .raw/ (respect Kevin-valide) |
| `scripts/wiki-health.sh` | Health-check wiki (hot.md age, index.md sync, pages count) |
| `scripts/hooks/session-start-wiki.sh` | Wrapper SessionStart chainage |

## 2. Outils a construire (backlog)

Priorite par impact. Ne construire que sur demande explicite.

### Drops post-eval (2026-04-07)

| Outil | Decision | Raison |
|-------|----------|--------|
| bundle-tracker | DROP | Overlap health-check : seuils JS>600KB / CSS>40KB deja en place et bloquants. L'evolution dans le temps est deja captee par git history des sections "Etat technique" de CONTEXT.md. Personne ne consultera un CSV historique. |
| context-diff | DROP | Overlap sync-check : modules vs CONTEXT, routes vs App.tsx, Core OS coherence sont deja automatises. "Inventory tools installes" change rarement et reste manuel. Faible valeur ajoutee. |

## 3. Conventions

### Scripts
- Emplacement : `scripts/` (pas a la racine)
- Langage : bash ou node (selon complexite)
- Nommage : kebab-case (ex: `health-check.sh`)
- Chaque script a un `--help` qui decrit ce qu'il fait

### Hooks
- Git hooks : `.git/hooks/` (ou via husky si installe)
- Claude hooks : declares dans `.claude/settings.json` (PreToolUse, PostToolUse)

### CI/CD
- GitHub Actions : `.github/workflows/`
- Vercel : config dans `modules/app/vercel.json`

## 4. Principes

- **Pas d'outil sans besoin** — ne pas creer "au cas ou"
- **Un outil = une responsabilite** — pas de script qui fait 5 choses
- **Idempotent** — relancer un script donne le meme resultat
- **Exit codes** — 0 = OK, 1 = erreur, 2 = warning
- **Pas de dependance externe** sauf si absolument necessaire

## 4c. Worktrees (feature Claude Code native)

Feature native de la harness Claude Code pour travailler en parallele sur plusieurs branches isolees (`claude --worktree`, `.claude/worktrees/<nom>/`).

- Spec : `docs/core/worktrees.md`
- Reference officielle : https://code.claude.com/docs/en/common-workflows.md
- Integration : `.claude/worktrees/` dans `.gitignore` + exclu du scan `ref-checker.sh`
- Orphelins archives dans `.archive/worktrees-orphelins/`

Usage : `claude --worktree <nom>` pour isoler un plan risque. Nettoyage automatique par Claude Code en fin de session si aucun changement.

## 4b. Planner (module Core OS — commande /plan-os)

Generateur de plans d'execution avec routing modele automatique (haiku/sonnet/opus), regle sub-agent stricte (3 conditions), versionnement dans `docs/plans/`.

- Spec : `docs/core/planner.md`
- Commande : `.claude/commands/plan-os.md`
- Template : `docs/plans/_template-plan.md`
- Depend de : `superpowers:writing-plans` (moteur), `docs/plans/` (sortie)

Objectif : economiser des tokens sur les taches longues sans degrader la qualite. Kevin valide toujours bloc par bloc avant execution.

## 5. Limites de Tools

Ce que Tools fait :
- Automation locale (scripts, hooks, validators)
- CI/CD config (GitHub Actions, Vercel)
- Helpers pour les autres modules Core OS (health-check pour Monitor, ref-checker pour Cortex)
- Planner (commande /plan-os) pour economie de tokens et tracabilite des plans

Ce que Tools ne fait PAS :
- Runtime intelligence (→ Cortex)
- Persistance de donnees (→ Communication)
- Definition des indicateurs (→ Monitor)

## Voir aussi

- [[monitor]] — module Monitor (health indicators)
- [[planner]] — module Planner (orchestrateur plans)
- [[worktrees]] — module Worktrees (scripts worktree-*)
- [[knowledge]] — module Knowledge (skills claude-obsidian)
