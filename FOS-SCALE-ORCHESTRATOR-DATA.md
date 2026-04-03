# FOS-SCALE-ORCHESTRATOR-DATA.md
> Source de vérité — fos-scale-orchestrator.jsx
> DATA_VERSION : 3.5.0 · LAST_SYNC : 2026-04-03
> STORAGE_KEY  : fondation-scale-v3
> PIPELINE     : Option D (Hybrid) ← validé CONV-10

---

## DÉCISIONS PRISES

| Décision | Valeur | Date |
|----------|--------|------|
| Pipeline | Option D — Hybrid | 2026-04-03 |
| Task manager | Asana | 2026-04-03 |
| Architecture artifacts | 6 fos-* | 2026-04-03 |
| Multi-agent | oh-my-claudecode | 2026-04-03 |

---

## STEPS — 22 étapes guidées

### P0 — Claude fait maintenant (pas de terminal requis)

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e01 | Créer wiki Notion Foundation OS | Claude (MCP) | L4 |
| e02 | Créer projet Asana + 22 tâches | Claude (MCP) | L4 |
| e03 | Générer tous les fichiers Claude Code | Claude | L2 |

e01 · Comment faire :
Dire à Claude dans ce chat : "Crée le wiki Notion Foundation OS"
Claude utilise MCP Notion pour créer page root + sous-pages ADR, Sessions, Décisions, Garde-fous, Stack, Architecture, Roadmap. Migration des 6 ADR.
Validation : pages visibles dans Notion workspace.
Débloque : documentation vivante cross-device, ADR permanents.

e02 · Comment faire :
Dire à Claude : "Crée le projet Asana Foundation OS Setup"
Claude utilise MCP Asana pour créer projet + 22 tâches (e01→e22) + priorités + sections par phase.
Validation : projet visible dans Asana, tâches assignées.
Débloque : suivi de l'avancement hors chat.

e03 · Comment faire :
Tous les fichiers ont été créés (CONV-10). À déployer lors de e10.
Fichiers racine produits :
  CLAUDE.md ✅ · project-context.md ✅ · FOS-TECH-ARCHITECTURE.md ✅ · FOS-ERROR-LOG.md ✅
  FOS-MONITORING.md ✅ · FOS-JOURNAL.md ✅ · FOS-SETUP-GUIDE.md ✅ · FOS-MANIFESTE.md ✅
  FOS-PROJECT-INSTRUCTIONS.md ✅ · FOS-SKILL-ORCHESTRATOR.md ✅ · SKILL.md ✅ (Cowork folder skill)
Fichiers .claude/ (contenu à créer lors de e10) :
  .claude/settings.json · agents/ (4 agents) · commands/ (4 commands)
Validation : fichiers cohérents avec architecture Foundation OS.
Débloque : Claude Code prêt dès que tu déploies.

---

### P1 — L1 Setup : Claude.ai Projects + Cowork desktop (Kévin, ~1h)

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e04 | Créer projet Claude.ai "Foundation OS" (L1a) | Kévin | L1a |
| e04b | Configurer Cowork desktop sur foundation-os/ (L1b) | Kévin | L1b |
| e05 | Configurer Project Instructions (L1a) | Kévin | L1a |
| e06 | Uploader ~20 MD en Knowledge base (L1a) | Kévin | L1a |
| e07 | Valider L1a + L1b opérationnels | Kévin+Claude | L1 |

e04 · Comment faire :
⚡ Note Cowork : si tu utilises Claude Desktop → ouvre-le, va dans l'onglet "Cowork", pointe sur ton dossier foundation-os/ après e09. Ça sera L1b. Ce step e04 reste pour L1a (Knowledge base cross-device).
1. Aller sur claude.ai
2. Sidebar gauche → "New Project"
3. Nom : Foundation OS · Description : OS de travail IA-driven · Coopération Claude/Kévin
4. Créer le projet
Validation : projet visible dans la sidebar.
Débloque : contexte permanent entre sessions, Knowledge base.


e04b · Comment faire :
1. Ouvrir Claude Desktop App → onglet "Cowork" (à côté de Chat et Code)
   Si absent → télécharger sur claude.ai/download (inclus dans Max)
2. Cliquer "Work in a folder" → sélectionner ton dossier de travail actuel (là où sont les FOS-*.md)
   Après e09 → re-pointer vers foundation-os/
