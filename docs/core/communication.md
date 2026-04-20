# Communication — Spec

Module Core OS responsable de la journalisation, l'indexation, la lecture du projet et le briefing de session. Remplace et elargit l'ancien module Memory.

> Ce module definit COMMENT l'information circule entre les sessions. Les 4 fonctions : Journaliser (ecrire), Indexer (organiser), Lire (comprendre), Briefer (presenter).

## 1. Tiers de memoire (5 tiers post-D-WIKI-01)

| Tier | Support | Duree de vie | Mis a jour par |
|------|---------|-------------|----------------|
| Session | Conversation Claude | 1 session | automatique |
| Contexte | CONTEXT.md | Permanent (chaque session) | session-end |
| Auto-memory | ~/.claude/projects/.../memory/ | Permanent | Claude Code natif + /session-end |
| Reference | docs/ | Permanent (fondamentaux) | quand architecture change |
| **Knowledge** | **wiki/ (NOUVEAU D-WIKI-01)** | **Permanent** | **/save, wiki-ingest, /autoresearch** |

### Regle d'or (update 2026-04-15)
**Une information ne vit que dans UN tier.** Pas de duplication. Si c'est dans docs/, CONTEXT.md pointe vers le doc. Si c'est knowledge externe atemporel, ca va dans wiki/ (pas dans auto-memory).

## 1.5 Test arbitral — quoi va dans quel tier

Poser 5 questions dans l'ordre pour arbitrer tout nouvel element :

1. **Executable / brut / volumineux / sensible (cles API, secrets)** → `modules/<X>/{src,data,secrets,backtests}/`
2. **Change a chaque session** (etat projet courant) → `CONTEXT.md`
3. **Decrit COMMENT travailler avec Kevin / comportement Claude** → `auto-memory` (~/.claude/projects/.../memory/)
4. **Spec OS stable du systeme** (architecture, module Core) → `docs/core/` ou `docs/`
5. Sinon (knowledge atemporel externe) → **`wiki/`** (tier 5, D-WIKI-01)

### Exemples concrets

| Element | Tier | Justification |
|---------|------|--------------|
| Ferritine baseline Kevin 2026-04 | `wiki/domains/sante/bilans/2026-04-bilan.md` | knowledge externe synthese (pas raw scan) |
| Strategy momentum code TS | `modules/trading/strategies/momentum.ts` | executable |
| Strategy momentum doc + papers refs | `wiki/domains/trading/strategies/momentum.md` | knowledge atemporel |
| Sharpe ratio explained | `wiki/concepts/Sharpe Ratio.md` | concept theorique cross-domain |
| Decision D-WIKI-01 adoption claude-obsidian | `CONTEXT.md` Decisions + `docs/decisions-log.md` | decision technique projet |
| Kevin est TDAH, thinking en francais | `auto-memory/user_*.md` | profile Kevin |
| Reflexion "est-ce que X s'applique a Y ?" | `wiki/meta/thinking.md` | reflexion autonome (neuroplasticite) |
| Erreur "wikilinks ../  marchent pas Obsidian" | `wiki/meta/lessons-learned.md` | auto-apprentissage (neuroplasticite) |
| Resume 5 dernieres sessions | `wiki/meta/sessions-recent.md` | memoire court terme (neuroplasticite) |

### Neuroplasticite memoire (knowledge.md section 8)

Le wiki est un cerveau ACTIF, pas un stockage passif. 4 reflexes obligatoires chaque session : recall wiki avant reponse technique, consolidation post-ingest, lessons learned, self-check session-end. Memoire court terme via [[sessions-recent]]. Reflexions via [[thinking]]. Auto-apprentissage via [[lessons-learned]]. [[Hot Cache|hot.md]] = cache flash derniere session. Routines cloud autonomes pour maintenance inter-sessions. Spec complete : `docs/core/knowledge.md` section 8.
| Cle API broker trading | `modules/trading/secrets/.env` (gitignored) | secret sensible |
| Article UX sur lois Gestalt | `wiki/domains/design/sources/gestalt-laws-YYYY-MM-DD.md` | source externe ingeree |
| Spec module Cortex | `docs/core/cortex.md` | spec OS stable |
| Metrique build app 265ms | `CONTEXT.md` > Metriques | etat projet courant |

### Couplage modules <-> wiki

Code executable dans `modules/`, doc+hypotheses+refs dans `wiki/domains/`. Cross-reference via frontmatter :

```yaml
# wiki/domains/trading/strategies/momentum.md
---
type: strategy
implementation: ../../../../modules/trading/strategies/momentum.ts
backtest_runs: ../../../../modules/trading/backtests/
sharpe_ratio: 1.2
max_drawdown: 0.15
---
```

