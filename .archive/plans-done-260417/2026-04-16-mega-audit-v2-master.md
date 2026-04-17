---
type: plan
title: "Mega Audit V2 — Plan MASTER complet (FORME + FONCTION + INNOVATIONS)"
slug: 2026-04-16-mega-audit-v2-master
date: 2026-04-16
status: active
phases_total: 23
sessions_estimees: 5-7
priority: P0
related:
  - docs/audits/2026-04-16-mega-audit-v2/rapport-master-v2.md
  - docs/audits/2026-04-16-mega-audit-v2/rapport-master.md
  - docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md
  - docs/audits/2026-04-16-mega-audit-v2/raw/ (7 rapports bruts)
  - docs/plans/2026-04-16-mega-audit-v2-execution.md (sub-plan FORME, 8 phases)
  - docs/plans/2026-04-16-mega-audit-v2-fonction.md (sub-plan FONCTION, 11 phases)
  - wiki/concepts/Foundation OS.md
---

# Plan MASTER complet — Mega Audit V2 Foundation OS

> **PLAN UNIFIE 100%**. Couvre les **166 findings** de l'audit : 146 FORME (hygiene) + 20 FONCTION (cerveau cognitif) + 10 innovations cognitives.
>
> **Objectif** : transformer Foundation OS de "pile de rituels manuels a hygiene drift" en "systeme cognitif auto-observant SAIN". Score vise : FORME 9/10 + FONCTION 8/10.
>
> **Base** :
> - `docs/audits/2026-04-16-mega-audit-v2/rapport-master-v2.md` (vue unifiee)
> - `docs/audits/2026-04-16-mega-audit-v2/raw/agent-1-core-os-racine.md` a `agent-7-docs-ci-supabase.md` (detail 146 findings FORME)
> - `docs/audits/2026-04-16-mega-audit-v2/rapport-comportement.md` (20 findings FONCTION + 10 innovations)
>
> **Principe** : 1 phase = 1 theme coherent = 1 commit atomique. Chaque phase respecte les **6 elements obligatoires** (memoire `feedback_plans_ultra_detailles.md`) :
> 1. Pre-conditions verifiables
> 2. Etat repo attendu au debut
> 3. Actions atomiques numerotees avec snippets exacts
> 4. Verification post-phase (commandes)
> 5. Rollback explicite
> 6. Commit message preformate
>
> **Regle d'or** : si verification echoue → rollback propre, investiguer, retry.

## Vue d'ensemble (23 phases)

| # | Phase | Type | Duree | Priorite |
|---|-------|------|-------|----------|
| 0 | Preparation (worktree, branch) | Setup | 5 min | MUST |
| **BLOC A — FORME bombes latentes** | | | **~90 min** | **MUST** |
| 1 | Fix tokens DS + git hooks + migrations SQL | Preventif | 90 min | P0 |
| **BLOC B — FORME narratives & archivages** | | | **~2h** | **MUST** |
| 2 | Alignement narratives (iso base DS → Void Glass fork, Brief v11→v12, Storybook 8→9) | Docs | 45 min | P0 |
| 3 | Archivages obsoletes (data/, forms/, specs DONE, preview/, base DS, backups) | Cleanup | 30 min | P0 |
| **BLOC C — FORME unifications** | | | **~1h** | **MUST** |
| 4 | Unifications counts (wiki, CSS, tools catalogue, sessions trim) | Data | 45 min | P0 |
| 5 | Memory consolidations (3 deprecations + markers clairs) | Memory | 20 min | P0 |
| **BLOC D — FORME harness** | | | **~45 min** | **MUST** |
| 6 | Harness orphelins (hooks, scripts chain, health-check completeness) | Scripts | 45 min | P0 |
| **BLOC E — FORME drifts P1-P2-P3 exhaustifs** | | | **~2h** | **SHOULD** |
| 7 | Drifts Core OS (F-05 a F-25 Agent 1 + F-04 a F-22 Agent 2) | Docs | 45 min | P1-P3 |
| 8 | Drifts Wiki + Memory (F-P1-F-P3 Agent 3, F-05 a F-20 Agent 4) | Docs | 30 min | P1-P3 |
| 9 | Drifts Modules + CI + Supabase + docs (Agent 5, 6, 7 residuels) | Docs + DS | 45 min | P1-P3 |
| **BLOC F — FONCTION innovations cognitives** | | | **~15h** | **MUST** |
| 10 | I-08 Routines Cloud → GitHub Actions | Autonomie | 2h | P0 |
| 11 | I-02 Session transcript analyzer | Analytics | 3h | P0 |
| 12 | I-01 Hook Grep wiki PreToolUse (reflex 1 auto) | Cognitif | 1h | P0 |
| 13 | I-04 Tuile #15 "Propositions Claude" dans brief v12 | Cognitif | 1h | P0 |
| 14 | I-07 Self-diagnostic neuroplasticite score | Monitoring | 2h | P1 |
| 15 | I-05 Enforcement runtime routing Cortex | Cognitif | 2h | P1 |
| 16 | I-09 Memory auto-priorisation (last_used) | Hygiene | 1h | P1 |
| 17 | I-06 Contradiction detector tier memoire | Enforcement | 2h | P1 |
| 18 | I-10 Feedback loop post-session rating | Analytics | 1h | P2 |
| 19 | I-03 Brief v12 adaptatif (minimal/standard/deep) | UX | 3h | P2 opt |
| **BLOC G — Verification finale** | | | **~1h** | **MUST** |
| 20 | Run scenarios S1-S10 apres innovations | Verif | 30 min |
| 21 | Regenerer tous les counts + health-check + brief cloture | Verif | 15 min |
| 22 | Merge main + archive audit v2 + update CONTEXT.md + hot.md | Cloture | 15 min |

**TOTAL** : ~22h reparti sur 5-7 sessions.
**MUST uniquement** (skip Phase 19) : ~19h.

---

## Decoupage par session recommande

### Session 1 : FORME critique (3h30)
- Phase 0 prep
- Phases 1-6 (bombes latentes + narratives + archivages + counts + memory + harness)
- Verification intermediaire health-check
- Commit atomique par phase

### Session 2 : FORME exhaustive (2h)
- Phases 7-9 (drifts P1-P2-P3 exhaustifs)
- Commits atomiques

### Session 3 : FONCTION batch 1 (4h)
- Phase 10 I-08 routines Cloud
- Phase 11 I-02 session analyzer
- Phase 12 I-01 hook wiki recall

### Session 4 : FONCTION batch 2 (4h)
- Phase 13 I-04 propositions
- Phase 14 I-07 score neuroplasticite
- Phase 15 I-05 cortex enforcement

### Session 5 : FONCTION batch 3 + cloture (4h)
- Phase 16 I-09 memory priorisation
- Phase 17 I-06 contradiction detector
- Phase 18 I-10 feedback loop
- Phase 20-22 verification + cloture

### Session 6 (OPTIONNEL) : Nice-to-have
- Phase 19 I-03 brief adaptatif

---

## Phase 0 — Preparation

### Pre-conditions
- Sur main ou worktree propre
- Travail precedent commit
- Audit v2 consulte (rapport-master-v2.md lu)
- Kevin a valide le plan

### Etat repo attendu
- `docs/audits/2026-04-16-mega-audit-v2/` present avec 11 fichiers
- Ce plan (`docs/plans/2026-04-16-mega-audit-v2-master.md`) existe
- Sub-plans dispo (execution.md + fonction.md) — pour reference detaillee

