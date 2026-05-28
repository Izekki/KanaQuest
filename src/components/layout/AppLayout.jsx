import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { supabase } from '../../services/supabase/client';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/game', label: 'Aprender' },
  { to: '/historial', label: 'Historial' },
  { to: '/profile', label: 'Perfil' },
  { to: '/register', label: 'Desafíos' },
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

function ToriiIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-[rgb(var(--color-accent))]">
      <path
        fill="currentColor"
        d="M4 5h16v2h-2v12h-2V7H8v12H6V7H4V5Zm1.5-2h13v2h-13V3Zm1 3h11v2h-11V6ZM9 10h6v2H9v-2Z"
      />
    </svg>
  );
}

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

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user?.id) {
        if (isMounted) {
          setProfileName('Jugador');
          setProfileLevel(1);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username,level')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (isMounted && data) {
          setProfileName(data.username || 'Jugador');
          setProfileLevel(data.level ?? 1);
        }
      } catch (error) {
        console.warn('No se pudo cargar el perfil:', error?.message ?? error);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const profileInitial = (profileName || 'J').slice(0, 1).toUpperCase();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-neutral">
      <PetalsLayer />
      <div className="relative z-10">
        <header className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-[1.5rem] border border-[#eaded6] bg-white/85 px-4 py-3 shadow-[0_10px_30px_rgba(128,43,56,0.06)] backdrop-blur">
            <Link className="flex items-center gap-3 text-sm font-semibold text-[rgb(var(--color-accent))]" to="/">
              <ToriiIcon />
              <span className="text-[1.05rem] tracking-tight">KanaQuest</span>
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
                <span className="text-sm font-semibold">12</span>
              </div>

              <div className="flex items-center gap-3 rounded-full px-2 py-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-sm font-semibold text-white shadow-sm">
                  {profileInitial}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-[rgb(var(--color-neutral))]">{profileName}</div>
                  <div className="text-xs text-[rgb(var(--color-accent))]/70">Nivel {profileLevel}</div>
                </div>
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-[rgb(var(--color-accent))]/60">
                  <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5 1.4 1.4L10 14.8 4.1 8.9z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8 lg:py-5">{children}</div>
      </div>
    </main>
  );
}
