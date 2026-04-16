---
id: 2026-04-16-audit-mapping-obsidian
title: 🪐 Audit Mapping Obsidian (16-04-2026)
created: 2026-04-16
status: planning
phases_total: 5
estimated_duration: 2h
decision_ref: D-WIKI-01
---

# 🪐 Audit Mapping Obsidian — 29 findings à exécuter

> **For agentic workers:** ce plan est auto-suffisant. Tu n'as PAS besoin du contexte de la conversation précédente. Tout est ici. Lis CLAUDE.md + ce fichier + wiki/meta/routines-guardrails.md avant d'exécuter.

**Contexte** : Session 2026-04-16, adoption wiki Obsidian (D-WIKI-01) + neuroplasticité mémoire terminées. 3 audits successifs du graph Obsidian ont identifié 29 findings non-résolus. Ce plan les exécute tous, classés par priorité.

**Objectif** : Le graph Obsidian passe de "hub-and-spoke" (tout via une carte centrale) à un réseau maillé organique où CHAQUE noeud est connecté naturellement.

**Contraintes** :
- Zero régression (health-check avant/après CHAQUE phase)
- Zero perte de fichier (modifier, jamais supprimer sauf fantômes)
- Tout renommage = recâbler TOUTES les refs (grep + fix)
- Kevin Max x20 = pas de limite tokens
- Commit après chaque phase

**Vérification end-to-end** :
```bash
bash scripts/health-check.sh     # pas BROKEN
bash scripts/wiki-health.sh      # SAIN
bash scripts/drift-detector.sh   # pas de nouveau drift
bash scripts/ref-checker.sh      # pas de nouvelles refs cassées
```

---

## Phase 0 — Baseline (5 min)

**Objectif** : capturer l'état actuel pour comparer après.

- [ ] **Step 1** : `bash scripts/health-check.sh 2>&1 | tee /tmp/health-baseline-mapping.log`
- [ ] **Step 2** : `bash scripts/wiki-health.sh 2>&1 | tee /tmp/wiki-baseline-mapping.log`
- [ ] **Step 3** : `grep -roh '\[\[' wiki/ docs/ CLAUDE.md CONTEXT.md README.md 2>/dev/null | wc -l` → noter le nombre de wikilinks total
- [ ] **Step 4** : compter orphelins et fantômes actuels

**Pas de commit** (baseline seulement).

---

## Phase 1 — P0 Critiques : fantômes + orphelins (15 min)

**Objectif** : supprimer les 6 noeuds fantômes et connecter les 3 orphelins.

### Finding 1 — Supprimer 6 wikilinks parasites

Ces mots entre `[[]]` dans le texte créent des noeuds fantômes dans le graph Obsidian. Ce ne sont PAS des vrais liens, juste des mots dans des phrases qui ont été accidentellement mis entre double-crochets.

- [ ] **Step 1** : Ouvrir `wiki/meta/routines-setup.md`. Chercher `[[A]]`, `[[B]]`, `[[X]]` dans le texte des prompts de routine. Ce sont des lettres dans des phrases comme "Si page A mentionne [[B]]..." — les remplacer par `page A mentionne B` (sans crochets).
- [ ] **Step 2** : Ouvrir `wiki/entities/Obsidian.md`. Chercher `[[page]]`. C'est le mot "page" dans une phrase. Retirer les `[[]]`.
- [ ] **Step 3** : Ouvrir `docs/core/knowledge.md`. Chercher `[[file]]`. C'est le mot "file" dans un exemple code. Retirer les `[[]]`.
- [ ] **Step 4** : Chercher `[[lien]]` dans tout le projet : `grep -rn '\[\[lien\]\]' wiki/ docs/`. Le trouver et retirer les `[[]]`.
- [ ] **Step 5** : Vérifier : `grep -roEh '\[\[' wiki/ docs/ | sed 's/\[\[//' | sort -u | while read link; do bn=$(echo "$link" | sed 's|.*/||'); [ -z "$bn" ] && continue; found=$(find . -name "${bn}.md" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.archive/*" -not -path "*/.claude/worktrees/*" 2>/dev/null | head -1); [ -z "$found" ] && echo "FANTOME: [[${link}]]"; done` → doit retourner 0 fantôme (sauf les composants DS intentionnels type `[[01-button]]`).

