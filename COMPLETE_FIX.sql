-- ============================================================
-- NutriCare — COMPLETE FIX (Run this ENTIRE script at once)
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ── 1. Security Definer function (fixes recursive RLS) ──
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ── 2. Drop old conflicting policies ──
DROP POLICY IF EXISTS "Admins view all profiles"      ON profiles;
DROP POLICY IF EXISTS "Admins manage profiles"        ON profiles;
DROP POLICY IF EXISTS "Admins select all profiles"    ON profiles;
DROP POLICY IF EXISTS "Admins update all profiles"    ON profiles;
DROP POLICY IF EXISTS "Admins delete profiles"        ON profiles;
DROP POLICY IF EXISTS "Admins insert profiles"        ON profiles;
DROP POLICY IF EXISTS "Admins update any profile"     ON profiles;
DROP POLICY IF EXISTS "Admins delete any profile"     ON profiles;

-- ── 3. Create correct admin policies for profiles ──
CREATE POLICY "admin_select_profiles" ON profiles
  FOR SELECT USING (get_my_role() = 'admin' OR auth.uid() = id);

CREATE POLICY "admin_insert_profiles" ON profiles
  FOR INSERT WITH CHECK (get_my_role() = 'admin' OR auth.uid() = id);

CREATE POLICY "admin_update_profiles" ON profiles
  FOR UPDATE USING (get_my_role() = 'admin' OR auth.uid() = id);

CREATE POLICY "admin_delete_profiles" ON profiles
  FOR DELETE USING (get_my_role() = 'admin');

-- ── 4. Add missing columns ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS ingredients TEXT[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS steps TEXT[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── 5. Fix other table RLS policies ──
DROP POLICY IF EXISTS "Admins view meals"     ON meal_logs;
DROP POLICY IF EXISTS "Admins view hydration" ON hydration_logs;
DROP POLICY IF EXISTS "Admins view journals"  ON journal_entries;
DROP POLICY IF EXISTS "Admins view reminders" ON reminders;

CREATE POLICY "admin_view_meal_logs"       ON meal_logs       FOR SELECT USING (get_my_role() = 'admin' OR auth.uid() = user_id);
CREATE POLICY "admin_view_hydration_logs"  ON hydration_logs  FOR SELECT USING (get_my_role() = 'admin' OR auth.uid() = user_id);
CREATE POLICY "admin_view_journal_entries" ON journal_entries FOR SELECT USING (get_my_role() = 'admin' OR auth.uid() = user_id);

-- ── 6. Verify ──
SELECT 'get_my_role() = ' || COALESCE(get_my_role(), 'NULL (not logged in)') AS role_check;

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'meal_logs', 'hydration_logs', 'journal_entries')
ORDER BY tablename, cmd;
