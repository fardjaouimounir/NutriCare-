-- ====================================================
-- NutriCare — Database Schema Additions
-- Run in: Supabase → SQL Editor
-- ====================================================

-- ── Add missing columns to existing tables ──

-- community_posts: pin and hide support
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- profiles: specialist fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;

-- articles: content field (full article text)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- recipes: additional fields
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS ingredients TEXT[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS steps TEXT[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── Verify structure ──
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'community_posts' 
ORDER BY ordinal_position;
