# /session-end — Clôturer une session Foundation OS

Exécuter ce workflow à la fin de chaque session de travail.

## Ce que fait cette commande

1. Liste tous les fichiers modifiés dans cette session
2. Vérifie que chaque JSX modifié a son MD pair à jour
3. Ajoute une entrée dans FOS-JOURNAL.md
4. Met à jour FOS-MONITORING.md si un statut a changé
5. Annonce la prochaine étape (une seule)

## Checklist avant de clôturer

```
□ Tous les fichiers MD modifiés ont été livrés
□ Chaque JSX touché a son NOM-DATA.md synchronisé
□ Décisions importantes tracées dans FOS-COMMANDER-DATA.md (ADR)
□ Erreurs rencontrées notées dans FOS-ERROR-LOG.md
□ FOS-MONITORING.md à jour si phase ou artifact a changé
```

## Format d'entrée FOS-JOURNAL.md à créer

```
### CONV-XX · [date] · [titre court]
**Items :**
- [item 1]
- [item 2]

**Décisions :**
- [ADR-XXX si applicable]

**Livrables :**
- [fichier1] · [fichier2]

---
```

## Output attendu

```
✅ Session clôturée — [date]

📁 Fichiers modifiés :
   - [fichier1] (v[X.X.X])
   - [fichier2]

📤 À uploader dans Claude.ai Projects KB :
   - [liste des nouveaux MDs si applicable]

⏭️ Prochaine étape : [UNE action, claire et précise]
```
