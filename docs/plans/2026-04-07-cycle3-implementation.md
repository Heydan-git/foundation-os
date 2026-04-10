# Cycle 3 — Audit Massif Final / Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> Spec source : `docs/plans/2026-04-07-audit-massif-final.md` (lecture obligatoire avant chaque session).

**Goal:** Executer l'audit massif final de Foundation OS en 24 sessions (S0-S23), produire 24 livrables MD dans `.archive/audit-massif/`, appliquer fixes en 3 batches sur branche dediee, valider zero regression, livrer PR `audit-massif-cycle3 → main`.

**Architecture:** Branche dediee `audit-massif-cycle3` cree en S0, tag baseline `pre-audit-cycle3`, 13 phases / 24 sessions, sub-agents restreints a 5 sessions (S1, S13, S14, S17, S18), 19 sessions executees MOI directement, 3 gates Kevin (G1 apres S19, G2 apres S22, G3 apres S23), anti-compactage robuste via master file + INDEX + livrables MD self-contained, commits incrementaux 1-par-session, PR finale en S23.

**Tech Stack:** git, bash, Foundation OS scripts (health-check.sh, sync-check.sh, ref-checker.sh, validate-void-glass.sh, vitest, npm build), Claude Code skills (superpowers, OMC), Agents Foundation OS (os-architect, dev-agent, doc-agent, review-agent), MCP (web search/Context7 pour S17), git hooks (pre-commit, commit-msg).

---

## File Structure

**Sources de verite (lecture obligatoire chaque session)**
- `CLAUDE.md` — imperatifs Foundation OS
- `CONTEXT.md` — etat global, section "Cycle 3 progress"
- `docs/plans/2026-04-07-audit-massif-final.md` — LE spec (deja existe, 420L)
- `.archive/audit-massif/00-INDEX.md` — INDEX sessions (deja existe placeholder, sera enrichi en S0)

**Fichiers crees pendant l'execution**
- `.archive/audit-massif/00-preflight.md` (S0)
- `.archive/audit-massif/01-carto-repo.md` (S1)
- `.archive/audit-massif/02-inventaire-components.md` (S2)
- ... 24 livrables au total
- `.archive/audit-massif/23-rapport-final.md` (S23)

**Fichiers modifies pendant l'execution**
- `docs/plans/2026-04-07-audit-massif-final.md` — section 6 live tracking apres chaque session
- `.archive/audit-massif/00-INDEX.md` — status sessions
- `CONTEXT.md` — section "Cycle 3 progress" + entrees Dernieres sessions

**Fichiers code modifies UNIQUEMENT en S20-S22 (apres Gate G1)**
- Contenu fixes selon roadmap S19. Aucun fichier code modifie de S0 a S19.

---

## Vue d'ensemble 24 sessions

| #   | Phase            | Mode  | Livrable                          | Gate |
|-----|------------------|-------|-----------------------------------|------|
| S0  | 0 Pre-flight     | MOI   | 00-preflight.md                   | —    |
| S1  | I Reconnaissance | MIX   | 01-carto-repo.md                  | —    |
| S2  | I Reconnaissance | MOI   | 02-inventaire-components.md       | —    |
| S3  | II Fondations    | MOI   | 03-fondations-core.md             | —    |
| S4  | II Fondations    | MOI   | 04-architecture-orga.md           | —    |
| S5  | III Execution    | MOI   | 05-workflows-routing.md           | —    |
| S6  | III Execution    | MOI   | 06-orchestration-automation.md    | —    |
| S7  | IV Composants    | MOI   | 07-agents.md                      | —    |
| S8  | IV Composants    | MOI   | 08-commands.md                    | —    |
| S9  | IV Composants    | MOI   | 09-scripts-hooks.md               | —    |
| S10 | IV Composants    | MOI   | 10-skills.md                      | —    |
| S11 | V Comm/Secu/Mem  | MOI   | 11-comm-securite.md               | —    |
| S12 | V Comm/Secu/Mem  | MOI   | 12-memory-anti-compactage.md      | —    |
| S13 | VI Module        | MIX   | 13-module-app.md                  | —    |
| S14 | VII SUGG tech    | MIX   | 14-sugg-tech-1.md                 | —    |
| S15 | VII SUGG tech    | MOI   | 15-sugg-tech-2.md                 | —    |
| S16 | VIII SUGG strat  | MOI   | 16-sugg-strategic.md              | —    |
| S17 | IX External      | SUB   | 17-external-research.md           | —    |
| S18 | X Cross-check    | SUB   | 18-cross-check.md                 | —    |
| S19 | XI Synthese      | MOI   | 19-synthese-roadmap.md            | G1   |
| S20 | XII Fixes P1     | MOI   | 20-fixes-p1-applied.md            | —    |
| S21 | XII Fixes P2     | MOI   | 21-fixes-p2-applied.md            | —    |
| S22 | XII Fixes P3     | MOI   | 22-fixes-p3-applied.md            | G2   |
| S23 | XIII Verdict     | MOI   | 23-rapport-final.md               | G3   |

---

## Pre-session ritual (applique a chaque session S0-S23)

