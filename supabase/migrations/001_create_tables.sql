-- Foundation OS Tables Migration
-- Creates all tables needed for write capability

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════════
-- SESSIONS TABLE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  items TEXT,
  decisions TEXT,
  phase TEXT,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active'
);

-- Sessions RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_policy" ON sessions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "sessions_insert_policy" ON sessions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "sessions_update_policy" ON sessions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Sessions indexes
CREATE INDEX idx_sessions_date ON sessions (date);
CREATE INDEX idx_sessions_status ON sessions (status);
CREATE INDEX idx_sessions_phase ON sessions (phase);

-- ══════════════════════════════════════════════════════════════
-- DECISIONS TABLE (ADR)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  context TEXT,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('active', 'superseded', 'deprecated')) DEFAULT 'active'
);

-- Decisions RLS
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decisions_select_policy" ON decisions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "decisions_insert_policy" ON decisions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "decisions_update_policy" ON decisions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Decisions indexes
CREATE INDEX idx_decisions_date ON decisions (date);
CREATE INDEX idx_decisions_impact ON decisions (impact);
CREATE INDEX idx_decisions_status ON decisions (status);

-- ══════════════════════════════════════════════════════════════
-- RISKS TABLE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  risk TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  proba TEXT CHECK (proba IN ('high', 'medium', 'low')) DEFAULT 'medium',
  mitigation TEXT,
  status TEXT CHECK (status IN ('open', 'mitigated', 'closed')) DEFAULT 'open'
);

-- Risks RLS
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "risks_select_policy" ON risks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "risks_insert_policy" ON risks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "risks_update_policy" ON risks
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Risks indexes
CREATE INDEX idx_risks_impact ON risks (impact);
CREATE INDEX idx_risks_proba ON risks (proba);
CREATE INDEX idx_risks_status ON risks (status);

-- ══════════════════════════════════════════════════════════════
-- NEXT STEPS TABLE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE next_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  label TEXT NOT NULL,
  phase TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
  sort_order INTEGER DEFAULT 0
);

-- Next Steps RLS
ALTER TABLE next_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "next_steps_select_policy" ON next_steps
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "next_steps_insert_policy" ON next_steps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "next_steps_update_policy" ON next_steps
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Next Steps indexes
CREATE INDEX idx_next_steps_status ON next_steps (status);
CREATE INDEX idx_next_steps_priority ON next_steps (priority);
CREATE INDEX idx_next_steps_phase ON next_steps (phase);
CREATE INDEX idx_next_steps_sort_order ON next_steps (sort_order);

-- ══════════════════════════════════════════════════════════════
-- CONTEXT BLOCKS TABLE
-- ══════════════════════════════════════════════════════════════

CREATE TABLE context_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Context Blocks RLS
ALTER TABLE context_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "context_blocks_select_policy" ON context_blocks
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "context_blocks_insert_policy" ON context_blocks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "context_blocks_update_policy" ON context_blocks
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Context Blocks indexes
CREATE INDEX idx_context_blocks_sort_order ON context_blocks (sort_order);

-- ══════════════════════════════════════════════════════════════
-- DOCS TABLE (for future use)
-- ══════════════════════════════════════════════════════════════

CREATE TABLE docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT[],
  sort_order INTEGER DEFAULT 0
);

-- Docs RLS
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "docs_select_policy" ON docs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "docs_insert_policy" ON docs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "docs_update_policy" ON docs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Docs indexes
CREATE INDEX idx_docs_category ON docs (category);
CREATE INDEX idx_docs_tags ON docs USING GIN (tags);
CREATE INDEX idx_docs_sort_order ON docs (sort_order);

-- ══════════════════════════════════════════════════════════════
-- FUNCTIONS AND TRIGGERS
-- ══════════════════════════════════════════════════════════════

-- Function to automatically update sort_order
CREATE OR REPLACE FUNCTION update_sort_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sort_order IS NULL THEN
    CASE TG_TABLE_NAME
      WHEN 'next_steps' THEN
        NEW.sort_order := COALESCE((SELECT MAX(sort_order) FROM next_steps), 0) + 1;
      WHEN 'context_blocks' THEN
        NEW.sort_order := COALESCE((SELECT MAX(sort_order) FROM context_blocks), 0) + 1;
      WHEN 'docs' THEN
        NEW.sort_order := COALESCE((SELECT MAX(sort_order) FROM docs), 0) + 1;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER next_steps_sort_order_trigger
  BEFORE INSERT ON next_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_sort_order();

CREATE TRIGGER context_blocks_sort_order_trigger
  BEFORE INSERT ON context_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_sort_order();

CREATE TRIGGER docs_sort_order_trigger
  BEFORE INSERT ON docs
  FOR EACH ROW
  EXECUTE FUNCTION update_sort_order();

-- ══════════════════════════════════════════════════════════════
-- INITIAL DATA SEEDING
-- ══════════════════════════════════════════════════════════════

-- Insert seed session
INSERT INTO sessions (date, title, items, decisions, phase, status) VALUES
(
  '2026-04-04',
  'Phase 1 Write Capability - Tables Creation',
  'Création tables Supabase · Authentication setup · CRUD mutations · Forms UI',
  'Architecture 5-tables validée · RLS policies appliquées · Mock → Real DB transition',
  '01',
  'active'
);

-- Insert seed decisions
INSERT INTO decisions (date, title, context, impact, status) VALUES
(
  '2026-04-04',
  'Architecture 5-tables Foundation OS',
  'Sessions, Decisions, Risks, Next Steps, Context Blocks, Docs. RLS pour sécurité. UUID auto-generated.',
  'high',
  'active'
),
(
  '2026-04-04',
  'Migration mock → real database',
  'Transition des mutations mock vers vraies opérations Supabase avec RLS policies.',
  'high',
  'active'
);

-- Insert seed next steps
INSERT INTO next_steps (label, phase, priority, status, sort_order) VALUES
('Tester mutations.ts avec vraies tables', '01', 'high', 'todo', 1),
('Valider RLS policies fonctionnelles', '01', 'high', 'todo', 2),
('Intégrer forms dans artifacts existants', '01', 'medium', 'todo', 3),
('Setup protected routes', '01', 'medium', 'todo', 4),
('Audit final Phase 1 completion', '01', 'critical', 'todo', 5);

-- Insert seed risks
INSERT INTO risks (risk, impact, proba, mitigation, status) VALUES
(
  'Tables Supabase non créées côté production',
  'high',
  'medium',
  'Vérifier deployment Supabase + run migrations',
  'open'
),
(
  'Mock mutations cached dans browser',
  'medium',
  'medium',
  'Clear localStorage + hard refresh après migration',
  'open'
);

-- Insert context block
INSERT INTO context_blocks (label, content, sort_order) VALUES
(
  'Phase 1 Architecture',
  'Foundation OS write capability: Mock → Real DB transition. Tables créées avec RLS. Authentication Supabase intégré. Forms UI Void Glass compliant.',
  1
);

COMMENT ON TABLE sessions IS 'Foundation OS sessions tracking';
COMMENT ON TABLE decisions IS 'Architecture Decision Records (ADR)';
COMMENT ON TABLE risks IS 'Risk management and mitigation';
COMMENT ON TABLE next_steps IS 'Actionable tasks and todos';
COMMENT ON TABLE context_blocks IS 'Knowledge blocks and documentation';
COMMENT ON TABLE docs IS 'Document management (future use)';

-- Verify tables created
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('sessions', 'decisions', 'risks', 'next_steps', 'context_blocks', 'docs')
ORDER BY tablename;