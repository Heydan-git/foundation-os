# 08-commands — Audit Commands (4) deep + tests reels

> **Status** : S8a LECTURE + AUDIT DONE (2026-04-09) / S8b TESTS REELS PENDING
> **Mode** : MOI (8e session consecutive mode strict)
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section "Session S8 — Commands (4) deep + tests reels"
> **Livrable precedent** : docs/audit-massif/07-agents.md (S7, integre via S7.5 le 2026-04-09)

---

## 1. Objectif

Audit deep des 4 commands custom Foundation OS exposes via `.claude/commands/` :
- `.claude/commands/session-start.md`
- `.claude/commands/session-end.md`
- `.claude/commands/new-project.md`
- `.claude/commands/sync.md`

Verifier sur 4 angles (workflow numerote, duplication inter-commands, scripts/agents invoques existent et fonctionnent, output format clair) + tests reels d'invocation + livrable findings/decisions/learnings conforme pattern S1-S7.

## 2. Methodologie

Decoupage anti-compactage en **2 phases** (decision session-start 2026-04-09) :

| Phase | Scope | Commit |
|-------|-------|--------|
| **S8a** | Lecture line-by-line 4 commands + audit 4 angles (statique) + draft findings | `audit(s08a): lecture + audit 4 commands — draft findings` |
| **S8b** | Tests reels invocation (sync-check.sh + module-scaffold.sh --help + comparaison session-start spec vs live) + findings consolides + decisions + learnings + commit final | `audit(s08): commands (4) deep + tests → 08-commands.md` |

Phase S8a = cette section du livrable (sections 1-4 + 6 draft). Phase S8b ajoutera les sections 5 (tests reels), 6 final, 7 (decisions), 8 (learnings), 9+ (out-of-scope, verification, cross-refs, prochaine session).

**Sources consultees (Phase S8a)** :
- 4 fichiers commands scannes line-by-line (223L total)
- `CLAUDE.md` section "## Briefs session (format obligatoire)" (contexte v9)
- `docs/audit-massif/07-agents.md` (cross-ref pour F-S7-09 PAUL jargon)
- `CONTEXT.md` table Modules + Decisions actives (etat de reference)

## 3. Inventaire Phase A

### 3.1 Les 4 commands scannes

| Command | Lignes | Steps workflow | Scripts invoques | Template sortie |
|---------|--------|----------------|------------------|-----------------|
| session-start.md | 30 | 6 numerotes (lire / detect / structure / technique / annoncer / confirmer) | `scripts/health-check.sh` + pattern npm run build | Oui (format court ~8 lignes) |
| session-end.md | 65 | 7 + step 5.5 (lister / coherence / technique / classifier / update CONTEXT.md / [5.5 Monitor] / commit / annoncer) | `scripts/health-check.sh` + pattern npm run build + npm test + `docs/monitor/data.js` | Oui (format court ~10 lignes + sous-bloc Concerns) |
| new-project.md | 49 | 3 (creer structure / update CONTEXT.md / annoncer) | `scripts/module-scaffold.sh` | **Non** (juste "Annoncer ce qui a ete cree") |
| sync.md | 79 | 6 sections (structure / modules / refs / CONTEXT vs fs / App Builder / Core OS) | `scripts/sync-check.sh` + `scripts/health-check.sh` | Oui (format SYNC — date detaille ~20 lignes) |

**Total scanne** : 223 lignes sur 4 commands. Ratio sync (79L) / new-project (49L) = **+61%** (le plus long vs le plus court).

### 3.2 Fichiers de reference lus (cross-check)

- `CLAUDE.md` section "## Briefs session (format obligatoire)" — directive v9 format brief 11 sections obligatoires
- `docs/audit-massif/07-agents.md` — cross-ref F-S7-09 "PAUL opaque" pour comparaison
- `CONTEXT.md` — Decisions actives D-S7-01 (audit lineaire) + D-MON-01..05 (Monitor Dashboard v1) + D-DS-20 (prebuild workspace chain)
- `docs/core/memory.md` — reference citee dans session-end.md step 5 (tier reference)

### 3.3 Observations initiales

