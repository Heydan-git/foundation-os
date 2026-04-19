# 🪐 Module Body P1-P5 Complet (19-04-2026)

> Plan `/plan-os` Option C ambitieuse (P1+P2+P3+P4+P5, ~10h sur 4-5 sessions). 5 phases × 6 elements stricts (memoire `feedback_plans_ultra_detailles.md`). Dual-path : ce fichier `~/.claude/plans/non-c-est-bon-allez-abundant-owl.md` + copie `docs/plans/2026-04-19-body-module-complet.md` post-approbation.

---

## Context

**Probleme** : Foundation OS est un systeme cognitif Kevin-Claude (7 modules Core OS actifs). Le feedback loop Phase 7bis `.omc/ratings.jsonl` existe mais **1 seule entree en 6 jours** → la discipline declarative seule echoue. Les imperatifs CLAUDE.md L9-24 (anti-bullshit, anti-hallucination, executer a la lettre, lire=tout) restent des regles **ecrites non-enforced runtime**. Le mega audit v2 2026-04-16 a documente 5 pieges cadrage recurrents (confondre FORME/FONCTION, surgonfler findings, cloner mauvais cadrage sous-agents, ne pas ecouter mots exacts Kevin, proposer audit-bis au lieu d'admettre l'erreur). Actuellement, quand je derive, rien ne me rappelle au scope initial en temps reel.

**Pourquoi maintenant** : apres D-MAPPING-01 (refactor mapping/routage), D-INTEG-01 (integration 4 sources externes), D-CONCURRENCY-01 (multi-session safety), l'infrastructure FOS est mure. Patterns bash + hooks + subagents + wiki + layered loading + neuroplasticite = solides. Ajouter un 8e module qui ferme la boucle alignement est la suite logique.

