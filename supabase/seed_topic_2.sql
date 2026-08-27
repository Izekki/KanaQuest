DO $$
DECLARE
    v_topic_id uuid;
    v_sentence_id uuid;
    v_word_id uuid;
BEGIN
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 2: Presentaciones, nacionalidades y familia' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 2: Presentaciones, nacionalidades y familia', '自己紹介、国籍と家族', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはまりあです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはまりあです。', 'Yo soy Maria.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'まりあ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('まりあ', 'まりあ', 'まりあ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはスペインじんです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはスペインじんです。', 'Yo soy español.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すぺいんじん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すぺいんじん', 'すぺいんじん', 'すぺいんじん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'これはわたしのちちです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'これはわたしのちちです。', 'Este es mi padre.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'これ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('これ', 'これ', 'これ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ちち' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ちち', 'ちち', 'ちち', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'あれはわたしのははです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'あれはわたしのははです。', 'Esa es mi madre.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あれ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あれ', 'あれ', 'あれ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'はは' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('はは', 'はは', 'はは', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはにほんじんではありません。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはにほんじんではありません。', 'Yo no soy japonés.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'にほんじん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('にほんじん', 'にほんじん', 'にほんじん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'で' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('で', 'で', 'で', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ありません' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ありません', 'ありません', 'ありません', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'たなかさんはがくせいですか？' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'たなかさんはがくせいですか？', '¿El señor Tanaka es estudiante?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たなかさん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たなかさん', 'たなかさん', 'たなかさん', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'がくせい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('がくせい', 'がくせい', 'がくせい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'か' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('か', 'か', 'か', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'はい、がくせいです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'はい、がくせいです。', 'Sí, es estudiante.', NULL)
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'がくせい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('がくせい', 'がくせい', 'がくせい', 'beginner')
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

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしのあにはかいしゃいんです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしのあにはかいしゃいんです。', 'Mi hermano mayor es empleado de oficina.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'の' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('の', 'の', 'の', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あに' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あに', 'あに', 'あに', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'かいしゃいん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('かいしゃいん', 'かいしゃいん', 'かいしゃいん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いもうとはこうこうせいです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いもうとはこうこうせいです。', 'Mi hermana menor es estudiante de secundaria.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いもうと' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いもうと', 'いもうと', 'いもうと', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こうこうせい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こうこうせい', 'こうこうせい', 'こうこうせい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしはメキシコからきました。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしはメキシコからきました。', 'Yo vine de México.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'わたし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('わたし', 'わたし', 'わたし', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'めきしこ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('めきしこ', 'めきしこ', 'めきしこ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'から' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('から', 'から', 'から', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'きました' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('きました', 'きました', 'きました', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

END $$;
