# FOS-ERROR-LOG.md
> Log des erreurs Foundation OS
> À uploader dans Knowledge base du projet Claude.ai
> Mettre à jour à chaque erreur rencontrée

---

## Format d'entrée

```
[date] ERREUR: [description courte]
FIX: [ce qui a résolu le problème]
LEÇON: [ce qu'on retient pour CLAUDE.md]
---
```

---

## Log des erreurs

2026-04-03 ERREUR: Documentation BMAD v6 structure incorrecte
FIX: Corriger `ls _bmad/agents/` → `ls _bmad/core/bmad-distillator/agents/` + ajouter mention structure modulaire
LEÇON: BMAD v6 utilise structure modulaire avec agents dans _bmad/core/bmad-distillator/agents/, pas _bmad/agents/ direct
---

---

## Changelog

| Date | Modification |
|------|-------------|
| 2026-04-03 | Création — structure du log d'erreurs |