- **session-end.md** est le command le plus structure (step 5.5 Monitor dashboard + framework 4 statuts + sous-bloc concerns)
- **new-project.md** est le command le plus minimaliste (delegue tout a module-scaffold.sh + pas de template sortie)
- **sync.md** contient de la documentation MD qui **duplique** le comportement de sync-check.sh (sections 1-6 workflow re-documentees)
- **session-start.md** expose directement la sortie brief mais avec un **format v1 obsolete** par rapport a `CLAUDE.md` v9

## 4. Phase A — Audit 4 angles par command

Chaque command evalue sur : **(A1)** Workflow steps clairs et numerotes, **(A2)** Pas de duplication avec un autre command, **(A3)** Scripts/agents invoques existent et fonctionnent, **(A4)** Output/format clair.

### 4.1 session-start.md (30L)

**A1 Workflow clair** — OK. 6 steps numerotes (1-6), verbes actifs, sequence logique lire → detecter → verifier → annoncer → confirmer.

**A2 Duplication** — **PARTIELLE**.
- Step 3 "verifier structure racine" : duplique le scope de sync-check.sh Section 1 + health-check.sh structure racine check.
- Step 4 "bash scripts/health-check.sh" : invoque directement le meme script que session-end, sync, pre-commit hook.
- **Symetrie attendue** avec session-end.md (pattern start/end qui partagent les verifications) → duplication acceptable.

**A3 Scripts/agents existent** — OK.
- `scripts/health-check.sh` : existe, verifie live cette session (run 843ms OK).
- Pattern `cd modules/[nom] && npm run build` : **obsolete** depuis DS-6 partial (D-DS-20 prebuild workspace chain permet `npm run build -w modules/app` depuis racine). Pas une erreur, juste drift avec la nouvelle convention npm workspaces.

**A4 Output format** — **DIVERGENCE CRITIQUE**.
- Le template L18-28 affiche un format minimal (5 lignes : Modules / Derniere session / Build / Git / Prochaine action + "On y va ?").
- `CLAUDE.md` directive "## Briefs session (format obligatoire)" ajoutee 2026-04-09 IMPOSE le format **v9 = 11 sections obligatoires avec emojis couleur + barres + separateurs 32 chars**.
- Le format affiche dans session-start.md spec = **v1 original**, jamais mis a jour apres les 9 iterations v1 → v9.
- Risque : si une session demarre avec un Claude ayant lu `.claude/commands/session-start.md` sans `CLAUDE.md` (ou `CLAUDE.md` tronque), le brief retournera automatiquement au format v1.

### 4.2 session-end.md (65L)

**A1 Workflow clair** — **CONCERN**. Numerotation 1-7 avec **step 5.5 intercale** entre step 5 (update `CONTEXT.md`) et step 6 (propose commit). Cette numerotation fractionnaire (adoptee 2026-04-09 session D3 Monitor Dashboard) est non-standard mais documentee dans `CONTEXT.md`.

**A2 Duplication** — **FORTE**.
- Step 2 "verifier coherence" re-specifie 4 checks (pas de fichier racine, pas de refs cassees, fichier dans bon dossier, modules vs `CONTEXT.md`) qui sont TOUS deja couverts par `scripts/sync-check.sh` Sections 1-6.
- Fix potentiel : step 2 → `bash scripts/sync-check.sh` (une ligne) au lieu de re-specifier les 4 checks.
- Step 3 duplique session-start.md step 4 (health-check + build par module) — pattern symetrique start/end acceptable.
- Step 5.5 references `docs/monitor/data.js` update manuel (D-MON-03 YAGNI v1) — pas de duplication.

**A3 Scripts/agents existent** — OK.
- `scripts/health-check.sh` : existe.
- `docs/monitor/data.js` + `docs/monitor/index.html` : existent (Monitor D1 DONE 2026-04-08).
- `docs/core/memory.md` cite L26 ("protocole Memory — docs/core/memory.md") : existe.

**A4 Output format** — **DIVERGENCE CRITIQUE** (identique A4 session-start).
- Template L48-58 = format v1 (10 lignes : Statut / Modifie / Build / Tests / Health-check / CONTEXT.md / Prochaine action + sous-bloc Concerns).
- Directive `CLAUDE.md` v9 obligatoire non appliquee dans le spec du command.
- Meme risque de regression au format v1 si `CLAUDE.md` non lu.

