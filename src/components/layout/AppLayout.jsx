import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { supabase } from '../../services/supabase/client';
import toriiLogo from '../../img/torii.svg';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/game', label: 'Aprender' },
  { to: '/historial', label: 'Historial' },
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
        const { data, error } = await supabase
          .from('profiles')
          .select('username,level,experience')
          .eq('user_id', user.id)
          .maybeSingle();

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
    await supabase.auth.signOut();
  };

  const profileInitial = (profileName || 'J').slice(0, 1).toUpperCase();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-neutral">
      <PetalsLayer />
      <div className="relative z-10">
        <header className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-[1.5rem] border border-[#eaded6] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(128,43,56,0.06)] backdrop-blur">
            <Link className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--color-accent))]" to="/">
              <img src={toriiLogo} alt="KanaQuest" className="h-[40.5px] w-[40.5px] shrink-0 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(34%) saturate(1700%) hue-rotate(318deg) brightness(88%) contrast(94%)' }} />
              <span className="text-[1.05rem] leading-none tracking-tight">KanaQuest</span>
            </Link>

            <nav className="hidden items-center gap-10 text-sm font-medium text-[rgb(var(--color-accent))] md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'transition-colors hover:text-[rgb(var(--color-accent-dark))]',
                    isActive ? 'font-semibold' : 'text-[rgb(var(--color-accent))]/80',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 rounded-full bg-[#f8ebe6] px-4 py-2 text-[rgb(var(--color-accent))] shadow-sm">
                <span className="text-base">🔥</span>
                <span className="text-sm font-semibold">{streak}</span>
              </div>

              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-full px-2 py-1 text-left transition hover:bg-[#f9efea]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-sm font-semibold text-white shadow-sm">
                    {profileInitial}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-[rgb(var(--color-neutral))]">{profileName}</div>
                    <div className="text-xs text-[rgb(var(--color-accent))]/70">Nivel {profileLevel} · {profileExperience} XP</div>
                  </div>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className={['h-4 w-4 text-[rgb(var(--color-accent))]/60 transition-transform', menuOpen ? 'rotate-180' : 'rotate-0'].join(' ')}>
                    <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5 1.4 1.4L10 14.8 4.1 8.9z" />
                  </svg>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-[1.1rem] border border-[#eaded6] bg-white p-2 shadow-[0_18px_35px_rgba(128,43,56,0.14)]">
                    {user ? (
                      <>
                        <div className="px-3 py-2 text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-accent))]/55">Sesión</div>
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
                        >
                          Mi Perfil
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
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
                          className="flex rounded-xl px-3 py-2 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
                        >
                          Iniciar sesión
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMenuOpen(false)}
                          className="mt-1 flex rounded-xl px-3 py-2 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
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

        <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">{children}</div>
      </div>
    </main>
  );
}
