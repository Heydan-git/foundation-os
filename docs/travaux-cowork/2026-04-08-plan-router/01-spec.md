# Plan-Router — Spec

> Date : 2026-04-08
> Auteur : Cowork session (Kevin + assistant)
> Statut : PROPOSITION (pending validation Kevin)
> Source de verite pour le futur scripts/plan-router.sh + convention frontmatter de phase

---

## 1. Probleme

Foundation OS consomme actuellement les memes credits/tokens sur toute une session Claude Code, peu importe la nature de la tache. Resultats observes (Cycle 3 S1-S6) :

- Phases de **lecture / inventaire / smoke tests** (S1, S2 phase A, S6 phase E) tournent sur Sonnet ou Opus alors qu'Haiku suffirait.
- Phases d'**architecture / decision** (S3 verdict 4 piliers, S4 organicite, S6 cluster F-S5-20) sont parfois traitees sans budget de reflexion explicite, ce qui force des aller-retours.
- Aucun mecanisme ne lie une **phase de plan** a un **profil d'execution** (model + effort + agent). Le routing existant (Cortex) match des **mots-cles dans une demande utilisateur** vers un agent, pas des **etapes de plan** vers un profil d'execution.

Cout indirect : compactages plus precoces, sessions interrompues, phases re-executees.

---

## 2. Objectif

Annoter chaque phase d'un plan Foundation OS avec un **profil d'execution** (model + effort + agent + budget tokens) defini AVANT execution, pour que Claude Code (ou Cowork) selectionne automatiquement le model le moins cher capable de tenir la phase.

Trois principes :

1. **MD first** — la routing table vit dans le frontmatter du plan, source unique versionnee.
2. **Mapping declaratif** — un catalogue de profils nomme (SCAN, CODE, ARCHITECT, AUDIT, DOC) couvre 90 % des cas, le reste est annotable a la main.
3. **Pas d'auto-magie** — Claude Code ne switch pas tout seul ; il propose le profil et Kevin confirme via `/model`. La spec n'est pas un orchestrateur runtime, c'est une convention + un script de lookup.

---

## 3. Catalogue de profils

5 profils standards. Chaque profil = (model, effort, thinking-keyword, agent suggere, usage type).

| Profil | Model | Effort | Thinking | Agent suggere | Usage type |
|--------|-------|--------|----------|---------------|------------|
| SCAN | claude-haiku-4-5 | low | (aucun) | review-agent ou direct | Lecture, listing fichiers, smoke tests `bash -n`, grep, regex, inventaires de presence |
| CODE | claude-sonnet-4-6 | medium | think | dev-agent | Edition de composants TSX/TS, fix bug isole, refactor < 100 lignes, ajout test, scaffold |
| ARCHITECT | claude-opus-4-6 | high | ultrathink | os-architect | Decision A vs B, ADR, schema DB, structure module, trade-offs strategiques, plan multi-phases |
| AUDIT | claude-sonnet-4-6 | high | think hard | review-agent | Cross-check coherence, audit massif d'un livrable, verification non-regression, hunt findings |
| DOC | claude-haiku-4-5 | low | (aucun) | doc-agent | MAJ CONTEXT.md, livrable de session, journalisation decisions, frontmatter, index |

### Notes

