# Foundation OS — Toolbox

> Auto-genere le 2026-04-10 depuis registry/*.json. Ne pas editer manuellement.

## Resume

| Categorie | Nombre |
|-----------|--------|
| agents | 4 |
| ci | 2 |
| commands | 5 |
| hooks | 4 |
| mcp | 13 |
| scripts | 6 |
| skills-bmad | 12 |
| skills-omc | 36 |
| skills-superpowers | 14 |
| **Total** | **96** |

## Agents

| Outil | Description | Usage |
|-------|-------------|-------|
| Dev Agent | Agent developpement — code React/Vite/TypeScript, composants Void Glas | `Delegation automatique via Cortex ou invocation directe via Agent tool` |
| OS Architect | Architecte Foundation OS — decisions de stack, structure modules, sche | `Delegation automatique via Cortex ou invocation directe via Agent tool` |
| Review Agent | Agent revue — coherence, audit, zero regression. Execute health-check  | `Delegation automatique via Cortex ou invocation directe via Agent tool` |
| Doc Agent | Agent documentation — mise a jour CONTEXT.md, docs/, modules/app/data/ | `Delegation automatique via Cortex ou invocation directe via Agent tool` |

## Ci

| Outil | Description | Usage |
|-------|-------------|-------|
| Vercel Auto-Deploy | Deploy automatique sur Vercel a chaque push sur main. Root dir = modul | `git push origin main` |
| Supabase Ping | Cron hebdomadaire GitHub Actions qui execute SELECT 1 sur Supabase pou | `Automatique (GitHub Actions cron hebdo)` |

## Commands

| Outil | Description | Usage |
|-------|-------------|-------|
| /cockpit | Point d'entree unique TDAH-friendly : scan parallele (CONTEXT + git +  | `/cockpit` |
| /session-start | Brief de debut de session au format v11 TDAH-friendly : collecte paral | `/session-start` |
| /session-end | Cloture de session : inventaire git diff → verification coherence + bu | `/session-end` |
| /sync | Audit complet de coherence : lance sync-check.sh qui execute health-ch | `/sync` |
| /new-project | Scaffold un nouveau module : lance module-scaffold.sh qui cree modules | `/new-project <nom-module>` |

## Hooks

| Outil | Description | Usage |
|-------|-------------|-------|
| Void Glass Validator | Hook PreToolUse Claude — bloque l'ecriture de couleurs interdites et f | `Automatique via .claude/settings.json PreToolUse sur Write/Edit/MultiEdit` |
| Security Reminder | Hook PreToolUse Claude — detecte 9 patterns de code dangereux (OWASP t | `Automatique via .claude/settings.json PreToolUse sur Write/Edit/MultiEdit` |
| Commit Message Validator | Hook git commit-msg — enforce le format conventional commits (type(sco | `Automatique a chaque git commit. Install : cp scripts/git-hooks/commit-msg .git/hooks/commit-msg` |
| Pre-commit Health Gate | Hook git pre-commit — execute health-check.sh avant chaque commit. BRO | `Automatique a chaque git commit. Install : cp scripts/git-hooks/pre-commit .git/hooks/pre-commit` |

## Mcp

| Outil | Description | Usage |
|-------|-------------|-------|
| Asana | Gestion de projets et taches Asana — creer/lire/modifier des taches, p | `Automatique via MCP. Actions : get_tasks, create_task, update_tasks, search_objects, add_comment` |
| Notion | Lecture et ecriture dans Notion — pages, databases, commentaires, vues | `Automatique via MCP. Actions : notion-search, notion-fetch, notion-create-pages, notion-update-page` |
| Figma | Lecture de designs Figma, generation de code depuis designs, creation  | `Automatique via MCP quand URL Figma fournie. Actions : get_design_context, get_screenshot, generate_diagram` |
| Monday.com | Gestion de boards Monday.com — items, colonnes, updates, documents, da | `Automatique via MCP. Actions : get_board_info, create_item, search, create_doc` |
| Gmail | Acces Gmail — lire et envoyer des emails. Auth requise | `Automatique via MCP apres authentification` |
| Google Calendar | Acces Google Calendar — lire et creer des evenements. Auth requise | `Automatique via MCP apres authentification` |
| Slack | Acces Slack — lire et envoyer des messages. Auth requise | `Automatique via MCP apres authentification` |
| ClickUp | Gestion ClickUp — taches, listes, dossiers, documents, time tracking,  | `Automatique via MCP. Actions : clickup_create_task, clickup_filter_tasks, clickup_search` |
| Chrome DevTools | Controle Chrome via DevTools — navigation, clicks, screenshots, consol | `Automatique via MCP. Actions : navigate_page, take_screenshot, click, evaluate_script, lighthouse_audit` |
| Context7 | Documentation a jour pour libraries, frameworks, SDKs, APIs, CLIs. Pre | `Automatique via MCP. Actions : resolve-library-id, query-docs` |
| Pencil | Editeur pour fichiers .pen — generation et validation de designs web/m | `Automatique via MCP pour fichiers .pen. Actions : batch_design, batch_get, get_guidelines` |
| Computer Use | Controle du bureau — screenshots, clicks, clavier, scroll. Pour apps n | `Automatique via MCP. Actions : screenshot, left_click, type, scroll, open_application` |
| Neon Browser | Authentification Neon (base de donnees). Auth requise | `Automatique via MCP apres authentification` |

## Scripts

| Outil | Description | Usage |
|-------|-------------|-------|
| Health Check | Execute tous les indicateurs Monitor (build, TS, structure, tests, Voi | `bash scripts/health-check.sh` |
| Sync Check | Audit complet de coherence : health-check + modules vs CONTEXT.md + re | `bash scripts/sync-check.sh` |
| Ref Checker | Detecte les refs cassees dans tous les .md du repo : liens markdown [t | `bash scripts/ref-checker.sh` |
| Module Scaffold | Scaffold un nouveau module Foundation OS : cree modules/<nom>/{README. | `bash scripts/module-scaffold.sh <nom-module>` |
| Session Lock | Verrou local anti-collision entre Cowork Desktop et Claude Code CLI. F | `bash scripts/session-lock.sh <acquire/release/status/force> [head]` |
| Pre-commit Hook | Hook git pre-commit : execute health-check.sh, bloque le commit si BRO | `Automatique a chaque git commit. Install : cp scripts/git-hooks/pre-commit .git/hooks/pre-commit` |

## Skills-bmad

| Outil | Description | Usage |
|-------|-------------|-------|
| BMad Help | Analyse l'etat courant et la requete pour repondre aux questions BMad  | `Quand Kevin demande de l'aide BMad, 'what to do next', ou 'par ou commencer'` |
| BMad Brainstorming | Sessions de brainstorming interactives avec techniques creatives diver | `Quand Kevin dit 'help me brainstorm' ou 'help me ideate'` |
| BMad Advanced Elicitation | Pousse le LLM a reconsiderer et ameliorer son output recent. Methodes  | `Quand Kevin demande une critique approfondie ou mentionne une methode (socratique, red team, etc.)` |
| BMad Distillator | Compression lossless de documents optimisee pour LLM. Preserve chaque  | `Quand Kevin dit 'distill documents' ou 'create a distillate'` |
| BMad Editorial Review Prose | Copy-editor clinique qui review le texte pour les problemes de communi | `Quand Kevin dit 'review for prose' ou 'improve the prose'` |
| BMad Editorial Review Structure | Editeur structurel qui propose coupes, reorganisation, et simplificati | `Quand Kevin dit 'structural review' ou 'editorial review of structure'` |
| BMad Init | Initialise la config BMad et charge les variables de configuration mod | `Setup d'un nouveau projet BMad ou quand un skill a besoin de config` |
| BMad Party Mode | Orchestre des discussions de groupe entre tous les agents BMAD install | `Quand Kevin demande 'party mode'` |
| BMad Adversarial Review | Review cynique avec rapport de findings. Cherche les failles, inconsis | `Quand Kevin demande 'critical review' ou 'review cynique'` |
| BMad Edge Case Hunter | Parcourt chaque chemin de branchement et condition limite, rapporte un | `Quand on a besoin d'analyse exhaustive des edge cases sur du code, des specs, ou des diffs` |
| BMad Index Docs | Genere ou met a jour un index.md qui reference tous les docs dans un d | `Quand Kevin dit 'create index' ou 'update index of files'` |
| BMad Shard Doc | Decoupe un gros document markdown en fichiers plus petits organises pa | `Quand Kevin dit 'shard document' ou 'decouper le document'` |

## Skills-omc

| Outil | Description | Usage |
|-------|-------------|-------|
| Autopilot | Execution autonome complete : de l'idee au code fonctionnel. Brainstor | `/oh-my-claudecode:autopilot ou keyword 'autopilot'` |
| Ralph Loop | Boucle auto-referentielle jusqu'a completion de la tache avec verifica | `/oh-my-claudecode:ralph ou keyword 'ralph'` |
| Ultrawork | Moteur d'execution parallele pour completion de taches a haut debit. D | `/oh-my-claudecode:ultrawork ou keyword 'ulw'` |
| Team | N agents coordonnes sur une liste de taches partagee en mode equipe Cl | `/oh-my-claudecode:team` |
| Ralplan | Point d'entree consensus planning — bloque les demandes vagues ralph/a | `/oh-my-claudecode:ralplan ou keyword 'ralplan'` |
| Plan | Planning strategique avec workflow d'interview optionnel. Analyse, dec | `/oh-my-claudecode:plan` |
| UltraQA | Workflow de QA cyclique : test → verifie → fix → repete jusqu'a ce que | `/oh-my-claudecode:ultraqa` |
| Cancel | Annule tout mode d'execution actif (autopilot, ralph, ultrawork, team, | `/oh-my-claudecode:cancel ou keyword 'cancelomc'` |
| Deep Interview | Interview socratique approfondie avec gating mathematique d'ambiguite  | `/oh-my-claudecode:deep-interview ou keyword 'deep interview'` |
| Deep Dive | Pipeline 2 etapes : trace (investigation causale) → deep-interview (cr | `/oh-my-claudecode:deep-dive` |
| Trace | Tracing causal base sur des preuves — orchestre des hypotheses concurr | `/oh-my-claudecode:trace` |
| Debug | Diagnostique la session OMC ou l'etat du repo en utilisant logs, trace | `/oh-my-claudecode:debug` |
| Verify | Verifie qu'un changement fonctionne reellement avant de clamer complet | `/oh-my-claudecode:verify` |
| AI Slop Cleaner | Nettoie le code genere par IA (slop) avec un workflow deletion-first s | `/oh-my-claudecode:ai-slop-cleaner ou keyword 'deslop' ou 'anti-slop'` |
| CCG (Claude-Codex-Gemini) | Orchestration tri-modele : envoie la question a Codex et Gemini via /a | `/oh-my-claudecode:ccg ou keyword 'ccg'` |
| SciOMC | Orchestre des agents scientifiques en parallele pour analyse comprehen | `/oh-my-claudecode:sciomc` |
| External Context | Invoque des agents document-specialist en parallele pour recherches we | `/oh-my-claudecode:external-context` |
| Self Improve | Moteur d'amelioration de code evolutif autonome avec selection par tou | `/oh-my-claudecode:self-improve` |
| Skillify | Transforme un workflow repetitif de la session courante en un skill OM | `/oh-my-claudecode:skillify` |
| Learner | Extrait un skill appris de la conversation courante | `/oh-my-claudecode:learner` |
| Remember | Revue des connaissances projet reutilisables — decide ce qui va en pro | `/oh-my-claudecode:remember` |
| Deep Init | Initialisation profonde de codebase avec documentation hierarchique AG | `/oh-my-claudecode:deepinit` |
| Visual Verdict | QA visuelle structuree — verdict pour comparaisons screenshot vs refer | `/oh-my-claudecode:visual-verdict` |
| HUD | Configure les options d'affichage du HUD OMC (layout, presets, element | `/oh-my-claudecode:hud` |
| Project Session Manager | Gestionnaire d'environnement dev worktree-first pour issues, PRs, et f | `/oh-my-claudecode:project-session-manager` |
| Ask | Routeur process-first pour Claude, Codex, ou Gemini via omc ask, avec  | `/oh-my-claudecode:ask` |
| Skill Manager | Gestion des skills locales — lister, ajouter, supprimer, chercher, edi | `/oh-my-claudecode:skill` |
| OMC Reference | Catalogue d'agents OMC, outils disponibles, routing pipeline equipe, p | `/oh-my-claudecode:omc-reference` |
| OMC Setup | Installe ou rafraichit oh-my-claudecode pour plugin, npm, et local-dev | `/oh-my-claudecode:omc-setup` |
| OMC Doctor | Diagnostique et corrige les problemes d'installation OMC | `/oh-my-claudecode:omc-doctor` |
| Writer Memory | Systeme de memoire agentique pour ecrivains — suivi personnages, relat | `/oh-my-claudecode:writer-memory` |
| Release | Workflow de release automatise pour oh-my-claudecode | `/oh-my-claudecode:release` |
| Configure Notifications | Configure les integrations de notification (Telegram, Discord, Slack)  | `/oh-my-claudecode:configure-notifications` |
| MCP Setup | Configure les serveurs MCP populaires pour des capacites d'agent ameli | `/oh-my-claudecode:mcp-setup` |
| OMC Teams | Runtime CLI-team pour workers claude, codex, ou gemini dans des panes  | `/oh-my-claudecode:omc-teams` |
| Setup | Routeur principal de setup — redirige vers le bon flow OMC (install, d | `/oh-my-claudecode:setup` |

## Skills-superpowers

| Outil | Description | Usage |
|-------|-------------|-------|
| Brainstorming | Transforme une idee en design valide via dialogue collaboratif : explo | `/superpowers:brainstorming ou invocation automatique avant tout travail creatif` |
| Writing Plans | Ecrit un plan d'implementation detaille avec taches bite-sized (2-5 mi | `/superpowers:writing-plans — invoque automatiquement apres brainstorming` |
| Executing Plans | Execute un plan tache par tache en inline : charge le plan, review cri | `/superpowers:executing-plans` |
| Subagent-Driven Development | Execute un plan en dispatchant un agent frais par tache avec review en | `/superpowers:subagent-driven-development` |
| Systematic Debugging | Debuggage systematique : reproduire → hypotheses → tester → isoler → f | `/superpowers:systematic-debugging ou invocation automatique face a un bug` |
| Test-Driven Development | TDD strict : ecrire le test d'abord → verifier qu'il fail → implemente | `/superpowers:test-driven-development ou keyword 'tdd'` |
| Verification Before Completion | Verification obligatoire avant de clamer completion : executer les com | `Invocation automatique avant de dire 'termine' ou 'ca marche'` |
| Using Git Worktrees | Cree des worktrees git isoles pour travailler sur des features sans im | `/superpowers:using-git-worktrees` |
| Finishing a Development Branch | Guide la completion d'une branche de dev : options structurees pour me | `/superpowers:finishing-a-development-branch` |
| Requesting Code Review | Demande de code review pour verifier que le travail repond aux require | `/superpowers:requesting-code-review` |
| Receiving Code Review | Traitement rigoureux du feedback de code review — verification techniq | `/superpowers:receiving-code-review` |
| Dispatching Parallel Agents | Dispatche 2+ taches independantes en parallele via subagents quand il  | `/superpowers:dispatching-parallel-agents` |
| Writing Skills | Creation, edition, et verification de skills Superpowers avant deploie | `/superpowers:writing-skills` |
| Using Superpowers | Skill d'introduction — etablit comment trouver et utiliser les skills, | `Auto-charge en debut de session` |

