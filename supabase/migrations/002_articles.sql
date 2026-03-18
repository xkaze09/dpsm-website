-- Migration 002: articles table
--
-- Article status machine:
--
--   draft ──[admin publish]──▶ published
--     │                           │
--     └──[admin archive]──▶ archived ◀──[admin archive]──┘
--
-- Soft-delete only: DELETE sets status = 'archived', never hard-deletes.
-- Slug is auto-generated from title and locked after publish.
-- Content is stored as sanitized HTML (nh3-cleaned Quill output).

CREATE TABLE IF NOT EXISTS public.articles (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT        NOT NULL,
    slug         TEXT        UNIQUE NOT NULL,
    content      TEXT        NOT NULL,
    excerpt      TEXT        NOT NULL,
    cover_image  TEXT,
    author_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    status       TEXT        NOT NULL
                             CHECK (status IN ('draft', 'published', 'archived'))
                             DEFAULT 'draft',
    tags         TEXT[]      DEFAULT '{}',
    view_count   INT         DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for the most common public query: list published articles by date
CREATE INDEX IF NOT EXISTS articles_status_published_at_idx
    ON public.articles (status, published_at DESC);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
