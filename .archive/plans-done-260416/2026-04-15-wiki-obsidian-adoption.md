---
id: 2026-04-15-wiki-obsidian-adoption
title: 🪐 Adoption Wiki Obsidian (15-04-2026)
created: 2026-04-15
status: planning
phases_total: 12
estimated_duration: 9h
decision_ref: D-WIKI-01
---

# 🪐 Adoption Wiki Obsidian — Plan d'Implementation Foundation OS

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommande) ou `superpowers:executing-plans` pour executer ce plan phase-par-phase. Steps utilisent `- [ ]` pour tracking.

**Goal:** Integrer le plugin `claude-obsidian` (pattern Karpathy LLM Wiki) dans Foundation OS pour creer un knowledge layer persistant, cross-modules (trading, finance, sante, design, dev), visualisable dans Obsidian app, sans aucune regression sur l'OS existant.

**Architecture:** 5 tiers memoire avec scope strict sans doublon (conversation / CONTEXT.md / auto-memory / docs/ / wiki/). Couplage modules/ <-> wiki/domains/ via frontmatter `implementation:`. Hooks merges (drift-detector + hot cache). Auto-commit plugin DESACTIVE (remplace par `scripts/wiki-commit.sh` manuel). Vault Obsidian pre-scaffolde multi-domaines pour modules Phase 5 futurs.

**Tech Stack:** Claude Code Desktop + `claude-obsidian` plugin v1.4.1 + Obsidian app + Markdown + YAML frontmatter + wikilinks `[[file]]` + Git versionning + Foundation OS Core (Cortex + Communication + Monitor + Tools + Planner + Worktrees + **Knowledge nouveau Phase 7**).

---

## Context

### Pourquoi ce plan

Claude Code oublie tout entre sessions. Foundation OS a deja mitige ca via 4 tiers (CONTEXT.md, auto-memory 29 fichiers, docs/, conversation). Mais il manque :
1. Un **cache narratif** de la derniere session (500 mots lus en priorite au startup)
2. Un **knowledge layer transversal** pour accumuler sources externes (papers, articles, transcripts, PDFs) structures en Markdown avec wikilinks + graph view Obsidian
3. Un **systeme de cross-reference** entre code modules et knowledge (ex : `modules/trading/strategies/momentum.ts` ↔ `wiki/domains/trading/strategies/momentum.md` qui contient hypotheses + refs academic)

Ces manques deviennent critiques pour Phase 5 (Finance, Trading auto, Sante multi-agents) ou Kevin accumulera des centaines de sources externes.

### Intention Kevin consolidee

- **Ambition max** : Foundation OS devient OS de travail + second-brain knowledge unifie
- **Visualisable dans Obsidian app** (deja installee /Applications/Obsidian.app)
- **Pragmatique + fonctionnel + maintenable cross-sessions**
- **ZERO regression** sur systeme actuel (build 265ms, tests 19/19, health DEGRADED acceptable)
- **ZERO perte de contexte** pendant adoption (1-par-1 avec ASK pour migration auto-memory)
- **Anti-compactage** : plan ultra-detaille, 6 elements par phase, code complet, commandes exactes
- Skills documentes dans module Core Tools (`docs/core/tools.md` + `docs/core/tools/index.json`)
- Worktree dedie `wt/wiki-adoption-260415` (isolation)
- Cas d'usage futurs : conseil sante multi-agents, backtest trading auto, recherche scientifique documentaire

### Outcome vise

