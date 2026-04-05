# FOS-ANTI-COMPACTAGE-ARCHITECTURE.md
> Architecture hybride anti-compactage Foundation OS
> Inspiration : MUSE + Memento + Claude-Memory + Memory-Keeper + LIFE
> Objectif : Éliminer définitivement les pertes de contexte

---

## 🎯 PROBLÈME RÉSOLU

**AVANT :** Compactage = perte fil + plans + décisions + invention/hallucination
**APRÈS :** Continuité parfaite + restauration automatique < 30sec + zéro perte critique

---

## 🏗️ ARCHITECTURE HYBRIDE 5-COUCHES

### C1 — HOOKS PRÉVENTIFS (Claude-Memory style)
```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "compact|clear",
        "command": "scripts/hooks/pre-compactage-backup.sh"
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Read",
        "command": "scripts/hooks/post-read-checkpoint.sh"
      }
    ],
    "Stop": [
      {
        "command": "scripts/hooks/session-end-archive.sh"
      }
    ]
  }
}
```

**Fonction :** Interception automatique avant compactage + checkpoints silencieux

### C2 — CHECKPOINT INTELLIGENT (MUSE style)
```
Déclencheurs automatiques :
- Toutes les 10 interactions (silencieux)
- Context > 50% → backup préventif
- Context > 70% → alerte + backup forcé
- Context > 90% → compactage sécurisé automatique
- Avant /compact ou /clear → backup complet
```

**Stockage :** `.fos/checkpoints/YYYY-MM-DD-HH-mm-ss.json`

### C3 — DUAL-LAYER MEMORY (Memento style)
```
Knowledge Layer (.fos/knowledge/):
- distilled_facts.md → Faits essentiels
- decisions_adr.md → ADR compacts 
- project_state.md → État actuel
- patterns_learned.md → Patterns détectés

Transcript Layer (.fos/transcripts/):
- session_YYYY-MM-DD.md → Historique complet
- metadata_CONV-XX.json → Breadcrumbs
- search_index.json → Index sémantique
```

**Fonction :** Drill-down lossless + search sémantique + déduplication

### C4 — BREADCRUMBS SESSION (Memory-Keeper style)
```json
// .fos/sessions/CONV-XX-metadata.json
{
  "conversationId": "CONV-XX",
  "timestamp": "2026-04-04T20:30:00Z",
  "filesModified": ["FOS-JOURNAL.md", "app/src/App.tsx"],
  "decisionsKey": ["ADR-047", "ADR-048"],
  "artifactsChanged": ["fos-commander.jsx"],
  "contextMD5": "abc123...",
  "nextActions": ["Implémenter hooks", "Valider système"],
  "keyInsights": ["Hooks préventifs = solution", "10 interactions = seuil optimal"]
}
```

**Fonction :** Restauration rapide contexte + navigation temporelle

### C5 — VALIDATION INTÉGRITÉ (Foundation OS custom)
```bash
# Validation post-restauration automatique
- Checksum MD5 fichiers FOS-*.md
- Test cohérence MD ↔ JSX
- Validation stack L0-L6 
- Alert si gaps > 5% contexte
- Recovery auto depuis backup le plus proche
```

---

## 🔄 WORKFLOWS AUTOMATIQUES

### WF1 — PRÉ-COMPACTAGE SÉCURISÉ
```bash
1. Détection imminente compactage (seuil 80%+)
2. Backup instant Knowledge + Transcript
3. Capture état complet conversation
4. MD5 checkpoint fichiers critiques  
5. Metadata session avec breadcrumbs
6. Green light → compactage autorisé
```

### WF2 — POST-COMPACTAGE RESTAURATION
```bash
1. Détection nouvelle session/contexte vide
2. Scan .fos/checkpoints/ → trouve dernier backup
3. Load Knowledge Layer → faits essentiels
4. Load Transcript Layer → si besoin détail
5. Rebuild context < 30 secondes
6. Validation intégrité → alert si gaps
```

