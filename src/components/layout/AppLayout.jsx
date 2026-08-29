import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { fetchUserProfile } from '../../services/supabase/progress';
import { signOut } from '../../services/supabase/auth';
import toriiLogo from '../../img/torii.svg';
import MobileNavigation from './MobileNavigation';

const navItems = [
  { to: '/', label: 'Inicio' },
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
  const [profileName, setProfileName] = useState('Jugador');
  const [profileLevel, setProfileLevel] = useState(1);
  const [profileExperience, setProfileExperience] = useState(0);
  const [streak, setStreak] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMuted, toggleSound } = useSoundEffects();
  const menuRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user?.id) {
        if (isMounted) {
          setProfileName('Jugador');
          setProfileLevel(1);
          setProfileExperience(0);
        }
        return;
      }

      try {
        const { data, error } = await fetchUserProfile(user.id);

        if (error) throw error;

        if (isMounted && data) {
          setProfileName(data.username || 'Jugador');
          setProfileLevel(data.level ?? 1);
          setProfileExperience(data.experience ?? 0);
        }
      } catch (error) {
        console.warn('No se pudo cargar el perfil:', error?.message ?? error);
      }
    };

    loadProfile();

    const handleProfileUpdated = (event) => {
      const nextUsername = event?.detail?.username;
      const nextLevel = event?.detail?.level;
      const nextExperience = event?.detail?.experience;
      if (!isMounted) return;
      if (nextUsername !== undefined) {
        setProfileName(nextUsername || 'Jugador');
      }
      if (nextLevel !== undefined) {
        setProfileLevel(nextLevel ?? 1);
      }
      if (nextExperience !== undefined) {
        setProfileExperience(nextExperience ?? 0);
      }
    };

    window.addEventListener('kanaquest-profile-updated', handleProfileUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('kanaquest-profile-updated', handleProfileUpdated);
    };
  }, [user?.id]);

  useEffect(() => {
    const syncStreak = () => {
      if (!user?.id) {
        setStreak(0);
        return;
      }

      const storedStreak = Number(sessionStorage.getItem(getStreakStorageKey(user.id)) ?? 0);
      setStreak(Number.isFinite(storedStreak) ? storedStreak : 0);
    };

    syncStreak();

    const handleStreakChange = () => syncStreak();
    window.addEventListener('kanaquest-streak-change', handleStreakChange);
    window.addEventListener('storage', handleStreakChange);

    return () => {
      window.removeEventListener('kanaquest-streak-change', handleStreakChange);
      window.removeEventListener('storage', handleStreakChange);
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
      <PetalsLayer />
      <div className="relative z-0">
        <header className="relative z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4 rounded-[1.5rem] border border-[#eaded6] bg-white/85 px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-[0_10px_30px_rgba(128,43,56,0.06)] backdrop-blur">
            <Link className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-accent))]" to="/">
              <img src={toriiLogo} alt="KanaQuest" className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)' }} />
              <span className="text-base sm:text-[1.05rem] leading-none tracking-tight font-bold">KanaQuest</span>
            </Link>

            <nav className="hidden items-center gap-8 lg:gap-10 text-sm font-medium text-[rgb(var(--color-accent))] md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'transition-colors hover:text-[rgb(var(--color-accent-dark))]',
                    isActive ? 'font-semibold text-[rgb(var(--color-accent))]' : 'text-[rgb(var(--color-accent))]/75',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleSound}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#f8ebe6] text-[rgb(var(--color-accent))] hover:bg-[#f3dfd7] transition shadow-sm"
                title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              >
                <span className="text-base sm:text-lg select-none" aria-hidden="true">
                  {isMuted ? '🔇' : '🔊'}
                </span>
              </button>

              <div className="flex items-center gap-1.5 rounded-full bg-[#f8ebe6] px-3 py-1.5 sm:px-4 sm:py-2 text-[rgb(var(--color-accent))] shadow-sm">
                <span className="text-sm sm:text-base">🔥</span>
                <span className="text-xs sm:text-sm font-bold">{streak}</span>
              </div>

              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="flex items-center gap-2 sm:gap-3 rounded-full px-1.5 py-1 text-left transition hover:bg-[#f9efea] min-h-[44px]"
                  aria-expanded={menuOpen}
                  aria-label="Menú de usuario"
                >
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-xs sm:text-sm font-semibold text-white shadow-sm shrink-0">
                    {profileInitial}
                  </div>
                  <div className="hidden min-[460px]:block leading-tight max-w-[110px] sm:max-w-[160px]">
                    <div className="truncate text-xs sm:text-sm font-semibold text-[rgb(var(--color-neutral))]">{profileName}</div>
                    <div className="truncate text-[10px] sm:text-xs text-[rgb(var(--color-accent))]/70">Nv. {profileLevel} · {profileExperience} XP</div>
                  </div>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className={['h-4 w-4 shrink-0 text-[rgb(var(--color-accent))]/60 transition-transform', menuOpen ? 'rotate-180' : 'rotate-0'].join(' ')}>
                    <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5 1.4 1.4L10 14.8 4.1 8.9z" />
                  </svg>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-[1.1rem] border border-[#eaded6] bg-white p-2 shadow-[0_18px_35px_rgba(128,43,56,0.14)] animate-fadeIn">
                    {user ? (
                      <>
                        <div className="px-3 py-2 text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-accent))]/55">Sesión</div>
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea] min-h-[44px]"
                        >
                          Mi Perfil
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="mt-1 flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea] min-h-[44px]"
                        >
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-accent))]/55">Cuenta</div>
                        <Link
                          to="/login"
                          onClick={() => setMenuOpen(false)}
                          className="flex rounded-xl px-3 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea] min-h-[44px]"
                        >
                          Iniciar sesión
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMenuOpen(false)}
                          className="mt-1 flex rounded-xl px-3 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea] min-h-[44px]"
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

        <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-8 pb-24 lg:pb-8">{children}</div>
        <MobileNavigation />
      </div>
    </main>
  );
}
