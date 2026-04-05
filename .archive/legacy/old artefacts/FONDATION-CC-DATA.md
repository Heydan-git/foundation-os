# FONDATION-CC-DATA.md
## Control Center — Source de vérité système

```
DATA_VERSION : 1.0.0
LAST_SYNC    : 2026-04-03
JSX_CTRL     : fondation-cc.jsx
STORAGE_KEY  : fondation-cc-v1
```

> **Règle absolue** : mettre à jour ce MD en premier, syncer le JSX ensuite.
> Si le JSX est perdu, ce MD suffit à reconstruire intégralement.

---

## ARTIFACTS REGISTRY
> Source mesures : `wc -c` / `wc -l` / `wc -w` — données réelles, non inventées.
> Estimation tokens : bytes ÷ 3.5 (ratio empirique code JSX)

### A01 — ios-pipeline-dashboard.jsx
| Champ | Valeur |
|-------|--------|
| Bytes | 40,730 |
| Lignes | 701 |
| Tokens estimés | 11,637 |
| % fenêtre 200K | 5.8% |
| Poids relatif | 100% (référence max) |
| Purpose | Pipeline iOS Grade A — référence statique, 8 phases × 3 budgets × outils × KPIs |
| DA Score | 0/6 |
| Storage | Non |
| Statique | Oui |
| Status | active |

**DA Issues :**
- Fond `#0A0A0B` ≠ `#06070C`
- Font `Outfit` ≠ `Figtree`
- Pas d'orbes ambiantes
- Pas de glassmorphism
- Pas de JetBrains Mono (partiellement)
- Structure card non-glass

**Features :**
- Pipeline 8 phases (Validation → Growth)
- Budget 3 tiers (Bootstrap / Indie / Funded)
- Tableau outils par phase et budget
- KPIs par phase
- Monitoring métriques
- Évolution roadmap v1→v3
- Matrice comparaison budgets
- Règles de modularité

**Overlaps :** aucun
**Actions liées :** ACT-02

---

### A02 — fondation-monitor.jsx
| Champ | Valeur |
|-------|--------|
| Bytes | 33,468 |
| Lignes | 683 |
| Tokens estimés | 9,562 |
| % fenêtre 200K | 4.8% |
| Poids relatif | 82% |
| Purpose | Monitoring projet Fondation — phases, journal, décisions, risques, docs |
| DA Score | 0/6 |
| Storage | Oui (`fondation-monitor-v1`) |
| Statique | Non |
| Status | active |

**DA Issues :**
- Fond `#08080A` ≠ `#06070C`
- Fonts système (`Segoe UI`, system-ui) ≠ `Figtree`
- Pas d'orbes ambiantes
- Pas de glassmorphism
- Pas de JetBrains Mono pour labels
- Cards non-glass

**Features :**
- Phases + tasks (toggle done/todo)
- Journal de sessions (ajout dynamique)
- Registre décisions ADR
- Registre risques
- Documentation tracker
- Vue d'ensemble avec métriques
- Quality gates
- Reset données

**Overlaps :**
- A04 — Journal/Sessions (doublon fonctionnel)
- A04 — Décisions ADR (doublon fonctionnel)

**Actions liées :** ACT-03

---

### A03 — project-index-dashboard.jsx
| Champ | Valeur |
|-------|--------|
| Bytes | 23,308 |
| Lignes | 418 |
| Tokens estimés | 6,659 |
| % fenêtre 200K | 3.3% |
| Poids relatif | 57% |
| Purpose | Index conversations — navigation entre sessions du projet |
| DA Score | 6/6 ✅ |
| Storage | Non |
| Statique | Oui (3 convs hardcodées) |
| Status | active |

**DA Issues :** aucune — entièrement conforme Void Glass

**Features :**
- Vue d'ensemble stats
- Liste conversations avec densité
- Vue thèmes croisés
- Vue fichiers (MD + JSX)
- Détail conversation (items + décisions + fichiers)
- Filtrage par tag/thème

**Limites :**
- 3 conversations hardcodées — non maintenable sans recodage
- Pas de storage → ne se met pas à jour automatiquement

**Actions liées :** ACT-05

---

### A04 — conversation-control.jsx
| Champ | Valeur |
|-------|--------|
| Bytes | 27,397 |
| Lignes | 517 |
| Tokens estimés | 7,828 |
| % fenêtre 200K | 3.9% |
| Poids relatif | 67% |
| Purpose | Contrôle conversation spécifique — livrables, fichiers Cowork, décisions, sync |
| DA Score | 6/6 ✅ |
| Storage | Non |
| Statique | Oui (1 conv spécifique) |
| Status | deprecated |

**DA Issues :** aucune — entièrement conforme Void Glass

**Features :**
- Timeline livrables (6 items)
- Table fichiers Cowork (12 fichiers)
- Journal décisions (4 décisions)
- Sync log chat↔cowork
- Next steps
- Architecture mémoire L1-L4
- Garde-fous

**Overlaps :**
- A02 — Journal/Sessions (doublon fonctionnel)
- A02 — Décisions ADR (doublon fonctionnel)

**Limites :**
- Lié à 1 seule conversation passée (avril 2026)
- Non réutilisable en l'état

**Actions liées :** ACT-04

---

## CONTEXT BUDGET
> Estimation — tokenizer exact = Anthropic only.

