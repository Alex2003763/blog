-- 建立 profiles 表格 (用於管理員權限)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立 posts 表格
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 啟用 RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Profiles 表的 RLS 政策
-- 允許使用者查看自己的 profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 允許使用者更新自己的 profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 允許插入新的 profile (註冊時)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts 表的 RLS 政策
-- 所有人都可以查看文章
CREATE POLICY "Anyone can view posts" ON public.posts
  FOR SELECT USING (true);

-- 只有管理員可以新增文章
CREATE POLICY "Only admins can insert posts" ON public.posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- 只有管理員可以更新文章
CREATE POLICY "Only admins can update posts" ON public.posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- 只有管理員可以刪除文章
CREATE POLICY "Only admins can delete posts" ON public.posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- 建立函數：當新使用者註冊時自動建立 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 建立觸發器：當 auth.users 有新記錄時執行
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 設定第一個管理員 (請將 'admin@example.com' 替換為您的管理員 email)
-- 注意：這個腳本需要在有使用者註冊後執行，或者您可以手動在 Supabase Dashboard 中設定
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE email = 'admin@example.com';
