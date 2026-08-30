-- Migration: 20260829110000_update_handle_word_submission_hint_support.sql
-- Description: Update handle_word_submission RPC to support p_skip_xp for hints.

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

    -- 5. Handle XP and word_experience_awards
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
        SET correct_answers = COALESCE(correct_answers, 0) + 1
        WHERE user_id = v_user_id
        RETURNING experience, level INTO v_new_total_xp, v_new_level;
    ELSE
        v_xp_awarded := 0;

        UPDATE public.profiles
        SET wrong_answers = COALESCE(wrong_answers, 0) + 1
        WHERE user_id = v_user_id
        RETURNING experience, level INTO v_new_total_xp, v_new_level;
    END IF;

    IF v_new_total_xp IS NULL THEN
        SELECT COALESCE(experience, 0), COALESCE(level, 1)
        INTO v_new_total_xp, v_new_level
        FROM public.profiles
        WHERE user_id = v_user_id;
    END IF;

    -- 6. Return response payload
    RETURN jsonb_build_object(
        'is_correct', p_is_correct,
        'xp_awarded', v_xp_awarded,
        'new_total_xp', COALESCE(v_new_total_xp, 0),
        'new_level', COALESCE(v_new_level, 1),
        'current_mastery', COALESCE(v_current_mastery, 0)
    );
END;
$function$;
