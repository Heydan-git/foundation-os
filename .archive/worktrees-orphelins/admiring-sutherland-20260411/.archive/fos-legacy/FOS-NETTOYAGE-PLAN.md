# FOS-NETTOYAGE-PLAN.md
> Plan nettoyage Foundation OS avant mémoire intelligente
> Créé : 2026-04-04 - Session anti-compactage
> Status : 📋 PLAN DÉFINI - Prêt exécution

---

## 🎯 POURQUOI NETTOYER AVANT MÉMOIRE INTELLIGENTE

**Problème identifié :**
- 458 fichiers MD (énorme pollution)
- 400 fichiers JSON (cache/temp/doublons)
- 79 fichiers racine pour 11 dossiers seulement
- Dossier "old artefacts" legacy
- Versions multiples (FOS-*-v2.md)

**Conséquence si pas nettoyé :**
- Mémoire vectorielle pollué par legacy
- Performance dégradée (index trop gros)
- Intelligence sur données obsolètes
- Maintenance complexe

**Avantage nettoyage first :**
- ✅ Index seulement info pertinente
- ✅ Performance optimale 
- ✅ Intelligence sur vraies données
- ✅ Structure claire long terme

---

## 📋 PLAN EXÉCUTION 4 PHASES

### PHASE 1 — AUDIT DÉTAILLÉ (5 min)
```bash
# Commandes audit complet :
find . -name "*.md" | grep -E "(v1|v2|old|backup|temp|archive|obsolete)" > audit_obsoletes.txt
find . -name "*duplicate*" -o -name "*copy*" -o -name "*bak*" >> audit_obsoletes.txt
du -sh * | sort -rh > audit_tailles.txt
ls -la *.md | wc -l && ls -la *.jsx | wc -l && ls -la *.json | wc -l
```

**Objectifs phase 1 :**
- [x] Identifier fichiers actifs vs obsolètes
- [x] Détecter doublons/versions multiples
- [x] Lister cache/temp à supprimer
- [x] Définir structure optimale finale

### PHASE 2 — BACKUP SÉCURISÉ (5 min)
```bash
# Créer archive avant suppression
mkdir -p .archive/{versions,legacy,temp,cache}

# Sauvegarder legacy
mv "old artefacts" .archive/legacy/
mv *-v2.md .archive/versions/ 2>/dev/null || true
mv *-v1.md .archive/versions/ 2>/dev/null || true

# Backup fichiers suspects
find . -name "*backup*" -o -name "*temp*" -o -name "*cache*" -exec mv {} .archive/temp/ \; 2>/dev/null || true

# Log des actions
echo "Archive créée $(date)" > .archive/ARCHIVE-LOG.md
```

**Objectifs phase 2 :**
- [ ] Créer .archive/ sécurisé
- [ ] Déplacer old artefacts/
- [ ] Archiver versions obsolètes (-v1, -v2)
- [ ] Log actions pour traçabilité

### PHASE 3 — NETTOYAGE INTELLIGENT (10 min)
```bash
# Supprimer doublons confirmés
# (Liste à définir après audit phase 1)

# Nettoyer node_modules cache
cd app && npm prune && cd ..

# Supprimer fichiers temp évidents
find . -name "*.tmp" -o -name "*.temp" -o -name "*.bak" -delete 2>/dev/null || true

# Organiser structure finale
mkdir -p docs/{archive,specs,plans}
```

**Structure finale cible :**
```
foundation-os/
├── FOS-JOURNAL.md (actif)
├── FOS-MONITORING.md (actif)  
├── FOS-COMMANDER-DATA.md (actif)
├── FOS-TOOLBOX-DATA.md (actif)
├── FOS-MEMORY-INTELLIGENCE-ROADMAP.md (nouveau)
├── FOS-ANTI-COMPACTAGE-ARCHITECTURE.md (nouveau)
├── CLAUDE.md (actif)
├── SKILL.md (actif)
├── fos-*.jsx (7 artifacts finaux)
├── app/ (clean)
├── scripts/ (clean)
├── .fos/ (système mémoire)
├── .claude/ (configuration)
├── .archive/ (legacy sécurisé)
└── docs/ (documentation organisée)
```

