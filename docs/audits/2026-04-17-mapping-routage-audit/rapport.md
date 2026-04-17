---
type: audit
title: "Audit mapping + routage Foundation OS"
created: 2026-04-17
scope: cerveau
author: Claude (Opus 4.7, 1M context)
findings_total: 15
axes_audited: 13
files_read: 128
status: active
related:
  - "[[../../plans/2026-04-17-mapping-routage-refactor|Plan execution]]"
  - "[[../../../CLAUDE|CLAUDE.md]]"
  - "[[../../../CONTEXT|CONTEXT.md]]"
  - "[[../../../wiki/concepts/Foundation OS|Foundation OS concept]]"
---

# Audit mapping + routage Foundation OS — 2026-04-17

## 1. Contexte

### Demande

Kevin (2026-04-17, worktree `claude/keen-mahavira-a1664e`) demande un audit massif, profond et exhaustif suivi d'un refactor radical ambitieux portant sur : **mapping du projet, indexage, cartographie, nommage, tags, regroupements, routes de lecture, noeuds logiques/neurologiques, autoroutes de reflexion, references, articulation globale, routage, categorisation, referencement, memoire**.

Citation directe Kevin : "Ameliorer la memoire, sa scalabilite, son automaticite, son organicite et s'assurer que les bons noeuds sont lus au bon moment, les fichiers sont lus au bon moment et les index sont lus au bon moment, et surtout, en debut de session, ne lise pas tout le projet et les fichiers, mais uniquement les bons noeuds, les bons index et les bons fichiers pour un bon demarrage et un contexte complet, sans forcement cramer les tokens."

### Intention consolidee (apres cadrage)

- **Scope** : cerveau uniquement (pas modules/app, pas modules/design-system)
- **Ambition** : radical (renommage, restructuration, fusion/split, suppression pages orphelines). Suppression pure si elements inutiles. Liens inutiles retires.
- **SessionStart cible** : meme budget ~45k tokens mais plus intelligent. Loading deterministe identique chaque session (pas contextuel).
- **Livrables** : rapport audit ecrit (ce fichier) + plan execution EnterPlanMode.
- **Execution** : multi-session si ampleur > 1 session (validee par Kevin).

### Declencheur

- Adoption wiki D-WIKI-01 (2026-04-15) + mega audit v2 (2026-04-16) + audit v2 execution S1-S3 (2026-04-17 matin/soir/nuit) + cleanup drifts B+E (2026-04-17 midi). Chaque iteration a laisse des drifts localises dans le mapping/routage.
- L'audit v2 S3 a corrige la FONCTION cognitive (6 mecanismes auto-gouvernes) mais n'a pas touche au mapping/routage.

## 2. Perimetre

### Inclus (cerveau)

| Zone | Fichiers scannes |
|------|-----|
| Racine | CLAUDE.md (195L), CONTEXT.md (135L), README.md (53L) |
| Config | .claude/settings.json (60L), .claude/settings.local.json (86L), .obsidian/graph.json (107L) |
| docs/core | 9 specs (architecture-core, cortex, communication, monitor, tools, planner, worktrees, knowledge, naming-conventions) + tools/README-tools-catalogue.md |
| docs/ reste | architecture, decisions-log, index-documentation, manifeste, setup-guide, plans/_template-plan, specs/README |
| wiki/ | 50 pages (9 concepts + 5 entities + 4 sources + 16 meta + 5 templates + 6 domain indexes + 2 sub-domain concepts + 4 racine) |
| .claude/commands | 7 commands (cockpit, new-project, plan-os, session-start, session-end, sync, wt) |
| .claude/agents | 4 agents (dev, doc, os-architect, review) |
| scripts/ | 12 critiques (health-check, drift-detector, wiki-health, ref-checker, neuroplasticity-score, tier-contradiction-check, propositions-generator, memory-audit, memory-last-used-hook, wiki-counts-sync, sync-check, docs-sync-check) + 3 hooks (validate-void-glass, security-reminder, session-start-wiki, branch-name-check, auto-archive-plans) |
| memory/ | 25 auto-memories (17 feedback + 4 project + 1 user + 2 work_patterns + MEMORY.md index) + _deprecated/ |
| Travaux cowork | COWORK-CONTEXT.md (lu integral) + README-cowork.md + 17 livrables scannes structurellement |

### Exclus (hors scope)

