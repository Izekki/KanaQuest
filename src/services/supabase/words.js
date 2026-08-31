import { supabase } from './client';

let wordsCache = null;
let wordsCacheTime = 0;
let inFlightPromise = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos en memoria

/**
 * Obtiene las palabras para los modos de juego con caché en memoria y deduplicación de peticiones.
 */
export async function fetchWords(limit = 200, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && wordsCache && now - wordsCacheTime < CACHE_TTL_MS) {
    return { data: wordsCache.slice(0, limit), error: null };
  }

  if (inFlightPromise) {
    const res = await inFlightPromise;
    return { data: res?.data ? res.data.slice(0, limit) : null, error: res?.error ?? null };
  }

  inFlightPromise = (async () => {
    try {
      const res = await supabase
        .from('words')
        .select('id,japanese,hiragana,katakana,romaji,translation,accepted_answers,difficulty,type_id,level,experience_reward')
        .limit(300);

      if (!res.error && res.data) {
        wordsCache = res.data;
        wordsCacheTime = Date.now();
      }
      return res;
    } finally {
      inFlightPromise = null;
    }
  })();

  const result = await inFlightPromise;
  return { data: result?.data ? result.data.slice(0, limit) : null, error: result?.error ?? null };
}

/**
 * Precarga el catálogo de palabras en segundo plano.
 */
export function preloadWords() {
  if (!wordsCache && !inFlightPromise) {
    fetchWords(300).catch(() => {});
  }
}

/**
 * Invalida la caché del vocabulario en caso de mutaciones.
 */
export function invalidateWordsCache() {
  wordsCache = null;
  wordsCacheTime = 0;
}

export async function fetchWordsForHistory(forceRefresh = false) {
  return await fetchWords(300, forceRefresh);
}
