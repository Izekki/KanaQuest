import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const datasetPath = path.join(rootDir, 'dataset.json');
const rawData = fs.readFileSync(datasetPath, 'utf8');
const sentencesData = JSON.parse(rawData);

const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');

let sql = `-- ==========================================================
-- KanaQuest: Seed Sentences, Topics, Words & Sentence Blocks
-- Generated from dataset.json (${sentencesData.length} sentences)
-- ==========================================================

DO $$
DECLARE
    v_topic_id uuid;
    v_sentence_id uuid;
    v_word_id uuid;
BEGIN
`;

const topics = {};

for (const item of sentencesData) {
  const topicTitle = item.topic_title_es;
  if (!topics[topicTitle]) {
    topics[topicTitle] = true;
    sql += `
    -- Topic: ${escapeSql(topicTitle)}
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = '${escapeSql(topicTitle)}' LIMIT 1;
    IF v_topic_id IS NULL THEN
        INSERT INTO public.topics (title_es, title_jp, difficulty_level)
        VALUES ('${escapeSql(topicTitle)}', '${escapeSql(item.topic_title_jp)}', ${item.difficulty_level ?? 1})
        RETURNING id INTO v_topic_id;
    END IF;
`;
  } else {
    sql += `
    SELECT id INTO v_topic_id FROM public.topics WHERE title_es = '${escapeSql(topicTitle)}' LIMIT 1;
`;
  }

  sql += `
    -- Sentence: ${escapeSql(item.full_japanese)}
    SELECT id INTO v_sentence_id FROM public.sentences WHERE full_japanese = '${escapeSql(item.full_japanese)}' AND topic_id = v_topic_id LIMIT 1;
    IF v_sentence_id IS NULL THEN
        INSERT INTO public.sentences (topic_id, full_japanese, translation, image_url)
        VALUES (v_topic_id, '${escapeSql(item.full_japanese)}', '${escapeSql(item.translation)}', ${item.image_url ? `'${escapeSql(item.image_url)}'` : 'NULL'})
        RETURNING id INTO v_sentence_id;
    END IF;
`;

  let order = 1;
  for (const block of item.blocks || []) {
    const hiragana = block.hiragana?.trim();
    if (!hiragana) continue;

    sql += `
    -- Word: ${escapeSql(hiragana)}
    SELECT id INTO v_word_id FROM public.words WHERE japanese = '${escapeSql(hiragana)}' LIMIT 1;
    IF v_word_id IS NULL THEN
        INSERT INTO public.words (japanese, hiragana, translation, difficulty)
        VALUES ('${escapeSql(hiragana)}', '${escapeSql(hiragana)}', '${escapeSql(block.translation || hiragana)}', 'beginner')
        RETURNING id INTO v_word_id;
    END IF;

    -- Block ${order}
    IF NOT EXISTS (
        SELECT 1 FROM public.sentence_blocks 
        WHERE sentence_id = v_sentence_id AND display_order = ${order}
    ) THEN
        INSERT INTO public.sentence_blocks (sentence_id, word_id, display_order, is_fixed)
        VALUES (v_sentence_id, v_word_id, ${order}, ${Boolean(block.is_fixed)});
    END IF;
`;
    order++;
  }
}

sql += `
END $$;
`;

const outputPath = path.join(rootDir, 'supabase', 'seed.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`✅ Generated SQL seed file at: ${outputPath}`);
