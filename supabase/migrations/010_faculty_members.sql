-- Migration 010: faculty_members table
-- Replaces the hardcoded sortMembers.js arrays with a DB-backed CMS table.

CREATE TABLE faculty_members (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  department       TEXT        NOT NULL
                               CHECK (department IN ('admin','appmath','cs','statistics','physics')),
  type             TEXT        NOT NULL DEFAULT 'faculty'
                               CHECK (type IN ('faculty','staff')),
  name             TEXT        NOT NULL,
  title            TEXT        NOT NULL DEFAULT '',
  degree           TEXT,
  university       TEXT,
  email            TEXT,
  image_url        TEXT,
  additional_title TEXT,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order       INT         NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER faculty_members_updated_at
  BEFORE UPDATE ON faculty_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE faculty_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_faculty"
  ON faculty_members FOR SELECT
  USING (true);

CREATE POLICY "admin_write_faculty"
  ON faculty_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
