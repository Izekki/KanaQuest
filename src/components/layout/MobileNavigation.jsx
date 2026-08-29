import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import controlIcon from '../../img/control-svgrepo-com.svg';
import sandClockIcon from '../../img/sand-clock-svgrepo-com.svg';

export default function MobileNavigation() {
  const { pathname } = useLocation();
  const isGame = pathname === '/game' || pathname.startsWith('/game');
  const isPairMatch = pathname === '/pair-match' || pathname === '/par-parejas';
  const isSentenceBuilder = pathname === '/sentence-builder' || pathname.startsWith('/sentence-builder');
  const isHistory = pathname === '/historial' || pathname.startsWith('/historial');

  return (
    <nav
      role="navigation"
      aria-label="Navegación inferior móvil"
      className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#eaded6] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto w-full max-w-md px-1 py-1">
        <div className="grid grid-cols-4 items-center text-xs font-semibold">
          <Link
            to="/game"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-colors active:scale-95',
              isGame ? 'text-[rgb(var(--color-accent))] font-bold' : 'text-neutral/60 hover:text-neutral',
            ].join(' ')}
          >
            <img
              src={controlIcon}
              alt="Aprender"
              className={[
                'h-5 w-5 transition-all',
                isGame ? 'filter-none scale-110' : 'grayscale opacity-60',
              ].join(' ')}
            />
            <span className="text-[10px] leading-tight">Aprender</span>
          </Link>

          <Link
            to="/pair-match"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-colors active:scale-95',
              isPairMatch ? 'text-[rgb(var(--color-accent))] font-bold' : 'text-neutral/60 hover:text-neutral',
            ].join(' ')}
          >
            <span className="text-lg leading-none">🎴</span>
            <span className="text-[10px] leading-tight">Parejas</span>
          </Link>

          <Link
            to="/sentence-builder"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-colors active:scale-95',
              isSentenceBuilder ? 'text-[rgb(var(--color-accent))] font-bold' : 'text-neutral/60 hover:text-neutral',
            ].join(' ')}
          >
            <span className="text-lg leading-none">✍️</span>
            <span className="text-[10px] leading-tight">Constructor</span>
          </Link>

          <Link
            to="/historial"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-colors active:scale-95',
              isHistory ? 'text-[rgb(var(--color-accent))] font-bold' : 'text-neutral/60 hover:text-neutral',
            ].join(' ')}
          >
            <img
              src={sandClockIcon}
              alt="Historial"
              className={[
                'h-5 w-5 transition-all',
                isHistory ? 'filter-none scale-110' : 'grayscale opacity-60',
              ].join(' ')}
            />
            <span className="text-[10px] leading-tight">Historial</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