### PHASE 4 — VALIDATION & PRÉPARATION MÉMOIRE (5 min)
```bash
# Validation nettoyage
find . -name "*.md" | wc -l  # Cible : <20 fichiers
find . -name "*.jsx" | wc -l # Cible : 7 artifacts
du -sh . # Vérifier taille totale

# Test intégrité système
./scripts/fos-memory.sh validate
./scripts/fos-memory.sh health

# Préparer mémoire intelligente
echo "Structure propre validée - Ready for semantic memory" >> FOS-JOURNAL.md
```

**Objectifs phase 4 :**
- [ ] Valider réduction 458→<20 fichiers MD
- [ ] Confirmer 7 artifacts JSX seulement
- [ ] Test intégrité système complet
- [ ] Green light mémoire intelligente

---

## 🎯 CRITÈRES SUCCESS

| Métrique | Avant | Cible | Validation |
|----------|-------|-------|------------|
| **Fichiers MD** | 458 | <20 | `find . -name "*.md" \| wc -l` |
| **Fichiers JSON** | 400 | <50 | `find . -name "*.json" \| wc -l` |
| **Fichiers racine** | 79 | <30 | `ls -la \| wc -l` |
| **Dossiers legacy** | 1+ | 0 | Tout dans .archive/ |
| **Versions multiples** | Multiple | 0 | Pas de -v1/-v2 |
| **Taille projet** | ? | Optimisé | `du -sh .` |

---

## 🚨 GARDE-FOUS NETTOYAGE

### Avant suppression TOUJOURS :
1. **Backup dans .archive/** 
2. **Vérifier pas de référence dans code actif**
3. **Confirmer avec git status**
4. **Test système après chaque phase**

### Ne PAS supprimer :
- ✅ FOS-JOURNAL.md (historique sessions)
- ✅ FOS-MONITORING.md (métriques système)
- ✅ FOS-COMMANDER-DATA.md (ADR database)
- ✅ CLAUDE.md (configuration Claude Code)
- ✅ fos-*.jsx (artifacts finaux)
- ✅ app/ (application Foundation OS)
- ✅ .fos/ (système anti-compactage)
- ✅ .claude/ (configuration système)

### Supprimer OK :
- ❌ Versions multiples (-v1, -v2, etc.)
- ❌ "old artefacts" dossier complet
- ❌ Fichiers *backup*, *temp*, *cache*
- ❌ Doublons confirmés
- ❌ Documentation obsolète

---

## 🔄 APRÈS NETTOYAGE → MÉMOIRE INTELLIGENTE

Une fois structure propre :
1. **Install Chroma** : `pip install chromadb`
2. **Créer collections** pour conversations
3. **Index fichiers actifs** seulement
4. **Test semantic search** 
5. **Integration avec anti-compactage**

**Temps total :** 20 min nettoyage + 20 min mémoire = 40 min pour système parfait ! 🚀

---

## 📝 COMMANDES PRÊTES À EXÉCUTER

```bash
# PHASE 1 - Audit
find . -name "*.md" | grep -E "(v1|v2|old|backup|temp|archive)" > audit_obsoletes.txt
du -sh * | sort -rh > audit_tailles.txt
echo "=== AUDIT COMPLET ===" && wc -l audit_*.txt

# PHASE 2 - Backup  
mkdir -p .archive/{versions,legacy,temp}
mv "old artefacts" .archive/legacy/ 2>/dev/null || true
find . -maxdepth 1 -name "*v2.md" -exec mv {} .archive/versions/ \;

# PHASE 3 - Nettoyage (commandes précises après audit)
# À définir selon résultats audit

# PHASE 4 - Validation
./scripts/fos-memory.sh health
echo "Nettoyage terminé $(date)" >> FOS-JOURNAL.md
```

---

## Changelog

| Date | Action |
|------|--------|
| 2026-04-04 | Plan créé avant nettoyage projet Foundation OS |
| 2026-04-04 | Ready for execution après validation Kévin |