3. SKILL.md est déjà dans ton dossier FOS-*.md → Cowork le lit automatiquement (rien à coller)
   Si tu veux des instructions custom supplémentaires → Settings → Folder instructions
4. Test : "liste les fichiers FOS-* dans ce dossier et dis-moi l'état du projet"
Validation : Cowork affiche les fichiers et répond avec le contexte Foundation OS.
Débloque : agent local qui peut lire/écrire tes MDs directement · tâches autonomes · MCP depuis desktop.
Note : différent de Claude.ai Projects (L1a) — Cowork travaille en LOCAL sur tes fichiers.
e05 · Comment faire :
1. Dans le projet Foundation OS → icône Settings
2. Section "Instructions" ou "Project Instructions"
3. Coller le contenu de FOS-PROJECT-INSTRUCTIONS.md (produit en e03)
4. Sauvegarder
Validation : ouvrir une conv dans le projet → Claude répond avec le bon contexte sans re-brief.
Débloque : Claude connaît Foundation OS à chaque message.

e06 · Comment faire :
Dans le projet → "Knowledge" → uploader dans cet ordre de priorité :
P1 Orchestration : FOS-SETUP-GUIDE.md · FOS-SCALE-ORCHESTRATOR-DATA.md · FOS-MONITORING.md · FOS-JOURNAL.md
P2 Architecture  : FOS-ARCHITECTURE-ANALYSIS.md · FOS-META-PLAN.md · project-context.md · FOS-TECH-ARCHITECTURE.md
P3 Données       : FOS-COMMANDER-DATA.md · FOS-KNOWLEDGE-DATA.md
P4 Références    : FOS-SKILL-ORCHESTRATOR.md · FOS-MANIFESTE.md · FOS-ERROR-LOG.md
P5 Suppléments   : DA-FONDATION.md · DA-BOILERPLATE.md · FONDATION_FRAMEWORKS.md · PIPELINE.md · SKILLS-MAP.md (~20 fichiers total)
Validation : demander "résume FOS-ARCHITECTURE-ANALYSIS.md" → Claude répond sans upload.
Débloque : mémoire long terme complète.

e07 · Comment faire :
1. Ouvrir une NOUVELLE conversation dans le projet
2. Demander : "quel est l'état de Foundation OS ?"
3. Claude doit répondre avec contexte complet (phases, stack, artifacts)
4. Si incomplet → vérifier que les instructions + knowledge sont bien configurés
Validation : réponse contextualisée sans avoir tout collé manuellement.
Débloque : L1 opérationnel.

---

### P2 — Claude Code L2 (Kévin terminal, ~1h30)

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e08 | Installer Node.js + Claude Code CLI | Kévin | L2 |
| e09 | Init repo GitHub foundation-os | Kévin | L2 |
| e10 | Déployer fichiers .claude/ (générés en e03) | Kévin | L2 |
| e11 | Installer oh-my-claudecode | Kévin | L2 |
| e12 | Valider Claude Code end-to-end | Kévin | L2 |

e08 · Comment faire :
node --version (doit être ≥ 18 · si absent : brew install node)
npm install -g @anthropic-ai/claude-code
claude --version
claude login (ouvre browser, connecter compte Anthropic)
Validation : claude --version affiche la version.
Débloque : base Claude Code installée.

e09 · Comment faire :
mkdir foundation-os && cd foundation-os
git init
echo "# Foundation OS" > README.md
git add . && git commit -m "init: Foundation OS"
brew install gh (si absent)
gh repo create foundation-os --private --source=. --push
Validation : repo visible sur github.com.
Débloque : base git pour l'OS.

e10 · Comment faire :
mkdir -p .claude/agents .claude/commands
(Copier les fichiers générés en e03 dans .claude/)
Créer dans foundation-os/ : CLAUDE.md · project-context.md · FOS-TECH-ARCHITECTURE.md · FOS-ERROR-LOG.md
git add . && git commit -m "chore: add Claude Code config"
Validation : ls .claude/ → agents/ commands/ settings.json visibles.
Débloque : Claude Code contextualise Foundation OS.

e11 · Comment faire :
cd foundation-os && claude .
Dans Claude Code :
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
/oh-my-claudecode:omc-setup
Validation : taper "autopilot: list files" → oh-my-claudecode répond.
Débloque : 32 agents · multi-agent parallèle · 3-5× vitesse.

e12 · Comment faire :
Dans claude . :
/session-start → vérifier que le workflow s'exécute
@doc-agent : bonjour → persona doc actif
/bmad-help → si BMAD installé : workflows disponibles
Validation : session cohérente du début à la fin.
Débloque : L2 opérationnel.

