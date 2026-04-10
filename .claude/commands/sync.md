# /sync — Verifier la coherence du projet

Audit complet de coherence Foundation OS.

## Execution

Lancer le script : `bash scripts/sync-check.sh`

Le script execute 6 checks automatiques (structure, modules, references, routes, fonts Void Glass, Core OS).

## Interpretation

Exit codes : 0 = SAIN, 1 = BROKEN, 2 = DEGRADED.

- **SAIN** : zero critical, zero warning — tout est coherent
- **DEGRADED** : zero critical, 1+ warning — fonctionnel mais a surveiller
- **BROKEN** : 1+ critical — a corriger avant de continuer

Si DEGRADED ou BROKEN, le script affiche les details des problemes detectes.
