# Foundation OS — Monitor Dashboard

Standalone HTML dashboard qui monitore tous les plans, modules, initiatives, decisions et sessions recentes de Foundation OS. Outil meta-OS interne, pas un livrable produit.

## Comment ouvrir

**Double-clic** (plus simple) : ouvrir `index.html` dans Finder.

**Serveur local** (si fonts CORS issues ou tokens.css absent) :

```bash
cd /Users/kevinnoel/foundation-os/docs/monitor
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

**Prerequis tokens** : le dashboard consomme `../../modules/design-system/tokens/build/tokens.css` (genere par Style Dictionary). Si absent, lancer :

```bash
cd /Users/kevinnoel/foundation-os/modules/design-system && npm run build:tokens
```

## Comment mettre a jour

L'update se fait **manuellement** a chaque `/session-end` (step 5.5 integree dans la skill).

Editer `docs/monitor/data.js`, objet `window.MONITOR_DATA` :

1. `meta.updatedAt` — YYYY-MM-DD du jour
2. `meta.updatedInSession` — libelle court de la session (ex: `"S8 Commands deep"`)
3. `meta.nextAction` — prochaine action apres cette session
4. `plans[*].sessions` — append/update status des sessions touchees
5. `plans[*].currentPhase` + `notes` — si change
6. `recentSessions` — prepend nouvelle entree, pop si > 5
7. `decisions` — append si nouvelle `D-XXX`
8. `modules` + `initiatives` — update si status change

**Verification** : ouvrir `index.html`, verifier 0 erreur console, verifier que les sections modifiees refletent les changements.

## Schema (data.js)

```js
window.MONITOR_DATA = {
  meta:       { version, updatedAt, updatedInSession, nextAction },
  plans:      [ { id, title, status, priority, path, progress, currentPhase, startedAt, sessions, notes } ],
  modules:    [ { id, name, status, detail } ],
  initiatives:[ { id, title, status, path, blockedBy, detail } ],
  decisions:  [ { id, date, title, summary } ],
  recentSessions: [ { date, tag, title, summary } ]  // max 5
}
```

### Enum `status`

| Status   | Quand                          | Couleur (token)                    |
|----------|--------------------------------|------------------------------------|
| DONE     | Termine, verifie               | `--fos-color-status-done`          |
| WIP      | En cours                       | `--fos-color-status-wip`           |
| PAUSED   | Commence, pause volontaire     | `--fos-color-status-paused`        |
| PENDING  | Pas commence                   | `--fos-color-text-muted`           |
| PARKING  | Gele externe                   | `--fos-color-status-parking`       |
| ARCHIVED | Abandonne                      | `--fos-color-status-archived`      |

### Regles de maintenance (D-MON-03)

- **Additif uniquement** : append aux tableaux, pas de restructuring
- **IDs stables** : une fois attribues, jamais changes
- **updatedAt + updatedInSession** obligatoires a chaque edit
- **recentSessions max 5** : prepend + pop

## Architecture

- **HTML** : `index.html` — skeleton 5 sections + loader `data.js` puis `render.js` (`defer` pour l'ordre)
- **Styles** : `style.css` (dashboard-specific) + `../../modules/design-system/tokens/build/tokens.css` (Void Glass, source unique DS)
- **Data** : `data.js` — `window.MONITOR_DATA` canonical, hand-editable
- **Render** : `render.js` — vanilla JS, pure DOM APIs (`createElement` / `textContent` / `appendChild`), zero `innerHTML` (compliance security hook)

**Zero build, zero dep, zero npm.** Ouvert en `file://` ou serveur static simple.

## Evolution future (hors v1)

- **v2** : script `scripts/build-monitor-data.js` qui parse `CONTEXT.md` tables + scanne `docs/plans/` pour auto-generer `data.js`. A construire si l'update manuel devient painful (> 5 min/session regulierement).
- **v2** : charts/historique/velocity si utile.
- **v2** : integration `modules/app` via iframe ou page dediee (out-of-scope v1, isolation stricte).

## Reference

- Spec : `docs/specs/2026-04-08-monitor-dashboard-design.md`
- Plan : `docs/plans/2026-04-08-monitor-dashboard-plan.md`
- Design System : `modules/design-system/` (tokens source unique)