---

### P3 — BMAD L3 (Kévin terminal, ~20min)

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e13 | Installer BMAD v6 | Kévin | L3 |
| e14 | Valider BMAD avec project-context.md | Kévin+Claude | L3 |

e13 · Comment faire :
cd foundation-os
npx bmad-method install
→ IDE : Claude Code
→ Agents : Analyst + Architect + Dev + QA (minimum)
→ Full install
ATTENTION : dossier = _bmad/ (underscore, PAS .bmad/)
Structure BMAD v6 : agents distribués dans _bmad/core/bmad-distillator/agents/ (structure modulaire)
ls _bmad/core/bmad-distillator/agents/ → vérifier les agents
ls _bmad/core/ → modules BMAD (bmad-distillator, bmad-init, bmad-party-mode, etc.)
Validation : agents visibles dans _bmad/core/bmad-distillator/agents/, modules dans _bmad/core/.
Débloque : 8 agents spécialisés · PRD → Architecture → Stories → Dev.

e14 · Comment faire :
Dans claude . :
@analyst : "Présente Foundation OS en te basant sur project-context.md"
L'agent doit répondre avec contexte Foundation OS complet
/bmad-help → guidance disponible
Validation : l'agent Analyst connaît le projet sans re-brief.
Débloque : L3 opérationnel.

---

### P4 — MCP L4 validation (Kévin, ~15min)

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e15 | Valider Notion + Asana (créés en P0) | Kévin | L4 |
| e16 | Valider workflow MCP complet | Kévin+Claude | L4 |

e15 · Comment faire :
Ouvrir Notion → vérifier que les pages Foundation OS sont bien là
Ouvrir Asana → vérifier que les 22 tâches sont présentes
Dans claude.ai : demander "liste mes tâches Asana non faites" → Claude doit répondre via MCP
Validation : Claude peut lire/écrire dans Notion et Asana depuis le chat.
Débloque : L4 opérationnel.

e16 · Comment faire :
Test complet : ajouter une session dans Notion via Claude
Test complet : marquer une tâche Asana via Claude
Validation : les modifications sont visibles dans les outils.
Débloque : documentation et tâches sans quitter le chat.

---

### P5 — Foundation OS App — Option D (Claude Code + Kévin, ~2h)
> Stack : Vite + React + TypeScript + Tailwind + Supabase (free) + Vercel (free) · GitHub auto-deploy

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e17 | Scaffold Foundation OS App | Claude Code | APP |
| e18 | Setup Supabase (DB + auth + API) | Kévin | APP |
| e19 | Deploy Vercel (URL permanente) | Kévin | APP |
| e20 | Build page Commander (base) | Claude Code + OMC | APP |

e17 · Comment faire :
Dans claude . :
autopilot: scaffold une app React + Vite + TypeScript + Tailwind dans foundation-os/app/
Structure cible : src/components (Void Glass) · src/pages · src/lib (supabase.ts) · src/styles
Validation : npm run dev → app tourne en local sur localhost:5173.
Débloque : base de la vraie Foundation OS App.

e18 · Comment faire :
1. Aller sur supabase.com → New Project
2. Nom : foundation-os · Region : West EU (Paris)
3. Copier SUPABASE_URL + SUPABASE_ANON_KEY
4. Créer foundation-os/app/.env.local :
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
5. Dans claude . : "crée le schéma DB Foundation OS avec Supabase"
   Tables : sessions · decisions · risks · docs · contextBlocks · nextSteps
   Utiliser supabase-js SDK depuis React (pas de backend custom nécessaire)
Validation : npm run dev → connexion Supabase active. Tables dans le dashboard Supabase.
Débloque : DB réelle cross-device. Auth incluse pour plus tard. SDK JavaScript direct.
Note : free tier — projet pausé si 7j inactif. Solution : GitHub Actions cron ping hebdo.

e19 · Comment faire :
1. Aller sur vercel.com → New Project → importer foundation-os depuis GitHub
2. Framework preset : Vite
3. Ajouter variables d'environnement :
   VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
4. Deploy → URL générée (ex: foundation-os.vercel.app)
5. Bookmark l'URL Vercel
Validation : URL accessible depuis mobile/autre PC. git push = deploy automatique.
Débloque : URL permanente · cross-device · plus de limite d'artifacts.

