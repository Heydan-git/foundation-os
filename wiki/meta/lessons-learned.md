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
