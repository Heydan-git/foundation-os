# Audit Massif Final — Foundation OS

> **Status** : WIP — preparation/brainstorming en cours
> **Date creation** : 2026-04-07
> **Auteur de la demande** : Kevin
> **Executant** : Claude Code (L2, Opus 4.6 1M context, effort max)
> **Type** : Audit multi-session, preparation requise avant execution
> **Anti-compactage** : Ce fichier est LE point de reprise. A relire en debut de session.

---

## 1. Demande initiale (verbatim)

Texte recu de Kevin le 2026-04-07 (date originale du document : 2026-04-05) :

```
# Foundation OS — Demande d'Audit Massif Final
# 2026-04-05
# Destinataire : Claude Code (L2)
# Statut : Audit multi-session — préparation requise avant exécution

## 1 · CONTEXTE & POSITIONNEMENT

- Ça va être l'audit le plus massif mais aussi le dernier
- Sois vraiment super complet : audit 100% de l'OS, tous ses aspects et recoins
- Attention ça va être long → note tout et documente tout pour qu'à la reprise de
  session on n'oublie rien du contexte et de la demande initiale

## 2 · PRÉPARATION & ACTIVATION

### 2.1 · Skills et outils à activer
- Active tous les skills nécessaires (superpowers, OMC, brainstorming, etc.)
- Utilise tout ce que tu as à ta disposition pour que ce soit le plus efficace,
  fiable et complet possible
- Tu peux aller sur Git et le réseau pour trouver de nouvelles idées, bonnes
  pratiques ou outils supplémentaires

### 2.2 · Lecture exhaustive
- Lis bien tout le projet : dossier par dossier, fichier par fichier, ligne par ligne
- Toute la documentation incluse

## 3 · PÉRIMÈTRE DE L'AUDIT

L'audit doit couvrir TOUS les aspects suivants :

### 3.1 · Fondations & architecture
- OS Foundation
- Core OS
- Organicité du système
- Scalabilité
- Maintenabilité

### 3.2 · Exécution & fonctionnement
- Exécution
- Fonctionnement
- Automatisation
- Orchestration
- Intelligence
- Tes skills d'orchestration pour faire fonctionner le tout

### 3.3 · Communication & sécurité
- Communication entre tout l'OS, toi et moi
- Sécurité et mémoire
- Anti-compactage

### 3.4 · Composants techniques
- Les commandes
- Les agents
- Les skills
- Les outils
- Les scripts

## 4 · OBJECTIFS DE L'AUDIT

### 4.1 · Vérifications
- Assure-toi vraiment que tous les skills et le système de fichiers de l'OS te
  permettent une orchestration automatique générale et globale
- Le tout doit être un OS cohérent, intelligent, qui parle, est automatique et
  s'auto-adapte

### 4.2 · Propositions
- Propose aussi une amélioration de l'architecture de fichiers et nomenclature
  si tu trouves mieux
- Le tout sans régression, avec pragmatisme et en étant conscient de tes limites
  techniques

## 5 · MÉTHODE D'EXÉCUTION

- Découpe en plusieurs étapes bien détaillées et expliquées pour réalisation sur
  plusieurs sessions
- Note tout et documente tout pour qu'à la reprise de session on n'oublie rien du
  contexte et de la demande initiale

## 6 · MÉTA — Suggestions d'audit complémentaires

> Si j'ai oublié des trucs à tester et auditer, rajoute-les.
> Tu peux me proposer d'agrémenter l'audit avec des choses que tu juges pertinentes
> mais identifie-les clairement (tag [SUGGESTION]) que je puisse te demander de les
> enlever.

## CHECKLIST PÉRIMÈTRE (récap)

- OS Foundation
- Core OS
- Exécution
- Fonctionnement
- Automatisation
- Orchestration
- Organicité du système
- Scalabilité
- Maintenabilité
- Intelligence
- Tes skills d'orchestration pour faire fonctionner le tout
- Communication entre tout l'OS, toi et moi
- Sécurité et mémoire
- Anti-compactage
- Les commandes
- Les agents
- Les skills
- Les outils
- Les scripts
```