**Observation additionnelle** — L15 "Classifier la session selon 4 niveaux (inspire de PAUL framework)" : reference PAUL citee sans definition locale ni link. Mirror exact de F-S7-09 (dev-agent.md L31 PAUL opaque). Pattern **jargon interne reoccurrent** a 2 endroits au moins.

### 4.3 new-project.md (49L)

**A1 Workflow clair** — OK. 3 steps workflow L14-18 + Usage + Execution + Structure creee + Template README + Apres creation. Sections bien ordonnees.

**A2 Duplication** — **POTENTIELLE**.
- Template README.md inline L31-42 : si `scripts/module-scaffold.sh` a sa propre version du template embedded, on a double source avec risque de divergence. **A verifier en S8b** via lecture module-scaffold.sh.
- Sinon, spec MD du template = simple documentation lisible pour Claude, pas une vraie duplication.

**A3 Scripts/agents existent** — **A VERIFIER S8b**.
- `scripts/module-scaffold.sh` : existe sur disque (`ls scripts/` confirme). Mais son `--help` et son comportement reel ne sont pas verifies en S8a. Test reel `bash scripts/module-scaffold.sh --help` = Task S8b.

**A4 Output format** — **ASYMETRIE**.
- new-project.md **n'a pas de template de sortie formel** (juste "3. Annoncer ce qui a ete cree" L18).
- Les 3 autres commands ont tous un template sortie explicite.
- Impact ergonomique : chaque invocation /new-project peut produire un format d'announce different (libre interpretation Claude). Impact reel faible car command peu frequent (creation de nouveau module), mais asymetrie mesurable.

### 4.4 sync.md (79L)

**A1 Workflow clair** — OK. Sections Execution + Workflow (1-6) + Format de sortie + Verdicts. Structure la plus complete des 4 commands.

**A2 Duplication** — **FORTE ET STRUCTURELLE**.
- L10-17 expose explicitement la deduplication : "Section 1 (Structure racine) et la partie App Builder specifique sont couvertes via `scripts/health-check.sh`" et liste section par section ce qui est automatise par `scripts/sync-check.sh`.
- **MAIS** L21-51 re-documente le workflow entier (6 sections MD descriptives) que `scripts/sync-check.sh` implemente en code bash.
- **Double source** : spec MD (documentation) + code bash (source de verite). Si sync-check.sh evolue sans update sync.md, on a divergence silencieuse.
- Pattern observe dans S5 F-S5-20 (CLAUDE.md vs cortex.md) et S6 M-S6-01 (meta coverage gap). **Dette recurrente** spec MD vs code.

**A3 Scripts/agents existent** — OK partiellement.
- `scripts/sync-check.sh` : existe sur disque.
- `scripts/health-check.sh` : existe.
- Tests reels invocation `bash scripts/sync-check.sh` = Task S8b.

**A4 Output format** — OK globalement avec **inconsistance mineure**.
- Template L55-75 utilise `[OK/KO]`, `[OK/WARN]`, `[OK]` : **3 variantes** de tags dans le meme format.
- Le run reel de health-check.sh observe cette session utilise uniquement `[OK]` / `[WARN]` / `[KO]`. Alignement spec vs reality pas parfait.

## 5. Phase B — Tests reels d'invocation

**PENDING S8b**. Scope prevu :
- Comparaison /session-start spec vs session live de cette conversation (brief v9 genere) → mesurer le gap v1/v9
- `bash scripts/sync-check.sh` full run → capturer output + exit code + drift vs spec sync.md
- `bash scripts/module-scaffold.sh --help` → verifier presence option + format + comportement
- Lecture de `scripts/module-scaffold.sh` pour confirmer F-S8-09 (template README duplique ou non)

## 6. Findings consolides (Phase S8a)

### 6.1 Table complete (draft, pre-tests S8b)

