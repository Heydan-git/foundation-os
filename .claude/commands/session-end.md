# /session-end — Cloturer une session Foundation OS

## Workflow

1. Lister les fichiers crees, modifies et supprimes dans cette session
2. Verifier la coherence :
   - Aucun nouveau fichier a la racine (sinon le deplacer)
   - Pas de references cassees (`bash scripts/ref-checker.sh` pour verifier)
   - Chaque fichier cree est dans le bon dossier
   - Modules dans CONTEXT.md correspondent a modules/ sur le filesystem
3. Verifier l'etat technique :
   - `bash scripts/health-check.sh` → doit etre SAIN (obligatoire). DEGRADED → statut DONE_WITH_CONCERNS + documenter le warning explicitement
   - Pour chaque module actif : `cd modules/[nom] && npm run build`
   - Pour chaque module actif : `cd modules/[nom] && npm test` si tests presents
4. **Classifier la session selon 4 niveaux** :

   | Statut | Quand l'utiliser | Action requise |
   |--------|------------------|----------------|
   | **DONE** | Toutes les taches finies, build + tests verts, health-check SAIN | Passer a la suite |
   | **DONE_WITH_CONCERNS** | Livre mais avec dette/risque a documenter (perf, edge case, build degrade) | Documenter les concerns dans CONTEXT.md, prefixer le resume avec `[DONE_WITH_CONCERNS]` |
   | **NEEDS_CONTEXT** | Bloque par manque d'info Kevin (decision, donnee, credentials) | Lister les questions dans CONTEXT.md, prefixer avec `[NEEDS_CONTEXT]` |
   | **BLOCKED** | Impossible de continuer (bug externe, dep cassee, API down) | Documenter le blocage + workaround tente, prefixer avec `[BLOCKED]` |

   Le statut se decide a partir des faits du step 3 (health-check, build, tests) et de l'etat des taches du plan en cours. Pas d'auto-congratulation : DONE n'est valide que si **tout** est vert et **toutes** les taches du scope ont ete livrees.

5. Mettre a jour CONTEXT.md (protocole Memory — docs/core/memory.md) :
   - Ajouter cette session dans "Dernieres sessions" (garder max 5) avec le statut prefixe entre crochets si != DONE
   - Mettre a jour "Prochaine action" avec la suite logique
   - Mettre a jour le status des modules si changement
   - Ajouter les nouvelles decisions si applicable (avec date YYYY-MM-DD)
   - Mettre a jour "Etat technique" si builds/routes/artifacts changent
   - Si un fondamental a change → mettre a jour aussi docs/ (reference tier)

5.5. Mettre a jour le Monitor Dashboard (`docs/monitor/data.js`) — edition additive :
   - `meta.updatedAt` = date du jour (YYYY-MM-DD)
   - `meta.updatedInSession` = libelle court de la session
   - `meta.nextAction` = prochaine action mise a jour (miroir step 5)
   - `plans[*].sessions` : append/update pour les sessions touchees
   - `plans[*].currentPhase` + `notes` si change
   - `recentSessions` : prepend nouvelle entree, pop la plus ancienne si > 5
   - `decisions` : append si nouvelle D-XXX
   - `modules` + `initiatives` : update si status change
   - Verification : ouvrir `docs/monitor/index.html`, verifier 0 erreur console

6. Proposer un commit si des changements sont en attente
7. Annoncer en format court :

```
Session cloturee — [date]
Statut : [DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED]

Modifie : [liste fichiers]
Build : [OK/KO par module]
Tests : [N tests, X failures]
Health-check : [SAIN/DEGRADED/BROKEN]
CONTEXT.md : mis a jour
Prochaine action : [quoi faire ensuite]
```

Si statut != DONE, ajouter une section :
```
Concerns / Questions / Blockage :
- [description du point d'attention]
- [workaround tente si BLOCKED]
```
