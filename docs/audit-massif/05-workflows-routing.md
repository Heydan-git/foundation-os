# S5 — Workflows + commands + routing Cortex

> **Cycle 3 — Audit massif** | Session S5 | Mode MOI strict | 2026-04-08
> Scope : audit 4 commands Foundation OS + routing Cortex (table signaux + frontmatters agents)
> Livrable precedent : `docs/audit-massif/04-architecture-orga.md` | Suivant : `docs/audit-massif/06-orchestration-automation.md`

---

## 1. Objectif

Verifier que les 4 slash commands Foundation OS (`/session-start`, `/session-end`, `/sync`, `/new-project`) et le routing Cortex (table signaux → agents) fonctionnent reellement comme documente. Test live + walkthrough analytique + 12 inputs routing + detection divergences spec/runtime.

Objectif non-binaire : mesurer l'ecart entre spec ecrite et comportement observe, identifier les gaps documentaires, les cas piege non couverts, et les incoherences entre sources (`docs/core/cortex.md` vs frontmatters agents vs `CLAUDE.md`).

## 2. Methodologie

Decoupage 6 phases anti-compactage A-F (pattern eprouve S2/S3/S4) :

| Phase | Scope | Volume |
|-------|-------|--------|
| A | Lectures paralleles 9 fichiers (4 commands + cortex + 4 agents) | 486L |
| B | Test live /session-start (execution reelle vs spec) | 6 steps compares |
| C | Walkthrough /session-end + /sync + /new-project | 3 commands + script 169L |
| D | Test routing Cortex (12 inputs varies) | 12 traces |
| E | Consolidation findings + decisions + learnings (ce livrable) | ~450L |
| F | Post-session ritual (sync-check + CONTEXT.md + commit) | 1 commit |

Mode MOI strict : 0 sub-agent invoque (conforme imperatif CLAUDE.md ligne 16). Aucun fix applique (mode doc-only audit, conforme S2/S3/S4).

Avantage live : `/session-start` + `sync-check.sh` ont ete executes en debut de session S5 (rattrapage S4 non cloturee), fournissant matiere concrete pour phases B et C.

## 3. Inventaire

### 3.1 Commands

| Fichier | Lignes | Role |
|---------|--------|------|
| `.claude/commands/session-start.md` | 30 | Ouverture session (6 etapes) |
| `.claude/commands/session-end.md` | 53 | Cloture session (7 etapes + 4 statuts PAUL) |
| `.claude/commands/sync.md` | 79 | Audit coherence (6 sections) |
| `.claude/commands/new-project.md` | 49 | Scaffold nouveau module (pointe vers script) |

Total : **211L** de spec commands.

### 3.2 Scripts associes

| Script | Lignes | Appele par |
|--------|--------|------------|
| `scripts/health-check.sh` | 172 | /session-start step 4 + /session-end step 3 + /sync section 1 |
| `scripts/sync-check.sh` | 180 | /sync execution principale |
| `scripts/module-scaffold.sh` | 169 | /new-project execution |
| `scripts/ref-checker.sh` | — | Integre dans health-check (full-repo scan) |

### 3.3 Routing Cortex

| Source | Contenu |
|--------|---------|
| `docs/core/cortex.md` ligne 1-24 | Section 1 "Routing" : table signaux 4 agents + 5 regles priorite |
| `CLAUDE.md` section "Core OS — Routing" | Pointeur vers cortex.md "source unique" |
| `.claude/agents/os-architect.md` frontmatter | Declencheurs runtime os-architect |
| `.claude/agents/dev-agent.md` frontmatter | Declencheurs runtime dev-agent |
| `.claude/agents/doc-agent.md` frontmatter | Declencheurs runtime doc-agent |
| `.claude/agents/review-agent.md` frontmatter | Declencheurs runtime review-agent |

Divergence identifiee : cortex.md (spec) vs frontmatters (runtime) = 4 items textuels different (F-S5-14).

## 4. Phase B — Test live /session-start

Execution reelle en debut de cette session. Comparaison 1:1 avec spec.

