-- ============================================================
-- تحقق من وجود الدالة وأعد إنشاءها إذا لزم الأمر
-- Run in: Supabase → SQL Editor
-- ============================================================

-- Re-create the function (safe to run multiple times)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Test it (run this WHILE LOGGED IN to your Supabase project)
-- It should return 'admin' for your admin user
SELECT get_my_role();

-- Verify the admin profile exists
SELECT id, full_name, role FROM profiles;