Spec complete module Knowledge : `docs/core/knowledge.md`.

### Auto-memory — ce qui y va (et ce qui n'y va pas)

Le tier auto-memory (`~/.claude/projects/.../memory/`) est gere par Claude Code natif. Il sert a stocker ce qui est **utile entre sessions mais pas operationnel** :

| Va dans auto-memory | Ne va PAS dans auto-memory |
|---------------------|---------------------------|
| Profil utilisateur (role, preferences, TDAH) | Etat du projet (→ CONTEXT.md) |
| Feedback sur le comportement de Claude | Architecture, specs (→ docs/) |
| Patterns de travail valides | Decisions techniques (→ CONTEXT.md > Decisions) |
| Conventions non-evidentes | Metriques, builds (→ CONTEXT.md > Metriques) |

**Test** : si l'information change a chaque session → CONTEXT.md. Si elle est stable et concerne *comment travailler* plutot que *ou on en est* → auto-memory.

### CONTEXT.md = source unique operationnelle
Tout ce qui est necessaire pour comprendre l'etat courant du projet et produire un brief se trouve dans CONTEXT.md. Aucun autre fichier n'est requis pour le brief. Les fichiers d'archive (decisions-log.md, .archive/) existent pour reference historique, pas pour l'operation courante.

## 2. Nomenclature

Nommage unifie pour toutes les sections de CONTEXT.md et les briefs.

| Ancien nom | Nouveau nom | Raison |
|------------|-------------|--------|
| Dernieres sessions | Sessions recentes | Plus clair, "dernieres" ambigu |
| Decisions actives | Decisions | "actives" implicite (les archivees sont dans decisions-log.md) |
| Prochaine action | Cap | Direction strategique, pas juste une tache |
| Actions manuelles Kevin | En attente Kevin | Plus generique, couvre actions + questions + validations |
| Etat technique | Metriques | Factuel, extensible |
| Cycle 3 progress | Chantier en cours | Generique, reutilisable pour tout chantier |
| Memory (module) | Communication | Couvre journalisation + indexation + lecture + briefing |

### Convention de nommage
- Sections CONTEXT.md : **nom court francais** (2-3 mots max)
- Identifiants decisions : `D-[SCOPE]-NN` (ex: D-COM-01, D-HK-01)
- Statuts session : DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED
- Dates : toujours YYYY-MM-DD

## 3. Journalisation — Comment on ecrit

### 3.1 Format session (CONTEXT.md > Sessions recentes)

**Derniere session (la plus recente) : 4-8 lignes structurees**

```markdown
| 2026-04-10 | **[DONE] Titre court** |
|            | Scope : ce qui a ete touche (modules, fichiers) |
|            | Decisions : D-XX-01 titre, D-XX-02 titre |
|            | Idees capturees : bullets si applicable |
|            | Commits : hash1 titre1, hash2 titre2 |
```

**Sessions 2 a 5 : 1-2 lignes**

```markdown
| 2026-04-10 | **[DONE] Titre court** — resume 1 phrase. N commits. |
```

**Max 5 sessions.** Les plus anciennes sont supprimees (pas deplacees — le detail est dans git log).

### 3.2 Format decisions (CONTEXT.md > Decisions)

**2-3 lignes max par decision :**

```markdown
| Decision | Date | Detail |
| D-COM-01 Titre | 2026-04-10 | 1-2 phrases : ce qui a ete decide + impact. Ref fichier si besoin. |
```

- Max 15 decisions actives
- Au-dela : archiver les stables (> 30 jours) dans `docs/decisions-log.md`
- Decisions supersedees : remplacer, ajouter "(remplace: ancien)"

### 3.3 Format idees (CONTEXT.md > Idees & Parking)

**Section nouvelle.** Bullets courts, captures au session-end.

```markdown
## Idees & Parking

- 💡 [sujet] : description courte (1 ligne). Source : session du YYYY-MM-DD.
- 🔮 [sujet] : option gardee pour plus tard. Contexte : pourquoi c'est la.
- ❓ [sujet] : question ouverte a trancher.
```

Types d'entrees :
- 💡 Idee concrete (actionnable si on decide de la faire)
- 🔮 Option future (pas urgente, a garder en tete)
- ❓ Question ouverte (necessite reflexion ou decision Kevin)

**Maintenance :** au session-start, les idees sont presentees dans le brief. Si une idee est tranchee (faite ou rejetee), elle est supprimee du parking. Pas d'accumulation infinie — max ~10 entrees, au-dela prioriser et archiver.