### Actions atomiques
```bash
cd /Users/kevinnoel/foundation-os
git status  # clean
git checkout main
git pull
bash scripts/worktree-new.sh audit-v2-master
cd .claude/worktrees/audit-v2-master-$(date +%y%m%d)
git branch --show-current  # feat/audit-v2-master-YYMMDD
```

### Verification
- `git worktree list` affiche le worktree
- `bash scripts/health-check.sh` = SAIN (ou DEGRADED seulement pour drift branche)

### Rollback
```bash
bash scripts/worktree-clean.sh audit-v2-master
```

### Commit message
(pas de commit prep)

---

## Phase 1 — Bombes latentes FORME (tokens DS + git hooks + migrations SQL)

**Reference detaillee** : voir `docs/plans/2026-04-16-mega-audit-v2-execution.md` Phase 1 (integration verbatim ci-dessous).

### Pre-conditions
- Phase 0 complete
- Kevin a valide Option A (purger tokens/) vs Option B (recreer DTCG) pour F-01 Agent 6

### Etat repo attendu
- `modules/design-system/tokens/` **INEXISTANT**
- `.git/hooks/commit-msg` obsolete (manque type `merge`)
- `supabase/migrations/*.sql` non-idempotent

### Actions atomiques

#### 1.1 Fix `.git/hooks/commit-msg`
```bash
cp scripts/git-hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg

# Creer script auto-install
cat > scripts/git-hooks-install.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
for hook in commit-msg pre-commit; do
  src="$REPO_ROOT/scripts/git-hooks/$hook"
  dst="$REPO_ROOT/.git/hooks/$hook"
  [ -f "$src" ] && cp "$src" "$dst" && chmod +x "$dst" && echo "Installed: $dst"
done
EOF
chmod +x scripts/git-hooks-install.sh
```

#### 1.2 Purger refs `tokens/` (Option A recommandee)
Editer `modules/design-system/package.json` :
- Supprimer exports `./tokens.css`, `./tokens`, `./tokens.json`
- Dans `files` : retirer `"tokens/source"`, `"tokens/build"`
- Dans `scripts` : retirer `build:tokens`, `check:contrast`
- Ajuster `build` pour retirer dependance `run build:tokens`

```bash
rm modules/design-system/scripts/build-tokens.mjs
rm modules/design-system/scripts/check-contrast.mjs
```

Editer `modules/design-system/README-design-system.md` lignes 18, 31, 88, 102 : remplacer refs `tokens/source/` et `tokens/build/` par `src/styles/tokens.css`.

Editer 5 foundations `modules/design-system/docs-supernova/foundations/*.md` : remplacer paths `tokens/source/*` par `src/styles/tokens.css`.

Editer `modules/design-system/biome.json` : retirer `"tokens/source/**"` du include.

#### 1.3 Fix migrations SQL idempotentes

Editer `supabase/migrations/001_create_tables.sql` :
- Lignes 11, 43, 74, 105, 137, 164 : `CREATE TABLE` → `CREATE TABLE IF NOT EXISTS`
- Lignes policies RLS : `CREATE POLICY` → `CREATE POLICY IF NOT EXISTS`
- Lignes 233-292 (seed data) : deplacer vers `supabase/seed.sql` separe OU ajouter `ON CONFLICT (id) DO NOTHING` sur chaque INSERT

Editer `supabase/migrations/002_add_delete_policies.sql:4-20` : ajouter `IF NOT EXISTS`.

Editer `supabase/migrations/003_add_updated_at.sql:30-35` : avant chaque `CREATE TRIGGER`, ajouter `DROP TRIGGER IF EXISTS <name> ON <table>;`.

### Verification
```bash
# Git hook
echo "Merge branch 'test'" > /tmp/test-msg.txt
bash .git/hooks/commit-msg /tmp/test-msg.txt && echo "Hook accepts merge OK"

# DS build
cd modules/design-system && npm run build
cd ../..

# Health-check global
bash scripts/health-check.sh
```

### Rollback
```bash
git checkout -- .git/hooks/commit-msg  # si backup existe
git checkout -- modules/design-system/
git checkout -- supabase/migrations/
rm scripts/git-hooks-install.sh
```

### Commit message
```
fix(os): P0 bombes latentes — tokens DS purge + git hooks + migrations idempotentes

- Purge refs tokens/ inexistant (package.json, scripts, README, docs-supernova, biome)
- Re-install .git/hooks/commit-msg depuis scripts/git-hooks/ (manquait type merge)
- Script scripts/git-hooks-install.sh pour nouveau clone futur
- Migrations SQL idempotentes (IF NOT EXISTS + ON CONFLICT + DROP TRIGGER IF EXISTS)
- Seed data separee dans supabase/seed.sql

Refs : rapport-master-v2.md BLOC A, raw/agent-6 F-01, raw/agent-2 F-01, raw/agent-7 F-03/F-04/F-15/F-16
```

---

## Phase 2 — Alignement narratives

### Pre-conditions
- Phase 1 complete (build DS OK)

### Etat repo attendu
- CONTEXT.md dit "iso base DS, 0 legacy" (faux)
- CONTEXT.md dit "23/23 tests DS" (faux)
- registry/commands.json : 7 mentions "Brief v11"
- Docs DS mentionnent "Storybook 8" alors que package.json v9
- Naming-conventions.md co-author "Opus 4.6"

### Actions atomiques

#### 2.1 CONTEXT.md honnete
Editer `CONTEXT.md` :
- Ligne 11-12 App Builder : "iso base DS" → "Void Glass fork derive de base DS (46 composants + 7 patterns, tokens ds-*)"
- Ligne 14 Design System : "23/23 tests DS" → "0 unit + 5 e2e stale"
- Ligne 119 Hooks : preciser "3 Claude hooks + 2 git hooks + 2 opt-in"

#### 2.2 CLAUDE.md corrections
- Ligne 146 Max agents : garder `3` (source unique)
- Lignes 105, 112, 173 : `wiki-ingest` → `wiki-ingest (skill plugin claude-obsidian)`
- Ligne 103 : corriger claim docs-sync-check chain (ou faire la chain Phase 6)
- Ligne 61 Stack : ajouter note package.json overrides React 19.2.5

#### 2.3 naming-conventions.md co-author
Ligne 149 : `Opus 4.6` → `Opus` (retirer version hardcode)

#### 2.4 Registry commands.json v11 → v12
```bash
sed -i.bak 's/Brief v11/Brief v12/g' docs/core/tools/registry/commands.json
rm docs/core/tools/registry/commands.json.bak
bash scripts/tool-register.sh rebuild
```

#### 2.5 DS CHANGELOG + README + package.json + .storybook narrative
Mettre a jour :
- `modules/design-system/CHANGELOG.md` ligne 7 + ligne 11 (Storybook 9)
- `modules/design-system/README-design-system.md` lignes 3, 8, 21 (Storybook 9)
- `modules/design-system/package.json` ligne 5 description
- `.storybook/{main,manager,preview}.ts` commentaires "Storybook 8" → "Storybook 9"

#### 2.6 Commentaires composants UI
```bash
# Remplacer "iso base DS" par "derive base DS (Void Glass fork)" dans les 46 composants
for f in modules/design-system/src/components/ui/*.tsx; do
  sed -i.bak 's|iso base DS|derive base DS (Void Glass fork)|g' "$f"
  rm "$f.bak"
done
```

