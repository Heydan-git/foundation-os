---
title: "🪐 Integration INT-1/2/3 + INS-1 (17-04-2026)"
slug: integration-sources-externes-260417
session_title: "🪐 Integration sources externes (17-04-2026)"
status: active
phases_total: 5
phases_done: 3
created: 2026-04-17
updated: 2026-04-18
tags:
  - plan
  - integration
  - neuroplasticity
  - wiki
related:
  - "[[Foundation OS]]"
  - "[[Neuroplasticite]]"
  - "[[Hot Cache]]"
  - "[[Compounding Knowledge]]"
---

# 🪐 Integration INT-1/2/3 + INS-1 (17-04-2026)

## Context

Apres audit surface Foundation OS (17-04-2026, verdict **SAIN**), lecture en profondeur de **5 sources externes** :

- [MemPalace](https://github.com/MemPalace/mempalace) — memoire verbatim hierarchique wings/rooms/halls/closets/drawers + 4 layers chargement incremental (170 tokens startup) + hooks auto-save pre-compression + 19 MCP tools
- [Octogent](https://github.com/hesamsheikh/octogent) — orchestration multi-agents via "tentacles" folder-based + delegation parent→child + messaging + API/UI dashboard
- [Graphify](https://github.com/safishamsi/graphify) — knowledge graph auto (AST tree-sitter + Whisper + Claude) + Leiden clustering + confidence tags EXTRACTED/INFERRED/AMBIGUOUS + GRAPH_REPORT.md + MCP server
- [Penpax.ai](https://safishamsi.github.io/penpax.ai/) — produit commercial sur Graphify (digital twin local-first)
- MemPalace site (WebSearch fallback) — 4 layers loading + AAAK compression 30x

**Synthese** : FOS est plus mature sur collaboration Kevin-Claude (CLAUDE.md, brief v12, neuroplasticite, 5 tiers), mais 4 gaps reels :

1. **INT-1 Auto-save pre-compression** (inspiration MemPalace) — faille sur sessions longues
2. **INT-2 Confidence tagging systematique** (inspiration Graphify) — 37% pages sans `confidence:`, 63% = "high" uniquement (Explore finding F1), scale artificiellement plafonnee
3. **INT-3 Graph report auto** (inspiration Graphify GRAPH_REPORT.md) — complementerait wiki-health.sh avec god nodes / orphelins / surprising connections
4. **INS-1 Layered loading formel** (inspiration MemPalace L0-L3) — formaliser dans `docs/core/communication.md` les layers de chargement context (discipline tokens)

**Resultat attendu** : FOS integre 4 ameliorations organiquement (scripts, hooks, frontmatter, docs, wikilinks, CONTEXT) sans casser existant, en 5 sessions.

**Decision canonique (a enregistrer)** : **D-INTEG-01** Integration comparative sources externes (17-04-2026).

## Objectifs

- **Architecture** : integrer les 4 features dans plomberie FOS existante (scripts/, hooks, frontmatter wiki, docs/core/, CONTEXT.md)
- **Organicite** : reutiliser patterns bash (set -uo pipefail, couleurs, exit codes 0/1/2, git rev-parse, tempfile counter), chain scripts dans health-check.sh, respecter garde-fous CLAUDE.md
- **Neuroplasticite** : nouvelles pages wiki referencees depuis foundation-os-map + index-wiki + index-concepts, aucun orphelin
- **Documentation** : chaque nouveau script → entree dans `docs/core/tools.md`. Chaque nouvelle spec → section dans `docs/core/knowledge.md` ou `docs/core/communication.md`. Decision → CONTEXT.md + wiki/concepts/
- **Zero regression** : tests 15/15 app, health SAIN, ref-checker 0 cassee apres chaque phase

## Decoupage 5 sessions

| Phase | Titre | Effort | Contenu |
|-------|-------|--------|---------|
| 1 | **Preparation architecturale** | ~45 min | Docs + concepts wiki + decision D-INTEG-01 + thresholds seeds (PAS de script) |
| 2 | **INT-1 Pre-compression snapshot** | ~1h | Script + hook settings.json + .omc/snapshots/ + doc tools.md |
| 3 | **INT-2 Confidence tagging** | ~2h | Script audit + backfill 26 pages + update templates + knowledge.md |
| 4 | **INT-3 Graph report auto** | ~3h | Script + wiki/meta/graph-report.md + chain health-check + wikilinks |
| 5 | **INS-1 Layered loading formel** | ~30 min | Update communication.md section 6 + knowledge.md + wiki concept |

**Phase 1 = legere** (Kevin : "on a du contexte, pas lourde"). Fondations posees, implementation Phases 2-5.

---

## Phase 1 — Preparation architecturale (~45 min)

### 1. Pre-conditions

- Repo sur branche `claude/loving-carson-396727` (worktree loving-carson)
- Commit courant `ec8f8ee` (fix 3 drifts cosmetiques post-audit)
- Health-check **SAIN** (0 critical, 0 warning, build 232ms, 15/15 tests, wiki 43 pages hot.md 0j, drift SYNC, tier 0)
- Ref-checker 0 cassee (135 .md scannes)
- CONTEXT.md 135L, CLAUDE.md 195L
- Plan file `/Users/kevinnoel/.claude/plans/ok-choix-a-effervescent-hennessy.md` (ce fichier)

### 2. Etat repo attendu apres Phase 1

**Nouveaux fichiers** (5) :
```
wiki/concepts/Confidence Tagging.md
wiki/concepts/Graph Report.md
wiki/concepts/Layered Loading.md
wiki/concepts/Pre-compaction Snapshot.md
docs/plans/2026-04-17-integration-sources-externes.md  (copie versionnee dual-path)
```

**Modifies** (6) :
```
wiki/index-wiki.md                        ← + 4 wikilinks concepts
wiki/meta/index-concepts.md               ← + 4 wikilinks concepts
wiki/meta/foundation-os-map.md            ← + section "Enhancements 2026" avec 4 wikilinks
docs/core/knowledge.md                    ← + section 10 "Enhancements 2026 (INT-1/2/3 + INS-1)"
scripts/thresholds.json                   ← + wiki.confidence_threshold, graph_report seeds (commentaire _doc)
CONTEXT.md                                ← + D-INTEG-01 dans Decisions
```

**Counts attendus** :
- wiki : 43 pages → **47 pages** (+4 concepts)
- wikilinks : 657 → **~680-700** (+4 backlinks depuis 3 indexes)
- CONTEXT.md : 135L → **~142L** (+7L pour D-INTEG-01)
- knowledge.md : +~80L pour section 10

### 3. Actions atomiques

#### 3.1 Creer 4 concepts wiki

**Fichier 1 : `wiki/concepts/Confidence Tagging.md`**

Frontmatter conforme template `wiki/meta/templates/concept.md` :
```yaml
---
type: concept
title: "Confidence Tagging"
complexity: intermediate
domain: meta
aliases:
  - "frontmatter confidence"
  - "claim granularity"
created: 2026-04-17
updated: 2026-04-17
tags:
  - concept
  - neuroplasticity
  - frontmatter
  - wiki-schema
status: seed
confidence: high
related:
  - "[[index-concepts]]"
  - "[[Neuroplasticite]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[Graph Report]]"
sources:
  - "[[graphify-confidence-tags]]"
---
```

Contenu (sections standard) : **Definition** (scale high/medium/low + claim_type extracted/inferred/speculated), **How It Works** (frontmatter clef `confidence:` sur chaque page wiki + audit script), **Why It Matters** (prep Phase 5 sante/finance ou claims critiques, Claude sait distinguer fact verifie vs hypothese), **Examples** (page concept verifie vs seed), **Connections** (renvoie [[Graph Report]] + [[Neuroplasticite]]), **Sources** (Graphify README).

**Fichier 2 : `wiki/concepts/Graph Report.md`**

Frontmatter similaire. Contenu : definition **god nodes / communities / surprising connections / orphelins**, mecanisme (script auto-regenere `wiki/meta/graph-report.md`), pourquoi (visibility structure cognitive, complement foundation-os-map + wiki-health), exemples (page > 10 wikilinks entrants = hub), connexions ([[Neuroplasticite]], [[Foundation OS]], [[foundation-os-map]]), sources (Graphify GRAPH_REPORT.md).

**Fichier 3 : `wiki/concepts/Layered Loading.md`**

Frontmatter similaire. Contenu : definition **L0 (hot.md, <200 tokens), L1 (CONTEXT + sessions-recent, <2k), L2 (lessons + thinking + plans, <10k), L3 (wiki on-demand wikilinks)**, mecanisme (SessionStart Tour 1 = L0+L1+L2 deterministe, L3 = reflex 1 recall), pourquoi (discipline tokens Kevin Max x20, moins reads inutiles), exemples (bug fix = L0+L1, refactor = +L2, architecture = +L3 cible), connexions ([[Hot Cache]], [[Neuroplasticite]], [[Brief v12]]), sources (MemPalace 170 tokens startup).

**Fichier 4 : `wiki/concepts/Pre-compaction Snapshot.md`**

Frontmatter similaire. Contenu : definition (snapshot wiki/hot.md + TodoWrite + CONTEXT.md dans `.omc/snapshots/YYYYMMDD-HHMM.md` avant compactage auto), mecanisme (hook Claude Code Desktop `PreCompaction` → script bash dump atomique), pourquoi (sessions >100k tokens, reprise post-compaction avec memoire intacte), exemples (session Phase 5 domaine sante longue), connexions ([[Hot Cache]], [[Neuroplasticite]], [[Foundation OS]]), sources (MemPalace auto-save hook).

#### 3.2 Linker les 4 concepts dans 3 indexes

**`wiki/index-wiki.md`** : section Concepts cross-domain, ajouter 4 lignes :
```markdown
- [[Confidence Tagging]] — granularite frontmatter pour distinguer facts vs hypotheses
- [[Graph Report]] — rapport auto god nodes + orphelins + surprising connections
- [[Layered Loading]] — 4 layers chargement context (L0-L3) discipline tokens
- [[Pre-compaction Snapshot]] — snapshot auto avant compaction sessions longues
```

**`wiki/meta/index-concepts.md`** : meme principe (source unique concepts).

**`wiki/meta/foundation-os-map.md`** : ajouter section a la fin (apres Core OS 7 modules) :
```markdown
## Enhancements 2026 (D-INTEG-01)

4 features integrees 2026-04-17 depuis sources externes (MemPalace / Graphify) :

| Feature | Concept | Implementation (Phase) |
|---------|---------|------------------------|
| Auto-save pre-compression | [[Pre-compaction Snapshot]] | `scripts/hooks/pre-compaction-snapshot.sh` (Phase 2) |
| Confidence systematique | [[Confidence Tagging]] | `scripts/wiki-confidence-audit.sh` (Phase 3) |
| Graph report auto | [[Graph Report]] | `scripts/wiki-graph-report.sh` + `wiki/meta/graph-report.md` (Phase 4) |
| Layered loading formel | [[Layered Loading]] | `docs/core/communication.md` section 6 (Phase 5) |
```

#### 3.3 Update `docs/core/knowledge.md` section 10

Ajouter apres section 9 actuelle (Maintenance) :

```markdown
## 10. Enhancements 2026 (D-INTEG-01, 2026-04-17)

Apres lecture comparative 5 sources externes (MemPalace, Octogent, Graphify, Penpax), 4 enhancements integres organiquement :

### 10.1 Confidence tagging systematique

- Clef frontmatter `confidence: high|medium|low` OBLIGATOIRE sur toute page wiki.
- Scale definie :
  - `high` : fact verifie multi-session, stable, non contredit
  - `medium` : observation single-session, absent de contradiction
  - `low` : draft, hypothese, awaiting validation
- Clef optionnelle `claim_type: extracted|inferred|speculated` pour traces fines.
- Audit : `bash scripts/wiki-confidence-audit.sh` (mode `--check` exit 1 si drift, `--fix` backfill interactif).
- Templates `wiki/meta/templates/*.md` mis a jour avec `confidence: medium` par defaut (ex draft).
- Detail : [[Confidence Tagging]]

### 10.2 Graph report auto

- Fichier auto-regenere : `wiki/meta/graph-report.md` (source unique pattern counts.md).
- Sections : god nodes (> seuil wikilinks entrants), orphelins (0 wikilink entrant), surprising connections (cross-domain), communities (par tag).
- Script : `scripts/wiki-graph-report.sh` (mode idempotent).
- Chain dans `scripts/health-check.sh` section INFO (non-bloquant).
- Seuils : `scripts/thresholds.json` section `wiki.graph_report` (god_nodes_min_wikilinks, orphan_max_allowed).
- Detail : [[Graph Report]]

### 10.3 Layered loading formel

- 4 layers chargement context (inspire MemPalace L0-L3) :
  - L0 : `wiki/hot.md` (< 200 tokens, hook SessionStart)
  - L1 : `CONTEXT.md` + `wiki/meta/sessions-recent.md` (< 2k tokens, Tour 1 /session-start)
  - L2 : `wiki/meta/lessons-learned.md` + `wiki/meta/thinking.md` + plans actifs (< 10k tokens)
  - L3 : pages wiki on-demand via wikilinks (reflex 1 neuroplasticite recall)
- Spec detaillee : `docs/core/communication.md` section 6 (ajout Phase 5).
- Detail : [[Layered Loading]]

### 10.4 Pre-compaction snapshot

- Hook `PreCompaction` Claude Code Desktop (non-bloquant) execute `scripts/hooks/pre-compaction-snapshot.sh`.
- Snapshot atomique de `wiki/hot.md` + TodoWrite actif + `CONTEXT.md` section "Prochaine action" dans `.omc/snapshots/YYYYMMDD-HHMM.md`.
- Rotation : garder 14 derniers snapshots, auto-prune oldest.
- Recovery : `cat .omc/snapshots/$(ls .omc/snapshots/ | tail -1)` en debut session si compactage detecte.
- Detail : [[Pre-compaction Snapshot]]

### 10.5 Ignores (inspiration partielle, non integres)

- MemPalace ChromaDB vector store → privilegier Obsidian grep deterministe
- MemPalace AAAK compression 30x → overkill scale 43 pages
- Octogent tentacles → overlap avec worktrees + plans ultra-detailles
- Octogent API/UI dashboard → Desktop sidebar + tasks pane couvrent
- Graphify Leiden clustering → Obsidian graph visuel suffit < 500 pages
- Graphify Whisper → pas d'audio/video stockes
- Penpax.ai capture auto navigateur/meetings → hors philosophie FOS (code volontaire, pas surveillance passive)

Sources externes analysees : [[Confidence Tagging#Sources]], [[Graph Report#Sources]], [[Layered Loading#Sources]], [[Pre-compaction Snapshot#Sources]].
```

#### 3.4 Update `scripts/thresholds.json`

Ajouter sections avant `docs` :
```json
  "wiki": {
    "sessions_max": 5,
    "hot_md_age_days_max": 3,
    "pages_physical": 48,
    "pages_functional": 43,
    "confidence_required_on_concepts": true,
    "confidence_required_on_sources": true,
    "confidence_required_on_entities": true,
    "graph_report": {
      "god_nodes_min_wikilinks": 10,
      "orphan_max_allowed": 2,
      "surprising_connection_min_domains": 2
    },
    "layered_loading": {
      "l0_tokens_max": 200,
      "l1_tokens_max": 2000,
      "l2_tokens_max": 10000
    }
  },
```

Et update `_refs` :
```json
  "_refs": [
    "docs/core/monitor.md section 4 (seuils actuels)",
    "audit v2 Agent 1 F-04 (3 seuils CSS contradictoires)",
    "audit v2 Agent 1 I-01 (thresholds.json source unique)",
    "D-INTEG-01 (2026-04-17) enhancements INT-1/2/3 + INS-1"
  ],
```

#### 3.5 Update `CONTEXT.md` section Decisions

Inserer apres ligne D-MAPPING-01 (ligne 80) :

```markdown
| D-INTEG-01 Integration sources externes | 2026-04-17 | Apres audit surface SAIN + lecture 5 sources (MemPalace / Octogent / Graphify / Penpax). 4 enhancements integres sur 5 sessions : INT-1 pre-compaction snapshot, INT-2 confidence tagging systematique, INT-3 graph report auto, INS-1 layered loading formel. Plan : `docs/plans/2026-04-17-integration-sources-externes.md`. Concepts : [[Confidence Tagging]], [[Graph Report]], [[Layered Loading]], [[Pre-compaction Snapshot]]. Spec : `docs/core/knowledge.md` section 10. |
```

#### 3.6 Dual-path plan versionne

Copier `/Users/kevinnoel/.claude/plans/ok-choix-a-effervescent-hennessy.md` vers `docs/plans/2026-04-17-integration-sources-externes.md` (convention FOS dual-path, [[feedback_plans_orchestrateur]]).

### 4. Verification

- `bash scripts/wiki-counts-sync.sh` → regenere counts.md, attendu 47 pages
- `bash scripts/wiki-health.sh` → attendu SAIN, 47 pages, hot.md 0j
- `bash scripts/ref-checker.sh` → attendu 0 cassee (139 .md scannes, +4 pages)
- `bash scripts/health-check.sh` → attendu SAIN, build 15/15 tests, drift SYNC
- `grep -c "D-INTEG-01" CONTEXT.md` → attendu 1
- `python3 -c "import json; json.load(open('scripts/thresholds.json'))"` → attendu exit 0 (JSON valide)
- `grep "## 10\\." docs/core/knowledge.md` → attendu `## 10. Enhancements 2026`

### 5. Rollback

Si health-check ou ref-checker fail apres commit, reset atomique :
```bash
git reset --hard HEAD~1    # retour a ec8f8ee
git clean -fd wiki/concepts/  # retirer fichiers nouveaux non-trackes si applicable
# Ne PAS toucher /Users/kevinnoel/.claude/plans/ok-choix-a-effervescent-hennessy.md (hors repo)
```

Si drift sur counts detecte : `bash scripts/wiki-counts-sync.sh` puis re-commit.

Si wikilink casse detecte : grep le wikilink, fix le target, re-commit.

### 6. Commit message

Format conventional :
```
docs(os): D-INTEG-01 preparation Phase 1/5 integration sources externes

- Concepts wiki (+4) : Confidence Tagging, Graph Report, Layered Loading,
  Pre-compaction Snapshot
- Linking : index-wiki + index-concepts + foundation-os-map (section Enhancements)
- Spec : docs/core/knowledge.md section 10 (4 enhancements + ignores)
- Seeds : scripts/thresholds.json (wiki.confidence, graph_report, layered_loading)
- Decision : CONTEXT.md D-INTEG-01
- Plan : docs/plans/2026-04-17-integration-sources-externes.md (dual-path)

Sources : MemPalace (L0-L3 + auto-save), Graphify (confidence tags + graph
report), Octogent + Penpax analyses (ignores documentes).

Phase 2-5 : impl scripts + hooks (5 sessions total).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Ensuite : `/session-end` (archive plan via hook si status:done, ici status:active) + `git merge claude/loving-carson-396727` main + `git push origin main`.

---

## Phase 2 — INT-1 Pre-compression snapshot (~1h, session dediee)

### 1. Pre-conditions

- Phase 1 mergee sur main (commit `docs(os): D-INTEG-01...`)
- CONTEXT.md contient D-INTEG-01
- 4 concepts wiki exists
- `docs/core/knowledge.md` section 10 present
- `scripts/thresholds.json` contient seeds wiki.*

### 2. Etat repo attendu

**Nouveaux** (2) :
```
scripts/hooks/pre-compaction-snapshot.sh
.omc/snapshots/.gitkeep         (dossier cree + gitkeep pour tracking)
```

**Modifies** (3) :
```
.claude/settings.json           ← + matcher "PreCompaction" (si API Desktop supporte)
docs/core/tools.md              ← + entree scripts/hooks/pre-compaction-snapshot.sh
.gitignore                      ← + .omc/snapshots/*.md (garder .gitkeep)
```

### 3. Actions atomiques

#### 3.1 Creer `scripts/hooks/pre-compaction-snapshot.sh`

Pattern inspire de `scripts/auto-archive-plans.sh` + `scripts/hooks/session-start-wiki.sh` :

```bash
#!/usr/bin/env bash
# pre-compaction-snapshot.sh — Snapshot atomique avant compactage contexte
# Role : dump wiki/hot.md + TodoWrite + CONTEXT.md section "Prochaine action" dans .omc/snapshots/
# Usage : declenche auto via .claude/settings.json hook PreCompaction
# Spec : docs/core/knowledge.md section 10.4
# Regle : aucun exit != 0 (hooks doivent toujours retourner 0 pour ne pas bloquer).

set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

SNAPSHOT_DIR=".omc/snapshots"
mkdir -p "$SNAPSHOT_DIR"

TS=$(date +%Y%m%d-%H%M)
OUT="$SNAPSHOT_DIR/${TS}.md"

{
  echo "# Pre-compaction snapshot — $TS"
  echo ""
  echo "## wiki/hot.md"
  echo ""
  [ -f wiki/hot.md ] && cat wiki/hot.md
  echo ""
  echo "## CONTEXT.md (Prochaine action + Sessions recentes trim)"
  echo ""
  sed -n '/## Cap/,/## Idees/p' CONTEXT.md 2>/dev/null | head -30
  echo ""
  echo "## TodoWrite (last known state)"
  echo ""
  # Parse session jsonl last TodoWrite if available
  # (graceful skip si absent)
  LATEST_JSONL=$(ls -t ~/.claude/projects/-Users-kevinnoel-foundation-os/*.jsonl 2>/dev/null | head -1)
  if [ -n "$LATEST_JSONL" ]; then
    grep -h "TodoWrite" "$LATEST_JSONL" 2>/dev/null | tail -1 | head -c 2000
  fi
} > "$OUT" 2>/dev/null

# Rotation : garder 14 derniers
ls -t "$SNAPSHOT_DIR"/*.md 2>/dev/null | tail -n +15 | xargs rm -f 2>/dev/null

exit 0
```

#### 3.2 Config `.claude/settings.json`

Ajouter matcher `PreCompaction` (API Claude Code Desktop ; a verifier, sinon fallback `Stop` ou rotation manuelle).

#### 3.3 `.gitignore`

Ajouter :
```
.omc/snapshots/*.md
!.omc/snapshots/.gitkeep
```

#### 3.4 Update `docs/core/tools.md`

Ajouter entree scripts section :
```markdown
- `scripts/hooks/pre-compaction-snapshot.sh` — snapshot atomique avant compaction. Hook PreCompaction. Rotation 14 derniers. [[Pre-compaction Snapshot]]
```

### 4. Verification

- `bash scripts/hooks/pre-compaction-snapshot.sh && ls .omc/snapshots/` → 1 fichier cree date courante
- Snapshot contient hot.md verbatim + section CONTEXT + (optionnel) TodoWrite
- `bash scripts/hooks/pre-compaction-snapshot.sh` 15 fois → rotation garde max 14 fichiers
- `python3 -c "import json; json.load(open('.claude/settings.json'))"` → JSON valide
- `bash scripts/health-check.sh` → SAIN
- `bash scripts/ref-checker.sh` → 0 cassee

### 5. Rollback

```bash
git checkout -- .claude/settings.json .gitignore docs/core/tools.md
rm -f scripts/hooks/pre-compaction-snapshot.sh
rm -rf .omc/snapshots/
```

### 6. Commit message

```
feat(os): INT-1 pre-compaction snapshot hook (Phase 2/5)

- scripts/hooks/pre-compaction-snapshot.sh : dump wiki/hot.md + CONTEXT
  Prochaine action + TodoWrite dans .omc/snapshots/YYYYMMDD-HHMM.md
- Rotation 14 derniers (auto-prune oldest)
- .claude/settings.json hook PreCompaction matcher
- .gitignore ignore snapshots/*.md (garder .gitkeep)
- docs/core/tools.md entree + [[Pre-compaction Snapshot]]

Recovery : cat .omc/snapshots/$(ls .omc/snapshots | tail -1) en debut session.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

---

## Phase 3 — INT-2 Confidence tagging systematique (~2h, session dediee)

### 1. Pre-conditions

- Phase 2 mergee
- `docs/core/knowledge.md` section 10.1 definit scale + templates
- Wiki 47 pages, ref-checker 0

### 2. Etat repo attendu

**Nouveaux** (1) :
```
scripts/wiki-confidence-audit.sh
```

**Modifies** (26 pages wiki + 3 templates + 1 tools.md + 1 knowledge.md) :
```
wiki/meta/templates/concept.md    ← confidence: medium (deja present)
wiki/meta/templates/entity.md     ← confidence: medium (a ajouter)
wiki/meta/templates/source.md     ← confidence: medium (a ajouter)
26 pages sans confidence          ← backfill interactif high|medium|low
docs/core/tools.md                ← + entree script audit
docs/core/knowledge.md            ← update section 10.1 (status "active")
```

### 3. Actions atomiques

#### 3.1 `scripts/wiki-confidence-audit.sh`

Pattern (adapte de `scripts/memory-audit.sh` + `scripts/tier-contradiction-check.sh`) :

```bash
#!/usr/bin/env bash
# wiki-confidence-audit.sh — Audit confidence frontmatter sur pages wiki
# Usage :
#   bash scripts/wiki-confidence-audit.sh          # dry-run, liste pages sans confidence
#   bash scripts/wiki-confidence-audit.sh --quiet  # exit 0/1 silent (pour chain)
#   bash scripts/wiki-confidence-audit.sh --fix    # interactif (prompt high/medium/low par page)
# Spec : docs/core/knowledge.md section 10.1
# Exit : 0 toutes pages tagged, 1 drift detecte

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"
# ... (logique scan frontmatter, detection absence confidence, prompt interactif si --fix)
```

#### 3.2 Backfill 26 pages

Liste etablie par finding Explore (F1) : 26 pages sans `confidence:` key. Pour chacune :
- `status: canonical|evergreen` → `confidence: high`
- `status: mature` → `confidence: high`
- `status: seed` avec contenu etoffe → `confidence: medium`
- `status: seed` avec contenu stub → `confidence: low`
- Stamp `updated: 2026-04-17`

#### 3.3 Chain dans health-check.sh

Ajouter section INFO :
```bash
WIKI_CONFIDENCE_OUT=$(bash scripts/wiki-confidence-audit.sh --quiet 2>&1)
# ...
```

### 4. Verification

- `bash scripts/wiki-confidence-audit.sh` → 0 pages sans confidence
- `grep -l "confidence: high" wiki/ | wc -l` → attendu ~30 pages
- `grep -l "confidence: medium" wiki/ | wc -l` → attendu ~10 pages
- `grep -l "confidence: low" wiki/ | wc -l` → attendu ~3-5 pages
- `bash scripts/health-check.sh` → SAIN
- `bash scripts/ref-checker.sh` → 0 cassee

### 5. Rollback

`git checkout -- wiki/ docs/core/ scripts/` + `rm scripts/wiki-confidence-audit.sh`

### 6. Commit message

```
feat(wiki): INT-2 confidence tagging systematique (Phase 3/5)

- scripts/wiki-confidence-audit.sh : scan + fix interactif frontmatter
- Backfill 26 pages (scale high/medium/low selon status + contenu)
- Templates (concept/entity/source) : confidence: medium par defaut
- Chain dans health-check section INFO
- docs/core/knowledge.md section 10.1 status "active"

Ref : [[Confidence Tagging]] + finding Explore F1 2026-04-17.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

---

## Phase 4 — INT-3 Graph report auto (~3h, session dediee)

### 1. Pre-conditions

- Phase 3 mergee, toutes pages wiki ont `confidence:`
- `scripts/thresholds.json` contient `wiki.graph_report.*`
- `wiki/concepts/Graph Report.md` existe

### 2. Etat repo attendu

**Nouveaux** (2) :
```
scripts/wiki-graph-report.sh
wiki/meta/graph-report.md       ← auto-genere par script (ajoute au repo apres run initial)
```

**Modifies** (4) :
```
scripts/health-check.sh          ← chain graph-report check INFO
wiki/index-wiki.md               ← + wikilink [[graph-report]]
wiki/meta/foundation-os-map.md   ← + wikilink [[graph-report]] section Enhancements
docs/core/tools.md               ← + entree script
docs/core/knowledge.md           ← update section 10.2 status "active"
```

### 3. Actions atomiques

#### 3.1 `scripts/wiki-graph-report.sh`

Pattern inspire `scripts/wiki-counts-sync.sh` (auto-regenere pattern) :

```bash
#!/usr/bin/env bash
# wiki-graph-report.sh — Auto-genere wiki/meta/graph-report.md
# Sections : god nodes, orphelins, surprising connections, communities par tag
# Usage : bash scripts/wiki-graph-report.sh [--check]
# Spec : docs/core/knowledge.md section 10.2
# Refs : wiki/meta/graph-report.md + thresholds.json wiki.graph_report.*

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

THRESHOLDS=$(cat scripts/thresholds.json)
GOD_MIN=$(echo "$THRESHOLDS" | python3 -c "import json,sys; print(json.load(sys.stdin)['wiki']['graph_report']['god_nodes_min_wikilinks'])")
# ... scan wikilinks entrants, sortants, detection orphelins, cross-domain
```

Logique :
- **God nodes** : pour chaque page wiki, compter wikilinks entrants (`grep -c "[[$basename]]" wiki/ -r`). Si >= GOD_MIN → god.
- **Orphelins** : pages avec 0 wikilink entrant (hors hot/overview/index-wiki/counts).
- **Surprising connections** : wikilinks reliant domaines (dev ↔ finance, trading ↔ sante).
- **Communities** : groupement par tag primaire dans frontmatter.

#### 3.2 Premier run + commit du fichier genere

`bash scripts/wiki-graph-report.sh` → cree `wiki/meta/graph-report.md`. Inspecter, ajuster seuils si besoin.

#### 3.3 Chain dans `health-check.sh`

Ajouter section INFO :
```bash
GRAPH_OUT=$(bash scripts/wiki-graph-report.sh --check 2>&1)
```

#### 3.4 Wikilinker

`wiki/index-wiki.md` section Meta : `- [[graph-report]] — rapport auto god nodes / orphelins / connections`.
`wiki/meta/foundation-os-map.md` section Enhancements : lien INT-3 pointe vers `[[graph-report]]`.

### 4. Verification

- `bash scripts/wiki-graph-report.sh` → cree fichier, exit 0
- `cat wiki/meta/graph-report.md | head` → frontmatter valide + sections
- `bash scripts/wiki-graph-report.sh --check` → exit 0 si fichier a jour
- `grep -l "graph-report" wiki/index-wiki.md wiki/meta/foundation-os-map.md` → attendu 2 hits
- `bash scripts/health-check.sh` → SAIN avec ligne graph-report INFO
- `bash scripts/ref-checker.sh` → 0 cassee (48 pages)

### 5. Rollback

`git checkout -- scripts/health-check.sh wiki/` + `rm scripts/wiki-graph-report.sh wiki/meta/graph-report.md`

### 6. Commit message

```
feat(wiki): INT-3 graph report auto + chain health-check (Phase 4/5)

- scripts/wiki-graph-report.sh : auto-genere wiki/meta/graph-report.md
- Sections : god nodes (>N wikilinks), orphelins (0), surprising (cross-domain), communities
- Seuils : scripts/thresholds.json wiki.graph_report.*
- Chain health-check section INFO (non-bloquant)
- Wikilinks : index-wiki + foundation-os-map
- docs/core/knowledge.md section 10.2 status "active"

Ref : [[Graph Report]] + Graphify GRAPH_REPORT.md pattern.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

---

## Phase 5 — INS-1 Layered loading formel (~30 min, session finale)

### 1. Pre-conditions

- Phases 1-4 mergees
- 4 concepts wiki, graph-report auto, confidence tags, pre-compaction snapshot tous actifs

### 2. Etat repo attendu

**Modifies** (3) :
```
docs/core/communication.md       ← + section 6.5 (ou 7) "Layered Loading L0-L3"
docs/core/knowledge.md           ← section 10.3 status "active"
wiki/concepts/Layered Loading.md ← updated: 2026-04-17 + section "Status : implemente"
```

### 3. Actions atomiques

#### 3.1 Spec canonique `docs/core/communication.md`

Ajouter section apres 6.4 (sources de donnees) :

```markdown
## 6.5 Layered context loading (L0-L3)

Formalisation inspiree de [[Layered Loading]] (D-INTEG-01 Phase 5).

### Definition layers

| Layer | Contenu | Tokens cible | Trigger |
|-------|---------|--------------|---------|
| **L0** | `wiki/hot.md` | < 200 | Hook SessionStart |
| **L1** | `CONTEXT.md` + `wiki/meta/sessions-recent.md` | < 2 000 | /session-start Tour 1 |
| **L2** | `wiki/meta/lessons-learned.md` + `wiki/meta/thinking.md` + plans actifs | < 10 000 | /session-start Tour 1 (suite) |
| **L3** | Pages wiki (concepts/entities/sources/domains) | on-demand | Reflex 1 recall wiki |

### Regles de selection

- Tache triviale (typo, clarif) : **L0 seul**
- Bug fix / small feature : **L0 + L1**
- Refactor / audit : **L0 + L1 + L2**
- Architecture / nouveau domaine : **L0 + L1 + L2 + L3 cible** (via reflex 1)

Source inspiration : [[Layered Loading#Sources]] (MemPalace 4 layers, 170 tokens startup).
```

#### 3.2 Update `wiki/concepts/Layered Loading.md`

Ajouter callout en tete :
```markdown
> [!success] Status : implemente 2026-04-17 (Phase 5/5 D-INTEG-01). Spec canonique : `docs/core/communication.md` section 6.5.
```

#### 3.3 Update `docs/core/knowledge.md` section 10.3

Status : "active" + lien vers communication.md 6.5.

### 4. Verification

- `grep "^## 6.5" docs/core/communication.md` → 1 hit
- `grep "Status : implemente" wiki/concepts/Layered\ Loading.md` → 1 hit
- `bash scripts/ref-checker.sh` → 0 cassee
- `bash scripts/health-check.sh` → SAIN
- Lecture manuelle : section 6.5 coherente avec 6.1-6.4

### 5. Rollback

`git checkout -- docs/core/communication.md docs/core/knowledge.md wiki/concepts/Layered\ Loading.md`

### 6. Commit message

```
docs(os): INS-1 layered loading formel section 6.5 (Phase 5/5)

- docs/core/communication.md : nouvelle section 6.5 "Layered context loading L0-L3"
- 4 layers definis (hot / CONTEXT+sessions / lessons+thinking / wiki on-demand)
- Regles selection par type de tache
- wiki/concepts/Layered Loading.md : status implemente
- docs/core/knowledge.md section 10.3 active

Ref : [[Layered Loading]] + MemPalace 4 layers / 170 tokens startup.

D-INTEG-01 TERMINE (5 phases / 5).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Apres Phase 5 : `/session-end` detecte cases `[x] >= 3` toutes cochees → auto-archive vers `.archive/plans-done-YYMMDD/`.

---

## Execution log

### Phase 1 — Preparation architecturale [DONE 2026-04-18]

- [x] 3.1 Creer 4 concepts wiki (Confidence Tagging / Graph Report / Layered Loading / Pre-compaction Snapshot)
- [x] 3.2 Linker 4 concepts dans 3 indexes (index-wiki / index-concepts / foundation-os-map)
- [x] 3.3 `docs/core/knowledge.md` section 12 "Enhancements 2026" (section renumerotee)
- [x] 3.4 `scripts/thresholds.json` sections wiki.confidence, graph_report, layered_loading, pre_compaction
- [x] 3.5 `CONTEXT.md` D-INTEG-01
- [x] 3.6 Dual-path plan versionne `docs/plans/2026-04-17-integration-sources-externes.md`
- [x] 4 Verifications (47 pages, 712 wikilinks, health SAIN, ref 0, thresholds JSON valide, section 12 presente)
- [x] 6 Commit `6386823` + merge `452a342` + push origin main

### Phase 2 — INT-1 Pre-compression snapshot [DONE 2026-04-18]

- [x] 3.1 `scripts/hooks/pre-compaction-snapshot.sh` (2217 bytes, +x, rotation 14)
- [x] 3.2 `.claude/settings.json` PreCompact matcher (best-effort, fallback manuel)
- [x] 3.3 `.gitignore` `.omc/snapshots/*.md` + `!.omc/snapshots/.gitkeep`
- [x] 3.4 `docs/core/tools.md` entree Validators
- [x] 4 Verifications (snapshot cree 139L, rotation 16->14, JSON valide, health SAIN, ref 0)
- [ ] 6 Commit + merge main + push

### Phase 3 — INT-2 Confidence tagging [DONE 2026-04-18]

- [x] 3.1 `scripts/wiki-confidence-audit.sh` (3 modes : default / --quiet / --check)
- [x] 3.2 Backfill 22 pages (scope reel : 22 MISS, pas 26 — Phase 1 avait deja couvert 4 concepts)
- [x] 3.3 Update template entity.md (concept.md + source.md deja medium)
- [x] 3.4 Chain health-check INFO (wiki-confidence apres tier-contradictions)
- [x] 4 Verifications (0 sans confidence, 40 high / 1 medium / 3 low, health SAIN, ref 0/140)
- [ ] 6 Commit + merge main + push

### Phase 4 — INT-3 Graph report auto

- [ ] 3.1 `scripts/wiki-graph-report.sh`
- [ ] 3.2 Premier run + inspection `wiki/meta/graph-report.md`
- [ ] 3.3 Chain health-check INFO
- [ ] 3.4 Wikilinks (index-wiki + foundation-os-map)
- [ ] 4 Verifications (fichier cree, --check exit 0, ref 0)
- [ ] 6 Commit + merge main + push

### Phase 5 — INS-1 Layered loading formel

- [ ] 3.1 Spec `docs/core/communication.md` section 6.5
- [ ] 3.2 Update `wiki/concepts/Layered Loading.md` callout success
- [ ] 3.3 Update `docs/core/knowledge.md` section 10.3 active
- [ ] 4 Verifications (section 6.5 presente, ref 0, health SAIN)
- [ ] 6 Commit + merge main + push + /session-end (archive plan auto)

---

## References

- [[Foundation OS]] — page canonique
- [[Neuroplasticite]] — 4 reflexes apprentissage
- [[Hot Cache]] — L0 layer
- [[Compounding Knowledge]] — pattern Karpathy
- [[Brief v12]] — format brief SessionStart
- `docs/core/knowledge.md` — spec module Knowledge (Phase 7 actif)
- `docs/core/communication.md` — spec Communication (brief + tiers + layers)
- `scripts/thresholds.json` — source unique seuils
- `scripts/health-check.sh` — chain scripts INFO
- `scripts/wiki-counts-sync.sh` — pattern source unique (a repliquer)
- `scripts/auto-archive-plans.sh` — pattern hook idempotent
- Sources externes : [MemPalace](https://github.com/MemPalace/mempalace) · [Octogent](https://github.com/hesamsheikh/octogent) · [Graphify](https://github.com/safishamsi/graphify) · [Penpax.ai](https://safishamsi.github.io/penpax.ai/)

## Decisions associees

- **D-INTEG-01** (2026-04-17) Integration sources externes MemPalace/Graphify : 4 enhancements (INT-1/2/3 + INS-1) sur 5 sessions
- **D-MAPPING-01** (2026-04-17) precurseur — refactor mapping cerveau OS (context post-refactor sain = condition prealable)
- **D-WIKI-01** (2026-04-15) Adoption claude-obsidian 5 tiers (context wiki layer actif = condition prealable)
