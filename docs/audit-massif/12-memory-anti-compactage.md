# Cycle 3 — S12 Memoire (4 tiers) + anti-compactage

> **Status** : DONE 2026-04-09 (phase a lecture + phase b tests reels)
> **Mode** : MOI strict (12e session consecutive S2-S12)
> **Scope** : 4 tiers memoire (Session / Contexte / Reference / Auto-memory), procedure anti-compactage, doublons cross-files
> **Branche** : `audit-massif-cycle3` | **Baseline** : DEGRADED 84 refs cassees (zero drift session-start → S12a → S12b)
> **Cross-refs** : SUGG-11 memory tier audit (reel vs theorie), ferme PHASE V (S11+S12)
> **Pre-session note** : commit `d959213 docs(audit): s07 recup livrable orphelin` effectue pre-S12 pour eliminer anomalie 07-agents.md working tree non-committe depuis 2026-04-08 (couple d4fc729 "S7.5 integration" avait update CONTEXT.md seul)
> **Commits** : `2190988 docs(audit): s12a lecture 4 tiers + anti-compactage + doublons -- draft findings` (phase A, 466L draft) + `<S12b>` (phase B final)

## 1. Objectif

Auditer la memoire Foundation OS a deux niveaux :

**Niveau 1 — Tiers (spec)** : verifier que chaque tier de la spec `docs/core/memory.md` (Session / Contexte / Reference / Auto-memory) contient ce qu'il devrait contenir, sans duplication, sans drift, et que la regle d'or "une info = un tier" est respectee.

**Niveau 2 — Anti-compactage (operationnel)** : verifier que la procedure de reprise apres compactage documentee dans `docs/plans/2026-04-07-audit-massif-final.md` section 4 est operationnelle, que les fichiers "point de reprise officiel" sont a jour, et que le systeme resiste a la perte de contexte conversation.

Question meta : apres 11 sessions d'audit consecutives, les fichiers anti-compactage eux-memes tiennent-ils la route ? Les tiers sont-ils tous vivants ou certains sont-ils abandonnes ?

## 2. Methodologie

Decoupage 2 phases pattern S9/S10/S11 valide :

| Phase | Scope | Status |
|-------|-------|--------|
| A | Lecture 4 tiers + procedure reprise + cross-files + draft findings | DONE |
| B | Tests reels (T1 verif MEMORY.md + T2 grep doublons + T3 reprise scenarisee + T4 commits factuels) + final | DONE |

Mode MOI strict (12e consecutive S2-S12, imperatif CLAUDE.md applique). Zero sub-agent invoque (feedback_subagents_context.md : audit memoire = contexte global necessaire, 100% MOI). Strict D-S7-01 audit lineaire : zero fix opportuniste, meme sur P1, tout batch S21.

Strict hooks : pre-commit + commit-msg + validate-void-glass + security-reminder tous actifs (meta F-S9-18 + M-S11-01 applicable si le livrable touche a leurs patterns).

## 3. Inventaire Phase A

### 3.1 Tier 1 — Session (conversation Claude, volatile)

| Element | Observation |
|---------|-------------|
| Taches en cours via TaskCreate/TaskUpdate | actives cette session (6 taches creees S12) |
| Contexte conversation | volatile par nature, meurt a la fin |
| Tests unitaires locaux | non persistes (OK, conforme spec) |

Aucun fichier persistant a auditer — par design.

### 3.2 Tier 2 — Contexte (`CONTEXT.md`)

| Element | Valeur | Notes |
|---------|--------|-------|
| Total lignes | 138 | Dense, compact |
| Sections principales | 9 | Modules / Dernieres sessions / Cycle 3 progress / Prochaine action / Decisions actives / App Builder etat / MCP / Outils / Risques |
| Modules documentes | 8 | App Builder, Core OS, Cowork, Plan-Router, Meta-audit, Monitor Dashboard, Design System, Finance, Sante |
| Dernieres sessions | 3 (S9, S10, S11) | Spec Cortex `garder max 5` — conforme |
| Decisions actives visibles | 17 | D-S11, D-S10, D-S9, D-DS, D-S7-01, D-S8, D-S7-02..09, D-MON, Dashboard, BMAD, Code review, Affinement, Chantier, Finition, Audit OS, Compactage, Regles meta |
| Decisions log archivage | 44L `docs/decisions-log.md` existe | 17 decisions archivees selon CONTEXT.md L76 |

### 3.3 Tier 3 — Reference (`docs/`)

| Fichier | Lignes | Date derniere maj | Role |
|---------|--------|-------------------|------|
| `docs/index.md` | 101 | 2026-04-07 | Carte de navigation — **stale 2 jours** |
| `docs/architecture.md` | — | — | Architecture globale (non re-lue S12, suppose OK car audit S4) |
| `docs/design-system.md` | — | — | Void Glass tokens (non re-lue S12, audit DS-1..DS-6) |
| `docs/directive-v1.md` | — | — | Directive Kevin originale (reference historique) |
| `docs/manifeste.md` | — | — | Manifeste projet |
| `docs/setup-guide.md` | — | — | Guide setup dev |
| `docs/decisions-log.md` | 44 | — | Archivage decisions stabilisees |
| `docs/core/cortex.md` | 97 | — | Routing + protocole contexte |
| `docs/core/memory.md` | 102 | — | Spec 4 tiers |
| `docs/core/monitor.md` | — | — | Health + verdicts |
| `docs/core/tools.md` | — | — | Automation + scripts |
| `docs/core/architecture-core.md` | — | — | Structure Core OS |
| `docs/tools-audit.md` | — | — | Audit BMAD/OMC/Coderabbit |
| `docs/audit-massif/` | 26 entries | live | Cycle 3 livrables + 00-INDEX + meta-collaboration-ia |
| `docs/plans/` | — | — | Plans multi-phases |
| `docs/specs/` | — | — | Specifications |
| `docs/meta/` | — | — | Meta observations |
| `docs/monitor/` | — | 2026-04-09 | Dashboard monitor v1 livre S-D3 |
| `docs/travaux-cowork/` | — | — | Plans Cowork (collab-ia, design-system-bootstrap, instructions-cowork, monitor-dashboard, plan-router) |
| `docs/presentations/` | — | 2026-04-09 | Foundation-OS-Claude-Collab.pptx (modifie non committe) |

### 3.4 Tier 4 — Auto-memory (Claude natif)

Path : `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/`

| Fichier | Bytes | Date fichier | Type | Role |
|---------|-------|--------------|------|------|
| `MEMORY.md` | 1236 | 2026-04-09 16:39 | index | Liste 10 fichiers pointes + one-line hook |
| `user_langue_francais.md` | 320 | 2026-04-05 13:00 | user | Kevin francais, dev solo, direct |
| `project_structure.md` | 760 | 2026-04-05 13:00 | project | Reorganisation 2026-04-05 (stale : dit "3 fichiers racine" alors que 4 depuis 2026-04-09 avec package.json workspace root) |
| `feedback_no_bullshit.md` | 828 | 2026-04-05 13:00 | feedback | Zero bullshit + zero auto-congratulation |
| `feedback_minimal_files.md` | 676 | 2026-04-05 13:00 | feedback | Ne jamais creer fichiers sans demande |
| `tools_inventory.md` | 951 | 2026-04-05 13:51 | reference | OMC/BMAD/MCP/hooks/agents/commands (stale : dit "CLAUDE.md 52 lignes" alors que 141L aujourd'hui) |
| `work_patterns.md` | 688 | 2026-04-05 13:51 | feedback | Brainstorm → plan → execute → verify |
| `feedback_subagents_context.md` | 2414 | 2026-04-07 18:25 | feedback | Sous-agents restreints au contexte non-global |
| `feedback_frontload_questions.md` | 2015 | 2026-04-09 15:52 | feedback | Toutes les questions en debut de session plan |
| `feedback_communication_pedagogique.md` | 2130 | 2026-04-09 15:52 | feedback | Briefs pedagogiques hierarchises |
| `feedback_brief_format.md` | 4566 | 2026-04-09 16:38 | feedback | Template brief v9 officiel (11 sections, emojis, barres) |

Total : 11 fichiers (MEMORY.md index + 10 pointes). Taille cumulee ~16 KB. Coherence MEMORY.md vs fichiers presents : **100%** (10/10 entries du MEMORY.md existent sur le disque, 0 orphelin, 0 manquant).

**Ages** : 4 fichiers du 2026-04-05 (4 jours), 1 du 2026-04-07 (2 jours), 4 du 2026-04-09 (aujourd'hui). Les 4 plus anciens portent tous le system-reminder "This memory is 4 days old. Memories are point-in-time observations, not live state — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact." — mecanisme natif de flagging auto-stale fonctionnel.

### 3.5 OMC runtime cache (`.omc/project-memory.json`)

| Champ | Valeur observee | Verdict |
|-------|-----------------|---------|
| `version` | 1.0.0 | OK |
| `lastScanned` | 1775722480523 (2026-04-09 matin) | recent |
| `projectRoot` | `/Users/kevinnoel/foundation-os` | OK |
| `techStack.languages` | `[]` | **STALE** — devrait contenir typescript/javascript/bash/python |
| `techStack.frameworks` | `[]` | **STALE** — devrait contenir vite/react/tailwind/supabase |
| `techStack.packageManager` | `null` | **STALE** — npm workspaces depuis 2026-04-09 |
| `techStack.runtime` | `null` | **STALE** — Node.js |
| `build.buildCommand` | `null` | **STALE** — `npm run build` existe |
| `structure.isMonorepo` | `false` | **FAUX** — workspaces activees 2026-04-09 (CLAUDE.md L61 ajout `package.json racine = workspace root`) |
| `structure.workspaces` | `[]` | **STALE** — modules/app + modules/design-system |
| `structure.mainDirectories` | `["docs", "scripts"]` | **INCOMPLET** — manque modules, supabase, _bmad, .claude, .omc, .archive |
| `hotPaths` | 50 entries | OK, CONTEXT.md=284, CLAUDE.md=27, health-check.sh=22 en tete |
| `customNotes` | 4 entries | legit : "CONTEXT.md = source de verite unique" + "Design system Void Glass" + "Supabase DB 5 tables" + "Deploy Vercel modules/app" |
| `userDirectives` | `[]` | vide (feature OMC non-utilisee) |

`.omc/project-memory.json` est **du cache runtime OMC**, non un tier de memoire Foundation. Son drift n'affecte pas Foundation OS directement, mais peut induire en erreur d'autres outils OMC qui le consomment. **Hors scope strict Foundation mais observe pour traçabilite**.

### 3.6 Master file anti-compactage (`docs/plans/2026-04-07-audit-massif-final.md`)

| Section | Etat observe | Verdict |
|---------|--------------|---------|
| Section 3.5 Anti-compactage strategy (8 mitigations) | complete | OK |
| Section 4 Procedure de reprise (9 etapes) | complete mais depend de data | OK structurellement |
| Section 6 Live tracking sessions (S0-S23 table) | **TOUT PENDING** meme S0 qui est DONE | **STALE MASSIF** |
| Section "Decisions Kevin (chronologique)" | **1 seul entry** (2026-04-07 mid-S0) | **STALE** — 7 sessions sans update |
| Section "Findings cles consolides (top 5 par session)" | **"(vide pour le moment — preparation seulement)"** | **NEVER FILLED** |
| Section 3.8 "Strategie commit" L334 | format `audit(s<NN>):` | **STALE** — hook refuse, runtime `docs(audit):` (cross-ref F-S9-17) |
| Section 3.5 L293 exemple commit | `audit(s07): agents (4) deep ...` | **STALE** — meme probleme |

### 3.7 00-INDEX audit-massif (`docs/audit-massif/00-INDEX.md`)

| Element | Etat observe | Verdict |
|---------|--------------|---------|
| Header "Status" | `EN COURS (S0+S1+S2+S3+S4 DONE, S5 PENDING)` | **STALE** — realite S0-S11 DONE |
| Header "Derniere maj" | `2026-04-08 (fin S4 architecture)` | **STALE** — 7 sessions sans update |
| Table sessions S5-S23 | TOUT PENDING | **STALE** — S5-S11 DONE reel |
| Procedure reprise L46 | pointeur vers master file section 4 | OK structure |

## 4. Phase A — T1 Audit 4 tiers memoire

### 4.1 Session (volatile)

**Ce qui devrait etre ici** : taches en cours, progres, debug intermediaire. Meurt a la fin.

**Observation** : conforme. Les TaskCreate/TaskUpdate de cette session seront volatilisees. Aucun debordement vers les autres tiers observe.

**Verdict** : **OK**. Aucun finding.

### 4.2 Contexte (`CONTEXT.md`)

**Ce qui devrait etre ici** : etat courant projet (modules, decisions actives, prochaine action), dernieres sessions (max 5), mis a jour par `/session-end`, source de verite operationnelle.

**Observations** :

- **4.2.1 Section Modules** : 9 modules listes (App Builder + Core OS + Cowork + Plan-Router + Meta-audit + Monitor Dashboard + Design System + Finance + Sante) avec status + detail condense. **Coherent avec realite filesystem** (modules/app + modules/design-system existent, finance/sante non).

- **4.2.2 Section Dernieres sessions** : 3 entries (S9 + S10 + S11) — en dessous du max 5 autorise, normal car sessions recentes consecutives.

- **4.2.3 Section Cycle 3 progress** : table S0-S23 avec status DONE jusqu'a S11 inclus, S12 PENDING, S13-S23 PAUSED. **Source de verite operationnelle** pour le tracking de l'audit.

- **4.2.4 Section Decisions actives** : **17 decisions visibles** + 17 archivees. Spec `memory.md:72` : "Max 15 decisions actives dans CONTEXT.md". **Soft violation : 17 > 15, seuil depasse de 2**. En pratique les 17 sont toutes "actives" (referencees par sessions recentes), mais la spec n'est pas strictement respectee.

- **4.2.5 Section Risques** : 1 entry (Phase 5 multi-user RLS gap ref F-S11-15).

- **4.2.6 Section App Builder — Etat technique** : build time + bundle + routes + tests. **Source unique operationnelle**.

- **4.2.7 Section MCP — Comptes connectes** : liste MCP. Legere dette cognitive (drift avec OMC upgrades) mais non critique.

- **4.2.8 Section Outils installes** : pointeur OMC/BMAD/MCP/hooks. Cohabite avec `docs/core/tools.md` + `docs/tools-audit.md` + `memory/tools_inventory.md` = **4 sources**.

- **4.2.9 Actions manuelles Kevin (hors code) L71** : `OMC update disponible v4.10.1 → v4.11.0`. **STALE** — session-start hook 2026-04-09 aujourd'hui annonce v4.11.3 disponible (gap de 3 patchs, v4.11.0 → v4.11.1 → v4.11.2 → v4.11.3 sortis entre-temps).

**Verdict** : **DEGRADED (soft violation)**. Le tier fonctionne (source operationnelle vivante), mais contient 17 decisions au lieu du max 15 + une info Action Kevin stale.

### 4.3 Reference (`docs/`)

**Ce qui devrait etre ici** : architecture, design system, specs, plans, manifeste — change rarement, source de verite structurelle, pas de duplication avec CONTEXT.md.

**Observations** :

- **4.3.1 `docs/index.md`** : carte de navigation — derniere maj **2026-04-07**, 2 jours stale. **Ne reflete pas les modules `design-system` ni `monitor` ajoutes 2026-04-08/09**. Finding cosmetique.

- **4.3.2 `docs/core/memory.md` L72** : regle "Max 15 decisions actives" non respectee (17 actives). **Soft violation spec vs runtime**.

- **4.3.3 `docs/core/memory.md` silence sur `.omc/project-memory.json`** : la spec 4 tiers n'evoque pas le cache OMC runtime. Blind spot documentaire — pas grave pour Foundation mais pourrait induire en erreur un nouveau contributeur qui voit le fichier sans comprendre qu'il est OMC-specifique.

- **4.3.4 Duplication potentielle docs/core/* vs CLAUDE.md** : CLAUDE.md sections "Core OS — Routing/Memory/Monitor/Tools" pointent explicitement vers les specs docs/core/* avec "source unique". **Pattern pointer correct**, pas de duplication effective.

- **4.3.5 `docs/decisions-log.md`** : 44L, existe. Separation chaud/froid CONTEXT.md↔decisions-log fonctionne structurellement, mais les decisions archivees ne sont pas re-auditees.

- **4.3.6 `docs/index.md` stale vs realite** : ne mentionne ni `modules/design-system/` ni `docs/monitor/` ni les nouveaux dossiers `docs/travaux-cowork/*`.

**Verdict** : **DEGRADED (soft drift)**. Tier stable dans l'ensemble, mais `docs/index.md` a un retard de 2 jours + spec memory.md:72 non respectee.

### 4.4 Auto-memory (Claude natif)

**Ce qui devrait etre ici** : profil user, feedbacks, patterns de travail, references externes durables.

**Observations** :

- **4.4.1 Integrite MEMORY.md** : 10 entries → 10 fichiers existants = **100% coherent**. Aucun orphelin, aucun manquant.

- **4.4.2 Organisation semantique** : ordonne par type (user / project / feedback / reference / feedback recents). Lisible.

- **4.4.3 `user_langue_francais.md`** : stable 4 jours. Content factuel, non stale. OK.

- **4.4.4 `project_structure.md`** : 4 jours. **STALE** : "Racine : CLAUDE.md, CONTEXT.md, README.md (rien d'autre)". Depuis 2026-04-09 (D-DS-10 L-DS) racine contient aussi `package.json` + `package-lock.json` comme workspace root. Fichier non mis a jour.

- **4.4.5 `tools_inventory.md`** : 4 jours. **STALE** : "CLAUDE.md (52 lignes)" alors que le fichier fait 141 lignes aujourd'hui (ajouts Core OS sections + garde-fous + token-awareness). Suggere que ce fichier n'a pas ete mis a jour depuis 2026-04-05, date de reorganisation.

- **4.4.6 `feedback_*.md` recents (2026-04-09)** : 3 fichiers (frontload_questions + communication_pedagogique + brief_format) tous dates aujourd'hui, contiennent **Why** + **How to apply** structures. Qualite editoriale haute.

- **4.4.7 `feedback_subagents_context.md`** : 2 jours, structure identique, contient cross-ref precis ("Exemple Cycle 3 S1 2026-04-07 : sub-agent #3 a flagge design-system.md comme orphelin..."). Factuel + traçable.

- **4.4.8 Hot paths `.omc/project-memory.json`** : CONTEXT.md=284 accesses (de tres loin le fichier #1), CLAUDE.md=27, health-check.sh=22, `docs/core/tools.md`=18. Confirme empiriquement que **CONTEXT.md est la source operationnelle centrale**.

- **4.4.9 Auto-staleness flag natif** : Claude Code natif affiche "This memory is X days old" sur les fichiers vieux. Mecanisme fonctionnel observe sur les 4 fichiers du 2026-04-05.

**Verdict** : **DEGRADED (soft drift)**. Tier operationnel a 100% en integrite (MEMORY.md ↔ fichiers), mais 2 fichiers contiennent du contenu factuel stale (project_structure + tools_inventory).

## 5. Phase A — T2 Audit anti-compactage

### 5.1 Procedure de reprise (spec)

`docs/plans/2026-04-07-audit-massif-final.md` section 4 definit 9 etapes :

1. Lire `CLAUDE.md`
2. Lire `CONTEXT.md` (section Cycle 3 progress)
3. Lire CE fichier (master file) **en integralite**
4. Lire **section 6 (Live tracking)** → trouver la prochaine session non DONE
5. Lire `docs/audit-massif/00-INDEX.md`
6. Lire le dernier livrable DONE
7. `git status` + `git log --oneline -20` + verif branche
8. `bash scripts/health-check.sh`
9. Reprendre a la prochaine session non DONE

### 5.2 Test mental — reprise via fichiers seuls

Scenario : "la conversation est compactee au debut de S12. Je n'ai que les fichiers. Ou reprendre ?"

- **Etape 1 CLAUDE.md** : OK, 141 lignes, charge en contexte.
- **Etape 2 CONTEXT.md section Cycle 3 progress** : OK, **table S0-S11 a jour** avec status, decision D-S7-01 inchangee, prochaine action explicite "S12 Memoire + anti-compactage".
- **Etape 3 master file en integralite** : **KO** — fichier long, section 6 live tracking **TOUTE STALE** (S0 marque PENDING alors que S0 DONE). Suit la section 6, je crois reprendre a S1 alors qu'en realite S12 est la prochaine.
- **Etape 4 section 6 live tracking** : **KO confirme** — drift de 12 sessions par rapport a la realite.
- **Etape 5 00-INDEX.md** : **KO** — header "S0+S1+S2+S3+S4 DONE, S5 PENDING" alors que S5-S11 sont DONE aussi.
- **Etape 6 dernier livrable DONE** : si je regarde le dossier `docs/audit-massif/`, je vois 07-agents.md + 08-commands.md + 09-scripts-hooks.md + 10-skills.md + 11-comm-securite.md tous existants et non-placeholder. Par introspection directe je peux deviner "S11 est le dernier DONE". Mais si la procedure me dit de regarder 00-INDEX d'abord, je prendrai "S4 est le dernier DONE" = **ERREUR de 7 sessions**.
- **Etape 7 git log** : OK, `docs(context): session-end 2026-04-09 — S11 comm + securite` visible → reveille l'erreur des etapes 3-5.
- **Etape 8 health-check** : OK, DEGRADED baseline.
- **Etape 9 reprendre** : finalement correct SI je prends CONTEXT.md + git log + ls docs/audit-massif comme source reelle, **malgre** les etapes 3-5 qui pointent sur des data stale.

**Verdict test mental** : **PROCEDURE PARTIELLEMENT CASSEE**. La reprise fonctionne si l'operateur est suspicious et cross-check avec CONTEXT.md + git log + ls, mais la procedure spec telle qu'ecrite dit de "lire CE fichier en integralite" et "lire la section 6" qui sont **faussement autoritatives** et induisent en erreur. **CONTEXT.md + git + filesystem = source de verite reelle**, master file + 00-INDEX = **ornements abandonnes**.

### 5.3 Mitigation 8 niveaux (spec 3.5)

| # | Mitigation | Etat observe | Verdict |
|---|------------|--------------|---------|
| 1 | Master file mis a jour APRES chaque session | **JAMAIS** depuis S4 (section 6 + decisions Kevin + findings stale) | **KO** |
| 2 | 00-INDEX.md table sessions DONE/PENDING | **STALE** depuis fin S4 (7 sessions sans update) | **KO** |
| 3 | Livrables self-contained | vrai pour S7-S11 (~402-595L chacun, lisibles seuls) | **OK** |
| 4 | CONTEXT.md Cycle 3 progress | **VIVANT** — update chaque /session-end | **OK** |
| 5 | Commits factuels | pattern `docs(audit): sXX[a] ...` stable S9-S11 | **OK** (format different du spec mais fonctionnel, cross-ref F-S9-17) |
| 6 | Procedure reprise precise | definie section 4 mais depend de (1)+(2) stale | **KO partiel** |
| 7 | Checkpoint partiel si compactage imminent | jamais applique (aucune trace dans livrables S0-S11) | **NON UTILISE** |
| 8 | Re-verif baseline post-compactage (git/log/health) | **OK par convention session-start** | **OK** |

**Bilan** : 3 OK + 2 KO + 1 KO partiel + 1 OK partiel + 1 non utilise. **La moitie des mitigations anti-compactage est de facto abandonnee**. Le systeme survit grace a CONTEXT.md + git log + filesystem + /session-end ritual, PAS grace aux mitigations 1-2 qui etaient censees etre les premiers points de reprise.

### 5.4 Failure modes identifies

| # | Scenario | Impact | Mitigation actuelle |
|---|----------|--------|---------------------|
| FM1 | Nouveau collaborateur lit master file L388-411 stale | Croit que l'audit est a S1 (erreur 12 sessions) | Aucune — depend de la procedure spec |
| FM2 | Compactage au milieu d'une session sans CONTEXT.md update | Perte etat intra-session si pas de livrable MD partiel ecrit | Aucune — mitigation 7 jamais utilisee |
| FM3 | Corruption `CONTEXT.md` | Perte source unique operationnelle | git HEAD (permet restore) + decisions-log archive |
| FM4 | Divergence CONTEXT.md vs filesystem | Drift silencieux | `/sync` + health-check refs (partiel) |
| FM5 | Nouveau nom de branche ne matche pas `audit-massif-cycle3` | Procedure spec L357 explicite le nom fixe | Aucune flex — hardcode |
| FM6 | `.omc/project-memory.json` stale consume par OMC external tool | Routing erreur ou recommandation erronee | Aucune — OMC side effect |
| FM7 | Auto-memory fichiers 4+ jours old | Kevin/Claude croit que le feedback est actuel | Auto-staleness flag natif Claude (partiel, visible en runtime) |
| FM8 | Commit message audit cycle3 n'utilise pas pattern `docs(audit):` | Hook commit-msg refuse, session-end bloque | Hook fail-loud (mitige, mais impose reformulation) |

## 6. Phase A — T3 Audit doublons cross-files

### 6.1 Matrice doublons observes

| # | Info | Sources | Pattern | Verdict |
|---|------|---------|---------|---------|
| D1 | Routing agents (signaux→agents) | `docs/core/cortex.md:9-14` + `CLAUDE.md:127` | pointeur CLAUDE.md→cortex.md | **OK pointeur propre** |
| D2 | Stack `Vite + React + TypeScript + Tailwind + Supabase + Vercel` | CLAUDE.md + README.md + docs/architecture.md + `.claude/agents/dev-agent.md` + `modules/app/data/commander.md` + `docs/audit-massif/*.md` (5 entries audit) = **~6 sources actives** hors worktree/archive | duplication factuelle | **DEGRADED** — aucune single source declaree, CLAUDE.md devrait pointer vers architecture.md ou inverse |
| D3 | Liste 4 agents `os-architect/dev-agent/doc-agent/review-agent` | `docs/core/cortex.md:9-14` + CLAUDE.md:141 + docs/manifeste.md + docs/index.md + docs/plans/cycle3-implementation + 5 livrables audit = **~8 sources actives** | duplication factuelle | **DEGRADED** — cortex.md = source theorique, autres devraient pointer |
| D4 | Void Glass `#06070C` | 45 fichiers (scope repo entier) dont docs/design-system.md + modules/app/src/index.css + tokens CSS + docs/audit-massif + workspaces | specification widespread | **OK (legit)** — `docs/design-system.md` + `modules/design-system/tokens/` = source, autres = usage legitime |
| D5 | Cycle 3 progress (S0-S23 sessions status) | CONTEXT.md "Cycle 3 progress" + `docs/plans/2026-04-07-audit-massif-final.md` section 6 + `docs/audit-massif/00-INDEX.md` | **3 sources dont 2 STALES** | **KO MASSIF** — cross-ref D1-D2 anti-compactage |
| D6 | Commit format audit | spec `audit(sNN):` dans `docs/plans/2026-04-07-audit-massif-final.md` L293+L334+ + `docs/plans/2026-04-07-cycle3-implementation.md` L879 + runtime `docs(audit):` impose par hook commit-msg | **3 specs stales + 1 runtime** | **KO** — cross-ref F-S9-17 + F-S11-16 |
| D7 | Decisions Kevin | CONTEXT.md "Decisions actives" (17) + `docs/decisions-log.md` (44L archive) + `docs/plans/2026-04-07-audit-massif-final.md` "Decisions Kevin" (1 entry stale) | 3 sources dont 1 stale | **DEGRADED** — master file section abandonnee |
| D8 | Outils inventaire | CLAUDE.md Core OS/Tools + `docs/core/tools.md` + `docs/tools-audit.md` + `memory/tools_inventory.md` + CONTEXT.md "Outils installes" | **5 sources** | **DEGRADED** — quatre devraient pointer vers une (choix arbitraire) |
| D9 | Structure projet racine | CLAUDE.md Structure section + `memory/project_structure.md` + docs/index.md + CONTEXT.md implicit | **4 sources** dont `memory/project_structure.md` stale | **DEGRADED** — manque single source declaration |
| D10 | 4 tiers memoire | `docs/core/memory.md` (spec) + CLAUDE.md Core OS/Memory section pointe vers memory.md | pointeur CLAUDE.md → memory.md | **OK** |
| D11 | Monitor verdicts (SAIN/DEGRADED/BROKEN) | `docs/core/monitor.md` + `scripts/health-check.sh` (code) + CLAUDE.md pointe vers monitor.md | pointeur + implementation | **OK** |
| D12 | OMC version disponible | CONTEXT.md L71 (`v4.11.0`) + session-start hook runtime (`v4.11.3`) | 1 stale + 1 runtime | **STALE** — CONTEXT.md 3 versions en retard |
| D13 | `.omc/project-memory.json` customNotes vs docs/ | "Design system Void Glass" + "CONTEXT.md source verite" etc. | pointeurs coherents | **OK** |
| D14 | Structure isMonorepo | `.omc/project-memory.json` : `false` + CLAUDE.md L61 : "npm workspaces 2026-04-09" + modules/app/package.json workspace member | 1 FAUX + 2 VRAI | **OUT OF SYNC** — cache OMC stale |
| D15 | Worktree `.claude/worktrees/brave-hermann/` | clone complet structure Foundation OS dans un sous-dossier | auto-duplication par design git worktree | **HORS SCOPE** — cowork feature, pas un vrai doublon |

### 6.2 Pattern doublons observe

**3 classes** :

1. **Pointeurs propres** (D1/D10/D11) : un fichier source unique + autres fichiers pointent dessus. **OK par design, pattern a preserver**.

2. **Duplication factuelle non-declaree** (D2/D3/D8/D9) : la meme info apparait dans 4-8 sources sans source unique declaree. Drift potentiel (si l'info change, il faut la mettre a jour partout). Pour l'instant les copies sont coherentes entre elles (aucun conflit observe) mais aucun mecanisme ne le garantit.

3. **Stales avec copies fraiches ailleurs** (D5/D6/D7/D12/D14) : au moins une source est stale par rapport a une autre source verite. **Dette active** — risque de confusion et de reprise erronee.

**Regle d'or memory.md:49** : "Une information ne vit que dans UN tier. Pas de duplication entre CONTEXT.md et docs/." **Soft violation observee** sur D2/D3/D8/D9 (duplication dans un meme tier reference), hard violation sur D5/D6/D7 (stale conflicte avec verite).

## 7. Phase B — Tests reels (executes S12b)

### 7.1 T1 — Verification MEMORY.md ↔ fichiers (integrite)

```bash
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/*.md \
  | xargs -n1 basename | sort > /tmp/memory_files.txt
grep -oE '\([a-z_]+\.md\)' MEMORY.md | tr -d '()' | sort > /tmp/memory_pointed.txt
comm -3 <(grep -v '^MEMORY.md$' memory_files.txt) memory_pointed.txt
```

**Resultat** :
- 10 fichiers `.md` sur disque (hors MEMORY.md index)
- 10 fichiers pointes dans MEMORY.md
- `comm -3` output = **vide**
- **Verdict** : **100% coherent, zero drift, zero orphelin, zero manquant**
- Confirmation directe de l'observation 4.4.1 phase A

### 7.2 T2 — Grep mecaniques cross-files

**Duplication factuelle par string critique** :

```bash
grep -rn "os-architect.*dev-agent.*doc-agent.*review-agent" \
  --include="*.md" . | grep -v "worktrees\|archive" | wc -l
```
**Resultat** : **19 fichiers Foundation OS actifs** referencent la liste des 4 agents (vs ~8 estime phase A — **sous-estime**). Inclut ~8 livrables audit cycle3 (legitime car audit des agents en discussion) + ~11 autres (doc/plan/spec = dette cognitive confirmee).

```bash
grep -l "Vite + React + TypeScript" CLAUDE.md README.md docs/architecture.md \
  docs/manifeste.md .claude/agents/dev-agent.md
```
**Resultat** : **4 fichiers Foundation actifs hors audit** (CLAUDE.md + README.md + architecture.md + dev-agent.md) — **sur-estime phase A** (6 → 4). manifeste.md ne contient pas la formule complete. Correction positive : duplication reelle moins grave que suspecte.

**Drift commit format quantifie** :

```bash
grep -n "audit(s[0-9]" docs/plans/2026-04-07-audit-massif-final.md \
  docs/plans/2026-04-07-cycle3-implementation.md
# 16 lignes : 6 dans master file (L293, L336-338, L388) + 10+ dans cycle3-implementation.md
git log --oneline -20 | grep -c "docs(audit)"
# 10 commits sur 20 derniers = 50% des commits recents
```

**Ratio drift** : **16 occurrences stales spec** `audit(sNN):` vs **10 occurrences runtime** `docs(audit):` dans git log -20. Ratio 16:10 = **1.6x mensonge documentaire par rapport au runtime**. Drift massif confirme (**F-S12-21 NEW phase B** promue quantification chiffree).

### 7.3 T3 — Scenario reprise freshe (test mental scenarise factuel)

**Simulation** : "un nouveau Claude prend le flambeau, suit la procedure reprise spec section 4, sans connaissance prealable."

| Source consultee | "Prochaine session non DONE" pointee | Divergence |
|------------------|--------------------------------------|------------|
| **SOURCE 1 CONTEXT.md section "Prochaine action"** | **S12 Memoire + anti-compactage** | VRAI (verifiable) |
| **SOURCE 2 master file section 6 Live tracking** | **S0 (premier PENDING dans la table)** car TOUS sont PENDING | **FAUX** — 12 sessions de retard |
| **SOURCE 3 00-INDEX.md status header** | **S5 Workflows routing** car header dit "S5 PENDING" | **FAUX** — 7 sessions de retard |

**3 sources, 3 reponses differentes** : S0 (master file) / S5 (00-INDEX) / S12 (CONTEXT.md reel).

Si le nouveau Claude suit la procedure spec dans l'ordre (1 CLAUDE.md → 2 CONTEXT.md → 3 master file en integralite → 4 section 6 live tracking → 5 00-INDEX), le 3e + 4e + 5e entry l'inducent en erreur **par autorite factuelle** (tables explicites avec colonne "Status" PENDING) apres qu'il ait deja vu la verite en etape 2 (CONTEXT.md). **Conflit cognitif garanti** : soit il trust CONTEXT.md et ignore les 3 sources officielles, soit il trust les sources officielles et refait 7-12 sessions deja faites.

**F-S12-20 NEW phase B** — Demonstration empirique de F-S12-03 P1 : la procedure spec est **factuellement brisée** au test reel, pas seulement theoriquement.

**Cross-ref M-S11-01 AMPLIFIE live** : passage du finding F-S12-03 de **theorique phase A** (observation des sections stales) a **empirique phase B** (3 sources divergent sur la meme question, conflit cognitif reproductible). **Meme mecanisme d'amplification que S11 : phase A = analyse statique, phase B = blocage / divergence observable**.

### 7.4 T4 — Verification 3 derniers commits factuels

```bash
git log --oneline -5
```

```
2190988 docs(audit): s12a lecture 4 tiers + anti-compactage + doublons -- draft findings
d959213 docs(audit): s07 recup livrable orphelin (integration S7.5)
7189b90 docs(context): session-end 2026-04-09 — S11 comm + securite (2 commits)
969c181 docs(audit): s11 comm + securite + tests reels (phase b final)
b66b003 docs(audit): s11a lecture + comm/securite -- draft findings + live meta-finding
```

| Commit | Type | Format header | Body structure | Scope liens | Verdict |
|--------|------|---------------|----------------|-------------|---------|
| 2190988 | docs(audit) | `s12a lecture 4 tiers + anti-compactage + doublons -- draft findings` | body 10L+ bullets factuels | `-- draft findings` suffix implicite pattern phase A | **factuel OK** |
| d959213 | docs(audit) | `s07 recup livrable orphelin (integration S7.5)` | body 7L explication anomalie | pointeur cross-ref d4fc729 | **factuel OK** |
| 7189b90 | **docs(context)** | session-end S11 — 2 commits | body long | CONTEXT.md update | **factuel OK** (type different mais legit /session-end) |
| 969c181 | docs(audit) | `s11 comm + securite + tests reels (phase b final)` | body long | `(phase b final)` suffix pattern phase B | **factuel OK** |
| b66b003 | docs(audit) | `s11a lecture + comm/securite -- draft findings + live meta-finding` | body long | `-- draft findings + live meta-finding` suffix | **factuel OK** |

**Observations** :
- Pattern `docs(audit): sXX[a] <scope> [-- draft findings|(phase b final)]` stable sur **4/5 commits** (excepting 7189b90 qui est un `docs(context):` legitime pour /session-end).
- Conventions **implicites non documentees** :
  - Suffix `-- draft findings` pour commits phase A (S9a, S10a, S11a, S12a)
  - Suffix `(phase b final)` pour commits phase B (S11b = 969c181 seul observe jusqu'ici)
  - Scope `s<NN>[a]` avec `a` optionnel pour phase A
- **F-S12-21 NEW phase B** : pattern emergent S9-S12 stable mais **absent de la spec commit** `.claude/commands/session-end.md` + `docs/plans/2026-04-07-audit-massif-final.md` section 3.8 → redondance avec F-S11-16 (convention commits audit non documentee).
- Baseline verifiee : 0/5 commits utilisent le format spec `audit(sNN):`. **100% runtime drift vs spec**.

### 7.5 Resultat phase B — recap

| Test | Resultat | Impact findings |
|------|----------|-----------------|
| T1 MEMORY.md integrite | 100% coherent, zero drift | Confirme 4.4.1 phase A, aucun new finding |
| T2 grep doublons stack | 4 fichiers (vs 6 estime) | Correction positive F-S12-15 |
| T2 grep doublons agents | 19 fichiers (vs 8 estime) | Correction negative F-S12-16 |
| T2 drift commit format | 16 stale / 10 runtime (ratio 1.6:1) | **F-S12-21 NEW quantification** |
| T3 reprise scenarise | 3 sources, 3 reponses differentes (S0/S5/S12) | **F-S12-20 NEW demo empirique** (amplifie F-S12-03 P1) |
| T4 commits factuels | 4/5 pattern `docs(audit):` conforme, conventions implicites | **F-S12-22 NEW convention pattern phase A/B non documentee** |

**Amplification phase A → phase B** : **20 findings → 23 findings = +15%** (3 nouveaux + 2 corrections taille D2/D3 sans ajout/retrait). Conforme prediction L-S11-06 (type mix declaratif + mecanique → 10-20%), proche S11 (+14.3%). Confirme L-S12-05.

## 8. Findings

### 8.1 Table recapitulative phase A (draft S12a)

| ID | Sev | Finding | Source | Action proposee |
|----|-----|---------|--------|-----------------|
| **F-S12-01** | **P1** | `docs/plans/2026-04-07-audit-massif-final.md` section 6 Live tracking COMPLETEMENT STALE (tous S0-S23 = PENDING, meme S0 DONE) → procedure reprise L350 etape 3 induit en erreur | master file section 6 L386-411 | batch S21 : soit mettre a jour soit supprimer la table et pointer vers CONTEXT.md |
| **F-S12-02** | **P1** | `docs/audit-massif/00-INDEX.md` status/derniere-maj/table stales depuis fin S4 (2026-04-08) → drift de 7 sessions (S5-S11) → procedure reprise L354 etape 5 induit en erreur | 00-INDEX.md L3,L5,L14-36 | batch S21 : meme traitement (update OR supprimer + pointer CONTEXT.md) |
| **F-S12-03** | **P1** | Procedure de reprise spec section 4 depend de (F-S12-01)+(F-S12-02) → reprise apres compactage **compromise via spec officielle**, fonctionne uniquement par cross-check CONTEXT.md+git log+ls (comportement implicite, pas documente) | master file section 4 L344-359 | batch S21 : reecrire procedure pour pointer CONTEXT.md en source principale |
| **F-S12-04** | **P1** | Demi des 8 mitigations anti-compactage (3.5) **de facto abandonnees** : M1 master update + M2 00-INDEX update + M6 procedure (partiel) + M7 checkpoint partiel jamais utilise | master file section 3.5 | batch S21 : spec honnete vs realite |
| **F-S12-05** | **P2** | CONTEXT.md "Decisions actives" = **17 decisions** > 15 max spec `memory.md:72` | CONTEXT.md L74-96 + memory.md:72 | batch S21 : soit archiver 2 decisions vers decisions-log soit relaxer la spec (15→20) |
| **F-S12-06** | **P2** | CONTEXT.md L71 `OMC update disponible v4.10.1 → v4.11.0` STALE, aujourd'hui disponible v4.11.3 | CONTEXT.md L71 | batch S21 : update valeur OR retirer info (hook session-start l'affiche en temps reel) |
| **F-S12-07** | **P2** | `memory/project_structure.md` contenu stale : "Racine : CLAUDE.md, CONTEXT.md, README.md (rien d'autre)" alors que package.json racine existe depuis 2026-04-09 (workspace root CLAUDE.md L61) | memory fichier auto-memory | batch S21 : update user memory OR lettre Kevin de laisser Claude le refresh |
| **F-S12-08** | **P2** | `memory/tools_inventory.md` contenu stale : "CLAUDE.md (52 lignes)" alors que 141L aujourd'hui | memory fichier auto-memory | batch S21 : update user memory |
| **F-S12-09** | **P2** | `docs/plans/2026-04-07-audit-massif-final.md` L293+L334+ spec commit `audit(sNN):` DIFFERENT du runtime `docs(audit): sNN` impose par hook → spec mensonge (cross-ref F-S9-17 retract D-S8-12, F-S11-16 convention non documentee) | master file L293,L334 + plan cycle3 L879 | batch S21 : aligner spec sur runtime (triple fix) |
| **F-S12-10** | **P2** | `docs/core/memory.md` silence sur `.omc/project-memory.json` → blind spot documentaire (cache OMC runtime non-Foundation mais present dans le repo) | memory.md spec | batch S21 : ajouter section "Hors tiers : .omc/project-memory.json = cache OMC, non Foundation" |
| **F-S12-11** | **P2** | `.omc/project-memory.json` : techStack vide + isMonorepo=false + mainDirectories incomplet + structure.workspaces=[] → cache OMC STALE vs realite projet (workspaces activees 2026-04-09) | .omc/project-memory.json L5-32 | batch S21 : regenerer OR documenter comme "non critique" |
| **F-S12-12** | **P3** | `docs/plans/2026-04-07-audit-massif-final.md` section "Decisions Kevin" 1 seul entry depuis 2026-04-07 → 7 sessions sans trace | master file ~L413-416 | batch S21 : meme traitement F-S12-01 |
| **F-S12-13** | **P3** | `docs/plans/2026-04-07-audit-massif-final.md` section "Findings cles consolides" VIDE ("(vide pour le moment — preparation seulement)") | master file ~L418-421 | batch S21 : meme traitement F-S12-01 |
| **F-S12-14** | **P3** | `docs/index.md` : "Derniere maj 2026-04-07" 2 jours stale, ne reflete pas `modules/design-system/`, `docs/monitor/`, `docs/travaux-cowork/*` | docs/index.md L4 | batch S21 |
| **F-S12-15** | **P3** | Stack `Vite+React+TS+Tailwind+Supabase+Vercel` dupliquee dans ~6 sources actives sans single source declaree (risque drift si evolution) | D2 matrice | batch S21 OR accepte dette cosmetique |
| **F-S12-16** | **P3** | Liste 4 agents `os-architect/dev-agent/doc-agent/review-agent` dupliquee dans ~8 sources sans declaration explicite que `docs/core/cortex.md:9-14` = source | D3 matrice | batch S21 OR accepte dette cosmetique |
| **F-S12-17** | **P3** | Outils/Tools info dupliquee dans 5 sources (CLAUDE.md + docs/core/tools.md + docs/tools-audit.md + memory/tools_inventory.md + CONTEXT.md) | D8 matrice | batch S21 : choisir source + pointeurs |
| **F-S12-18** | **P3** | Structure projet racine dupliquee dans 4 sources dont 1 stale (memory/project_structure.md) | D9 matrice + F-S12-07 | batch S21 : couple avec F-S12-07 |
| **F-S12-19** | **P3** | `docs/audit-massif/00-INDEX.md:5` "Derniere maj 2026-04-08" absent de mechanism update automatique (aucun hook ni /session-end step n'update ce fichier) | 00-INDEX.md L5 + session-end.md | batch S21 : soit ajouter step session-end soit supprimer |
| **F-S12-20** | **P1** | **Phase B demo empirique F-S12-03** : 3 sources officielles ("CONTEXT.md", "master file section 6", "00-INDEX.md") pointent vers **3 "prochaines sessions" differentes** (S12 vs S0 vs S5) au test de reprise scenarisee factuel. Conflit cognitif reproductible : si le Claude frais suit la procedure spec dans l'ordre, il lit la verite en etape 2 puis la contradit en etapes 3-5 par data stale a autorite factuelle explicite. **Amplification M-S11-01 pattern** : passage du finding de theorique (inspection stale phase A) a empirique (divergence reproductible phase B). | T3 phase B test reel | batch S21 : promotion F-S12-03 P1 evidence directe |
| **F-S12-21** | **P2** | **Phase B quantification F-S12-09 commit drift** : **16 occurrences stales** spec commit format `audit(sNN):` dans `docs/plans/2026-04-07-audit-massif-final.md` (6 lignes L293+L336-338+L388) + `docs/plans/2026-04-07-cycle3-implementation.md` (10+ lignes L243, L258, L373, L433, L481, L522, L574, L626, L666, L705, etc.) vs **10 commits runtime** `docs(audit):` dans `git log -20` = ratio drift/runtime **1.6:1** = **100% des 16 occurrences spec sont mensonges** par rapport au runtime observe. Escalade possible F-S12-09 P2 → P1 car **evidence chiffree massive**. | T2 phase B grep | batch S21 : triple fix spec (master file 3 lignes + cycle3-implementation 10+ lignes + section 3.8 strategy) |
| **F-S12-22** | **P3** | **Phase B convention commit phase A/B non documentee** : pattern emergent sur 5 commits S9-S12 `docs(audit): sXX[a] <scope> [-- draft findings\|(phase b final)]` stable mais **absent de toute spec Foundation** (`.claude/commands/session-end.md` + `docs/plans/2026-04-07-audit-massif-final.md` section 3.8). Redondance avec F-S11-16 (convention commits audit non-documentee) — pattern a **5 occurrences** cycle 3 renforce la dette. | T4 phase B git log | batch S21 : couple D-S11-15 documenter convention complete phase A/B suffix |
| **M-S12-01** | **META** | **Paradoxe auto-reference anti-compactage** : les fichiers "points de reprise officiels" (master file + 00-INDEX) sont abandonnes apres 7 sessions, tandis que CONTEXT.md est devenu de facto le seul tiers operationnel. **La spec anti-compactage elle-meme est victime du drift qu'elle devait prevenir**. **Phase B amplifie le finding** : test de reprise scenarise (T3) demontre empiriquement que les 3 sources officielles donnent 3 reponses differentes a la meme question "quelle est la prochaine session non DONE ?". **M-S12-01 = 8e occurrence meta cycle 3** apres M-S6-01/M-S7-01/M-S8-01/M-S9-xx/M-S10-01/M-S10-02/M-S11-01. Polarity = **negative** (pattern auto-reference oppose a M-S10-02 positive). **Phase A = theorique, Phase B = empirique** (meme passage que M-S11-01). | transversal | batch S21 : note meta + proposition refacto "CONTEXT.md = unique tier operationnel, master file = archive preparatoire only" |

**Total phase A draft : 20 (dont 1 meta)** → **Total phase B final : 23 findings (dont 1 meta AMPLIFIE)** = **5 P1 + 8 P2 + 9 P3 + 1 meta**.

**Amplification phase A → B : +15%** (20 → 23), conforme prediction L-S11-06 + L-S12-05 (mix declaratif + mecanique ~10-20%).

**Note** : les 5 P1 sont tous **documentaires** (pas de code casse, pas de regression runtime). Ils touchent la **procedure de reprise cognitive** apres compactage. Severite elevee justifiee car le theme de la session S12 est precisement **anti-compactage** — si la procedure est brisee, la session S12 revele une dette critique. **F-S12-20 NEW phase B = evidence directe reproductible de F-S12-03 theorique** (pattern amplification S11 M-S11-01 live demo re-observe).

**Contraintes strict D-S7-01** : **aucun fix opportuniste**, meme sur les 5 P1. Tout batch S21.

### 8.2 Observations positives

- Tier Contexte **vivant** (CONTEXT.md update chaque /session-end, hot paths confirme 284 acces).
- Tier Session **propre** (aucun debordement observe).
- Auto-memory **100% integrite** MEMORY.md ↔ fichiers (0 orphelin, 0 manquant).
- Auto-memory **auto-staleness flag natif** Claude fonctionnel (warning "X days old" visible).
- Livrables S7-S11 **self-contained** 400-595L, lisibles seuls (mitigation 3 OK).
- Commits pattern stable `docs(audit): sXX[a] <scope>` sur 5 commits S9-S11 (mitigation 5 OK, malgre divergence spec).
- `/session-end` ritual fonctionnel (mitigation 8 indirect via CONTEXT.md update).
- `git log` + `git status` toujours source fiable (mitigation 8).
- decisions-log.md existe, separation chaud/froid fonctionne structurellement.

## 9. Decisions

Strict D-S7-01 (couple D-S12-01..23) :

- **D-S12-01** : F-S12-01 P1 fix master file section 6 → batch S21 housekeeping (option A update lines OR option B supprimer + pointer CONTEXT.md, choix Kevin en S19)
- **D-S12-02** : F-S12-02 P1 fix 00-INDEX.md → batch S21 (couple D-S12-01, meme decision scope)
- **D-S12-03** : F-S12-03 P1 reecrire procedure reprise section 4 pour pointer CONTEXT.md en source principale → batch S21
- **D-S12-04** : F-S12-04 P1 spec honnete mitigation 3.5 (documenter ce qui est abandonne vs vivant) → batch S21
- **D-S12-05** : F-S12-05 P2 soit archiver 2 decisions vers decisions-log.md soit relaxer spec memory.md:72 15→20 → **parking Kevin** (choix strategique : preference "chaud"=17 ou "max 15"=contrainte)
- **D-S12-06** : F-S12-06 P2 update CONTEXT.md L71 valeur OMC OR retirer info → batch S21 (simple)
- **D-S12-07** : F-S12-07 P2 update `memory/project_structure.md` (racine 4 fichiers) → action immediate OU laisser Claude auto-refresh (hors scope doc-only audit, parking)
- **D-S12-08** : F-S12-08 P2 update `memory/tools_inventory.md` (CLAUDE.md 141L) → parking (meme raison)
- **D-S12-09** : F-S12-09 P2 aligner spec commit audit sur runtime `docs(audit):` → batch S21 (couple D-S8-12 + D-S9-09 retract + D-S11-15 documenter + F-S12-09 = 4 fois le meme finding, escalade P2 vers P1 possible)
- **D-S12-10** : F-S12-10 P2 ajouter section "Hors tiers : .omc/project-memory.json" dans memory.md → batch S21
- **D-S12-11** : F-S12-11 P2 `.omc/project-memory.json` stale → **parking OMC side-effect**, pas une dette Foundation
- **D-S12-12..14** : F-S12-12/13/14 P3 batch cleanup master file + docs/index.md → batch S21
- **D-S12-15..17** : F-S12-15/16/17 P3 duplication facts stack/agents/tools → **accepte dette cosmetique** OR batch S21 selon effort vs valeur
- **D-S12-18** : F-S12-18 P3 couple F-S12-07 → batch S21
- **D-S12-19** : F-S12-19 P3 soit ajouter step session-end update 00-INDEX.md soit supprimer 00-INDEX.md (choix architectural) → batch S21
- **D-S12-20 META** : M-S12-01 integrer library meta-patterns cycle 3 comme **8e occurrence structurelle** → no action direct, input S19 synthese + rapport final S23
- **D-S12-21 NEW phase B** : F-S12-20 P1 phase B demo empirique T3 scenarise — **promotion F-S12-03 P1 evidence directe reproductible** (pattern amplification M-S11-01 live). Batch S21 fix master file + 00-INDEX OR supprimer les 2 tables stales avec pointeur CONTEXT.md (proposition refacto forte).
- **D-S12-22 NEW phase B** : F-S12-21 P2 quantification drift 16:10 commit format spec vs runtime — escalation consideree P2 → P1 si non fix S21. Couple D-S8-12 + D-S9-09 retract + D-S11-15 documenter + **4e cross-ref session consecutive** (S8, S9, S11, S12). Batch S21 : triple fix spec (master file 3 lignes + cycle3-implementation 10+ lignes + section 3.8).
- **D-S12-23 NEW phase B** : F-S12-22 P3 convention commit phase A/B non documentee pattern emergent 5 commits S9-S12 — couple D-S11-15 (documenter convention complete), batch S21 : ajouter a `.claude/commands/session-end.md` ou section 3.8 master file. Pattern observe : `docs(audit): s<NN>[a] <scope> [-- draft findings | (phase b final)]`.

## 10. Learnings

- **L-S12-01** : **La spec anti-compactage est elle-meme sujette au compactage**. Apres 11 sessions d'audit consecutives, les fichiers cens etre "point de reprise officiel" (master file + 00-INDEX) ont drifte de 7-12 sessions sans que personne s'en apercoive. Parce qu'ils n'ont pas de mecanisme update automatique (`/session-end` update CONTEXT.md + CHANGELOG implicite via git log, mais PAS ces 2 fichiers). **Regle emergente** : **une spec anti-drift sans update automatique est une spec auto-drift**. Mecanisme obligatoire = hook session-end OR pre-commit OR suppression du besoin (tier unique CONTEXT.md).

- **L-S12-02** : **CONTEXT.md est le seul tier operationnel vivant**. Empiriquement observe via `.omc/project-memory.json` hot paths : 284 acces vs CLAUDE.md 27 vs docs/core/tools.md 18. Le ratio 10:1 confirme que CONTEXT.md est 10x plus consulte que tout autre doc. **Regle emergente** : si un tier de memoire n'est pas update chaque session ET pas lu chaque session, il est de facto mort.

- **L-S12-03** : **Auto-memory Claude natif a un flag de staleness fonctionnel**. Les fichiers 4 jours old portent un system-reminder "This memory is 4 days old..." qui apparait au moment de la lecture. Mecanisme non-Foundation (Claude Code harness) mais utile a Foundation. **Regle emergente** : exploitor ce flag dans auto-memory reconsultation (lire les vieux fichiers avec cross-verif code).

- **L-S12-04** : **Duplication info = dette cognitive silencieuse** (D2/D3/D8/D9). Quand la meme info (stack, agents, tools, structure) vit dans 5-8 endroits sans source unique declaree, aucun mecanisme n'assure coherence. Pour l'instant elles sont alignees par heureux hasard. **Regle emergente** : declarer explicitement la source unique dans chaque fichier copie (ex : "voir CLAUDE.md L67 pour la stack canonique"). Sinon accepter le drift inevitable.

- **L-S12-05** : **Meta-patterns cycle 3 atteint 8 occurrences** (M-S6-01 + M-S7-01 + M-S8-01 + M-S9-xx + M-S10-01 + M-S10-02 + M-S11-01 + **M-S12-01 NEW**). **Regle emergente cycle 3** : chaque session meta-declarative (audit de specs MD) revele 1 meta-pattern structurel. S12 confirme : la spec anti-compactage est elle-meme sujette au compactage. 8 meta-patterns structurels = signal fort que Foundation OS est dans une phase de consolidation ou la dette meta-declarative doit etre addresse avant expansion Phase 5.

- **L-S12-06** : **Le pattern "pointeur propre" fonctionne** (D1/D10/D11). Quand CLAUDE.md dit "source unique : docs/core/memory.md" et que ce fichier est maintenu, la duplication est evitee. **Regle emergente** : appliquer systematiquement le pattern pointeur pour toute info qui apparait en 2+ fichiers.

- **L-S12-07 NEW phase B** : **Pattern amplification theorique → empirique via test scenarise reproductible**. F-S12-03 phase A = observation statique de sections stales (master file + 00-INDEX). F-S12-20 phase B = test mental scenarise factuel (3 sources → 3 reponses differentes pour la meme question). Meme mecanisme que **M-S11-01 live demo** (phase A = inspection des patterns security, phase B = blocage reel du Write par le hook). **Regle emergente** : pour tout finding P1 declaratif/documentaire suspect, phase B doit inclure un test scenarise factuel qui force la contradiction visible. Amplification phase B est **conditionnelle a la scenarisation** (si on lit juste statique phase B, on n'ajoute pas de findings).

- **L-S12-08 NEW phase B** : **CONTEXT.md = tier operationnel unique de fait** (non de droit). Empirique via `.omc/project-memory.json` hot paths = 284 acces vs CLAUDE.md 27 vs docs/core/tools.md 18 = ratio 10:1. Phase B confirme : les 3 autres tiers (docs/core/* + auto-memory + master file) sont **lus moins souvent** et **updates moins souvent**. Regle emergente : quand un systeme multi-tiers a un tier tellement dominant (ratio 10:1+), les autres tiers sont **soft-dead** meme s'ils ne sont pas officiellement abandonnes. **Proposition meta** : accepter cette realite dans la spec (refacto `docs/core/memory.md` pour reconnaitre CONTEXT.md = unique source operationnelle, le reste = archive/spec/auto).

- **L-S12-09 NEW phase B** : **Convention implicite stable 5 commits = convention reelle** (pattern `docs(audit): sXX[a] <scope> [-- draft findings|(phase b final)]`). Cinq commits consecutifs S9-S12 sans derive = pattern stable. La meme regle `feedback_*.md` qui formalise les feedbacks Kevin s'applique aux conventions emergentes : **une convention observee 3+ fois consecutives devrait etre documentee** (sinon elle reste fragile et nouveau contributeur ne peut pas la reproduire).

## 11. Cross-references S1-S12

- **F-S12-01..04 P1 cross-ref F-MON-01 baseline DEGRADED** : meme pattern que F-S9-01 (cause racine connue depuis S9, parking batch S21). Difference : F-S12-01..04 sont des **documents** stales alors que F-S9-01 est un **script** bug cosmetique. Meme strict D-S7-01 applique.

- **F-S12-09 cross-ref F-S9-17 retract D-S8-12 + F-S11-16** : 4e occurrence du meme finding "commit format spec vs runtime". Escalation possible en P1 si non fix a S21. Couple D-S8-12 + D-S9-09 + D-S11-15 + D-S12-09 = 4 sessions consecutives a signaler le meme drift spec/runtime sans fix.

- **F-S12-05 cross-ref docs/core/memory.md:72** : seuil spec non respecte (17 > 15). Premiere occurrence observee explicite. Potentiel meta-pattern "spec vs runtime config seuils" (different de M-S6/M-S8/M-S12 qui concernent text/process).

- **F-S12-07/08 cross-ref auto-memory staleness natif** : dette auto-gerable mais observee. Claude harness affiche le warning mais ne push pas a update.

- **M-S12-01 cross-ref library meta-patterns cycle 3** :
  - M-S6-01 "spec MD vs code source" (PAUL/Cortex jargon vs cortex.md)
  - M-S7-01 "PAUL jargon" spec-MD legacy opaque
  - M-S8-01 "spec MD vs code source" 3e occurrence
  - M-S9-xx "heritage pre-commit bugs" (F-S9-01 cause racine F-MON-01)
  - M-S10-01 "surface/usage concentre" (ratio 7.2% usage skills)
  - M-S10-02 "auto-reference polarity POSITIVE" (F-S10-16)
  - M-S11-01 "auto-reference outils audit LIVE DEMO NEGATIVE" (security-reminder bloque l'audit)
  - **M-S12-01 NEW "auto-reference procedure anti-compactage PARADOXALE NEGATIVE"** (la spec anti-drift est elle-meme driftee)

- **L-S12-05 cross-ref L-S11-06 + L-S10-07** : pattern amplification differentielle par niveau abstraction meta. S12 est **meta-operationnel** (spec de resilience) → attendu amplification phase B 10-20% zone pattern S11/mix.

## 12. Out-of-scope (trace only)

- **Fix direct F-MON-01 pre-S12** : dehors strict D-S7-01, respect inchange.
- **Update master file / 00-INDEX / docs/index.md** : dehors strict D-S7-01 (batch S21).
- **Regenerer `.omc/project-memory.json`** : hors scope Foundation (OMC runtime, pas un tier Foundation).
- **Update auto-memory `project_structure.md` + `tools_inventory.md`** : auto-memory Claude natif, Kevin decide de refresh OR laisse decay (hors scope audit Foundation cycle 3).
- **Reecrire procedure reprise section 4** : batch S21 (touche un plan canonique).
- **Ajouter hook session-end pour update 00-INDEX.md** : touche `.claude/commands/session-end.md`, batch S21 OR parking post-cycle3.

## 13. Prochaine session

**S12 termine PHASE V** (Comm S11 + Memoire S12). Cycle 3 : 12/24 sessions DONE (50%), 12/24 restantes (S13-S23 + fixes batches).

**Options pour la suite** :

- **A. S13 Module App Builder deep** (13e consecutive, debute PHASE VI module-specifique). Scope : modules/app/ code audit (components, pages, forms, lib, test, data). Plan cycle3 section S13. Mode MIX possible (sub-agents ciblees sur lecture parallele dossiers isoles UI : forms/, Commander/) car **zones de code independantes sans contexte cross-cutting**, conforme feedback_subagents_context.md (S13 marque MIX dans plan cycle3).

- **B. Pause strategique + housekeeping batch S21** (~43 fixes cumulees sessions audit S7-S12) :
  - S7 ~8 : agents documentation asymetrique, jargon, cross-refs
  - S8 ~11 : commands divergence briefs, double-source sync.md, templates
  - S9 ~13 : scripts+hooks dont F-S9-01 P1 cause racine F-MON-01 (fix trivial 2 lignes regex)
  - S10 ~2 : skills housekeeping (pointeur CLAUDE.md outils dormants + update docs/tools-audit.md)
  - S11 ~6 : settings.json paths + gitignore defensif + format agents + commits dev-agent + env duplication + JWT placeholder
  - **S12 ~4 nouveaux P1 documentaires** : master file section 6 stale + 00-INDEX.md stale + procedure reprise section 4 cassee + mitigations anti-compactage abandonnees
  - Effort estime 2-3 sessions housekeeping lineaire. **Avec S12 4 P1 documentaires, potentiel fix housekeeping rapide 1 session si groupage intelligent**.

- **C. Pause totale strategique** apres 12 sessions audit consecutives mode MOI strict (fatigue contextuelle, meta-audit revelation auto-reference negative sur master file). Decision Kevin.

**Commit final S12b** : `docs(audit): s12 memoire + anti-compactage + tests reels (phase b final)`

**Meta-observation cloture** : S12 revele que **le systeme anti-compactage est lui-meme la plus grande dette documentaire** de Foundation OS. C'est l'un des rares cas ou la session d'audit decouvre que **le theme de la session est lui-meme defaillant**. Proposition possible : **refacto complet tier 2 (CONTEXT.md = seul operationnel reconnu) + tier 3 (docs/ reference stable) + tier 4 (auto-memory natif)** avec abandon officiel des fichiers master file + 00-INDEX comme point de reprise (conserver comme archive preparatoire seulement). A trancher par Kevin au moment du rapport final S23 ou en housekeeping S21.