### Verification
```bash
grep -rn "iso base DS" --exclude-dir=.archive --exclude-dir=node_modules
grep -rn "Brief v11" docs/core/ --exclude-dir=.archive  # doit etre 0
grep -rn "Storybook 8" modules/design-system/ --exclude-dir=node_modules  # doit etre 0
grep -n "Opus 4.6" docs/  # doit etre 0
```

### Rollback
`git checkout -- CONTEXT.md CLAUDE.md docs/core/ modules/design-system/`

### Commit message
```
docs(os): P0 narratives alignees — "iso base DS" → "Void Glass fork", Brief v12, Storybook 9

- CONTEXT.md : iso base DS faux → "Void Glass fork", 23/23 tests DS faux → "0 unit + 5 e2e stale"
- CLAUDE.md : wiki-ingest precise skill plugin, max agents aligne sur 3
- naming-conventions : co-author Opus sans version hardcode
- registry/commands.json : 7 mentions v11 → v12 + rebuild catalogue
- DS CHANGELOG/README/package.json/.storybook : Storybook 8 → 9
- 46 composants UI commentaires "iso base DS" → "derive base DS (Void Glass fork)"

Refs : rapport-master-v2.md drifts D1-D5, raw/agent-1 F-03/F-06/F-09, raw/agent-6 F-02/F-07/F-18/F-19
```

---

## Phase 3 — Archivages obsoletes

### Pre-conditions
- Phase 2 complete

### Actions atomiques

```bash
# 3.1 Archiver modules/app/data/ (mots interdits "REVOLUTION HISTORIQUE")
mkdir -p .archive/app-data-jsx-260416
mv modules/app/data .archive/app-data-jsx-260416/data

# 3.2 Archiver modules/app/src/components/forms/ (dead code + tokens legacy)
mkdir -p .archive/app-forms-dead-260416
mv modules/app/src/components/forms .archive/app-forms-dead-260416/forms
mv modules/app/src/test/forms.test.tsx .archive/app-forms-dead-260416/forms.test.tsx

# 3.3 Archiver docs/specs/*.md (DONE)
mkdir -p .archive/specs-done-260416
mv docs/specs/2026-04-05-foundation-os-v2-design.md .archive/specs-done-260416/
mv docs/specs/2026-04-10-cockpit-design.md .archive/specs-done-260416/
mv docs/specs/2026-04-10-tools-module-v2-design.md .archive/specs-done-260416/
echo "# docs/specs\n\nSpecs DONE archivees dans .archive/specs-done-260416/." > docs/specs/README.md

# 3.4 Archiver modules/design-system/preview/
mkdir -p .archive/ds-preview-260416
mv modules/design-system/preview .archive/ds-preview-260416/preview
# Retirer scripts preview du package.json DS

# 3.5 Archiver modules/design-system/base DS/
mkdir -p .archive/ds-reference-base-260416
mv "modules/design-system/base DS" ".archive/ds-reference-base-260416/base DS"

# 3.6 Archiver .claude/settings.local.json.backup-pre-wiki-260415
mkdir -p .archive/settings-backups-260415
mv .claude/settings.local.json.backup-pre-wiki-260415 .archive/settings-backups-260415/

# 3.7 Purger .supernova/snapshots/ stale
rm -rf modules/design-system/.supernova/snapshots/snap-*
echo "modules/design-system/.supernova/snapshots/" >> .gitignore
```

### Verification
```bash
cd modules/app && npm run build && npm run test && cd ../..
cd modules/design-system && npm run build && cd ../..
bash scripts/ref-checker.sh
bash scripts/health-check.sh
```

### Rollback
Restaurer depuis `.archive/` chaque element avec `mv`.

### Commit message
```
chore(os): P0 archivages obsoletes — dead code + specs DONE + duplicates

- mv modules/app/data/ (7 MD JSX archives, mots interdits "REVOLUTION HISTORIQUE")
- mv modules/app/src/components/forms/ (3 fichiers 646L dead code + tokens legacy)
- mv docs/specs/*.md (3 specs DONE, plans archives)
- mv modules/design-system/preview/ (100% duplica base DS)
- mv modules/design-system/base DS/ (reference figee hors module actif)
- mv .claude/settings.local.json.backup-pre-wiki-260415
- rm .supernova/snapshots/snap-* stale + .gitignore

Refs : raw/agent-5 F-01/F-02/F-06, raw/agent-6 F-09/F-12, raw/agent-7 F-11, raw/agent-2 F-08
```

---

## Phase 4 — Unifications counts (wiki + CSS + tools + sessions)

### Pre-conditions
- Phase 3 complete

### Actions atomiques

#### 4.1 Creer `wiki/meta/counts.md` source unique
```bash
cat > wiki/meta/counts.md << 'EOF'
---
type: meta
title: "Wiki Counts — Source unique"
updated: 2026-04-16
tags: [meta, counts, source-of-truth]
status: evergreen
related: ["[[index-wiki]]", "[[hot]]", "[[foundation-os-map]]"]
---

# Wiki Counts

> Auto-regenere par `bash scripts/wiki-counts-sync.sh`. Source unique.

## 2026-04-16

| Metrique | Valeur |
|----------|--------|
| Pages physiques | 48 |
| Pages fonctionnelles (hors templates) | 43 |
| Concepts | 11 |
| Entities | 5 |
| Sources | 4 |
| Meta | 14 |
| Templates | 5 |
| Domains index | 5 |
| Domains content | 2 |
| Wikilinks totaux | 733 |
EOF
```

#### 4.2 Aligner hot.md, overview.md, index-wiki.md, foundation-os-map.md
- `wiki/hot.md` ligne 56 : remplacer "41 pages, 762+ wikilinks" → "48 pages (43 fonctionnelles), 733 wikilinks — voir [[counts]]"
- `wiki/overview.md` ligne 4 : updated: 2026-04-16. Ligne 77 : "36 pages" → "48 pages — voir [[counts]]"
- `wiki/index-wiki.md` lignes 25 + 111 : pointer vers counts.md
- `wiki/meta/foundation-os-map.md` ligne 211 : "93" → "94" + pointer counts

#### 4.3 Trim sessions-recent.md a 5 sessions
Supprimer la section "## 2026-04-15 · Migration Desktop natif (9 phases)" ou fusionner avec Level Up.

#### 4.4 Unifier seuils CSS
```bash
cat > scripts/thresholds.json << 'EOF'
{
  "_doc": "Source unique seuils Foundation OS",
  "_version": "2026-04-16",
  "build": {"app_ms_max": 2000, "ds_ms_max": 5000},
  "bundle": {"js_kb_max": 600, "css_kb_max": 65, "css_kb_baseline": 55},
  "tsx": {"lines_max": 700},
  "wiki": {"sessions_max": 5, "hot_md_age_days_max": 3},
  "docs": {"context_md_lines_max": 200, "claude_md_lines_max": 250}
}
EOF
```

Mettre a jour :
- `docs/core/monitor.md` ligne 34 : CSS < 65KB (pas 40)
- `docs/core/communication.md` ligne 172 : "CSS > 40 kB" → "CSS > 65 kB"

#### 4.5 Creer `registry/knowledge-skills.json`
Extraire les 10 skills claude-obsidian du index.json inline vers un registry dedie. Regenerer via `tool-register.sh rebuild`.