**Steps a executer EN DEBUT DE CHAQUE SESSION (avant l'execution metier)** :

- [ ] Step PR1 : Lire `CLAUDE.md` (imperatifs)
- [ ] Step PR2 : Lire `CONTEXT.md` section "Cycle 3 progress"
- [ ] Step PR3 : Lire `docs/plans/2026-04-07-audit-massif-final.md` section 6 live tracking
- [ ] Step PR4 : Lire `.archive/audit-massif/00-INDEX.md`
- [ ] Step PR5 : Lire le livrable de la session precedente `.archive/audit-massif/[N-1].md` (sauf S0)
- [ ] Step PR6 : Verifier branche actuelle (main pour S0, audit-massif-cycle3 pour S1+)
  Run: `git status && git branch --show-current`
- [ ] Step PR7 : Verifier baseline saine
  Run: `bash scripts/health-check.sh`
  Expected: `Verdict : SAIN`
- [ ] Step PR8 : Annoncer objectif precis de la session a Kevin (1-2 phrases)

---

## Post-session ritual (applique a chaque session)

**Steps a executer EN FIN DE CHAQUE SESSION (apres ecriture du livrable)** :

- [ ] Step PO1 : Self-check du livrable (no bullshit, sources line:file pour chaque finding)
- [ ] Step PO2 : Pour S20-S22 (fixes) : run health/sync/refs/vitest
  Run: `bash scripts/health-check.sh && bash scripts/sync-check.sh && bash scripts/ref-checker.sh`
  Expected: tous SAIN, vitest 19/19
- [ ] Step PO3 : Update `.archive/audit-massif/00-INDEX.md` : ligne session = DONE + date + commit hash
- [ ] Step PO4 : Update `docs/plans/2026-04-07-audit-massif-final.md` section 6 : status, findings cles top 3-5
- [ ] Step PO5 : Update `CONTEXT.md` section "Cycle 3 progress" (1 ligne)
- [ ] Step PO6 : Stage les fichiers
  Run: `git add .archive/audit-massif/[livrable].md docs/plans/2026-04-07-audit-massif-final.md .archive/audit-massif/00-INDEX.md CONTEXT.md`
- [ ] Step PO7 : Commit
  Run: `git commit -m "audit(s<NN>): <description>" --signoff` (selon convention Foundation OS)
- [ ] Step PO8 : Annoncer fin de session a Kevin + objectif prochaine session

---

# PHASE 0 — Pre-flight (S0)

> Mode : MOI | Livrable : `.archive/audit-massif/00-preflight.md`
> Pre-conditions : sur main, baseline SAINE, 0 commits ahead origin (apres push Kevin)

### Task S0.1 : Action Kevin manuelle — push commits ahead

**Files:** none (git operation)

- [ ] Step 1 : Demander a Kevin de push les commits ahead
  - Annonce : "Pour S0, j'ai besoin que tu lances `git push origin main` toi-meme. J'ai 2 commits locaux non pushed (`6a69f89`, `b3dc47f`). Sans ça, CI + Vercel ne valideront pas et la baseline reste a jour partial."
  - Attendre confirmation Kevin
- [ ] Step 2 : Verifier que push a eu lieu
  Run: `git rev-list --left-right --count origin/main...HEAD`
  Expected: `0	0`
- [ ] Step 3 : Verifier CI green
  Run: `gh run list --limit 1`
  Expected: status `completed success`

### Task S0.2 : Creer la branche audit-massif-cycle3

**Files:** none (git operation)

- [ ] Step 1 : Creer la branche depuis main
  Run: `git checkout -b audit-massif-cycle3`
- [ ] Step 2 : Verifier qu'on est sur la nouvelle branche
  Run: `git branch --show-current`
  Expected: `audit-massif-cycle3`

### Task S0.3 : Creer le tag baseline

**Files:** none (git operation)

- [ ] Step 1 : Creer tag annote sur le commit de depart
  Run: `git tag -a pre-audit-cycle3 -m "Baseline pre Cycle 3 audit massif final"`
- [ ] Step 2 : Verifier le tag
  Run: `git tag -l 'pre-audit-cycle3' && git show pre-audit-cycle3 --no-patch`
  Expected: tag existe, pointe sur le HEAD actuel

### Task S0.4 : Capture metrics baseline

**Files:** None (lecture seule, contenu va dans 00-preflight.md)

- [ ] Step 1 : Run health-check et capturer output complet
  Run: `bash scripts/health-check.sh > /tmp/baseline-health.txt 2>&1 && cat /tmp/baseline-health.txt`
  Expected: `Verdict : SAIN`
- [ ] Step 2 : Run sync-check et capturer
  Run: `bash scripts/sync-check.sh > /tmp/baseline-sync.txt 2>&1 && cat /tmp/baseline-sync.txt`
  Expected: 6/6 checks PASS
- [ ] Step 3 : Run ref-checker et capturer
  Run: `bash scripts/ref-checker.sh > /tmp/baseline-refs.txt 2>&1 && cat /tmp/baseline-refs.txt`
  Expected: 0 broken refs
- [ ] Step 4 : Run vitest et capturer
  Run: `cd modules/app && npm test -- --run > /tmp/baseline-vitest.txt 2>&1 && cat /tmp/baseline-vitest.txt`
  Expected: 19 passed
- [ ] Step 5 : Run build et capturer metrics bundle
  Run: `cd modules/app && npm run build > /tmp/baseline-build.txt 2>&1 && cat /tmp/baseline-build.txt`
  Expected: build success, bundle JS ~457kB / CSS ~17kB
- [ ] Step 6 : Capturer git state
  Run: `git log --oneline -5 > /tmp/baseline-git.txt && git rev-parse HEAD >> /tmp/baseline-git.txt && cat /tmp/baseline-git.txt`

### Task S0.5 : Ecrire le livrable 00-preflight.md

**Files:**
- Create: `.archive/audit-massif/00-preflight.md`

- [ ] Step 1 : Ecrire le livrable avec tous les metrics baseline captures aux Tasks S0.4
  Format selon template livrable du spec (objectif, methodologie, findings, decisions, cross-references, out-of-scope, next session).
  Inclure : SHA HEAD baseline, tag pre-audit-cycle3, branche actuelle, output health/sync/refs/vitest/build.

```markdown
# S0 — Pre-flight setup
> Date : 2026-04-07 | Status : DONE | Mode : MOI
> Livrable precedent : (aucun, premier de l'audit)
> Findings cles : baseline SAINE, branche cree, tag pose

## 1. Objectif
Setup baseline complete pour Cycle 3 : push pending commits, branche dediee,
tag baseline, capture metrics initiales pour comparaison post-audit.

## 2. Methodologie
Actions git + capture metrics via scripts Foundation OS.

## 3. Etat baseline (capture)
- SHA HEAD : <sha de origin/main apres push>
- Branche : audit-massif-cycle3
- Tag baseline : pre-audit-cycle3
- Health : SAIN (build XXXms)
- Sync : 6/6
- Refs : 0/40 broken
- Vitest : 19/19 passed
- Bundle : JS XXXkB / CSS XXkB
- TS : 0 erreurs
- Void Glass : 0 violations

## 4. Decisions
Aucune decision metier en S0. Setup pur.

## 5. Cross-references
- Spec : docs/plans/2026-04-07-audit-massif-final.md
- INDEX : .archive/audit-massif/00-INDEX.md

## 6. Out-of-scope flagges
Aucun.

## 7. Next session
S1 — Carto repo file-by-file (mode MIX, sub-agents Explore parallele).
```

### Task S0.6 : Update INDEX et master file

**Files:**
- Modify: `.archive/audit-massif/00-INDEX.md` (line containing "S0  Pre-flight")
- Modify: `docs/plans/2026-04-07-audit-massif-final.md` section 6

- [ ] Step 1 : Update 00-INDEX.md ligne S0 : status PENDING → DONE + date 2026-04-07 + commit (apres commit fait)
- [ ] Step 2 : Update master file section 6 ligne S0 : idem + findings cles

### Task S0.7 : Update CONTEXT.md

**Files:**
- Modify: `CONTEXT.md` (section "Dernieres sessions" et/ou "Prochaine action")

- [ ] Step 1 : Ajouter une ligne dans "Dernieres sessions" : "Cycle 3 — S0 pre-flight DONE, branche cree, baseline capturee"
- [ ] Step 2 : Update "Prochaine action" : "Cycle 3 — S1 carto repo file-by-file (mode MIX, sub-agents)"

### Task S0.8 : Commit S0

**Files:** All files modified above

- [ ] Step 1 : Stage les fichiers
  Run: `git add .archive/audit-massif/00-preflight.md .archive/audit-massif/00-INDEX.md docs/plans/2026-04-07-audit-massif-final.md CONTEXT.md`
- [ ] Step 2 : Commit
  Run:
  ```bash
  git commit -m "$(cat <<'EOF'
audit(s00): preflight setup branche audit-massif-cycle3 + tag baseline

- Branche audit-massif-cycle3 creee depuis main
- Tag pre-audit-cycle3 pose sur HEAD baseline
- Capture metrics baseline : health SAIN, sync 6/6, refs 0/40, vitest 19/19, bundle ~474kB
- Livrable .archive/audit-massif/00-preflight.md cree

Cycle 3 demarre. Prochaine session : S1 carto repo file-by-file.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
  ```
- [ ] Step 3 : Verifier
  Run: `git log --oneline -1`
  Expected: `audit(s00): preflight setup ...`

### Task S0.9 : Annoncer fin S0

- [ ] Step 1 : Annoncer a Kevin :
  "S0 done. Branche `audit-massif-cycle3` cree, tag `pre-audit-cycle3` pose, baseline capturee dans `.archive/audit-massif/00-preflight.md`. Prochaine session : S1 — Carto repo file-by-file (mode MIX). On y va ?"

---

# PHASE I — Reconnaissance (S1, S2)

## Session S1 — Carto repo file-by-file (mode MIX)

> Mode : MIX | Livrable : `.archive/audit-massif/01-carto-repo.md`
> Sub-agents : 3 Explore en parallele sur dossiers ISOLES, MOI consolide

### Task S1.1 : Pre-session ritual (Steps PR1-PR8)

### Task S1.2 : Brief les 3 sub-agents Explore

**Files:** none (Agent tool calls)

- [ ] Step 1 : Lancer 3 sub-agents Explore EN PARALLELE (1 message, 3 Agent calls)

Sub-agent #1 brief :
```
[OBJECTIF]
Carto exhaustive de modules/app/src/ : lister chaque fichier avec son role
apparent, sa taille en lignes, sa derniere modification, et 1-2 mots-cles
pour decrire son contenu.

[FICHIERS A REGARDER]
Tous les .ts et .tsx dans modules/app/src/ recursivement.
Glob pattern : modules/app/src/**/*.{ts,tsx}

[CONTRAINTES]
- Ne pas modifier de fichiers
- Ne pas chercher hors de modules/app/src/
- "incertain" si pas sur du role
- Pas de hallucination

[CONTEXTE FOUNDATION OS]
- Stack : Vite + React + TS + Tailwind + Supabase
- Design system : Void Glass (#06070C, Figtree, JetBrains Mono)
- Imperatifs : zero bullshit, source line:file pour chaque finding
- Tests dans src/test/, components dans src/components/, pages dans src/pages/

[FORMAT DE SORTIE]
Tableau MD avec colonnes : path | lines | role | keywords | last_modified
```

Sub-agent #2 brief :
```
[OBJECTIF]
Carto de .github/, supabase/, .claude/, scripts/ : lister chaque fichier avec
son role apparent, format, et purpose.

[FICHIERS A REGARDER]
- .github/workflows/*.yml
- .github/* (autres)
- supabase/migrations/*.sql
- supabase/* (autres)
- .claude/agents/*.md
- .claude/commands/*.md
- .claude/settings.json (si existe)
- scripts/**/*.{sh,py,js}
- scripts/git-hooks/*

[CONTRAINTES]
- Ne pas modifier
- Pas hors de ces dossiers
- "incertain" si pas sur

[FORMAT DE SORTIE]
Tableau MD avec colonnes : path | type | role | purpose
```

Sub-agent #3 brief :
```
[OBJECTIF]
Carto de docs/ et fichiers racine : lister chaque .md avec son role, taille,
date, et 1-2 mots-cles.

[FICHIERS A REGARDER]
- docs/**/*.md (recursif)
- CLAUDE.md, CONTEXT.md, README.md (racine)

[CONTRAINTES]
- Ne pas modifier
- Pas hors de ces fichiers
- Skip .archive/audit-massif/ (cree par cet audit)

[FORMAT DE SORTIE]
Tableau MD avec colonnes : path | lines | role | keywords | category
```

### Task S1.3 : Recevoir et consolider outputs sub-agents

- [ ] Step 1 : Attendre les 3 sub-agents (parallele)
- [ ] Step 2 : Lire les 3 outputs
- [ ] Step 3 : MOI consolide en un tableau de bord unique avec 4 sections (App, Infra, Docs, Root)
- [ ] Step 4 : Identifier doublons, fichiers orphelins, refs cassees potentielles, anomalies de taille (TSX > 700L)

### Task S1.4 : Ecrire le livrable 01-carto-repo.md

**Files:**
- Create: `.archive/audit-massif/01-carto-repo.md`

- [ ] Step 1 : Ecrire le livrable selon template (objectif/methodo/findings/decisions/refs/oos/next)
  - Findings cles : top 5 anomalies decouvertes
  - Section "Cartographie consolide" avec les 4 sous-sections
  - Source : sub-agents #1/#2/#3 + verifications croisees MOI

### Task S1.5 : Post-session ritual (Steps PO1-PO8)

- [ ] Commit message : `audit(s01): carto repo file-by-file → .archive/audit-massif/01-carto-repo.md`

---

## Session S2 — Inventaire components + smoke tests (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/02-inventaire-components.md`
> 4 agents + 4 commands + 8 scripts (4 racine + 2 hooks + 2 git-hooks) + skills + MCP + CI workflows

### Task S2.1 : Pre-session ritual

### Task S2.2 : Inventaire 4 agents

- [ ] Step 1 : Read chaque fichier `.claude/agents/*.md` (os-architect, dev-agent, doc-agent, review-agent)
- [ ] Step 2 : Capturer pour chaque agent : nom, description, model, tools, frontmatter complet, longueur en lignes
- [ ] Step 3 : Identifier delegations entre agents (qui invoque qui)
- [ ] Step 4 : Smoke test : verifier que chaque agent a un fichier valide (frontmatter parse OK)
  Run: `for f in .claude/agents/*.md; do head -10 "$f"; echo '---'; done`

### Task S2.3 : Inventaire 4 commands

- [ ] Step 1 : Read chaque fichier `.claude/commands/*.md` (session-start, session-end, new-project, sync)
- [ ] Step 2 : Capturer : nom, description, workflow steps, longueur
- [ ] Step 3 : Identifier les scripts/agents invoques par chaque command

### Task S2.4 : Inventaire 8 scripts

- [ ] Step 1 : Lister `scripts/**/*.{sh,py,js}` + scripts/git-hooks/*
- [ ] Step 2 : Pour chaque script, run `--help` ou tete de fichier pour decouvrir purpose
  Run: `for s in scripts/*.sh; do echo "=== $s ==="; head -20 "$s"; echo; done`
- [ ] Step 3 : Smoke test : run chaque script avec `--help`
  Run: `bash scripts/health-check.sh --help 2>&1 || true`
  Run: `bash scripts/sync-check.sh --help 2>&1 || true`
  Run: `bash scripts/ref-checker.sh --help 2>&1 || true`
  Run: `bash scripts/module-scaffold.sh --help 2>&1`
  Run: `bash scripts/validate-void-glass.sh --help 2>&1 || true`

### Task S2.5 : Inventaire 2 hooks (Void Glass + security)

- [ ] Step 1 : Read `scripts/hooks/validate-void-glass.sh` et `scripts/hooks/security-reminder.py`
- [ ] Step 2 : Identifier ou ils sont declenches (settings.json, pre-commit, etc.)
  Run: `grep -r "validate-void-glass\|security-reminder" .claude/ scripts/ 2>/dev/null`

### Task S2.6 : Inventaire skills + MCP + CI

- [ ] Step 1 : Skills internes : chercher skills Foundation OS (probablement aucun custom)
- [ ] Step 2 : Skills externes : list via auto-context (Foundation OS dans CONTEXT.md MCP section)
- [ ] Step 3 : MCP : list via CONTEXT.md MCP section (Asana, Notion, Figma, Monday, ClickUp, Computer Use, Context7)
- [ ] Step 4 : CI : Read `.github/workflows/ci.yml` et `.github/workflows/supabase-ping.yml`

### Task S2.7 : Ecrire livrable 02-inventaire-components.md

**Files:**
- Create: `.archive/audit-massif/02-inventaire-components.md`

- [ ] Step 1 : Ecrire selon template avec section dediee a chaque categorie (agents, commands, scripts, hooks, skills, MCP, CI)
- [ ] Step 2 : Findings cles : 3-5 anomalies (orphelins, deprecates, missing, etc.)

### Task S2.8 : Post-session ritual

- [ ] Commit message : `audit(s02): inventaire components + smoke tests → .archive/audit-massif/02-inventaire-components.md`

---

# PHASE II — Fondations (S3, S4)

## Session S3 — OS Foundation + Core OS (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/03-fondations-core.md`
> Verifier que les 4 piliers Core OS (Cortex/Memory/Monitor/Tools) sont reels

### Task S3.1 : Pre-session ritual

### Task S3.2 : Lecture deep docs/core/

- [ ] Step 1 : Read `docs/core/cortex.md` ligne par ligne, capturer specs routing
- [ ] Step 2 : Read `docs/core/communication.md` ligne par ligne, capturer 4 tiers (ex-memory.md)
- [ ] Step 3 : Read `docs/core/monitor.md` ligne par ligne, capturer health indicators
- [ ] Step 4 : Read `docs/core/tools.md` ligne par ligne, capturer outils existants/backlog
- [ ] Step 5 : Read `docs/core/architecture-core.md` pour vue d'ensemble

### Task S3.3 : Lecture deep docs/specs/foundation-os-v2-design.md

- [ ] Step 1 : Read `docs/specs/2026-04-05-foundation-os-v2-design.md` integralement
- [ ] Step 2 : Identifier Phase 5 et au-dela
- [ ] Step 3 : Cross-ref avec etat actuel

### Task S3.4 : Test reel chaque pilier Core OS

- [ ] Step 1 : Cortex (routing) — verifier table signaux dans docs/core/cortex.md → est-ce utilise dans les agents/commands ?
  Run: `grep -r "Cortex\|cortex" .claude/ docs/ 2>/dev/null`
- [ ] Step 2 : Memory (4 tiers) — verifier section/Contexte/Reference/Auto
  Run: `ls -la /Users/kevinnoel/.claude/projects/-Users-kevinnoel-foundation-os/memory/`
  Verifier que MEMORY.md existe, contient les 6 entries listed
- [ ] Step 3 : Monitor (health) — run le script
  Run: `bash scripts/health-check.sh && echo "MONITOR REEL"`
- [ ] Step 4 : Tools (automation) — list les scripts existants vs backlog dans docs/core/tools.md
  Run: `ls -la scripts/ scripts/hooks/ scripts/git-hooks/`

### Task S3.5 : Ecrire findings (avec source line:file)

- [ ] Step 1 : Pour chaque pilier : verdict reel/theorique + source line:file
- [ ] Step 2 : Findings cles : top 5 (ex: pilier X est documenté mais pas utilisé, pilier Y manque dans agent Z)

### Task S3.6 : Ecrire livrable 03-fondations-core.md

### Task S3.7 : Post-session ritual

- [ ] Commit message : `audit(s03): fondations core OS (4 piliers reel vs theorie) → 03-fondations-core.md`

---

## Session S4 — Architecture organicite/scalabilite/maintenabilite (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/04-architecture-orga.md`

### Task S4.1 : Pre-session ritual

### Task S4.2 : Audit organicite

- [ ] Step 1 : Identifier dependencies entre agents/commands/scripts (qui appelle qui)
  Run: `grep -rn "agents/\|commands/\|scripts/" .claude/ docs/core/ scripts/ 2>/dev/null | head -50`
- [ ] Step 2 : Identifier dependencies entre docs (cross-refs MD)
- [ ] Step 3 : Identifier code mort potentiel (fichiers jamais reference)

### Task S4.3 : Audit scalabilite

- [ ] Step 1 : Lire structure modules/ : 1 module actif (app), 2 prevus (Finance, Sante)
  Run: `ls -la modules/`
- [ ] Step 2 : Identifier ce qui est partage vs ce qui est specifique au module app
  Run: `grep -rn "modules/app" docs/ scripts/ 2>/dev/null | head -20`
- [ ] Step 3 : Imaginer 5 modules : qu'est-ce qui casse ? (auth, db, deploy, ci, navigation, etc.)
- [ ] Step 4 : Imaginer 10 modules : meme exercice

### Task S4.4 : Audit maintenabilite

- [ ] Step 1 : Stat code/doc ratio
  Run: `find modules/app/src -name '*.ts*' | xargs wc -l 2>/dev/null | tail -1`
  Run: `find docs -name '*.md' | xargs wc -l 2>/dev/null | tail -1`
- [ ] Step 2 : Stat fichiers gros (> 500 lignes)
  Run: `find modules/app/src docs scripts -type f \( -name '*.ts*' -o -name '*.md' -o -name '*.sh' \) -exec wc -l {} + | sort -rn | head -20`
- [ ] Step 3 : Identifier doublons (meme info dans plusieurs fichiers)
- [ ] Step 4 : Identifier dette technique connue (TODO, FIXME, HACK)
  Run: `grep -rn "TODO\|FIXME\|HACK\|XXX" modules/app/src scripts docs 2>/dev/null | head -20`

### Task S4.5 : Findings + livrable 04-architecture-orga.md

### Task S4.6 : Post-session ritual

- [ ] Commit message : `audit(s04): architecture organicite/scalabilite/maintenabilite → 04-architecture-orga.md`

---

# PHASE III — Execution & orchestration (S5, S6)

## Session S5 — Workflows + commands + routing Cortex (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/05-workflows-routing.md`
> Run chaque command avec cas reel + cas piege + tester routing

### Task S5.1 : Pre-session ritual

### Task S5.2 : Test reel /session-start

- [ ] Step 1 : Lire `.claude/commands/session-start.md` ligne par ligne
- [ ] Step 2 : Identifier les 6 etapes documentees
- [ ] Step 3 : Verifier que chaque etape est realisee dans la pratique (j'ai deja execute /session-start au debut de cette conversation, je peux comparer)
- [ ] Step 4 : Cas piege : que se passe-t-il si CONTEXT.md est manquant ? Si build casse ? Si racine pollute ?

### Task S5.3 : Test reel /session-end

- [ ] Step 1 : Read le fichier
- [ ] Step 2 : Identifier les actions (commit propose, update CONTEXT.md, etc.)
- [ ] Step 3 : Cas piege : et si pas de changements ? Si tests failent ? Si refs cassees ?

### Task S5.4 : Test reel /sync

- [ ] Step 1 : Read le fichier
- [ ] Step 2 : Run `/sync` ne se fait pas via Bash, c'est un slash command. Verifier la spec dans le fichier .md
- [ ] Step 3 : Run le sync-check.sh equivalent
  Run: `bash scripts/sync-check.sh`

### Task S5.5 : Test reel /new-project

- [ ] Step 1 : Read le fichier
- [ ] Step 2 : Verifier que ça pointe vers `scripts/module-scaffold.sh`
- [ ] Step 3 : Tester (en dry-run, ne pas creer de module)
  Run: `bash scripts/module-scaffold.sh --help`

### Task S5.6 : Test routing Cortex

- [ ] Step 1 : Read `docs/core/cortex.md` section 1 (table signaux → agents)
- [ ] Step 2 : Imaginer 5-10 inputs varies et identifier quel agent serait invoque selon la table
  Exemples : "audit ce code", "scaffold un nouveau module", "documente ce changement", "decision archi", "fix ce bug"
- [ ] Step 3 : Verifier que les agents existent et ont la description correspondante
- [ ] Step 4 : Identifier les inputs ambigus (plusieurs matches) ou orphelins (aucun match)

### Task S5.7 : Findings + livrable 05-workflows-routing.md

### Task S5.8 : Post-session ritual

- [ ] Commit message : `audit(s05): workflows + commands + routing Cortex → 05-workflows-routing.md`

---

## Session S6 — Skills d'orchestration + automation + hooks chain (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/06-orchestration-automation.md`
> Hooks PreToolUse, CI/CD chain end-to-end, git hooks, deploy

### Task S6.1 : Pre-session ritual

### Task S6.2 : Audit hooks PreToolUse

- [ ] Step 1 : Read `scripts/hooks/validate-void-glass.sh` ligne par ligne
- [ ] Step 2 : Read `scripts/hooks/security-reminder.py` ligne par ligne
- [ ] Step 3 : Identifier ou ils sont declenches (Claude Code settings.json ou .claude/settings.json ?)
  Run: `find . -name 'settings.json' -path '*/.claude*' 2>/dev/null | head -5`
  Run: `cat .claude/settings.json 2>/dev/null || echo "no settings.json"`
- [ ] Step 4 : Test legitime : modifier un fichier avec couleur Void Glass valide → hook passe
- [ ] Step 5 : Test piege : modifier avec couleur invalide (#0a0a0b lowercase, c'etait le bug F11) → hook bloque ?

### Task S6.3 : Audit git hooks

- [ ] Step 1 : Read `scripts/git-hooks/pre-commit` ligne par ligne
- [ ] Step 2 : Read `scripts/git-hooks/commit-msg` ligne par ligne
- [ ] Step 3 : Verifier installation (.git/hooks/ doit pointer)
  Run: `ls -la .git/hooks/pre-commit .git/hooks/commit-msg 2>/dev/null`
- [ ] Step 4 : Verifier parity MD5 (sources versioned vs installs)
  Run: `md5sum scripts/git-hooks/pre-commit .git/hooks/pre-commit 2>/dev/null`
  Run: `md5sum scripts/git-hooks/commit-msg .git/hooks/commit-msg 2>/dev/null`

### Task S6.4 : Audit CI/CD chain end-to-end

- [ ] Step 1 : Read `.github/workflows/ci.yml` ligne par ligne
- [ ] Step 2 : Read `.github/workflows/supabase-ping.yml` ligne par ligne
- [ ] Step 3 : Verifier dernieres runs
  Run: `gh run list --limit 5`
- [ ] Step 4 : Verifier que ci.yml execute build + tsc + tests
- [ ] Step 5 : Verifier que supabase-ping.yml a un cron + fait un curl HTTP

### Task S6.5 : Audit deploy chain (Vercel)

- [ ] Step 1 : Read `modules/app/vercel.json` si existe
  Run: `cat modules/app/vercel.json 2>/dev/null`
- [ ] Step 2 : Verifier que Vercel deploy depuis main (rappel : on est sur audit-massif-cycle3 donc Vercel ne deploie pas pendant l'audit)
- [ ] Step 3 : URL prod : https://foundation-os.vercel.app/ — verifier accessible
  Run: `curl -sI https://foundation-os.vercel.app/ | head -5`

### Task S6.6 : Findings + livrable 06-orchestration-automation.md

### Task S6.7 : Post-session ritual

- [ ] Commit message : `audit(s06): orchestration + automation + hooks chain → 06-orchestration-automation.md`

---

# PHASE IV — Composants techniques (S7, S8, S9, S10)

## Session S7 — Agents (4) deep + tests reels (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/07-agents.md`
> os-architect, dev-agent, doc-agent, review-agent

### Task S7.1 : Pre-session ritual

### Task S7.2 : Lecture line-by-line de chaque agent

- [ ] Step 1 : Read `.claude/agents/os-architect.md` integralement
- [ ] Step 2 : Read `.claude/agents/dev-agent.md` integralement
- [ ] Step 3 : Read `.claude/agents/doc-agent.md` integralement
- [ ] Step 4 : Read `.claude/agents/review-agent.md` integralement

### Task S7.3 : Audit chaque agent (4 angles)

Pour CHAQUE agent (S7.3.1 = os-architect, S7.3.2 = dev, S7.3.3 = doc, S7.3.4 = review) :
- [ ] Frontmatter valide (name, description, model, tools)
- [ ] Description claire et trigger words distincts
- [ ] Workflow ou methodo defini
- [ ] Pas de bullshit (mots interdits, promesses non tenues)
- [ ] Cross-refs avec autres agents/commands/scripts coherentes

### Task S7.4 : Test reel d'invocation de chaque agent

> Note : on ne peut pas vraiment "invoquer" un agent en lecture seule, mais on peut verifier que sa description matche la table cortex et que ses tools sont coherents avec sa description.

- [ ] Step 1 : Pour chaque agent, simuler 3 cas test (inputs varies) et determiner si la description matche
- [ ] Step 2 : Verifier que les tools listed existent et sont coherents

### Task S7.5 : Findings + livrable 07-agents.md

### Task S7.6 : Post-session ritual

- [ ] Commit message : `audit(s07): agents (4) deep + tests → 07-agents.md`

---

## Session S8 — Commands (4) deep + tests reels (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/08-commands.md`
> session-start, session-end, new-project, sync

### Task S8.1 : Pre-session ritual

### Task S8.2 : Lecture line-by-line

- [ ] Step 1 : Read `.claude/commands/session-start.md`
- [ ] Step 2 : Read `.claude/commands/session-end.md`
- [ ] Step 3 : Read `.claude/commands/new-project.md`
- [ ] Step 4 : Read `.claude/commands/sync.md`

### Task S8.3 : Audit chaque command (4 angles)

Pour CHAQUE command :
- [ ] Workflow steps clairs et numerotes
- [ ] Pas de duplication avec un autre command
- [ ] Scripts/agents invoques existent et fonctionnent
- [ ] Output/format clair

### Task S8.4 : Test reel d'invocation

- [ ] Step 1 : `/session-start` deja teste au debut de cette conversation, comparer avec le spec
- [ ] Step 2 : `/session-end` : lire le workflow, ne pas l'invoquer maintenant (sera invoque a la fin de S8 elle-meme)
- [ ] Step 3 : `/sync` : run le script equivalent
  Run: `bash scripts/sync-check.sh`
- [ ] Step 4 : `/new-project` : verifier qu'il pointe vers module-scaffold.sh
  Run: `bash scripts/module-scaffold.sh --help`

### Task S8.5 : Findings + livrable 08-commands.md

### Task S8.6 : Post-session ritual

- [ ] Commit message : `audit(s08): commands (4) deep + tests → 08-commands.md`

---

## Session S9 — Scripts + hooks (9) deep + tests (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/09-scripts-hooks.md`
> 9 scripts : health-check, sync-check, ref-checker, module-scaffold, validate-void-glass, security-reminder, pre-commit, commit-msg + (potentiels autres)

### Task S9.1 : Pre-session ritual

### Task S9.2 : Lecture line-by-line de chaque script

- [ ] Step 1 : Read `scripts/health-check.sh`
- [ ] Step 2 : Read `scripts/sync-check.sh`
- [ ] Step 3 : Read `scripts/ref-checker.sh`
- [ ] Step 4 : Read `scripts/module-scaffold.sh`
- [ ] Step 5 : Read `scripts/hooks/validate-void-glass.sh`
- [ ] Step 6 : Read `scripts/hooks/security-reminder.py`
- [ ] Step 7 : Read `scripts/git-hooks/pre-commit`
- [ ] Step 8 : Read `scripts/git-hooks/commit-msg`

### Task S9.3 : Run chaque script avec 3-5 cas

Pour chaque script :
- [ ] Run avec `--help` (si supporte)
- [ ] Run sans arguments
- [ ] Run avec input valide
- [ ] Run avec input invalide / edge case
- [ ] Capturer output et exit codes

Exemples :
- `bash scripts/health-check.sh` (no args, full run)
- `bash scripts/sync-check.sh`
- `bash scripts/ref-checker.sh`
- `bash scripts/module-scaffold.sh --help`
- `bash scripts/module-scaffold.sh test-fake-name` (cas piege)
- `bash scripts/hooks/validate-void-glass.sh modules/app/src/App.tsx` (cas valide)

### Task S9.4 : Audit chaque script (4 angles)

Pour CHAQUE script :
- [ ] Pas de bug evident (variables non quotees, checks oublies)
- [ ] Idempotent ou clairement non-idempotent (documente)
- [ ] Exit codes coherents (0 = success, 1+ = error)
- [ ] Output utile (couleurs, sections, status final)

### Task S9.5 : Findings + livrable 09-scripts-hooks.md

### Task S9.6 : Post-session ritual

- [ ] Commit message : `audit(s09): scripts + hooks (8+) deep + tests → 09-scripts-hooks.md`

---

## Session S10 — Skills + BMAD verdict (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/10-skills.md`
> Skills internes Foundation OS (probably aucun) + externes (superpowers, OMC, gstack, BMAD) + verdict BMAD definitif (SUGG-10)

### Task S10.1 : Pre-session ritual

### Task S10.2 : Inventaire skills installes

- [ ] Step 1 : Lister les skills auto-listed dans le system reminder de cette conversation (deja vu : superpowers, OMC, gstack, claude-code-setup, claude-md-management, code-review, coderabbit, feature-dev, frontend-design, etc.)
- [ ] Step 2 : Identifier ceux REELLEMENT utilises par Foundation OS dans les workflows (vs ceux installes mais jamais invoques)
  Run: `grep -rn "/oh-my-claudecode\|/superpowers\|/coderabbit\|/feature-dev" .claude/ docs/ 2>/dev/null | head -20`

### Task S10.3 : Test 5-7 skills representatifs

- [ ] Step 1 : Verifier presence et structure de :
  - `superpowers:brainstorming` (utilise dans cette session)
  - `superpowers:writing-plans` (utilise apres)
  - `superpowers:executing-plans`
  - `oh-my-claudecode:omc-reference`
  - Eventuellement : `code-review:code-review`, `feature-dev:feature-dev`
- [ ] Step 2 : Pour chacun, verifier ou il est definie (path) et son trigger

### Task S10.4 : BMAD verdict definitif (SUGG-10)

- [ ] Step 1 : Read `_bmad/` structure (lister les dossiers/fichiers de haut niveau)
  Run: `ls -la _bmad/`
- [ ] Step 2 : Read `docs/tools-audit.md` qui documente la decision BMAD dormant
- [ ] Step 3 : Verifier la decision dans CONTEXT.md "BMAD garde 2026-04-07"
- [ ] Step 4 : Verdict definitif : reste dormant / archiver / re-activer ? Justification.

### Task S10.5 : Findings + livrable 10-skills.md

### Task S10.6 : Post-session ritual

- [ ] Commit message : `audit(s10): skills + BMAD verdict definitif → 10-skills.md`

---

# PHASE V — Comm / Securite / Memoire (S11, S12)

## Session S11 — Communication + securite (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/11-comm-securite.md`

### Task S11.1 : Pre-session ritual

### Task S11.2 : Audit communication

- [ ] Step 1 : Communication agents → Kevin : verifier que les agents Foundation OS ont un format de sortie clair (rapport court)
  - Read agent files .claude/agents/*.md
  - Identifier "format de sortie" pour chacun
- [ ] Step 2 : Communication moi → Kevin : ce sont les conventions Foundation OS (zero bullshit, rapport court, pas de TERMINE sans preuve)
  - Cross-ref avec CLAUDE.md imperatifs
- [ ] Step 3 : Communication entre agents : delegations (ex: dev-agent → review-agent apres une grosse modif)
  - Identifier dans les fichiers agents
- [ ] Step 4 : Communication automated (commits, hooks, CI) : verifier formats
  - Conventional commits, output health-check, etc.

### Task S11.3 : Audit securite

- [ ] Step 1 : Read `scripts/hooks/security-reminder.py`
- [ ] Step 2 : Verifier .gitignore pour secrets
  Run: `cat .gitignore`
- [ ] Step 3 : Chercher fichiers sensibles tracked par erreur
  Run: `git ls-files | grep -iE 'secret|password|credential|\.env$' | head -20`
- [ ] Step 4 : Verifier qu'il n'y a pas de cle hardcodee dans le code
  Run: `grep -rn "sk_\|pk_\|api_key\|API_KEY" modules/app/src 2>/dev/null | head -20`
- [ ] Step 5 : Verifier RLS Supabase (Row Level Security)
  Run: `grep -rn "RLS\|row level\|policy" supabase/ 2>/dev/null | head -20`

### Task S11.4 : Findings + livrable 11-comm-securite.md

### Task S11.5 : Post-session ritual

- [ ] Commit message : `audit(s11): communication + securite → 11-comm-securite.md`

---

## Session S12 — Memoire (4 tiers) + anti-compactage (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/12-memory-anti-compactage.md`
> SUGG-11 memory tier audit (reel vs theorie)

### Task S12.1 : Pre-session ritual

### Task S12.2 : Audit 4 tiers memoire

- [ ] Step 1 : Tier 1 — Session (volatile, conversation Claude)
  - Verifier que rien n'est sauve dans le tier session par erreur
- [ ] Step 2 : Tier 2 — Contexte (CONTEXT.md)
  - Read CONTEXT.md, verifier que c'est l'unique source de verite "live"
  - Verifier que les info ne sont PAS dupliquees ailleurs
- [ ] Step 3 : Tier 3 — Reference (docs/)
  - Read docs/index.md
  - Verifier que docs/ contient les references stables (architecture, design system, specs, plans, decisions-log, manifeste)
  - Verifier zero duplication avec CONTEXT.md
- [ ] Step 4 : Tier 4 — Auto-memory (Claude natif)
  - Read MEMORY.md
  - Read chaque fichier référencé (user_langue_francais, project_structure, etc.)
  - Verifier qu'ils sont a jour et utiles

### Task S12.3 : Audit anti-compactage

- [ ] Step 1 : Verifier la procedure de reprise dans `docs/plans/2026-04-07-audit-massif-final.md` section 4 — est-elle complete ?
- [ ] Step 2 : Tester mentalement : "si je perds le contexte conversation maintenant, peut-on reprendre via les fichiers seuls ?"
- [ ] Step 3 : Verifier que CONTEXT.md a une section "prochaine action" claire
- [ ] Step 4 : Verifier les commits messages factuels (pas vagues)
- [ ] Step 5 : Identifier failure modes (ce qui pourrait casser la reprise)

### Task S12.4 : Audit doublons cross-files

- [ ] Step 1 : Identifier info dupliquee entre CONTEXT.md / docs/core/* / .omc/project-memory.json / MEMORY.md
- [ ] Step 2 : Pour chaque doublon : verdict (acceptable / a fixer)

### Task S12.5 : Findings + livrable 12-memory-anti-compactage.md

### Task S12.6 : Post-session ritual

- [ ] Commit message : `audit(s12): memoire (4 tiers) + anti-compactage → 12-memory-anti-compactage.md`

---

# PHASE VI — Module App Builder (S13)

## Session S13 — Audit modules/app complet (mode MIX)

> Mode : MIX | Livrable : `.archive/audit-massif/13-module-app.md`
> Sub-agent OK pour lecture isolee, MOI pour logique mutations/auth/db

### Task S13.1 : Pre-session ritual

### Task S13.2 : Sub-agent — lecture forms/ et Commander/

- [ ] Step 1 : Lancer 1 sub-agent Explore avec brief :
```
[OBJECTIF]
Lire modules/app/src/components/forms/* et modules/app/src/components/Commander/*
et signaler : code mort, complexite > 50 lignes par fonction, anti-patterns React
(useEffect deps manquantes, props drilling profond, state non synchronise),
duplication entre composants similaires.

[FICHIERS A REGARDER]
modules/app/src/components/forms/*.tsx
modules/app/src/components/Commander/*.tsx

[CONTRAINTES]
- Ne pas modifier
- Pas hors de ces dossiers
- Source line:file pour chaque finding
- Pas de hallucination

[FORMAT DE SORTIE]
Tableau MD : finding | file:line | severite (P1/P2/P3) | preuve
```

### Task S13.3 : MOI — audit logique transversale

- [ ] Step 1 : Read modules/app/src/lib/AuthContext.tsx integralement
- [ ] Step 2 : Read modules/app/src/lib/mutations.ts integralement
- [ ] Step 3 : Read modules/app/src/lib/useCommander.ts integralement
- [ ] Step 4 : Read modules/app/src/lib/supabase.ts
- [ ] Step 5 : Read modules/app/src/lib/database.types.ts
- [ ] Step 6 : Read modules/app/src/App.tsx (router)
- [ ] Step 7 : Read modules/app/src/main.tsx (entry)

### Task S13.4 : Audit DB schema + RLS + types coherence

- [ ] Step 1 : Lister supabase/migrations
  Run: `ls -la supabase/migrations/`
- [ ] Step 2 : Read chaque migration (capturer schema reel)
- [ ] Step 3 : Cross-ref avec database.types.ts (genere) — coherence ?
- [ ] Step 4 : Verifier RLS pour chaque table

### Task S13.5 : Audit tests modules/app

- [ ] Step 1 : Read chaque fichier dans modules/app/src/test/
- [ ] Step 2 : Identifier ce qui est teste vs ce qui ne l'est pas (gap analysis)

### Task S13.6 : Consolidation findings (sub-agent + MOI)

- [ ] Step 1 : Recevoir output sub-agent
- [ ] Step 2 : Consolider avec mes findings logique transversale + DB + tests
- [ ] Step 3 : Categoriser P1/P2/P3

### Task S13.7 : Findings + livrable 13-module-app.md

### Task S13.8 : Post-session ritual

- [ ] Commit message : `audit(s13): module app builder complet → 13-module-app.md`

---

# PHASE VII — SUGG techniques (S14, S15)

## Session S14 — SUGG tech part 1 (perf + deps + types) (mode MIX)

> Mode : MIX | Livrable : `.archive/audit-massif/14-sugg-tech-1.md`
> SUGG-1 perf + SUGG-6 deps (sub-agents) + SUGG-7 types (MOI)

### Task S14.1 : Pre-session ritual

### Task S14.2 : Sub-agent #1 — SUGG-1 performance

- [ ] Step 1 : Brief :
```
[OBJECTIF]
Mesurer performance Foundation OS : latence hooks PreToolUse, temps de build,
taille bundle, vs seuils documentes.

[FICHIERS A REGARDER]
- scripts/hooks/validate-void-glass.sh (latence)
- scripts/hooks/security-reminder.py (latence)
- modules/app/package.json (build commands)
- modules/app/dist/ (apres build) pour bundle size

[CONTRAINTES]
- Run les commandes de mesure
- Capturer output reel (pas hallucinations)
- Comparer aux seuils CLAUDE.md (TSX < 700, bundle JS < 600KB, CSS < 40KB, build < 1500ms)

[COMMANDES A RUN]
- time bash scripts/hooks/validate-void-glass.sh modules/app/src/App.tsx
- cd modules/app && time npm run build
- cd modules/app/dist && du -sh .

[FORMAT DE SORTIE]
Tableau : metric | mesure | seuil | verdict (OK/WARN/KO)
```

### Task S14.3 : Sub-agent #2 — SUGG-6 deps

- [ ] Step 1 : Brief :
```
[OBJECTIF]
Audit dependencies modules/app : npm audit (vulnerabilites), packages outdated,
deps non utilisees.

[FICHIERS A REGARDER]
- modules/app/package.json
- modules/app/package-lock.json

[COMMANDES A RUN]
- cd modules/app && npm audit
- cd modules/app && npm outdated || true
- cd modules/app && npx depcheck || true

[FORMAT DE SORTIE]
3 sections : vulnerabilites, outdated, unused. Tableaux avec severite.
```

### Task S14.4 : MOI — SUGG-7 type safety

- [ ] Step 1 : Run tsc strict
  Run: `cd modules/app && npx tsc --noEmit --strict 2>&1 | head -50`
- [ ] Step 2 : Chercher abus de `any`
  Run: `grep -rn ": any\|as any" modules/app/src 2>/dev/null | head -20`
- [ ] Step 3 : Chercher type assertions douteuses
  Run: `grep -rn "as unknown as\|as never" modules/app/src 2>/dev/null | head -20`
- [ ] Step 4 : Verifier strict mode dans tsconfig
  Run: `cat modules/app/tsconfig.json | head -30`

### Task S14.5 : Consolidation + livrable 14-sugg-tech-1.md

- [ ] Step 1 : Recevoir outputs sub-agents #1 et #2
- [ ] Step 2 : Consolider avec MOI (type safety)
- [ ] Step 3 : Ecrire livrable

### Task S14.6 : Post-session ritual

- [ ] Commit message : `audit(s14): SUGG tech 1 (perf + deps + types) → 14-sugg-tech-1.md`

---

## Session S15 — SUGG tech part 2 (coverage + ci/cd + db + naming) (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/15-sugg-tech-2.md`
> SUGG-3 coverage + SUGG-4 ci/cd + SUGG-5 db + SUGG-8 naming

### Task S15.1 : Pre-session ritual

### Task S15.2 : SUGG-3 coverage gap analysis

- [ ] Step 1 : Run vitest avec coverage
  Run: `cd modules/app && npx vitest run --coverage 2>&1 | tail -30`
- [ ] Step 2 : Identifier les fichiers/fonctions sans coverage
- [ ] Step 3 : Cross-ref avec criticite (auth, mutations, routing = critique)

### Task S15.3 : SUGG-4 CI/CD pipeline review approfondi

- [ ] Step 1 : Re-read .github/workflows/ci.yml en detail (deja read en S6 mais audit different)
- [ ] Step 2 : Identifier failure modes (ex: cron silencieux, deploy obsolete, push manque)
- [ ] Step 3 : Cross-ref avec l'incident decouvert Cycle 1 (21 commits non pushed)
- [ ] Step 4 : Proposer mitigations

### Task S15.4 : SUGG-5 DB schema audit Supabase

- [ ] Step 1 : Lister tables Supabase via supabase/migrations
  Run: `ls -la supabase/migrations/ && cat supabase/migrations/*.sql 2>/dev/null | head -100`
- [ ] Step 2 : Cross-ref avec modules/app/src/lib/database.types.ts (drift ?)
- [ ] Step 3 : Verifier indexes
- [ ] Step 4 : Verifier RLS rules

### Task S15.5 : SUGG-8 naming conventions coherence

- [ ] Step 1 : Inventaire conventions par categorie
  - Files MD : kebab-case ?
  - Files TSX : PascalCase ?
  - Files TS : camelCase / kebab-case ?
  - Scripts shell : kebab-case ?
  - Variables env : SNAKE_UPPER ?
- [ ] Step 2 : Identifier les violations
  Run: `find modules/app/src -name '*[A-Z]*.ts' -not -name '*[A-Z]*.tsx' 2>/dev/null | head -20`
- [ ] Step 3 : Identifier les coherences vs incoherences

### Task S15.6 : Findings + livrable 15-sugg-tech-2.md

### Task S15.7 : Post-session ritual

- [ ] Commit message : `audit(s15): SUGG tech 2 (coverage + ci/cd + db + naming) → 15-sugg-tech-2.md`

---

# PHASE VIII — SUGG strategiques (S16)

## Session S16 — SUGG strategic (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/16-sugg-strategic.md`
> SUGG-2 doc cognitif + SUGG-9 anti-bullshit + SUGG-12 multi-modules
> (SUGG-10 BMAD verdict deja fait en S10, SUGG-11 memory tier deja en S12)

### Task S16.1 : Pre-session ritual

### Task S16.2 : SUGG-2 documentation cognitif test

- [ ] Step 1 : Test mental "Kevin part 6 mois et revient" : si je n'ai que docs/, peux-je reprendre Foundation OS ?
- [ ] Step 2 : Lister les questions auxquelles docs/ ne repond pas
- [ ] Step 3 : Identifier les manques de doc critiques

### Task S16.3 : SUGG-9 anti-bullshit historique

- [ ] Step 1 : Read CONTEXT.md "Dernieres sessions" derniere page entier
- [ ] Step 2 : Pour chaque promesse/metrique (ex: "build 814ms", "vitest 19/19", "13 fixes appliques") : verifier que c'est vrai actuellement
  Run: `bash scripts/health-check.sh`
- [ ] Step 3 : Read docs/decisions-log.md
- [ ] Step 4 : Pour chaque decision archivee : verifier qu'elle est encore valide

### Task S16.4 : SUGG-12 strategie multi-modules futurs

- [ ] Step 1 : Imaginer 4 modules co-existants (App + Finance + Sante + Trading)
- [ ] Step 2 : Identifier ce qui doit etre partage : auth, db, deploy, design system, navigation, layouts
- [ ] Step 3 : Identifier ce qui doit etre isole : business logic, components specifiques, tables DB specifiques
- [ ] Step 4 : Proposer architecture cible (peut etre dans une section "propositions")

### Task S16.5 : Findings + livrable 16-sugg-strategic.md

### Task S16.6 : Post-session ritual

- [ ] Commit message : `audit(s16): SUGG strategic (doc cognitif + anti-bullshit + multi-modules) → 16-sugg-strategic.md`

---

# PHASE IX — Recherche externe DEEP (S17)

## Session S17 — External research (mode SUB)

> Mode : SUB | Livrable : `.archive/audit-massif/17-external-research.md`
> 3 sub-agents en parallele, MOI consolide

### Task S17.1 : Pre-session ritual

### Task S17.2 : Sub-agent #1 — Best practices OS personnels IA-driven

- [ ] Step 1 : Brief (general-purpose agent avec WebSearch/WebFetch) :
```
[OBJECTIF]
Trouver 3-5 setups OS personnels AI-driven publics (Github / blogs) qui
ressemblent a Foundation OS (multi-modules, agents IA, automation).
Comparer brievement leur architecture vs Foundation OS.

[SOURCES A EXPLORER]
- Github : recherche "personal OS", "AI-driven workspace", "claude code workflow"
- Blogs : Andy Matuschak, Karpathy, communautes Anthropic discord/forum
- Pas de simulation : trouver des sources reelles, citer URLs

[CONTRAINTES]
- URLs verifiees (pas de hallucination)
- Pas plus de 10 minutes de search
- Si rien trouve : dire "incertain" ou "rien de pertinent trouve"

[CONTEXTE FOUNDATION OS]
- Multi-modules (App / Finance prevu / Sante prevu)
- 4 agents Claude (os-architect, dev-agent, doc-agent, review-agent)
- 4 commands Foundation OS
- Stack Vite/React/TS/Tailwind/Supabase
- OMC + Superpowers + Foundation OS custom

[FORMAT DE SORTIE]
3-5 setups, chacun avec : nom + URL + 3 bullets resume + 3 bullets comparaison
avec Foundation OS (forces / faiblesses relatives).
```

### Task S17.3 : Sub-agent #2 — Marketplace MCP + plugins OMC v4.11.0+

- [ ] Step 1 : Brief :
```
[OBJECTIF]
Lister les nouveaux MCP servers et plugins OMC (oh-my-claudecode) parus
recemment (2026), avec une evaluation de leur pertinence pour Foundation OS.

[SOURCES A EXPLORER]
- https://github.com/anthropics (MCP marketplace)
- OMC repo : https://github.com/oh-my-claudecode (verifier le repo exact)
- Anthropic docs MCP
- OMC v4.11.0 changelog (vs v4.10.1 actuel)

[CONTRAINTES]
- URLs verifiees
- Pertinence concrete (pas une liste exhaustive sans filtre)
- Eviter les plugins deja installes

[CONTEXTE FOUNDATION OS]
- OMC v4.10.1 actuel
- Skills installes : superpowers, OMC built-in (omc-reference, etc.)
- MCP installes : Asana, Notion, Figma, Monday, ClickUp, Computer Use, Context7
- Manque potentiel : recherche academique, observabilite, accessibility

[FORMAT DE SORTIE]
2 sections : MCP nouveaux pertinents (5 max) + Plugins OMC nouveaux pertinents
(5 max). Chaque entry : nom + URL + 1 paragraphe pertinence Foundation OS.
```

### Task S17.4 : Sub-agent #3 — Frameworks emergents AI-driven dev

- [ ] Step 1 : Brief :
```
[OBJECTIF]
Identifier 3-5 frameworks ou methodologies emergents 2026 pour le dev assiste
par IA (au-dela de Claude Code basic). Pertinence pour Foundation OS.

[SOURCES A EXPLORER]
- Anthropic : agent SDK, claude api recent
- Github trending : AI dev tools 2026
- Communautes : claude.ai forums, OMC discord, superpowers community

[CONTRAINTES]
- Recent (2026 si possible, sinon Q4 2025)
- Verifies (URLs, pas hallucines)
- Pertinence concrete

[CONTEXTE FOUNDATION OS]
- Solo dev, IA-driven
- Workflow brainstorm/plan/execute/verify
- Stack TS frontend, bash scripts, agents Claude
- Recherche : automation, orchestration, anti-compactage, multi-modules

[FORMAT DE SORTIE]
3-5 frameworks/methodes : nom + URL + 2 bullets resume + verdict pertinence
Foundation OS (high/medium/low) + recommendation import (oui/non + comment).
```

### Task S17.5 : MOI consolide les 3 outputs

- [ ] Step 1 : Recevoir les 3 outputs sub-agents
- [ ] Step 2 : Cross-ref avec Foundation OS actuel
- [ ] Step 3 : Identifier 5-10 ameliorations concretes a importer
- [ ] Step 4 : Identifier 0-3 ameliorations a ne PAS importer (avec justification)

### Task S17.6 : Findings + livrable 17-external-research.md

### Task S17.7 : Post-session ritual

- [ ] Commit message : `audit(s17): external research deep (best practices + outils + frameworks) → 17-external-research.md`

---

# PHASE X — Cross-check / verification croisee (S18)

## Session S18 — Cross-check independant (mode SUB)

> Mode : SUB | Livrable : `.archive/audit-massif/18-cross-check.md`
> 3 sub-agents (verifier/critic/review-agent) sur findings phases 2-17

### Task S18.1 : Pre-session ritual

### Task S18.2 : Compiler la liste de tous les findings phases 2-17

- [ ] Step 1 : Read tous les livrables S2-S17 et extraire les findings
- [ ] Step 2 : Categoriser par type (P1/P2/P3 et theme)
- [ ] Step 3 : Identifier 10-20 findings a verifier en priorite (focus sur P1 + ambiguous)

### Task S18.3 : Sub-agent #1 — verifier sur findings P1 critiques

- [ ] Step 1 : Brief (general-purpose ou verifier-style) :
```
[OBJECTIF]
Verifier independamment 5-10 findings P1 critiques de l'audit Cycle 3.
Pour chaque finding, confirmer ou infirmer avec preuve concrete.

[FINDINGS A VERIFIER]
[Liste compilee en S18.2 — top 5-10 P1]

[METHODOLOGIE]
- Lire le fichier source (file:line)
- Verifier la claim
- Verdict : CONFIRME / INVALIDE / INCOMPLET
- Si INCOMPLET : preciser ce qui manque

[CONTRAINTES]
- Pas de modification
- Source obligatoire pour chaque verdict
- "incertain" si pas sur

[FORMAT DE SORTIE]
Tableau : finding_id | claim originale | verdict | preuve | comment
```

### Task S18.4 : Sub-agent #2 — critic sur findings architecture

- [ ] Step 1 : Brief similaire mais focus sur les findings architecture / scalabilite / maintenabilite (S3, S4)
- [ ] Step 2 : Critique structuree : que rate ce finding ? est-il trop dur ? trop indulgent ?

### Task S18.5 : Sub-agent #3 — review-agent sur fixes proposes

- [ ] Step 1 : Brief :
```
[OBJECTIF]
Pour chaque proposition de fix listee dans les findings (toutes sessions),
evaluer : est-ce reellement faisable sans regression ? est-ce dans le scope
"refonte moderee" ? est-ce prioritise correctement ?

[FIXES PROPOSES A REVOIR]
[Liste compilee en S18.2]

[FORMAT DE SORTIE]
Tableau : fix_id | description | faisabilite (high/med/low) | risque regression
| scope (in/out) | priorite suggeree (P1/P2/P3) | comment
```

### Task S18.6 : MOI categorise final

- [ ] Step 1 : Recevoir 3 outputs
- [ ] Step 2 : Categoriser tous les findings : confirmes / invalides / incomplets / a re-explorer
- [ ] Step 3 : Identifier les findings invalides a sortir de la roadmap S19
- [ ] Step 4 : Identifier les findings incomplets a creuser en S19

### Task S18.7 : Findings + livrable 18-cross-check.md

### Task S18.8 : Post-session ritual

- [ ] Commit message : `audit(s18): cross-check independant findings phases 2-17 → 18-cross-check.md`

---

# PHASE XI — Synthese (S19) — GATE G1

## Session S19 — Synthese transversale + roadmap fixes (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/19-synthese-roadmap.md`
> LE document maitre. **GATE G1 obligatoire avant S20.**

### Task S19.1 : Pre-session ritual

### Task S19.2 : Read tous les livrables S1-S18

- [ ] Step 1 : Read sequentiel .archive/audit-massif/01-*.md a 18-*.md
- [ ] Step 2 : Capturer tous les findings categorise (confirmes apres cross-check S18)

### Task S19.3 : Consolidation findings P1/P2/P3

- [ ] Step 1 : Tableau master des findings (~30-100 findings probable)
- [ ] Step 2 : Categoriser par theme (architecture, composants, securite, doc, perf, tests, etc.)
- [ ] Step 3 : Categoriser par severite finale (P1 critique, P2 important, P3 cosmetique)
- [ ] Step 4 : Categoriser par effort (S/M/L)
- [ ] Step 5 : Identifier les fixes "safe" (zero risque) vs "lourds" (necessite review)

### Task S19.4 : Propositions architecture / nomenclature

- [ ] Step 1 : Synthese des propositions disseminees dans S1-S18
- [ ] Step 2 : Selectionner les "refonte moderee" (Q2 du brainstorming)
- [ ] Step 3 : Argumenter chacune (problem / solution / impact / risque)
- [ ] Step 4 : Marquer celles qui doivent passer par Kevin pour decision

### Task S19.5 : Roadmap d'execution fixes

- [ ] Step 1 : Proposer batch P1 critiques (ce qui ira en S20)
- [ ] Step 2 : Proposer batch P2 importants (ce qui ira en S21)
- [ ] Step 3 : Proposer batch P3 cosmetiques (ce qui ira en S22)
- [ ] Step 4 : Pour chaque fix : quoi modifier + comment verifier + test apres
- [ ] Step 5 : Estimer effort total

### Task S19.6 : Ecrire livrable 19-synthese-roadmap.md (LE document maitre)

- [ ] Step 1 : Sections : (1) Vue d'ensemble executive, (2) Findings consolides P1/P2/P3, (3) Propositions architecture, (4) Roadmap fixes (3 batches), (5) Ce qui ne sera pas fixe et pourquoi, (6) Demande validation Kevin (Gate G1)

### Task S19.7 : Post-session ritual

- [ ] Commit message : `audit(s19): synthese transversale + roadmap fixes (GATE G1) → 19-synthese-roadmap.md`

### Task S19.8 : GATE G1 — Demande validation Kevin

- [ ] Step 1 : Annoncer a Kevin :
  "S19 done. Roadmap fixes ecrite dans `19-synthese-roadmap.md`.
   **Gate G1 obligatoire** : tu dois reviewer la roadmap (3 batches P1/P2/P3) +
   les propositions architecture avant que je commence S20 (application fixes).
   Je peux retirer / re-prioriser / ajuster scope si tu veux. STOP en attente."
- [ ] Step 2 : ATTENDRE validation explicit Kevin avant S20
- [ ] Step 3 : Si Kevin demande modifs : ajuster `19-synthese-roadmap.md`, re-commit, re-demander G1

---

# PHASE XII — Application fixes (S20, S21, S22) — apres Gate G1

## Session S20 — Application batch P1 critiques (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/20-fixes-p1-applied.md`
> Application + verification zero regression apres CHAQUE fix

### Task S20.1 : Pre-session ritual + verifier Gate G1 valide

- [ ] Step 1 : Confirmer que Kevin a valide la roadmap S19 (Gate G1)
- [ ] Step 2 : Si non → STOP, ne pas executer S20

### Task S20.2 : Pour CHAQUE fix P1 (boucle)

> Note : le contenu exact des fixes sera defini en S19 selon les findings reels.
> Cette task est une boucle a appliquer pour chaque fix P1 individuellement.

Pour CHAQUE fix dans la liste batch P1 :

- [ ] Step 1 : Read le contexte du fix (fichier concerne)
- [ ] Step 2 : Appliquer le fix (Edit ou Write selon le cas)
- [ ] Step 3 : Verification immediate
  Run: `bash scripts/health-check.sh`
  Expected: `Verdict : SAIN` (toujours)
- [ ] Step 4 : Pour fixes touchant des refs/sync : verifications additionnelles
  Run: `bash scripts/sync-check.sh && bash scripts/ref-checker.sh`
- [ ] Step 5 : Pour fixes touchant le module app : tests
  Run: `cd modules/app && npm test -- --run && npm run build`
  Expected: 19/19 passed, build success
- [ ] Step 6 : Si REGRESSION detectee : REVERT IMMEDIAT
  Run: `git checkout -- <file_modified>`
  Then: documenter dans le livrable
- [ ] Step 7 : Si OK : continuer au prochain fix
- [ ] Step 8 : Capturer le before/after dans le livrable

### Task S20.3 : Verification finale apres TOUS les fixes P1

- [ ] Step 1 : Run health-check + sync-check + ref-checker + vitest + build complet
- [ ] Step 2 : Comparer avec baseline 00-preflight.md (zero regression)

### Task S20.4 : Ecrire livrable 20-fixes-p1-applied.md

- [ ] Step 1 : Liste des fixes appliques (avec before/after)
- [ ] Step 2 : Liste des fixes ratees / revertes (avec raison)
- [ ] Step 3 : Verification finale captures
- [ ] Step 4 : Bilan : N fixes appliques sur M proposes

### Task S20.5 : Post-session ritual

- [ ] Commit message : `audit(s20): apply fixes batch P1 (X critiques) → 20-fixes-p1-applied.md`

---

## Session S21 — Application batch P2 importants (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/21-fixes-p2-applied.md`
> Memes steps que S20 mais pour batch P2

### Task S21.1 : Pre-session ritual + verifier S20 SAINE

### Task S21.2 : Pour chaque fix P2 (meme boucle que S20.2)

### Task S21.3 : Verification finale apres TOUS les fixes P2

### Task S21.4 : Ecrire livrable 21-fixes-p2-applied.md

### Task S21.5 : Post-session ritual

- [ ] Commit message : `audit(s21): apply fixes batch P2 (X importants) → 21-fixes-p2-applied.md`

---

## Session S22 — Application batch P3 cosmetiques (mode MOI) — GATE G2

> Mode : MOI | Livrable : `.archive/audit-massif/22-fixes-p3-applied.md`

### Task S22.1 : Pre-session ritual + verifier S21 SAINE

### Task S22.2 : Pour chaque fix P3 (meme boucle que S20.2)

### Task S22.3 : Verification finale ALL fixes P1+P2+P3

- [ ] Step 1 : Run health/sync/refs/vitest/build/tsc
- [ ] Step 2 : Comparer avec baseline 00-preflight.md
- [ ] Step 3 : Calculer delta (combien de findings fix, combien restant)

### Task S22.4 : Ecrire livrable 22-fixes-p3-applied.md

### Task S22.5 : Post-session ritual

- [ ] Commit message : `audit(s22): apply fixes batch P3 (X cosmetiques) → 22-fixes-p3-applied.md (GATE G2)`

### Task S22.6 : GATE G2 — Demande validation Kevin

- [ ] Step 1 : Annoncer :
  "S22 done. Tous les fixes P1+P2+P3 appliques.
   Verification finale : zero regression confirmee.
   **Gate G2 obligatoire** : tu valides que la baseline est saine et que je
   peux passer a S23 (rapport final + PR ready) ?
   STOP en attente."
- [ ] Step 2 : Attendre OK Kevin avant S23

---

# PHASE XIII — Verdict final (S23) — GATE G3

## Session S23 — Verification finale + rapport + PR (mode MOI)

> Mode : MOI | Livrable : `.archive/audit-massif/23-rapport-final.md`
> Re-run complet, comparaison baseline, PR audit-massif-cycle3 → main, GATE G3

### Task S23.1 : Pre-session ritual + verifier Gate G2 valide

### Task S23.2 : Verification end-to-end exhaustive

- [ ] Step 1 : Run health-check
  Run: `bash scripts/health-check.sh`
  Expected: SAIN
- [ ] Step 2 : Run sync-check
  Run: `bash scripts/sync-check.sh`
  Expected: 6/6 PASS
- [ ] Step 3 : Run ref-checker
  Run: `bash scripts/ref-checker.sh`
  Expected: 0 broken (40+ scannes)
- [ ] Step 4 : Run vitest + build + tsc
  Run: `cd modules/app && npm test -- --run && npm run build && npx tsc --noEmit`
  Expected: 19/19 passed, build success, 0 TS errors
- [ ] Step 5 : Run validate-void-glass
  Run: `find modules/app/src -name '*.tsx' -exec bash scripts/hooks/validate-void-glass.sh {} \;`
- [ ] Step 6 : Capturer toutes les metrics actuelles

### Task S23.3 : Comparaison baseline pre/post

- [ ] Step 1 : Read 00-preflight.md (baseline)
- [ ] Step 2 : Tableau comparatif : baseline vs final, metric par metric
- [ ] Step 3 : Confirmer ZERO regression (toutes les metrics ≥ baseline)

### Task S23.4 : Update CONTEXT.md complet

- [ ] Step 1 : Update CONTEXT.md "Dernieres sessions" : entree complete Cycle 3 done
- [ ] Step 2 : Update "Prochaine action" : Phase 5 Expansion (Finance / Sante / Trading)
- [ ] Step 3 : Update "App Builder Etat technique" si fixes ont change quelque chose
- [ ] Step 4 : Update "Decisions actives" : ajouter "Cycle 3 audit massif" decision
- [ ] Step 5 : Update "Outils installes" si nouveaux outils importes

### Task S23.5 : Update decisions-log.md

- [ ] Step 1 : Read docs/decisions-log.md
- [ ] Step 2 : Ajouter decisions Cycle 3 (architecture refonte, fixes appliques, propositions retenues/rejected)

### Task S23.6 : Ecrire le rapport final 23-rapport-final.md

- [ ] Step 1 : Sections : (1) Executive summary, (2) Methodologie 24 sessions, (3) Findings consolides 30-100, (4) Fixes appliques avec impact, (5) Propositions retenues/rejected, (6) Comparaison baseline pre/post (zero regression confirmee), (7) Recommendations futures (out-of-scope de cet audit), (8) Lecons apprises (meta), (9) Verdict final
- [ ] Step 2 : Format clair, executif, factuel, zero bullshit

### Task S23.7 : Verifier git state pour PR

- [ ] Step 1 : Verifier branche
  Run: `git branch --show-current`
  Expected: `audit-massif-cycle3`
- [ ] Step 2 : Verifier nombre de commits sur la branche
  Run: `git rev-list --count main..audit-massif-cycle3`
  Expected: 24+ commits (S0-S23)
- [ ] Step 3 : Verifier qu'on n'a rien push (la branche reste locale)
  Run: `git log --oneline main..audit-massif-cycle3 | head -30`

### Task S23.8 : Push la branche + creer PR via gh CLI

- [ ] Step 1 : Push la branche
  Run: `git push -u origin audit-massif-cycle3`
- [ ] Step 2 : Creer PR avec body detaille
  Run:
  ```bash
  gh pr create --base main --head audit-massif-cycle3 \
    --title "Cycle 3 — Audit Massif Final (24 sessions, zero regression)" \
    --body "$(cat <<'EOF'
## Summary

Audit massif final Foundation OS execute en 24 sessions (S0-S23) selon spec
`docs/plans/2026-04-07-audit-massif-final.md`. Brainstorming initial
8 questions + Approche D Maximum revisee + sub-agents restreints.

## Resultats

- N findings consolides (X confirmes apres cross-check)
- Y fixes appliques en 3 batches (P1/P2/P3)
- Z propositions architecture retenues
- Zero regression confirmee (comparaison baseline pre/post)

## Verification

- health-check : SAIN
- sync-check : 6/6 PASS
- ref-checker : 0 broken
- vitest : 19/19 (ou plus)
- build : success
- tsc : 0 errors

## Test plan

- [ ] Reviewer le rapport final `.archive/audit-massif/23-rapport-final.md`
- [ ] Verifier les fixes appliques (commits S20-S22)
- [ ] Run health-check + tests + build localement
- [ ] Merger si OK

## Rapport detaille

Voir `.archive/audit-massif/23-rapport-final.md` (LE document maitre du rapport
final) ainsi que les 23 livrables sessions dans `.archive/audit-massif/`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
  ```
- [ ] Step 3 : Capturer URL PR
  Run: `gh pr view --json url -q .url`

### Task S23.9 : Post-session ritual

- [ ] Commit message : `audit(s23): rapport final + PR ready (GATE G3) → 23-rapport-final.md`

### Task S23.10 : GATE G3 — Demande Kevin de merger

- [ ] Step 1 : Annoncer :
  "S23 done. Audit massif final complete. PR cree : <URL>.
   **Gate G3** : tu reviewes la PR et tu merges TOI-MEME `audit-massif-cycle3 → main`.
   Pas de merge automatique. Cycle 3 termine apres ton merge."

---

# Self-Review (a executer apres ecriture du plan)

## 1. Spec coverage

Comparer ce plan avec le spec `docs/plans/2026-04-07-audit-massif-final.md` :

- [x] Q1 (audit + execution) → couvert par S20-S22
- [x] Q2 (refonte moderee) → couvert par S19 propositions architecture
- [x] Q3 (recherche externe deep) → couvert par S17 (3 sub-agents)
- [x] Q4 (branche dediee + PR) → couvert par S0 (branche+tag) et S23 (PR)
- [x] Q5 (12 SUGG-X) → couverts par S10 (BMAD), S12 (memory tier), S14-S16 (autres SUGG)
- [x] Q6 (granulaire 8-12+) → 24 sessions, granulaire OK
- [x] Q7 (lecture + tests fonctionnels) → tests fonctionnels dans S5, S6, S9, S20-S22
- [x] Q8 (Approche D Maximum) → 24 sessions S0-S23 cf vue d'ensemble
- [x] Sub-agents restreints → S1, S13, S14, S17, S18 uniquement (5 sessions)
- [x] Anti-compactage → pre-session ritual + post-session ritual + master file update
- [x] Gates Kevin (G1, G2, G3) → S19, S22, S23

## 2. Placeholder scan

- [x] Pas de "TBD", "TODO", "implement later" dans les steps
- [x] Pas de "Add appropriate error handling" (chaque action precise)
- [x] Pas de "Similar to Task N" (chaque session a ses propres steps)
- [x] Code blocks fournis pour les commandes
- Note : les fixes S20-S22 ne sont pas detailles avant S19 (normal, ils dependent des findings reels)

## 3. Type consistency

- [x] Naming sessions : S0-S23 partout
- [x] Naming livrables : 00-XX a 23-XX coherent
- [x] Mode [MOI/MIX/SUB] coherent partout
- [x] Gate G1/G2/G3 coherent

## Self-review verdict : OK

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-04-07-cycle3-implementation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — Je dispatch un fresh sub-agent par task, je review entre tasks, fast iteration. Inadapte ici car la regle Kevin impose que MOI execute les sessions (sub-agents seulement pour les 5 zones isolees).

**2. Inline Execution (recommended pour ce plan)** — Execute tasks dans cette session/futures sessions en utilisant superpowers:executing-plans, batch execution avec checkpoints. Plus aligne avec la contrainte sub-agents Kevin.

**Recommendation : Inline Execution** car la contrainte sub-agents (Kevin 2026-04-07) impose que MOI execute 19 sessions sur 24. Subagent-driven serait inadapte.

Apres validation Kevin, invoquer `superpowers:executing-plans` pour demarrer S0.
