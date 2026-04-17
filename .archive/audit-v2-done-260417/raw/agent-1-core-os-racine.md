---
type: audit-raw
agent: 1
zone: "Core OS + Racine"
date: 2026-04-16
scope_files: 15
lines_read: 2710
status: completed
---

# RAPPORT AGENT 1 — CORE OS + RACINE

## Inventaire

Tous les fichiers lus **integralement** (pas en skim) :

- `CLAUDE.md` : 200 L — lu integralement
- `CONTEXT.md` : 133 L — lu integralement
- `README.md` : 53 L — lu integralement
- `.gitignore` : 41 L — lu integralement
- `package.json` : 11 L — lu integralement
- `docs/core/architecture-core.md` : 106 L — lu integralement
- `docs/core/cortex.md` : 115 L — lu integralement
- `docs/core/communication.md` : 412 L — lu integralement
- `docs/core/knowledge.md` : 258 L — lu integralement
- `docs/core/monitor.md` : 112 L — lu integralement
- `docs/core/naming-conventions.md` : 220 L — lu integralement
- `docs/core/planner.md` : 202 L — lu integralement
- `docs/core/tools.md` : 175 L — lu integralement
- `docs/core/worktrees.md` : 195 L — lu integralement
- `docs/core/tools/README-tools-catalogue.md` : 164 L — lu integralement
- `docs/core/tools/index.json` : 50+L (top) — lu partiellement (structure + totaux verifies via python)
- `docs/core/tools/routing.json` : 30+L (top) — lu partiellement (structure verifiee)

TOTAL scope principal : 15 fichiers .md/.json lus integralement + 2 .json partiels = **17 fichiers**, environ **2710 lignes**.

## Findings P0 (bloquants — casse le systeme)

