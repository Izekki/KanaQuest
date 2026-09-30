import { useEffect, useState, useCallback } from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import { getUser } from '../../services/supabase/auth';
import {
  fetchUserProfile,
  fetchUserProgress,
  fetchRecentProgress,
  updateUserProfile,
} from '../../services/supabase/progress';
import { fetchWords } from '../../services/supabase/words';
import {
  getSignedAvatarUrl,
  uploadAvatar,
  deleteAvatar,
  validateAvatarFile,
} from '../../services/supabase/storage';
import { fetchUserUnlockedTitles, equipTitle } from '../../services/supabase/titles';
import TitlesSelectorModal from '../../components/profile/TitlesSelectorModal';
import ProfileIdentityHero from '../../components/profile/ProfileIdentityHero';
import ProfileStatsStrip from '../../components/profile/ProfileStatsStrip';
import ProfileLearningBreakdown from '../../components/profile/ProfileLearningBreakdown';
import ProfileContinueLearning from '../../components/profile/ProfileContinueLearning';
import ProfileEditModal from '../../components/profile/ProfileEditModal';
import { usePageSeo } from '../../hooks/usePageSeo';

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

// Linguistic Script Categorization Helpers
const containsKanji = (str = '') => /[\u4e00-\u9faf]/u.test(str);
const isHiragana = (str = '') => /^[\u3040-\u309fー\s]+$/u.test(str);
const isKatakana = (str = '') => /^[\u30a0-\u30ffー\s]+$/u.test(str);

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuthSession();

  usePageSeo({
    title: 'Mi Perfil de Aprendizaje',
    description: 'Espacio personal de aprendizaje en KanaQuest: revisa tu nivel, racha, títulos desbloqueados y avance por categorías.',
    canonicalPath: '/profile',
  });
  const [activeUser, setActiveUser] = useState(authUser ?? null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit profile states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Statistics & Learning progress states
  const [streak, setStreak] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);
  const [totalCatalogWords, setTotalCatalogWords] = useState(0);
  const [learningStats, setLearningStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);

  // Titles modal states
  const [isTitlesModalOpen, setIsTitlesModalOpen] = useState(false);
  const [unlockedTitleIds, setUnlockedTitleIds] = useState(['novato_kanji']);
  const [isEquippingTitle, setIsEquippingTitle] = useState(false);

  const resolveAvatarPreviewUrl = async (storedAvatar) => {
    if (!storedAvatar) return '';
    if (storedAvatar.startsWith('http://') || storedAvatar.startsWith('https://') || storedAvatar.startsWith('blob:')) {
      return storedAvatar;
    }

    try {
      const fn = await getSignedAvatarUrl(storedAvatar, 3600);
      return fn?.data?.signedUrl ?? '';
    } catch (err) {
      console.warn('No se pudo obtener signed url para avatar:', err);
      return '';
    }
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
        if (!ctx) return reject(new Error('No se pudo inicializar el procesador de imagen.'));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('No se pudo procesar la imagen de forma segura.'));
            resolve(blob);
          },
          'image/png',
          0.92,
        );
      };
      img.onerror = () => reject(new Error('El archivo seleccionado no es una imagen válida o está corrupto.'));
      img.crossOrigin = 'anonymous';
      const reader = new FileReader();
      reader.onload = () => {
        img.src = String(reader.result);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo.'));
      reader.readAsDataURL(file);
    });

  const loadUserData = useCallback(async (userObj) => {
    if (!userObj?.id) return;

    try {
      setLoading(true);
      setError('');

      const [profileRes, progressRes, unlockedRes, wordsRes, recentRes] = await Promise.all([
        fetchUserProfile(userObj.id),
        fetchUserProgress(userObj.id),
        fetchUserUnlockedTitles(userObj.id),
        fetchWords(300),
        fetchRecentProgress(userObj.id, 1),
      ]);

      const data = profileRes?.data;
      const fallbackUsername = userObj.user_metadata?.username || userObj.email?.split('@')[0] || 'Jugador';

      const resolvedProfile = data || {
        username: fallbackUsername,
        level: 1,
        experience: 0,
        role: 'player',
        title: 'Novato del Kanji',
        title_id: 'novato_kanji',
        current_streak: 0,
        avatar_url: null,
      };

      setProfile(resolvedProfile);
      setEditUsername(resolvedProfile.username || fallbackUsername);

      if (unlockedRes?.data) {
        setUnlockedTitleIds(unlockedRes.data);
      }

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

      // Correlate Real Learning Progress
      const allWords = wordsRes?.data ?? [];
      setTotalCatalogWords(allWords.length);

      const progressRows = progressRes?.data ?? [];
      const masteredSet = new Set(
        progressRows
          .filter((r) => r.correct || (r.mastery_level ?? 0) >= 1)
          .map((r) => r.word_id)
      );
      setLearnedCount(masteredSet.size);

      // Categorize Catalog Words & Compute Real Mastery
      let hTotal = 0, hLearned = 0;
      let kTotal = 0, kLearned = 0;
      let kjTotal = 0, kjLearned = 0;

      allWords.forEach((w) => {
        const isMastered = masteredSet.has(w.id);
        const jp = w.japanese || '';

        if (containsKanji(jp)) {
          kjTotal++;
          if (isMastered) kjLearned++;
        } else if (isHiragana(jp)) {
          hTotal++;
          if (isMastered) hLearned++;
        } else if (isKatakana(jp)) {
          kTotal++;
          if (isMastered) kLearned++;
        }
      });

      setLearningStats({
        hiragana: {
          learned: hLearned,
          total: hTotal,
          percent: hTotal > 0 ? Math.round((hLearned / hTotal) * 100) : 0,
        },
        katakana: {
          learned: kLearned,
          total: kTotal,
          percent: kTotal > 0 ? Math.round((kLearned / kTotal) * 100) : 0,
        },
        kanji: {
          learned: kjLearned,
          total: kjTotal,
          percent: kjTotal > 0 ? Math.round((kjLearned / kjTotal) * 100) : 0,
        },
      });

      // Recent Activity for Continuation
      if (recentRes?.data && recentRes.data.length > 0) {
        setRecentActivity(recentRes.data[0]);
      } else {
        setRecentActivity(null);
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

  const handleEquipTitle = async (titleId, titleName) => {
    const userId = activeUser?.id || authUser?.id;
    if (!userId) return;

    try {
      setIsEquippingTitle(true);
      setError('');
      const res = await equipTitle(userId, titleId, titleName);
      if (res?.error) throw res.error;

      setProfile((p) => ({
        ...(p ?? {}),
        title_id: titleId,
        title: titleName,
      }));

      window.dispatchEvent(
        new CustomEvent('kanaquest-profile-updated', {
          detail: {
            title: titleName,
            title_id: titleId,
          },
        }),
      );

      setInfo(`Título equipado: «${titleName}»`);
      setIsTitlesModalOpen(false);
    } catch (err) {
      console.warn('Error al equipar título:', err);
      setError('No se pudo equipar el título seleccionado.');
    } finally {
      setIsEquippingTitle(false);
    }
  };

  const handleSaveProfile = async (e) => {
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
      const cleanUsername = editUsername?.trim() || 'Jugador';
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

      // Auto close modal after successful save
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 700);
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

  const handleUploadAvatar = async (file) => {
    setError('');
    setInfo('');

    const userId = activeUser?.id || authUser?.id;
    if (!userId) {
      setError('No estás autenticado.');
      return;
    }

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
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
            username: editUsername,
            avatar_url: storagePath,
          },
        }),
      );
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Error al subir el avatar.');
    } finally {
      setUploadingAvatar(false);
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

    if (!window.confirm('¿Deseas eliminar tu foto de perfil y volver a la mascota predeterminada?')) return;

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
            username: editUsername,
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
        <div className="flex items-center gap-3 rounded-2xl border border-[#eaded6] bg-white/90 px-6 py-4 shadow-sm text-sm font-semibold text-[#6b2832]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#6b2832] border-t-transparent" />
          <span>Cargando tu perfil...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12 space-y-4">
        <div className="rounded-2xl border border-[#eaded6] bg-white/90 p-8 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#6b2832]">Espacio Personal</h2>
          <p className="text-sm text-[rgb(var(--color-neutral))]/70">
            Inicia sesión para personalizar tu identidad, equipar títulos y revisar tu progreso de aprendizaje.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* 1. Concise, Elegant Header */}
      <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-1">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#6b2832]/65">
            Espacio Personal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#6b2832] tracking-tight">
            Mi Perfil
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/60">
          Tu identidad y progreso en KanaQuest
        </p>
      </header>

      {/* 2. User Identity Hero Section (Protagonist) */}
      <ProfileIdentityHero
        profile={profile}
        avatarPreviewUrl={avatarPreviewUrl}
        onOpenEditModal={() => {
          setError('');
          setInfo('');
          setIsEditModalOpen(true);
        }}
        onOpenTitlesModal={() => setIsTitlesModalOpen(true)}
      />

      {/* 3. Progress Stats Strip (Lightweight, No Dashboard Clutter) */}
      <ProfileStatsStrip
        streak={streak}
        experience={profile.experience ?? 0}
        learnedCount={learnedCount}
        totalWords={totalCatalogWords}
        level={profile.level ?? 1}
      />

      {/* 4. Real Learning Breakdown (Hiragana, Katakana, Kanji) */}
      <ProfileLearningBreakdown
        learningStats={learningStats}
        loading={false}
      />

      {/* 5. Continuation / Next Activity CTA */}
      <ProfileContinueLearning recentActivity={recentActivity} />

      {/* 6. Edit Profile Modal (Photo, Username, Title link) */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        username={editUsername}
        onUsernameChange={setEditUsername}
        avatarPreviewUrl={avatarPreviewUrl}
        hasCustomAvatar={Boolean(profile.avatar_url)}
        uploadingAvatar={uploadingAvatar}
        saving={saving}
        error={error}
        info={info}
        currentTitleName={profile.title}
        onOpenTitlesModal={() => {
          setIsEditModalOpen(false);
          setIsTitlesModalOpen(true);
        }}
        onFileSelect={handleUploadAvatar}
        onAvatarDelete={handleDeleteAvatar}
        onSave={handleSaveProfile}
      />

      {/* 7. Titles Showcase & Equip Modal */}
      <TitlesSelectorModal
        isOpen={isTitlesModalOpen}
        onClose={() => setIsTitlesModalOpen(false)}
        currentTitleId={profile.title_id}
        currentTitleName={profile.title}
        unlockedTitleIds={unlockedTitleIds}
        onEquipTitle={handleEquipTitle}
        isEquipping={isEquippingTitle}
      />
    </div>
  );
}