| Step | Requis | Execution observee | Conformite |
|------|--------|--------------------|-----------|
| 1. Lire CONTEXT.md | Read file | Read CONTEXT.md 103L → extraction etat S4 DONE + prochaine S5 | ✓ |
| 2. Detecter modules actifs | ls modules/ + package.json | `ls modules/` + glob `modules/*/package.json` → 1 match (app) | ✓ |
| 3. Structure racine | 4 fichiers + dossiers | `ls -la` → CLAUDE.md, CONTEXT.md, README.md, .gitignore + dirs → CLEAN | ✓ |
| 4. Etat technique | git status + build + health-check ("si BROKEN ne pas demarrer") | git status ephemeral only + npm build 898ms OK + health-check SAIN | ✓ |
| 5. Annoncer format court | Template "Foundation OS — Session [date]" | Brief complet livre | ✓ |
| 6. Attendre confirmation | "On y va ?" | Kevin bifurque sur "session precedente non cloturee" → rattrapage sync-check fait | ✓ |

**Verdict : 6/6 conformite execution ↔ spec.**

Cas piege identifies (bugs undefined dans la spec) :
- CONTEXT.md manquant → comportement undefined (F-S5-05)
- Build casse mais health-check reste SAIN (pathologique) → comportement undefined (F-S5-06)
- Module actif non-JS (Python/Rust) sans package.json → non detecte (F-S5-07)

## 5. Phase C — Walkthrough /session-end + /sync + /new-project

### 5.1 /session-end (analytique via historique)

Session courante non-terminable live → test via historique commits S2/S3/S4 :

| Step | S2→S4 | Conformite |
|------|-------|------------|
| 1-3. Lister / coherence / etat tech | Implicite via commits + health-check post-session | ✓ |
| 4. Classifier PAUL (DONE/DWC/NEEDS_CONTEXT/BLOCKED) | S2/S3/S4 = DONE implicite (pas de prefix crochets) | ✓ implicite |
| 5. Update CONTEXT.md | 3 sessions ajoutees en tete, prochaine action MAJ | ✓ |
| 6. Proposer commit | cccda38 `docs(audit): s04 ...` conventional | ✓ |
| 7. Annoncer format court | **SKIPPE en S4** (Kevin a ferme avant cloture) | ✗ S4 |

Rattrapage S4 : `sync-check.sh` + `health-check.sh` relances en debut de S5 ont compense l'etape 7 manquante. Zero impact filesystem (commit + CONTEXT.md deja appliques en S4).

Cas piege :
- Aucun changement session → OK conditionnel (step 6 "si changements en attente")
- Tests failent → OK par design (step 4 classifie en DWC/BLOCKED)
- Refs cassees → methode de detection non explicite dans la spec (F-S5-08)
- Health-check DEGRADED (pas BROKEN) → action non explicite (F-S5-09)

### 5.2 /sync (execution live en rattrapage)

Execute : `bash scripts/sync-check.sh` → **SAIN** (6/6 sections EXTENDED).

| Section sync.md | Check | Output observe |
|-----------------|-------|----------------|
| 1. Structure racine | via health-check | OK 0 orphelin |
| 2. Modules vs CONTEXT | sync-check Extended | Modules actifs refs 1/1 |
| 3. References | sync-check Extended + ref-checker.sh | Refs last commit 0 cassee + refs intactes 66/66 |
| 4. Routes (partielle) | sync-check Extended | Routes CONTEXT vs App.tsx 8 match |
| 5. Fonts (partielle) | sync-check Extended | Fonts Void Glass Figtree primaire 0 violation |
| 6. Core OS | sync-check Extended | 4 agents + 4 commands + 5 specs |

**Gap** : `.claude/commands/sync.md` ligne 12 dit "section 3 ref-checker backlog" MAIS ref-checker.sh existe deja et est integre dans health-check depuis P1 (audit OS profond). Spec obsolete (F-S5-01).

### 5.3 /new-project (dry-run --help + audit script)

Execution dry-run : `bash scripts/module-scaffold.sh --help` → output complet (usage, exemples, structure, effets de bord, refus, exit codes). Conformite excellente.

Lecture integrale script (169L) → conformite spec vs execution :

| new-project.md dit | module-scaffold.sh execute | Match |
|--------------------|-----------------------------|-------|
| Lancer `scripts/module-scaffold.sh [nom]` | Shebang + cd git root | ✓ |
| Creer `modules/[nom]/` structure | mkdir + src/.gitkeep | ✓ |
| Update CONTEXT.md table Modules | Python regex parser + rollback | ✓ |
| Annoncer ce qui a ete cree | echo final | ✓ |
| Template README (H1, Objectif, Stack, Etat) | Heredoc identique | ✓ |

