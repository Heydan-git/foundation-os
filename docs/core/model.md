# Model — Spec Module Core OS (Phase 10)

> 10e module Core OS responsable de la **conscience du modele IA active** (version, capacites, limites) et de l'**optimisation d'usage** (tokens, subagents, strategie). Adoption D-MODEL-01 (2026-04-19).
>
> Metaphore : le cerveau sait qui il est — version, forces, faiblesses — pour adapter son comportement. Analogue au module Body (proprioception Kevin-Claude) mais tourne vers **soi**. Metaconscience.

## 1. Architecture

### Role dans Core OS

10e module Core OS, **transverse**. Ne remplace aucun autre module. Informe les autres :
- **Cortex** : adapte routing selon capacites modele actif (ex : si downgrade Haiku, subagents limites)
- **Communication** : brief v12 + layered loading doivent respecter budget modele
- **Tools** : strategie subagents depend du context window et tokenizer
- **Body** : alignment-auditor utilisable seulement si modele supporte clean-slate

Philosophie : **si Foundation OS ne sait pas qui execute, les optimisations sont aveugles**.

### Source de verite

- **Version active** : `docs/core/model.md` section 2 (ce fichier)
- **Documentation Anthropic** : https://platform.claude.com/docs/en/docs/about-claude/models/overview
- **API Models list** : `GET https://api.anthropic.com/v1/models`

## 2. Version active (2026-04-19)

**Modele** : Claude Opus 4.7 1M context

| Parametre | Valeur | Source |
|-----------|--------|--------|
| API ID | `claude-opus-4-7` | Doc officielle |
| API alias | `claude-opus-4-7[1m]` | Environnement Claude Code Desktop |
| Context window | **1,000,000 tokens** | Doc officielle (nouveau tokenizer) |
| Context window en mots | ~555k words / ~2.5M unicode chars | Doc officielle |
| Max output tokens | 128,000 | Doc officielle (Messages API) |
| Max output beta (Batch) | 300,000 | `output-300k-2026-03-24` beta header |
| Extended thinking | ❌ Non | Doc officielle |
| Adaptive thinking | ✅ Oui | Doc officielle |
| Priority Tier | ✅ Oui | Doc officielle |
| Latency | Moderate | Doc officielle |
| Pricing input | $5 / million tokens | Doc officielle |
| Pricing output | $25 / million tokens | Doc officielle |
| Reliable knowledge cutoff | **Janvier 2026** | Doc officielle |
| Training data cutoff | Janvier 2026 | Doc officielle |
| Cache 5-minute TTL | Oui (prompt caching) | Claude API |
| Depreciation | Active, non-deprecated | Doc officielle |

## 3. Forces mesurees (Opus 4.7)

| Force | Detail | Impact FOS |
|-------|--------|------------|
| **1M context window** | Tokenizer nouvelle generation, 555k words | Session audit complet possible (cette session) |
| **Agentic coding step-change** | Amelioration vs Opus 4.6 | Deleguer tasks complexes multi-fichiers |
| **Tool use** | Paralleles + subagents | Strategie parallelisation efficace |
| **Honnetete** | Top-tier dans benchmarks | P-02 / P-11 constitution natif |
| **Multilingue** | Francais natif excellent | Communication Kevin ideale |
| **Long-context** | Top-tier benchmarks | Plans multi-phase avec 6 elements stricts |
| **Image processing** | Vision integree | Screenshots chrome-devtools pour verif UI |

### Applications FOS concretes

- **Audit exhaustif multi-fichiers** : D-AUDIT-TOTAL-01 lit 50+ fichiers en 1 session sans compactage observable
- **Plans 14 phases** : discipline 6 elements stricts par phase applicable sans perte de contexte
- **Subagents paralleles** : max 3 en batch (pattern CLAUDE.md)
- **Constitutional AI derive** : 41 P-XX principles suivis naturellement

## 4. Faiblesses connues + limitations

| Faiblesse | Detail | Mitigation FOS |
|-----------|--------|----------------|
| **Compactage thrashing** | Si context rempli trop vite (3+ compactions en 3 turns) | Pre-compaction snapshot + commits atomiques |
| **Subagent prompt > 1500 mots** | Thrashing probable (preuve session 2026-04-19 Agent A) | Max 500 mots strict + scope precis |
| **Lost in the middle** | Degradation attention mid-context (connu LLM) | Layered loading L0-L3 + pertinent first |
| **Hallucination sous pression** | Si Kevin challenge + timer court | Honnetete P-11 + "je ne sais pas" |
| **No extended thinking** | Opus 4.7 n'a pas thinking explicite (vs Sonnet 4.6) | Adaptive thinking suffit + decoupage phases |
| **Latency moderate** | Chaque tool call reprocesse tout context | Grouper tool calls en parallele + TodoWrite |
| **Cost eleve** | $5/MTok input + $25/MTok output | Max x20 plan Kevin couvre, mais discipline attendue |