### Finding 2+3 — Connecter routines-guardrails + routines-setup

- [ ] **Step 6** : Ouvrir `wiki/meta/foundation-os-map.md`. Dans la section "### Neuroplasticite", ajouter :
  ```
  - [[routines-guardrails]] — Garde-fous communs des 14 routines (lu avant chaque routine)
  - [[routines-setup]] — Prompts des 14 routines Desktop autopilote
  ```
- [ ] **Step 7** : Ouvrir `wiki/index-wiki.md`. Dans la section "## Meta", ajouter :
  ```
  - [[routines-guardrails]] — Garde-fous routines
  - [[routines-setup]] — Setup 14 routines
  ```

### Finding 4 — Ajouter navigation header à wiki/log.md

- [ ] **Step 8** : Ouvrir `wiki/log.md`. Après le frontmatter `---`, ajouter la première ligne :
  ```
  Navigation: [[index-wiki]] | [[hot]] | [[overview]] | [[foundation-os-map]]
  ```

### Finding 5 — Ajouter session-neuroplasticity-audit dans index-wiki

- [ ] **Step 9** : Ouvrir `wiki/index-wiki.md`. Dans la section "### Sources", ajouter après la dernière source :
  ```
  - [[sources/session-2026-04-16-neuroplasticity-audit]] — 2026-04-16 | session audit neuroplasticite (7 failles + 4 reflexes)
  ```
- [ ] **Step 10** : Mettre à jour la table stats : `| Sources | 4 |` → `| Sources | 5 |` (si pas déjà 5)

### Finding 6 — Enrichir tools-foundation-os.md (1 sortant → 5+)

- [ ] **Step 11** : Ouvrir `wiki/entities/tools-foundation-os.md`. Ajouter dans la section "## Connections" (la créer si absente) :
  ```
  ## Connections

  - [[Obsidian]] — editeur vault wiki
  - [[AgriciDaniel]] — plugin claude-obsidian
  - [[LLM Wiki Pattern]] — pattern architectural du wiki
  - [[Void Glass]] — design system dark-only
  - [[design-system-components]] — 46 composants + 6 foundations DS
  ```
- [ ] **Step 12** : Mettre à jour le frontmatter `related:` :
  ```yaml
  related:
    - "[[foundation-os-desktop-migration]]"
    - "[[Obsidian]]"
    - "[[AgriciDaniel]]"
    - "[[LLM Wiki Pattern]]"
    - "[[Void Glass]]"
    - "[[design-system-components]]"
  ```

### Vérification Phase 1

- [ ] **Step 13** : `bash scripts/health-check.sh` → pas BROKEN
- [ ] **Step 14** : `bash scripts/wiki-health.sh` → vérifier fantômes réduits

### Commit Phase 1

- [ ] **Step 15** :
  ```bash
  git add wiki/ docs/core/knowledge.md
  git commit -m "fix(wiki): P0 audit mapping — 6 fantomes supprimes, 3 orphelins connectes, log.md header, tools-fo enrichi"
  ```

---

## Phase 2 — P1 Structurel : hubs déconnectés + cross-refs Core OS (30 min)

**Objectif** : connecter CLAUDE.md/CONTEXT.md/README.md au graph + ajouter wikilinks dans les 8 specs Core OS + cross-refs entre specs.

### Finding 7 — CLAUDE.md (0 wikilinks → 3+)

**Nuance importante** : CLAUDE.md est un fichier d'instructions Claude Code chargé automatiquement. Les `[[wikilinks]]` seront IGNORÉS par Claude Code mais VISIBLES dans le graph Obsidian. C'est un gain Obsidian sans régression Claude Code.

- [ ] **Step 1** : Ouvrir `CLAUDE.md`. Dans la section "## Stack & Regles code", ajouter après "Void Glass" :
  ```
  Void Glass : [[Void Glass]] (concept wiki)
  ```
  (Ou simplement transformer la première mention "Void Glass" en `[[Void Glass]]`)