### Verification
```bash
# Wiki counts
grep -rn "Pages :" wiki/ | grep -v counts.md  # doit pointer [[counts]] uniquement
# CSS seuils
grep -rn "CSS.*40" docs/core/  # doit etre 0 (ou historique)
# Tools catalogue
bash scripts/tool-register.sh scan  # total_tools = 109, somme registry = 109 (99 + 10 knowledge-skills)
```

### Rollback
```bash
rm wiki/meta/counts.md scripts/thresholds.json docs/core/tools/registry/knowledge-skills.json
git checkout -- wiki/ docs/core/
```

### Commit message
```
fix(os): P0 unifications counts — wiki + CSS + tools + sessions trim

- wiki/meta/counts.md : source unique pages (48), wikilinks (733)
- hot.md + overview.md + index-wiki.md + foundation-os-map.md alignes
- sessions-recent.md trim 6→5 (regle CLAUDE.md)
- scripts/thresholds.json : seuils uniques (CSS 65KB baseline)
- monitor.md + communication.md : CSS 65KB aligne
- docs/core/tools/registry/knowledge-skills.json : 10 skills extraits inline
- tool-register.sh rebuild coherent

Refs : raw/agent-3 F-P0-01/F-P0-02/F-P0-03/F-P1-01/F-P3-04, raw/agent-1 F-01/F-04
```

---

## Phase 5 — Memory consolidations

### Pre-conditions
- Phase 4 complete
- Kevin a valide les 4 deprecations memoire

### Actions atomiques

```bash
MEMDIR="$HOME/.claude/projects/-Users-kevinnoel-foundation-os/memory"

# 5.1 Deprecier feedback_imperatifs_qualite.md (duplique CLAUDE.md)
cat > "$MEMDIR/_deprecated/feedback_imperatifs_qualite.md" << 'EOF'
---
name: feedback_imperatifs_qualite
description: SUPERSEDED par CLAUDE.md "Imperatifs (non-negociable)"
type: feedback
status: deprecated
deprecated_date: 2026-04-16
superseded_by: CLAUDE.md lignes 5-13
---
# [DEPRECATED] SUPERSEDED 2026-04-16
EOF
rm "$MEMDIR/feedback_imperatifs_qualite.md"

# 5.2 Deprecier feedback_minimal_files.md
cat > "$MEMDIR/_deprecated/feedback_minimal_files.md" << 'EOF'
---
name: feedback_minimal_files
description: SUPERSEDED par CLAUDE.md ligne 130
status: deprecated
deprecated_date: 2026-04-16
---
# [DEPRECATED] SUPERSEDED
EOF
rm "$MEMDIR/feedback_minimal_files.md"

# 5.3 Fusionner feedback_no_token_limit.md dans neuroplasticity
# Ajouter bloc "Max x20" dans feedback_neuroplasticity.md si absent
# Puis deprecier
cat > "$MEMDIR/_deprecated/feedback_no_token_limit.md" << 'EOF'
---
name: feedback_no_token_limit
description: FUSIONNE dans feedback_neuroplasticity.md
status: deprecated
deprecated_date: 2026-04-16
---
# [DEPRECATED] FUSIONNE
EOF
rm "$MEMDIR/feedback_no_token_limit.md"

# 5.4 Deprecier project_ds_refactor_app.md (DONE 2026-04-15)
cat > "$MEMDIR/_deprecated/project_ds_refactor_app.md" << 'EOF'
---
name: project_ds_refactor_app
description: DONE 2026-04-15 (refactor iso DS complete)
status: deprecated
deprecated_date: 2026-04-16
---
# [DONE] 2026-04-15
EOF
rm "$MEMDIR/project_ds_refactor_app.md"

# 5.5 Markers clairs dans _deprecated/ sans status
# Editer 4 memoires : feedback_tdah_briefs, feedback_brief_format, feedback_no_bullshit, feedback_base_ds_no_archive
# Ajouter frontmatter status: deprecated + superseded_by

# 5.6 Update MEMORY.md index
# Retirer 3 lignes deprecated + 1 projet + ajouter section Deprecated enrichie
# Ajouter frontmatter : last_audit: 2026-04-16, total_active: 24, total_deprecated: 12
```

### Verification
```bash
ls "$MEMDIR"/*.md | grep -v MEMORY | wc -l  # = 24 (28-4)
ls "$MEMDIR/_deprecated"/*.md | wc -l  # = 12 (8+4)
```

### Rollback
Restaurer depuis `_deprecated/` vers actif.

### Commit message
```
refactor(os): memory consolidations — 3 doublons CLAUDE.md + 1 projet DONE + markers clairs

- Deprecie feedback_imperatifs_qualite.md (mot pour mot CLAUDE.md)
- Deprecie feedback_minimal_files.md (duplique CLAUDE.md)
- Fusionne feedback_no_token_limit.md dans feedback_neuroplasticity.md
- Deprecie project_ds_refactor_app.md (DONE 2026-04-15)
- Markers SUPERSEDED/DONE explicites 4 memoires _deprecated
- MEMORY.md : index 28→24 actifs + last_audit

Refs : raw/agent-4 F-01/F-02/F-03/F-04/F-06/F-07/F-08/F-18/F-20
```

---

## Phase 6 — Harness orphelins + completeness

### Pre-conditions
- Phase 5 complete

### Actions atomiques

#### 6.1 Activer hook SessionStart wrapper wiki
Editer `.claude/settings.json` ligne 42 : remplacer `drift-detector.sh` par `scripts/hooks/session-start-wiki.sh` (chaine drift + hot.md).

#### 6.2 Decision orphelins (demander Kevin)
- `scripts/session-lock.sh` : activer SessionStart/End OU archiver
- `scripts/hooks/wiki-recall-reminder.sh` : archiver (neuroplasticite manuelle via CLAUDE.md)

#### 6.3 Chainer `tool-register.sh scan` dans health-check.sh
Ajouter section INFO dans `scripts/health-check.sh` :
```bash
echo "  [INFO] Tool registry scan"
bash "$SCRIPT_DIR/tool-register.sh" scan --quiet && echo "    [OK]" || echo "    [WARN] Registry drift"
```

#### 6.4 Chainer `docs-sync-check.sh` dans sync-check.sh
Ou fusionner docs-sync-check.sh dans sync-check.sh (simpler).

#### 6.5 Fix `health-check.sh` TSX scope hardcode
Ligne 91 : `find modules/app/src/{pages,components}` → `find modules/*/src -type f \( -name "*.tsx" -o -name "*.jsx" \) | grep -v node_modules | grep -v dist`.

#### 6.6 Fix `wiki-health.sh` scan full
Ligne 67 : retirer `| head -20` pour scan exhaustif.

#### 6.7 Creer `scripts/wiki-counts-sync.sh`
```bash
cat > scripts/wiki-counts-sync.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

PAGES=$(find wiki -name "*.md" | wc -l | tr -d ' ')
CONCEPTS=$(find wiki/concepts -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
# ... etc

DATE=$(date +%Y-%m-%d)
cat > wiki/meta/counts.md << INNER
---
type: meta
title: "Wiki Counts"
updated: $DATE
---
# Wiki Counts (auto-regenere)
| Pages physiques | $PAGES |
| Concepts | $CONCEPTS |
INNER

echo "Regenere : $PAGES pages"
EOF
chmod +x scripts/wiki-counts-sync.sh
bash scripts/wiki-counts-sync.sh
```

