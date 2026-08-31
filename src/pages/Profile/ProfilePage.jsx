import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { getUser } from '../../services/supabase/auth';
import { fetchUserProfile, fetchUserProgress, updateUserProfile } from '../../services/supabase/progress';
import { getSignedAvatarUrl, uploadAvatar, deleteAvatar } from '../../services/supabase/storage';

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuthSession();
  const [activeUser, setActiveUser] = useState(authUser ?? null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const [streak, setStreak] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);
  const [practicedCount, setPracticedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const fileInputRef = useRef(null);

  const resolveAvatarPreviewUrl = async (storedAvatar) => {
    if (!storedAvatar) return '';
    if (storedAvatar.startsWith('http://') || storedAvatar.startsWith('https://') || storedAvatar.startsWith('blob:')) {
      return storedAvatar;
    }

    try {
      const fn = await getSignedAvatarUrl(storedAvatar, 60);
      return fn?.data?.signedUrl ?? '';
    } catch (err) {
      console.warn('No se pudo obtener signed url para avatar:', err);
      return '';
    }
  };

  const loadUserData = useCallback(async (userObj) => {
    if (!userObj?.id) return;

    try {
      setLoading(true);
      setError('');

      const [profileRes, progressRes] = await Promise.all([
        fetchUserProfile(userObj.id),
        fetchUserProgress(userObj.id),
      ]);

      const data = profileRes?.data;
      const fallbackUsername = userObj.user_metadata?.username || userObj.email?.split('@')[0] || 'Jugador';

      const resolvedProfile = data || {
        username: fallbackUsername,
        level: 1,
        experience: 0,
        role: 'player',
        title: 'Novato del Kanji',
        current_streak: 0,
        avatar_url: null,
      };

      setProfile(resolvedProfile);
      setUsername(resolvedProfile.username || fallbackUsername);

      // Resolve streak from DB and sessionStorage
      const savedStreak = Number(sessionStorage.getItem(getStreakStorageKey(userObj.id)) ?? 0);
      const dbStreak = resolvedProfile.current_streak ?? 0;
      setStreak(Math.max(dbStreak, Number.isFinite(savedStreak) ? savedStreak : 0));

      if (resolvedProfile.avatar_url) {
        const preview = await resolveAvatarPreviewUrl(resolvedProfile.avatar_url);
        setAvatarPreviewUrl(preview);
      } else {
        setAvatarPreviewUrl('');
      }

      if (progressRes?.data) {
        const rows = progressRes.data;
        setPracticedCount(rows.length);
        const learned = rows.filter((r) => r.correct || (r.mastery_level ?? 0) >= 1).length;
        setLearnedCount(learned);
      }
    } catch (err) {
      console.warn('Error al cargar datos del perfil:', err);
      setError('No se pudo cargar toda la información del perfil.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync auth user session with fallback to getUser()
  useEffect(() => {
    let isMounted = true;

    const resolveSession = async () => {
      let resolved = authUser;
      if (!resolved) {
        const { data: authData } = await getUser();
        resolved = authData?.user ?? null;
      }

      if (!isMounted) return;

      if (resolved?.id) {
        setActiveUser(resolved);
        await loadUserData(resolved);
      } else if (!authLoading) {
        setActiveUser(null);
        setLoading(false);
      }
    };

    resolveSession();

    return () => {
      isMounted = false;
    };
  }, [authUser, authLoading, loadUserData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setInfo('');

    const userId = activeUser?.id || authUser?.id;
    if (!userId) {
      setError('No estás autenticado.');
      setSaving(false);
      return;
    }

    try {
      const cleanUsername = username?.trim() || 'Jugador';
      const updates = {
        username: cleanUsername,
      };

      const { error: updateError } = await updateUserProfile(userId, updates);
      if (updateError) throw updateError;

      setInfo('Perfil actualizado con éxito.');
      setProfile((p) => ({ ...(p ?? {}), ...updates }));

      window.dispatchEvent(
        new CustomEvent('kanaquest-profile-updated', {
          detail: {
            username: cleanUsername,
          },
        }),
      );
    } catch (err) {
      console.warn(err);
      const msg = err?.message ?? String(err);
      if (msg.includes('profiles_username_key')) {
        setError('El nombre de usuario ya está en uso. Elige otro.');
      } else {
        setError('Error al actualizar el perfil.');
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

    const userId = activeUser?.id || authUser?.id;
    if (!userId) {
      setError('No estás autenticado.');
      return;
    }

    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setUploadingAvatar(true);
      const blob = await processImage(file);
      const path = `${userId}/avatar.png`;

      const { error: uploadError } = await uploadAvatar(path, blob);
      if (uploadError) throw uploadError;

      const storagePath = path;
      const { error: updateError } = await updateUserProfile(userId, { avatar_url: storagePath });
      if (updateError) throw updateError;

      const previewUrl = await resolveAvatarPreviewUrl(storagePath);
      setProfile((p) => ({ ...(p ?? {}), avatar_url: storagePath }));
      setAvatarPreviewUrl(previewUrl);
      setInfo('Avatar actualizado y guardado correctamente.');

      window.dispatchEvent(
        new CustomEvent('kanaquest-profile-updated', {
          detail: {
            username,
            avatar_url: storagePath,
          },
        }),
      );
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Error al subir el avatar.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    setError('');
    setInfo('');

    const userId = activeUser?.id || authUser?.id;
    if (!userId) {
      setError('No estás autenticado.');
      return;
    }

    if (!profile?.avatar_url) {
      setError('No hay avatar para eliminar.');
      return;
    }

    if (!window.confirm('¿Deseas eliminar tu avatar y volver al avatar predeterminado?')) return;

    try {
      setUploadingAvatar(true);
      const storedPath = profile.avatar_url;
      const { error: removeError } = await deleteAvatar(storedPath);
      if (removeError) {
        console.warn('Error removing avatar from storage:', removeError);
      }

      const { error: updateError } = await updateUserProfile(userId, { avatar_url: null });
      if (updateError) throw updateError;

      setProfile((p) => ({ ...(p ?? {}), avatar_url: null }));
      setAvatarPreviewUrl('');
      setInfo('Avatar eliminado con éxito.');

      window.dispatchEvent(
        new CustomEvent('kanaquest-profile-updated', {
          detail: {
            username,
            avatar_url: null,
          },
        }),
      );
    } catch (err) {
      console.error('Error deleting avatar:', err);
      setError('Error al eliminar avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[360px] w-full items-center justify-center py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-[#eaded6] bg-white px-6 py-4 shadow-sm text-sm font-semibold text-[#6b2832]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#6b2832] border-t-transparent" />
          <span>Cargando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto rounded-[1.75rem] border border-[#eaded6] bg-white p-4 sm:p-8 shadow-[0_14px_34px_rgba(128,43,56,0.06)] space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#6b2832]/70 font-semibold">Perfil</p>
        <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-extrabold text-[#6b2832] md:text-4xl">Mi perfil</h1>
        <p className="mt-1 text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
          Gestiona tu información pública, avatar personalizado y revisa tus estadísticas globales de aprendizaje.
        </p>
      </div>

      {profile ? (
        <div className="space-y-6">
          {/* Main Profile Card */}
          <div className="rounded-[1.5rem] border border-[#eaded6] bg-[#fcfaf8] p-4 sm:p-6 shadow-[0_10px_22px_rgba(128,43,56,0.04)] space-y-5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Avatar + Basic Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative group shrink-0">
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Avatar de usuario"
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover shadow-sm ring-2 ring-[#e3b8b1]"
                    />
                  ) : (
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-2xl font-bold text-white shadow-sm ring-2 ring-[#e3b8b1]">
                      {(profile.username || 'J').slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-neutral))]/70">
                      Nivel de Jugador
                    </span>
                    {profile.role === 'admin' ? (
                      <span className="rounded-full bg-[rgb(var(--color-accent))] px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider">
                        Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#f0e4de] px-2 py-0.5 text-[9px] font-bold text-[rgb(var(--color-accent))] uppercase tracking-wider">
                        Jugador
                      </span>
                    )}
                  </div>

                  <div className="text-xl sm:text-2xl font-extrabold text-[#6b2832]">
                    Nivel {profile.level ?? 1}
                  </div>

                  <div className="text-xs text-[rgb(var(--color-neutral))]/70 font-mono font-medium">
                    {profile.experience ?? 0} XP acumulados
                  </div>

                  {profile.title && (
                    <div className="mt-1 inline-flex items-center rounded-md bg-[rgb(var(--color-surface-alt))] px-2.5 py-0.5 text-[11px] font-semibold text-[rgb(var(--color-accent))] border border-[#ebdcd3]">
                      <span>{profile.title}</span>
                    </div>
                  )}

                  {/* Avatar Upload Actions */}
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="avatar-file-input"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAvatar(file);
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar || saving}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#eaded6] bg-white px-2.5 py-1 text-xs font-semibold text-[#6b2832] transition hover:bg-[#faf4f2] disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span>Cambiar foto</span>
                    </button>

                    {profile.avatar_url && (
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={uploadingAvatar || saving}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/70 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100/80 disabled:opacity-50"
                        title="Eliminar avatar personalizado"
                      >
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Username Form */}
              <form onSubmit={handleSave} className="grid gap-3 w-full lg:max-w-md">
                <div className="grid gap-1.5">
                  <label htmlFor="profile-username" className="text-xs font-bold text-[#6b2832]">
                    Nombre de usuario público
                  </label>
                  <input
                    id="profile-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl border border-[#eaded6] bg-white px-3.5 py-2.5 min-h-[44px] text-sm text-[rgb(var(--color-neutral))] outline-none focus:border-[#6b2832] focus:ring-2 focus:ring-[rgba(107,40,50,0.12)] transition"
                    placeholder="Tu nombre público"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving || uploadingAvatar}
                    className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-xl bg-[#6b2832] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#581f27] disabled:cursor-not-allowed disabled:opacity-70 active:scale-98 shadow-xs"
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>

            {/* Notification messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm font-medium text-emerald-800">
                {info}
              </div>
            )}
          </div>

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
        <div className="rounded-2xl border border-[#eaded6] bg-[#fcfaf8] p-6 text-center text-sm text-[rgb(var(--color-neutral))]/70">
          Inicia sesión para gestionar y visualizar las estadísticas de tu perfil.
        </div>
      )}
    </section>
  );
}
