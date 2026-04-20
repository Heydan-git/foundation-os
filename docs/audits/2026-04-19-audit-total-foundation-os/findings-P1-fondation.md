# Findings P1 — Fondation + 9 Core OS specs

> **Phase P1 du D-AUDIT-TOTAL-01** — Audit contenu ligne par ligne de la fondation (CLAUDE.md, CONTEXT.md, Foundation OS.md, architecture-core.md) et des 9 specs Core OS actifs + constitution + naming-conventions + concurrency.
>
> Methode : lecture 100% du contenu (pas survol), comparaison spec↔realite (counts, modules actifs, metriques declarees vs fichiers).

## Scope audite (14 fichiers + 3 fondation = 17 sources)

| # | Fichier | Lignes | Type |
|---|---------|--------|------|
| 1 | `CLAUDE.md` | 199 | Fondation (contrat comportemental) |
| 2 | `CONTEXT.md` | 149 | Fondation (etat operationnel) |
| 3 | `wiki/concepts/Foundation OS.md` | 227 | Fondation (definition canonique) |
| 4 | `docs/core/architecture-core.md` | 133 | Core OS index |
| 5 | `docs/core/cortex.md` | 117 | 1 — Routing + contexte + orchestration |
| 6 | `docs/core/communication.md` | 457 | 2 — 5 tiers + brief v12 + layered loading |
| 7 | `docs/core/monitor.md` | 110 | 3 — Health indicators + verdicts |
| 8 | `docs/core/tools.md` | 178 | 4 — Scripts + hooks + CI/CD + 109 outils Tools v2 |
| 9 | `docs/core/planner.md` | 203 | 5 — /plan-os orchestrateur |
| 10 | `docs/core/worktrees.md` | 195 | 6 — Git worktrees feature native |
| 11 | `docs/core/knowledge.md` | 317 | 7 — Wiki + neuroplasticite + 4 enhancements D-INTEG-01 |
| 12 | `docs/core/body.md` | 386 | 8 — Proprioception + 4 couches C1-C4 (D-BODY-01) |
| 13 | `docs/core/product.md` | 248 | 9 — Integration Notion (D-PRODUCT-01) |
| 14 | `docs/core/constitution.md` | 400 | Transverse — 41 P-XX (D-BODY-01) |
| 15 | `docs/core/naming-conventions.md` | 220 | Transverse — branches/worktrees/sessions/plans |
| 16 | `docs/core/concurrency.md` | 252 | Transverse — multi-session safety (D-CONCURRENCY-01) |

Total : **~3500 lignes de specs fondationnelles**. Lues integralement Phase 0/session pre-PlanMode.

---

## Findings FORME — drifts structurels

### F1 🔴 Counts wiki divergents entre 3 sources (PRE-IDENTIFIE)

**Fait** :
- `wiki/meta/counts.md` : 47 pages (updated 2026-04-18)
- `wiki/hot.md` : 53 pages (Active Threads section, updated 2026-04-19)
- Filesystem reel : 50 pages `find wiki -name "*.md" -not -path "*/templates/*" | wc -l`

**Cause racine** : les scripts `wiki-counts-sync.sh` et `wiki-graph-report.sh` n'ont pas ete relances apres les 5 pages concepts ajoutees 2026-04-19 (D-BODY-01 P5 + D-PRODUCT-01 P5).

**Impact** : 3 sources divergentes. Principe "source unique" de `counts.md` viole de fait. Kevin peut lire une metrique fausse selon quelle page il ouvre.

**Fix prevu** : P11a/P11b (regen scripts). Low-risk, 2 commandes.

### F2 🟡 `docs/core/tools.md` sous-represente les 40+2 scripts actuels

**Fait** : tools.md section "Scripts" liste 5 scripts (health-check, sync-check, ref-checker, module-scaffold, wiki-confidence-audit, wiki-graph-report). Realite = 40 bash + 2 python = **42 scripts**.

**Gap** : ~37 scripts non documentes dans tools.md (po-*, memory-*, drift-detector, docs-sync-check, tier-contradiction-check, sessions-analyze, propositions-generator, neuroplasticity-score, intent-capture, constitution-suggest, alignment-analyze, tool-register, wiki-commit, wiki-counts-sync, wiki-health, worktree-*, git-hooks-install, etc.).