- **Effort** : reference [Issue claude-code#31536](https://github.com/anthropics/claude-code/issues/31536) — pas encore frontmatter natif. En attendant : inject le mot-cle thinking dans le prompt de la phase (`think`, `think hard`, `think harder`, `ultrathink`). Verbalement : "Phase B : ultrathink avant toute decision."
- **Model** : valeurs frontmatter Claude Code accept aliases (`haiku`, `sonnet`, `opus`) ou IDs complets (`claude-opus-4-6`). Default si absent : `inherit`.
- **Agent suggere** != agent obligatoire. Si la phase ne match aucun agent (ex. exploration) → execution directe.
- Profils additionnels possibles (hors v1) : `RESEARCH` (web search lourd, sonnet medium), `MIGRATION` (opus high, dev-agent), `BENCH` (sonnet medium).

---

## 4. Convention de frontmatter de phase

Chaque phase d'un plan Foundation OS porte un bloc YAML imbrique dans le titre de phase. Format propose :

```markdown
## Phase A — Lecture des 5 specs Core OS

<!-- routing
profile: SCAN
model: haiku
effort: low
agent: review-agent
estimated_tokens: 4000
rationale: lecture sequentielle de 5 fichiers < 500L total, aucun jugement
-->

- [ ] Step A1 : Lire docs/core/cortex.md
- [ ] Step A2 : Lire docs/core/memory.md
...
```

### Champs

| Champ | Requis | Type | Description |
|-------|--------|------|-------------|
| profile | oui | enum | SCAN \| CODE \| ARCHITECT \| AUDIT \| DOC \| (custom) |
| model | non | string | Override du profil. Sinon herite du catalogue. |
| effort | non | enum | low \| medium \| high. Override du profil. |
| agent | non | string | os-architect \| dev-agent \| doc-agent \| review-agent \| direct |
| estimated_tokens | non | int | Estimation human-readable, pas enforce |
| rationale | non | string | Pourquoi ce profil pour cette phase (1 ligne) |

### Pourquoi un commentaire HTML et pas du YAML pur ?

- Le YAML pur en milieu de fichier MD casse certains parsers (incl. pre-commit MD lint).
- Le commentaire HTML est invisible au render mais grep-able : `grep -A5 "<!-- routing" plan.md`.
- Le script plan-router.sh peut le parser avec sed/awk standard.

---

## 5. Mapping rules — quel profil pour quelle phase

Heuristique de selection (a appliquer par Cowork au moment de generer un plan, ou par Kevin a la main).

| Signal dans le titre/description de la phase | Profil par defaut |
|---------------------------------------------|-------------------|
| "lire", "scanner", "inventorier", "lister", "smoke test", "bash -n", "grep" | SCAN |
| "ecrire", "ajouter composant", "scaffold", "implementer", "fix bug", "refactor" | CODE |
| "decider", "ADR", "architecture", "schema DB", "option A vs B", "trade-off", "structurer module" | ARCHITECT |
| "verifier", "audit", "cross-check", "regression", "coherence", "review", "hunt findings" | AUDIT |
| "documenter", "MAJ CONTEXT.md", "journaliser", "livrable session", "ecrire le rapport" | DOC |

Cas limites :

- Phase **mixte** (ex. "lire + decider") → split en 2 sub-phases A1 SCAN puis A2 ARCHITECT.
- Phase **inconnue** → demander a Kevin OU defaulter sur CODE (sonnet medium = compromis raisonnable).
- Phase **chere mais courte** (ex. 1 decision Opus de 3 minutes) → ARCHITECT OK, le cout est dans la qualite pas le volume.

---

## 6. Architecture de l'integration

Diagramme texte :

```
Cowork (genere un plan)
  |
  | annote chaque phase avec <!-- routing ... -->
  v
docs/plans/YYYY-MM-DD-feature.md  ← source de verite
  |
  | git push / share
  v
Claude Code CLI (execute le plan)
  |
  +--- /session-start
  |     |
  |     +--- step nouveau : `bash scripts/plan-router.sh next`
  |     |     -> lit le plan actif, trouve la 1ere phase non cochee
  |     |     -> affiche : "Phase A — SCAN — haiku — agent: review-agent"
  |     |     -> suggere : `/model haiku-4-5` puis "go phase A"
  |     |
  |     +--- Kevin valide ou override
  |
  +--- execution phase
  |     |
  |     +--- si effort != low : injecter `think` / `think hard` / `ultrathink` dans le prompt
  |     +--- si agent suggere != direct : invoquer Task tool avec ce sub-agent
  |
  +--- /session-end
        |
        +--- step nouveau : `bash scripts/plan-router.sh log <phase>`
              -> append a scripts/.token-budget.log : phase | profil | tokens reels | duree
              -> permet ajustement du catalogue dans le temps (calibration)
```

---

## 7. Sub-agents Foundation OS — model par defaut

En plus du frontmatter de phase, les 4 sub-agents de `.claude/agents/` recoivent un `model:` par defaut, qui peut etre override par la phase.

| Agent | Model par defaut | Justification |
|-------|------------------|---------------|
| os-architect | opus | Decisions structurelles, peu de volume, qualite > vitesse |
| dev-agent | sonnet | Volume code moyen, equilibre cout/qualite |
| doc-agent | haiku | Edition MD repetitive, structure connue, peu de jugement |
| review-agent | sonnet | Audit + cross-check, besoin de tenir un grand contexte |

Ces defaults s'ajoutent au frontmatter existant des 4 agents (cf. `.claude/agents/*.md`). Chaque fichier recoit une ligne `model: <alias>` apres `name:` et `description:`.

---

## 8. Outils a construire (Tools backlog)

| Outil | Type | Role | Priorite |
|-------|------|------|----------|
| scripts/plan-router.sh | bash | Parse un plan MD, extrait les blocs `<!-- routing ... -->`, emet un dispatch table (next phase, profil, suggested commands) | P1 |
| scripts/.token-budget.log | log | Append-only, 1 ligne par phase executee : `YYYY-MM-DD\|plan\|phase\|profil\|model\|tokens\|duree\|verdict` | P1 |
| scripts/plan-calibrate.sh | bash | Lit .token-budget.log + emet un rapport "profil X consomme en moyenne Y tokens, considerer downgrade vers Z" | P3 |
| .claude/commands/plan-route.md | command | `/plan-route` = wrapper interactif autour de plan-router.sh next + `/model` switch | P2 |

Conventions Tools (cf. `docs/core/tools.md`) respectees : kebab-case, `--help`, idempotent, exit codes 0/1/2.

---

## 9. Integration aux commands existantes

### /session-start (modification proposee)

Ajouter un step 4.5 entre "verifier l'etat technique" et "annoncer" :

```
4.5. Plan routing :
   - bash scripts/plan-router.sh next
   - Si une phase est trouvee : afficher profil + model suggere + commande /model
   - Si aucun plan actif : skip
```

### /session-end (modification proposee)

Ajouter un step 6.5 entre "proposer un commit" et "annoncer" :

```
6.5. Plan routing log :
   - Pour chaque phase cochee dans cette session :
     bash scripts/plan-router.sh log <phase> --tokens <approx> --duree <min>
```

### /sync (pas d'impact)

`/sync` continue de verifier la coherence structure / refs / CONTEXT.md. Le frontmatter routing n'est pas un check de sante (au moins en v1).

---

## 10. Garde-fous

Coherence avec `CLAUDE.md` :

- **Pas de fichier a la racine** : OK, tout vit dans `docs/specs/`, `docs/plans/`, `scripts/`, `.claude/`.
- **Pas de duplication** : le catalogue de profils vit UNIQUEMENT dans cette spec. Si plan-router.sh a besoin de la table, il l'embarque en const en tete avec un commentaire `# source: docs/travaux-cowork/2026-04-08-plan-router/01-spec.md`.
- **Cause racine** : ce systeme adresse "consommation tokens uniforme sur taches non-uniformes". Pas un patch symptomatique.
- **Pragmatisme** : la v1 ne touche RIEN au runtime Claude Code (pas de hook, pas de wrapper). C'est une convention + un script de lookup. Si Claude Code ajoute un effortLevel natif (#31536), v2 pourra s'y brancher.
- **Anti-bullshit** : aucune metrique "X% de gain" claimee. Le calibrage se fait via `.token-budget.log` apres N sessions reelles.

Limites assumees :

- Le switch de model dans Claude Code reste **manuel** (commande `/model`). Aucun moyen d'automatiser sans modifier le client.
- L'estimation `estimated_tokens` est human-eyeballed, pas calculee.
- Le profil ne controle PAS la verbosite des reponses (pas de levier propre dans Claude Code v1).

---

## 11. Plan d'implementation (resume)

Phases (annotees avec leur propre profil routing — dogfooding) :

```
Phase 1 SCAN     : valider la spec (lecture Kevin, retours)
Phase 2 ARCHITECT: arbitrer points ouverts (frontmatter HTML vs YAML, defaults agents)
Phase 3 CODE     : ecrire scripts/plan-router.sh (parser + dispatch + log)
Phase 4 CODE     : ajouter `model:` aux 4 agents .claude/agents/*.md
Phase 5 DOC      : ajouter step 4.5 a /session-start et 6.5 a /session-end
Phase 6 AUDIT    : dogfooding sur 1 plan reel (cycle3 S7 ?), measure tokens
Phase 7 DOC      : ADR dans docs/decisions-log.md + MAJ CLAUDE.md section Token-awareness
```

Plan setup detaille : `docs/travaux-cowork/2026-04-08-plan-router/02-setup.md`.

---

## 12. Questions ouvertes (a trancher avec Kevin avant Phase 3)

1. **Frontmatter YAML pur vs commentaire HTML ?** Reco spec : commentaire HTML (compat parsers). Alternative : un bloc ` ```yaml routing ... ``` ` parse-able.
2. **Effort = thinking keyword OU verbosity OU les deux ?** v1 propose thinking only. v2 si Claude Code ajoute verbosity native.
3. **`/model` automatisable via hook ?** Investigation : `.claude/settings.json` accepte-t-il un hook PreSessionStart ? A verifier.
4. **Catalogue extensible par module ?** (ex. profil HEALTH-COUNCIL pour le module Sante futur). v1 = catalogue global, v2 = par-module si besoin.
5. **Calibration apres combien de sessions ?** Reco : 10 sessions reelles avant 1er pass plan-calibrate.sh.
6. **Que faire des plans existants** (cycle3-implementation.md, finition-os.md) ? Reco : annoter retroactivement uniquement les sessions futures (S7+), pas les sessions deja DONE.

---

## 13. References

- `docs/core/cortex.md` section 1 — routing actuel (mots-cles → agent)
- `docs/core/memory.md` section 1 — 4 tiers de memoire (le frontmatter routing vit dans Reference)
- `docs/core/tools.md` section 3 — conventions scripts
- `.claude/agents/os-architect.md`, `dev-agent.md`, `doc-agent.md`, `review-agent.md` — frontmatter actuels
- `.claude/commands/session-start.md`, `session-end.md` — workflows actuels
- Issue Claude Code 31536 — feature request effortLevel par sub-agent (en attente)
- Spec Foundation OS v2 : `docs/specs/2026-04-05-foundation-os-v2-design.md`