**Robustesse script au-dela de la spec** :
- Validation kebab-case (regex `^[a-z][a-z0-9-]*$` ligne 55)
- Idempotence (refuse si modules/[nom]/ existe ligne 63)
- Rollback atomique si Python update CONTEXT.md echoue (ligne 159)
- Capitalisation auto pour CONTEXT.md (`finance` → `Finance` ligne 69)

Gaps documentation (F-S5-11, F-S5-12) :
- `.gitkeep` non mentionne dans new-project.md structure
- `--help`/`-h` non documente dans new-project.md

## 6. Phase D — Routing Cortex (12 inputs test)

### 6.1 Divergences cortex.md ↔ frontmatters

| Agent | cortex.md dit | frontmatter dit | Delta |
|-------|---------------|-----------------|-------|
| os-architect | "structurer" | "comment structurer" | Frontmatter +1 mot |
| dev-agent | (identique) | (identique) | — |
| doc-agent | "met a jour CONTEXT" | "met a jour" | Frontmatter -1 mot (plus large) |
| review-agent | "regression" / "deployer" | "zero regression" / "avant de deployer" | Frontmatter +1 mot x2 |

Les frontmatters font foi runtime (D-S3-04 : "Cortex = convention de prompt pas de runtime separe"). cortex.md devrait s'aligner sur les frontmatters, pas l'inverse. Fix docs-only trivial (F-S5-14).

### 6.2 Tests 12 inputs

| # | Input | Match | Verdict |
|---|-------|-------|---------|
| 1 | "Ajoute un bouton delete sur la page Commander" | dev-agent (page, implicite composant) | ✓ OK single match |
| 2 | "Audit ce composant avant de deployer" | review-agent (audit, avant de deployer) + dev-agent (composant) | ⚠ AMBIGUITE → demander Kevin |
| 3 | "Mets a jour CONTEXT.md pour ajouter la session S5" | doc-agent (met a jour CONTEXT / met a jour) | ✓ OK |
| 4 | "Comment structurer le module finance ?" | os-architect (comment structurer) | ✓ OK |
| 5 | "Scaffold un nouveau module finance" | dev-agent (scaffold) — mais /new-project existe | ⚠ Layer-mismatch agent vs command |
| 6 | "Verifie zero regression avant commit" | review-agent (verifie, zero regression) | ✓ OK multi-intra |
| 7 | "Decide entre Supabase auth vs custom auth" | os-architect (option A vs B) + dev-agent (Supabase) | ⚠ AMBIGUITE → demander Kevin |
| 8 | "Refactor le composant Navbar en Tailwind" | dev-agent (composant, Tailwind) | ✓ OK multi-intra |
| 9 | "Documente la decision Void Glass dans CONTEXT.md" | doc-agent (documente, met a jour CONTEXT) | ✓ OK multi-intra |
| 10 | "Lance les tests et verifie que le build passe" | review-agent (verifie) + dev-agent (build) | ⚠ AMBIGUITE contextuelle |
| 11 | "Fix le bug dans AuthContext" | ZERO match | ⚠ ORPHELIN (verbes dev absents) |
| 12 | "Review mon code avant push" (anglais) | ZERO match ("review" ≠ "revue") | ⚠ ORPHELIN langue |

### 6.3 Synthese routing

| Metrique | Valeur | Interpretation |
|----------|--------|----------------|
| Total tests | 12 | |
| Nominal OK | 6 (50%) | Cas typiques routent correctement |
| Ambiguite multi-agent | 4 (33%) | Regle cortex "demander Kevin" → graceful degradation |
| Layer-mismatch (agent vs command) | 1 (8%) | F-S5-15 : table cortex ignore layer command |
| Orphelin (aucun match) | 2 (17%) | 1 verbes dev manquants (F-S5-17), 1 langue (F-S5-18) |

**Observation majeure** : sur 12 inputs realistes, la table signaux cortex a un **taux de couverture effectif ~50-67%** (selon si on compte ambiguites comme graceful succes ou echec). Systeme graceful par design (regles L19-22 : demander / traiter directement), pas classifieur intelligent.

**Pattern aggravant** : verbes communs de dev work (`fix`, `bug`, `debug`, `refactor`, `implement`) absents de toutes tables. Seuls les mots-cles ressources (composant, page, Supabase) et meta (audit, verifie) sont couverts. Routing peu fiable pour dev work quotidien.

