-- Foundation OS Database Schema
-- Tables: sessions, decisions, risks, docs, context_blocks, next_steps

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  items TEXT,
  decisions TEXT,
  phase TEXT,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active'
);

-- Decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  context TEXT,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('active', 'superseded', 'deprecated')) DEFAULT 'active'
);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  risk TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  proba TEXT CHECK (proba IN ('high', 'medium', 'low')) DEFAULT 'medium',
  mitigation TEXT,
  status TEXT CHECK (status IN ('open', 'mitigated', 'closed')) DEFAULT 'open'
);

-- Docs table
CREATE TABLE IF NOT EXISTS docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fichier TEXT NOT NULL,
  type TEXT NOT NULL,
  statut TEXT NOT NULL,
  kb TEXT
);

-- Context blocks table
CREATE TABLE IF NOT EXISTS context_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Next steps table
CREATE TABLE IF NOT EXISTS next_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  phase TEXT,
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_steps ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on decisions" ON decisions FOR ALL USING (true);
CREATE POLICY "Allow all operations on risks" ON risks FOR ALL USING (true);
CREATE POLICY "Allow all operations on docs" ON docs FOR ALL USING (true);
CREATE POLICY "Allow all operations on context_blocks" ON context_blocks FOR ALL USING (true);
CREATE POLICY "Allow all operations on next_steps" ON next_steps FOR ALL USING (true);

-- Insert sample data for testing
INSERT INTO sessions (date, title, items, phase, status) VALUES
  ('2024-04-04', 'Session initiale Foundation OS', 'Setup projet • Configuration Supabase • Premier test', 'Phase 0', 'active'),
  ('2024-04-03', 'Architecture décisions', 'Stack technique • Structure données • Patterns UI', 'Phase 0', 'closed')
ON CONFLICT DO NOTHING;

INSERT INTO decisions (date, title, context, impact, status) VALUES
  ('2024-04-04', 'Stack technique: Vite + React + Supabase', 'Besoin de rapidité de développement et de flexibilité pour prototypage', 'high', 'active'),
  ('2024-04-04', 'Design System: Void Glass', 'UI cohérente avec fond sombre et éléments glassmorphism', 'medium', 'active')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_date ON decisions(date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);