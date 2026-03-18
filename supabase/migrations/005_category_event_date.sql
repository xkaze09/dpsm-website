-- Migration 005: article categories and event dates
--
-- Adds:
--   category   - controls which section of news.html the article appears in
--                'announcement' | 'event' | 'student_award'
--   event_date - used to automatically split events into Upcoming vs Previous
--
-- Also renames cover_image → image_url to match the frontend field name.

-- Rename cover_image → image_url
ALTER TABLE public.articles RENAME COLUMN cover_image TO image_url;

-- Add category column
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'announcement'
    CHECK (category IN ('announcement', 'event', 'student_award'));

-- Add event_date column (only relevant when category = 'event')
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS event_date DATE;

-- Index for category-filtered public queries
CREATE INDEX IF NOT EXISTS articles_category_status_idx
  ON public.articles (category, status, published_at DESC);
