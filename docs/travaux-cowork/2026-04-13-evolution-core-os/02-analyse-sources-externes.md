# Analyse detaillee des sources externes — 2026-04-13

> Produit par Cowork (Opus 4.6) a la demande de Kevin.
> But : servir de base a une session de comparatif avec le systeme actuel Foundation OS + generation de plan d'amelioration.
> Regle : zero bullshit, zero invention. Ce qui n'a pas pu etre verifie est marque [NON VERIFIE].

---

## Table des matieres

1. Guide complet configuration .claude (24 parties)
2. Pattern Karpathy — Wiki Markdown + Obsidian + Pinecone
3. Core (RedPlanetHQ) — Memoire auto-evolutive
4. Graphify — Knowledge Graph pour codebase
5. RTK (Rust Token Killer) — Compression tokens
6. GSD-2 (Get Shit Done v2) — Orchestration autonome
7. Paperclip — Orchestration multi-agents
8. Awesome Claude Code — Catalogue communautaire
9. Skills Design (Emil Kowalski, Impeccable, Taste-Skill)
10. Ultraplan — Planification cloud Anthropic
11. SummonAIKit [NON VERIFIE — site bloque]
12. Synthese : ce qui apporte quoi

---

## 1. Guide complet configuration .claude (24 parties)

### Source
Texte complet fourni par Kevin, 24 sections. Auteur non identifie. Guide pratique extremement detaille sur la configuration de Claude Code.

### Contenu detaille

#### 1.1 Architecture des dossiers (Parties 1-2, 22)

Deux niveaux de configuration :
- **Projet** (`.claude/` a la racine du repo) : commite dans git, partage par l'equipe
- **Personnel** (`~/.claude/`) : preferences individuelles, auto-memory, historique

Structure complete recommandee :
```
your-project/
  CLAUDE.md                 # Instructions equipe (commit git)
  CLAUDE.local.md           # Surcharges perso (gitignored)
  .claude/
    settings.json           # Permissions, hooks, config (commit)
    settings.local.json     # Surcharges perso permissions (gitignored)
    hooks/                  # Scripts declenchables
      bash-firewall.sh
      auto-format.sh
      enforce-tests.sh
    rules/                  # Instructions modulaires
      code-style.md
      testing.md
      api-conventions.md
      security.md
    skills/                 # Workflows auto-invoques
      security-review/
        SKILL.md
        DETAILED_GUIDE.md
    agents/                 # Subagents specialises
      code-reviewer.md
      security-auditor.md

~/.claude/
  CLAUDE.md                 # Instructions globales perso
  settings.json             # Settings globaux + hooks
  skills/                   # Skills perso cross-projets
  agents/                   # Agents perso cross-projets
  projects/                 # Auto-memory + transcripts (auto-gere)
```

**Ce que ca apporte** : separation claire equipe/perso, modularite, pas de fichier monolithique.

#### 1.2 CLAUDE.md — Le fichier le plus important (Parties 3-4)

- Se place a la racine du projet (PAS dans `.claude/`)
- Charge dans le system prompt, reste en contexte toute la session
- Peut exister dans des sous-repertoires (combine avec la racine)
- **Taille recommandee : < 50 lignes idealement, max 200 lignes**
- Au-dela de 200L, l'adherence de Claude aux instructions BAISSE reellement
- Un fichier cible de 50L fonctionne MIEUX qu'un fichier exhaustif de 400L

