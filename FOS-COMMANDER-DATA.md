# FOS-COMMANDER-DATA.md
> Source de vérité — fos-commander.jsx
> Règle absolue : modifier CE fichier EN PREMIER, puis syncer le JSX.
> Si le JSX est perdu, ce fichier suffit à reconstruire intégralement.

```
DATA_VERSION : 1.3.0
LAST_SYNC    : 2026-04-04 (CONV-005 — App Commander page)
STORAGE_KEY  : fos-commander-v1
JSX_CTRL     : fos-commander.jsx
APP_CTRL     : app/src/pages/Commander.tsx
APP_ROUTE    : /commander
SUPABASE     : tables: sessions, decisions, risks, docs, context_blocks, next_steps
STACK        : Vite + React + TypeScript + Tailwind + react-router-dom + Supabase
```

---

## MÉTA PROJET

```json
{
  "name": "Foundation OS",
  "version": "v0.1",
  "started": "2026-04-02",
  "phase": "00 — Fondation",
  "budget": "indie",
  "objectiveCT": "OS de travail IA-driven · Coopération Claude/Kévin",
  "objectiveLT": "Fondation pour aider le monde",
  "lastScan": null
}
```

---

## PIPELINE — 8 PHASES

| Num | Label | Couleur | Statut |
|-----|-------|---------|--------|
| 00 | Fondation OS | #A78BFA | active |
| 01 | Design | #5EEAD4 | pending |
| 02 | Architecture | #F97316 | pending |
| 03 | Développement | #3B82F6 | pending |
| 04 | Qualité | #EAB308 | pending |
| 05 | Launch | #22C55E | pending |
| 06 | Monétisation | #EC4899 | pending |
| 07 | Growth | #94A3B8 | pending |

**Tâches Phase 00 (Foundation OS) :**
- Créer projet Claude.ai (L1a Knowledge base cross-device)
- Configurer Project Instructions
- Uploader ~20 MD Knowledge base
- Installer Claude Code CLI
- Créer CLAUDE.md + hooks
- Installer BMAD v6
- Activer Notion + Figma (MCP)
- Valider end-to-end Foundation OS

---

## SESSIONS (journal)

### SESSION-001 · 2026-04-02
Titre : Fondation — Vision & Principes
Items : Mode coopération défini · Vision LT fondation mondiale · Analyse Claudify + BMAD · FONDATION_v0.md créé
Décisions : Coopération > exploitation · Traçabilité totale · Claudify + BMAD = fondations

### SESSION-002 · 2026-04-02
Titre : Skills iOS Pipeline Grade A
Items : 18+ skills cartographiés · Pipeline 8 phases × 3 budgets · ios-pipeline-dashboard.jsx · 12 fichiers MD
Décisions : 8 phases validation→growth · Stack iOS pressentie : Swift 6 + SwiftUI + TCA

### SESSION-003 · 2026-04-03
Titre : Architecture Foundation OS
Items : Analyse exhaustive 10 artifacts · Architecture 6 artifacts cibles · Design System Void Glass formalisé
Décisions : 6 artifacts fos-* · BMAD v6 _bmad/ (underscore) · DS Void Glass = spec Figma

### SESSION-004 · 2026-04-03
Titre : Stack, Coûts, Audit complet Foundation OS
Items : Décision Vercel + Supabase (ADR-008) · Estimation coûts par phase · Audit 5 catégories · FOUNDATION-OS-SKILL créé · 10 fichiers MD · Scale-orchestrator v3.3.0 · OMC syntax corrigée · archives supprimées · Mode 6 alignement ajouté
Décisions : Option D Hybrid (ADR-007) · Vercel + Supabase (ADR-008) · FOUNDATION-OS-SKILL (ADR-010)

---

## DÉCISIONS (ADR)

