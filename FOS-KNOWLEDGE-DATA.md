# FOS-KNOWLEDGE-DATA.md
> Source de vérité — fos-knowledge.jsx
> Règle absolue : modifier CE fichier EN PREMIER, puis syncer le JSX.

```
DATA_VERSION : 1.0.0
LAST_SYNC    : 2026-04-03
STORAGE_KEY  : — (artifact statique, pas de storage requis)
JSX_CTRL     : fos-knowledge.jsx
```

---

## MANIFESTE

### Vision long terme
Créer une fondation pour aider le monde — une structure pérenne, financée par ses propres produits, dédiée à l'impact positif. Le long terme finance le court terme. La crédibilité technique précède la mission.

### Vision court terme
Un core + un OS + un workflow — construire le socle technique : un moteur (core), un système opérationnel (OS), et un pipeline de création (design → app). Le moteur qui rendra la fondation possible.

### Mode opératoire
Coopération humain-IA, pas exploitation. Respect mutuel comme base de travail. Claude accompagne, Kévin décide.

### Principes fondateurs
- Coopération — humain-IA en mode collaboratif
- Traçabilité — chaque action journalisée, chaque décision documentée
- Évolutivité — rien n'est gravé dans le marbre, tout peut être itéré
- Garde-fous — doute → question avant action

---

## JOURNAL HISTORIQUE (16 actions)

1. CONV-01 — Déclaration d'intention : coopération > exploitation
2. CONV-01 — Vision posée : LT = fondation mondiale, CT = core/OS/workflow
3. CONV-01 — Cadrage Phase 0 : traçabilité, historique, garde-fous, mémoire adaptative
4. CONV-01 — Frameworks identifiés : Claudify + BMAD analysés, stratégie hybride définie
5. CONV-01 — FONDATION_v0.md créé — racine de tout
6. CONV-03 — Technique Claude : instructions live reload, memories périodiques, contexte 200K tokens
7. CONV-02 — Skills mapping : 23 skills, 8 phases pipeline, 12 fichiers MD (pour KB Projects)
8. CONV-02 — Pipeline dashboard : ios-pipeline-dashboard.jsx + conversation-control.jsx
9. CONV-06 — Monitoring dashboard : fondation-monitor.jsx + FOS-MONITORING.md
10. CONV-04 — DA Void Glass : DA-PIPELINE-EXTRACT.md + DA-VOID-GLASS-CANONICAL.md
11. CONV-09 — Index projet : project-index-dashboard.jsx + DA-FOS-MANIFESTE.md + DA-BOILERPLATE.md
12. CONV-05 — Idéation structure : 3 layers Core/OS → Méthode → Projets identifiés
13. CONV-08 — Frameworks setup : FONDATION_FRAMEWORKS.md — 4 couches L1→L4, 7 étapes
14. CONV-07 — Centre communication : centre-communication.jsx + graphe SVG dépendances
15. CONV-09 — Fondation viewer : fondation_viewer.jsx — DA Pipeline, 5 onglets, CTA IA
16. CONV-10 — Architecture Foundation OS : analyse exhaustive 10 artifacts → 6 artifacts fos-*

---

## FRAMEWORKS COMPARISON

### BMAD v6
- Framework multi-agents agile
- 8 agents : Analyst (Mary), PM (John), UX (Sally), Architect (Winston), SM (Bob), Dev (Amelia), QA (Quinn), Quick Flow (Barry)
- 4 phases : Analysis → Planning → Solutioning → Implementation
- _bmad/ directory (underscore, pas dot — BREAKING CHANGE v6, LLMs ignorent les dot-folders)
- project-context.md = constitution du projet (chargée automatiquement)
- Agent sidecars = mémoire persistante par agent
- 34+ workflows avec input/output contracts
- /bmad-help pour guidance à tout moment
- Commande stable : `npx bmad-method install`

