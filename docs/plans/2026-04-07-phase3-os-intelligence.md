# Phase 3 — OS Intelligence : Implementation Plan

> Reference : `docs/specs/2026-04-05-foundation-os-v2-design.md` section Phase 3
> Plan ecrit le 2026-04-07. Decoupage en 1 session (ou 2 si audit lourd).

**Goal:** Rendre l'OS plus intelligent dans sa gestion de sessions et de memoire. Trois livrables : (1) session-end avec 4 niveaux de statut au lieu de binaire, (2) `docs/index.md` re-aligne sur la realite (la version actuelle date du 2026-04-05 et est en retard sur Phase 2), (3) audit BMAD + OMC pour identifier ce qui sert vraiment vs ce qui doit etre archive.

**Architecture:** Aucun code applicatif touche. Tout se passe dans `.claude/commands/`, `docs/`, et eventuellement `scripts/`. Pas de nouvelle dependance, pas de migration. Phase 3 est une phase **meta** (process + doc), conformement au principe de la spec : "alterner meta/code".

**Tech Stack:** Markdown, bash (health-check.sh existant). Rien d'autre.

---

## Decoupage en 1 session

| Tache | Scope | Livrables | Critere |
|-------|-------|-----------|---------|
| **3.1** | Session-end 4 niveaux | `.claude/commands/session-end.md` + section CONTEXT.md | Workflow update + 1 essai a vide |
| **3.2** | Index de navigation | `docs/index.md` re-aligne | Refletter etat reel post-Phase 2 |
| **3.3** | Audit BMAD + OMC | `docs/tools-audit.md` (nouveau) | Decisions documentees par outil |

Phase 3 est completee quand toutes les checkboxes du critere global de la spec (ligne 198-204) sont cochees.

---

## Task 3.1 — Session-end ameliore (4 niveaux)

**Objectif :** Remplacer le statut binaire (fini/pas fini) par 4 niveaux inspires de PAUL : DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED.

