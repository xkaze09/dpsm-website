-- Migration 009: research_items table
-- Replaces the static researchData.json with a DB-backed CMS table.

CREATE TABLE research_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  section     TEXT        NOT NULL
                          CHECK (section IN ('research_projects','publications','conferences','public_service')),
  title       TEXT        NOT NULL,
  citation    TEXT,          -- for publications / conferences / public_service (contains [title] placeholder)
  authors     TEXT,          -- for research_projects
  dates       TEXT,          -- for research_projects
  link        TEXT        NOT NULL DEFAULT '',
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep updated_at current
CREATE TRIGGER research_items_updated_at
  BEFORE UPDATE ON research_items
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- RLS
ALTER TABLE research_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_research"
  ON research_items FOR SELECT
  USING (true);

CREATE POLICY "admin_write_research"
  ON research_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
