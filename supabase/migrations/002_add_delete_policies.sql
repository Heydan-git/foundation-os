-- Add DELETE RLS policies for all 6 tables
-- Fix F-S13-02: mutations.ts has deleteSession() and clearAllData() but no DELETE policies

CREATE POLICY "sessions_delete_policy" ON sessions
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "decisions_delete_policy" ON decisions
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "risks_delete_policy" ON risks
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "next_steps_delete_policy" ON next_steps
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "context_blocks_delete_policy" ON context_blocks
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "docs_delete_policy" ON docs
  FOR DELETE USING (auth.role() = 'authenticated');