Apres execution :
1. Vault `wiki/` scaffolde avec 5 domaines (trading, finance, sante, design, dev) + 7 cross-domain
2. 10 skills `claude-obsidian` adoptes et documentes dans Core Tools
3. `hot.md` cache narratif operationnel (integre brief v11)
4. Couplage modules <-> wiki documente (regle d'or + test arbitral)
5. Hooks `claude-obsidian` integres proprement (auto-commit desactive)
6. 1 ingest reel teste (article Karpathy + page AgriciDaniel)
7. Obsidian app ouvre le vault avec graph view populate
8. Brief v11 enrichi (cadres HOT + WIKI)
9. Build/tests/health inchanges ou ameliores (zero regression)

---

## Findings (exploration pre-plan)

### Foundation OS existant (factuel, audite)

| Element | Etat |
|---------|------|
| `CONTEXT.md` | 134 L, spec `docs/core/communication.md` |
| `CLAUDE.md` | 173 L, imperatifs + automations + regles |
| `auto-memory/` | 29 fichiers (140 KB) + 2 `_deprecated/` + `MEMORY.md` index |
| `docs/core/` | 6 specs (cortex, communication, monitor, tools, planner, worktrees) |
| Hooks actifs | drift-detector (SessionStart), auto-archive-plans (SessionEnd), branch-name-check + commit-msg + security-reminder + validate-void-glass (pre-commit) |
| Scripts | 13 (health-check, drift-detector, docs-sync-check, ref-checker, worktree-*, auto-archive-plans, module-scaffold, sync-check, tool-register, session-lock) |
| Plans actifs | 0 (tous archives dans `.archive/plans-done-260415/`) |
| Worktrees | 3 (main + sleepy-ellis + suspicious-khayyam) |
| Health | DEGRADED (0 critical, 3 warn hors scope : Vitest DS illisible, CSS>40KB, drift branche legacy) |
| Branche actuelle | `claude/suspicious-khayyam` (worktree Desktop auto) |

### Repo claude-obsidian audite (via `gh api`)

- **1 279 stars**, derniere release v1.4.1, actif (push 2026-04-13)
- **10 skills** : wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown
- **4 commands** : /wiki, /save, /autoresearch, /canvas
- **4 hooks** : SessionStart (cat hot.md), PostCompact (re-cat), PostToolUse (auto-commit — **A DESACTIVER**), Stop (prompt update hot.md)
- **5 templates** : concept, source, entity, comparison, question
- **Structure vault canonique** : hot.md, index.md, log.md, overview.md, sources/, entities/, concepts/, domains/, comparisons/, questions/, meta/
- **.raw/** = source archive (immutable)
- **Delta tracking** : `.raw/.manifest.json` (hash-based) evite re-ingest

### Obsidian app check

- Installee `/Applications/Obsidian.app` (verifie 2026-04-15)
- Pas de vault Foundation OS ouvert actuellement

### Conflits identifies a resoudre

| Conflit | Resolution |
|---------|------------|
| PostToolUse auto-commit casse regle "git commit = Kevin valide" | **DESACTIVER**, remplacer par `scripts/wiki-commit.sh` propose dans `/session-end` |
| SessionStart hook Foundation (drift-detector) vs claude-obsidian (cat hot.md) | **CHAINER** via wrapper `scripts/hooks/session-start-wiki.sh` qui execute les 2 |
| CONTEXT.md vs wiki/index.md potentiellement doublon | **DELIMITATION** : CONTEXT.md = etat operationnel, wiki/index.md = catalogue knowledge. Scopes stricts. |
| auto-memory vs wiki/concepts potentiellement doublon | **DELIMITATION** : auto-memory = profile Kevin + feedback comportement, wiki/ = knowledge atemporel externe |
| docs/decisions-log vs wiki/comparisons | **DELIMITATION** : decisions-log = decisions techniques projet (D-XX-NN), comparisons = analyses neutres knowledge |
| Bug dans scaffold si `/wiki` est run directement sans structure Foundation | **NE PAS UTILISER** `/wiki` auto — scaffold manuel via `mkdir` pour controle precis (Phase 2) |

---

## Architecture cible (5 tiers memoire + couplage modules)

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1 · CONVERSATION Claude (volatile, 1 session)         │
└─────────────────────────────────────────────────────────────┘
                         ↓ persiste vers
┌─────────────────────────────────────────────────────────────┐
│  TIER 2 · CONTEXT.md (ETAT OPERATIONNEL projet)             │
│  Modules, sessions recentes, cap, decisions techniques,     │
│  metriques, en attente Kevin. Spec communication.md.        │
│  → INCHANGE                                                  │
└─────────────────────────────────────────────────────────────┘
                         +
┌─────────────────────────────────────────────────────────────┐
│  TIER 3 · auto-memory (PROFILE KEVIN + COMPORTEMENT CLAUDE) │
│  ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/  │
│  user_*, feedback_*, project_* (seulement etat projet WIP). │
│  → ALLEGE (Phase 5 : migration selective vers wiki/)        │
└─────────────────────────────────────────────────────────────┘
                         +
┌─────────────────────────────────────────────────────────────┐
│  TIER 4 · docs/ (REFERENCE TECHNIQUE projet)                │
│  Specs Core OS (cortex, communication, monitor, tools,      │
│  planner, worktrees + knowledge NOUVEAU), plans actifs,     │
│  architecture, manifeste, decisions-log.                    │
│  → INCHANGE (+ ajout docs/core/knowledge.md Phase 3)        │
└─────────────────────────────────────────────────────────────┘
                         +
┌─────────────────────────────────────────────────────────────┐
│  TIER 5 · wiki/ (KNOWLEDGE EXTERNE ATEMPOREL — NOUVEAU)     │
│  hot.md (cache 500 mots) + index.md (catalogue) + log.md    │
│  + overview.md. 5 domaines (trading/finance/sante/design/   │
│  dev). 7 cross-domain (concepts/entities/sources/           │
│  comparisons/questions/meta/canvases). Templates 5 types.   │
│  Sources ingerees via .raw/ + wiki-ingest.                  │
│  → NOUVEAU                                                   │
└─────────────────────────────────────────────────────────────┘
```

### Regle d'or 5 tiers (a documenter `docs/core/communication.md` section 1.5)

**Une information vit dans UN SEUL tier. Pas de duplication.**

| Type d'info | Tier |
|-------------|------|
| Etat projet actuel (build, sessions, decisions techniques D-XX-NN) | CONTEXT.md |
| Specs OS techniques, architecture, plans actifs | docs/ |
| Profile Kevin (langue, TDAH, preferences), feedback comportement Claude, conventions methodologie | auto-memory |
| Source externe ingeree (article, PDF, transcript, video, image) | wiki/sources/ ou wiki/domains/<X>/sources/ |
| Concept abstrait, framework, pattern theorique, idee atemporelle | wiki/concepts/ ou wiki/domains/<X>/concepts/ |
| Personne, organisation, produit, outil tiers, repo reference | wiki/entities/ |
| Domaine de knowledge (Sante, Finance, Trading, etc.) | wiki/domains/<X>/ |
| Comparaison side-by-side, analyse neutre | wiki/comparisons/ |
| Question repondue avec citations sources | wiki/questions/ |
| Cache narratif derniere session (500 mots, narratif) | wiki/hot.md |
| Decisions perso domaine (patrimoine, protocole sante) | wiki/domains/<X>/decisions/ |
| Backtest rapport synthese Trading | wiki/domains/trading/backtests/ |
| Bilan bio synthese Sante | wiki/domains/sante/bilans/ |
| CODE executable (TS/Python/etc.) | modules/<X>/src/ |
| DATA brute (market CSV, scans bio, GBs) | modules/<X>/data/ (`.gitignore`) |
| Secrets (cles API, broker config) | modules/<X>/secrets/ (`.gitignore`) |
| Backtest raw output (CSV/JSON metrics bruts) | modules/<X>/backtests/ (`.gitignore`) |

### Test arbitral (quoi va ou)

Poser 4 questions dans l'ordre :

1. **"C'est executable / brut / volumineux / sensible ?"** → `modules/<X>/{src,data,secrets,backtests}/`
2. **"Ca change a chaque session ?"** → `CONTEXT.md`
3. **"Ca decrit COMMENT travailler avec Kevin / comportement Claude ?"** → `auto-memory`
4. **"C'est une spec OS stable du systeme ?"** → `docs/`
5. Sinon → `wiki/` (knowledge atemporel externe)

### Couplage modules <-> wiki (cross-reference frontmatter)

Un fichier `wiki/domains/trading/strategies/momentum.md` contient :

```yaml
---
type: strategy
domain: trading
implementation: ../../../../modules/trading/strategies/momentum.ts
backtest_runs: ../../../../modules/trading/backtests/momentum-*.json
papers:
  - "[[../sources/momentum-jegadeesh-1993]]"
  - "[[../sources/cross-sectional-momentum-asness-2013]]"
status: production | backtest_only | archived
sharpe_ratio: 1.2
max_drawdown: 0.15
---
```

Inversement, un fichier `modules/trading/strategies/momentum.ts` a en tete :

```typescript
/**
 * Momentum Strategy — Foundation OS Trading
 * Documentation: wiki/domains/trading/strategies/momentum.md
 * Based on: Jegadeesh & Titman (1993), Asness (2013)
 */
```

---

## File Structure (Create / Modify / Delete)

### Create (nouveaux fichiers)

**wiki/ structure** :
- `wiki/hot.md` — cache narratif 500 mots derniere session
- `wiki/index.md` — master catalog (Phase 2)
- `wiki/log.md` — chronological operations log
- `wiki/overview.md` — executive summary wiki
- `wiki/domains/trading/_index.md` + sous-dossiers `concepts/`, `sources/`, `strategies/`, `backtests/`, `instruments/`
- `wiki/domains/finance/_index.md` + sous-dossiers `concepts/`, `sources/`, `decisions/`
- `wiki/domains/sante/_index.md` + sous-dossiers `concepts/`, `sources/`, `bilans/`, `protocoles/`
- `wiki/domains/design/_index.md` + sous-dossiers `concepts/`, `sources/`
- `wiki/domains/dev/_index.md` + sous-dossiers `concepts/`, `sources/`
- `wiki/concepts/.gitkeep` (cross-domain)
- `wiki/entities/.gitkeep`
- `wiki/sources/.gitkeep`
- `wiki/comparisons/.gitkeep`
- `wiki/questions/.gitkeep`
- `wiki/meta/.gitkeep`
- `wiki/canvases/.gitkeep`
- `wiki/meta/templates/concept.md`
- `wiki/meta/templates/source.md`
- `wiki/meta/templates/entity.md`
- `wiki/meta/templates/comparison.md`
- `wiki/meta/templates/question.md`

**.raw/ structure** :
- `.raw/trading/.gitkeep`
- `.raw/finance/.gitkeep`
- `.raw/sante/.gitkeep`
- `.raw/articles/.gitkeep`
- `.raw/images/.gitkeep`

**Core OS** :
- `docs/core/knowledge.md` — spec module Knowledge (Phase 7 Core OS)

**Scripts** :
- `scripts/wiki-commit.sh` — commit manuel wiki/ + .raw/ (remplace auto-commit hook)
- `scripts/wiki-health.sh` — health-check specifique wiki (hot.md age, index.md sync, pages count)
- `scripts/hooks/session-start-wiki.sh` — wrapper SessionStart chainage drift-detector + cat hot.md

**Plans natifs** :
- `~/.claude/plans/wiki-obsidian-adoption.md` — symlink/copie du plan (dual-path Foundation)

### Modify (fichiers existants)

- `.gitignore` — ajout `.obsidian/`, `modules/*/data/`, `modules/*/secrets/`, `modules/*/backtests/raw/`
- `docs/core/communication.md` — section 1 (4 tiers → 5 tiers), section 1.5 (test arbitral NOUVEAU), section 6.1 (cadres HOT + WIKI dans brief v11)
- `docs/core/architecture-core.md` — ajout module Knowledge Phase 7
- `docs/core/tools.md` — section "Skills Knowledge (claude-obsidian)" NOUVELLE
- `docs/core/tools/index.json` — ajout 10 skills claude-obsidian
- `docs/core/tools/routing.json` — triggers keywords wiki-*, save, autoresearch, canvas
- `CLAUDE.md` — section memoire (5 tiers), section Commands (ajout /wiki /save /autoresearch /canvas)
- `CONTEXT.md` — ligne Knowledge dans Modules, decision D-WIKI-01, session recente
- `README.md` — section "Knowledge layer (wiki/)"
- `docs/manifeste.md` — ajout "OS de travail + second-brain knowledge"
- `~/.claude/settings.json` — hooks claude-obsidian (SessionStart wrapper, PostCompact activer, PostToolUse DESACTIVER, Stop activer)
- `.claude/settings.local.json` — permissions wiki-* commands
- `.claude/commands/session-start.md` — Tour 1 ajouter lecture `wiki/hot.md`, Tour 3 ajouter cadres HOT + WIKI
- `.claude/commands/session-end.md` — Tour 3 ajouter update `wiki/hot.md` (500 mots) + `wiki/log.md`
- `scripts/health-check.sh` — section INFO ajouter check wiki/ (hot.md existe, age < 7j)
- `scripts/drift-detector.sh` — ajout check hot.md age + index.md sync vs filesystem
- `scripts/ref-checker.sh` — scanner wikilinks `[[file]]` dans `wiki/*.md`
- `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` — post-Phase 5 si migration
- N mémoires auto-memory migrees selectivement vers wiki/ (Phase 5)

### Delete

**Aucun fichier supprime.** Migration auto-memory = `git mv` (pas `rm`). Rollback possible via `git revert`.

---

## Phases (12 phases, 1-2 sessions, ~9h total)

### Phase 0 — Worktree + préflight baseline (15 min)

**Objectif** : Creer worktree dedie `wt/wiki-adoption-260415`, capturer baseline health/drift/refs pour comparer a la fin.

**Pre-conditions** :
- Main propre (`git status --short` vide sur main)
- Foundation OS fonctionnel (health SAIN ou DEGRADED acceptable)
- Obsidian app installee (`/Applications/Obsidian.app` existe — verifie 2026-04-15)

**Etat repo au demarrage** :
- Branche actuelle : peu importe
- 3 worktrees existants (main + sleepy-ellis + suspicious-khayyam)

**Actions atomiques** :

- [ ] **Step 1 — Verifier etat initial**

```bash
cd /Users/kevinnoel/foundation-os
git worktree list
git status --short
git branch --show-current
```
Expected : 3 worktrees visibles, status affiche fichiers en cours (`suspicious-khayyam` peut avoir `.omc/project-memory.json` modifie, OK).

- [ ] **Step 2 — Basculer sur main propre**

```bash
cd /Users/kevinnoel/foundation-os
# Si on etait dans un worktree, revenir
git checkout main
git pull origin main
git status --short
```
Expected : "Your branch is up to date with 'origin/main'", status vide.

- [ ] **Step 3 — Creer worktree via script Foundation (convention D-NAMING-01)**

```bash
bash scripts/worktree-new.sh wiki-adoption
```
Expected : Output du style `Worktree cree : .claude/worktrees/wiki-adoption-260415 (branche wt/wiki-adoption-260415)`.

- [ ] **Step 4 — Basculer dans le worktree**

```bash
cd /Users/kevinnoel/foundation-os/.claude/worktrees/wiki-adoption-260415
pwd
git status
git branch --show-current
```
Expected :
- `pwd` = `/Users/kevinnoel/foundation-os/.claude/worktrees/wiki-adoption-260415`
- `git branch --show-current` = `wt/wiki-adoption-260415`
- `git status` = "On branch wt/wiki-adoption-260415, nothing to commit, working tree clean"

- [ ] **Step 5 — Capturer baseline health**

```bash
bash scripts/health-check.sh 2>&1 | tee /tmp/health-baseline-260415.log
```
Expected : Verdict "SAIN" ou "DEGRADED", log sauve dans `/tmp/`. Note le verdict + le nombre de warnings.

- [ ] **Step 6 — Capturer baseline drift**

```bash
bash scripts/drift-detector.sh 2>&1 | tee /tmp/drift-baseline-260415.log
```
Expected : Verdict "SYNC" ou "DRIFT" avec liste des drifts actuels (attendu : 1 drift `claude/*` legacy si worktree auto).

- [ ] **Step 7 — Capturer baseline refs**

```bash
bash scripts/ref-checker.sh 2>&1 | tee /tmp/refs-baseline-260415.log
```
Expected : "0 refs cassees" ou liste des refs cassees actuelles.

- [ ] **Step 8 — Verifier Obsidian app**

```bash
ls -d /Applications/Obsidian.app && echo "OK" || echo "MISSING"
```
Expected : `/Applications/Obsidian.app OK`.

- [ ] **Step 9 — Creer copie du plan dans plans natifs Desktop (dual-path)**

```bash
cp docs/plans/2026-04-15-wiki-obsidian-adoption.md ~/.claude/plans/wiki-obsidian-adoption.md
ls -la ~/.claude/plans/wiki-obsidian-adoption.md
```
Expected : fichier copie dans `~/.claude/plans/` (visible dans plan window Desktop).

**Verification** :
```bash
git worktree list | grep wiki-adoption-260415
pwd | grep wiki-adoption-260415
ls /tmp/*-baseline-260415.log
```
Les 3 commandes doivent retourner exit 0 avec output non-vide.

**Rollback** :
```bash
cd /Users/kevinnoel/foundation-os
bash scripts/worktree-clean.sh wiki-adoption-260415
git branch -D wt/wiki-adoption-260415
rm /tmp/*-baseline-260415.log
rm ~/.claude/plans/wiki-obsidian-adoption.md
```

**Commit** : (aucun — init worktree uniquement)

---

### Phase 1 — Installation plugin claude-obsidian + verification (15 min)

**Objectif** : Installer le plugin `claude-obsidian@1.4.1` via marketplace, verifier les 10 skills disponibles, backup `~/.claude/settings.json` avant toute modification hooks.

**Pre-conditions** :
- Phase 0 OK (worktree `wt/wiki-adoption-260415` actif)
- Connexion internet (pour marketplace fetch)
- `claude --version` retourne version compatible plugin v1.4.1

**Etat repo** : wt/wiki-adoption-260415 propre (aucun fichier modifie).

**Actions atomiques** :

- [ ] **Step 1 — Lister plugins actuels (baseline)**

```bash
claude plugin list 2>&1 | tee /tmp/plugins-before-260415.log
```
Expected : liste plugins actuels (OMC, superpowers v5.0.7, gstack, BMAD v6 dormant, etc.). Pas de claude-obsidian.

- [ ] **Step 2 — Ajouter marketplace claude-obsidian**

```bash
claude plugin marketplace add AgriciDaniel/claude-obsidian
```
Expected : "Marketplace claude-obsidian-marketplace added" (ou message equivalent confirmant ajout).

- [ ] **Step 3 — Installer plugin**

```bash
claude plugin install claude-obsidian@claude-obsidian-marketplace
```
Expected : Installation OK, version v1.4.1 (ou plus recente si release).

- [ ] **Step 4 — Lister plugins post-install**

```bash
claude plugin list 2>&1 | tee /tmp/plugins-after-260415.log
diff /tmp/plugins-before-260415.log /tmp/plugins-after-260415.log
```
Expected : `diff` montre ajout claude-obsidian uniquement.

- [ ] **Step 5 — Verifier cache plugin + 10 skills disponibles**

```bash
ls ~/.claude/plugins/cache/*/claude-obsidian/*/skills/ 2>/dev/null | sort
```
Expected : 10 dossiers (autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown, save, wiki, wiki-ingest, wiki-lint, wiki-query).

- [ ] **Step 6 — Verifier 4 commands disponibles**

```bash
ls ~/.claude/plugins/cache/*/claude-obsidian/*/commands/ 2>/dev/null | sort
```
Expected : 4 fichiers (autoresearch.md, canvas.md, save.md, wiki.md).

- [ ] **Step 7 — Backup ~/.claude/settings.json avant modif hooks**

```bash
cp ~/.claude/settings.json ~/.claude/settings.json.backup-pre-wiki-260415
ls -la ~/.claude/settings.json.backup-pre-wiki-260415
cat ~/.claude/settings.json | head -5
```
Expected : backup cree, contient `{\"env\": ..., \"permissions\": ...}`.

- [ ] **Step 8 — Backup .claude/settings.local.json (worktree)**

```bash
cp .claude/settings.local.json .claude/settings.local.json.backup-pre-wiki-260415
ls -la .claude/settings.local.json.backup-pre-wiki-260415
```
Expected : backup cree dans worktree.

- [ ] **Step 9 — Inspecter hooks.json du plugin (lecture seule pour decision Phase 4)**

```bash
cat ~/.claude/plugins/cache/*/claude-obsidian/*/hooks/hooks.json
```
Expected : JSON avec 4 hooks (SessionStart, PostCompact, PostToolUse, Stop). Note mentale : PostToolUse auto-commit = A DESACTIVER.

**Verification** :
```bash
claude plugin list 2>&1 | grep claude-obsidian
ls ~/.claude/plugins/cache/*/claude-obsidian/*/skills/ 2>/dev/null | wc -l  # doit retourner 10
ls ~/.claude/settings.json.backup-pre-wiki-260415
```
3 commandes OK.

**Rollback** :
```bash
claude plugin uninstall claude-obsidian@claude-obsidian-marketplace
claude plugin marketplace remove claude-obsidian-marketplace
cp ~/.claude/settings.json.backup-pre-wiki-260415 ~/.claude/settings.json
cp .claude/settings.local.json.backup-pre-wiki-260415 .claude/settings.local.json
rm /tmp/plugins-{before,after}-260415.log
```

**Commit** : (aucun — plugin installe globalement, pas de fichier projet touche)

---

### Phase 2 — Scaffold wiki/ multi-domaines (45 min)

**Objectif** : Creer structure complete du vault `wiki/` dans le worktree (27+ dossiers, 13+ fichiers .md initiaux, 5 templates). Update `.gitignore`. Premier commit knowledge layer.

**Pre-conditions** : Phase 1 OK (plugin installe, 10 skills disponibles).

**Etat repo** : wt/wiki-adoption-260415 propre.

**Actions atomiques** :

- [ ] **Step 1 — Creer dossiers racine wiki/ (cross-domain)**

```bash
mkdir -p wiki/sources wiki/entities wiki/concepts wiki/comparisons wiki/questions wiki/meta wiki/canvases
mkdir -p wiki/meta/templates
```
Verification : `ls -d wiki/*/` retourne 7 dossiers.

- [ ] **Step 2 — Creer dossiers par domaine (5 domaines × sous-dossiers)**

```bash
mkdir -p wiki/domains/trading/concepts wiki/domains/trading/sources wiki/domains/trading/strategies wiki/domains/trading/backtests wiki/domains/trading/instruments
mkdir -p wiki/domains/finance/concepts wiki/domains/finance/sources wiki/domains/finance/decisions
mkdir -p wiki/domains/sante/concepts wiki/domains/sante/sources wiki/domains/sante/bilans wiki/domains/sante/protocoles
mkdir -p wiki/domains/design/concepts wiki/domains/design/sources
mkdir -p wiki/domains/dev/concepts wiki/domains/dev/sources
```
Verification : `find wiki/domains -type d | wc -l` retourne 21 (5 domaines + 16 sous-dossiers).

- [ ] **Step 3 — Creer .raw/ archive sources**

```bash
mkdir -p .raw/trading .raw/finance .raw/sante .raw/articles .raw/images
```
Verification : `find .raw -type d | wc -l` retourne 6 (racine + 5).

- [ ] **Step 4 — Ajouter .gitkeep dans chaque dossier vide**

```bash
find wiki/ .raw/ -type d -empty -exec touch {}/.gitkeep \;
find wiki/ .raw/ -name .gitkeep | wc -l
```
Expected : >= 25 fichiers .gitkeep (tous dossiers vides sauf ceux qui auront un _index.md ou fichier init).

- [ ] **Step 5 — Creer wiki/hot.md (cache narratif initial 500 mots)**

```bash
cat > wiki/hot.md <<'HOTEOF'
---
type: meta
title: "Hot Cache Foundation OS"
updated: 2026-04-15T00:00:00
tags:
  - meta
  - hot-cache
status: evergreen
related:
  - "[[index]]"
  - "[[log]]"
  - "[[overview]]"
---

# Hot Cache

Navigation: [[index]] | [[log]] | [[overview]]

## Last Updated

2026-04-15 : Vault initialise. Foundation OS adoption claude-obsidian Phase 2 scaffold.

## Plugin State

- **Plugin**: claude-obsidian v1.4.1 installe (Phase 1 OK)
- **Obsidian app**: /Applications/Obsidian.app (installee, verifiee)
- **Skills**: 10 disponibles (wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown)
- **Commands**: 4 (/wiki, /save, /autoresearch, /canvas)
- **Domaines pre-scaffoldes**: trading, finance, sante, design, dev

## Key Recent Facts

- Foundation OS = OS de travail IA-driven (code app/design-system) + second-brain knowledge (wiki/)
- 5 tiers memoire : conversation / CONTEXT.md / auto-memory / docs/ / wiki/
- Regle d'or : une info = un seul tier (zero duplication)
- Couplage modules/ <-> wiki/domains/ via frontmatter `implementation:`
- Phase 5 modules futurs (Finance, Trading auto, Sante multi-agents) vont intensement utiliser wiki/

## Recent Changes

- 2026-04-15 Phase 0 : worktree `wt/wiki-adoption-260415` cree
- 2026-04-15 Phase 1 : plugin claude-obsidian installe globalement
- 2026-04-15 Phase 2 : scaffold vault (27 dossiers, 13 fichiers .md init, 5 templates)

## Active Threads

- Plan adoption wiki : `docs/plans/2026-04-15-wiki-obsidian-adoption.md` (12 phases)
- Prochaine phase : 3 (documentation 5 tiers dans docs/core/communication.md)
- Migration auto-memory selective (Phase 5) : 29 fichiers a auditer 1-par-1
- Premier ingest test (Phase 7) : Karpathy LLM Wiki + AgriciDaniel claude-obsidian
- Brief v11 enrichi (Phase 8) : cadres HOT + WIKI

## Next Action

Phase 3 : update `docs/core/communication.md` section 1 (4 tiers → 5 tiers) + ajout section 1.5 (test arbitral).
HOTEOF
```
Verification : `wc -w wiki/hot.md` retourne ~400-500 mots.

- [ ] **Step 6 — Creer wiki/index.md (master catalog)**

```bash
cat > wiki/index.md <<'INDEXEOF'
---
type: meta
title: "Wiki Foundation OS — Master Index"
updated: 2026-04-15
tags:
  - meta
  - index
status: evergreen
related:
  - "[[overview]]"
  - "[[log]]"
  - "[[hot]]"
---

# Foundation OS — Knowledge Wiki

Last updated: 2026-04-15 | Total pages: 0 | Sources ingested: 0

Navigation: [[overview]] | [[log]] | [[hot]]

## Domaines

### Trading
- [[domains/trading/_index]] — strategies, backtests, whitepapers, instruments

### Finance
- [[domains/finance/_index]] — patrimoine, fiscalite, decisions

### Sante
- [[domains/sante/_index]] — bilans bio, protocoles, papers medicaux, conseil multi-agents

### Design
- [[domains/design/_index]] — UX research, patterns, heuristiques

### Dev
- [[domains/dev/_index]] — frameworks, patterns code, architecture, foundation OS

## Cross-domain

### Concepts (knowledge atemporel)
<!-- Populated par ingest Phase 7 + -->

### Entities (personnes, orgs, produits, outils, repos)
<!-- Populated par ingest -->

### Sources (articles, papers, transcripts, PDFs)
<!-- Populated par ingest -->

### Comparisons (analyses side-by-side)
<!-- Populated par ingest -->

### Questions (Q&A avec citations)
<!-- Populated par /save ou /autoresearch -->

## Meta

- [[meta/templates/concept]]
- [[meta/templates/source]]
- [[meta/templates/entity]]
- [[meta/templates/comparison]]
- [[meta/templates/question]]

## Statistiques

| Type | Count |
|------|-------|
| Concepts | 0 |
| Entities | 0 |
| Sources | 0 |
| Comparisons | 0 |
| Questions | 0 |
| Domaines actifs | 5 |
| Total pages | 0 |
INDEXEOF
```
Verification : `cat wiki/index.md | head -20` montre frontmatter + titre.

- [ ] **Step 7 — Creer wiki/log.md (chronological operations)**

```bash
cat > wiki/log.md <<'LOGEOF'
---
type: meta
title: "Wiki Operations Log"
updated: 2026-04-15
tags:
  - meta
  - log
status: evergreen
---

# Wiki Operations Log

Chronological record of all wiki operations (scaffold, ingest, save, migrate, archive).

## 2026-04-15

### Adoption claude-obsidian (plan `docs/plans/2026-04-15-wiki-obsidian-adoption.md`)

- **Phase 0** : Worktree `wt/wiki-adoption-260415` cree + baseline health/drift/refs capture
- **Phase 1** : Plugin claude-obsidian v1.4.1 installe globalement + backup settings.json
- **Phase 2** : Scaffold vault — 5 domaines (trading, finance, sante, design, dev) + 7 cross-domain (concepts, entities, sources, comparisons, questions, meta, canvases) + 5 templates + .raw/ archive
LOGEOF
```
Verification : fichier cree, frontmatter valide.

- [ ] **Step 8 — Creer wiki/overview.md (executive summary)**

```bash
cat > wiki/overview.md <<'OVEOF'
---
type: meta
title: "Wiki Overview"
updated: 2026-04-15
tags:
  - meta
  - overview
status: evergreen
related:
  - "[[index]]"
  - "[[log]]"
  - "[[hot]]"
---

# Foundation OS Wiki — Overview

Le wiki Foundation OS est la couche **knowledge** de l'OS de travail IA-driven de Kevin.

## Mission

Accumuler, structurer, rendre navigable le knowledge cross-modules pour :

1. **App Builder** (actif) — patterns React/TS, design system tokens, heuristiques UX
2. **Trading** (Phase 5) — strategies backtestees, papers academic, regulations, market microstructure, backtest engine, trading auto
3. **Finance** (Phase 5) — patrimoine, fiscalite, decisions d'investissement, regulations
4. **Sante** (Phase 5) — bilans biologiques synthetises, protocoles, papers medicaux, conseil sante multi-agents
5. **Dev** (transversal) — frameworks, patterns code, architecture

## Pattern : Karpathy LLM Wiki

Pre-compiler sources brutes en wiki Markdown structure puis operer Claude sur ce wiki (pas du RAG embeddings).

Workflow de lecture Claude : `hot.md` (500 mots) + `index.md` (1 ligne/page) + pages pertinentes only → contexte minimal meme avec 1000+ pages.

## 5 tiers memoire Foundation OS

| Tier | Support | Role |
|------|---------|------|
| 1 | Conversation Claude | Volatile 1 session |
| 2 | CONTEXT.md | Etat operationnel projet |
| 3 | auto-memory (~/.claude/projects/...) | Profile Kevin + feedback comportement |
| 4 | docs/ | Specs techniques OS |
| 5 | **wiki/ (ici)** | **Knowledge externe atemporel** |

Voir `docs/core/communication.md` section 1 + section 1.5 (test arbitral).

## Couplage modules <-> wiki

```yaml
# wiki/domains/trading/strategies/momentum.md
---
type: strategy
implementation: ../../../../modules/trading/strategies/momentum.ts
backtest_runs: ../../../../modules/trading/backtests/
sharpe_ratio: 1.2
max_drawdown: 0.15
---
```

## Workflows

- `/wiki` — scaffold vault (deja fait)
- `/save [name]` — sauver conversation courante en wiki page
- `/autoresearch [topic]` — web research 3-5 rounds
- `/canvas [desc]` — Obsidian canvas visual

## Stats (init)

- Pages : 0
- Sources : 0
- Domaines : 5
OVEOF
```

- [ ] **Step 9 — Creer wiki/domains/*/\_index.md pour chaque domaine (5 fichiers)**

```bash
for domain in trading finance sante design dev; do
  cat > wiki/domains/$domain/_index.md <<DOMEOF
---
type: domain-index
title: "$domain"
updated: 2026-04-15
tags:
  - domain-index
  - $domain
status: evergreen
related:
  - "[[../../index]]"
---

# Domaine : $domain

## Sous-dossiers

\$(for sub in \$(ls -d wiki/domains/$domain/*/ 2>/dev/null | xargs -n1 basename); do echo "- [[$domain/\$sub/]] — "; done)

## Pages recentes

Aucune pour l'instant.

## Cross-references cles

Aucune pour l'instant.
DOMEOF
done
```
Note : la substitution `$(ls ...)` ne marche pas dans heredoc avec `'DOMEOF'` single quote. Alternative simple :

```bash
for domain in trading finance sante design dev; do
  cat > wiki/domains/$domain/_index.md <<DOMEOF
---
type: domain-index
title: "$domain"
updated: 2026-04-15
tags:
  - domain-index
  - $domain
status: evergreen
related:
  - "[[../../index]]"
---

# Domaine : $domain

## Sous-dossiers

(Voir structure filesystem wiki/domains/$domain/.)

## Pages recentes

Aucune pour l'instant.

## Cross-references cles

Aucune pour l'instant.
DOMEOF
done
```
Verification : `ls wiki/domains/*/\_index.md` retourne 5 fichiers.

- [ ] **Step 10 — Creer 5 templates (concept, source, entity, comparison, question)**

```bash
# Template concept
cat > wiki/meta/templates/concept.md <<'TCEOF'
---
type: concept
title: "<TITRE>"
complexity: intermediate
domain: ""
aliases: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - concept
status: seed
confidence: medium
related: []
sources: []
---

# <TITRE>

## Definition

[Ce que c'est. Declaratif, present. Un paragraphe clair.]

## How It Works

[Mecanisme]

## Why It Matters

[Importance dans ce domaine]

## Examples

-

## Connections

-

## Sources

-
TCEOF

# Template source
cat > wiki/meta/templates/source.md <<'TSEOF'
---
type: source
title: "<TITRE>"
source_type: article
author: ""
date_published: YYYY-MM-DD
url: ""
confidence: medium
key_claims:
  - ""
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - source
status: seed
related: []
sources: []
---

# <TITRE>

## Summary

[Resume 2-3 phrases]

## Key Claims

-

## Entities Mentioned

- [[]] —

## Concepts Introduced

- [[]] —

## Notes

TSEOF

# Template entity
cat > wiki/meta/templates/entity.md <<'TEEOF'
---
type: entity
title: "<TITRE>"
entity_type: person | organization | product | tool | repo
aliases: []
url: ""
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - entity
status: seed
related: []
sources: []
---

# <TITRE>

## What

[1-2 phrases : qui/quoi]

## Why It Matters

[Pourquoi present dans le wiki]

## Key Facts

-

## Connections

-

## Sources

-
TEEOF

# Template comparison
cat > wiki/meta/templates/comparison.md <<'TCPEOF'
---
type: comparison
title: "<TITRE>"
items_compared: []
verdict: ""
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - comparison
status: seed
confidence: medium
related: []
sources: []
---

# <TITRE>

## Context

[Pourquoi cette comparaison]

## Items Compared

| Aspect | Item A | Item B |
|--------|--------|--------|
|        |        |        |

## Verdict

[Qui gagne dans quel contexte]

## Sources

-
TCPEOF

# Template question
cat > wiki/meta/templates/question.md <<'TQEOF'
---
type: question
title: "<TITRE>"
status: open
asked: YYYY-MM-DD
answered: null
confidence: null
tags:
  - question
related: []
sources: []
---

# <TITRE>

## Question

[Formulation exacte]

## Answer

[Reponse basee sur sources wiki + recherche si necessaire]

## Sources

-

## Follow-ups

-
TQEOF
```
Verification : `ls wiki/meta/templates/*.md | wc -l` retourne 5.

- [ ] **Step 11 — Mettre a jour .gitignore**

```bash
cat >> .gitignore <<'GIEOF'

# ── WIKI / KNOWLEDGE LAYER (D-WIKI-01, 2026-04-15) ──
# Obsidian config locale (per user, non partagee)
.obsidian/
.obsidian.vimrc

# Modules Phase 5 : data brute + secrets + backtests raw
modules/*/data/
modules/*/secrets/
modules/*/backtests/raw/

# Manifest delta tracking claude-obsidian (regenerable)
.raw/.manifest.json
GIEOF
```
Verification :
```bash
tail -15 .gitignore
grep -c "^\.obsidian/$" .gitignore  # doit retourner 1
```

- [ ] **Step 12 — Test Obsidian ouvre le vault (verification visuelle)**

```bash
# Ouvre Obsidian avec le vault wiki/ en dossier racine vault
open -a Obsidian "$(pwd)/wiki"
```
Expected : Obsidian s'ouvre (si premier lancement, dialog "Open folder as vault" → confirmer `wiki/`). Graph view vide (aucun wikilink fonctionnel encore car pages cibles manquent), mais structure visible dans file explorer.

Kevin valide visuellement : structure OK ? Puis on continue.

- [ ] **Step 13 — Verification structure complete avant commit**

```bash
echo "=== Dossiers wiki/ ===" && find wiki/ -type d | wc -l
echo "=== Fichiers .md wiki/ ===" && find wiki/ -type f -name "*.md" | wc -l
echo "=== Fichiers .gitkeep ===" && find wiki/ .raw/ -name ".gitkeep" | wc -l
echo "=== Structure domains ===" && ls -d wiki/domains/*/
echo "=== Templates ===" && ls wiki/meta/templates/
echo "=== Raw ===" && ls -d .raw/*/
```
Expected :
- Dossiers wiki/ : >= 28 (7 cross-domain + 21 domain subdirs)
- Fichiers .md wiki/ : >= 13 (hot, index, log, overview, 5 _index, 5 templates)
- .gitkeep : >= 10 (dossiers vides)
- 5 domaines listes
- 5 templates listes
- 6 dossiers .raw/ (racine + 5)

- [ ] **Step 14 — Commit Phase 2**

```bash
git add wiki/ .raw/ .gitignore
git status --short  # verifier ce qui est stage
git commit -m "$(cat <<'CEOF'
feat(wiki): scaffold Obsidian vault 5 domaines + cross-domain

- wiki/hot.md (cache narratif 500 mots Phase 2 init)
- wiki/index.md (master catalog, 0 pages init)
- wiki/log.md (chronological ops log)
- wiki/overview.md (executive summary + 5 tiers memoire)
- wiki/domains/{trading,finance,sante,design,dev}/ + sous-dossiers specifiques
- wiki/{concepts,entities,sources,comparisons,questions,meta,canvases}/
- wiki/meta/templates/ (concept, source, entity, comparison, question)
- .raw/{trading,finance,sante,articles,images}/ archive sources
- .gitignore : .obsidian/, modules/*/data/, modules/*/secrets/, .raw/.manifest.json

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 2.
Ref : D-WIKI-01.
CEOF
)"
```
Verification : `git log -1 --format="%h %s"` affiche le commit.

**Verification finale Phase 2** :
```bash
bash scripts/health-check.sh 2>&1 | tail -5  # verifier pas de regression
git log -1 --format="%h %s"
ls wiki/*.md wiki/meta/templates/*.md
```
- Health verdict inchange ou ameliore
- 1 nouveau commit
- 4 fichiers racine wiki/ + 5 templates

**Rollback Phase 2** :
```bash
git reset --hard HEAD~1
rm -rf wiki/ .raw/
git checkout .gitignore
```

**Commit message Phase 2** : `feat(wiki): scaffold Obsidian vault 5 domaines + cross-domain` (voir Step 14).

---

### Phase 3 — Documentation 5 tiers + module Knowledge Core OS (1h)

**Objectif** : Documenter proprement dans `docs/core/` la nouvelle architecture 5 tiers (test arbitral), creer `docs/core/knowledge.md` (spec module Knowledge Phase 7 Core OS), mettre a jour `CLAUDE.md` + `CONTEXT.md`.

**Pre-conditions** : Phase 2 OK (wiki/ scaffolde, commit fait).

**Etat repo** : wt/wiki-adoption-260415 avec 1 commit Phase 2.

**Actions atomiques** :

- [ ] **Step 1 — Read docs/core/communication.md actuel (reference complete)**

```bash
cat docs/core/communication.md | head -50
wc -l docs/core/communication.md
```
Expected : ~370 lignes, section 1 "Tiers de memoire" avec 4 tiers.

- [ ] **Step 2 — Update `docs/core/communication.md` section 1 (4 tiers → 5 tiers)**

Utiliser `Edit` tool pour remplacer section 1 :

```
old_string = "## 1. Tiers de memoire

| Tier | Support | Duree de vie | Mis a jour par |
|------|---------|-------------|----------------|
| Session | Conversation Claude | 1 session | automatique |
| Contexte | CONTEXT.md | Permanent (chaque session) | session-end |
| Reference | docs/ | Permanent (fondamentaux) | quand architecture change |
| Auto-memory | ~/.claude/projects/.../memory/ | Permanent | Claude Code natif |

### Regle d'or
**Une information ne vit que dans UN tier.** Pas de duplication. Si c'est dans docs/, CONTEXT.md pointe vers le doc."

new_string = "## 1. Tiers de memoire (5 tiers post-D-WIKI-01)

| Tier | Support | Duree de vie | Mis a jour par |
|------|---------|-------------|----------------|
| Session | Conversation Claude | 1 session | automatique |
| Contexte | CONTEXT.md | Permanent (chaque session) | session-end |
| Auto-memory | ~/.claude/projects/.../memory/ | Permanent | Claude Code natif + /session-end |
| Reference | docs/ | Permanent (fondamentaux) | quand architecture change |
| **Knowledge** | **wiki/ (NOUVEAU)** | **Permanent** | **/save, wiki-ingest, /autoresearch** |

### Regle d'or (update 2026-04-15)
**Une information ne vit que dans UN tier.** Pas de duplication. Si c'est dans docs/, CONTEXT.md pointe vers le doc. Si c'est knowledge externe atemporel, ca va dans wiki/ (pas dans auto-memory)."
```

Commande Edit :
```bash
# Utiliser Edit tool via Claude, pas bash.
# Voir section "Actions atomiques" — Step 2 execute Edit tool sur communication.md
```

- [ ] **Step 3 — Ajouter section 1.5 "Test arbitral (quoi va ou)" a communication.md**

Utiliser `Edit` tool pour inserer apres section 1.4 (Regle d'or), avant section 2 :

```
old_string = "### Auto-memory — ce qui y va (et ce qui n'y va pas)"
```

Et AVANT cette section, inserer section 1.5 :

```
new_string = "## 1.5 Test arbitral — quoi va dans quel tier

Poser 5 questions dans l'ordre pour arbitrer tout nouvel element :

1. **Executable / brut / volumineux / sensible (cles API, secrets)** → `modules/<X>/{src,data,secrets,backtests}/`
2. **Change a chaque session** (etat projet courant) → `CONTEXT.md`
3. **Decrit COMMENT travailler avec Kevin / comportement Claude** → `auto-memory` (~/.claude/projects/.../memory/)
4. **Spec OS stable du systeme** (architecture, module Core) → `docs/core/` ou `docs/`
5. Sinon (knowledge atemporel externe) → **`wiki/`** (nouveau tier 5)

Exemples concrets :

| Element | Tier | Justification |
|---------|------|--------------|
| Ferritine baseline Kevin 2026-04 | `wiki/domains/sante/bilans/2026-04-bilan.md` | knowledge externe, synthese (pas raw scan) |
| Strategy momentum code TS | `modules/trading/strategies/momentum.ts` | executable |
| Strategy momentum doc + papers refs | `wiki/domains/trading/strategies/momentum.md` | knowledge atemporel |
| Sharpe ratio explained | `wiki/concepts/Sharpe Ratio.md` | concept theorique cross-domain |
| Decision D-WIKI-01 adoption claude-obsidian | `CONTEXT.md` Decisions + `docs/decisions-log.md` | decision technique projet |
| Kevin est TDAH, thinking en francais | `auto-memory/user_*.md` | profile Kevin |
| Cle API broker trading | `modules/trading/secrets/.env` (gitignored) | secret sensible |

### Auto-memory — ce qui y va (et ce qui n'y va pas)"
```

- [ ] **Step 4 — Update section 6.1 communication.md : cadres HOT + WIKI dans brief v11**

Utiliser `Edit` tool pour ajouter cadres HOT + WIKI dans le template brief v11 :

```
old_string = "**Sections du brief debut de session** (ordre, voir spec) :
1. Sante (health-check + build + worktree actif)
2. Trajectoire (mission + focus + tendance + derniere decision)
3. Plans actifs (1 sous-cadre par plan actif avec progression + hier + prochain + reste)
4. Modules (Code + Meta + Prevu) + Acces"

new_string = "**Sections du brief debut de session** (ordre, voir spec) :
1. Sante (health-check + build + worktree actif)
2. **HOT (NOUVEAU — lecture wiki/hot.md, 3-5 lignes condensees)**
3. Trajectoire (mission + focus + tendance + derniere decision)
4. Plans actifs (1 sous-cadre par plan actif avec progression + hier + prochain + reste)
5. **WIKI (NOUVEAU — compteur pages / sources / domaines actifs + derniere ingest)**
6. Modules (Code + Meta + Prevu) + Acces"
```

Et mettre a jour la numerotation suivante (5-12 → 7-14) dans la meme section.

- [ ] **Step 5 — Creer `docs/core/knowledge.md` (spec module Knowledge Phase 7 Core OS)**

```bash
cat > docs/core/knowledge.md <<'KEOF'
# Knowledge — Spec Module Core OS (Phase 7)

Module Core OS responsable du knowledge layer persistant Foundation OS via plugin `claude-obsidian` (pattern Karpathy LLM Wiki).

> Ce module definit COMMENT le knowledge externe atemporel est accumule, structure, navigue et cross-reference avec les modules applicatifs.

## 1. Architecture

### Vault structure

```
wiki/
├── hot.md          cache narratif 500 mots derniere session
├── index.md        master catalog (1 ligne par page)
├── log.md          chronological operations log
├── overview.md     executive summary wiki
├── domains/        5 domaines pre-scaffoldes
│   ├── trading/    concepts, sources, strategies, backtests, instruments
│   ├── finance/    concepts, sources, decisions
│   ├── sante/      concepts, sources, bilans, protocoles
│   ├── design/     concepts, sources
│   └── dev/        concepts, sources
├── concepts/       cross-domain (atemporel)
├── entities/       personnes, orgs, produits, outils
├── sources/        articles, papers, transcripts ingeres
├── comparisons/    analyses side-by-side
├── questions/      Q&A avec citations
├── meta/           dashboards + templates
└── canvases/       Obsidian canvas .canvas

.raw/               archive sources brutes (immutable)
├── trading/
├── finance/
├── sante/
├── articles/       cross-domain
└── images/         OCR/vision ingest
```

### Plugin claude-obsidian

- Version : v1.4.1 (adoption 2026-04-15 D-WIKI-01)
- Source : https://github.com/AgriciDaniel/claude-obsidian
- 10 skills, 4 commands, 3 hooks actifs (1 desactive : PostToolUse auto-commit)

## 2. Couplage modules <-> wiki

### Regle d'or

Code executable vit dans `modules/<X>/`. Knowledge atemporel (doc, hypotheses, sources refs) vit dans `wiki/domains/<X>/`.

### Frontmatter cross-reference

Un fichier wiki pointe son code :
```yaml
---
type: strategy
implementation: ../../../../modules/trading/strategies/momentum.ts
backtest_runs: ../../../../modules/trading/backtests/
---
```

Un fichier code pointe son wiki :
```typescript
/**
 * Momentum Strategy — Foundation OS Trading
 * Documentation: wiki/domains/trading/strategies/momentum.md
 */
```

## 3. Skills disponibles (10)

| Skill | Role | Trigger |
|-------|------|---------|
| wiki | scaffold + router | "/wiki", "setup wiki" |
| wiki-ingest | ingest source → pages wiki | "ingest", paste URL, paste PDF |
| wiki-query | search multi-depth | questions sur contenu wiki |
| wiki-lint | qualite vault | "lint wiki" |
| save | conversation → wiki page | "/save [name]" |
| autoresearch | web research 3-5 rounds | "/autoresearch [topic]" |
| canvas | Obsidian canvas visual | "/canvas [description]" |
| defuddle | clean article web | ingest URL avec defuddle available |
| obsidian-bases | Dataview replacement | utilisation bases natives Obsidian |
| obsidian-markdown | syntax kepano Obsidian | standardisation markdown |

Catalogue complet : `docs/core/tools.md` section "Skills Knowledge".

## 4. Workflows

### Ingest source externe

1. Drop PDF/URL/transcript dans `.raw/<domain>/`
2. `wiki-ingest .raw/<domain>/<file>` ou `ingest .raw/<domain>/<file>`
3. Plugin cree 8-15 pages wiki avec wikilinks + cross-refs
4. Update `wiki/index.md` + `wiki/log.md` auto

### Save conversation

1. Apres conversation valable : `/save [name]`
2. Plugin analyse conversation, extrait concepts, entities, questions
3. Cree pages wiki appropriees + update index

### Research loop

1. `/autoresearch [topic]`
2. Plugin fait 3-5 rounds web search + synthese
3. Pages crees dans `wiki/domains/<domain>/` appropries
4. Citations + cross-refs automatiques

## 5. Integration Foundation OS

### Brief v11 enrichi (cadres HOT + WIKI)

Voir `docs/core/communication.md` section 6.1.

### Hooks

- **SessionStart** : chainage drift-detector + cat wiki/hot.md (wrapper `scripts/hooks/session-start-wiki.sh`)
- **PostCompact** : re-cat wiki/hot.md (preserve hot cache post-compactage)
- **PostToolUse Write|Edit** : **DESACTIVE** (casse regle Kevin-valide, remplace par `scripts/wiki-commit.sh`)
- **Stop** : prompt update wiki/hot.md 500 mots fin session

### Scripts custom

- `scripts/wiki-commit.sh` — commit manuel wiki/ + .raw/
- `scripts/wiki-health.sh` — health-check wiki (hot.md age, index.md sync)
- `scripts/ref-checker.sh` — etendu pour scanner wikilinks `[[file]]`
- `scripts/drift-detector.sh` — etendu pour check hot.md age + index.md vs filesystem

## 6. Regle d'or

**Une info = un seul tier.** Voir `docs/core/communication.md` section 1.5 (test arbitral).

## 7. Relation avec autres modules Core OS

| Module | Relation avec Knowledge |
|--------|-------------------------|
| Cortex | Route queries knowledge vers wiki-query skill |
| Communication | Section 1.5 test arbitral defini ici, brief v11 integre cadres HOT + WIKI |
| Monitor | `scripts/wiki-health.sh` chain dans `health-check.sh` |
| Tools | Catalogue 10 skills claude-obsidian + scripts custom |
| Planner | Plans peuvent referencer wiki/domains/<X>/concepts pour contexte |
| Worktrees | Vault wiki/ versionne git, accessible cross-worktrees |

## 8. Limites / Hors scope

- **Pinecone embeddings** : differe 12+ mois, quand > 500 pages wiki
- **Canvas export** : non automatise, Kevin cree manuellement via `/canvas`
- **Skills custom par module** (wiki-trading-strategy-doc, wiki-sante-bilan-extract, etc.) : hors scope adoption initiale. A builder quand module Phase 5 demarre (~2h par skill).

## 9. Maintenance

### Drift detection
`scripts/drift-detector.sh` verifie :
- `wiki/hot.md` age < 7 jours (sinon WARN)
- `wiki/index.md` sync avec filesystem (total pages coherent)
- Wikilinks casses dans `wiki/*.md`

### Commits
Manuel via `scripts/wiki-commit.sh` propose dans `/session-end`.

### Sauvegardes
Versionne git. Obsidian sync cloud NON utilise (privacy Phase 5).
KEOF
```
Verification : `wc -l docs/core/knowledge.md` retourne >= 180 lignes.

- [ ] **Step 6 — Update `docs/core/architecture-core.md` : ajout Phase 7 Knowledge**

Utiliser `Edit` tool :

```
old_string = "| Worktrees | Plomberie + workflow `/wt new|list|clean` | 6 | actif | scripts/worktree-*.sh + .claude/worktrees/ |"

new_string = "| Worktrees | Plomberie + workflow `/wt new|list|clean` | 6 | actif | scripts/worktree-*.sh + .claude/worktrees/ |
| Knowledge | Wiki layer persistant (claude-obsidian) | 7 | actif | wiki/ + .raw/ + 10 skills + hooks integres |"
```

Et ajouter section apres "## Worktrees (Phase 6 ...)" :

```
old_string = "## Conventions transversales"

new_string = "## Knowledge (Phase 7 — actif depuis 2026-04-15)

Spec : [docs/core/knowledge.md](knowledge.md)
- Wiki layer persistant via plugin `claude-obsidian` v1.4.1 (pattern Karpathy LLM Wiki).
- 5 domaines pre-scaffoldes (trading, finance, sante, design, dev) + 7 cross-domain.
- Couplage modules <-> wiki via frontmatter `implementation:`.
- Integration brief v11 (cadres HOT + WIKI).
- Auto-commit hook DESACTIVE (respect regle Kevin-valide).

## Conventions transversales"
```

- [ ] **Step 7 — Update `CLAUDE.md` section memoire (5 tiers + commands knowledge)**

Utiliser `Edit` tool pour update CLAUDE.md section auto-memory :

Chercher la section "## Commands" et ajouter les 4 nouvelles :

```
old_string = "## Commands (.claude/commands/)
- `/cockpit` : point d'entree unique (scan + brief + routing + cloture)
- `/session-start` + `/session-end` : protocoles session complets
- `/plan-os` : orchestrateur plans (EnterPlanMode natif)
- `/wt` : worktrees (new/list/clean)
- `/new-project` : scaffold module
- `/sync` : audit coherence"

new_string = "## Commands (.claude/commands/ + plugin claude-obsidian)
- `/cockpit` : point d'entree unique (scan + brief + routing + cloture)
- `/session-start` + `/session-end` : protocoles session complets
- `/plan-os` : orchestrateur plans (EnterPlanMode natif)
- `/wt` : worktrees (new/list/clean)
- `/new-project` : scaffold module
- `/sync` : audit coherence
- `/wiki` : bootstrap/check wiki vault (plugin claude-obsidian)
- `/save` : sauver conversation courante en wiki page
- `/autoresearch` : web research loop 3-5 rounds
- `/canvas` : Obsidian canvas visual"
```

- [ ] **Step 8 — Update `CONTEXT.md` : ligne Knowledge dans Modules + D-WIKI-01**

Utiliser `Edit` tool :

Ajout dans table Modules apres ligne "Core OS" :

```
old_string = "| Core OS | 6/6 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner, Worktrees. + Cockpit orchestrateur. |"

new_string = "| Core OS | 7/7 actif | `docs/core/` | Cortex, Communication, Monitor, Tools v2 (98 outils), Planner, Worktrees, Knowledge. + Cockpit orchestrateur. |
| Knowledge | actif (Phase 7) | `wiki/` | Claude-obsidian plugin v1.4.1. 5 domaines + 7 cross-domain. Couplage modules <-> wiki. Integration brief v11 (HOT + WIKI). |"
```

Ajout dans table Decisions :

```
old_string = "| D-LEVELUP-01 Organicite detection-only | 2026-04-15 |"

new_string = "| D-WIKI-01 Adoption claude-obsidian + 5 tiers memoire | 2026-04-15 | Plan `docs/plans/2026-04-15-wiki-obsidian-adoption.md`. Vault Obsidian pre-scaffolde 5 domaines (trading/finance/sante/design/dev). 10 skills documentes Core Tools. Hooks integres (auto-commit desactive). Couplage modules <-> wiki via frontmatter. Anti-regression validee Phase 10. |
| D-LEVELUP-01 Organicite detection-only | 2026-04-15 |"
```

- [ ] **Step 9 — Verification syntaxe docs apres edits**

```bash
# Verifier aucun fichier casse
cat docs/core/communication.md | head -30
cat docs/core/knowledge.md | head -30
cat docs/core/architecture-core.md | head -30
cat CONTEXT.md | head -30
cat CLAUDE.md | head -30

# Count lignes pour garde-fous
wc -l docs/core/communication.md CLAUDE.md CONTEXT.md
```
Expected :
- `CLAUDE.md` ≤ 200 lignes (actuel 173, tolerance garde-fou)
- `CONTEXT.md` ≤ 200 lignes (actuel 134, marge OK)
- Pas de fichier casse

- [ ] **Step 10 — Health-check + drift-detector + docs-sync-check**

```bash
bash scripts/health-check.sh 2>&1 | tail -10
bash scripts/drift-detector.sh 2>&1 | tail -10
bash scripts/docs-sync-check.sh 2>&1 | tail -10
```
Expected : verdicts inchanges ou ameliores vs baseline Phase 0.

- [ ] **Step 11 — Commit Phase 3**

```bash
git add docs/core/communication.md docs/core/knowledge.md docs/core/architecture-core.md CLAUDE.md CONTEXT.md
git status --short
git commit -m "$(cat <<'CEOF'
docs(os): formaliser 5 tiers memoire + module Knowledge Core OS

- communication.md section 1 : 4 tiers → 5 tiers (ajout wiki/)
- communication.md section 1.5 : test arbitral (nouveau — quoi va ou)
- communication.md section 6.1 : cadres HOT + WIKI dans brief v11
- knowledge.md : spec complete module Knowledge Phase 7 Core OS
- architecture-core.md : ajout module Knowledge Phase 7
- CLAUDE.md : section Commands + 4 nouveaux (/wiki /save /autoresearch /canvas)
- CONTEXT.md : ligne Knowledge dans Modules + D-WIKI-01

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 3.
Ref : D-WIKI-01.
CEOF
)"
```

**Verification finale Phase 3** :
```bash
git log --oneline -3  # 3 commits (Phase 0 init + Phase 2 scaffold + Phase 3 docs)
ls docs/core/knowledge.md
grep -c "Knowledge" docs/core/architecture-core.md  # >= 3
grep -c "wiki/" CLAUDE.md  # >= 2
grep -c "D-WIKI-01" CONTEXT.md  # >= 1
```

**Rollback Phase 3** :
```bash
git reset --hard HEAD~1
rm docs/core/knowledge.md
# communication.md + architecture-core + CLAUDE.md + CONTEXT.md reviennent a l'etat pre-Phase 3
```

**Commit message Phase 3** : `docs(os): formaliser 5 tiers memoire + module Knowledge Core OS` (Step 11).

---

### Phase 4 — Hooks integration sans regression (1h)

**Objectif** : Integrer les 4 hooks claude-obsidian proprement : SessionStart chainage avec Foundation drift-detector, PostCompact active, PostToolUse auto-commit **DESACTIVE**, Stop active avec integration session-end.

**Pre-conditions** : Phase 3 OK (docs formalisees). Backup ~/.claude/settings.json existe (Phase 1 Step 7).

**Etat repo** : 3 commits sur wt/wiki-adoption-260415.

**Actions atomiques** :

- [ ] **Step 1 — Read hooks actuels (global + plugin)**

```bash
cat ~/.claude/settings.json | python3 -m json.tool > /tmp/settings-current.json
cat ~/.claude/plugins/cache/*/claude-obsidian/*/hooks/hooks.json > /tmp/plugin-hooks.json
diff /tmp/settings-current.json /tmp/plugin-hooks.json | head -40
```
Expected : settings.json global n'a pas de hooks definis (ou hooks minimes). plugin-hooks.json a 4 hooks.

- [ ] **Step 2 — Creer `scripts/hooks/session-start-wiki.sh` (wrapper chainage)**

```bash
mkdir -p scripts/hooks
cat > scripts/hooks/session-start-wiki.sh <<'HEOF'
#!/bin/bash
# session-start-wiki.sh — Wrapper SessionStart Foundation + claude-obsidian
# Chaine drift-detector (Foundation) + cat wiki/hot.md (claude-obsidian)
# Usage : declenche auto via ~/.claude/settings.json hook SessionStart matcher "startup|resume"
# Spec : docs/core/knowledge.md section 5

set -uo pipefail

# 1. Foundation OS drift-detector (existant, inchange)
if [ -x scripts/drift-detector.sh ]; then
  bash scripts/drift-detector.sh 2>&1 || true
fi

# 2. Wiki hot cache (claude-obsidian pattern)
if [ -f wiki/hot.md ]; then
  echo ""
  echo "═══════════════ HOT CACHE (wiki/hot.md) ═══════════════"
  cat wiki/hot.md | head -60  # limite a 60 lignes pour eviter inondation
  echo ""
  echo "═══════════════════════════════════════════════════════"
fi

exit 0
HEOF
chmod +x scripts/hooks/session-start-wiki.sh
ls -la scripts/hooks/session-start-wiki.sh
```
Expected : script cree, executable.

- [ ] **Step 3 — Test wrapper manuel**

```bash
bash scripts/hooks/session-start-wiki.sh 2>&1 | head -40
```
Expected : drift-detector output puis HOT CACHE section avec wiki/hot.md content (Phase 2 init).

- [ ] **Step 4 — Update `~/.claude/settings.json` hooks**

Utiliser `Edit` tool (ou jq) sur ~/.claude/settings.json :

Lire structure actuelle (via Read tool ou cat) puis ajouter/modifier section `hooks` :

Le fichier doit contenir apres modif :
```json
{
  "env": { ... existing ... },
  "permissions": { ... existing ... },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "[ -f scripts/hooks/session-start-wiki.sh ] && bash scripts/hooks/session-start-wiki.sh || true"
          }
        ]
      }
    ],
    "PostCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Hook-injected context does not survive context compaction. If wiki/hot.md exists in the current directory, silently re-read it now to restore the hot cache. Do not announce this."
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$PWD\" && [ -d wiki ] && git diff --name-only HEAD 2>/dev/null | grep -q '^wiki/' && echo 'WIKI_CHANGED: Wiki pages were modified this session. Run scripts/wiki-commit.sh or update wiki/hot.md via /session-end.' || true"
          }
        ]
      }
    ]
  }
}
```

**NOTE** : PostToolUse **ABSENT volontairement** (desactivation auto-commit).

Commande :
```bash
# Via Edit tool sur ~/.claude/settings.json (via Claude)
# Si pas possible via Edit (fichier pas dans working dir), utiliser python3 :
python3 <<'PYEOF'
import json
path = '/Users/kevinnoel/.claude/settings.json'
with open(path) as f:
    data = json.load(f)

