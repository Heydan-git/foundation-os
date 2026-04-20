---
status: done
started: 2026-04-19
completed: 2026-04-20
phases_total: 14
phases_done: 14
decision: D-AUDIT-TOTAL-01
decision_secondary: D-MODEL-01
worktree: condescending-ardinghelli-4d7d0a
model: claude-opus-4-7-1m
commits: 15
findings_files: 12
---

# 🪐 Audit total Foundation OS + refactor ambitieux (19-04-2026)

> Audit **exhaustif de tout le projet** (main + 5 worktrees + cerveau collaboratif) sur 11 axes, suivi de fixes quick-wins et refactors majeurs. Strategie anti-compactage : checkpoints persistes, commits atomiques par phase, livrables intermediaires sur disque. Session longue Opus 4.7 1M context (~12-16h reels, decoupage interne en 14 phases × 6 elements stricts).

## Context

### Pourquoi cet audit

Kevin demande un audit **FORME + FONCTION + META** de la totalite de Foundation OS apres livraison recente de 3 modules Core OS en 1 journee (D-CONCURRENCY-01 + D-BODY-01 + D-PRODUCT-01). Motivation : s'assurer que le cerveau collaboratif est **coherent, pragmatique, efficace, sans bullshit, conscient des limites** avant d'entamer Phase 5 modules metier (Finance/Sante/Trading).

Kevin a precise en 5 messages successifs :
1. Audit TOTAL (architecture/fonctionnalites/liens/organicite/automaticite/memoire/outils/rangements/coherence/classification/categorisation/mapping/index/noeuds/fonctionnement/capacite/comprehension/historique/fondation/manifeste/indexation/logique)
2. Lire toutes les regles + memoire complete (pas juste survol)
3. Plan le plus ambitieux mais **realiste realisable**
4. Scope = **tout le projet**, pas juste le worktree courant
5. **Mapping routes** (routing Cortex + tools v2) + **economie tokens / automation / optimisation sans degradation qualite**
6. **Conscience modele Opus 4.7 1M** (forces/faiblesses/optimisation) → potentiel 10e module Core OS

### Outcome vise

- Rapport master consolide dans `docs/audits/2026-04-19-audit-total-foundation-os/` (~14 findings-Px-*.md + 1 rapport-master.md)
- Fix quick-wins appliques inline (drifts counts wiki, worktrees legacy cleanup, branches orphelines, etc.)
- Refactor majeurs documentes + executes (compression CLAUDE.md, consolidation memoires, restructure wiki si drift critique)
- **Nouveau module Core OS 10e "Model Awareness"** (`docs/core/model.md`, D-MODEL-01) derive de la doc Anthropic v4.7 officielle
- Updates docs/ coherents (architecture-core 9→10 modules, CONTEXT.md D-AUDIT-TOTAL-01 + D-MODEL-01, wiki hot/sessions/lessons, brief v12 tuile optionnelle)
- Zero regression : health-check SAIN a chaque fin de phase, ref-checker 0 cassee, sync-check PASS
- Kevin peut reprendre l'audit **a toute phase** apres compactage grace au plan + state.json + findings-Px sur disque

## Decisions cadrantes (Kevin 2026-04-19 reponses AskUserQuestion)

| Question | Reponse | Implication |
|----------|---------|-------------|
| Cadence | 1 session longue Opus 4.7 1M **+ perte-de-contexte PROOF** | Strategie anti-compactage critique (voir section dediee) |
| Deliverable | Audit + fix quick-wins + **refactor majeurs** | Ambition max : ~12-16h, scope P11+P12 inclus |
| jovial-jemison-d31676 | **Read-only** | Audit sa divergence (45 commits ahead, trading Phase 5 en cours) sans jamais editer |
| Module model awareness | **Nouveau 10e module Core OS** | D-MODEL-01, `docs/core/model.md`, architecture-core 9→10 modules |

## Findings pre-plan (deja collectes avant PlanMode)

Inventaire factuel execute via Read 41 fichiers + 3 Bash + 1 subagent reussi (commands/agents/hooks).

### FORME — ce qui existe structurellement

