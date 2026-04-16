# Monitor — Spec

Observabilite de Foundation OS. Health indicators, severite, commandes de verification.

## 1. Health Indicators

Chaque indicateur a une severite, une commande de verification, et un seuil.

### Critical (bloquant — a corriger avant tout commit)

| Indicateur | Commande | Seuil |
|------------|----------|-------|
| Build passe | `cd modules/[mod] && npm run build` | Exit 0 par module actif |
| Zero fichier a la racine | `ls -1 racine` | Seulement CLAUDE.md, CONTEXT.md, README.md, .gitignore |
| TypeScript compile | `cd modules/[mod] && npx tsc --noEmit` | Zero erreur |

### Warning (a corriger avant deploy)

| Indicateur | Commande | Seuil |
|------------|----------|-------|
| TSX < 700 lignes | `wc -l modules/app/src/pages/*.tsx modules/app/src/components/*.tsx` | Chaque fichier < 700 |
| Void Glass respecte | `grep -r "#0A0A0B\|#08080A\|Outfit\|Inter" modules/app/src/` | Zero match |
| MD pairs alignes | Comparer `modules/app/data/*.md` ↔ `.archive/artifacts-jsx/fos-*.jsx` | Chaque archive a son MD |
| Tests vitest passent | `cd modules/app && npm test` | Zero test en echec |
| Refs intactes | `grep -r` noms fichiers supprimes/deplaces | Zero ref cassee |

### Info (a noter, pas bloquant)

| Indicateur | Commande | Seuil |
|------------|----------|-------|
| CONTEXT.md a jour | Comparer modules/ ↔ section Modules | Correspondance |
| Decisions datees | Lire section Decisions | Toutes ont une date |
| Build time | Lire output build | < 2000ms (baseline: ~800ms) |
| Bundle size | Lire output build | JS < 600KB, CSS < 40KB |
| Drift detector | `bash scripts/drift-detector.sh` | exit 0 = SYNC, exit 1 = drift detecte |
| Docs sync | `bash scripts/docs-sync-check.sh` | exit 0 = DOCS SYNC, exit 1 = drift |

## 2. Quand verifier

| Moment | Indicateurs a checker |
|--------|----------------------|
| /session-start | Critical + Info (build time) |
| /session-end | Critical + Warning |
| /sync | Tous (Critical + Warning + Info) |
| Pre-commit | Critical seulement |
| Pre-deploy | Critical + Warning |

## 3. Format de rapport

```
HEALTH — [date]

[CRITICAL]
  [OK] Build modules/app (784ms)
  [OK] Structure racine (3 fichiers)

[WARNING]
  [OK] TSX sizes (max 432 lignes)
  [OK] Void Glass (0 violation)
  [WARN] MD pairs — knowledge, scale-orchestrator sans MD
  [OK] Vitest — Tests  19 passed (19)

[INFO]
  [OK] CONTEXT.md sync
  [OK] Decisions datees (10/10)
  [OK] Bundle: 440KB JS, 21KB CSS

Verdict : SAIN / DEGRADED / BROKEN
```

- **SAIN** : zero critical, zero warning
- **DEGRADED** : zero critical, 1+ warning
- **BROKEN** : 1+ critical

## 4. Seuils d'alerte

Les seuils evoluent avec le projet. Quand un seuil change :
- Mettre a jour ce document
- Ajouter la raison du changement

Seuils actuels bases sur l'etat du 2026-04-15 (post-migration Desktop + lazy-load pages) :
- Build time baseline : ~280ms (alerte si > 2000ms)
- Bundle JS baseline : **~184KB** (chunk principal `index-*.js` apres lazy-load des 5 pages, alerte si > 600KB)
  - Detail : 184KB index + 130KB proxy vendor + 228KB supabase vendor (chunks separes, charges seulement quand utilises)
  - Pages lazy : 4-17KB chacune (Commander, IndexPage, KnowledgePage, LoginPage, ResetPasswordPage)
- Bundle CSS baseline : ~55KB (alerte si > 80KB — TODO investigation Tailwind purge)
- Modules actifs : 2 (app, design-system). Ajouter les nouveaux au fur et a mesure.
- Storybook stories : ~62 (53 DS + 9 app)

**Optimisation appliquee 2026-04-15** : lazy-load des 5 pages routes via React.lazy + Suspense dans App.tsx. Bundle initial divise par 3.3 (613 -> 184 KB), chunks vendors splittes automatiquement par Vite.

**Faux positifs ref-checker connus** (~10-15 refs persistantes, non-bloquants) :
- Refs textuelles vers l'ancien memory.md (renomme `docs/core/communication.md` 2026-04-10) dans docs qui documentent le rename
- Exemples de format scope dans naming-conventions (`docs/cockpit-desktop` = exemple, pas fichier)
- `modules/design-system/base DS/` (espace dans path = faux positif bash regex `=~`)
- `.env.local` gitignored
- Refs vers paths archives dans plans historiques (DS rebuild + voidglass SUPERSEDED)

Note : ces seuils sont la source de verite unique. `CLAUDE.md` (section Token-awareness) et `scripts/health-check.sh` (pre-commit) doivent s'y aligner.

## 5. Limites de Monitor

Ce que Monitor ne fait PAS :
- Execution automatique des checks (pas de cron/CI — c'est pour Tools Phase 4)
- Monitoring en production (uptime, errors — c'est Vercel/Supabase dashboard)
- Alertes push (notifications — pas encore implemente)

## Voir aussi

- [[tools]] — module Tools (scripts health-check, drift-detector)
- [[cortex]] — module Cortex (routing, orchestration)