## 7. Findings

16 findings total, tous P3 (0 P1, 0 P2).

**F-S5-01** [P3] `sync.md` ligne 12 dit "section 3 ref-checker backlog" alors que `scripts/ref-checker.sh` existe et est integre dans health-check (depuis P1 audit OS profond). Duplique F-S3-01 (CLAUDE.md lignes 95-96 outils obsoletes). **Action** : reformuler ligne 12 pour refleter l'integration actuelle. Fix docs-only S21.

**F-S5-02** [P3] `session-end.md` ligne 15 cite "inspire de PAUL framework" sans definition ni reference ailleurs dans le repo. Reference orpheline. **Action** : supprimer "inspire de PAUL framework" OU ajouter glossaire/note. Fix docs-only S21.

**F-S5-03** [P3] `doc-agent.md` ligne 6 frontmatter declencheur "met a jour" trop general (peut matcher "met a jour ce composant" qui devrait aller a dev-agent). Cas specifique de F-S5-14 mais merite restriction independante. **Action** : restreindre a "met a jour CONTEXT" ou "met a jour docs". Fix docs-only S21.

**F-S5-04** [P3] `cortex.md` section 3 "Commands Registry" duplique partiellement le contenu de chaque command .md. Risque drift. **Action** : reduire section 3 a une table de pointeurs (nom → fichier), pas de contenu duplique. Fix docs-only S21.

**F-S5-05** [P3] `session-start.md` step 1 ne definit pas le comportement si CONTEXT.md est manquant. Fallback undefined. **Action** : ajouter "Si CONTEXT.md absent → abort avec message d'erreur explicite". Fix docs-only S21.

**F-S5-06** [P3] `session-start.md` step 4 dit "si BROKEN ne pas demarrer" mais s'applique a health-check. Si build isole casse mais health-check reste SAIN (pathologique), comportement undefined. **Action** : preciser que build failure = BROKEN equivalent. Fix docs-only S21.

**F-S5-07** [P3] `session-start.md` step 2 detecte modules actifs via `package.json` uniquement. Un module Python/Rust sans package.json ne serait pas detecte. Non bloquant aujourd'hui (seul module actif = JS), mais limite pour Phase 5 Expansion. **Action** : noter cette limite dans monitor.md (definition alternative : "sous-dossier avec README.md"). Report S18 decision architecturale.

**F-S5-08** [P3] `session-end.md` step 2 "Pas de references cassees" sans definir la methode de detection. `scripts/ref-checker.sh` ou `scripts/sync-check.sh` jamais cites dans la spec. **Action** : ajouter ligne explicite "Execute `bash scripts/ref-checker.sh`". Fix docs-only S21.

**F-S5-09** [P3] `session-end.md` step 3 "doit etre SAIN (obligatoire)" mais action en cas de DEGRADED non definie. Le classificateur PAUL DONE_WITH_CONCERNS est implicite. **Action** : ajouter "DEGRADED → statut DONE_WITH_CONCERNS + document warning explicitement". Fix docs-only S21.

**F-S5-10** [P3] MERGED dans F-S5-01 (meme pattern : ref-checker backlog obsolete).

**F-S5-11** [P3] `new-project.md` lignes 22-27 "Structure creee" montre `src/` sans mentionner `.gitkeep`, mais script cree `src/.gitkeep` (ligne 78). Incoherence docs/script. **Action** : ajouter `.gitkeep` dans la structure documentee. Fix docs-only S21.

**F-S5-12** [P3] `new-project.md` ligne 8 "/new-project [nom-du-module]" ne documente pas `--help`/`-h` (supportes par le script ligne 18). **Action** : ajouter "Options : --help pour afficher l'aide detaillee". Fix docs-only S21.

**F-S5-13** [promoted] Script plus robuste que spec. Deplace en learning metabolique L-S5-03.

