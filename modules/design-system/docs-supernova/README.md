# docs-supernova

Narratif DS destine a Supernova (design system public).

## Structure

```
docs-supernova/
├── foundations/       # 6 pages Colors / Typography / Spacing / Radius / Motion / Icons
└── components/        # 46 pages (1 par composant shadcn)
```

Les pages Components sont generees par le script `gen-component-docs.mjs` (dossier `../scripts/`) a partir d'un manifest + Storybook index.

## Regenerer les Components

```bash
cd modules/design-system
node scripts/gen-component-docs.mjs
```

## Pousser dans Supernova

Deux options :

### Option A — UI Supernova (verifie)
1. Ouvrir https://cloud.supernova.io
2. Workspace 735528 → Design System "Foundation OS DS" (790241)
3. Documentation → creer structure `Foundations` + `Components`
4. Coller le contenu markdown page par page
5. Publish

### Option B — SDK (experimental, requiert verification)
Le push programmatique via `@supernovaio/sdk` n'est pas verifie dans ce repo. Tentative possible mais non couverte par les tests — preferer Option A tant que non confirme.

## Pourquoi les composants n'apparaissent pas apres `supernova:import-storybook`

`storybook-import` embarque le Storybook comme iframe dans Supernova mais ne cree pas d'entites Component navigables dans le sidebar DS. Pour avoir une vraie navigation composant par composant, il faut creer des pages Documentation dediees (c'est ce que font les fichiers de `components/`).

## Env

Necessite `SUPERNOVA_TOKEN` pour les scripts `supernova:*`.

```bash
# modules/design-system/.env.local (gitignored)
SUPERNOVA_TOKEN=sn_...
```
