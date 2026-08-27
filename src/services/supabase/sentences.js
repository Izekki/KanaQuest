import { supabase } from './client';

/**
 * Fetch all available sentence topics
 */
export async function fetchTopics() {
  return await supabase
    .from('topics')
    .select('id, title_es, title_jp, difficulty_level, created_at')
    .order('difficulty_level', { ascending: true });
}

/**
 * Fetch sentences along with their ordered word blocks and word details.
 * Joins: sentences -> sentence_blocks -> words -> word_types
 *
 * @param {Object} options
 * @param {string} [options.topicId] - Filter by specific topic UUID
 * @param {number} [options.limit] - Max sentences to return
 */
export async function fetchSentences({ topicId = null, limit = 20 } = {}) {
  let query = supabase
    .from('sentences')
    .select(`
      id,
      topic_id,
      full_japanese,
      translation,
      image_url,
      created_at,
      topics (
        id,
        title_es,
        title_jp,
        difficulty_level
      ),
      sentence_blocks (
        id,
        display_order,
        is_fixed,
        word_id,
        words (
          id,
          japanese,
          hiragana,
          katakana,
          romaji,
          translation,
          difficulty,
          part_of_speech,
          type_id,
          word_types (
            id,
            name
          )
        )
      )
    `)
    .limit(limit);

  if (topicId) {
    query = query.eq('topic_id', topicId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching sentences with blocks:', error);
    return { data: null, error };
  }

  // Ensure sentence_blocks are sorted by display_order for each sentence
  const formattedData = (data || []).map((sentence) => ({
    ...sentence,
    sentence_blocks: (sentence.sentence_blocks || []).sort(
      (a, b) => a.display_order - b.display_order
    ),
  }));

  return { data: formattedData, error: null };
}

/**
 * Record user progress on a sentence after validation
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.sentenceId
 * @param {boolean} params.correct
 */
export async function recordSentenceProgress({ userId, sentenceId, correct }) {
  if (!userId || !sentenceId) return { data: null, error: 'Missing userId or sentenceId' };

  try {
    const { data: existing, error: findError } = await supabase
      .from('sentence_progress')
      .select('id, attempts, correct')
      .eq('user_id', userId)
      .eq('sentence_id', sentenceId)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      return await supabase
        .from('sentence_progress')
        .update({
          attempts: (existing.attempts || 0) + 1,
          correct: existing.correct || correct,
          last_attempt: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      return await supabase
        .from('sentence_progress')
        .insert({
          user_id: userId,
          sentence_id: sentenceId,
          attempts: 1,
          correct: correct,
          last_attempt: new Date().toISOString(),
        });
    }
  } catch (err) {
    console.error('Error recording sentence progress:', err);
    return { data: null, error: err };
  }
}