- [ ] **Step 2** : Dans la section "### Neuroplasticite memoire", ajouter :
  ```
  Spec complete : [[knowledge]] section 8. Index wiki : [[index-wiki]]. Carte : [[foundation-os-map]].
  ```

### Finding 8 — CONTEXT.md (0 wikilinks → 2+)

- [ ] **Step 3** : Ouvrir `CONTEXT.md`. Dans la table Modules, ligne Knowledge, ajouter `[[index-wiki]]` quelque part dans le Detail.
- [ ] **Step 4** : Dans la ligne Design System, transformer "iso base DS" en mentionnant `[[Void Glass]]`.

### Finding 9 — README.md (0 wikilinks → 2+)

- [ ] **Step 5** : Ouvrir `README.md`. Dans la section Structure, transformer la ligne `wiki/` en :
  ```
  wiki/                  [[index-wiki|Knowledge layer Obsidian]] (pattern [[LLM Wiki Pattern|Karpathy LLM Wiki]], D-WIKI-01)
  ```

### Finding 10 — 8 fichiers docs/core/ sans wikilinks

Pour CHAQUE fichier ci-dessous, ajouter une section "## Voir aussi" à la FIN du fichier avec les wikilinks vers les modules liés. Ne PAS modifier le contenu existant.

- [ ] **Step 6** : `docs/core/cortex.md` — ajouter en fin :
  ```
  ## Voir aussi

  - [[communication]] — module Communication (tiers memoire, brief v11)
  - [[monitor]] — module Monitor (health indicators, seuils)
  - [[tools]] — module Tools (scripts, CI/CD, catalogue)
  - [[knowledge]] — module Knowledge (wiki, neuroplasticite)
  ```

- [ ] **Step 7** : `docs/core/monitor.md` — ajouter en fin :
  ```
  ## Voir aussi

  - [[tools]] — module Tools (scripts health-check, drift-detector)
  - [[cortex]] — module Cortex (routing, orchestration)
  - [[Void Glass]] — concept design tokens (seuils Void Glass dans health-check)
  ```

- [ ] **Step 8** : `docs/core/tools.md` — ajouter en fin :
  ```
  ## Voir aussi

  - [[monitor]] — module Monitor (health indicators)
  - [[planner]] — module Planner (orchestrateur plans)
  - [[worktrees]] — module Worktrees (scripts worktree-*)
  - [[knowledge]] — module Knowledge (skills claude-obsidian)
  - [[AgriciDaniel]] — auteur plugin claude-obsidian
  - [[Obsidian]] — editeur vault wiki
  ```

- [ ] **Step 9** : `docs/core/planner.md` — ajouter en fin :
  ```
  ## Voir aussi

  - [[naming-conventions]] — conventions nommage plans
  - [[tools]] — module Tools (scripts, catalogue)
  - [[LLM Wiki Pattern]] — pattern planification knowledge
  ```

- [ ] **Step 10** : `docs/core/worktrees.md` — ajouter en fin :
  ```
  ## Voir aussi

  - [[planner]] — module Planner (plans dans worktrees)
  - [[naming-conventions]] — conventions nommage worktrees wt/<desc>-<yymmdd>
  - [[tools]] — module Tools (scripts worktree-*)
  ```

- [ ] **Step 11** : `docs/core/naming-conventions.md` — ajouter en fin :
  ```
  ## Voir aussi

  - [[planner]] — conventions plans
  - [[worktrees]] — conventions worktrees
  - [[index-wiki]] — conventions wiki pages
  ```

- [ ] **Step 12** : `docs/manifeste.md` — ajouter en fin (si pas de section Voir aussi) :
  ```
  ## Voir aussi

  - [[index-wiki]] — wiki knowledge Foundation OS
  - [[architecture-core]] — architecture 7 modules Core OS
  - [[Void Glass]] — identite visuelle DS
  ```

