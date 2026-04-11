# FOS-MEMORY-STRATEGY.md
> Stratégie mémoire persistante optimale Foundation OS
> Éviter l'impact des compactages · Continuité maximale entre sessions

---

## 🎯 OBJECTIF

**Assurer la persistance optimale des informations critiques** malgré les compactages Claude et les saturations de contexte, pour maintenir une continuité parfaite du travail sur Foundation OS.

---

## 📊 ANALYSE SYSTÈMES MÉMOIRE

### Systèmes disponibles
| Système | Persistance | Capacité | Accès | Performance |
|---------|-------------|----------|-------|-------------|
| **Claude Memory** | ✅ Permanente | ~50KB/fichier | Immédiat | ⚡ Rapide |
| **FOS-* fichiers MD** | ✅ Git persistant | Illimitée | Via Read | ⚡ Rapide |
| **MCP Notion** | ✅ Cloud persistant | Illimitée | API call | 🔄 Modéré |
| **MCP Asana** | ✅ Cloud persistant | Illimitée | API call | 🔄 Modéré |
| **OMC Project Memory** | ✅ Local JSON | ~1MB | Via tool | ⚡ Rapide |

### Points critiques détectés
- **Contexte sature rapidement** : 83 fichiers = ~130K tokens
- **Audit révolutionnaire terminé** révèle patterns mémoire
- **Compactages Claude** peuvent perdre nuances importantes
- **Désynchronisation MD/JSX** détectée dans audit

---

## 🏗️ ARCHITECTURE MÉMOIRE 5-NIVEAUX

### M1 — IMMÉDIAT (Claude Memory native)
**Usage :** Contexte session courante + préférences utilisateur
**Contenu :**
- Préférences linguistiques (français)
- État conversation en cours
- Décisions session active
- Erreurs récentes à retenir

**Fichiers :**
- `/Users/kevinnoel/.claude/projects/-Users-kevinnoel-foundation-os/memory/user_langue_francais.md`
- Auto-sauvegarde via `/remember` tags

### M2 — STRUCTURAL (FOS-* fichiers MD)
**Usage :** Mémoire structurée du projet · Source de vérité
**Contenu :**
- FOS-JOURNAL.md → Historique sessions + ADR
- FOS-MONITORING.md → Métriques + santé système
- FOS-ERROR-LOG.md → Log erreurs + leçons
- FOS-COMMANDER-DATA.md → ADR database
- FOS-*-DATA.md → Données chaque artifact

**Triggers :**
- Fin de session → FOS-JOURNAL.md
- Changement status → FOS-MONITORING.md
- Erreur détectée → FOS-ERROR-LOG.md
- Nouvelle décision → FOS-COMMANDER-DATA.md

### M3 — ACTIONNABLE (OMC Project Memory)
**Usage :** Tracking fichiers + patterns + hot paths
**Contenu :**
- `.omc/project-memory.json` → 87 accès root, 83 accès fos-index.jsx
- Métriques d'utilisation fichiers
- Patterns détectés automatiquement
- Cache filesystem pour accès rapide

### M4 — COLLABORATIVE (MCP Notion)
**Usage :** Base de connaissance externe · Documentation
**Contenu :**
- Pages structurées par module FOS
- Documentation sessions importantes
- Knowledge base partageable
- Backup externe sécurisé

### M5 — TRACKING (MCP Asana)
**Usage :** Suivi actionnable · Roadmap · Backlog
**Contenu :**
- Tasks en cours et backlog
- Roadmap Foundation OS
- Milestones et deadlines
- Coordination équipe si applicable

---

## 🔄 TRIGGERS AUTOMATIQUES

### Auto-sauvegarde par événement
```
DÉCISION → M2 (FOS-COMMANDER-DATA.md) → M4 (Notion page ADR)
ARTIFACT → M2 (FOS-MONITORING.md) → M1 (Claude memory)
ERREUR → M2 (FOS-ERROR-LOG.md) → M1 (Claude memory leçon)
SESSION-END → M2 (FOS-JOURNAL.md) → M4 (Notion session)
PHASE-COMPLETE → M2 (tous trackers) → M5 (Asana milestone)
```

### Seuils context management
```
Context 0-50% → Travail normal
Context 50-70% → Auto-sauvegarde M2+M4 préventive
Context 70-90% → /compact obligatoire + backup M1→M2
Context 90%+ → /clear + restore essentiel depuis M2
```

---

## 📝 HIÉRARCHISATION DONNÉES CRITIQUES

