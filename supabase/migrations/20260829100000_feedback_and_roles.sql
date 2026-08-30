-- Migration: 20260829100000_feedback_and_roles.sql
-- Description: Add role and title to profiles, create user_feedbacks table with RLS security policies, and update security triggers.

-- 1. Add role and title columns to public.profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role text NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'title'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN title text NULL DEFAULT 'Novato del Kanji';
    END IF;
END $$;

-- 2. Update existing admin profiles (izeki / izekitecheng@gmail.com and jesus.riverarm+izekki@gmail.com)
UPDATE public.profiles
SET role = 'admin', title = 'Gran Maestro del Kanji'
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email IN ('izekitecheng@gmail.com', 'jesus.riverarm+izekki@gmail.com')
) OR username IN ('izeki', 'YisusSlap');

-- 3. Update handle_new_user() trigger function to provision default role & title
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    username,
    avatar_url,
    level,
    experience,
    games_played,
    correct_answers,
    wrong_answers,
    role,
    title
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    NULL,
    1,
    0,
    0,
    0,
    0,
    'player',
    'Novato del Kanji'
  );

  RETURN new;
END;
$$;

-- 4. Update protect_profile_stats() trigger function to prevent client tampering of role & stats
CREATE OR REPLACE FUNCTION public.protect_profile_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Allow internal updates from trusted SECURITY DEFINER RPCs/triggers
    IF current_setting('app.internal_rpc_call', true) = 'true' THEN
        RETURN NEW;
    END IF;

    -- Block direct client modification of stats & role
    IF current_user IN ('authenticated', 'anon') OR (current_setting('role', true) IN ('authenticated', 'anon')) THEN
        IF (OLD.experience IS DISTINCT FROM NEW.experience) OR
           (OLD.level IS DISTINCT FROM NEW.level) OR
           (OLD.correct_answers IS DISTINCT FROM NEW.correct_answers) OR
           (OLD.wrong_answers IS DISTINCT FROM NEW.wrong_answers) OR
           (OLD.games_played IS DISTINCT FROM NEW.games_played) OR
           (OLD.role IS DISTINCT FROM NEW.role) THEN
            RAISE EXCEPTION 'Direct client modification of protected profile fields (experience, level, correct_answers, wrong_answers, games_played, role) is forbidden.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- 5. Helper function is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 6. Create public.user_feedbacks table
CREATE TABLE IF NOT EXISTS public.user_feedbacks (
    id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL DEFAULT auth.uid(),
    category text NOT NULL CHECK (category IN ('bug', 'word_error', 'suggestion', 'other')),
    message text NOT NULL,
    word_id uuid REFERENCES public.words(id) ON DELETE SET NULL,
    sentence_id uuid REFERENCES public.sentences(id) ON DELETE SET NULL,
    route text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'discarded')),
    admin_notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure FK points to public.profiles(user_id)
DO $$
BEGIN
    ALTER TABLE public.user_feedbacks DROP CONSTRAINT IF EXISTS user_feedbacks_user_id_fkey;
    ALTER TABLE public.user_feedbacks ADD CONSTRAINT user_feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- 7. Add performance indexes for user_feedbacks
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_user_id ON public.user_feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_status ON public.user_feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_category ON public.user_feedbacks(category);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_created_at ON public.user_feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_word_id ON public.user_feedbacks(word_id);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_sentence_id ON public.user_feedbacks(sentence_id);

-- 8. Enable Row Level Security (RLS) on public.user_feedbacks
ALTER TABLE public.user_feedbacks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplication
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.user_feedbacks;
DROP POLICY IF EXISTS "Admins can view all feedbacks" ON public.user_feedbacks;
DROP POLICY IF EXISTS "Users can view own feedbacks or admins can view all" ON public.user_feedbacks;
DROP POLICY IF EXISTS "Admins can update feedbacks" ON public.user_feedbacks;
DROP POLICY IF EXISTS "Admins can delete feedbacks" ON public.user_feedbacks;

-- Policy: Authenticated users can insert feedback
CREATE POLICY "Authenticated users can insert feedback"
ON public.user_feedbacks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view own feedbacks and admins can view all feedbacks
CREATE POLICY "Users can view own feedbacks or admins can view all"
ON public.user_feedbacks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Policy: Admins can update feedbacks
CREATE POLICY "Admins can update feedbacks"
ON public.user_feedbacks
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy: Admins can delete feedbacks
CREATE POLICY "Admins can delete feedbacks"
ON public.user_feedbacks
FOR DELETE
TO authenticated
USING (public.is_admin());