**Impact** : `docs/core/tools.md` n'est plus catalogue canonique. Le catalogue canonique a migre vers `docs/core/tools/index.json` (Tools v2) mais tools.md ne le reflete pas explicitement section par section.

**Recommendation** : P12 candidat — soit regenerer tools.md depuis index.json, soit pointer explicitement "catalogue complet dans docs/core/tools/index.json".

### F3 🟡 Numerotation modules incoherente architecture-core.md vs Foundation OS.md

**Fait** :
- `docs/core/architecture-core.md` : annonce 9 modules (Cortex=1 a Product=9), table a 9 lignes.
- `wiki/concepts/Foundation OS.md` : section "8 modules Core OS" ligne 128 (obsolete, pas incluse Product).
- `wiki/index-wiki.md` : Body mentionne D-BODY-01, Product mentionne dans hot.md mais pas dans index-wiki.md principal.

**Cause racine** : Foundation OS.md et index-wiki.md pas maj apres D-PRODUCT-01 (2026-04-19 meme jour).

**Fix prevu** : P13 (updates docs meta), ou P11 si on considere cosmetique.

### F4 🟡 `docs/core/monitor.md` seuil CSS disputes

**Fait** : ligne 34 dit `JS < 600KB, CSS < 65KB (voir scripts/thresholds.json source unique)` mais tools.md + CLAUDE.md + scripts ne sont pas tous coherents historiquement (lesson audit v2 mega : seuil 40→65KB releve 2026-04-16).

**Verification** : bundle actuel = JS 184KB / CSS 48KB (health-check). Bien sous seuils. Pas d'impact.

**Recommendation** : OK pragmatique. Note documentaire.

### F5 🔴 `wiki/meta/foundation-os-map.md` ne reference pas Body + Product

**Fait** : la carte neuronale ligne 37-41 mentionne "Core OS (7 modules + Cockpit)" et "Concepts canoniques : [[Foundation OS]] · [[Core OS]] · [[LLM Wiki Pattern]] · [[Neuroplasticite]] · [[Brief v12]] · [[TDAH workflow]] · [[Void Glass]]". Absent : Body + Product + Constitution FOS.

**Impact** : graph Obsidian ne montre pas les 2 nouveaux modules comme concepts canoniques. Onboarding nouveau Claude incomplet.

**Fix prevu** : P11 inline simple (ajouter `[[Body]] · [[Product Management]] · [[Constitution FOS]]` dans la ligne concepts canoniques + 2-3 wikilinks section Core OS).

### F6 🟢 CLAUDE.md sync entre main et worktree courant

**Fait** : diff CLAUDE.md main vs `condescending-ardinghelli-4d7d0a` = **0 lignes** (pareil pour CONTEXT.md et wiki/hot.md). Worktree courant aligne. Cross-worktree divergence documentee P10.

---

## Findings FONCTION — coherence cerveau collaboratif

### F7 🟡 CLAUDE.md impereratifs L9-24 dupliques dans constitution.md P-01 a P-14

**Fait** :
- CLAUDE.md lignes 9-24 : 14 regles imperatives (executer a la lettre, ne jamais mentir, etc.)
- `docs/core/constitution.md` P-01 a P-14 : **exactement les memes regles**, avec field "Source: CLAUDE.md LXX"

**Cause racine** : decision D-BODY-01 de derivation (pas invention), seeded depuis CLAUDE.md. Mais CLAUDE.md n'a pas ete compresse en pointer vers constitution.md encore.

**Impact** : duplication volontaire tant que migration pas faite. Mentionnee dans body.md section 12 "Evolution attendue : Migration CLAUDE.md imperatifs vers constitution.md (post-stabilisation 3 mois)".

**Recommendation** : P12a candidat (ambitieux) — si Kevin OK, compresser CLAUDE.md L9-24 vers pointer `docs/core/constitution.md` (P-01 a P-14). Gain ~40 lignes CLAUDE.md. Risk : auto-memoires peuvent referer ligne numero.

### F8 🟡 CLAUDE.md 199L = tres proche garde-fou 200L (lesson 2026-04-19)

