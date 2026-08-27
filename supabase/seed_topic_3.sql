DO $$
DECLARE
    v_topic_id uuid;
    v_sentence_id uuid;
    v_word_id uuid;
BEGIN
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = 'Tema 3: Comida favorita y pedir en restaurante' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('Tema 3: Comida favorita y pedir en restaurante', '好きな食べ物とレストランでの注文', 1)
        RETURNING id INTO v_topic_id;
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'わたしのすきなたべものはすしです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'わたしのすきなたべものはすしです。', 'Mi comida favorita es sushi.', NULL)
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すき', 'すき', 'すき', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'な' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('な', 'な', 'な', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たべもの' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たべもの', 'たべもの', 'たべもの', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'は' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('は', 'は', 'は', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すし', 'すし', 'すし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 7
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 7, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 8
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 8, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ラーメンがすきです。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ラーメンがすきです。', 'Me gusta el ramen.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'らーめん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('らーめん', 'らーめん', 'らーめん', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'が' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('が', 'が', 'が', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すき' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すき', 'すき', 'すき', 'beginner')
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

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'てんぷらをください。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'てんぷらをください。', 'Deme tempura, por favor.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'てんぷら' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('てんぷら', 'てんぷら', 'てんぷら', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ください' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ください', 'ください', 'ください', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'みずをください。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'みずをください。', 'Deme agua, por favor.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'みず' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('みず', 'みず', 'みず', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ください' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ください', 'ください', 'ください', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'メニューをみせてください。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'メニューをみせてください。', 'Por favor, muéstreme el menú.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'めにゅー' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('めにゅー', 'めにゅー', 'めにゅー', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'みせて' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('みせて', 'みせて', 'みせて', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ください' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ください', 'ください', 'ください', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'これはなんですか？' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'これはなんですか？', '¿Qué es esto?', NULL)
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'なん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('なん', 'なん', 'なん', 'beginner')
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

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'おいしいですね。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'おいしいですね。', 'Está delicioso, ¿verdad?', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おいしい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おいしい', 'おいしい', 'おいしい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'です' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('です', 'です', 'です', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ね' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ね', 'ね', 'ね', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'すしをたべます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'すしをたべます。', 'Como sushi.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'すし' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('すし', 'すし', 'すし', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'たべます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('たべます', 'たべます', 'たべます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ちゃをのみます。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ちゃをのみます。', 'Bebo té.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ちゃ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ちゃ', 'ちゃ', 'ちゃ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 1
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 1, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 2
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 2, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'のみます' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('のみます', 'のみます', 'のみます', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = 'ラーメンとぎょうざをおねがいします。' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, 'ラーメンとぎょうざをおねがいします。', 'Ramen y gyōza, por favor.', NULL)
        RETURNING id INTO v_sentence_id;
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'らーめん' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('らーめん', 'らーめん', 'らーめん', 'beginner')
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

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'ぎょうざ' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('ぎょうざ', 'ぎょうざ', 'ぎょうざ', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 3
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 3, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'を' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('を', 'を', 'を', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 4
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 4, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'おねがい' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('おねがい', 'おねがい', 'おねがい', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 5
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 5, false);
    END IF;

    SELECT id INTO v_word_id FROM public.words WHERE japanese = 'します' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('します', 'します', 'します', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = 6
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, 6, false);
    END IF;

END $$;