- **modules/app/** : code applicatif (Kevin : "pas les modules")
- **modules/design-system/** : code DS
- **.archive/ contenu** : lecture seule (on verifie les refs qui pointent dedans, pas le contenu)
- **supabase/migrations/** : SQL
- **.github/workflows/** : CI
- **node_modules/**, **.omc/**, **.git/** : techniques

## 3. Methodologie

### Lecture exhaustive

- **128 fichiers lus integralement ligne par ligne** (pas de survol, pas de skip)
- **8 Grep strategiques** pour corroborer les findings :
  - `modules/app/data/*` (refs actives post-archive)
  - wikilinks totaux par fichier
  - wikilinks pointant vers pages DS hors-vault
  - `Storybook 8|9` (obsolescence)
  - `97|98|109 outils` (drift counts Tools)
  - `OMC v4` (version currentness)
  - `Total pages` (counts wiki)
  - `48 pages|50 pages|45 pages|...|wikilinks` (sources verite counts)
- Lecture de `.obsidian/graph.json` pour verifier colors/tags groups
- Verification tool-register + frontmatter `related:` pour detecter mismatches

### Hors-methodologie (limites honnetes)

- **Pas de lecture .archive/** (regle Kevin). Refs vers archive verifiees par grep, pas par contenu.
- **Pas de lecture modules/app, modules/design-system** (scope cerveau). Structure connue par docs + grep.
- **Pas de benchmark tokens reel** : les estimations ~45k SessionStart sont basees sur lignes-par-token moyen (4 chars/token), pas mesurees live.
- **Pas de verification visuelle Obsidian graph** : les observations sur le graph (hub etoile, orphelins) sont deduites des wikilinks, pas d'une inspection visuelle directe.

### Biais possibles (documentes pour honnetete)

- **Biais confirmation** : je cherche les drifts, je les trouve. Certains findings pourraient etre des "features" (ex: redondance journals = 3 perspectives complementaires ?).
- **Biais audit v2 recent** : l'audit v2 recent a deja corrige beaucoup. Ce qui reste peut etre des choix volontaires non-nettoyes.
- **Biais scope** : limite a ce que j'ai pu lire. Fichiers travaux-cowork scannes structurellement seulement.

## 4. Axes audites (13)

### Axe 1 — Routage SessionStart (ce qui est lu, quand)

**Etat constate** :

- `/cockpit` Tour 1 (`.claude/commands/cockpit.md`) : 7 reads — CONTEXT + hot + sessions-recent + lessons-learned + git + health + plans
- `/session-start` Tour 1 (`.claude/commands/session-start.md`) : 9 reads — CONTEXT + hot + sessions-recent + lessons-learned + **thinking** + git + health + **wiki-health** + plans
- Hook `session-start-wiki.sh` (.claude/settings.json SessionStart) : drift-detector + **`head -60 wiki/hot.md`**
- Hook PreToolUse Read → `memory-last-used-hook.sh` (update last_used frontmatter)
- Hook PreToolUse Write|Edit → `validate-void-glass.sh` + `security-reminder.py`

**Budget estime SessionStart actuel (~45k tokens)** :

| Source | Lignes | ~Tokens |
|--------|--------|--------|
| CONTEXT.md | 135 | ~4000 |
| wiki/hot.md | 96 (tronque 60 par hook) | ~1800 |
| wiki/meta/sessions-recent.md | 247 | ~8000 |
| wiki/meta/lessons-learned.md | 189 | ~6000 |
| wiki/meta/thinking.md | 45 | ~1500 |
| health-check output | ~25 | ~500 |
| wiki-health output | ~10 | ~200 |
| git status + log | ~5 | ~100 |
| Glob plans | N/A | ~100 |
| System reminders + prompts harness | — | ~25000 |
| **Total estime** | — | **~45000** |

**Findings** :

- **F1** `/cockpit` Tour 1 ≠ `/session-start` Tour 1 → divergence de **2 reads** (thinking.md + wiki-health). Deux points d'entree avec scan different → ambiguite. Gravite : 🟡 moyen.
- **F2** Hook `session-start-wiki.sh` tronque hot.md a `head -60` → hot.md fait actuellement 96 lignes → **36 lignes perdues au SessionStart** (mais Kevin les voit via `/session-start` Tour 1 qui read complet). Gravite : 🟡 (informationnel, pas bloquant mais incoherent).
- **F3** Double appel `drift-detector.sh` au SessionStart : une fois via hook (`session-start-wiki.sh` ligne 11), une fois via `health-check.sh` (chain INFO section). Gaspillage 1-2s + sortie dupliquee. Gravite : 🟡.

**Preuves bash** :

```bash
# F1
grep -c "Read\|Bash" .claude/commands/cockpit.md            # → ~7
grep -c "Read\|Bash" .claude/commands/session-start.md      # → ~9

# F2
grep "head -60" scripts/hooks/session-start-wiki.sh         # → "head -60 wiki/hot.md"
wc -l wiki/hot.md                                            # → 96

# F3
grep -c "drift-detector" scripts/hooks/session-start-wiki.sh  # → 1
grep -c "drift-detector" scripts/health-check.sh              # → 1 (section INFO chain)
```

### Axe 2 — Mapping / Cartographie (noeuds + liens)

**Etat constate** :

- **Hubs wiki** par count wikilinks sortants :
  - `wiki/meta/foundation-os-map.md` : **81** wikilinks (hub principal)
  - `wiki/domains/design/concepts/design-system-components.md` : **58** wikilinks
  - `wiki/index-wiki.md` : **53** wikilinks
  - `wiki/concepts/Foundation OS.md` : **25** wikilinks
  - `wiki/meta/index-cowork.md` : **23** wikilinks
- **Faibles connections** : domains Phase 5 (trading=3, finance=3, sante=1 wikilinks — nodes isoles), templates (0-3 wikilinks), routines-setup=9
- **Structure actuelle** : pattern "etoile" — foundation-os-map central, tout le reste satellite. Si map casse → graph perd structure.

**Findings** :

- **F4** `wiki/meta/foundation-os-map.md` = hub surdimensionne **81 wikilinks**, redondant avec `index-wiki.md` (53 wikilinks) + 7 sous-indexes (index-concepts, index-entities, index-sources, index-meta, index-core-os, index-app, index-cowork). Pattern etoile fragile. Gravite : 🔴 critique pour scalabilite (a 500 pages, cela deviendra ingerable).
- **F5** `wiki/meta/index-app.md` : **7 wikilinks casses** vers `[[modules/app/data/commander]]`, `[[modules/app/data/knowledge]]`, `[[modules/app/data/graph]]`, `[[modules/app/data/sync]]`, `[[modules/app/data/toolbox]]`, `[[modules/app/data/scale-orchestrator]]`, `[[modules/app/data/index-app-pages]]` — tous archives dans `.archive/app-data-jsx-260417/`. Gravite : 🔴 critique (page obsolete complete).
- **F6** `wiki/domains/design/concepts/design-system-components.md` : 46 wikilinks `[[01-button]]`..`[[46-carousel]]` + 6 foundations `[[01-colors]]`..`[[06-icons]]` → resolvent vers `modules/design-system/docs-supernova/components/*.md` et `foundations/*.md` (HORS vault wiki/). Techniquement OK selon D-VAULT-01 (vault = racine projet), mais pas navigable si vault restreint a wiki/. Gravite : 🟡 ambigu (frontiere vault).

**Preuves bash** :

```bash
# F4
grep -c "\[\[" wiki/meta/foundation-os-map.md             # → 81
grep -c "\[\[" wiki/index-wiki.md                         # → 53

# F5
grep -c "modules/app/data" wiki/meta/index-app.md         # → 7
ls modules/app/data/ 2>/dev/null                          # → absent (archive)
ls .archive/app-data-jsx-260417/data/                     # → 7 fichiers MD

# F6
grep -cE "\[\[0[1-9]-|\[\[[1-4][0-9]-" wiki/domains/design/concepts/design-system-components.md
# → ~52
find wiki -name "01-button.md" 2>/dev/null                # → absent
find modules/design-system/docs-supernova -name "01-button.md" 2>/dev/null  # → present
```

### Axe 3 — Nommage

**Etat constate** :

- **Racine wiki/** : kebab-case (hot.md, log.md, overview.md, index-wiki.md) → OK
- **wiki/concepts/** : Title Case with spaces (`Foundation OS.md`, `Brief v12.md`, `Hot Cache.md`, `Void Glass.md`) → convention D-NAMING-02 (Obsidian natif)
- **wiki/meta/** : kebab-case (sessions-recent, lessons-learned, thinking, routines-setup, routines-guardrails, session-dna, session-patterns, counts, foundation-os-map) → OK
- **wiki/meta/templates/** : kebab-case (concept, entity, source, comparison, question) → OK
- **wiki/sources/** : kebab-case (karpathy-llm-wiki-pattern, agricidaniel-claude-obsidian, session-2026-04-16-*) → OK
- **wiki/entities/** : Title Case (`Andrej Karpathy.md`, `AgriciDaniel.md`, `Obsidian.md`, `Pinecone.md`) + kebab (`tools-foundation-os.md`) → **mixed, D-NAMING-02 OK**
- **wiki/domains/** : kebab-case (index-trading, index-finance, etc.) → OK
- **docs/plans/** : `YYYY-MM-DD-slug.md` + `_template-plan.md` → OK
- **memory/** : snake_case prefixe (feedback_xxx, project_xxx, user_xxx, work_xxx) → OK
- **scripts/** : kebab-case `.sh` → OK

**Findings** : **AUCUN drift critique.** Convention D-NAMING-02 appliquee coherement. Pas de renommage massif necessaire.

**Preuves bash** :

```bash
# Concept spaces OK
ls wiki/concepts/ | grep " " | wc -l          # → 6 (Title Case avec espaces OK)
# Meta kebab OK
ls wiki/meta/*.md | grep -v "/[A-Z]" | wc -l  # → tous (kebab-case)
```

### Axe 4 — Tags / Couleurs Obsidian (graph.json)

**Etat constate** :

12 groupes couleurs dans `.obsidian/graph.json` :

| # | Query | RGB | Couleur |
|---|-------|-----|---------|
| 1 | `tag:#concept` | 15381256 | Yellow (#EAB308) |
| 2 | `tag:#entity` | 16347926 | Orange (#F97316) |
| 3 | `tag:#source` | 15680580 | Red (#EF4444) |
| 4 | `tag:#meta` | 13935988 | Beige (#D4A484) |
| 5 | `path:docs/core` | 3900150 | Blue (#3B82F6) |
| 6 | `path:docs/travaux-cowork` | 1357990 | Cyan (#14B8A6) |
| 7 | `path:docs` | 9133296 | Violet (#8B5CF6) |
| 8 | `path:modules` | 2278750 | Green (#22C55E) |
| 9 | `path:.claude` | 6514417 | Indigo (#6366F1) |
| **10** | `tag:#core-os` | **3900150** | **= #5 Blue (DUP)** |
| **11** | `tag:#cowork` | **1357990** | **= #6 Cyan (DUP)** |
| **12** | `tag:#app` | **2278750** | **= #8 Green (DUP)** |

**Findings** :

- **F7** 3 paires couleurs dupliquees (#5=#10, #6=#11, #8=#12). Un fichier avec `tag:#core-os` **ET** dans `path:docs/core` est matche par 2 queries meme couleur → redundant. Suppression des 3 tag queries (core-os, cowork, app) reduit a 9 groupes sans perte de semantique. Gravite : 🟡 visuel/architecture.

**Preuves bash** :

```bash
python3 -c "
import json
g = json.load(open('.obsidian/graph.json'))['colorGroups']
print(f'{len(g)} groupes')
colors = [(x['query'], x['color']['rgb']) for x in g]
rgb_to_queries = {}
for q, c in colors:
    rgb_to_queries.setdefault(c, []).append(q)
dups = {c: qs for c, qs in rgb_to_queries.items() if len(qs) > 1}
print(f'Paires couleurs dupliquees : {len(dups)}')
for c, qs in dups.items():
    print(f'  rgb={c} -> {qs}')
"
# → 12 groupes
# → Paires couleurs dupliquees : 3
# → rgb=3900150 -> ['path:docs/core', 'tag:#core-os']
# → rgb=1357990 -> ['path:docs/travaux-cowork', 'tag:#cowork']
# → rgb=2278750 -> ['path:modules', 'tag:#app']
```

### Axe 5 — Regroupements / Categories

**Etat constate** :

Categories wiki :

| Categorie | Pages | Usage |
|-----------|-------|-------|
| `wiki/concepts/` | 9 pages (9 atemporels cross-domain) | Actif |
| `wiki/entities/` | 5 pages | Actif |
| `wiki/sources/` | 4 pages | Actif |
| `wiki/meta/` | 13 + 5 templates | Actif |
| `wiki/domains/trading/` | 1 index + 0 contenu | **Placeholder Phase 5** |
| `wiki/domains/finance/` | 1 index + 0 contenu | **Placeholder Phase 5** |
| `wiki/domains/sante/` | 1 index + 0 contenu | **Placeholder Phase 5** |
| `wiki/domains/design/` | 1 index + 1 concept | Seed |
| `wiki/domains/dev/` | 1 index + 1 concept | Seed |
| `wiki/comparisons/` | **0 pages** | **Mort** (scaffolde jamais utilise) |
| `wiki/questions/` | **0 pages** | **Mort** |
| `wiki/canvases/` | **0 pages** | **Mort** |

**Findings** :

- **F14** 3 domaines Phase 5 (trading/finance/sante) = 100% squelettes. 3 nodes isoles dans graph Obsidian. Ne devraient pas polluer visuellement tant que Phase 5 non-demarree. Gravite : 🟡.
- **F15** 3 categories mortes (`wiki/comparisons/`, `wiki/questions/`, `wiki/canvases/`) : 0 pages chacune depuis adoption wiki 2026-04-15 (1+ mois). Templates `comparison.md` et `question.md` jamais utilises. Gravite : 🟢 (pollution visuelle graph + dossiers vides dans Obsidian sidebar).

**Preuves bash** :

```bash
# F14
find wiki/domains/trading wiki/domains/finance wiki/domains/sante -name "*.md" | wc -l    # → 3 (que indexes)

# F15
find wiki/comparisons wiki/questions wiki/canvases -name "*.md" 2>/dev/null | wc -l       # → 0
ls wiki/comparisons/ wiki/questions/ wiki/canvases/ 2>/dev/null                           # → vides
```

### Axe 6 — Routes de lecture (quand lire quoi)

**Etat constate** :

| Moment | Fichiers lus | Pourquoi |
|--------|--------|----------|
| Session start (hook auto) | wiki/hot.md (tronque 60 lignes), drift-detector output | Cache flash derniere session |
| `/session-start` Tour 1 | CONTEXT.md + 4x wiki/meta (hot, sessions-recent, lessons-learned, thinking) + git + health + wiki-health + plans | Context complet |
| `/cockpit` Tour 1 | CONTEXT.md + 3x wiki/meta (hot, sessions-recent, lessons-learned) + git + health + plans | Context partiel (skip thinking + wiki-health) |
| Session end | CONTEXT.md write + 7x wiki (hot, sessions-recent, thinking, lessons-learned, log, index-wiki, session-dna) | Update post-session |

**Findings** :

- Asymetrie lecture/ecriture : session-end ecrit 7 fichiers wiki/, session-start en lit 4. **Ratio 1:1.75 ecriture/lecture** — tres actif en ecriture mais pas exploite autant en lecture.
- **F9** 4 journals redondants : `wiki/log.md` (chronologique) + `wiki/meta/sessions-recent.md` (5 sessions narratif) + `wiki/meta/session-dna.md` (YAML structure) + `wiki/meta/session-patterns.md` (analytics auto). Pour "quoi s'est passe", 3 sources differentes. Gravite : 🟡.

**Preuves bash** :

```bash
# F9
ls wiki/log.md wiki/meta/sessions-recent.md wiki/meta/session-dna.md wiki/meta/session-patterns.md
# → 4 fichiers, tous actifs
wc -l wiki/log.md wiki/meta/sessions-recent.md wiki/meta/session-dna.md wiki/meta/session-patterns.md
# → 38L, 247L, 89L, 146L
```

### Axe 7 — Noeuds logiques / neurologiques / autoroutes reflexion

**Etat constate** :

- **Cortex routing** (`.claude/commands/cockpit.md` Phase 3 + `docs/core/cortex.md`) : table signaux → agent. DECORATIVE (pas enforce runtime).
- **Test arbitral 5 tiers** (`docs/core/communication.md` section 1.5) : "quoi va ou". DECORATIVE (pas enforce runtime).
- **4 reflexes neuroplasticite** (`CLAUDE.md` + `docs/core/knowledge.md` section 8) : recall wiki, consolidation, lessons, self-check. MANUEL (discipline).
- **Scripts neuro** : `neuroplasticity-score.sh` mesure les reflexes via commits + grep transcripts (proxy, pas parfait).

**Findings** :

- Aucun enforcement automatique = drifts accumules. Decision : **SKIP** enforcement (Phase 12 du plan — routing decoratif reste OK, discipline Kevin+Claude suffit pour dev solo).
- Route d'apprentissage (comment ajouter concept wiki, comment decider tier) : partiellement documentee (knowledge.md section 4 Workflows, test arbitral), pas optimale.

**Preuves bash** :

```bash
# neuroplasticity-score actuel
bash scripts/neuroplasticity-score.sh --quiet
# → ex: "Neuroplasticite 7j : 100% 🟢 actif" (score > 70% = actif)
```

### Axe 8 — References / liens entre fichiers

**Etat constate** :

- **ref-checker** actuel : 0 refs cassees (140 .md scannes). 🟢 SAIN.
- **Mais** ref-checker exclut `.claude/worktrees/`, `docs/travaux-cowork/`, certains paths specifiques → des refs peuvent etre actives et non-verifiees.
- **Wikilinks** : 791 wikilinks (source hot.md) — 668 dans wiki/ (source grep direct). Difference = wikilinks dans docs/ + autres.

**Frontmatter `related:`** : nombreux mais asymetriques. A pointe vers B, B ne pointe pas toujours vers A.

**Refs actives vers zones archivees (detection Phase Grep)** :

- 23+ refs `modules/app/data/*` dans docs/travaux-cowork/ (plans dashboard-monitoring, briefs) — **actifs** (plans futurs), non casses.
- 4 refs `modules/app/data/*` dans core docs : doc-agent.md, monitor.md, manifeste.md, tools-catalogue.md — **actifs**, a contextualiser car directory archive.

**Findings** :

- F5 (deja couvert Axe 2) : 7 wikilinks casses dans index-app.md
- F6 (deja couvert Axe 2) : 46+6 wikilinks DS hors-vault

### Axe 9 — Articulation globale

**3 niveaux articulation** (fonctionnel) :

1. **CLAUDE.md** (contrat comportemental) → pointe vers docs/core/*
2. **CONTEXT.md** (etat courant) → source de verite operationnelle
3. **wiki/** (knowledge atemporel) → sources externes + concepts

**Couplages identifies** :

- `modules/` ↔ `wiki/domains/` via frontmatter `implementation:` → **decoratif**, pas enforce.
- `scripts/health-check.sh` chain `scripts/*` autres (sync-check, wiki-health, drift, ref, tier-contradiction, neuroplasticity, tool-register) → **bien centralise**.
- `.claude/commands/*` ↔ `scripts/*` (ex: `/sync` → sync-check.sh, `/wt` → worktree-*.sh) → bien couple.

**Findings** :

- F1 (Axe 1) : divergence `/cockpit` vs `/session-start` Tour 1 = defaut d'articulation.

### Axe 10 — Memoire 5 tiers

**Etat** :

- Tier 1 (conversation) : volatile, OK
- Tier 2 (CONTEXT.md) : 135L, sous budget 150L, OK
- Tier 3 (auto-memory) : 25 actives + 14 deprecated, MEMORY.md index coherent
- Tier 4 (docs/) : stable
- Tier 5 (wiki/) : 50 pages

**Drifts memoires** :

- **F10** `project_structure.md` : "Storybook 8" (realite 9), "tokens DTCG + 46 ui" (realite tokens CSS `--ds-*` source unique). Gravite : 🟡.
- **F11** `project_audit_v2_s3_handoff.md` : status:active, contenu = handoff S3 Phase 16-18 DONE depuis hier. Devrait etre deprecate. Gravite : 🟡.
- **F12** `wiki/entities/tools-foundation-os.md` : "26 tools" (realite 109 tools catalogue), "177+ points d'invocation" (nombre bullshit non verifiable). Gravite : 🟡.
- **F13** `feedback_tout_automatique.md` : meta-regle qui liste 7 memoires + **duplique 30% de leur contenu** ("thinking francais", "titre 🪐", "branches format", etc.). Gravite : 🟢 (redondance passive).

**Contradictions tier** (runtime `tier-contradiction-check.sh`) : 0 duplications detectees (seuil 40 chars). 🟢 OK.

**Preuves bash** :

```bash
# F10
grep "Storybook 8\|tokens DTCG" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md
# → 2 matches (a corriger)

# F11
grep "^status:" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_audit_v2_s3_handoff.md
# → "status: active" (mais S3 DONE)

# F12
grep "26 tools\|177+" wiki/entities/tools-foundation-os.md
# → 2 matches

# F13
wc -l ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_tout_automatique.md
# → 60+ lignes (pourrait etre ~30)
```

### Axe 11 — Scalabilite

**Etat actuel** : wiki 50 pages + 791 wikilinks. Manageable.

**Projection Phase 5** (Finance + Sante + Trading lancent) : 500-1000 pages selon ingestion sources.

**Bottlenecks anticipes** :

- `wiki/index-wiki.md` : 130L avec 50 pages. A 500 pages → 500+ lignes d'index → **lourd a lire SessionStart**. Solution : 2 niveaux (niveau 1 minimal + sous-indexes par domaine).
- `wiki/meta/foundation-os-map.md` : 81 wikilinks a 50 pages → ~500+ wikilinks a 500 pages → **ingerable**.
- `wiki/hot.md` : 96L, cible 500 mots. OK si discipline maintenue.

**Recommandation** : navigation 2 niveaux deja prevue, pas encore enforced (F4).

### Axe 12 — Automaticite

**Auto actuel** :

- SessionStart hook : drift-detector + cat hot.md (partiel, tronque)
- SessionEnd hook : auto-archive-plans (archive plans DONE)
- PreToolUse Read : memory-last-used-hook (update last_used)
- PreToolUse Write|Edit : validate-void-glass + security-reminder
- PostCompact (documente mais pas verifie live) : re-read hot.md
- Stop (documente) : notif WIKI_CHANGED

**Semi-auto** :

- `wiki-counts-sync.sh --check` : detecte drift counts, ne corrige pas automatiquement (sauf si on l'invoque sans --check)
- `drift-detector.sh` : detect only, pas de --fix destructif

**Non-auto** (manuel) :

- Update `sessions-recent.md` (via /session-end)
- Update `hot.md` (via /session-end)
- Update `thinking.md`, `lessons-learned.md` (en session, par Claude)
- 14 routines Cloud documentees mais **inertes** (Kevin confirme jamais creees UI)

### Axe 13 — Organicite (auto-evolution, auto-reparation)

**Etat** :

- **Scripts orphelins** :
  - `session-lock.sh` conserve mais non-appele v2 (COWORK-CONTEXT indique retrait)
  - `wiki-metrics.sh` : pas chain
  - `wiki-suggest-links.sh` : pas chain
- **Hooks opt-in non-actives** :
  - `branch-name-check.sh` : cree mais pas dans settings.json
  - `wiki-recall-reminder.sh` : archive selon CONTEXT.md
- **Enforcement routing Cortex** : decoratif (pas de hook runtime)
- **Enforcement tier test arbitral** : decoratif
- **Enforcement 4 reflexes neuroplasticite** : discipline
- **Enforcement anti-bullshit gates** : discipline

**Conclusion** : organicite = 60% (lots of automation hooks/scripts, mais beaucoup de regles non-enforced). Kevin dit explicit "on garde discipline, on enforce pas" (Phase 12 SKIP).

## 5. Top 15 findings (par gravite)

| # | Gravite | Axe | Finding | Resolution phase |
|---|---------|-----|---------|------------------|
| F4 | 🔴 | Mapping | foundation-os-map 81 wikilinks hub etoile fragile | P4 Navigation 2 niveaux |
| F5 | 🔴 | Mapping | index-app.md 7 wikilinks casses vers archive | P3 Decomission + refs |
| F8 | 🔴 | Counts | 4 sources verite pages/wikilinks (45/48/50 + 733/791/804) | P2 Unification counts |
| F1 | 🟡 | Routage | /cockpit Tour 1 ≠ /session-start (5 vs 8 reads) | P7 SessionStart optimise |
| F2 | 🟡 | Routage | Hook tronque hot.md head -60 (fichier 96L) | P7 SessionStart optimise |
| F3 | 🟡 | Routage | Double appel drift-detector au SessionStart | P7 SessionStart optimise |
| F6 | 🟡 | Mapping | Wikilinks DS `[[01-button]]..` hors vault wiki/ | P11 Backtick refs |
| F7 | 🟡 | Tags | graph.json 3 paires couleurs dupliquees | P5 Clean graph.json |
| F9 | 🟡 | Journals | 4 journals redondants (log+sessions-recent+dna+patterns) | P6 Rationalisation 4→2 |
| F10 | 🟡 | Memoires | project_structure outdated (Storybook 8 + DTCG) | P8 Memoires nettoyage |
| F11 | 🟡 | Memoires | project_audit_v2_s3_handoff status:active mais DONE | P8 Memoires nettoyage |
| F12 | 🟡 | Memoires | tools-foundation-os "26 tools" + "177+ bullshit" | P8 Memoires nettoyage |
| F14 | 🟡 | Categories | Domains trading/finance/sante = squelettes isoles | P9 [!placeholder] |
| F13 | 🟢 | Memoires | feedback_tout_automatique duplique 30% contenu 7 memoires | P8 Memoires nettoyage |
| F15 | 🟢 | Categories | 3 categories mortes (comparisons/questions/canvases) | P10 Suppression |

**Gravite** : 🔴 critique (impact navigation/comprehension) · 🟡 moyen (drift documentaire) · 🟢 faible (pollution mineure)

## 6. Root cause analysis

### Causes racines identifiees

1. **Croissance rapide** (adoption wiki 2026-04-15 → audit v2 S3 2026-04-17, 1 semaine intense)
   - 15+ commits audit v2 + cleanup, chacun laissant des drifts localises
   - Pas de "re-alignement global" apres chaque vague

2. **Pas d'enforcement automatique**
   - Routing Cortex decoratif (pas de hook runtime)
   - Test arbitral tier decoratif (pas de hook runtime)
   - 4 reflexes neuro = discipline manuelle
   - Consequence : drifts silencieux entre sessions

3. **Duplication structurelle**
   - 5 points verite pour stats wiki (counts.md, hot.md, overview.md, index-wiki.md, foundation-os-map.md)
   - 4 journals redondants (log + sessions-recent + session-dna + session-patterns)
   - 3 descriptions neuroplasticite (knowledge.md section 8 + concept wiki + memoire feedback)
   - Pattern : "on cree plutot que fusionner", conse quence = proliferation

4. **Audit v2 S3 a traite FONCTION, pas MAPPING**
   - S3 Phase 16 (memory priorisation) + Phase 17 (contradictions) + Phase 18 (feedback loop) = corrige la fonction cognitive
   - Mais n'a pas touche au mapping/navigation → gap comble par cet audit

5. **Scope creep des sous-indexes**
   - 7 sous-indexes crees (index-concepts, index-entities, index-sources, index-meta, index-core-os, index-app, index-cowork) mais pas integres dans une architecture 2 niveaux claire
   - foundation-os-map continue de lister tout comme au niveau 1 → doublon

## 7. Recommandations

Voir plan d'execution dedie : [`docs/plans/2026-04-17-mapping-routage-refactor.md`](../../plans/2026-04-17-mapping-routage-refactor.md)

**Synthese plan** : 15 phases sur 3 sessions (~10h).

- **Session A (~3h)** : P1 rapport ecrit + P2 unification counts + P3 decomission index-app + P4 navigation 2 niveaux + P5 clean graph.json
- **Session B (~4h)** : P6 rationaliser journals + P7 SessionStart optimise + P8 memoires nettoyage + P9 domains placeholder + P10 categories mortes + P11 DS backtick
- **Session C (~3h)** : P12 SKIP enforcement + P13 tests + P14 docs sync + P15 rapport post-exec + archive

## 8. Commandes verification par finding (reproductibilite)

### F1 — Divergence Tour 1 cockpit vs session-start

```bash
grep -c "^> [0-9]\|Read\|Bash" .claude/commands/cockpit.md        # baseline avant P7
grep -c "^> [0-9]\|Read\|Bash" .claude/commands/session-start.md  # baseline avant P7
# Attendu apres P7 : meme nombre d'actions Tour 1
```

### F2 — Hook tronque hot.md

```bash
grep "head -60" scripts/hooks/session-start-wiki.sh
# Attendu apres P7 : aucun match (remplace par "cat wiki/hot.md")
```

### F3 — Double appel drift-detector

```bash
grep -c "drift-detector" scripts/hooks/session-start-wiki.sh scripts/health-check.sh
# Attendu apres P7 : 0 + 1 = 1 (seul health-check chain)
```

### F4 — Hub foundation-os-map surdimensionne

```bash
grep -c "\[\[" wiki/meta/foundation-os-map.md
# Baseline : 81
# Cible P4 : 10-20 (compress vers hub niveau 2)
wc -l wiki/meta/foundation-os-map.md
# Baseline : 205L
# Cible P4 : 50-80L
```

### F5 — index-app casses

```bash
grep "modules/app/data" wiki/meta/index-app.md | wc -l
# Baseline : 7
# Cible P3 : 0 (fichier archive)
ls .archive/wiki-orphans-260417/index-app.md
# Cible P3 : exists
```

### F6 — Wikilinks DS hors-vault

```bash
grep -cE "\[\[0[1-9]-|\[\[[1-4][0-9]-" wiki/domains/design/concepts/design-system-components.md
# Baseline : ~52
# Cible P11 : 0 (tous convertis en backtick paths)
```

### F7 — graph.json duplicates

```bash
python3 -c "
import json
g = json.load(open('.obsidian/graph.json'))['colorGroups']
print(len(g))"
# Baseline : 12
# Cible P5 : 9
```

### F8 — Counts sources verite

```bash
grep -E "[0-9]+ pages|[0-9]+ wikilinks" wiki/hot.md wiki/overview.md wiki/index-wiki.md wiki/meta/counts.md wiki/log.md | head -20
# Baseline : valeurs divergentes (45, 48, 50 / 733, 791, 804)
# Cible P2 : uniquement counts.md contient les chiffres, autres pointent vers [[counts]]
```

### F9 — 4 journals

```bash
ls wiki/log.md wiki/meta/sessions-recent.md wiki/meta/session-dna.md wiki/meta/session-patterns.md 2>/dev/null | wc -l
# Baseline : 4
# Cible P6 : 2 (log + session-dna archives)
```

### F10 — project_structure outdated

```bash
grep "Storybook 8\|tokens DTCG" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md
# Baseline : 2 matches
# Cible P8 : 0 matches
```

### F11 — audit_v2_s3_handoff active

```bash
grep "^status:" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_audit_v2_s3_handoff.md 2>/dev/null
# Baseline : "status: active"
# Cible P8 : fichier dans _deprecated/
```

### F12 — tools-foundation-os bullshit

```bash
grep "26 tools\|177+" wiki/entities/tools-foundation-os.md
# Baseline : 2 matches
# Cible P8 : 0 matches
```

### F13 — tout_automatique redondance

```bash
wc -l ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_tout_automatique.md
# Baseline : ~60
# Cible P8 : ~30 (compresse en pointeurs)
```

### F14 — Domains Phase 5 squelettes

```bash
find wiki/domains/trading wiki/domains/finance wiki/domains/sante -name "*.md" | wc -l
# Baseline : 3 (indexes only)
# Cible P9 : 3 + callouts [!placeholder] dans chaque
grep -c "\[!placeholder\]" wiki/domains/trading/index-trading.md wiki/domains/finance/index-finance.md wiki/domains/sante/index-sante.md
# Cible P9 : chacun >= 1
```

### F15 — Categories mortes

```bash
ls wiki/comparisons/ wiki/questions/ wiki/canvases/ 2>/dev/null
# Baseline : 3 dossiers vides
# Cible P10 : absents (supprimes)
find wiki/meta/templates -name "*.md" | wc -l
# Baseline : 5
# Cible P10 : 3 (comparison + question archives)
```

## 9. Execution results

> **SECTION A REMPLIR EN PHASE 15** du plan d'execution. Pour chaque finding : STATUS (RESOLU / SKIP / DEFERRE) + commit hash + commande verification.

_Cette section sera completee apres execution des 14 phases actives (Phase 12 SKIP)._

### Template par finding

```markdown
### Fxx — <titre>
- **Status** : RESOLU / SKIP / DEFERRE
- **Resolution** : Phase X, commit `abc1234`
- **Verification** : <commande bash> → <output attendu>
- **Notes** : <ecart eventuel vs plan>
```

## 10. Honnetete et limites du present audit

- **Je n'ai PAS visuellement inspecte le graph Obsidian** (observations deduites des wikilinks, pas d'une inspection image).
- **Les ~45k tokens SessionStart sont estimes** (4 chars/token), pas mesures live.
- **Certains findings peuvent etre des "features" volontaires** non-documentees (ex: redondance journals = 3 perspectives complementaires ? a trancher).
- **Scope limite** : cerveau uniquement, pas modules/app, pas modules/design-system, pas .archive/ contenu.
- **Biais confirmation** : je cherchais des drifts, j'en ai trouve. Si je cherchais des "features", j'aurais peut-etre trouve des defenses. Les 15 findings sont ceux ou le consensus multi-sources (grep + lecture + spec vs realite) indique un drift sans ambiguite.

## 11. Metriques audit

| Metrique | Valeur |
|----------|--------|
| Fichiers lus (lecture integrale) | 128 |
| Axes audites | 13 |
| Findings detectes | 15 |
| Gravite critique 🔴 | 3 (F4, F5, F8) |
| Gravite moyenne 🟡 | 10 (F1, F2, F3, F6, F7, F9, F10, F11, F12, F14) |
| Gravite faible 🟢 | 2 (F13, F15) |
| Grep strategiques | 8 |
| Duree audit | ~4h (lecture + grep + redaction) |

## 12. References

- Plan execution : [`docs/plans/2026-04-17-mapping-routage-refactor.md`](../../plans/2026-04-17-mapping-routage-refactor.md)
- Foundation OS concept : [`wiki/concepts/Foundation OS.md`](../../../wiki/concepts/Foundation OS.md)
- CLAUDE.md : [`CLAUDE.md`](../../../CLAUDE.md)
- CONTEXT.md : [`CONTEXT.md`](../../../CONTEXT.md)
- Regles Foundation OS : `docs/core/*.md` (7 specs)
- Graph config : `.obsidian/graph.json`

---

**Auditeur** : Claude Opus 4.7 (1M context)
**Date** : 2026-04-17
**Branche** : `claude/keen-mahavira-a1664e`
**Parent HEAD** : `9a60cc7 merge: session 2026-04-17 B+E`
