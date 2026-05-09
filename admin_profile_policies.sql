-- ====================================================
-- NutriCare — Allow Admin to Insert/Update any profile
-- Run in: Supabase → SQL Editor
-- ====================================================

-- Allow admin to insert profiles for new users
CREATE POLICY "Admins insert profiles" ON profiles
  FOR INSERT WITH CHECK (get_my_role() = 'admin');

-- Allow admin to update any profile  
CREATE POLICY "Admins update any profile" ON profiles
  FOR UPDATE USING (get_my_role() = 'admin');

-- Allow admin to delete any profile
CREATE POLICY "Admins delete any profile" ON profiles
  FOR DELETE USING (get_my_role() = 'admin');

-- Verify
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles' ORDER BY cmd;
