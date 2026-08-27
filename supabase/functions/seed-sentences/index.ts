import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const dataset = Array.isArray(body) ? body : body?.sentences || [];

    if (!Array.isArray(dataset) || dataset.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing sentences array in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const topicCache: Record<string, string> = {};
    const wordCache: Record<string, string> = {};
    let insertedSentences = 0;
    let insertedBlocks = 0;

    for (const item of dataset) {
      // 1. Handle Topic
      let topicId = topicCache[item.topic_title_es];
      if (!topicId) {
        const { data: existingTopic } = await supabaseAdmin
          .from('topics')
          .select('id')
          .eq('title_es', item.topic_title_es)
          .maybeSingle();

        if (existingTopic?.id) {
          topicId = existingTopic.id;
        } else {
          const { data: newTopic, error: topicErr } = await supabaseAdmin
            .from('topics')
            .insert({
              title_es: item.topic_title_es,
              title_jp: item.topic_title_jp,
              difficulty_level: item.difficulty_level ?? 1,
            })
            .select('id')
            .single();

          if (topicErr) throw topicErr;
          topicId = newTopic.id;
        }
        topicCache[item.topic_title_es] = topicId;
      }

      // 2. Handle Sentence
      const { data: existingSentence } = await supabaseAdmin
        .from('sentences')
        .select('id')
        .eq('full_japanese', item.full_japanese)
        .eq('topic_id', topicId)
        .maybeSingle();

      let sentenceId = existingSentence?.id;

      if (!sentenceId) {
        const { data: newSentence, error: sentErr } = await supabaseAdmin
          .from('sentences')
          .insert({
            topic_id: topicId,
            full_japanese: item.full_japanese,
            translation: item.translation,
            image_url: item.image_url ?? null,
          })
          .select('id')
          .single();

        if (sentErr) throw sentErr;
        sentenceId = newSentence.id;
        insertedSentences++;
      }

      // 3. Handle Words and Sentence Blocks
      let displayOrder = 1;
      for (const block of item.blocks || []) {
        const hiragana = block.hiragana?.trim();
        if (!hiragana) continue;

        let wordId = wordCache[hiragana];
        if (!wordId) {
          const { data: existingWord } = await supabaseAdmin
            .from('words')
            .select('id')
            .eq('japanese', hiragana)
            .maybeSingle();

          if (existingWord?.id) {
            wordId = existingWord.id;
          } else {
            const { data: newWord, error: wordErr } = await supabaseAdmin
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

            if (wordErr) throw wordErr;
            wordId = newWord.id;
          }
          wordCache[hiragana] = wordId;
        }

        // Link block in sentence_blocks if not already linked
        const { data: existingBlock } = await supabaseAdmin
          .from('sentence_blocks')
          .select('id')
          .eq('sentence_id', sentenceId)
          .eq('display_order', displayOrder)
          .maybeSingle();

        if (!existingBlock) {
          const { error: blockErr } = await supabaseAdmin
            .from('sentence_blocks')
            .insert({
              sentence_id: sentenceId,
              word_id: wordId,
              display_order: displayOrder,
              is_fixed: Boolean(block.is_fixed),
            });

          if (blockErr) throw blockErr;
          insertedBlocks++;
        }

        displayOrder++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sentences seeded successfully',
        topicsCount: Object.keys(topicCache).length,
        sentencesCount: insertedSentences,
        blocksCount: insertedBlocks,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Seeding error:', err);
    return new Response(
      JSON.stringify({ error: err.message ?? String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