### 3.4 Format metriques (CONTEXT.md > Metriques)

Compact, factuel, mis a jour a chaque session-end si changement.

```markdown
## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK 199ms | 244 kB | 29 kB | 19/19 | 7 |
| Design System | OK tokens | — | — | 100/100 | — |
```

Seuils d'alerte : JS > 600 kB 🟡, JS > 800 kB 🔴, CSS > 65 kB 🟡. Source unique : `scripts/thresholds.json`.

### 3.5 Protocole session-end — journalisation

A chaque session-end, le protocole ecrit dans CONTEXT.md dans cet ordre :

1. **Sessions recentes** : ajouter en tete, format 3.1, supprimer la 6e si > 5
2. **Decisions** : ajouter si nouvelle, archiver si > 15
3. **Idees & Parking** : capturer les reflexions/pistes de la session, nettoyer les resolues
4. **Cap** : mettre a jour la direction
5. **En attente Kevin** : ajouter/retirer selon session
6. **Metriques** : mettre a jour si build/tests/routes changent
7. **Modules** : mettre a jour si status change
8. **Chantier en cours** : mettre a jour si applicable

**Verification de coherence** : session-end verifie que chaque section a ete revue. Si une section n'a pas ete touchee et aucun changement n'est pertinent → OK. Si un changement est pertinent mais pas reflété → warning explicite.

## 4. Indexation — Comment on organise

### 4.1 Structure CONTEXT.md

Ordre des sections (fixe, ne pas reordonner) :

```
# Foundation OS — Contexte
## Modules                    (table status par module)
## Sessions recentes          (max 5, format 3.1)
## Chantier en cours          (si applicable, sinon absent)
## Cap                        (direction + pourquoi + pistes)
## Idees & Parking            (nouveau)
## En attente Kevin           (actions/questions humaines)
## Decisions                  (max 15 actives, format 3.2)
## Metriques                  (table compacte, format 3.4)
```

### 4.2 Budget de taille

| Section | Budget lignes | Regle |
|---------|--------------|-------|
| Modules | ~15 | 1 ligne par module |
| Sessions recentes | ~20 | derniere 4-8L, anciennes 1-2L |
| Chantier en cours | ~15 | table progress si actif |
| Cap | ~10 | direction + pistes A/B/C |
| Idees & Parking | ~15 | max 10 entrees, 1 ligne chacune |
| En attente Kevin | ~10 | bullets courts |
| Decisions | ~30 | max 15 x 2L |
| Metriques | ~10 | table compacte |
| **Total** | **~125** | **Objectif < 150 lignes** |

**Garde-fou** : si CONTEXT.md depasse 200 lignes → session-end affiche un warning et propose de compresser les sessions/decisions les plus anciennes.

### 4.3 Ce qui ne va PAS dans CONTEXT.md

- Detail debug ou tentatives echouees → session seulement
- Architecture, design tokens, specs → docs/ (reference)
- Preferences utilisateur, feedback → auto-memory
- Historique complet sessions → git log
- Decisions archivees → docs/decisions-log.md

## 5. Lecture — Comment on comprend

### 5.1 Protocole session-start — lecture

Phase 1 — Collecte (parallele, obligatoire) :

| Source | Quoi lire | Pourquoi |
|--------|-----------|----------|
| CONTEXT.md | Entier (< 150L) | Etat courant complet |
| git status | `--short` | Fichiers non commites |
| git log | `-1 --format="%cr · %h · %s"` | Dernier commit |
| git branch | `--show-current` | Branche active |
| Build | `npm run build -w modules/[nom]` par module actif | Sante build |
| Health-check | `bash scripts/health-check.sh` | Sante globale |

Phase 2 — Verification structure :
- Racine = seulement fichiers autorises (CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json, package-lock.json + dossiers)
- Modules CONTEXT.md ↔ filesystem coherents

**Aucun autre fichier n'est lu pour le brief.** CONTEXT.md est auto-suffisant.

### 5.2 Acces au detail (a la demande)

Si Claude a besoin de detail sur une session passee → `git log --oneline -10` + `git show [hash]`
Si detail sur une decision archivee → `docs/decisions-log.md`
Si detail architecture → `docs/core/[module].md` ou `docs/`

Ces lectures sont a la demande, pas systematiques.

## 6. Briefing — Comment on presente

### 6.0 Vulgarisation obligatoire (TDAH-first, non-negociable, D-VULGARIZE-01)

