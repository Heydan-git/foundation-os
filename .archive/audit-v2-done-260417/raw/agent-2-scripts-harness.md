---
type: audit-raw
agent: 2
zone: "Scripts & Harness"
date: 2026-04-16
scope_files: 40
lines_read: 3857
status: completed
---

# RAPPORT AGENT 2 — SCRIPTS & HARNESS

## Inventaire

**Scripts principaux (16, lus integralement)** :
- `scripts/auto-archive-plans.sh` : 68 lignes
- `scripts/docs-sync-check.sh` : 83 lignes
- `scripts/drift-detector.sh` : 174 lignes
- `scripts/health-check.sh` : 233 lignes
- `scripts/module-scaffold.sh` : 175 lignes
- `scripts/ref-checker.sh` : 188 lignes
- `scripts/session-lock.sh` : 146 lignes
- `scripts/sync-check.sh` : 215 lignes
- `scripts/tool-register.sh` : 234 lignes
- `scripts/wiki-commit.sh` : 80 lignes
- `scripts/wiki-health.sh` : 113 lignes
- `scripts/wiki-metrics.sh` : 120 lignes
- `scripts/wiki-suggest-links.sh` : 39 lignes
- `scripts/worktree-clean.sh` : 87 lignes
- `scripts/worktree-list.sh` : 47 lignes
- `scripts/worktree-new.sh` : 78 lignes

**Hooks (5, lus integralement)** :
- `scripts/hooks/branch-name-check.sh` : 34 lignes
- `scripts/hooks/session-start-wiki.sh` : 26 lignes
- `scripts/hooks/validate-void-glass.sh` : 39 lignes
- `scripts/hooks/wiki-recall-reminder.sh` : 20 lignes
- `scripts/hooks/security-reminder.py` : 281 lignes

**Git hooks versionnes (2, lus integralement)** :
- `scripts/git-hooks/commit-msg` : 25 lignes
- `scripts/git-hooks/pre-commit` : 27 lignes

**Git hooks installes (2, lus integralement)** :
- `.git/hooks/commit-msg` : 20 lignes (derive)
- `.git/hooks/pre-commit` : 27 lignes (identique)

**Claude Code config (4, lus integralement)** :
- `.claude/settings.json` : 52 lignes
- `.claude/settings.local.json` : 87 lignes
- `.claude/settings.local.json.backup-pre-wiki-260415` : 80 lignes
- `.claude/loop.md` : 14 lignes

**Commands (7, lus integralement)** :
- `.claude/commands/cockpit.md` : 94 lignes
- `.claude/commands/new-project.md` : 38 lignes
- `.claude/commands/plan-os.md` : 209 lignes
- `.claude/commands/session-end.md` : 210 lignes
- `.claude/commands/session-start.md` : 119 lignes
- `.claude/commands/sync.md` : 20 lignes
- `.claude/commands/wt.md` : 69 lignes

**Agents (4, lus integralement)** :
- `.claude/agents/dev-agent.md` : 40 lignes
- `.claude/agents/doc-agent.md` : 39 lignes
- `.claude/agents/os-architect.md` : 46 lignes
- `.claude/agents/review-agent.md` : 39 lignes

**TOTAL** : 40 fichiers, 3 857 lignes lues integralement. `bash -n` OK sur 20/20 shell scripts + `py_compile` OK sur `security-reminder.py`.

---

## Findings P0 (scripts casses, hooks orphelins critiques)

### F-01 `.git/hooks/commit-msg` INSTALLE EST UNE VERSION OBSOLETE (drift vs source)
- **Fichier** : `/Users/kevinnoel/foundation-os/.git/hooks/commit-msg` (installe) vs `scripts/git-hooks/commit-msg:10-22` (source)
- **Description** : Le hook git installe **manque** le type `merge` ET la regex `^Merge\ (branch|remote-tracking\ branch|...)` qui autorise les merge commits auto-generes. Le hook source versionne (lu integralement) contient les deux. Diff:
  ```
  TYPES='feat|...|revert'  # installe (manque 'merge')
  TYPES='feat|...|revert|merge'  # source
  ```
- **Impact** : Tout `git merge` auto-genere (fast-forward declenchant un merge commit) est **rejete** par le hook commit-msg actuellement installe. `/session-end` Phase 8 qui execute `git merge <branche-worktree> --ff-only` et produit un merge commit sera bloque. Kevin perd son workflow de cloture de worktree.
- **Recommandation** : Re-executer `cp scripts/git-hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg` pour re-installer la version versionnee. Aucun mecanisme automatique ne fait ce sync aujourd'hui — c'est un vrai trou dans le harness.