**Contenu recommande** :
- Commandes build/test/lint (les commandes elles-memes, pas un lien vers README)
- Decisions d'architecture (les grands choix non-evidents du code)
- Pieges non-evidents (ce que les nouveaux de l'equipe ratent)
- Conventions (au-dela de ce qu'un linter detecte)

**Ce qu'il ne faut PAS mettre** :
- Regles deja dans .eslintrc / .prettierrc (Claude les lit directement)
- Documentation complete (ref vers docs, pas copie)
- Longs paragraphes de philosophie
- Tout ce qui depasse 200 lignes

**Exemple concret fourni** : ~30 lignes couvrant commandes, archi, conventions, pieges. Minimaliste et efficace.

**Impact pour Foundation OS** : Notre CLAUDE.md actuel fait ~120 lignes. C'est dans la zone acceptable mais le guide suggere qu'on pourrait gagner en deplacant certaines sections dans des rules/ path-scoped.

#### 1.3 CLAUDE.local.md (Partie 5)

- Fichier optionnel a la racine du projet
- Gitignored automatiquement
- Preferences personnelles du dev (style de diff, verbosity, preferences de test)
- La plupart des utilisateurs n'en ont pas besoin

**Impact pour Foundation OS** : Pertinent pour la separation Cowork/CLI — chaque "tete" pourrait avoir ses preferences locales.

#### 1.4 Dossier rules/ — Instructions modulaires (Parties 6-7)

- Chaque fichier `.md` dans `.claude/rules/` est charge automatiquement
- Decoupe par sujet : testing.md, security.md, api-conventions.md, etc.
- PR plus simples a relire (un sujet = un fichier)
- **Path-scoped rules** (innovation majeure) :
  - Frontmatter YAML avec `paths:` pour charger la regle SEULEMENT quand Claude touche certains fichiers
  - Exemple : regles API chargees uniquement pour `src/api/**/*.ts`
  - Sans `paths:`, la regle est chargee inconditionnellement
  - Garde le contexte propre et focalise

**Exemple** :
```yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---
# API Design Rules
All handlers return { data, error } shape
...
```

**Impact pour Foundation OS** : On n'utilise PAS du tout les rules/ path-scoped actuellement. Tout est dans CLAUDE.md ou dans les instructions Cowork. C'est une amelioration potentielle significative.

#### 1.5 settings.json — Permissions (Parties 8-10)

- Allow list : commandes sures sans validation (npm run *, git status, Read, Write...)
- Deny list : commandes bloquees inconditionnellement (rm -rf, curl *, git push *, .env...)
- Zone intermediaire : tout le reste demande validation
- `settings.local.json` pour surcharges perso (gitignored)
- Schema JSON disponible pour autocompletion VS Code

**Philosophie** : genereux en allow (operations sures), strict en deny (operations dangereuses), laisser le reste en validation manuelle.

**Impact pour Foundation OS** : On a deja des hooks de securite (security-reminder.py, validate-void-glass) mais pas de deny list formalisee dans settings.json. A evaluer.

#### 1.6 Hooks — Controle deterministe (Parties 11-15)

C'est la section qui change la donne selon le guide.

**Difference cle** :
- CLAUDE.md = instructions suivies ~90% du temps
- Hooks = execution 100% du temps, deterministe

**Exit codes** :
- `exit 0` : succes, continuer
- `exit 1` : erreur non-bloquante, log + continue
- `exit 2` : BLOCAGE — arret + message d'erreur renvoye a Claude
- **ERREUR CRITIQUE** : utiliser exit 1 pour la securite ne bloque RIEN. Il faut exit 2.

**Evenements disponibles** :
- `PreToolUse` : AVANT execution d'un outil (porte de securite)
- `PostToolUse` : APRES execution (nettoyage, formatting)
- `Stop` : quand Claude se declare termine (controle qualite final)
- `UserPromptSubmit` : validation/logging de prompts
- `Notification` : alertes desktop
- `SessionStart` / `SessionEnd` : setup/cleanup

**Matchers** : restriction a certains outils ("Bash", "Write|Edit|MultiEdit")

**3 hooks essentiels decrits** :

1. **Bash Firewall (PreToolUse)** :
   - Lit le payload JSON stdin, extrait la commande
   - Compare contre patterns dangereux (rm -rf, git push --force, DROP TABLE, curl|bash, chmod 777...)
   - Exit 2 si match, exit 0 sinon
   - Script : `.claude/hooks/bash-firewall.sh`

2. **Auto-Format (PostToolUse)** :
   - Apres chaque Write/Edit, lance prettier (JS/TS/JSON/CSS/MD) ou black (Python)
   - Matcher : "Write|Edit|MultiEdit"
   - Script : `.claude/hooks/auto-format.sh`

3. **Test Enforcement (Stop)** :
   - Quand Claude dit "done", lance npm run test + npx tsc --noEmit
   - Si echec → exit 2, Claude doit corriger
   - **stop_hook_active check** : verifie si c'est la 2e tentative pour eviter boucle infinie
   - Script : `.claude/hooks/enforce-tests.sh`

**Impact pour Foundation OS** : On a des hooks (validate-void-glass, security-reminder.py) mais pas de bash firewall, pas d'auto-format, pas de test enforcement au Stop. C'est potentiellement tres utile.

**Les hooks ne font PAS de hot-reload** : il faut redemarrer la session pour les changements. Point a retenir.

#### 1.7 Skills — Workflows reutilisables (Parties 16-17)

- Dossier `.claude/skills/` avec sous-dossiers
- Chaque skill a un SKILL.md avec frontmatter YAML (name, description, allowed-tools)
- Difference avec rules : rules = standards passifs, skills = workflows actifs que Claude invoque
- Peuvent embarquer des fichiers de support (templates, guides, checklists)
- Skills personnels dans `~/.claude/skills/`
- Invocation automatique (Claude reconnait la correspondance) ou explicite (`/nom-du-skill`)
- Reference `@FICHIER.md` pour charger des docs de support

**Exemple fourni** : skill security-review avec SKILL.md + DETAILED_GUIDE.md

**Impact pour Foundation OS** : On a deja une structure skills/ riche (80+ skills). Le pattern est conforme. Mais on pourrait beneficier du pattern de fichiers de support embarques.

#### 1.8 Agents — Subagents specialises (Parties 18-19)

- Dossier `.claude/agents/`
- Chaque agent = fichier markdown avec system prompt, tools, modele
- S'executent dans leur PROPRE fenetre de contexte isolee (pas dans la conversation principale)
- Compriment leurs resultats puis reportent
- Champ `tools` : restriction explicite (code-reviewer n'a besoin que de Read, Grep, Glob)
- Champ `model` : choix du modele (haiku pour read-only, opus pour raisonnement complexe)
- Agents personnels dans `~/.claude/agents/`

**Regles** :
- Minimiser les outils par agent (principe du moindre privilege)
- Utiliser des modeles moins couteux pour les taches simples

**Impact pour Foundation OS** : On a 4 agents (os-architect, dev-agent, doc-agent, review-agent). Le pattern est conforme. La restriction d'outils et le choix de modele par agent sont des optimisations potentielles.

#### 1.9 Configuration globale ~/.claude/ (Parties 20-21)

- `~/.claude/CLAUDE.md` : preferences cross-projets
- `~/.claude/settings.json` : hooks globaux (ex: notifications desktop)
- `~/.claude/skills/` et `~/.claude/agents/` : disponibles partout
- `~/.claude/projects/` : auto-memory + transcripts (auto-gere)
- Auto-memory : Claude prend des notes automatiquement entre sessions
- Commande `/memory` pour consulter/modifier
- Peut retenir des infos incorrectes → verifier regulierement

**Impact pour Foundation OS** : L'auto-memory native de Claude Code existe deja. La question est : est-ce suffisant ou faut-il un systeme plus structure ?

#### 1.10 Erreurs courantes (Partie 24)

10 erreurs identifiees :
1. CLAUDE.md trop long (>400L) → adherence baisse
2. Exit code 1 au lieu de 2 dans hooks securite → ne bloque rien
3. Pas de check stop_hook_active → boucle infinie
4. Tout dans CLAUDE.md au lieu de rules/ → maintenance difficile
5. Allow list trop restrictive → perte de temps en validations
6. Hooks pas hot-reloadables → redemarrer la session
7. Scripts de hooks non-executables (chmod +x oublie)
8. Duplication config linter dans CLAUDE.md → gaspillage contexte
9. Trop de tools donnes aux agents → plus de risque d'erreur
10. Ne jamais verifier l'auto-memory → infos incorrectes persistantes

#### 1.11 Setup pas a pas (Partie 23)

Progression recommandee :
1. CLAUDE.md (50L, essentiel) — 5 min
2. settings.json (allow/deny) — 5 min
3. Bash firewall hook — 5 min
4. Auto-format hook
5. Test enforcement hook
6. Decoupe en rules/ (quand CLAUDE.md > 50L)
7. Config globale ~/.claude/
8. Skills et agents (quand workflows recurrents identifies)

Steps 1-3 = 15 min, 80% de la valeur.

---

## 2. Pattern Karpathy — Wiki Markdown + Obsidian + Pinecone

### Source
Texte fourni par Kevin. Reference a Andrej Karpathy (avril 2026). Guide Notion.

### Concept

Au lieu de RAG complexe avec embeddings, faire "pre-compiler" les sources brutes en wiki Markdown structure. Les LLMs raisonnent tres bien sur du Markdown long et structure.

### Architecture

```
memory/
  MEMORY.md           # Index des notes (genere par Claude)
  hot.md              # Cache de la derniere session (lu en premier)
  user_prefs.md       # Preferences de code
  project_*.md        # Notes par projet
  decisions_*.md      # Decisions techniques
  reference_*.md      # Liens et ressources
```

### Flux operationnel

1. **Debut de session** : lire hot.md (cache) → lire MEMORY.md (index) → charger notes pertinentes
2. **Pendant la session** : notes mises a jour en cascade quand nouvelle info importante
3. **Fin de session** : hot.md rafraichi avec resume compact, MEMORY.md mis a jour

### Le "hot cache" (hot.md)

Feature la plus sous-estimee selon la source :
- Resume compact de la derniere session
- Lu en premier au demarrage
- Elimine le besoin de reconstruire le contexte manuellement
- Se met a jour automatiquement en fin de session

### Integration Obsidian

- Editeur Markdown local, gratuit, pas de vendor lock-in
- Le vault = un dossier de fichiers texte que Claude peut lire/ecrire
- Aucune magie : c'est juste un dossier de .md

### Limites du pattern pur Markdown

- Au-dela de ~500 fichiers, le systeme sature
- Taille du contexte : tout lire = beaucoup de tokens
- Couts : chaque token lu = argent
- Performance : temps de chargement augmente
- Claude "oublie" des choses malgre les notes (contexte trop long)

### Solution : Pinecone pour archivage long terme

- Base de donnees vectorielle managee
- Stocke les notes anciennes sous forme d'embeddings
- Recherche semantique (par similarite, pas par mot-cle)
- Plan gratuit disponible
- Dimensions : 1536 (OpenAI) ou 1024 (Cohere)

### Architecture finale a 2 couches

1. **Obsidian/Markdown** = contexte actif (quotidien, projets en cours)
2. **Pinecone** = archivage long terme (recherche semantique)
3. Fin de session → met a jour Obsidian + archive les vieilles notes dans Pinecone

**Ce que ca apporte** :
- Memoire infinie a cout controle
- Pas de perte de contexte entre sessions
- Cout maitrise (seules les notes actives sont lues)

**Impact pour Foundation OS** : On a deja un systeme de memoire a 4 tiers (Session/Contexte/Reference/Auto-memory) documente dans docs/core/communication.md. Le pattern Karpathy est conceptuellement similaire mais ajoute : (1) le hot cache (hot.md), (2) l'archivage vectoriel long terme. Notre CONTEXT.md joue partiellement le role de hot.md mais pas exactement.

---

## 3. Core (RedPlanetHQ) — Memoire auto-evolutive

### Source
GitHub : github.com/RedPlanetHQ/core
Documentation : docs.getcore.me [NON VERIFIE — site bloque]

### Qu'est-ce que c'est

Plateforme open-source d'assistant IA avec memoire persistante. Se positionne comme un "butler" autonome, pas un chatbot reactif.

### Architecture memoire

- **Graphe de connaissances temporel** (pas du RAG classique)
- Classifie et connecte les faits avec des metadonnees temporelles
- Historique des decisions avec raisonnement contextuel
- **Gestion des contradictions** : quand un fait change (REST → GraphQL, tarif 99$ → 149$), l'ancien est marque obsolete automatiquement
- Pas de nettoyage manuel

### Comment ca marche

- Chaque conversation est "compactee" en episode de memoire
- Extraction de faits et entites structures avec horodatages
- Recherche par intention (pas par similarite d'embeddings)
- Precision : 88.24% sur benchmark LoCoMo

### Stack technique

- Backend : Node.js, TypeScript
- BDD : PostgreSQL + Redis + Neo4j (graphe de connaissances)
- Frontend : Remix + Tailwind
- Infra : Docker, multi-LLM (OpenAI, Anthropic, Ollama)

### Integration Claude Code

- Plugin installe via MCP
- SessionStart / SessionEnd hooks pour sync automatique
- Fonctionne aussi avec Claude Desktop, Codex, Cursor

### Ce que ca apporte vs notre systeme

- **Gestion des contradictions** : on n'a pas ca. Si une decision change, on doit manuellement mettre a jour CONTEXT.md
- **Graphe temporel** : nos decisions ont des dates mais pas de lien semantique entre elles
- **Extraction automatique de faits** : on fait ca manuellement dans CONTEXT.md
- **Multi-canal** : Slack, WhatsApp, Telegram, email — on n'a pas ca

### Limites

- Lourd a auto-heberger (PostgreSQL + Redis + Neo4j + Docker)
- Necessite un serveur permanent
- Complexite d'infra significative pour un projet solo

---

## 4. Graphify — Knowledge Graph pour codebase

### Source
GitHub : github.com/safishamsi/graphify

### Qu'est-ce que c'est

Skill qui transforme des dossiers de contenu mixte (code, docs, PDFs, images, video/audio) en graphes de connaissances interrogeables.

### Comment ca marche (3 passes)

1. **Extraction AST** : tree-sitter analyse 23 langages. Classes, fonctions, imports, call graphs, commentaires de rationale. Pas de LLM necessaire.
2. **Transcription** : video/audio traites localement avec faster-whisper
3. **Analyse semantique** : subagents Claude en parallele sur docs et images → concepts et relations → graphe NetworkX avec detection de communautes Leiden

### Features

- **God Nodes** : identifie les concepts a plus haut degre de connexion
- **Confidence scoring** : EXTRACTED (1.0), INFERRED (avec score), AMBIGUOUS
- **71.5x moins de tokens par requete** vs lecture de fichiers bruts
- **Incremental** : SHA256 cache, ne traite que les fichiers changes
- **Export** : HTML interactif, JSON, Markdown, GraphML, Neo4j Cypher

### Integration Claude Code

- Hook PreToolUse injectant le contexte du graphe avant les recherches de fichiers
- Genere `GRAPH_REPORT.md` avec god nodes, communautes, questions suggerees
- Invocation : `/graphify .`

### Ce que ca apporte

- Comprendre une codebase massive rapidement
- Decouvrir les decisions architecturales enfouies dans les commentaires
- Connecter des concepts entre papers, code et artefacts de design
- Base de connaissances persistante

### Impact pour Foundation OS

- Potentiellement utile quand la codebase grossira (actuellement petit projet)
- Le pattern "graph report" comme contexte pre-charge est interessant
- L'approche AST + semantique sans RAG est elegante
- Overkill pour l'instant mais a garder en tete pour Phase 5+

---

## 5. RTK (Rust Token Killer) — Compression tokens

### Source
GitHub : github.com/rtk-ai/rtk

### Qu'est-ce que c'est

CLI en Rust qui filtre et compresse les outputs de commandes shell AVANT qu'ils n'arrivent dans le contexte du LLM. Reduction ~80% des tokens sur une session de 30 min.

### 4 strategies d'optimisation

1. **Smart Filtering** : elimine commentaires, whitespace, boilerplate
2. **Grouping** : agglutine les items lies (fichiers par dossier, erreurs par type)
3. **Truncation** : preserve le contexte pertinent, coupe la redondance
4. **Deduplication** : collapse les entrees de log repetees avec compteur

### Fonctionnement

- Hook Bash transparent : `git status` → reecrit en `rtk git status`
- 100+ commandes supportees (git, npm, cargo, docker, kubectl, aws...)
- < 10ms de surcharge par commande
- Zero dependance externe, single binary Rust

### Integration Claude Code

- Hook PreToolUse natif
- `rtk init -g` pour installer le hook + docs
- Supporte 10 plateformes IA (Claude Code, Cursor, Copilot, Gemini, Codex...)
- Analytics integrees : `rtk gain` (stats), `rtk discover` (opportunites), `rtk session` (tracking)

### Ce que ca apporte

- **Economie massive de tokens** (60-90% sur les commandes dev courantes)
- **Sessions plus longues** avant compactage
- **Cout reduit** pour les APIs payantes
- **Transparent** : aucun changement de workflow

### Impact pour Foundation OS

- Directement applicable. On utilise beaucoup de commandes shell (build, test, git).
- L'economie de tokens est critique quand on est proche des limites weekly (mentionne dans CONTEXT.md : "1% sous la limite weekly au 2026-04-11").
- Installation simple, gain immediat.

---

## 6. GSD-2 (Get Shit Done v2) — Orchestration autonome

### Source
GitHub : github.com/gsd-build/gsd-2

### Qu'est-ce que c'est

Application CLI TypeScript autonome qui orchestre le developpement logiciel. Pas un ensemble de prompts mais un vrai programme qui CONTROLE le processus.

### Architecture

**Hierarchie de travail** :
- **Milestone** : version livrable (4-10 slices)
- **Slice** : capacite verticale demontrable (1-7 tasks)
- **Task** : unite qui tient dans UNE fenetre de contexte (regle d'or)

**Pipeline d'execution** :
Plan (+ recherche) → Execute (par task) → Complete → Reassess Roadmap → Next Slice

### Features cles

- **Contexte frais par task** : chaque task = nouvelle fenetre de 200k tokens, pre-chargee uniquement avec les fichiers pertinents. Pas de degradation.
- **Mode auto** : `/gsd auto` tourne sans intervention humaine
- **Crash recovery** : lock files + synthese de briefing de reprise
- **Git** : worktree isolation ou branches, squash-merge vers main
- **Verification + auto-fix** : lint, test post-execution avec retry
- **Tracking couts/tokens** : par phase, slice, modele, avec plafond budget
- **Replanning adaptatif** : apres chaque slice, reassessment du roadmap
- **Multi-provider** : 20+ LLMs avec routing dynamique

### Modes de fonctionnement

- **Step** : un pas a la fois, pause entre chaque
- **Auto** : totalement autonome, enchaine tout
- **Headless** : sans TUI, pour CI/CD
- **Multi-session** : coordination de plusieurs workers via IPC fichier
- **Steering en temps reel** : 2 terminaux, un execute, l'autre pilote

### Ce que ca apporte

- Resout le probleme de degradation du contexte sur les longs projets
- Crash recovery automatique
- Budget tracking + cost control
- Git hygiene automatise
- Isolation de contexte par unite de travail

### Impact pour Foundation OS

- Concept tres aligne avec notre philosophie de decoupage en sessions courtes (imperatif anti-compactage)
- Le pattern "contexte frais par task" est exactement ce qu'on fait manuellement
- Le tracking de couts est pertinent vu nos contraintes weekly
- L'adaptive replanning est interessant pour notre /plan-os
- Complexite d'integration : c'est un outil autonome, pas un simple skill. Integration non triviale.

---

## 7. Paperclip — Orchestration multi-agents

### Source
GitHub : github.com/paperclipai/paperclip

### Qu'est-ce que c'est

Serveur Node.js + React UI pour coordonner plusieurs agents IA vers des objectifs business. Organisation en tickets, organigrammes, hierarchies d'objectifs.

### Features

- **Multi-agent** : fonctionne avec n'importe quel agent (Claude Code, Cursor, Codex, HTTP)
- **Budget par agent** : plafonds mensuels avec throttling automatique
- **Gouvernance** : humains = board-level control, audit trail immutable
- **Execution planifiee** : heartbeat system, delegation dans l'organigramme
- **Multi-entreprise** : isolation des donnees par organisation

### Impact pour Foundation OS

- Pertinent si/quand on passe a multi-agents en parallele
- Le budget tracking est utile
- Pour l'instant overkill — projet solo avec 1 agent a la fois
- A garder en tete pour Phase 5+ avec expansion

---

## 8. Awesome Claude Code — Catalogue communautaire

### Source
GitHub : github.com/hesreallyhim/awesome-claude-code

### Contenu

Liste massive de 200+ ressources classees :

**Skills notables** :
- AgentSys (workflow automation)
- Superpowers (SDLC, deja installe chez nous)
- Trail of Bits (securite, 12+ skills)
- Context Engineering Kit (optimisation tokens)
- Compound Engineering (apprentissage des erreurs)
- Everything Claude Code (patterns exemplaires)

**Workflows notables** :
- RIPER (Research-Innovate-Plan-Execute-Review)
- AB Method (spec-driven missions)
- Claude Code PM (project management)
- Simone (project management)
- Ralph Wiggum (autonomie avec guardrails)

**Outils notables** :
- Claude Squad (multi-agents dans terminaux separes)
- Claude Swarm (swarm d'agents)
- RTK (compression tokens — voir section 5)
- Container Use (Dagger — environnements isoles)
- cc-tools (hooks haute performance en Go)
- claudekit (20+ subagents, checkpointing)
- recall (recherche full-text sessions)
- ccusage/ccflare (monitoring usage/couts)
- SuperClaude (framework de configuration)
- agnix (linter pour fichiers agent)
- claude-rules-doctor (detection rules mortes)

**Orchestrateurs** :
- Auto-Claude (SDLC autonome + kanban)
- Claude Code Flow (cycles autonomes)
- Claude Task Master (gestion taches)
- GSD-2 (voir section 6)
- TSK (tasks sandboxees Docker)
- Ruflo (swarms + memoire vectorielle)

**Monitoring** :
- ccusage, ccflare, better-ccflare (dashboards couts)
- Claude Code Usage Monitor (terminal temps reel)
- Claudex (historique conversations)
- vibe-log (analyse prompts)

### Impact pour Foundation OS

Reservoir enorme d'outils et patterns. Les plus pertinents pour nous :
- **RTK** : compression tokens (critique)
- **cc-tools** : hooks Go haute performance
- **recall** : recherche dans les sessions passees
- **ccusage** : monitoring couts (on est pres des limites)
- **Context Engineering Kit** : optimisation contexte
- **Trail of Bits skills** : securite (si pertinent)
- **agnix** : linter pour nos fichiers agents/rules
- **claude-rules-doctor** : detection rules mortes
- **Ralph technique** : autonomie avec guardrails (a etudier)

---

## 9. Skills Design (Emil Kowalski, Impeccable, Taste-Skill)

### 9.1 Emil Kowalski Design Skill

**Source** : github.com/emilkowalski/skill
**Ce que ca fait** : enseigne a Claude les principes d'easing et de motion pour les interfaces
**Lien** : animations.dev (cours complet)
**Impact** : pertinent pour le Design System Void Glass quand on fera du motion design

### 9.2 Impeccable

**Source** : github.com/pbakaus/impeccable
**Ce que ca fait** : 18 commandes design pour typographie, contraste couleur, layout, spacing
**Commandes cles** :
- `/audit` : check qualite technique
- `/critique` : review UX design
- `/polish` : passe finale avant shipping (alignement DS + production readiness)
- `/distill` : simplification
- `/animate` : motion
- `/colorize` : couleur strategique
- `/typeset` : corrections typographiques
- `/layout` : spacing/rythme
- `/adapt` : adaptation devices

**7 fichiers de reference** : typographie, couleur/contraste, spatial, motion, interaction, responsive, UX writing
**Anti-patterns explicites** : eviter polices surutilisees, gris sur fond couleur, noir pur, cartes imbriquees, easings dates
**Impact** : directement applicable a notre DS Void Glass. Les commandes /audit, /polish, /critique sont alignees avec nos skills audit-ux-complet et ui-expert.

### 9.3 Taste-Skill

**Source** : github.com/Leonxlnx/taste-skill
**Ce que ca fait** : fournit des references de design reelles pour que Claude arrete de generer des sites generiques
**7 skills specialises** :
1. taste-skill (principal : layout, typo, couleurs, spacing, motion)
2. redesign-skill (audit + amelioration projets existants)
3. soft-skill (aesthetique premium, spring animations, whitespace)
4. output-skill (empeche code incomplet et commentaires placeholder)
5. minimalist-skill (interfaces editoriales type Notion/Linear)
6. brutalist-skill (esthetique brute mecanique, beta)
7. stitch-skill (compatible Google Stitch)

**3 parametres ajustables** (echelle 1-10) :
- Design Variance : experimentation layout
- Motion Intensity : complexite animations
- Visual Density : densite contenu/ecran

**Impact** : Le concept de "design variance" parametre est interessant pour notre DS. L'anti-repetition et les references reelles sont pertinents pour eviter le "design slop".

---

## 10. Ultraplan — Planification cloud Anthropic

### Source
Texte fourni par Kevin. Feature en research preview.

### Qu'est-ce que c'est

Feature Claude Code qui deplace la planification dans le cloud Anthropic (Cloud Container Runtime). Un agent Opus 4.6 analyse la codebase et genere un plan structure.

### Fonctionnement

1. **Snapshot** du repo synchronise vers le CCR
2. **Session cloud** : 30 min de compute avec Opus 4.6
3. **Planification** : analyse codebase, dependances, edge cases → plan structure avec sections commentables
4. **Review** : inline comments, emoji reactions, outline sidebar dans le navigateur
5. **Execution** : soit dans le cloud (web), soit teleportee dans le terminal

### 3 methodes de lancement

1. `/ultraplan <demande>`
2. Mot-cle "ultraplan" dans un prompt normal
3. Depuis un plan local → "refine with Ultraplan"

### Limitations

- Research preview (peut changer)
- 30 min max par session
- GitHub uniquement (pas GitLab/Bitbucket)
- Deconnecte Remote Control

### Impact pour Foundation OS

- Potentiellement utile pour les plans complexes (notre /plan-os est local)
- La review collaborative dans le navigateur est un plus
- Le snapshot du repo est pratique
- A surveiller quand ca sortira de preview
- Prerequis : Claude Code on the web actif + repo GitHub connecte

---

## 11. SummonAIKit [NON VERIFIE]

### Source
summonaikit.com — site bloque par le proxy reseau

### Ce qu'on sait
D'apres le lien partage, c'est un kit/bundle de configuration IA. Impossible d'evaluer le contenu sans acces au site. Probablement un produit commercial de templates/configurations.

**Status** : a investiguer manuellement par Kevin.

---

## 12. Mode "honnetete radicale"

### Source
Bloc de texte fourni par Kevin. Instructions pour ~/.claude/CLAUDE.md.

### 5 principes

1. **Verite avant confort** : pointer les failles immediatement, pas d'emballage
2. **Zero complaisance** : evaluer chaque argument sur sa solidite, pas sur qui le dit
3. **Detection d'angles morts** : chercher activement biais de confirmation, hypotheses cachees, alternatives ignorees
4. **Resistance active** : insister sur les points faibles jusqu'a correction ou justification solide
5. **Transparence sur l'incertitude** : dire quand on ne sait pas

### Impact pour Foundation OS

- Deja partiellement dans nos imperatifs ("ne jamais mentir", "zero bullshit")
- La formulation est plus directe et actionable
- "Detection d'angles morts" et "resistance active" sont des ajouts de valeur
- A integrer dans CLAUDE.md ou rules/

---

## 13. Synthese globale : ce qui apporte quoi

### Gains immediats (quick wins)

| Source | Apport | Effort | Impact |
|--------|--------|--------|--------|
| RTK | Compression tokens 60-90% | Faible (install + hook) | CRITIQUE — on est pres des limites |
| Rules path-scoped | Contexte plus propre, CLAUDE.md plus leger | Moyen (refactoring) | Eleve — meilleure adherence |
| Bash firewall hook | Securite deterministe | Faible (1 script) | Eleve — protection absolue |
| Auto-format hook | Code toujours formatte | Faible (1 script) | Moyen — qualite constante |
| Test enforcement Stop | Jamais "done" sans tests | Faible (1 script) | Eleve — anti-bullshit deterministe |
| Hot cache (hot.md) | Reprise session instantanee | Faible (1 fichier + discipline) | Eleve — gain 5-15 min/session |
| Honnetete radicale | Meilleure detection erreurs | Trivial (texte) | Moyen — culture de verite |

### Gains moyen terme

| Source | Apport | Effort | Impact |
|--------|--------|--------|--------|
| Impeccable/Taste skills | Design non-generique | Faible (install) | Moyen — DS Void Glass |
| Emil animation skill | Motion design | Faible (install) | Moyen — DS Void Glass |
| ccusage/monitoring | Visibilite couts | Faible (install) | Moyen — pilotage budget |
| agnix + rules-doctor | Hygiene config | Faible (install) | Moyen — maintenance |
| Graphify | Comprehension codebase | Moyen (setup) | Moyen — quand projet grossit |

### Gains long terme (a evaluer)

| Source | Apport | Effort | Impact |
|--------|--------|--------|--------|
| Core (RedPlanetHQ) | Memoire auto-evolutive + contradictions | Eleve (infra) | Eleve — mais complexite |
| GSD-2 | Orchestration autonome multi-session | Eleve (integration) | Eleve — mais overkill pour solo |
| Paperclip | Multi-agents coordonnes | Eleve (infra) | Futur — Phase 5+ |
| Ultraplan | Planification cloud | Attente (preview) | Moyen — alternative a /plan-os |
| Pinecone archivage | Memoire infinie | Moyen (setup) | A evaluer quand notes > 500 |

### Ce qu'on a deja et qui est conforme

- Structure `.claude/` avec agents, commands, settings ✓
- CLAUDE.md a la racine ✓ (mais pourrait etre allege)
- Skills dans `.claude/skills/` ✓ (riche, 80+ skills)
- Agents avec protocole uniforme ✓
- Hooks de securite (PreToolUse) ✓ (mais pas de firewall bash, pas de Stop enforcement)
- Systeme de memoire a 4 tiers ✓ (mais sans hot cache ni gestion contradictions)
- Decoupage sessions courtes ✓ (imperatif anti-compactage)
- Imperatifs anti-bullshit ✓

### Ce qu'on n'a PAS et qui serait utile

1. **Rules path-scoped** : zero fichier dans `.claude/rules/` actuellement
2. **Bash firewall hook** : pas de blocage deterministe des commandes dangereuses
3. **Auto-format hook (PostToolUse)** : pas de formatage automatique
4. **Test enforcement hook (Stop)** : Claude peut dire "done" sans tests
5. **Hot cache (hot.md)** : pas de resume compact de derniere session lu en priorite
6. **Deny list formalisee** dans settings.json
7. **Compression tokens** (RTK ou equivalent)
8. **Monitoring couts** en temps reel
9. **Gestion des contradictions** dans la memoire
10. **Detection de rules mortes** (agnix, rules-doctor)

### Points de vigilance

- **CLAUDE.md trop long** : le guide dit < 50L ideal, max 200L. Le notre fait ~120L. C'est acceptable mais optimisable.
- **Attention au bloat** : ajouter des outils sans reflexion = complexite sans valeur. Chaque ajout doit justifier sa place.
- **Infra complexity** : Core, Paperclip, GSD-2 ajoutent de l'infra lourde. Pour un projet solo, garder la simplicite.
- **Token economy** : RTK est probablement le gain le plus important rapport effort/impact vu nos contraintes.
- **Hot reload** : les hooks ne se rechargent pas a chaud. A prendre en compte pour le dev/debug.

---

## Annexe A : Liens sources

| # | Nom | URL complete | Status |
|---|-----|-----|--------|
| 1 | Guide .claude 24 parties | (texte inline, pas de lien) | Lu integralement |
| 2 | Pattern Karpathy/Obsidian | (texte inline, pas de lien) | Lu integralement |
| 3 | Core (RedPlanetHQ) | https://github.com/RedPlanetHQ/core | Fetch OK |
| 4 | Core docs Claude Code | https://docs.getcore.me/providers/claude-code | BLOQUE — a lire manuellement |
| 5 | Core docs Claude Desktop | https://docs.getcore.me/providers/claude | BLOQUE — a lire manuellement |
| 6 | Graphify | https://github.com/safishamsi/graphify | Fetch OK |
| 7 | RTK (Rust Token Killer) | https://github.com/rtk-ai/rtk | Fetch OK |
| 8 | GSD-2 (Get Shit Done v2) | https://github.com/gsd-build/gsd-2 | Fetch OK |
| 9 | Paperclip | https://github.com/paperclipai/paperclip | Fetch OK |
| 10 | Awesome Claude Code | https://github.com/hesreallyhim/awesome-claude-code | Fetch OK |
| 11 | Emil Kowalski Design Skill | https://github.com/emilkowalski/skill | Fetch OK |
| 12 | Impeccable | https://github.com/pbakaus/impeccable | Fetch OK |
| 13 | Taste-Skill | https://github.com/Leonxlnx/taste-skill | Fetch OK |
| 14 | SummonAIKit | https://summonaikit.com | BLOQUE — a verifier manuellement |
| 15 | Ultraplan | (texte inline, feature Anthropic) | Lu integralement |
| 16 | Honnetete radicale | (texte inline, pas de lien) | Lu integralement |

### Repos supplementaires mentionnes dans Awesome Claude Code (les plus pertinents)

| Nom | URL complete | Categorie |
|-----|-----|-----------|
| Superpowers | https://github.com/obra/superpowers | Skills SDLC (deja installe) |
| Trail of Bits Security | https://github.com/trailofbits/skills | Skills securite |
| Context Engineering Kit | https://github.com/NeoLabHQ/context-engineering-kit | Optimisation contexte |
| Compound Engineering | https://github.com/EveryInc/compound-engineering-plugin | Apprentissage erreurs |
| Everything Claude Code | https://github.com/affaan-m/everything-claude-code | Patterns exemplaires |
| AgentSys | https://github.com/avifenesh/agentsys | Workflow automation |
| cc-tools | https://github.com/Veraticus/cc-tools | Hooks Go haute perf |
| claudekit | https://github.com/carlrannaberg/claudekit | 20+ subagents + checkpointing |
| recall | https://github.com/zippoxer/recall | Recherche full-text sessions |
| ccusage | https://github.com/ryoppippi/ccusage | Monitoring couts CLI |
| ccflare | https://github.com/snipeship/ccflare | Dashboard couts web |
| Claude Squad | https://github.com/smtg-ai/claude-squad | Multi-agents terminal |
| Claude Swarm | https://github.com/parruda/claude-swarm | Swarm d'agents |
| Container Use (Dagger) | https://github.com/dagger/container-use | Environnements isoles |
| SuperClaude | https://github.com/SuperClaude-Org/SuperClaude_Framework | Framework config |
| agnix | https://github.com/agent-sh/agnix | Linter fichiers agent |
| claude-rules-doctor | https://github.com/nulone/claude-rules-doctor | Detection rules mortes |
| Auto-Claude | https://github.com/AndyMik90/Auto-Claude | SDLC autonome + kanban |
| Claude Code Flow | https://github.com/ruvnet/claude-code-flow | Cycles autonomes |
| Claude Task Master | https://github.com/eyaltoledano/claude-task-master | Gestion taches |
| Ruflo | https://github.com/ruvnet/ruflo | Swarms + memoire vectorielle |
| RIPER Workflow | https://github.com/tony/claude-code-riper-5 | Workflow 5 phases |
| AB Method | https://github.com/ayoubben18/ab-method | Spec-driven missions |
| Claude Code PM | https://github.com/automazeio/ccpm | Project management |
| Simone | https://github.com/Helmi/claude-simone | Project management |
| Ralph Playbook | https://github.com/ClaytonFarr/ralph-playbook | Technique Ralph autonome |
| Claude Session Restore | https://github.com/ZENG3LD/claude-session-restore | Restauration sessions |
| vibe-log | https://github.com/vibe-log/vibe-log-cli | Analyse prompts |
| Claude Code Docs Mirror | https://github.com/ericbuess/claude-code-docs | Docs a jour |
| Claude Code System Prompts | https://github.com/Piebald-AI/claude-code-system-prompts | System prompts par version |
| ContextKit | https://github.com/FlineDev/ContextKit | Framework dev 4 phases |
| ClaudeCTX | https://github.com/foxj77/claudectx | Switch config CLI |

## Annexe B : Etat actuel Foundation OS (resume pour comparatif)

- **CLAUDE.md** : ~120 lignes, contient imperatifs, stack, regles, garde-fous, routing, structure, build, agents, commands, references
- **CONTEXT.md** : source de verite operationnelle, ~138 lignes, modules, sessions, cap, decisions, metriques
- **Memoire** : 4 tiers (Session/Contexte/Reference/Auto-memory), spec docs/core/communication.md
- **Hooks** : validate-void-glass (PreToolUse), security-reminder.py (PreToolUse), pre-commit, commit-msg
- **Agents** : 4 (os-architect, dev-agent, doc-agent, review-agent)
- **Commands** : /cockpit, /session-start, /session-end, /plan-os, /new-project, /sync
- **Skills** : 80+ dans Cowork (non branches au CLI)
- **Rules path-scoped** : aucune
- **settings.json** : existe mais deny list non formalisee
- **Auto-memory Cowork** : /sessions/.auto-memory/ (auto-gere)
- **Compression tokens** : aucune
- **Monitoring couts** : aucun
- **Hot cache** : aucun
