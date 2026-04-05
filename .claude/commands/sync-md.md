# /sync-md — Verifier la coherence MD/JSX

Audit des paires MD data et JSX artifacts dans le module App Builder.

## Workflow

1. Lister les artifacts : `modules/app/src/artifacts/fos-*.jsx`
2. Lister les data MD : `modules/app/data/*.md`
3. Verifier chaque paire (artifact a un MD pair ? MD a un artifact ?)
4. Contraintes :
   - Chaque JSX < 700 lignes (wc -l)
   - Void Glass : fond #06070C, pas de #0A0A0B/#08080A
   - Fonts : Figtree, pas Outfit/Inter
5. Rapport

## Paires attendues

```
modules/app/data/commander.md  <->  modules/app/src/artifacts/fos-commander.jsx
modules/app/data/graph.md      <->  modules/app/src/artifacts/fos-graph.jsx
modules/app/data/index.md      <->  modules/app/src/artifacts/fos-index.jsx
modules/app/data/sync.md       <->  modules/app/src/artifacts/fos-sync.jsx
modules/app/data/toolbox.md    <->  modules/app/src/artifacts/fos-toolbox.jsx
```

## Format de sortie

```
SYNC — [date]

[ok/nok] commander.md <-> fos-commander.jsx ([N] lignes)
[ok/nok] graph.md <-> fos-graph.jsx ([N] lignes)
...

Void Glass : [OK / violations]
Orphelins : [artifacts sans MD / MD sans artifact]
```
