-- ==========================================================
-- KanaQuest: Seed Sentences, Topics, Words & Sentence Blocks
-- Generated from dataset.json (40 sentences)
-- ==========================================================

DO $$
DECLARE
    v_topic_id uuid;
    v_sentence_id uuid;
    v_word_id uuid;
BEGIN

    -- Topic: Tema 1: Saludos y expresiones básicas
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 1: Saludos y expresiones básicas', 'あいさつと基本的な表現', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    -- Sentence: おはようございます。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おはようございます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おはようございます。', 'Buenos días.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: おはよう
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おはよう' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おはよう', 'おはよう', 'おはよう', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: ございます
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ございます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ございます', 'ございます', 'ございます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: こんにちは。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'こんにちは。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'こんにちは。', 'Hola.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: こんにち
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こんにち' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こんにち', 'こんにち', 'こんにち', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: こんばんは。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'こんばんは。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'こんばんは。', 'Buenas noches.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: こんばん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こんばん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こんばん', 'こんばん', 'こんばん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: おやすみなさい。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おやすみなさい。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おやすみなさい。', 'Buenas noches (al acostarse).', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: おやすみ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おやすみ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おやすみ', 'おやすみ', 'おやすみ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: なさい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'なさい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('なさい', 'なさい', 'なさい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: ありがとうございます。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ありがとうございます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ありがとうございます。', 'Gracias.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: ありがとう
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ありがとう' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ありがとう', 'ありがとう', 'ありがとう', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: ございます
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ございます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ございます', 'ございます', 'ございます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: どういたしまして。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'どういたしまして。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'どういたしまして。', 'De nada.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: どういたしまして
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'どういたしまして' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('どういたしまして', 'どういたしまして', 'どういたしまして', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: すみません。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'すみません。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'すみません。', 'Disculpe / Perdón.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: すみません
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すみません' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すみません', 'すみません', 'すみません', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: ごめんなさい。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ごめんなさい。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ごめんなさい。', 'Lo siento.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: ごめんなさい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ごめんなさい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ごめんなさい', 'ごめんなさい', 'ごめんなさい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: おげんきですか？
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おげんきですか？' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おげんきですか？', '¿Cómo está usted? / ¿Cómo estás?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: お
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'お' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('お', 'お', 'お', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: げんき
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'げんき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('げんき', 'げんき', 'げんき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: か
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'か' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('か', 'か', 'か', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 1: Saludos y expresiones básicas' LIMIT 1;

    -- Sentence: はい、げんきです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'はい、げんきです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'はい、げんきです。', 'Sí, estoy bien.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: はい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'はい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('はい', 'はい', 'はい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: げんき
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'げんき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('げんき', 'げんき', 'げんき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Topic: Tema 2: Presentaciones, nacionalidades y familia
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 2: Presentaciones, nacionalidades y familia', '自己紹介、国籍と家族', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    -- Sentence: わたしはまりあです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはまりあです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはまりあです。', 'Yo soy Maria.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: まりあ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'まりあ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('まりあ', 'まりあ', 'まりあ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: わたしはスペインじんです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはスペインじんです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはスペインじんです。', 'Yo soy español.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: すぺいんじん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すぺいんじん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すぺいんじん', 'すぺいんじん', 'すぺいんじん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: これはわたしのちちです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'これはわたしのちちです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'これはわたしのちちです。', 'Este es mi padre.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: これ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'これ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('これ', 'これ', 'これ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: ちち
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ちち' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ちち', 'ちち', 'ちち', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: あれはわたしのははです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'あれはわたしのははです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'あれはわたしのははです。', 'Esa es mi madre.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: あれ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あれ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あれ', 'あれ', 'あれ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: はは
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'はは' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('はは', 'はは', 'はは', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: わたしはにほんじんではありません。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはにほんじんではありません。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはにほんじんではありません。', 'Yo no soy japonés.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: にほんじん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'にほんじん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('にほんじん', 'にほんじん', 'にほんじん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: で
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'で' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('で', 'で', 'で', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: ありません
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ありません' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ありません', 'ありません', 'ありません', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: たなかさんはがくせいですか？
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'たなかさんはがくせいですか？' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'たなかさんはがくせいですか？', '¿El señor Tanaka es estudiante?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: たなかさん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たなかさん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たなかさん', 'たなかさん', 'たなかさん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: がくせい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'がくせい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('がくせい', 'がくせい', 'がくせい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: か
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'か' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('か', 'か', 'か', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: はい、がくせいです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'はい、がくせいです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'はい、がくせいです。', 'Sí, es estudiante.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: はい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'はい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('はい', 'はい', 'はい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: がくせい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'がくせい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('がくせい', 'がくせい', 'がくせい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: わたしのあにはかいしゃいんです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしのあにはかいしゃいんです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしのあにはかいしゃいんです。', 'Mi hermano mayor es empleado de oficina.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: あに
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あに' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あに', 'あに', 'あに', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: かいしゃいん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'かいしゃいん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('かいしゃいん', 'かいしゃいん', 'かいしゃいん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: いもうとはこうこうせいです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いもうとはこうこうせいです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いもうとはこうこうせいです。', 'Mi hermana menor es estudiante de secundaria.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: いもうと
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いもうと' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いもうと', 'いもうと', 'いもうと', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: こうこうせい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こうこうせい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こうこうせい', 'こうこうせい', 'こうこうせい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;

    -- Sentence: わたしはメキシコからきました。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはメキシコからきました。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはメキシコからきました。', 'Yo vine de México.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: めきしこ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'めきしこ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('めきしこ', 'めきしこ', 'めきしこ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: から
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'から' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('から', 'から', 'から', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: きました
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'きました' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('きました', 'きました', 'きました', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Topic: Tema 3: Comida favorita y pedir en restaurante
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 3: Comida favorita y pedir en restaurante', '好きな食べ物とレストランでの注文', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    -- Sentence: わたしのすきなたべものはすしです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしのすきなたべものはすしです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしのすきなたべものはすしです。', 'Mi comida favorita es sushi.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: わたし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: すき
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すき', 'すき', 'すき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: な
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'な' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('な', 'な', 'な', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: たべもの
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たべもの' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たべもの', 'たべもの', 'たべもの', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: すし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すし', 'すし', 'すし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 8
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 8
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 8, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: ラーメンがすきです。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ラーメンがすきです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ラーメンがすきです。', 'Me gusta el ramen.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: らーめん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'らーめん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('らーめん', 'らーめん', 'らーめん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: すき
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すき', 'すき', 'すき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: てんぷらをください。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'てんぷらをください。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'てんぷらをください。', 'Deme tempura, por favor.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: てんぷら
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'てんぷら' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('てんぷら', 'てんぷら', 'てんぷら', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: を
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: ください
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ください' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ください', 'ください', 'ください', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: みずをください。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'みずをください。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'みずをください。', 'Deme agua, por favor.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: みず
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'みず' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('みず', 'みず', 'みず', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: を
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: ください
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ください' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ください', 'ください', 'ください', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: メニューをみせてください。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'メニューをみせてください。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'メニューをみせてください。', 'Por favor, muéstreme el menú.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: めにゅー
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'めにゅー' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('めにゅー', 'めにゅー', 'めにゅー', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: を
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: みせて
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'みせて' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('みせて', 'みせて', 'みせて', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: ください
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ください' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ください', 'ください', 'ください', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: これはなんですか？
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'これはなんですか？' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'これはなんですか？', '¿Qué es esto?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: これ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'これ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('これ', 'これ', 'これ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: は
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: なん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'なん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('なん', 'なん', 'なん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: か
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'か' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('か', 'か', 'か', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: おいしいですね。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おいしいですね。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おいしいですね。', 'Está delicioso, ¿verdad?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: おいしい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おいしい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おいしい', 'おいしい', 'おいしい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: です
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: ね
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ね' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ね', 'ね', 'ね', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: すしをたべます。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'すしをたべます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'すしをたべます。', 'Como sushi.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: すし
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すし', 'すし', 'すし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: を
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: たべます
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たべます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たべます', 'たべます', 'たべます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: ちゃをのみます。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ちゃをのみます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ちゃをのみます。', 'Bebo té.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: ちゃ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ちゃ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ちゃ', 'ちゃ', 'ちゃ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: を
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: のみます
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'のみます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('のみます', 'のみます', 'のみます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;

    -- Sentence: ラーメンとぎょうざをおねがいします。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ラーメンとぎょうざをおねがいします。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ラーメンとぎょうざをおねがいします。', 'Ramen y gyōza, por favor.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: らーめん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'らーめん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('らーめん', 'らーめん', 'らーめん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: と
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'と' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('と', 'と', 'と', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: ぎょうざ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ぎょうざ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ぎょうざ', 'ぎょうざ', 'ぎょうざ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: を
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: おねがい
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おねがい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おねがい', 'おねがい', 'おねがい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: します
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'します' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('します', 'します', 'します', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Topic: Tema 4: Vivienda
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 4: Vivienda', 'うち', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    -- Sentence: つくえのうえにほんがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえのうえにほんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえのうえにほんがあります。', 'Encima del escritorio hay un libro.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: つくえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: うえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'うえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('うえ', 'うえ', 'うえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: ほん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ほん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ほん', 'ほん', 'ほん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: いすのしたにねこがいます。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いすのしたにねこがいます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いすのしたにねこがいます。', 'Debajo de la silla hay un gato.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: いす
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いす' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いす', 'いす', 'いす', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: した
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'した' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('した', 'した', 'した', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: ねこ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ねこ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ねこ', 'ねこ', 'ねこ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: います
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'います' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('います', 'います', 'います', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: ほんのとなりにぺんがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ほんのとなりにぺんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ほんのとなりにぺんがあります。', 'Al lado del libro hay un bolígrafo.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: ほん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ほん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ほん', 'ほん', 'ほん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: となり
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'となり' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('となり', 'となり', 'となり', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: ぺん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ぺん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ぺん', 'ぺん', 'ぺん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: まどのまえにつくえがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'まどのまえにつくえがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'まどのまえにつくえがあります。', 'Delante de la ventana hay un escritorio.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: まど
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'まど' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('まど', 'まど', 'まど', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: まえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'まえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('まえ', 'まえ', 'まえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: つくえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: いえのうしろにくるまがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いえのうしろにくるまがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いえのうしろにくるまがあります。', 'Detrás de la casa hay un coche.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: いえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いえ', 'いえ', 'いえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: うしろ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'うしろ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('うしろ', 'うしろ', 'うしろ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: くるま
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'くるま' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('くるま', 'くるま', 'くるま', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: つくえのみぎにほんがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえのみぎにほんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえのみぎにほんがあります。', 'A la derecha del escritorio hay un libro.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: つくえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: みぎ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'みぎ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('みぎ', 'みぎ', 'みぎ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: ほん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ほん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ほん', 'ほん', 'ほん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: つくえのひだりにいすがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえのひだりにいすがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえのひだりにいすがあります。', 'A la izquierda del escritorio hay una silla.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: つくえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: ひだり
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ひだり' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ひだり', 'ひだり', 'ひだり', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: いす
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いす' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いす', 'いす', 'いす', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: つくえといすのあいだにねこがいます。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえといすのあいだにねこがいます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえといすのあいだにねこがいます。', 'Entre el escritorio y la silla hay un gato.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: つくえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: と
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'と' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('と', 'と', 'と', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: いす
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いす' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いす', 'いす', 'いす', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: あいだ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あいだ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あいだ', 'あいだ', 'あいだ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: ねこ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ねこ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ねこ', 'ねこ', 'ねこ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 8
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 8
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 8, false);
    END IF;

    -- Word: います
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'います' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('います', 'います', 'います', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 9
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 9
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 9, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: たなのうえにえがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'たなのうえにえがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'たなのうえにえがあります。', 'Encima de la estantería hay un cuadro.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: たな
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たな' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たな', 'たな', 'たな', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: うえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'うえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('うえ', 'うえ', 'うえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: え
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'え' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('え', 'え', 'え', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;

    -- Sentence: いえのとなりにこうえんがあります。
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いえのとなりにこうえんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いえのとなりにこうえんがあります。', 'Al lado de la casa hay un parque.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    -- Word: いえ
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いえ', 'いえ', 'いえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 1
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    -- Word: の
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 2
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    -- Word: となり
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'となり' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('となり', 'となり', 'となり', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 3
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    -- Word: に
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 4
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    -- Word: こうえん
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こうえん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こうえん', 'こうえん', 'こうえん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 5
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    -- Word: が
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 6
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    -- Word: あります
    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block 7
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

END $$;