| Élément | Bytes | Tokens est. | % / 200K |
|---------|-------|-------------|----------|
| A01 ios-pipeline | 40,730 | 11,637 | 5.8% |
| A02 fondation-monitor | 33,468 | 9,562 | 4.8% |
| A03 project-index | 23,308 | 6,659 | 3.3% |
| A04 conv-control | 27,397 | 7,828 | 3.9% |
| **Artifacts total** | **124,903** | **35,686** | **17.8%** |
| Système + mémoire (est.) | — | ~12,000 | ~6.0% |
| Conversation courante (est.) | — | ~3,000 | ~1.5% |
| **Total estimé** | — | **~50,686** | **~25.3%** |

- **Fenêtre max Claude Sonnet 4.6 :** 200,000 tokens
- **Seuil alerte :** 50% (100,000 tokens)
- **Seuil critique :** 80% (160,000 tokens)
- **Marge disponible :** ~74.7% (~149,314 tokens)

---

## DA COMPLIANCE RULES (Void Glass)

| ID | Règle | A01 | A02 | A03 | A04 |
|----|-------|-----|-----|-----|-----|
| R1 | Fond `#06070C` | ❌ | ❌ | ✅ | ✅ |
| R2 | Font Figtree (UI) | ❌ | ❌ | ✅ | ✅ |
| R3 | Font JetBrains Mono (labels) | ⚠️ partiel | ❌ | ✅ | ✅ |
| R4 | Glassmorphism `rgba` | ❌ | ❌ | ✅ | ✅ |
| R5 | Orbes `blur(80px)` opacity .12 | ❌ | ❌ | ✅ | ✅ |
| R6 | Accent `#5EEAD4` + fade-in staggeré | ⚠️ partiel | ❌ | ✅ | ✅ |
| **Score** | | **0/6** | **0/6** | **6/6** | **6/6** |

---

## OVERLAPS MATRIX

| Feature | A01 | A02 | A03 | A04 |
|---------|-----|-----|-----|-----|
| Journal/Sessions | — | ✅ | — | ✅ ⚠️ |
| Décisions ADR | — | ✅ | — | ✅ ⚠️ |
| Phases/Progress | — | ✅ | — | — |
| Index convs | — | — | ✅ | — |
| Livrables | — | — | — | ✅ |
| Next steps | — | — | — | ✅ |
| Pipeline iOS | ✅ | — | — | — |
| Budget | ✅ | — | — | — |
| Navigation hub | — | — | — | — | ← GAP |
| Control Center | — | — | — | — | ← GAP |

---

## GAPS

| ID | Description | Priorité |
|----|-------------|----------|
| G-01 | Hub central / OS de travail | haute |
| G-02 | Control Center cohérence système (ce fichier) | haute |
| G-03 | Versioning artifacts | moyenne |
| G-04 | Index conversations dynamique (storage) | moyenne |
| G-05 | Navigation croisée entre artifacts | basse |

---

## ACTION BACKLOG

### ACT-01 | CREATE | fondation-hub.jsx | P0
- **Raison :** Hub central manquant — ossature du système, navigation entre outils
- **Taille cible :** ~300 lignes / ~9K tokens
- **DA :** Void Glass natif
- **Storage :** Oui
- **Status :** todo

### ACT-02 | MODIFY | ios-pipeline-dashboard.jsx | P1
- **Raison :** DA non conforme 0/6 — contenu OK, reskin uniquement
- **Scope :** Fond → #06070C, Outfit → Figtree, ajout orbes + glassmorphism
- **Taille delta :** neutre (~0 bytes)
- **Status :** todo

### ACT-03 | MODIFY | fondation-monitor.jsx | P1
- **Raison :** DA non conforme 0/6 + absorber livrables/next-steps de A04
- **Scope :** Reskin + fusion contenu A04 + onglet Artifacts
- **Taille delta :** +~3K tokens estimés
- **Status :** todo

### ACT-04 | ARCHIVE | conversation-control.jsx | P2
- **Raison :** Doublon journal+décisions, statique, lié à 1 conv passée
- **Prérequis :** ACT-03 complété (contenu migré dans fondation-monitor)
- **Status :** todo

### ACT-05 | MODIFY | project-index-dashboard.jsx | P2
- **Raison :** 100% statique, 3 convs hardcodées — non maintenable
- **Scope :** Rendre dynamique via storage OU intégrer dans fondation-hub (ACT-01)
- **Status :** todo

### ACT-06 | CREATE | fondation-cc.jsx (ce fichier) | P0
- **Raison :** Control Center — analyse cohérence, budget contexte, backlog actions
- **Status :** in-progress

---

## ARCHITECTURE RÈGLES SYSTÈME

```
R1 : Chaque artifact JSX → 1 MD source de vérité associé
R2 : MD = base de données (tout le contenu structurel)
R3 : JSX = contrôleur UI (rendu + interaction)
R4 : Mettre à jour le MD AVANT le JSX — toujours
R5 : Bumper DATA_VERSION à chaque modification
R6 : LAST_SYNC mis à jour lors de chaque sync MD→JSX
R7 : STORAGE_KEY = état runtime uniquement (pas de contenu structurel)
R8 : Si JSX perdu → le MD seul suffit à reconstruire
```

---

## CHANGELOG

```
v1.0.0 | 2026-04-03 | Création initiale
  - Audit 4 artifacts (données réelles wc -c/l/w)
  - Budget contexte calculé
  - DA compliance matrix
  - Overlaps identifiés
  - 6 actions backlog
  - Architecture règles système
```
