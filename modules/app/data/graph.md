# FOS-GRAPH-DATA.md
> **Historique** — fos-graph.jsx archive Phase 2.4 dans `.archive/artifacts-jsx/`. Ne plus modifier : referentiel fige.

```
DATA_VERSION : 1.0.0
LAST_SYNC    : 2026-04-04 10:30
STORAGE_KEY  : fos-graph-v1
JSX_CTRL     : fos-graph.jsx
```

---

## GRAPHE ARCHITECTURE

### Nodes Foundation OS

| ID | Label | Type | Status | Lignes | Dependencies |
|----|-------|------|--------|--------|-------------|
| idx | fos-index | artifact | delivered | 431 | FOS-INDEX-DATA.md |
| cmd | fos-commander | artifact | delivered | 364 | FOS-COMMANDER-DATA.md |
| knw | fos-knowledge | artifact | delivered | 448 | FOS-KNOWLEDGE-DATA.md |
| sco | fos-scale-orchestrator | artifact | delivered | 558 | FOS-SCALE-ORCHESTRATOR-DATA.md |
| grp | fos-graph | artifact | building | ~500 | FOS-GRAPH-DATA.md |
| syn | fos-sync | artifact | planned | ~400 | FOS-SYNC-DATA.md |
| pip | fos-pipeline | artifact | planned | ~600 | FOS-PIPELINE-DATA.md |

### Edges (Relations)

| From | To | Type | Weight | Description |
|------|-----|------|--------|-------------|
| idx | cmd | navigation | 3 | Index → Commander dashboard |
| idx | knw | navigation | 3 | Index → Knowledge base |
| idx | sco | navigation | 3 | Index → Scale orchestrator |
| idx | grp | navigation | 2 | Index → Graph viewer (self) |
| cmd | sco | workflow | 4 | Commander uses Scale data |
| knw | cmd | data | 2 | Knowledge feeds Commander |
| sco | cmd | orchestration | 5 | Scale orchestrator drives Commander |
| grp | all | audit | 1 | Graph audits all artifacts |
| syn | all | sync | 2 | Sync monitors all artifacts |

---

## AUDIT MÉTRIQUES

### Health Check Nodes

| Metric | Target | Current | Status | Color |
|--------|--------|---------|--------|--------|
| Artifacts delivered | 6 | 4 | ⚠️ | orange |
| Lines < 700 | 100% | 100% | ✅ | green |
| MD pairs complete | 100% | 80% | ⚠️ | orange |
| Void Glass compliance | 100% | 100% | ✅ | green |
| Storage keys unique | 100% | 100% | ✅ | green |

### Violations détectées

| Artifact | Issue | Severity | Action |
|----------|-------|----------|--------|
| fos-graph.jsx | Missing (building) | medium | Complete e21 |
| fos-sync.jsx | Missing | medium | Complete e22 |
| fos-pipeline.jsx | Missing | low | P6 future |

---

## SVG LAYOUT

### Grid System (900x600)

```
Zones :
- Header    : y=0-80    (titre + métriques globales)
- Main      : y=80-480  (graphe artifacts principal)
- Sidebar   : x=650-900 (audit panel + violations)
- Footer    : y=480-600 (légende + actions)
```

### Node Positioning

| Node | X | Y | Radius | Color |
|------|---|---|--------|-------|
| idx  | 200 | 150 | 40 | #22C55E (green) |
| cmd  | 350 | 120 | 35 | #22C55E (green) |
| knw  | 350 | 180 | 35 | #22C55E (green) |
| sco  | 500 | 150 | 40 | #22C55E (green) |
| grp  | 200 | 250 | 30 | #F59E0B (building) |
| syn  | 350 | 280 | 30 | #6B7280 (planned) |
| pip  | 500 | 280 | 30 | #6B7280 (planned) |

### Edge Styling

| Type | Stroke | Width | Opacity |
|------|--------|-------|---------|
| navigation | #60A5FA | 2 | 0.8 |
| workflow | #F59E0B | 3 | 0.9 |
| data | #A855F7 | 2 | 0.7 |
| orchestration | #EF4444 | 4 | 1.0 |
| audit | #6B7280 | 1 | 0.5 |
| sync | #10B981 | 2 | 0.6 |

---

## INTERACTIONS

### Click Events

| Element | Action | Result |
|---------|--------|--------|
| Node artifact | Show details panel | Fichier + lignes + status |
| Edge | Highlight path | Toutes les relations de cette edge |
| Health metric | Drill down | Détails des violations |
| Refresh button | Reload data | Recalcul métriques temps réel |

### Hover Effects

```css
Node hover : 
- Scale 1.1
- Glow effect (box-shadow)
- Tooltip avec détails

Edge hover :
- Opacity +0.2
- Width +1
- Tooltip relation type
```

---

## VIOLATIONS RULES

### Red Flags

| Rule | Check | Action if violated |
|------|-------|-------------------|
| Line count > 700 | wc -l *.jsx | Color node red |
| Missing MD pair | existence check | Warning badge |
| Wrong font (not Figtree) | CSS scan | DA violation flag |
| Wrong bg (not #06070C) | CSS scan | DA violation flag |
| Storage key conflict | uniqueness check | Critical error |

### Health Score

```javascript
healthScore = (
  (artifactsDelivered / 6) * 30 +
  (mdPairsComplete / artifactsDelivered) * 25 +
  (voidGlassCompliance) * 25 +
  (lineCountCompliance) * 20
) * 100
```

---

## LÉGENDE

### Status Colors

- 🟢 Green (#22C55E) : Delivered artifact
- 🟡 Orange (#F59E0B) : Building/In progress
- ⚪ Gray (#6B7280) : Planned/Not started
- 🔴 Red (#EF4444) : Error/Violation

### Relation Types

- ➡️ Navigation : User flow between artifacts
- ⚙️ Workflow : Process dependency
- 📊 Data : Data dependency
- 🎯 Orchestration : Control flow
- 🔍 Audit : Monitoring relationship
- 🔄 Sync : Synchronization check

---

## CHANGELOG

### 2026-04-04 — Version 1.0.0
- **INIT** — Création du fichier de données pour fos-graph.jsx
- **ARCHITECTURE** — Définition des 7 nodes artifacts + 12 edges
- **AUDIT SYSTEM** — Métriques de santé + violations + health score
- **SVG LAYOUT** — Grid 900x600 + positioning + styling rules
- **INTERACTIONS** — Click/hover events + tooltips
- **VALIDATION RULES** — Red flags + health score algorithm

---

## METADATA

```
Création     : 2026-04-04 (P6-e21)
Auteur       : Claude Sonnet 4
Source       : FOS-SCALE-ORCHESTRATOR-DATA.md
Pattern      : MD-first workflow (ADR-005)
JSX Target   : fos-graph.jsx (~500 lignes)
Status       : ready-for-jsx
Next Action  : implémenter fos-graph.jsx avec ce graphe
```