> **Kevin = designer TDAH**, pas ingenieur tech. Comprend vite quand bien explique, mais oublie les details. **Tout document produit pour Kevin doit etre vulgarise DE BOUT EN BOUT**, pas juste a l'entree.

#### 6.0.0 Principe fondamental (D-VULGARIZE-01, 2026-04-20)

**La section "En bref (pour Kevin)" en tete est un RESUME d'entree, PAS un substitut a la vulgarisation du reste du document.**

Un brief qui a "En bref" vulgarisee mais le reste en jargon technique = **violation structurelle**. Piege observe 2026-04-20 `/session-start` : la tuile d'entete etait claire mais toutes les 14 tuiles suivantes (SANTE / PLANS / MODULES / CAP / etc.) contenaient D-XXX-NN non-traduits, noms de variables (`PRODUCT_MCP_SYNC=1`), termes techniques (`alignment-auditor`, `scheduled task`, `worktree`) sans explication. Kevin n'a rien compris.

**Regle** : chaque tuile / section / ligne / cellule de table produite pour Kevin applique les 9 regles ci-dessous **independamment** (chacune auto-suffisante pour lecture isolee TDAH).

#### 6.0.1 Regles universelles (s'appliquent a TOUT le document)

1. **Section `## En bref (pour Kevin)` en TETE** du document (avant toute autre section).
   - 2-5 phrases maximum
   - Langage naturel, pas de jargon non-traduit
   - 1 idee = 1 phrase
   - Finir par "prochaine etape" ou "a decider Kevin"

2. **Tout jargon tech est traduit immediatement entre parentheses** a sa 1ere apparition **dans chaque section** (pas une seule fois en haut) :
   - "cherry-pick (copier un commit d'une branche vers une autre sans tout merger)"
   - "worktree (dossier parallele qui partage le meme git mais a sa propre copie physique)"
   - "refs cassees (liens dans la doc qui pointent vers des fichiers inexistants)"
   - "D-XXX-NN (code identifiant une decision, ex: D-BODY-01 = 1ere decision sur le module Body)"
   - "MCP (Model Context Protocol, pont qui permet a Claude de parler a des services externes comme Notion ou Gmail)"
   - "health-check (script qui verifie que le projet est en bon etat)"
   - "hook (script qui tourne automatiquement quand un evenement arrive, ex: avant un commit)"
   - "scheduled task (tache programmee qui se lance toute seule tous les jours a une heure precise)"
   - "drift (decalage entre ce que la doc dit et la realite du code/projet)"

3. **Acronymes developpes 1ere fois** :
   - FOS = Foundation OS (le projet)
   - TDAH = Trouble Deficit Attention
   - DS = Design System (bibliotheque de composants visuels reutilisables)
   - PO = Product Owner (celui qui dit quoi construire et dans quel ordre)
   - OMC = Oh-My-ClaudeCode (extension/plugin pour Claude Code)
   - DB = database (base de donnees)

4. **Chaque code D-XXX-NN traduit en langage naturel** a sa 1ere apparition dans CHAQUE section ou il apparait (pas une seule fois) :
   - `D-PRODUCT-02` → "plan qui rend le PO Notion autonome (Notion se met a jour tout seul au lieu qu'on doive lancer une commande manuelle)"
   - `D-BODY-01` → "module qui verifie que mes actions correspondent a ce que Kevin m'a demande"
   - `D-CCCONFIG-01` → "durcissement de la config Claude Code avec systeme de securite bash (empeche `rm -rf /`)"
   - `D-NO-MULTI-SESSION-01` → "decision du 20 avril : 1 seule session Claude Code active a la fois (le multi-session creait de la perte de travail)"

5. **Nombres avec contexte** :
   - Bon : "113 pages wiki, vs 86 avant la recuperation des sessions perdues"
   - Mauvais : "113 pages wiki"

