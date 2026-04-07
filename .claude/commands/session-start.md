# /session-start — Demarrer une session Foundation OS

## Workflow

1. Lire CONTEXT.md → etat actuel + prochaine action
2. Detecter les modules actifs :
   - Lister modules/ → pour chaque sous-dossier avec package.json, c'est un module actif
   - Verifier que CONTEXT.md les liste tous
3. Verifier la structure :
   - Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore (+ dossiers)
   - Pas de fichiers orphelins a la racine (sinon signaler)
4. Verifier l'etat technique :
   - `git status` : changements non commites ?
   - Pour chaque module actif : `cd modules/[nom] && npm run build`
   - `bash scripts/health-check.sh` — si BROKEN, ne pas demarrer (signaler les erreurs critiques avant)
5. Annoncer en format court :

```
Foundation OS — Session [date]

Modules : [status de chaque module actif]
Derniere session : [date + resume]
Build : [OK/KO par module]
Git : [propre / X fichiers non commites]
Prochaine action : [exactement quoi faire]

On y va ?
```

6. Attendre confirmation avant de commencer