**F-S5-14** [P3] Divergence 4 items entre `cortex.md` (source unique declaree CLAUDE.md) et frontmatters agents (runtime effectif). Les frontmatters font foi runtime (D-S3-04). **Action** : aligner cortex.md sur les frontmatters (pas l'inverse). Fix docs-only S21.

**F-S5-15** [P3] Table signaux cortex est agent-centric, ne mappe pas les commands. Input "scaffold finance" → route vers dev-agent alors que `/new-project finance` existe. **Action** : ajouter section "Commands triggers" dans cortex.md OU documenter priorite command > agent. Report S18 decision architecturale.

**F-S5-16** [P3] Mot "build" ambigu : peut signifier "creer un build" (dev) ou "verifier un build" (review). Pas de desambiguisation contextuelle. **Action** : mentionner l'ambiguite dans cortex.md OU retirer "build" de dev-agent (implicite via "code"). Report S18.

**F-S5-17** [P3] Verbes communs dev work absents de toutes tables : "fix", "bug", "debug", "refactor", "implement", "test". Routing fallback "traiter directement" au lieu de dev-agent. **Action** : enrichir frontmatter dev-agent avec ces verbes. Report S18.

**F-S5-18** [P3] Incoherence linguistique table : majorite FR ("verifie", "revue", "documente", "deployer") mais EN aussi ("audit", "check", "scaffold", "Tailwind", "React"). Inputs EN/FR melanges peuvent manquer matches. **Action** : decider politique langue unique ou bilingue explicite. Report S18.

### Severite summary

| Niveau | Count | IDs |
|--------|-------|-----|
| P1 | 0 | — |
| P2 | 0 | — |
| P3 | 16 | F-S5-01, 02, 03, 04, 05, 06, 07, 08, 09, 11, 12, 14, 15, 16, 17, 18 |
| Merged | 1 | F-S5-10 → F-S5-01 |
| Promoted learning | 1 | F-S5-13 → L-S5-03 |

## 8. Decisions

**D-S5-01** [2026-04-08] Mode MOI strict maintenu en S5 (0 sub-agent invoque). Pattern eprouve S2/S3/S4 confirme : audit documentaire avec jugement cross-fichier = scope non-isole → MOI directement, pas de sub-agent. Conforme CLAUDE.md ligne 16 imperatif.

**D-S5-02** [2026-04-08] `cortex.md` est declare source unique dans CLAUDE.md, mais **frontmatters agents font foi runtime**. En cas de divergence, aligner cortex.md sur les frontmatters (pas l'inverse). Principe : runtime > doc. Fix F-S5-14 reporte S21 (batch docs-only triviaux).

**D-S5-03** [2026-04-08] Table signaux cortex = graceful degradation acceptable pour projet solo (couverture ~50%, ambiguite/orphelin resolves via "demander Kevin" ou "traiter directement"). Enrichment (F-S5-15, 16, 17, 18) reporte S18 (evolution Core OS).

**D-S5-04** [2026-04-08] `/session-end` step 7 (annonce format court) est obligatoire, pas optionnel. S4 a demontre que skippage possible sans impact filesystem (si commit + CONTEXT.md appliques avant), mais cree flou ritual. Pattern anti-compactage : ritual explicite > implicite. A documenter dans session-end.md comme "obligatoire, pas optionnel" (fix docs-only S21).

**D-S5-05** [2026-04-08] Fixes docs-only triviaux (F-S5-01, 02, 04, 05, 06, 08, 09, 11, 12, 14) reportes en batch S21 housekeeping (post-Cycle 3). Conforme pattern S2/S3/S4 mode doc-only audit. Aucun fix applique en S5. Findings S18-reportes (F-S5-07, 15, 16, 17, 18) = decisions architecturales plus lourdes, non-triviales.

## 9. Out of scope

- Fix des findings P3 (mode doc-only audit, batch S21)
- Test reel d'un `/new-project finance` (creerait un module, out-of-scope audit)
- Test reel d'un `/session-end` live (session courante non-terminable pendant audit)
- Enrichissement table signaux cortex (report S18)
- Test performance des commands (out-of-scope S5, objet S14 si besoin)
- Audit hooks PreToolUse (objet S6)

## 10. Learnings metaboliques

**L-S5-01** — **Routing Cortex = filtre graceful, pas classifieur semantique**. Couverture effective ~50% sur 12 inputs realistes (6 nominal OK, 4 ambiguite, 2 orphelin). Le systeme n'est pas un routeur intelligent mais un filtre passe-bas qui catche les cas nominaux clairs et delegue les cas ambigus/orphelins a Kevin via regles L19-22. C'est OK pour projet solo, limite pour automation. A documenter en S18 comme decision explicite (pas un bug, un trade-off assume).

**L-S5-02** — **Runtime > documentation** (confirmation de L-S3-02 + L-S4-05). Les frontmatters agents sont la source de verite effective (Claude Code les lit pour dispatcher), `cortex.md` est une intention ecrite. Divergence textuelle ne cause pas de bug runtime mais cree confusion documentaire. Pattern : toute spec devrait avoir un mecanisme de verification de parite avec le runtime correspondant. `sync-check.sh` pourrait etre etendu a un diff cortex.md ↔ frontmatters en S20.

**L-S5-03** — **Script plus robuste que spec** (confirmation de L-S3-02). `module-scaffold.sh` (169L) est significativement plus robuste que `new-project.md` (49L) : validation kebab-case, idempotence, rollback atomique, capitalisation auto, Python regex parser de CONTEXT.md. La spec sous-documente les garanties du script. Pattern : audit doit croiser spec.md vs implementation — la spec n'est jamais la source de verite unique. Si le script etait perdu, la spec seule ne permettrait pas de le reconstruire fidelement. Corollaire : les scripts sont self-documenting (via --help), les .md sont overview, les deux sont necessaires.

**L-S5-04** — **Regression meta : ritual /session-end skippable sans alarme**. S4 s'est cloture sans step 7 (format court annonce), zero alarme systeme — seul Kevin l'a remarque a la session suivante ("j'ai ferme sans cloturer"). Le ritual est declaratif, pas enforce. Potentiel futur : hook PostToolUse sur fin de conversation pour forcer /session-end ? Trop invasif pour solo dev probablement. Compensation actuelle : rattrapage en debut de session suivante via `sync-check.sh` + `health-check.sh` (pattern /session-start robuste). Decision D-S5-04 documente le ritual obligatoire.

**L-S5-05** — **3eme occurrence du pattern backticks-sur-paths-foireux (L-S2-07 → L-S4-08 → L-S5-05)**. En ecrivant la section 5.2 du livrable S5, j'ai utilise des backticks autour de "docs/../sync.md" (path foireux) pour pointer vers `.claude/commands/sync.md` (path correct). Le mauvais path est syntaxiquement valide en filesystem mais ref-checker ne le resout pas. Verdict DEGRADED detecte par sync-check post-livrable (1 ref cassee), fixee en ~30 secondes. **Pattern critique** : L-S2-07 logged, L-S4-08 logged ("j'ai oublie L-S2-07"), L-S5-05 maintenant ("j'ai oublie L-S2-07 ET L-S4-08"). Le reflexe **n'est pas acquis** malgre 2 flags explicites precedents. **Cause racine probable** : raccourci cognitif pendant ecriture flow-state, ref-checker n'est invoque que post-write au lieu d'inline. **Compensation actuelle** : verification post-write systematique via sync-check (a fonctionne en ~30s). **Bonus meta-inception** : en ecrivant cette explication de L-S5-05, j'ai re-fait l'erreur exacte (backticks autour du mauvais path comme exemple) → 2eme detection ref-checker DEGRADED → 4eme occurrence dans la meme session. Reformulation finale : decrire le mauvais path en plain text (sans backticks). **Mitigation candidate (S20)** : pre-Edit hook qui scanne backticks paths inexistants dans .md avant write. Trop intrusif probablement, mais le pattern recurrent justifie une discussion. **Marqueur d'auto-honnetete** : ne pas pretendre que cette regression aurait ete evitee — elle se reproduira tant que la mitigation n'est pas en place.

## 11. Prochaine session

**S6 — Skills orchestration + automation + hooks chain** (mode MOI)

Livrable : `docs/audit-massif/06-orchestration-automation.md`

Scope :
- Audit 2 hooks PreToolUse (`scripts/hooks/validate-void-glass.sh` + `scripts/hooks/security-reminder.py`)
- Audit 2 git hooks (`scripts/git-hooks/pre-commit` + `scripts/git-hooks/commit-msg`)
- Audit CI/CD chain end-to-end (`.github/workflows/ci.yml` + `.github/workflows/supabase-ping.yml`)
- Audit deploy chain Vercel (`modules/app/vercel.json` si existe + URL prod)
- Test legitime + test piege pour chaque hook

Plan : `docs/plans/2026-04-07-cycle3-implementation.md` ligne 576+

Pre-conditions :
- S5 commit valide
- Baseline SAIN maintenu