| ID | Date | Titre | Contexte | Impact | Statut |
|----|------|-------|----------|--------|--------|
| ADR-001 | 2026-04-02 | Coopération > exploitation | Philosophie Foundation OS | high | active |
| ADR-002 | 2026-04-02 | Traçabilité totale | Journal + MD + monitoring systématique | high | active |
| ADR-003 | 2026-04-02 | Plan évolutif | Itérations courtes, pas de rigidité | medium | active |
| ADR-004 | 2026-04-02 | Claudify + BMAD = fondations workflow | Déploiement sur Claude.ai Projects après préparation | high | active |
| ADR-005 | 2026-04-03 | Architecture MD/JSX | MD = source de vérité, JSX = contrôleur | high | active |
| ADR-006 | 2026-04-03 | 6 artifacts fos-* | Architecture cible après analyse exhaustive | high | active |
| ADR-007 | 2026-04-03 | Option D Hybrid | Pipeline app iOS — Hybrid artifacts + app | high | active |
| ADR-008 | 2026-04-03 | Vercel + Supabase (pas Railway) | Stack L5 définitive — free tier suffisant usage perso | high | active |
| ADR-009 | 2026-04-03 | 22 étapes setup orchestrées | Plan déploiement Foundation OS complet | high | active |
| ADR-010 | 2026-04-03 | FOUNDATION-OS-SKILL = mémoire orchestration | Skill pour maintien cohérence long terme | high | active |
| ADR-011 | 2026-04-03 | OMC team syntax canonical (v4.1.7+) | team "tâche" — swarm/ultrapilot supprimés | medium | active |
| ADR-012 | 2026-04-03 | L1 = deux couches (Claude.ai Projects + Cowork desktop) | Architecture L1 clarifiée | high | active |
| ADR-031 | 2026-04-04 | Phase 4 Smart Orchestration architecture validée | Validation technique complète Phase 4 | high | active |

---

## CONTEXT BLOCKS (mémoire structurée)

### C-01 · Persistance mémoire (4 niveaux — distincts du stack L0-L6)
```
M4 : Claude Memories + MD persistants  → survit entre toutes les sessions
M3a: Claude.ai Projects KB (~20 MD)   → cross-device (L1a du stack)
M3b: Cowork folder local               → local uniquement (L1b du stack)
M2 : Contexte conversation             → perdu à la fin de la session
M1 : Message + fichiers uploadés       → immédiat uniquement
Note: M = Memory tier (≠ L = Stack layer)
```

### C-02 · DA Void Glass — tokens obligatoires
```
Fond     : #06070C
Accent   : #5EEAD4
Fonts    : Figtree (UI) + JetBrains Mono (code/labels)
Cards    : rgba(255,255,255,.025) border rgba(255,255,255,.055)
Orbes    : blur(80px), opacity 0.09–0.12, animation drift
Fade-in  : staggered, delays 40ms par élément
```

### C-03 · Frameworks workflow retenus
```
Claudify : CLAUDE.md ≤100L, hooks, skills, memory, slash commands
BMAD v6  : _bmad/ (underscore!), project-context.md, 8 agents + sidecars, 34 workflows
Shinpr   : recipe-implement, recipe-design, recipe-diagnose, recipe-build
```

### C-04 · Règles coopération
```
1. Innover → proposer avant d'exécuter
2. Exhaustif · Honnête · Objectif · Méthodique
3. Plan + MD à chaque tâche
4. Alignement vérifié avant toute action
5. Zéro nuisance — absolu
6. MD en premier, JSX en second
```

---

## RISQUES

| ID | Risque | Impact | Proba | Mitigation | Statut |
|----|--------|--------|-------|------------|--------|
| R-01 | Artifacts trop lourds → rendu partiel | medium | high | Consolidation 10→6 artifacts | open |
| R-02 | Drift MD/JSX (syncs oubliées) | medium | medium | Pattern MD-first strict | open |
| R-03 | BMAD v6 changements API | low | low | Vérifier docs avant install | open |
| R-04 | Surengineering workflow avant produit | medium | medium | Phase 00 priorité absolue | open |

---

## DOCUMENTS TRACKER