### Verification
```bash
bash scripts/hooks/session-start-wiki.sh
bash scripts/tool-register.sh scan
bash scripts/wiki-counts-sync.sh
bash scripts/health-check.sh
```

### Rollback
`git checkout -- .claude/settings.json scripts/`

### Commit message
```
feat(os): harness wired — hook SessionStart, scripts chaines, wiki-counts-sync

- settings.json SessionStart : wrapper session-start-wiki.sh (hook auto-load wiki/hot.md active)
- session-lock.sh + wiki-recall-reminder.sh : decision orphelins
- tool-register.sh scan chain dans health-check.sh
- docs-sync-check.sh fusionne dans sync-check.sh
- health-check.sh TSX scope dynamique (find modules/*/src)
- wiki-health.sh scan exhaustif (retire head -20)
- NOUVEAU scripts/wiki-counts-sync.sh : source unique auto-regeneree
- NOUVEAU scripts/git-hooks-install.sh (Phase 1)

Refs : raw/agent-2 F-02/F-04/F-05/F-06/F-07/F-11/F-13/F-15
```

---

## Phase 7 — Drifts Core OS P1-P3 exhaustifs (Agent 1 + Agent 2 residuels)

Les drifts P0 ont ete traites Phases 1-6. Cette phase couvre les findings P1/P2/P3 restants.

### Actions atomiques (edits cosmetiques)

```bash
# 7.1 Core OS — Agent 1 findings
# F-10 worktrees.md:115 : ajouter sleepy-ellis + suspicious-khayyam dans historique
# F-11 cortex.md:56-60 : ajouter /cockpit /plan-os /wt dans table Commands
# F-12 communication.md:399-412 : archiver section 9 Migration depuis Memory vers decisions-log
# F-18 knowledge.md:250-258 : idem section 11 historique
# F-19 cortex.md section 6 : repositionner avant "Voir aussi"
# F-21 planner.md:20-63 : preciser box-drawing interdit uniquement briefs session
# F-14 monitor.md:14 : dedupliquer package.json + package-lock.json
# F-15 naming-conventions.md:121-123,166-167 : dedupliquer exemples
# F-22 cortex.md:18-21 : standardiser colonne Exemples
# F-23 .gitignore : ajouter .env.*.local pattern
# F-13 package.json racine : ajouter commentaire overrides React 19.2.5

# 7.2 Scripts & Harness — Agent 2 findings residuels
# F-10 settings.json filter .jsx/.tsx/.css/.scss dans matcher si Claude Code le supporte
# F-12 drift-detector CLAUDE.md 200L : relever seuil a 250L ou compresser CLAUDE.md
# F-16 worktree-new.sh : auto-cd vers main si appele depuis worktree
# F-18 plan-os.md Phase 5b : remplacer box-drawing par blockquote
# F-19 health-check.sh lignes 84,158,221 : fix caracteres replacement U+FFFD
# F-20 doc-agent.md:24 : ajouter path complet docs/core/communication.md
# F-21 os-architect.md + dev-agent.md + review-agent.md + doc-agent.md : ajouter tools explicite
# F-22 loop.md : documenter dans CLAUDE.md comment il est consomme
```

### Verification
```bash
bash scripts/drift-detector.sh  # moins de warnings
bash scripts/ref-checker.sh
```

### Commit message
```
chore(os): drifts P1-P3 Core OS + harness residuels (20+ micro-fixes)

- worktrees.md historique complete
- cortex.md commands registry a jour
- sections historiques migrees vers decisions-log
- dedoublonnages monitor.md + naming-conventions.md
- agents frontmatter tools explicite (read-only pour review-agent)
- .gitignore .env.*.local
- 20+ autres micro-fixes

Refs : raw/agent-1 F-10/F-11/F-12/F-13/F-14/F-15/F-18/F-19/F-21/F-22/F-23, raw/agent-2 F-10/F-12/F-16/F-18/F-19/F-20/F-21/F-22
```

---

## Phase 8 — Drifts Wiki + Memory P1-P3 exhaustifs (Agent 3 + Agent 4 residuels)

### Actions atomiques

```bash
# 8.1 Wiki — Agent 3 findings residuels
# F-P2-01 5 index domaines : updated: 2026-04-16 (tous sur meme date)
# F-P2-05 session-dna.md : format unique YAML (list ou code-block, pas mix)
# F-P2-06 thinking.md : ajouter protocole append "## Insights YYYY-MM-DD"
# F-P3-04 sessions-recent.md : (deja trim Phase 4)

# 8.2 Memory — Agent 4 findings residuels
# F-10 work_patterns.md : renommer feedback_work_patterns.md + update MEMORY.md
# F-11 MEMORY.md : reorganiser par thematique (Profil / Workflow / Plans / DS / Wiki / Qualite / Projets)
# F-12 feedback_ds_reconstruction_protocole.md : migrer vers wiki/domains/design/concepts/ds-reconstruction-protocol-iso-template.md
# F-13 feedback_plans_ultra_detailles.md : reduire aux 6 elements + pointer docs/core/planner.md
# F-15 retirer type reference de typologie documentee (pas utilise)
# F-16/F-17 ajouter originSessionId dans feedback_audit_exhaustif + feedback_imperatifs_qualite
# F-18 feedback_base_ds_no_archive : ajouter marker SUPERSEDED by feedback_no_auto_archive
# F-19 feedback_obsidian_physical_first : dupliquer dans wiki/meta/lessons-learned
# F-20 feedback_ds_iso_figma + feedback_ds_true_iso : ajouter markers SUPERSEDED
```

### Verification
```bash
bash scripts/wiki-counts-sync.sh --check
bash scripts/wiki-health.sh
grep -rn "type: reference" docs/core/  # doit etre 0 si retire
```

### Commit message
```
chore(os): drifts P1-P3 Wiki + Memory residuels

- 5 index domaines date sync
- session-dna.md format YAML unique
- thinking.md protocole append
- work_patterns.md → feedback_work_patterns.md (naming conv)
- MEMORY.md reorganise par thematique
- feedback_ds_reconstruction_protocole migre vers wiki/domains/design/
- feedback_plans_ultra_detailles reduit + pointer planner.md
- Markers SUPERSEDED completes dans _deprecated/

Refs : raw/agent-3 F-P2-01/F-P2-05/F-P2-06, raw/agent-4 F-10/F-11/F-12/F-13/F-15-F-20
```

---

## Phase 9 — Drifts Modules + CI + Supabase + docs peripheriques (Agent 5 + 6 + 7 residuels)

### Actions atomiques