| Metrique | Valeur | Source |
|----------|--------|--------|
| Scripts bash | 40 | `find scripts -name "*.sh" \| wc -l` |
| Scripts python | 2 | `find scripts -name "*.py" \| wc -l` |
| Hooks Claude actifs | 8 | `scripts/hooks/` + `.claude/settings.json` |
| Commands (.claude/commands/) | 8 | cockpit, plan-os, session-start, session-end, sync, wt, new-project, po |
| Agents (.claude/agents/) | 6 | os-architect, dev-agent, doc-agent, review-agent, po-agent, alignment-auditor |
| Core OS specs | 14 docs/core/ | 9 modules + architecture-core + constitution + naming-conventions + concurrency + tools/ subdir |
| Wiki pages physiques | **50 reel** | `find wiki -name "*.md"` (drift vs counts.md 47 et hot.md 53) |
| Wiki concepts | 18 | `find wiki/concepts -maxdepth 1` |
| Wiki entities | 5 | idem |
| Wiki sources | 2 | idem |
| Wiki meta | 18 | idem |
| Domaines | 5 | design/dev seed + trading/finance/sante placeholders |
| Auto-memoires actives | 24 | MEMORY.md index |
| Auto-memoires deprecated | 12 (dans `_deprecated/`) | idem |
| .archive/ dossiers | 37 | poubelle structuree |
| .archive/ size | 5.4M | du -sh |
| docs/ total | 54 .md | `find docs -name "*.md"` |
| docs/plans/ | 1 (template seul) | aucun plan actif |
| Modules TSX app | 29 | `find modules/app/src -name "*.tsx"` |
| Modules TSX DS | 100 | idem |
| Tests app | 5 files / 15 tests vitest | |
| Worktrees actifs | 6 (main + 5 claude/*) | `git worktree list` |
| Branches claude/* totales | ~20 | `git branch -a` (12+ sans worktree associe) |
| Plans archives recents | 2 (2026-04-19) | .archive/plans-done-260419/ |

### Drifts structurels detectes (FORME)

1. 🔴 **wiki/meta/counts.md stale** : 47 pages (2026-04-18) vs 50 reel filesystem. Pas regenere apres 2 sessions recentes (+2 concepts Product P5 + 3 concepts Body P5).
2. 🔴 **wiki/meta/graph-report.md stale** : 44 pages scannees (2026-04-18) vs 50 reel. Meme cause.
3. 🔴 **wiki/hot.md incoherent** : annonce 53 pages (`Active Threads` section) vs 50 reel + 47 counts.md. 3 sources divergentes.
4. 🟡 **2 worktrees legacy probables** : `bold-neumann-7e682b` (0 ahead, 1 behind) + `vibrant-poitras-28155e` (0 ahead, 7 behind) = mergees + candidates cleanup.
5. 🟡 **12+ branches claude/* sans worktree** : `claude/adoring-lamarr`, `beautiful-darwin-8782be`, `elated-easley-38523c`, `goofy-ramanujan`, `keen-mahavira-a1664e`, `loving-carson-396727`, `musing-tereshkova-0b515d`, `nice-mayer-0efb94`, `pedantic-mendel-be5d2b`, `practical-bhaskara-651197`, `stoic-mirzakhani-46c809`, `strange-dhawan-e61b96`, `vibrant-tharp-56e4e0`, `vigorous-germain`, `zealous-lewin`, `wt/wiki-adoption-260415` → menage `git branch -D`.
6. 🟡 **1 orphelin wiki** : `session-patterns` (0 wikilink entrant).
7. 🟡 **Agent alignment-auditor jamais teste live** (D-BODY-01 Phase E pending, report CONTEXT.md).

### FONCTION — ce qui marche (ou pas) comme cerveau

8. 🟡 **Neuroplasticite 4 reflexes = discipline manuelle** (audit v2 mega 2026-04-16, lesson ecrite). Aucun hook ne FORCE recall wiki avant reponse technique (API CLAUDE_USER_PROMPT inexistante, lesson 2026-04-17).
9. 🟡 **14 routines Cloud "documentees mais inertes"** : jamais creees UI /schedule Desktop. Wiki Health Monitor quotidien, Wiki Consolidation hebdo, Documentation Drift hebdo → zero execution.
10. 🟡 **Routing Cortex decoratif** : table dans CLAUDE.md + `docs/core/cortex.md` mais **pas enforce runtime**. Je peux ignorer et faire moi-meme (pas de hook pre-action).
11. 🟢 **Commands + agents + hooks coherents** : rapport subagent B = 0 divergence form/function sur 8+6+8. Plomberie solide.
12. 🟡 **Product module opt-in default OFF** (`PRODUCT_MCP_SYNC=1`). Si Kevin ne met pas la variable, le push FOS→Notion a chaque /session-end ne se fait pas. Pratique pour safety mais fonctionne-t-il reellement ? Pas teste live (report CONTEXT.md).
13. 🟢 **Layered loading L0-L3 specifie** (`docs/core/communication.md` section 6.5) mais **pas enforce** : SessionStart lit tout par defaut (moi cette session = 41 fichiers = L0+L1+L2 max +10k tokens estime mais pas measure).
14. 🟡 **Pre-compaction snapshot actif** mais jamais test recovery end-to-end. Fichiers `.omc/snapshots/*.md` existent (20260419-1108-strange-dhawan-e61b96.md, voir docs/core/concurrency.md).

### META — capacite Claude + comprehension TDAH

15. 🟢 **Constitution 41 P-XX seedees** (`docs/core/constitution.md`) mais **violations jamais tracked live** : `.omc/ratings.jsonl` 1 entree (Y=1 N=0). Discipline pre-action check depend de moi.
16. 🟢 **TDAH communication documentee** (memoire `feedback_communication_pedagogique` + section CLAUDE.md "Mode de communication : clarte avant technicite"). Mais brief v12 a 14 sections + 3 optionnelles = risque densite.
17. 🟡 **Mapping routes triple couche** : Cortex (4 agents) + Tools v2 routing.json (35 regles 109 outils) + Skills (plugin triggers). Coherence spec↔impl jamais auditee end-to-end.
18. 🟡 **Subagents fragiles** : cette session = 1 Agent sur 3 a thrashe (Autocompact thrashing, context plein). Strategie "3 paralleles max" incrustee dans CLAUDE.md mais pas de guideline pour **taille prompt** ni **fallback si echec**.
19. 🟡 **Max x20 = "aucune limite tokens"** (feedback_neuroplasticity) mais pas de measurement. Cette session = 41 fichiers + 3 subagents + 3 Bash = budget consomme vite, impossible a chiffrer precisement.

### Cross-worktree (lu avec `git -C` sur chaque path)

| Worktree | Last commit | Ahead main | Behind main | Dirty | Note |
|----------|-------------|------------|-------------|-------|------|
| main (`/Users/kevinnoel/foundation-os`) | 2h · `9b102c4` merge D-PRODUCT-01 | 0 | 0 | 20 files | Dirty probable .omc/ state runtime |
| `bold-neumann-7e682b` | 3h · `2849ea6` P5 wiki concepts D-PRODUCT-01 | 0 | 1 | 0 | Mergee, candidate cleanup |
| `condescending-ardinghelli-4d7d0a` (courant) | 2h · `9b102c4` merge | 0 | 0 | 2 | Sync, on travaille dedans |
| `determined-torvalds-903dc3` | 3h · `c495c18` session-end batch alim 11 refs D-CCCO... | **14** | 15 | 2 | **Divergence serieuse** (D-CCCO = D-CONCURRENCY-01?) |
| `jovial-jemison-d31676` | **15 min** · `02e31ed` extension trading v1.1 | **45** | 19 | 4 | **Trading Phase 5 en cours** (read-only impose) |
| `vibrant-poitras-28155e` | 8h · `0da598c` cleanup D-BODY-01 | 0 | 7 | 4 | Mergee, candidate cleanup |

**Diff main vs current worktree (`condescending-ardinghelli-4d7d0a`)** : CLAUDE.md / CONTEXT.md / wiki/hot.md **identiques** (0 lignes diff). ✓ Sync.

## Strategie anti-compactage (perte-de-contexte PROOF)

Contrainte Kevin : **si compactage arrive, l'audit ne doit pas etre compromis**.

### Principes

1. **Commits atomiques par phase** : P0 → P13 = 14 commits. Si compactage apres Pn, on sait qu'il reste P(n+1)→P13. git log = source de verite progression.
2. **Livrables intermediaires sur disque** : chaque phase ecrit son livrable (`docs/audits/2026-04-19-audit-total-foundation-os/findings-Px-<axe>.md`) **avant** de committer. Meme compactage apres Write = fichier sur disque irreversible.
3. **Checkpoint state.json** : `.omc/audit-total/state.json` mis a jour apres chaque phase completee. Format : `{"phases_done": ["P0","P1",...], "current": "P5", "last_commit": "abc123", "started_at": "2026-04-19T20:00:00Z", "budget_estimated_hours": 14}`.
4. **Plan ultra-detaille 6 elements** : si compactage au milieu d'une phase, relire plan + checkpoint → savoir exactement quoi reprendre (pre-conditions, etat repo attendu, actions numerotees, verification, rollback, commit).
5. **Pre-compaction snapshot actif** (hook `PreCompact` → `scripts/hooks/pre-compaction-snapshot.sh`) : dump wiki/hot.md + CONTEXT Cap + TodoWrite dans `.omc/snapshots/YYYYMMDD-HHMM-<worktree>.md`. Rotation 14 derniers.
6. **Dual-path plan** : `/Users/kevinnoel/.claude/plans/jazzy-splashing-thompson.md` (natif Plan Mode UI) + copie `docs/plans/2026-04-19-audit-total-foundation-os.md` (versionne git). Si compactage + nouvelle session, Kevin ouvre le fichier docs/plans et moi je relis tout.
7. **TodoWrite live** : 1 todo par phase, update `in_progress`/`completed` immediat. Tasks pane Desktop visible en permanence.
8. **Pas de subagent pour phases critiques** : les phases qui modifient l'etat (P11/P12) se font en Read direct / Edit direct. Subagents reserves pour lectures read-only P1-P9 avec **prompt court** (< 500 mots) pour eviter thrashing.

### Recovery procedure (si compactage)

```
1. Kevin ouvre le dossier du worktree + `cat .omc/audit-total/state.json`
2. Moi relis : 
   - /Users/kevinnoel/.claude/plans/jazzy-splashing-thompson.md
   - docs/audits/2026-04-19-audit-total-foundation-os/findings-P*.md (livrables existants)
   - git log --since="2026-04-19T20:00:00Z" --oneline (commits faits)
3. Identifier phase courante = state.json "current" OR premiere phase sans commit
4. Reprendre a la section "Phase N" du plan
```

## Phases (14 × 6 elements stricts)

### Phase P0 — Bootstrap anti-compactage (~30 min)

**Objectif** : creer infra perte-de-contexte proof + TodoWrite + plan versionne + dossier rapport.

**1. Pre-conditions verifiables**
- Worktree courant : `condescending-ardinghelli-4d7d0a` sur `claude/condescending-ardinghelli-4d7d0a`
- `git status --short` : clean ou 1-2 files (.omc/project-memory.json state runtime OK)
- Plan file existe a `/Users/kevinnoel/.claude/plans/jazzy-splashing-thompson.md`
- Pas de compactage en cours (session courte < 1h)

**2. Etat repo attendu post-phase**
- `docs/audits/2026-04-19-audit-total-foundation-os/` cree (dossier)
- `docs/plans/2026-04-19-audit-total-foundation-os.md` cree (copie plan natif)
- `.omc/audit-total/state.json` cree (checkpoint)
- TodoWrite contient 14 todos (P0 completed, P1-P13 pending)

**3. Actions atomiques**

```bash
# 3.1 Creer dossier rapport audit
mkdir -p docs/audits/2026-04-19-audit-total-foundation-os

# 3.2 Copier plan natif vers versionne projet
cp ~/.claude/plans/jazzy-splashing-thompson.md docs/plans/2026-04-19-audit-total-foundation-os.md

# 3.3 Frontmatter plan versionne
# Write : ajouter header :
# ---
# status: in-progress
# started: 2026-04-19
# phases_total: 14
# phases_done: 0
# decision: D-AUDIT-TOTAL-01
# ---

# 3.4 Creer state.json checkpoint
mkdir -p .omc/audit-total
cat > .omc/audit-total/state.json <<EOF
{
  "decision": "D-AUDIT-TOTAL-01",
  "started_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "phases_total": 14,
  "phases_done": ["P0"],
  "current": "P1",
  "last_commit_sha": "$(git rev-parse HEAD)",
  "worktree": "condescending-ardinghelli-4d7d0a",
  "budget_estimated_hours": 14
}
EOF

# 3.5 TodoWrite 14 todos (via tool, pas bash)
# P0 completed, P1-P13 pending, P0 activeForm="Done"
```

**4. Verification post-phase**
- `ls docs/audits/2026-04-19-audit-total-foundation-os/` → dossier present
- `ls docs/plans/2026-04-19-audit-total-foundation-os.md` → fichier present
- `cat .omc/audit-total/state.json | python3 -m json.tool` → JSON valide
- `bash scripts/health-check.sh` → SAIN

**5. Rollback**
- `rm -rf docs/audits/2026-04-19-audit-total-foundation-os .omc/audit-total docs/plans/2026-04-19-audit-total-foundation-os.md` (aucune ref ailleurs encore)

**6. Commit**
```
chore(os): P0/14 bootstrap audit total (anti-compactage proof)

- docs/audits/2026-04-19-audit-total-foundation-os/ (dossier rapport)
- docs/plans/2026-04-19-audit-total-foundation-os.md (copie plan natif)
- .omc/audit-total/state.json (checkpoint progression)

Preparation D-AUDIT-TOTAL-01 sur 14 phases.
```

---

### Phase P1 — Fondation + Core OS 9 modules (~60 min)

**Objectif** : audit CONTENU ligne par ligne CLAUDE.md + CONTEXT.md + Foundation OS.md + architecture-core + 9 specs Core OS + constitution + naming-conventions + concurrency. Comparer spec<->realite.

**1. Pre-conditions** : P0 completed. state.json current=P1.

**2. Etat repo attendu** : `docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md` cree (~300-500L).

**3. Actions atomiques**

Deleguer a 1 sous-agent Explore avec prompt COURT (< 500 mots) :
```
Subagent Explore :
- Read CLAUDE.md + CONTEXT.md + wiki/concepts/Foundation OS.md + architecture-core.md + 9 specs Core OS + constitution.md + naming-conventions.md + concurrency.md integralement
- Pour chaque fichier : extraire (a) objet, (b) coherence avec realite (counts wiki, modules actifs, metriques), (c) incoherences detectees
- Livrable : rapport structure dans docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md 
- Max 500 lignes rapport. Factuel. FORME + FONCTION.
- Pas de subagent recursif.
```

Alternative si subagent echoue (thrashing) : lecture directe Read en batch de 5 fichiers avec Write progressif.

**4. Verification**
- `test -f docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md`
- `wc -l docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md` : 200-500L
- `grep -c "🔴\|🟡\|🟢" docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md` : >= 10 findings

**5. Rollback** : `rm docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md` + reset state.json current=P1.

**6. Commit**
```
audit(os): P1/14 fondation + 9 core os specs

docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-fondation.md
- CLAUDE.md 198L + CONTEXT.md 149L + Foundation OS.md 227L
- 9 Core OS specs (cortex/communication/monitor/tools/planner/worktrees/knowledge/body/product)
- architecture-core + constitution (41 P-XX) + naming-conventions + concurrency
- N findings FORME + M findings FONCTION

D-AUDIT-TOTAL-01 P1/14
```

---

### Phase P2 — Wiki + mapping + index + noeuds + classification (~60 min)

**Objectif** : audit 50 pages wiki physiques + 18 meta + 5 domaines + counts/graph-report/foundation-os-map. Detecter drifts counts (deja pre-identifies : 47/50/53 incoherents). Verifier classification concepts/entities/sources + couverture domaines.

**1. Pre-conditions** : P1 completed. Subagent B OK ou fallback direct. state.json current=P2.

**2. Etat repo attendu** : `docs/audits/2026-04-19-audit-total-foundation-os/findings-P2-wiki-mapping.md` cree. Regen a ne PAS faire ici (P11 refait les fixes).

**3. Actions atomiques**

```bash
# 3.1 Subagent Explore (read-only) pour lecture wiki/meta/ + concepts cles
# Prompt court : lire index-wiki, index-concepts, index-entities, index-sources, index-meta, 
#                foundation-os-map, counts, graph-report, log, overview, hot
#                + 5 concepts canoniques (Foundation OS, Core OS, LLM Wiki Pattern, Neuroplasticite, Brief v12, TDAH workflow, Void Glass)
# Livrable : findings-P2-wiki-mapping.md

# 3.2 En parallele (meme tool call avec plusieurs Bash) :
find wiki -name "*.md" -not -path "*/templates/*" -exec wc -l {} + | sort -n > /tmp/wiki-sizes.txt
grep -rho "\[\[[^]]*\]\]" wiki/ | sort | uniq -c | sort -rn > /tmp/wikilinks-freq.txt
find wiki/domains -type d -maxdepth 2 > /tmp/wiki-domains.txt

# 3.3 Integrer les 3 fichiers tmp dans findings-P2 comme donnees factuelles
```

**4. Verification**
- `wc -l docs/audits/2026-04-19-audit-total-foundation-os/findings-P2-wiki-mapping.md` : 300-600L
- Drift counts mentionne (47/50/53)
- Orphelin session-patterns mentionne
- Pattern etoile vs mesh analyse (foundation-os-map 74L, 27 wikilinks)

**5. Rollback** : `rm docs/audits/2026-04-19-audit-total-foundation-os/findings-P2-wiki-mapping.md`.

**6. Commit**
```
audit(os): P2/14 wiki + mapping + index + noeuds

docs/audits/2026-04-19-audit-total-foundation-os/findings-P2-wiki-mapping.md
- 50 pages physiques (drift detecte vs counts.md 47 et hot.md 53)
- Classification : 18 concepts / 5 entities / 2 sources / 18 meta / 5 domaines
- Mapping mesh niveau 2 (foundation-os-map hub + 7 sous-indexes)
- 1 orphelin (session-patterns) + 11 god-nodes
- N findings

D-AUDIT-TOTAL-01 P2/14
```

---

### Phase P3 — Automaticite + outils (scripts/hooks/commands/agents) (~60 min)

**Objectif** : audit 42 scripts + 8 hooks + 8 commands + 6 agents. Verifier chains health-check. Detecter scripts orphelins (pas reference nulle part). Capitaliser sur rapport subagent B (deja fait, 8+6+8 coherents 0 divergence form/function).

**1. Pre-conditions** : P2 completed. Rapport subagent B disponible en memoire ou a re-generer.

**2. Etat repo attendu** : `findings-P3-automation.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Restituer subagent B report (integrer dans findings-P3)
# Parts deja connues : 8 commands + 6 agents + 8 hooks coherents + 2 warnings (PRODUCT_MCP_SYNC + hook failure visibility)

# 3.2 Audit chains scripts (Read + Grep)
grep -rn "bash scripts/" scripts/health-check.sh scripts/sync-check.sh .claude/commands/*.md .claude/settings.json

# 3.3 Detecter scripts orphelins (pas reference ailleurs)
for f in scripts/*.sh; do
  name=$(basename "$f")
  count=$(grep -rln "$name" --include="*.md" --include="*.sh" --include="*.json" . | grep -v "^./scripts/$name$" | wc -l)
  echo "$count $f"
done | sort -n | head -20

# 3.4 Audit routines Cloud (14 documentees mais inertes)
cat wiki/meta/routines-setup.md
cat wiki/meta/routines-guardrails.md
```

**4. Verification** : `wc -l findings-P3` : 300-500L. Liste scripts orphelins + verdict FONCTION.

**5. Rollback** : `rm findings-P3-automation.md`.

**6. Commit**
```
audit(os): P3/14 automation + outils (42 scripts + 8 hooks + 8 commands + 6 agents)

docs/audits/2026-04-19-audit-total-foundation-os/findings-P3-automation.md
- Plomberie coherente (0 divergence form/function)
- N scripts orphelins detectes
- 14 routines Cloud documentees mais inertes (lesson audit v2)
- 2 warnings : PRODUCT_MCP_SYNC opt-in + hook failures silencieux

D-AUDIT-TOTAL-01 P3/14
```

---

### Phase P4 — Memoire + neuroplasticite (5 tiers + 24 auto-memoires) (~60 min)

**Objectif** : audit CONTENU des 24 auto-memoires actives + 3 pages meta neuroplasticite (thinking/sessions-recent/lessons-learned) + hot.md + constitution.md coherence. Detecter redondances avec CLAUDE.md / docs/core/ (tier-contradictions). Sample uses last_used tracking.

**1. Pre-conditions** : P3 completed.

**2. Etat repo attendu** : `findings-P4-memoire.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Subagent Explore avec prompt court (< 500 mots) :
# "Read les 24 auto-memoires listees dans MEMORY.md + extraire regle + pourquoi + how-to-apply + date + last_used.
#  Livrable : findings-P4-memoire.md avec tables thematiques + incoherences + staleness + redondances 5 tiers."

# 3.2 Scanner tier-contradictions
bash scripts/tier-contradiction-check.sh --quiet

# 3.3 Last_used stats
bash scripts/memory-audit.sh
```

**4. Verification** : `findings-P4-memoire.md` 400-600L. Table thematique des 24 memoires + staleness report.

**5. Rollback** : `rm findings-P4-memoire.md`.

**6. Commit**
```
audit(os): P4/14 memoire + neuroplasticite (5 tiers, 24 auto-memoires)

- 24 auto-memoires actives lues (user/feedback/project/reference/tools)
- 4 reflexes neuroplasticite (discipline manuelle, pas enforced)
- 3 pages meta (thinking/sessions-recent/lessons-learned)
- N redondances detectees entre tiers

D-AUDIT-TOTAL-01 P4/14
```

---

### Phase P5 — Historique + decisions + plans archives (~45 min)

**Objectif** : audit `.archive/` 37 dossiers + `docs/decisions-log.md` + 16 D-XXX-NN CONTEXT.md + 2 plans archives 2026-04-19. Verifier coherence chronologique, absence refs cassees vers .archive/.

**1. Pre-conditions** : P4 completed.

**2. Etat repo attendu** : `findings-P5-historique.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Inventaire .archive
ls -la .archive/ | sort
du -sh .archive/*/ | sort -h

# 3.2 Refs vers .archive (faux positifs ref-checker ?)
grep -r "\.archive/" --include="*.md" -l | head -20

# 3.3 Decisions coherence
grep "^| D-" CONTEXT.md | wc -l
grep "^## D-" docs/decisions-log.md | wc -l
```

**4. Verification** : `findings-P5-historique.md` 200-400L.

**5. Rollback** : `rm findings-P5-historique.md`.

**6. Commit**
```
audit(os): P5/14 historique + decisions + plans archives

- .archive/ 37 dossiers, 5.4M
- 16 decisions actives CONTEXT.md + N archivees decisions-log.md
- 2 plans termines 2026-04-19 (D-BODY-01, D-PRODUCT-01)

D-AUDIT-TOTAL-01 P5/14
```

---

### Phase P6 — Comportement Claude + alignement constitution (~60 min)

**Objectif** : audit 41 P-XX constitution + capacite/comprehension reels vs declares + pieges cadrage (5 pieges mega audit v2) + TDAH communication efficace ? Scanner .omc/ratings.jsonl + .omc/intent/.

**1. Pre-conditions** : P5 completed.

**2. Etat repo attendu** : `findings-P6-comportement.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Constitution coverage analysis
grep "^## P-" docs/core/constitution.md | wc -l  # expect 41
grep -c "^### Source" docs/core/constitution.md

# 3.2 Alignment stats
bash scripts/alignment-analyze.sh --quiet
cat .omc/ratings.jsonl 2>/dev/null | wc -l

# 3.3 Intents history
ls -1 .omc/intent/*.md 2>/dev/null | wc -l

# 3.4 Brief v12 audit (14 sections + 3 optionnelles = 17 max)
grep -c "^####" docs/core/communication.md  # structure
```

**4. Verification** : `findings-P6-comportement.md` 300-500L.

**5. Rollback** : `rm findings-P6-comportement.md`.

**6. Commit**
```
audit(os): P6/14 comportement Claude + alignement constitution

- 41 P-XX seedees (sources tracees)
- 1 rating historique Y=1/N=0 (alignment-auditor jamais teste live)
- 5 pieges cadrage Foundation OS.md audites
- TDAH communication verdict

D-AUDIT-TOTAL-01 P6/14
```

---

### Phase P7 — Mapping routes + Tools v2 (Cortex / 109 outils / Skills) (~60 min)

**Objectif** : audit coherence 3 couches routing.
- Cortex table agents (4 agents, signaux → agent)
- Tools v2 routing.json (35 regles, 109 outils, 14 domaines)
- Skills triggers (plugin claude-obsidian 10 skills + OMC + Superpowers)

Verifier que chaque outil mentionne dans routing.json existe (via tool-register.sh ou ls). Detecter regles mortes (pointent outil disparu) ou outils orphelins (pas dans routing).

**1. Pre-conditions** : P6 completed.

**2. Etat repo attendu** : `findings-P7-mapping-routes.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Lire les 3 sources routing
cat docs/core/tools/routing.json
cat docs/core/tools/index.json
grep -A 5 "^## 1. Routing" docs/core/cortex.md

# 3.2 tool-register.sh stats
bash scripts/tool-register.sh --help  # verifier existence
bash scripts/tool-register.sh list | head -30 2>/dev/null || echo "no list command"

# 3.3 Compare : agents cites dans CLAUDE.md vs .claude/agents/ existants
grep -oP "(?<=^\| )[a-z-]+(?= \|)" docs/core/cortex.md  # extract agent names from table
ls -1 .claude/agents/ | sed 's|.md$||'

# 3.4 Skills : OMC + claude-obsidian + superpowers scan
find ~/.claude/plugins -name "*.md" -path "*skills*" 2>/dev/null | wc -l
```

**4. Verification** : `findings-P7-mapping-routes.md` 300-500L. Findings sur coherence 3 couches.

**5. Rollback** : `rm findings-P7-mapping-routes.md`.

**6. Commit**
```
audit(os): P7/14 mapping routes Cortex + Tools v2 + Skills

- Cortex table : 4 agents
- Tools v2 : 35 regles / 109 outils / 14 domaines
- Skills : plugin claude-obsidian + OMC + superpowers
- Coherence 3 couches analysee

D-AUDIT-TOTAL-01 P7/14
```

---

### Phase P8 — Economie tokens + optimisation automation (~60 min)

**Objectif** : audit layered loading L0-L3 enforcement + subagents strategy + compactage handling + Max x20 discipline. Mesurer ce qui peut l'etre. Proposer recommandations.

**1. Pre-conditions** : P7 completed.

**2. Etat repo attendu** : `findings-P8-tokens.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Layered loading : verifier thresholds.json + usage reel
cat scripts/thresholds.json | python3 -m json.tool | grep -A 5 layered_loading

# 3.2 Pre-compaction snapshots existants
ls -la .omc/snapshots/ | wc -l

# 3.3 Subagent strategy : lister les plantages recents
grep -i "thrashing\|context refilled\|autocompact" .omc/sessions/*.json 2>/dev/null | head -5

# 3.4 Session sizes (.omc/sessions/*.json)
for f in .omc/sessions/*.json; do
  wc -l "$f"
done | sort -n | tail -5
```

**4. Verification** : `findings-P8-tokens.md` 300-500L. Recommandations actionnables.

**5. Rollback** : `rm findings-P8-tokens.md`.

**6. Commit**
```
audit(os): P8/14 economie tokens + optimisation automation

- Layered loading L0-L3 spec vs enforcement
- Subagents strategy : limites (thrashing 2026-04-19)
- Pre-compaction snapshot rotation 14
- Max x20 discipline vs mesure reelle

D-AUDIT-TOTAL-01 P8/14
```

---

### Phase P9 — Nouveau module Core OS 10e : Model Awareness (~90 min)

**Objectif** : CREER `docs/core/model.md` (spec 10e module Core OS). Recherche externe doc Anthropic v4.7 officielle. Synthetiser forces/faiblesses Opus 4.7 1M + optimisations specifiques FOS. Update architecture-core 9→10.

**1. Pre-conditions** : P8 completed.

**2. Etat repo attendu** :
- `docs/core/model.md` cree (11 sections)
- `docs/core/architecture-core.md` update 9→10 modules + ligne table
- `docs/audits/2026-04-19-audit-total-foundation-os/findings-P9-model-awareness.md` cree (synthese doc Anthropic)

**3. Actions atomiques**

```bash
# 3.1 Recherche doc Anthropic v4.7 (WebFetch ou WebSearch)
# URLs cibles : 
# - docs.anthropic.com/en/docs/claude/model-cards (Opus 4.7)
# - anthropic.com/news/claude-4-7 (release notes)
# - docs.anthropic.com/en/docs/about-claude/models

# 3.2 Write docs/core/model.md avec 11 sections :
# 1. Architecture (role 10e Core OS, transverse)
# 2. Version active (Opus 4.7, 1M context, knowledge cutoff jan 2026)
# 3. Forces mesurees (1M context, extended thinking, subagents, tool use)
# 4. Faiblesses connues (compactage thrashing, hallucination sous pression, agent brief long)
# 5. Optimisations FOS (layered loading L0-L3 enforced, subagent prompt < 500 mots, pre-compaction snapshot, Max x20 discipline)
# 6. Files : docs/core/model.md + architecture-core update + wiki concept
# 7. Integration 9 autres modules (Cortex routing, Communication briefing, Body pre-action, etc.)
# 8. Workflow : au SessionStart, lire model.md top section ; au model upgrade, update section Version
# 9. Regle d'or : chaque upgrade modele = nouvelle Decision D-MODEL-XX + update spec
# 10. Limites explicites
# 11. Maintenance + backlog (hook auto-update ?)

# 3.3 Update docs/core/architecture-core.md
# - Couche MODULES : ajouter "model" dans liste
# - Table Modules : ajouter ligne "| Model | Conscience version modele + optim tokens | 10 | actif (P1) | docs/core/model.md |"
# - Phrase "8 modules Core OS" → "10 modules Core OS"

# 3.4 Write findings-P9 (rapport synthese recherche + justification spec)
```

**4. Verification**
- `test -f docs/core/model.md && wc -l docs/core/model.md`  → 200-400L
- `grep -c "^## P-\|^### " docs/core/model.md`  → structure OK
- `grep "10 modules" docs/core/architecture-core.md`  → 1+ match
- `bash scripts/ref-checker.sh`  → 0 ref cassee

**5. Rollback**
- `git checkout docs/core/architecture-core.md`
- `rm docs/core/model.md docs/audits/2026-04-19-audit-total-foundation-os/findings-P9-model-awareness.md`

**6. Commit**
```
feat(os): P9/14 module Model Awareness 10e Core OS (D-MODEL-01)

- docs/core/model.md (spec 11 sections, Opus 4.7 1M derive doc Anthropic)
- docs/core/architecture-core.md : 9 → 10 modules
- docs/audits/2026-04-19-audit-total-foundation-os/findings-P9-model-awareness.md (synthese recherche)

Conscience version modele + optimisation tokens.
D-MODEL-01 adopte. D-AUDIT-TOTAL-01 P9/14
```

---

### Phase P10 — Cross-worktree read-only audit (~30 min)

**Objectif** : audit 6 worktrees (main + 5 claude/*) + 17 branches orphelines. Inclut `jovial-jemison-d31676` READ-ONLY (respect trading Phase 5 en cours). Detecter conflits potentiels.

**1. Pre-conditions** : P9 completed.

**2. Etat repo attendu** : `findings-P10-cross-worktree.md` cree.

**3. Actions atomiques**

```bash
# 3.1 Tableau cross-worktree
git worktree list

# 3.2 Pour chaque worktree (y compris jovial-jemison READ-ONLY)
for wt in /Users/kevinnoel/foundation-os /Users/kevinnoel/foundation-os/.claude/worktrees/*; do
  branch=$(git -C "$wt" branch --show-current 2>/dev/null)
  echo "=== $branch ==="
  git -C "$wt" log --oneline main..HEAD | head -5  # commits uniques
  git -C "$wt" diff --name-only main..HEAD | head -10  # fichiers modifies
done

# 3.3 Branches orphelines (sans worktree)
git branch -a | grep "claude/" | while read b; do
  b_clean=$(echo "$b" | sed 's|^[* ]*||' | sed 's|remotes/origin/||')
  path=$(git worktree list | grep "$b_clean" | awk '{print $1}')
  if [ -z "$path" ]; then
    echo "ORPHELINE: $b_clean"
  fi
done

# 3.4 Diff main vs jovial-jemison (READ-ONLY, NE PAS MERGER)
git -C /Users/kevinnoel/foundation-os/.claude/worktrees/jovial-jemison-d31676 log --oneline main..HEAD | head -20
```

**4. Verification** : `findings-P10-cross-worktree.md` 200-400L. Liste branches orphelines + recommandations cleanup (P11).

**5. Rollback** : `rm findings-P10-cross-worktree.md`.

**6. Commit**
```
audit(os): P10/14 cross-worktree read-only (6 worktrees + 17 branches)

- main + 5 worktrees actifs analyses
- jovial-jemison-d31676 (trading Phase 5) READ-ONLY respecte
- 17 branches claude/* orphelines detectees (cleanup P11)
- Divergences determined-torvalds (14/15) + jovial-jemison (45/19)

D-AUDIT-TOTAL-01 P10/14
```

---

### Phase P11 — FIX quick-wins (~90 min)

**Objectif** : appliquer les fixes low-risk detectes P1-P10.

Scope :
1. Regen `wiki/meta/counts.md` + `wiki/meta/graph-report.md` (drift 47/44 → 50)
2. Cleanup 2 worktrees legacy (`bold-neumann-7e682b` + `vibrant-poitras-28155e`, 0 ahead)
3. Cleanup 15+ branches `claude/*` orphelines (sans worktree, ancestor de main)
4. Fix 1 orphelin wiki `session-patterns` (ajouter wikilink ou archiver)
5. Sync hot.md counts (53 → 50, aligner counts.md)
6. Fix autres drifts cosmetiques detectes P2

Hors scope P11 (reporte P12) : compression CLAUDE.md vers constitution, consolidation auto-memoires deprecated.

**1. Pre-conditions** : P10 completed. Health-check SAIN.

**2. Etat repo attendu** : chaque fix est un commit atomique. 6 sous-commits P11a-P11f.

**3. Actions atomiques**

```bash
# 3.1 P11a : Regen counts
bash scripts/wiki-counts-sync.sh
# git add wiki/meta/counts.md && git commit -m "fix(os): P11a regen counts.md (47→50 pages)"

# 3.2 P11b : Regen graph-report
bash scripts/wiki-graph-report.sh
# git add wiki/meta/graph-report.md && git commit

# 3.3 P11c : Fix hot.md counts (via Edit)
# 53 → 50 dans section Active Threads

# 3.4 P11d : Fix session-patterns orphelin
# Option A : ajouter wikilink depuis lessons-learned ou thinking
# Option B : archiver .archive/wiki-orphans-260419/

# 3.5 P11e : Cleanup worktrees legacy (depuis main cd)
cd /Users/kevinnoel/foundation-os
bash scripts/worktree-clean.sh bold-neumann-7e682b
bash scripts/worktree-clean.sh vibrant-poitras-28155e

# 3.6 P11f : Cleanup branches orphelines (SEULEMENT si merge dans main)
# Pour chaque claude/X sans worktree :
#   git merge-base --is-ancestor claude/X main && git branch -D claude/X
```

**4. Verification apres CHAQUE fix**
- `bash scripts/health-check.sh` : SAIN
- `bash scripts/ref-checker.sh` : 0 cassee
- `bash scripts/wiki-health.sh` : SAIN
- `git log -1` : commit clean

**5. Rollback par fix**
- `git reset --soft HEAD~1` si commit fait mais fix incomplet
- Ou `git revert <sha>` si commit pushe

**6. Commits (6 atomiques)**
- `fix(os): P11a/14 regen wiki/meta/counts.md (47→50)`
- `fix(os): P11b/14 regen wiki/meta/graph-report.md (44→50)`
- `fix(os): P11c/14 hot.md counts sync (53→50)`
- `chore(os): P11d/14 fix session-patterns orphelin`
- `chore(os): P11e/14 cleanup 2 worktrees legacy`
- `chore(os): P11f/14 cleanup N branches claude/* orphelines`

---

### Phase P12 — REFACTOR majeurs (~90-120 min)

**Objectif** : refactors ambitieux **reversibles** sur fondation.

Scope (valider chacun avec AskUserQuestion AVANT execution) :
1. Compression **CLAUDE.md imperatifs L9-24 vers `docs/core/constitution.md`** : CLAUDE.md pointe vers constitution.md (P-01 a P-14). Gain : CLAUDE.md passe de 199L → ~160L. Risk : migration sensible, peut casser auto-memoires qui referent `CLAUDE.md ligne XX`.
2. **Consolidation auto-memoires deprecated** : 12 memoires dans `_deprecated/` (`project_audit_v2_s3_handoff.md`, `feedback_imperatifs_qualite.md`, etc.) → confirmer cohabitation avec actives OK ou deplacer vers archive globale.
3. **Restructure wiki si drift critique** : si P2 trouve que mapping foundation-os-map necessite un refactor (ex : hub depasse 40 wikilinks Phase 5 imminent) → proposer decoupage sous-indexes.

**1. Pre-conditions** : P11 completed. Health SAIN. AskUserQuestion pour chaque refactor (go/no-go).

**2. Etat repo attendu** : 0 a 3 refactors appliques (selon AskUserQuestion).

**3. Actions atomiques** (pour chaque refactor accepte)
- Snapshot pre-refactor via `scripts/hooks/pre-compaction-snapshot.sh` manuel
- Edit / Write
- Verif : `bash scripts/health-check.sh` + `bash scripts/ref-checker.sh`
- Commit atomique

**4. Verification end-to-end**
- Tous les checks passent apres chaque refactor
- CLAUDE.md size coherent (si compression appliquee)

**5. Rollback**
- `git revert <sha>` si regression post-commit
- Snapshot pre-refactor disponible pour recovery

**6. Commits (0 a 3 atomiques)**
- Si compression : `refactor(os): P12a/14 CLAUDE.md → constitution.md pointer (imperatifs L9-24)`
- Si consolidation : `chore(os): P12b/14 auto-memoires deprecated archive global`
- Si restructure wiki : `refactor(os): P12c/14 wiki mapping niveau 3 (decoupage sous-indexes)`

---

### Phase P13 — Rapport final + updates docs + cloture (~60 min)

**Objectif** : assembler rapport master consolide + updates CONTEXT.md + wiki meta + brief v12 eventuellement.

**1. Pre-conditions** : P12 completed.

**2. Etat repo attendu** :
- `docs/audits/2026-04-19-audit-total-foundation-os/rapport-master.md` cree (synthese 500-1000L)
- `CONTEXT.md` updated : D-AUDIT-TOTAL-01 + D-MODEL-01 decisions + session recente + Cap next actions
- `wiki/hot.md` overwrite avec cloture session
- `wiki/meta/sessions-recent.md` append session audit
- `wiki/meta/lessons-learned.md` append lessons de l'audit
- `wiki/meta/thinking.md` append insights
- Frontmatter plan `status: done, phases_done: 14` (auto-archive hook au /session-end)
- TodoWrite P0-P13 tous completed

**3. Actions atomiques**

```bash
# 3.1 Write rapport-master (agreger findings-P1 a findings-P12 en executive summary)

# 3.2 Update CONTEXT.md (via Edit)
# - Modules : ajouter ligne Model (10e)
# - Sessions recentes : append
# - Decisions : ajouter D-AUDIT-TOTAL-01 + D-MODEL-01
# - Cap : update prochaine action

# 3.3 Update wiki meta (Write)
# - hot.md : cloture
# - sessions-recent.md : append
# - lessons-learned.md : append patterns audit
# - thinking.md : append insights

# 3.4 Health-check final
bash scripts/health-check.sh
bash scripts/ref-checker.sh
bash scripts/wiki-health.sh
bash scripts/sync-check.sh
```

**4. Verification end-to-end**
- `ls docs/audits/2026-04-19-audit-total-foundation-os/` : 14 findings-Px-*.md + 1 rapport-master.md
- `cat CONTEXT.md | grep "D-AUDIT-TOTAL-01\|D-MODEL-01"` : 2 matches
- Tous les checks SAIN
- `cat .omc/audit-total/state.json` : phases_done = [P0..P13], current = "DONE"

**5. Rollback**
- Global rollback : `git reset --hard <sha-avant-P13>` + re-execute P13 si regression

**6. Commit**
```
docs(os): P13/14 rapport final audit total + cloture

docs/audits/2026-04-19-audit-total-foundation-os/rapport-master.md
- 14 findings-Px-*.md agreges
- N findings total (R critical + Y warning + G ok)
- M fixes appliques P11 + K refactors P12

CONTEXT.md :
- D-AUDIT-TOTAL-01 adopte
- D-MODEL-01 Module 10e Core OS adopte
- Session recente append

wiki meta : hot.md + sessions-recent.md + lessons-learned.md + thinking.md

D-AUDIT-TOTAL-01 COMPLET 14/14
```

---

## Fichiers critiques (recap)

### Lecture seule (audit) — 80+ fichiers

| Categorie | Fichiers | Phase |
|-----------|----------|-------|
| Fondation | CLAUDE.md, CONTEXT.md, wiki/concepts/Foundation OS.md | P1 |
| Core OS specs | docs/core/*.md (14 fichiers) | P1 |
| Wiki | wiki/**/*.md (50 pages) | P2 |
| Scripts | scripts/**/*.sh (42 scripts) | P3 |
| Hooks | .claude/settings.json + scripts/hooks/ | P3 |
| Commands | .claude/commands/*.md (8) | P3 |
| Agents | .claude/agents/*.md (6) | P3 |
| Memoires | ~/.claude/projects/.../memory/*.md (24 actives + 12 deprecated) | P4 |
| Archive | .archive/ (37 dossiers, lecture META seule) | P5 |
| Decisions | docs/decisions-log.md | P5 |
| Routing | docs/core/tools/routing.json + index.json | P7 |
| State runtime | .omc/ratings.jsonl + intent/*.md + snapshots/*.md | P6, P8 |

### Ecriture (fix + refactor + rapport) — 20-25 fichiers

| Fichier | Phase | Action |
|---------|-------|--------|
| `docs/audits/2026-04-19-audit-total-foundation-os/findings-P1-*.md` a `findings-P12-*.md` | P1-P12 | Create |
| `docs/audits/2026-04-19-audit-total-foundation-os/rapport-master.md` | P13 | Create |
| `docs/plans/2026-04-19-audit-total-foundation-os.md` | P0 | Create (copie natif) |
| `.omc/audit-total/state.json` | P0, maj chaque phase | Create + Edit |
| `docs/core/model.md` | P9 | Create (NEW module) |
| `docs/core/architecture-core.md` | P9 | Edit (9→10 modules) |
| `wiki/meta/counts.md` | P11 | Regen via script |
| `wiki/meta/graph-report.md` | P11 | Regen via script |
| `wiki/hot.md` | P11 + P13 | Edit counts + append cloture |
| `wiki/meta/sessions-recent.md` | P13 | Append |
| `wiki/meta/lessons-learned.md` | P13 | Append |
| `wiki/meta/thinking.md` | P13 | Append |
| `CONTEXT.md` | P13 | Edit (decisions + session + cap + modules) |
| `CLAUDE.md` | P12 optionnel | Edit (compression imperatifs si accepte) |

## Scripts reutilises (zero reinvention)

| Script | Usage | Phase |
|--------|-------|-------|
| `scripts/health-check.sh` | Verif chaque fin de phase | Toutes |
| `scripts/ref-checker.sh` | Verif refs | Toutes apres edit |
| `scripts/wiki-health.sh` | Verif wiki | P2, P11, P13 |
| `scripts/wiki-counts-sync.sh` | Regen counts.md | P11 |
| `scripts/wiki-graph-report.sh` | Regen graph-report.md | P11 |
| `scripts/drift-detector.sh` | Verif drifts | P11, P13 |
| `scripts/sync-check.sh` | Audit coherence globale | P13 |
| `scripts/worktree-clean.sh` | Cleanup worktrees legacy | P11 |
| `scripts/memory-audit.sh` | Staleness auto-memoires | P4 |
| `scripts/tier-contradiction-check.sh` | Redondances 5 tiers | P4 |
| `scripts/alignment-analyze.sh` | Stats ratings | P6 |
| `scripts/constitution-suggest.sh` | Propose nouveaux P-XX | P6 (report only) |
| `scripts/tool-register.sh` | Catalogue 109 outils Tools v2 | P7 |
| `scripts/hooks/pre-compaction-snapshot.sh` | Snapshot manuel pre-refactor | P12 |

## Strategie subagents (leçon session courante)

Apres thrashing Agent A (24 auto-memoires lecture) :

- **Max 3 subagents paralleles** (regle CLAUDE.md)
- **Prompt COURT** : < 500 mots par subagent (vs ~2000 mots pour Agent A + C qui ont partiellement echoue)
- **Pas de subagent recursif** : subagent ne doit pas lui-meme dispatcher d'autres agents
- **Fallback Read direct** : si subagent echoue → Read sequentiel immediat (meme si + long)
- **Pas de subagent pour phases avec write** : P11/P12/P13 = Read + Edit direct moi-meme
- **Subagents pour P1/P2/P3/P4/P7** : lectures massives read-only, scope precis

## Hors scope explicite

| Hors scope | Raison |
|------------|--------|
| Modifier `jovial-jemison-d31676` | Trading Phase 5 en cours (45 commits), Kevin me l'a dit read-only |
| Deploiement Vercel / Supabase | Audit pas deploy |
| Tests UI live (screenshot chrome-devtools) | Kevin a dit "audit pas test, sauf quick wins testables" |
| `rm -rf` hors `.archive/` et `node_modules/` | P-34 constitution |
| `git push --force` | P-33 constitution |
| Auto-merge vers main sans validation Kevin | P-35 + regle push main apres merge valide |
| Creation autres modules Core OS (Phase 5 Finance/Sante/Trading) | Scope Phase 5 ≠ scope audit |
| Modification comportement tiers OMC/Superpowers plugins | Out of FOS control |

## Verification end-to-end

### Apres P13 complet

```bash
# 1. Health global
bash scripts/health-check.sh   # SAIN obligatoire
bash scripts/ref-checker.sh    # 0 cassee
bash scripts/wiki-health.sh    # SAIN
bash scripts/sync-check.sh     # PASS
bash scripts/drift-detector.sh # SYNC

# 2. Livrables rapport
test -d docs/audits/2026-04-19-audit-total-foundation-os
test -f docs/audits/2026-04-19-audit-total-foundation-os/rapport-master.md
ls docs/audits/2026-04-19-audit-total-foundation-os/findings-P*.md | wc -l  # = 12 (P1 a P12)

# 3. Nouveau module Core OS 10e
test -f docs/core/model.md
grep "10 modules" docs/core/architecture-core.md

# 4. Decisions adoptees
grep "D-AUDIT-TOTAL-01\|D-MODEL-01" CONTEXT.md | wc -l  # >= 2

# 5. Plan termine
grep "status: done" docs/plans/2026-04-19-audit-total-foundation-os.md  # 1 match
cat .omc/audit-total/state.json | python3 -c "import json,sys; d=json.load(sys.stdin); assert d['current']=='DONE'"

# 6. Git history propre
git log --oneline | head -20  # 14+ commits P0-P13 avec prefixes coherents
git status --short  # clean (sauf .omc/ state runtime)
```

## Risques

| Risque | Prob | Impact | Mitigation |
|--------|------|--------|------------|
| Compactage contexte mid-session | 🟡 Haute | 🔴 Haut | Pre-compaction-snapshot actif + state.json + livrables intermediaires + commits atomiques + plan dual-path |
| Subagent thrashing (comme Agent A) | 🟡 Moyenne | 🟡 Moyen | Prompt < 500 mots + max 3 par | + fallback Read direct |
| Conflit merge cross-session (jovial-jemison actif) | 🟡 Moyenne | 🟡 Moyen | jovial-jemison read-only strict + cloture en serie (concurrency.md) |
| Regression apres refactor P12 | 🟡 Moyenne | 🔴 Haut | AskUserQuestion go/no-go par refactor + snapshot pre-refactor + health-check post |
| Audit over-scope (14 phases trop) | 🟡 Moyenne | 🟡 Moyen | Kevin peut stopper a toute phase (chaque findings-Px commit = livrable autonome) |
| Doc Anthropic v4.7 inaccessible (P9) | 🟢 Faible | 🟡 Moyen | Fallback : auto-description (je sais que je suis Opus 4.7 1M), doc web par WebFetch |
| Wiki regen casse refs (P11) | 🟢 Faible | 🟡 Moyen | ref-checker post-chaque-regen + rollback git |
| Ambiguite mise a jour CLAUDE.md P12 | 🟡 Moyenne | 🟡 Moyen | AskUserQuestion explicite go/no-go P12a (CLAUDE→constitution migration) |

## Decision associee

**D-AUDIT-TOTAL-01** (2026-04-19) — Audit total Foundation OS + fix + refactor + nouveau module Model Awareness.

- Plan : `/Users/kevinnoel/.claude/plans/jazzy-splashing-thompson.md` (natif) + `docs/plans/2026-04-19-audit-total-foundation-os.md` (versionne)
- Decision declenchee par : 5 messages Kevin 2026-04-19 post D-PRODUCT-01
- Coherence : capitalise sur pattern Option C ambitieuse validee 3 fois cette journee (D-CONCURRENCY-01 / D-BODY-01 / D-PRODUCT-01)
- Impact : 14 commits atomiques, rapport exhaustif, 10e Core OS, fixes wiki, CLAUDE.md eventuellement compresse
- Archivage : plan auto-archive `.archive/plans-done-260419/` via hook `scripts/auto-archive-plans.sh` apres P13

**D-MODEL-01** (2026-04-19, sera pris en P9) — Module Model Awareness 10e Core OS.

- Plan : integration dans D-AUDIT-TOTAL-01 Phase P9
- Decision declenchee par : feedback Kevin axe 11 (doc Anthropic v4.7, conscience version modele)
- Livrables : `docs/core/model.md` + architecture-core 9→10 + findings-P9 synthese recherche

## Sources

- CLAUDE.md (imperatifs + impact autonomes + spec session)
- `wiki/concepts/Foundation OS.md` (canonique, 5 pieges cadrage)
- `docs/core/communication.md` section 6.5 (Layered Loading L0-L3)
- `docs/core/concurrency.md` (cloture serie multi-session)
- `docs/core/body.md` (pattern 4 couches + stubs forward refs pour zero regression)
- `docs/core/product.md` (pattern manifest-driven + pivot en cours de session P1.5)
- Memoires `feedback_plans_ultra_detailles.md` (6 elements stricts) + `feedback_subagents_context.md` (prompt inject complet) + `feedback_audit_exhaustif.md` (contenu ligne par ligne) + `feedback_communication_pedagogique.md` (TDAH hierarchise)
- Lesson 2026-04-19 : pivot en cours de session Asana→Notion, stubs forward refs zero regression
- Lesson 2026-04-16 : 5 pieges mega audit v2 (FORME vs FONCTION, surgonflage, cloner mauvais cadrage, mots exacts Kevin, admettre erreur)
