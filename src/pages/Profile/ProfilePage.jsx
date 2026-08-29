import { useEffect, useState } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { fetchUserProfile, fetchUserProgress, updateUserProfile } from '../../services/supabase/progress';
import { getSignedAvatarUrl, uploadAvatar, deleteAvatar } from '../../services/supabase/storage';

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

export default function ProfilePage() {
  const { user, loading } = useAuthSession();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const [streak, setStreak] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);
  const [practicedCount, setPracticedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const resolveAvatarPreviewUrl = async (storedAvatar) => {
    if (!storedAvatar) return '';

    try {
      const fn = await getSignedAvatarUrl(storedAvatar, 60);
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
        const [profileRes, progressRes] = await Promise.all([
          fetchUserProfile(user.id),
          fetchUserProgress(user.id),
        ]);

        if (profileRes.error) throw profileRes.error;
        if (!mounted) return;

        setProfile(profileRes.data ?? null);
        setUsername(profileRes.data?.username ?? '');
        setAvatarPreviewUrl(await resolveAvatarPreviewUrl(profileRes.data?.avatar_url ?? ''));

        if (progressRes.data) {
          const rows = progressRes.data;
          setPracticedCount(rows.length);
          const learned = rows.filter((r) => r.correct || (r.mastery_level ?? 0) >= 1).length;
          setLearnedCount(learned);
        }
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

  useEffect(() => {
    if (!user?.id) {
      setStreak(0);
      return;
    }
    const saved = Number(sessionStorage.getItem(getStreakStorageKey(user.id)) ?? 0);
    setStreak(Number.isFinite(saved) ? saved : 0);
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

      const { error } = await updateUserProfile(user.id, updates);

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
      const blob = await processImage(file);
      const path = `${user.id}/avatar.png`;

      const { error: uploadError } = await uploadAvatar(path, blob);
      if (uploadError) throw uploadError;

      const storagePath = path;
      const { error: updateError } = await updateUserProfile(user.id, { avatar_url: storagePath });
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
      const { error: removeError } = await deleteAvatar(storedPath);
      if (removeError) {
        console.warn('Error removing avatar from storage:', removeError);
      }

      const { error: updateError } = await updateUserProfile(user.id, { avatar_url: null });
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
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm font-semibold text-[#6b2832]">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto rounded-[1.75rem] border border-[#eaded6] bg-white p-4 sm:p-8 shadow-[0_14px_34px_rgba(128,43,56,0.06)] space-y-6">
      <div>
        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#6b2832]/70 font-semibold">Perfil</p>
        <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[#6b2832] md:text-4xl">Mi perfil</h1>
        <p className="mt-1 text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
          Gestiona tu información pública, avatar y revisa tus estadísticas globales de aprendizaje.
        </p>
      </div>

      {profile ? (
        <div className="space-y-5">
          {/* Main Profile Info Card */}
          <form onSubmit={handleSave} className="grid gap-4 rounded-[1.5rem] border border-[#eaded6] bg-[#fcfaf8] p-4 sm:p-6 shadow-[0_10px_22px_rgba(128,43,56,0.04)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="shrink-0 relative group">
                  {avatarPreviewUrl ? (
                    <img src={avatarPreviewUrl} alt="avatar" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-sm ring-2 ring-[#e3b8b1]" />
                  ) : (
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-xl font-bold text-white shadow-sm ring-2 ring-[#e3b8b1]">
                      {(profile.username || 'J').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-neutral))]/70">Nivel de Jugador</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#6b2832]">Nivel {profile.level ?? 1}</div>
                  <div className="mt-0.5 text-xs text-[rgb(var(--color-neutral))]/70 font-mono font-medium">
                    {profile.experience ?? 0} XP acumulados
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5 sm:min-w-[18rem] sm:max-w-[22rem] sm:flex-1 sm:justify-items-stretch">
                <label className="text-xs font-bold text-[#6b2832]">Nombre de usuario</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border border-[#eaded6] bg-white px-3.5 py-2.5 min-h-[44px] text-sm text-[rgb(var(--color-neutral))] outline-none focus:border-[#6b2832] focus:ring-2 focus:ring-[rgba(107,40,50,0.12)] transition"
                  placeholder="Tu nombre público"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-[#eaded6]/70">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl bg-[#6b2832] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#581f27] disabled:cursor-not-allowed disabled:opacity-70 active:scale-98 shadow-xs"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              {error ? <div className="text-xs sm:text-sm text-red-600 font-medium">{error}</div> : null}
              {info ? <div className="text-xs sm:text-sm text-emerald-700 font-medium">{info}</div> : null}
            </div>
          </form>

          {/* User Statistics Grid */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-[#6b2832]">Estadísticas de Aprendizaje</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Racha */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-[#f2e6df] bg-[#fcfaf8] p-4 shadow-2xs transition hover:bg-white">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fbeae5] text-xl shadow-inner border border-[#f2d2cc]">
                  🔥
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--color-neutral))]/60">
                    Racha Actual
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#6b2832]">
                    {streak} {streak === 1 ? 'día activo' : 'días activos'}
                  </div>
                  <div className="text-[10px] text-[rgb(var(--color-neutral))]/60 truncate">
                    {streak > 0 ? '¡Racha de estudio activa!' : '¡Inicia tu racha hoy!'}
                  </div>
                </div>
              </div>

              {/* Total XP */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-[#f2e6df] bg-[#fcfaf8] p-4 shadow-2xs transition hover:bg-white">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff6e6] text-xl shadow-inner border border-[#fae2be]">
                  ⭐
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--color-neutral))]/60">
                    Total Experiencia
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#6b2832] font-mono">
                    {profile.experience ?? 0} <span className="text-xs font-normal text-[rgb(var(--color-neutral))]/60">XP</span>
                  </div>
                  <div className="text-[10px] text-[rgb(var(--color-neutral))]/60 truncate">
                    Nivel {profile.level ?? 1} de maestría
                  </div>
                </div>
              </div>

              {/* Palabras Dominadas */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-[#f2e6df] bg-[#fcfaf8] p-4 shadow-2xs transition hover:bg-white">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f0] text-xl shadow-inner border border-[#d2e4d8]">
                  📚
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[rgb(var(--color-neutral))]/60">
                    Palabras Dominadas
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-800">
                    {learnedCount} aprendidas
                  </div>
                  <div className="text-[10px] text-[rgb(var(--color-neutral))]/60 truncate">
                    {practicedCount} practicadas en total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-sm text-[rgb(var(--color-neutral))]/70">No se encontró perfil. Usa el registro o crea un perfil en la base de datos.</div>
      )}
    </section>
  );
}