**Inspiration recherche externe** : Constitutional AI (Anthropic, [arxiv 2212.08073](https://arxiv.org/abs/2212.08073) + [constitution publique janvier 2026](https://time.com/7354738/claude-constitution-ai-alignment/)), Reflection pattern (Reflexion framework +11% coding benchmark GPT-4), Meta AlignmentCheck (41.77% des multi-agent failures = specification drift), IFEval verifiable constraints ([arxiv 2311.07911](https://arxiv.org/abs/2311.07911)), Claude Code canonical pattern "Policy in CLAUDE.md, execution in Skills, enforcement in Hooks".

**Resultat attendu** :
- 8e module Core OS `Body` livre avec spec canonique `docs/core/body.md`
- 4 couches fonctionnelles (Constitution / Intent / Feedback / Learning)
- Integration brief v12 (tuile `🧭 ALIGNMENT`)
- Chain health-check INFO (alignment-analyze --quiet)
- Subagent `alignment-auditor` clean-slate invoque `/session-end`
- 3 pages wiki concepts (`Body.md` + `Alignment.md` + `Constitution FOS.md`)
- Traces structurees `.omc/intent/*.md` + `.omc/alignment/*.jsonl`
- Learning loop : derives detectees → append lessons-learned + suggestions constitution

**Contraintes Kevin** :
- **Option C ambitieuse** : toutes les phases, pas de MVP morcele
- **Minutieux, zero regression** : health-check SAIN apres chaque phase, rollback plan par phase
- **Intent capture obligatoire uniquement sur `/plan-os`** (pas /cockpit, pas petites taches)
- YAGNI : pas d'embeddings, pas de regex matcher auto, pas de LLM-as-judge runtime
- Convention FOS : branches `<type>/<scope>-<desc>-yymmdd`, commits conventionnels, plans dual-path, tests avant claim, lire=lire tout, honnetete stricte

---

## Architecture — 4 couches

### Couche C1 : Constitution (source verite ecrite)

**Fichier principal** : `docs/core/constitution.md` (nouveau, ~300L)

**Contenu** : 30-50 principes numerotes `P-XX Titre` avec pour chacun :
- **Regle** (1 ligne, imperative)
- **Pourquoi** (1-2 lignes, raison racine)
- **Exemple done** (1-2 lignes, concret)
- **Exemple not-done** (1-2 lignes, anti-pattern)
- **Source** : origine (CLAUDE.md LXX, lessons-learned.md section, mega audit piege N, memoire `feedback_*.md`)

**Seed automatique depuis** :
- CLAUDE.md L9-24 (14 imperatifs qualite → P-01 a P-14)
- CLAUDE.md L148-153 (anti-bullshit gates → P-15 a P-19)
- wiki/meta/lessons-learned.md (YAGNI P-20, push main P-21, API verification P-22, Obsidian paths P-23-24, ref-checker slash P-25, split TSX refs P-26, etoile vs mesh P-27, 5 pieges cadrage P-28 a P-32)
- CLAUDE.md L119-128 (interdit sans Kevin → P-33 a P-36)
- auto-memory feedback_*.md (thinking FR P-37, TodoWrite systematique P-38, frontload questions P-39, visual verification P-40, audits exhaustifs P-41)

**Lecture** : L2 layered loading section 6.5 communication.md (ajouter Constitution dans table). Lue au `/session-start` Tour 1 + `/cockpit`. Pas de hook new (on etend session-start-wiki existant pour cat top 10 principes).

**Extensibilite** : chaque P-XX peut etre enrichi par `scripts/constitution-suggest.sh` (Phase P3).

### Couche C2 : Intent capture (ancrage pre-action)

**Fichier structure** : `.omc/intent/YYYY-MM-DD-<slug>.md`

**Template 5 champs** :
```markdown
# Intent — <slug>
## Date : YYYY-MM-DD
## Session : <branch-name>

## 1. Verbatim Kevin
> <copier-coller exact de la demande>

## 2. Ce que je comprends
<reformulation 2-3 lignes>

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

**Script generation** : `scripts/intent-capture.sh <slug> [--demand "texte"]`
- Cree fichier template, open $EDITOR ou heredoc interactif via AskUserQuestion dans /plan-os
- Append `.gitignore` check (ne pas tracker `.omc/intent/` car personnel session)
- Exit 0 si ok, 1 si slug manquant

**Integration** :
- `/plan-os` Tour 1 bis : **OBLIGATOIRE**, juste apres EnterPlanMode, avant Write plan file
- `/cockpit` : SKIP par defaut (opt-in manuel via `bash scripts/intent-capture.sh` si Kevin veut)
- `/session-end` : lecture auto-file pour comparer intent vs actions (alignment-auditor)

### Couche C3 : Feedback structure (post-action traces)

**Fichier** : `.omc/alignment/YYYY-MM-DD-<session>.jsonl` (1 entry par session, append)

**Schema JSONL** :
```json
{
  "id": "<branch-name>",
  "date": "YYYY-MM-DD",
  "rating": "Y|N|partial",
  "drift_categories": ["interpretation"|"surgonflage"|"bullshit"|"hallucination"|"scope-creep"|"quality"|"honnetete"],
  "principles_violated": ["P-04", "P-17"],
  "notes": "<text libre max 500 chars>",
  "intent_file": ".omc/intent/YYYY-MM-DD-<slug>.md (ou null)",
  "auditor_report": ".omc/alignment/auditor-YYYY-MM-DD.json (ou null)"
}
```

**Rating enrichi** : Phase 7bis session-end evolue de Y/N/partial simple vers AskUserQuestion multi-champs (rating + categories drift + principles violated + notes). Retro-compat : `.omc/ratings.jsonl` reste en place (archive historique), nouveau format dans `.omc/alignment/`.

**Script analyze** : `scripts/alignment-analyze.sh [--quiet]`
- Distribution categories (%)
- Top 5 principles les plus violes (P-XX count)
- Streak detection (3 N consecutifs)
- Pattern 7-dernieres si total >= 10
- Mode --quiet : 1-ligne stats pour chain health-check INFO

### Couche C4 : Learning loop (auto-correction)

**Subagent** : `.claude/agents/alignment-auditor.md` (sonnet, clean-slate)
- Tools : Read, Grep, Glob (read-only)
- Role : invoque `/session-end` Phase 7ter, lit `.omc/intent/<slug>.md` de la session + git log commits + brief cloture draft → produit alignment report JSON append `.omc/alignment/`
- Clean-slate : n'herite pas contexte primary (moins biaise, audit externe)
- Limite : cout tokens subagent = 1/session-end, non-bloquant si skip

**Script constitution suggest** : `scripts/constitution-suggest.sh`
- Scan wiki/meta/lessons-learned.md pour patterns flaggues `🎯 to-constitute`
- Propose nouveau P-XX draft (titre + regle + exemples) en stdout
- Kevin decide (append manuel constitution.md)

**Auto-flag lessons-learned** : si en session Kevin dit "non, tu as derive" ou equivalent (pattern detection via chat history — heuristique) → je flag la lesson apprise avec `🎯 to-constitute YYYY-MM-DD`. Phase P3.

---

## Files critiques — Tableau integration

| Fichier | Type | Action |
|---|---|---|
| `docs/core/body.md` | **Nouveau** | Spec module 8 (P1, ~400L) |
| `docs/core/constitution.md` | **Nouveau** | 30-50 principes P-XX (P1, ~300L) |
| `scripts/intent-capture.sh` | **Nouveau** | Template + validation (P1, ~80L) |
| `scripts/alignment-analyze.sh` | **Nouveau** | Distribution + streaks + patterns (P2, ~120L) |
| `scripts/constitution-suggest.sh` | **Nouveau** | Scan lessons-learned → propose P-XX (P3, ~60L) |
| `.claude/agents/alignment-auditor.md` | **Nouveau** | Subagent clean-slate review (P4, ~80L) |
| `wiki/concepts/Body.md` | **Nouveau** | Concept canonique (P5) |
| `wiki/concepts/Alignment.md` | **Nouveau** | Concept canonique (P5) |
| `wiki/concepts/Constitution FOS.md` | **Nouveau** | Concept canonique (P5) |
| `CLAUDE.md` | Edit | +Section "Body : pre-action check" (~15L) + pointeur `docs/core/body.md` (P3) |
| `docs/core/architecture-core.md` | Edit | Table Modules 7 → 8, ajouter Body Phase 8 (P1) |
| `docs/core/communication.md` | Edit | Section 6.5 Layered Loading L2 : ajouter Constitution (P1) |
| `docs/core/cortex.md` | Edit | Section 5 Limites : pointeur Body pour alignment (P5) |
| `.claude/commands/plan-os.md` | Edit | Tour 1 bis intent-capture obligatoire (P1) |
| `.claude/commands/session-end.md` | Edit | Phase 7bis enrichi + Phase 7ter alignment-auditor (P2+P4) |
| `.claude/commands/session-start.md` | Edit | Tour 1 : Read constitution.md (P1) |
| `.claude/commands/cockpit.md` | Edit | Tour 1 : Read constitution.md (P1) |
| `scripts/health-check.sh` | Edit | Chain INFO `alignment-analyze.sh --quiet` (P2) |
| `scripts/hooks/session-start-wiki.sh` | Edit | cat top 10 P-XX de constitution.md (P1) |
| `wiki/concepts/Foundation OS.md` | Edit | Table "7 modules" → "8 modules" + ajout Body row (P5) |
| `wiki/index-wiki.md` | Edit | +3 pages concepts (P5) |
| `wiki/meta/thinking.md` | Edit | Insight session P1-P5 (chaque phase) |
| `wiki/meta/sessions-recent.md` | Edit | Session resumes P1-P5 (chaque phase) |
| `CONTEXT.md` | Edit | Sessions recentes + Cap + Decisions D-BODY-01 (chaque phase) |
| `.gitignore` | Edit | `.omc/intent/` si on decide untracked (P1 decision) |

**Scripts existants reutilises** (zero reinvention) :
- `scripts/health-check.sh` : pattern chain INFO section DIM
- `scripts/wiki-health.sh` : pattern --quiet mode + exit codes
- `scripts/session-ratings-analyze.sh` : pattern analyze JSONL distribution + streak detection
- `scripts/memory-audit.sh` : pattern scan wiki/meta avec flags
- `scripts/tier-contradiction-check.sh` : pattern scan 5 tiers avec tmpfile subshell-safe
- `scripts/hooks/pre-compaction-snapshot.sh` : pattern suffix worktree
- `.claude/agents/dev-agent.md` : pattern frontmatter minimal (name/model/description) + contexte obligatoire + hors scope + sortie

---

## Plan execution — 5 phases × 6 elements

### 🔴 Phase P1 : Constitution + Intent MVP (~2-3h, session dediee)

#### 1. Pre-conditions
- Health-check SAIN (0 critical, 0 warning)
- `/session-start` effectue, brief v12 valide
- Worktree dedie ou branche `feat/body-p1-constitution-260419`
- Kevin valide ce plan via ExitPlanMode

#### 2. Etat repo attendu apres P1
- 4 nouveaux fichiers : `docs/core/body.md` + `docs/core/constitution.md` + `scripts/intent-capture.sh` + (stub) `.omc/intent/2026-04-19-body-p1-constitution.md` (dogfooding : P1 cree son propre intent)
- 5 fichiers edites : `docs/core/architecture-core.md` + `docs/core/communication.md` + `.claude/commands/plan-os.md` + `.claude/commands/session-start.md` + `.claude/commands/cockpit.md`
- Health-check SAIN conserve
- 1 commit `feat(os): P1 body constitution + intent capture (D-BODY-01 1/5)`

#### 3. Actions atomiques
1. **Creer `docs/core/body.md`** — spec canonique 11 sections (adapter template architecture-core.md + knowledge.md) : Architecture / Couche C1 / C2 / C3 / C4 / Files critiques / Integration 7 modules / Workflows / Regle d'or / Limites / Maintenance
2. **Creer `docs/core/constitution.md`** — 30-50 P-XX seeded manuellement depuis CLAUDE.md L9-24 + L148-153 + lessons-learned.md + auto-memory feedback. Format : P-01 Titre / Regle / Pourquoi / Done / Not-done / Source.
3. **Creer `scripts/intent-capture.sh`** — bash `set -uo pipefail`, args `<slug> [--demand "texte"]`, write `.omc/intent/YYYY-MM-DD-<slug>.md` template 5 champs. Exit 0 ok, 1 missing arg.
4. **Edit `docs/core/architecture-core.md`** — table Modules (7 → 8 rows, ajouter Body Phase 8 actif), section 2 Modules (ajouter paragraphe Body apres Knowledge), table Principes (inchange).
5. **Edit `docs/core/communication.md`** — section 6.5 Layered Loading L2 : ajouter ligne `constitution.md` dans "Contenu" L2, seuil `l2_tokens_max` reste 10000 (constitution ~2k tokens estimes).
6. **Edit `.claude/commands/plan-os.md`** — Tour 1 bis nouveau : "2a. `Bash bash scripts/intent-capture.sh <slug>` — OBLIGATOIRE avant Write plan file. Si Kevin skip (reponse vide) : log warning mais continuer."
7. **Edit `.claude/commands/session-start.md`** + **cockpit.md** — Tour 1 : ajouter `Read docs/core/constitution.md` dans parallel reads (Tour 1 point 10 existant extensible, ou nouveau point dedie). Budget L2 respecte.
8. **Dogfooding intent** : executer `bash scripts/intent-capture.sh body-p1-constitution --demand "creer module Body P1 constitution + intent MVP"`. File cree, ajoute a commit (ou gitignore selon decision).
9. **Decision gitignore** : trancher `.omc/intent/` tracke ou non. Recommandation : **tracke** (versionnable, audit trail, collaboration future si Kevin equipe). Si pas tracke, ajouter regle `.gitignore`.

#### 4. Verification
- `bash scripts/health-check.sh` : SAIN conserve
- `bash scripts/ref-checker.sh` : 0 refs cassees (verifier que new wikilinks dans body.md + constitution.md sont valides)
- `bash scripts/intent-capture.sh test-slug` : fichier cree, template correct, exit 0
- `cat .omc/intent/2026-04-19-body-p1-constitution.md` : template 5 champs rempli
- `wc -l docs/core/body.md docs/core/constitution.md` : 350-500 total estime
- `grep -c "^## P-" docs/core/constitution.md` : 30-50 principes presents
- Lire a froid (simulation Kevin) : est-ce que body.md se suffit sans CLAUDE.md ? Est-ce que constitution.md est actionnable ?

#### 5. Rollback
- Commit atomique P1 → `git revert <sha>` propre
- Fichiers nouveaux : `rm docs/core/body.md docs/core/constitution.md scripts/intent-capture.sh .omc/intent/2026-04-19-body-p1-constitution.md`
- Fichiers edites : `git checkout HEAD~1 -- docs/core/architecture-core.md docs/core/communication.md .claude/commands/plan-os.md .claude/commands/session-start.md .claude/commands/cockpit.md`
- Re-run health-check pour confirmer etat pre-P1

#### 6. Commit message
```
feat(os): P1 body constitution + intent capture (D-BODY-01 1/5)

- docs/core/body.md : spec 8e module Core OS (Proprioception Kevin-Claude)
- docs/core/constitution.md : 30-50 principes P-XX seedees CLAUDE+lessons+memory
- scripts/intent-capture.sh : template 5 champs .omc/intent/
- architecture-core.md + communication.md : integration 8e module + L2 layered
- plan-os.md + session-start.md + cockpit.md : intent-capture obligatoire /plan-os

Verif : health SAIN + refs 0 + dogfooding intent cree
```

---

### 🔴 Phase P2 : Rating enrichi + alignment-analyze (~2h, session dediee)

#### 1. Pre-conditions
- P1 merge main + push OK
- Health-check SAIN
- `.omc/intent/` contient au moins 1 entree (P1 dogfooding)
- Branche `feat/body-p2-alignment-260419`

#### 2. Etat repo attendu apres P2
- 1 nouveau script `scripts/alignment-analyze.sh`
- 1 fichier edite : `.claude/commands/session-end.md` (Phase 7bis enrichie)
- 1 fichier edite : `scripts/health-check.sh` (chain INFO)
- 1 nouveau fichier `.omc/alignment/2026-04-19-body-p2.jsonl` (dogfooding)
- 1 commit `feat(os): P2 body rating enrichi + alignment-analyze (D-BODY-01 2/5)`

#### 3. Actions atomiques
1. **Creer `scripts/alignment-analyze.sh`** — modele `session-ratings-analyze.sh`. Input : `.omc/alignment/*.jsonl`. Output : distribution Y/N/partial + categories drift (grep count) + top 5 P-XX violated + streak detection + pattern 7-dernieres si total >= 10. Mode --quiet pour chain.
2. **Edit `.claude/commands/session-end.md` Phase 7bis** — remplacer AskUserQuestion simple Y/N/partial par sequence :
   - Q1 : rating Y/N/partial (existant)
   - Q2 : drift categories multi-select (interpretation/surgonflage/bullshit/hallucination/scope-creep/quality/honnetete/aucune)
   - Q3 : principles violated (texte libre "P-04, P-17" ou "aucun")
   - Q4 : notes libres (existant)
   - Append `.omc/alignment/YYYY-MM-DD-<branch>.jsonl` au format schema C3
   - Retro-compat : continuer append `.omc/ratings.jsonl` format simple (archive)
3. **Edit `scripts/health-check.sh`** — chain INFO nouvelle ligne `bash scripts/alignment-analyze.sh --quiet` apres wiki-graph-report.
4. **Dogfooding** : a la fin de P2 session-end, rating enrichi pour cette session. File `.omc/alignment/2026-04-19-body-p2.jsonl` cree.

#### 4. Verification
- `bash scripts/alignment-analyze.sh` mode verbose : distribution affichee, streaks si applicable
- `bash scripts/alignment-analyze.sh --quiet` : 1-ligne stats
- `bash scripts/alignment-analyze.sh --quiet` avec `.omc/alignment/` vide : exit 0 + message "0 rated"
- `bash scripts/health-check.sh` : chain INFO affiche ligne alignment sans bloquer
- `/session-end` dogfooding : 4 questions posees, append JSONL schema conforme
- `python3 -c "import json; [json.loads(l) for l in open('.omc/alignment/...').readlines()]"` : JSONL valide

#### 5. Rollback
- `git revert <sha>` P2 commit
- `rm scripts/alignment-analyze.sh .omc/alignment/2026-04-19-body-p2.jsonl`
- `git checkout HEAD~1 -- .claude/commands/session-end.md scripts/health-check.sh`
- Re-run health-check SAIN

#### 6. Commit message
```
feat(os): P2 body rating enrichi + alignment-analyze (D-BODY-01 2/5)

- scripts/alignment-analyze.sh : distribution drift + top P-XX violated + streaks
- session-end.md Phase 7bis : AskUserQuestion 4 champs + append .omc/alignment/
- health-check.sh : chain INFO alignment-analyze --quiet
- Retro-compat .omc/ratings.jsonl archive historique

Verif : dogfooding JSONL valide + chain health SAIN
```

---

### 🟡 Phase P3 : Pre-action check + lessons loop (~1-2h, session dediee)

#### 1. Pre-conditions
- P2 merge main + push OK
- Health-check SAIN, alignment-analyze chain fonctionne
- Au moins 2 entrees `.omc/alignment/` (dogfooding P1+P2)
- Branche `feat/body-p3-lessons-loop-260419`

#### 2. Etat repo attendu apres P3
- 1 nouveau script `scripts/constitution-suggest.sh`
- 1 fichier edite : `CLAUDE.md` (nouvelle section ~15L "Body : pre-action check")
- 1 fichier edite : `wiki/meta/lessons-learned.md` (convention flag `🎯 to-constitute` documentee dans header)
- 1 commit `feat(os): P3 body pre-action check + lessons loop (D-BODY-01 3/5)`

#### 3. Actions atomiques
1. **Creer `scripts/constitution-suggest.sh`** — bash grep `🎯 to-constitute` dans `wiki/meta/lessons-learned.md`. Pour chaque match, extraire contexte (5 lignes around) + propose format P-XX draft en stdout. Mode --quiet : compteur only.
2. **Edit `CLAUDE.md`** — ajouter section entre "Garde-fous" et "Multi-session" :
   ```markdown
   ## Body : pre-action check (D-BODY-01)

   Avant actions risquees (rm, mv, git push, commit > 3 fichiers, refactor >= 1h),
   relire intent (`.omc/intent/<slug>.md` si actif) + top 10 P-XX constitution.
   Si desalignement detecte → stop, clarifier avec Kevin avant d'executer.

   Spec complete : `docs/core/body.md` section 4 (workflows).
   Constitution : `docs/core/constitution.md` (30-50 principes P-XX).
   ```
3. **Edit `wiki/meta/lessons-learned.md`** — ajouter header explicatif convention `🎯 to-constitute` : "Si une erreur/piege merite un nouveau principe constitution, prefixer titre section avec 🎯. `bash scripts/constitution-suggest.sh` scanne et propose."
4. **Dogfooding** : si P1 ou P2 a revele un piege, flag rétro `🎯 to-constitute` dans lessons-learned. Lancer `constitution-suggest.sh` pour voir output.
5. **Self-discipline documentee** : CLAUDE.md L9-24 reference constitution.md pour enforcement (pas de duplication, juste pointeur).

#### 4. Verification
- `bash scripts/constitution-suggest.sh` : parse lessons-learned sans erreur, exit 0
- `bash scripts/constitution-suggest.sh --quiet` : compteur correct
- CLAUDE.md wc -l : < 215L (garde-fou ~200L respecte, +15L tolere car crucial)
- `grep "🎯" wiki/meta/lessons-learned.md` : au moins 1 match si dogfooding
- Health-check SAIN

#### 5. Rollback
- `git revert <sha>` P3
- `rm scripts/constitution-suggest.sh`
- `git checkout HEAD~1 -- CLAUDE.md wiki/meta/lessons-learned.md`

#### 6. Commit message
```
feat(os): P3 body pre-action check + lessons loop (D-BODY-01 3/5)

- scripts/constitution-suggest.sh : scan 🎯 to-constitute → propose P-XX
- CLAUDE.md : +section Body pre-action check (~15L)
- lessons-learned.md header : convention flag documentee

Verif : script parse OK + CLAUDE.md < 215L + flag convention claire
```

---

### 🟡 Phase P4 : Agent alignment-auditor (~2h, session dediee)

#### 1. Pre-conditions
- P3 merge main + push OK
- `.omc/intent/` et `.omc/alignment/` contiennent chacun >= 3 entrees (dogfooding P1/P2/P3)
- Health-check SAIN
- Branche `feat/body-p4-auditor-260419`

#### 2. Etat repo attendu apres P4
- 1 nouveau fichier `.claude/agents/alignment-auditor.md` (~80L)
- 1 fichier edite : `.claude/commands/session-end.md` (Phase 7ter nouvelle)
- 1 dogfooding `.omc/alignment/auditor-2026-04-19-body-p4.json` (rapport subagent)
- 1 commit `feat(os): P4 body alignment-auditor subagent (D-BODY-01 4/5)`

#### 3. Actions atomiques
1. **Creer `.claude/agents/alignment-auditor.md`** — frontmatter sonnet, tools `Read, Grep, Glob` (READ-ONLY, clean-slate). Sections :
   - Contexte obligatoire : lire `.omc/intent/<slug>.md` session + `git log --since="session start"` + brief cloture draft (si disponible, Kevin fournit dans prompt subagent)
   - Role : comparer intent vs actions vs output. Detecter scope-creep (fichiers touches hors scope), interpretation (ecart comprehension vs verbatim Kevin), honnetete (claim DONE sans verif), quality (metriques vides).
   - Hors scope : ne juge pas la qualite technique du code, juste l'alignement intention-action
   - Sortie : rapport JSON structure `{session, intent_file, scope_respected: bool, drift_detected: [categories], principles_likely_violated: [P-XX], summary: "..."}`
   - Append a `.omc/alignment/auditor-YYYY-MM-DD.json`
2. **Edit `.claude/commands/session-end.md`** — ajouter Phase 7ter apres 7bis rating : "Si session impliquait `/plan-os` (intent file existe) : invoquer subagent alignment-auditor avec prompt contenant `.omc/intent/<slug>.md` + git diff summary. Append report. Afficher summary 2-3 lignes dans brief cloture."
3. **Dogfooding** : a la fin de P4 session-end, invoquer auditor sur P4 meme (recursion : est-ce que l'execution de P4 respecte intent P4 ?).
4. **Limite cout tokens** : subagent = ~5-10k tokens input + ~2-3k output. Kevin peut skip via reponse vide a la question "Invoquer auditor ?" dans Phase 7ter.

#### 4. Verification
- `.claude/agents/alignment-auditor.md` frontmatter valide (parser YAML)
- Simuler invocation : Task tool avec subagent_type="alignment-auditor" → retourne JSON valide
- Dogfooding : `.omc/alignment/auditor-2026-04-19-body-p4.json` rapport coherent (intent P4 avait 5 champs, actions P4 ont respecte ?)
- Health-check SAIN
- Pas de regression subagents existants (dev-agent/doc-agent/os-architect/review-agent toujours invocables)

#### 5. Rollback
- `git revert <sha>` P4
- `rm .claude/agents/alignment-auditor.md .omc/alignment/auditor-2026-04-19-body-p4.json`
- `git checkout HEAD~1 -- .claude/commands/session-end.md`

#### 6. Commit message
```
feat(os): P4 body alignment-auditor subagent (D-BODY-01 4/5)

- .claude/agents/alignment-auditor.md : clean-slate read-only (sonnet)
- Compare intent vs actions vs output → JSON report
- session-end.md Phase 7ter : invocation optionnelle apres rating
- Retro-compat : 4 subagents existants intacts

Verif : dogfooding rapport coherent + health SAIN
```

---

### 🟢 Phase P5 : Brief v12 tuile + wiki concepts (~1h, session dediee)

#### 1. Pre-conditions
- P4 merge main + push OK
- `.omc/alignment/` >= 4 entrees rating + >= 1 rapport auditor
- Health-check SAIN
- Branche `feat/body-p5-brief-wiki-260419`

#### 2. Etat repo attendu apres P5
- 3 nouvelles pages wiki : `wiki/concepts/Body.md` + `wiki/concepts/Alignment.md` + `wiki/concepts/Constitution FOS.md` (confidence: medium, source: `docs/core/body.md`)
- 4 fichiers edites : `wiki/concepts/Foundation OS.md` (table 7→8 modules) + `wiki/index-wiki.md` (+3 pages) + `docs/core/communication.md` (section 6.1 brief v12 liste 14→15 sections, tuile #15 `🧭 ALIGNMENT`) + `docs/core/cortex.md` (section 5 pointer Body)
- 1 fichier edite : `.claude/commands/session-start.md` + `cockpit.md` (Tour 3 brief inclut tuile ALIGNMENT si ratings recent)
- 1 commit `feat(os): P5 body brief v12 tuile + wiki concepts (D-BODY-01 5/5 COMPLET)`

#### 3. Actions atomiques
1. **Creer `wiki/concepts/Body.md`** — concept canonique. Frontmatter : type=concept, domain=dev, confidence=medium (seed), tags=[body, alignment, core-os]. Related : [[Core OS]], [[Foundation OS]], [[Alignment]], [[Constitution FOS]], [[Neuroplasticite]].
2. **Creer `wiki/concepts/Alignment.md`** — concept canonique. Definitions scope drift + faithfulness + IFEval. Sources externes citees (Constitutional AI, Reflexion, AlignmentCheck).
3. **Creer `wiki/concepts/Constitution FOS.md`** — concept canonique. Pointer `docs/core/constitution.md` pour liste P-XX. Explique methodo seed + extension.
4. **Edit `wiki/concepts/Foundation OS.md`** — table "Les 7 modules" → "Les 8 modules Core OS", ajouter row Body avec role "Proprioception Kevin-Claude, alignement intention ↔ action" + spec `docs/core/body.md`.
5. **Edit `wiki/index-wiki.md`** — section Concepts, ajouter 3 pages. Update compteur total pages (48 → 51).
6. **Edit `docs/core/communication.md`** — section 6.1 liste sections brief v12 : 14 → 15 sections (ajouter #15 `🧭 ALIGNMENT` : derniere rating + streak + top P-XX viole + principe actif jour). Source : `bash scripts/alignment-analyze.sh --quiet` au /session-start Tour 1.
7. **Edit `docs/core/cortex.md`** — section 5 Limites : ajouter "Alignment intention-action → Body (docs/core/body.md)".
8. **Edit `.claude/commands/session-start.md`** + **cockpit.md** — Tour 1 ajouter `bash scripts/alignment-analyze.sh --quiet` pour la tuile #15 brief. Tour 3 integration tuile dans brief.
9. **Update `wiki/hot.md`** : mentionner P5 COMPLET module Body livre.
10. **Dogfooding** : brief v12 session-end P5 inclut tuile `🧭 ALIGNMENT` (meta : on voit le systeme fonctionner).

#### 4. Verification
- `bash scripts/wiki-health.sh` : 51 pages (ex 48 + 3), 0 wikilink casse
- `bash scripts/ref-checker.sh` : 0 refs cassees (apres ajouts)
- `bash scripts/wiki-confidence-audit.sh --check` : 3 nouvelles pages confidence `medium` OK
- `bash scripts/wiki-graph-report.sh` : nouveau god-node potentiel (Body.md ?) detecte si > seuil
- `/session-start` test : brief v12 affiche 15 tuiles dont `🧭 ALIGNMENT` avec data dogfooding
- Health-check SAIN
- CONTEXT.md table Modules : 7 → 8 (Body actif)

#### 5. Rollback
- `git revert <sha>` P5
- `rm wiki/concepts/Body.md wiki/concepts/Alignment.md "wiki/concepts/Constitution FOS.md"`
- `git checkout HEAD~1 -- wiki/concepts/Foundation\ OS.md wiki/index-wiki.md docs/core/communication.md docs/core/cortex.md .claude/commands/session-start.md .claude/commands/cockpit.md wiki/hot.md`

#### 6. Commit message
```
feat(os): P5 body brief v12 tuile + wiki concepts (D-BODY-01 5/5 COMPLET)

- wiki/concepts/Body.md + Alignment.md + Constitution FOS.md (3 pages)
- Foundation OS.md : table 7 → 8 modules Core OS
- communication.md section 6.1 : brief v12 14 → 15 sections (tuile 🧭 ALIGNMENT)
- cortex.md section 5 : pointer Body
- index-wiki + session-start + cockpit : integration tuile
- D-BODY-01 COMPLET (Module Body 8e Core OS actif)

Verif : wiki-health 51 pages + refs 0 + brief 15 tuiles OK
```

---

## Hors scope

- **Pas d'embeddings / vector store** pour matching principes P-XX vs output (YAGNI, grep + LLM-as-subagent suffit pour 30-50 principes)
- **Pas de hook UserPromptSubmit** pour intercepter auto la demande Kevin (API Claude Code Desktop pas simple, workaround : lecture constitution SessionStart + discipline pre-action documentee)
- **Pas de LLM-as-judge runtime primary** (biais meme instance, on passe par subagent clean-slate P4)
- **Pas d'auto-fix** : quand derive detectee, on alerte Kevin, jamais auto-correction (risque casser intention reelle Kevin)
- **Pas de metriques gamification** (streaks, scores globaux visibles en dashboard) : garde outil factuel, pas motivant vanity
- **Pas de migration auto-memory feedback_*.md vers constitution.md** : chaque feedback reste dans auto-memory (tier canonique "comment travailler avec Kevin"), constitution.md reference par pointer
- **Pas d'internationalisation constitution** : FR/EN mix comme CLAUDE.md (discipline Kevin thinking FR memoire)
- **Pas de CLI interactif complexe pour intent-capture.sh** : heredoc simple, Kevin peut editer fichier apres coup
- **Pas de versioning semantic de constitution.md** : on append P-XX, on ne renume jamais (traceabilite stable dans rapports auditor)

---

## Verification end-to-end (apres P5)

### Tests fonctionnels
```bash
# Test 1 : Constitution lue au SessionStart
bash scripts/hooks/session-start-wiki.sh | grep "P-"  # affiche principes
/session-start  # brief v12 15 tuiles inclut ALIGNMENT

# Test 2 : Intent capture /plan-os
/plan-os "test demande Kevin"  # Tour 1 bis invoque intent-capture.sh
ls .omc/intent/$(date +%Y-%m-%d)-*.md  # fichier cree

# Test 3 : Rating enrichi /session-end
/session-end  # Phase 7bis 4 questions, append JSONL
cat .omc/alignment/$(date +%Y-%m-%d)-*.jsonl | python3 -m json.tool  # valide

# Test 4 : Analyze
bash scripts/alignment-analyze.sh  # distribution + streaks
bash scripts/alignment-analyze.sh --quiet  # 1-ligne chain

# Test 5 : Subagent auditor
# Dans session : Task subagent_type="alignment-auditor" prompt with intent file
cat .omc/alignment/auditor-*.json  # rapport structure

# Test 6 : Constitution suggest
echo "🎯 to-constitute Test (2026-04-19)" >> wiki/meta/lessons-learned.md
bash scripts/constitution-suggest.sh  # detecte + propose P-XX

# Test 7 : Health-check chain
bash scripts/health-check.sh | grep -A1 "alignment"  # ligne INFO visible

# Test 8 : Dogfooding complet
# Relire ce plan (le plan actuel)
# Verifier que chaque P1-P5 a ete execute selon intent
# Le subagent alignment-auditor aurait du detecter 0 derive (ou quelques)
```

### Tests non-regression
- Build app : `cd modules/app && npm run build` — SAIN conserve
- Tests app : `npm test -w modules/app` — 15/15 passent
- Build DS : `cd modules/design-system && npm run build` — SAIN
- Health-check complet : 0 critical, 0 warning
- Ref-checker : 0 refs cassees
- Wiki-health : SAIN
- Drift-detector : SYNC
- Session-start test : brief v12 affiche en < 10s
- Subagents existants : dev-agent + doc-agent + os-architect + review-agent toujours invocables

### Criteres completude D-BODY-01 COMPLET
- [ ] `docs/core/body.md` + `docs/core/constitution.md` existent et coherents
- [ ] 30-50 principes P-XX seedees avec exemples done/not-done
- [ ] `.omc/intent/` et `.omc/alignment/` populees (dogfooding P1-P5 au minimum)
- [ ] Subagent `alignment-auditor` invocable et produit rapport JSON
- [ ] Brief v12 inclut tuile `🧭 ALIGNMENT`
- [ ] 3 pages wiki concepts crees avec confidence `medium`
- [ ] Foundation OS.md table mise a jour 7 → 8 modules
- [ ] Health-check SAIN, 0 regression
- [ ] CONTEXT.md Decisions : D-BODY-01 avec date + detail
- [ ] sessions-recent.md : 5 entrees P1 a P5 avec scope/decisions/threads

---

## Risques

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| CLAUDE.md depasse 215L avec P3 section | Moyenne | Bloquant garde-fou | Compresser section imperatifs en pointer vers constitution.md (economie ~15L) |
| Constitution.md > 30-50 P-XX (gonflement) | Moyenne | Pollue context L2 layered loading | Regle stricte : max 50 P-XX en P1. Au-dela, regrouper en meta-principes |
| .omc/intent/ tracke git : fuite info sensible | Faible | Privacy | Decision P1 : gitignore si Kevin prefere, documenter dans body.md |
| Subagent auditor biais (meme modele famille) | Forte | Faux positifs | Document limite dans body.md. Auditor = indicateur, pas verite. Kevin reste juge final |
| Discipline pre-action oubliee (comme Phase 7bis 1 entree) | Forte | Feature morte | Mecanisme force par `/plan-os` flow (obligatoire), pas opt-in |
| Rating enrichi trop lourd (4 questions) | Moyenne | Kevin skip | Friction reduite : Q2/Q3 multi-select rapide, Q4 optionnel. Total < 30s |
| Cout tokens subagent auditor (5-10k / session-end) | Faible | Quota Max x20 | Option skip Phase 7ter. Dogfooding montrera cout reel |
| Conflit merge multi-session sur constitution.md | Faible | Perte travail | Meme regle cloture-en-serie D-CONCURRENCY-01 |
| Dogfooding P1 → detecte derive en P1 meme | Possible | Meta-lol | OK : c'est le but, auto-correctif intrinseque |
| Regle "🎯 to-constitute" convention oubliee | Moyenne | Learning loop casse | Header lessons-learned.md documente. Script --quiet dans health-check si on veut push plus |
| TSX / code modules casse par edits | Tres faible | Regression | 0 fichier modules/ edite dans P1-P5 (pur Core OS) |

---

## References

**Specs FOS existantes reutilisees** :
- `docs/core/architecture-core.md` — template structure module
- `docs/core/knowledge.md` — pattern neuroplasticite + routines
- `docs/core/communication.md` section 6.5 — layered loading L0-L3
- `docs/core/cortex.md` — pattern routing
- `.claude/commands/session-end.md` Phase 7bis — feedback loop existant
- `.claude/commands/plan-os.md` — point d'ancrage intent-capture
- `scripts/session-ratings-analyze.sh` — pattern analyze JSONL
- `scripts/wiki-health.sh` — pattern --quiet mode
- `scripts/tier-contradiction-check.sh` — pattern scan 5 tiers

**Memoires Kevin appliquees** :
- `feedback_plans_ultra_detailles.md` — 6 elements par phase (applique dans chaque P1-P5)
- `feedback_subagents_context.md` — contexte precis injecte dans prompt (P4 auditor)
- `feedback_todowrite_systematique.md` — 1 todo par phase
- `feedback_thinking_francais.md` — thinking FR
- `feedback_audit_exhaustif.md` — lire contenu ligne par ligne
- `feedback_no_auto_archive.md` — pas de deplacement auto fichiers Kevin

**Sources externes (recherche web)** :
- [Constitutional AI arxiv 2212.08073](https://arxiv.org/abs/2212.08073)
- [Anthropic constitution publique 2026](https://time.com/7354738/claude-constitution-ai-alignment/)
- [IFEval arxiv 2311.07911](https://arxiv.org/abs/2311.07911)
- [Reflection pattern 2026](https://stackviv.ai/blog/reflection-ai-agents-self-improvement)
- [AlignmentCheck + 41.77% specification drift](https://www.augmentcode.com/guides/why-multi-agent-llm-systems-fail-and-how-to-fix-them)
- [Claude Code hooks canonical](https://viewyonder.com/articles/claude-code-hooks/)

---

## Decision associee

**D-BODY-01 Module Body 8e Core OS** (YYYY-MM-DD fin P5) — Proprioception Kevin-Claude : constitution + intent + feedback + learning loop. 4 couches livrees organiquement en 5 phases sans regression. Plan `.archive/plans-done-YYMMDD/2026-04-19-body-module-complet.md`.

---

> Prochaine etape : `ExitPlanMode` pour presenter ce plan a Kevin. Si approuve, copie dual-path puis Phase 1 execution en nouvelle session `/wt new body-p1-constitution` ou branche `feat/body-p1-constitution-260419`.
