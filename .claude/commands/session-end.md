# /session-end — Cloturer une session Foundation OS

## Workflow

1. Lister les fichiers crees, modifies et supprimes dans cette session
2. Verifier la coherence :
   - Aucun nouveau fichier a la racine (sinon le deplacer)
   - Pas de references cassees (grep les noms de fichiers deplaces/supprimes)
   - Chaque fichier cree est dans le bon dossier
3. Verifier le build : `cd modules/app && npm run build`
4. Mettre a jour CONTEXT.md :
   - Ajouter cette session dans "Dernieres sessions" (garder max 5)
   - Mettre a jour "Prochaine action" avec la suite logique
   - Mettre a jour le status des modules si changement
   - Ajouter les nouvelles decisions si applicable
5. Proposer un commit si des changements sont en attente
6. Annoncer en format court :

```
Session cloturee — [date]

Modifie : [liste fichiers]
Build : [OK/KO]
CONTEXT.md : mis a jour
Prochaine action : [quoi faire ensuite]
```
