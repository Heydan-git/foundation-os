# 08-commands — Audit Commands (4) deep + tests reels

> **Status** : S8 DONE (2026-04-09) — Phase A lecture + audit statique + Phase B tests reels invocation
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
| **S8a** | Lecture line-by-line 4 commands + audit 4 angles (statique) + draft findings | `docs(audit): s08a lecture + audit 4 commands -- draft findings` (80c18cb) |
| **S8b** | Tests reels invocation (sync-check.sh full run + module-scaffold.sh --help + lecture module-scaffold.sh source + comparaison /session-start spec vs live v9) + findings consolides + decisions + learnings + commit final | `docs(audit): s08 commands (4) deep + tests reels` (ce commit) |

**Sources consultees** :
- 4 fichiers commands scannes line-by-line (223L total)
- `CLAUDE.md` section "## Briefs session (format obligatoire)" (contexte v9)
- `docs/audit-massif/07-agents.md` (cross-ref pour F-S7-09 PAUL jargon)
- `CONTEXT.md` table Modules + Decisions actives (etat de reference)
- **S8b** : `scripts/module-scaffold.sh` code source (168L) + outputs reels `bash scripts/sync-check.sh` + `bash scripts/module-scaffold.sh --help`

## 3. Inventaire Phase A

### 3.1 Les 4 commands scannes

| Command | Lignes | Steps workflow | Scripts invoques | Template sortie |
|---------|--------|----------------|------------------|-----------------|
| session-start.md | 30 | 6 numerotes (lire / detect / structure / technique / annoncer / confirmer) | `scripts/health-check.sh` + pattern npm run build | Oui (format court ~8 lignes, **format v1**) |
| session-end.md | 65 | 7 + step 5.5 (lister / coherence / technique / classifier / update CONTEXT.md / [5.5 Monitor] / commit / annoncer) | `scripts/health-check.sh` + pattern npm run build + npm test + `docs/monitor/data.js` | Oui (format court ~10 lignes + sous-bloc Concerns, **format v1**) |
| new-project.md | 49 | 3 (creer structure / update CONTEXT.md / annoncer) | `scripts/module-scaffold.sh` | **Non** (juste "Annoncer ce qui a ete cree") |
| sync.md | 79 | 6 sections (structure / modules / refs / CONTEXT vs fs / App Builder / Core OS) | `scripts/sync-check.sh` + `scripts/health-check.sh` | Oui (format SYNC — date, **incomplet vs reality**) |

**Total scanne** : 223 lignes sur 4 commands. Ratio sync (79L) / new-project (49L) = **+61%** (le plus long vs le plus court).

### 3.2 Fichiers de reference lus (cross-check)

- `CLAUDE.md` section "## Briefs session (format obligatoire)" — directive v9 format brief 11 sections obligatoires
- `docs/audit-massif/07-agents.md` — cross-ref F-S7-09 "PAUL opaque" pour comparaison
- `CONTEXT.md` — Decisions actives D-S7-01 (audit lineaire) + D-MON-01..05 (Monitor Dashboard v1) + D-DS-20 (prebuild workspace chain)
- `docs/core/memory.md` — reference citee dans session-end.md step 5 (tier reference)
- `scripts/module-scaffold.sh` (168L, lu en S8b) — source de verite du scaffold module + template README embed

### 3.3 Observations initiales

- **session-end.md** est le command le plus structure (step 5.5 Monitor dashboard + framework 4 statuts + sous-bloc concerns)
- **new-project.md** est le command le plus minimaliste (delegue tout a module-scaffold.sh + pas de template sortie)
- **sync.md** contient de la documentation MD qui **duplique** le comportement de sync-check.sh (sections 1-6 workflow re-documentees) — S8b confirme + amplifie
- **session-start.md** expose directement la sortie brief mais avec un **format v1 obsolete** par rapport a `CLAUDE.md` v9 — S8b confirme via comparaison spec vs live

## 4. Phase A — Audit 4 angles par command (statique)

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

**A4 Output format** — **DIVERGENCE CRITIQUE** (confirmee S8b).
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

