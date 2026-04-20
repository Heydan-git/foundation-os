---
type: meta
title: "Lessons Learned — Auto-apprentissage"
updated: 2026-04-16
tags:
  - meta
  - lessons
  - errors
  - neuroplasticity
status: evergreen
confidence: high
related:
  - "[[index-meta]]"
  - "[[thinking]]"
  - "[[sessions-recent]]"
  - "[[foundation-os-map]]"
  - "[[index-wiki]]"
---

# Lessons Learned — Auto-apprentissage

> Erreurs, pièges, workarounds rencontrés. Enregistrés par Claude EN SESSION (neuroplasticité réflexe 3).
> Consulté au SessionStart pour éviter de répéter les mêmes erreurs.
>
> **Convention 🎯 to-constitute (D-BODY-01 P3)** : si une lesson merite d'être élevée en principe constitution `P-XX`, prefixer le titre de la section avec l'emoji `🎯`. `bash scripts/constitution-suggest.sh` scanne les flags et propose des drafts P-XX formattes. Kevin refine + append manuellement dans `docs/core/constitution.md` (append-only, jamais renumerotation).
>
> Pour insights analytiques Kevin-Claude cross-session : voir [[session-patterns]] (auto-regenere par `scripts/sessions-analyze.sh`).

## 🎯 Multi-session = regression memoire garantie pour dev solo (2026-04-20)

**En bref (pour Kevin)** : Quand tu travailles dans plusieurs sessions Claude en meme temps (via des worktrees paralleles), chaque session ecrit son propre CONTEXT.md local et seule la derniere qui ferme proprement s'ecrit dans le projet principal. Les autres branches restent "oubliees" tant que personne ne fait un audit. On a perdu **2 sessions entieres** (une du 19 avril + une du 17 avril) qui n'etaient jamais revenues dans le projet principal. Decision : **on arrete le multi-session, 1 seule session a la fois**.

- **Date** : 2026-04-20 (audit reality-check)
- **Contexte** : Kevin alerte apres avoir remarque incoherences CONTEXT.md/hot.md. Audit factuel evidence-based revele 2 branches avec 14+5 commits jamais mergees + main working tree desync (30+ untracked dont 6 projets Cowork entiers).
- **Symptome** : claim memoire main "53 pages wiki / 6 worktrees / Phase 5 DEMARREE jovial-jemison" vs realite "86 pages filesystem / 2 worktrees / Phase 5 mergee 3db42fa" = desync systematique.
- **Cause racine** : multi-worktree sans discipline de merge post-session. `/session-end` ecrit CONTEXT.md local seulement. Si 3 worktrees travaillent en parallele, seul le dernier merge refresh memoire main. Les autres branches deviennent orphelines de la memoire. D-CCCONFIG-01 (decision entiere avec 13 commits + 46 pages wiki) perdue = 0 match dans main CLAUDE.md/hot.md/sessions-recent/lessons/thinking/decisions-log.
- **Fix** :
  - **Decision D-NO-MULTI-SESSION-01 2026-04-20** : pas de multi-session. 1 session a la fois. Regle durcie dans CLAUDE.md.
  - Si multi-session inevitable (ex: hotfix parallele) : **cloture en serie OBLIGATOIRE**, **refresh CONTEXT.md a chaque merge**, **audit cross-worktree avant session-end** (`git branch -a | while b; do git log main..$b; done`).
  - Cherry-pick Option C (copier files A sans merge) recommande pour integrer branches antecedentes sans conflits massifs CONTEXT/CLAUDE.
- **Regle** : **UN SEUL `/plan-os` actif a la fois + UN SEUL worktree actif a la fois**. Si travail parallele indispensable, la cloture serie est NON-negociable + audit cross-worktree pre-`/session-end`.
- **Application FOS** : Cette lesson est **constitutionalisee P-42** (a ajouter manuellement par Kevin a `docs/core/constitution.md`). CLAUDE.md section Multi-session reecrite en E6.

## 🎯 Working tree desync cumulatif (2026-04-20)

