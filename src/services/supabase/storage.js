import { supabase } from './client';

export async function getSignedAvatarUrl(path, expires = 60) {
  if (!path) return { data: null, error: null };
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return { data: { signedUrl: path }, error: null };
  }

  try {
    const { data: signedData, error: signedError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, expires);
    if (!signedError && signedData?.signedUrl) {
      return { data: signedData, error: null };
    }
  } catch (err) {
    console.debug('Storage createSignedUrl fallback:', err);
  }

  try {
    const { data: pubData } = supabase.storage.from('avatars').getPublicUrl(path);
    if (pubData?.publicUrl) {
      return { data: { signedUrl: pubData.publicUrl }, error: null };
    }
  } catch (err) {
    console.debug('Storage getPublicUrl fallback:', err);
  }

  try {
    return await supabase.functions.invoke('get-signed-url', {
      body: { path, expires },
    });
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function uploadAvatar(path, fileBlob) {
  return await supabase.storage
    .from('avatars')
    .upload(path, fileBlob, { cacheControl: '3600', upsert: true });
}

export async function deleteAvatar(path) {
  return await supabase.storage
    .from('avatars')
    .remove([path]);
}
