# FOS-INDEX-DATA.md
> Source de vérité — fos-index.jsx
> Règle absolue : modifier CE fichier EN PREMIER, puis syncer le JSX.

```
DATA_VERSION : 1.0.3
LAST_SYNC    : 2026-04-03 16:00
STORAGE_KEY  : --- (artifact statique, pas de storage requis)
JSX_CTRL     : fos-index.jsx
```

---

## CATALOG

### Category 1: ARTIFACTS LIVRÉS (delivered)

| Fichier | Rôle | Lignes | MD Pair | Statut |
|---------|------|--------|---------|--------|
| fos-index.jsx | Navigation · index fichiers | 431 | FOS-INDEX-DATA.md | delivered |
| fos-commander.jsx | Commandes · ADR · sessions · decisions | 364 | FOS-COMMANDER-DATA.md | delivered |
| fos-knowledge.jsx | Contextes · méta · mémoire structurée | 448 | FOS-KNOWLEDGE-DATA.md | delivered |
| fos-scale-orchestrator.jsx | Pipeline 22 étapes · stack L0-L6 | 558 | FOS-SCALE-ORCHESTRATOR-DATA.md | delivered |

### Category 2: ARTIFACTS PLANIFIÉS (planned)

| Fichier | Rôle | MD Pair | Statut |
|---------|------|---------|--------|
| fos-graph.jsx | Graphe SVG · audit artifacts | FOS-GRAPH-DATA.md | planned (P6-e21) |
| fos-sync.jsx | Projects KB · DA compliance · overlaps | FOS-SYNC-DATA.md | planned (P6-e22) |
| fos-pipeline.jsx | Pipeline 8 phases × 3 budgets | FOS-PIPELINE-DATA.md | planned (P6) |

### Category 3: DONNÉES MD (data files)

| Fichier | Type | Description |
|---------|------|-------------|
| FOS-INDEX-DATA.md | data | Source de vérité fos-index |
| FOS-COMMANDER-DATA.md | data | Source de vérité fos-commander |
| FOS-KNOWLEDGE-DATA.md | data | Source de vérité fos-knowledge |
| FOS-SCALE-ORCHESTRATOR-DATA.md | data | Source de vérité fos-scale-orchestrator |
| FOS-ERROR-LOG.md | error-log | Log des erreurs Foundation OS |
| FOS-JOURNAL.md | historique | Journal des sessions |
| FOS-MONITORING.md | monitoring | Métriques et santé projet |
| FOS-META-PLAN.md | plan | Plan méta révisé |
| FOS-SETUP-GUIDE.md | plan | Guide setup Foundation OS |
| FOS-SKILL-ORCHESTRATOR.md | skill | Skill orchestration complet |
| project-context.md | constitution | Constitution BMAD du projet |
| CLAUDE.md | config | Instructions Claude Code |
| SKILL.md | config | Instructions Cowork desktop |
| README.md | doc | README repo GitHub |

### Category 4: AGENTS (.claude/agents/)

| Fichier | Rôle |
|---------|------|
| os-architect.md | Architecture · ADR · review structure |
| doc-agent.md | MD · traçabilité · journal · sync |
| review-agent.md | Garde-fous · cohérence · zéro régression |
| dev-agent.md | Code React · Supabase · Void Glass |

### Category 5: COMMANDS (.claude/commands/)

| Fichier | Rôle |
|---------|------|
| session-start.md | Charger contexte + état + prochaine action |
| session-end.md | Résumer + lister fichiers modifiés + next step |
| new-project.md | Créer structure nouveau projet |
| sync-md.md | Vérifier cohérence MD/JSX |

---

## STATS

```
Total fichiers : 28
Artifacts livrés : 4
Artifacts planifiés : 3
Fichiers MD : 15
Agents : 4
Commands : 4
Couverture MD-pair : 4/4 livrés (100%)
```

---

## CHANGELOG

### 2026-04-03 — Version 1.0.3 (Phantom Artifacts Resolution)
- **ARTIFACTS DELIVERED** — Création effective des 3 artifacts manquants : fos-commander.jsx (364L), fos-knowledge.jsx (448L), fos-scale-orchestrator.jsx (558L)
- **STATS UPDATE** — Recalcul des métriques : Artifacts livrés 1 → 4
- **PHANTOM FIX** — Fin de la divergence phantom/reality, trackers cohérents avec filesystem
- **MD-FIRST COMPLIANCE** — Pattern respecté, tous les MD pairs existaient avant création JSX

### 2026-04-03 — Version 1.0.2 (Data Integrity Fix)
- **MISSING FILES** — Ajout de 3 fichiers DATA manquants : FOS-COMMANDER-DATA.md, FOS-KNOWLEDGE-DATA.md, FOS-SCALE-ORCHESTRATOR-DATA.md
- **LINE COUNT FIX** — Correction des références obsolètes 479 → 446 lignes
- **STATS ACCURACY** — Recalcul précis : 28 fichiers total, 15 fichiers MD
- **REACT FIX** — Correction attribut onLoad JSX

### 2026-04-03 — Version 1.0.1 (Phase 1 Catalog Sync)
- **SYNC** — Synchronisation du catalogue avec l'état réel du filesystem
- **PHANTOM REMOVAL** — Retrait des 3 artifacts fantômes (fos-commander, fos-knowledge, fos-scale-orchestrator)
- **STATUS FIX** — fos-index.jsx passé de "in-progress" à "delivered" avec 446 lignes
- **MISSING FILES** — Ajout de FOS-ERROR-LOG.md dans Category 3
- **STATS UPDATE** — Recalcul des totaux : 28 fichiers, 1 livré, 6 planifiés

### 2026-04-03 — Version 1.0.0
- **INIT** — Création du fichier de données pour fos-index.jsx
- **CATALOG** — Définition des 5 catégories (artifacts livrés/planifiés, données MD, agents, commands)
- **INVENTORY** — Recensement complet des 27 fichiers Foundation OS
- **STATS** — Métriques de couverture et répartition par catégorie
- **BASELINE** — Première version stable du catalogue de fichiers

---

## METADATA

```
Création     : 2026-04-03 (T1 autopilot-impl.md)
Auteur       : executor agent + Claude Sonnet 4
Source       : .omc/plans/autopilot-impl.md
Pattern      : MD-first workflow (ADR-005)
JSX Target   : fos-index.jsx (~467 lignes)
Status       : ready-for-jsx
Next Action  : implémenter fos-index.jsx avec ce catalog
```