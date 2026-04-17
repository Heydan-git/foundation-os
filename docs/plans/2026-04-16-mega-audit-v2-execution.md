---
type: plan
title: "Mega Audit V2 — Execution fixes"
slug: 2026-04-16-mega-audit-v2-execution
date: 2026-04-16
status: active
phases_total: 8
sessions_estimees: 2-3
related:
  - docs/audits/2026-04-16-mega-audit-v2/rapport-master.md
  - docs/audits/2026-04-16-mega-audit-v2/raw/
---

# Plan d'execution — Mega Audit V2 Foundation OS

> Plan dimensionne pour **session dediee post-audit** (ce contexte actuel va cramer, le rapport master + ce plan sont les seuls artefacts durables).
>
> **Base** : 146 findings consolides dans `docs/audits/2026-04-16-mega-audit-v2/rapport-master.md`. 25 P0 + 45 P1 + 47 P2 + 29 P3.
>
> **Principe** : 1 phase = 1 theme coherent = 1 commit atomique. Chaque phase respecte les 6 elements obligatoires (feedback_plans_ultra_detailles.md) : **pre-conditions + etat-repo + actions atomiques + verification + rollback + commit message**.
>
> **Regle d'or** : avant chaque phase, lire `pre-conditions`. Verifier `etat-repo` matche. Suivre `actions atomiques` litteralement. Si `verification` echoue → `rollback` propre, investiguer.

## Ordre d'execution recommande

Les phases sont ordonnees par **dependance + criticite** :

1. **Phase 0** — Preparation worktree + branche (5 min)
2. **Phase 1** — P0 INFRA CRITIQUE : tokens DS + git hooks + migrations SQL (60-90 min)
3. **Phase 2** — Alignement narratives CLAUDE.md / CONTEXT.md / CHANGELOG (30-45 min)
4. **Phase 3** — Archivages obsoletes (20-30 min)
5. **Phase 4** — Unifications counts (wiki, CSS, tools, sessions) (30-45 min)
6. **Phase 5** — Memory consolidations (15-20 min)
7. **Phase 6** — Harness orphelins (scripts, hooks, settings) (30-45 min)
8. **Phase 7** — Innovations (scripts manquants, docs additions) (OPTIONNEL, 45-60 min)
9. **Phase 8** — Verification finale + brief cloture (15 min)

**Duree totale estimee** : 3h30 (phases 1-6 + 8 = MUST) + 1h (phase 7 OPTIONNEL). Si session de 2h manque : couper apres Phase 6, reporter Phase 7.

---

## Phase 0 — Preparation worktree + branche

### Pre-conditions
- Etre sur main (ou un worktree propre vide)
- Aucun travail uncommitted perdu
- Audit v2 consulte : `docs/audits/2026-04-16-mega-audit-v2/rapport-master.md` lu