| ID | Severite | Categorie | Titre | Blast radius |
|----|----------|-----------|-------|--------------|
| F-S8-01 | **P2** | Divergence spec | session-start.md L18-28 template output = format v1 vs `CLAUDE.md` directive v9 obligatoire | Toute session-start sans `CLAUDE.md` a jour regenere un brief v1 |
| F-S8-02 | **P2** | Divergence spec | session-end.md L48-58 template output = format v1 vs `CLAUDE.md` directive v9 obligatoire | Toute session-end sans `CLAUDE.md` a jour regenere un brief v1 |
| F-S8-03 | **P2** | Double source | sync.md L21-51 re-documente en MD le workflow que `scripts/sync-check.sh` implemente en bash (spec drift silencieux) | Pattern F-S5-20 + M-S6-01 recurrent 3e fois |
| F-S8-04 | P3 | Spec drift | session-start.md step 4 "cd modules/[nom] && npm run build" obsolete depuis D-DS-20 workspace chain (`npm run build -w modules/app` valable) | Cosmetique, pattern alternatif fonctionne |
| F-S8-05 | P3 | Numerotation | session-end.md step 5.5 integer fractionnaire (anti-pattern renumerotation in-place) | Cosmetique, documente D-MON-03 D3 2026-04-09 |
| F-S8-06 | P3 | Duplication | session-end.md step 2 re-specifie 4 checks que `scripts/sync-check.sh` execute deja (refactor potentiel : step 2 → `bash scripts/sync-check.sh`) | Refactor propose, impact nul actuel |
| F-S8-07 | P3 | Jargon | session-end.md L15 "PAUL framework" cite sans definition locale (mirror F-S7-09 dev-agent.md) | Dette lisibilite future |
| F-S8-08 | P3 | Asymetrie | new-project.md sans template de sortie vs 3 autres commands (ergonomie variable) | Impact faible (command peu frequent) |
| F-S8-09 | P3 | Duplication potentielle | new-project.md L31-42 template README duplique avec `scripts/module-scaffold.sh` (a verifier S8b) | Dependant test S8b |
| F-S8-10 | P3 | Inconsistance | sync.md L55-75 format sortie utilise 3 variantes de tags [OK/KO] + [OK/WARN] + [OK] | Esthetique, pas bloquant |
| F-S8-11 | P3 | Meta | 3/4 commands ont une divergence spec MD vs realite (code/directive) : F-S8-01 + F-S8-02 + F-S8-03 | Pattern systemique confirme |
| F-S8-12 | P3 | Asymetrie | /sync le plus structure (79L) vs /new-project le moins (49L) : ratio +61% | Pattern inverse F-S7-07 agents |

**Total provisoire S8a : 12 findings. Severite : 0 P1 + 3 P2 + 9 P3 + 1 meta (F-S8-11).**