| Fichier | Type | Statut | Projects KB |
|---------|------|--------|--------|
| fos-commander.jsx | artifact | ✅ livré 364L | ✅ FOS-COMMANDER-DATA.md |
| fos-knowledge.jsx | artifact | ✅ livré 448L | ✅ FOS-KNOWLEDGE-DATA.md |
| fos-graph.jsx | artifact | ⏳ P6-e21 | ⏳ FOS-GRAPH-DATA.md |
| fos-sync.jsx | artifact | ⏳ P6-e22 | ⏳ FOS-SYNC-DATA.md |
| fos-index.jsx | artifact | ✅ livré 300L | ✅ FOS-INDEX-DATA.md |
| fos-pipeline.jsx | artifact | ⏳ P6 | ⏳ FOS-PIPELINE-DATA.md |
| fos-scale-orchestrator.jsx | artifact | ✅ livré 558L | ✅ FOS-SCALE-ORCHESTRATOR-DATA.md |
| FOS-SETUP-GUIDE.md | plan | ✅ créé | ⏳ Projects KB |
| FOS-SCALE-ORCHESTRATOR-DATA.md | plan | ✅ v3.3.0 | ⏳ Projects KB |
| FOS-ARCHITECTURE-ANALYSIS.md | doc | ✅ complet | ⏳ Projects KB |
| FOS-META-PLAN.md | doc | ✅ complet | ⏳ Projects KB |
| project-context.md | doc | ✅ créé | ⏳ Projects KB |
| FOS-TECH-ARCHITECTURE.md | doc | ✅ créé | ⏳ Projects KB |
| FOS-PROJECT-INSTRUCTIONS.md | notice | ✅ créé | → Instructions projet |
| CLAUDE.md | notice | ✅ créé | → Claude Code (pas Cowork) |
| FOS-SKILL-ORCHESTRATOR.md | skill | ✅ créé | ⏳ à installer |
| FOS-MONITORING.md | monitoring | ✅ créé | ⏳ Projects KB |
| FOS-ERROR-LOG.md | monitoring | ✅ créé | ⏳ Projects KB |
| FOS-JOURNAL.md | historique | ✅ créé | ⏳ Projects KB |
| FOS-MANIFESTE.md | manifeste | ✅ créé | ⏳ Projects KB |

---

## NEXT STEPS

| ID | Label | Priorité | Qui | Fait |
|----|-------|---------|-----|------|
| NS-01 | Créer projet Claude.ai Foundation OS (e04) | critical | Kévin | ☐ |
| NS-02 | Configurer Project Instructions (e05) | critical | Kévin | ☐ |
| NS-03 | Uploader ~20 MD Knowledge base (e06) | high | Kévin | ☐ |
| NS-04 | Installer Claude Code CLI + CLAUDE.md (e08-e10) | high | Kévin | ☐ |
| NS-05 | Installer oh-my-claudecode (e11) | high | Kévin | ☐ |
| NS-06 | Installer BMAD v6 (e13) | medium | Kévin | ☐ |
| NS-07 | Installer FOUNDATION-OS-SKILL dans /mnt/skills/user/ | high | Kévin | ☐ |
| NS-08 | Produire fos-graph.jsx (e21) | medium | Claude | ☐ |
| NS-09 | Produire fos-sync.jsx (e22) | medium | Claude | ☐ |
| NS-10 | Produire fos-index.jsx + fos-pipeline.jsx | low | Claude | ☐ |

---

## GARDE-FOUS PERMANENTS

| Garde-fou | Description |
|-----------|-------------|
| Zéro nuisance | Aucun mal — volontaire, involontaire, direct, indirect, à tout être vivant |
| Traçabilité | Chaque décision documentée ici ET dans le journal de session |
| Alignement | Vérifier l'intention avant d'exécuter |
| Honnêteté | Dire ce qui est, pas ce qui plaît |
| MD first | Toujours mettre à jour le MD avant le JSX |

---

## SYNC COWORK

Fichiers à uploader dans Claude.ai Projects · Knowledge base (step e06) :
Priorité 1 : FOS-SETUP-GUIDE.md · FOS-SCALE-ORCHESTRATOR-DATA.md · FOS-MONITORING.md · FOS-JOURNAL.md
Priorité 2 : FOS-ARCHITECTURE-ANALYSIS.md · FOS-META-PLAN.md · project-context.md · FOS-TECH-ARCHITECTURE.md
Priorité 3 : FOS-COMMANDER-DATA.md · FOS-KNOWLEDGE-DATA.md
Priorité 4 : FOS-SKILL-ORCHESTRATOR.md · FOS-MANIFESTE.md · FOS-ERROR-LOG.md
Priorité 5 : DA-FOS-MANIFESTE.md · DA-BOILERPLATE.md · FONDATION_FRAMEWORKS.md · PIPELINE.md
Note : FOS-PROJECT-INSTRUCTIONS.md → dans Instructions du projet (pas Knowledge base)
Note : CLAUDE.md → pour Claude Code local uniquement (pas Cowork)

---

## CHANGELOG

| Version | Date | Modification |
|---------|------|-------------|
| 1.0.0 | 2026-04-03 | Création — CONV-10 architecture exhaustive |
| 1.1.0 | 2026-04-03 | ADR-007→010 · SESSION-004 · docs tracker complet · next steps mis à jour |
| 1.2.0 | 2026-04-03 | ADR-012 · L1 split L1a+L1b · Cowork (Desktop) distinct de Projects |