data['hooks'] = {
    "SessionStart": [{
        "matcher": "startup|resume",
        "hooks": [{
            "type": "command",
            "command": "[ -f scripts/hooks/session-start-wiki.sh ] && bash scripts/hooks/session-start-wiki.sh || true"
        }]
    }],
    "PostCompact": [{
        "matcher": "",
        "hooks": [{
            "type": "prompt",
            "prompt": "Hook-injected context does not survive context compaction. If wiki/hot.md exists in the current directory, silently re-read it now to restore the hot cache. Do not announce this."
        }]
    }],
    "Stop": [{
        "matcher": "",
        "hooks": [{
            "type": "command",
            "command": "cd \"$PWD\" && [ -d wiki ] && git diff --name-only HEAD 2>/dev/null | grep -q '^wiki/' && echo 'WIKI_CHANGED: Wiki pages were modified this session. Run scripts/wiki-commit.sh or update wiki/hot.md via /session-end.' || true"
        }]
    }]
}

with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print("Settings updated. Hooks added: SessionStart, PostCompact, Stop. PostToolUse DESACTIVE volontairement.")
PYEOF
```

- [ ] **Step 5 — Verifier ~/.claude/settings.json**

```bash
cat ~/.claude/settings.json | python3 -m json.tool | head -50
python3 -c "import json; d=json.load(open('/Users/kevinnoel/.claude/settings.json')); print('Hooks:', list(d.get('hooks', {}).keys())); assert 'PostToolUse' not in d.get('hooks', {}), 'ERREUR: PostToolUse doit etre absent'"
```
Expected :
- JSON valide
- Hooks : `['SessionStart', 'PostCompact', 'Stop']`
- Assert pass (PostToolUse absent)

- [ ] **Step 6 — Test SessionStart hook simulation (ne cree pas de nouvelle session)**

```bash
bash scripts/hooks/session-start-wiki.sh 2>&1 | tail -30
```
Expected : drift-detector output + HOT CACHE section visible.

- [ ] **Step 7 — Update `.claude/settings.local.json` worktree (permissions script wiki)**

Utiliser `Edit` tool pour ajouter permission :

```
old_string = "\"Bash(security find-internet-password:*)\","