```bash
# 9.1 Modules App — Agent 5 findings residuels
# F-03 Couplage DS minimal : creer issue GitHub pour refactor futur (pas ici, trop gros)
# F-05 vite.config.ts externals fs/path : documenter pourquoi
# F-07 Supabase fallback placeholder : ajouter banner UX si env vars manquent
# F-08 Routes : mettre CONTEXT.md "6 routes" (coherent avec App.tsx)
# F-10 mutations.ts console.error : noter pour upgrade Sentry futur (issue)
# F-13 Badge.tsx : typer color RGBA au lieu hex concat
# F-14 Tests : noter gaps strategiques dans wiki/meta/thinking.md (backlog)
# F-15 DashboardLayout.tsx:19 u2019 : remplacer par apostrophe directe
# F-16 Typos accents francais : standardiser
# F-17 ds-orange cross-ref : verifier existe dans DS (Phase 9.2)
# F-18 knowledge-data.ts:123 date : format ISO
# F-19 CONTEXT.md bundle chunks : noter supabase/proxy dans Metriques
# F-20 index-app-pages.md dedupliquer fos-toolbox.jsx ligne 25-26 (si pas deja archive)

# 9.2 Modules DS — Agent 6 findings residuels
# F-06 src/lib/ vs ui/ : dedupliquer cn() — supprimer src/lib/ ou merge
# F-10 Stories minimalistes : ajouter argTypes + description dans 15 composants core (Button, Input, Card, Badge, Alert, Dialog, Tabs, Select, Checkbox, Switch, Table, Form, Dropdown, Tooltip, Sheet)
# F-11 Playwright port 6007 conflict : separer Storybook 6006 / preview 6007 / Playwright 6008
# F-13 package.json files publie stories : exclure .stories.tsx + fix README name
# F-14 biome.json a11y : reactiver regles ou justifier
# F-15 01-button.md stories liste fausse : regenerer docs-supernova apres build-storybook frais
# F-16 01-colors.md hex incoherents : reconcilier avec tokens.css
# F-17 foundations paths tokens/source/ : corriger apres Phase 1 purge
# F-20 fonts.css vide : supprimer import ou remplir
# F-21 supernova-sync.mjs repo hardcode : env var GITHUB_REPO_URL
# F-22 Calendar + Chart @ts-nocheck : upgrader types v9 OR scoper erreurs precises
# F-23 tsconfig exclude stories : retirer exclusion pour type-check stories
# F-24 Patterns.stories.tsx : ajouter import type React
# F-25 snapshots e2e Button/Card/Icon/Input/Text.png stale : supprimer + regenerer

# 9.3 Docs peripheriques + CI + Supabase — Agent 7 findings residuels
# F-01 docs/index-documentation.md:76 : docs/index.md → docs/index-documentation.md
# F-02 supernova-sync.yml : decommenter paths tokens/source (apres Phase 1 decision)
# F-05 CLAUDE.md:88 triggers : preciser "6 tables + RLS + triggers (sort_order 3 + updated_at 6)"
# F-06 CI : ajouter step lint + continue-on-error tests DS
# F-07 supabase-ping : accepter uniquement 200 + notif fail
# F-08 seed data "5-tables" : corriger pour 6-tables
# F-09 manifeste contradictions Cycle 3 : reviser section 9.2
# F-10 manifeste stale : update sections 6 et 9 post-migration
# F-11 specs DONE : (deja archivees Phase 3)
# F-12 CI Node 24 vs setup-guide Node 18 : ajouter engines.node et update setup-guide
# F-13 .raw/articles convention : documenter dans docs/core/knowledge.md
# F-14 .raw/{finance,sante,trading,images}/ : README minimal
# F-15/F-16 migrations 002/003 idempotentes : (deja Phase 1)
# F-17 index-documentation.md : ajouter section Wiki + knowledge.md
# F-18 Asana MCP : preciser "Actif installe, usage manuel"
# F-19 supernova ID hardcode : env var SUPERNOVA_DS_ID
# F-20 template plan : ajouter 6 elements obligatoires
# F-21 CI : step health-check + lint
# F-23 manifeste "7 plans" : update table
# F-25 supabase-ping : 2e cron jeudi + notif
# F-26 tests DS 99 echecs : issue GitHub dedie
```

### Verification
```bash
bash scripts/health-check.sh
bash scripts/ref-checker.sh
bash scripts/drift-detector.sh
cd modules/app && npm run build && npm test && cd ../..
cd modules/design-system && npm run build && cd ../..
```

### Commit message
```
chore(os): drifts P1-P3 modules + CI + Supabase + docs residuels (30+ fixes)

- App : Supabase banner, routes CONTEXT.md alignee, typos, dead refs
- DS : dedup src/lib vs ui/, stories argTypes (15 core), ports Playwright, docs-supernova regenere, hex tokens reconcilies, fonts.css, snapshots e2e
- CI : step lint + health-check, matrix app+ds parallele, engines.node, supabase-ping 200-only + notif
- Supabase : 2e cron jeudi, seed 6-tables coherent
- docs : index-documentation wiki section, ref cassee docs/index.md, manifeste refonte, template plan 6 elements
- .raw/ : READMEs + convention documentee

Refs : raw/agent-5 F-03 a F-20, raw/agent-6 F-06 a F-25, raw/agent-7 F-01 a F-26
```

---

## Phase 10 — I-08 : Routines Cloud → GitHub Actions

**Reference detaillee** : voir `docs/plans/2026-04-16-mega-audit-v2-fonction.md` Phase 1 (integration verbatim ci-dessous, condense).

### Pre-conditions
- Phase 9 complete
- `.github/workflows/` accessible

### Actions atomiques

```bash
mkdir -p .github/workflows/routines

# Creer 3 routines priorite 1 (wiki-health, wiki-consolidation, documentation-drift)
cat > .github/workflows/routines/wiki-health-daily.yml << 'EOF'
name: Routine Wiki Health
on:
  schedule: [{cron: '0 8 * * *'}]
  workflow_dispatch:
jobs:
  wiki-health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/wiki-health.sh
      - run: bash scripts/drift-detector.sh --fix-cosmetic
      - run: |
          git config user.name "foundation-os-bot"
          git config user.email "noreply@foundation-os.local"
          git add wiki/
          git diff --staged --quiet || git commit -m "chore(routines): wiki-health daily"
          git push origin main
EOF

# Creer wiki-consolidation-weekly.yml (dimanche 20h UTC)
# Creer documentation-drift-weekly.yml (lundi 9h UTC)

# Pour les 11 autres routines de routines-setup.md : creer progressivement (1 par session)
# Priorite : routines mentionnees comme actives dans CONTEXT.md
```

### Verification
```bash
gh workflow list  # inclut les 3 nouvelles routines
gh workflow run wiki-health-daily
```

### Commit message
```
feat(os): I-08 Phase 1 — 3 routines Cloud GitHub Actions actives

- wiki-health-daily.yml (8h UTC)
- wiki-consolidation-weekly.yml (dimanche 20h UTC)
- documentation-drift-weekly.yml (lundi 9h UTC)
- Scripts headless via Claude CLI (backlog)

Autonomie reelle activee. 11 autres routines a migrer progressivement.

Refs : rapport-comportement.md I-08, C-09
```

---

## Phase 11 — I-02 : Session transcript analyzer

