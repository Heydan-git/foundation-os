# /session-end — Cloturer une session Foundation OS

## Workflow

1. Lister les fichiers crees, modifies et supprimes dans cette session
2. Verifier la coherence :
   - Aucun nouveau fichier a la racine (sinon le deplacer)
   - Pas de references cassees (grep les noms de fichiers deplaces/supprimes)
   - Chaque fichier cree est dans le bon dossier
   - Modules dans CONTEXT.md correspondent a modules/ sur le filesystem
3. Verifier le build pour chaque module actif :
   - Detecter modules avec package.json dans modules/
   - `cd modules/[nom] && npm run build` pour chacun
4. Mettre a jour CONTEXT.md (protocole Memory — docs/core/memory.md) :
   - Ajouter cette session dans "Dernieres sessions" (garder max 5)
   - Mettre a jour "Prochaine action" avec la suite logique
   - Mettre a jour le status des modules si changement
   - Ajouter les nouvelles decisions si applicable (avec date YYYY-MM-DD)
   - Mettre a jour "Etat technique" si builds/routes/artifacts changent
   - Si un fondamental a change → mettre a jour aussi docs/ (reference tier)
5. Proposer un commit si des changements sont en attente
6. Annoncer en format court :

```
Session cloturee — [date]

Modifie : [liste fichiers]
Build : [OK/KO par module]
CONTEXT.md : mis a jour
Prochaine action : [quoi faire ensuite]
```