new_string = "\"Bash(security find-internet-password:*)\",
      \"Bash(bash scripts/hooks/session-start-wiki.sh*)\",
      \"Bash(bash scripts/wiki-commit.sh*)\",
      \"Bash(bash scripts/wiki-health.sh*)\","
```

- [ ] **Step 8 — Commit Phase 4**

```bash
git add scripts/hooks/session-start-wiki.sh .claude/settings.local.json
git status --short
git commit -m "$(cat <<'CEOF'
feat(hooks): integrer claude-obsidian hooks sans auto-commit

- scripts/hooks/session-start-wiki.sh : wrapper SessionStart chainage drift-detector + cat wiki/hot.md
- ~/.claude/settings.json : hooks SessionStart (wrapper) + PostCompact (re-read hot.md) + Stop (notif WIKI_CHANGED)
- PostToolUse auto-commit DESACTIVE (casse regle Kevin-valide, remplace par wiki-commit.sh manuel Phase 9)
- .claude/settings.local.json : permissions bash scripts wiki-*

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 4.
Ref : D-WIKI-01.
CEOF
)"
```

**Note** : `~/.claude/settings.json` n'est PAS dans le repo (global user), donc pas de `git add`.

**Verification finale Phase 4** :
```bash
ls scripts/hooks/session-start-wiki.sh
grep -c "session-start-wiki" .claude/settings.local.json
python3 -c "import json; d=json.load(open('/Users/kevinnoel/.claude/settings.json')); print('Hooks OK:', sorted(d.get('hooks', {}).keys()))"
git log --oneline -4  # 4 commits
```

**Rollback Phase 4** :
```bash
# Restaurer settings.json global backup
cp ~/.claude/settings.json.backup-pre-wiki-260415 ~/.claude/settings.json
# Restaurer settings.local.json backup
cp .claude/settings.local.json.backup-pre-wiki-260415 .claude/settings.local.json
# Revert commit
git reset --hard HEAD~1
rm -rf scripts/hooks/
```

**Commit message Phase 4** : `feat(hooks): integrer claude-obsidian hooks sans auto-commit` (Step 8).

---

### Phase 5 — Migration auto-memory selective (1h30 - 2h)

**Objectif** : Auditer les 29 memoires auto-memory actuelles, classifier chacune (reste auto-memory / migre wiki/), migrer **1-par-1 avec ASK Kevin** (zero perte). Update MEMORY.md.

**Pre-conditions** : Phase 4 OK. Hooks testes.

**Etat repo** : 4 commits sur wt/wiki-adoption-260415.

**Actions atomiques** :

- [ ] **Step 1 — Lister 29 memoires actuelles + taille**

```bash
ls -la ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/*.md | grep -v MEMORY.md
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated/
wc -l ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md
```
Expected : 29 fichiers + 2 deprecated + MEMORY.md ~34 lignes.

- [ ] **Step 2 — Lire chaque memoire pour classifier (audit)**

```bash
# Pour chaque memoire, lire 5 premieres lignes (frontmatter + titre)
for f in ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/*.md; do
  bn=$(basename "$f")
  [ "$bn" = "MEMORY.md" ] && continue
  echo "=== $bn ==="
  head -5 "$f"
  echo ""
done > /tmp/memories-audit.log
wc -l /tmp/memories-audit.log
```
Expected : fichier audit log de ~150-200 lignes.

- [ ] **Step 3 — Classifier les 29 memoires (table decision)**

Lecture manuelle Claude (pas bash) : pour chaque memoire, decider reste auto-memory ou migre wiki/.

Classification attendue (a confirmer Phase 5 reellement) :

| Memoire | Type | Decision | Justification |
|---------|------|----------|---------------|
| `user_langue_francais.md` | user | **RESTE auto-memory** | Profile Kevin |
| `feedback_base_ds_no_archive.md` | feedback | **RESTE auto-memory** | Comportement Claude |
| `feedback_branches_convention.md` | feedback | **RESTE auto-memory** | Convention methodologie |
| `feedback_brief_format.md` | feedback | **RESTE auto-memory** | Format brief v11 |
| `feedback_communication_pedagogique.md` | feedback | **RESTE auto-memory** | Comportement Claude |
| `feedback_ds_iso_figma.md` | feedback | **RESTE auto-memory** | Preference visuelle Kevin |
| `feedback_ds_reconstruction_protocole.md` | feedback | **RESTE auto-memory** | Protocole methodologique |
| `feedback_ds_true_iso.md` | feedback | **RESTE auto-memory** | Retour experience methodologique |
| `feedback_frontload_questions.md` | feedback | **RESTE auto-memory** | Convention methodologique |
| `feedback_minimal_files.md` | feedback | **RESTE auto-memory** | Imperatif Kevin |
| `feedback_no_auto_archive.md` | feedback | **RESTE auto-memory** | Regle Kevin |
| `feedback_no_bullshit.md` | feedback | **RESTE auto-memory** | Imperatif Kevin |
| `feedback_plans_orchestrateur.md` | feedback | **RESTE auto-memory** | Convention /plan-os |
| `feedback_plans_ultra_detailles.md` | feedback | **RESTE auto-memory** | Convention plans |
| `feedback_prochaine_action_complete.md` | feedback | **RESTE auto-memory** | Convention methodologique |
| `feedback_sessions_nommage_planete.md` | feedback | **RESTE auto-memory** | Convention nommage |
| `feedback_subagents_context.md` | feedback | **RESTE auto-memory** | Convention sub-agents |
| `feedback_tdah_briefs.md` | feedback | **RESTE auto-memory** | Profile Kevin (TDAH) |
| `feedback_thinking_francais.md` | feedback | **RESTE auto-memory** | Convention language |
| `feedback_todowrite_systematique.md` | feedback | **RESTE auto-memory** | Convention methodologique |
| `feedback_tout_automatique.md` | feedback | **RESTE auto-memory** | Meta-regle automations |
| `feedback_visual_verification.md` | feedback | **RESTE auto-memory** | Convention validation |
| `feedback_worktrees_actifs.md` | feedback | **RESTE auto-memory** | Convention worktrees |
| `project_ds_refactor_app.md` | project | **RESTE auto-memory** | Etat projet WIP (refactor actif) |
| `project_migration_desktop.md` | project | **MIGRER** → `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` | Knowledge architecture atemporel |
| `project_planner_phase2.md` | project | **RESTE auto-memory** | WIP projet (backlog Phase 2) |
| `project_structure.md` | project | **RESTE auto-memory** | Etat projet courant |
| `tools_inventory.md` | reference | **MIGRER** → `wiki/entities/tools-foundation-os.md` | Entity type (outils installes) |

**Bilan** : 27 RESTE, 2 MIGRER (sur 29 total).

- [ ] **Step 4 — ASK Kevin pour valider classification (GROUPÉ)**

Afficher table ci-dessus a Kevin dans la conversation :

```
Migration selective auto-memory → wiki/ (D-WIKI-01 Phase 5)

PROPOSITION:
- 27 memoires RESTENT dans auto-memory (profile, feedback, projet WIP)
- 2 memoires MIGRENT vers wiki/ (knowledge atemporel) :
  1. project_migration_desktop.md → wiki/domains/dev/concepts/foundation-os-desktop-migration.md
     (histoire migration Desktop = knowledge architecture atemporel)
  2. tools_inventory.md → wiki/entities/tools-foundation-os.md
     (catalogue outils = entity type)

TU VALIDES ? (oui / modif / stop)
```

Attendre reponse Kevin avant de continuer.

**Si Kevin valide** : continuer Step 5.
**Si Kevin modifie** : ajuster classification, re-ASK.
**Si Kevin stop** : reset Phase 5, ne rien migrer, passer Phase 6.

- [ ] **Step 5 — Migrer `project_migration_desktop.md` (MIGRATION 1/2)**

```bash
# Source
MEM_SRC=~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_migration_desktop.md
# Cible
WIKI_DST=wiki/domains/dev/concepts/foundation-os-desktop-migration.md

# Copier content + adapter frontmatter (type: concept domain: dev)
cat "$MEM_SRC" > /tmp/migration-temp.md

# Creer fichier cible avec frontmatter wiki
cat > "$WIKI_DST" <<'MIGEOF'
---
type: concept
title: "Foundation OS Desktop Migration (2026-04-15)"
domain: dev
complexity: advanced
aliases:
  - "Desktop migration"
  - "D-DESKTOP-01"
created: 2026-04-15
updated: 2026-04-15
tags:
  - concept
  - foundation-os
  - desktop
  - migration
status: mature
confidence: high
related:
  - "[[../../../concepts/LLM Wiki Pattern]]"
  - "[[../../design/concepts/Void Glass]]"
sources: []
---

# Foundation OS — Migration Claude Code Desktop natif

> Concept migration architecturale de Foundation OS depuis workflow generic vers exploitation features natives Claude Code Desktop (2026-04-15).
> Source auto-memory initial : `project_migration_desktop.md`.

MIGEOF

# Ajouter contenu original (skip frontmatter original 6 premieres lignes)
tail -n +7 "$MEM_SRC" >> "$WIKI_DST"

# Verifier
head -20 "$WIKI_DST"
wc -l "$WIKI_DST"
```
Expected : fichier cree dans wiki/, frontmatter wiki valide, contenu preserve.

```bash
# Supprimer de auto-memory
rm "$MEM_SRC"
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_migration_desktop.md 2>&1
```
Expected : "No such file or directory" (source supprime).

- [ ] **Step 6 — Migrer `tools_inventory.md` (MIGRATION 2/2)**

```bash
MEM_SRC=~/.claude/projects/-Users-kevinnoel-foundation-os/memory/tools_inventory.md
WIKI_DST=wiki/entities/tools-foundation-os.md

cat > "$WIKI_DST" <<'MIGEOF2'
---
type: entity
title: "Foundation OS Toolchain"
entity_type: tool
aliases:
  - "Tools inventory"
  - "Foundation OS tools"
created: 2026-04-15
updated: 2026-04-15
tags:
  - entity
  - tool
  - foundation-os
status: mature
confidence: high
related:
  - "[[../../concepts/Foundation OS Architecture]]"
sources: []
---

# Foundation OS — Toolchain

> Entity regroupant les outils installes dans Foundation OS (OMC, BMAD, MCP, hooks, agents, commands).
> Source auto-memory initial : `tools_inventory.md`.

MIGEOF2

tail -n +7 "$MEM_SRC" >> "$WIKI_DST"
head -20 "$WIKI_DST"

rm "$MEM_SRC"
```

- [ ] **Step 7 — Update MEMORY.md (retirer les 2 migres)**

Utiliser `Edit` tool sur `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` :

```
old_string = "- [Outils installes](tools_inventory.md) — OMC, BMAD, MCP, hooks, agents, commands"

new_string = ""
```

```
old_string = "- [Migration Desktop 2026-04-15](project_migration_desktop.md) — DONE 9 phases. Foundation OS exploite features natives Claude Code Desktop."

new_string = ""
```

- [ ] **Step 8 — Ajouter refs wiki/ dans MEMORY.md**

Utiliser `Edit` tool :

```
old_string = "## Deprecated (voir _deprecated/)"

new_string = "## Migrees vers wiki/ (D-WIKI-01, 2026-04-15)

- `project_migration_desktop.md` → `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` (concept dev)
- `tools_inventory.md` → `wiki/entities/tools-foundation-os.md` (entity)

## Deprecated (voir _deprecated/)"
```

- [ ] **Step 9 — Update wiki/index.md avec les 2 pages migrees**

Utiliser `Edit` tool pour ajouter sections reelles dans wiki/index.md :

```
old_string = "### Concepts (knowledge atemporel)
<!-- Populated par ingest Phase 7 + -->"

new_string = "### Concepts (knowledge atemporel)
- [[domains/dev/concepts/foundation-os-desktop-migration]] — Migration Foundation OS → Claude Code Desktop natif (2026-04-15)"
```

```
old_string = "### Entities (personnes, orgs, produits, outils, repos)
<!-- Populated par ingest -->"

new_string = "### Entities (personnes, orgs, produits, outils, repos)
- [[entities/tools-foundation-os]] — Foundation OS toolchain (OMC, BMAD, MCP, hooks, agents, commands)"
```

Update aussi stats :
```
old_string = "| Concepts | 0 |"
new_string = "| Concepts | 1 |"

old_string = "| Entities | 0 |"
new_string = "| Entities | 1 |"

old_string = "| Total pages | 0 |"
new_string = "| Total pages | 2 |"
```

- [ ] **Step 10 — Update wiki/log.md avec operation migration**

Utiliser `Edit` tool :

```
old_string = "- **Phase 2** : Scaffold vault — 5 domaines (trading, finance, sante, design, dev) + 7 cross-domain (concepts, entities, sources, comparisons, questions, meta, canvases) + 5 templates + .raw/ archive"

new_string = "- **Phase 2** : Scaffold vault — 5 domaines (trading, finance, sante, design, dev) + 7 cross-domain (concepts, entities, sources, comparisons, questions, meta, canvases) + 5 templates + .raw/ archive
- **Phase 3** : Documentation 5 tiers memoire dans docs/core/communication.md + creation docs/core/knowledge.md
- **Phase 4** : Hooks integration (SessionStart wrapper + PostCompact + Stop ; PostToolUse DESACTIVE)
- **Phase 5** : Migration selective auto-memory → wiki/ (2 pages migrees : foundation-os-desktop-migration, tools-foundation-os)"
```

- [ ] **Step 11 — Update wiki/hot.md avec nouvelles phases**

Utiliser `Edit` tool pour update wiki/hot.md section "Recent Changes" et "Active Threads" :

```
old_string = "## Recent Changes

- 2026-04-15 Phase 0 : worktree `wt/wiki-adoption-260415` cree
- 2026-04-15 Phase 1 : plugin claude-obsidian installe globalement
- 2026-04-15 Phase 2 : scaffold vault (27 dossiers, 13 fichiers .md init, 5 templates)"

new_string = "## Recent Changes

- 2026-04-15 Phase 0 : worktree `wt/wiki-adoption-260415` cree
- 2026-04-15 Phase 1 : plugin claude-obsidian v1.4.1 installe globalement
- 2026-04-15 Phase 2 : scaffold vault (27 dossiers, 13 fichiers .md init, 5 templates)
- 2026-04-15 Phase 3 : documentation 5 tiers memoire + module Knowledge Core OS
- 2026-04-15 Phase 4 : hooks integres (SessionStart wrapper + PostCompact + Stop ; PostToolUse DESACTIVE)
- 2026-04-15 Phase 5 : migration selective auto-memory (2 pages → wiki/)"
```

- [ ] **Step 12 — Commit Phase 5**

```bash
git add wiki/ ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md 2>/dev/null
# Note: ~/.claude/projects/... n'est pas dans le repo git, c'est external. Seul wiki/ et plan sont versionnes.
git add wiki/
git status --short
git commit -m "$(cat <<'CEOF'
refactor(memory): migrer 2 memoires auto-memory vers wiki/ (zero perte)

- project_migration_desktop.md → wiki/domains/dev/concepts/foundation-os-desktop-migration.md (concept dev)
- tools_inventory.md → wiki/entities/tools-foundation-os.md (entity tool)
- wiki/index.md : stats 2 pages + refs
- wiki/log.md : chronological Phase 3-5
- wiki/hot.md : recent changes Phases 3-5
- MEMORY.md (auto-memory) : retire 2 migrees + ajoute section "Migrees vers wiki/"

27 memoires RESTENT auto-memory (profile, feedback, projet WIP).
Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 5.
Ref : D-WIKI-01.
CEOF
)"
```

**Verification finale Phase 5** :
```bash
ls wiki/domains/dev/concepts/foundation-os-desktop-migration.md
ls wiki/entities/tools-foundation-os.md
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/tools_inventory.md 2>&1  # doit echouer (supprime)
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_migration_desktop.md 2>&1  # doit echouer
grep -c "foundation-os-desktop-migration" wiki/index.md  # >= 1
grep -c "Migrees vers wiki/" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md  # >= 1
git log --oneline -5
```

**Rollback Phase 5** :
```bash
git reset --hard HEAD~1  # restaure wiki/
# Restaurer les 2 memoires dans auto-memory
git show HEAD:wiki/domains/dev/concepts/foundation-os-desktop-migration.md > ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_migration_desktop.md
git show HEAD:wiki/entities/tools-foundation-os.md > ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/tools_inventory.md
# Restaurer MEMORY.md manuellement (Edit tool)
```

**Commit message Phase 5** : `refactor(memory): migrer 2 memoires auto-memory vers wiki/ (zero perte)` (Step 12).

---

### Phase 6 — Adoption 10 skills + documentation Core Tools (1h)

**Objectif** : Documenter les 10 skills `claude-obsidian` dans `docs/core/tools.md` + `docs/core/tools/index.json` + `docs/core/tools/routing.json`. Les skills sont deja installes globalement (Phase 1), on les catalogue.

**Pre-conditions** : Phase 5 OK.

**Etat repo** : 5 commits sur wt/wiki-adoption-260415.

**Actions atomiques** :

- [ ] **Step 1 — Read docs/core/tools.md actuel + docs/core/tools/index.json + routing.json**

```bash
wc -l docs/core/tools.md
cat docs/core/tools/index.json | python3 -m json.tool | head -30
cat docs/core/tools/routing.json | python3 -m json.tool | head -30
```
Expected : structures comprises avant modifications.

- [ ] **Step 2 — Ajouter section "Skills Knowledge (claude-obsidian)" dans `docs/core/tools.md`**

Utiliser `Edit` tool pour inserer apres section "### CI/CD" (avant "## 2. Outils a construire") :

```
old_string = "## 2. Outils a construire (backlog)"

new_string = "## 1c. Skills Knowledge (claude-obsidian v1.4.1)

Plugin `claude-obsidian` adopte 2026-04-15 (D-WIKI-01). 10 skills + 4 commands + 3 hooks (PostToolUse auto-commit desactive).

| Skill | Role | Trigger | Allowed tools |
|-------|------|---------|---------------|
| wiki | Scaffold vault + router | `/wiki`, \"set up wiki\", \"obsidian vault\" | Read Write Edit Glob Grep Bash |
| wiki-ingest | Ingest source (URL/PDF/image) → pages wiki | \"ingest [file]\", \"ingest this URL\" | Read Write Edit Glob Grep Bash WebFetch |
| wiki-query | Search multi-depth dans vault | Question sur contenu wiki | Read Glob Grep |
| wiki-lint | Qualite vault (broken links, orphans) | \"lint wiki\", \"check vault\" | Read Write Edit Glob Grep |
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
| `/save [name]` | save | Sauver conversation |
| `/autoresearch [topic]` | autoresearch | Research loop |
| `/canvas [desc]` | canvas | Canvas visual |

### Hooks associes (voir `docs/core/knowledge.md` section 5)

| Hook | Etat | Role |
|------|------|------|
| SessionStart | **INTEGRE** | Wrapper `scripts/hooks/session-start-wiki.sh` (Foundation drift-detector + cat wiki/hot.md) |
| PostCompact | **ACTIF** | Re-cat wiki/hot.md apres compactage (preserve hot cache) |
| PostToolUse Write\\|Edit | **DESACTIVE** | Auto-commit wiki/ — casse regle Kevin-valide. Remplace par `scripts/wiki-commit.sh` manuel (Phase 9) |
| Stop | **ACTIF** | Notif WIKI_CHANGED si wiki/ modifie — prompt update hot.md dans `/session-end` |

### Scripts custom Foundation OS (Phase 9)

| Script | Role |
|--------|------|
| `scripts/wiki-commit.sh` | Commit manuel wiki/ + .raw/ (respect Kevin-valide) |
| `scripts/wiki-health.sh` | Health-check wiki (hot.md age, index.md sync, pages count) |
| `scripts/hooks/session-start-wiki.sh` | Wrapper SessionStart chainage |

## 2. Outils a construire (backlog)"
```

- [ ] **Step 3 — Update `docs/core/tools/index.json` : ajout 10 entrees**

```bash
# Lire JSON actuel
python3 <<'PYEOF'
import json
path = 'docs/core/tools/index.json'
with open(path) as f:
    data = json.load(f)

# Ajouter categorie 'knowledge-skills' si absente
if 'knowledge-skills' not in data.get('categories', {}):
    data.setdefault('categories', {})['knowledge-skills'] = {
        "name": "Skills Knowledge (claude-obsidian)",
        "description": "Plugin claude-obsidian v1.4.1 — 10 skills wiki/knowledge layer",
        "count": 10,
        "tools": [
            {"name": "wiki", "role": "Scaffold vault + router", "allowed_tools": ["Read", "Write", "Edit", "Glob", "Grep", "Bash"], "trigger_keywords": ["/wiki", "set up wiki", "obsidian vault"]},
            {"name": "wiki-ingest", "role": "Ingest source → wiki pages", "allowed_tools": ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebFetch"], "trigger_keywords": ["ingest", "paste this URL", "add to wiki"]},
            {"name": "wiki-query", "role": "Search multi-depth dans vault", "allowed_tools": ["Read", "Glob", "Grep"], "trigger_keywords": ["what do you know about", "search wiki"]},
            {"name": "wiki-lint", "role": "Qualite vault (broken links, orphans)", "allowed_tools": ["Read", "Write", "Edit", "Glob", "Grep"], "trigger_keywords": ["lint wiki", "check vault"]},
            {"name": "save", "role": "Conversation → wiki page", "allowed_tools": ["Read", "Write", "Edit", "Glob", "Grep"], "trigger_keywords": ["/save", "save this conversation"]},
            {"name": "autoresearch", "role": "Web research loop 3-5 rounds", "allowed_tools": ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebFetch"], "trigger_keywords": ["/autoresearch", "research topic"]},
            {"name": "canvas", "role": "Obsidian canvas visual", "allowed_tools": ["Read", "Write", "Edit", "Glob"], "trigger_keywords": ["/canvas", "build a canvas"]},
            {"name": "defuddle", "role": "Clean article web", "allowed_tools": ["Read", "Bash"], "trigger_keywords": ["defuddle URL"]},
            {"name": "obsidian-bases", "role": "Dataview replacement natif", "allowed_tools": ["Read", "Write", "Edit", "Glob", "Grep"], "trigger_keywords": ["obsidian base", "dashboard"]},
            {"name": "obsidian-markdown", "role": "Syntax kepano standardisee", "allowed_tools": ["Read", "Write", "Edit"], "trigger_keywords": ["obsidian markdown", "kepano syntax"]}
        ]
    }

# Update total count
total = sum(cat.get('count', 0) for cat in data.get('categories', {}).values())
data['total_tools'] = total

with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"index.json updated. Total tools: {total}")
PYEOF
```
Expected : "index.json updated. Total tools: 108" (ou similaire, ajout de 10 au count actuel).

- [ ] **Step 4 — Update `docs/core/tools/routing.json` : ajout triggers wiki-***

```bash
python3 <<'PYEOF'
import json
path = 'docs/core/tools/routing.json'
with open(path) as f:
    data = json.load(f)

# Ajouter regles routing knowledge
new_rules = [
    {"pattern": "ingest .*\\.(pdf|md|txt|json)$", "tool": "wiki-ingest", "confidence": "high"},
    {"pattern": "ingest https?://", "tool": "wiki-ingest", "confidence": "high"},
    {"pattern": "/save( .+)?", "tool": "save", "confidence": "high"},
    {"pattern": "/autoresearch .+", "tool": "autoresearch", "confidence": "high"},
    {"pattern": "/canvas .+", "tool": "canvas", "confidence": "high"},
    {"pattern": "/wiki( .+)?", "tool": "wiki", "confidence": "high"},
    {"pattern": "what do you know about", "tool": "wiki-query", "confidence": "medium"},
    {"pattern": "lint wiki|check vault", "tool": "wiki-lint", "confidence": "high"},
    {"pattern": "obsidian (canvas|base|markdown)", "tool": "obsidian-bases|canvas|obsidian-markdown", "confidence": "medium"}
]

data.setdefault('rules', []).extend(new_rules)
data['rules_count'] = len(data['rules'])

with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"routing.json updated. Total rules: {data['rules_count']}")
PYEOF
```
Expected : "routing.json updated. Total rules: 35" (ou similaire).

- [ ] **Step 5 — Verifier syntaxe JSON valide**

```bash
python3 -c "import json; json.load(open('docs/core/tools/index.json')); print('index.json OK')"
python3 -c "import json; json.load(open('docs/core/tools/routing.json')); print('routing.json OK')"
```
Expected : 2 lignes "XXX.json OK".

- [ ] **Step 6 — Update `docs/core/tools/README.md` (vue lisible) si existe**

```bash
if [ -f docs/core/tools/README.md ]; then
  # Ajouter section knowledge-skills dans README
  cat >> docs/core/tools/README.md <<'REOF'

## Knowledge Skills (claude-obsidian v1.4.1)

10 skills adoptes 2026-04-15 (D-WIKI-01). Voir `docs/core/tools.md` section 1c pour le catalogue complet.

- wiki, wiki-ingest, wiki-query, wiki-lint (vault core)
- save, autoresearch, canvas (workflows)
- defuddle, obsidian-bases, obsidian-markdown (utilitaires Obsidian)

Integration : `docs/core/knowledge.md`.
REOF
fi
```

- [ ] **Step 7 — Verification `tool-register.sh` recompte correctement**

```bash
bash scripts/tool-register.sh --help 2>&1 | head -10 || echo "tool-register --help failed"
bash scripts/tool-register.sh --count 2>&1 || echo "tool-register --count not available"
```
Expected : script affiche help ou count coherent.

- [ ] **Step 8 — Commit Phase 6**

```bash
git add docs/core/tools.md docs/core/tools/index.json docs/core/tools/routing.json docs/core/tools/README.md
git status --short
git commit -m "$(cat <<'CEOF'
docs(tools): documenter 10 skills claude-obsidian dans Core Tools

- tools.md section 1c : catalogue 10 skills + commands + hooks + scripts custom
- tools/index.json : categorie 'knowledge-skills' avec 10 entrees (wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown)
- tools/routing.json : 9 nouvelles regles routing (triggers keywords)
- tools/README.md : section knowledge-skills recap

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 6.
Ref : D-WIKI-01.
CEOF
)"
```

**Verification finale Phase 6** :
```bash
grep -c "wiki-ingest" docs/core/tools.md  # >= 2
python3 -c "import json; d=json.load(open('docs/core/tools/index.json')); print('knowledge-skills' in d.get('categories', {}))"
python3 -c "import json; d=json.load(open('docs/core/tools/routing.json')); print(any('wiki' in r.get('tool','') for r in d.get('rules', [])))"
git log --oneline -6  # 6 commits
```

**Rollback Phase 6** :
```bash
git reset --hard HEAD~1
```

**Commit message Phase 6** : `docs(tools): documenter 10 skills claude-obsidian dans Core Tools` (Step 8).

---

### Phase 7 — Premier ingest test Karpathy + AgriciDaniel (45 min)

**Objectif** : Tester le pipeline d'ingestion en reel avec 2 sources (article Karpathy LLM Wiki + page AgriciDaniel claude-obsidian). Valider que les pages wiki/ sont bien creees avec wikilinks et cross-refs.

**Pre-conditions** : Phase 6 OK. Skills `wiki-ingest` dispo (Phase 1).

**Etat repo** : 6 commits sur wt/wiki-adoption-260415.

**Actions atomiques** :

- [ ] **Step 1 — Preparer fichier source Karpathy LLM Wiki**

Sauvegarder le contenu essentiel de l'article Karpathy (provenant de la conversation initiale) dans `.raw/articles/`.

```bash
cat > .raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md <<'KEOF'
---
source_url: https://mindstudio.io/posts/karpathy-llm-wiki
source_type: article
author: Andrej Karpathy
date_published: 2026-04
fetched: 2026-04-15
---

# The Karpathy LLM Wiki Pattern

## Context

En avril 2026, Andrej Karpathy a partage une idee simple mais puissante :
Au lieu de donner des documents bruts a un LLM, fais-lui pre-compiler tes sources dans un wiki Markdown structure. Ensuite, fais-le operer sur ce wiki.

## Key Insight

Les LLMs raisonnent tres bien sur du texte Markdown long et structure. Pas besoin d'embeddings ou de RAG complexe pour ca.

## How It Works

1. Claude Code cree un dossier memory/ dans ton projet
2. Il maintient un fichier MEMORY.md (index de toutes ses notes)
3. A chaque session, il lit son index, retrouve le contexte pertinent
4. En fin de session, il met a jour ses notes automatiquement
5. Le fichier hot.md sert de cache : resume compact de la derniere session, lu en premier au demarrage

## Hot Cache

Le hot cache est la feature la plus sous-estimee. Claude met a jour hot.md a la fin de chaque session avec un resume compact (~500 mots). La session suivante lit ce fichier en premier. Tu ne reconstruis jamais le contexte.

## Compounding Knowledge

Ca se renforce avec le temps. Plus Claude accumule de contexte, plus il est precis et pertinent dans ses reponses.

## Limits

Au-dela de quelques centaines de fichiers Markdown, le systeme atteint ses limites (taille contexte, couts tokens, performance).

## Extension Pinecone

Pour archivage long terme + recherche semantique : Pinecone (vector DB) comme couche complementaire au vault Obsidian.

## Entities

- **Andrej Karpathy** : AI researcher, ex-Tesla AI director, createur pattern LLM Wiki
- **Pinecone** : vector DB managee (plan Starter gratuit)
- **Obsidian** : editeur Markdown local gratuit (obsidian.md)

## Concepts Introduced

- LLM Wiki Pattern
- Hot Cache
- Compounding Knowledge
- Vault structure (memory/, hot.md, MEMORY.md index)
KEOF

ls -la .raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md
wc -l .raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md
```
Expected : fichier cree, ~40-50 lignes.

- [ ] **Step 2 — Preparer fichier source AgriciDaniel claude-obsidian**

```bash
cat > .raw/articles/agricidaniel-claude-obsidian-2026-04-15.md <<'AEOF'
---
source_url: https://github.com/AgriciDaniel/claude-obsidian
source_type: repo
author: AgriciDaniel
date_published: 2026-04-13
fetched: 2026-04-15
stars: 1279
release_latest: v1.4.1
---

# claude-obsidian (AgriciDaniel)

## Context

Plugin Claude Code qui implemente le pattern Karpathy LLM Wiki avec Obsidian. 1279 stars, derniere release v1.4.1 (2026-04).

## Architecture

```
vault/
├── .raw/       # Layer 1 : immutable source documents
├── wiki/       # Layer 2 : LLM-generated knowledge base
└── CLAUDE.md   # Layer 3 : schema and instructions
```

## 10 Skills

1. wiki — scaffold vault + router
2. wiki-ingest — source → wiki pages
3. wiki-query — search multi-depth
4. wiki-lint — qualite vault
5. save — conversation → wiki page
6. autoresearch — web research loop 3-5 rounds
7. canvas — Obsidian canvas visual
8. defuddle — clean article web
9. obsidian-bases — Dataview replacement natif
10. obsidian-markdown — syntax kepano

## 4 Commands

- `/wiki` — bootstrap/check vault
- `/save [name]` — save conversation
- `/autoresearch [topic]` — research loop
- `/canvas [desc]` — canvas visual

## 4 Hooks

- SessionStart : cat wiki/hot.md silent
- PostCompact : re-cat hot.md apres compactage
- PostToolUse Write|Edit : **AUTO-COMMIT** (casse regle Kevin-valide, a desactiver)
- Stop : prompt update hot.md

## 5 Templates

concept, source, entity, comparison, question (dans _templates/ ou wiki/meta/templates/).

## Install

```bash
claude plugin marketplace add AgriciDaniel/claude-obsidian
claude plugin install claude-obsidian@claude-obsidian-marketplace
```

## Ecosystem (research Foundation OS)

Autres projets Claude + Obsidian :
- Ar9av-obsidian-wiki
- Nexus-claudesidian-mcp
- ballred-obsidian-claude-pkm
- rvk7895-llm-knowledge-bases
- kepano-obsidian-skills
- Claudian-YishenTu

## Entities

- **AgriciDaniel** : developer claude-obsidian plugin
- **Obsidian app** : editeur Markdown local gratuit
- **kepano** : createur Obsidian, auteur obsidian-skills

## Concepts Introduced

- Plugin Claude Code pour wiki vault
- Multi-agent bootstrap files (Codex, OpenCode, Gemini, Cursor, Windsurf, GitHub Copilot)
- Delta tracking manifest (.raw/.manifest.json)
- Canvas JSON 1.0 spec
AEOF

ls -la .raw/articles/agricidaniel-claude-obsidian-2026-04-15.md
```
Expected : fichier cree.

- [ ] **Step 3 — Invoquer le skill `wiki-ingest` sur les 2 sources (manuel)**

Le skill `wiki-ingest` est invoque via `Skill` tool ou en demandant a Claude :

Dans la conversation :
```
Invoque le skill wiki-ingest sur ces 2 fichiers :
- .raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md
- .raw/articles/agricidaniel-claude-obsidian-2026-04-15.md

Ingestion dans wiki/ selon structure :
- karpathy → wiki/concepts/ (LLM Wiki Pattern, Hot Cache, Compounding Knowledge), wiki/entities/ (Andrej Karpathy, Pinecone, Obsidian), wiki/sources/ (karpathy-llm-wiki-pattern)
- agricidaniel → wiki/entities/ (AgriciDaniel, kepano), wiki/sources/ (agricidaniel-claude-obsidian), wiki/concepts/ (si non deja crees)

Cross-refs : Karpathy ↔ AgriciDaniel ↔ claude-obsidian ↔ Foundation OS.
Update wiki/index.md + wiki/log.md + wiki/hot.md apres ingest.
```

Attendu : le skill cree ~8-15 pages avec wikilinks + cross-refs.

- [ ] **Step 4 — Verifier pages wiki crees**

```bash
ls wiki/concepts/
ls wiki/entities/
ls wiki/sources/
find wiki/ -name "*.md" -newer .raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md | head -20
```
Expected minimal :
- wiki/concepts/ : `LLM Wiki Pattern.md`, `Hot Cache.md`, `Compounding Knowledge.md` (3 concepts)
- wiki/entities/ : `Andrej Karpathy.md`, `AgriciDaniel.md`, `Obsidian.md`, `Pinecone.md`, `kepano.md` (5 entities)
- wiki/sources/ : `karpathy-llm-wiki-pattern.md`, `agricidaniel-claude-obsidian.md` (2 sources)

Total ~10 nouveaux fichiers.

- [ ] **Step 5 — Verifier wikilinks dans pages crees**

```bash
for f in wiki/concepts/*.md wiki/entities/*.md wiki/sources/*.md; do
  echo "=== $f ==="
  grep -c "\[\[.*\]\]" "$f" | head -1
done
```
Expected : chaque page a >= 3 wikilinks vers autres pages.

- [ ] **Step 6 — Verifier update wiki/index.md + log.md + hot.md**

```bash
grep -c "\[\[concepts/LLM Wiki Pattern\]\]" wiki/index.md  # ou similaire
grep -c "Phase 7" wiki/log.md
grep -c "ingest" wiki/hot.md
```
Expected : index, log, hot.md updates.

- [ ] **Step 7 — Test `wiki-query` search via Claude**

Dans la conversation :
```
Invoque wiki-query : que sais-tu sur le LLM Wiki Pattern ?
```

Expected : Claude lit `wiki/hot.md` + `wiki/index.md`, identifie `wiki/concepts/LLM Wiki Pattern.md`, lit la page, repond avec citations des sources wiki (pas training data).

- [ ] **Step 8 — Ouvrir Obsidian app + graph view**

```bash
open -a Obsidian "$(pwd)/wiki"
```

Kevin verifie visuellement :
- Graph view montre les nouvelles pages connectees par wikilinks
- Clusters visibles (Karpathy cluster, AgriciDaniel cluster)
- Contradictions flagged en `[!contradiction]` callouts si applicable

- [ ] **Step 9 — Commit Phase 7**

```bash
git add .raw/articles/ wiki/
git status --short
git commit -m "$(cat <<'CEOF'
wiki: first ingest — Karpathy LLM Wiki + AgriciDaniel claude-obsidian

Sources :
- .raw/articles/karpathy-llm-wiki-pattern-2026-04-15.md
- .raw/articles/agricidaniel-claude-obsidian-2026-04-15.md

Pages crees (~10) :
- wiki/concepts/LLM Wiki Pattern.md
- wiki/concepts/Hot Cache.md
- wiki/concepts/Compounding Knowledge.md
- wiki/entities/Andrej Karpathy.md
- wiki/entities/AgriciDaniel.md
- wiki/entities/Obsidian.md
- wiki/entities/Pinecone.md
- wiki/entities/kepano.md
- wiki/sources/karpathy-llm-wiki-pattern.md
- wiki/sources/agricidaniel-claude-obsidian.md

Cross-refs : Karpathy <-> AgriciDaniel <-> claude-obsidian <-> Foundation OS.
Validation visuelle Obsidian graph view OK (Kevin).

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 7.
Ref : D-WIKI-01.
CEOF
)"
```

**Verification finale Phase 7** :
```bash
find wiki/{concepts,entities,sources} -name "*.md" | wc -l  # >= 10 nouveaux (sauf ceux deja Phase 5)
ls .raw/articles/*.md | wc -l  # 2
git log --oneline -7
```

**Rollback Phase 7** :
```bash
git reset --hard HEAD~1
rm -f .raw/articles/karpathy-*.md .raw/articles/agricidaniel-*.md
# wiki/ revient a l'etat post-Phase 5
```

**Commit message Phase 7** : `wiki: first ingest — Karpathy LLM Wiki + AgriciDaniel claude-obsidian` (Step 9).

---

### Phase 8 — Brief v11 enrichi (cadres HOT + WIKI) (1h)

**Objectif** : Integrer les cadres HOT + WIKI dans le brief v11 de Foundation OS. Update `session-start.md` (Tour 1 lecture wiki/hot.md) + `session-end.md` (Tour 3 update hot.md + log.md) + `health-check.sh` (section INFO wiki).

**Pre-conditions** : Phase 7 OK (wiki/ populate par ingest, ~12 pages au total).

**Etat repo** : 7 commits.

**Actions atomiques** :

- [ ] **Step 1 — Update `.claude/commands/session-start.md` : Tour 1 ajout lecture wiki/hot.md**

Utiliser `Edit` tool :

```
old_string = "> **Tour 1 (parallele, OBLIGATOIRE)** :
> 1. `Read CONTEXT.md`
> 2. `Bash git status --short && git log -1 --format=\"%cr · %h · %s\" && git branch --show-current && git worktree list`
> 3. `Bash bash scripts/health-check.sh 2>&1 | tail -25`
> 4. `Glob docs/plans/*.md`"

new_string = "> **Tour 1 (parallele, OBLIGATOIRE)** :
> 1. `Read CONTEXT.md`
> 2. `Read wiki/hot.md` (si existe — cache narratif 500 mots derniere session)
> 3. `Bash git status --short && git log -1 --format=\"%cr · %h · %s\" && git branch --show-current && git worktree list`
> 4. `Bash bash scripts/health-check.sh 2>&1 | tail -25`
> 5. `Glob docs/plans/*.md`
> 6. `Bash bash scripts/wiki-health.sh 2>&1 | tail -10` (si existe — verifier hot.md age + pages count)"
```

Update Phase 1 collecte :

```
old_string = "1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti). Sections : Modules, Sessions recentes, Cap, Idees & Parking, En attente Kevin, Decisions, Metriques, Chantier en cours (si actif)"

new_string = "1. **CONTEXT.md** : lire ENTIER (< 150 lignes garanti). Sections : Modules, Sessions recentes, Cap, Idees & Parking, En attente Kevin, Decisions, Metriques, Chantier en cours (si actif)
1b. **wiki/hot.md** : lire ENTIER (< 500 mots garanti) pour cache narratif derniere session (nouveau D-WIKI-01)"
```

Update Phase 3 sections brief :

```
old_string = "**Sections du brief debut de session** (ordre, voir spec) :
1. Sante (health-check + build + worktree actif)
2. Trajectoire (mission + focus + tendance + derniere decision)
3. Plans actifs (1 sous-cadre par plan actif avec progression + hier + prochain + reste)
4. Modules (Code + Meta + Prevu) + Acces
5. Attention (alertes + rappels + en attente Kevin)
6. Dernier travail (commits + bullets vulgarises)
7. Statut projet (modules + chantier en cours)
8. Idees (3-5 max recentes)
9. Reflexion (1-3 lignes optionnelles)
10. Historique (3 decisions recentes)
11. Cap (direction + prochaine action)
12. Input (question ouverte ou choix structure)"

new_string = "**Sections du brief debut de session** (ordre, voir spec — 14 sections post-D-WIKI-01) :
1. Sante (health-check + build + worktree actif)
2. **HOT (NOUVEAU — lecture wiki/hot.md, 3-5 lignes condensees)**
3. Trajectoire (mission + focus + tendance + derniere decision)
4. Plans actifs (1 sous-cadre par plan actif avec progression + hier + prochain + reste)
5. **WIKI (NOUVEAU — compteur pages / sources / domaines + derniere ingest)**
6. Modules (Code + Meta + Prevu) + Acces
7. Attention (alertes + rappels + en attente Kevin)
8. Dernier travail (commits + bullets vulgarises)
9. Statut projet (modules + chantier en cours)
10. Idees (3-5 max recentes)
11. Reflexion (1-3 lignes optionnelles)
12. Historique (3 decisions recentes)
13. Cap (direction + prochaine action)
14. Input (question ouverte ou choix structure)"
```

- [ ] **Step 2 — Update `.claude/commands/session-end.md` : Tour 3 ajout update hot.md + log.md**

Utiliser `Edit` tool :

```
old_string = "> **Tour 3 (OBLIGATOIRE si changements)** :
> 7. `Edit CONTEXT.md` — ajouter entree Sessions recentes, update Cap + Decisions si applicable
> 8. Proposer commit conventionnel (pas de `git commit` automatique, attendre OK Kevin)"

new_string = "> **Tour 3 (OBLIGATOIRE si changements)** :
> 7. `Edit CONTEXT.md` — ajouter entree Sessions recentes, update Cap + Decisions si applicable
> 8. `Edit wiki/hot.md` — update cache narratif 500 mots avec resume de cette session (Last Updated / Key Recent Facts / Recent Changes / Active Threads / Next Action)
> 9. `Edit wiki/log.md` — ajouter operations wiki de cette session (ingest, save, migrate, canvas, etc.) si applicable
> 10. Si `scripts/wiki-commit.sh` detecte wiki/ modifie non committe → proposer commit wiki separe
> 11. Proposer commit conventionnel (pas de `git commit` automatique, attendre OK Kevin)"
```

Ajouter section 5bis ou adapter Phase 5 :

```
old_string = "### 5.9 Verification finale
- Relire CONTEXT.md apres modifications
- Verifier < 200 lignes (sinon warning + compresser)
- Verifier coherence : ce qui est dans les sessions recentes correspond aux commits reels"

new_string = "### 5.9 Verification finale
- Relire CONTEXT.md apres modifications
- Verifier < 200 lignes (sinon warning + compresser)
- Verifier coherence : ce qui est dans les sessions recentes correspond aux commits reels

### 5.10 Update wiki/hot.md (OBLIGATOIRE si session a modifie wiki/ OU si dernier update > 48h)

Format hot.md (500 mots max) :

```markdown
---
type: meta
title: \"Hot Cache Foundation OS\"
updated: YYYY-MM-DDTHH:MM:SS
tags: [meta, hot-cache]
status: evergreen
---

# Hot Cache

## Last Updated
YYYY-MM-DD : [ce qui s'est passe cette session en 1-2 phrases]

## Key Recent Facts
- [fact stable 1]
- [fact stable 2]

## Recent Changes
- [change 1 session courante]
- [change 2 session courante]

## Active Threads
- [thread en cours 1]
- [thread en cours 2]

## Next Action
[prochaine action prevue la prochaine session]
```

### 5.11 Update wiki/log.md (si operations wiki cette session)

Ajouter dans section date du jour les operations : ingest, save, migrate, canvas, lint, etc."
```

- [ ] **Step 3 — Update `scripts/health-check.sh` : section INFO ajout wiki check**

Utiliser `Edit` tool :

```
old_string = "# Drift detector (level-up phase 6 chain)
if [ -x scripts/drift-detector.sh ]; then
  DRIFT_OUT=$(bash scripts/drift-detector.sh 2>&1); DRIFT_RC=$?
  if [ $DRIFT_RC -eq 0 ]; then
    echo -e \"  ${DIM}[OK]${RST} Drift detector : SYNC\"
  elif [ $DRIFT_RC -eq 1 ]; then
    DRIFT_N=$(echo \"$DRIFT_OUT\" | grep -oE \"\\([0-9]+ drifts\" | head -1 | grep -oE \"[0-9]+\")
    echo -e \"  ${YEL}[WARN]${RST} Drift detector : ${DRIFT_N:-?} drifts (voir bash scripts/drift-detector.sh)\"
    WARNING=$((WARNING + 1))
  fi
fi

echo \"\""

new_string = "# Drift detector (level-up phase 6 chain)
if [ -x scripts/drift-detector.sh ]; then
  DRIFT_OUT=$(bash scripts/drift-detector.sh 2>&1); DRIFT_RC=$?
  if [ $DRIFT_RC -eq 0 ]; then
    echo -e \"  ${DIM}[OK]${RST} Drift detector : SYNC\"
  elif [ $DRIFT_RC -eq 1 ]; then
    DRIFT_N=$(echo \"$DRIFT_OUT\" | grep -oE \"\\([0-9]+ drifts\" | head -1 | grep -oE \"[0-9]+\")
    echo -e \"  ${YEL}[WARN]${RST} Drift detector : ${DRIFT_N:-?} drifts (voir bash scripts/drift-detector.sh)\"
    WARNING=$((WARNING + 1))
  fi
fi

# Wiki health (D-WIKI-01, Phase 8 chain)
if [ -x scripts/wiki-health.sh ]; then
  WIKI_OUT=$(bash scripts/wiki-health.sh 2>&1); WIKI_RC=$?
  WIKI_LAST_LINE=$(echo \"$WIKI_OUT\" | tail -1)
  if [ $WIKI_RC -eq 0 ]; then
    echo -e \"  ${DIM}[OK]${RST} Wiki : $WIKI_LAST_LINE\"
  else
    echo -e \"  ${YEL}[WARN]${RST} Wiki : $WIKI_LAST_LINE\"
    WARNING=$((WARNING + 1))
  fi
elif [ -d wiki/ ]; then
  WIKI_PAGES=$(find wiki/ -name '*.md' | wc -l | tr -d ' ')
  echo -e \"  ${DIM}[OK]${RST} Wiki : ${WIKI_PAGES} pages (wiki-health.sh non installe)\"
fi

echo \"\""
```

- [ ] **Step 4 — Test /session-start manuel complet**

Dans la conversation :
```
/session-start
```

Expected : brief v11 produit avec :
- Cadre SANTE (inchange)
- Cadre HOT (NOUVEAU) avec extrait de wiki/hot.md
- Cadre TRAJECTOIRE (inchange)
- Cadre PLANS ACTIFS (nouveau affiche plan wiki-obsidian-adoption Phase 8)
- Cadre WIKI (NOUVEAU) avec compteur pages/sources/domaines
- Cadre MODULES avec Knowledge ligne (Phase 7 actif)
- Suite brief v11 normale

Kevin valide visuellement : cadres HOT + WIKI affiches correctement ?

- [ ] **Step 5 — Commit Phase 8**

```bash
git add .claude/commands/session-start.md .claude/commands/session-end.md scripts/health-check.sh
git status --short
git commit -m "$(cat <<'CEOF'
feat(brief): cadres HOT + WIKI dans brief v11 + hooks session-start/end

- .claude/commands/session-start.md : Tour 1 ajout Read wiki/hot.md + wiki-health.sh
  Tour 3 : brief 14 sections (ajout cadre HOT entre SANTE et TRAJECTOIRE,
  cadre WIKI entre PLANS ACTIFS et MODULES)
- .claude/commands/session-end.md : Tour 3 ajout update wiki/hot.md (500 mots)
  + update wiki/log.md si operations wiki
  Section 5.10 + 5.11 : format hot.md + log.md
- scripts/health-check.sh : section INFO ajout check wiki-health.sh + fallback pages count

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 8.
Ref : D-WIKI-01.
CEOF
)"
```

**Verification finale Phase 8** :
```bash
grep -c "HOT" .claude/commands/session-start.md  # >= 2
grep -c "wiki/hot.md" .claude/commands/session-end.md  # >= 2
grep -c "Wiki :" scripts/health-check.sh  # >= 1
git log --oneline -8
```

**Rollback Phase 8** :
```bash
git reset --hard HEAD~1
```

**Commit message Phase 8** : `feat(brief): cadres HOT + WIKI dans brief v11 + hooks session-start/end` (Step 5).

---

### Phase 9 — Scripts custom wiki-commit + wiki-health + ref-checker extended (1h)

**Objectif** : Creer scripts Foundation OS specifiques wiki : `wiki-commit.sh` (remplace auto-commit hook desactive), `wiki-health.sh` (check sante wiki), update `ref-checker.sh` (scan wikilinks), update `drift-detector.sh` (hot.md age + index sync).

**Pre-conditions** : Phase 8 OK.

**Etat repo** : 8 commits.

**Actions atomiques** :

- [ ] **Step 1 — Creer `scripts/wiki-commit.sh` (remplace auto-commit hook)**

```bash
cat > scripts/wiki-commit.sh <<'WCEOF'
#!/bin/bash
# wiki-commit.sh — Commit manuel wiki/ + .raw/ (remplace PostToolUse auto-commit desactive)
# Usage : bash scripts/wiki-commit.sh [--message "custom"] [--dry-run]
# Spec : docs/core/knowledge.md section 5 (scripts custom)
# Regle Kevin-valide : jamais de commit automatique, toujours valide manuellement.

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RST='\033[0m'

DRY_RUN=0
CUSTOM_MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --message) CUSTOM_MSG="$2"; shift 2 ;;
    --help)
      echo "Usage: bash scripts/wiki-commit.sh [--message \"custom\"] [--dry-run]"
      echo "Commit manuel de wiki/ + .raw/ avec message conventional."
      exit 0
      ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

# Check si wiki/ ou .raw/ modifies
CHANGED=$(git diff --name-only HEAD 2>/dev/null | grep -E "^(wiki/|.raw/)" | wc -l | tr -d ' ')
UNTRACKED=$(git ls-files --others --exclude-standard | grep -E "^(wiki/|.raw/)" | wc -l | tr -d ' ')

if [ "$CHANGED" -eq 0 ] && [ "$UNTRACKED" -eq 0 ]; then
  echo -e "${GRN}[OK]${RST} wiki/ + .raw/ clean (rien a commit)"
  exit 0
fi

echo -e "${YEL}[INFO]${RST} Wiki changes : $CHANGED modifies + $UNTRACKED untracked"
echo ""
echo "Files :"
git diff --name-only HEAD | grep -E "^(wiki/|.raw/)" | sed 's/^/  /'
git ls-files --others --exclude-standard | grep -E "^(wiki/|.raw/)" | sed 's/^/  /'
echo ""

# Commit message
if [ -n "$CUSTOM_MSG" ]; then
  MSG="$CUSTOM_MSG"
else
  DATE=$(date +"%Y-%m-%d %H:%M")
  MSG="wiki: manual commit $DATE ($CHANGED modified + $UNTRACKED added)"
fi

echo "Commit message : $MSG"
echo ""

if [ $DRY_RUN -eq 1 ]; then
  echo -e "${YEL}[DRY-RUN]${RST} Pas de commit effectue."
  exit 0
fi

git add wiki/ .raw/
git commit -m "$MSG"

echo ""
echo -e "${GRN}[OK]${RST} Commit cree : $(git log -1 --format="%h %s")"
WCEOF
chmod +x scripts/wiki-commit.sh
bash scripts/wiki-commit.sh --help
```
Expected : help affiche.

- [ ] **Step 2 — Creer `scripts/wiki-health.sh` (health-check specifique wiki)**

```bash
cat > scripts/wiki-health.sh <<'WHEOF'
#!/bin/bash
# wiki-health.sh — Health-check specifique wiki/
# Checks : hot.md age, index.md sync vs filesystem, pages count, broken wikilinks
# Usage : bash scripts/wiki-health.sh
# Exit codes : 0=SAIN, 1=WARN, 2=BROKEN

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

RED='\033[0;31m'
YEL='\033[0;33m'
GRN='\033[0;32m'
RST='\033[0m'

WARN=0
BROKEN=0

if [ ! -d wiki/ ]; then
  echo -e "${YEL}[INFO]${RST} Wiki absent (pas d'adoption claude-obsidian)"
  exit 0
fi

# Check hot.md existe + age
if [ -f wiki/hot.md ]; then
  HOT_AGE_DAYS=$(( ($(date +%s) - $(stat -f %m wiki/hot.md 2>/dev/null || stat -c %Y wiki/hot.md)) / 86400 ))
  if [ "$HOT_AGE_DAYS" -gt 7 ]; then
    echo -e "  ${YEL}[WARN]${RST} wiki/hot.md age : ${HOT_AGE_DAYS}j (> 7j, update recommande via /session-end)"
    WARN=$((WARN + 1))
  else
    echo -e "  ${GRN}[OK]${RST} wiki/hot.md age : ${HOT_AGE_DAYS}j"
  fi
else
  echo -e "  ${RED}[BROKEN]${RST} wiki/hot.md manquant"
  BROKEN=$((BROKEN + 1))
fi

# Check index.md existe
if [ -f wiki/index.md ]; then
  echo -e "  ${GRN}[OK]${RST} wiki/index.md present"
else
  echo -e "  ${RED}[BROKEN]${RST} wiki/index.md manquant"
  BROKEN=$((BROKEN + 1))
fi

# Pages count
PAGES=$(find wiki/ -name "*.md" -not -path "*/\.*" | wc -l | tr -d ' ')
SOURCES=$(find wiki/sources wiki/domains/*/sources 2>/dev/null -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
DOMAINS=$(find wiki/domains -maxdepth 1 -type d 2>/dev/null | tail -n +2 | wc -l | tr -d ' ')
echo -e "  ${GRN}[OK]${RST} Wiki : ${PAGES} pages / ${SOURCES} sources / ${DOMAINS} domaines"

# Broken wikilinks (simple detection)
BROKEN_LINKS=0
for f in wiki/**/*.md; do
  [ -f "$f" ] || continue
  LINKS=$(grep -oE '\[\[[^]|]+' "$f" | sed 's/\[\[//' | sort -u)
  for link in $LINKS; do
    # Try find matching file in wiki/
    FOUND=$(find wiki/ -name "${link}.md" 2>/dev/null | head -1)
    if [ -z "$FOUND" ]; then
      BROKEN_LINKS=$((BROKEN_LINKS + 1))
    fi
  done
done 2>/dev/null

if [ "$BROKEN_LINKS" -gt 0 ]; then
  echo -e "  ${YEL}[WARN]${RST} Broken wikilinks : ~$BROKEN_LINKS (estimation)"
  WARN=$((WARN + 1))
else
  echo -e "  ${GRN}[OK]${RST} Wikilinks coherents"
fi

echo ""
if [ $BROKEN -gt 0 ]; then
  echo -e "${RED}Verdict : BROKEN${RST} ($BROKEN critical)"
  exit 2
elif [ $WARN -gt 0 ]; then
  echo -e "${YEL}Verdict : DEGRADED${RST} ($WARN warnings)"
  exit 1
else
  echo -e "${GRN}Verdict : SAIN${RST} ($PAGES pages, hot.md ${HOT_AGE_DAYS:-?}j)"
  exit 0
fi
WHEOF
chmod +x scripts/wiki-health.sh
bash scripts/wiki-health.sh
```
Expected : verdict SAIN ou DEGRADED avec details pages/sources/domaines.

- [ ] **Step 3 — Update `scripts/ref-checker.sh` : scanner wikilinks `[[file]]`**

Utiliser `Edit` tool pour ajouter fonction scan wikilinks. Chercher la section ou le script scanne les `.md` :

```
old_string = "# ... (scan markdown links [text](path))"
```

Ajouter apres la section existante une fonction :

```bash
# Via Edit, inserer (ou modifier) pour ajouter scan wikilinks :

# Scan wikilinks [[file]] dans wiki/*.md (D-WIKI-01)
if [ -d wiki/ ]; then
  WIKI_BROKEN=0
  for f in $(find wiki/ -name "*.md"); do
    LINKS=$(grep -oE '\[\[[^]|]+' "$f" | sed 's/\[\[//' | sort -u)
    for link in $LINKS; do
      FOUND=$(find wiki/ -name "${link}.md" 2>/dev/null | head -1)
      [ -z "$FOUND" ] && WIKI_BROKEN=$((WIKI_BROKEN + 1))
    done
  done
  echo "Wikilinks scan : $WIKI_BROKEN broken"
fi
```

**NOTE** : Si la structure exacte de ref-checker.sh ne permet pas un Edit simple (script complexe existant), considerer un hook externe ou un appel de `wiki-health.sh` depuis `ref-checker.sh` (scan complet fait par wiki-health).

Approche pragmatique : ajouter a la fin de `scripts/ref-checker.sh` un appel optionnel :

```bash
# Append a ref-checker.sh
cat >> scripts/ref-checker.sh <<'RCEOF'

# ── WIKILINKS SCAN (D-WIKI-01, 2026-04-15) ──
if [ -d wiki/ ] && [ -x scripts/wiki-health.sh ]; then
  echo ""
  echo "Wikilinks scan via wiki-health.sh :"
  bash scripts/wiki-health.sh 2>&1 | grep -E "(Wikilinks|Verdict)" | head -3
fi
RCEOF
```

- [ ] **Step 4 — Update `scripts/drift-detector.sh` : check hot.md age**

Utiliser `Edit` tool ou `cat >>` pour ajouter check hot.md :

```bash
# Inserer avant "echo ''" final du drift-detector.sh ou dans la section appropriee
# Via Edit :

# Chercher la section (exemple ligne 100+) et ajouter check :
```

Utiliser `Edit` tool sur `scripts/drift-detector.sh` :

```
old_string = "# 8. Worktrees
WT_COUNT=$(git worktree list | wc -l | tr -d ' ')
echo -e \"  ${GRN}[OK]${RST} worktrees : $WT_COUNT (main + $((WT_COUNT - 1)) actifs)\""

new_string = "# 8. Worktrees
WT_COUNT=$(git worktree list | wc -l | tr -d ' ')
echo -e \"  ${GRN}[OK]${RST} worktrees : $WT_COUNT (main + $((WT_COUNT - 1)) actifs)\"

# 9. Wiki hot.md age (D-WIKI-01)
if [ -f wiki/hot.md ]; then
  HOT_AGE_DAYS=$(( ($(date +%s) - $(stat -f %m wiki/hot.md 2>/dev/null || stat -c %Y wiki/hot.md)) / 86400 ))
  if [ \"$HOT_AGE_DAYS\" -gt 7 ]; then
    echo -e \"  ${YEL}[DRIFT]${RST} wiki/hot.md age : ${HOT_AGE_DAYS}j (> 7j, update recommande)\"
    DRIFT=$((DRIFT + 1))
  else
    echo -e \"  ${GRN}[OK]${RST} wiki/hot.md age : ${HOT_AGE_DAYS}j\"
  fi
fi

# 10. Wiki index.md sync avec filesystem (page count)
if [ -f wiki/index.md ]; then
  WIKI_PAGES_FS=$(find wiki/ -name \"*.md\" -not -path \"*/\\.*\" | wc -l | tr -d ' ')
  WIKI_PAGES_IDX=$(grep -oE 'Total pages: [0-9]+' wiki/index.md | grep -oE '[0-9]+' | head -1)
  if [ -n \"$WIKI_PAGES_IDX\" ] && [ \"$WIKI_PAGES_IDX\" -ne \"$WIKI_PAGES_FS\" ]; then
    echo -e \"  ${YEL}[DRIFT]${RST} wiki/index.md : $WIKI_PAGES_IDX pages listees vs $WIKI_PAGES_FS sur filesystem\"
    DRIFT=$((DRIFT + 1))
  fi
fi"
```

- [ ] **Step 5 — Test scripts chainage**

```bash
echo "=== wiki-commit --dry-run ==="
bash scripts/wiki-commit.sh --dry-run

echo "=== wiki-health ==="
bash scripts/wiki-health.sh

echo "=== drift-detector (avec wiki checks) ==="
bash scripts/drift-detector.sh

echo "=== ref-checker (avec wikilinks scan) ==="
bash scripts/ref-checker.sh

echo "=== health-check (chain complet) ==="
bash scripts/health-check.sh 2>&1 | tail -15
```
Expected : tous scripts s'executent sans erreur, output coherent.

- [ ] **Step 6 — Commit Phase 9**

```bash
git add scripts/
git status --short
git commit -m "$(cat <<'CEOF'
feat(scripts): wiki-commit + wiki-health + ref-checker + drift-detector extended

- scripts/wiki-commit.sh : commit manuel wiki/ + .raw/ (remplace auto-commit hook
  desactive Phase 4). --dry-run + --message + --help.
- scripts/wiki-health.sh : health-check wiki (hot.md age, index.md sync,
  pages/sources/domaines count, broken wikilinks). Exit 0/1/2 (SAIN/DEGRADED/BROKEN).
- scripts/ref-checker.sh : append call wiki-health.sh pour scan wikilinks
- scripts/drift-detector.sh : ajout check 9 (hot.md age > 7j) + check 10 (index.md sync)

Plan : docs/plans/2026-04-15-wiki-obsidian-adoption.md Phase 9.
Ref : D-WIKI-01.
CEOF
)"
```

**Verification finale Phase 9** :
```bash
ls scripts/wiki-commit.sh scripts/wiki-health.sh
bash scripts/wiki-health.sh 2>&1 | tail -3
bash scripts/drift-detector.sh 2>&1 | grep -c "wiki/hot.md age"  # >= 1
grep -c "wiki-health" scripts/ref-checker.sh  # >= 1
git log --oneline -9
```

**Rollback Phase 9** :
```bash
git reset --hard HEAD~1
rm -f scripts/wiki-commit.sh scripts/wiki-health.sh
# ref-checker.sh + drift-detector.sh reviennent a leur etat
```

**Commit message Phase 9** : `feat(scripts): wiki-commit + wiki-health + ref-checker + drift-detector extended` (Step 6).

---

### Phase 10 — Anti-regression complete (1h)

**Objectif** : Valider que 100% du systeme Foundation OS fonctionne comme avant OU mieux. Aucune regression. Tests exhaustifs vs baselines Phase 0.

**Pre-conditions** : Phases 0-9 OK, 9 commits sur wt/wiki-adoption-260415.

**Etat repo** : 9 commits.

**Actions atomiques** :

- [ ] **Step 1 — Health-check complet**

```bash
bash scripts/health-check.sh 2>&1 | tee /tmp/health-phase10.log
diff /tmp/health-baseline-260415.log /tmp/health-phase10.log | head -30
```
Expected : verdict SAIN ou DEGRADED (pas BROKEN). Si new warnings introduced, investigate.

- [ ] **Step 2 — Drift-detector**

```bash
bash scripts/drift-detector.sh 2>&1 | tee /tmp/drift-phase10.log
diff /tmp/drift-baseline-260415.log /tmp/drift-phase10.log | head -30
```
Expected : verdict SYNC ideal, ou DRIFT < baseline.

- [ ] **Step 3 — Docs-sync-check**

```bash
bash scripts/docs-sync-check.sh 2>&1 | tee /tmp/docs-sync-phase10.log
```
Expected : SYNC.

- [ ] **Step 4 — Ref-checker (extended avec wikilinks)**

```bash
bash scripts/ref-checker.sh 2>&1 | tee /tmp/refs-phase10.log
diff /tmp/refs-baseline-260415.log /tmp/refs-phase10.log | head -20
```
Expected : 0 refs cassees + scan wikilinks OK.

- [ ] **Step 5 — Wiki-health**

```bash
bash scripts/wiki-health.sh 2>&1 | tee /tmp/wiki-health-phase10.log
```
Expected : SAIN, ~12+ pages.

- [ ] **Step 6 — Build modules**

```bash
npm run build -w modules/app 2>&1 | tail -5
npm run build -w modules/design-system 2>&1 | tail -5
```
Expected : builds OK, ~265ms app + DS OK.

- [ ] **Step 7 — Tests modules**

```bash
npm test -w modules/app 2>&1 | tail -10
# Design-system : Vitest output illisible (known issue), skip ou run manuellement
```
Expected : 19/19 tests app.

- [ ] **Step 8 — Test /session-start complet manuel (dans conversation)**

Dans la conversation :
```
/session-start
```

Attendu :
- Tour 1 : lit CONTEXT.md + wiki/hot.md + git + health + plans + wiki-health
- Tour 2 : TodoWrite avec 1 todo par plan actif
- Tour 3 : brief v11 avec cadres HOT + WIKI affiches

Kevin valide visuellement brief.

- [ ] **Step 9 — Test /session-end partiel (simulation sans commit)**

Dans la conversation :
```
Simule /session-end en mode dry-run : affiche ce qui serait mis a jour dans CONTEXT.md, wiki/hot.md, wiki/log.md. Ne commit PAS.
```

Attendu : Claude liste les updates proposes.

- [ ] **Step 10 — Test Obsidian app ouvre vault + graph view fonctionne**

```bash
open -a Obsidian "$(pwd)/wiki"
```

Kevin valide :
- Vault s'ouvre
- Graph view montre ~12 pages connectees
- Wikilinks cliquables
- Hot cache visible dans hot.md

- [ ] **Step 11 — Test hooks SessionStart + PostCompact + Stop**

Test SessionStart : nouvelle session Claude Code sur ce worktree → verifier hot.md est lu.
Test PostCompact : difficile a forcer, simuler en vidant contexte et checking.
Test Stop : modifier wiki/ puis stop session, verifier message WIKI_CHANGED.

(Tests semi-manuels, difficile a automatiser, valider sur simulation.)

- [ ] **Step 12 — Build Storybook DS (validation visuelle secondaire)**

```bash
cd modules/design-system
npm run build-storybook 2>&1 | tail -5
cd ../..
```
Expected : build OK ~5.87s.

- [ ] **Step 13 — Compilation finale baselines vs Phase 10**

```bash
echo "=== DIFFS BASELINES ==="
for f in health drift refs; do
  echo "--- $f ---"
  diff /tmp/${f}-baseline-260415.log /tmp/${f}-phase10.log | head -10 || echo "NO DIFF"
  echo ""
done
```

Expected : diffs mineurs (ajout wiki checks dans health-check / drift), aucune regression (pas de nouveau [KO] ni nouveau [WARN] hors wiki).

- [ ] **Step 14 — Decision GO / NO-GO pour Phase 11 (merge)**

Critères GO :
- Health verdict ≤ baseline (SAIN ou DEGRADED sans nouveau warn hors scope wiki)
- Drift verdict ≤ baseline
- Refs : 0 cassees (ou <= baseline)
- Build OK (app + DS)
- Tests OK (app 19/19)
- /session-start affiche brief v11 avec HOT + WIKI correctement
- Obsidian app ouvre vault + graph view

Si un critère FAIL → investigate + fix OU rollback vers Phase precedente OK.

Si tous PASS → procede Phase 11.

**Verification finale Phase 10** : pas de commit (verification only).

```bash
ls /tmp/*-phase10.log
git log --oneline -9  # toujours 9 commits (pas de commit Phase 10)
```

**Rollback Phase 10** : si regression detectee → rollback vers Phase 9 OK :
```bash
# Pas de commit Phase 10, donc juste tester a nouveau apres fix.
# Si bug impossible a fixer → rollback vers Phase 0 via :
git reset --hard HEAD~9  # revient avant Phase 2 scaffold
```

**Commit message Phase 10** : AUCUN (verification only).

---

### Phase 11 — Merge main + documentation finale (30 min)

**Objectif** : Merger le worktree dans main, update documentation finale (README.md, manifeste.md), creer memoire auto-memory recap, /wt clean worktree.

**Pre-conditions** : Phase 10 OK (decision GO).

**Etat repo** : 9 commits sur wt/wiki-adoption-260415.

**Actions atomiques** :

- [ ] **Step 1 — Confirmation explicite Kevin**

Dans conversation :
```
Phase 10 anti-regression OK.
Baselines vs Phase 10 : aucune regression detectee.
Tests : build OK, 19/19 tests, brief v11 affiche correctement, Obsidian graph view fonctionne.

PRET A MERGER wt/wiki-adoption-260415 → main ?
(oui / non / modif)
```

Attendre validation Kevin explicite.

- [ ] **Step 2 — Push worktree branch (sauvegarde avant merge)**

```bash
cd /Users/kevinnoel/foundation-os/.claude/worktrees/wiki-adoption-260415
git push -u origin wt/wiki-adoption-260415
```
Expected : branche pushee sur remote (backup avant merge).

- [ ] **Step 3 — Retour main + pull**

```bash
cd /Users/kevinnoel/foundation-os
git checkout main
git pull origin main
git status --short
```
Expected : on main, propre, up to date.

- [ ] **Step 4 — Merge worktree branch avec --no-ff**

```bash
git merge --no-ff wt/wiki-adoption-260415 -m "$(cat <<'CEOF'
feat(wiki): adopter claude-obsidian + knowledge layer Foundation OS (D-WIKI-01)

Merge de wt/wiki-adoption-260415 (11 phases, 9 commits).

## Scope

Integration complete du plugin claude-obsidian v1.4.1 (pattern Karpathy LLM Wiki)
dans Foundation OS avec zero regression.

## Livres

- **Vault wiki/** scaffolde multi-domaines (trading, finance, sante, design, dev + 7 cross-domain)
- **10 skills** adoptes et documentes dans docs/core/tools.md
- **5 tiers memoire** formalises (conversation, CONTEXT.md, auto-memory, docs/, wiki/)
- **Couplage modules <-> wiki** via frontmatter `implementation:`
- **Hooks integres** (SessionStart wrapper + PostCompact + Stop ; PostToolUse DESACTIVE)
- **Brief v11 enrichi** (cadres HOT + WIKI)
- **Scripts custom** : wiki-commit.sh, wiki-health.sh, ref-checker/drift-detector extended
- **Premier ingest** : Karpathy LLM Wiki + AgriciDaniel claude-obsidian (~12 pages)
- **2 memoires migres** de auto-memory vers wiki/ (project_migration_desktop, tools_inventory)
- **Anti-regression validee** (Phase 10 : build OK, 19/19 tests, brief OK)

## Decision

D-WIKI-01 — Adoption claude-obsidian + 5 tiers memoire (2026-04-15).

## Cas d'usage futurs

- Phase 5 Finance / Trading auto / Sante conseil multi-agents
- Recherche scientifique documentaire
- Backtest engine Trading
- Patterns design cross-modules

## Plan

docs/plans/2026-04-15-wiki-obsidian-adoption.md (12 phases).
CEOF
)"
```
Expected : merge commit cree sur main.

- [ ] **Step 5 — Update CONTEXT.md post-merge final**

Utiliser `Edit` tool sur `CONTEXT.md` :

Ajouter session recente :

```
old_string = "## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-15 | **[DONE] Level Up Foundation OS — audit + 7 phases** |"

new_string = "## Sessions recentes

| Date | Resume |
|------|--------|
| 2026-04-15 | **[DONE] Adoption Wiki Obsidian — claude-obsidian + 5 tiers memoire (D-WIKI-01)** |
|            | Scope : plugin claude-obsidian v1.4.1 + vault multi-domaines (5 domaines + 7 cross-domain) + 10 skills documentes Core Tools + hooks integres (auto-commit desactive) + brief v11 enrichi (HOT + WIKI) + scripts custom (wiki-commit, wiki-health) + premier ingest test (Karpathy + AgriciDaniel ~12 pages) + 2 migrations auto-memory vers wiki |
|            | Decisions : D-WIKI-01 (adoption + 5 tiers memoire + couplage modules wiki) |
|            | Commits : 9 (Phases 0-9 + merge). Branche wt/wiki-adoption-260415. |
|            | Plan : `docs/plans/2026-04-15-wiki-obsidian-adoption.md`. |
| 2026-04-15 | **[DONE] Level Up Foundation OS — audit + 7 phases** |"
```

Update Modules section (ligne Knowledge deja ajoutee Phase 3, verifier) :

```
# Verifier via grep
grep "Knowledge" CONTEXT.md
```

Update Cap :

```
old_string = "**Direction** : Foundation OS level-up DONE (audit + 7 phases). L'OS se maintient maintenant automatiquement : drift detection au SessionStart, auto-archive plans fonctionnel, refs cassees 0, mémoires obsoletes dans `_deprecated/`. Attente validation Kevin sur le nouveau workflow Desktop + test DS composants."

new_string = "**Direction** : Foundation OS = OS de travail + second-brain knowledge unifie (D-WIKI-01 DONE). Vault Obsidian operationnel, 5 tiers memoire formalises, brief v11 enrichi (HOT + WIKI), Obsidian graph view visible. Pret pour Phase 5 modules (Finance, Trading auto, Sante conseil multi-agents)."
```

- [ ] **Step 6 — Update README.md : section Knowledge layer**

Utiliser `Edit` tool :

Ajouter section a README.md (position selon README existant) :

```
new_section = "## Knowledge layer (wiki/)

Foundation OS integre un second-brain knowledge via plugin [claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) (pattern Karpathy LLM Wiki).

```
wiki/
├── hot.md         cache narratif 500 mots derniere session
├── index.md       master catalog (1 ligne / page)
├── log.md         chronological ops
├── overview.md    executive summary
├── domains/       5 domaines (trading, finance, sante, design, dev)
├── concepts/      cross-domain
├── entities/      personnes, orgs, outils
├── sources/       articles, papers, transcripts
├── comparisons/   analyses
├── questions/     Q&A
└── meta/          templates + dashboards
```

Spec : `docs/core/knowledge.md`. Workflows : `/wiki`, `/save`, `/autoresearch`, `/canvas`.
"
```

- [ ] **Step 7 — Update `docs/manifeste.md` : ajout OS + second-brain**

Utiliser `Edit` tool pour ajouter dans introduction/mission :

```
old_string = "Foundation OS est un OS de travail personnel IA-driven."

new_string = "Foundation OS est un OS de travail personnel IA-driven ET un second-brain knowledge unifie (adoption claude-obsidian 2026-04-15 D-WIKI-01)."
```

- [ ] **Step 8 — Creer memoire auto-memory `project_wiki_adoption.md`**

```bash
cat > ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_wiki_adoption.md <<'MMEOF'
---
name: Adoption claude-obsidian + Wiki Knowledge Layer
description: Foundation OS = OS travail + second-brain knowledge unifie (D-WIKI-01, 2026-04-15). 5 tiers memoire, 10 skills, vault multi-domaines. Plugin claude-obsidian v1.4.1.
type: project
originSessionId: 2026-04-15-wiki-obsidian-adoption
---
Adoption DONE 2026-04-15 via plan `docs/plans/2026-04-15-wiki-obsidian-adoption.md` (12 phases, 9 commits, ~9h effort).

**Why:** Ambition Kevin pour OS qui sert tous les modules futurs (Finance, Trading auto, Sante conseil multi-agents) + recherche scientifique/documentaire. Manque d'un cache narratif + knowledge layer cross-modules avant adoption.

**How it works:**
- 5 tiers memoire (conversation / CONTEXT.md / auto-memory / docs/ / wiki/)
- Vault `wiki/` Obsidian scaffolde multi-domaines (trading, finance, sante, design, dev)
- Couplage modules <-> wiki via frontmatter `implementation:` (code TS/Python dans modules/, doc + hypotheses + sources dans wiki/domains/)
- 10 skills : wiki, wiki-ingest, wiki-query, wiki-lint, save, autoresearch, canvas, defuddle, obsidian-bases, obsidian-markdown
- Brief v11 enrichi : cadre HOT (wiki/hot.md lu au SessionStart) + cadre WIKI (compteur pages)
- Hooks : SessionStart wrapper chainage drift-detector + cat hot.md ; PostCompact re-read ; Stop notif WIKI_CHANGED ; PostToolUse auto-commit DESACTIVE (remplace wiki-commit.sh manuel)

**How to apply:**
- Nouvelles sources externes → `.raw/<domain>/` puis `wiki-ingest`
- Conversations valables → `/save [name]` → wiki/sources/
- Recherche topic → `/autoresearch [topic]`
- Visualisation → `/canvas [desc]` ou Obsidian graph view
- Test arbitral `docs/core/communication.md` section 1.5 : pose 5 questions pour savoir ou classer (modules/ vs CONTEXT vs auto-memory vs docs/ vs wiki/)
- Nouveau module Phase 5 → scaffolder `wiki/domains/<X>/` ET `modules/<X>/` avec cross-refs frontmatter
- Skills custom Foundation (wiki-trading-strategy-doc, wiki-sante-bilan-extract, etc.) : a builder quand module Phase 5 demarre (~2h par skill)

**Limites connues:**
- Auto-commit PostToolUse DESACTIVE : commit manuel via `bash scripts/wiki-commit.sh` ou integre `/session-end`
- Repo reste PRIVE (donnees perso Phase 5 Sante/Finance/Trading)
- Pinecone embeddings archivage differe 12+ mois (quand > 500 pages)
- Obsidian sync cloud NON utilise (privacy)
MMEOF

ls -la ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_wiki_adoption.md
```
Expected : memoire creee.

- [ ] **Step 9 — Update MEMORY.md (index auto-memory)**

Utiliser `Edit` tool sur `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` :

```
old_string = "- [Plans ultra detailles](feedback_plans_ultra_detailles.md) — Tout plan multi-session : 6 elements stricts par phase (pre-conditions, etat repo, actions atomiques, verification, rollback, commit) anti-perte-de-contexte post-compactage."

new_string = "- [Plans ultra detailles](feedback_plans_ultra_detailles.md) — Tout plan multi-session : 6 elements stricts par phase (pre-conditions, etat repo, actions atomiques, verification, rollback, commit) anti-perte-de-contexte post-compactage.
- [Adoption Wiki Obsidian](project_wiki_adoption.md) — DONE 2026-04-15. Foundation OS = OS travail + second-brain knowledge. 5 tiers memoire + vault wiki/ multi-domaines + 10 skills claude-obsidian + brief v11 HOT+WIKI."
```

- [ ] **Step 10 — Archiver le plan (auto-archive via /session-end Phase 5bis)**

Le plan `docs/plans/2026-04-15-wiki-obsidian-adoption.md` sera archive automatiquement si toutes ses cases `[x]` sont coches via hook `auto-archive-plans.sh` au prochain `/session-end`.

Pour l'archive manuelle immediate :
```bash
mkdir -p .archive/plans-done-260415
mv docs/plans/2026-04-15-wiki-obsidian-adoption.md .archive/plans-done-260415/
ls .archive/plans-done-260415/
# Aussi archiver le plan natif Desktop
rm -f ~/.claude/plans/wiki-obsidian-adoption.md
```

Mais attention : le plan etant le doc de reference, mieux le laisser dans `docs/plans/` le temps que Kevin confirme "done". Archive par `/session-end` hook au session suivant.

- [ ] **Step 11 — /wt clean wiki-adoption-260415**

```bash
bash scripts/worktree-clean.sh wiki-adoption-260415
git worktree list
```
Expected : worktree supprime, branche mergee preservee.

- [ ] **Step 12 — Commit final sur main**

```bash
cd /Users/kevinnoel/foundation-os
git status --short
# S'il y a modifications (README.md, manifeste.md, CONTEXT.md, MEMORY.md si externe), commiter :
git add CONTEXT.md README.md docs/manifeste.md
# MEMORY.md et project_wiki_adoption.md sont dans ~/.claude/projects/... (non versionne, pas git add)
git commit -m "$(cat <<'CEOF'
docs(os): finaliser adoption claude-obsidian (D-WIKI-01)

- CONTEXT.md : session recente Adoption Wiki Obsidian + Cap mis a jour (OS + second-brain unifie) + Knowledge actif dans Modules (Phase 3 deja fait mais sync final)
- README.md : ajout section Knowledge layer (wiki/)
- docs/manifeste.md : ajout OS travail + second-brain knowledge unifie

Merge wt/wiki-adoption-260415 → main fait. 11 phases, 10 commits (+ merge).
Memoire `project_wiki_adoption.md` creee dans auto-memory.
MEMORY.md update.

Pret pour Phase 5 modules (Finance, Trading, Sante).
CEOF
)"

git push origin main
```

- [ ] **Step 13 — Verification finale session complete**

```bash
bash scripts/health-check.sh 2>&1 | tail -5
bash scripts/drift-detector.sh 2>&1 | tail -5
bash scripts/wiki-health.sh 2>&1 | tail -3
git log --oneline -12
git worktree list
```
Expected :
- Health verdict : SAIN ou DEGRADED (pas BROKEN)
- Drift : SYNC ideal, ou drifts mineurs
- Wiki : SAIN
- Git log : 12 commits (9 phases + merge + commit final)
- Worktrees : main + eventuels autres worktrees (plus wiki-adoption-260415)

- [ ] **Step 14 — Ouvrir Obsidian app final + Kevin valide**

```bash
open -a Obsidian "$(pwd)/wiki"
```

Kevin valide :
- Vault ouvre correctement
- Graph view montre ~12-14 pages connectees
- hot.md affiche le resume de la session
- Navigation fonctionne

- [ ] **Step 15 — Brief cloture v11 (DONE status)**

Produire brief cloture format communication.md section 6.2 avec :
- ETAT TECHNIQUE : build OK, tests OK, health SAIN/DEGRADED, refs 0
- CE QUI A ETE FAIT : 11 phases + merge + D-WIKI-01
- IDEES CAPTUREES : skills custom futurs, Pinecone differe, conseil sante multi-agents
- CAP MIS A JOUR : OS + second-brain unifie, pret Phase 5
- Pas de CONCERNS (DONE propre)

**Verification finale Phase 11** :
```bash
git log --oneline main -5
git worktree list  # wiki-adoption-260415 absent
ls docs/plans/2026-04-15-wiki-obsidian-adoption.md || echo "Plan archive Phase 11"
cat ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_wiki_adoption.md | head -5
grep -c "D-WIKI-01" CONTEXT.md
grep -c "wiki/" README.md
```

**Rollback Phase 11** :
```bash
# Si probleme detecte APRES merge main :
git checkout main
git reset --hard HEAD~2  # revert commit final + merge
git push origin main --force  # ATTENTION : destructif, confirmer avec Kevin
# Restaurer worktree :
bash scripts/worktree-new.sh wiki-adoption-reprise
```

**Commit message Phase 11** : `docs(os): finaliser adoption claude-obsidian (D-WIKI-01)` (Step 12).

---

## Fichiers critiques (recap table globale)

| Fichier | Phase | Action |
|---------|-------|--------|
| `wiki/hot.md` | 2, 5, 7, 8 | Creer + update via /session-end |
| `wiki/index.md` | 2, 5, 7 | Creer + update apres chaque ingest |
| `wiki/log.md` | 2, 5, 7 | Creer + append chronologique |
| `wiki/overview.md` | 2 | Creer |
| `wiki/domains/*/` | 2 | 5 domaines scaffoldes |
| `wiki/meta/templates/*.md` | 2 | 5 templates |
| `.raw/*/` | 2 | 5 sous-dossiers |
| `.gitignore` | 2 | Modifier |
| `docs/core/communication.md` | 3, 8 | Section 1 (5 tiers), 1.5 (test arbitral), 6.1 (brief v11 HOT+WIKI) |
| `docs/core/knowledge.md` | 3 | Creer (spec module Knowledge Phase 7 Core OS) |
| `docs/core/architecture-core.md` | 3 | Ajout Phase 7 |
| `docs/core/tools.md` | 6 | Section 1c (10 skills knowledge) |
| `docs/core/tools/index.json` | 6 | Ajout categorie knowledge-skills |
| `docs/core/tools/routing.json` | 6 | Ajout 9 regles wiki-* |
| `CLAUDE.md` | 3 | Section Commands |
| `CONTEXT.md` | 3, 11 | Knowledge dans Modules + D-WIKI-01 + session recente |
| `README.md` | 11 | Section Knowledge layer |
| `docs/manifeste.md` | 11 | OS + second-brain |
| `~/.claude/settings.json` | 4 | Hooks SessionStart + PostCompact + Stop (PostToolUse absent) |
| `.claude/settings.local.json` | 4 | Permissions scripts wiki |
| `.claude/commands/session-start.md` | 8 | Tour 1 Read hot.md, Tour 3 cadres HOT+WIKI |
| `.claude/commands/session-end.md` | 8 | Tour 3 update hot.md + log.md |
| `scripts/hooks/session-start-wiki.sh` | 4 | Creer (wrapper chainage) |
| `scripts/wiki-commit.sh` | 9 | Creer (remplace auto-commit) |
| `scripts/wiki-health.sh` | 9 | Creer (health wiki) |
| `scripts/health-check.sh` | 8 | Ajout section INFO wiki |
| `scripts/drift-detector.sh` | 9 | Ajout check hot.md age + index sync |
| `scripts/ref-checker.sh` | 9 | Append call wiki-health.sh |
| `~/.claude/projects/.../memory/MEMORY.md` | 5, 11 | Retirer 2 migrees + ajouter project_wiki_adoption |
| `~/.claude/projects/.../memory/project_wiki_adoption.md` | 11 | Creer memoire recap |
| `~/.claude/projects/.../memory/project_migration_desktop.md` | 5 | Supprime (migre vers wiki/) |
| `~/.claude/projects/.../memory/tools_inventory.md` | 5 | Supprime (migre vers wiki/) |

---

## Hors scope explicite

Ce plan NE FAIT PAS :

1. **Skills custom Foundation OS par module** (wiki-trading-strategy-doc, wiki-sante-bilan-extract, wiki-finance-tax-extract, etc.) — a builder quand modules Phase 5 demarrent, ~2h par skill custom. Hors scope adoption initiale.

2. **Pinecone embeddings archivage long terme** — differe 12+ mois, quand volume wiki > 500 pages. Non necessaire a court/moyen terme.

3. **Auto-sync Obsidian cloud** — privacy-first, sync NON active. Versionnement git suffit.

4. **Split repo public/prive** — Repo Foundation OS reste PRIVE (donnees perso Phase 5). Pas de friction de submodules.

5. **Migration complete auto-memory vers wiki/** — Seules 2 memoires migrent (project_migration_desktop, tools_inventory). Les 27 autres RESTENT dans auto-memory (profile + feedback comportement = bon tier).

6. **Installation claude-obsidian dans autres projets** — Plugin installe globalement mais scope initial = Foundation OS uniquement. Autres projets pourront l'activer independamment.

7. **Integration MCP Obsidian external** — Le plugin claude-obsidian gere tout en Markdown local, pas besoin de MCP server Obsidian externe.

8. **Auto-generation canvas .canvas** — `/canvas` permet creation visuelle mais pas d'auto-generation a partir de wiki/. A faire manuellement par Kevin.

9. **Auto-commit hook PostToolUse** — **DESACTIVE volontairement** (casse regle Kevin-valide). Remplace par `scripts/wiki-commit.sh` manuel.

10. **Migration des Ideas & Parking CONTEXT.md vers wiki/questions** — Scope current CONTEXT.md inchange. Questions peuvent etre ingerees via `/save` au cas par cas si pertinentes.

---

## Verification end-to-end (apres execution complete Phase 11)

### Build + tests

```bash
npm run build -w modules/app              # OK ~265ms
npm run build -w modules/design-system    # OK
npm test -w modules/app                   # 19/19
bash scripts/health-check.sh              # SAIN ou DEGRADED (pas BROKEN)
bash scripts/drift-detector.sh            # SYNC ideal
bash scripts/docs-sync-check.sh           # SYNC
bash scripts/ref-checker.sh               # 0 cassees
bash scripts/wiki-health.sh               # SAIN, ~12+ pages
```

### Wiki operationnel

```bash
ls wiki/hot.md wiki/index.md wiki/log.md wiki/overview.md  # 4 fichiers
find wiki/ -name "*.md" | wc -l                             # >= 15
find wiki/domains -maxdepth 1 -type d | wc -l               # 6 (racine + 5 domaines)
ls wiki/meta/templates/*.md | wc -l                         # 5
```

### Core OS documente

```bash
grep -c "5 tiers" docs/core/communication.md     # >= 2
grep -c "Knowledge" docs/core/architecture-core.md  # >= 3
ls docs/core/knowledge.md                        # existe
grep -c "wiki-ingest" docs/core/tools.md         # >= 2
python3 -c "import json; d=json.load(open('docs/core/tools/index.json')); assert 'knowledge-skills' in d.get('categories', {})"
```

### Hooks operationnels

```bash
python3 -c "import json; d=json.load(open('/Users/kevinnoel/.claude/settings.json')); h=d.get('hooks', {}); assert 'SessionStart' in h and 'PostCompact' in h and 'Stop' in h; assert 'PostToolUse' not in h, 'AUTO-COMMIT NE DOIT PAS ETRE ACTIF'"
```

### Brief v11 enrichi

```bash
grep -c "HOT" .claude/commands/session-start.md    # >= 2
grep -c "WIKI" .claude/commands/session-start.md   # >= 2
grep -c "wiki/hot.md" .claude/commands/session-end.md  # >= 2
```

### Obsidian app

```bash
open -a Obsidian "$(pwd)/wiki"
# Kevin valide visuellement : vault ouvre, graph view connectee, wikilinks fonctionnent
```

### /session-start complet

Dans conversation, lancer `/session-start` et verifier :
1. Tour 1 lit CONTEXT.md + wiki/hot.md + git + health + plans + wiki-health
2. Tour 2 TodoWrite (1 todo par plan, 0 plan actif apres archivage)
3. Tour 3 brief v11 avec cadres HOT + WIKI visibles

### CONTEXT.md final

```bash
grep -c "D-WIKI-01" CONTEXT.md          # >= 1
grep -c "Knowledge" CONTEXT.md           # >= 2 (Modules table + Sessions)
wc -l CONTEXT.md                         # <= 200 (garde-fou)
```

### Memoire auto-memory

```bash
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_wiki_adoption.md
grep -c "Adoption Wiki" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md  # >= 1
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_migration_desktop.md 2>&1 | grep -c "No such"  # 1 (migre, supprime)
```

### Git state

```bash
git log --oneline main -12                       # 12 commits (9 phases + merge + commit final + ... )
git worktree list                                # sans wiki-adoption-260415
git branch -a | grep wt/wiki-adoption            # branche existe (backup) ou supprimee selon workflow
```

---

## Risques (table)

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Auto-commit hook PostToolUse actif par defaut casse regle Kevin-valide | Certaine (hook plugin par defaut) | Haut (pollution commits) | **DESACTIVE Phase 4** — remplace `scripts/wiki-commit.sh` manuel (Phase 9) |
| Plugin claude-obsidian conflit hooks Foundation existants (drift-detector SessionStart) | Moyenne | Moyen | Wrapper chainage `scripts/hooks/session-start-wiki.sh` Phase 4 |
| Doublon CONTEXT.md ↔ wiki/index.md si non-discipline | Moyenne | Moyen | Regle d'or 5 tiers + test arbitral documentes Phase 3. Drift-detector Phase 9 check index sync. |
| `.obsidian/` versionne expose config locale Kevin | Faible | Faible | `.gitignore` Phase 2 |
| Migration auto-memory perd contenu memoire | Faible | Haut | Migration 1-par-1 avec ASK Kevin Phase 5. Rollback via `git show` + re-ecrire. |
| Obsidian app jamais ouverte post-adoption → dead tool | Faible (Kevin demande explicit) | Moyen | Kevin ouvre Obsidian dans Phase 7 + Phase 10. Trigger : /canvas periodique. |
| Volume wiki/ explose tokens session (> 500 pages) | Nul court terme, certain long terme | Haut si long terme | Hot cache 500 mots + index 1 ligne/page + pages loaded on-demand only. Pinecone differe 12+ mois. |
| Regression build/tests apres modifs | Faible | Haut | Phase 10 anti-regression complete + rollback possible chaque phase. |
| Worktree merge conflicts avec main entre-temps | Faible | Moyen | Phase 11 Step 3 : pull main avant merge. Conflits resolus avant commit. |
| `~/.claude/settings.json` modifie casse autres projets Claude Code | Moyenne | Haut | Backup Phase 1 Step 7. Rollback facile. Hooks ne s'activent que si `wiki/hot.md` ou `scripts/hooks/session-start-wiki.sh` existe. |
| Skills custom futurs (wiki-trading-*, wiki-sante-*) duplication avec skills claude-obsidian base | Moyenne (future) | Faible | Hors scope current plan. Scope strict quand builds Phase 5. |
| Repo public expose donnees Phase 5 (Sante/Finance/Trading) | Nul (repo prive) | Haut (si public plus tard) | Repo reste PRIVE (D-WIKI-01). Si public un jour : split repo ou .gitignore wiki/domains/sante|finance|trading. |
| Templates frontmatter `<TITRE>` non remplace lors ingest | Faible | Faible | Plugin claude-obsidian gere remplacement via `<% tp.file.title %>` syntax. Verifie Phase 7. |

---

## Memoires permanentes a creer (post-execution)

- `project_wiki_adoption.md` — **Phase 11 Step 8** — Recap complet chantier (DEJA INCLUS dans plan ci-dessus)

Les feedbacks Kevin existants (feedback_subagents_context, feedback_frontload_questions, feedback_plans_ultra_detailles, etc.) restent inchanges. Pas de nouveau feedback a creer car le plan respecte les conventions existantes.

---

## Self-Review (verification plan avant execution)

### 1. Spec coverage

**Requirements initiales** (conversation Kevin) vs tasks plan :

| Requirement | Phase | Task couvert ? |
|-------------|-------|----------------|
| Option B (adoption complete) | 0-11 | ✅ Toutes phases |
| Ambition max (multi-modules futurs) | 2, 3 | ✅ 5 domaines pre-scaffoldes trading/finance/sante/design/dev + couplage modules <-> wiki |
| Obsidian app visualisation | 7, 10, 11 | ✅ Ouverture Obsidian + graph view validation Kevin |
| Pragmatique fonctionnel maintenable | 3, 4, 8, 9 | ✅ Docs formalisees + hooks integres + brief v11 + scripts custom |
| Zero regression | 10 | ✅ Phase 10 anti-regression complete + baselines Phase 0 comparaison |
| Zero perte contexte | 5 | ✅ Migration 1-par-1 avec ASK Kevin |
| Skills documentes Core Tools | 6 | ✅ docs/core/tools.md section 1c + index.json + routing.json |
| Worktree dedie | 0 | ✅ `wt/wiki-adoption-260415` |
| Plan le plus precis/detaille anti-compactage | Global | ✅ 6 elements par phase (pre-conditions, etat repo, actions atomiques snippets, verification, rollback, commit) + code complet, commandes exactes |
| 10 skills adoptes | 1, 6 | ✅ Phase 1 install globale + Phase 6 documentation |
| Hot cache 500 mots | 2, 8 | ✅ wiki/hot.md Phase 2 init + format session-end Phase 8 |
| Cadres HOT + WIKI brief v11 | 8 | ✅ docs/core/communication.md section 6.1 update |
| .obsidian/ gitignore | 2 | ✅ Phase 2 Step 11 |
| Auto-commit desactive | 4 | ✅ Phase 4 Step 4 (PostToolUse absent settings.json) |
| Couplage modules <-> wiki | 3 | ✅ docs/core/knowledge.md section 2 + communication.md section 1.5 test arbitral |
| Repo prive | 11 | ✅ Pas de split repo, reste prive |
| Premier ingest test | 7 | ✅ Karpathy + AgriciDaniel |

**Verdict Spec Coverage** : 17/17 requirements couverts.

### 2. Placeholder scan

Recherche de patterns interdits :

- "TBD", "TODO", "implement later", "fill in details" → **0 occurrence** (verifier grep ci-dessous)
- "Add appropriate error handling" / "add validation" → 0 occurrence
- "Write tests for the above" sans code → 0 occurrence (tests optionnels dans ce plan car pas de nouveau code ajoute, juste integration plugin + docs + scripts shell)
- "Similar to Phase N" sans repeter → 0 occurrence (chaque phase est self-contained)
- Types/functions non definis → 0 (pas de types, shell scripts only)

Grep verification :
```bash
grep -E "(TBD|TODO|implement later|fill in details|appropriate error|add validation)" docs/plans/2026-04-15-wiki-obsidian-adoption.md
```
Expected : 0 results (sauf dans templates `<TITRE>` qui sont volontaires).

### 3. Type consistency

- Commands `claude plugin ...` : consistent partout (`claude plugin marketplace add`, `claude plugin install`, `claude plugin uninstall`)
- Path `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/` : consistent
- Path `wiki/hot.md`, `wiki/index.md`, `wiki/log.md`, `wiki/overview.md` : consistent
- Script paths `scripts/wiki-commit.sh`, `scripts/wiki-health.sh`, `scripts/hooks/session-start-wiki.sh` : consistent
- Decision `D-WIKI-01` : consistent partout
- Branche `wt/wiki-adoption-260415` : consistent
- Plan path `docs/plans/2026-04-15-wiki-obsidian-adoption.md` : consistent

**Verdict Type Consistency** : OK.

### 4. Decouverte ambiguites residuelles

- **Phase 5 Step 3 classification memoires** : proposee mais necessite validation Kevin. Correctif : Step 4 ASK Kevin explicite.
- **Phase 7 Step 3 invocation wiki-ingest** : skill invoque via conversation (pas command line). Correctif : instructions pour Claude claire dans step.
- **Phase 9 Step 3 ref-checker.sh** : edit peut etre complexe si structure script imprevue. Correctif : approche pragmatique `cat >>` (append) plutot que Edit intrusif.

---

## Execution Handoff

Plan complet et sauvegarde dans `docs/plans/2026-04-15-wiki-obsidian-adoption.md` (12 sections, 12 phases, 9h effort, 78 tasks atomiques).

**Deux options d'execution** :

**1. Subagent-Driven (recommande pour plan ambitieux multi-phases)**

Skill requis : `superpowers:subagent-driven-development`

- Je dispatche un sub-agent par Phase (11 sub-agents au total)
- Chaque sub-agent recoit le contexte complet de la phase (pre-conditions, actions, verification, rollback, commit)
- Review entre phases (validation Kevin apres chaque commit)
- Fast iteration, parallelisation possible (Phase 3 + 6 independantes par exemple)

**2. Inline Execution (controle total Kevin, linearite)**

Skill requis : `superpowers:executing-plans`

- J'execute les tasks dans cette session (ou une session future post-compactage)
- Batch execution avec checkpoints entre phases (validation Kevin)
- Tracking via checkboxes `- [ ]` → `- [x]` dans le plan

**Quelle approche Kevin prefere ?**

- A : Subagent-Driven (rapide, parallele, moins de controle direct)
- B : Inline Execution (sequentiel, controle total, lent mais visible)
- C : Hybride — Phase 0-3 en inline (fondation), puis Phase 4-11 en subagent-driven

Une fois choix valide, on execute.

---

## Execution log (checkboxes tracking — rempli pendant execution)

- [ ] Phase 0 — Worktree + preflight baseline (15 min)
- [ ] Phase 1 — Installation plugin claude-obsidian + verification (15 min)
- [ ] Phase 2 — Scaffold wiki/ multi-domaines (45 min)
- [ ] Phase 3 — Documentation 5 tiers + module Knowledge Core OS (1h)
- [ ] Phase 4 — Hooks integration sans regression (1h)
- [ ] Phase 5 — Migration auto-memory selective (1h30-2h)
- [ ] Phase 6 — Adoption 10 skills + documentation Core Tools (1h)
- [ ] Phase 7 — Premier ingest test Karpathy + AgriciDaniel (45 min)
- [ ] Phase 8 — Brief v11 enrichi (cadres HOT + WIKI) (1h)
- [ ] Phase 9 — Scripts custom wiki-commit + wiki-health + ref-checker extended (1h)
- [ ] Phase 10 — Anti-regression complete (1h)
- [ ] Phase 11 — Merge main + documentation finale (30 min)

**Total : ~9 heures sur 1-2 sessions (parallelisation possible Phase 3+6 et 8+9).**

---

## Notes post-execution

[A remplir apres execution — ecarts estimation vs reel, surprises, lecons retenues.]
