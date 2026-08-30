import { supabase } from './client';

export async function fetchUserProfile(userId) {
  return await supabase
    .from('profiles')
    .select('username,avatar_url,level,experience,role,title')
    .eq('user_id', userId)
    .maybeSingle();
}

export async function updateUserProfile(userId, updates) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId);
}

export async function fetchRankingProfiles(limit = 10) {
  return await supabase
    .from('profiles')
    .select('user_id,username,avatar_url,level,experience,games_played,correct_answers,wrong_answers,role,title,created_at')
    .order('experience', { ascending: false })
    .order('level', { ascending: false })
    .limit(limit);
}

export async function fetchUserProgress(userId, mode = null) {
  let query = supabase
    .from('progress')
    .select('id,user_id,word_id,correct,attempts,mastery_level,last_attempt,mode')
    .eq('user_id', userId);

  if (mode) {
    query = query.eq('mode', mode);
  }

  return await query;
}

export async function fetchRecentProgress(userId, limit = 6) {
  return await supabase
    .from('progress')
    .select('id,mode,correct,last_attempt,word:word_id(id,japanese,hiragana,katakana,romaji,translation)')
    .eq('user_id', userId)
    .order('last_attempt', { ascending: false })
    .limit(limit);
}

export async function fetchProgressRecord(userId, wordId, mode) {
  return await supabase
    .from('progress')
    .select('attempts,mastery_level')
    .eq('user_id', userId)
    .eq('word_id', wordId)
    .eq('mode', mode)
    .maybeSingle();
}

export async function upsertProgressRecord(record) {
  return await supabase
    .from('progress')
    .upsert(record, { onConflict: 'user_id,word_id,mode' });
}

export async function awardWordExperience(userId, wordId) {
  return await supabase
    .from('word_experience_awards')
    .upsert(
      { user_id: userId, word_id: wordId },
      { onConflict: 'user_id,word_id', ignoreDuplicates: true }
    );
}

export async function submitWordAnswer(wordId, mode, isCorrect, skipXp = false) {
  return await supabase.rpc('handle_word_submission', {
    p_word_id: wordId,
    p_mode: mode,
    p_is_correct: isCorrect,
    p_skip_xp: skipXp,
  });
}

export async function createGameSession(sessionData) {
  return await supabase
    .from('game_sessions')
    .insert(sessionData);
}
