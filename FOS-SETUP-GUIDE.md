# FOS-SETUP-GUIDE.md
> Guide d'onboarding Foundation OS
> Ce fichier permet de reprendre le projet depuis zéro en cas de perte de contexte
> À uploader dans Knowledge base du projet Claude.ai Projects (L1a)

## C'est quoi Foundation OS ?

Foundation OS est l'OS de travail IA-driven de Kévin — un système pour construire des produits (apps iOS, web) avec Claude comme partenaire de travail. Pas un outil. Un système d'exploitation.

**Vision LT :** Créer une fondation pour aider le monde.
**Vision CT :** Un core + un OS + un workflow (design → app).
**Mode :** Coopération Claude/Kévin — pas exploitation.

---

## Claude.ai Projects vs Cowork — comment les articuler

### Deux outils, deux rôles complémentaires

| | Claude.ai Projects (L1a) | Cowork Desktop (L1b) |
|---|---|---|
| **Où** | claude.ai web + mobile | Claude Desktop App |
| **Accès** | Cross-device · mobile | Local seulement |
| **Rôle** | Mémoire long terme · Knowledge base | Exécution sur fichiers locaux |
| **Tes MDs** | Uploadés manuellement (KB) | Lus/écrits directement |
| **Artifacts JSX** | ✅ Visibles dans le chat | ❌ Non rendus (fichiers seulement) |
| **MCP** | Oui (dans le chat) | Oui (depuis le desktop) |
| **Tâches autonomes** | Non | Oui · scheduled tasks |
| **Fichier instructions** | FOS-PROJECT-INSTRUCTIONS.md | SKILL.md (dans le dossier) |

### Workflow articulé

```
Tu travailles sur les MDs locaux (Cowork L1b)
         ↓
Cowork modifie FOS-JOURNAL.md, FOS-MONITORING.md...
         ↓
Tu uploads les MDs mis à jour dans Claude.ai Projects (L1a)
         ↓
La KB est à jour → cross-device accessible
```

**Cowork pour :** syncer des fichiers, mettre à jour les MDs, tâches autonomes, MCP depuis desktop.
**Claude.ai Projects pour :** sessions de design/planning, voir les artifacts JSX, accès mobile.

### Artifacts JSX depuis Cowork ?

**Non directement.** Les artifacts (fos-commander.jsx, etc.) se renderisent uniquement dans le chat claude.ai.

Depuis Cowork :
- Tu peux **lire** et **modifier** le contenu des fichiers .jsx
- Tu **ne peux pas les afficher** (pas de rendu React dans Cowork)

**La solution :** Foundation OS App (L5 · Vercel) — quand elle sera déployée, l'URL Vercel sera accessible depuis le browser connector de Cowork → tu auras accès aux pages équivalentes aux artifacts depuis n'importe où.

### Setup Cowork (e04b)

1. Ouvrir **Claude Desktop App** → onglet **Cowork** (entre Chat et Code)
   → Si absent : télécharger sur claude.ai/download (inclus dans Max)
2. Cliquer **"Work in a folder"** → pointer sur le dossier `foundation-os/`
   (ou le dossier où sont tes FOS-*.md en attendant e09)
3. Cowork lira automatiquement **SKILL.md** dans ce dossier
4. Test : *"liste les fichiers FOS-* et dis-moi l'état de Foundation OS"*
   → Cowork doit répondre avec contexte complet

---
## Comment reprendre en 5 minutes

### 1. Lire dans cet ordre

```
1. FOS-SETUP-GUIDE.md (ce fichier) — contexte général
2. FOS-SCALE-ORCHESTRATOR-DATA.md — plan 22 étapes + state actuel
3. FOS-MONITORING.md — état de santé actuel
4. FOS-JOURNAL.md — historique sessions
```

### 2. Identifier l'état actuel

Demander à Claude (dans le projet Claude.ai) :
> "Lis FOS-SCALE-ORCHESTRATOR-DATA.md et dis-moi quelle est la prochaine étape."

### 3. Reprendre la session

Claude sait ce qu'il faut faire grâce à FOS-SKILL-ORCHESTRATOR.md dans le projet.

---

## Structure des fichiers

### Fichiers clés (uploader dans Claude.ai Projects · Knowledge base)

