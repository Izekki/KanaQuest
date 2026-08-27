DO $$
DECLARE
    v_topic_id uuid;
    v_sentence_id uuid;
    v_word_id uuid;
BEGIN
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 1: Saludos y expresiones básicas', 'あいさつと基本的な表現', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おはようございます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おはようございます。', 'Buenos días.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おはよう' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おはよう', 'おはよう', 'おはよう', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ございます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ございます', 'ございます', 'ございます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'こんにちは。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'こんにちは。', 'Hola.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こんにち' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こんにち', 'こんにち', 'こんにち', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'こんばんは。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'こんばんは。', 'Buenas noches.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こんばん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こんばん', 'こんばん', 'こんばん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おやすみなさい。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おやすみなさい。', 'Buenas noches (al acostarse).', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おやすみ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おやすみ', 'おやすみ', 'おやすみ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'なさい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('なさい', 'なさい', 'なさい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ありがとうございます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ありがとうございます。', 'Gracias.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ありがとう' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ありがとう', 'ありがとう', 'ありがとう', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ございます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ございます', 'ございます', 'ございます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'どういたしまして。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'どういたしまして。', 'De nada.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'どういたしまして' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('どういたしまして', 'どういたしまして', 'どういたしまして', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'すみません。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'すみません。', 'Disculpe / Perdón.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すみません' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すみません', 'すみません', 'すみません', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ごめんなさい。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ごめんなさい。', 'Lo siento.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ごめんなさい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ごめんなさい', 'ごめんなさい', 'ごめんなさい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おげんきですか？' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おげんきですか？', '¿Cómo está usted? / ¿Cómo estás?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'お' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('お', 'お', 'お', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'げんき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('げんき', 'げんき', 'げんき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'か' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('か', 'か', 'か', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'はい、げんきです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'はい、げんきです。', 'Sí, estoy bien.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'はい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('はい', 'はい', 'はい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'げんき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('げんき', 'げんき', 'げんき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

END $$;
