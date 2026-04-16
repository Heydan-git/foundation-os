# 11 — Architecture tech, data, QA, securite

Lentilles mobilisees : lead-dev, database-architect, devops-specialist, security-engineer, qa-specialist, fullstack-dev.

## 1. Architecture technique

### 1.1 Stack confirmee
- **Build** : Vite 5 + TypeScript 5 strict
- **UI** : React 18 + React Router 6
- **Styling** : Tailwind 3 + tokens DTCG semantic + Void Glass CSS layer
- **State** : Zustand (global) + React Query (server/async state) + React state (local)
- **Data parsing** : gray-matter (frontmatter YAML), remark (markdown), Fuse.js (fuzzy search)
- **Animation** : Framer Motion
- **Icones** : lucide-react
- **Forms** : react-hook-form + zod validation
- **Dates** : dayjs (lightweight)
- **Tests** : Vitest + Testing Library + Playwright (E2E)
- **Lint/Format** : ESLint + Prettier (config projet)
- **A11y** : axe-core/react en dev + @axe-core/playwright en CI

### 1.2 Structure de dossiers

```
modules/app/
├── src/
│   ├── app/                      # Routes React Router
│   │   ├── dashboard/            # Layout dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── home/
│   │   │   ├── pulse/
│   │   │   ├── modules/
│   │   │   ├── arsenal/
│   │   │   ├── plans/
│   │   │   ├── knowledge/
│   │   │   ├── lab/
│   │   │   ├── design-system/
│   │   │   ├── sessions/
│   │   │   └── memory/
│   ├── components/
│   │   ├── dashboard/            # Composants custom (HealthRing, ModuleCard...)
│   │   ├── layout/               # Layout parts (Sidebar, Header, Footer)
│   │   └── widgets/              # Widgets reutilisables
│   ├── lib/
│   │   ├── parsers/              # Parsers purs
│   │   │   ├── contextMd.ts
│   │   │   ├── planMd.ts
│   │   │   ├── tools.ts
│   │   │   ├── sessionLock.ts
│   │   │   └── ...
│   │   ├── data/                 # Read/write data/
│   │   ├── executors/            # Shell executors (health, git)
│   │   ├── events/               # EventBus Zustand
│   │   └── utils/
│   ├── hooks/                    # useFosSnapshot, useWatcher, useCmdK...
│   ├── providers/                # DataProvider, WatcherProvider, ThemeProvider
│   └── types/                    # Types TS partages
├── data/                         # Fichiers MD bidirectionnels (ideas, notes, inbox, briefs)
│   ├── ideas/
│   ├── notes/
│   ├── inbox/
│   ├── briefs/
│   └── settings.json
├── public/
│   └── fos-snapshot.json         # Pre-build snapshot (zero-serveur)
└── api/                          # Vercel Edge Functions OU Node endpoints (optionnel)
    ├── stream.ts                 # SSE
    ├── health.ts
    ├── lock.ts
    └── write.ts
```

### 1.3 Types TypeScript partages

```ts
// types/foundation.ts

export type ModuleStatus = 'ACTIF' | 'PREVU' | 'IDEE'
export type PlanStatus = 'IDEE' | 'BACKLOG' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
export type HealthVerdict = 'SAIN' | 'DEGRADED' | 'BROKEN'
export type LockOwner = 'cli' | 'cowork' | null

export interface Module {
  id: string
  name: string
  status: ModuleStatus
  path: string
  progression?: number
  description?: string
  metrics?: ModuleMetrics
}

export interface Plan {
  slug: string
  title: string
  date: string
  status: PlanStatus
  module?: string
  blocs: Bloc[]
  progression: number
  estimatedHours?: number
  filePath: string
}

export interface Bloc {
  id: string
  title: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  model?: 'haiku' | 'sonnet' | 'opus'
  subAgent?: boolean
  estimatedMinutes?: number
  deliverable: string
  observable: string
  dependencies?: string[]
}

export interface Decision {
  id: string // D-XXX
  date: string
  title: string
  detail?: string
}

export interface Idea {
  id: string
  date: string
  status: 'inbox' | 'triaged' | 'transformed' | 'archived'
  module?: string
  content: string
  impact?: number // 1-10
  effort?: number // 1-10
}

export interface InboxMessage {
  id: string
  date: string
  author: 'claude' | 'kevin'
  subject: string
  body: string
  read: boolean
  tags?: string[]
  module?: string
}

export interface FosSnapshot {
  generatedAt: string
  context: ContextData
  plans: Plan[]
  modules: Module[]
  tools: Tool[]
  skills: Skill[]
  agents: Agent[]
  commands: Command[]
  plugins: Plugin[]
  mcps: Mcp[]
  components: ComponentDs[]
  ideas: Idea[]
  notes: Note[]
  inbox: InboxMessage[]
  briefs: Brief[]
  health: HealthSnapshot
  lock: Lock
  git: GitSnapshot
  travauxCowork: TravailCowork[]
}
```

