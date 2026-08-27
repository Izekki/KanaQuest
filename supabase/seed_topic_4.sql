DO $$
DECLARE
    v_topic_id uuid;
    v_sentence_id uuid;
    v_word_id uuid;
BEGIN
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 4: Vivienda' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 4: Vivienda', 'うち', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえのうえにほんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえのうえにほんがあります。', 'Encima del escritorio hay un libro.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'うえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('うえ', 'うえ', 'うえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ほん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ほん', 'ほん', 'ほん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いすのしたにねこがいます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いすのしたにねこがいます。', 'Debajo de la silla hay un gato.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いす' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いす', 'いす', 'いす', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'した' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('した', 'した', 'した', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ねこ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ねこ', 'ねこ', 'ねこ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'います' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('います', 'います', 'います', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ほんのとなりにぺんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ほんのとなりにぺんがあります。', 'Al lado del libro hay un bolígrafo.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ほん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ほん', 'ほん', 'ほん', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'となり' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('となり', 'となり', 'となり', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ぺん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ぺん', 'ぺん', 'ぺん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'まどのまえにつくえがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'まどのまえにつくえがあります。', 'Delante de la ventana hay un escritorio.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'まど' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('まど', 'まど', 'まど', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'まえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('まえ', 'まえ', 'まえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いえのうしろにくるまがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いえのうしろにくるまがあります。', 'Detrás de la casa hay un coche.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いえ', 'いえ', 'いえ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'うしろ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('うしろ', 'うしろ', 'うしろ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'くるま' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('くるま', 'くるま', 'くるま', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえのみぎにほんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえのみぎにほんがあります。', 'A la derecha del escritorio hay un libro.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'みぎ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('みぎ', 'みぎ', 'みぎ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ほん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ほん', 'ほん', 'ほん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえのひだりにいすがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえのひだりにいすがあります。', 'A la izquierda del escritorio hay una silla.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ひだり' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ひだり', 'ひだり', 'ひだり', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いす' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いす', 'いす', 'いす', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'つくえといすのあいだにねこがいます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'つくえといすのあいだにねこがいます。', 'Entre el escritorio y la silla hay un gato.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'つくえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('つくえ', 'つくえ', 'つくえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'と' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('と', 'と', 'と', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いす' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いす', 'いす', 'いす', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あいだ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あいだ', 'あいだ', 'あいだ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ねこ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ねこ', 'ねこ', 'ねこ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 8
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 8, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'います' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('います', 'います', 'います', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 9
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 9, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'たなのうえにえがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'たなのうえにえがあります。', 'Encima de la estantería hay un cuadro.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たな' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たな', 'たな', 'たな', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'うえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('うえ', 'うえ', 'うえ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'え' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('え', 'え', 'え', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'いえのとなりにこうえんがあります。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'いえのとなりにこうえんがあります。', 'Al lado de la casa hay un parque.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'いえ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('いえ', 'いえ', 'いえ', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'となり' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('となり', 'となり', 'となり', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'に' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('に', 'に', 'に', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'こうえん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('こうえん', 'こうえん', 'こうえん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'あります' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('あります', 'あります', 'あります', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

END $$;
