import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { fetchUserProfile } from '../../services/supabase/progress';
import { getUser, signOut } from '../../services/supabase/auth';
import { getSignedAvatarUrl } from '../../services/supabase/storage';
import { preloadWords } from '../../services/supabase/words';
import toriiLogo from '../../img/torii.svg';
import MobileNavigation from './MobileNavigation';
import FeedbackModal from '../ui/FeedbackModal';
import SakuraPetalsCanvas from '../ui/SakuraPetalsCanvas';
import Icon from '../ui/Icon';

const navItems = [
  { to: '/game', label: 'Aprender' },
  { to: '/pair-match', label: 'Par-Parejas' },
  { to: '/sentence-builder', label: 'Constructor' },
  { to: '/vocabulary', label: 'Vocabulario' },
];

const petals = [
  { left: '6%', top: '14%', size: '0.7rem', duration: '12s', delay: '0s', opacity: 0.55 },
  { left: '12%', top: '72%', size: '0.5rem', duration: '16s', delay: '1.5s', opacity: 0.42 },
  { left: '28%', top: '22%', size: '0.6rem', duration: '14s', delay: '3s', opacity: 0.5 },
  { left: '41%', top: '10%', size: '0.45rem', duration: '15s', delay: '2s', opacity: 0.38 },
  { left: '63%', top: '18%', size: '0.65rem', duration: '13s', delay: '0.8s', opacity: 0.45 },
  { left: '74%', top: '66%', size: '0.55rem', duration: '17s', delay: '2.7s', opacity: 0.42 },
  { left: '86%', top: '28%', size: '0.48rem', duration: '14.5s', delay: '4s', opacity: 0.35 },
  { left: '92%', top: '58%', size: '0.62rem', duration: '15.5s', delay: '1.2s', opacity: 0.4 },
];

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

