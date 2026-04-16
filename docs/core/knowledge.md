# Knowledge — Spec Module Core OS (Phase 7)

Module Core OS responsable du knowledge layer persistant Foundation OS via plugin `claude-obsidian` (pattern [[LLM Wiki Pattern|Karpathy LLM Wiki]]).

> Ce module definit COMMENT le knowledge externe atemporel est accumule, structure, navigue et cross-reference avec les modules applicatifs. Adoption 2026-04-15 (D-WIKI-01).

## 1. Architecture

### Vault structure

```
wiki/
├── hot.md          cache narratif 500 mots derniere session
├── index-wiki.md   master catalog (1 ligne par page)
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

- Version : v1.4.3 (adoption 2026-04-15 D-WIKI-01)
- Source : https://github.com/AgriciDaniel/claude-obsidian
- 10 skills, 4 commands, 3 hooks actifs (1 desactive : PostToolUse auto-commit)
- 2 agents : wiki-ingest, wiki-lint (compatibles Task tool)
- 5 templates : concept, source, entity, comparison, question

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
| canvas | [[Obsidian]] canvas visual | "/canvas [description]" |
| defuddle | clean article web | ingest URL avec defuddle available |
| obsidian-bases | Dataview replacement | utilisation bases natives Obsidian |
| obsidian-markdown | syntax kepano Obsidian | standardisation markdown |

Catalogue complet avec allowed-tools : `docs/core/tools.md` section 1c (Phase 6).

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

### Brief v12 enrichi (tuiles HOT + WIKI)

Voir `docs/core/communication.md` section 6.1. Le brief de debut de session affiche :
- **Cadre HOT** (entre SANTE et TRAJECTOIRE) : 3-5 lignes condensees de `wiki/hot.md`
- **Cadre WIKI** (entre PLANS ACTIFS et MODULES) : compteur pages/sources/domaines + derniere ingest

### Hooks

- **SessionStart** : chainage drift-detector + cat wiki/hot.md (wrapper `scripts/hooks/session-start-wiki.sh`)
- **PostCompact** : re-cat wiki/hot.md (preserve hot cache post-compactage)
- **PostToolUse Write|Edit** : **DESACTIVE** (casse regle Kevin-valide, remplace par `scripts/wiki-commit.sh`)
- **Stop** : notif WIKI_CHANGED si wiki/ modifie — prompt update hot.md dans `/session-end`

### Scripts custom (Phase 9)

- `scripts/wiki-commit.sh` — commit manuel wiki/ + .raw/ (respect Kevin-valide)
- `scripts/wiki-health.sh` — health-check wiki (hot.md age, index.md sync)
- `scripts/ref-checker.sh` — etendu pour scanner wikilinks dans wiki/
- `scripts/drift-detector.sh` — etendu pour check hot.md age + index.md vs filesystem
- `scripts/hooks/session-start-wiki.sh` — wrapper SessionStart chainage

## 6. Regle d'or

**Une info = un seul tier.** Voir `docs/core/communication.md` section 1.5 (test arbitral).

5 tiers memoire Foundation OS :
1. Conversation Claude (volatile)
2. CONTEXT.md (etat operationnel)
3. auto-memory (profile + comportement)
4. docs/ (specs techniques)
5. wiki/ (knowledge externe atemporel) — Ce module

## 7. Relation avec autres modules Core OS

| Module | Relation avec Knowledge |
|--------|-------------------------|
| Cortex | Route queries knowledge vers wiki-query skill |
| Communication | Section 1.5 test arbitral defini ici, brief v12 integre cadres HOT + WIKI |
| Monitor | `scripts/wiki-health.sh` chain dans `health-check.sh` |
| Tools | Catalogue 10 skills claude-obsidian + scripts custom |
| Planner | Plans peuvent referencer wiki/domains/<X>/concepts pour contexte |
| Worktrees | Vault wiki/ versionne git, accessible cross-worktrees |

## 8. Neuroplasticite (auto-amelioration memoire)

Systeme d'auto-maintenance et auto-amelioration de la memoire. Regle Kevin : "c'est ton cerveau, utilise-le en autonomie". Max x20 = aucune limite tokens.

### Flux session complet

```
SESSION START
1. CLAUDE.md + auto-memory/ (AUTO Claude Code)
2. Hook SessionStart : drift-detector + cat wiki/hot.md (AUTO)
3. /session-start lit : CONTEXT.md + wiki/meta/sessions-recent.md
   + wiki/meta/lessons-learned.md + wiki/meta/thinking.md

TRAVAIL
- Reflexe 1 RECALL : grep wiki/ avant reponse technique → lire page pertinente
- Reflexe 2 CONSOLIDATION : apres /save ou ingest → enrichir pages existantes liees
- Reflexe 3 LESSONS : si erreur/piege → ajouter dans lessons-learned.md
- Kevin partage article/URL → ingest auto (.raw/ + wiki-ingest)
- Insight cross-domain → noter dans thinking.md

