# project-context.md
> Constitution du projet Foundation OS pour BMAD v6
> Chargé automatiquement par tous les workflows BMAD
> Source : FOS-KNOWLEDGE-DATA.md + FOS-ARCHITECTURE-ANALYSIS.md

---

## Projet

**Nom :** Foundation OS
**Type :** OS de travail IA-driven (outil personnel · coopération Claude/Kévin)
**Vision LT :** Créer une fondation pour aider le monde
**Vision CT :** Un core + un OS + un workflow (design → app)
**Phase :** 00 — Setup Foundation OS
**Mode :** Coopération humain-IA, pas exploitation

---

## Stack technique

### Foundation OS App (L5)
- Frontend  : Vite + React + TypeScript + Tailwind
- Backend   : Supabase (PostgreSQL + Auth + SDK JS · pas de backend custom)
- Deploy    : Vercel (CDN global · deploy auto depuis GitHub · free)
- Repo      : GitHub · foundation-os (privé)

### iOS App (pipeline futur)
- Language  : Swift 6 + SwiftUI
- Archi     : TCA (The Composable Architecture)
- Backend   : Supabase
- Payments  : RevenueCat (< $2.5K MRR gratuit)
- Analytics : TelemetryDeck + Mixpanel
- Errors    : Sentry
- CI/CD     : GitHub Actions + Fastlane

### Workflow IA
- L1a Claude.ai Projects : Knowledge base (~20 MD) + Project Instructions cross-device
- L1b Cowork desktop       : Agent local · fichiers directs · tâches autonomes · MCP connectors
- L2 Code      : Claude Code + CLAUDE.md + oh-my-claudecode
- L3 Method    : BMAD v6 (_bmad/ underscore) + ce fichier
- L4 Plugins   : Notion (wiki) + Asana (tasks) + Figma (DS)

---

## Design System

**Void Glass** — règles obligatoires :
- Fond       : #06070C (jamais #0A0A0B ou variantes)
- Accent     : #5EEAD4 (teal principal)
- Typo UI    : Figtree (jamais Outfit, Inter, system-ui)
- Typo code  : JetBrains Mono
- Cards      : rgba(255,255,255,.025) bg · rgba(255,255,255,.055) border
- Orbes      : blur(80px) · opacity .09 · animation drift
- Fade-in    : stagger 40ms par élément

---

## Architecture artifacts

### Pattern obligatoire (MD first, JSX ensuite)
```
NOM-DATA.md  = source de vérité (tout le contenu)
NOM.jsx      = contrôleur UI uniquement
Règle        : modifier MD d'abord, syncer JSX ensuite
```

### Artifacts produits
| Artifact | Rôle | Lignes |
|----------|------|--------|
| fos-commander.jsx | Cockpit · pipeline · health IA · sessions | 571 |
| fos-knowledge.jsx | Manifeste · frameworks · stack · roadmap | 330 |
| fos-graph.jsx | Graphe SVG · audit artifacts | À produire |
| fos-sync.jsx | Projects KB · DA compliance · overlaps | À produire |
| fos-index.jsx | Navigation · conversations | À produire |
| fos-pipeline.jsx | Pipeline 8 phases × 3 budgets | À produire |

---

## Décisions architecturales (ADR résumés)

| ID | Décision | Impact |
|----|----------|--------|
| ADR-001 | Coopération > exploitation | Philosophie fondatrice |
| ADR-002 | Traçabilité totale | Journal + MD + ADR |
| ADR-003 | Plan évolutif | Itérations courtes |
| ADR-004 | Claudify + BMAD = fondations workflow | Hybrid pipeline |
| ADR-005 | MD first / JSX ensuite | Architecture données |
| ADR-006 | 6 artifacts fos-* | Architecture UI |
| ADR-007 | Option D Hybrid | Pipeline app |
| ADR-008 | Vercel + Supabase | Stack L5 finale |

---

## Conventions de code

- Conventional commits : `type(scope): description`
- Nommage fichiers MD : NOM-DATA.md (CAPS · kebab-case)
- Nommage JSX : fos-nom.jsx (kebab-case · préfixe fos-)
- Storage keys : fos-nom-v1 (unicité garantie)
- Taille max artifacts : 700L / ~50KB
- API model : claude-sonnet-4-20250514

---

## Garde-fous permanents

1. Zéro nuisance — aucun mal volontaire/involontaire à quiconque
2. Traçabilité — chaque décision documentée
3. Alignement — valider avant tout changement structurel
4. Honnêteté — dire ce qui est, pas ce qui plaît
5. MD first — jamais JSX sans son MD pair à jour
6. Anti over-engineer — pas de complexité avant besoin réel validé

---

## Fichiers de référence

```
FOS-SCALE-ORCHESTRATOR-DATA.md  → guide 22 étapes opérationnels
FOS-ARCHITECTURE-ANALYSIS.md → analyse exhaustive + architecture cible
FOS-MONITORING.md               → métriques et santé projet
FOS-JOURNAL.md                  → historique sessions
FOS-ERROR-LOG.md                → log erreurs → amélioration CLAUDE.md
FOS-SKILL-ORCHESTRATOR.md      → skill orchestration complet
```
