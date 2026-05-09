-- ============================================================
-- NutriCare — RESTORE ADMIN PROFILE
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Ensure the admin user has a profile with the correct role
INSERT INTO profiles (id, full_name, role)
SELECT id, 'مدير النظام', 'admin'
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = 'مدير النظام';

-- Verify it worked
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'admin@gmail.com';
SELECT * FROM profiles WHERE role = 'admin';