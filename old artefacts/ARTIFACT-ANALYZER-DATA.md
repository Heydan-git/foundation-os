# ARTIFACT-ANALYZER-DATA.md
# Source de vérité — Artifact Analyzer
# RÈGLE : Modifier CE fichier d'abord, puis syncer le JSX

DATA_VERSION: 1.2
LAST_SYNC: 2026-04-03
STORAGE_KEY: artifact-analyzer-v1

---

## ⚙️ RÈGLE ARCHITECTURE (immuable)

```
MD  = base de données / source de vérité → modifier en premier
JSX = contrôleur / UI → syncer après le MD
Si JSX perdu → le MD suffit à reconstruire
Jamais de JSX sans MD associé
```

---

## 📐 LIMITES DE RÉFÉRENCE

| Métrique | Vert (sain) | Jaune (surveillance) | Orange (lourd) | Rouge (critique) |
|----------|-------------|---------------------|----------------|-----------------|
| Lignes   | < 400       | 400–600             | 600–700        | > 700           |
| Ko       | < 25        | 25–35               | 35–45          | > 45            |
| Poids %  | 0–50%       | 50–70%              | 70–87%         | > 87%           |

Limite pratique 100% = 800 lignes / 50 Ko

---

## 📊 ARTIFACTS ANALYSÉS (données réelles — aucune invention)

### ios-pipeline-dashboard.jsx
```
lines:   701
chars:   40321
kb:      39.4
weight:  87.6%   # max(701/800, 39.4/50)
status:  CRITIQUE
storage: NON
md_pair: NON  ← gap critique
```

**Constantes de données (5) :**
- PHASES — 8 entrées × 6 steps × 3 budgets d'outils + 3 KPIs = 48 steps, 24 KPIs
- BUDGETS — 3 entrées (Bootstrap, Indie, Funded)
- MONITORING — 4 catégories × 5 métriques = 20 métriques
- COST_TABLE — 3 tiers × ~8 items = ~24 items coût
- EVOLUTION_ROADMAP — 6 versions × 4 items = 24 items roadmap

**Tabs :** Pipeline, Budget, Monitoring, Évolution (4 tabs)

**Recommandation :** Séparer COST_TABLE + EVOLUTION_ROADMAP dans un MD.
Réduction estimée : -120 lignes → poids ~72%

---

### fondation-monitor.jsx
```
lines:   683
chars:   33036
kb:      32.3
weight:  85.4%   # max(683/800, 32.3/50)
status:  CRITIQUE
storage: OUI (fondation-monitor-v1)
md_pair: FONDATION_MONITORING.md (partiel)  ← à compléter
```

**Constantes de données (5) :**
- DEFAULT_PHASES — 8 phases × ~6 tâches = ~44 tâches
- DEFAULT_SESSIONS — 1 entrée initiale
- DEFAULT_DECISIONS — 3 entrées
- DEFAULT_RISKS — 0 (vide au départ)
- DEFAULT_DOCS — 4 entrées

**Tabs :** Vue globale, Phases, Journal, Décisions, Risques, Docs (6 tabs)

**Recommandation :** Externaliser les DEFAULT_* dans FONDATION-MONITOR-DATA.md.
Storage key conservée pour état runtime. Réduction estimée : -80 lignes → poids ~75%

---

### project-index-dashboard.jsx
```
lines:   418
chars:   23064
kb:      22.5
weight:  52.3%   # max(418/800, 22.5/50)
status:  SURVEILLE
storage: NON
md_pair: INDEX-DATA.md (partiel)  ← à compléter
```

**Constantes de données (3) :**
- CONVERSATIONS — 3 entrées avec items, decisions, files
- THEMES — 6 entrées
- STATS — 5 métriques statiques

**Tabs / Views :** Vue d'ensemble, Conversations, Thèmes, Fichiers (4 vues)

**Recommandation :** Externaliser CONVERSATIONS (données denses) dans INDEX-DATA.md.
Réduction estimée : -60 lignes → poids ~45%

---

### conversation-control.jsx
```
lines:   517
chars:   27050
kb:      26.4
weight:  64.6%   # max(517/800, 26.4/50)
status:  SURVEILLE
storage: NON
md_pair: NON  ← gap critique
```

**Constantes de données (6) :**
- CONV_META — 1 objet (métadonnées conversation)
- DELIVERABLES — 6 livrables avec type, status, phase
- COWORK_FILES — 12 fichiers avec role, target, size, status
- DECISIONS — 4 décisions avec impact, status
- NEXT_STEPS — 5 prochaines étapes avec priority, type
- SYNC_LOG — 2 entrées de synchronisation

**Tabs :** Vue d'ensemble, Fichiers Cowork, Décisions, Sync & Next (4 tabs)

**Recommandation :** Créer CONVERSATION-CONTROL-DATA.md.
Externaliser les 6 constantes. Réduction estimée : -100 lignes → poids ~52%

---

## 📈 SYNTHÈSE POIDS

| Artifact | Lignes | Ko | Poids | Status | Storage | MD pair |
|----------|--------|-----|-------|--------|---------|---------|
| ios-pipeline-dashboard.jsx | 701 | 39.4 | 87.6% | 🔴 Critique | ✗ | ✗ |
| fondation-monitor.jsx | 683 | 32.3 | 85.4% | 🔴 Critique | ✓ | ~ |
| conversation-control.jsx | 517 | 26.4 | 64.6% | 🟡 Surveillé | ✗ | ✗ |
| project-index-dashboard.jsx | 418 | 22.5 | 52.3% | 🟡 Surveillé | ✗ | ~ |

Poids moyen stack : **72.5%** ← Zone orange

---

## 🔴 GAPS IDENTIFIÉS

1. `ios-pipeline-dashboard.jsx` — pas de MD associé → perte totale si JSX perdu
2. `conversation-control.jsx` — pas de MD associé → perte totale si JSX perdu
3. `fondation-monitor.jsx` — MD partiel (FONDATION_MONITORING.md) → à compléter
4. `project-index-dashboard.jsx` — MD partiel (INDEX-DATA.md) → à compléter
5. 2 artifacts sur 4 n'ont PAS de storage → état non persistant
6. Aucun artifact ne respecte encore le pattern MD+JSX complet

---

## 🔧 ACTIONS PRIORITAIRES

| Priorité | Action | Impact |
|----------|--------|--------|
| P0 | Créer ios-pipeline-DATA.md | Sécurise 40 Ko de données |
| P0 | Créer conversation-control-DATA.md | Sécurise 27 Ko de données |
| P1 | Compléter fondation-monitor MD | Compléter la base |
| P1 | Ajouter storage à ios-pipeline | Persistance état |
| P2 | Réduire ios-pipeline à < 75% poids | Maintenabilité |
| P2 | Réduire fondation-monitor à < 75% poids | Maintenabilité |

---

## 🏗️ PATTERN CIBLE (pour chaque futur artifact)

```
NOM-DATA.md          ← source de vérité
  - DATA_VERSION
  - LAST_SYNC
  - Toutes les constantes de données
  - Règles métier

NOM.jsx              ← contrôleur UI uniquement
  - Lit depuis window.storage (key: NOM-v1)
  - Initialisé depuis les données du MD
  - Zéro logique métier dans les données
  - Rendu uniquement

Règle de mise à jour :
  1. Modifier NOM-DATA.md en premier
  2. Bumper DATA_VERSION
  3. Mettre à jour LAST_SYNC
  4. Syncer NOM.jsx
```

---

_Analysé mécaniquement depuis les fichiers /mnt/project — aucune donnée inventée_
_Limites calculées : max(lines/800, kb/50) × 100_