### Etat repo attendu
- Branche main a jour
- `docs/audits/2026-04-16-mega-audit-v2/` existe avec rapport-master.md + 7 raw/*.md
- `docs/plans/2026-04-16-mega-audit-v2-execution.md` existe (ce fichier)

### Actions atomiques

```bash
# 1. Aller sur main
cd /Users/kevinnoel/foundation-os
git status  # doit etre clean
git checkout main
git pull origin main  # si remote

# 2. Creer un worktree dedie
bash scripts/worktree-new.sh audit-v2-fixes
# → cree wt/audit-v2-fixes-260416 avec branche feat/audit-v2-fixes-260416

# 3. Verifier
cd .claude/worktrees/audit-v2-fixes-260416
git status --short
git branch --show-current  # feat/audit-v2-fixes-260416
```

### Verification
- `git worktree list` affiche le nouveau worktree
- Branche respecte convention D-NAMING-01 (`feat/audit-v2-fixes-260416`)
- Drift-detector OK

### Rollback
- Si echec worktree-new.sh : `bash scripts/worktree-clean.sh audit-v2-fixes`
- Relancer avec nom alternatif si conflit

### Commit message
Pas de commit a ce stade (prep seulement).

---

## Phase 1 — P0 INFRA CRITIQUE (tokens DS + git hooks + migrations SQL)

### Pre-conditions
- Phase 0 complete
- Rapport master lu, top 10 P0 compris
- Kevin a valide la strategie pour `tokens/` (recreer DTCG OU retirer refs mortes)

### Etat repo attendu
- `modules/design-system/tokens/` **INEXISTANT**
- `.git/hooks/commit-msg` obsolete (missing type `merge`)
- `supabase/migrations/*.sql` non-idempotent
- Worktree dedie `wt/audit-v2-fixes-260416` actif

### Actions atomiques

#### 1.1 Fix `.git/hooks/commit-msg` (5 min)

```bash
# Re-installer depuis source versionnee
cp scripts/git-hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg

# Creer script d'installation reutilisable
cat > scripts/git-hooks-install.sh << 'EOF'
#!/usr/bin/env bash
# Install Foundation OS git hooks from scripts/git-hooks/ into .git/hooks/
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
for hook in commit-msg pre-commit; do
  src="$REPO_ROOT/scripts/git-hooks/$hook"
  dst="$REPO_ROOT/.git/hooks/$hook"
  if [ -f "$src" ]; then
    cp "$src" "$dst"
    chmod +x "$dst"
    echo "Installed: $dst"
  else
    echo "Warn: source missing: $src" >&2
  fi
done
EOF
chmod +x scripts/git-hooks-install.sh
```

#### 1.2 Decider + executer pour `tokens/` (CHOIX STRATEGIQUE Kevin) (15-45 min)

**Option A — PURGER refs mortes** (recommande, rapide, DS reste fonctionnel via tokens.css local) :

```bash
# 1. Retirer exports tokens/* de package.json
# Editer modules/design-system/package.json :
#   - Supprimer ligne "./tokens.css": "./tokens/build/tokens.css"
#   - Supprimer ligne "./tokens": "./tokens/build/tokens.js"
#   - Supprimer ligne "./tokens.json": "./tokens/build/tokens.json"
#   - Dans "files" : retirer "tokens/source", "tokens/build"

# 2. Retirer scripts build-tokens + check-contrast OU les stub
# modules/design-system/scripts/build-tokens.mjs → delete
# modules/design-system/scripts/check-contrast.mjs → delete
# Et retirer du package.json "scripts" :
#   - "build:tokens"
#   - "check:contrast"
# Ajuster "build" pour retirer "run build:tokens" dependency

# 3. Nettoyer README-design-system.md refs a tokens/source/ et tokens/build/
# Editer lignes 18, 31, 88, 102 pour pointer src/styles/tokens.css

# 4. Nettoyer docs-supernova/foundations/*.md
# 5 fichiers (01-colors, 02-typography, 03-spacing, 04-radius, 05-motion) a editer
# Remplacer paths tokens/source/... par src/styles/tokens.css

# 5. Nettoyer biome.json include
# Retirer "tokens/source/**"
```

**Option B — RECREER tokens DTCG** (ambitieux, 2-3h) :

```bash
# Scaffolder tokens/source/{primitives,semantic}/*.json W3C DTCG
# Regenerer tokens.css via build-tokens.mjs
# Garder la structure Style Dictionary complete
# NOTE : ce choix est lourd. Justifier seulement si Phase 5 a besoin tokens JS-accessible.
```

→ **Recommande Option A** (simple, DS reste iso `src/styles/tokens.css`).

#### 1.3 Fix migrations SQL idempotentes (15 min)

```bash
# 1. Editer supabase/migrations/001_create_tables.sql :
#    - Lignes 11, 43, 74, 105, 137, 164 : CREATE TABLE -> CREATE TABLE IF NOT EXISTS
#    - Lignes policies RLS : CREATE POLICY -> CREATE POLICY IF NOT EXISTS (Postgres 15+)
#    - Lignes 233-292 (seed data) : deplacer vers supabase/seed.sql separe
#      OU ajouter ON CONFLICT (id) DO NOTHING sur chaque INSERT

# 2. Editer supabase/migrations/002_add_delete_policies.sql :
#    - Lignes 4-20 : CREATE POLICY -> CREATE POLICY IF NOT EXISTS

# 3. Editer supabase/migrations/003_add_updated_at.sql :
#    - Lignes 30-35 : Avant chaque CREATE TRIGGER, ajouter DROP TRIGGER IF EXISTS
#      Format : DROP TRIGGER IF EXISTS set_updated_at_sessions ON sessions;
#               CREATE TRIGGER set_updated_at_sessions BEFORE UPDATE...

# 4. (Si seed separe) Creer supabase/seed.sql avec le contenu deplace
```

### Verification

```bash
# 1. Git hook
echo "test" > /tmp/test-msg.txt
echo "Merge branch 'test'" > /tmp/test-msg.txt
bash .git/hooks/commit-msg /tmp/test-msg.txt && echo "Hook accepts merge OK"

# 2. DS build (option A)
cd modules/design-system
npm run build  # ne doit plus echouer sur tokens
cd ../..

# 3. Migrations idempotence (simuler un rerun)
# Via Supabase local si disponible :
# supabase db reset && supabase db push  # premier run OK
# supabase db push  # second run doit passer (grace a IF NOT EXISTS)

# 4. Health-check global
bash scripts/health-check.sh
```

### Rollback

```bash
# Si build DS casse apres option A :
git checkout -- modules/design-system/package.json
git checkout -- modules/design-system/scripts/  # si supprimes
git checkout -- modules/design-system/README-design-system.md
git checkout -- modules/design-system/docs-supernova/foundations/
git checkout -- modules/design-system/biome.json

# Si commit-msg hook casse :
cp scripts/git-hooks/commit-msg.bak .git/hooks/commit-msg  # si backup
# ou : git log --all --oneline | head -20 pour retrouver version precedente

# Si migrations cassent :
git checkout -- supabase/migrations/
```

### Commit message

```
fix(os): P0 infra critique — tokens DS purge + git hooks + migrations idempotentes

- Purge dossier tokens/ inexistant : retrait refs package.json/scripts/README/docs-supernova/biome (cassait build DS + prebuild app)
- Re-install git hook commit-msg depuis scripts/git-hooks/ (le installe manquait type merge → /session-end Phase 8 bloque)
- Script scripts/git-hooks-install.sh pour setup automatique futur clone
- Migrations SQL idempotentes : IF NOT EXISTS sur CREATE TABLE/POLICY, DROP TRIGGER IF EXISTS avant CREATE TRIGGER, seed.sql separe

Refs : docs/audits/2026-04-16-mega-audit-v2/ findings Agent 6 F-01, Agent 2 F-01, Agent 7 F-03/F-04/F-15/F-16
```

---

## Phase 2 — Alignement narratives (CLAUDE.md / CONTEXT.md / CHANGELOG / README)

### Pre-conditions
- Phase 1 OK (infra stable)
- Kevin a valide le renaming "iso base DS" → "Void Glass fork de base DS"

### Etat repo attendu
- CONTEXT.md affirme "iso base DS, 0 legacy" (faux) ligne 11-12
- CONTEXT.md affirme "23/23 tests DS" ligne 14 (faux)
- CLAUDE.md mentionne "bash wiki-ingest" (c'est un skill)
- CLAUDE.md co-author footer Opus 4.6 (naming-conventions.md:149)
- registry/commands.json : 7 mentions "Brief v11"
- Divers README/CHANGELOG avec Storybook 8 mentions

### Actions atomiques

#### 2.1 CONTEXT.md correction honnete (5 min)

```bash
# Editer CONTEXT.md :
# Ligne 11-12 : "App Builder ✅ iso base DS" → "App Builder ✅ Void Glass fork de base DS (46 composants derives + 7 patterns, tokens ds-*)"
# Note : on peut aussi laisser court "✅ Void Glass dark-only"
#
# Ligne 14 : "DS 23/23 tests" → "DS 0 tests unitaires src/ (e2e Playwright stale, a reparer Phase audit P0)"
# OU si decision d'ecrire les tests Phase 7 : "DS tests : 0 unit, 5 e2e stale (plan Phase 7 audit v2)"
#
# Ligne 119 : Reformuler "Hooks" pour clarifier 3 Claude + 2 git + 2 opt-in
# Exemple : "Hooks Claude (3) : PreToolUse Write|Edit (validate-void-glass+security-reminder), SessionStart drift-detector, SessionEnd auto-archive-plans. Git hooks (2, install via scripts/git-hooks-install.sh) : pre-commit health-check, commit-msg conventional. Opt-in (2) : branch-name-check, wiki-recall-reminder (non-actives par defaut)."
```

#### 2.2 CLAUDE.md corrections (10 min)

```bash
# 1. Ligne 146 "Max agents paralleles 3" : decision Kevin
#    Option A : garder 3, mettre a jour memoire feedback_subagents_context.md "Max 3 (CLAUDE.md source)"
#    Option B : relever a 5, mettre a jour CLAUDE.md "Max 3-5 selon complexite"
#    → recommande Option A

# 2. Ligne 105, 112, 173 : "wiki-ingest" comme script
#    Remplacer par : "wiki-ingest (skill plugin claude-obsidian v1.4.3, invoque via Task tool / slash command)"

# 3. Ligne 103 : claim docs-sync-check "chain dans health-check" FAUX
#    Choix : soit chainer dans health-check.sh (voir Phase 6), soit corriger CLAUDE.md :
#    "docs-sync-check.sh (manuel OU chainer via /sync)"

# 4. Ligne 61 : ajouter note sur package.json overrides React 19.2.5
#    "Vite + React 19 + TypeScript + Tailwind 4 + Supabase + Vercel (package.json overrides force react/react-dom 19.2.5 — retirer apres upgrade Vite)."
```

#### 2.3 Co-author Opus version (5 min)

```bash
# Editer docs/core/naming-conventions.md:149 :
# "Co-author Claude Opus 4.6 (1M context)" → "Co-author Claude (Opus)"
# (retirer numero de version — pattern autodetect ou generique)
```

#### 2.4 Registry/commands.json v11 → v12 (5 min)

```bash
# Editer docs/core/tools/registry/commands.json :
# Remplacer 7 mentions "Brief v11" par "Brief v12"
# Lignes : 7, 22, 27, 40, 55, 73, 89

# Regenerer README-tools-catalogue.md
bash scripts/tool-register.sh rebuild
# Verifier README-tools-catalogue.md:42 affiche toujours v12
```

#### 2.5 CHANGELOG DS + README DS mises a jour (10 min)

```bash
# Editer modules/design-system/CHANGELOG.md :
# Ligne 7 : "46 shadcn/ui from Figma Make base DS/src.zip" 
#        → "46 composants derives de base DS/src.zip (Figma Make) + patterns Void Glass custom"
# Ligne 11 : "Storybook 8.6 preview" → "Storybook 9.1.20"
#
# Ajouter nouvelle entree date 2026-04-16 :
# ## [Unreleased] - 2026-04-16
# ### Changed
# - Narrative alignement : "iso base DS" → "Void Glass fork" (audit v2)
# - Storybook 8 → 9 (migration deja faite dans package.json)
# - Tokens purge : retrait refs tokens/source/ inexistant

# Editer modules/design-system/README-design-system.md :
# Ligne 3 : retirer "Storybook 8" mentions
# Ligne 8, 21 : idem
# Lignes tokens/ (18, 31, 88, 102) : pointer src/styles/tokens.css seul (deja fait Phase 1 peut-etre)

# Editer modules/design-system/package.json :
# Ligne 5 : "Foundation OS Design System — shadcn/ui + Void Glass tokens"
#        → "Foundation OS Design System — Void Glass dark-only, 46 composants React/TS, tokens DS + Figtree/JetBrainsMono"

# Editer modules/design-system/.storybook/{main,manager,preview}.ts :
# Commentaires "Storybook 8" → "Storybook 9"
```

#### 2.6 Commentaires composants UI "// iso base DS/..." (5 min)

```bash
# Les 46 composants src/components/ui/*.tsx ont un commentaire tete "// Button — iso base DS/..."
# Rechercher : grep -l "iso base DS" modules/design-system/src/components/ui/
# Remplacer : "iso base DS" → "derive base DS (Void Glass fork)"
# OU : retirer les commentaires (leur valeur est faible de toute facon)
```

### Verification

```bash
# 1. Grep "iso base DS" doit avoir disparu ou etre requalifie
grep -rn "iso base DS" CONTEXT.md CLAUDE.md modules/design-system/ docs/

# 2. Grep "Brief v11" doit etre 0 (sauf archives)
grep -rn "Brief v11" docs/core/ --exclude-dir=.archive

# 3. Grep "Storybook 8" doit etre 0 dans modules/design-system/
grep -rn "Storybook 8" modules/design-system/ --exclude-dir=node_modules

# 4. Grep "Opus 4.6" doit etre 0
grep -rn "Opus 4.6" docs/

# 5. Grep "wiki-ingest" dans CLAUDE.md doit etre qualifie "skill"
grep -n "wiki-ingest" CLAUDE.md
```

### Rollback

```bash
git checkout -- CONTEXT.md CLAUDE.md
git checkout -- docs/core/naming-conventions.md
git checkout -- docs/core/tools/registry/commands.json docs/core/tools/README-tools-catalogue.md
git checkout -- modules/design-system/CHANGELOG.md modules/design-system/README-design-system.md
git checkout -- modules/design-system/package.json modules/design-system/.storybook/
git checkout -- modules/design-system/src/components/ui/
```

### Commit message

```
docs(os): P0 narratives alignees — "iso base DS" → "Void Glass fork"

- CONTEXT.md : "iso base DS, 0 legacy" honnete → "Void Glass fork + forms/ dead code legacy a archiver Phase 3"
- CONTEXT.md : "DS 23/23 tests" faux → "0 unit + 5 e2e stale"
- CONTEXT.md : Hooks 7 ambigus → decomposes 3 Claude + 2 git + 2 opt-in
- CLAUDE.md : wiki-ingest precise "skill plugin"
- CLAUDE.md : Max agents paralleles aligne sur 3 (source unique)
- naming-conventions.md : Co-author "Opus" sans version hardcode
- registry/commands.json : 7 mentions v11 → v12 + rebuild catalogue
- DS CHANGELOG/README/package.json : Storybook 9, narrative Void Glass fork
- 46 composants UI commentaires "iso base DS" → "derive base DS (Void Glass fork)"

Refs : Agent 1 F-03/F-06/F-09/F-16, Agent 2 F-07, Agent 6 F-02/F-07/F-18/F-19
```

---

## Phase 3 — Archivages obsoletes

### Pre-conditions
- Phase 2 OK
- Regle CLAUDE.md : `mv` vers `.archive/`, JAMAIS `rm`
- Kevin a valide les archivages

### Etat repo attendu
- Obsolescences listees dans rapport-master.md section "Obsolescences recommandees"
- `.archive/` existe comme poubelle

### Actions atomiques

#### 3.1 Archiver `modules/app/data/` (mots interdits) (5 min)

```bash
mkdir -p .archive/app-data-jsx-260416
mv modules/app/data .archive/app-data-jsx-260416/data

# Verifier que modules/app/src/ ne reference plus data/
grep -rn "data/" modules/app/src/  # doit etre 0 match pour des fichiers data/ (ou seulement faux positifs comme "data-testid")
```

#### 3.2 Archiver `modules/app/src/components/forms/` (dead code) (5 min)

```bash
# Avant archivage, retirer les imports dans les tests
# Editer modules/app/src/test/forms.test.tsx → supprimer ou deplacer aussi

mkdir -p .archive/app-forms-dead-260416
mv modules/app/src/components/forms .archive/app-forms-dead-260416/forms
mv modules/app/src/test/forms.test.tsx .archive/app-forms-dead-260416/forms.test.tsx

# Verifier que ca compile encore
cd modules/app
npm run build
npm run test
cd ../..
```

#### 3.3 Archiver `docs/specs/*.md` (DONE) (3 min)

```bash
mkdir -p .archive/specs-done-260416
mv docs/specs/2026-04-05-foundation-os-v2-design.md .archive/specs-done-260416/
mv docs/specs/2026-04-10-cockpit-design.md .archive/specs-done-260416/
mv docs/specs/2026-04-10-tools-module-v2-design.md .archive/specs-done-260416/

# Option : conserver le dossier docs/specs/ avec un README pointant vers archive
echo "# docs/specs" > docs/specs/README.md
echo "Specs DONE archivees dans .archive/specs-done-260416/. Nouvelles specs : ecrire ici puis archiver apres implementation." >> docs/specs/README.md
```

#### 3.4 Archiver `modules/design-system/preview/` (duplica 100%) (2 min)

```bash
mkdir -p .archive/ds-preview-260416
mv modules/design-system/preview .archive/ds-preview-260416/preview

# Retirer scripts preview du package.json DS :
# "preview:ds" et tout script l'invoquant
# Editer modules/design-system/package.json
```

#### 3.5 Archiver `modules/design-system/base DS/src.zip` + dossier (374KB binary) (3 min)

```bash
# Option A (recommande) : garder le code source base DS/ comme reference figee mais hors modules/
mkdir -p .archive/ds-reference-base-260416
mv "modules/design-system/base DS" ".archive/ds-reference-base-260416/base DS"

# Option B (minimal) : juste archiver le .zip
# mkdir -p .archive/ds-base-zip-260416
# mv "modules/design-system/base DS/src.zip" .archive/ds-base-zip-260416/src.zip

# Si Option A : verifier que rien dans src/ ne reference "base DS/"
grep -rn "base DS" modules/design-system/src/ docs/ wiki/

# Mettre a jour CHANGELOG DS + wiki/domains/design/ pour pointer vers l'archive
```

#### 3.6 Archiver `.claude/settings.local.json.backup-pre-wiki-260415` (1 min)

```bash
mkdir -p .archive/settings-backups-260415
mv .claude/settings.local.json.backup-pre-wiki-260415 .archive/settings-backups-260415/
```

#### 3.7 Supprimer `.supernova/snapshots/` stale + gitignore (2 min)

```bash
rm -rf modules/design-system/.supernova/snapshots/snap-*

# Ajouter au .gitignore DS ou racine
echo "modules/design-system/.supernova/snapshots/" >> .gitignore
```

### Verification

```bash
# 1. Build app encore OK
cd modules/app && npm run build && npm run test && cd ../..

# 2. Build DS encore OK
cd modules/design-system && npm run build && cd ../..

# 3. Pas de ref cassee
bash scripts/ref-checker.sh
bash scripts/health-check.sh

# 4. Archive structure OK
ls -la .archive/app-data-jsx-260416/
ls -la .archive/app-forms-dead-260416/
ls -la .archive/specs-done-260416/
ls -la .archive/ds-preview-260416/
ls -la .archive/ds-reference-base-260416/
ls -la .archive/settings-backups-260415/
```

### Rollback

```bash
# Restaurer depuis archive si probleme
mv .archive/app-data-jsx-260416/data modules/app/data
mv .archive/app-forms-dead-260416/forms modules/app/src/components/forms
# ... etc
git checkout -- modules/app/package.json modules/design-system/package.json
```

### Commit message

```
chore(os): P0 archivages obsoletes — dead code + specs DONE + duplicates

- mv modules/app/data/ (7 MD decrivant JSX archives Phase 2.4, contient mots interdits "REVOLUTION HISTORIQUE" etc.)
- mv modules/app/src/components/forms/ (3 fichiers 646L dead code avec tokens legacy var(--color-bg-canvas))
- mv docs/specs/*.md (3 specs DONE, plans d'execution deja archives)
- mv modules/design-system/preview/ (100% duplica base DS, Storybook suffit)
- mv modules/design-system/base DS/ (reference figee, pas besoin dans module actif)
- mv .claude/settings.local.json.backup-pre-wiki-260415 (1+ mois obsolete)
- rm modules/design-system/.supernova/snapshots/snap-* (stale, gitignored)

Refs : Agent 5 F-01/F-02/F-06, Agent 6 F-09/F-12, Agent 7 F-11, Agent 2 F-08
```

---

## Phase 4 — Unifications counts (wiki, CSS, tools, sessions)

### Pre-conditions
- Phase 3 OK
- Comprendre les 5 sources wiki counts divergentes

### Etat repo attendu
- Wiki 5 sources contradictoires
- CSS 3 seuils contradictoires
- sessions-recent.md 6 entrees vs limite 5
- Tools catalogue 99 reels vs 109 declares

### Actions atomiques

#### 4.1 Creer `wiki/meta/counts.md` source unique + regenerer (10 min)

```bash
cat > wiki/meta/counts.md << 'EOF'
---
type: meta
title: "Wiki Counts — Source unique"
updated: 2026-04-16
tags:
  - meta
  - counts
  - source-of-truth
status: evergreen
related:
  - "[[index-wiki]]"
  - "[[hot]]"
  - "[[foundation-os-map]]"
---

# Wiki Counts

> Source unique des compteurs wiki. Tous les autres fichiers doivent pointer ici au lieu de dupliquer.

## Mise a jour : 2026-04-16

| Metrique | Valeur | Source |
|----------|--------|--------|
| Pages physiques | 48 | `find wiki -name "*.md" \| wc -l` |
| Pages fonctionnelles (hors templates) | 43 | 48 - 5 templates |
| Concepts | 11 | `find wiki/concepts -name "*.md"` |
| Entities | 5 | `find wiki/entities -name "*.md"` |
| Sources | 4 | `find wiki/sources -name "*.md"` |
| Meta (hors templates) | 14 | foundation-os-map + 7 index + hot + overview + log + index-wiki + thinking + sessions-recent + lessons-learned + session-dna + routines-setup + routines-guardrails |
| Templates | 5 | wiki/meta/templates/ |
| Domains index | 5 | design, dev, finance, sante, trading |
| Domains concepts | 2 | design-system-components + foundation-os-desktop-migration |
| Questions | 0 | Phase 5 non demarree |
| Comparisons | 0 | Phase 5 non demarree |
| Wikilinks totaux | 733 | Mesure mega-audit-v2 |
| Cross-vault wikilinks | inclus dans 733 | Vers modules/, docs/, etc. |

## Comment regenerer

```bash
bash scripts/wiki-counts-sync.sh  # a creer Phase 6
```

Ou manuellement :

```bash
find wiki -name "*.md" | wc -l  # pages physiques
grep -rc "\[\[" wiki/ | awk -F: '{sum+=$2} END {print sum}'  # wikilinks
```
EOF

# Ajouter wiki/meta/counts.md a l'index-wiki
# Editer wiki/index-wiki.md pour pointer vers counts.md au lieu de dupliquer
```

#### 4.2 Aligner `hot.md`, `overview.md`, `index-wiki.md`, `foundation-os-map.md` sur counts.md (10 min)

```bash
# hot.md:56 : remplacer "41 pages, 762+ wikilinks, 5 domaines" 
#          par "48 pages (43 fonctionnelles), 733 wikilinks, 5 domaines (voir [[counts]])"

# overview.md:77 : remplacer "Pages : 36" par "Pages : 48 (voir [[counts]])"
# overview.md:4 : mettre updated: 2026-04-16

# index-wiki.md:25 + :111 : mettre 48 (ou 43 hors templates + precision) + pointer counts.md
# index-wiki.md:103-111 table Statistiques : refaire avec les vraies valeurs qui somment

# foundation-os-map.md:211 : mettre 94 (somme correcte) ou pointer counts.md
```

#### 4.3 Trim `sessions-recent.md` a 5 sessions (5 min)

```bash
# Editer wiki/meta/sessions-recent.md :
# Supprimer la section "## 2026-04-15 · Migration Desktop natif (9 phases)" (ligne 128)
# OU la fusionner avec "Level Up Foundation OS" en une entree combinee 2026-04-15

# Alternative : ajouter un script auto-trim
cat > scripts/wiki-sessions-trim.sh << 'EOF'
#!/usr/bin/env bash
# Limite wiki/meta/sessions-recent.md aux 5 dernieres sessions
set -euo pipefail
FILE="wiki/meta/sessions-recent.md"
# Count ## sessions (headings de niveau 2)
SESSION_COUNT=$(grep -c "^## 202" "$FILE" || echo 0)
if [ "$SESSION_COUNT" -gt 5 ]; then
  echo "Warning: $FILE has $SESSION_COUNT sessions, limite 5. Trim manuel requis."
  exit 1
fi
echo "OK: $SESSION_COUNT/5 sessions"
EOF
chmod +x scripts/wiki-sessions-trim.sh
```

#### 4.4 Unifier seuils CSS (5 min)

```bash
# Source unique : scripts/thresholds.json
cat > scripts/thresholds.json << 'EOF'
{
  "_doc": "Source unique des seuils Foundation OS. Consomme par health-check, drift-detector, monitor.",
  "_version": "2026-04-16",
  "build": {
    "app_ms_max": 2000,
    "ds_ms_max": 5000
  },
  "bundle": {
    "js_kb_max": 600,
    "css_kb_max": 65,
    "css_kb_baseline": 55
  },
  "tsx": {
    "lines_max": 700
  },
  "wiki": {
    "sessions_max": 5,
    "hot_md_age_days_max": 3
  },
  "docs": {
    "context_md_lines_max": 200,
    "claude_md_lines_max": 250
  }
}
EOF

# Mettre a jour docs/core/monitor.md :
# Section Info (ligne 34) : CSS < 65KB (pas 40)
# Section Seuils (ligne 86) : "CSS 55KB baseline, alerte si > 65KB" (deja correct)

# Mettre a jour docs/core/communication.md:172 :
# "CSS > 40 kB jaune" → "CSS > 65 kB jaune"

# Note : les scripts pourront consommer thresholds.json en Phase 6 innovation
```

#### 4.5 Creer `registry/knowledge-skills.json` (5 min)

```bash
# Extraire le bloc knowledge-skills actuellement inline dans docs/core/tools/index.json
# et le mettre dans docs/core/tools/registry/knowledge-skills.json
# Format coherent avec les 9 autres registry (scripts, commands, agents, hooks, mcp, ci, skills-bmad, skills-omc, skills-superpowers)

# Exemple structure :
cat > docs/core/tools/registry/knowledge-skills.json << 'EOF'
{
  "category": "knowledge-skills",
  "description": "Skills du plugin claude-obsidian v1.4.3 pour wiki management",
  "tools": [
    { "name": "wiki", "type": "skill", "plugin": "claude-obsidian", "description": "Bootstrap ou check du vault Obsidian" },
    { "name": "wiki-ingest", "type": "skill", "plugin": "claude-obsidian", "description": "Ingest sources (articles, transcripts) dans wiki/" },
    { "name": "wiki-query", "type": "skill", "plugin": "claude-obsidian", "description": "Repondre a des questions depuis le wiki" },
    { "name": "wiki-lint", "type": "skill", "plugin": "claude-obsidian", "description": "Health check wiki (orphelins, dead links, stale)" },
    { "name": "save", "type": "skill", "plugin": "claude-obsidian", "description": "Sauver conversation en wiki page" },
    { "name": "autoresearch", "type": "skill", "plugin": "claude-obsidian", "description": "Loop de recherche web + synthese wiki" },
    { "name": "canvas", "type": "skill", "plugin": "claude-obsidian", "description": "Canvas Obsidian visual" },
    { "name": "defuddle", "type": "skill", "plugin": "claude-obsidian", "description": "Strip clutter web pages avant ingest" },
    { "name": "obsidian-bases", "type": "skill", "plugin": "claude-obsidian", "description": "Database layer Obsidian via .base files" },
    { "name": "obsidian-markdown", "type": "skill", "plugin": "claude-obsidian", "description": "Obsidian Flavored Markdown reference" }
  ]
}
EOF

# Mettre a jour docs/core/tools/index.json :
# - Retirer le bloc knowledge-skills.tools inline
# - Ajouter reference au nouveau registry
# - Laisser total_tools: 109 (somme inchangee)

# Regenerer
bash scripts/tool-register.sh rebuild
```

### Verification

```bash
# 1. Grep wiki counts doit pointer vers counts.md
grep -rn "Pages : " wiki/ | grep -v counts.md
# doit montrer uniquement des pointeurs [[counts]]

# 2. Sessions recent <= 5
bash scripts/wiki-sessions-trim.sh

# 3. Seuils CSS coherents
grep -rn "CSS.*40" docs/core/  # doit etre 0 ou historique
grep -rn "CSS.*65" docs/core/  # doit etre present dans monitor + communication

# 4. Tools catalogue coherent
bash scripts/tool-register.sh scan
# total_tools doit toujours etre 109
# somme physique des registry/*.json doit maintenant faire 109 (99 + 10 knowledge-skills)
```

### Rollback

```bash
rm wiki/meta/counts.md
rm scripts/thresholds.json
rm docs/core/tools/registry/knowledge-skills.json
git checkout -- wiki/ docs/core/ scripts/
```

### Commit message

```
fix(os): P0 unifications counts — wiki + CSS + tools catalogue

- wiki/meta/counts.md : source unique pages (48), wikilinks (733), 11 concepts, 5 entities, 4 sources, 14 meta (hors templates)
- hot.md, overview.md, index-wiki.md, foundation-os-map.md : alignes sur counts.md
- sessions-recent.md : trim a 5 sessions (suppression ou fusion Migration Desktop)
- scripts/thresholds.json : source unique build/JS/CSS/TSX/wiki/docs (CSS 65KB baseline)
- monitor.md + communication.md : CSS seuils alignes sur 65KB
- docs/core/tools/registry/knowledge-skills.json : 10 skills claude-obsidian extraits inline de index.json
- tool-register.sh rebuild : regenere README-tools-catalogue coherent

Refs : Agent 3 F-P0-01/F-P0-02/F-P0-03/F-P1-01/F-P3-04, Agent 1 F-01/F-04, Agent 2 thresholds
```

---

## Phase 5 — Memory consolidations

### Pre-conditions
- Phase 4 OK
- Kevin a valide les deprecations memoire

### Etat repo attendu
- 28 memoires actives (MEMORY.md index OK)
- 8 memoires `_deprecated/`
- Doublons detectes : imperatifs_qualite, minimal_files, no_token_limit + ds_refactor_app obsolete

### Actions atomiques

#### 5.1 Deprecier `feedback_imperatifs_qualite.md` (duplique CLAUDE.md) (2 min)

```bash
MEMDIR="/Users/kevinnoel/.claude/projects/-Users-kevinnoel-foundation-os/memory"

# Marquer deprecated
cat > "$MEMDIR/feedback_imperatifs_qualite.md.new" << 'EOF'
---
name: feedback_imperatifs_qualite
description: SUPERSEDED par CLAUDE.md section "Imperatifs (non-negociable)"
type: feedback
status: deprecated
deprecated_date: 2026-04-16
superseded_by: CLAUDE.md lignes 5-13
---

# [DEPRECATED] Imperatifs qualite

**SUPERSEDED 2026-04-16** : ces 9 regles sont desormais dans CLAUDE.md section "Imperatifs (non-negociable)" qui est auto-chargee. Cette memoire etait un doublon.

Voir : CLAUDE.md lignes 5-13 pour la version canonique.
EOF
mv "$MEMDIR/feedback_imperatifs_qualite.md.new" "$MEMDIR/_deprecated/feedback_imperatifs_qualite.md"
rm "$MEMDIR/feedback_imperatifs_qualite.md"

# Mettre a jour MEMORY.md : retirer la ligne d'index
```

#### 5.2 Deprecier `feedback_minimal_files.md` (duplique CLAUDE.md) (2 min)

```bash
# Meme pattern :
cat > "$MEMDIR/_deprecated/feedback_minimal_files.md" << 'EOF'
---
name: feedback_minimal_files
description: SUPERSEDED par CLAUDE.md "Garde-fous (non-negociable)"
type: feedback
status: deprecated
deprecated_date: 2026-04-16
superseded_by: CLAUDE.md ligne 130
---

# [DEPRECATED] Minimal files

**SUPERSEDED 2026-04-16** : "Jamais creer de fichier sans demande explicite Kevin" est dans CLAUDE.md. Cette memoire etait un doublon tier 3 vs tier 2.
EOF
rm "$MEMDIR/feedback_minimal_files.md"
# Mettre a jour MEMORY.md
```

#### 5.3 Fusionner `feedback_no_token_limit.md` dans `feedback_neuroplasticity.md` (3 min)

```bash
# Ajouter au feedback_neuroplasticity.md un bloc explicite "Max x20" si pas deja present
# Puis deprecier feedback_no_token_limit :
cat > "$MEMDIR/_deprecated/feedback_no_token_limit.md" << 'EOF'
---
name: feedback_no_token_limit
description: FUSIONNE dans feedback_neuroplasticity.md
type: feedback
status: deprecated
deprecated_date: 2026-04-16
superseded_by: feedback_neuroplasticity.md
---

# [DEPRECATED] No token limit

**FUSIONNE 2026-04-16** dans feedback_neuroplasticity.md (section "Max x20 / Cloud Max 15 par jour").
EOF
rm "$MEMDIR/feedback_no_token_limit.md"
# Mettre a jour MEMORY.md
```

#### 5.4 Deprecier `project_ds_refactor_app.md` (DONE) (2 min)

```bash
cat > "$MEMDIR/_deprecated/project_ds_refactor_app.md" << 'EOF'
---
name: project_ds_refactor_app
description: DONE 2026-04-15 (refactor app iso DS complete)
type: project
status: deprecated
deprecated_date: 2026-04-16
superseded_by: CONTEXT.md Modules.App Builder
---

# [DONE] DS refactor app

**DONE 2026-04-15** : l'App Builder utilise les tokens ds-* (Void Glass fork base DS). Refactor complete. Voir CONTEXT.md section Modules.

Historique protocole conserve pour reference.

[...contenu original...]
EOF
# Copier l'ancien contenu + retirer de l'actif
rm "$MEMDIR/project_ds_refactor_app.md"
```

#### 5.5 Ajouter markers clairs dans `_deprecated/` sans status (3 min)

```bash
# Editer les 4 memoires deprecated sans marker clair :
# - _deprecated/feedback_tdah_briefs.md : ajouter frontmatter status + superseded_by feedback_communication_pedagogique.md
# - _deprecated/feedback_brief_format.md : status + superseded_by "brief v12 docs/core/communication.md 6.1"
# - _deprecated/feedback_no_bullshit.md : marker "CONTENU FUSIONNE dans user_langue_francais.md"
# - _deprecated/feedback_base_ds_no_archive.md : status + superseded_by feedback_no_auto_archive.md
# - _deprecated/feedback_ds_iso_figma.md + feedback_ds_true_iso.md : chain superseded_by feedback_ds_reconstruction_protocole.md
```

#### 5.6 Update MEMORY.md index (2 min)

```bash
# Editer MEMORY.md :
# - Retirer les 3 lignes deprecated (imperatifs_qualite, minimal_files, no_token_limit)
# - Retirer project_ds_refactor_app
# - Ajouter section "## Deprecated (voir _deprecated/)" 
#   incluant les 4 nouvelles deprecations
# - Ajouter en frontmatter ou en tete : last_audit: 2026-04-16, total_active: 24 (au lieu 28), total_deprecated: 12 (au lieu 8)
```

### Verification

```bash
# 1. Count memoires actives
ls "$MEMDIR"/*.md | grep -v MEMORY | wc -l  # doit etre 24 (28 - 4)

# 2. Count deprecated
ls "$MEMDIR/_deprecated"/*.md | wc -l  # doit etre 12 (8 + 4)

# 3. MEMORY.md index coherent
grep "^- \[" "$MEMDIR/MEMORY.md" | wc -l  # doit correspondre a total_active

# 4. CLAUDE.md refs memoires toujours valides
for mem in subagents_context todowrite_systematique thinking_francais frontload_questions plans_ultra_detailles wiki_autonome visual_verification; do
  test -f "$MEMDIR/feedback_${mem}.md" && echo "OK: $mem" || echo "MISSING: $mem"
done
```

### Rollback

```bash
# Restaurer depuis _deprecated vers actif
for mem in imperatifs_qualite minimal_files no_token_limit; do
  mv "$MEMDIR/_deprecated/feedback_${mem}.md" "$MEMDIR/feedback_${mem}.md"
done
mv "$MEMDIR/_deprecated/project_ds_refactor_app.md" "$MEMDIR/project_ds_refactor_app.md"
```

### Commit message

```
refactor(os): memory consolidations — 3 doublons CLAUDE.md + 1 projet DONE + markers clairs

- Deprecie feedback_imperatifs_qualite.md (mot pour mot CLAUDE.md L5-13)
- Deprecie feedback_minimal_files.md (duplique CLAUDE.md L130)
- Fusionne feedback_no_token_limit.md dans feedback_neuroplasticity.md
- Deprecie project_ds_refactor_app.md (DONE 2026-04-15)
- Markers SUPERSEDED/DONE explicites dans 4 memoires _deprecated sans frontmatter clair
- MEMORY.md : index trim 28→24 actifs + section Deprecated enrichie + frontmatter last_audit

Refs : Agent 4 F-01/F-02/F-03/F-04/F-06/F-07/F-08/F-18/F-20
```

---

## Phase 6 — Harness orphelins + mises a jour (settings.json, scripts chain)

### Pre-conditions
- Phase 5 OK
- Kevin a decide pour chaque orphelin : activer ou archiver

### Etat repo attendu
- `session-start-wiki.sh` jamais execute
- `session-lock.sh` jamais invoque
- `wiki-recall-reminder.sh` opt-in jamais active
- `tool-register.sh` jamais chaine
- `docs-sync-check.sh` jamais chaine

### Actions atomiques

#### 6.1 Activer hook SessionStart via wrapper wiki (3 min)

```bash
# Editer .claude/settings.json :
# Ligne 42 : "command": "bash \"$(git rev-parse --show-toplevel 2>/dev/null || echo .)/scripts/drift-detector.sh\" 2>&1 | tail -15"
# Remplacer par :
#           "command": "bash \"$(git rev-parse --show-toplevel 2>/dev/null || echo .)/scripts/hooks/session-start-wiki.sh\""
# (le script session-start-wiki.sh chaine drift-detector + cat hot.md)
```

#### 6.2 Decider sort `session-lock.sh` (recommande: activer SessionStart/End) (10 min)

```bash
# Option A : ACTIVER
# Ajouter dans .claude/settings.json SessionStart :
#   { "type": "command", "command": "bash scripts/session-lock.sh acquire cli 2>/dev/null || true" }
# Ajouter dans SessionEnd :
#   { "type": "command", "command": "bash scripts/session-lock.sh release cli" }

# Option B : ARCHIVER si Kevin n'utilise pas Cowork
# mkdir -p .archive/scripts-unused-260416
# mv scripts/session-lock.sh .archive/scripts-unused-260416/
# Retirer de docs/core/tools.md les mentions
```

#### 6.3 Decider sort `wiki-recall-reminder.sh` (recommande: archiver, neuroplasticite manuelle) (3 min)

```bash
# Archive (Kevin a deja le reflexe manuel via CLAUDE.md neuroplasticite)
mkdir -p .archive/scripts-unused-260416
mv scripts/hooks/wiki-recall-reminder.sh .archive/scripts-unused-260416/wiki-recall-reminder.sh
```

#### 6.4 Chainer `tool-register.sh scan` dans health-check (5 min)

```bash
# Editer scripts/health-check.sh :
# Apres la section INFO (vers ligne 155-170), avant le verdict :
# Ajouter :
#   echo "  [INFO] Tool registry scan"
#   if bash "$SCRIPT_DIR/tool-register.sh" scan --quiet; then
#     echo "    [OK] Registry sync (check .omc/tool-registry-drift.log si warning)"
#   else
#     echo "    [WARN] Registry drift detecte (bash scripts/tool-register.sh scan pour details)"
#   fi
```

#### 6.5 Chainer `docs-sync-check.sh` dans sync-check (5 min)

```bash
# Editer scripts/sync-check.sh :
# Apres le bloc health-check chain (vers ligne 25), ajouter :
#   bash "$SCRIPT_DIR/docs-sync-check.sh"

# OU : fusionner docs-sync-check.sh contenu dans sync-check.sh et supprimer docs-sync-check.sh
# Decision : fusionner (Agent 2 F-07 recommande)
```

#### 6.6 Fix `health-check.sh` TSX scope hardcode (5 min)

```bash
# Editer scripts/health-check.sh ligne 91 :
# Remplacer :
#   TSX_FILES=$(find modules/app/src/pages modules/app/src/components ...)
# Par :
#   TSX_FILES=$(find modules/*/src -type f \( -name "*.tsx" -o -name "*.jsx" \) 2>/dev/null | grep -v node_modules | grep -v dist | grep -v storybook-static)
```

#### 6.7 Fix `wiki-health.sh` BROKEN_LINKS full scan (5 min)

```bash
# Editer scripts/wiki-health.sh ligne 67 :
# Supprimer le `| head -20` qui limite l'echantillon
# Si performance devient un probleme (>200 pages), ajouter un mode --sample
```

#### 6.8 Creer `scripts/wiki-counts-sync.sh` (nouvel outil) (10 min)

```bash
cat > scripts/wiki-counts-sync.sh << 'EOF'
#!/usr/bin/env bash
# Regenere wiki/meta/counts.md depuis le filesystem
# Usage : bash scripts/wiki-counts-sync.sh [--check]
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

