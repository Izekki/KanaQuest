-- Migration: 20260829120000_daily_habit_streak.sql
-- Description: Add current_streak and last_active_date to public.profiles, update handle_new_user and protect_profile_stats triggers, and update handle_word_submission RPC for daily streak calculation.

-- 1. Add current_streak and last_active_date columns to public.profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'current_streak'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN current_streak integer NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_active_date'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN last_active_date date NULL;
    END IF;
END $$;

-- 2. Update handle_new_user() trigger function
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
    title,
    current_streak,
    last_active_date
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
    'Novato del Kanji',
    0,
    NULL
  );

  RETURN new;
END;
$$;

-- 3. Update protect_profile_stats() trigger function
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

    -- Block direct client modification of protected profile fields
    IF current_user IN ('authenticated', 'anon') OR (current_setting('role', true) IN ('authenticated', 'anon')) THEN
        IF (OLD.experience IS DISTINCT FROM NEW.experience) OR
           (OLD.level IS DISTINCT FROM NEW.level) OR
           (OLD.correct_answers IS DISTINCT FROM NEW.correct_answers) OR
           (OLD.wrong_answers IS DISTINCT FROM NEW.wrong_answers) OR
           (OLD.games_played IS DISTINCT FROM NEW.games_played) OR
           (OLD.role IS DISTINCT FROM NEW.role) OR
           (OLD.current_streak IS DISTINCT FROM NEW.current_streak) OR
           (OLD.last_active_date IS DISTINCT FROM NEW.last_active_date) THEN
            RAISE EXCEPTION 'Direct client modification of protected profile fields (experience, level, correct_answers, wrong_answers, games_played, role, current_streak, last_active_date) is forbidden.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- 4. Update handle_word_submission RPC to manage Daily Habit Streak
CREATE OR REPLACE FUNCTION public.handle_word_submission(
    p_word_id uuid, 
    p_mode text, 
    p_is_correct boolean,
    p_skip_xp boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    v_user_id uuid;
    v_reward_points integer := 0;
    v_xp_awarded integer := 0;
    v_award_id uuid := NULL;
    v_current_mastery integer := 0;
    v_new_total_xp integer := 0;
    v_new_level integer := 1;
    v_valid_word boolean := false;
    
    -- Streak calculation variables
    v_curr_streak integer := 0;
    v_last_active date := NULL;
    v_new_streak integer := 1;
    v_new_active_date date := CURRENT_DATE;
BEGIN
    -- Enable internal RPC flag for trigger bypass
    PERFORM set_config('app.internal_rpc_call', 'true', true);

    -- 1. Authenticate user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Validate word
    SELECT true, COALESCE(experience_reward, 10)
    INTO v_valid_word, v_reward_points
    FROM public.words
    WHERE id = p_word_id;

    IF NOT COALESCE(v_valid_word, false) THEN
        RAISE EXCEPTION 'Word with id % does not exist', p_word_id;
    END IF;

    -- 3. Validate mode
    IF p_mode NOT IN ('recognize', 'translate', 'sentence_builder', 'pair_match') THEN
        RAISE EXCEPTION 'Invalid mode: %', p_mode;
    END IF;

    -- 4. Atomic Upsert in public.progress
    INSERT INTO public.progress (
        user_id,
        word_id,
        mode,
        correct,
        attempts,
        mastery_level,
        last_attempt
    )
    VALUES (
        v_user_id,
        p_word_id,
        p_mode,
        p_is_correct,
        1,
        CASE WHEN p_is_correct THEN 1 ELSE 0 END,
        now()
    )
    ON CONFLICT (user_id, word_id, mode)
    DO UPDATE SET
        attempts = public.progress.attempts + 1,
        correct = (public.progress.correct OR EXCLUDED.correct),
        mastery_level = CASE 
            WHEN EXCLUDED.correct THEN LEAST(5, public.progress.mastery_level + 1)
            ELSE public.progress.mastery_level
        END,
        last_attempt = now()
    RETURNING mastery_level INTO v_current_mastery;

    -- 5. Calculate Daily Streak for user
    SELECT COALESCE(current_streak, 0), last_active_date
    INTO v_curr_streak, v_last_active
    FROM public.profiles
    WHERE user_id = v_user_id;

    IF v_last_active IS NULL THEN
        v_new_streak := 1;
        v_new_active_date := CURRENT_DATE;
    ELSIF v_last_active = CURRENT_DATE THEN
        v_new_streak := GREATEST(1, v_curr_streak);
        v_new_active_date := CURRENT_DATE;
    ELSIF v_last_active = (CURRENT_DATE - 1) THEN
        v_new_streak := v_curr_streak + 1;
        v_new_active_date := CURRENT_DATE;
    ELSE
        -- More than 1 day missed: reset streak to 1
        v_new_streak := 1;
        v_new_active_date := CURRENT_DATE;
    END IF;

    -- 6. Handle XP and word_experience_awards
    IF p_is_correct THEN
        IF NOT COALESCE(p_skip_xp, false) THEN
            INSERT INTO public.word_experience_awards (user_id, word_id, awarded_at)
            VALUES (v_user_id, p_word_id, now())
            ON CONFLICT (user_id, word_id) DO NOTHING
            RETURNING id INTO v_award_id;

            IF v_award_id IS NOT NULL THEN
                v_xp_awarded := v_reward_points;
            ELSE
                v_xp_awarded := 0;
            END IF;
        ELSE
            v_xp_awarded := 0;
        END IF;

        UPDATE public.profiles
        SET correct_answers = COALESCE(correct_answers, 0) + 1,
            current_streak = v_new_streak,
            last_active_date = v_new_active_date
        WHERE user_id = v_user_id
        RETURNING experience, level, current_streak, last_active_date 
        INTO v_new_total_xp, v_new_level, v_new_streak, v_new_active_date;
    ELSE
        v_xp_awarded := 0;

        UPDATE public.profiles
        SET wrong_answers = COALESCE(wrong_answers, 0) + 1,
            current_streak = v_new_streak,
            last_active_date = v_new_active_date
        WHERE user_id = v_user_id
        RETURNING experience, level, current_streak, last_active_date 
        INTO v_new_total_xp, v_new_level, v_new_streak, v_new_active_date;
    END IF;

    IF v_new_total_xp IS NULL THEN
        SELECT COALESCE(experience, 0), COALESCE(level, 1), COALESCE(current_streak, 1), last_active_date
        INTO v_new_total_xp, v_new_level, v_new_streak, v_new_active_date
        FROM public.profiles
        WHERE user_id = v_user_id;
    END IF;

    -- 7. Return response payload
    RETURN jsonb_build_object(
        'is_correct', p_is_correct,
        'xp_awarded', v_xp_awarded,
        'new_total_xp', COALESCE(v_new_total_xp, 0),
        'new_level', COALESCE(v_new_level, 1),
        'current_mastery', COALESCE(v_current_mastery, 0),
        'current_streak', COALESCE(v_new_streak, 1),
        'last_active_date', v_new_active_date
    );
END;
$function$;
