import { useEffect, useState } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { supabase } from '../../services/supabase/client';

export default function ProfilePage() {
  const { user, loading } = useAuthSession();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const resolveAvatarPreviewUrl = async (storedAvatar) => {
    if (!storedAvatar) return '';

    try {
      const fn = await supabase.functions.invoke('get-signed-url', { body: { path: storedAvatar, expires: 60 } });
      return fn?.data?.signedUrl ?? '';
    } catch (err) {
      console.warn('No se pudo obtener signed url para avatar:', err);
      return '';
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username,avatar_url,level,experience')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (!mounted) return;
        setProfile(data ?? null);
        setUsername(data?.username ?? '');
        setAvatarPreviewUrl(await resolveAvatarPreviewUrl(data?.avatar_url ?? ''));
      } catch (err) {
        setError('No se pudo cargar el perfil.');
        console.warn(err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setInfo('');

    if (!user?.id) {
      setError('No estás autenticado.');
      setSaving(false);
      return;
    }

    try {
      const updates = {
        username: username?.trim(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setInfo('Perfil actualizado.');
      // refresh local view
      setProfile((p) => ({ ...(p ?? {}), ...updates }));
      window.dispatchEvent(
        new CustomEvent('kanaquest-profile-updated', {
          detail: {
            username: updates.username || 'Jugador',
          },
        }),
      );
    } catch (err) {
      console.warn(err);
      const msg = err?.message ?? String(err);
      if (msg.includes('profiles_username_key')) {
        setError('El nombre de usuario ya está en uso. Elige otro.');
      } else {
        setError('Error al actualizar perfil.');
      }
    } finally {
      setSaving(false);
    }
  };

  const validateFile = (file) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (!allowed.includes(file.type)) {
      return 'Solo se permiten imágenes PNG, JPEG o WEBP.';
    }
    if (file.size > maxBytes) {
      return 'La imagen supera el tamaño máximo de 2MB.';
    }
    return null;
  };

  const processImage = (file, maxDim = 1024) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('No se pudo procesar la imagen'));
            resolve(blob);
          },
          'image/png',
          0.9,
        );
      };
      img.onerror = (err) => reject(err);
      // Force CORS anonymous to allow drawing from blob urls
      img.crossOrigin = 'anonymous';
      const reader = new FileReader();
      reader.onload = () => {
        img.src = String(reader.result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleUploadAvatar = async (file) => {
    setError('');
    setInfo('');
    if (!user?.id) {
      setError('No estás autenticado.');
      return;
    }

    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setSaving(true);
      // sanitize by re-encoding the image in the browser
      const blob = await processImage(file);

      // one avatar per user: always write to the same object key
      const path = `${user.id}/avatar.png`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const storagePath = path;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: storagePath })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const previewUrl = await resolveAvatarPreviewUrl(storagePath);
      setProfile((p) => ({ ...(p ?? {}), avatar_url: storagePath }));
      setAvatarPreviewUrl(previewUrl);
      setInfo('Avatar subido y guardado.');
    } catch (err) {
      console.error(err);
      setError('Error al subir el avatar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setError('');
    setInfo('');
    if (!user?.id) {
      setError('No estás autenticado.');
      return;
    }

    if (!profile?.avatar_url) {
      setError('No hay avatar para eliminar.');
      return;
    }

    if (!window.confirm('¿Eliminar avatar? Esta acción reemplazará tu avatar actual.')) return;

    try {
      setSaving(true);

      const storedPath = profile.avatar_url;

      const { error: removeError } = await supabase.storage.from('avatars').remove([storedPath]);
      if (removeError) {
        console.warn('Error removing avatar from storage:', removeError);
        // continue — we still unset the DB reference
      }

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: null }).eq('user_id', user.id);
      if (updateError) throw updateError;

      setProfile((p) => ({ ...(p ?? {}), avatar_url: null }));
      setAvatarPreviewUrl('');
      setInfo('Avatar eliminado.');
    } catch (err) {
      console.error(err);
      setError('Error al eliminar avatar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <section className="rounded-[1.75rem] border border-[#eaded6] bg-white p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
      <p className="text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">Perfil</p>
      <h1 className="mt-4 text-3xl font-semibold text-[rgb(var(--color-accent))] md:text-5xl">Mi perfil</h1>

      {profile ? (
        <form onSubmit={handleSave} className="mt-6 grid gap-4">
          <div className="grid gap-4 rounded-[1.5rem] border border-[#eaded6] bg-[#fcfaf8] p-5 shadow-[0_10px_22px_rgba(128,43,56,0.05)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {avatarPreviewUrl ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img src={avatarPreviewUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-xl font-semibold text-white">{(profile.username || 'J').slice(0, 1).toUpperCase()}</div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-[rgb(var(--color-neutral))]/80">Nivel</div>
                  <div className="text-xl font-semibold text-[rgb(var(--color-accent))]">{profile.level ?? 1}</div>
                  <div className="mt-2 text-sm text-[rgb(var(--color-neutral))]/70">Experiencia: {profile.experience ?? 0}</div>
                </div>
              </div>

              <div className="grid gap-3 sm:min-w-[18rem] sm:max-w-[22rem] sm:flex-1 sm:justify-items-stretch">
                <label className="text-xs text-[rgb(var(--color-accent))]/70">Nombre de usuario</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border border-[#eaded6] px-3 py-2 text-sm"
                  placeholder="Tu nombre público"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-5 py-2.5 text-white transition hover:bg-[rgb(var(--color-accent-dark))] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <div className="min-h-5 text-sm text-red-600">{error}</div>
              <div className="min-h-5 text-sm text-[rgb(var(--color-accent))]">{info}</div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-6 text-sm text-[rgb(var(--color-neutral))]/70">No se encontró perfil. Usa el registro o crea un perfil en la base de datos.</div>
      )}
    </section>
  );
}