- [ ] **Step 13** : `docs/decisions-log.md` — ajouter en haut après le titre :
  ```
  Navigation: [[CONTEXT]] (decisions actives) | [[index-wiki]] (wiki) | [[foundation-os-map]] (carte)
  ```

### Finding 11 — knowledge.md : convertir mentions texte en wikilinks

- [ ] **Step 14** : Ouvrir `docs/core/knowledge.md`. Faire ces remplacements dans le texte (pas dans les blocs code) :
  - "claude-obsidian" (première occurrence hors code) → `[[agricidaniel-claude-obsidian|claude-obsidian]]`
  - "Karpathy LLM Wiki" → `[[LLM Wiki Pattern|Karpathy LLM Wiki]]`
  - "Obsidian" (première occurrence significative) → `[[Obsidian]]`
  - "Pinecone" (première occurrence) → `[[Pinecone]]`
  - Dans la table des pages meta, remplacer les `wiki/meta/thinking.md` texte par `[[thinking]]`, `wiki/meta/sessions-recent.md` par `[[sessions-recent]]`, `wiki/meta/lessons-learned.md` par `[[lessons-learned]]`

### Finding 12 — Cross-refs entre specs (matrice)

Déjà couvert par les "## Voir aussi" des steps 6-13. Les specs se réfèrent maintenant les unes aux autres.

### Vérification Phase 2

- [ ] **Step 15** : `bash scripts/health-check.sh` → pas BROKEN
- [ ] **Step 16** : Vérifier que CLAUDE.md est toujours lisible par Claude Code (pas de syntaxe cassée)
- [ ] **Step 17** : `wc -l CLAUDE.md CONTEXT.md` → vérifier pas de bloat

### Commit Phase 2

- [ ] **Step 18** :
  ```bash
  git add CLAUDE.md CONTEXT.md README.md docs/
  git commit -m "feat(wiki): P1 audit mapping — CLAUDE/CONTEXT/README connectes + 8 specs Core OS cross-linkees"
  ```

---

## Phase 3 — P2 Frontmatter related: alignement (15 min)

**Objectif** : aligner le champ `related:` du frontmatter de chaque page wiki avec les wikilinks effectivement présents dans le contenu.

**Règle** : si une page mentionne `[[X]]` dans son contenu, `X` DOIT être dans `related:` du frontmatter. L'inverse n'est pas obligatoire (related: peut avoir des refs supplémentaires).

### Finding 13 — 4 pages sources : related: incomplet

- [ ] **Step 1** : Ouvrir `wiki/sources/karpathy-llm-wiki-pattern.md`. Remplacer le champ `related:` par :
  ```yaml
  related:
    - "[[agricidaniel-claude-obsidian]]"
    - "[[Andrej Karpathy]]"
    - "[[Obsidian]]"
    - "[[Pinecone]]"
    - "[[LLM Wiki Pattern]]"
    - "[[Hot Cache]]"
    - "[[Compounding Knowledge]]"
  ```

- [ ] **Step 2** : Ouvrir `wiki/sources/agricidaniel-claude-obsidian.md`. Remplacer `related:` par :
  ```yaml
  related:
    - "[[karpathy-llm-wiki-pattern]]"
    - "[[AgriciDaniel]]"
    - "[[Obsidian]]"
    - "[[LLM Wiki Pattern]]"
    - "[[Hot Cache]]"
    - "[[Compounding Knowledge]]"
  ```

- [ ] **Step 3** : Ouvrir `wiki/sources/session-2026-04-16-wiki-adoption.md`. Remplacer `related:` par :
  ```yaml
  related:
    - "[[karpathy-llm-wiki-pattern]]"
    - "[[agricidaniel-claude-obsidian]]"
    - "[[LLM Wiki Pattern]]"
    - "[[Hot Cache]]"
    - "[[Compounding Knowledge]]"
    - "[[Andrej Karpathy]]"
    - "[[AgriciDaniel]]"
    - "[[Obsidian]]"
    - "[[tools-foundation-os]]"
  ```

