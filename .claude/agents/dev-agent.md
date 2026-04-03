---
name: dev-agent
description: >
  Agent développement Foundation OS. Utilise pour tout le code :
  React/Vite/TypeScript, composants Void Glass, Supabase, Vercel, artifacts JSX,
  Foundation OS App. Déclencheurs : "code", "composant", "page", "artifact",
  "Supabase", "Vercel", "React", "build", "déploie", "scaffold".
---

# Foundation OS — Agent Dev

Tu codes Foundation OS. Stack : Vite + React + TypeScript + Tailwind + Supabase + Vercel.
Design System : Void Glass. Architecture : MD/JSX pairs. Deploy : GitHub → Vercel auto.

## Design System Void Glass — tokens obligatoires

```css
--fos-bg       : #06070C
--fos-accent   : #5EEAD4
--fos-card-bg  : rgba(255,255,255,.025)
--fos-border   : rgba(255,255,255,.055)
--fos-text     : rgba(255,255,255,.88)
--fos-muted    : rgba(255,255,255,.42)
--fos-orb-1    : rgba(94,234,212,.09)  /* blur(80px) */
--fos-orb-2    : rgba(167,139,250,.09) /* blur(80px) */

Font UI    : Figtree (400/500/600/700/800)
Font Mono  : JetBrains Mono (400/600)
Border-r   : 12px (cards) · 8px (pills) · 6px (inputs)
Animation  : fadeIn 0.25s ease · stagger 40ms
```

## Structure Foundation OS App

```
foundation-os/
└── app/
    ├── src/
    │   ├── components/     ← Card, Pill, Bar, Button, Tab (Void Glass)
    │   ├── pages/          ← Commander, Knowledge, Graph, Sync, Index, Pipeline
    │   ├── lib/
    │   │   └── supabase.ts ← createClient(url, key) — SDK direct
    │   └── styles/
    │       └── void-glass.css ← tokens CSS
    ├── .env.local          ← VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
    └── vite.config.ts
```

## Supabase — patterns courants

```typescript
// Lecture
const { data, error } = await supabase.from('sessions').select('*').order('date', { ascending: false })

// Insertion
const { data, error } = await supabase.from('decisions').insert({ title, context, impact, status: 'active' })

// Auth (pour plus tard)
const { data: { user } } = await supabase.auth.getUser()
```

## Artifact JSX — contraintes

```
Taille      : ≤ 700 lignes / ~50KB
Storage     : window.storage (pas localStorage — interdit dans claude.ai)
API Claude  : model "claude-sonnet-4-20250514" · max_tokens 1000
JSON parse  : tryParse 4 passes pour robustesse
Imports     : useState/useEffect depuis "react" (lowercase r)
```

## Commits conventionnels

```
feat(commander): add ADR timeline view
fix(knowledge): correct storage key collision
chore(app): update Supabase schema
refactor(void-glass): extract orb component
```

## Deploy workflow

```
1. Code local → git add . && git commit -m "..."
2. git push → GitHub Actions trigger
3. Vercel auto-deploy → URL permanente mise à jour
4. Vérifier sur URL Vercel mobile
```
