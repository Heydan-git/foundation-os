# Body — Spec Module Core OS (Phase 8)

Module Core OS responsable de la **proprioception Kevin-Claude** : ancrage entre *ce que Kevin demande* et *ce que je fais*. Adoption D-BODY-01 (2026-04-19).

> Metaphore : le cerveau pense (Cortex/Knowledge), le corps **sent** les desalignements. Quand Kevin dit "X" et que je fais "X-simplifie", le Body detecte et ramene au scope.

## 1. Architecture

### Role dans Core OS

8e module Core OS, au meme niveau que Cortex (routing), Communication (persistance), Monitor (health), Tools (scripts), Planner (plans), Worktrees (isolation), Knowledge (wiki). Position : **transverse** — il ne remplace pas les autres, il surveille leur utilisation par rapport a l'intention Kevin.

### 4 couches

```
┌─────────────────────────────────────────────────────────────────┐
│  C1 CONSTITUTION         docs/core/constitution.md              │
│     30-50 principes P-XX (regle + done + not-done + source)    │
├─────────────────────────────────────────────────────────────────┤
│  C2 INTENT CAPTURE       .omc/intent/YYYY-MM-DD-<slug>.md      │
│     5 champs : verbatim / comprends / scope / anti-scope /     │
│     signaux drift anticipes                                     │
├─────────────────────────────────────────────────────────────────┤
│  C3 FEEDBACK STRUCTURE   .omc/alignment/YYYY-MM-DD-<sess>.jsonl│
│     rating Y/N/partial + drift categories + P-XX violated +    │
│     notes + intent_file ref + auditor_report ref               │
├─────────────────────────────────────────────────────────────────┤
│  C4 LEARNING LOOP        alignment-auditor (subagent) +        │
│                          scripts/alignment-analyze.sh +         │
│                          scripts/constitution-suggest.sh        │
│     Auto-append lessons-learned + proposition nouveaux P-XX    │
└─────────────────────────────────────────────────────────────────┘
```

### Timeline d'une session type (end-to-end)

```
1. /session-start
   └─ Layered Loading L2 : lit constitution.md top 10 P-XX (ancrage)
   └─ Brief v12 tuile #15 ALIGNMENT : dernier rating + streak

2. Kevin donne une tache → /plan-os "X"
   └─ Tour 1 bis : scripts/intent-capture.sh <slug>
   └─ Cree .omc/intent/<slug>.md avec 5 champs
   └─ Je remplis : verbatim Kevin, scope, anti-scope, signaux drift

3. Execution phases
   └─ Avant action risquee (rm, mv, git push, commit > 3 files) :
      relire intent + top 10 P-XX → detecter desalignement → stop si oui
   └─ Si Kevin dit "non, tu as derive" → append lessons-learned +
      flag 🎯 to-constitute

4. /session-end
   └─ Phase 7bis : rating enrichi (Y/N/partial + drift categories +
      P-XX violated + notes) → append .omc/alignment/<session>.jsonl
   └─ Phase 7ter : subagent alignment-auditor clean-slate lit intent
      + git diff + brief → produit rapport JSON → append auditor-*.json
   └─ Brief cloture : summary alignment 2-3 lignes

5. Health-check (quotidien)
   └─ Chain INFO : scripts/alignment-analyze.sh --quiet
      → distribution rating + streaks + top P-XX violated 7j
```

## 2. Couche C1 — Constitution

### Fichier principal

`docs/core/constitution.md` — 30-50 principes numerotes P-XX, format standard :

```markdown
## P-XX Titre court

**Regle** : <1 ligne imperative>
**Pourquoi** : <raison racine, 1-2 lignes>
**Done** : <exemple concret comportement aligne>
**Not-done** : <exemple concret anti-pattern>
**Source** : <CLAUDE.md LXX | lessons-learned.md section | memoire feedback_*.md>
```

### Seed manuel (P1)