- [ ] **Step 4** : Ouvrir `wiki/sources/session-2026-04-16-neuroplasticity-audit.md`. Remplacer `related:` par :
  ```yaml
  related:
    - "[[session-2026-04-16-wiki-adoption]]"
    - "[[karpathy-llm-wiki-pattern]]"
    - "[[LLM Wiki Pattern]]"
    - "[[Hot Cache]]"
    - "[[Compounding Knowledge]]"
    - "[[foundation-os-map]]"
    - "[[tools-foundation-os]]"
  ```

### Finding 14 — tools-foundation-os.md related: (déjà fait Finding 6 Step 12)

Déjà couvert Phase 1 Step 12.

### Finding 15 — Hot Cache, Compounding Knowledge, Andrej Karpathy, Pinecone

- [ ] **Step 5** : `wiki/concepts/Hot Cache.md` — ajouter dans `related:` :
  ```yaml
    - "[[Obsidian]]"
  ```

- [ ] **Step 6** : `wiki/concepts/Compounding Knowledge.md` — ajouter dans `related:` :
  ```yaml
    - "[[Pinecone]]"
  ```

- [ ] **Step 7** : `wiki/entities/Andrej Karpathy.md` — ajouter dans `related:` :
  ```yaml
    - "[[agricidaniel-claude-obsidian]]"
  ```

- [ ] **Step 8** : `wiki/entities/Pinecone.md` — ajouter dans `related:` :
  ```yaml
    - "[[Obsidian]]"
  ```

### Commit Phase 3

- [ ] **Step 9** :
  ```bash
  git add wiki/
  git commit -m "fix(wiki): P2 audit mapping — frontmatter related: aligne sur 10 pages"
  ```

---

## Phase 4 — P3 Enrichissement graph (20 min)

**Objectif** : connecter les neurones faibles, linker Void Glass, cross-ref domaines, mettre à jour stats carte.

### Finding 16 — overview.md : mentions texte → wikilinks

- [ ] **Step 1** : Ouvrir `wiki/overview.md`. Transformer :
  - "Pattern : Karpathy LLM Wiki" → "Pattern : [[LLM Wiki Pattern|Karpathy LLM Wiki]]"
  - "knowledge compounds" ou similaire → "[[Compounding Knowledge|knowledge compounds]]"
  - "Obsidian" (si mentionné sans lien) → "[[Obsidian]]"
  - Ajouter `[[foundation-os-map]]` dans une section navigation si absent

### Finding 17 — Cross-ref domain indexes

- [ ] **Step 2** : `wiki/domains/trading/index-trading.md` — dans "Cross-references cles", ajouter :
  ```
  - [[Compounding Knowledge]] — le compounding s'applique aux backtests et strategies
  ```

- [ ] **Step 3** : `wiki/domains/finance/index-finance.md` — dans "Cross-references cles", ajouter :
  ```
  - [[Compounding Knowledge]] — le compounding s'applique aux decisions patrimoine
  ```

- [ ] **Step 4** : `wiki/domains/design/index-design.md` — dans "Cross-references cles", ajouter :
  ```
  - [[design-system-components]] — 46 composants + 6 foundations DS
  - [[Obsidian]] — visualisation graph design system
  ```

- [ ] **Step 5** : `wiki/domains/dev/index-dev.md` — dans "Cross-references cles", ajouter :
  ```
  - [[foundation-os-desktop-migration]] — histoire migration Desktop 2026-04-15
  - [[LLM Wiki Pattern]] — pattern architectural wiki
  - [[tools-foundation-os]] — toolchain Foundation OS
  ```

### Finding 18 — Void Glass sous-référencé → ajouter dans 3 fichiers

- [ ] **Step 6** : `wiki/meta/foundation-os-map.md` — dans section "### Concepts", ajouter :
  ```
  - [[Void Glass]] — Design system dark-only #030303 Foundation OS
  ```

- [ ] **Step 7** : `wiki/domains/design/concepts/design-system-components.md` — vérifier que `[[Void Glass]]` est bien dans le contenu. Si absent, ajouter dans section "## Specs techniques" : "Theme : Dark-only [[Void Glass]] (#030303)".

