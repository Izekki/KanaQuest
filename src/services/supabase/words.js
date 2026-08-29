import { supabase } from './client';

export async function fetchWords(limit = 200) {
  return await supabase
    .from('words')
    .select('id,japanese,hiragana,katakana,romaji,translation,accepted_answers,difficulty,type_id,level,experience_reward')
    .limit(limit);
}

export async function fetchWordsForHistory() {
  return await supabase
    .from('words')
    .select('*')
    .order('created_at', { ascending: true });
}
