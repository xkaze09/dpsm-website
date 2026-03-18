-- Migration 001: profiles table
-- Links to Supabase Auth users. One profile per user.
-- Admin creates all accounts — no public signup.

CREATE TABLE IF NOT EXISTS public.profiles (
    id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    role         TEXT        NOT NULL CHECK (role IN ('admin', 'editor')),
    avatar_url   TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
