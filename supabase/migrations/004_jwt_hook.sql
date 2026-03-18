-- Migration 004: Custom JWT claims hook
--
-- Embeds the user's role from the profiles table into the JWT at login time.
-- This eliminates a database query on every authenticated API request.
--
-- ┌──────────────────────────────────────────────────────┐
-- │           JWT CLAIMS FLOW                            │
-- │                                                      │
-- │  User logs in via Supabase Auth                      │
-- │       │                                              │
-- │       ▼                                              │
-- │  custom_access_token_hook() fires                    │
-- │       │                                              │
-- │       ▼                                              │
-- │  SELECT role FROM profiles WHERE id = user_id        │
-- │       │                                              │
-- │  role found ──▶ embed as JWT claim 'user_role'       │
-- │  role not found ──▶ JWT issued without user_role     │
-- │                     (FastAPI returns 401)            │
-- └──────────────────────────────────────────────────────┘
--
-- MANUAL SETUP REQUIRED after running this migration:
--   Supabase Dashboard → Authentication → Hooks
--   Enable "Custom Access Token Hook"
--   Select function: public.custom_access_token_hook

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    claims    jsonb;
    user_role text;
BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = (event ->> 'user_id')::uuid;

    claims := event -> 'claims';

    IF user_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    END IF;

    RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Grant execute to Supabase Auth service; revoke from public
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