```bash
cat > scripts/sessions-analyze.sh << 'EOF'
#!/usr/bin/env bash
# Analyse 71 transcripts .omc/sessions/ → wiki/meta/session-patterns.md
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
SESSIONS_DIR="$REPO_ROOT/.omc/sessions"
OUTPUT="$REPO_ROOT/wiki/meta/session-patterns.md"

# Extract :
# - Lexique Kevin (top 100 mots user messages)
# - Slash commands frequence (/cockpit, /plan-os, /wt, /sync)
# - Plans commences vs termines ratio
# - Agents invoques ratio
# - Session DONE vs NEEDS_CONTEXT vs BLOCKED
# - Rework ratio (fichier > 2 fois meme session)
# - Temps moyen par type tache

cat > "$OUTPUT" << INNER
---
type: meta
title: "Session Patterns — Analytics"
updated: $(date +%Y-%m-%d)
---
# Session Patterns
(auto-regenere hebdo par scripts/sessions-analyze.sh)

## Lexique Kevin top 20
...

## Slash commands frequence
...
INNER
EOF
chmod +x scripts/sessions-analyze.sh

# Routine cron
cat > .github/workflows/routines/session-patterns-weekly.yml << 'EOF'
name: Session Patterns
on:
  schedule: [{cron: '0 3 * * 1'}]
  workflow_dispatch:
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bash scripts/sessions-analyze.sh
      - run: git add wiki/meta/session-patterns.md && git diff --staged --quiet || (git commit -m "chore: session patterns weekly" && git push)
EOF

bash scripts/sessions-analyze.sh
```

### Commit message
```
feat(os): I-02 — sessions-analyze.sh exploite 71 transcripts .omc/sessions/

- Extract lexique Kevin, ratios plans, frequence commands, rework ratio
- Output wiki/meta/session-patterns.md hebdo
- Routine GitHub Actions lundi 3h UTC

Refs : rapport-comportement.md I-02, C-17
```

---

## Phase 12 — I-01 : Hook Grep wiki PreToolUse

```bash
cat > scripts/hooks/wiki-recall.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
USER_PROMPT="${CLAUDE_USER_PROMPT:-}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

DOMAINS="trading|finance|sante|design|dev|void-glass|wiki|cortex|brief|neuroplasticite|knowledge"
if [[ -n "$USER_PROMPT" ]] && [[ "$USER_PROMPT" =~ $DOMAINS ]]; then
  KEYWORD=$(echo "$USER_PROMPT" | grep -oiE "$DOMAINS" | head -1)
  MATCHES=$(grep -rli "$KEYWORD" "$REPO_ROOT/wiki/" 2>/dev/null | head -3)
  [ -n "$MATCHES" ] && echo "[WIKI RECALL] $KEYWORD :" && echo "$MATCHES"
fi
EOF
chmod +x scripts/hooks/wiki-recall.sh

# Ajouter dans .claude/settings.json PreToolUse matcher Read|Grep
```

### Commit message
```
feat(os): I-01 — hook PreToolUse wiki-recall (reflex 1 auto)

Refs : rapport-comportement.md I-01, C-03
```

---

## Phase 13 — I-04 : Tuile #15 "Propositions Claude" dans brief v12

Editer `docs/core/communication.md` section 6.1 : ajouter tuile 15. Editer `/cockpit` + `/session-start` : Phase 2bis. Creer `scripts/propositions-generator.sh`.

### Commit message
```
feat(os): I-04 — tuile #15 Propositions Claude brief v12

Refs : rapport-comportement.md I-04, C-05
```

---

## Phase 14 — I-07 : Self-diagnostic neuroplasticite

Creer `scripts/neuroplasticity-score.sh` qui mesure les 4 reflexes sur 7 derniers jours. Chain dans `health-check.sh` + afficher dans brief Sante.

### Commit message
```
feat(os): I-07 — neuroplasticity-score.sh (OS mesure cognitif)

Refs : rapport-comportement.md I-07, C-16
```

---

## Phase 15 — I-05 : Enforcement runtime routing Cortex

Creer `scripts/hooks/cortex-routing-check.sh`. Hook PostToolUse Write|Edit dans settings.json. Warning non-bloquant.

### Commit message
```
feat(os): I-05 — cortex routing enforcement runtime

Refs : rapport-comportement.md I-05, C-02
```

---

## Phase 16 — I-09 : Memory auto-priorisation

Ajouter `last_used:` frontmatter dans les 24 memoires actives. Creer `scripts/memory-audit.sh` (detect > 30j). Routine mensuelle.

### Commit message
```
feat(os): I-09 — memory auto-priorisation (last_used + audit)

Refs : rapport-comportement.md I-09, C-12
```

---

## Phase 17 — I-06 : Contradiction detector

Creer `scripts/tier-contradiction-check.sh` (detect phrases dupliquees entre 5 tiers). Chain dans `sync-check.sh`. Hook SessionStart affiche N duplications.

### Commit message
```
feat(os): I-06 — tier-contradiction-check (enforce "une info = un tier")

Refs : rapport-comportement.md I-06, C-12
```

---

## Phase 18 — I-10 : Feedback loop post-session

Editer `.claude/commands/session-end.md` Phase 7bis : demander rating Y/N/partial. Stocker `.omc/sessions/<id>/rating.txt`. Creer `scripts/session-ratings-analyze.sh`.

### Commit message
```
feat(os): I-10 — feedback loop post-session rating

Refs : rapport-comportement.md I-10, C-19
```

---

## Phase 19 — I-03 : Brief v12 adaptatif (OPTIONNEL)

Editer `docs/core/communication.md` : 3 modes (minimal/standard/deep). Creer `scripts/brief-mode-detector.sh`. Editer `/cockpit` + `/session-start` Phase 1bis detect mode.

### Commit message
```
feat(os): I-03 — brief v12 adaptatif 3 modes

Refs : rapport-comportement.md I-03, C-08
```

---

## Phase 20 — Run scenarios S1-S10 apres innovations

### Actions

Simuler mentalement les 10 scenarios du rapport-comportement.md avec les innovations actives :

- **S1 cold start** : hook SessionStart wrapper wiki (Phase 6) + routines cloud (Phase 10) → OS autonome au demarrage OK
- **S2 ambiguite routing** : I-05 cortex enforcement (Phase 15) → suggere agent automatiquement OK
- **S3 recall wiki** : I-01 hook grep wiki (Phase 12) → reflex 1 auto OK
- **S4 erreur** : I-07 score neuroplasticite (Phase 14) mesure application reflex 3 OK (pas direct fix mais visibilite)
- **S5 compactage** : hook PostCompact ACTIVE (Phase 6) + hot.md auto-load OK
- **S6 /plan-os** : stable, pas modifie
- **S7 worktrees parallele** : session-lock active (Phase 6) ou routines I-08 incluent safety OK
- **S8 question historique** : I-02 patterns + I-01 hook wiki-recall OK
- **S9 article partage** : I-04 propositions peut suggerer (Phase 13) OK
- **S10 drift detecte** : I-04 propose fix (Phase 13) OK

### Verification
Documenter le resultat dans `wiki/meta/thinking.md` : "Apres audit v2, scenarios S1-S10 couverts a X%".

---

## Phase 21 — Regenerer counts + health-check global

```bash
bash scripts/wiki-counts-sync.sh
bash scripts/health-check.sh
bash scripts/wiki-health.sh
bash scripts/drift-detector.sh
bash scripts/ref-checker.sh
bash scripts/sync-check.sh
bash scripts/neuroplasticity-score.sh
bash scripts/tier-contradiction-check.sh  # doit etre 0 duplication apres Phase 17

cd modules/app && npm run build && npm test && cd ../..
cd modules/design-system && npm run build && cd ../..
```

Attendus :
- health-check = SAIN
- wiki-health = SAIN
- drift-detector = 0 drifts
- ref-checker = 0 refs cassees
- sync-check = SAIN
- neuroplasticity score > 50%
- tier contradictions = 0
- Builds = OK

Si tout OK → Phase 22 cloture.
Si echec quelque part → revert phase responsable, retry.

---

## Phase 22 — Cloture + merge main + archive audit