### Anti-patterns a eviter

- ❌ Lancer 3 subagents avec prompts 2000 mots chacun (= 6000 mots input x3 = thrashing risque)
- ❌ Charger tout wiki/ (50 pages) quand L0 hot.md suffit
- ❌ Poursuivre session > 8-10h sans checkpoint (memoire degradee, mieux decouper)
- ❌ Utiliser Opus 4.7 pour tasks triviales (Haiku 4.5 suffit + 5x moins cher)

## 5. Optimisations specifiques FOS Opus 4.7

### 5.1 Layered loading strict (L0-L3)

Spec `docs/core/communication.md` section 6.5 + `scripts/thresholds.json` :
- **L0** (hot.md) : 200 tokens max — currently 1478 (7.4x over, fix P12)
- **L1** (CONTEXT + sessions-recent) : 2000 tokens max — currently ~5305 (2.6x over)
- **L2** (lessons + thinking + plans + constitution) : 10000 tokens max
- **L3** (pages wiki) : on-demand via reflex 1

**Recommandation** : pour tasks trivial/typo → L0 seul. Tasks standard → L0+L1. Refactor/audit → L0+L1+L2.

### 5.2 Subagents strategy

Pattern valide session 2026-04-19 (1 subagent reussi / 3 lances) :

**Do** :
- Max 500 mots prompt par subagent
- Scope precis (max 15 fichiers listes explicitement)
- Livrable format structure (table, markdown)
- Fallback Read direct documented si thrashing

**Don't** :
- Prompts > 1000 mots
- Scope ambigu ("audite tout le projet")
- Subagent recursif (agent qui lance autre agent)
- Subagent pour phases write-critical (toujours Read+Edit direct)

### 5.3 Parallel tool calls

Opus 4.7 supporte parallel tool calls. Rule :
- Independent tool calls → **MUST** parallel (single message, multiple tool_use blocks)
- Dependent tool calls → sequential
- Max 10 tool calls en parallele par message (pragmatique, pas limite API)

### 5.4 Pre-compaction snapshot

Hook `PreCompact` → `scripts/hooks/pre-compaction-snapshot.sh` dump `hot.md + CONTEXT Cap + TodoWrite` dans `.omc/snapshots/YYYYMMDD-HHMM-<worktree>.md`. Rotation 14.

**Usage recovery** :
```bash
cat $(ls -t .omc/snapshots/*.md | head -1)
```

### 5.5 Prompt caching (5-minute TTL)

- Reads identiques < 5 min = cache warm (rapide + moins coute)
- Strategy : grouper tool calls au meme fichier dans 5 min window
- ScheduleWakeup delai > 300s = cache cold (mais 1 cache miss evite wait)

## 6. Files critiques — Recap

| Fichier | Type | Role |
|---------|------|------|
| `docs/core/model.md` | spec canonique | Ce fichier |
| `docs/core/architecture-core.md` | index | Table modules (9 → 10) |
| `docs/core/tools.md` | inventaire outils | Reference strategy subagents |
| `docs/core/communication.md` | brief v12 + layered | Section 6.5 L0-L3 |
| `scripts/thresholds.json` | seuils | layered_loading + pre_compaction |
| `scripts/hooks/pre-compaction-snapshot.sh` | hook | Mitigation compactage |
| `wiki/concepts/Model Awareness.md` | concept wiki | Navigation Obsidian (P5 D-MODEL-01 futur) |

## 7. Integration avec 9 autres modules Core OS

| Module | Relation avec Model |
|--------|---------------------|
| **Cortex** | Routing agents tient compte capacites modele (ex : si Haiku, pas de subagents complexes) |
| **Communication** | Brief v12 + layered loading respectent budget tokens modele |
| **Monitor** | Chain health-check INFO peut inclure "model : claude-opus-4-7-1m" |
| **Tools** | Strategy subagents section 5.2 documentee ici pour tools.md |
| **Planner** | `/plan-os` AskUserQuestion peut informer sur cost estime selon modele |
| **Worktrees** | Multi-worktrees + Opus 4.7 1M = 5 sessions paralleles possibles |
| **Knowledge** | Layered loading formalise decide limites cache context |
| **Body** | alignment-auditor subagent utilise sonnet (moins cout) — design choice valide |
| **Product** | Notion MCP rate limits (3 req/s) respectes batching Opus 4.7 |

## 8. Workflows

### Workflow 1 : SessionStart model check