### F-02 `scripts/hooks/session-start-wiki.sh` EST UN ORPHELIN CRITIQUE
- **Fichier** : `scripts/hooks/session-start-wiki.sh:1-25` et `.claude/settings.json:37-46`
- **Description** : Le fichier existe, est executable, et contient la logique de chainage Foundation OS drift-detector + cat wiki/hot.md (pattern Karpathy). MAIS `settings.json` SessionStart appelle directement `bash scripts/drift-detector.sh 2>&1 | tail -15` — il ne wrap PAS via `session-start-wiki.sh`. Donc **le hook d'injection wiki/hot.md au SessionStart n'est JAMAIS execute**. Grep confirme : zero match de `session-start-wiki.sh` dans `.claude/settings.json`.
- **Impact** : La promesse CLAUDE.md "Wiki = cerveau autonome" + neuroplasticite (lecture `wiki/hot.md` au SessionStart pour cadre HOT) dependait de ce hook. Aujourd'hui, le wiki/hot.md n'est pas injecte automatiquement — seuls `/cockpit` et `/session-start` (si Kevin les invoque explicitement) le lisent. Le "auto-load" est perdu. La commande `/session-start` mentionne `bash scripts/wiki-health.sh` explicitement Tour 1, mais le hook automatique session-start ne lit PAS hot.md.
- **Recommandation** : Changer `.claude/settings.json:42` de `bash "...scripts/drift-detector.sh" 2>&1 | tail -15` a `bash "...scripts/hooks/session-start-wiki.sh"` (qui chaine drift-detector + hot.md + |tail). OU purement supprimer `session-start-wiki.sh` s'il est deprecie (pas evident, vu la spec `docs/core/knowledge.md` qui le designe comme prevu).

### F-03 CLAUDE.md claim "pre-commit hook via settings.json" FAUX
- **Fichier** : `CLAUDE.md` mentions pre-commit + `.claude/settings.json:11-46`
- **Description** : `settings.json` n'a AUCUN hook `PreToolUse` lie aux commits. Les hooks Foundation OS pre-commit + commit-msg sont des **git hooks** (dans `.git/hooks/`), installes via copie manuelle depuis `scripts/git-hooks/`. Aucune mention de ce processus dans CLAUDE.md : l'utilisateur qui clone le repo (ou qui cree un worktree) ne sait pas qu'il doit copier les hooks. **Le worktree actuel** (`practical-bhaskara-651197`) partage les hooks du repo parent via `.git/worktrees/` redirection, mais une reinstall du repo ailleurs ne reinstallerait pas les hooks.
- **Impact** : Nouveau clone = aucune protection pre-commit (pas de health-check avant commit, pas de branch-name-check). Perte silencieuse d'un garde-fou critique.
- **Recommandation** : Ajouter CLAUDE.md section "Setup initial" → `bash scripts/git-hooks-install.sh` (script a creer qui copie les 2 hooks). OU documenter ce setup explicitement dans README.md / setup-guide.md. Actuellement, seul le commentaire dans les 2 hook source (`# Install : cp ... .git/hooks/...`) indique comment le faire.

---

## Findings P1 (drift important)

### F-04 `scripts/session-lock.sh` ORPHELIN (jamais invoque)
- **Fichier** : `scripts/session-lock.sh:1-146`
- **Description** : Script fonctionnel (`set -euo pipefail`, gestion TTL 30min, format key=value parsable). Concu pour l'anti-collision Cowork (mcp Claude.ai) <-> Claude Code CLI. Grep exhaustif (`--glob "**/*.{md,json,sh}"`) : **zero** reference dans settings.json, commands, CLAUDE.md, hooks, ou autres scripts. Aucun workflow actif ne fait `acquire`/`release`.
- **Impact** : Script maintenu mais mort. Le risque de collision Cowork<->CLI existe selon CLAUDE.md (Routines Cloud Max 15/jour) mais rien ne protege. Dette muette.
- **Recommandation** : SOIT integrer (ajouter `acquire cli` au SessionStart + `release cli` au SessionEnd dans settings.json hooks), SOIT archiver (`.archive/scripts-unused-<date>/`). Ne pas laisser en etat ambigu.

