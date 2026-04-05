# FOS-TECH-ARCHITECTURE.md
> Référence technique Foundation OS
> Architecture système · Stack · Schéma DB · API

---

## Stack Technique

### L0 — Design System
- **Void Glass** : #06070C · #5EEAD4 · rgba(255,255,255,.025)
- **Typography** : Figtree (UI) · JetBrains Mono (code/labels)
- **Radii** : 12/8/6px · blur(80px) orbes

### L1 — Intelligence Layers
- **L1a** : Claude.ai Projects (Knowledge Base ~20 MD)
- **L1b** : Cowork Desktop (BMAD v6 + SKILL.md)

### L2 — Development Environment
- **Claude Code** : Terminal L2 + OMC orchestration
- **Hooks** : MD-first · Void Glass · Conventional commits

### L3 — Workflow Automation
- **BMAD v6** : 12 modules + core distillator
- **Structure** : `_bmad/core/bmad-distillator/` + agents + scripts

### L4 — Collaboration Platforms
- **Notion** : M4 collaborative memory + project tracking
- **Asana** : M5 task tracking + metrics

### L5 — Application Runtime
- **Framework** : Vite + React + TypeScript
- **Styling** : Tailwind CSS
- **Backend** : Supabase (auth + DB + storage)
- **Deployment** : Vercel

### L6 — External Integrations
- **Context7** : 1000+ library docs (trust-scored)
- **MCP Servers** : Figma · Chrome · Computer-use
- **APIs** : Claude API · GitHub · Linear

---

## Database Schema (Supabase)

### Core Tables
```sql
-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text check (status in ('active', 'paused', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  title text not null,
  transcript jsonb,
  decisions jsonb,
  created_at timestamptz default now()
);

-- Artifacts
create table artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  name text not null,
  type text check (type in ('jsx', 'md', 'config')),
  content text,
  md_pair text, -- corresponding MD file path
  lines_count integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ADRs (Architecture Decision Records)
create table adrs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  number integer not null,
  title text not null,
  context text,
  decision text,
  status text check (status in ('proposed', 'accepted', 'superseded')),
  created_at timestamptz default now()
);
```

### Security (RLS)
```sql
-- Enable Row Level Security
alter table projects enable row level security;
alter table sessions enable row level security;
alter table artifacts enable row level security;
alter table adrs enable row level security;

-- Policies (public for now, will add auth later)
create policy "Public access" on projects for all using (true);
create policy "Public access" on sessions for all using (true);
create policy "Public access" on artifacts for all using (true);
create policy "Public access" on adrs for all using (true);
```

---

## API Endpoints

### Supabase Client (React)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Usage Patterns
```typescript
// Read projects
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .order('updated_at', { ascending: false })

// Create artifact with MD-first enforcement
const { data: artifact } = await supabase
  .from('artifacts')
  .insert({
    name: 'fos-example.jsx',
    md_pair: 'FOS-EXAMPLE-DATA.md',
    lines_count: lineCount,
    content: jsxContent
  })
```

---

## Deployment Architecture

### Vercel Configuration
```json
{
  "framework": "vite",
  "buildCommand": "cd app && npm run build",
  "outputDirectory": "app/dist",
  "installCommand": "cd app && npm install"
}
```

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx
```

### File Structure
```
foundation-os/
├── app/                    # Vite React app
│   ├── src/
│   │   ├── artifacts/     # 6 fos-*.jsx components
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utilities & Supabase client
├── scripts/hooks/         # Validation hooks
├── _bmad/                 # BMAD v6 modules
├── .omc/                  # OMC state & memory
└── *.md                   # Knowledge base files
```

---

## Performance & Monitoring

### Metrics Tracked
- **Build Time** : Vercel deployment duration
- **Bundle Size** : JavaScript bundle analysis
- **API Latency** : Supabase query performance
- **Error Rate** : Client-side error tracking
- **MD-JSX Sync** : Compliance with MD-first workflow

### Monitoring Stack
- **Error Logging** : FOS-ERROR-LOG.md → console.error()
- **Performance** : Vercel Analytics + Web Vitals
- **Uptime** : Vercel status + Supabase health

---

*Dernière mise à jour : 2026-04-04 · Version : 1.0.0*