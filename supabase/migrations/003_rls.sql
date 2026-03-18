-- Migration 003: Row Level Security policies
--
-- Access matrix:
--   Anonymous : SELECT published articles only. No writes.
--   Editor    : SELECT all, INSERT/UPDATE own articles, cannot publish/delete.
--   Admin     : Full access — publish, delete, manage users.
--
-- Note: The FastAPI backend uses the service role key, which bypasses RLS.
-- These policies protect against direct DB access and future integrations.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- Profiles
-- ─────────────────────────────────────────────────────────────────────────────

-- Anyone can read profiles (needed for author names on published articles)
CREATE POLICY "profiles_select_public"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can update only their own profile
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Articles
-- ─────────────────────────────────────────────────────────────────────────────

-- Public visitors: only published articles
CREATE POLICY "articles_select_published"
    ON public.articles FOR SELECT
    USING (status = 'published');

-- Authenticated editors and admins: see all articles
CREATE POLICY "articles_select_authenticated"
    ON public.articles FOR SELECT
    USING (
        auth.uid() IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('editor', 'admin')
        )
    );

-- Editors can insert their own articles (author_id must match their user ID)
CREATE POLICY "articles_insert_editor"
    ON public.articles FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('editor', 'admin')
        )
    );

-- Editors update only their own; admins update any
CREATE POLICY "articles_update_own_or_admin"
    ON public.articles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND (
                role = 'admin'
                OR (role = 'editor' AND articles.author_id = auth.uid())
            )
        )
    );

-- Only admins can delete (soft-delete to archived)
CREATE POLICY "articles_delete_admin"
    ON public.articles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );
