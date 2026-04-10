# Cycle 3 — S7 Agents (4) deep + tests reels

> **Status** : DONE 2026-04-08
> **Mode** : MOI strict (0 sub-agent invoque — 7e session consecutive S2-S7)
> **Scope** : 4 fichiers .claude/agents/*.md (193L total) + cross-refs vers cortex.md, docs/core/*.md, scripts/, .claude/commands/
> **Branche** : `audit-massif-cycle3` | **Baseline** : DEGRADED maintenu 11 refs cassees (Kevin Cowork parallel)
> **Note pre-audit** : drift CONTEXT.md detecte + fixe en debut de session (voir section 9 Collaterals)

## 1. Objectif

Verifier que les 4 agents specialises de Foundation OS (os-architect, dev-agent, doc-agent, review-agent) sont coherents, leurs triggers distincts et fonctionnels, leurs cross-refs intactes, et leur methodologie exploitable. Test reel = impossible (mode MOI strict = 0 invocation reelle), donc test = simulation d'invocation + verification match description vs cortex.md table routing.

Question meta : les agents sont dormants depuis S2 (7 sessions). Accumulent-ils une dette silencieuse (refs/jargon opaque) invisible tant qu'ils ne sont pas invoques ?

## 2. Methodologie

Decoupage 4 phases (pattern condense vs S4/S5/S6 A-F parce que scope reduit 193L vs 461L S6) :

| Phase | Scope | Status |
|-------|-------|--------|
| A | Lectures paralleles 4 agents + 7 docs reference (cortex, architecture, design-system, architecture-core, memory, monitor, settings.json) + plan S7 | DONE |
| B | Audit frontmatter + descriptions + trigger words (4 agents x 3 angles) | DONE |
| C | Audit workflow/methodo + cross-refs resolution (4 agents x 2 angles) | DONE |
| D | Tests d'invocation simulee (12 inputs = 3 par agent) + match description vs cortex | DONE |
| E | Livrable + consolidation findings/decisions/learnings | DONE |
| F | Commit | DONE |

Mode MOI strict : 0 sub-agent invoque (7e session consecutive S2-S7 — imperatif CLAUDE.md L16 applique). Aucun fix applique sur agents (mode doc-only audit, conforme S2-S6), **SAUF** fix CONTEXT.md pre-S7 (paths drift Kevin Cowork rename, voir section 9).

## 3. Inventaire Phase A

### 3.1 Fichiers agents scannes

| # | Fichier | Lignes | Frontmatter | Role |
|---|---------|--------|-------------|------|
| 1 | `.claude/agents/os-architect.md` | 50 | name + description | Architecte (decisions, stack, schema, structure) |
| 2 | `.claude/agents/dev-agent.md` | 52 | name + description | Code React/TS/Tailwind/Supabase/Vercel |
| 3 | `.claude/agents/doc-agent.md` | 51 | name + description | Documentation CONTEXT.md + docs/ + data/ |
| 4 | `.claude/agents/review-agent.md` | 40 | name + description | Coherence, audit, zero regression |

Total : **193 lignes** pour les 4 agents. Asymetrie : dev-agent le plus long (52L) sans section methodo ; review-agent le plus court (40L) avec Methode + Rapport structures.

### 3.2 Fichiers de reference lus (cross-check)

| Fichier | Role | Utilise pour |
|---------|------|--------------|
| `docs/core/cortex.md` | Source unique routing + agents | Cross-check triggers cortex table vs frontmatters |
| `docs/core/architecture-core.md` | Structure Core OS | Contexte os-architect |
| `docs/core/memory.md` | 4 tiers persistence | Contexte doc-agent + check PAUL ref |
| `docs/core/monitor.md` | Seuils + health indicators | Contexte dev-agent + review-agent |
| `docs/architecture.md` | Architecture generale | Contexte os-architect |
| `docs/design-system.md` | Void Glass tokens | Contexte dev-agent |
| `.claude/settings.json` | Hooks + permissions | Cross-check frontmatter fields dispo |
| `docs/plans/2026-04-07-cycle3-implementation.md:632-667` | Task S7 | Cadrage plan original |

### 3.3 Observations initiales

- **0 mot interdit** dans les 4 agents (grep `revolution|historique|mondial|accomplish|achieve|world-first` → 1 false positive sur "Artifacts JSX historiques archives" = legitime, pas bullshit marker)
- **0 auto-reference sub-agent** (aucun agent n'invoque un autre agent via Task tool — bon, pas de dependency cycle)
- **Frontmatter minimaliste** : tous 4 agents utilisent uniquement `name:` + `description:` — pas de `model:`, pas de `tools:`. Decision implicite = herite du contexte invocant.

## 4. Phase B — Frontmatter + descriptions + triggers

### 4.1 Frontmatter structure

Tous les 4 agents ont la meme structure minimale :

```yaml
---
name: [agent-name]
description: >
  [description multi-lignes avec triggers]
---
```

**Observation F-S7-01** : Aucun agent ne specifie `model:` ni `tools:`. Consequences :
- Aucun moyen de contraindre un agent a un set de tools specifique (e.g. doc-agent ne devrait pas avoir besoin de Bash(npm))
- Aucun moyen de forcer un model per-agent (e.g. os-architect = opus pour reasoning profond)
- Decision implicite = acceptation tool complet + model herite

**Observation F-S7-02** : dev-agent.md a une ligne blanche (ligne 8) DANS le bloc frontmatter entre la fin de description et `---`. Valide YAML mais incoherent avec les 3 autres agents qui collent directement. Cosmetique.

### 4.2 Triggers — comparaison cortex.md vs frontmatters

Cortex.md section 1 (source unique) vs frontmatters (runtime) — verification exhaustive :

| Agent | Cortex.md triggers | Frontmatter triggers | Delta |
|-------|-------------------|---------------------|-------|
| os-architect | architecture, ADR, stack, schema, **structurer**, option A vs B | architecture, ADR, stack, schema, **comment structurer**, option A vs B | 1 diff ("structurer" vs "comment structurer") |
| dev-agent | code, composant, page, Supabase, React, build, scaffold, CSS, Tailwind | code, composant, page, Supabase, React, build, scaffold, CSS, Tailwind | **0 diff** (exact match) |
| doc-agent | documente, note, trace, journalise, **met a jour CONTEXT** | documente, note, trace, journalise, **met a jour** | 1 diff ("met a jour CONTEXT" vs "met a jour") |
| review-agent | verifie, audit, check, revue, **regression**, **deployer** | verifie, audit, check, revue, **zero regression**, **avant de deployer** | 2 diff |

**Total : 4 divergences** = **cross-ref F-S5-14** confirme inchange (D-S5-02 dit "runtime > doc, aligner cortex.md sur frontmatters").

### 4.3 Findings triggers

**F-S7-03 P3** — doc-agent trigger `note` trop generique : ambiguite nom/verbe ("prends note" = verbe conversationnel vs "cree une note quelque part" = action doc-agent). Couverture trop large, possible match sur interventions non-doc.

**F-S7-04 P3** — review-agent trigger `check` mot anglais isole dans un set francais (verifie, audit, revue, zero regression, avant de deployer). Incoherence de langue. Aussi tres generique (capture "check my email" ou "check the weather"). Faible specificite semantique.

**F-S7-05 P3** (cross-ref F-S5-14) — 4 divergences cortex.md ↔ frontmatters agents pas encore resolu. D-S5-02 decide "aligner cortex.md" mais fix reporte S21 housekeeping.

## 5. Phase C — Workflow/methodo + cross-refs

### 5.1 Workflow/methodo par agent

| Agent | Section methodo | Prescriptive ? | Note |
|-------|-----------------|----------------|------|
| os-architect | "Pattern de decision" (Probleme / Options / Recommande / Impact) + "Non-regression" (health-check.sh) | **Oui** | Pattern 4-lignes, discipline decision |
| dev-agent | — | **Non** | A "Contexte / Stack / Structure / Contraintes / Hors scope / Sortie" = descriptif, aucun "comment faire" |
| doc-agent | Table "Fichiers a maintenir" + "Protocole Memory" | **Partiel** | Prescription = "suivre table + memory.md" |
| review-agent | "Methode" (2 steps numerotes) + "Rapport" (format structure) | **Oui** | Le plus structure des 4 |

**F-S7-06 P3** — **dev-agent.md n'a PAS de section workflow/methodo explicite**. Contraste fort avec os-architect ("Pattern de decision" explicite) et review-agent ("Methode" numerotee). dev-agent decrit le contexte/stack/contraintes mais ne dit jamais HOW approcher une tache de code. Blast radius : invocation dev-agent sans guidance → execution variable. **Note** : severity P3 car agent dormant depuis S2 (0 invocation, 0 incident). Si Kevin invoque dev-agent en S20-S23 phase fixes, escalade P2 possible.

**F-S7-07 P3** (meta) — Asymetrie d'investissement agents : review-agent est le plus structure alors qu'il est le plus court (40L) ET theoriquement moins invoque que dev-agent (52L, le moins structure). Pattern inverse a l'usage : l'agent le plus utilise est le moins discipline.

### 5.2 Cross-refs — verification exhaustive

Cross-refs par agent, avec verdict resolution :

**os-architect.md** (4 refs) :
- `CONTEXT.md` ✓
- `docs/architecture.md` ✓
- `docs/core/architecture-core.md` ✓
- `scripts/health-check.sh` ✓
- **Verdict : 4/4 OK**

**dev-agent.md** (7 refs) :
- `CONTEXT.md` ✓
- `docs/design-system.md` ✓
- `docs/core/monitor.md` ✓ ("source de verite seuils bundle")
- `modules/app/src/components/`, `pages/`, `lib/` ✓
- `modules/app/data/` ✓
- `.archive/artifacts-jsx/` ✓
- **"Phase 2.4 dans CONTEXT.md" (L31)** ❌ **BROKEN** — grep CONTEXT.md `Phase 2\.4` retourne 0 match. Phase 2.4 a rotate hors du 5-session window (protocole Memory). Lecteur de dev-agent.md ne peut pas retrouver le contexte Phase 2.4 dans CONTEXT.md courant.
- `validate-void-glass.sh` ✓
- **"case-insensitive depuis P1" (L41)** ⚠ **OPAQUE** — "P1" = Priority 1 fix from Audit OS profond 2026-04-07 (documented dans CONTEXT.md Decisions actives mais sans ancre "P1"). Jargon interne.
- **Verdict : 7/9 OK, 1 broken (F-S7-08), 1 opaque (partiel F-S7-10)**

**doc-agent.md** (7 refs) :
- `CONTEXT.md` ✓
- `docs/architecture.md` ✓ (via table Fichiers a maintenir)
- `docs/core/*.md` ✓ (via table)
- `docs/design-system.md` ✓ (via table)
- `modules/app/data/*.md` ✓
- `docs/decisions-log.md` ✓
- `docs/core/memory.md` ✓
- **"protocole 4 niveaux PAUL" (L31)** ⚠ **OPAQUE** — PAUL est un framework externe (concept emprunte, confirme docs/specs/2026-04-05-foundation-os-v2-design.md:149,292 + docs/plans/2026-04-07-phase3-os-intelligence.md:28,204 + .claude/commands/session-end.md:15). Lecteur de doc-agent.md ne peut pas retrouver localement ce qu'est PAUL. Devrait pointer vers `.claude/commands/session-end.md` section 4 OU remplacer par "4 statuts DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED".
- **Verdict : 7/8 OK, 1 opaque (F-S7-09)**

**review-agent.md** (9 refs) :
- `CONTEXT.md` ✓
- `scripts/health-check.sh` ✓
- `docs/core/monitor.md` ✓ ("Critical + Warning")
- `scripts/sync-check.sh` ✓
- `docs/decisions-log.md` ✓ (via mention archivage)
- `.claude/agents/` + `.claude/commands/` ✓ (via sync-check "4+4+5 fichiers" — verifie = 4 agents + 4 commands + 5 specs Core OS cortex/memory/monitor/tools/architecture-core)
- `scripts/ref-checker.sh` ✓
- **`.git/hooks/commit-msg` (L24)** ⚠ **MAUVAIS POINTEUR** — devrait pointer vers source version-controlled `scripts/git-hooks/commit-msg`, pas vers l'install local. **Duplicate de F-S3-06** (deja catalogue S3).
- **"depuis P1" (L24)** ⚠ **OPAQUE** — meme jargon que dev-agent (partiel F-S7-10).
- **Verdict : 8/9 OK, 1 mauvais pointeur (F-S7-11 = cross-ref F-S3-06), 1 opaque (partiel F-S7-10)**

### 5.3 Findings cross-refs

**F-S7-08 P3** — dev-agent.md L31 cross-ref "voir Phase 2.4 dans CONTEXT.md" **BROKEN** : Phase 2.4 a ete rotate hors du 5-session window de CONTEXT.md (protocole Memory, line 26 "12 sessions plus anciennes sorties de la vue chaude"). Lecteur ne peut pas trouver Phase 2.4 dans CONTEXT.md courant. Leçon meta : **cross-refs depuis specs stables vers sections rotatives = fragilite mecanique** (L-S7-03).

**F-S7-09 P3** — doc-agent.md L31 "protocole 4 niveaux PAUL" cross-ref opaque. Aucun pointeur local vers definition. Lecteur doit grep 5 fichiers pour trouver PAUL. Fix propose : pointer vers `.claude/commands/session-end.md` ou remplacer par les 4 statuts explicites.

**F-S7-10 P3** — "depuis P1" (dev-agent.md L41 + review-agent.md L24) = jargon interne opaque. P1 = "Priority 1" fix de Audit OS profond 2026-04-07. Aucun pointeur vers decision "Audit OS profond" dans CONTEXT.md Decisions actives. Lecteur doit savoir de quoi il s'agit. Fix propose : remplacer par `depuis le fix Audit OS profond (CONTEXT.md Decisions)` OU date explicite `depuis 2026-04-07`.

**F-S7-11 P3** — review-agent.md L24 reference `.git/hooks/commit-msg` alors que la source version-controlled est `scripts/git-hooks/commit-msg`. **Cross-ref F-S3-06** confirme (duplicate). A fix S21 avec le batch.

## 6. Phase D — Tests d'invocation simulee

### 6.1 Protocole

3 inputs par agent = 12 tests. Pour chaque input :
- Determiner quel(s) trigger(s) match dans les 4 frontmatters
- Determiner l'agent route (premiere regle match, puis ambiguite = demander Kevin per cortex.md L19-22)
- Comparer le resultat avec l'intent semantique de l'input

### 6.2 Tests os-architect

| # | Input | Triggers match | Route | Verdict |
|---|-------|---------------|-------|---------|
| 1 | "Comment structurer le module finance ?" | "comment structurer" (os-arch) | os-architect | **OK** |
| 2 | "Je veux ajouter une table users dans Supabase" | "Supabase" (dev) | dev-agent | **MISMATCH** — intent = schema decision, trigger Supabase gagne |
| 3 | "Option A avec Redux vs option B avec Zustand ?" | "option A vs B" (os-arch) | os-architect | **OK** |

### 6.3 Tests dev-agent

| # | Input | Triggers match | Route | Verdict |
|---|-------|---------------|-------|---------|
| 1 | "Ajoute un bouton delete a la card" | AUCUN | fallback "traiter directement" (cortex L22) | **GAP** — 0 trigger match malgre intent dev clair |
| 2 | "Build l'app en production" | "build" (dev) | dev-agent | **OK** |
| 3 | "Page de login avec React Hook Form" | "page" + "React" (dev) | dev-agent | **OK** |

### 6.4 Tests doc-agent

| # | Input | Triggers match | Route | Verdict |
|---|-------|---------------|-------|---------|
| 1 | "Mets a jour CONTEXT.md" | "met a jour" (doc) | doc-agent | **OK** |
| 2 | "Note cette decision dans un fichier" | "note" (doc) | doc-agent | **OK-with-caveat** (trigger ambigu) |
| 3 | "Documente le nouveau flow auth" | "documente" (doc) | doc-agent | **OK** |

### 6.5 Tests review-agent

| # | Input | Triggers match | Route | Verdict |
|---|-------|---------------|-------|---------|
| 1 | "Verifie que le build passe" | "verifie" (review) + "build" (dev) | ambiguite → demander Kevin (cortex L19) | **AMBIGU** |
| 2 | "Audit complet avant le deploy" | "audit" + "avant de deployer" (2x review) | review-agent | **OK** |
| 3 | "Y a-t-il des regressions dans ce PR ?" | "zero regression" (substring "regression" → review) | review-agent | **OK-with-caveat** (substring match depend de l'implementation) |

### 6.6 Agregat

| Verdict | Count | % |
|---------|-------|---|
| OK pur | 7 | 58% |
| OK-with-caveat | 2 | 17% |
| Ambigu (demande Kevin) | 1 | 8% |
| Mismatch/Gap | 2 | 17% |

**Nominal match large (OK + OK-with-caveat) = 9/12 = 75%**.
**Nominal match strict (OK pur) = 7/12 = 58%**.

S5 avait obtenu 6/12 = 50% sur tests avec edge cases. S7 obtient 58-75% sur tests plus directs = **confirmation L-S5-01** "Routing Cortex = filtre graceful, pas classifieur semantique" + nouvelle leçon **L-S7-01 "tests directs surestiment couverture routing de ~15-25 points vs edge cases"**.

### 6.7 Findings tests

**F-S7-12 P3** (confirme L-S5-17) — dev-agent test #1 "Ajoute un bouton delete a la card" → **aucun trigger match**. Couverture trigger dev-agent manque :
- Verbes d'action : "ajoute", "modifie", "supprime", "corrige", "deplace", "renomme"
- Nouns UI : "bouton", "card", "input", "form", "menu", "modal", "navbar"

Les 9 triggers actuels couvrent stack (React/Supabase/Tailwind/CSS) + abstraits (composant/page/code/build/scaffold) mais pas les verbes/nouns concrets du travail quotidien dev.

**F-S7-13 P3** (confirme L-S5-01) — os-architect test #2 "Je veux ajouter une table users dans Supabase" → route dev-agent via trigger "Supabase" mais intent semantique = decision schema DB = os-architect territory. Ambiguite trigger vs intent classique. Cortex L19 "ambiguite → demander Kevin" resout mais le filtre initial echoue.

## 7. Findings consolides

### 7.1 Table complete

| ID | Severite | Categorie | Titre | Blast radius |
|----|----------|-----------|-------|--------------|
| F-S7-01 | P3 | Frontmatter | 4/4 agents sans `model:` ni `tools:` — aucune restriction per-agent | Dette config, impact nul en mode MOI |
| F-S7-02 | P3 | Frontmatter | dev-agent.md ligne 8 blanche dans frontmatter (cosmetique incoherent) | Stylistique |
| F-S7-03 | P3 | Trigger | doc-agent trigger "note" trop generique (nom/verbe ambigu) | Couverture routing trop large |
| F-S7-04 | P3 | Trigger | review-agent trigger "check" mot anglais isole + tres generique | Incoherence langue + couverture |
| F-S7-05 | P3 | Trigger | Cross-ref F-S5-14 : 4 divergences cortex.md ↔ frontmatters pas resolu | Deja batch S21 (D-S5-02) |
| F-S7-06 | P3 | Workflow | dev-agent.md sans section methodo/workflow explicite | Invocation sans guidance (escalade P2 si S20-S23 invoque agents) |
| F-S7-07 | P3 | Meta | Asymetrie investissement : review-agent le plus structure alors que dev-agent theoriquement plus utilise | Pattern inverse a l'usage attendu |
| F-S7-08 | P3 | Cross-ref | dev-agent L31 "Phase 2.4 dans CONTEXT.md" BROKEN (rotate hors 5-session window) | Lecteur sans contexte |
| F-S7-09 | P3 | Cross-ref | doc-agent L31 "PAUL" opaque (pas de pointeur local) | Grep 5 fichiers pour trouver definition |
| F-S7-10 | P3 | Jargon | "depuis P1" opaque (dev-agent L41 + review-agent L24) | Internal jargon sans ancre |
| F-S7-11 | P3 | Cross-ref | review-agent L24 `.git/hooks/commit-msg` vs source `scripts/git-hooks/` — duplicate F-S3-06 | Deja batch S21 |
| F-S7-12 | P3 | Routing | dev-agent trigger coverage gap : verbes d'action + nouns UI | Test "Ajoute un bouton delete" no-match |
| F-S7-13 | P3 | Routing | Supabase schema ambiguity : trigger "Supabase" gagne vs intent schema DB (os-architect) | Trigger vs semantic intent |
| M-S7-01 | P3 | Meta | Cluster "dormant agents drift" : F-S7-08 + F-S7-09 + F-S7-10 + 7 sessions non-invocation | Specs accumulent dette silencieuse |

**Total : 13 findings + 1 meta-finding = 14 items. Severite : 0 P1 + 0 P2 + 14 P3.**

### 7.2 Pourquoi 0 P2 en S7 ?

Les 14 items sont tous P3 parce que :
1. **Agents dormants** depuis S2 (7 sessions mode MOI strict) = 0 incident reel
2. **Specs doc-only** (pas de runtime bug)
3. **Fixes triviaux** (edit 4 fichiers MD au total)
4. **Impact hypothetique** = escalade possible si mode MOI leve en S20-S23

Contraste avec S6 qui avait 2 P2 (hooks decoratifs + meta coverage gap) = defauts d'**enforcement** avec coverage holes reels. S7 = defauts de **documentation dormante** = P3.

**Note escalade** : si Kevin decide d'invoquer les agents en parallele pour les fixes S20-S23 (voir plan cycle3-implementation.md section Phase VI), F-S7-06 (dev-agent sans workflow) + M-S7-01 (drift dormant) peuvent passer P2.

## 8. Decisions

| ID | Date | Action | Quand |
|----|------|--------|-------|
| D-S7-02 | 2026-04-08 | dev-agent.md enrichir avec section "Workflow" ou "Pattern de travail" (aligner avec os-architect "Pattern de decision" + review-agent "Methode") | S21 housekeeping |
| D-S7-03 | 2026-04-08 | **Parking decision Kevin** : evaluer si ajouter `model:` + `tools:` frontmatter aux 4 agents (restriction + model pinning). Pas urgent, pas de regression. | Decision Kevin futur |
| D-S7-04 | 2026-04-08 | Batch cleanup jargon/refs agents : F-S7-08 Phase 2.4 + F-S7-09 PAUL + F-S7-10 "P1" → remplacer par refs explicites ou supprimer | S21 housekeeping |
| D-S7-05 | 2026-04-08 | F-S7-11 merge avec F-S3-06 batch single fix `.git/hooks/commit-msg` → `scripts/git-hooks/commit-msg` | S21 housekeeping |
| D-S7-06 | 2026-04-08 | **Accepted dette** : F-S7-12 + F-S7-13 = routing gap semantique confirme, pas de fix (L-S5-01 reaffirme "filtre graceful, pas classifieur") | No action |
| D-S7-07 | 2026-04-08 | F-S7-03 + F-S7-04 triggers faibles ("note", "check") → revoir liste triggers doc-agent + review-agent | S21 housekeeping |
| D-S7-08 | 2026-04-08 | F-S7-02 ligne blanche dev-agent frontmatter → cosmetique, fix avec S21 batch | S21 housekeeping |
| D-S7-09 | 2026-04-08 | **NEW** : enrichir `sync-check.sh` avec verification paths CONTEXT.md vs filesystem (angle mort L-S7-05 plain-text) | S22 housekeeping OU apres S7-S9 si urgence |

Total : **8 decisions nouvelles** (D-S7-02..09), toutes batchees S21/S22 sauf D-S7-03 (parking) et D-S7-06 (accepted dette).

## 9. Collaterals + Observations hors scope

### 9.1 Drift CONTEXT.md pre-S7 (FIXE)

Au demarrage du session S7, diagnostic live revele que CONTEXT.md L11-13 + L21 + L53 + L58 + L66 + L104 reference des paths **disparus** :
- docs/cowork/ (supprime, deplace vers `docs/travaux-cowork/2026-04-08-instructions-cowork/`)
- docs/plan-router/ (supprime, deplace vers `docs/travaux-cowork/2026-04-08-plan-router/`)
- docs/meta/2026-04-08-collaboration-ia/ (supprime, deplace vers `docs/travaux-cowork/2026-04-08-collaboration-ia/`)

Kevin a clarifie : `docs/travaux-cowork/` est le home canonique des fichiers de recherche/ideation generes via Claude Cowork. Rename intentionnel post-commit a10d111 (S6.5).

**Action prise** : fix CONTEXT.md live avant de reprendre S7 (demande explicite Kevin "fix context et apres continue"). 10 edits appliquees :
- 6 edits path replace (cowork, plan-router, meta forms)
- 3 edits filename prefix (01-project-instructions.md, 02-anti-collision.md) + size drift (240L→249L, 266L→265L, 237L→236L)
- 1 edit cleanup remaining abbreviations

**Verification post-fix** : `grep docs/cowork|docs/plan-router|docs/meta CONTEXT.md` retourne 0 match. Build 767ms OK, Vitest 19/19, TypeScript 0. **0 nouvelle ref cassee introduite par les edits CONTEXT.md** (toutes 11 refs cassees restent dans `docs/travaux-cowork/` = fichiers untracked Kevin).

Git state post-fix : `D docs/cowork/*` + `D docs/plan-router/*` + `D docs/meta/2026-04-08-collaboration-ia/*` + `?? docs/travaux-cowork/` + `M CONTEXT.md` → Kevin doit stage la rename explicitement en /session-end (git rm + git add).

### 9.2 Observations collaterales (non bloquantes, hors scope S7)

**Obs-01** — `docs/audit-massif/00-INDEX.md` est **STALE** :
- Header status : "S0+S1+S2+S3+S4 DONE, S5 PENDING"
- Realite : S5 + S6 DONE (voir CONTEXT.md Cycle 3 progress table)
- Last update header : "2026-04-08 (fin S4)"
- Rows table : S5 + S6 marques PENDING alors que DONE

Fix propose : update en /session-end S7 OU a tout moment. Cout 5min. Pas dans scope S7 mais discovered pendant cross-ref verification.

**Obs-02** — 2 dossiers orphelins vides :
- `docs/meta/2026-04-08-collaboration-ia/` (empty post-rename Kevin)
- `docs/audit-massif/meta-collaboration-ia/` (empty, origine inconnue)

Non-bloquant. A cleanup S21/S22 avec `rmdir` safe (empty dirs).

**Obs-03** — Kevin edite en temps reel `docs/travaux-cowork/2026-04-08-instructions-cowork/01-project-instructions.md` pendant la session S7 : le fichier est passe de 240L → 249L pendant l'audit, introduisant 1-2 nouvelles refs cassees (comptage ref-checker : 9 → 10 → 11 au cours de la session). **Parallel Cowork work** confirmed, conforme D-S7-01 parking.

## 10. Learnings metaboliques

**L-S7-01 — Tests routing directs surestiment la couverture de ~15-25 points vs edge cases**
S7 obtient 7/12 = 58% strict (9/12 = 75% large) sur tests directs. S5 avait 6/12 = 50% sur tests edge cases (verbes absents, mix langue). **Confirmation L-S5-01** ("filtre graceful pas classifieur") + precision : **l'echantillonnage de tests influence le % mesure**. Tests directs manquent la vraie dette. **Regle d'audit** : toujours inclure edge cases (verbes/nouns concrets, mix langue, substrings) pour eviter de sous-estimer la couverture gap.

**L-S7-02 — Asymetrie investissement agents (pattern inverse a l'usage)**
review-agent = 40L (le plus court) mais le plus structure (Methode numerotee + Rapport format). dev-agent = 52L (le plus long) mais sans section methodo. Theoriquement dev-agent est plus utilise que review-agent dans un workflow normal. **Pattern inverse a l'usage** : l'agent le plus utilise est le moins discipline. **Regle** : investir methodo agent proportionnellement a la frequence d'invocation attendue.

**L-S7-03 — Cross-refs vers sections rotatives = fragilite mecanique garantie**
dev-agent.md L31 cross-ref "Phase 2.4 dans CONTEXT.md" est casse parce que CONTEXT.md a une politique de rotation (max 5 sessions dans "Dernieres sessions", les anciennes tombent). Toute cross-ref depuis spec stable (agents, commands, docs/core) vers section rotative devient mecaniquement cassee a la rotation, sans intervention humaine. **Regle** : les cross-refs depuis specs doivent pointer vers sections stables (Decisions, Modules, Outils) OU vers docs/decisions-log.md, JAMAIS vers "Dernieres sessions".

**L-S7-04 — Jargon interne = dette lisibilite invisible en solo**
"P1", "PAUL", "depuis P1" sont clairs pour Kevin (qui a vecu l'audit). Opaques pour tout nouveau lecteur : Claude post-compactage, collaborateur futur, audit S7 lui-meme. **Pattern emergent** : toute reference a une convention interne (decision ID, framework emprunte, priorite numerotee) doit inclure ancre vers sa definition OU etre remplacee par le concept explicite. Cost = ~3 mots par ref, benefice = lisibilite future preservee.

**L-S7-05 — Plain-text paths CONTEXT.md = trade-off L-S5-05 protection vs L-S7-05 detection**
Le fix L-S5-05 (remplacer backticks par plain-text sur paths douteux) protege contre la fabrication d'URLs/paths inventees. Effet de bord : ref-checker (qui ne scan que les backticks) **ne detecte plus** les paths legitimes qui deviennent casses apres un rename/move (exactement le cas CONTEXT.md pre-S7 fix). **Trade-off structurel** : protection fabrication vs detection drift. **Mitigation proposee** : enrichir `sync-check.sh` avec un check specifique "CONTEXT.md paths vs filesystem" qui scan les plain-text paths (pattern `docs/[a-z-]+/`) et verifie existence (voir D-S7-09).

**L-S7-06 — L-S5-05 10e + 11e occurrence meta-inception double (self-caught x2)**
En ecrivant la section 9.1 "Drift CONTEXT.md pre-S7 (FIXE)" de ce livrable, j'ai cite les paths historiques (cowork, plan-router, meta) en backticks dans une liste bullet : ref-checker flag immediat → fix en remplacant par plain-text = **10e occurrence L-S5-05**. Puis en ecrivant ce learning L-S7-06 meme, j'ai re-cite ces paths en backticks pour expliquer l'erreur → ref-checker re-flag → fix en plain-text = **11e occurrence dans le meme paragraphe qui decrit le probleme**. **Compteur cumulatif** (S2→S3→S4→S5 x4 + S5 amendement + S6 + S6.5 + S7 double = 11). **Pattern confirme depasse le seuil acceptable** : reflexe non acquis malgre 4+ flags explicites et une learning dedie L-S5-05 ecrite 5 fois. **Decision implicite** : le seul fix durable est automatise — hook pre-Edit qui refuse backticks sur paths inexistants, escalade S20. Cost cognitif cumulatif (6+ fix manuels a 30s-2min chacun) depasse clairement le cost d'un hook intrusif. **Ce learning lui-meme a ete retype 2 fois pour eviter la backtickification automatique des references** — preuve operationnelle que le reflexe verbal-visuel est plus fort que la discipline consciente.

## 11. Out-of-scope S7

Les sujets suivants ont ete identifies pendant S7 mais restent **hors scope** :

- **Fix des agents trouves** : mode doc-only audit, fixes reportes S21
- **Decision `model:` + `tools:` frontmatter** : parking decision Kevin (D-S7-03)
- **Tests d'invocation reels** : impossible en mode MOI strict, simulation seule
- **Revue des 4 commands** : scope S8 (session suivante)
- **Revue des scripts/hooks** : scope S9
- **Fix 00-INDEX.md stale** (Obs-01) : /session-end S7 OU plus tard
- **Cleanup empty dirs orphelins** (Obs-02) : S21/S22 housekeeping
- **Stage rename docs/cowork → docs/travaux-cowork** : territoire Kevin /session-end

## 12. Verification post-S7

| Check | Commande | Resultat |
|-------|----------|----------|
| Build | `cd modules/app && npm run build` | ✅ 767ms OK |
| Tests | `npm test` (via health-check) | ✅ Vitest 19/19 |
| TypeScript | tsc --noEmit (via health-check) | ✅ 0 erreur |
| Refs (tracked) | `bash scripts/ref-checker.sh` | ⚠ 11 refs cassees (0 introduites par S7, toutes dans docs/travaux-cowork/ = Kevin parallel work) |
| Structure racine | health-check | ✅ 0 orphelin |
| Void Glass | health-check | ✅ 0 violation |
| Livrable cree | ls docs/audit-massif/07-agents.md | ✅ cree |
| CONTEXT.md stale paths | grep docs/cowork\|docs/plan-router\|docs/meta CONTEXT.md | ✅ 0 match |

**Verdict baseline** : DEGRADED maintenu (0 critical, 1 warning = 11 refs cassees = **0 nouvelle par S7**, toutes heritees du parallel Cowork work Kevin). Zero regression fonctionnelle.

## 13. Cross-references autres sessions

- **F-S3-06** : `.git/hooks/commit-msg` duplicate — confirme en S7 (F-S7-11)
- **F-S5-14** : 4 divergences cortex.md ↔ frontmatters — confirme en S7 (F-S7-05)
- **F-S5-17** : Verbes dev absents des triggers — confirme en S7 (F-S7-12)
- **F-S5-18** : Mix langue triggers — confirme en S7 (F-S7-04 "check")
- **L-S5-01** : "Routing Cortex = filtre graceful, pas classifieur ~50%" — reconfirme + precise (L-S7-01)
- **L-S5-04** : "Ritual skippable sans alarme systeme" — non applicable S7
- **D-S5-02** : "Runtime > doc, aligner cortex.md sur frontmatters" — F-S7-05 batch S21
- **D-S6-06** : "Mode MOI confirme" — 7e session consecutive S7 valide

## 14. Prochaine session

**S8 — Commands (4) deep + tests reels** (mode MOI strict, 8e session consecutive)

Scope : `.claude/commands/session-start.md`, `session-end.md`, `new-project.md`, `sync.md`

Task S8 (plan 2026-04-07-cycle3-implementation.md:670+) :
1. Lecture line-by-line 4 commands
2. Audit chaque command sur 4 angles (workflow steps clairs, no duplication, scripts invoques existent, format output clair)
3. Test reel : /session-start deja observe live en debut S7 (comparer avec spec), /sync executable direct, /session-end observe en fin S7
4. Livrable `docs/audit-massif/08-commands.md`
5. Commit `audit(s08): commands (4) deep + tests → 08-commands.md`

Pattern anti-compactage : 4-6 phases selon scope (decoupage plan). Mode MOI strict continue.

**Pre-conditions S8** : baseline DEGRADED tolere, S7 commit en S7 ou batche avec S8. Pattern S6 F-separated commit teste OK, peut continuer avec /session-end normal pour S7 (scope compact).