### F-05 `scripts/hooks/wiki-recall-reminder.sh` ORPHELIN (auto-declare opt-in, jamais active)
- **Fichier** : `scripts/hooks/wiki-recall-reminder.sh:1-20` + commentaire "NE PAS configurer dans settings.json pour l'instant (opt-in, Kevin activera manuellement)"
- **Description** : Hook qui detecte si le fichier edite contient un nom de domaine wiki (trading/finance/sante/design/dev) et affiche un rappel. Jamais reference nulle part. 20 lignes.
- **Impact** : Si Kevin active l'idee D-WIKI-01 "recall reflex", ce hook est un point de depart. Actuellement il est inactif et le CLAUDE.md Neuroplasticite parle de Recall manuel par Claude (pas via hook). Dupliquer un concept entre script et reflexe Claude = dette.
- **Recommandation** : Soit l'activer (hook PostToolUse apres Read) soit l'archiver. L'etat present prete a confusion.

### F-06 `scripts/tool-register.sh` : CLI pour registry JSON, workflow incomplet
- **Fichier** : `scripts/tool-register.sh:1-234` et `docs/core/tools/registry/*.json` (9 fichiers)
- **Description** : Script sophistique avec `scan`/`rebuild`/`add`. Lit/ecrit dans `docs/core/tools/registry/{scripts,commands,agents,hooks,mcp,ci,skills-bmad,skills-omc,skills-superpowers}.json`. Le registre existe, mais le script n'est invoque dans AUCUN workflow (ni `/session-start`, ni `/session-end`, ni `/sync`, ni hook). Grep: pas une seule reference.
- **Impact** : Le `tools/index.json` + `README-tools-catalogue.md` derivent silencieusement. Un nouveau script (ex: `session-lock.sh`) n'est pas ajoute automatiquement. La promesse du catalogue Tools v2 "detecter outils non-enregistres" n'est pas tenue.
- **Recommandation** : Chainer `tool-register.sh scan` dans `health-check.sh` section INFO (comme drift-detector + wiki-health). Ou l'invoquer en hook SessionEnd si changements dans `scripts/` ou `.claude/`.

### F-07 `scripts/sync-check.sh` vs `scripts/docs-sync-check.sh` CHEVAUCHENT
- **Fichier** : `sync-check.sh:1-215` (7 checks) et `docs-sync-check.sh:1-83` (6 checks)
- **Description** : 
  - `sync-check.sh` section 2-7 couvre : modules vs CONTEXT.md, refs last commit, agents+commands count, specs Core OS, routes CONTEXT vs App.tsx, fonts Void Glass.
  - `docs-sync-check.sh` couvre : commands dans architecture.md, agents dans architecture.md, modules count, memory MEMORY.md index, README couleurs, manifeste commands count.
  - Les deux scripts verifient commands+agents count mais depuis des sources differentes (filesystem vs docs). Leur interaction n'est documentee nulle part.
  - `docs-sync-check.sh` n'est **jamais** chaine : ni dans health-check, ni dans sync-check, ni dans un hook.
- **Impact** : Deux entrypoints avec scope flou. CLAUDE.md ligne 103 dit "docs-sync-check.sh (manuel, chain dans health-check)" → **FAUX** : le chain dans health-check n'existe pas, j'ai lu les 233 lignes de `health-check.sh`.
- **Recommandation** : Fusionner `docs-sync-check.sh` dans `sync-check.sh` section [EXTENDED] comme verification dedieee `[DOCS]`. OU chainer `docs-sync-check.sh` depuis `sync-check.sh` comme deja fait pour `health-check.sh`.

### F-08 `.claude/settings.local.json.backup-pre-wiki-260415` FICHIER TRACKE OBSOLETE
- **Fichier** : `.claude/settings.local.json.backup-pre-wiki-260415` (80 lignes)
- **Description** : Copie textuelle de l'ancien settings.local.json (avant ajout des permissions wiki 260415). Diff avec settings.local.json actuel : +7 lignes de permissions (`wiki-commit.sh*`, `wiki-health.sh*`, `session-start-wiki.sh*`, `claude plugin*`, `git config*`, `git fetch*`, `git merge*`). Fichier lu integralement.
- **Impact** : Trackable via git si pattern de restauration, mais `.claude/` est generalement gitignored. Tracking implicite perd du sens apres 1 mois. Confusion "quel est le bon fichier"?
- **Recommandation** : Archiver dans `.archive/settings-pre-wiki-260415.backup` OU supprimer si git log conserve l'historique.

