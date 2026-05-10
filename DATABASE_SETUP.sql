-- =================================================================
-- NutriCare — COMPLETE DATABASE SETUP & FIXES
-- =================================================================
-- Run this in your Supabase SQL Editor to set up everything.
-- This file includes:
-- 1. Core Schema (Tables, Triggers)
-- 2. Security Functions (Role Checkers)
-- 3. RLS Policies (Stable, Non-Recursive)
-- 4. Initial Seed Data
-- =================================================================

-- ── 1. CORE TABLES ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name       TEXT,
  phone           TEXT,
  age             INTEGER,
  weight          NUMERIC(5,2),
  height          NUMERIC(5,2),
  avatar_url      TEXT,
  specialty       TEXT,
  bio             TEXT,
  treatment_phase TEXT CHECK (treatment_phase IN ('newly_diagnosed','chemotherapy','radiation','hormonal','recovery')),
  dietary_restrictions TEXT[] DEFAULT '{}',
  role            TEXT DEFAULT 'patient' CHECK (role IN ('patient','admin','specialist')),
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','banned')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type   TEXT CHECK (meal_type IN ('breakfast','lunch','dinner','snacks')) NOT NULL,
  food_name   TEXT NOT NULL,
  calories    INTEGER DEFAULT 0,
  protein     NUMERIC(6,2) DEFAULT 0,
  carbs       NUMERIC(6,2) DEFAULT 0,
  fat         NUMERIC(6,2) DEFAULT 0,
  logged_at   DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hydration_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml   INTEGER NOT NULL,
  logged_at   DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date  DATE DEFAULT CURRENT_DATE,
  mood        INTEGER CHECK (mood BETWEEN 0 AND 4),
  fatigue     INTEGER CHECK (fatigue BETWEEN 1 AND 10),
  symptoms    TEXT[] DEFAULT '{}',
  notes       TEXT,
  weight_kg   NUMERIC(5,2),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

CREATE TABLE IF NOT EXISTS reminders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text            TEXT NOT NULL,
  time            TEXT,
  is_done         BOOLEAN DEFAULT FALSE,
  reminder_date   DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] DEFAULT '{}',
  steps       TEXT[] DEFAULT '{}',
  prep_time   TEXT,
  difficulty  TEXT CHECK (difficulty IN ('سهل','متوسط','صعب')) DEFAULT 'سهل',
  tags        TEXT[] DEFAULT '{}',
  calories    INTEGER DEFAULT 0,
  protein     NUMERIC(6,2) DEFAULT 0,
  carbs       NUMERIC(6,2) DEFAULT 0,
  fat         NUMERIC(6,2) DEFAULT 0,
  image_url   TEXT,
  author_id   UUID REFERENCES profiles(id),
  is_approved BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  category     TEXT,
  author_name  TEXT,
  author_id    UUID REFERENCES profiles(id),
  image_url    TEXT,
  read_time    TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body         TEXT NOT NULL,
  category     TEXT DEFAULT 'أسئلة عامة',
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes_count  INTEGER DEFAULT 0,
  is_flagged   BOOLEAN DEFAULT FALSE,
  is_pinned    BOOLEAN DEFAULT FALSE,
  is_hidden    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT,
  body       TEXT,
  type       TEXT DEFAULT 'general',
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. SECURITY DEFINER FUNCTIONS ────────────────────────────────

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION admin_get_users(user_role TEXT)
RETURNS SETOF profiles LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT p.* FROM profiles p
  WHERE get_my_role() = 'admin' AND p.role = user_role
  ORDER BY p.created_at DESC;
$$;

-- ── 3. ROW LEVEL SECURITY (RLS) ──────────────────────────────────

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop all possible existing policies to start clean
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- PROFILES
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id OR get_my_role() = 'admin');
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR get_my_role() = 'admin');
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR get_my_role() = 'admin');
CREATE POLICY "profiles_delete_admin" ON profiles FOR DELETE USING (get_my_role() = 'admin');

-- ACTIVITY LOGS
CREATE POLICY "meal_logs_own" ON meal_logs FOR ALL USING (auth.uid() = user_id OR get_my_role() = 'admin');
CREATE POLICY "hydration_own" ON hydration_logs FOR ALL USING (auth.uid() = user_id OR get_my_role() = 'admin');
CREATE POLICY "journal_own" ON journal_entries FOR ALL USING (auth.uid() = user_id OR get_my_role() = 'admin');
CREATE POLICY "reminders_own" ON reminders FOR ALL USING (auth.uid() = user_id OR get_my_role() = 'admin');

-- CONTENT
CREATE POLICY "recipes_read" ON recipes FOR SELECT USING (is_approved = TRUE OR auth.uid() = author_id OR get_my_role() = 'admin');
CREATE POLICY "recipes_write" ON recipes FOR ALL USING (auth.uid() = author_id OR get_my_role() = 'admin');
CREATE POLICY "articles_read" ON articles FOR SELECT USING (is_published = TRUE OR get_my_role() = 'admin');
CREATE POLICY "articles_manage" ON articles FOR ALL USING (auth.uid() = author_id OR get_my_role() = 'admin');

-- COMMUNITY
CREATE POLICY "posts_read" ON community_posts FOR SELECT USING (TRUE);
CREATE POLICY "posts_write" ON community_posts FOR ALL USING (auth.uid() = user_id OR get_my_role() = 'admin');
CREATE POLICY "likes_own" ON post_likes FOR ALL USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_manage" ON notifications FOR ALL USING (auth.uid() = user_id OR get_my_role() = 'admin');

-- ── 4. TRIGGERS ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'patient')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 5. SEED DATA ──────────────────────────────────────────────────

INSERT INTO recipes (title, prep_time, difficulty, tags, calories, protein, carbs, fat, image_url, is_approved)
VALUES
  ('حساء حريرة صحي', '40 دقيقة', 'سهل', ARRAY['حساء','نباتي'], 280, 15, 30, 5, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&fit=crop', TRUE),
  ('طاجين الخوخ بالدجاج', '60 دقيقة', 'متوسط', ARRAY['طاجين','غني بالبروتين'], 420, 35, 20, 12, 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO articles (title, excerpt, category, author_name, image_url, read_time, is_published)
VALUES
  ('التغذية السليمة أثناء العلاج الكيماوي', 'يعد الحفاظ على وزن صحي وتناول العناصر الغذائية الصحيحة أمراً بالغ الأهمية...', 'التغذية', 'د. ليلى خليل', 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=400&fit=crop', '5 دقائق', TRUE)
ON CONFLICT DO NOTHING;
