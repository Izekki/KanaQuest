import { supabase } from './client';

export async function getSignedAvatarUrl(path, expires = 60) {
  return await supabase.functions.invoke('get-signed-url', {
    body: { path, expires },
  });
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