---

## 2. Etat de la session de preparation

**Phase actuelle** : Brainstorming (skill `superpowers:brainstorming`)

**Demarrage** : 2026-04-07 — depuis SHA `be3db1e` (3 commits ahead origin/main).

**Health baseline pre-audit** : SAIN (build 814ms, vitest 19/19, refs 38/38, Void Glass 0, TS 0).

### Tasks de preparation (TaskList interne)
1. [x] Sauvegarder demande integrale (ce fichier)
2. [x] Explorer contexte projet en profondeur
3. [x] Poser questions de clarification (Q1-Q8 toutes repondues)
4. [x] Proposer 2-3 approches d'audit (A/B/C puis D Maximum revisee)
5. [x] Presenter design en sections (5 sections validees Kevin)
6. [x] Ecrire design doc complet (cette section, en cours)
7. [ ] Spec self-review
8. [ ] User review du spec
9. [ ] Invoke writing-plans (terminal state preparation)

### Decisions du brainstorming (au fil de l'eau)
- **Q1 — Mode audit** : Audit + execution multi-sessions (chaque session execute fixes apres validation Kevin, commits incrementaux, garde-fou zero regression)
- **Q2 — Ambition refactor** : Refonte moderee (renames coherents, deplacements, regroupements logiques, dedup — pas de big-bang)
- **Q3 — Recherche externe** : DEEP (Karpathy, Matuschak, communautes Anthropic/OMC/Superpowers, marketplace MCP, plugins OMC v4.11.0+)
- **Q4 — Strategie git** : Branche dediee `audit-massif-cycle3` + PR finale apres audit complet (vercel deploy reste sur main, rollback trivial)
- **Q5 — Suggestions complementaires** : 12 SUGG-X gardees telles quelles (perf, doc cognitif, coverage, ci/cd, db, deps, types, naming, anti-bullshit, BMAD verdict, memory tier, multi-modules)
- **Q6 — Rythme sessions** : Granulaire 8-12 sessions courtes, max checkpoints, max validation Kevin
- **Q7 — Profondeur audit composants** : Lecture exhaustive + tests fonctionnels reels (run chaque hook/agent/command/script avec inputs legitimes + cas pieges)
- **Q8 — Approche d'audit** : Approche D — Maximum revisee, 24 sessions (S0 a S23), sub-agents restreints aux 5 zones isolees (S1 partiel, S13 partiel, S14 partiel, S17 external, S18 cross-check), le reste = MOI directement
- **CONTRAINTE Sous-agents (Kevin 2026-04-07)** : Sous-agents reserves aux taches sans contexte global necessaire (lecture parallele isolee, recherche externe, cross-checks par design independants). Pour TOUT ce qui necessite vue d'ensemble, cross-references, synthese, execution avec impact = JE LE FAIS MOI-MEME directement. Regle sauvegardee dans `feedback_subagents_context.md` (auto-memory).
- **Design 5 sections valide Kevin (skill #5)** : (1) architecture documentation, (2) lifecycle session type, (3) anti-compactage concrete, (4) brief standard sub-agents, (5) validation gates Kevin + commit strategy. Tous OK.

### Questions ouvertes (en attente de Kevin)
- Aucune. Q1-Q8 toutes repondues, design 5 sections valide.
- Prochain gate Kevin : review du spec ecrit ci-dessous (skill #8) avant invocation writing-plans (skill #9).

---

## 3. Plan multi-session — Approche D Maximum revisee

> Status : valide par Kevin (Q8 = yes, 2026-04-07).
> Pattern de reference : `docs/plans/2026-04-07-finition-os.md`.

### 3.1 · Vue d'ensemble

**Approche** : D — Maximum coverage avec sub-agents restreints aux taches isolees.

**Total** : 24 sessions (S0 a S23).

**Branche** : `audit-massif-cycle3` (creee en S0).
**Tag baseline** : `pre-audit-cycle3` (cree en S0 avant tout).
**PR finale** : creee en S23, merge → main apres validation Kevin.

**Phases lecture/audit pures (zero risque regression)** : S0 → S19.
**Phases execution fixes (zero regression strict)** : S20 → S23.

**Garanties cles** :
- Branche dediee → main intouche → Vercel deploy stable
- 3 gates Kevin explicites (G1 apres S19, G2 apres S22, G3 apres S23)
- Health-check + sync-check + ref-checker + vitest apres CHAQUE fix
- Anti-compactage robuste (master file + index + livrables MD self-contained)
- Sub-agents avec brief structure pour eviter degats si contexte projet manque

### 3.2 · Decoupage 24 sessions

| #   | Phase | Session | Mode | Livrable | Detail |
|-----|-------|---------|------|----------|--------|
| S0  | 0 — Pre-flight | Setup baseline | [MOI] | 00-preflight.md | Push 3 commits Kevin, branche audit-massif-cycle3, tag pre-audit-cycle3, mkdir docs/audit-massif/, init 00-INDEX.md |
| S1  | I — Reconnaissance | Carto repo file-by-file | [MIX] | 01-carto-repo.md | Sub-agents Explore en parallele sur dossiers ISOLES (modules/app/src, .github, supabase), MOI consolide tableau exhaustif |
| S2  | I — Reconnaissance | Inventaire components + smoke tests | [MOI] | 02-inventaire-components.md | 4 agents, 4 commands, 9 scripts, 2 hooks, skills, MCP, CI workflows. Run --help / status sur chacun |
| S3  | II — Fondations | OS Foundation + Core OS (4 piliers) | [MOI] | 03-fondations-core.md | Cortex/Memory/Monitor/Tools : reels ou theoriques ? Test chacun |
| S4  | II — Fondations | Architecture organicite/scalabilite/maintenabilite | [MOI] | 04-architecture-orga.md | Couplage, dette, doublons, scalabilite 5→10 modules |
| S5  | III — Execution | Workflows + commands + routing Cortex | [MOI] | 05-workflows-routing.md | Run chaque command avec cas reel + cas piege, test routing |
| S6  | III — Execution | Skills d'orchestration + automation + hooks chain | [MOI] | 06-orchestration-automation.md | Hooks PreToolUse, CI/CD chain end-to-end, git hooks, deploy |
| S7  | IV — Composants | Agents (4) deep + tests reels | [MOI] | 07-agents.md | Lecture line-by-line + invocation reelle 3 cas test chacun |
| S8  | IV — Composants | Commands (4) deep + tests reels | [MOI] | 08-commands.md | Lecture + invocation reelle + verif completion |
| S9  | IV — Composants | Scripts + hooks (9) deep + tests | [MOI] | 09-scripts-hooks.md | Run avec --help / no-args / valide / invalide / edge |
| S10 | IV — Composants | Skills internes + externes + BMAD verdict | [MOI] | 10-skills.md | Inventaire skills + test 5-7 representatifs + SUGG-10 BMAD |
| S11 | V — Comm/Secu/Mem | Communication + securite | [MOI] | 11-comm-securite.md | Hand-offs agents, hooks security, secrets, .env, .gitignore |
| S12 | V — Comm/Secu/Mem | Memoire (4 tiers) + anti-compactage | [MOI] | 12-memory-anti-compactage.md | SUGG-11 memory tier reel, doublons, anti-compactage strategies |
| S13 | VI — Module App | Audit modules/app complet | [MIX] | 13-module-app.md | [SUB] OK pour lecture isolee tests/components volumineux, [MOI] pour logique mutations/auth/db |
| S14 | VII — SUGG tech | SUGG-1 perf + SUGG-6 deps + SUGG-7 types | [MIX] | 14-sugg-tech-1.md | [SUB] perf measures + deps audit (focus tech isole), [MOI] type safety (cross-refs) |
| S15 | VII — SUGG tech | SUGG-3 coverage + SUGG-4 ci/cd + SUGG-5 db + SUGG-8 naming | [MOI] | 15-sugg-tech-2.md | Tous cross-references obligatoires |
| S16 | VIII — SUGG strat | SUGG-2 doc cognitif + SUGG-9 anti-bullshit + SUGG-12 multi-modules | [MOI] | 16-sugg-strategic.md | Tout transversal, contexte global obligatoire |
| S17 | IX — External | Recherche externe DEEP | [SUB] | 17-external-research.md | 3 sub-agents : best practices + outils MCP + frameworks emergents. MOI consolide |
| S18 | X — Cross-check | Cross-check independant findings phases 2-16 | [SUB] | 18-cross-check.md | Sub-agents verifier/critic/review-agent. MOI categorise final |
| S19 | XI — Synthese | Synthese transversale + roadmap fixes + propositions | [MOI] | 19-synthese-roadmap.md | LE document maitre. **GATE G1 obligatoire avant S20** |
| S20 | XII — Fixes | Application batch P1 critiques + verification | [MOI] | 20-fixes-p1-applied.md | Bugs reels, refs cassees, scripts non-fonctionnels, securite |
| S21 | XII — Fixes | Application batch P2 importants + verification | [MOI] | 21-fixes-p2-applied.md | Restructurations moderees, dedup, refactor coherence |
| S22 | XII — Fixes | Application batch P3 cosmetiques + verification | [MOI] | 22-fixes-p3-applied.md | Naming polish, doc cleanup, mineurs. **GATE G2 apres** |
| S23 | XIII — Verdict | Verification finale + rapport + PR ready | [MOI] | 23-rapport-final.md | Re-run complet, comparaison baseline, PR audit-massif-cycle3 → main. **GATE G3 (merge Kevin)** |

### 3.3 · Criteres go/no-go par session

**Go criteria** (avant de demarrer chaque session) :
- [ ] CONTEXT.md lu
- [ ] audit-massif-final.md (ce fichier) lu
- [ ] 00-INDEX.md lu, derniere session DONE confirmee
- [ ] Livrable session precedente lu
- [ ] git status propre cote code (modifs runtime OK)
- [ ] Sur la branche `audit-massif-cycle3`
- [ ] health-check.sh = SAIN
- [ ] Annonce de l'objectif precis a Kevin

**Done criteria** (pour cloturer chaque session) :
- [ ] Livrable docs/audit-massif/[session].md ecrit, source line:file pour chaque finding
- [ ] Aucun bullshit / aucune metrique inventee (auto-revue avant cloture)
- [ ] Pour sessions S20-S22 : health/sync/refs/vitest/build apres CHAQUE fix
- [ ] 00-INDEX.md mis a jour (status DONE)
- [ ] audit-massif-final.md mis a jour (decisions, findings cles, next session)
- [ ] CONTEXT.md mis a jour section "Cycle 3 progress"
- [ ] Commit propose a Kevin (format conventional)
- [ ] Pour S20-S22 : zero regression confirmee avant commit

**Stop criteria** (annulation session en cours) :
- Kevin dit "stop" → arret immediat, branche en l'etat
- Compactage imminent senti → checkpoint partiel + arret propre
- Regression detectee dans S20-S22 → revert + analyse + arret

### 3.4 · Livrables

**24 livrables MD** dans `docs/audit-massif/` (00 a 23) + 1 master file `docs/plans/2026-04-07-audit-massif-final.md` (ce fichier).

**Template livrable session** (applique a chaque MD) :
```
# [Session N] — [Titre court]
> Date : YYYY-MM-DD | Status : DONE | Mode : [MOI/MIX/SUB]
> Livrable precedent : [filename]
> Findings cles (consolides dans master file) : [3-5 bullets]

## 1. Objectif
## 2. Methodologie (lecture / tests / sub-agents si applicable)
## 3. Findings (avec source file:line + severite P1/P2/P3)
## 4. Decisions
## 5. Cross-references vers autres sessions / livrables
## 6. Out-of-scope flagges (a ne pas oublier)
## 7. Next session (objectif precis)
```

**Format de findings standard** :
```
| ID         | Finding              | File:Line               | Severite | Source  | Action proposee |
|------------|----------------------|-------------------------|----------|---------|-----------------|
| F-S03-01   | Description courte   | docs/core/cortex.md:45  | P1       | lecture | fix court       |
```

ID format : `F-S<NN>-<num>` (F = finding, S<NN> = numero session, num = sequentiel dans la session).

**Master file (ce fichier)** mis a jour APRES chaque session avec :
- Status sessions (DONE/IN_PROGRESS/PENDING) dans section 6 (live tracking)
- Findings cles (top 3-5 par session)
- Decisions Kevin
- Pointeur next session

**00-INDEX.md** : table des matieres navigable de tous les livrables avec status DONE/IN_PROGRESS/PENDING.

**PR finale (S23)** : description detaillee, pointeur 23-rapport-final.md, comparaison baseline pre/post (health/sync/refs/vitest/build/bundle), demande Kevin de merger.

### 3.5 · Anti-compactage strategy (concrete)

**Pourquoi critique** : 24 sessions = risque eleve de compactage en cours d'audit. Chaque compactage perd du contexte si non sauvegarde.

**Mitigation a 8 niveaux** (bilan honnete 2026-04-10, fix F-S12-04 P1) :

1. ~~**Master file live tracking**~~ **ABANDONNE** — section 6 jamais mise a jour apres S0 (drift 12 sessions). Deprecie, remplace par CONTEXT.md.
2. ~~**Index 00-INDEX.md update**~~ **RATTRAPE 2026-04-10** — stale depuis S4 (drift 7 sessions), mis a jour S5-S12 en fix P1.
3. **Livrables session self-contained** : VIVANT, chaque MD lisible seul. Seule mitigation 100% tenue S0-S12.
4. **CONTEXT.md** : VIVANT, source operationnelle principale de fait (ratio hot paths 10:1 vs autres tiers). Mis a jour a chaque /session-end.
5. **Commits messages factuels** : VIVANT, pattern `docs(audit): sNN ...` stable (note : format reel `docs(audit):` pas `audit(sNN):` comme prevu initialement).
6. **Procedure de reprise** : VIVANT (simplifiee 2026-04-10, pointe CONTEXT.md en source principale).
7. ~~**Checkpoint partiel**~~ **JAMAIS UTILISE** — aucun compactage n'a eu lieu pendant les 12 sessions (sessions courtes anti-compactage efficaces).
8. **Re-verification baseline** : VIVANT, health-check.sh execute a chaque session-start et session-end.

### 3.6 · Strategie sub-agents (recap detaille)

5 sessions sur 24 utilisent des sub-agents (~21%) :

| Session | Mode | Sub-agents et brief |
|---------|------|---------------------|
| S1 | MIX | Lecture parallele dossiers ISOLES (modules/app/src, .github, supabase). Brief : "liste fichiers + size + role + format" |
| S13 | MIX | Lecture isolee dossiers UI volumineux (forms/, Commander/) sans logique transversale |
| S14 | MIX | Sub #1 perf measures (latence hooks, build, bundle), Sub #2 deps audit (npm audit, outdated, unused) |
| S17 | SUB | Sub #1 best practices (Karpathy, Matuschak, Anthropic), Sub #2 marketplace MCP + plugins OMC v4.11.0+, Sub #3 frameworks emergents |
| S18 | SUB | Sub #1 verifier sur findings P1, Sub #2 critic sur findings architecture, Sub #3 review-agent sur fixes proposes |

**19 sessions sur 24 = MOI directement (~79%)**. Pas de sub-agent quand le contexte global est necessaire.

**Brief standard sub-agent** (toujours applique) :
- Objectif precis (1 phrase)
- Fichiers a regarder (paths absolus, pas de glob ouvert)
- Contraintes (no modify, no out-of-scope, "incertain" si pas sur)
- Contexte minimal Foundation OS (stack, design system, imperatifs zero bullshit)
- Format de sortie attendu (tableau ou liste avec finding/file:line/severite/preuve)

### 3.7 · Validation gates Kevin (3 explicites)

| Gate | Apres | Decision Kevin | Si refuse |
|------|-------|----------------|-----------|
| **G1** | S19 (synthese-roadmap) | Valider roadmap fixes P1/P2/P3 + propositions architecture/nomenclature avant S20 | Re-prioriser, retirer fixes, ajuster scope |
| **G2** | S22 (fin batch P3) | Valider que zero regression confirmee + tous fixes OK avant S23 | Rollback batch concerne, re-analyse |
| **G3** | S23 (rapport + PR ready) | Merger PR `audit-massif-cycle3` → main TOI-MEME | Pas de merge automatique, jamais |

**Stop button permanent** : a tout moment de toute session, "stop" / "halt audit" → arret net, branche preservee, rien n'est perdu.

**Validation implicite** : chaque /session-end propose un commit, Kevin valide ou refuse au moment du commit.

### 3.8 · Strategie commit

- 1 commit par session (apres /session-end)
- Format conventional commits : `audit(s<NN>): <description courte>`
- Exemples :
  - `audit(s00): preflight setup branche audit-massif-cycle3 + tag baseline`
  - `audit(s01): carto repo file-by-file → docs/audit-massif/01-carto-repo.md`
  - `audit(s20): apply fixes batch P1 (5 critiques)`
- Sur la branche `audit-massif-cycle3` UNIQUEMENT, jamais sur main
- PR finale en S23 avec body detaille (voir section 3.4 livrables)

---

## 4. Anti-compactage — Procedure de reprise

> Mise a jour 2026-04-10 (fix F-S12-03 P1). Simplifiee : CONTEXT.md = source principale.

Si la conversation Claude est compactee ou si une nouvelle session commence :

1. Lire `CONTEXT.md` section "Cycle 3 progress" → trouver la prochaine session non DONE
2. Lire `CONTEXT.md` section "Prochaine action" → scope et contexte
3. Lire le dernier livrable `docs/audit-massif/[derniere-session-DONE].md` section 8 (Next)
4. Verifier `git status` + `git log --oneline -5` + branche `audit-massif-cycle3`
5. Lancer `bash scripts/health-check.sh`
6. Reprendre a la prochaine session non DONE

**Les findings et rapports detailles de l'audit seront sauvegardes dans** :
`docs/audit-massif/` (a creer en S0, pas pendant la preparation).

---

## 5. References

- Pattern plan multi-session : `docs/plans/2026-04-07-finition-os.md`
- Spec design v2 : `docs/specs/2026-04-05-foundation-os-v2-design.md`
- Audit profond precedent (2026-04-07) : commit `0a5b345` (24 etapes A0-A9 +
  T1-T10 + P1-P3, 13 fixes appliques, zero regression). Cet audit nouveau doit
  aller plus loin.
- Cycle 2 audit/test : commit `4c79061` (48/48 PASS post-compactage)
- CLAUDE.md : imperatifs Foundation OS (zero bullshit, zero regression, plan
  avant execution)
- Auto-memory feedback sub-agents : `feedback_subagents_context.md` (regle
  d'usage des sub-agents)

---

## 6. Live tracking sessions

> **DEPRECIE** (2026-04-10, fix F-S12-01 P1). Cette section etait stale depuis S1 (drift 12 sessions).
> Source de verite unique pour le suivi des sessions : **`CONTEXT.md` section "Cycle 3 progress"**.
> Les decisions Kevin et findings cles sont dans chaque livrable `docs/audit-massif/NN-*.md` section 4 et 8.