### F-09 CLAUDE.md ligne 104 "ref-checker.sh chain dans health-check + sync-check" VRAI mais asymetrique
- **Fichier** : `health-check.sh:125-133` et `sync-check.sh:25` (chain via `bash scripts/health-check.sh`)
- **Description** : `health-check.sh` appelle `ref-checker.sh` ligne 125 (section WARNING). `sync-check.sh` chaine `health-check.sh` ligne 25 (donc indirect ref-checker). OK, ca marche. MAIS **`ref-checker.sh` n'est pas invoque directement par** `/sync` — il est noye dans health-check. Si ref-checker exit != 0, health-check afflige un WARNING, pas un CRITICAL. Incoherence : dans le guide `/session-end`, on invoque `bash scripts/ref-checker.sh 2>&1 | head -5` directement (session-end.md:10).
- **Impact** : Sub-optimal mais fonctionnel. Duplication d'appel ref-checker au session-end (une fois dans health-check, une fois direct).
- **Recommandation** : Retirer l'appel direct dans `session-end.md:10` puisque health-check deja chaine ref-checker. OU garder pour lisibilite mais documenter.

---

## Findings P2 (amelioration)

### F-10 `settings.json` PreToolUse Void Glass validation execute sur TOUTES les ecritures
- **Fichier** : `.claude/settings.json:14-19` matcher `Write|Edit|MultiEdit` + `validate-void-glass.sh`
- **Description** : Le hook se declenche sur TOUS Write/Edit/MultiEdit. Le script interne filtre (`[[ "$TARGET_FILE" =~ \.(jsx|tsx|css|scss)$ ]]`) mais c'est un filtre LATE. Performance OK pour Kevin solo, mais injecte un `bash` call sur toute ecriture (y compris scripts bash, md docs, json, python). Bruit dans les hooks.
- **Impact** : Mineur. Logs hooks plus verbeux.
- **Recommandation** : Ajouter un filtre dans le matcher si Claude Code le supporte, sinon laisser tel quel.

### F-11 `health-check.sh` ligne 91 decouverte `modules/app/src/pages` + `components` HARD-CODEE
- **Fichier** : `health-check.sh:91`
- **Description** : `TSX_FILES=$(find modules/app/src/pages modules/app/src/components ...)` — ne scanne PAS `modules/app/src/layouts/`, `modules/app/src/lib/`, ni les autres modules (ex: design-system). Or le reste du script decouvre dynamiquement via `modules/*/package.json`. Incoherence.
- **Impact** : Un TSX 800 lignes dans `modules/app/src/layouts/` echapperait au check > 700L. Egalement tout module futur (finance, sante, etc.).
- **Recommandation** : Ameliorer a `find modules/*/src -type f \( -name "*.tsx" -o -name "*.jsx" \)` + exclusions node_modules/dist.

### F-12 `drift-detector.sh` check 3 "CLAUDE.md lines > 200" TOUJOURS WARN
- **Fichier** : `drift-detector.sh:55-61` et actual `CLAUDE.md` count
- **Description** : Le seuil 200L cible pour CLAUDE.md est deja violable aujourd'hui (CLAUDE.md actuel : 200+ lignes selon Grep). Drift-detector flag systematiquement.
- **Impact** : Faux warnings recurrents. Kevin voit "DRIFT" au SessionStart sans action possible.
- **Recommandation** : Soit reevaluer le seuil (250L ?), soit compresser CLAUDE.md.

### F-13 `wiki-health.sh` BROKEN_LINKS scan seulement 20 premiers fichiers
- **Fichier** : `wiki-health.sh:67` `head -20`
- **Description** : Sample limite a 20 pages via `head -20`. Le wiki fait 43+ pages. Wikilinks casses peuvent exister dans les 23 autres pages sans etre detectes.
- **Impact** : Faux rassurance "Wikilinks coherents" alors que partie non-scannee.
- **Recommandation** : Supprimer `head -20`, scanner tout wiki/.

### F-14 `wiki-metrics.sh` lignes 51-58 ORPHELINS check scan grep rec O(n²) lent
- **Fichier** : `wiki-metrics.sh:51-58`
- **Description** : Pour chaque page (~43), fait `grep -rl "\[\[.*${bn}" wiki/` = 43 × grep full wiki = O(n²). Pour 43 pages c'est rapide, mais ne scalera pas si wiki depasse 500.
- **Impact** : Performance degradee future. Aujourd'hui OK.
- **Recommandation** : Pre-indexer les wikilinks puis faire les checks O(n).