**A2 Duplication** — **CONFIRMEE S8b avec divergence de contenu**.
- Template README.md inline L31-42 est effectivement dupplique avec `scripts/module-scaffold.sh` L82-94 (vrai embed dans le script bash).
- **Divergences textuelles mesurees** :
  - Spec MD : `## Objectif` → `[A definir]`. Script : `A definir.` (point final, pas de crochets).
  - Spec MD : `## Stack` → `[A definir]`. Script : `A decider avec Kevin avant de coder.` (phrase complete au lieu d'un placeholder).
  - Spec MD : `## Etat` → `En cours de definition.`. Script : idem.
- **Le script est plus detaille que le spec MD** (inversion attendue : normalement le MD est la reference, mais ici le code est plus riche).

**A3 Scripts/agents existent** — OK (S8b).
- `scripts/module-scaffold.sh` : existe, 168L, execute `bash scripts/module-scaffold.sh --help` retourne le help proprement (exit 0), structure argumentee (kebab-case validation regex, idempotent via check dossier existe, rollback si update CONTEXT.md echoue, --help et sans-arg distingues).

**A4 Output format** — **ASYMETRIE**.
- new-project.md **n'a pas de template de sortie formel** (juste "3. Annoncer ce qui a ete cree" L18).
- Les 3 autres commands ont tous un template sortie explicite.
- Cela dit, `scripts/module-scaffold.sh` L72-95 a sa propre sortie structuree (`SCAFFOLD — modules/$NAME ($TODAY)` + bullets OK/KO par etape + message final vert). Le script compense l'absence de spec MD.
- Impact ergonomique : l'announce post-scaffold peut varier entre "ce que Claude reformule" et "ce que le script affiche". Asymetrie entre command spec et script reality.

### 4.4 sync.md (79L)

**A1 Workflow clair** — OK. Sections Execution + Workflow (1-6) + Format de sortie + Verdicts. Structure la plus complete des 4 commands.

**A2 Duplication** — **FORTE ET STRUCTURELLE, AMPLIFIEE S8b**.
- L10-17 expose explicitement la deduplication : "Section 1 (Structure racine) et la partie App Builder specifique sont couvertes via `scripts/health-check.sh`".
- **MAIS** L21-51 re-documente le workflow entier (6 sections MD descriptives) que `scripts/sync-check.sh` implemente en code bash.
- **Double source** : spec MD (documentation) + code bash (source de verite). Divergence confirmee ET aggravee par S8b tests reels : la spec MD est **factuellement incomplete**, pas juste redondante (voir S8b F-S8-14).
- Pattern observe dans S5 F-S5-20 (CLAUDE.md vs cortex.md) et S6 M-S6-01 (meta coverage gap). **Dette recurrente** spec MD vs code.

**A3 Scripts/agents existent** — OK, confirme S8b.
- `scripts/sync-check.sh` : existe, `bash scripts/sync-check.sh` retourne exit 2 (DEGRADED, conforme spec L19 "Exit codes : 0 = SAIN, 1 = BROKEN, 2 = DEGRADED").
- `scripts/health-check.sh` : existe, invoque en interne par sync-check.sh (output `HEALTH — date` visible dans sync output).

**A4 Output format** — **DIVERGENCE REELLE CONFIRMEE S8b**.
- Le template L55-75 du spec utilise des placeholders `[OK/KO]`, `[OK/WARN]`, `[OK]` : 3 variantes de tags.
- **Reality (S8b run)** : le script affiche `SYNC — 2026-04-09` (header vide) puis invoque health-check.sh qui affiche son propre `HEALTH — 2026-04-09` + section `[EXTENDED]` avec 6 checks supplementaires **totalement absents du spec sync.md**.
- Voir F-S8-14 (nouvelle S8b) pour l'analyse detaillee des divergences.

## 5. Phase B — Tests reels d'invocation (S8b)

### 5.1 Test 1 : `/session-start` spec vs brief v9 live de cette session

**Protocole** : comparer le template `session-start.md` L18-28 (spec) avec le brief genere en debut de cette conversation (live v9 en reponse a `start session`).

**Spec** (5 lignes hors code-fence) :
```
Foundation OS — Session [date]

Modules : [status]
Derniere session : [date + resume]
Build : [OK/KO par module]
Git : [propre / X fichiers non commites]
Prochaine action : [exactement quoi faire]

On y va ?
```

**Live v9 observe** : ~120 lignes structurees avec **11 sections obligatoires** (Etat global 3 barres + Mission/Focus/Derniere session + Modules/Acces rapides/Git + Alertes/Rappels/Questions + Dernier commit + Termine + En cours + En pause + Reflexions/Parking + Decisions cles/Echeance + Prochaine action/Ton input) + emojis couleur (🟢🟡🔴🔵⚪⚫🔮) + barres `████░░░░` (13 total) + separateurs `────────` 32 chars + lignes courtes.

**Gap mesure** :
- Ratio lignes : 120 / 5 = **24x plus de contenu** dans v9 vs v1 spec
- Sections : 11 obligatoires v9 vs 5 lignes plates v1 = 11/5 = **+120% de structure**
- Elements visuels : emojis + barres + separateurs presents en v9, totalement absents v1
- Elements pedagogiques : gloses jargon, mise en garde `> ⚠` si regression, absents v1

**Pourquoi le live etait v9 malgre le spec v1** : parce que `CLAUDE.md` section "## Briefs session (format obligatoire)" (ajoutee 2026-04-09) et la memoire `feedback_brief_format.md` (template v9 complet) ont **compense** le spec obsolete du command. Si `CLAUDE.md` ou la memoire etaient absents (session fresh sans claude-code native memory), le format par defaut serait v1.

**Verdict S8b** : **F-S8-01 confirme empiriquement**. La divergence est reelle, masquee par des garde-fous externes (CLAUDE.md + memoire).

### 5.2 Test 2 : `bash scripts/sync-check.sh` full run

**Exit code** : 2 (DEGRADED). Conforme au spec sync.md L19.

**Output reel capture** :
```
SYNC — 2026-04-09

HEALTH — 2026-04-09

[CRITICAL]
  [OK] Build modules/app (725ms)
  [OK] Structure racine (0 orphelin)
  [OK] TypeScript compile (0 erreur)

[WARNING]
  [OK] TSX sizes (max 544L)
  [OK] Void Glass (0 violation)
  [OK] MD pairs (7/7 in archive)
  [WARN] Refs cassees (75 refs cassees)
  [OK] Vitest — Tests  19 passed (19)

[INFO]
  [OK] Bundle: JS DesignkB / CSS DesignkB
  [OK] Decisions datees: 13

Verdict : DEGRADED (0 critical, 1 warning)

[EXTENDED]
  [OK] Modules actifs refs dans CONTEXT.md (2/2)
  [OK] Refs last commit (0 suppressions utiles scannees, 0 cassee)
  [OK] Core OS coherence (4 agents + 4 commands)
  [OK] Specs Core OS (5/5 presentes)
  [OK] Routes CONTEXT.md <-> App.tsx (8 match)
  [OK] Fonts Void Glass (Figtree primaire, 0 violation)

Verdict : DEGRADED (0 critical, 1 warning)
```

**Divergences spec sync.md vs reality** :

| Element | Spec sync.md L55-75 | Reality observee | Verdict |
|---------|---------------------|------------------|---------|
| Header | `SYNC — [date]` seul | `SYNC — date` + blank + `HEALTH — date` (embed complet health-check) | **Divergence structurelle** |
| TypeScript compile | Absent | `[OK] TypeScript compile (0 erreur)` dans [CRITICAL] | **Manquant spec** |
| Vitest tests | Absent | `[OK] Vitest — Tests 19 passed (19)` dans [WARNING] | **Manquant spec** |
| Section [EXTENDED] | Absent | 6 checks (Modules CONTEXT refs + Refs last commit + Core OS coherence + Specs Core OS 5/5 + Routes 8 match + Fonts Void Glass) | **Manquant spec entier** |
| Verdict count | 1 affichage en fin | **2 affichages** : apres health-check ET apres [EXTENDED] | **Duplication UX** |
| `Bundle NKB JS, NKB CSS` | Attendu avec chiffres | `Bundle: JS DesignkB / CSS DesignkB` (bug F-MON-01 connu : parse "Design" au lieu du nombre) | **Cosmetique F-MON-01** |
| `Decisions datees (N/N)` | Format fraction | `Decisions datees: 13` (nombre simple) | **Format leger off** |

**Verdict S8b** : **F-S8-03 confirme ET amplifie**. Le spec sync.md n'est pas juste redondant, il est **factuellement incomplet** : TypeScript + Vitest + section Extended entiere absents. De plus, l'UX affiche 2x le verdict final (anti-pattern).

### 5.3 Test 3 : `bash scripts/module-scaffold.sh --help`

**Exit code** : 0 (OK).

**Output reel** : Help affiche proprement avec Usage + Exemples + Cree (arborescence) + Effets de bord (update CONTEXT.md) + Refuse si + Exit codes. **22 lignes de help bien structurees**.

**Comparaison spec vs script** : `.claude/commands/new-project.md` L14-18 decrit 3 steps workflow (creer / update / annoncer) + L31-42 template README. Le script `scripts/module-scaffold.sh` L82-94 embed un template README **plus detaille** que le spec, avec divergences textuelles mineures (mesurees en 4.3 A2 ci-dessus).

**Verdict S8b** : **F-S8-09 confirme**. Template README reellement dupplique avec contenu divergent. Script = plus detaille, spec MD = placeholder incomplet.

### 5.4 Test 4 : `scripts/module-scaffold.sh` lecture source

**Structure** : 168L bash + Python embed.
- L1-7 shebang + usage header
- L8-15 set flags + colors
- L17-50 bloc --help (exit 0 si flag, exit 1 si no-arg)
- L52-58 validation nom kebab-case (regex `^[a-z][a-z0-9-]*$`)
- L60-66 idempotence check (refuse si modules/nom existe)
- L68-75 capitalisation + today + announce
- L76-95 creation arborescence + README.md (heredoc bash)
- L97-106 package.json skeleton (heredoc bash)
- L108-156 **Python heredoc embed** (46L Python) pour update CONTEXT.md via regex (capture section Modules + update ou append ligne)
- L158-163 rollback si Python echoue (rm -rf TARGET)
- L165-168 announce final

**Observation** : le script mele 3 langages (bash + Python + heredoc markdown pour README et package.json). **Pattern polyglot embedded** fragile a maintenir (S9 scope).

**Verdict S8b** : nouveau finding **F-S8-15** (scope S9 pour approfondissement).

## 6. Findings consolides (final S8b)

### 6.1 Table complete

| ID | Severite | Categorie | Titre | Blast radius |
|----|----------|-----------|-------|--------------|
| F-S8-01 | **P2** | Divergence spec | session-start.md L18-28 template output = format v1 vs `CLAUDE.md` directive v9 obligatoire (confirme S8b : gap 24x en lignes, 11 sections obligatoires absentes du spec) | Toute session-start sans `CLAUDE.md` a jour regenere un brief v1 |
| F-S8-02 | **P2** | Divergence spec | session-end.md L48-58 template output = format v1 vs `CLAUDE.md` directive v9 obligatoire | Toute session-end sans `CLAUDE.md` a jour regenere un brief v1 |
| F-S8-03 | **P2** | Double source amplifiee | sync.md L21-51 re-documente en MD le workflow que `scripts/sync-check.sh` implemente en bash. **S8b amplifie** : spec MD factuellement incomplet (TypeScript + Vitest + section Extended entiere absents) | Pattern F-S5-20 + M-S6-01 recurrent 3e fois, ici le plus grave des 3 P2 |
| F-S8-04 | P3 | Spec drift | session-start.md step 4 "cd modules/[nom] && npm run build" obsolete depuis D-DS-20 workspace chain | Cosmetique, pattern alternatif fonctionne |
| F-S8-05 | P3 | Numerotation | session-end.md step 5.5 integer fractionnaire (anti-pattern renumerotation in-place) | Cosmetique, documente D-MON-03 |
| F-S8-06 | P3 | Duplication | session-end.md step 2 re-specifie 4 checks que `scripts/sync-check.sh` execute deja | Refactor propose, impact nul actuel |
| F-S8-07 | P3 | Jargon | session-end.md L15 "PAUL framework" cite sans definition locale (mirror F-S7-09 dev-agent.md) | Dette lisibilite future |
| F-S8-08 | P3 | Asymetrie | new-project.md sans template de sortie vs 3 autres commands | Impact faible |
| F-S8-09 | P3 | Duplication confirmee | new-project.md L31-42 template README dupplique avec `scripts/module-scaffold.sh` L82-94 **avec divergences de contenu** (script plus detaille que spec MD) | Inversion source : code plus riche que doc |
| F-S8-10 | P3 | Inconsistance | sync.md L55-75 format sortie utilise 3 variantes de tags [OK/KO] + [OK/WARN] + [OK] | Esthetique |
| F-S8-11 | P3 | Meta | 3/4 commands ont une divergence spec MD vs realite (F-S8-01 + F-S8-02 + F-S8-03) | Pattern systemique |
| F-S8-12 | P3 | Asymetrie | /sync le plus structure (79L) vs /new-project le moins (49L) : ratio +61% | Mirror F-S7-07 |
| **F-S8-13** | P3 | UX | `scripts/sync-check.sh` affiche **2x** "Verdict : DEGRADED" (apres health-check embed + apres [EXTENDED]) | Anti-pattern UX, confusant lecteur |
| **F-S8-14** | **P2** | Spec incomplete | sync.md L55-75 format sortie **factuellement incomplet** : manque TypeScript compile + Vitest + section `[EXTENDED]` entiere (Modules CONTEXT refs + Core OS coherence + Specs Core OS + Routes + Fonts). Amplification de F-S8-03. | Lecteur qui se fie au spec sync.md a un mental model faux de ce que fait /sync |
| **F-S8-15** | P3 | Polyglot fragile | `scripts/module-scaffold.sh` L108-156 embed **46L de Python** dans bash pour update CONTEXT.md via regex. Pattern polyglot multi-langage dans un seul fichier | Scope S9 (Scripts + hooks deep). Maintenance complexe, regex fragile si structure CONTEXT.md table Modules change |

**Total final S8 : 15 findings. Severite : 0 P1 + 4 P2 + 11 P3 + 1 meta (F-S8-11).**

**Escalade en cours S8b** : F-S8-14 est un nouveau P2 decouvert en tests reels (amplification de F-S8-03 sur sync.md spec incomplet). Total P2 passe de 3 (S8a) a 4 (S8b).

### 6.2 Pourquoi 4 P2 en S8 (vs 0 P2 en S7) ?

S7 a trouve 0 P2 sur 4 agents **dormants** depuis 7 sessions (dette hypothetique, aucun incident reel). S8 trouve 4 P2 sur 4 commands **actifs** invoques a chaque session.

Les 4 P2 sont tous des **divergences entre specs officielles et realite** :

- **F-S8-01 + F-S8-02** : specs commands .md contradictoires avec `CLAUDE.md` directive v9. Un Claude qui lit l'un sans l'autre applique le mauvais format. Risque regression silencieuse au format v1.

- **F-S8-03** (S8a) : sync.md documente en MD un workflow execute par sync-check.sh en bash. Pattern **double source** deja vu en S5 (F-S5-20) et S6 (M-S6-01). **3e occurrence** du pattern.

- **F-S8-14** (S8b, amplification de F-S8-03) : le spec sync.md n'est pas juste redondant mais **factuellement faux/incomplet**. Manque TypeScript + Vitest + section Extended entiere. **Escalade** du pattern double source vers "spec trompeuse".

**Le mode MOI strict 8e consecutive a joue un role protecteur** : Claude utilise `CLAUDE.md` + auto-memory pour compenser les specs inferieures obsoletes. Si on invoquait les commands via d'autres Claude sessions (fresh, sans memoire), les 4 P2 deviendraient des bugs reels immediatement.

### 6.3 Cross-references S1-S8 (patterns recurrents)

- **F-S8-03 + F-S8-14** = 3e occurrence du pattern "double source spec vs code" (apres F-S5-20 + M-S6-01), avec **amplification S8b** : pattern passe de "redondance" a "spec trompeuse". Candidat pour **M-S8-01 meta-finding** formalise.
- **F-S8-07** "PAUL framework" = mirror exact de **F-S7-09** (dev-agent.md L31 PAUL opaque). Meme jargon non-ancre a 2 endroits. Candidat batch cleanup S21.
- **F-S8-12** asymetrie ergonomique = mirror de **F-S7-07** (review-agent le plus structure, dev-agent le moins). Pattern systemique recurrent.
- **F-S8-04** "npm workspaces drift" : spec command non updated apres **D-DS-20** (prebuild workspace chain, decision 2026-04-09). Decision a jour, spec a la traine. Candidat S21 avec F-S7-04 cleanup jargon/refs.
- **F-S8-15** polyglot bash+Python = hors scope S8 strict mais pointeur S9 pour audit scripts/ + hooks/.

### 6.4 Meta-finding M-S8-01 (formalisation)

**M-S8-01 — Pattern "spec MD vs code source" 3e occurrence documentee (escalade pour fix durable)**

Occurrences confirmees :
1. **F-S5-20** : CLAUDE.md routing vs cortex.md table signaux (divergence de wording + 4 entrees)
2. **M-S6-01** : hooks decoratifs meta coverage (les hooks affichent leur etat mais ne sont pas executes en conditions reelles)
3. **F-S8-03 + F-S8-14** : sync.md MD workflow vs scripts/sync-check.sh bash implementation, amplifiee en "spec trompeuse factuellement incomplete"

**Regle emergente** : toute doc MD qui decrit un workflow execute par un script doit etre :
- soit un **pointeur minimal** (< 10L pointant vers le script)
- soit un **generate-from-code** (script produit sa propre doc)
- JAMAIS une re-description manuelle qui drift silencieusement

**Decision implicite** : batch fix M-S8-01 = refactor les 3 commands concernes (sync.md + potentiellement session-start/end.md) pour suivre la regle. Escalade S21 ou S20 selon priorite.

## 7. Decisions (final S8b)

| ID | Date | Action | Quand |
|----|------|--------|-------|
| D-S8-01 | 2026-04-09 | **Fix F-S8-01 + F-S8-02** divergence briefs v1/v9 → update `.claude/commands/session-start.md` + `.claude/commands/session-end.md` avec pointeur vers `CLAUDE.md` directive "## Briefs session (format obligatoire)" (single source = CLAUDE.md + memoire) | **S21 housekeeping** (convention D-S7-01 audit lineaire) |
| D-S8-02 | 2026-04-09 | **Fix F-S8-03 + F-S8-14** sync.md double source → transformer sync.md en pointeur minimal vers `scripts/sync-check.sh` + retirer la re-description MD L21-75 (single source = code) | **S21 housekeeping** |
| D-S8-03 | 2026-04-09 | Merge F-S8-07 "PAUL jargon" avec F-S7-09 (meme dette) → single batch cleanup | **S21 housekeeping** |
| D-S8-04 | 2026-04-09 | F-S8-04 npm workspaces drift → update `.claude/commands/session-start.md` step 4 "cd modules/[nom] && npm run build" → documenter les deux patterns (`cd modules/[nom] && npm run build` OU `npm run build -w modules/[nom]`) comme alternatives valides post-D-DS-20 | **S21 cleanup** (couple avec D-S7-04 batch jargon/refs) |
| D-S8-05 | 2026-04-09 | F-S8-05 step 5.5 accepted : documentation D-MON-03 + D3 Monitor deja integree, anti-pattern cosmetique acceptable | **No action** |
| D-S8-06 | 2026-04-09 | F-S8-08 new-project sans template sortie → ajouter un template minimal symetrique (3-5 lignes : Module cree / Path / Stack decidee / Next) | **S21 housekeeping** |
| D-S8-07 | 2026-04-09 | **Fix F-S8-09** template README dupplique (confirme S8b avec divergence contenu) → choisir : (a) single source = script, spec MD pointe vers script, (b) single source = MD, script fait `cat docs/template.md` | **S21 housekeeping** |
| D-S8-08 | 2026-04-09 | **F-S8-13 fix** sync-check.sh affiche 2x verdict → le script doit afficher **un seul verdict final** apres les 2 sections (health embed + extended). Fix L-? de scripts/sync-check.sh (scope S9 technique) | **S9 ou S21** (couplage avec audit scripts) |
| D-S8-09 | 2026-04-09 | **F-S8-14 fix** propage dans D-S8-02 : supprimer la duplication + la spec incomplete en une seule action | **S21 housekeeping** (merge avec D-S8-02) |
| D-S8-10 | 2026-04-09 | **F-S8-15 flag** pour S9 : polyglot bash+Python scripts/module-scaffold.sh est un pattern fragile a auditer avec le reste des scripts | **S9 scripts + hooks deep** |
| D-S8-11 | 2026-04-09 | **Formalisation M-S8-01** meta-finding "spec MD vs code" 3e occurrence → considerer comme pattern structurel recurrent (pas un incident isole) | **S20 synthese pre-fixes** |
| D-S8-12 | 2026-04-09 | **Decouverte bonus hors scope** : `scripts/git-hooks/commit-msg` hook refuse le type `audit` (11 types standard seulement : feat/fix/docs/refactor/chore/test/style/build/ci/perf/revert). Les commits S1-S7 utilisent tous `docs(audit): sXX ...` donc le plan section commit messages est obsolete. | **S9** (audit hooks + scripts) OU **S21 plan cleanup** |

**Total final S8 : 12 decisions D-S8-01..12.** Toutes batchees S21/S9/S20 sauf D-S8-05 (no action).

## 8. Learnings metaboliques (final)

**L-S8-01 — Asymetrie dormant (agents) vs chaud (commands) : severite findings inversee**
S7 a trouve 0 P2 sur 4 agents dormants (dette hypothetique). S8 trouve 4 P2 sur 4 commands actifs (dette effective). **Regle** : la severite d'un finding depend de la frequence d'invocation du composant audite, pas de son etat intrinseque. Un agent dormant peut avoir des bugs graves sans impact mesurable ; un command actif peut avoir des bugs cosmetiques avec impact systemique.

**L-S8-02 — Pattern "spec MD vs code source" 3e occurrence = seuil pour fix durable**
F-S5-20 + M-S6-01 + F-S8-03/14 = **3 occurrences confirmees** du meme pattern sur 4 sessions d'audit successives. **Regle emergente** : toute doc MD qui decrit un workflow execute par un script doit etre soit un pointeur minimal (< 10L), soit un generate-from-code. Pas de duplication manuelle qui drift. **Decision de principe** : M-S8-01 formalise le pattern comme structurel, fix durable (pas patch) en batch S20 ou S21.

**L-S8-03 — Template v1 embedde dans command spec survit a la reforme v9**
`CLAUDE.md` a ete refactore 2026-04-09 avec la directive v9 briefs obligatoire (9 iterations). Mais `.claude/commands/session-start.md` + `.claude/commands/session-end.md` spec embedded garde le template v1 original. Le refactor a touche la regle superieure (`CLAUDE.md`) sans propager aux specs inferieures (`.claude/commands/`). **Regle** : tout refactor d'une regle globale doit inclure une phase de propagation vers les specs derivees, sinon les specs inferieures survivent comme source fantome.

**L-S8-04 — Les tests reels amplifient les findings statiques (3 P2 → 4 P2 + 1 meta)**
Phase S8a (lecture + audit statique) = 12 findings (3 P2 + 9 P3). Phase S8b (tests reels invocation) = 15 findings total (4 P2 + 11 P3 + meta M-S8-01 formalise). **Regle** : l'audit statique seul sous-estime les findings de ~20-25% (ici 12 → 15 = +25%). Les tests reels revelent :
- des divergences factuelles invisibles sur lecture (F-S8-14 sync incomplet)
- des UX anti-patterns (F-S8-13 double verdict)
- des confirmations qui escaladent des findings potentiels (F-S8-09 dupplication confirmee avec contenu divergent)

**Regle d'audit** : toujours inclure les tests reels d'invocation dans l'audit d'un composant actif, jamais se contenter du spec MD.

**L-S8-05 — Garde-fous externes (CLAUDE.md + memoire) masquent la dette des specs inferieures**
Le brief v9 live de cette session a ete genere correctement malgre le spec v1 du command, grace a `CLAUDE.md` + memoire `feedback_brief_format.md`. **Effet de bord** : la dette F-S8-01/02 est invisible en usage normal, ce qui la rend persistante. Elle ne sera expose que si CLAUDE.md ou la memoire deviennent indisponibles (session fresh, troncature contexte, nouveau collaborateur). **Regle** : la dette masquee par un garde-fou n'est pas absente, elle est differee. Elle doit etre priorisee sur les autres parce que son apparition est imprevisible.

**Total final S8 : 5 learnings L-S8-01..05.**

## 9. Out-of-scope S8

- Lecture + audit de `scripts/sync-check.sh` code source complet (= Task S9.2 lecture line-by-line scripts + hooks). **Note S8b** : partie de l'output reel observee en test mais code source non inspecte.
- Lecture + audit complet de `scripts/module-scaffold.sh` code source (inspecte partiellement en S8b pour confirmer F-S8-09 + decouvrir F-S8-15, mais audit scripts + hooks reserve S9).
- Couverture des 7 scripts en `scripts/` + `scripts/git-hooks/` + `scripts/hooks/` (= Session S9 complete)
- Revue des skills /oh-my-claudecode:* et /superpowers:* (= Session S10)
- Fix `scripts/git-hooks/commit-msg` pour autoriser `audit` type OU mise a jour du plan S8-S23 pour utiliser `docs(audit)` (= S9 ou S21)
- Test `bash scripts/module-scaffold.sh test-fake-name` cas piege (evite intentionnellement pour ne pas creer de module fantome, reserve S9 avec dry-run si disponible)

## 10. Verification post-S8

- [x] 4 commands lus line-by-line (session-start 30L / session-end 65L / new-project 49L / sync 79L)
- [x] Audit 4 angles applique a chaque command (A1 workflow / A2 duplication / A3 scripts / A4 output)
- [x] Findings final consolides (15 total : 0 P1 + 4 P2 + 11 P3 + 1 meta M-S8-01)
- [x] Decisions final D-S8-01..12 (12 total, toutes batchees S21/S9/S20 sauf D-S8-05 no action)
- [x] Learnings final L-S8-01..05 (5 total)
- [x] Cross-references S1-S7 etablies (F-S8-03/14 vs F-S5-20+M-S6-01, F-S8-07 vs F-S7-09, F-S8-12 vs F-S7-07, F-S8-04 vs D-DS-20)
- [x] Tests reels d'invocation executes (4/4 : spec vs live + sync-check full + module-scaffold --help + source module-scaffold)
- [x] Meta-finding M-S8-01 formalise (pattern double source 3e occurrence)
- [x] Zero regression modules/app verifie (build 752ms OK, 19/19 tests verts, health DEGRADED baseline 75 refs identique)
- [ ] Commit final S8 `docs(audit): s08 commands (4) deep + tests reels` (en cours)

## 11. Cross-references autres sessions

- **S5 F-S5-20** (CLAUDE.md vs cortex.md routing) : 1ere occurrence pattern double source
- **S6 M-S6-01** (hooks decoratifs meta coverage) : 2eme occurrence pattern double source
- **S7 F-S7-07** (asymetrie investissement agents) : mirror de F-S8-12 asymetrie commands
- **S7 F-S7-09** (dev-agent PAUL opaque) : mirror exact de F-S8-07 session-end PAUL jargon
- **S7 D-S7-04** (batch cleanup jargon/refs) : peut absorber F-S8-07 + F-S8-04 dans meme batch S21
- **S7 D-S7-09** (enrichir sync-check.sh paths check) : peut absorber F-S8-13 (double verdict) + F-S8-14 (spec incomplete) dans meme batch
- **S7 L-S7-06** (11e occurrence L-S5-05 backtickification) : **applique en ecrivant ce livrable** — tous les paths verifies en backticks, paths hypothetiques ou jargons en plain text
- **M-S8-01 formalise** : 3e occurrence du pattern "spec MD vs code" (apres F-S5-20 + M-S6-01) → escalade en meta-finding explicite

## 12. Prochaine session

**S9 — Scripts + hooks (9) deep + tests reels** :
1. `scripts/health-check.sh` (deja observe en usage regulier)
2. `scripts/sync-check.sh` (deja observe en S8b, code non lu)
3. `scripts/ref-checker.sh` (lu en S3-S6 pour verifs refs)
4. `scripts/module-scaffold.sh` (lu en S8b, pattern polyglot F-S8-15 flag)
5. `scripts/session-lock.sh` (Cowork, non audite)
6. `scripts/hooks/validate-void-glass.sh` (PreToolUse)
7. `scripts/hooks/security-reminder.py` (PreToolUse)
8. `scripts/git-hooks/pre-commit` (health-check autorise DEGRADED mentionne recurrents)
9. `scripts/git-hooks/commit-msg` (11 types standard, pattern `audit` rejete = D-S8-12)

**Scope S9** : lecture line-by-line + 4 angles (bug, idempotence, exit codes, output) + tests 3-5 cas par script (ref plan section S9). Probable decoupage S9a/S9b pattern S8.

**Dette heritee S8 pour batch S21** :
- D-S8-01 + D-S8-02 : fix briefs v1/v9 + sync double source (2 fichiers .claude/commands/ + 1 sync.md)
- D-S8-03 + D-S7-04 : batch jargon/refs cleanup (4 fichiers agents + 2 fichiers commands)
- D-S8-04 : npm workspaces drift doc commands
- D-S8-06 : new-project template sortie
- D-S8-07 : fix template README duplicate
- D-S8-08 : fix sync-check.sh double verdict (S9 ou S21)
- D-S8-09 : merge avec D-S8-02
- D-S8-10 : flag F-S8-15 pour S9
- D-S8-11 : formalisation M-S8-01 pour S20 synthese pre-fixes
- D-S8-12 : plan + commit-msg hook decalage

**Estimation dette visible post-S8** : ~8-12 fichiers a editer en batch S21, effort ~1-2 sessions.

---

*S8 redige 2026-04-09 sur branche audit-massif-cycle3. S8a commit 80c18cb (lecture + audit draft), S8b commit en cours (tests reels + livrable final). 08-commands.md passe de placeholder 6L a livrable complet.*