### Finding 19+20 — foundation-os-map stats + sections incomplètes

- [ ] **Step 8** : Ouvrir `wiki/meta/foundation-os-map.md`. Mettre à jour la table Statistiques en bas :
  - Compter le vrai nombre de fichiers par catégorie
  - Mettre à jour "Total connecte"
  - Ajouter `[[Void Glass]]` dans section Concepts si absent
  - Ajouter `[[design-system-components]]` dans section Design System si absent
  - Vérifier que `[[routines-guardrails]]` et `[[routines-setup]]` sont dans section Meta (fait Phase 1)

### Finding 21 — desktop-migration sous-linké

- [ ] **Step 9** : `wiki/domains/dev/index-dev.md` — déjà fait Step 5.
- [ ] **Step 10** : `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` — ajouter dans Connections si absent :
  ```
  - [[index-dev]] — domaine dev
  - [[Obsidian]] — visualisation graph
  ```

### Commit Phase 4

- [ ] **Step 11** :
  ```bash
  git add wiki/
  git commit -m "feat(wiki): P3 audit mapping — overview enrichi, domaines cross-linkes, Void Glass connecte, carte stats a jour"
  ```

---

## Phase 5 — P4 Nouvelles pages + tags (45 min)

**Objectif** : créer les pages concepts manquantes + harmoniser les tags.

### Finding 22a — 5 concepts à créer

Utiliser le template `wiki/meta/templates/concept.md` comme base. Pour chaque page :
- Frontmatter complet (type, title, domain, tags, status: seed, related)
- Sections : Definition, How It Works, Why It Matters, Connections, Sources
- Wikilinks vers pages existantes pertinentes
- Ajouter dans `wiki/index-wiki.md` section Concepts après création

- [ ] **Step 1** : Créer `wiki/concepts/Foundation OS.md`
  - domain: dev, tags: [concept, foundation-os, os]
  - Definition: OS de travail personnel IA-driven de Kevin. Monorepo local, versionné git, déployé Vercel.
  - Connections: [[Core OS]], [[Void Glass]], [[LLM Wiki Pattern]], [[index-wiki]]

- [ ] **Step 2** : Créer `wiki/concepts/Core OS.md`
  - domain: dev, tags: [concept, core-os, architecture]
  - Definition: Architecture 7 modules (Cortex, Communication, Monitor, Tools, Planner, Worktrees, Knowledge)
  - Connections: [[Foundation OS]], [[cortex]], [[communication]], [[monitor]], [[tools]], [[planner]], [[worktrees]], [[knowledge]]

- [ ] **Step 3** : Créer `wiki/concepts/Brief v11.md`
  - domain: dev, tags: [concept, brief, tdah, communication]
  - Definition: Format de brief de session TDAH-friendly, 14 sections, cadres box-drawing, emojis couleur
  - Connections: [[communication]], [[Foundation OS]], [[Hot Cache]]

- [ ] **Step 4** : Créer `wiki/concepts/Neuroplasticite.md`
  - domain: dev, tags: [concept, neuroplasticity, memory, knowledge-management]
  - Definition: Système d'auto-amélioration mémoire : 4 réflexes + 3 pages meta + routines + loop.md
  - Connections: [[LLM Wiki Pattern]], [[Hot Cache]], [[thinking]], [[sessions-recent]], [[lessons-learned]], [[knowledge]]

- [ ] **Step 5** : Créer `wiki/domains/sante/concepts/TDAH workflow.md` (ou `wiki/concepts/TDAH workflow.md`)
  - domain: sante + dev (transversal), tags: [concept, tdah, workflow, accessibility]
  - Definition: Adaptations du workflow pour TDAH de Kevin : briefs visuels, cadres, scanning rapide, zones couleur
  - Connections: [[Brief v11]], [[Foundation OS]], [[communication]]

- [ ] **Step 6** : Mettre à jour `wiki/index-wiki.md` section Concepts : ajouter les 5 nouvelles pages.