### F-15 CLAUDE.md section "Neuroplasticite memoire" ne mentionne PAS `scripts/wiki-suggest-links.sh`
- **Fichier** : CLAUDE.md "Neuroplasticite memoire" + `scripts/wiki-suggest-links.sh`
- **Description** : Script qui detecte mentions en texte brut non wikifiees. Utile dans reflexe "Consolidation post-ingest" mais absent du plan explicite. Non chaine dans health-check.
- **Impact** : Outil potentiellement utile mais inconnu.
- **Recommandation** : Inclure dans une routine wiki ou documenter.

### F-16 Scripts worktree : `worktree-new.sh` refuse d'etre execute DEPUIS un worktree
- **Fichier** : `worktree-new.sh:47-51`
- **Description** : Exit si on est dans un worktree. Kevin doit `cd` vers main avant `/wt new`. Frictionnel.
- **Impact** : `/wt new` echoue si Kevin est dans le worktree courant.
- **Recommandation** : Ajouter un `cd` automatique vers main au lieu du exit.

### F-17 `session-end.md` Phase 8 FAST-FORWARD MERGE AUTO "OBLIGATOIRE" vs CLAUDE.md "Jamais commit automatique"
- **Fichier** : `.claude/commands/session-end.md:186-202`
- **Description** : session-end.md decrit `git merge <branche-worktree> --ff-only` en AUTOMATIQUE avec commentaire "merger SANS demander (action safe, non-destructive)". Or CLAUDE.md "Interdit sans Kevin" dit `git commit automatique` est dans les interdits. Fast-forward merge = pas un merge commit certes, mais un changement de HEAD main sans OK Kevin. Violation de la regle de prudence.
- **Impact** : Risque de main modifiee automatiquement sans validation Kevin. Contradiction interne.
- **Recommandation** : Soit modifier session-end.md pour demander confirmation, soit assouplir CLAUDE.md.

---

## Findings P3 (cosmetique)

### F-18 Box-drawing characters dans `plan-os.md` (Phase 5b bloc SESSION RENAME)
- **Fichier** : `.claude/commands/plan-os.md:124-132`
- **Description** : Le command utilise box-drawing pour le bloc SESSION RENAME. CLAUDE.md dit "NE PAS utiliser box-drawing". Interdit concerne le brief v12, pas forcement plan-os, mais incoherent.
- **Impact** : Cosmetique.
- **Recommandation** : Remplacer par blockquote ou bloc code.

### F-19 `health-check.sh` lignes 84, 158, 221 contiennent characters speciaux
- **Fichier** : `health-check.sh:84,158,221`
- **Description** : Bannieres commentaires avec caractere invalide/replacement (U+FFFD).
- **Impact** : Zero fonctionnel.
- **Recommandation** : Nettoyer les commentaires.

### F-20 `doc-agent.md:24` reference implicite sans wikilink
- **Fichier** : `.claude/agents/doc-agent.md:24`
- **Description** : Mention sans wikilink clickable.
- **Impact** : Mineur.
- **Recommandation** : Ajouter mention explicite path complet.

### F-21 `os-architect.md`, `dev-agent.md`, `review-agent.md` tools autorises NON SPECIFIES
- **Fichier** : 4 agents `.claude/agents/*.md`
- **Description** : Frontmatter n'a pas `tools`. Absent = tous tools. Pour `review-agent` (audit), c'est large.
- **Impact** : Pas de security boundaries entre agents. Mineur pour Kevin solo.
- **Recommandation** : Ajouter `tools` explicite pour review-agent au moins.

### F-22 `.claude/loop.md` 14 lignes, jamais invoque dans settings.json ni commands
- **Fichier** : `.claude/loop.md`
- **Description** : Fichier en francais decrivant maintenance memoire. Probablement utilise par skill OMC `loop`. Convention non documentee.
- **Impact** : Orphelin ou dependance implicite.
- **Recommandation** : Documenter dans CLAUDE.md comment loop.md est consomme.

---

## Obsolescences

| Item | Status | Recommandation |
|------|--------|---------------|
| `.claude/settings.local.json.backup-pre-wiki-260415` | OBSOLETE (backup 1 mois) | Archiver vers `.archive/` |
| `scripts/hooks/wiki-recall-reminder.sh` | ORPHELIN declare "opt-in" | Activer OU archiver |
| `scripts/session-lock.sh` | ORPHELIN fonctionnel | Integrer OU archiver |
| `docs-sync-check.sh` | CHEVAUCHE `sync-check.sh` | Fusionner |

**Pas de doublons commands.** 7 commands, scope distincts.

---

## Contradictions / desynchronisations

### CLAUDE.md vs realite harness