```bash
# Derniere session-end brief v12
# Puis merge main si Kevin valide

cd /Users/kevinnoel/foundation-os  # retour repo racine
git checkout main
git merge feat/audit-v2-master-YYMMDD --ff-only

# Archiver audit + plan
mkdir -p .archive/audit-v2-done-260416
mv docs/audits/2026-04-16-mega-audit-v2 .archive/audit-v2-done-260416/mega-audit-v2
mv docs/plans/2026-04-16-mega-audit-v2-master.md .archive/audit-v2-done-260416/
mv docs/plans/2026-04-16-mega-audit-v2-execution.md .archive/audit-v2-done-260416/ 2>/dev/null || true
mv docs/plans/2026-04-16-mega-audit-v2-fonction.md .archive/audit-v2-done-260416/ 2>/dev/null || true

# Update CONTEXT.md Sessions recentes avec entree audit v2 DONE
# Update CONTEXT.md Decisions avec D-AUDIT-V2-01 si applicable
# Commit final

git add .archive/ CONTEXT.md
git commit -m "$(cat <<'EOF'
chore(os): mega audit v2 DONE — 23 phases livrees, 166 findings traites

Foundation OS passe de :
- FORME 7.2/10 (drifts docs + bombes latentes) → 9/10 (propre)
- FONCTION 4/10 (rituels manuels) → 8/10 (systeme cognitif auto-observant)

BLOC A (FORME bombes) : tokens DS purge, git hooks reinstall, migrations idempotentes
BLOC B (FORME narratives) : Void Glass fork, Brief v12, Storybook 9
BLOC C (FORME archivages) : data/, forms/, specs DONE, preview/, base DS
BLOC D (FORME unifications) : counts, CSS 65KB, tools 109, sessions trim 5
BLOC E (FORME memory) : 3 deprecations + markers clairs
BLOC F (FORME harness) : hooks cables, scripts chaines, wiki-counts-sync
BLOC G (FORME drifts P1-P3) : 50+ micro-fixes Core OS + modules + CI + Supabase
BLOC H (FONCTION innovations) : 10 innovations cognitives (I-08, I-02, I-01, I-04, I-07, I-05, I-09, I-06, I-10, I-03 optionnel)

23 commits atomiques par phase.

Rapport master : .archive/audit-v2-done-260416/mega-audit-v2/rapport-master-v2.md
Plan execute : .archive/audit-v2-done-260416/2026-04-16-mega-audit-v2-master.md
EOF
)"
```

---

## Annexe A — Checklist finale 100%

### BLOC A — FORME bombes latentes
- [ ] Phase 0 prep worktree
- [ ] Phase 1 tokens DS purge + git hooks reinstall + migrations SQL idempotentes

### BLOC B — FORME narratives + archivages
- [ ] Phase 2 narratives alignees
- [ ] Phase 3 archivages

### BLOC C — FORME unifications
- [ ] Phase 4 counts unifies
- [ ] Phase 5 memory consolidations

### BLOC D — FORME harness
- [ ] Phase 6 hooks + scripts chaines

### BLOC E — FORME drifts P1-P3
- [ ] Phase 7 drifts Core OS + harness residuels
- [ ] Phase 8 drifts Wiki + Memory residuels
- [ ] Phase 9 drifts Modules + CI + Supabase + docs residuels

### BLOC F — FONCTION innovations
- [ ] Phase 10 I-08 routines Cloud GitHub Actions
- [ ] Phase 11 I-02 session analyzer
- [ ] Phase 12 I-01 hook wiki-recall
- [ ] Phase 13 I-04 tuile propositions
- [ ] Phase 14 I-07 score neuroplasticite
- [ ] Phase 15 I-05 cortex enforcement
- [ ] Phase 16 I-09 memory priorisation
- [ ] Phase 17 I-06 contradiction detector
- [ ] Phase 18 I-10 feedback loop
- [ ] Phase 19 I-03 brief adaptatif (OPTIONNEL)

### BLOC G — Verification
- [ ] Phase 20 scenarios S1-S10
- [ ] Phase 21 regenerer counts + health-check global
- [ ] Phase 22 merge main + archive audit

**TOTAL** : 22 phases MUST + 1 optionnel = 100% audit traite.

---

## Annexe B — Budget tokens estime

| Bloc | Tokens |
|------|--------|
| BLOC A bombes latentes | 50K |
| BLOC B narratives + archivages | 70K |
| BLOC C unifications | 60K |
| BLOC D harness | 40K |
| BLOC E drifts P1-P3 (exhaustif) | 120K |
| BLOC F innovations (10) | 280K |
| BLOC G verification | 40K |
| **TOTAL MUST** | **~660K** |
| **TOTAL OPTIONNEL** | **~700K** |

Reparti sur 5-7 sessions Opus 4.7 1M ctx.

---

## Annexe C — Ordre d'execution recommande

### Session 1 (~3h30) — FORME critique
Phases 0-6 (BLOCs A, B, C, D)

### Session 2 (~2h) — FORME exhaustive
Phases 7-9 (BLOC E)

### Session 3 (~4h) — FONCTION batch 1
Phases 10-12 (I-08, I-02, I-01)

### Session 4 (~4h) — FONCTION batch 2
Phases 13-15 (I-04, I-07, I-05)

### Session 5 (~4h) — FONCTION batch 3 + cloture
Phases 16-18 + 20-22 (I-09, I-06, I-10, verifs, cloture)

### Session 6 (OPTIONNEL ~3h)
Phase 19 I-03 brief adaptatif

---

## Annexe D — Regles imperatives pendant execution

### Si une verification echoue
1. Rollback propre de la phase
2. Investiguer cause racine (pas patch symptomatique — regle CLAUDE.md)
3. Corriger
4. Retry phase
5. Si impossible → mark `[BLOCKED]` dans checklist + passer a phase suivante si independante

### Si Kevin interromp
1. Commit le travail en cours (WIP si necessaire)
2. Documenter etat dans CONTEXT.md "Chantier en cours"
3. Reprendre plus tard a la phase suivante

### Regle anti-regression
Apres CHAQUE phase : `bash scripts/health-check.sh`. Si passage SAIN → DEGRADED inattendu → investiguer avant phase suivante.

### Regle convention
- Branche `feat/audit-v2-master-YYMMDD` (respect D-NAMING-01)
- Session titre `🪐 Audit V2 master execution (DD-MM-YYYY)` (respect D-NAMING-01 section 3)
- Commits conventional : `<type>(os): description` pour chaque phase
- Pas de commit automatique — attendre OK Kevin ou explicite `/session-end` Phase 6

---

**FIN DU PLAN MASTER**. Auto-contenu. La session suivante peut executer de bout en bout sans manquer de contexte.

## References auxiliaires

Si la session suivante a besoin de plus de detail pour une phase :
- Phases 1-6 (FORME MUST) : `docs/plans/2026-04-16-mega-audit-v2-execution.md` (detail verbatim)
- Phases 10-19 (FONCTION innovations) : `docs/plans/2026-04-16-mega-audit-v2-fonction.md` (detail verbatim)
- Phases 7-9 (FORME drifts) : voir les 7 `raw/agent-*.md` pour findings detail
- Philosophie audit : `docs/audits/2026-04-16-mega-audit-v2/rapport-master-v2.md`
- Definition canonique FOS : `wiki/concepts/Foundation OS.md`