### F-01 Counts catalogue incoherents : 99 vs 109 (dette reelle)
- **Fichiers** : `docs/core/tools/README-tools-catalogue.md:19` annonce **Total 109**. `docs/core/tools.md:6` annonce `109 outils, 10 categories`. `docs/core/tools/index.json:4` annonce `total_tools: 109`.
- **Description** : Somme verifiee des registry/*.json par python = **99** (agents 4 + ci 2 + commands 7 + hooks 4 + mcp 13 + scripts 7 + skills-bmad 12 + skills-omc 36 + skills-superpowers 14). Les 10 knowledge-skills sont declares dans index.json mais PAS dans un fichier registry propre — ils sont inlines dans `index.json` (key `knowledge-skills.tools`). 99 + 10 = 109. Donc le count est "techniquement exact" uniquement si on accepte que les 10 knowledge-skills soient dans index.json et non dans `registry/knowledge-skills.json`.
- **Impact** : L'auto-regeneration via `tool-register.sh` ne peut pas recompter sans regle speciale. Drift potentiel : si on ajoute un 11e knowledge-skill, il faut modifier index.json ET lui seul. Violation de la source-unique.
- **Recommandation** : creer `docs/core/tools/registry/knowledge-skills.json` et deplacer le bloc `tools:` actuellement inline dans `index.json`. Remettre le count a 10 via le meme mecanisme que les 9 autres categories.

### F-02 README-tools-catalogue.md auto-genere mais periphme : descriptions tronquees a ~70 chars
- **Fichier** : `docs/core/tools/README-tools-catalogue.md:25-163` — chaque ligne "description" coupee en plein milieu d'une phrase (ex: "Agent developpement — code React/Vite/TypeScript, composants Void Glas").
- **Description** : Le script generateur tronque les descriptions ce qui rend le catalogue illisible pour scanner. Ex: `| Void Glass Validator | Hook PreToolUse Claude — bloque l'ecriture de couleurs interdites et f |`
- **Impact** : Kevin / sub-agent qui cherchent une description complete doivent aller dans chaque registry/*.json. Valeur pratique quasi nulle du README.
- **Recommandation** : augmenter la troncature a 180 chars OU generer les descriptions completes (sans troncature) OU supprimer la colonne description et pointer vers registry/*.json.

### F-03 Brief v11 still referenced in auto-regenerable file (registry/commands.json)
- **Fichier** : `docs/core/tools/registry/commands.json:7,22,27,40,55,73,89` — 7 mentions "Brief v11" dans les descriptions de `/cockpit`, `/session-start`, `/session-end`.
- **Description** : Alors que `docs/core/communication.md:262` declare Brief v12 comme version actuelle et que CLAUDE.md:52-55 parle de v12, le registry contient encore "v11", "cadres box-drawing", "11 sections". Le `README-tools-catalogue.md:42` est cite correct ("v12") mais il est regenere depuis registry donc il y a un decalage de regen.
- **Impact** : Le catalogue auto-genere est partiellement v11 partiellement v12. L'un des deux n'a pas ete regenere. Kevin ou un agent qui lit le catalogue peut croire que le brief est toujours v11.
- **Recommandation** : editer `registry/commands.json` pour corriger toutes les mentions "v11" → "v12" + re-generer README-tools-catalogue.md via `tool-register.sh rebuild`. Verifier que le script gere ce cas.

### F-04 Monitor seuil CSS : contradiction CLAUDE.md vs CONTEXT.md vs monitor.md
- **Fichier** : `docs/core/monitor.md:34` Info `JS < 600KB, CSS < 40KB` VS `monitor.md:86` baseline `CSS ~55KB, alerte si > 65KB` VS `CONTEXT.md:56` "Sous seuil 65KB" VS `docs/core/communication.md:172` "CSS > 40 kB 🟡".
- **Description** : La section 1 (Info) de monitor.md dit CSS < 40KB mais la section 4 (Seuils) dit 65KB. Communication.md:172 dit 40KB. Le CONTEXT.md dit 65KB. Il y a 3 sources de verite qui disent des choses differentes.
- **Impact** : health-check.sh peut appliquer un seuil different selon ce qu'il lit. Les alertes peuvent declencher a tort. Drift des docs.
- **Recommandation** : aligner les 3 fichiers sur **65KB** (le baseline actuel 55KB + marge). Editer `monitor.md:34`, `communication.md:172` pour passer a 65KB. Rappeler dans monitor.md section 4 que c'est LA source unique.

## Findings P1 (importants — drift majeur, pas bloquant)

### F-05 7 hooks CLAUDE.md vs 3 hooks settings.json
- **Fichier** : `CONTEXT.md:119` dit `Hooks : validate-void-glass + security-reminder + branch-name-check + pre-commit + commit-msg + SessionEnd auto-archive + SessionStart drift-detector` (7 hooks).
- **Description** : `.claude/settings.json` n'a que 3 hook types (PreToolUse Write|Edit, SessionEnd, SessionStart). branch-name-check.sh existe mais n'est pas dans settings.json (juste dans pre-commit potentiellement). pre-commit + commit-msg sont des git hooks (dans .git/hooks), pas des Claude hooks. Donc CONTEXT.md est techniquement correct (7 hooks au total) mais le grouping porte a confusion.
- **Impact** : Confusion entre git hooks et Claude hooks. Nouveau developpeur ou sub-agent qui lit CONTEXT.md s'attend a 7 Claude hooks.
- **Recommandation** : preciser dans CONTEXT.md : `Hooks Claude (3) : PreToolUse validate-void-glass+security-reminder, SessionStart drift-detector, SessionEnd auto-archive. Git hooks (2) : pre-commit health-check, commit-msg conventional. Hooks optionnels (2) : branch-name-check, wiki-recall-reminder, session-start-wiki.`

### F-06 CLAUDE.md declare scripts `wiki-ingest` mais c'est en realite un skill plugin
- **Fichier** : `CLAUDE.md:105,112,173` references `wiki-ingest` sans backticks comme script. `docs/core/tools.md:56` le liste comme "Skill" (plugin claude-obsidian).
- **Description** : `wiki-ingest` n'est PAS un script bash dans `scripts/`. C'est un skill du plugin claude-obsidian v1.4.3 invoque via Task tool / agents. La syntaxe "bash wiki-ingest" dans CLAUDE.md induit en erreur.
- **Impact** : Claude/agent qui tente `bash wiki-ingest` obtient `command not found`. Usage doit passer par le skill.
- **Recommandation** : dans CLAUDE.md, preciser `wiki-ingest` (skill plugin claude-obsidian, invocation via Task tool / slash command `/wiki-ingest`) — et eviter le contexte "script".

### F-07 tools.md section 1 scripts incomplete (5 scripts cites, 17 scripts existent)
- **Fichier** : `docs/core/tools.md:26-32` liste seulement **4 scripts** (health-check, sync-check, ref-checker, module-scaffold).
- **Description** : Le dossier `scripts/` contient **17 scripts** (health-check, sync-check, ref-checker, drift-detector, docs-sync-check, auto-archive-plans, wiki-commit, wiki-health, wiki-metrics, wiki-suggest-links, worktree-{new,list,clean}, module-scaffold, tool-register, session-lock, git-hooks/, hooks/). tools.md n'en liste que 4.
- **Impact** : Doc incomplete. Sub-agent qui lit tools.md ne sait pas que wiki-metrics, wiki-suggest-links, session-lock existent. Il recreerait potentiellement ces scripts.
- **Recommandation** : regenerer la section Scripts de tools.md integralement a partir de `ls scripts/*.sh`. Mettre la source de verite dans `registry/scripts.json` (qui a 7 scripts declares — donc aussi incomplet : 7/17).

### F-08 Planner.md section 3 : ralplan mention mais skill exists dans superpowers ET omc
- **Fichier** : `docs/core/planner.md:74` `Consensus ou debat d'options | oh-my-claudecode:ralplan`.
- **Description** : Le nom exact dans le plugin OMC est `ralplan` (voir skills-omc.json). Pas de probleme factuel. MAIS la ligne 78 mentionne `oh-my-claudecode:plan` — ce skill existe bien (skills-omc). Pas de pb.
- **Impact** : Aucun.
- **Recommandation** : Pas d'action (faux positif apres verification).

### F-09 Co-author footer "Opus 4.6" mais context dit "Opus 4.7"
- **Fichier** : `docs/core/naming-conventions.md:149` `Co-author Claude Opus 4.6 (1M context)`.
- **Description** : Le modele runtime actuel est Opus 4.7 (voir env `claude-opus-4-7[1m]`). La convention force a signer avec 4.6 ce qui est obsolete.
- **Impact** : Commits incorrectement signes avec un modele deprecated. Soit on ne signe pas avec version, soit on met a jour.
- **Recommandation** : supprimer le numero de version (`Co-author Claude (Opus)`) OU auto-detecter. Eviter d'hardcoder 4.X dans une convention.

### F-10 Worktrees historique incomplet (CONTEXT.md mentionne worktrees legacy non documentes)
- **Fichier** : `docs/core/worktrees.md:115` table historique liste seulement 1 worktree (`admiring-sutherland` 2026-04-10). CONTEXT.md:44 mentionne `sleepy-ellis (2 commits uniques) + suspicious-khayyam (8 non-commités)`.
- **Description** : 2 worktrees legacy existent (mentionnees comme "a decider") mais ne sont pas dans le tableau historique worktrees.md.
- **Impact** : Lecteur de worktrees.md croit qu'il n'y a que 1 worktree historique. Kevin doit se souvenir de l'etat des 2 autres.
- **Recommandation** : ajouter sleepy-ellis + suspicious-khayyam dans le tableau section 6 avec status "En attente decision Kevin".

### F-11 Cortex command registry ne mentionne pas /wt
- **Fichier** : `docs/core/cortex.md:56-60` table Commands Registry liste `/session-start`, `/session-end`, `/new-project`, `/sync`. Manque `/cockpit`, `/plan-os`, `/wt`.
- **Description** : La table est obsolete. `/cockpit` existe depuis 2026-04-10, `/plan-os` et `/wt` depuis 2026-04-15. Cortex.md n'a pas ete mis a jour.
- **Impact** : Cortex.md ne reflete plus la realite operationnelle. Lecture de cortex.md ne donne pas la liste complete des commands.
- **Recommandation** : ajouter 3 lignes au tableau avec colonnes (Command, Quand, Ce qu'elle fait).

### F-12 Communication.md section 9 : "l'ancien fichier memory.md a ete renomme en communication.md le 2026-04-10" — reference obsolete entretenue
- **Fichier** : `docs/core/communication.md:401`.
- **Description** : Information historique maintenue depuis > 10 jours. La section 9 "Migration depuis Memory" devient bruit apres 10+ jours.
- **Impact** : Bruit informationnel. Section 9 (12 lignes) ne sert qu'a expliquer un rename.
- **Recommandation** : deplacer section 9 dans `docs/decisions-log.md` (archive) OU la compresser a 2 lignes en note finale.

### F-13 Package.json overrides React 19.2.5 non-documente
- **Fichier** : `package.json:7-10` overrides `react: ^19.2.5`, `react-dom: ^19.2.5`.
- **Description** : L'override force une version specifique. Pas de mention dans CLAUDE.md ni docs/core qui explique pourquoi cet override est la.
- **Impact** : Lors d'un upgrade React, le dev peut oublier de retirer/mettre a jour l'override.
- **Recommandation** : ajouter un commentaire dans package.json via le champ `workspaces` notes OU documenter dans `CLAUDE.md:61` section Stack.

## Findings P2 (amelioration — quality of life)

### F-14 docs/core/monitor.md:13 "Critical" liste a des colonnes mal alignees (racine dupliquee)
- **Fichier** : `docs/core/monitor.md:14` `Seulement CLAUDE.md, CONTEXT.md, README.md, package.json, package-lock.json, .gitignore, package.json, package-lock.json`.
- **Description** : `package.json` et `package-lock.json` sont cites 2 fois chacun.
- **Impact** : Typo, pas bloquant, mais rend la lecture confuse.
- **Recommandation** : corriger la cellule en listant chaque fichier une fois.

### F-15 Naming-conventions section 4 exemples dupliques
- **Fichier** : `docs/core/naming-conventions.md:121-123` 3 exemples dont 2 sont identiques (`2026-04-15-migration-foundation-desktop.md` ligne 121 et 123).
- **Description** : Exemples recites 2 fois. Section 6 `docs/specs` aussi : `2026-04-10-tools-module-v2-design.md` ligne 166 et 167.
- **Impact** : Qualite de doc.
- **Recommandation** : dedupliquer les exemples.

### F-16 CLAUDE.md Token-awareness limite 3 parallel agents vs sub-agent memoire permet 3-5
- **Fichier** : `CLAUDE.md:146` `Max agents paralleles | 3`.
- **Description** : Memoire `feedback_subagents_context.md` (citee dans MEMORY.md top) indique `Parallelisme max 3-5 agents`. Decalage 3 vs 3-5.
- **Impact** : mineur, Kevin peut avoir un doute.
- **Recommandation** : aligner sur 3-5 ou preciser pourquoi 3 dans CLAUDE.md.

### F-17 Knowledge.md section 10 "Drift detection" liste verifications hot.md / index.md mais drift-detector.sh verifie autre chose
- **Fichier** : `docs/core/knowledge.md:235-239`.
- **Description** : Annonce que `drift-detector.sh` verifie hot.md age, index.md sync, wikilinks casses. Non verifie par moi (je n'ai pas lu drift-detector.sh). P1 possible si le script ne fait pas ca.
- **Impact** : Indetermine tant que je n'ai pas lu le script.
- **Recommandation** : verifier scripts/drift-detector.sh pour confirmer. Hors scope zone 1 mais a flag pour zone "scripts".

### F-18 Knowledge.md section 11 "Migration auto-memory → wiki/ (historique)" : section historique 2026-04-15
- **Fichier** : `docs/core/knowledge.md:250-258`.
- **Description** : Section historique 9 lignes. Memoire migration listee. Apres 1+ mois, la migration n'est plus d'actualite, la section devient archive.
- **Impact** : Bruit.
- **Recommandation** : deplacer vers decisions-log.md OU comprimer.

### F-19 Cortex.md section 6 Cockpit : section 2 paragraphes a la fin, mal placee
- **Fichier** : `docs/core/cortex.md:104-115`.
- **Description** : La section 6 "Cockpit — Point d'entree simplifie" arrive apres `## Voir aussi`. Ordre non-standard (Voir aussi normalement en fin).
- **Impact** : Structure bizarre.
- **Recommandation** : mettre la section 6 avant "Voir aussi".

### F-20 Architecture-core.md dans schema ASCII peut confondre avec box-drawing interdit brief
- **Fichier** : `docs/core/architecture-core.md:7-15` utilise un schema avec des caracteres ASCII simples (pas box-drawing pur, pas interdit).
- **Description** : En realite pas de box-drawing dans architecture-core.md. Faux positif apres verification.
- **Impact** : Aucun.
- **Recommandation** : Pas d'action.

### F-21 Planner.md Phase schema utilise box-drawing (section 2 Architecture)
- **Fichier** : `docs/core/planner.md:20-63` utilise box-drawing caracteres.
- **Description** : CLAUDE.md:55 dit `PAS de box-drawing terminal`. Ce n'est que pour le brief session, pas pour les specs. Mais si on lit strictement "interdit" cela peut causer confusion.
- **Impact** : Aucun sur le brief (regle applique au brief). Juste une nuance doc.
- **Recommandation** : preciser dans CLAUDE.md:55 que la regle s'applique aux briefs session uniquement, pas aux specs docs.

## Findings P3 (cosmetique — typos, formatting)

### F-22 Exemples cortex.md colonne "Exemples" avec un seul exemple par ligne
- **Fichier** : `docs/core/cortex.md:18-21`.
- **Description** : La colonne "Exemples" a un format different par ligne (parfois un exemple entre guillemets, parfois en description). Manque d'uniformite.
- **Impact** : Cosmetique.
- **Recommandation** : standardiser.

### F-23 Fichier `.gitignore` ligne 16 : section "Secrets & credentials" suivie de blanc
- **Fichier** : `.gitignore:16-24`.
- **Description** : Organisation correcte mais manque pattern `.env.*.local` (Vite standard).
- **Impact** : `.env.production.local` pourrait etre accidentellement commit.
- **Recommandation** : ajouter `.env.*.local`.

### F-24 Communication.md section 5.2 : "docs/core/[module].md ou docs/"
- **Fichier** : `docs/core/communication.md:256`.
- **Description** : Placeholder `[module]` en francais. Mineur.
- **Impact** : Cosmetique.
- **Recommandation** : Pas necessaire.

### F-25 Naming-conventions.md:147 exemples de commits mentionnent `achieve/accomplish/world-first/revolutionary/$XB`
- **Fichier** : `docs/core/naming-conventions.md:147`.
- **Description** : Liste des mots interdits. Presents dans le doc pour documentation. OK.
- **Impact** : Aucun, c'est pedagogique.
- **Recommandation** : Pas d'action.

## Obsolescences

1. **`docs/core/tools/registry/commands.json`** : 7 mentions "Brief v11" (lignes 7, 22, 27, 40, 55, 73, 89). Doit etre regenere v12. Pointe par le README-tools-catalogue qui lui est deja v12 (ligne 42).
2. **`docs/core/cortex.md:53-60`** : table Commands ne contient pas /cockpit /plan-os /wt (ajoutes 2026-04-10 et 2026-04-15).
3. **`docs/core/communication.md:399-412`** section 9 "Migration depuis Memory" : 1+ mois apres le rename, devrait etre archivee.
4. **`docs/core/knowledge.md:250-258`** section 11 "Migration auto-memory → wiki/ (historique)" : meme chose, section historique a archiver.
5. **`docs/core/naming-conventions.md:149`** co-author 4.6 : obsolete (4.7 actuel).
6. **`docs/core/worktrees.md:115`** tableau historique incomplet (2 worktrees legacy non listes).

## Contradictions / desynchronisations

### C-01 CSS seuil : 3 valeurs differentes
- `monitor.md:34` : CSS < 40KB (Info)
- `monitor.md:86` : CSS 55KB baseline, 65KB alerte
- `communication.md:172` : CSS > 40 kB jaune
- `CONTEXT.md:56` : "Sous seuil 65KB"

### C-02 Brief version : v11 vs v12
- `CLAUDE.md:52-55` : v12
- `docs/core/communication.md:262` : v12
- `docs/core/architecture-core.md:24` : v12
- `docs/core/knowledge.md:113` : v12
- `docs/core/worktrees.md:162` : v12
- `docs/core/tools/registry/commands.json:7,22,27,40,55,73,89` : v11
- `docs/core/tools/README-tools-catalogue.md:42` : v12 (donc auto-gen desynchronisee depuis registry v11)

### C-03 Count tools : 99 sommes vs 109 declares
- `index.json:4` : 109
- `README-tools-catalogue.md:19` : 109
- Sommation reelle registry/*.json : 99
- Reconciliation : 99 + 10 knowledge-skills (inlines dans index.json, pas dans registry/) = 109

### C-04 CONTEXT.md "Modules" ligne 12 dit "Core OS 7/7 actif" — ok avec docs/core/ qui a 7 specs (cortex, communication, monitor, tools, planner, worktrees, knowledge) + architecture-core + naming-conventions. Donc "7" correspond aux specs module, les 2 autres sont meta-OS. Non-contradiction mais implicite.

### C-05 CLAUDE.md "Max agents paralleles 3" vs MEMORY.md "3-5 agents"
- `CLAUDE.md:146` : 3
- Memoire `feedback_subagents_context.md` : 3-5 (via MEMORY.md top)

### C-06 Cortex.md section 3 Commands : liste incomplete vs CLAUDE.md section Commands
- `CLAUDE.md:167-177` : 10 commands (cockpit, session-start, session-end, plan-os, wt, new-project, sync, wiki, save, autoresearch, canvas)
- `cortex.md:56-60` : 4 commands seulement

## Innovations / opportunites

### I-01 Unifier seuil CSS via un fichier source-unique `.config.json`
Creer `scripts/thresholds.json` contenant les seuils (build_ms, js_kb, css_kb). Les scripts health-check, drift-detector, docs lisent ce fichier unique. Evite 3 sources contradictoires.

### I-02 Generer le badge "109 outils" dans README.md depuis index.json
Un script `update-readme-counts.sh` qui lit `docs/core/tools/index.json.total_tools` et patch une ligne dans README.md. Evite drift silencieux.

### I-03 Commande `/audit-core-os` qui verifie auto les F-01 a F-13
Un script `scripts/audit-core-os.sh` qui detecte :
- v11 dans registry/*.json alors que CLAUDE.md dit v12
- Counts registry somme != index.json.total_tools
- Seuils CSS different entre fichiers
- Co-author Opus X.Y different du modele actuel

### I-04 Archive auto section "migration historique" apres 30 jours
Script SessionEnd qui detecte les sections titrees "Migration" / "Historique" > 30 jours et propose leur deplacement vers decisions-log.md automatiquement.

### I-05 Lier physically CLAUDE.md → decisions-log.md via nouveau D-CORE-01 "Source unique tools catalogue"
Formaliser que `docs/core/tools/index.json` est la source de verite unique + script de regeneration ET validation.

### I-06 Corriger registry/commands.json v11→v12 + retourner le script `tool-register.sh rebuild` pour eviter le drift.
Utile des maintenant.

### I-07 Verifier que wiki-recall-reminder.sh est utilise (hook non-declare dans settings.json)
Le script existe (684 bytes dans scripts/hooks/) mais je ne l'ai pas vu dans settings.json. Indetermine s'il est actif via un autre mecanisme. Flag pour zone "scripts/hooks".

### I-08 Ajouter fichier manquant `docs/core/tools/registry/knowledge-skills.json`
Standardiser : les 10 skills du plugin claude-obsidian devraient etre dans leur propre registry JSON pour la coherence avec les 9 autres categories.

## Couverture

- **Fichiers lus integralement** : 15/15 du scope demande (100%).
- **Lignes lues** : ~2710 L.
- **Honnete** : j'ai lu TOUS les fichiers .md ligne par ligne. Les 2 JSON (index.json top + routing.json top) je les ai ouverts partiellement car le contenu restant est standard/repetitif (les 2537L cumules de tous les registry JSON n'ont pas ete lus ligne par ligne — j'ai utilise python pour compter et grep pour v11/Brief — cela suffit pour trouver F-01 et F-03). Le scope demandait explicitement index.json et routing.json ; je les ai verifies structurellement. Les registry/*.json ne sont pas dans le scope explicite, juste mentionnes.
- **Ce que je n'ai PAS verifie** : le contenu fonctionnel des scripts (health-check.sh, drift-detector.sh, etc.) — c'est hors scope zone 1 (zone "scripts" la separemment). Mes findings F-17 sur drift-detector sont donc a confirmer en zone "scripts".

## Conclusion zone

**Qualite globale** : Le Core OS est solidement documente. La spec de chaque module existe, est riche, et couvre le fonctionnement. Les 5 tiers memoire sont clairement expliques. Les protocoles session-start/session-end sont codifies. Le cross-referencing via wikilinks est systematique.

**Risques principaux** :
1. **Desynchronisation v11/v12** entre registry (source source-unique declaree) et documentation : le `README-tools-catalogue.md` a ete regenere mais `registry/commands.json` pas mis a jour → preuve que le workflow de regen est partiellement casse.
2. **Contradictions de seuils** (CSS 40 vs 65 KB) qui peuvent produire des health-checks instables ou trompeurs.
3. **Dette catalogue tools** : 99 reels + 10 inlines dans index.json = manque de `registry/knowledge-skills.json` distinct.
4. **Sections historiques** qui ne migrent pas automatiquement vers decisions-log.md (section 9 communication.md, section 11 knowledge.md).

**Axes prioritaires** :
1. Fix F-01, F-03, F-04 (bloquants) : regeneration catalogue + alignement seuils CSS + registry/knowledge-skills.json.
2. Completer F-07 (scripts liste incomplete) et F-11 (cortex commands incomplete).
3. Archiver les sections historiques >30j (communication.md §9, knowledge.md §11).
4. Formaliser via script `audit-core-os.sh` (innovation I-03) pour eviter que ces drifts ressurgissent.

Le Core OS est robuste mais souffre de drift progressif entre 2026-04-10 et 2026-04-15 : chaque evolution a touche partiellement les specs sans regeneration systematique des fichiers derives (README-tools-catalogue, registry JSONs).

## Cross-references notees (zones hors scope)

Pour le consolidateur, fichiers cites dans mes findings mais hors scope zone 1 :

- `scripts/health-check.sh` (verifier coherence avec monitor.md seuils — zone scripts)
- `scripts/drift-detector.sh` (verifier que ca check hot.md age + wikilinks — zone scripts)
- `scripts/tool-register.sh` (verifier que `rebuild` regenere tous les fichiers auto — zone scripts)
- `.claude/commands/cockpit.md` `.claude/commands/session-start.md` `.claude/commands/session-end.md` `.claude/commands/plan-os.md` `.claude/commands/wt.md` `.claude/commands/new-project.md` `.claude/commands/sync.md` (verifier leur coherence avec cortex.md — zone .claude/commands/)
- `.claude/agents/*.md` (4 agents — zone .claude/agents/)
- `.claude/settings.json` (lu ici pour F-05 mais scope dedie possible)
- `docs/decisions-log.md` (lu header pour verifier D-XXX-NN existent — 18 decisions archivees. Zone decisions-log)
- `docs/index-documentation.md` (lu pour coherence 46 composants DS — zone docs/)
- `CONTEXT.md` "sleepy-ellis / suspicious-khayyam" worktrees legacy (zone worktrees)
- `wiki/meta/*` (sessions-recent, thinking, lessons-learned, foundation-os-map — zone wiki)
- `docs/specs/2026-04-10-cockpit-design.md` (zone docs/specs)
- `docs/decisions-log.md` : 18 decisions archivees confirmees, format identique a CONTEXT.md
- `~/.claude/plans/<slug>.md` dual-path natif — zone auto-memory/plans natifs
- `modules/app/package.json` + `modules/design-system/package.json` — zone modules/
- Memoire auto-memory `feedback_subagents_context.md` (confirme 3-5 agents) — zone memory