Principes derives de sources existantes (pas d'invention arbitraire) :

| Plage P-XX | Source | Nombre |
|---|---|---|
| P-01 a P-14 | CLAUDE.md L9-24 imperatifs qualite | 14 |
| P-15 a P-19 | CLAUDE.md L148-153 anti-bullshit gates | 5 |
| P-20 a P-27 | wiki/meta/lessons-learned.md (YAGNI, push main, API, Obsidian, refs, split TSX, mesh, etc.) | 8 |
| P-28 a P-32 | wiki/concepts/Foundation OS.md 5 pieges cadrage | 5 |
| P-33 a P-36 | CLAUDE.md L119-128 interdit sans Kevin | 4 |
| P-37 a P-41 | auto-memory feedback_*.md conventions | 5 |
| **Total seed** | — | **~41** |

### Lecture (Layered Loading L2)

Constitution est ajoutee dans la table `docs/core/communication.md` section 6.5 L2 :
- L0 : `wiki/hot.md` (< 200 tokens)
- L1 : `CONTEXT.md` + `wiki/meta/sessions-recent.md` (< 2k tokens)
- **L2** : `wiki/meta/lessons-learned.md` + `wiki/meta/thinking.md` + plans actifs + **`docs/core/constitution.md`** (< 10k tokens)
- L3 : pages wiki on-demand

Cat des top 10 P-XX via hook `session-start-wiki.sh` etendu (Phase P1 action 7, optionnel).

### Extensibilite

- Manuel : Kevin ou moi ajoute P-XX directement dans constitution.md (append, jamais renumerotation)
- Assiste : `scripts/constitution-suggest.sh` scanne `🎯 to-constitute` dans lessons-learned → propose draft P-XX → Kevin valide → append
- Max target : 50 P-XX. Au-dela, regrouper en meta-principes ou archiver vers `docs/constitution-archive.md`

## 3. Couche C2 — Intent capture

### Quand

| Command | Intent capture ? | Raison |
|---|---|---|
| `/plan-os "<demande>"` | **OBLIGATOIRE** (Tour 1 bis) | Deja en PlanMode, ancrage coute 30s, decisions structurantes |
| `/cockpit` | Skip (opt-in) | Trop frequent, polluer flow court |
| `/session-start` | Skip | Brief info, pas execution |
| `/session-end` | Skip | Cloture, pas execution |
| Petite tache (< 3 etapes) | Skip | Overkill |
| Tache atypique sans /plan-os | Opt-in manuel via `bash scripts/intent-capture.sh <slug>` | Discretion |

### Template 5 champs

```markdown
# Intent — <slug>
**Date** : YYYY-MM-DD
**Session** : <branch-name>

## 1. Verbatim Kevin
> <copier-coller exact de la demande, preserver typos et style>

## 2. Ce que je comprends
<reformulation 2-3 lignes claire>

## 3. Scope (ce que je VAIS faire)
- <action 1>
- <action 2>
- ...

## 4. Anti-scope (ce que je ne VAIS PAS faire)
- <exclusion 1>
- <exclusion 2>
- ...

## 5. Signaux de drift anticipes
- Si je modifie plus de N fichiers → alerte
- Si je passe plus de X heures → alerte
- Si je me retrouve a faire Y au lieu de Z → stop
```

### Script generation

`scripts/intent-capture.sh <slug> [--demand "texte"]`

- `set -uo pipefail`
- Validate slug (lowercase, max 40 chars, `[a-z0-9-]` pattern)
- Cree `.omc/intent/$(date +%Y-%m-%d)-<slug>.md` avec template
- Si `--demand` fourni : pre-fill champ 1 avec texte
- Exit 0 ok, 1 slug invalide, 2 fichier existe deja

### Versioning

**Decision P1** : `.omc/intent/` est **tracke git** (versionnable, audit trail, collaboration future Kevin-equipe). Si besoin privacy → basculer sur gitignore dans `.gitignore` + documenter dans body.md.

## 4. Couche C3 — Feedback structure

### Fichier JSONL

`.omc/alignment/YYYY-MM-DD-<session>.jsonl` — 1 entry par session, append.

### Schema

```json
{
  "id": "<branch-name>",
  "date": "YYYY-MM-DD",
  "rating": "Y|N|partial",
  "drift_categories": ["interpretation", "surgonflage", "bullshit", "hallucination", "scope-creep", "quality", "honnetete"],
  "principles_violated": ["P-04", "P-17"],
  "notes": "<text libre max 500 chars>",
  "intent_file": ".omc/intent/YYYY-MM-DD-<slug>.md ou null",
  "auditor_report": ".omc/alignment/auditor-YYYY-MM-DD-<slug>.json ou null"
}
```

### Rating enrichi (Phase 7bis session-end)

Sequence questions `AskUserQuestion` (Phase P2) :

1. **Rating Y/N/partial** — session = bien / mal / mitige
2. **Drift categories** (multi-select) — interpretation / surgonflage / bullshit / hallucination / scope-creep / quality / honnetete / aucune
3. **Principles violated** (texte libre) — ex "P-04, P-17" ou "aucun"
4. **Notes libres** (texte libre, optionnel)

Temps estime : < 30s. Retro-compat : `.omc/ratings.jsonl` continue d'etre append en format simple (archive historique).

### Script analyze

`scripts/alignment-analyze.sh [--quiet]`

Output :
- Distribution rating Y/N/partial (%)
- Top 5 drift categories (count)
- Top 5 principles most violated (P-XX count)
- Streak detection (3 N consecutifs → ALERTE)
- Pattern 7-dernieres si total >= 10

Mode `--quiet` : 1-ligne stats pour chain `health-check.sh` section INFO.

## 5. Couche C4 — Learning loop

### Subagent alignment-auditor

`.claude/agents/alignment-auditor.md` — sonnet, tools `Read, Grep, Glob` (READ-ONLY).

**Role** : invoque `/session-end` Phase 7ter (apres rating), clean-slate (pas d'heritage contexte primary). Compare :
- `.omc/intent/<slug>.md` session (si existe)
- `git log --since="session-start"` commits
- Brief cloture draft (si fourni dans prompt)
- Output : rapport JSON structure

**Rapport JSON** :
```json
{
  "session": "<branch-name>",
  "intent_file": "...",
  "scope_respected": true|false,
  "drift_detected": ["scope-creep", "..."],
  "principles_likely_violated": ["P-XX", "..."],
  "summary": "2-3 lignes factuel",
  "recommendation": "stop-et-clarifier | continue-mais-documenter | rien"
}
```

Append `.omc/alignment/auditor-YYYY-MM-DD-<slug>.json`.

**Limites** :
- Auditor = meme modele famille que primary → biais famille. Pas de verite absolue, juste indicateur
- Cout : ~5-10k tokens input + 2-3k output par invocation (optionnel, Kevin skip si quota tight)
- Kevin reste juge final

### Script constitution-suggest

`scripts/constitution-suggest.sh [--quiet]`

- Scan `wiki/meta/lessons-learned.md` pour pattern `🎯 to-constitute`
- Extrait contexte (5 lignes around) + propose draft P-XX en stdout
- Kevin decide manuel append constitution.md

### Auto-flag lessons-learned

Si en session Kevin dit "non, tu as derive" ou equivalent (pattern detection heuristique), j'append automatique dans `wiki/meta/lessons-learned.md` avec flag `🎯 to-constitute YYYY-MM-DD`. Phase P3 documente cette convention dans header lessons-learned.md.

## 6. Files critiques — Recap

| Fichier | Type | Role |
|---|---|---|
| `docs/core/body.md` | spec canonique | Ce fichier |
| `docs/core/constitution.md` | source verite | 30-50 principes P-XX |
| `scripts/intent-capture.sh` | generateur | Template 5 champs `.omc/intent/` |
| `scripts/alignment-analyze.sh` | analyzer | Distribution + streaks + top P-XX |
| `scripts/constitution-suggest.sh` | assistant | Scan 🎯 to-constitute → propose P-XX |
| `.claude/agents/alignment-auditor.md` | subagent | Clean-slate review session |
| `.omc/intent/*.md` | traces pre-action | 5 champs intent Kevin vs comprehension |
| `.omc/alignment/*.jsonl` | traces post-action | Rating enrichi + auditor reports |
| `wiki/concepts/Body.md` | concept wiki | Navigation Obsidian |
| `wiki/concepts/Alignment.md` | concept wiki | Scope drift / faithfulness / IFEval |
| `wiki/concepts/Constitution FOS.md` | concept wiki | Pointer constitution.md + methodo |

## 7. Integration avec 7 autres modules Core OS

| Module | Relation avec Body |
|---|---|
| **Cortex** | Routing tache → agent. Body surveille que l'agent choisi respecte scope intent |
| **Communication** | Body ajoute section 6.5 L2 (constitution.md chargee), section 6.1 brief v12 tuile #15 ALIGNMENT |
| **Monitor** | Body chaine `scripts/alignment-analyze.sh --quiet` dans `health-check.sh` section INFO |
| **Tools** | Body ajoute 3 scripts (intent-capture, alignment-analyze, constitution-suggest) au catalogue |
| **Planner** | `/plan-os` Tour 1 bis appelle intent-capture.sh OBLIGATOIRE |
| **Worktrees** | Body coexiste cleanement multi-worktree : `.omc/intent/` et `.omc/alignment/` sont localises par suffix worktree (pattern D-CONCURRENCY-01 `pre-compaction-snapshot.sh`). Cloture en serie s'applique |
| **Knowledge** | Body ajoute 3 pages wiki concepts. Consolidation post-ingest reflexe 2 peut enrichir pages Body si nouvelles sources (Reflexion, AlignmentCheck) |

## 8. Workflows

### Workflow 1 : Pre-action check (discipline documentee)

Avant toute action risquee (commit > 3 fichiers, rm, mv, git push, refactor >= 1h), **relire** :
- `.omc/intent/<slug>.md` session actuelle (si existe)
- Top 10 P-XX constitution.md

Si **desalignement detecte** (action != scope intent, ou contredit P-XX) :
1. **Stop** avant executer
2. Demander clarification a Kevin avec contexte precis : "Je comprends X mais intent dit Y, que veux-tu ?"
3. Documenter dans lessons-learned si recurrent

Section CLAUDE.md `Body : pre-action check` (Phase P3) formalise cette regle.

### Workflow 2 : Post-action review (Phase 7bis + 7ter session-end)

1. Rating enrichi 4 questions (~30s)
2. Append `.omc/alignment/<session>.jsonl`
3. Si intent file existe → invoquer subagent alignment-auditor (clean-slate)
4. Summary rapport dans brief cloture v12 (2-3 lignes)

### Workflow 3 : Learning loop (auto-correction)

1. En session, Kevin dit "non, tu as derive" → je append `wiki/meta/lessons-learned.md` avec flag `🎯 to-constitute`
2. Prochaine session : `bash scripts/constitution-suggest.sh` scanne flag → propose draft P-XX
3. Kevin valide → append constitution.md
4. Sessions suivantes : P-XX chargee L2, pre-action check la relie, moins de recurrence

### Workflow 4 : Dashboard alignment (brief v12)

Tuile #15 `🧭 ALIGNMENT` au `/session-start` :
- Derniere rating Y/N/partial + date
- Streak detection (3 N consecutifs = warning rouge)
- Top 3 P-XX les plus violes sur 7j
- Principe actif du jour (rotation 10 top = rappel quotidien)

Source : `bash scripts/alignment-analyze.sh --quiet`.

## 9. Regle d'or

**Une demande Kevin = 1 intent capture (si `/plan-os`) + 1 alignment entry a la fin.**

Pas de duplication : `.omc/intent/` pour avant, `.omc/alignment/` pour apres. Constitution.md est la source verite des principes. CLAUDE.md pointe vers body.md + constitution.md sans dupliquer.

Quand ca derive → lessons-learned.md + flag 🎯 to-constitute → enrichi constitution.md. Compounding knowledge applique a l'alignement.

## 10. Limites / Hors scope

- **Pas d'embeddings / vector store** pour matching P-XX vs output. YAGNI : 30-50 principes = grep + LLM-as-subagent suffit
- **Pas de hook UserPromptSubmit** pour intercepter demande Kevin automatiquement. API Claude Code Desktop pas simple. Workaround : lecture L2 SessionStart + discipline pre-action
- **Pas de LLM-as-judge runtime primary**. Biais meme instance. On passe par subagent clean-slate (auditor)
- **Pas d'auto-fix**. Quand derive detectee → alerte Kevin, jamais auto-correction (risque casser intention reelle)
- **Pas de metriques gamification** (dashboard vanity, streaks visibles). Outil factuel, pas motivant
- **Pas de migration auto-memory → constitution.md**. Feedback reste dans auto-memory (tier canonique "comment travailler avec Kevin"). Constitution.md reference par pointer
- **Pas de versioning semantique** constitution.md. On append P-XX, on ne renumerotate jamais (traceabilite stable)

## 11. Maintenance

### Drift detection

`scripts/drift-detector.sh` etendu (P3 ou P4 futur) pour verifier :
- `.omc/intent/` > 0 entree dans 7j (sinon WARN : `/plan-os` jamais utilise)
- `.omc/alignment/` > 0 entree dans 7j (sinon WARN : `/session-end` rating skip chronique)
- constitution.md tronquee (< 30 P-XX ou > 50 P-XX) → WARN

### Commits

Manuels via `/session-end`. Jamais auto-commit (respect regle Kevin-valide).

### Sauvegarde

Versionne git. `.omc/intent/` + `.omc/alignment/` + auditor reports trackes par defaut (decision P1). Peut basculer gitignore privacy si besoin.

### Lint

Pas de lint custom. `ref-checker.sh` existant couvre les refs de body.md + constitution.md. `wiki-health.sh` couvre pages wiki.

## 12. Evolution attendue (backlog)

- **Hook PreToolUse sur rm/mv/git push** : auto-rappel intent file si actif (opt-in config)
- **Visualisation timeline alignment** : script wiki-graph-report.sh etendu avec node alignment sur 30j
- **Cross-session patterns** : sessions-analyze.sh etendu avec drift categories
- **Integration OMC verifier/critic** : chain optionnelle si plugin installe
- **Migration CLAUDE.md imperatifs vers constitution.md** : post-stabilisation 3 mois, compresser CLAUDE.md en pointer vers constitution.md canonique

---

Decision associee : **D-BODY-01** (2026-04-19) — Module Body 8e Core OS. Plan execution : `docs/plans/2026-04-19-body-module-complet.md`. Phases P1-P5 incrementales, 6 elements stricts par phase, zero regression.

## Sources

- CLAUDE.md L9-24 (imperatifs qualite, seed constitution P-01 a P-14)
- `docs/core/architecture-core.md` (template module Core OS)
- `docs/core/knowledge.md` (pattern neuroplasticite reflexes)
- `docs/core/communication.md` (feedback loop + layered loading + brief v12)
- `wiki/concepts/Foundation OS.md` (5 pieges cadrage mega audit v2)
- `wiki/meta/lessons-learned.md` (auto-apprentissage patterns)
- [Constitutional AI (Anthropic)](https://arxiv.org/abs/2212.08073) : self-critique pattern
- [Reflection pattern Reflexion](https://stackviv.ai/blog/reflection-ai-agents-self-improvement) : +11% coding benchmark
- [AlignmentCheck (Meta)](https://www.augmentcode.com/guides/why-multi-agent-llm-systems-fail-and-how-to-fix-them) : 41.77% drift specification
- [IFEval](https://arxiv.org/abs/2311.07911) : verifiable instructions
- [Claude Code hooks canonical](https://viewyonder.com/articles/claude-code-hooks/) : policy CLAUDE.md / execution Skills / enforcement Hooks