**En bref (pour Kevin)** : Tu peux deplacer un fichier (par exemple pour l'archiver) sans faire `git commit`. Ca laisse le projet dans un etat "en cours" qu'une session suivante peut oublier de finir. On a trouve un plan archive a moitie (fichier deplace dans `.archive/` mais jamais committee). Aussi plein de nouveaux dossiers projets (Gmail, Morning Intelligence) jamais ajoutes au projet. Il faut toujours committer ou le hook `auto-archive-plans.sh` ne tourne pas tout le temps.

- **Date** : 2026-04-20 (audit reality-check E1)
- **Contexte** : main working tree apres plusieurs sessions contient : `A .archive/plans-done-260420/audit-total.md` staged, `D docs/plans/audit-total.md` deleted non-staged (mv non-committe), 30+ untracked (6 projets Cowork jamais ajoutes, 15 sessions JSON, artifacts build tokens, donnees perso morning-intelligence.json).
- **Cause racine** : `/session-end` ne verifie pas systematiquement tous les dirs untracked ni les mv non-committes. Hook `scripts/auto-archive-plans.sh` suppose que git add sera fait manuellement. Multi-session rend ce risque systematique.
- **Fix** :
  - Hook `/session-end` doit inclure **`git status --short`** check + **warning si untracked ou staged non-commit**.
  - Ajouter `.gitignore` coverage pour artifacts runtime typique (`.claude/projects/`, `.claire/`, `modules/*/tokens/build/`, `*/morning-intelligence/*.json` donnees perso).
  - Audit cross-session systematique `bash scripts/ref-checker.sh` + `git status --short` = CI guard.
- **Regle** : **chaque fin de session, verifier `git status --short` doit etre vide** (ou que tous les untracked sont intentionnels). Si mv non-committe → finir commit. Si untracked projet → commit ou gitignorer explicitement.

## 🎯 Option C (copier files sans merge) > Option A (merge complet) pour branches antecedentes (2026-04-20)

**En bref (pour Kevin)** : Quand on veut recuperer du travail d'une vieille branche (genre 1 mois), il vaut mieux **copier les nouveaux fichiers un par un** que de faire un gros merge git. Le merge essaie de reconcilier des versions trop divergentes et casse les fichiers qui ont evolue (comme CONTEXT.md). La copie selective = zero conflit, exactement ce qu'on veut recuperer.

- **Date** : 2026-04-20 (audit reality-check E3)
- **Contexte** : branche `claude/determined-torvalds-903dc3` a 14 commits 2026-04-19 (D-CCCONFIG-01 + 46 pages wiki) mais son CONTEXT.md/CLAUDE.md/docs/core/* sont antecedents a toute la Phase 8 (Body/Product/Model) livree post.
- **Symptome pressenti Option A (merge complet)** : conflits massifs sur CONTEXT.md + CLAUDE.md + docs/core/architecture-core.md + docs/core/commands/session-start.md + wiki/hot.md + wiki/meta/sessions-recent.md. Temps resolution 2-3h avec risque erreurs manuelles.
- **Fix Option C** : `git diff main..branch --name-status | grep "^A"` → 47 files A new. `git checkout branch -- <file>` pour chaque. Zero conflit. Files M (CONTEXT/CLAUDE/commands) : SKIP et re-documenter en E5 coherent avec realite main.
- **Regle** : **pour integrer branche antecedente > 3 jours old**, toujours commencer par diff A-files only + copy selective. Les files M sont souvent des reecritures divergentes, pas des additions. Merger les M = risque de regression memoire. Re-documenter en E5 est plus propre.
- **Application FOS** : documentee dans `docs/core/concurrency.md` section "Recuperation branche antecedente" (a ajouter).

## 🎯 Subagent prompt > 1500 mots garantit thrashing Opus 4.7 (2026-04-19)

- **Date** : 2026-04-19 (D-AUDIT-TOTAL-01 session courante)
- **Contexte** : Agent A dispatch pour lire 24 auto-memoires actives + synthese. Prompt ~2000 mots avec contexte Foundation OS + scope + livrable + 24 fichiers path listes.
- **Symptome** : `Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row.` Agent fail complet. Output tronque message meta "a file being read or tool output is likely too large".
- **Cause racine** : Claude Opus 4.7 1M context, nouveau tokenizer. Subagent inherite 0% du contexte primary mais demarre avec prompt input massif. Si prompt > 1500 mots + 20+ fichiers Read → context rempli trop vite → thrashing garanti.
- **Fix pragmatique** : max 500 mots prompt par subagent. Scope precis (max 15 fichiers listes). Livrable structure court (table, markdown). Fallback Read direct si subagent echoue.
- **Regle** : **tout subagent prompt > 500 mots = risk thrashing Opus 4.7 1M**. Preferer Read direct (meme si plus long de flow) si on a besoin de lire 20+ fichiers. Subagents reserves pour scope precis (3-10 fichiers) + livrable structure court.
- **Application FOS** : documente `docs/core/model.md` section 5.2 "Subagents strategy". Reference pattern declaratif pour futurs Claude.

## 🎯 Stubs forward refs pattern zero regression plan multi-phase (2026-04-19)

- **Date** : 2026-04-19 (2x valide : D-BODY-01 P1 + D-AUDIT-TOTAL-01 P0)
- **Contexte** : plan multi-phase cree docs qui referent fichiers pas encore ecrits (P1/P2/P9/P13 findings + nouveau module docs/core/model.md). ref-checker health → DEGRADED (forward refs cassees).
- **Symptome** : pre-commit DEGRADED 1 warning, 11+ refs cassees. Impression fausse travail incomplet.
- **Cause racine** : pattern naturel "ecrire spec + findings avant implementation complete" cree forward refs. ref-checker detecte comme casse.
- **Fix** : creer stubs minimaux (~5 min) :
  - Fichiers markdown 10-15 lignes : "STUB forward ref Phase P0, sera rempli en Phase PN"
  - Pointer vers plan section phase future
  - Scripts bash stubs : `exit 0 + echo "pending PN"` + `--quiet` mode pour chain
- **Regle** : **tout plan multi-phase qui cree des refs avant implementation doit prevoir stubs forward des P0/P1**. 5 min travail = health SAIN pre-commit + visibilite completude coherente par phase.
- **Application FOS** : documente body.md pattern 2x + maintenant lesson. Reutilisable pour futurs plans ambitieux.

## 🎯 CONTEXT.md systematiquement en retard vs realite multi-worktree (2026-04-20)

- **Date** : 2026-04-20 (D-AUDIT-TOTAL-01 P10 discovery)
- **Contexte** : audit cross-worktree revele 3 worktrees actifs avec commits ahead main (jovial-jemison +45, determined-torvalds +14, condescending-ardinghelli +15). CONTEXT.md main dit "Phase 5 reportee" alors que Trading D-TRADING-01 Phase 8/8 DEJA livre dans jovial-jemison.
- **Symptome** : nouvelle session Claude qui lit CONTEXT.md obtient vue **obsolete** du projet. "Phase 5 reportee" = faux depuis 12 heures.
- **Cause racine** : CONTEXT.md est edit uniquement au `/session-end` du worktree qui l'ecrit. Si 3 worktrees travaillent en parallele, seul le dernier `/session-end` merge sa version. Les autres commits ne propagent pas vers CONTEXT.md main.
- **Fix short-term** : cloture serie D-CONCURRENCY-01 + update CONTEXT.md explicite a chaque merge.
- **Fix long-term** : tuile brief v12 SANTE "N worktrees (K divergent)" (appliquee P12c D-AUDIT-TOTAL-01) + potentiel D-ENFORCE-01 hook post-commit append `.omc/cross-worktree-state.json` + SessionStart Tour 1 lit ce fichier.
- **Regle** : **apres tout merge multi-worktree, refresh CONTEXT.md section Modules + Sessions + Cap**. Sinon drift garanti. Brief v12 SANTE worktrees = warning visuel minimum.
- **Application FOS** : documente `docs/core/concurrency.md` section 8 recette merge + `docs/core/communication.md` section 6.1 ligne SANTE worktrees.

## 🎯 MCP Notion create-view requires database_id AND data_source_id (2026-04-19)

- **Date** : 2026-04-19 (D-PRODUCT-01 P3 session)
- **Contexte** : Tentative creation 4 views natives Notion (Kanban by Status, Kanban by Module, Timeline Tasks, Timeline Plans) via `notion-create-view` avec seulement `data_source_id` comme parametre.
- **Symptome** : Erreur `Exactly one of 'database_id' or 'parent_page_id' must be provided` (validation_error 400) sur les 4 calls.
- **Cause racine** : le schema MCP notion-create-view exige **au moins un** de `database_id` ou `parent_page_id` EN PLUS de `data_source_id`. `data_source_id` seul = invalide.
- **Fix** : fournir **les deux** : `database_id` (page ID de la DB) + `data_source_id` (collection ID). Retry a reussi sur les 4 views.
- **Regle** : pour `notion-create-view`, toujours fournir `database_id` (format UUID de la page DB) ET `data_source_id` (format collection://UUID ou UUID). Le database_id correspond au page_url de la DB (ex: `094ff921bd6741beb9edd0283aeb2e38`).

## 🎯 MCP Asana limites pour full integration automatisee (2026-04-19)

- **Date** : 2026-04-19 (D-PRODUCT-01 P1 + pivot P1.5 session)
- **Contexte** : Plan initial D-PRODUCT-01 prevoyait full integration FOS ↔ Notion + Asana. Pendant P1 execution, decouverte de 3 limites MCP Asana bloquantes :
  1. `create_project` **absent** du MCP (seulement `create_project_preview` qui requiert confirmation UI Kevin)
  2. `update_project archived=true` **absent** (archive projet Asana = manuel UI)
  3. `create_tasks resource_subtype=section` **refuse** par Asana API ("You cannot create a section by setting a task's subtype")
- **Symptome** : setup structure Asana tout manuel UI, tasks CRUD seule possible via MCP. Pas viable pour "full integration automatisee".
- **Cause racine** : MCP Asana pense pour **gestion de tasks**, pas pour **setup de structure**. Les endpoints projet/section sont manquants du MCP mais existent dans Asana API REST native.
- **Fix** : pivot P1.5 Notion-only. Notion MCP supporte `create_database` + `create_view` + `update_data_source` + `create_pages` = equivalent complet pour role PO. Abandon Asana, Notion absorbe le role kanban via DB Tasks + views natives.
- **Regle** : **avant de committer a integrer 2 plateformes**, verifier le support MCP complet des **operations de setup structure** (pas juste tasks CRUD). Si plateforme A manque create_project/section/etc. → probable que plateforme B (si dispo) est plus pragmatique pour "full automation". YAGNI P-20 : 1 plateforme < 2 plateformes pour dev solo.

## 🎯 Pivot en cours de session = flexibilite necessaire (2026-04-19)

- **Date** : 2026-04-19 (D-PRODUCT-01 P1.5 pivot)
- **Contexte** : Plan initial D-PRODUCT-01 avait 5 phases 22-29h pour full integration FOS ↔ Notion + Asana. Apres P1 bootstrap (80% fait), decouverte limites MCP Asana. 2 options : (a) forcer le plan initial avec workarounds UI Kevin lourds, (b) pivoter P1.5 vers Notion-only.
- **Decision** : pivot P1.5 Notion-only (option b). Duree pivot : 10 min decision + 30 min execution (5 fichiers rewrite + 1 DB Tasks ajoutee + updates meta).
- **Regle** : **un plan n'est pas sacre**. Si une contrainte externe (MCP limite, API down, plateforme payante) invalide une hypothese clé, **pivoter dans la meme session** est OK. Pattern : commit `P1.5 pivot <description>` atomique pour traceabilite. Mettre a jour frontmatter plan + spec + agent + scripts coherentement.
- **Anti-pattern** : forcer le plan initial avec workarounds lourds qui degradent l'UX (plein de "Kevin doit cliquer ici, Kevin doit cliquer la"). L'honnetete P-11 dit : si la plateforme ne peut pas le faire, changer la plateforme plutot que mettre la pression sur l'utilisateur.

## 🎯 Pattern manifest-driven pour honnetete P-11 MCP (2026-04-19)

- **Date** : 2026-04-19 (D-PRODUCT-01 sessions P1-P4)
- **Contexte** : Les scripts `scripts/po-*.sh` (init/sync/pull/status) doivent orchestrer des actions MCP Notion, mais **bash ne peut pas invoquer MCP directement** (limite Claude Code architecture : MCP tools callables uniquement par Claude session, pas subprocess).
- **Cause racine** : bash peut : parser FOS state, generer JSON, log ; mais ne peut pas : call `mcp__notion__*` tools.
- **Fix** : pattern **manifest-driven** :
  1. Script bash parse etat FOS (CONTEXT.md, plans, sessions) + genere manifest JSON dans `.omc/po-manifests/YYYY-MM-DD-HHMM-<action>.json`
  2. Manifest liste **actions_suggested** avec tool MCP + params hints
  3. Claude (session principale OU subagent) lit manifest + execute MCP calls sequentiellement
  4. Claude ecrit resultats dans `.omc/po-results/`
  5. Script (re-invoque avec `--apply-results`) persiste IDs dans `.omc/product-config.json`
- **Avantages** :
  - Traceabilite complete (manifests = journal immuable)
  - Idempotence via `--dry-run` mode
  - Recovery post-compactage (re-read manifest apres compact)
  - Separation bash (parse + log) vs Claude (MCP execute)
- **Regle** : pour tout orchestrateur bash qui requiert MCP, **ne pas forcer bash a invoquer MCP** (impossible). Pattern : bash genere manifest JSON + Claude execute. Documente dans spec section "Pattern manifest-driven (honnete P-11)".

## 🎯 DB select options : ALTER COLUMN SET pour extension post-creation (2026-04-19)

- **Date** : 2026-04-19 (D-PRODUCT-01 P2 push)
- **Contexte** : DB Tasks cree P1.5 avec Module select options = `Core OS / App Builder / Design System / Knowledge / Cowork / Phase 5 / Cross`. P2 tentative de push 6 phases D-PRODUCT-01 avec `Module: "Product"` → fail `Invalid select value for property "Module": "Product". Value must be one of the following...`.
- **Cause racine** : j'avais oublie d'inclure "Product" et "Body" en creant le schema initial DB Tasks (alors que DB Decisions les avait). Asymetrie entre schemas.
- **Fix pragmatique** : utiliser "Core OS" pour les tasks D-PRODUCT-01 (semantiquement correct : Product = 9e module Core OS). Puis en P3, update schema via `notion-update-data-source ALTER COLUMN "Module" SET SELECT('Core OS':gray, 'App Builder':blue, 'Design System':pink, 'Knowledge':green, 'Body':purple, 'Product':orange, 'Cowork':brown, 'Phase 5':yellow, 'Cross':default)` pour ajouter Body + Product.
- **Regle** : pour ajouter une option select a une DB existante, utiliser `ALTER COLUMN "Prop" SET SELECT(...)` avec la liste **complete** des options (remplace entierement). Les valeurs existantes avec options deprecated restent mais ne peuvent plus etre assigned.

## 🎯 Stubs forward refs : pattern zero regression plan multi-phase (2026-04-19)

- **Date** : 2026-04-19 (D-BODY-01 P1 session)
- **Contexte** : Plan Body 5 phases cree `docs/core/body.md` et `docs/core/constitution.md` qui referent `scripts/alignment-analyze.sh` (P2 futur), `scripts/constitution-suggest.sh` (P3 futur), `.claude/agents/alignment-auditor.md` (P4 futur), `docs/constitution-archive.md` (P5 futur). Apres creation des 2 specs en P1 : ref-checker flag 22 forward refs cassees.
- **Symptome** : health-check DEGRADED (1 warning, 22 refs cassees) alors que P1 est correctement execute. Impression fausse de travail incomplet. Pre-commit hook bloque.
- **Cause racine** : pattern naturel "ecrire la spec canonique, puis l'implementer en phases successives" cree forward refs qui cassent pendant la periode intermediaire entre la spec et les implementations.
- **Fix** : creer 4 stubs minimaux (~5 min) :
  - Scripts bash `exit 0 + echo "pending PN"` avec mode `--quiet` pour chain
  - Subagent frontmatter minimal (name, model, description) + "stub PN TBD"
  - Docs md archive vide avec pointer vers plan + spec
- **Regle** : **tout plan multi-phase qui cree des refs avant implementation complete doit prevoir stubs forward des P1**. Pattern : shell script stub avec message "pending PN", agent frontmatter minimal, docs vides avec pointer vers plan. Les phases suivantes remplacent le contenu stub par l'implementation reelle.
- **Generalisation** : pattern aussi utile pour specifier des APIs en avance (function signatures + `// TODO P2`) ou des modules (imports declares + `// TODO P3`). Evite DEGRADED intermediaire + Kevin voit la completude coherence de chaque phase.

## ref-checker : backtick paths modules/X doivent avoir trailing slash (2026-04-19)

- **Date** : 2026-04-19 (D-CONCURRENCY-01 session)
- **Contexte** : Ecrit `docs/core/concurrency.md` avec exemples backtick de chemins modules Phase 5 (finance, trading) sans trailing slash, comme illustration d'isolation.
- **Symptome** : `bash scripts/ref-checker.sh` flag 2 refs cassees car modules/finance/ et modules/trading/ **n'existent pas encore** (Phase 5 placeholders wiki uniquement).
- **Cause racine** : `IGNORE_REFS_RE` (ligne 57 ref-checker.sh) inclut les modules Phase 5 avec trailing slash obligatoire. Sans le slash, la regex ne match pas → ref checkee → broken.
- **Fix** : ajouter trailing slash a tous les exemples backtick de modules Phase 5. Pattern appris : **pour referencer un module Phase 5 en markdown backtick, toujours ajouter `/` final**.
- **Regle** : avant de committer un doc avec des exemples de paths, **lancer `bash scripts/ref-checker.sh` en local**. Les faux positifs viennent souvent de conventions subtiles (trailing slash, anchors, etc.) qu'il vaut mieux respecter que debattre.

## YAGNI : quand ne pas ajouter une couche de safety (2026-04-19)

- **Date** : 2026-04-19 (D-CONCURRENCY-01 session)
- **Contexte** : J'ai propose un systeme de "lock par fichier" pour empecher 2 sessions d'ecrire CONTEXT.md simultanement. Kevin a challenge : "tu m'assures que c'est realiste et pragmatique ?".
- **Revelation** : en reevaluant honnetement, le lock :
  1. Je ne l'avais jamais teste reellement en multi-worktree
  2. Ajoute un point de faille (TTL 5 min = bloquant si crash)
  3. Requiert discipline Claude (oublier l'acquire = pas de protection)
  4. Benefice marginal pour Kevin dev **solo** (proba collision < 1%/semaine)
- **Decision** : YAGNI (You Aren't Gonna Need It). Documenter la discipline ("cloture en serie") > automatiser une protection complexe.
- **Regle** : **avant d'ajouter une couche de safety automatisee**, verifier :
  (a) La frequence **reelle** du risque dans l'usage Kevin (pas le scenario theorique).
  (b) Le cost/benefit (complexite maintenance + points de faille vs probabilite d'evenement).
  (c) Si une discipline documentee + doc canonique (specs Core OS) couvrent 80% du besoin avec 0 code, c'est **preferable** a une protection automatisee 95% avec 10x plus de complexite.
- **Corollaire** : si Kevin passe a une equipe (>2 devs actifs), reevaluer. Les regles YAGNI solo ≠ regles YAGNI equipe.

## Pattern etoile vs mesh : eviter hubs surdimensionnes (2026-04-17)

- **Date** : 2026-04-17 (mapping refactor session)
- **Contexte** : `wiki/meta/foundation-os-map.md` avait accumule 81 wikilinks (hub central "etoile") qui listait CHAQUE page du projet individuellement. Redondant avec `index-wiki.md` (53 wikilinks) + 7 sous-indexes (index-concepts, index-entities, index-sources, index-meta, index-core-os, index-cowork). Pattern "etoile" fragile : si map casse → graph Obsidian perd colonne vertebrale.
- **Probleme** : a 50 pages c'est gerable. A 500 pages (Phase 5 Finance/Sante/Trading) ca aurait ete ingerable (500+ wikilinks dans 1 fichier). Non-scalable.
- **Fix** : refactor foundation-os-map en **hub niveau 2** (205L -> 74L, 81 wikilinks -> 27). Role : pointer vers sous-indexes + 4 concepts canoniques. Les sous-indexes font le travail des listes exhaustives. Les pages feuilles sont reachable en 2-3 clicks via index-wiki -> sous-index -> page.
- **Regle** : pour un hub wiki, **plafonner a 30-40 wikilinks max**. Au-dela, decouper en sous-indexes par famille (concepts, entities, sources, domains, meta). Pattern mesh > etoile pour resilience + scalabilite.
- **Application** : chaque fois qu'un fichier accumule > 40 wikilinks, considerer decoupage en sous-indexes. Exemple futur : si index-concepts.md grossit (Phase 5 ajoute concepts trading/finance/sante), split par domaine.

## Split TSX legacy : verifier refs documentaires avant de decouper (2026-04-17)

- **Date** : 2026-04-17 (cleanup session)
- **Contexte** : DashboardDesignSystem.tsx (1788L) tagged WARN par health-check. Plan propose split en 5 sous-sections.
- **Decouverte** : `grep "DashboardDesignSystem" modules/design-system/src/components/ui/` revele 41 composants ui/ avec commentaires `iso DashboardDesignSystem.tsx lignes X-Y` en header docstring (ex: `avatar.tsx:4 — iso DashboardDesignSystem.tsx "Avatars & Groupes" (lignes 1349-1375)`).
- **Risque** : split casserait toutes ces 41 refs documentaires de derivation. Elles temoignent que chaque ui/ composant est derive d'une section precise du template showcase.
- **Decision Kevin** : accepter le fichier comme exception template showcase. Seuil TSX releve a 2000L pour `modules/design-system/src/components/patterns/` (comme 800L exception pour `ui/` DS shadcn origin).
- **Regle** : avant de split un gros fichier, `grep` son basename dans tout le codebase. Si > 10 refs le pointent par ligne ou par section, **ne pas split** sans update coordonne des refs. Accepter comme exception documentee si c'est un template/showcase, pas du code runtime.
- **Gain** : 5 min d'analyse au lieu de 1h30 de remapping fragile.

## ref-checker regex split sur espace : faux positifs backtick avec path spaces (2026-04-17)

- **Date** : 2026-04-17 (cleanup session)
- **Contexte** : `modules/design-system/README-design-system.md` reference `` `.archive/ds-reference-base-260417/base DS/` `` (espace dans path). ref-checker reporte "broken".
- **Cause racine** : `scripts/ref-checker.sh` ligne 144 `ref_clean="${ref_clean%% *}"` retire tout apres le premier espace. Le ref devient `.archive/ds-reference-base-260417/base` (sans `DS/`), qui n'existe pas → flagged.
- **Contexte du split** : utile pour les refs type *"scripts/example.sh arg1 arg2"* ou on veut juste le path avant l'espace, mais casse les paths qui contiennent un espace (ex: `base DS/`).
- **Fix pragmatique** : etendre `IGNORE_REFS_RE` avec les prefixes `.archive/` connus qui ont des paths avec espaces (`ds-reference-base-|audit-v2-done-`). Plus simple que re-ecrire la logique split.
- **Regle** : si ref-checker flag une ref qui existe visiblement, **verifier manuellement** via `ls` ou `find`. Si vrai positif → recabler. Si faux positif (espaces, path pattern script limitation) → ajouter au `IGNORE_REFS_RE` + documenter.

## Push main apres merge : autoriser automatiquement (2026-04-17)

- **Date** : 2026-04-17 (audit v2 cloture)
- **Contexte** : Apres merge `claude/elated-easley-38523c` dans main (12 commits audit v2), je n'ai PAS push sur `origin/main`. Kevin m'a demande "t'as pushe sur main ?". J'ai repondu "non, CLAUDE.md dit interdit sans Kevin".
- **Reaction Kevin** : "tu me fais ce probleme plusieurs fois. Comprends la raison racine." → frustration legitime.
- **Cause racine** : CLAUDE.md ligne 128 disait `git push sur main/remote ou --force` = interdit **sans nuance**. Je l'ai pris litteralement. Mais **Kevin s'attend** a ce que push fasse partie du "on merge fin de session" — sinon nouveau contexte aveugle, Vercel stale, desync multi-device.
- **Erreur** : 2 regles contradictoires dans ma tete (CLAUDE.md literal vs intention workflow Kevin), j'ai choisi la regle ecrite sans alerter la contradiction. **Piege 4 lessons-learned inverse** : trop literal sur regle ecrite, pas assez attentif a intention implicite.
- **Fix immediat** : CLAUDE.md section "Interdit sans Kevin" refondue avec section explicite "Push main : autorise automatiquement apres merge valide". Push main devient default apres merge, pas une permission a redemander.
- **Regle** : **quand Kevin dit "on merge", "on clot", "change de session" → le push est inclus**. Ne pas le separer. Seul `--force` reste interdit sans demander.

## I-01 hook wiki-recall : API CLAUDE_USER_PROMPT inexistante (2026-04-17)

- **Date** : 2026-04-17 (audit v2 Phase 12)
- **Contexte** : Plan master audit v2 proposait un hook PreToolUse qui grep `wiki/` avant chaque reponse technique via `$CLAUDE_USER_PROMPT` env var. Objectif : forcer reflexe 1 neuroplasticite.
- **Verification** : `CLAUDE_USER_PROMPT` **n'est pas une variable standard** Claude Code. Les hooks recoivent leur input via **stdin JSON**, pas env. Implementer un hook qui `grep wiki/ $CLAUDE_USER_PROMPT` tournerait a vide silencieusement.
- **Decision** : SKIP Phase 12 audit v2. Re-faisabilite requiert lecture spec Claude Code hooks (stdin JSON format) + parsing correct.
- **Regle** : **tester la faisabilite d'une API AVANT** d'implementer un hook. Les specs audit qui supposent des env vars (`$CLAUDE_USER_PROMPT`) doivent etre verifiees avec `man` equivalent OU un test reel avant commit.

## Audit Foundation OS — 5 pièges de cadrage (mega audit v2, 2026-04-16)

### Piège 1 — Confondre FORME et FONCTION quand Kevin dit "audit"
- **Date** : 2026-04-16
- **Contexte** : Kevin demande "audit complet de comportement, architecture, mémoire, fonctionnement, organicité, intelligence, maintenabilité, monitoring, tout"
- **Erreur commise** : j'ai pattern-matché "audit + fichiers + dossiers" → j'ai fait un audit HYGIENE (coherence fichiers, refs cassées, duplications). 146 findings de drift documentaire.
- **Ce que Kevin voulait vraiment** : audit de FONCTION cognitive — est-ce que l'OS fonctionne comme un cerveau collaboratif ? Les 4 reflexes neuroplasticite sont-ils appliques ? Le routing Cortex est-il enforce ? Les 14 routines Cloud existent-elles reellement ?
- **Régle** : quand Kevin utilise des mots systemiques (comportement, intelligence, organicite, fonctionnement), il parle du **fonctionnement cognitif** de l'OS, pas de la coherence des fichiers. **Audit hygiene** != **audit cerveau**. Demander clarification si ambigu AU DEBUT, pas apres 45 min d'effort gaspillé.

### Piège 2 — Surgonfler les findings pour paraitre utile
- **Date** : 2026-04-16
- **Contexte** : j'ai presente un audit de coherence (drifts docs) comme "DEGRADED STRUCTUREL 7.2/10" avec "10 P0 critiques" et "bombes a retardement".
- **Réalité** : rien ne casse aujourd'hui. Les "bombes" sont des scenarios hypothetiques (clean install, merge commit, rerun migration) qui ne se produisent pas dans l'usage quotidien. Foundation OS marche.
- **Régle** : l'honnetete doit primer. Si l'OS marche, dire "marche avec drifts mineurs a nettoyer". Ne JAMAIS habiller un audit de surface avec des termes alarmants pour justifier l'effort. Kevin voit clair.

### Piège 3 — Cloner mon mauvais cadrage à 7 sous-agents
- **Date** : 2026-04-16
- **Contexte** : j'ai brief 7 sous-agents paralleles sur "verifier coherence fichiers, refs cassées, counts, duplications".
- **Conséquence** : les 7 rapports ont tous audite la FORME. Mon biais s'est propage x7. Si j'avais brief "simuler scenarios d'usage et evaluer si l'OS guide bien Claude", les rapports auraient ete completement differents.
- **Régle** : le cadrage du sous-agent reflete mon propre biais amplifie. **Avant** de lancer des sous-agents, s'arreter 5 min pour se demander : "ai-je compris la vraie demande ? est-ce que mon prompt reflete la demande ou mon confort ?"

### Piège 4 — Ne pas écouter les mots exacts de Kevin
- **Date** : 2026-04-16
- **Contexte** : Kevin a liste explicitement "comportement, architecture, memoire, fonctionnement, organicite, intelligence, maintenabilite, monitoring". J'ai reduit a "hygiene de fichiers" parce que c'est ce que je sais faire.
- **Régle** : lire chaque mot LITTERALEMENT, pas pattern-matcher. Si Kevin dit "comportement", c'est COMPORTEMENT (simuler scenarios, tester reflexes). Si Kevin dit "organicite", c'est comment l'OS evolue et se repare. Chaque mot a un sens precis. **CLAUDE.md ligne 5** ("Executer a la lettre — pas d'interpretation, pas de raccourci, pas de version simplifiee") s'applique aussi a la comprehension de la demande, pas seulement a l'execution.

### Piège 5 — Proposer "un autre audit" au lieu d'admettre l'erreur
- **Date** : 2026-04-16
- **Contexte** : Kevin m'a challenge 3 fois dans la session. A la 1e fois ("tout fonctionne ?"), j'ai propose "un audit plus profond". Au lieu d'admettre direct "j'ai mal cadre, refaisons".
- **Conséquence** : Kevin a du me corriger plusieurs fois avec des messages de plus en plus fermes ("pourquoi tu m'as bullshit ?", "j'en ai marre que tu t'excuses, fais ce que je demande").
- **Régle** : quand Kevin challenge, NE PAS vendre une correction. Admettre direct, court : "oui j'ai mal compris, voila la vraie demande reformule, je relance". Pas de "je propose un autre audit" qui donne l'impression qu'on ne sait pas si l'initial etait bon. **Honnetete immediate > negociation diplomatique**.

### Référence canonique
Page definie `wiki/concepts/Foundation OS.md` ecrite 2026-04-16 pour que les futurs Claude ne retombent pas dans ces pièges. **LIRE EN PREMIER** au SessionStart si doute sur ce qu'est Foundation OS.

## Obsidian — Audit fantômes

### Obsidian n'indexe pas les dossiers cachés (.claude/, .git/, etc.)
- **Date** : 2026-04-16
- **Contexte** : wikilinks `[[.claude/commands/cockpit|cockpit]]` dans foundation-os-map.md
- **Symptôme** : noeuds gris "non résolus" dans le graph, même avec paths explicites
- **Cause racine** : Obsidian ignore les dossiers commençant par `.` (hidden folders). Les fichiers `.claude/commands/*.md` ne sont pas indexés.
- **Fix** : utiliser des backticks `` `cockpit` `` au lieu de wikilinks. Les commandes/agents ne sont pas des pages wiki.
- **Règle** : ne JAMAIS wikilinker des fichiers dans des dossiers cachés (`.claude/`, `.git/`, `.omc/`). Utiliser du texte brut ou backticks.

### Chercher les FICHIERS avant les wikilinks
- **Date** : 2026-04-16
- **Contexte** : Kevin signale 5 pages fantômes (A, B, X, file, page) visibles dans le graph Obsidian
- **Symptôme** : nœuds vides dans le graph, reliés à rien
- **Erreur** : scan de wikilinks au lieu de chercher les fichiers physiques. Fix partiel (source wikilink), puis Kevin voit toujours les fantômes
- **Cause racine** : Obsidian crée des fichiers .md vides quand on clique sur un wikilink mort. Les fichiers physiques (A.md, X.md, file.md, page.md) existaient à la racine du projet
- **Fix** : `find . -name "A.md"` aurait trouvé le problème en 2 secondes
- **Règle** : quand Kevin signale un problème VISIBLE dans Obsidian, TOUJOURS commencer par chercher les fichiers physiques (`find`) AVANT d'analyser les wikilinks. Problème concret = vérification concrète d'abord.

## Worktrees Desktop

### Toujours merger dans main avant de clôturer une session worktree
- **Date** : 2026-04-16
- **Contexte** : Session dans worktree `sharp-albattani` (auto-créé par Desktop). 2 commits livrés mais invisibles dans les autres conversations.
- **Symptôme** : Nouvelle session sur main affiche le même brief qu'avant — aucun changement visible.
- **Cause racine** : Desktop crée des worktrees avec branches `claude/*` isolées. Les commits restent dans la branche locale, main ne bouge pas.
- **Fix** : `cd /chemin/repo/principal && git merge claude/<worktree> --ff-only` en fin de session.
- **Règle** : TOUJOURS merger dans main avant de clôturer une session dans un worktree Desktop. Vérifier avec `git log -1 main` que le dernier commit est bien le nôtre.

## Obsidian + Wikilinks

### Wikilinks relatifs `../` ne fonctionnent PAS dans Obsidian
- **Date** : 2026-04-16
- **Contexte** : Phase 7 ingest, toutes les pages wiki utilisaient `[[../entities/Andrej Karpathy]]`
- **Symptôme** : noeuds fantômes dans graph view, "folder already exists" au clic
- **Fix** : utiliser basenames directs `[[Andrej Karpathy]]` ou paths absolus vault `[[wiki/entities/Andrej Karpathy]]`
- **Règle** : JAMAIS de `../` dans les wikilinks Obsidian. Toujours basename ou path absolu vault.

### Noms de fichiers avec espaces causent faux positifs wiki-health.sh
- **Date** : 2026-04-16
- **Contexte** : `Andrej Karpathy.md`, `LLM Wiki Pattern.md` — wiki-health.sh grep ne gère pas les espaces
- **Symptôme** : ~45 wikilinks "cassés" = faux positifs
- **Fix** : TODO améliorer wiki-health.sh pour quoter les variables dans find
- **Workaround** : ignorer le warning wikilinks pour l'instant

### Noms ambigus (README, index, _index) dans graph Obsidian
- **Date** : 2026-04-16
- **Contexte** : 5x README.md, 3x index.md, 5x _index.md dans le projet
- **Symptôme** : wikilinks `[[README]]` pointent vers le mauvais fichier
- **Fix** : utiliser paths complets avec alias `[[modules/design-system/README-design-system|README DS]]`

## Claude Code Plugins

### Plugin install SSH Permission denied
- **Date** : 2026-04-15
- **Contexte** : `claude plugin install claude-obsidian@claude-obsidian-marketplace` échoue avec SSH
- **Symptôme** : "git@github.com: Permission denied (publickey)" malgré marketplace add OK via HTTPS
- **Cause racine** : marketplace source type `github` (SSH) au lieu de `git` (HTTPS)
- **Fix** : `git config --global url."https://github.com/AgriciDaniel/".insteadOf "git@github.com:AgriciDaniel/"` — ciblé par owner, zéro impact autres repos
- **Règle** : pour tout plugin marketplace tiers, vérifier SSH vs HTTPS et ajouter insteadOf si besoin

## Scripts Foundation OS

### health-check.sh whitelist Structure doit inclure tout nouveau dossier racine
- **Date** : 2026-04-15
- **Contexte** : création `wiki/` à la racine → health-check le flagge comme "orphelin" → BROKEN → commit bloqué
- **Fix** : ajouter `wiki` dans la regex whitelist de health-check.sh
- **Règle** : CHAQUE nouveau dossier racine → immédiatement ajouter dans whitelist health-check.sh

### Conventional commits : `wiki:` n'est pas un type valide
- **Date** : 2026-04-16
- **Contexte** : commit message `wiki: first ingest...` rejeté par hook commit-msg
- **Fix** : utiliser `feat(wiki):` (feat = nouveau contenu, wiki = scope)
- **Règle** : types valides = feat/fix/docs/refactor/chore/test/style/build/ci/perf/revert. Le scope entre parenthèses est libre.

### Agents audit : vault racine invalide les "fantômes"
- **Date** : 2026-04-16
- **Contexte** : 5 agents opus ont audité le wiki en supposant vault = `wiki/` seulement. Ont reporté 52 fantômes DS + 60 refs hors-wiki.
- **Symptôme** : Findings bullshit — les fichiers existaient tous dans le repo
- **Cause racine** : Le vault Obsidian = racine projet (pas juste wiki/). `[[01-button]]` résout vers `modules/design-system/docs-supernova/components/01-button.md`.
- **Fix** : Vérifier avec `find . -name "basename.md"` avant de déclarer un fantôme. 11 findings retirés.
- **Règle** : TOUJOURS vérifier l'existence du fichier dans TOUT le repo, pas juste wiki/.

### wiki-health.sh : BROKEN_LINKS toujours 0 (bug subshell pipe)
- **Date** : 2026-04-16
- **Contexte** : `grep | while read` crée un subshell. Variable incrémentée dans le subshell perdue au retour.
- **Fix** : Remplacer pipe par process substitution `< <(grep ...)` + tmpfile compteur.
- **Règle** : En bash, JAMAIS incrémenter une variable dans un `| while`. Utiliser `< <()` ou tmpfile.

### drift-detector index count : faux positif meta vs contenu
- **Date** : 2026-04-16
- **Contexte** : drift check compare "Total pages: 11" dans index.md vs 25 fichiers .md filesystem (inclut meta, templates, _index)
- **Fix** : TODO aligner le comptage (exclure meta/templates du count filesystem OU mettre à jour index.md avec total réel)