### WF3 — MAINTENANCE CONTINUE  
```bash
- Archive sessions > 30 jours
- Compress transcripts > 7 jours  
- Dedupe knowledge facts similarity > 90%
- Update search index nouvelle session
- Prune checkpoints > 50 (garde dernier 50)
```

---

## 📁 STRUCTURE FILESYSTEM

```
foundation-os/
├── .fos/                          # Système anti-compactage
│   ├── checkpoints/               # MUSE-style snapshots
│   │   ├── 2026-04-04-20-30-15.json
│   │   └── latest.json → symlink
│   ├── knowledge/                 # Memento Knowledge Layer
│   │   ├── distilled_facts.md
│   │   ├── decisions_adr.md
│   │   ├── project_state.md
│   │   └── patterns_learned.md
│   ├── transcripts/               # Memento Transcript Layer
│   │   ├── session_2026-04-04.md
│   │   └── search_index.json
│   ├── sessions/                  # Memory-Keeper breadcrumbs
│   │   ├── CONV-XX-metadata.json
│   │   └── session_registry.json
│   └── config/
│       ├── anti_compactage.json
│       └── thresholds.json
├── scripts/
│   └── hooks/                     # Claude-Memory hooks
│       ├── pre-compactage-backup.sh
│       ├── post-read-checkpoint.sh
│       └── session-end-archive.sh
└── .claude/
    └── settings.json              # Hooks configuration
```

---

## ⚡ COMMANDES UTILISATEUR

### Commandes diagnostics
```bash
/context-health     # État contexte + seuils
/backup-now         # Force checkpoint immédiat  
/restore-session X  # Restore session CONV-X
/search-memory "X"  # Search sémantique historique
/validate-integrity # Check cohérence post-restore
```

### Commandes automatiques
```bash
Auto-déclenchement silencieux :
- Checkpoint toutes les 10 interactions
- Backup préventif > 70% context
- Validation post-/compact
- Archive session-end
```

---

## 🎯 MÉTRIQUES SUCCESS

| Métrique | Avant | Cible |
|----------|-------|-------|
| **Perte contexte post-compactage** | 80% | 0% |
| **Temps restauration** | Manual | < 30s |
| **Précision restoration** | 60% | 98%+ |
| **Gaps critiques (ADR/plans)** | Frequent | 0% |
| **Détection imminence compactage** | 0% | 95%+ |
| **Backup success rate** | N/A | 99%+ |

---

## 🛡️ FAIL-SAFES

### Redondance
- **3 systèmes backup** : checkpoints + knowledge + transcripts
- **2 triggers** : automatique + manual
- **Validation croisée** : MD5 + coherence + completeness

### Recovery modes
```bash
NIVEAU 1: Restore dernier checkpoint (< 10 interactions perdues)
NIVEAU 2: Rebuild depuis knowledge layer (faits essentiels)  
NIVEAU 3: Full restore depuis transcript (historique complet)
NIVEAU 4: Manual recovery via FOS-*.md files
```

---

## 🚀 ROADMAP IMPLÉMENTATION

### Phase 1 — Hooks & Checkpoints (Cette session)
- [x] Architecture définie
- [ ] Créer .fos/ structure  
- [ ] Implémenter hooks Claude Code
- [ ] Checkpoint automatique toutes les 10
- [ ] Test cycle complet

### Phase 2 — Dual-Layer Memory (Session suivante)
- [ ] Knowledge Layer avec distillation
- [ ] Transcript Layer avec search
- [ ] Intégration OMC project-memory
- [ ] Breadcrumbs sessions

### Phase 3 — Validation & Polish (Session suivante)
- [ ] Validation intégrité automatique
- [ ] Commandes utilisateur diagnostics
- [ ] Métriques monitoring
- [ ] Documentation complète

---

## 📊 IMPACT ATTENDU

**Foundation OS devient le premier OS IA-driven avec :**
- **Zéro perte contexte** → continuité parfaite workflow
- **Restoration < 30s** → productivité maintenue  
- **Memory intelligence** → patterns learned persistent
- **Fail-safe architecture** → robustesse enterprise

**Révolution :** De "compactage = sabotage" à "compactage = transparent"

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-04-04 | Création — Architecture hybride anti-compactage complète |