### 1.4 Pattern parseur
```ts
// lib/parsers/planMd.ts
import matter from 'gray-matter'
import { Plan, Bloc } from '@/types/foundation'

export function parsePlanMd(content: string, filePath: string): Plan {
  const { data, content: body } = matter(content)
  const blocs = extractBlocs(body)
  const progression = blocs.length
    ? Math.round((blocs.filter(b => b.status === 'DONE').length / blocs.length) * 100)
    : 0

  return {
    slug: extractSlug(filePath),
    title: data.title ?? 'Plan sans titre',
    date: data.date ?? 'unknown',
    status: data.status ?? 'BACKLOG',
    module: data.module,
    blocs,
    progression,
    estimatedHours: data.estimatedHours,
    filePath
  }
}
```

Chaque parseur a son fichier test `.test.ts` avec fixtures reelles.

### 1.5 EventBus (Zustand)
```ts
// lib/events/bus.ts
import { create } from 'zustand'

type FosEvent =
  | { type: 'fos:context-changed' }
  | { type: 'fos:plan-changed'; slug: string }
  | { type: 'fos:tool-added'; toolId: string }
  | { type: 'fos:data-changed'; kind: 'ideas' | 'notes' | 'inbox' | 'briefs' }
  | { type: 'fos:git-changed' }
  | { type: 'fos:health-checked'; verdict: HealthVerdict }
  | { type: 'fos:lock-changed'; lock: Lock }

interface BusState {
  last: FosEvent | null
  emit: (e: FosEvent) => void
}

export const useBus = create<BusState>((set) => ({
  last: null,
  emit: (e) => set({ last: e })
}))
```

Les pages souscrivent via `useBus(state => state.last)` et filtrent ce qui les concerne.

### 1.6 Providers

```tsx
<DataProvider>         {/* parse initial + React Query cache */}
  <WatcherProvider>    {/* HMR dev + polling/SSE prod */}
    <BusProvider>      {/* EventBus */}
      <LockProvider>   {/* session-lock state */}
        <ThemeProvider>
          <Router>...</Router>
        </ThemeProvider>
      </LockProvider>
    </BusProvider>
  </WatcherProvider>
</DataProvider>
```

## 2. Architecture data

### 2.1 Decision : zero base de donnees en v1
- **Source de verite** = filesystem (fichiers MD, JSON deja existants)
- **Donnees bidirectionnelles** = `modules/app/data/` (ideas, notes, inbox, briefs, settings)
- **Cache** = memoire client (React Query invalide sur mtime)

Supabase reste dispo pour modules downstream (Finance, Sante) mais dashboard n'en depend pas.

### 2.2 Schema des fichiers data/

#### data/ideas/YYYYMMDD-HHMMSS-slug.md
```md
---
id: idea-20260413-143022
date: 2026-04-13T14:30:22Z
status: inbox
module: dashboard
impact: 7
effort: 3
tags: [ux, auto-sync]
---

Detecter les plans stagnants > 7 jours et proposer une action.
```

#### data/inbox/YYYYMMDD-HHMMSS-from.md
```md
---
id: msg-20260413-180000-claude
date: 2026-04-13T18:00:00Z
author: claude
subject: Session terminee
read: false
tags: [session-end]
module: dashboard
---

Session 2026-04-13 terminee.
- B5, B6 livres (build vert en 3.2s)
- Decision D-041 ajoutee
- Prochain : B7 parser tools
```

#### data/notes/YYYYMMDD-slug.md
```md
---
id: note-20260413-design-tokens
date: 2026-04-13
title: Tokens DTCG a ajouter
tags: [design-system]
module: design-system
---

Tokens motion a creer : duration-{instant,fast,base,slow,breath}, ease-{standard,enter,exit,spring}.
```

#### data/briefs/module-X.md
```md
---
id: brief-finance
date: 2026-04-13
module: finance
status: draft
priority: P2
---

## Probleme
Gestion financiere personnelle cross-compte...

## Utilisateurs
Kevin (primary). Potentiellement Claude (analyst).

## Jobs-to-be-done
...
```

#### data/settings.json
```json
{
  "density": "confort",
  "animation": "standard",
  "a11y": { "fontSize": "base", "contrastBoost": false },
  "integrations": { "notion": false, "asana": false, "figma": false },
  "shortcuts": {},
  "visibleWidgets": { "orbes": true, "streaks": true }
}
```

### 2.3 Perf et volumetrie