PAGES_TOTAL=$(find wiki -name "*.md" | wc -l | tr -d ' ')
CONCEPTS=$(find wiki/concepts -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
ENTITIES=$(find wiki/entities -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
SOURCES=$(find wiki/sources -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
META=$(find wiki/meta -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
TEMPLATES=$(find wiki/meta/templates -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAIN_CONTENT=$(find wiki/domains -mindepth 2 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAINS_INDEX=$(find wiki/domains -maxdepth 2 -name "index-*.md" 2>/dev/null | wc -l | tr -d ' ')
WIKILINKS=$(grep -rho "\[\[[^]]*\]\]" wiki/ 2>/dev/null | wc -l | tr -d ' ')

DATE=$(date +%Y-%m-%d)

if [[ "${1:-}" == "--check" ]]; then
  # Mode verification : lit counts.md et compare aux valeurs reelles
  HOT_PAGES=$(grep -oE "[0-9]+ pages" wiki/hot.md | head -1 | grep -oE "[0-9]+")
  if [ "$HOT_PAGES" != "$PAGES_TOTAL" ]; then
    echo "DRIFT: hot.md dit $HOT_PAGES pages, filesystem en a $PAGES_TOTAL"
    exit 1
  fi
  echo "OK: wiki counts synchronises"
  exit 0
fi

# Mode ecriture : regenere counts.md
cat > wiki/meta/counts.md << INNER_EOF
---
type: meta
title: "Wiki Counts — Source unique"
updated: $DATE
tags:
  - meta
  - counts
  - source-of-truth
status: evergreen
related:
  - "[[index-wiki]]"
  - "[[hot]]"
  - "[[foundation-os-map]]"
---

# Wiki Counts

> Source unique des compteurs wiki. Auto-regenere par \`scripts/wiki-counts-sync.sh\`.

## Mise a jour : $DATE

| Metrique | Valeur |
|----------|--------|
| Pages physiques | $PAGES_TOTAL |
| Pages fonctionnelles | $(( PAGES_TOTAL - TEMPLATES )) |
| Concepts | $CONCEPTS |
| Entities | $ENTITIES |
| Sources | $SOURCES |
| Meta | $META |
| Templates | $TEMPLATES |
| Domains index | $DOMAINS_INDEX |
| Domains content | $DOMAIN_CONTENT |
| Wikilinks totaux | $WIKILINKS |

## Regenerer

\`\`\`bash
bash scripts/wiki-counts-sync.sh        # ecrit
bash scripts/wiki-counts-sync.sh --check # verifie seulement
\`\`\`
INNER_EOF

echo "Regenere wiki/meta/counts.md ($PAGES_TOTAL pages, $WIKILINKS wikilinks)"
EOF
chmod +x scripts/wiki-counts-sync.sh

# Executer une premiere fois
bash scripts/wiki-counts-sync.sh

# Chainer dans wiki-health.sh
# Editer wiki-health.sh pour invoquer ce script avec --check
```

### Verification

```bash
# 1. SessionStart hook marche
bash scripts/hooks/session-start-wiki.sh
# doit afficher drift + hot.md contenu

# 2. Tool register scan OK
bash scripts/tool-register.sh scan

# 3. Wiki counts sync
bash scripts/wiki-counts-sync.sh --check

# 4. Health-check global
bash scripts/health-check.sh

# 5. Syntax shell scripts
for f in scripts/*.sh scripts/hooks/*.sh; do bash -n "$f" && echo "OK $f" || echo "FAIL $f"; done
```

### Rollback

```bash
git checkout -- .claude/settings.json
git checkout -- scripts/health-check.sh scripts/sync-check.sh scripts/wiki-health.sh
rm -f scripts/wiki-counts-sync.sh
# Restaurer archives si Option B orphelins
```

### Commit message

```
feat(os): harness wired — orphelins activated or archived + health-check completeness

- settings.json SessionStart : wrapper session-start-wiki.sh (hook auto-load wiki/hot.md active)
- session-lock.sh : activated SessionStart/End (OU archived selon Kevin)
- wiki-recall-reminder.sh : archived (neuroplasticite manuelle suffit)
- tool-register.sh scan chained dans health-check.sh [INFO]
- docs-sync-check.sh fusionne dans sync-check.sh (dedoublonnage)
- health-check.sh TSX scope dynamique (find modules/*/src au lieu de hardcode pages+components)
- wiki-health.sh BROKEN_LINKS full scan (retire head -20 sample)
- NOUVEAU : scripts/wiki-counts-sync.sh — source unique wiki/meta/counts.md auto-regeneree
- NOUVEAU : scripts/git-hooks-install.sh (Phase 1 deja) pour nouveaux clones

Refs : Agent 2 F-02/F-04/F-05/F-06/F-07/F-11/F-13/F-15, Agent 3 F-P1-01
```

---

## Phase 7 — Innovations (OPTIONNEL, si session longue)

### Pre-conditions
- Phases 1-6 completes
- Time budget >60 min restant

### Actions atomiques (a choix selon priorites Kevin)

#### 7.1 Tests unitaires DS (15 composants core) (45 min)
- Ecrire `.test.tsx` pour Button, Input, Card, Badge, Alert, Dialog, Tabs, Select, Checkbox, Switch, Table, Form, Dropdown, Tooltip, Sheet
- Utiliser @testing-library/react + jest-axe
- Smoke test + a11y test par composant

#### 7.2 Reparer tests e2e Playwright DS (15 min)
- Editer `e2e/visual-a11y.spec.ts:4-10` : STORIES avec IDs `ui-button--default`, `ui-card--default`, etc.
- Supprimer snapshots stale Text.png, Icon.png (composants n'existent plus)
- Regenerer via `npm run test:e2e -- --update-snapshots`

#### 7.3 Script `audit-core-os.sh` (20 min)
- Detecter auto v11 dans registry alors que CLAUDE.md dit v12
- Detecter somme registry != index.json.total_tools
- Detecter seuils CSS divergents
- Detecter co-author Opus version vs modele actuel

#### 7.4 Refonte `docs/manifeste.md` (30 min)
- Post-migration Desktop + wiki + DS iso
- Update section 6 (etat reel) + section 9 (trajectoire)
- Retirer contradictions internes Cycle 3
- Frontmatter `updated: 2026-04-16`

#### 7.5 CI step lint + health-check (10 min)
- `.github/workflows/ci.yml` ajouter step lint biome + eslint
- Ajouter step `bash scripts/health-check.sh` (reproduit pre-commit)

#### 7.6 Convention `.raw/` documentee (10 min)
- Ajouter section dans `docs/core/knowledge.md` : ".raw/ = sources brutes originales immutables, wiki/sources/ = syntheses ingerees"

#### 7.7 Index-documentation.md wiki section (10 min)
- Ajouter section "## Wiki" avec pointeurs vers wiki/hot, index-wiki, meta/routines-setup, etc.
- Retirer ref cassee `docs/index.md:76` vers `docs/index-documentation.md`

#### 7.8 Template plan 6 elements (5 min)
- Enrichir `docs/plans/_template-plan.md:23-44` avec les 6 elements obligatoires (pre-conditions, etat-repo, actions atomiques, verification, rollback, commit message)

### Verification + Rollback
Standard par sous-tache.

### Commit messages (1 par sous-tache ou 1 bundle)

```
feat(os): audit v2 Phase 7 — innovations (tests DS + CI lint + manifeste refonte + ...)
```

---

## Phase 8 — Verification finale + brief cloture

### Pre-conditions
- Phases 1-6 (MUST) completes
- Phase 7 optionnelle faite ou reportee

### Actions atomiques

```bash
# 1. Health-check global
bash scripts/health-check.sh

# 2. Wiki health
bash scripts/wiki-health.sh

# 3. Drift-detector
bash scripts/drift-detector.sh

# 4. Ref-checker
bash scripts/ref-checker.sh

# 5. Sync-check
bash scripts/sync-check.sh

# 6. Build app + DS
cd modules/app && npm run build && npm run test && cd ../..
cd modules/design-system && npm run build && cd ../..

# 7. Grep "iso base DS" doit etre 0 (ou seulement dans .archive)
grep -rn "iso base DS" --exclude-dir=.archive --exclude-dir=node_modules

# 8. Grep "Brief v11" doit etre 0
grep -rn "Brief v11" docs/core/ --exclude-dir=.archive

# 9. Wiki counts sync OK
bash scripts/wiki-counts-sync.sh --check

# 10. Git log de la branche
git log --oneline feat/audit-v2-fixes-260416 -15
```

### Verification

- Health-check : SAIN (0 critical, 0 warning sauf drift branche worktree)
- Wiki health : SAIN
- Build app + DS : OK
- Tous les greps de contradictions : vides
- git log : 6-7 commits atomiques par phase

### Commit final

```bash
# Derniere session-end brief (natif /session-end)
# Puis merge vers main si Kevin valide
cd ..  # retour repo racine
git checkout main
git merge feat/audit-v2-fixes-260416 --ff-only
# Pas de push sans Kevin OK !
```

### Archivage post-mega-audit

```bash
# Apres merge main
mkdir -p .archive/audit-v2-done-260416
mv docs/audits/2026-04-16-mega-audit-v2 .archive/audit-v2-done-260416/mega-audit-v2
mv docs/plans/2026-04-16-mega-audit-v2-execution.md .archive/audit-v2-done-260416/

# Update CONTEXT.md section Sessions recentes avec entree audit v2 DONE
# Update CONTEXT.md section Decisions avec eventuelles D-AUDIT-V2-01 decidees
```

### Commit message final

```
chore(os): mega audit v2 DONE — 146 findings traites en 7 phases

Audit complet par Claude Opus 4.7 (7 sous-agents paralleles, 707 fichiers lus, 18000L).

Phases executees :
- P1 : Infra critique (tokens DS purge, git hooks re-install, migrations idempotentes)
- P2 : Narratives alignees ("Void Glass fork" au lieu de "iso base DS")
- P3 : Archivages obsoletes (data/, forms/, specs DONE, preview/, base DS/, backups)
- P4 : Unifications counts (wiki counts.md, CSS 65KB, tools 109, sessions trim 5)
- P5 : Memory consolidations (3 doublons deprecated + 1 projet DONE)
- P6 : Harness wired (hooks orphelins activated/archived, scripts chained)
- P7 : Innovations (optional — voir commits dedies)

Rapport master : .archive/audit-v2-done-260416/mega-audit-v2/rapport-master.md
Plan execution : .archive/audit-v2-done-260416/2026-04-16-mega-audit-v2-execution.md

Foundation OS passe de DEGRADED STRUCTUREL (7.2/10) a SAIN (~8.5/10 estime).
```

---

## Annexe A — Checklist finale avant cloture

- [ ] Phase 0 : worktree `wt/audit-v2-fixes-260416` cree
- [ ] Phase 1 : tokens DS purge + git hooks re-install + migrations SQL idempotentes
- [ ] Phase 2 : narratives alignees (iso base DS, Brief v11, Opus 4.6, Storybook 8)
- [ ] Phase 3 : archivages (6 items)
- [ ] Phase 4 : counts unifies (wiki, CSS, tools, sessions)
- [ ] Phase 5 : memory consolidations (4 deprecations + markers clairs)
- [ ] Phase 6 : harness orphelins decides + scripts chaines + wiki-counts-sync cree
- [ ] Phase 7 OPTIONNEL : innovations selon time budget
- [ ] Phase 8 : verifications globales + brief cloture + merge main (apres Kevin OK)
- [ ] Archivage audit v2 + plan dans `.archive/audit-v2-done-260416/`
- [ ] Update CONTEXT.md Sessions recentes + Decisions

## Annexe B — Findings NON traites par ce plan (a decider Kevin)

Ces findings restent en backlog car necessitent arbitrage ou effort superieur :

- **Agent 5 F-03** : Refactor modules/app pour consommer composants DS au lieu de reinventer localement (gros chantier 2-3 jours)
- **Agent 6 F-03** : Refactor 7 Dashboard patterns pour consommer composants UI DS (chantier 1-2 jours, DashboardDesignSystem seul = 1788L)
- **Agent 6 F-09** : Splitter DashboardDesignSystem.tsx 1788L en 10 showcase files (chantier 1 jour)
- **Agent 6 F-08** : Eclater sidebar.tsx 725L (chantier 2h)
- **Agent 6 F-16** : Fix docs-supernova/foundations/01-colors.md hex faux (30 min, inclus dans Phase 7 possible)
- **Agent 7 F-17** : Index-documentation wiki section (Phase 7)
- **Agent 1 I-04** : Script archive-auto section migration > 30j (Phase 7+)
- **Agent 4 I-37/38** : Consolidation memoires thematique workflow-plans et naming-desktop (Phase 7+)
- **Agent 7 I-18** : Migrations Phase 5 preparees (Finance/Sante/Trading tables)

Ces items sont P1/P2, pas bloquants. Planifier en Phase 5 (lancement Finance/Sante/Trading) ou session dediee.

## Annexe C — Fichiers crees par ce plan

- `scripts/git-hooks-install.sh` (Phase 1)
- `supabase/seed.sql` (Phase 1, optionnel si split seed)
- `wiki/meta/counts.md` (Phase 4)
- `scripts/thresholds.json` (Phase 4)
- `docs/core/tools/registry/knowledge-skills.json` (Phase 4)
- `scripts/wiki-counts-sync.sh` (Phase 6)
- `scripts/wiki-sessions-trim.sh` (Phase 4)

## Annexe D — Budget tokens estime

- Phase 1 : ~40K tokens (lectures + edits)
- Phase 2 : ~30K tokens
- Phase 3 : ~10K tokens (mostly mv)
- Phase 4 : ~50K tokens (regenerations + counts)
- Phase 5 : ~15K tokens (memory edits)
- Phase 6 : ~40K tokens (scripts creation/chain)
- Phase 7 : ~100K tokens (si complete)
- Phase 8 : ~10K tokens (verifs)

Total MUST (1-6 + 8) : ~195K tokens. Phase 7 : +100K = 295K.
**Tenable dans 1 session Claude Opus 4.7 1M ctx si Kevin pret a lancer en dehors du worktree actuel.**

Si compression intervient : ce plan + le rapport master suffisent pour reprendre exactement ou on en est (chaque phase est self-contained avec pre-conditions, etat-repo, verification, rollback).

---

**FIN DU PLAN**. Bon travail a la session suivante.
