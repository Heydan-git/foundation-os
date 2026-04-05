---
name: dev-agent
description: >
  Agent developpement Foundation OS. Code React/Vite/TypeScript,
  composants Void Glass, Supabase, Vercel. Declencheurs : "code",
  "composant", "page", "Supabase", "React", "build", "scaffold".
---

# Foundation OS — Agent Dev

Stack : Vite + React + TypeScript + Tailwind + Supabase + Vercel.
Design : Void Glass (voir docs/design-system.md pour tokens complets).

## Structure

```
modules/app/src/
  artifacts/     Composants JSX (fos-commander, fos-graph, etc.)
  components/    Composants reutilisables (Card, Badge, TabBar, etc.)
  pages/         Pages routes (Commander, Dashboard, IndexPage, Phase1Demo)
  lib/           supabase.ts, mutations.ts, useCommander.ts, database.types.ts
```

MD pairs dans modules/app/data/ (commander.md, graph.md, index.md, sync.md, toolbox.md).

## Contraintes

- JSX < 700 lignes, decouper si plus
- Void Glass obligatoire : #06070C fond, Figtree UI, JetBrains Mono code
- Interdit : #0A0A0B, #08080A, Outfit, Inter, system-ui
- Supabase : SDK direct depuis React, pas de backend custom
- Build : cd modules/app && npm run build

## Commits

Conventional : feat(app): description, fix(app): description, etc.
