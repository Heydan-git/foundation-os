# App Builder

Module React de Foundation OS. Voir `../../CONTEXT.md` pour l'etat global et les decisions.

## Stack

Vite + React 18 + TypeScript + Tailwind + react-router-dom 7 + Supabase + Vitest.
Design : Void Glass — voir `../../docs/design-system.md`.

## Commandes

```bash
npm run dev      # Dev local (Vite)
npm run build    # Production (tsc + vite build)
npm run preview  # Preview production locally
npm run test     # Vitest (run once)
npm run test:watch
npm run db:migrate
npm run db:reset
```

## Structure

- `src/pages/` — pages (1 par route)
- `src/components/` — composants partages (Navbar, Layout, Commander/, Badge, etc.)
- `src/lib/` — clients et helpers (supabase, hooks)
- `src/test/` — vitest specs
- `data/` — artifacts MD historiques (fige, voir `.archive/artifacts-jsx/`)

## Deploy

Vercel — root dir `modules/app`. Auto-deploy sur push `main`.

URL : https://foundation-os.vercel.app/
