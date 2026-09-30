import { supabase } from './client';
import { TITLES_CATALOG } from '../../data/titlesCatalog';

/**
 * Obtiene el catálogo de títulos disponible.
 * Lee desde Supabase con fallback local inmediato en memoria.
 */
export async function fetchTitlesCatalog() {
  try {
    const { data, error } = await supabase
      .from('titles')
      .select('id, name, category, description, rarity, icon, sort_order')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return { data: TITLES_CATALOG, error: null };
    }

    return { data, error: null };
  } catch (err) {
    console.warn('Fallback al catálogo local de títulos:', err);
    return { data: TITLES_CATALOG, error: null };
  }
}

/**
 * Obtiene la lista de títulos desbloqueados por el usuario autenticado.
 */
export async function fetchUserUnlockedTitles(userId) {
  if (!userId) return { data: ['novato_kanji'], error: null };

  try {
    const { data, error } = await supabase
      .from('user_unlocked_titles')
      .select('title_id, unlocked_at')
      .eq('user_id', userId);

    if (error) {
      // Si la tabla aún no existe o hay error de red, retornar título por defecto
      return { data: ['novato_kanji'], error: null };
    }

    const ids = data && data.length > 0 
      ? Array.from(new Set(['novato_kanji', ...data.map((r) => r.title_id)]))
      : ['novato_kanji'];

    return { data: ids, error: null };
  } catch (err) {
    console.warn('Error al obtener títulos desbloqueados del usuario:', err);
    return { data: ['novato_kanji'], error: null };
  }
}

/**
 * Equipa un título para el usuario actual.
 * Utiliza el RPC seguro `equip_user_title` con fallback de compatibilidad.
 */
export async function equipTitle(userId, titleId, titleName) {
  if (!userId || !titleId) {
    return { data: null, error: new Error('Usuario y Título son requeridos.') };
  }

  try {
    // 1. Intentar llamar al RPC con verificación estricta de propiedad
    const rpcRes = await supabase.rpc('equip_user_title', { p_title_id: titleId });
    if (!rpcRes.error) {
      return { data: rpcRes.data, error: null };
    }
  } catch (rpcErr) {
    console.warn('RPC equip_user_title no disponible, intentando update directo:', rpcErr);
  }

  // 2. Fallback: actualización directa de profile (title y title_id)
  try {
    const fallbackName = titleName || TITLES_CATALOG.find((t) => t.id === titleId)?.name || 'Novato del Kanji';
    let { data, error } = await supabase
      .from('profiles')
      .update({
        title_id: titleId,
        title: fallbackName,
      })
      .eq('user_id', userId)
      .select('title, title_id')
      .maybeSingle();

    // Si title_id no existe en la BD remota todavía, actualizar al menos title (texto)
    if (error && (error.message?.includes('title_id') || error.code === '42703')) {
      const fallbackRes = await supabase
        .from('profiles')
        .update({
          title: fallbackName,
        })
        .eq('user_id', userId)
        .select('title')
        .maybeSingle();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Evalúa las estadísticas del jugador y desbloquea nuevos títulos elegibles.
 */
export async function evaluateAndUnlockEligibleTitles(userId, stats, currentUnlockedIds = []) {
  if (!userId || !stats) return [];

  const newlyUnlocked = [];
  const existingSet = new Set(currentUnlockedIds);

  for (const title of TITLES_CATALOG) {
    if (existingSet.has(title.id)) continue;

    try {
      if (typeof title.checkUnlock === 'function' && title.checkUnlock(stats)) {
        // Otorgar en base de datos
        const { error } = await supabase
          .from('user_unlocked_titles')
          .insert({ user_id: userId, title_id: title.id });

        if (!error) {
          newlyUnlocked.push(title);
          existingSet.add(title.id);
        }
      }
    } catch (err) {
      console.warn(`No se pudo otorgar título ${title.id}:`, err);
    }
  }

  return newlyUnlocked;
}
