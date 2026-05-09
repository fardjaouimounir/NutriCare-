-- ============================================================
-- NutriCare — INFINITE LOOP FIX
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Drop the old function that was causing infinite recursion
DROP FUNCTION IF EXISTS get_my_role();

-- 2. Create a much safer version using plpgsql (prevents inlining)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- We query the profiles table securely.
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid() LIMIT 1;
  RETURN COALESCE(user_role, 'unknown');
END;
$$;

-- 3. Verify it works immediately
SELECT get_my_role();