### Claudify
- Ressource / blog sur les workflows Claude Code
- CLAUDE.md = fichier racine ≤100 lignes (Boris Cherny, créateur)
- Règle d'or : quand Claude fait une erreur → l'ajouter à CLAUDE.md
- Hooks settings.json : PreToolUse, PostToolUse, Stop, Notification
- Skills, Memory, Workflows, Commands
- Patterns : Research → Plan → Execute → Review → Ship

### Hybride (recommandé)
- BMAD pour le process : phases, agents, gouvernance agile, docs as code
- Claudify pour l'exécution : CLAUDE.md, hooks, skills, slash commands
- Traçabilité : git + versioning artifacts + MD/JSX architecture
- Modularité : agents réutilisables cross-projets

---

## STACK L1→L4

### L1 · Setup L1a + L1b
Status : files_ready — non déployé
Items : FOS-PROJECT-INSTRUCTIONS.md, FOS-MANIFESTE.md, PIPELINE.md, BUDGET-SCENARIOS.md, FOS-MONITORING.md, EVOLUTION-ROADMAP.md, SKILLS-MAP.md, TOOLS-STACK.md, CHECKLIST-LAUNCH.md, FOS-JOURNAL.md, SYNC-CHAT.md, FOS-SETUP-GUIDE.md
Action : Créer projet Claude.ai → coller FOS-PROJECT-INSTRUCTIONS.md → uploader ~20 MD
L1a — Claude.ai Projects : Contexte cross-device, Knowledge base always-on.
L1b — Cowork desktop : Agent local qui lit/écrit tes fichiers directement.

### L2 · Claude Code
Status : not_configured
Items : CLAUDE.md (≤100L), settings.json (hooks), agents/, commands/, skills/
Action : Claude prépare les fichiers → toi tu déploies dans .claude/
Hooks : PreToolUse(Bash)→.env guard, PostToolUse(Write)→MD-first rappel, Stop→session summary
Gain : Hooks déterministes. Agents spécialisés. Slash commands. Audit log.

### L3 · BMAD v6
Status : not_installed
Commande : npx bmad-method install (terminal + Node.js requis)
Dossier : _bmad/ (underscore, PAS dot — breaking change v6)
Agents : Analyst, PM, UX, Architect, SM, Dev, QA, Quick Flow + sidecars
Gain : Workflow structuré. Docs as code. PRD → Architecture → Stories → Dev.

### L4 · MCP Plugins
Status : 8 connectés, 0 actifs
Notion (high) : wiki ADR + sessions + décisions
Figma (high) : Design System Void Glass formalisé
Asana OU Monday (medium) : tasks + sprints (choisir 1 seul)
Slack (medium) : notifications
ClickUp/Gmail/GCal (low) : usage optionnel

---

## ROADMAP

### v0.1 (officiel · 02.04.26)
Manifeste · Journal · Mémoire 4 couches · Garde-fous · Frameworks analysés

### Outillage (non versionné)
6→10 dashboards JSX · ~20+ fichiers MD · DA Void Glass · 3 layers identifiés

### En cours (Foundation OS setup)
L1a Claude.ai Projects · L1b Cowork Desktop · L2 Claude Code · L3 BMAD · L4 MCP

### v0.2 (prochain bump officiel)
Foundation OS opérationnel · Projects + Cowork déployés · BMAD actif · Premier projet dans l'OS

### v1.0 (premier produit)
Pipeline complet exécuté · Produit livré · Métriques en place

### v2.0 (fondation active)
Revenus générés · Méthode reproductible · Impact mesuré

---

## INSTRUCTIONS PROJET (brouillon)

Identité : Foundation OS — Phase 0 — Préparation des bases
Mode : Coopération, traçabilité totale, plan évolutif, validation avant action
Mémoire : Consulter Doc Fondation à chaque session, mettre à jour le journal
Frameworks : Process = BMAD Method · Exécution = Claudify
Garde-fous : Pas de décision sans validation, pas de suppression d'historique
Ton : Direct, objectif, sans jugement. Pictos. Pas de flatterie.

---

## CHANGELOG

| Version | Date | Modification |
|---------|------|-------------|
| 1.0.0 | 2026-04-03 | Création — fusion fondation_viewer + plugin-framework-orchestrator |
