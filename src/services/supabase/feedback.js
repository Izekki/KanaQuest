import { supabase } from './client';

/**
 * Sends a user feedback report (Bug, Word Error, Suggestion, Other)
 * @param {Object} payload
 * @param {'bug'|'word_error'|'suggestion'|'other'} payload.category
 * @param {string} payload.message
 * @param {string} [payload.wordId]
 * @param {string} [payload.sentenceId]
 * @param {string} [payload.route]
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function submitFeedback({ category, message, wordId = null, sentenceId = null, route = null }) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: authError || new Error('Debes iniciar sesión para enviar feedback.') };
  }

  const record = {
    user_id: user.id,
    category,
    message: message?.trim(),
    word_id: wordId || null,
    sentence_id: sentenceId || null,
    route: route || (typeof window !== 'undefined' ? window.location.pathname : null),
    status: 'pending',
  };

  return await supabase
    .from('user_feedbacks')
    .insert(record)
    .select()
    .maybeSingle();
}

/**
 * Fetches all user feedback items for administrators with author, word, and sentence joins.
 * @param {Object} [options]
 * @param {string} [options.status]
 * @param {string} [options.category]
 * @param {number} [options.limit]
 * @returns {Promise<{ data: any[], error: any }>}
 */
export async function fetchAdminFeedbacks({ status = null, category = null, limit = 100 } = {}) {
  let query = supabase
    .from('user_feedbacks')
    .select(`
      id,
      user_id,
      category,
      message,
      word_id,
      sentence_id,
      route,
      status,
      admin_notes,
      created_at,
      profile:profiles (username, avatar_url, role, title),
      word:words (id, japanese, hiragana, romaji, translation),
      sentence:sentences (id, full_japanese, translation)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  return await query;
}

/**
 * Updates the triage status and/or admin notes for a feedback item.
 * @param {string} feedbackId
 * @param {Object} updates
 * @param {'pending'|'reviewed'|'resolved'|'discarded'} [updates.status]
 * @param {string} [updates.adminNotes]
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function updateFeedbackStatus(feedbackId, { status, adminNotes }) {
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  return await supabase
    .from('user_feedbacks')
    .update(updates)
    .eq('id', feedbackId)
    .select()
    .maybeSingle();
}

/**
 * Deletes a feedback item (Admin only).
 * @param {string} feedbackId
 * @returns {Promise<{ error: any }>}
 */
export async function deleteFeedback(feedbackId) {
  return await supabase
    .from('user_feedbacks')
    .delete()
    .eq('id', feedbackId);
}