S8b ajoutera potentiellement des findings runtime (scripts casses, sorties reelles divergentes du spec, cas d'erreur non geres).

### 6.2 Pourquoi 3 P2 en S8a (vs 0 P2 en S7) ?

Les 3 P2 F-S8-01..03 sont tous des **divergences entre deux specs officielles** qui peuvent regresser silencieusement :

- **F-S8-01** et **F-S8-02** : deux sources officielles contradictoires (commands .md spec vs `CLAUDE.md` directive v9). Un Claude qui lit l'un sans l'autre applique le mauvais format. **Risque de regression** au format v1 (perte des 11 sections obligatoires, emojis, barres, pedagogique).

- **F-S8-03** : sync.md documente en MD un workflow que `scripts/sync-check.sh` execute reellement en bash. Si le script evolue sans update du MD (ce qui est l'ordre naturel : on code d'abord, on documente ensuite), la spec MD devient menteuse. Pattern deja vu en S5 (F-S5-20 CLAUDE.md vs cortex.md sur routing) et S6 (M-S6-01 hooks decoratifs meta coverage gap). **3e occurrence** du pattern "double source spec vs code".

Contraste avec S7 (0 P2 = tous P3) : les 4 agents sont **dormants** depuis 7 sessions, donc aucune regression possible. Les 4 commands au contraire sont **invoques a chaque session** (/session-start et /session-end systematiquement) et leur drift a un impact immediat sur chaque conversation.

### 6.3 Cross-references S1-S7 (patterns recurrents)

- **F-S8-03** = 3e occurrence du pattern "double source spec vs code" (apres F-S5-20 + M-S6-01). Escalade meta-finding potentiel M-S8-01 si S8b confirme le pattern.
- **F-S8-07** "PAUL framework" = mirror exact de **F-S7-09** (dev-agent.md L31 PAUL opaque). Meme jargon non-ancre a 2 endroits minimum. Candidat pour decision batch cleanup S21.
- **F-S8-12** asymetrie ergonomique = mirror de **F-S7-07** (review-agent le plus structure, dev-agent le moins). Pattern systemique : la qualite de la doc ne correspond pas a la frequence d'usage.
- **F-S8-04** "npm workspaces drift" : spec command non updated apres **D-DS-20** (prebuild workspace chain, decision 2026-04-09). Decision a jour, spec a la traine. Candidat S21 avec F-S7-04 cleanup jargon/refs.

## 7. Decisions (draft S8a, finalise S8b)

| ID | Date | Action | Quand |
|----|------|--------|-------|
| D-S8-01 | 2026-04-09 | **A valider Kevin** : fix F-S8-01 + F-S8-02 divergence briefs v1/v9 → update session-start.md + session-end.md avec pointeur vers `CLAUDE.md` directive "## Briefs session (format obligatoire)" (seule source), OU retirer les templates output des .md commands (single source = `CLAUDE.md`) | Decision Kevin : maintenant S8a+fix / S21 housekeeping / S20 batch |
| D-S8-02 | 2026-04-09 | **A valider Kevin** : fix F-S8-03 sync.md double source → choisir : (a) sync.md = pointeur minimal vers `scripts/sync-check.sh`, (b) script = executeur du MD spec | Decision Kevin S21 |
| D-S8-03 | 2026-04-09 | Merge F-S8-07 "PAUL jargon" avec F-S7-09 (meme dette) → single batch cleanup S21 | S21 housekeeping |
| D-S8-04 | 2026-04-09 | F-S8-04 npm workspaces drift → update session-start.md step 4 "cd modules/[nom] && npm run build" → "npm run build -w modules/[nom]" OU conserver les deux patterns comme alternatives valides | S21 cleanup (couple avec D-S7-04 batch jargon/refs) |
| D-S8-05 | 2026-04-09 | F-S8-05 step 5.5 accepted : documentation D-MON-03 + D3 Monitor deja integree, anti-pattern cosmetique acceptable | No action |
| D-S8-06 | 2026-04-09 | F-S8-08 new-project sans template sortie → ajouter un template minimal symetrique (3-5 lignes : Module cree / Path / Stack decidee / Next) | S21 housekeeping |
| D-S8-07 | 2026-04-09 | **PENDING S8b** : F-S8-09 template README duplique → a confirmer apres lecture `scripts/module-scaffold.sh` | S8b Task |

**Total draft S8a : 7 decisions D-S8-01..07. Finalise S8b.**

## 8. Learnings metaboliques (draft)

**L-S8-01 — Asymetrie dormant (agents) vs chaud (commands) : severite findings inversee**
S7 a trouve 0 P2 sur 4 agents dormants (dette hypothetique). S8a trouve deja 3 P2 sur 4 commands actifs (dette effective). **Regle** : la severite d'un finding depend de la frequence d'invocation du composant audite, pas de son etat intrinseque. Un agent dormant peut avoir des bugs graves sans impact mesurable ; un command actif peut avoir des bugs cosmetiques avec impact systemique.

**L-S8-02 — Pattern "spec MD vs code source" 3e occurrence (meta-finding implicite)**
F-S5-20 (CLAUDE.md vs cortex.md routing) + M-S6-01 (hooks decoratifs meta coverage) + F-S8-03 (sync.md vs sync-check.sh) = **3 occurrences confirmees** du pattern "double source spec textuelle vs code executable". **Regle emergente** : toute doc MD qui decrit un workflow execute par un script doit etre soit un pointeur minimal (< 10L vers le script), soit un generate-from-code. Pas de duplication manuelle qui drift.

**L-S8-03 — Template v1 embedde dans command spec survit a la reforme v9**
`CLAUDE.md` a ete refactore 2026-04-09 avec la directive v9 briefs obligatoire (9 iterations). Mais session-start.md + session-end.md spec embedded garde le template v1 original. Le refactor a touche la regle superieure (`CLAUDE.md`) sans propager aux specs inferieures (`.claude/commands/`). **Regle** : tout refactor d'une regle globale doit inclure une phase de propagation vers les specs derivees, sinon les specs inferieures survivent comme source fantome.

**Total draft S8a : 3 learnings L-S8-01..03. Potentiel +2-3 apres S8b tests reels.**

## 9. Out-of-scope S8a

- Lecture + audit de `scripts/sync-check.sh` code source (= Task S9.2 lecture line-by-line scripts + hooks)
- Lecture + audit de `scripts/module-scaffold.sh` code source (= Task S9.2)
- Tests reels d'invocation sync-check + module-scaffold --help (= Task S8.4, deplace en S8b)
- Couverture des 7 scripts en `scripts/` + `scripts/git-hooks/` + `scripts/hooks/` (= Session S9 complete)
- Revue des skills /oh-my-claudecode:* et /superpowers:* (= Session S10)

## 10. Verification post-S8a

- [x] 4 commands lus line-by-line (session-start 30L / session-end 65L / new-project 49L / sync 79L)
- [x] Audit 4 angles applique a chaque command (A1 workflow / A2 duplication / A3 scripts / A4 output)
- [x] Findings draft consolides (12 total : 0 P1 + 3 P2 + 9 P3)
- [x] Decisions draft D-S8-01..07 (7 total, 2 require Kevin input)
- [x] Learnings draft L-S8-01..03 (3 total)
- [x] Cross-references S1-S7 etablies (F-S8-03 vs F-S5-20+M-S6-01, F-S8-07 vs F-S7-09, F-S8-12 vs F-S7-07, F-S8-04 vs D-DS-20)
- [ ] Tests reels d'invocation (S8b)
- [ ] Findings finalises post-tests (S8b)
- [ ] Learnings post-tests (S8b)
- [ ] Commit final S8 `audit(s08): commands (4) deep + tests` (S8b)

## 11. Cross-references autres sessions

- **S5 F-S5-20** (CLAUDE.md vs cortex.md routing) : 1ere occurrence pattern double source
- **S6 M-S6-01** (hooks decoratifs meta coverage) : 2eme occurrence pattern double source
- **S7 F-S7-07** (asymetrie investissement agents) : mirror de F-S8-12 asymetrie commands
- **S7 F-S7-09** (dev-agent PAUL opaque) : mirror exact de F-S8-07 session-end PAUL jargon
- **S7 D-S7-04** (batch cleanup jargon/refs) : peut absorber F-S8-07 + F-S8-04 dans meme batch S21
- **S7 L-S7-06** (11e occurrence L-S5-05 backtickification) : **applique en ecrivant ce livrable** — tous les paths verifies en backticks, paths hypothetiques ou jargons en plain text

## 12. Prochaine session

**S8b — Tests reels d'invocation + livrable final** :
1. Comparer /session-start spec vs brief live de la session actuelle (mesurer le gap v1/v9, confirmer ou infirmer F-S8-01)
2. `bash scripts/sync-check.sh` full run → capturer output + exit code + comparer au spec sync.md L55-75
3. `bash scripts/module-scaffold.sh --help` → verifier existence option + format + comportement
4. Lecture `scripts/module-scaffold.sh` pour confirmer F-S8-09 (template README duplique ou non)
5. Finaliser sections 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12
6. Commit final `audit(s08): commands (4) deep + tests → 08-commands.md`

**Decision Kevin a prendre avant S8b** (les 3 P2 F-S8-01..03 ne bloquent pas l'audit mais leur fix est docs-only) :
- **Option A** : fix maintenant les 3 P2 divergences specs (F-S8-01/02/03) AVANT S8b tests reels → commit dedie `docs(commands): fix spec drift format briefs v9 + sync double source` → puis S8b
- **Option B** : continuer S8b tests reels → finaliser 08-commands.md → les 3 P2 vont dans batch S21 housekeeping (convention Cycle 3 D-S7-01)
- **Option C** : continuer S8b tests reels → quand S8 complet → fix les 3 P2 juste apres comme mini-batch dedie (fix inter-sessions autorise)

---

*S8a redige 2026-04-09 sur branche audit-massif-cycle3. Placeholder 08-commands.md (6L) remplace par ce livrable. Commit en cours.*