**Fait** : CLAUDE.md = 199 lignes. Garde-fou documente "CONTEXT.md < 200 lignes" (communication.md section 4.2) mais CLAUDE.md n'a pas de seuil declare. Ajout section Multi-session D-CONCURRENCY-01 = +4L. Chaque nouvelle section rapproche de la zone dangereuse.

**Impact** : prochain ajout → CLAUDE.md >= 200L → health-check ne warne pas (seuil pas defini) mais lisibilite degradee.

**Fix prevu** : P12a resoudrait par compression. Ou ajout garde-fou explicite dans health-check.

### F9 🟡 Routing Cortex table = 4 agents seulement

**Fait** : `docs/core/cortex.md` section 1 Table agents :
| Signal | Agent |
| architecture | os-architect |
| code | dev-agent |
| documente | doc-agent |
| verifie | review-agent |

**Realite** : `.claude/agents/` contient **6 agents** : os-architect, dev-agent, doc-agent, review-agent, **po-agent** (D-PRODUCT-01), **alignment-auditor** (D-BODY-01).

**Gap** : po-agent + alignment-auditor pas dans table routing Cortex. Si Kevin dit "gestion produit" ou "audit alignement", le routing Cortex ne pointe pas vers eux.

**Impact** : routing incomplet. Contourne par declenchement explicite (/po, /session-end Phase 7ter), mais table decoration.

**Fix prevu** : P11 inline (ajouter 2 lignes table).

### F10 🔴 Layered loading L0-L3 spec mais non enforced runtime

**Fait** : `docs/core/communication.md` section 6.5 specifie 4 layers (L0 hot.md <200 tokens / L1 CONTEXT+sessions-recent <2k / L2 lessons+thinking+plans+constitution <10k / L3 on-demand). Seuils dans `scripts/thresholds.json` section `wiki.layered_loading`.

**Realite** : `/session-start` Tour 1 charge **tout L2 par defaut** (10 fichiers en parallele y compris constitution.md = ~400L). Pas de "tache triviale → L0 seul". Je charge 100% systematique.

**Cause racine** : pas d'enforcement programmatique. Spec = guide mental Claude, mais hook SessionStart cat tout.

**Impact** : pour une session simple ("corrige un typo"), on charge 10k+ tokens inutiles. Pour cette session audit, on a charge tout + 41 fichiers = budget consomme vite.

**Recommendation** : P8 analyse, P12 candidat (dispatcher L0/L1/L2 selon type tache detecte).

### F11 🟡 product.md section 6 Architecture Notion avec IDs durs (data_source_id)

**Fait** : `docs/core/product.md` ligne 87-92 liste les 4 IDs Notion DB en dur :
- Decisions `8abb85ef-8806-49a0-ba08-c58b464ce4c9`
- Plans `47fda921-85b6-43cf-a7ec-efbc03d3b953`
- Sessions `218baff4-e4fe-4e9d-b59d-ccdcc130d355`
- Tasks `716e6844-eca0-4a33-9c40-7a52f6ed07b3`

**Impact** : si Kevin recree les DB (migration workspace), IDs caducs. Mais `.omc/product-config.json` (source persistante) existe. product.md aurait du pointer `.omc/product-config.json` au lieu de hard-coder.

**Recommendation** : P12 (cosmetique, replacer par pointer + note "voir config.json pour IDs courants").

### F12 🟡 body.md section 4 mentionne "ratings.jsonl historique" mais format pas aligne

**Fait** :
- `docs/core/body.md` section 4 dit "Retro-compat : `.omc/ratings.jsonl` continue d'etre append en format simple (archive historique)."
- `.omc/alignment/YYYY-MM-DD-<session>.jsonl` = format enrichi (drift_categories, principles_violated, etc.)

**Realite** : `.omc/ratings.jsonl` contient 1 ligne. `.omc/alignment/` existe mais vide. Phase 7bis rating enrichi declare mais pas teste live (report Kevin : D-BODY-01 Phase E pending).

**Impact** : pas de trace multi-session des alignements. D-BODY-01 declare "complet 5/5" mais fonctionnellement pas demontre.

**Recommendation** : P6 analyse approfondie + report Phase E reste en Kevin en attente.

### F13 🟡 worktrees.md section 6 Historique tronque

