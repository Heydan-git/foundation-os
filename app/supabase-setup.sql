-- Foundation OS Database Schema
-- Run this SQL in your Supabase SQL editor to create all required tables

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  items TEXT,
  decisions TEXT,
  phase TEXT,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active'
);

-- Decisions table (ADR)
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  context TEXT,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('active', 'superseded', 'deprecated')) DEFAULT 'active'
);

-- Risks table
CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  risk TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  proba TEXT CHECK (proba IN ('high', 'medium', 'low')) DEFAULT 'medium',
  mitigation TEXT,
  status TEXT CHECK (status IN ('open', 'mitigated', 'closed')) DEFAULT 'open'
);

-- Documents table
CREATE TABLE IF NOT EXISTS docs (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fichier TEXT NOT NULL,
  type TEXT NOT NULL,
  statut TEXT NOT NULL,
  kb TEXT
);

-- Context blocks table
CREATE TABLE IF NOT EXISTS context_blocks (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Next steps table
CREATE TABLE IF NOT EXISTS next_steps (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  phase TEXT,
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
  sort_order INTEGER DEFAULT 0
);

-- Enable Row Level Security (RLS) - important for production
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_steps ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for now (adjust for production)
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on decisions" ON decisions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on risks" ON risks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on docs" ON docs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on context_blocks" ON context_blocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on next_steps" ON next_steps FOR ALL USING (true) WITH CHECK (true);

-- Insert some seed data for testing
INSERT INTO sessions (id, date, title, items, decisions, phase, status) VALUES
('CONV-SEED-01', '2026-04-04', 'Database Setup Complete', 'Supabase tables created and configured', 'All CRUD operations ready', '01', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO decisions (id, date, title, context, impact, status) VALUES
('ADR-SEED-01', '2026-04-04', 'Supabase as Primary Database', 'Real-time capabilities and PostgreSQL power', 'high', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO next_steps (id, label, phase, priority, status, sort_order) VALUES
('NS-SEED-01', 'Test Phase 1 CRUD operations', '01', 'critical', 'todo', 1),
('NS-SEED-02', 'Validate all forms work correctly', '01', 'high', 'todo', 2),
('NS-SEED-03', 'Deploy to production', '01', 'medium', 'todo', 3)
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Foundation OS database setup complete! ✅' AS status;