- [ ] **Step 7** : Mettre à jour `wiki/meta/foundation-os-map.md` section Concepts : ajouter les 5 nouvelles.

### Finding 23a — Harmoniser tags

- [ ] **Step 8** : Pour chaque fichier, ajouter les tags manquants dans le frontmatter `tags:` :

| Fichier | Tag à ajouter |
|---------|--------------|
| `wiki/concepts/LLM Wiki Pattern.md` | `knowledge-management` |
| `wiki/concepts/Hot Cache.md` | `dev` |
| `wiki/concepts/Compounding Knowledge.md` | `dev` |
| `wiki/concepts/Void Glass.md` | `design`, `foundation-os` |
| `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` | `dev` |
| `wiki/domains/design/concepts/design-system-components.md` | `design` |

### Finding 23b — Convention nommage (DÉCISION KEVIN)

**Options** :
- **(a)** Garder les espaces pour concepts/entities (beau dans Obsidian graph). Adapter `scripts/wiki-health.sh` pour quoter correctement (déjà partiellement fait).
- **(b)** Tout passer en kebab-case. Utiliser `aliases:` frontmatter pour display name. Ex: `llm-wiki-pattern.md` avec `aliases: ["LLM Wiki Pattern"]`.

**Recommandation** : option (a) = garder espaces. Obsidian est l'outil de visu, autant que les noms soient beaux dedans. Les scripts sont déjà adaptés.

**Si Kevin choisit (b)** : prévoir un renommage massif + recâblage (session dédiée).

### Finding 23c — Tags couleurs Obsidian (KEVIN dans l'UI)

Kevin doit configurer dans Obsidian :
1. Graph view → Settings (engrenage en haut à droite du graph)
2. Section "Groups" → "New group" pour chaque :
   - Query: `tag:#concept` → Couleur: bleu
   - Query: `tag:#entity` → Couleur: vert
   - Query: `tag:#source` → Couleur: orange
   - Query: `tag:#meta` → Couleur: gris
   - Query: `path:docs/core` → Couleur: rouge

### Commit Phase 5

- [ ] **Step 9** :
  ```bash
  git add wiki/ docs/
  git commit -m "feat(wiki): P4 audit mapping — 5 concepts crees, tags harmonises, index+carte a jour"
  ```

---

## Phase finale — Vérification + push (5 min)

- [ ] **Step 1** : `bash scripts/health-check.sh` → SAIN ou DEGRADED (pas BROKEN)
- [ ] **Step 2** : `bash scripts/wiki-health.sh` → SAIN
- [ ] **Step 3** : `bash scripts/drift-detector.sh` → vérifier
- [ ] **Step 4** : Compter wikilinks total : `grep -roh '\[\[' wiki/ docs/ CLAUDE.md CONTEXT.md README.md 2>/dev/null | wc -l` → comparer avec baseline (devrait être 725 + ~80 ajoutés = ~805+)
- [ ] **Step 5** : `git push origin main`
- [ ] **Step 6** : Rafraîchir graph Obsidian et vérifier visuellement

---

## Risques

| Risque | Mitigation |
|--------|------------|
| Wikilinks dans CLAUDE.md perturbent Claude Code | Non : Claude Code ignore les `[[]]`, traité comme texte brut |
| Ajout "Voir aussi" dans docs/core/ bloat les specs | Chaque section = 3-5 lignes max, impact minimal |
| Nouvelles pages concept mal linkées | Chaque page a related: + wikilinks dans contenu + ajoutée dans index + carte |
| Tags ajoutés cassent le frontmatter YAML | Vérifier syntaxe YAML après chaque modif (tiret + espace + mot) |

## Execution log

- [ ] Phase 0 — Baseline
- [ ] Phase 1 — P0 fantômes + orphelins (15 min)
- [ ] Phase 2 — P1 hubs + cross-refs Core OS (30 min)
- [ ] Phase 3 — P2 frontmatter related: (15 min)
- [ ] Phase 4 — P3 enrichissement graph (20 min)
- [ ] Phase 5 — P4 nouvelles pages + tags (45 min)
- [ ] Phase finale — vérification + push