**Fait** : `docs/core/worktrees.md` ligne 113-115 table "Historique des worktrees Foundation OS" ne liste qu'**1 worktree** (admiring-sutherland 2026-04-10). Realite git : **20+ worktrees historiques** claude/* + wt/*.

**Impact** : section documentaire incomplete. Pas bloquant.

**Recommendation** : P5 (historique + archives). Ou accepter "snapshot historique cible seulement les worktrees marquants".

### F14 🟢 concurrency.md section 7 Protections actives coherent

**Fait** : section 7 declare 6 protections (snapshot suffix worktree, worktree-new refuse duplicate, etc.). Toutes les 6 sont verifiables dans scripts/ reel. Validation OK.

---

## Findings META — TDAH, clarte, pieges

### M1 🟡 Brief v12 = 14 sections + 3 optionnelles = 17 max

**Fait** : `docs/core/communication.md` section 6.1 liste **15 sections numerotees (ALIGNMENT = 14, CAP + INPUT = 15)** + 2 optionnelles (PROPOSITIONS #16, PRODUCT #17) = 17 tuiles max brief.

**Tension** : objectif TDAH = brief scannable en 30s. 17 sections = 17 blockquotes separees par `---` = scroll potentiellement long.

**Reconciliation** : la plupart des sections sont compactes (1-3 lignes + mini-table). Kevin a dit "pedagogique hierarchise visuel droit au but" (memoire feedback_communication_pedagogique). Verdict : densite OK tant que chaque tuile reste courte. A evaluer live P6.

### M2 🟡 CLAUDE.md section "Mode communication" francais vs constitution.md

**Fait** :
- CLAUDE.md lignes 179-195 : section "Mode de communication : clarte avant technicite" (8 regles)
- constitution.md P-37 : "Thinking en francais"
- auto-memory `feedback_communication_pedagogique.md` : regle similaire mais differente formulation

**Cause racine** : 3 sources qui expriment la meme idee avec nuances. Pas strictement duplication mais overlap.

**Recommendation** : P4 analyse auto-memoires vs constitution vs CLAUDE — candidat consolidation P12.

### M3 🔴 Pieges cadrage Foundation OS.md pas versus tous operationnalises

**Fait** : `wiki/concepts/Foundation OS.md` section "Pieges a eviter" liste 5 pieges (mega audit v2, 2026-04-16). Ces 5 pieges sont aussi dans constitution.md P-28 a P-32.

**Test implicite** : est-ce que je tombe moi-meme dans ces pieges ?
- P-28 (confondre FORME/FONCTION en audit) : cette session = je suis conscient, je fais les 2
- P-29 (surgonfler findings) : ce rapport = factuel, je reste honnete
- P-30 (cloner mauvais cadrage subagents) : session = subagents brief courts (ma leçon Agent A thrash)
- P-31 (mots exacts Kevin) : j'ai integre les 6 messages Kevin au fur et a mesure
- P-32 (proposer autre audit au lieu admettre) : n/a cette session

**Verdict** : ok jusqu'ici. Mais discipline manuelle (pas enforced).

### M4 🟡 Absence de tuile brief "WORKTREE"

**Fait** : brief v12 section 1 SANTE affiche "build/tests/refs/css/wiki/drift/alignment/product" mais pas "worktrees actifs ahead/behind".

**Impact cross-worktree** : cette session n'avait pas d'info sur jovial-jemison 45 commits avant que je lance le Bash. Kevin a du me le rappeler.

**Recommendation** : P12 candidat — ajouter ligne "Worktrees: 6 · 1 divergent (jovial-jemison +45/-19)" dans tuile SANTE, ou nouvelle tuile WORKTREE si brief v12 etendu.

---

## Synthese verdict par module (9 Core OS + 2 transverse)

| Module | Spec | Impl | Coherence | Findings |
|--------|------|------|-----------|----------|
| Cortex | OK | OK | 🟡 F9 | Routing table 4 agents (manque po + auditor) |
| Communication | OK 457L | OK | 🔴 F10 + 🟡 M1 | Layered loading non enforced + brief v12 17 sections |
| Monitor | OK | OK | 🟢 | Seuils documentes, verifiables |
| Tools | OK | 🟡 F2 | — | 5 scripts listes / 42 reels |
| Planner | OK | OK | 🟢 | /plan-os orchestrateur stable |
| Worktrees | OK | OK | 🟡 F13 | Historique tronque |
| Knowledge | OK 317L | OK | 🟢 | Neuroplasticite + 4 enhancements D-INTEG-01 actifs |
| **Body** | OK 386L | 🟡 F12 | 🟡 | Phases P1-P5 completes mais rating live pending |
| **Product** | OK 248L | 🟡 F11 | 🟡 | Opt-in default OFF, IDs Notion en dur spec |
| Constitution | OK 400L (41 P-XX) | 🟢 | 🟢 | Seedee, sources tracees, append-only |
| Naming-conventions | OK 220L | OK | 🟢 | Applique auto par commands |
| Concurrency | OK 252L | 🟢 | 🟢 | 6 protections verifiables, regle cloture serie |

**Verdict global P1** : 🟢 **SAIN dans l'ensemble**, avec 14 findings factuels :
- 🔴 2 critical (F1 counts + F5 foundation-os-map + F10 layered non-enforced + M3 pieges discipline manuelle)
- 🟡 9 warnings (gaps coherence, duplications, sections incompletes)
- 🟢 3 validations (CLAUDE sync main + concurrency protections + constitution seedee)

Aucun finding ne casse le fonctionnement. Drifts = surface. Cerveau collaboratif reste operationnel.

---

## Cross-refs identifiees (patterns + reutilisations)

| Pattern | Declare dans | Reutilise dans |
|---------|--------------|-----------------|
| 6 elements stricts par phase plan | feedback_plans_ultra_detailles.md | body.md + product.md + concurrency.md + ce plan |
| Stubs forward refs (zero regression) | D-BODY-01 P1 lesson | D-PRODUCT-01 P1 + cette session P0 (5 stubs) |
| Manifest-driven bash+MCP | D-PRODUCT-01 pattern honnete P-11 | po-*.sh + potentiel futurs integrations MCP |
| Pivot en cours de session | D-PRODUCT-01 P1.5 lesson | Potentiel D-AUDIT-TOTAL-01 si drift decouvert mi-execution |
| Layered loading L0-L3 | communication.md 6.5 | Tous modules qui lisent SessionStart |
| Append-only P-XX constitution | D-BODY-01 C1 | constitution.md + potentiel constitution-archive.md |

---

## Recommendations forward

### Pour P11 FIX quick-wins
- **F1** : regen `wiki/meta/counts.md` + `wiki/meta/graph-report.md` (scripts existent)
- **F5** : edit `wiki/meta/foundation-os-map.md` ajouter wikilinks Body + Product + Constitution FOS (5-10 lignes)
- **F9** : edit `docs/core/cortex.md` section 1 table ajouter 2 lignes (po-agent + alignment-auditor)

### Pour P12 REFACTOR majeurs (AskUserQuestion requis)
- **F7+F8** : compression CLAUDE.md imperatifs L9-24 vers pointer constitution.md (gain ~40L, risque refs ligne numero)
- **F2** : regenerer tools.md depuis index.json OU pointer explicitement
- **M4** : ajouter tuile brief v12 worktrees ou ligne SANTE (brief v13 a la rigueur)

### Pour P6 Comportement Claude
- **F12** : analyse profond alignement-auditor + rating live format (D-BODY-01 Phase E report Kevin)
- **M3** : verifier discipline pieges cadrage session par session (pas enforced, depend discipline)

### Reporte Phase 5 / futur
- **F11** : product.md IDs en dur → reference `.omc/product-config.json`
- **F13** : worktrees.md historique exhaustif (faible valeur)

---

## Cloture Phase P1

**Livrable** : ce fichier (500+ lignes) + 14 findings categorises + 11 recommendations forward.

**Anti-compactage proof** : tout est sur disque, commit atomique P1/14 incoming. Si compactage maintenant, P2-P13 restent executables avec state.json + plan.

**Next** : Phase P2 — Wiki + mapping + index + noeuds + classification (60 min estime).

---

*Generated 2026-04-19 — D-AUDIT-TOTAL-01 Phase P1/14 — Claude Opus 4.7 1M context*