**Files:**
- Modify: `.claude/commands/session-end.md`
- Modify: `CONTEXT.md` (ajout d'une colonne "Statut" dans "Dernieres sessions" si pertinent — a decider en execution selon lisibilite)

### Steps

- [ ] **Step 1** : Ajouter dans `session-end.md` un nouveau step entre l'actuel step 4 et step 5 :
  - Demander a l'agent de classifier la session selon les 4 niveaux
  - Tableau de reference inline (pour que l'agent n'ait pas a aller chercher la spec) :

  ```
  | Statut               | Quand l'utiliser                                  |
  |----------------------|---------------------------------------------------|
  | DONE                 | Toutes les taches finies, build + tests verts     |
  | DONE_WITH_CONCERNS   | Livre mais avec dette/risque a documenter         |
  | NEEDS_CONTEXT        | Bloque par manque d'info Kevin (decision/donnee)  |
  | BLOCKED              | Impossible de continuer (bug externe, dep cassee) |
  ```

- [ ] **Step 2** : Pour DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED → forcer l'ajout d'une ligne dans CONTEXT.md section "Dernieres sessions" qui prefixe le resume avec le statut entre crochets : `[NEEDS_CONTEXT] Phase 3.3 audit BMAD : besoin de l'avis Kevin sur 3 modules ambigus...`

- [ ] **Step 3** : Pour BLOCKED → forcer un workaround/tentative documente dans CONTEXT.md (qu'est-ce qui a ete essaye, pourquoi ca ne marche pas).

- [ ] **Step 4** : Mettre a jour le format d'annonce final pour inclure le statut :
  ```
  Session cloturee — [date]
  Statut : [DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED]
  Modifie : [liste fichiers]
  Build : [OK/KO par module]
  CONTEXT.md : mis a jour
  Prochaine action : [quoi faire ensuite]
  ```

- [ ] **Step 5** : health-check.sh obligatoire avant chaque session-end (deja le cas dans la spec ligne 158 — verifier que session-end.md le rend explicite ; sinon l'ajouter dans le step 3 du workflow).

- [ ] **Step 6** : Aucun test code — verification = relire le markdown et confirmer que le statut est demande sans ambiguite.

---

## Task 3.2 — Index de navigation (re-aligne sur la realite)

**Objectif :** `docs/index.md` actuel date du 2026-04-05 et est obsolete depuis Phase 2 (5 routes mentionnees vs 8 reelles, pas de Navbar, pas de KnowledgePage, fichiers de tests manquants, etc.).

**Files:**
- Modify: `docs/index.md`

### Steps

- [ ] **Step 1** : Lister la realite actuelle pour 4 axes :
  - Routes : 8 (`/`, `/commander`, `/knowledge`, `/dashboard`, `/crud-test`, `/phase1-demo`, `/login`, `/reset-password`)
  - Pages : verifier dans `modules/app/src/pages/` (KnowledgePage.tsx, ResetPasswordPage.tsx ajoutees)
  - Composants : verifier dans `modules/app/src/components/` (Navbar ajoute)
  - Tests : 6 fichiers (app, supabase, mutations, useCommander, AuthContext, forms) — actuel index dit 3
  - Artifacts JSX : 0 dans src/, 7 dans .archive/artifacts-jsx/

- [ ] **Step 2** : Mettre a jour la section "Code (modules/app/src/)" : ajouter Navbar dans components, ajouter KnowledgePage et ResetPasswordPage dans pages, mettre a jour test/ avec les 6 fichiers reels.

- [ ] **Step 3** : Mettre a jour la section "Data (modules/app/data/)" si necessaire (verifier 7 MD pairs reels).

- [ ] **Step 4** : Ajouter au tableau "Specs & Docs" :
  - `docs/plans/2026-04-07-phase2-app-hardening.md`
  - `docs/plans/2026-04-07-phase3-os-intelligence.md` (ce plan-ci)
  - `docs/tools-audit.md` (cree en Task 3.3)

- [ ] **Step 5** : Mettre a jour la section "Outils externes" avec les statuts post-audit (depend de Task 3.3).

- [ ] **Step 6** : Mettre a jour la date "Derniere mise a jour : 2026-04-07".

- [ ] **Step 7** : Verification : `grep -E '5 routes|6 routes|7 routes' docs/index.md` doit retourner 0 ligne (toutes les anciennes mentions corrigees).

---

## Task 3.3 — Audit BMAD + OMC

**Objectif :** Decider quoi garder, quoi archiver, quoi documenter sans ceremonie. Pas un audit academique : 1 ligne de verdict par outil.

**Files:**
- Create: `docs/tools-audit.md`
- Modify possible: `_bmad/` (si on decide d'archiver) — A NE PAS FAIRE sans OK Kevin explicite, juste documenter la recommandation

### Steps

- [ ] **Step 1** : BMAD — inspecter la structure :
  - `_bmad/core/` contient 12 modules (bmad-advanced-elicitation, bmad-brainstorming, bmad-distillator, bmad-editorial-review-prose, bmad-editorial-review-structure, bmad-help, bmad-index-docs, bmad-init, bmad-party-mode, bmad-review-adversarial-general, bmad-review-edge-case-hunter, bmad-shard-doc)
  - Question : ces modules ont-ils ete invoques en session ? `grep -r "bmad" .omc/sessions/` pour verifier.
  - Verdict possible : "0 invocation depuis 2026-04-01 → archiver _bmad/ dans .archive/_bmad/" OU "garder mais sans le mettre en avant".

- [ ] **Step 2** : OMC skills — lister les skills installes (deja vu dans le system-reminder de session-start) et identifier ceux invoques :
  - Tier-0 documentes dans CLAUDE.md user-global : autopilot, ultrawork, ralph, team, ralplan
  - Skills custom Foundation OS : `/session-start`, `/session-end`, `/new-project`, `/sync` (ce sont les seuls vraiment utilises)
  - Question : quels OMC skills ont ete invoques ? `grep -ri "oh-my-claudecode:" .omc/sessions/` pour estimer.
  - Verdict possible : "Garder OMC pour les workflows Tier-0, mais pas a documenter dans CLAUDE.md projet — la version user-global suffit".

- [ ] **Step 3** : Coderabbit — verifier presence (`ls ~/.claude/plugins/` ou similaire) et overlap avec code-review Anthropic :
  - Si Coderabbit installe ET code-review Anthropic installe → garder un seul (le plus utilise / le plus integre).
  - Verdict a documenter dans `tools-audit.md`.

- [ ] **Step 4** : Ecrire `docs/tools-audit.md` avec ce format :

  ```markdown
  # Tools Audit — 2026-04-07

  > Audit Phase 3.3. Decisions par outil pour eviter la dette de fonctionnalites non utilisees.

  ## BMAD v6 (_bmad/, 12 modules)
  - **Invocations en session** : [N] (verifie via grep .omc/sessions/)
  - **Verdict** : [GARDER | ARCHIVER | DOCUMENTER]
  - **Raison** : [...]
  - **Action proposee** : [...] (a confirmer Kevin avant execution)

  ## OMC skills (oh-my-claudecode, ~50 skills)
  - **Skills custom Foundation OS** : session-start, session-end, new-project, sync
  - **Skills Tier-0 utilises** : [liste]
  - **Skills jamais invoques** : [liste haut-niveau]
  - **Verdict** : [...]

  ## Coderabbit vs code-review Anthropic
  - **Installes** : [oui/non pour chacun]
  - **Verdict** : [...]
  ```

- [ ] **Step 5** : Aucun deplacement de fichier sans OK Kevin. Le document ne fait que **proposer**.

- [ ] **Step 6** : Si Kevin valide une recommandation d'archivage en fin de session → faire le mv vers `.archive/`, mettre a jour CONTEXT.md, et mettre a jour `docs/index.md` accordingly.

---

## Task 3.4 — Verification finale

- [ ] **Step 1** : Relire les 3 livrables et verifier coherence interne (pas de reference cassee, pas de duplication avec CONTEXT.md).

- [ ] **Step 2** : `bash scripts/health-check.sh` → SAIN.

- [ ] **Step 3** : `cd modules/app && npm run build` → exit 0 (sanity check meme si on n'a pas touche au code).

- [ ] **Step 4** : `cd modules/app && npm test` → 19 tests, 0 failure (sanity check).

- [ ] **Step 5** : Update `CONTEXT.md` :
  - Ligne dans "Dernieres sessions" : `2026-04-07 | Phase 3 OS Intelligence DONE : session-end 4 niveaux, docs/index.md re-aligne, audit BMAD/OMC. [Statut: DONE ou DONE_WITH_CONCERNS]`
  - "Prochaine action" → pointer vers Phase 4 (Monitoring) avec ref a la spec
  - Ajouter ligne decisions : `Phase 3 DONE | 2026-04-07 | OS Intelligence : 4-niveaux session-end, audit outils, index a jour`

- [ ] **Step 6** : Commit final
  ```
  feat(os): phase 3 — session-end 4 niveaux + audit outils + index a jour
  ```

---

## Critere de succes Phase 3 (copie de la spec, ligne 198-204)

- [ ] /session-end genere un statut 4-niveaux
- [ ] `docs/index.md` existe et reflette la structure reelle
- [ ] Audit BMAD + OMC documente dans `docs/tools-audit.md`
- [ ] `health-check.sh` = SAIN

---

## Recapitulatif fichiers

| # | Fichier | Action |
|---|---------|--------|
| 1 | `.claude/commands/session-end.md` | Modify — workflow + 4 niveaux statut |
| 2 | `docs/index.md` | Modify — re-aligner avec etat reel post-Phase 2 |
| 3 | `docs/tools-audit.md` | Create — verdicts BMAD / OMC / Coderabbit |
| 4 | `CONTEXT.md` | Modify — session log + prochaine action + decisions |

Total : 1 fichier cree, 3 fichiers modifies, 1 commit final.

---

## Hors scope (notes pour plus tard)

- **Implementation effective des deplacements BMAD/Coderabbit** : strictement bloque par OK Kevin. Le plan ne fait que proposer.
- **PAUL framework au-dela du 4-niveaux** : la spec mentionne "inspire de PAUL" — on prend juste l'idee des 4 niveaux, pas le reste du framework.
- **Knowledge Graph MCP** : la spec ligne 322 dit "evaluer en Phase 3 si besoin identifie" — verdict a inclure dans tools-audit.md, mais pas d'installation.
- **Pre-commit hook automatique** : c'est Phase 4, pas Phase 3.