6. **Chaque choix A/B/C propose a Kevin doit expliquer** :
   - **Ce que ca fait concretement** (langage naturel)
   - **A quoi ca sert pour lui** (impact sur son quotidien)
   - **Combien de temps** (si estime)
   - **Pre-requis eventuels** (ce qu'il doit faire avant)
   - Bon : "**A — Executer D-PRODUCT-02** : pour que ton Notion se mette a jour tout seul quand tu fais un plan ou un commit. 15-20h de travail. Pre-requis : aucun."
   - Mauvais : "A — D-PRODUCT-02 plan pret"

7. **Pas de mur de texte**. Aerer avec :
   - Listes a puces
   - Tables (avec en-tetes explicites, pas abrevies)
   - Sections claires avec titres
   - Blockquotes pour insister
   - **Bold** pour mots-cles

8. **Si Kevin dit "je comprends pas"** → REFORMULE plus simple. Ne defends pas l'explication initiale. Reprends autrement.

9. **Pas de hash git bruts** (ex: `fce4175`) sans explication. Remplacer par "le dernier commit (l'enregistrement du dernier lot de modifications)".

#### 6.0.2 Vulgarisation par tuile du brief v12 (spec par section)

Chaque tuile du brief v12 a ses regles de vulgarisation specifiques :

| Tuile | Regle de vulgarisation |
|---|---|
| **En bref** | 2-5 phrases langage naturel. Aucun D-XXX-NN non-traduit. Finir par "prochaine etape". |
| **🏥 SANTE** | Chaque check explique ce qu'il verifie. "Build OK" → "L'application compile sans erreur". "Refs intactes" → "0 lien casse dans la documentation". |
| **🔥 HOT** | Resumer la derniere session en 3-5 phrases langage naturel, pas en codes D-XXX-NN bruts. |
| **🧭 TRAJECTOIRE** | Mission et focus en phrase complete. "▲ tendance" → "Evolution positive depuis X". |
| **📋 PLANS** | Pour chaque plan : **objectif en langage naturel** ("rendre X autonome") + status + temps estime. Jamais juste le code D-XXX-NN. |
| **📚 WIKI** | "Pages wiki" → "pages de connaissances". Expliquer ce qu'un domaine wiki contient. |
| **📦 MODULES** | Pour chaque module : **a quoi il sert** en 1 phrase. "App Builder" → "le module de code de l'application React principale". |
| **⚠️ ATTENTION** | Pour chaque ligne en attente : **explication de ce que c'est** + **pourquoi c'est en attente** + **qui doit faire quoi**. |
| **🔨 DERNIER TRAVAIL** | Resumer en langage naturel avec contexte. Pas juste "N commits + table batches". Expliquer l'intention. |
| **📊 STATUT** | Expliquer ce que represente le pourcentage. "Trading v1.1 95%" → "moteur de backtest crypto fonctionne, il reste l'integration Nautilus (librairie de backtest pro) reporte". |
| **💡 IDEES** | Pour chaque idee : **ce que ca serait** + **pourquoi c'est en parking** (pas urgent, dependance, etc.). |
| **🤔 REFLEXION** | Phrases completes. Pas de bullets telegraphiques avec jargon. |
| **📜 HISTORIQUE** | Chaque decision D-XXX-NN traduite : **ce qui a ete decide** + **pourquoi**. |
| **🎯 CAP** | Direction en 1 phrase langage naturel. Chaque prochaine action A/B/C : ce que ca fait + a quoi ca sert + temps. |
| **📥 INPUT** | Proposer "On fait quoi ?" avec rappel des 3-4 choix principaux reformules. Pas juste "A/B/C/D/E/F/G/H" sans contexte. |

#### 6.0.3 Check-list obligatoire avant envoi brief/rapport

Avant chaque output vers Kevin, relire en se posant ces questions :

- [ ] Chaque D-XXX-NN est traduit en langage naturel au moins 1 fois dans sa tuile d'apparition ?
- [ ] Chaque acronyme (FOS, MCP, OMC, DB, PO, etc.) est developpe au moins 1 fois dans le document ?
- [ ] Chaque terme tech (worktree, hook, cherry-pick, scheduled task, drift, refs, etc.) a son explication entre parentheses ?
- [ ] Les choix A/B/C expliquent ce que ca fait concretement pour Kevin + pourquoi + temps ?
- [ ] Les metriques chiffrees ont un contexte ("X vs Y avant") ?
- [ ] Aucune cellule de table en jargon brut sans explication ?
- [ ] Aucun hash git brut sans explication ?
- [ ] Zero section qui passe en mode technique brut en supposant que "l'En bref d'entree suffit" ?

**Si une seule case n'est pas cochee → ne pas envoyer, reecrire.**

#### 6.0.4 Exemples

**Exemple MAUVAIS (piege observe 2026-04-20)** — En bref OK mais tuiles suivantes en jargon :
> #### 📋 PLANS ACTIFS
> | Plan | Status | Progression |
> |---|---|---|
> | D-PRODUCT-02 Product Autonomie | draft | 0/5 phases · 15-20h |

**Exemple BON** — Vulgarisation a chaque ligne :
> #### 📋 PLANS EN COURS (plans de travail demarres)
>
> **D-PRODUCT-02 (rendre le Product Owner Notion autonome)**
> Aujourd'hui, pour que ton Notion se synchronise avec le projet, tu dois lancer la commande `/po sync` manuellement. Ce plan automatise ca : chaque nouveau plan / commit / session met a jour Notion tout seul.
> - Status : ecrit mais pas encore demarre
> - Duree estimee : 15 a 20 heures, reparties sur 5 etapes
> - Pre-requis pour lancer : aucun (plan auto-contenu)

**Exemple MAUVAIS (tuile CAP)** :
> | A | D-PRODUCT-02 plan pret |
> | B | Gmail centralisation Phase D |

**Exemple BON (tuile CAP)** :
> **A — Executer D-PRODUCT-02** (rendre ton Notion autonome)
> Pour que Notion se mette a jour tout seul quand tu crees un plan ou fais un commit, au lieu que tu doives lancer une commande a la main. 15-20h de travail.
>
> **B — Finir le projet Gmail centralisation**
> Tu as 3 boites Gmail, l'objectif est de tout centraliser dans une seule. Le plan est bloque a la Phase D : il faut que tu reactives l'acces MCP Gmail (MCP = pont entre Claude et Gmail) avant qu'on puisse continuer.

#### 6.0.5 Application

Cette regle s'applique a :
- Tous les briefs (`/session-start`, `/session-end`, `/cockpit`)
- Tous les rapports (`docs/audits/*/rapport.md`)
- Tous les plans (`docs/plans/*.md`)
- Tous les updates CONTEXT.md / wiki/hot.md / wiki/meta/*.md
- Tous les messages chat
- Tous les templates (`docs/plans/_template-plan.md`, `docs/audits/_template-audit.md`)

Les 4 commands (`session-start`, `session-end`, `cockpit`, `plan-os`) ont un disclaimer renforce pointant vers cette section.

#### 6.0.6 Traceabilite

- `CLAUDE.md` section "Langage & Communication (TDAH-first, non-negociable)"
- `docs/core/constitution.md` principe P-42 "Vulgarisation integrale brief"
- `wiki/meta/lessons-learned.md` section "Vulgarisation = tout le document, pas juste l'en-tete"
- Memoires `feedback_vulgarisation_obligatoire.md` + `feedback_communication_pedagogique.md`
- Decision associee : **D-VULGARIZE-01** (2026-04-20)

### 6.1 Brief de debut de session (v12 — TDAH tuiles Markdown)

**14 sections en tuiles.** Chaque section = 1 blockquote `>` contenant titre `####` + contenu + tables.
Sections separees par `---` (horizontal rule).

Principe TDAH : **tuiles = zones visuelles delimitees**, scanning par emojis titres, hierarchie 4 niveaux.

#### Format de rendu

Le brief est du **Markdown natif** (PAS du box-drawing terminal). Claude Desktop rend les blockquotes comme des blocs gris, les tables comme des tableaux, le bold comme du gras.

**IMPORTANT** : NE PAS utiliser `┌─┐│└┘╔═╗╚╝` (caracteres box-drawing). Utiliser UNIQUEMENT :
- `>` blockquote = tuile (fond gris)
- `####` dans blockquote = titre de tuile
- `| |` tables Markdown = donnees structurees
- `**bold**` = labels cles
- `---` = separateur entre tuiles
- Emojis couleur 🟢🟡🔴🔵⚪⚫🔮 = status
- `█░` = barres progression
- `- [ ]` = checklist (en attente Kevin)

#### 15 sections (ordre fixe, + 1 optionnelle)

1. **SANTE** `🏥` : table 4×2 (build/tests/refs/css/wiki/drift/**worktrees**), verdict en bold. Ligne **Worktrees** : `"N worktrees (K divergent)"` si > 1 worktree avec `ahead main >= 1`. Source : `git worktree list` + `git -C <path> rev-list --count main..HEAD` par worktree. Cache `.omc/audit-total/state.json` si disponible. Omise si 1 worktree seul ou 0 divergent.
2. **HOT** `🔥` : 3-5 lignes condensees de wiki/hot.md + Next action. Si hot.md absent → skip.
3. **TRAJECTOIRE** `🧭` : table mission/focus/tendance/derniere
4. **PLANS** `📋` : pour chaque plan actif = progression + hier + prochain + reste. Plans termines recemment = 🟢 compteur.
5. **WIKI** `📚` : table pages/domaines/ingest/stale + couverture domaines
6. **MODULES** `📦` : sous-groupes Code/Meta/Prevu + liens acces
7. **ATTENTION** `⚠️` : sous-groupes Alertes + En attente Kevin (checklist)
8. **SYNC** (optionnel) `🔄` : si drift-detector exit 1. Table drifts + fix. Si clean → pas affiche.
9. **DERNIER TRAVAIL** `🔨` : N commits + table batches + decisions
10. **STATUT** `📊` : barres progression modules
11. **IDEES** `💡` : table emoji + description
12. **REFLEXION** `🤔` : bullets courtes
13. **HISTORIQUE** `📜` : table 3 decisions recentes
14. **ALIGNMENT** `🧭` (D-BODY-01 P5) : derniere rating + streak (si applicable) + top P-XX viole 7j + principe du jour (rotation top 10). Source : `bash scripts/alignment-analyze.sh --quiet` + lecture top 10 P-XX `docs/core/constitution.md`. Si 0 rated → afficher "Alignment : pas encore de trace (session 1, /plan-os intent-capture OBLIGATOIRE)".
15. **CAP + INPUT** `🎯📥` : direction + prochaines actions + choix Kevin
16. **PROPOSITIONS CLAUDE** `🤖` (optionnel, I-04 audit v2) : max 3 propositions proactives si triggers actifs. Table `| emoji | proposition | raison | action |`. Triggers : drift detecte, hot.md stale, plans inactifs > 7j, lessons-learned recentes, idees en parking >= 5. Si aucun trigger → tuile non affichee. Genere par `scripts/propositions-generator.sh`.
17. **PRODUCT** `📊` (D-PRODUCT-01 P3, optionnel si module actif) : etat DB Notion (Decisions/Plans/Sessions/Tasks) + divergences FOS↔Notion + derniers commentaires Kevin Notion. Table : `| DB | Rows | Last sync | Divergences |`. Bullets : 3 derniers comments Kevin. Source : `bash scripts/po-status.sh --quiet` + lecture `.omc/product-state.json` (cache pull). Si module Product absent ou `PRODUCT_MCP_SYNC != 1` → tuile non affichee. Si pull offline (MCP down) → afficher "Product : MCP Notion offline, dernier sync <timestamp>".

#### Regle plans

Un plan est "actif" si son `Execution log` contient au moins une case `[ ]` OU son frontmatter `status` != `done`/`closed`.

**Auto-archive** : `/session-end` deplace vers `.archive/plans-done-$(date +%y%m%d)/` tout plan termine (hors `_template-plan.md`).

**Plans termines recents** : dans la tuile PLANS, ligne `🟢 <N> plans termines recemment` (7 derniers jours).

### 6.2 Brief de fin de session (v12 — TDAH tuiles Markdown)

**7 sections en tuiles** (meme format que 6.1) :

1. **Entete** : `# 🪐 SESSION END — YYYY-MM-DD` + blockquote `Status : DONE/CONCERNS/NEEDS_CONTEXT/BLOCKED`
2. **ETAT TECHNIQUE** `🏥` : table build/tests/health/refs/wiki
3. **CE QUI A ETE FAIT** `📌` : N commits + table batches + decisions
4. **PLANS TERMINES** `📦` : table plans archives cette session (si applicable)
5. **IDEES CAPTUREES** `💡` : table emoji + description
6. **CAP MIS A JOUR** `🎯` : direction + prochaines actions
7. **CONCERNS** `⚠️` : uniquement si status != DONE

### 6.3 Regles de rendu v12

#### Structure visuelle
- **Tuile** : blockquote `>` contenant `####` titre + contenu + tables
- **Separateur** : `---` (horizontal rule) entre chaque tuile
- **Entete session** : `# 🪐 SESSION START/END — YYYY-MM-DD` (h1, le seul)
- **Sous-groupes** : `**bold label**` dans blockquote (ex: 🟢 Code, 🔵 Meta, ⚫ Prevu)

#### Hierarchie (4 niveaux)
- **Niveau 1** : `#` = titre session (1 seul par brief)
- **Niveau 2** : `####` dans `>` = titre de tuile (14 sections)
- **Niveau 3** : `**bold**` dans `>` = sous-groupe dans tuile
- **Niveau 4** : texte normal / cellules table = detail

#### Couleurs et symboles
- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Tendance : ▲ mieux / ▶ pareil / ▼ pire
- Barres : `█` plein, `░` vide (dans tables statut)
- Checklist : `- [ ]` pour actions Kevin

#### Texte
- Vulgariser : glose 3-4 mots pour tout jargon
- Mise en garde : `⚠` si simplification cache un danger
- Mots interdits : revolution, historique, accomplish, reference mondiale

### 6.4 Sources de donnees pour le brief

| Section brief | Source dans CONTEXT.md | Source live |
|---------------|----------------------|------------|
| Sante | — | health-check + build + wiki-health |
| Hot | — | wiki/hot.md |
| Trajectoire | Cap + Sessions recentes | git log -1 |
| Plans | Sessions recentes (pointeur) | `docs/plans/*.md` Execution log + frontmatter |
| Wiki | — | wiki-health.sh + wiki/log.md |
| Modules + Acces | Modules | git status + branch |
| Attention | En attente Kevin | health-check |
| Sync | — | drift-detector.sh exit code |
| Dernier travail | Sessions recentes + Decisions | git log |
| Statut | Modules + Chantier en cours | — |
| Idees | Idees & Parking | — |
| Reflexion | Idees & Parking | — |
| Historique | Decisions (3 recentes) | — |
| Cap + Input | Cap | — |

### 6.5 Layered context loading (L0-L3)

Formalisation du chargement context en 4 layers (inspire MemPalace, D-INTEG-01 Phase 5). Chaque layer a un **budget tokens** et un **trigger** precis. Claude adapte les layers charges en fonction du type de tache.

#### Definition des layers

| Layer | Contenu | Tokens cible | Trigger |
|-------|---------|--------------|---------|
| **L0** | `wiki/hot.md` | < 200 | Hook SessionStart (auto, pas d'action requise) |
| **L1** | `CONTEXT.md` + `wiki/meta/sessions-recent.md` | < 2 000 | `/session-start` Tour 1 |
| **L2** | `wiki/meta/lessons-learned.md` + `wiki/meta/thinking.md` + plans actifs `docs/plans/*.md` + `docs/core/constitution.md` (D-BODY-01) | < 10 000 | `/session-start` Tour 1 (suite) |
| **L3** | Pages wiki (concepts / entities / sources / domains) | on-demand | Reflex 1 neuroplasticite (recall cible) |

#### Regles de selection par type de tache

| Type de tache | Layers charges |
|---------------|----------------|
| Tache triviale (typo, clarification) | **L0 seul** |
| Bug fix / small feature | **L0 + L1** |
| Refactor / audit / plan | **L0 + L1 + L2** |
| Architecture / nouveau domaine / ingest | **L0 + L1 + L2 + L3 cible** (via reflex 1 recall) |

#### Pourquoi

- **Discipline tokens** : Kevin Max x20, mais charger 50k tokens pour repondre a un typo = gaspillage.
- **Anti-compactage** : contexte leger = sessions plus longues avant compaction forcee.
- **Reflex 1 recall** preserve : L3 reste on-demand, jamais pre-loaded en bloc, evite surcharge.

#### Seuils

Seuils configurables dans `scripts/thresholds.json` section `wiki.layered_loading` :

```json
"layered_loading": {
  "l0_tokens_max": 200,
  "l1_tokens_max": 2000,
  "l2_tokens_max": 10000
}
```

Source : [MemPalace](https://github.com/MemPalace/mempalace) 4 layers (170 tokens startup). Concept canonique : [[Layered Loading]]. Spec D-INTEG-01 section 12.3 : `docs/core/knowledge.md`.

## 7. Capture d'idees — Mecanisme

### Quand capturer
- **Pendant la session** : si une reflexion/piste emerge, la noter mentalement
- **Au session-end** : phase dediee "Capture idees" — passer en revue la session et extraire les idees qui meritent de survivre

### Quoi capturer
- Pistes techniques non explorees ("on pourrait faire X pour Y")
- Questions strategiques ("est-ce qu'on devrait Z avant W ?")
- Options gardees pour plus tard ("si un jour on veut A, penser a B")
- Retours d'experience ("la prochaine fois, faire C au lieu de D")

### Quoi NE PAS capturer
- Taches concretes → Cap ou chantier en cours
- Decisions tranchees → section Decisions
- Bugs a fixer → Cap ou En attente Kevin
- Detail technique → code ou docs/

### Lifecycle d'une idee
```
capturee (session-end) → presentee (session-start brief)
  → tranchee (faite OU rejetee OU transformee en decision/tache)
  → supprimee du parking
```

Max 10 idees en parking. Au-dela, forcer une priorisation : garder les 10 plus pertinentes, archiver ou supprimer le reste.

## 8. Relation avec les autres modules Core OS

| Module | Relation avec Communication |
|--------|---------------------------|
| Cortex | Communication fournit le contexte que Cortex utilise pour router |
| Monitor | Communication consomme les metriques de Monitor pour le brief |
| Tools | session-start et session-end sont des commands (outils) qui executent les protocoles Communication |

## 9. Historique

Rename Memory -> Communication (2026-04-10) archive dans `docs/decisions-log.md` section "Archivage 2026-04-17 — 2 migrations historiques Core OS".
