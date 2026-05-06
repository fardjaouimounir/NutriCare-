-- ====================================================
-- NutriCare — Complete RLS Fix (All Tables)
-- Run this in: Supabase Dashboard → SQL Editor
-- ====================================================

-- ── STEP 1: Drop ALL problematic recursive policies ──

-- Profiles
DROP POLICY IF EXISTS "Admins view all profiles"     ON profiles;
DROP POLICY IF EXISTS "Admins manage profiles"       ON profiles;
DROP POLICY IF EXISTS "Admins select all profiles"   ON profiles;
DROP POLICY IF EXISTS "Admins update all profiles"   ON profiles;
DROP POLICY IF EXISTS "Admins delete profiles"       ON profiles;

-- Meal logs
DROP POLICY IF EXISTS "Admins view meals"            ON meal_logs;

-- Hydration logs
DROP POLICY IF EXISTS "Admins view hydration"        ON hydration_logs;

-- Journal entries
DROP POLICY IF EXISTS "Admins view journals"         ON journal_entries;

-- Reminders
DROP POLICY IF EXISTS "Admins view reminders"        ON reminders;

-- ── STEP 2: Create Security Definer function (no recursion) ──

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ── STEP 3: Recreate admin policies using the function ──

-- PROFILES
CREATE POLICY "Admins select all profiles" ON profiles
  FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Admins update all profiles" ON profiles
  FOR UPDATE USING (get_my_role() = 'admin');

CREATE POLICY "Admins delete profiles" ON profiles
  FOR DELETE USING (get_my_role() = 'admin');

-- MEAL LOGS
CREATE POLICY "Admins view meals" ON meal_logs
  FOR SELECT USING (get_my_role() = 'admin');

-- HYDRATION LOGS
CREATE POLICY "Admins view hydration" ON hydration_logs
  FOR SELECT USING (get_my_role() = 'admin');

-- JOURNAL ENTRIES
CREATE POLICY "Admins view journals" ON journal_entries
  FOR SELECT USING (get_my_role() = 'admin');

-- REMINDERS
CREATE POLICY "Admins view reminders" ON reminders
  FOR SELECT USING (get_my_role() = 'admin');

-- ── STEP 4: Verify ──
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'meal_logs', 'hydration_logs', 'journal_entries', 'reminders')
ORDER BY tablename, cmd;
