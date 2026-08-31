import { supabase } from './client';

const avatarUrlCache = new Map();
const AVATAR_TTL_MS = 10 * 60 * 1000; // 10 minutos de caché para URLs resueltas

/**
 * Resuelve y almacena en caché la URL firmada o pública de un avatar.
 */
export async function getSignedAvatarUrl(path, expires = 60, forceRefresh = false) {
  if (!path) return { data: null, error: null };
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return { data: { signedUrl: path }, error: null };
  }

  const cached = avatarUrlCache.get(path);
  const now = Date.now();
  if (!forceRefresh && cached && now - cached.timestamp < AVATAR_TTL_MS) {
    return { data: { signedUrl: cached.url }, error: null };
  }

  let finalUrl = null;

  try {
    const { data: signedData, error: signedError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, expires);
    if (!signedError && signedData?.signedUrl) {
      finalUrl = signedData.signedUrl;
    }
  } catch (err) {
    console.debug('Storage createSignedUrl fallback:', err);
  }

  if (!finalUrl) {
    try {
      const { data: pubData } = supabase.storage.from('avatars').getPublicUrl(path);
      if (pubData?.publicUrl) {
        finalUrl = pubData.publicUrl;
      }
    } catch (err) {
      console.debug('Storage getPublicUrl fallback:', err);
    }
  }

  if (!finalUrl) {
    try {
      const res = await supabase.functions.invoke('get-signed-url', {
        body: { path, expires },
      });
      if (res?.data?.signedUrl) {
        finalUrl = res.data.signedUrl;
      }
    } catch (err) {
      console.debug('Storage Edge Function invoke fallback:', err);
    }
  }

  if (finalUrl) {
    avatarUrlCache.set(path, { url: finalUrl, timestamp: Date.now() });
    return { data: { signedUrl: finalUrl }, error: null };
  }

  return { data: null, error: new Error('No se pudo resolver la URL del avatar') };
}

/**
 * Invalida la caché del avatar para forzar una nueva URL al subir o eliminar.
 */
export function invalidateAvatarCache(path = null) {
  if (path) {
    avatarUrlCache.delete(path);
  } else {
    avatarUrlCache.clear();
  }
}

export async function uploadAvatar(path, fileBlob) {
  invalidateAvatarCache(path);
  return await supabase.storage
    .from('avatars')
    .upload(path, fileBlob, { cacheControl: '3600', upsert: true });
}

export async function deleteAvatar(path) {
  invalidateAvatarCache(path);
  return await supabase.storage
    .from('avatars')
    .remove([path]);
}
