-- ============================================================
-- NutriCare — KILL HANGING QUERIES & FIX RLS
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Kill any hanging infinite loop queries (This unlocks the database)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active' 
  AND pid <> pg_backend_pid()
  AND query ILIKE '%profiles%';

-- 2. Drop the recursive RLS policies on profiles to STOP future loops
DROP POLICY IF EXISTS "admin_select_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;

-- 3. Create simple non-recursive policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Create safe RPC functions to let Admins read/manage data WITHOUT triggering RLS loops
CREATE OR REPLACE FUNCTION admin_get_users(user_role TEXT)
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Only return data if the caller is actually an admin
  SELECT p.* FROM profiles p
  WHERE (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
    AND p.role = user_role
  ORDER BY p.created_at DESC;
$$;

-- 5. Fix get_my_role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;
