# Tools — Spec

Utilitaires et automation de Foundation OS. Validators, scripts, CI/CD helpers.

## 1. Inventaire des outils existants

### Validators (scripts/hooks/)

| Outil | Fichier | Role |
|-------|---------|------|
| Void Glass validator | scripts/hooks/validate-void-glass.sh | PreToolUse hook — bloque les couleurs/fonts interdites |

### Git hooks

| Hook | Source | Role |
|------|--------|------|
| commit-msg | .git/hooks/commit-msg | Enforce conventional commits (type(scope): description) |
| pre-commit | scripts/git-hooks/pre-commit (installe vers .git/hooks/) | Run health-check ; BROKEN bloque le commit (exit 1), DEGRADED warn (exit 0), SAIN passe |

### CI/CD

| Outil | Plateforme | Role |
|-------|-----------|------|
| Auto-deploy | Vercel | Deploy sur git push vers main |
| Supabase ping | GitHub Actions (prevu) | Cron hebdo pour eviter la pause 7j inactif |

## 2. Outils a construire (backlog)

Priorite par impact. Ne construire que sur demande explicite.

### Haute priorite

| Outil | Type | Description |
|-------|------|-------------|
| health-check | Script | Execute les indicateurs Monitor (docs/core/monitor.md) et sort le rapport SAIN/DEGRADED/BROKEN |
| supabase-ping | GitHub Action | Cron hebdo — un SELECT 1 pour garder la DB active |

### Moyenne priorite

| Outil | Type | Description |
|-------|------|-------------|
| module-scaffold | Script | Automatise /new-project (mkdir, package.json, README, update CONTEXT.md) |
| ref-checker | Script | Grep les refs cassees apres un rename/delete |

### Basse priorite

| Outil | Type | Description |
|-------|------|-------------|
| bundle-tracker | Script | Log la taille du bundle apres chaque build, alerte si > seuil |
| context-diff | Script | Compare CONTEXT.md avec le filesystem, liste les incoherences |

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

## 5. Limites de Tools

Ce que Tools fait :
- Automation locale (scripts, hooks, validators)
- CI/CD config (GitHub Actions, Vercel)
- Helpers pour les autres modules Core OS (health-check pour Monitor, ref-checker pour Cortex)

Ce que Tools ne fait PAS :
- Runtime intelligence (→ Cortex)
- Persistance de donnees (→ Memory)
- Definition des indicateurs (→ Monitor)
