# Foundation OS — Decisions archivees

> Log des decisions stabilisees archivees depuis CONTEXT.md quand le seuil de 15 est franchi (protocole Memory — `docs/core/memory.md` section 3).
>
> Les decisions ici sont encore **actives** — elles continuent de guider le travail — mais elles sont sorties de la vue chaude de CONTEXT.md parce qu'elles ne bougent plus.

## Archivage 2026-04-07 — 7 decisions du 2026-04-01

Stabilisees depuis la creation du projet. Aucune modification enregistree.

| Decision | Date | Detail |
|----------|------|--------|
| Stack | 2026-04-01 | Vite + React + TS + Tailwind + Supabase + Vercel |
| Design | 2026-04-01 | Void Glass — docs/design-system.md |
| Architecture | 2026-04-01 | Monorepo modules/ (seul app/ existe, finance et sante prevus) |
| Commits | 2026-04-01 | Conventional commits type(scope): description |
| Anti-bullshit | 2026-04-01 | 6 gates dans CLAUDE.md, mots interdits, verification obligatoire |
| Garde-fous | 2026-04-01 | Jamais de fichier a la racine, jamais sans demande, grep+fix apres rename |
| Schema DB | 2026-04-01 | supabase/migrations/001_create_tables.sql = source de verite (6 tables) |

## Protocole

Quand CONTEXT.md depasse 15 decisions actives :
1. Identifier les decisions stables (pas touchees depuis ~30 jours)
2. Les deplacer ici en ajoutant une section `## Archivage YYYY-MM-DD — N decisions`
3. Laisser les decisions recentes et actives dans CONTEXT.md
4. Preserver le format table identique pour pouvoir les "unarchiver" si besoin