const getStoredProfileSnapshot = (userId) => {
  if (!userId || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`kanaquest_profile_snapshot:${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveProfileSnapshot = (userId, data) => {
  if (!userId || typeof window === 'undefined') return;
  try {
    localStorage.setItem(`kanaquest_profile_snapshot:${userId}`, JSON.stringify(data));
  } catch {}
};

function PetalsLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((petal, index) => (
        <span
          key={`${petal.left}-${index}`}
          className="animate-petal-float absolute rounded-full bg-[#f3b6c1] blur-[0.15px]"
          style={{
            left: petal.left,
            top: petal.top,
            width: petal.size,
            height: `calc(${petal.size} * 1.5)`,
            opacity: petal.opacity,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function AppLayout({ children }) {
  const { user } = useAuthSession();
  const initialSnapshot = user?.id ? getStoredProfileSnapshot(user.id) : null;

  const [profileName, setProfileName] = useState(initialSnapshot?.username || 'Jugador');
  const [profileLevel, setProfileLevel] = useState(initialSnapshot?.level ?? 1);
  const [profileExperience, setProfileExperience] = useState(initialSnapshot?.experience ?? 0);
  const [profileRole, setProfileRole] = useState(initialSnapshot?.role ?? 'player');
  const [profileTitle, setProfileTitle] = useState(initialSnapshot?.title ?? 'Novato del Kanji');
  const [avatarUrl, setAvatarUrl] = useState(initialSnapshot?.avatarUrl || '');
  const [streak, setStreak] = useState(initialSnapshot?.streak ?? 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { isMuted, toggleSound } = useSoundEffects();
  const menuRef = useRef(null);

  const resolveAvatarUrl = async (storedAvatar) => {
    if (!storedAvatar) return '';
    if (storedAvatar.startsWith('http://') || storedAvatar.startsWith('https://') || storedAvatar.startsWith('blob:')) {
      return storedAvatar;
    }
    try {
      const fn = await getSignedAvatarUrl(storedAvatar, 3600);
      return fn?.data?.signedUrl ?? '';
    } catch (err) {
      console.warn('No se pudo resolver el avatar en navbar:', err);
      return '';
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Si ya teníamos snapshot para este usuario, hidratar inmediatamente
    if (user?.id) {
      const snapshot = getStoredProfileSnapshot(user.id);
      if (snapshot && isMounted) {
        if (snapshot.username) setProfileName(snapshot.username);
        if (snapshot.level !== undefined) setProfileLevel(snapshot.level);
        if (snapshot.experience !== undefined) setProfileExperience(snapshot.experience);
        if (snapshot.role) setProfileRole(snapshot.role);
        if (snapshot.title) setProfileTitle(snapshot.title);
        if (snapshot.avatarUrl) setAvatarUrl(snapshot.avatarUrl);
        if (snapshot.streak !== undefined) setStreak(snapshot.streak);
      }
    }

    const loadProfile = async () => {
      let activeUserId = user?.id;
      if (!activeUserId) {
        const { data: authData } = await getUser();
        activeUserId = authData?.user?.id;
      }

      if (!activeUserId) {
        if (isMounted) {
          setProfileName('Jugador');
          setProfileLevel(1);
          setProfileExperience(0);
          setProfileRole('player');
          setProfileTitle('Novato del Kanji');
          setAvatarUrl('');
        }
        return;
      }

      try {
        const { data, error } = await fetchUserProfile(activeUserId);

        if (error) throw error;

        if (isMounted && data) {
          const nextName = data.username || 'Jugador';
          const nextLevel = data.level ?? 1;
          const nextExp = data.experience ?? 0;
          const nextRole = data.role ?? 'player';
          const nextTitle = data.title ?? 'Novato del Kanji';
          const nextStreak = data.current_streak ?? 0;

          setProfileName(nextName);
          setProfileLevel(nextLevel);
          setProfileExperience(nextExp);
          setProfileRole(nextRole);
          setProfileTitle(nextTitle);
          setStreak(nextStreak);

          let nextAvatarUrl = '';
          if (data.avatar_url) {
            nextAvatarUrl = await resolveAvatarUrl(data.avatar_url);
            if (isMounted) setAvatarUrl(nextAvatarUrl);
          } else {
            if (isMounted) setAvatarUrl('');
          }

          saveProfileSnapshot(activeUserId, {
            username: nextName,
            level: nextLevel,
            experience: nextExp,
            role: nextRole,
            title: nextTitle,
            streak: nextStreak,
            avatarUrl: nextAvatarUrl,
          });
        }
      } catch (error) {
        console.warn('No se pudo cargar el perfil en navbar:', error?.message ?? error);
      }
    };

    loadProfile();
    preloadWords();

    const handleProfileUpdated = (event) => {
      const nextUsername = event?.detail?.username;
      const nextLevel = event?.detail?.level;
      const nextExperience = event?.detail?.experience;
      const nextRole = event?.detail?.role;
      const nextTitle = event?.detail?.title;
      const nextStreak = event?.detail?.current_streak;
      const nextAvatar = event?.detail?.avatar_url;

      if (!isMounted) return;

      let currentAvatar = avatarUrl;

      if (nextUsername !== undefined) {
        setProfileName(nextUsername || 'Jugador');
      }
      if (nextLevel !== undefined) {
        setProfileLevel(nextLevel ?? 1);
      }
      if (nextExperience !== undefined) {
        setProfileExperience(nextExperience ?? 0);
      }
      if (nextRole !== undefined) {
        setProfileRole(nextRole ?? 'player');
      }
      if (nextTitle !== undefined) {
        setProfileTitle(nextTitle ?? 'Novato del Kanji');
      }
      if (nextStreak !== undefined) {
        setStreak(nextStreak ?? 0);
      }
      if (nextAvatar !== undefined) {
        if (nextAvatar) {
          resolveAvatarUrl(nextAvatar).then((preview) => {
            if (isMounted) {
              setAvatarUrl(preview);
              if (user?.id) {
                const snap = getStoredProfileSnapshot(user.id) || {};
                saveProfileSnapshot(user.id, { ...snap, avatarUrl: preview, username: nextUsername || snap.username });
              }
            }
          });
        } else {
          setAvatarUrl('');
          if (user?.id) {
            const snap = getStoredProfileSnapshot(user.id) || {};
            saveProfileSnapshot(user.id, { ...snap, avatarUrl: '', username: nextUsername || snap.username });
          }
        }
      } else if (user?.id) {
        const snap = getStoredProfileSnapshot(user.id) || {};
        saveProfileSnapshot(user.id, {
          ...snap,
          username: nextUsername !== undefined ? nextUsername : snap.username,
          level: nextLevel !== undefined ? nextLevel : snap.level,
        });
      }
    };

    window.addEventListener('kanaquest-profile-updated', handleProfileUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('kanaquest-profile-updated', handleProfileUpdated);
    };
  }, [user?.id]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
  };

  const profileInitial = (profileName || 'J').slice(0, 1).toUpperCase();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-neutral">
      <SakuraPetalsCanvas />
      <div className="relative z-10">
        <header className="relative z-50 px-3 pt-2.5 sm:px-5 sm:pt-3 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4 rounded-xl border border-[#e8ded6] bg-white/95 px-3 py-2 sm:px-4 sm:py-2 shadow-[0_1px_4px_rgba(0,0,0,0.03)] backdrop-blur-md">
            
            {/* Logo Torii Refinado + KanaQuest */}
            <Link className="flex items-center gap-2 group transition-transform active:scale-98" to="/">
              <div className="relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg bg-[#fbf3f0] border border-[#f0ded8] shadow-2xs transition-transform group-hover:scale-102">
                <img
                  src={toriiLogo}
                  alt="KanaQuest Torii"
                  className="h-5 w-5 shrink-0 object-contain"
                  style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg leading-tight tracking-tight font-bold text-[#6b2832] group-hover:text-[#4d1c23] transition-colors">
                  KanaQuest
                </span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-[#6b2832]/60 hidden sm:block -mt-0.5">
                  仮名クエスト
                </span>
              </div>
            </Link>

            {/* Menú de Navegación Compacto */}
            <nav className="hidden items-center gap-1 xl:gap-2 text-sm font-medium lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-lg px-3 py-1.5 text-xs sm:text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-[#fbf0ec] text-[#6b2832] font-semibold'
                        : 'text-[#6b2832]/75 hover:text-[#6b2832] hover:bg-[#faf4f0]',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Usuario: Monedas (0), Racha, Sonido y Perfil (J) Integrados */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Botón Silenciar/Sonido */}
              <button
                type="button"
                onClick={toggleSound}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-[#ead8cf] bg-[#fff6f2] text-[#6b2832] hover:bg-[#faeae3] transition shadow-2xs active:scale-95"
                title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              >
                <Icon name={isMuted ? 'volume-mute' : 'volume-high'} className="w-4 h-4 text-[#6b2832]" />
              </button>

              {/* Indicador de Monedas (0) - Detallado */}
              <div
                className="flex items-center gap-1.5 rounded-xl border border-[#f2d89f] bg-[#fff9ea] px-2.5 py-1 text-[#9c6a18] shadow-2xs transition-transform hover:scale-102 cursor-default"
                title="Monedas acumuladas para recompensas y pistas"
                aria-label="Monedas: 0"
              >
                <Icon name="coin-koban" className="w-3.5 h-3.5 text-[#9c6a18]" />
                <span className="text-xs font-bold leading-none">0</span>
              </div>

              {/* Indicador de Racha (Fuego) */}
              <div
                className="flex items-center gap-1.5 rounded-xl border border-[#f8c4bc] bg-[#fff1ee] px-2.5 py-1 text-[#b83848] shadow-2xs transition-transform hover:scale-102 cursor-default"
                title={`Racha diaria de estudio: ${streak} ${streak === 1 ? 'día activo' : 'días activos'}`}
                aria-label={`Racha diaria: ${streak} días`}
              >
                <Icon name="fire-streak" className="w-3.5 h-3.5 text-[#b83848]" />
                <span className="text-xs font-bold leading-none">{streak}</span>
              </div>

              {/* Perfil (J) y Dropdown Más Integrado */}
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-xl border border-[#ead8cf] bg-[#fffbfa] px-1.5 py-1 text-left transition hover:border-[#dfc3bc] hover:bg-white shadow-2xs active:scale-98 min-h-[38px]"
                  aria-expanded={menuOpen}
                  aria-label="Menú de usuario"
                >
                  <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#e38997,#b84758)] text-xs font-bold text-white shadow-xs shrink-0 overflow-hidden ring-1 ring-[#e3b8b1]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={`Avatar de ${profileName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profileInitial
                    )}
                  </div>
                  <div className="hidden min-[500px]:block leading-tight max-w-[100px] sm:max-w-[140px]">
                    <div className="truncate text-xs font-bold text-[#6b2832]">{profileName}</div>
                    <div className="truncate text-[10px] text-[#6b2832]/65">Nv. {profileLevel} · {profileExperience} XP</div>
                  </div>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className={['h-3.5 w-3.5 shrink-0 text-[#6b2832]/60 transition-transform duration-200', menuOpen ? 'rotate-180' : 'rotate-0'].join(' ')}>
                    <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5 1.4 1.4L10 14.8 4.1 8.9z" />
                  </svg>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-[1.2rem] border border-[#eaded6] bg-white p-2 shadow-[0_18px_35px_rgba(128,43,56,0.14)] animate-fadeIn">
                    {user ? (
                      <>
                        {/* Dropdown User Header */}
                        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[#f2e6df] mb-1.5 bg-[#fcfaf8] rounded-xl">
                          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-xs font-bold text-white shadow-xs shrink-0 overflow-hidden ring-1.5 ring-[#e3b8b1]">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={`Avatar de ${profileName}`} className="h-full w-full object-cover" />
                            ) : (
                              profileInitial
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-bold text-[#6b2832]">{profileName}</div>
                            <div className="truncate text-[10px] text-[rgb(var(--color-neutral))]/70">Nv. {profileLevel} · {profileExperience} XP</div>
                          </div>
                        </div>

                        <div className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[rgb(var(--color-accent))]/55 font-bold">
                          Mi Cuenta
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[rgb(var(--color-neutral))] transition hover:bg-[#f9efea]"
                        >
                          <span>Mi Perfil</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            setFeedbackModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
                        >
                          <span>Enviar Feedback</span>
                        </button>

                        {profileRole === 'admin' && (
                          <>
                            <div className="my-1 border-t border-[#f0e4de]" />
                            <div className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[rgb(var(--color-accent))]/60 font-bold">
                              Administración
                            </div>
                            <Link
                              to="/admin/feedback"
                              onClick={() => setMenuOpen(false)}
                              className="flex w-full items-center gap-2 rounded-xl bg-[rgb(var(--color-surface-alt))] px-3 py-2 text-xs sm:text-sm font-bold text-[rgb(var(--color-accent))] transition hover:bg-[#f3dfd7]"
                            >
                              <span>Panel de Feedbacks</span>
                            </Link>
                          </>
                        )}

                        <div className="my-1 border-t border-[#f0e4de]" />
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                        >
                          <span>Cerrar sesión</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-[rgb(var(--color-accent))]/55 font-bold">
                          Acceso
                        </div>
                        <Link
                          to="/login"
                          onClick={() => setMenuOpen(false)}
                          className="flex rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
                        >
                          Iniciar sesión
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMenuOpen(false)}
                          className="mt-1 flex rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-8 pb-24 lg:pb-8">
          {children || <Outlet />}
        </div>
        <MobileNavigation />
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </main>
  );
}