Estimation volumetrique a 12 mois :
- Plans : ~30 (15kb avg) = 450kb
- Ideas : ~200 (2kb avg) = 400kb
- Inbox : ~500 (3kb avg) = 1.5MB
- Notes : ~100 (10kb avg) = 1MB
- Briefs : ~10 (20kb avg) = 200kb

**Total** : < 4MB. Parseable en < 500ms en memoire. Aucun besoin de DB.

Si depasse 10MB un jour : passage a Supabase envisage, schema bascule dans la meme structure.

### 2.4 Index search (Fuse.js)
Index construit au mount avec `fuzzyKeys`:
- Plans : title, module, body
- Decisions : id, title, detail
- Ideas : content, tags
- Notes : title, content
- Tools : name, description, category
- Skills : name, description, triggers
- Components : name, category

Total entries : ~500-1000. Re-indexe au `fos:*-changed`.

## 3. DevOps et deploiement

### 3.1 Pipeline CI/CD

#### GitHub Actions `.github/workflows/dashboard.yml`
```yaml
name: Dashboard CI

on:
  push:
    paths:
      - 'modules/app/**'
      - 'docs/**'
      - 'CONTEXT.md'
      - 'data/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd modules/app && npm ci
      - run: cd modules/app && npm run lint
      - run: cd modules/app && npm run typecheck
      - run: cd modules/app && npm run test
      - run: cd modules/app && npm run build
      - run: npx playwright install --with-deps
      - run: cd modules/app && npm run test:e2e
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:4173
          uploadArtifacts: true
      - run: npm run audit:a11y

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: vercel/actions@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 3.2 Hooks Git locaux

#### scripts/hooks/post-commit
```bash
#!/bin/bash
# Rafraichit le snapshot dashboard apres chaque commit
cd "$(git rev-parse --show-toplevel)"
node modules/app/scripts/generate-snapshot.js > modules/app/public/fos-snapshot.json
echo "$(date -Iseconds)" > .fos-last-change
```

#### scripts/generate-snapshot.js
Script node qui :
1. Lit tous les fichiers sources (CONTEXT.md, plans, tools, data/, ...)
2. Applique tous les parseurs
3. Agrege en un `FosSnapshot`
4. Ecrit en JSON dans `public/fos-snapshot.json`

Temps d'exec : < 2s pour etat actuel.

### 3.3 Vercel config
```json
{
  "buildCommand": "cd modules/app && npm run build && node scripts/generate-snapshot.js > public/fos-snapshot.json",
  "outputDirectory": "modules/app/dist",
  "framework": "vite",
  "functions": {
    "api/*.ts": { "runtime": "edge" }
  }
}
```

Snapshot regenere a chaque deploy. Pour refresh immediat, trigger webhook Vercel depuis le post-commit.

### 3.4 Preview branches
Chaque PR dashboard ouvre un preview Vercel automatique. Kevin peut reviewer sans merge.

### 3.5 Env vars
- `VITE_API_BASE` : URL API (optionnel, vide = pas de backend)
- `VITE_ENABLE_SSE` : 'true'/'false'
- `VITE_NOTION_ENABLED`, `VITE_ASANA_ENABLED`... : toggles integrations

Tout est optionnel. Par defaut le dashboard fonctionne en mode "static only".

## 4. Securite

### 4.1 Menaces identifiees et mitigations

| Menace | Niveau | Mitigation |
|--------|--------|------------|
| XSS via contenu MD | Moyen | Sanitize MD avec DOMPurify avant render, pas de `dangerouslySetInnerHTML` sans sanitize |
| Path traversal dans API write | Haut | Whitelist path: toute ecriture API doit matcher `/data/**/*.md` regex strict |
| Write race-condition CLI/Cowork | Haut | Verrou `.fos-session.lock` obligatoire avant write, reject si owner != self |
| Expose CONTEXT.md publiquement | Moyen | Dashboard deployee doit etre privee (auth Vercel password protect ou Supabase auth) |
| Injection dans frontmatter YAML | Faible | gray-matter safe loading (schema prevent eval) |
| Secrets committed dans data/ | Moyen | .gitignore sur data/private/, linter qui detecte patterns secrets |
| CSRF sur API write | Moyen | Token CSRF si API Node, sinon origin check strict |
| Clickjacking | Faible | Header `X-Frame-Options: DENY` |
| MITM | Faible | HTTPS obligatoire (Vercel natif) |

### 4.2 Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' fonts.googleapis.com;
font-src 'self' fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self' *.supabase.co api.github.com;
frame-ancestors 'none';
```

### 4.3 Authentification dashboard
- **Option A** : Vercel password protect (gratuit Pro)
- **Option B** : Supabase auth avec un seul user (Kevin)
- **Option C** : pas d'auth, usage local uniquement

