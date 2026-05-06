-- ============================================================
-- NutriCare — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. PROFILES (extends auth.users) ─────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name       TEXT,
  phone           TEXT,
  age             INTEGER,
  weight          NUMERIC(5,2),
  height          NUMERIC(5,2),
  avatar_url      TEXT,
  treatment_phase TEXT CHECK (treatment_phase IN ('newly_diagnosed','chemotherapy','radiation','hormonal','recovery')),
  dietary_restrictions TEXT[] DEFAULT '{}',
  role            TEXT DEFAULT 'patient' CHECK (role IN ('patient','admin','specialist')),
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','banned')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── 2. MEAL LOGS ─────────────────────────────────────────────
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

-- ── 3. HYDRATION LOGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hydration_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml   INTEGER NOT NULL,
  logged_at   DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. JOURNAL ENTRIES ───────────────────────────────────────
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

-- ── 5. REMINDERS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reminders (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text            TEXT NOT NULL,
  time            TEXT,
  is_done         BOOLEAN DEFAULT FALSE,
  reminder_date   DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. RECIPES ───────────────────────────────────────────────
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

-- ── 7. ARTICLES / ADVICE ─────────────────────────────────────
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

-- ── 8. COMMUNITY POSTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body         TEXT NOT NULL,
  category     TEXT DEFAULT 'أسئلة عامة',
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes_count  INTEGER DEFAULT 0,
  is_flagged   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. POST LIKES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

-- ── 10. NOTIFICATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT,
  body       TEXT,
  type       TEXT DEFAULT 'general',
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users view own profile"  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- MEAL LOGS
CREATE POLICY "Own meal logs" ON meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view meals" ON meal_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- HYDRATION LOGS
CREATE POLICY "Own hydration" ON hydration_logs FOR ALL USING (auth.uid() = user_id);

-- JOURNAL ENTRIES
CREATE POLICY "Own journal" ON journal_entries FOR ALL USING (auth.uid() = user_id);

-- REMINDERS
CREATE POLICY "Own reminders" ON reminders FOR ALL USING (auth.uid() = user_id);

-- RECIPES (everyone reads approved, authors manage their own)
CREATE POLICY "Read approved recipes" ON recipes FOR SELECT USING (is_approved = TRUE OR auth.uid() = author_id);
CREATE POLICY "Authors manage recipes" ON recipes FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins manage recipes" ON recipes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ARTICLES
CREATE POLICY "Read published articles" ON articles FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins manage articles" ON articles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- COMMUNITY POSTS
CREATE POLICY "Read all posts" ON community_posts FOR SELECT USING (TRUE);
CREATE POLICY "Own posts CRUD" ON community_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins manage posts" ON community_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- POST LIKES
CREATE POLICY "Manage own likes" ON post_likes FOR ALL USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "Own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins send notifs" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ══════════════════════════════════════════════════════════════
-- SEED DATA — Sample recipes & articles (optional)
-- ══════════════════════════════════════════════════════════════

INSERT INTO recipes (title, prep_time, difficulty, tags, calories, protein, carbs, fat, image_url, is_approved)
VALUES
  ('حساء حريرة صحي', '40 دقيقة', 'سهل', ARRAY['حساء','نباتي'], 280, 15, 30, 5, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&fit=crop', TRUE),
  ('طاجين الخوخ بالدجاج', '60 دقيقة', 'متوسط', ARRAY['طاجين','غني بالبروتين'], 420, 35, 20, 12, 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop', TRUE),
  ('سلطة الأفوكادو والحمص', '20 دقيقة', 'سهل', ARRAY['سلطات','نباتي'], 310, 10, 18, 20, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&fit=crop', TRUE),
  ('عصير الشمندر والرمان', '10 دقائق', 'سهل', ARRAY['عصائر'], 120, 2, 25, 0, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&fit=crop', TRUE),
  ('شوفان بالتوت والمكسرات', '15 دقيقة', 'سهل', ARRAY['إفطار'], 380, 12, 45, 14, 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=400&fit=crop', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO articles (title, excerpt, category, author_name, image_url, read_time, is_published)
VALUES
  ('التغذية السليمة أثناء العلاج الكيماوي', 'يعد الحفاظ على وزن صحي وتناول العناصر الغذائية الصحيحة أمراً بالغ الأهمية خلال فترة العلاج...', 'التغذية', 'د. ليلى خليل', 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=400&fit=crop', '5 دقائق', TRUE),
  ('كيفية التعامل مع التعب والإرهاق', 'الإرهاق المرتبط بالسرطان هو العرض الجانبي الأكثر شيوعاً، إليك طرق فعالة للتعامل معه...', 'الأعراض الجانبية', 'د. سمير أحمد', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&fit=crop', '8 دقائق', TRUE),
  ('تمارين رياضية خفيفة لمرحلة التعافي', 'تساعد الحركة الخفيفة في تقليل التوتر وتحسين الدورة الدموية...', 'النشاط البدني', 'ك. فاطمة بن علي', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&fit=crop', '4 دقائق', TRUE)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════
-- HOW TO MAKE YOURSELF ADMIN
-- After signing up, run this query with your user ID:
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
-- ══════════════════════════════════════════════════════════════
