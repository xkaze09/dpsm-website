-- Migration 011: facilities table
-- Replaces hardcoded photos/captions in facilities.html with DB-backed CMS.

CREATE TABLE IF NOT EXISTS facilities (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  category     TEXT        NOT NULL
                           CHECK (category IN ('computer_labs','physics_labs','university')),
  name         TEXT        NOT NULL,
  location     TEXT,
  image_url    TEXT,
  caption      TEXT,
  sort_order   INT         NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER facilities_updated_at
  BEFORE UPDATE ON facilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public_read_facilities"
    ON facilities FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "admin_write_facilities"
    ON facilities FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
