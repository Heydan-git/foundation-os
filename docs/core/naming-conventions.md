# Foundation OS — Conventions de nommage

> Source de verite unique. CLAUDE.md pointe ici. Applique automatiquement par `/plan-os`, `/wt`, et les workflows session.

## 1. Branches git

Format obligatoire :

```
<type>/<scope>-<short-desc>[-yymmdd]
```

### Types autorises

| Type | Usage | Exemple |
|------|-------|---------|
| `feat/` | Nouvelle feature | `feat/ds-void-glass` |
| `fix/` | Bugfix | `fix/sync-check-memory-ref` |
| `docs/` | Documentation seule | `docs/cockpit-desktop` |
| `refactor/` | Refactor technique sans changement comportement | `refactor/brief-v11-source-unique` |
| `chore/` | Maintenance (deps, config, clean) | `chore/purge-settings-local` |
| `audit/` | Audit multi-sessions | `audit/cycle3-massif` |
| `wt/` | Worktree ephemere (date obligatoire) | `wt/migration-desktop-260415` |

### Regles de format

- **lowercase uniquement**
- **separateur `-`** (jamais `_`)
- **max 40 caracteres** total (y compris le prefixe)
- **scope** : 1-2 mots (ds, cockpit, auth, api, app, core, etc.)
- **desc** : 2-4 mots descriptifs
- **pas d'accents, pas d'espaces**
- **date** uniquement pour `wt/` au format `yymmdd` (ex. `260415` = 15 avril 2026)

### Branches interdites

- `claude/*` auto-genere (noms aleatoires type `claude/agitated-wilson`) — **deprecated 2026-04-15**
- `main-2`, `backup-foo`, `test` — trop vagues
- Noms avec caracteres speciaux, majuscules, accents

## 2. Worktrees

Creation **exclusivement** via :

```bash
./scripts/worktree-new.sh <desc-courte>
# ou
/wt new <desc-courte>
```

Le script force le format :
- Dossier : `.claude/worktrees/<desc>-<yymmdd>/`
- Branche : `wt/<desc>-<yymmdd>`

**Jamais** `git worktree add` manuel. **Jamais** de nom sans date.

Fermeture :

```bash
./scripts/worktree-clean.sh <desc>
# ou
/wt clean <desc>
```

## 3. Sessions Claude Code Desktop

Format oblige (affiche dans sidebar Desktop) :

```
🪐 <Mini-detail de ce qu'on fait> (DD-MM-YYYY)
```

### Exemples

- `🪐 Migration Foundation OS Desktop (15-04-2026)`
- `🪐 Fix sync-check memory ref (15-04-2026)`
- `🪐 DS Void Glass Phase 3 (14-04-2026)`
- `🪐 Bug report routes CONTEXT.md (16-04-2026)`

### Mecanisme

**Feature native Claude Code Desktop** (release ~2026-04) : la session est **auto-renommee** depuis le titre du plan quand l'utilisateur valide `ExitPlanMode`.

Donc :
- `/plan-os` force ce format dans le titre du plan genere.
- Desktop app renomme la session automatiquement au moment du ExitPlanMode.
- Zero hack custom.

### Mini-detail

- 3 a 6 mots
- francais OU anglais selon domaine (technique = anglais autorise, metier = francais)
- descriptif et concret (pas "Update stuff")

### Date

- Format `DD-MM-YYYY` (style FR)
- Jour de creation du plan
- Entre parentheses

### Sessions deja en cours

Si une session est en cours sans plan, le renommage ne se fait pas automatiquement. Kevin peut renommer manuellement via l'UI Desktop. Pas d'API pour le faire depuis un tool (limite technique connue).

## 4. Fichiers de plans

Format :

```
docs/plans/YYYY-MM-DD-<slug>.md
```

- `YYYY-MM-DD` : format ISO (2026-04-15)
- `slug` : lowercase, `-` separator, 3-6 mots descriptifs
- Extension `.md`

### Exemples

- `docs/plans/2026-04-15-migration-foundation-desktop.md`
- `docs/plans/2026-04-14-ds-rebuild-from-base.md`
- `docs/plans/2026-04-15-migration-foundation-desktop.md`

### Duplication plan mode natif

Les plans generes par `/plan-os` existent en **dual path** :
- `~/.claude/plans/<slug>.md` — natif Claude Code (visible plan window Desktop, non-versionne)
- `docs/plans/YYYY-MM-DD-<slug>.md` — projet Foundation OS (versionne git)

La copie dans `docs/plans/` se fait automatiquement par `/plan-os` apres `ExitPlanMode`.

## 5. Commits

Deja en place : **conventional commits** (`docs/core/cortex.md` + CLAUDE.md).

Format : `<type>(<scope>): <description courte>`

Types : `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `style`, `perf`.

Scope optionnel mais recommande (match avec scope de branche).

### Regles Foundation OS

- Pas de `achieve`, `accomplish`, `world-first`, `revolutionary`, `$XB`, etc. (regle anti-bullshit CLAUDE.md)
- Message factuel, imperatif
- Ligne sujet < 72 chars
- Body optionnel pour phase majeure
- Co-author `Claude Opus 4.6 (1M context)` en footer si session Claude

## 6. Fichiers de specs

Format :

```
docs/specs/YYYY-MM-DD-<slug>-(design|plan|audit).md
```

- `YYYY-MM-DD` : date creation
- `slug` : lowercase, `-`
- Suffixe explicite : `design` / `plan` / `audit` / `spec`

### Exemples

- `docs/specs/2026-04-10-cockpit-design.md`
- `docs/specs/2026-04-10-tools-module-v2-design.md`
- `docs/specs/2026-04-10-tools-module-v2-design.md`

## 7. Memoires auto-memory

Format :

```
~/.claude/projects/-Users-kevinnoel-foundation-os/memory/<type>_<slug>.md
```

Types :
- `user_` : info sur Kevin (role, langue, prefs)
- `feedback_` : regle corrective ou validation
- `project_` : info projet actif
- `reference_` : pointeur externe
- `tools_` : info outils installes

Slug : lowercase, `_` separator (pas `-` ici, c'est un namespace different).

Frontmatter obligatoire :
```yaml
---
name: <Titre court>
description: <Description une ligne pour decide-relevance future>
type: <user|feedback|project|reference|tools>
---
```

## 8. Application automatique

Ces conventions sont appliquees automatiquement par :

- `/plan-os` — force titre 🪐, slug fichier, routing skills selon contexte
- `/wt` — force format branches + dossiers worktree
- `/cockpit` — affiche worktree actif au bon format
- `/session-end` — verifie conventions avant commit
- `scripts/hooks/branch-name-check.sh` (optionnel, warning non-bloquant)

Les memoires auto-memory garantissent la persistance entre sessions :
- `feedback_branches_convention.md`
- `feedback_sessions_nommage_planete.md`
- `feedback_worktrees_actifs.md`
- `feedback_tout_automatique.md` (meta-regle)

## Historique

- 2026-04-15 — Creation spec initiale pendant migration Foundation OS vers Claude Code Desktop. Phase 2/9 du plan `docs/plans/2026-04-15-migration-foundation-desktop.md`.