### NIVEAU CRITIQUE (JAMAIS perdre)
- **ADR** (Architecture Decision Records)
- **Sessions CONV-XX** avec livrables
- **Errors + Fix + Leçons** structurelles
- **Stack définition** (L0-L6)
- **Artifacts status** (MD/JSX pairs)

### NIVEAU IMPORTANT (Restaurable)
- **Métriques précises** (lignes, tokens, etc.)
- **Hot paths** et patterns usage
- **Configuration** tools et workflow
- **Dépendances** inter-fichiers

### NIVEAU UTILE (Re-découvrable)
- **Cache filesystem**
- **Logs détaillés**
- **Métriques performance**
- **Historique granulaire**

---

## 🚀 STRATÉGIE RÉCUPÉRATION POST-COMPACTAGE

### 1. RESTORATION RAPIDE (< 2 min)
```bash
# Lecture séquentielle essentials
1. FOS-JOURNAL.md (dernières 3 sessions)
2. FOS-MONITORING.md (état global)
3. FOS-COMMANDER-DATA.md (ADR actifs)
4. .omc/project-memory.json (hot paths)
```

### 2. CONTEXT REBUILD (< 5 min)
```bash
# Si besoin contexte détaillé
1. FOS-ERROR-LOG.md (leçons apprises)
2. Artifacts actifs (via FOS-INDEX-DATA.md)
3. CLAUDE.md (règles absolues)
4. Dernière session MCP Notion
```

### 3. DEEP RESTORE (< 10 min)
```bash
# Si session complexe nécessaire
1. Audit complet via /sync-md
2. Reload MCP Asana tasks
3. Filesystem scan .omc/
4. Full context validation
```

---

## ⚡ OPTIMISATIONS PERFORMANCE

### Redondance intelligente
- **FOS-JOURNAL.md** ↔ **Claude Memory** (sync bidirectionnel)
- **ADR database** ↔ **Notion pages** (backup cloud)
- **Hot paths** ↔ **OMC memory** (cache performance)

### Compaction stratégique
- **Auto-archiver** sessions > 30 jours dans Notion
- **Nettoyer** OMC memory fichiers supprimés
- **Compacter** FOS-JOURNAL.md quand > 500 lignes

### Triggers intelligents
- **Batch updates** MCP : grouper calls Notion/Asana
- **Lazy loading** : charger détails seulement si nécessaire
- **Differential sync** : seulement changements depuis dernière sync

---

## 🛡️ PROTOCOLES SÉCURITÉ

### Intégrité données
```
CHECKPOINT = MD5 hash des FOS-* files critiques
VALIDATION = Vérif cohérence MD ↔ JSX après chaque modif
BACKUP = Git commit auto après session critique
RECOVERY = Rollback possible via git history
```

### Fail-safe mechanisms
```
SI MCP Notion indisponible → Fallback vers FOS-MONITORING.md
SI OMC corrompu → Rebuild depuis filesystem scan
SI Claude memory perdue → Restore depuis FOS-JOURNAL.md
SI Git desync → Reset hard depuis dernière backup
```

---

## 📋 CHECKLIST IMPLÉMENTATION

### Phase 1 — Setup (immédiat)
- [ ] Créer structure M4 Notion database Foundation OS
- [ ] Setup M5 Asana projet avec milestones
- [ ] Configurer auto-triggers dans CLAUDE.md
- [ ] Tester cycle complet sauvegarde→compactage→restauration

### Phase 2 — Automatisation (session suivante)
- [ ] Scripts auto-backup FOS-* → Notion
- [ ] Hooks OMC pour triggers mémoire
- [ ] Validation integrity checksums
- [ ] Monitoring seuils contexte

### Phase 3 — Optimisation (amélioration continue)
- [ ] Metrics usage patterns mémoire
- [ ] Tuning seuils et triggers
- [ ] Compression intelligente données
- [ ] Machine learning patterns récupération

---

## 🎯 RÉSULTAT ATTENDU

**AVANT :** Perte nuances après compactage · Contexte sature · Désync possible
**APRÈS :** Continuité parfaite · Restauration < 2min · Zéro perte critique · Scaling infini

**SUCCESS METRICS :**
- Restauration post-compactage en < 2 minutes
- Zéro perte d'ADR ou sessions critiques
- Contexte utilisable même à 90% saturation
- Scaling jusqu'à 100+ artifacts sans dégradation

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-04-04 | Création — Stratégie mémoire optimale 5-niveaux |