Recommandation : Option B (coherent avec modules/app login existant).

### 4.4 Secrets
- Jamais dans commit
- `.env.local` dans .gitignore
- Prod : variables Vercel uniquement

### 4.5 Dependency audit
- `npm audit` dans CI
- Dependabot actif GitHub
- Renovate pour updates reguliers

## 5. Strategie QA et tests

### 5.1 Pyramide de tests

```
         /\
        /E2E\       ~10 scenarios (Playwright)
       /----\
      /Integ.\      ~30 tests (Vitest + Testing Library)
     /--------\
    / Unitaires\    ~100 tests (Vitest)
   /____________\
```

### 5.2 Tests unitaires
- Chaque parseur : 5-10 tests chacun (happy path + edge cases + malformed input)
- Utils : chaque fonction pure testee
- Hooks : tests isoles avec Testing Library hooks

Target coverage : > 80% sur `lib/` et `hooks/`.

### 5.3 Tests integration
- Rendu de chaque page avec mock data
- Interactions Cmd+K
- Drag & drop Kanban
- Formulaires Lab (create idea, send message)
- Edge cases : donnees vides, parser error, verrou actif

### 5.4 Tests E2E (Playwright)

Scenarios critiques :
1. Ouvrir dashboard, verifier Home rendue avec donnees reelles
2. Ouvrir Cmd+K, chercher "B7", naviguer vers plan correspondant
3. Creer une idea (Cmd+I), verifier fichier cree
4. Drag plan card entre colonnes, verifier frontmatter update
5. Verrou actif CLI : tenter ecriture, confirmer refus gracieux
6. Modifier tools/index.json, verifier auto-refresh /arsenal/tools
7. Commit (simule) → verifier event `fos:git-changed` → Home se reloade
8. Navigation clavier complete : Tab de sidebar a main content sans souris
9. axe-core sur chaque page : zero erreur critique
10. Changement settings density, verifier spacing applique

### 5.5 Tests visuel regression (optionnel v2)
Chromatic ou Percy sur composants critiques (HealthRing, ModuleCard, PlanCard) via Storybook.

### 5.6 Performance testing
- Lighthouse CI : Performance > 90, A11y > 95, Best Practices > 90, SEO > 80 sur Home
- Bundle size budget : main < 300kb gzip, total < 500kb gzip
- Lazy loaded chunks : < 100kb chacun

### 5.7 Mutation testing (optionnel v2)
Stryker sur parsers pour verifier robustesse des tests.

## 6. Observabilite en prod

### 6.1 Logs client
- Console.error sur parse failures
- Envoi optionnel a Sentry (desactive par defaut, toggle settings)

### 6.2 Metriques
- Vercel Analytics (anonymise) pour savoir quelles pages sont utilisees
- Pas de tracking utilisateur (Kevin seul)

### 6.3 Erreurs serveur (si API)
- Log dans Vercel logs
- Alerte email si > 5% error rate

## 7. Strategie de rollback

- Chaque deploy Vercel conserve un historique
- Rollback UI Vercel en 1 clic
- Branche `main` protegee : pas de force push, review requis

## 8. Documentation developpeur

Un `modules/app/README.md` dashboard-specific :
- Setup local (npm install, dev)
- Lancer les tests
- Structure dossiers
- Comment ajouter un nouveau parseur
- Comment ajouter une nouvelle page
- Comment ajouter un widget
- Convention commits (conventional commits, scope "dashboard")

## 9. Maintenance

### 9.1 Dependencies
- Audit mensuel npm audit + Dependabot
- Mise a jour majeure tous les 6 mois (React, Vite, etc.)

### 9.2 Nettoyage data/
Script `scripts/data-cleanup.sh` optionnel :
- Archive inbox > 90 jours dans `data/.archive/`
- Archive ideas status=archived > 180 jours
- Compresse notes anciennes

Executable manuellement, pas auto.

### 9.3 Evolution schema
Si un champ frontmatter change, script de migration one-shot :
- Lit tous les fichiers
- Ajoute/rename le champ
- Garde version schema dans frontmatter (`schemaVersion: 2`)

## 10. Checklist production-ready

- [ ] Tests : > 80% coverage, E2E greens
- [ ] A11y : axe-core zero erreur, Lighthouse A11y > 95
- [ ] Perf : Lighthouse Perf > 90, bundle < 500kb gzip
- [ ] Securite : CSP configure, audit clean, secrets hors repo
- [ ] Auth : mode prod protegee
- [ ] Monitoring : erreurs remontees
- [ ] Rollback : procedure documentee et testee
- [ ] Docs : README dev a jour
- [ ] Data : schema documente, migrations testees
- [ ] CI/CD : green sur main, preview branches OK