```
Priorité 1 — Orchestration
  FOS-SETUP-GUIDE.md          ← ce fichier
  FOS-SCALE-ORCHESTRATOR-DATA.md
  FOS-MONITORING.md
  FOS-JOURNAL.md

Priorité 2 — Références
  FOS-ARCHITECTURE-ANALYSIS.md
  FOS-META-PLAN.md
  project-context.md
  FOS-TECH-ARCHITECTURE.md

Priorité 3 — Données artifacts
  FOS-COMMANDER-DATA.md
  FOS-KNOWLEDGE-DATA.md
  FOS-GRAPH-DATA.md (quand livré)
  FOS-SYNC-DATA.md  (quand livré)

Priorité 4 — Instructions
  FOS-PROJECT-INSTRUCTIONS.md   ← dans Instructions du projet (pas Knowledge)
  FOS-SKILL-ORCHESTRATOR.md
  CLAUDE.md                 ← pour Claude Code, pas Cowork

Priorité 5 — Contenu
  FOS-MANIFESTE.md
  TOOLS-STACK.md
  FOS-ERROR-LOG.md
```

### Artifacts JSX (dans la Knowledge base)

```
Livrés :
  fos-commander.jsx    ← cockpit quotidien
  fos-knowledge.jsx    ← manifeste + frameworks
  fos-scale-orchestrator.jsx ← guide 22 étapes

À produire :
  fos-graph.jsx        ← carte vivante + audit
  fos-sync.jsx         ← sync Projects KB + cohérence
  fos-index.jsx        ← navigation conversations
  fos-pipeline.jsx     ← pipeline projets
```

### Archives (ne plus uploader)

```
fondation_viewer.jsx        → migré dans fos-knowledge
orchestrateur.jsx           → migré dans fos-commander
ops-orchestrator.jsx        → migré dans fos-commander
fondation-monitor.jsx       → migré dans fos-commander
conversation-control.jsx    → migré dans fos-sync (quand livré)
centre-communication.jsx    → migré dans fos-graph (quand livré)
fondation-cc.jsx            → migré dans fos-sync (quand livré)
plugin-framework-orchestrator.jsx → migré dans fos-knowledge
artifact-analyzer.jsx       → migré dans fos-graph (quand livré)
fos-scale-orchestrator.jsx      → remplacé par v3
scale-orchestrator-v2.jsx   → remplacé par v3
```

---

## Stack complète

```
L0 — Void Glass DS         : Tokens CSS · Figma spec
L1a — Claude.ai Projects   : Knowledge base cross-device + Project Instructions
L1b — Cowork (desktop)     : Agent local · fichiers · tâches autonomes · MCP connectors
L2 — Claude Code           : CLAUDE.md + hooks + agents + oh-my-claudecode
L3 — BMAD v6               : _bmad/ (underscore) + project-context.md
L4 — MCP                   : Notion + Asana + Figma
L5 — Foundation OS App     : Vite + React + TypeScript + Supabase + Vercel
L6 — GitHub                : foundation-os repo + CI/CD
```

---

## Commandes utiles

### Claude Code (dans claude .)

```bash
/session-start         # Charger contexte + proposer prochaine action
/session-end           # Résumer session + lister fichiers modifiés
/sync-md               # Vérifier cohérence MD/JSX
autopilot: [tâche]     # oh-my-claudecode mode autonome
team "[tâche]"             # oh-my-claudecode mode multi-agent (v4.1.7+)
@doc-agent : [tâche]   # Agent documentation spécialisé
@os-architect : [tâche] # Agent architecture
/bmad-help             # Guidance BMAD
```

### Git standard

```bash
git add . && git commit -m "type(scope): description"
git push  # → deploy Vercel automatique
```

---

## Règles à ne jamais oublier

1. **MD first** — toujours modifier NOM-DATA.md avant NOM.jsx
2. **Void Glass** — #06070C · Figtree · JetBrains Mono
3. **Zéro régression** — jamais perdre une feature ou décision
4. **Artifacts < 700L** — découper si nécessaire
5. **BMAD = _bmad/** — underscore obligatoire (v6 breaking change)
6. **Supabase + Vercel** — stack L5 décidée (ADR-008)
7. **Zéro nuisance** — règle absolue, permanente

---

## En cas de doute

Demander à Claude :
> "Lis FOS-SETUP-GUIDE.md et FOS-SCALE-ORCHESTRATOR-DATA.md, puis dis-moi où on en est et quelle est la prochaine action."

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-04-03 | Création — guide onboarding Foundation OS |
