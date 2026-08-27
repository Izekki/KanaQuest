import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Safely load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Key not found in environment variables or .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function seedDatabase() {
  try {
    const datasetPath = path.join(rootDir, 'dataset.json');
    if (!fs.existsSync(datasetPath)) {
      console.error(`❌ Error: ${datasetPath} not found.`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(datasetPath, 'utf8');
    const sentencesData = JSON.parse(rawData);

    console.log(`🚀 Iniciando inserción de ${sentencesData.length} oraciones desde dataset.json...`);

    const topicCache = {};
    const wordCache = {};
    let sentencesAdded = 0;
    let blocksAdded = 0;

    for (const item of sentencesData) {
      // 1. Manejo de Tema (Topic)
      let topicId = topicCache[item.topic_title_es];
      if (!topicId) {
        let { data: existingTopic } = await supabase
          .from('topics')
          .select('id')
          .eq('title_es', item.topic_title_es)
          .maybeSingle();

        if (existingTopic?.id) {
          topicId = existingTopic.id;
        } else {
          const { data: newTopic, error: topicError } = await supabase
            .from('topics')
            .insert({
              title_es: item.topic_title_es,
              title_jp: item.topic_title_jp,
              difficulty_level: item.difficulty_level ?? 1,
            })
            .select('id')
            .single();

          if (topicError) throw topicError;
          topicId = newTopic.id;
          console.log(`📚 Nuevo Tema registrado: "${item.topic_title_es}"`);
        }
        topicCache[item.topic_title_es] = topicId;
      }

      // 2. Manejo de Oración (Sentence)
      let { data: existingSentence } = await supabase
        .from('sentences')
        .select('id')
        .eq('full_japanese', item.full_japanese)
        .eq('topic_id', topicId)
        .maybeSingle();

      let sentenceId = existingSentence?.id;

      if (!sentenceId) {
        const { data: sentData, error: sentError } = await supabase
          .from('sentences')
          .insert({
            topic_id: topicId,
            full_japanese: item.full_japanese,
            translation: item.translation,
            image_url: item.image_url ?? null,
          })
          .select('id')
          .single();

        if (sentError) throw sentError;
        sentenceId = sentData.id;
        sentencesAdded++;
        console.log(`  ✅ Oración agregada: "${item.full_japanese}" -> "${item.translation}"`);
      }

      // 3. Manejo de Bloques (Words y Sentence Blocks)
      let currentOrder = 1;
      for (const block of item.blocks || []) {
        const hiragana = block.hiragana?.trim();
        if (!hiragana) continue;

        let wordId = wordCache[hiragana];
        if (!wordId) {
          let { data: wordData } = await supabase
            .from('words')
            .select('id')
            .eq('japanese', hiragana)
            .maybeSingle();

          if (wordData?.id) {
            wordId = wordData.id;
          } else {
            const { data: newWord, error: newWordError } = await supabase
              .from('words')
              .insert({
                japanese: hiragana,
                hiragana: hiragana,
                translation: block.translation || hiragana,
                part_of_speech: block.part_of_speech || null,
                difficulty: 'beginner',
              })
              .select('id')
              .single();

            if (newWordError) throw newWordError;
            wordId = newWord.id;
          }
          wordCache[hiragana] = wordId;
        }

        // Insertar en sentence_blocks
        let { data: existingBlock } = await supabase
          .from('sentence_blocks')
          .select('id')
          .eq('sentence_id', sentenceId)
          .eq('display_order', currentOrder)
          .maybeSingle();

        if (!existingBlock) {
          const { error: blockError } = await supabase
            .from('sentence_blocks')
            .insert({
              sentence_id: sentenceId,
              word_id: wordId,
              display_order: currentOrder,
              is_fixed: Boolean(block.is_fixed),
            });

          if (blockError) throw blockError;
          blocksAdded++;
        }

        currentOrder++;
      }
    }

    console.log(`\n🎉 ¡Población masiva completada exitosamente!`);
    console.log(`📊 Resumen: ${Object.keys(topicCache).length} temas, ${sentencesAdded} oraciones nuevas, ${blocksAdded} bloques vinculados.`);
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seedDatabase();
