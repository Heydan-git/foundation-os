# /sync — Verifier la coherence du projet

Audit complet de coherence Foundation OS. Remplace l'ancien /sync-md.

## Execution

Lancer le script : `bash scripts/sync-check.sh`

Le script execute les sections 1, 2, 3, 4 (partielle), 6 du workflow ci-dessous en automatique :
- Section 1 (Structure racine) et la partie App Builder specifique sont couvertes via `scripts/health-check.sh`
- Section 2 (Modules vs CONTEXT.md) : verifie que chaque module actif a une reference dans CONTEXT.md
- Section 3 (References) : scan des suppressions du dernier commit (heuristique minimale, voir ref-checker backlog dans `docs/core/tools.md` pour un outil dedie)
- Section 4 (partielle — Routes) : parse la ligne `- **Routes**` de CONTEXT.md et compare avec `<Route path>` dans `modules/app/src/App.tsx`
- Section 6 (Core OS) : verifie la presence des 4 agents + 4 commands + 5 specs `docs/core/`

Sections encore manuelles (demandees a Claude) : 4 (reste — artifacts listes, builds time/tailles) et 5 (App Builder — fonts secondaires, verification visuelle).

Exit codes : 0 = SAIN, 1 = BROKEN, 2 = DEGRADED.

## Workflow

### 1. Structure racine
- Racine = seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore (+ dossiers attendus)
- Signaler tout fichier orphelin

### 2. Modules
- Lister modules/ sur le filesystem
- Comparer avec CONTEXT.md section Modules
- Signaler : module present sur disk mais pas dans CONTEXT.md, ou vice-versa

### 3. References
- Grep les noms de fichiers recemment supprimes/deplaces dans tout le projet
- Signaler les refs cassees (imports, liens MD, paths dans configs)

### 4. CONTEXT.md vs filesystem
- Status des modules : correspond a la realite ?
- Routes listees : existent dans le code ?
- Artifacts listes : existent sur le filesystem ?
- Builds : relancer et verifier les temps/tailles

### 5. App Builder specifique (si module app actif)
- MD pairs : `modules/app/data/*.md` alignes avec les artifacts archives `.archive/artifacts-jsx/fos-*.jsx`
- TSX < 700 lignes : `wc -l modules/app/src/pages/*.tsx modules/app/src/components/*.tsx`
- Void Glass : grep #0A0A0B, #08080A, Outfit, Inter dans src/
- Fonts : Figtree present, pas de police interdite en primaire
- Seuils bundle : source = `docs/core/monitor.md`

### 6. Core OS
- Specs dans docs/core/ coherentes avec .claude/agents/ et .claude/commands/
- Routing dans CLAUDE.md correspond a cortex.md

## Format de sortie

```
SYNC — [date]

[CRITICAL]
  [OK/KO] Build par module actif
  [OK/KO] Structure racine

[WARNING]
  [OK/WARN] JSX sizes (max N lignes)
  [OK/WARN] Void Glass (N violations)
  [OK/WARN] MD pairs (N orphelins)
  [OK/WARN] References (N cassees)

[INFO]
  [OK/WARN] CONTEXT.md sync modules
  [OK/WARN] Decisions datees (N/N)
  [OK] Bundle: NKB JS, NKB CSS

Verdict : SAIN / DEGRADED / BROKEN
[details si non SAIN]
```

- **SAIN** : zero critical, zero warning
- **DEGRADED** : zero critical, 1+ warning
- **BROKEN** : 1+ critical