SESSION END
- Reflexe 4 SELF-CHECK : bash scripts/wiki-health.sh
  + update sessions-recent.md (append, 5 dernieres)
  + update thinking.md si insight cette session
- Update CONTEXT.md + hot.md (standard /session-end)
- /save si session riche (AUTONOME, pas attendre Kevin)

ENTRE SESSIONS (Routines Cloud, Max 15/jour)
- Wiki Health Monitor (quotidien) : fix wikilinks, refresh hot.md stale, sync index stats
- Wiki Consolidation (hebdo) : enrichir pages seed, bidirectionnaliser wikilinks, fusionner similaires
- Documentation Drift (hebdo) : verifier coherence docs ↔ code, CONTEXT < 200L
```

### 4 reflexes obligatoires (CLAUDE.md)

| Reflexe | Quand | Action |
|---------|-------|--------|
| Recall wiki | Avant reponse technique | `Grep` wiki/ → lire page si existe → citer |
| Consolidation | Apres /save ou ingest | Enrichir pages existantes + callout `[!updated]` |
| Lessons learned | Si erreur/piege rencontree | Ajouter dans `wiki/meta/lessons-learned.md` |
| Self-check | En /session-end | wiki-health + sessions-recent + thinking |

### Pages meta neuroplasticite

| Page | Role | Cycle |
|------|------|-------|
| `wiki/meta/thinking.md` | Reflexions, hypotheses, connexions cross-domain | Enrichi en session |
| `wiki/meta/sessions-recent.md` | 5 dernieres sessions (append, memoire court terme) | Append en /session-end |
| `wiki/meta/lessons-learned.md` | Auto-apprentissage erreurs/pieges | Enrichi en session |
| `wiki/hot.md` | Cache flash derniere session (overwrite) | Overwrite en /session-end |
| `wiki/log.md` | Chronological operations log | Append en /session-end |
| `.claude/loop.md` | Maintenance memoire si `/loop` bare | 7 checks automatises |

### Routines Cloud autonomes (Max x20 = 15/jour)

Toutes 100% autonomes. Zero intervention Kevin. Commit direct main. Si renommage → recabler TOUTES les refs. Verification refs apres CHAQUE modification.

| Routine | Schedule | Action |
|---------|----------|--------|
| Wiki Health Monitor | Quotidien 8h | fix wikilinks casses, refresh hot.md stale > 3j, sync index stats, commit direct main |
| Wiki Consolidation | Hebdo dimanche 20h | enrichir pages seed > 7j, bidirectionnaliser wikilinks, fusionner similaires, commit direct main |
| Documentation Drift | Hebdo lundi 9h | CONTEXT < 200L, docs ↔ code sync, CLAUDE ↔ docs coherent. Fix mineur → commit direct. Fix majeur → issue GitHub detaillee. |

Regle routines : **zero regression**. Apres chaque modification → `bash scripts/ref-checker.sh`. Si renommage → grep + update TOUTES references. Ne JAMAIS supprimer de fichier. Ne JAMAIS degrader.

### Documentation inter-sessions (anti-perte contexte)

Ce fichier (`docs/core/knowledge.md`) + memoire `feedback_neuroplasticity.md` = documentation complete du fonctionnement. Lus automatiquement (CLAUDE.md pointe ici, auto-memory charge feedback). Toute session future retrouve le contexte complet.

## 9. Limites / Hors scope

- **Pinecone embeddings** : differe 12+ mois, quand > 500 pages wiki
- **Canvas export** : non automatise, Kevin cree manuellement via `/canvas`
- **Skills custom par module** (wiki-trading-strategy-doc, wiki-sante-bilan-extract, etc.) : hors scope adoption initiale. A builder quand module Phase 5 demarre (~2h par skill).
- **Obsidian sync cloud** : NON utilise (privacy-first, git versionning suffit)
- **Sources sensibles (raw scans bio, cles API)** : JAMAIS dans wiki/ ni .raw/. Uniquement dans `modules/<X>/data/` + `modules/<X>/secrets/` (gitignored).

## 10. Maintenance

### Drift detection
`scripts/drift-detector.sh` verifie :
- `wiki/hot.md` age < 7 jours (sinon WARN)
- `wiki/index.md` sync avec filesystem (total pages coherent)
- Wikilinks casses dans `wiki/*.md`

### Commits
Manuel via `scripts/wiki-commit.sh` propose dans `/session-end`.

### Sauvegardes
Versionne git. Obsidian sync cloud NON utilise (privacy Phase 5).

### Lint
`wiki-lint` skill pour audit qualite (broken links, orphans, inconsistances).

## 11. Migration auto-memory → wiki/ (historique)

Lors adoption 2026-04-15, 2 memoires migrees selectivement :
- `project_migration_desktop.md` → `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` (concept dev atemporel)
- `tools_inventory.md` → `wiki/entities/tools-foundation-os.md` (entity tool)

27 autres memoires RESTENT dans auto-memory (profile Kevin + feedback comportement Claude = bon tier).

Principe migration : 1-par-1 avec ASK Kevin, zero perte. Voir Phase 5 du plan adoption.