Au `/session-start` Tour 1, afficher dans brief v12 tuile SANTE :
- "Model : claude-opus-4-7-1m (knowledge cutoff Jan 2026)"
- Source : `docs/core/model.md` section 2 (lecture optionnelle L2)

### Workflow 2 : Model upgrade detection

Quand Anthropic publie nouvelle version (ex : Opus 4.8) :
1. Executer WebFetch `platform.claude.com/docs/en/about-claude/models/overview`
2. Comparer avec section 2 courante
3. Nouvelle Decision `D-MODEL-0N` documentant upgrade
4. Append section 2 avec nouvelles capacites
5. Update sections 3-5 (forces/faiblesses/optimisations)

### Workflow 3 : Task triage par cost

Avant tache complexe :
- Task triviale (typo, grep) → Haiku 4.5 ($1/$5 MTok)
- Task standard (code change 1-3 files) → Sonnet 4.6 ($3/$15 MTok)
- Task complexe (audit, refactor multi-modules, plan 10+ phases) → **Opus 4.7** ($5/$25 MTok)

Kevin Max x20 couvre tout mais cost-aware = discipline.

### Workflow 4 : Pre-action check tokens

Avant read massif ou subagent parallel :
- Estimer tokens cible (chars / 4)
- Si > 50k tokens prevus → utiliser stratification : subagent Explore scope precis vs main thread load complet
- Preferer Grep/Glob (pas de contenu) vs Read complet quand applicable

## 9. Regle d'or

**Le modele actif dicte la strategie. Une optimisation valide pour Sonnet 4.6 peut etre destructrice pour Haiku 4.5.**

- Chaque module Core OS adapte son comportement selon `docs/core/model.md` section 2
- Chaque upgrade modele = nouvelle D-MODEL-XX + revision sections 3-5
- Append-only : ne jamais rewrite, toujours ajouter version history

## 10. Limites / Hors scope

- **Pas d'auto-detection modele runtime** : Claude Code Desktop expose version dans environnement mais pas d'API MCP simple pour Claude lire. Workaround : lecture manuelle section 2.
- **Pas de cost-tracker live** : `scripts/token-usage-report.sh` propose P12 mais pas encore implemente.
- **Pas de model fallback dynamique** : si Opus 4.7 indisponible, user doit switcher manuellement Desktop.
- **Pas de benchmark custom FOS** : documentation officielle Anthropic + observations session = source.
- **Migration model version** : D-MODEL-0N workflow documente section 8.2 mais jamais execute (section 2 = premiere version).

## 11. Maintenance

### Quarterly review

- Verifier `platform.claude.com/docs/en/docs/about-claude/models/overview` vs section 2
- Si ecart → WebFetch + update + nouveau D-MODEL-0N
- Deprecation : si Opus 4.7 devient deprecated, urgence migration

### Chain health-check (futur)

Optionnel : ajouter ligne INFO dans `scripts/health-check.sh` :
```bash
MODEL_LINE=$(grep "API ID" docs/core/model.md | head -1)
echo -e "  [OK] Model : $MODEL_LINE"
```

### Backlog evolution

- **Hook PreToolUse model awareness** : verifier model version actif vs `docs/core/model.md` section 2 — avertir si drift (API Claude Code Desktop l'expose-t-elle ?)
- **Script mcp-model-check.sh** : query `/v1/models` endpoint pour lister modeles dispos (cost-aware)
- **Migration historique** : ajouter section "12. History" avec tableau D-MODEL-0N timeline
- **Brief v12 tuile #18 MODEL** : optionnel si plus d'1 modele change regulierement

---

**Decision associee** : **D-MODEL-01** (2026-04-19) — Module Model Awareness 10e Core OS. Version initiale spec Opus 4.7 1M context. Derive de doc officielle Anthropic + observations session 2026-04-19 (subagent thrashing pattern + pre-compaction proof).

**Plan d'execution** : integration dans `.archive/plans-done-260419/2026-04-19-audit-total-foundation-os.md` Phase P9 (apres archive hook SessionEnd).

## Sources

- [Anthropic Models Overview (2026-04)](https://platform.claude.com/docs/en/docs/about-claude/models/overview)
- [Extended Thinking docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Prompt Caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Messages API Batch extended output 300k](https://platform.claude.com/docs/en/build-with-claude/batch-processing#extended-output-beta)
- Session 2026-04-19 D-AUDIT-TOTAL-01 : observations thrashing Agent A + pre-compaction snapshot live
- `wiki/meta/session-patterns.md` : Bash 32% / Read 22% / Agent 1% tool distribution
- `docs/core/communication.md` section 6.5 : Layered loading L0-L3
- `scripts/thresholds.json` : seuils tokens codifies
