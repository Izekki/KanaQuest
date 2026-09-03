import { supabase } from './client';

const avatarUrlCache = new Map();
const AVATAR_TTL_MS = 60 * 60 * 1000; // 1 hora de caché local
const STORAGE_CACHE_PREFIX = 'kanaquest_avatar_url:';

export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB estándar
export const ALLOWED_AVATAR_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const ALLOWED_AVATAR_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

/**
 * Valida de forma estricta que el archivo sea una imagen segura y permitida.
 * Rechaza scripts, SVGs, ejecutables, textos y archivos sobredimensionados.
 */
export function validateAvatarFile(file) {
  if (!file) {
    return 'No se seleccionó ningún archivo.';
  }

  // 1. Validar tamaño
  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return `La imagen no debe superar los 2MB (tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`;
  }

  // 2. Validar extensión de archivo
  const fileName = (file.name || '').toLowerCase();
  const hasValidExtension = ALLOWED_AVATAR_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return 'Formato no permitido. Solo se aceptan archivos JPG, JPEG, PNG o WEBP.';
  }

  // 3. Validar tipo MIME
  const mimeType = (file.type || '').toLowerCase();
  if (!ALLOWED_AVATAR_MIME_TYPES.includes(mimeType)) {
    return 'Tipo de archivo no permitido. Solo se admiten imágenes válidas (JPG, PNG, WEBP).';
  }

  return null;
}

/**
 * Lee la URL en caché de memoria o almacenamiento persistente.
 */
function getCachedUrl(path) {
  if (!path) return null;

  const now = Date.now();
  // 1. Memoria rápida
  const memCached = avatarUrlCache.get(path);
  if (memCached && now - memCached.timestamp < AVATAR_TTL_MS) {
    return memCached.url;
  }

  // 2. Storage local / sesión
  try {
    const raw = sessionStorage.getItem(`${STORAGE_CACHE_PREFIX}${path}`) || localStorage.getItem(`${STORAGE_CACHE_PREFIX}${path}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.url && now - (parsed.timestamp || 0) < AVATAR_TTL_MS) {
        avatarUrlCache.set(path, parsed);
        return parsed.url;
      }
    }
  } catch {}

  return null;
}

function setCachedUrl(path, url) {
  if (!path || !url) return;
  const entry = { url, timestamp: Date.now() };
  avatarUrlCache.set(path, entry);
  try {
    const serialized = JSON.stringify(entry);
    sessionStorage.setItem(`${STORAGE_CACHE_PREFIX}${path}`, serialized);
    localStorage.setItem(`${STORAGE_CACHE_PREFIX}${path}`, serialized);
  } catch {}
}

/**
 * Resuelve de forma instantánea la URL firmada o pública de un avatar con caché multinivel.
 */
export async function getSignedAvatarUrl(path, expires = 3600, forceRefresh = false) {
  if (!path) return { data: null, error: null };
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return { data: { signedUrl: path }, error: null };
  }

  if (!forceRefresh) {
    const cachedUrl = getCachedUrl(path);
    if (cachedUrl) {
      return { data: { signedUrl: cachedUrl }, error: null };
    }
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
    setCachedUrl(path, finalUrl);
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
    try {
      sessionStorage.removeItem(`${STORAGE_CACHE_PREFIX}${path}`);
      localStorage.removeItem(`${STORAGE_CACHE_PREFIX}${path}`);
    } catch {}
  } else {
    avatarUrlCache.clear();
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(STORAGE_CACHE_PREFIX))
        .forEach((k) => sessionStorage.removeItem(k));
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_CACHE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
  }
}

/**
 * Sube el archivo con verificación estricta de tipo y peso.
 */
export async function uploadAvatar(path, fileBlob) {
  if (!fileBlob) {
    throw new Error('No se proporcionó ningún archivo de imagen para subir.');
  }

  if (fileBlob.size > MAX_AVATAR_SIZE_BYTES) {
    throw new Error('El archivo excede el límite permitido de 2MB.');
  }

  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (fileBlob.type && !validTypes.includes(fileBlob.type.toLowerCase())) {
    throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (PNG, JPG, WEBP).');
  }

  invalidateAvatarCache(path);

  return await supabase.storage
    .from('avatars')
    .upload(path, fileBlob, {
      contentType: fileBlob.type || 'image/png',
      cacheControl: '3600',
      upsert: true,
    });
}

export async function deleteAvatar(path) {
  invalidateAvatarCache(path);
  return await supabase.storage
    .from('avatars')
    .remove([path]);
}
