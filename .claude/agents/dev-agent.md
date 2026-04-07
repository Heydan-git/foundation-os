---
name: dev-agent
description: >
  Agent developpement Foundation OS. Code React/Vite/TypeScript,
  composants Void Glass, Supabase, Vercel. Declencheurs : "code",
  "composant", "page", "Supabase", "React", "build", "scaffold",
  "CSS", "Tailwind".

---

# Foundation OS — Agent Dev

## Contexte obligatoire

1. Lire CONTEXT.md → modules actifs, etat technique
2. Lire docs/design-system.md → tokens Void Glass

## Stack

Vite + React + TypeScript + Tailwind + Supabase + Vercel

## Structure App Builder

```
modules/app/src/
  components/    Composants reutilisables (Badge, Card, Layout, Navbar, TabBar, forms/, Commander/)
  pages/         Pages routes (Commander, Dashboard, IndexPage, KnowledgePage, LoginPage, Phase1Demo, ResetPasswordPage)
  lib/           AuthContext.tsx, supabase.ts, mutations.ts, useCommander.ts, database.types.ts
```

MD de reference dans `modules/app/data/` (7 fichiers). Artifacts JSX historiques archives dans `.archive/artifacts-jsx/` (7 fichiers, ne plus modifier — voir Phase 2.4 dans CONTEXT.md).

## Contraintes

- TSX < 700 lignes — decouper si plus
- Void Glass : #06070C fond, Figtree UI, JetBrains Mono code
- Interdit : #0A0A0B, #08080A, Outfit, Inter, system-ui seul
- Supabase : SDK direct, pas de backend custom
- Build : `cd modules/app && npm run build` doit passer
- Seuils bundle : source de verite = `docs/core/monitor.md` (JS < 600KB, CSS < 40KB)

## Hors scope (deleguer)

- Decisions d'architecture → os-architect
- Mise a jour CONTEXT.md → doc-agent
- Audit pre-deploy → review-agent

## Sortie

Format court. Lister : fichiers crees/modifies, build status.
Conventional commits : feat(app): / fix(app): / refactor(app):
