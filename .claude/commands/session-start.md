# /session-start — Demarrer une session Foundation OS

## Workflow

1. Lire CONTEXT.md → etat actuel + prochaine action
2. Verifier la structure :
   - Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore
   - Pas de fichiers orphelins a la racine (sinon signaler)
3. Verifier l'etat technique :
   - `git status` : changements non commites ?
   - `cd modules/app && npm run build` : le build passe ?
4. Annoncer en format court :

```
Foundation OS — Session [date]

Modules : [status de chaque module actif]
Derniere session : [date + resume]
Build : [OK/KO]
Git : [propre / X fichiers non commites]
Prochaine action : [exactement quoi faire]

On y va ?
```

5. Attendre confirmation avant de commencer