e20 · Comment faire :
Dans claude . :
team "construire la page Commander avec Void Glass, connectée à Supabase via supabase-js"
oh-my-claudecode lance 3 agents en parallèle (ui, db, test)
git push → deploy Vercel automatique
Validation : page Commander fonctionnelle sur l'URL Vercel.
Débloque : premier module de la vraie Foundation OS App.

---

### P6 — Consolidation artifacts (Claude, ~3 sessions)

| ID | Label | Qui | Tag |
|----|-------|-----|-----|
| e21 | fos-graph.jsx + FOS-GRAPH-DATA.md | Claude | ARTIFACT |
| e22 | fos-sync.jsx + FOS-SYNC-DATA.md | Claude | ARTIFACT |

e21 · Comment faire :
Dire à Claude dans ce chat : "Produis fos-graph.jsx"
Claude construit l'artifact (graphe SVG interactif + audit) + son MD pair
Upload dans le projet Claude.ai
Validation : artifact sous 700L · graphe SVG fonctionnel · MD pair cohérent.

e22 · Comment faire :
Dire à Claude dans ce chat : "Produis fos-sync.jsx"
Claude construit l'artifact (Cowork tracker + DA + overlaps) + son MD pair
Validation : artifact sous 700L · DA compliance et overlaps visibles.

---

## STACK COMPLÈTE

L0  Void Glass DS       → tokens · composants · Figma spec                               ✅
L1a Claude.ai Projects  → KB ~20 MD · FOS-PROJECT-INSTRUCTIONS.md · web/mobile cross-device ⏳ P1
L1b Cowork desktop      → agent local · SKILL.md auto-chargé · MCP · tâches planifiées     ⏳ P1
L2  Claude Code         → CLAUDE.md ≤100L · hooks · agents · oh-my-claudecode (team)        ⏳ P2
    + project-context.md · FOS-TECH-ARCHITECTURE.md · FOS-ERROR-LOG.md
L3  BMAD v6             → _bmad/ (UNDERSCORE!) · 8 agents · project-context.md             ⏳ P3
L4  MCP                 → Notion ✅ · Asana ✅ · Figma                                       ✅/⏳
L5  Foundation OS App   → Vite + React + TypeScript + Tailwind + Supabase + Vercel          ⏳ 60%
L6  GitHub              → foundation-os repo (privé) · conventional commits · CI/CD         ✅ repo

---

## ARTIFACTS JSX STATUS

fos-commander.jsx         ✅ livré — 364L — FOS-COMMANDER-DATA.md ✓
fos-knowledge.jsx         ✅ livré — 448L — FOS-KNOWLEDGE-DATA.md ✓
fos-scale-orchestrator.jsx ✅ livré — 558L — FOS-SCALE-ORCHESTRATOR-DATA.md ✓
fos-index.jsx             ✅ livré — 431L — FOS-INDEX-DATA.md ✓
fos-graph.jsx             ⏳ P6-e21 — FOS-GRAPH-DATA.md (à créer)
fos-sync.jsx              ⏳ P6-e22 — FOS-SYNC-DATA.md (à créer)
fos-pipeline.jsx          ⏳ P6     — FOS-PIPELINE-DATA.md (à créer)

---

## CHANGELOG

v1.0.0 · 2026-04-03 · Création initiale
v2.0.0 · 2026-04-03 · Guide étapes v2
v3.0.0 · 2026-04-03 · Option D · oh-my-claudecode · P0 Claude maintenant · Foundation OS App · 22 steps
v3.1.0 · 2026-04-03 · Stack L5 : Vercel + Supabase (décision finale)
v3.2.0 · 2026-04-03 · Audit complet · 10 fichiers MD créés · e03 et e06 mis à jour · ordre upload Cowork
v3.3.0 · 2026-04-03 · OMC : team (pas team 3:executor) · ultrapilot supprimé · archives supprimées · alignment protocol
v3.4.0 · 2026-04-03 · L1 split L1a+L1b · Cowork distinct de Projects · e04b ajouté · ADR-012
v3.5.0 · 2026-04-03 · Stack L0-L6 notation unifiée · fos-scale-orchestrator.jsx ✅ dans ARTIFACTS · SKILL.md ajouté · e04b instructions clarifiées
v3.6.0 · 2026-04-03 · AUDIT RÉEL : fos-index.jsx ✅ 431L · L2/L3/L5 installés · app/ scaffoldée · tracking synchronisé avec filesystem