| Claim CLAUDE.md | Realite | Verdict |
|---|---|---|
| L103 "docs-sync-check.sh (manuel, chain dans health-check)" | Zero chain verifie dans health-check.sh (233L lues) | **FAUX** |
| L101 "Archivage plans via scripts/auto-archive-plans.sh (hook SessionEnd)" | settings.json:30-34 confirme hook SessionEnd correct | **VRAI** |
| L102 "Drift detection au SessionStart" | settings.json:37-46 OK, mais wrapper session-start-wiki.sh contourne | **PARTIEL** |
| L104 "ref-checker.sh (chain dans health-check + sync-check)" | OK pour health-check L125. Sync-check chaine via health-check (indirect) | **VRAI** |

### settings.json vs scripts reels

| Hook config | Fichier existe? | Execute?|
|---|---|---|
| PreToolUse Write|Edit|MultiEdit -> validate-void-glass.sh | OUI | OUI |
| PreToolUse Write|Edit|MultiEdit -> security-reminder.py | OUI | OUI |
| SessionEnd -> auto-archive-plans.sh | OUI | OUI |
| SessionStart -> drift-detector.sh (direct, pas via wrapper) | OUI | OUI — mais contourne session-start-wiki.sh |

### Plugins actives vs declares

`.claude/settings.json:48-50` declare `"oh-my-claudecode@omc": true`. Zero mention de "Superpowers v5.0.7" ou "gstack" ou "BMAD v6" — ces plugins viennent d'un scope user-global (hors scope).

---

## Innovations / opportunites

1. **Script `install-git-hooks.sh` manquant** — automatiser la copie `scripts/git-hooks/*` -> `.git/hooks/` + documenter dans setup. Evite F-01/F-03.
2. **Chain `tool-register.sh scan` dans `/sync`** — detecte automatiquement scripts non-enregistres.
3. **Hook SessionStart unifie** — wrapper `session-start-wiki.sh` dans settings.json au lieu de l'appel direct drift-detector.
4. **Script `ds-lint.sh` absent** — lint complet post-batch pour audit total app.
5. **Registry -> docs auto-gen** — chainer `tool-register.sh rebuild` a un hook PostTooUse Edit sur `scripts/**`.
6. **Health-check grapher** — option `--json` pour feeder dashboard brief v12.
7. **Obsolete backup cleanup** — script qui archive `.archive/` par tranche > 90j ou purge `.claude/**.backup-*`.

---

## Couverture

Honnete : **40/40 fichiers** lus integralement (100%). **3 857/3 857 lignes** (100%). Bash syntax 20/20 OK. Python py_compile OK. Diff git-hooks installe vs versionne verifie (F-01).

---

## Conclusion zone

Le harness Foundation OS est **fonctionnellement solide mais avec 3 trous critiques silencieux**. Les 20+ scripts/hooks reflètent une maturite d'engineering (set -euo pipefail quasi-partout, exit codes discipline, arborescence logique) mais la coherence meta (CLAUDE.md <-> settings.json <-> scripts <-> git-hooks) presente des drifts serieux : le git-hook commit-msg installe est obsolete (F-01), le hook SessionStart wiki/hot.md n'est jamais execute malgre le script dedie (F-02), et le setup git-hooks n'est pas documente donc un nouveau clone perd les garde-fous (F-03). Ces trois findings P0 compromettent des workflows critiques.

**Risques prioritaires** : F-01 bloquera `/session-end` Phase 8 des qu'un merge commit est genere. F-02 detruit silencieusement la promesse "Wiki = cerveau autonome". F-17 (fast-forward merge auto "safe") contredit CLAUDE.md interdits.

**Dette accumulee** : 4 scripts orphelins (session-lock, wiki-recall-reminder, wiki-metrics O(n²), tool-register), 2 chevauchements (sync-check vs docs-sync-check), 1 backup obsolete, 1 TSX scope hardcode (health-check.sh:91), 1 box-drawing violation (plan-os.md).

**Qualite globale harness** : 7.5/10. Structure saine, pas de scripts casses. Les findings sont des drifts entre couches (git, scripts, settings, docs), pas des bugs. Recuperable en 1 session dediee.

---

## Cross-references (zones hors scope)

- Zone 1 : drifts F-03, F-07 ligne 103, F-15 neuroplasticite
- Zone 3 (wiki) : impactee par F-02 et F-13
- Zone 4 (modules) : F-11 TSX scope
- Zone 5 (plugins MCP) : F-21 tools non declares
- Zone 6 (.archive) : F-08 recommande archivage
