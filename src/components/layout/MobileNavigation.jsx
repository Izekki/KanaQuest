import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import controlIcon from '../../img/control-svgrepo-com.svg';
import sandClockIcon from '../../img/sand-clock-svgrepo-com.svg';

export default function MobileNavigation() {
  const { pathname } = useLocation();
  const isGame = pathname === '/game' || pathname.startsWith('/game');
  const isHistory = pathname === '/historial' || pathname.startsWith('/historial');

  return (
    <nav
      role="navigation"
      aria-label="Navegación inferior móvil"
      className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#eaded6] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-2">
        <div className="flex items-center justify-around text-sm font-semibold">
          <Link
            to="/game"
            className={[
              'flex flex-col items-center gap-1 py-2 transition-colors',
              isGame ? 'text-[rgb(var(--color-accent))]' : 'text-gray-400',
            ].join(' ')}
          >
            <img
              src={controlIcon}
              alt="Jugar"
              className={[
                'h-6 w-6 sm:h-7 sm:w-7',
                isGame ? 'filter-none' : 'grayscale opacity-70',
              ].join(' ')}
            />
            <span>Aprender</span>
          </Link>

          <Link
            to="/sentence-builder"
            className={[
              'flex flex-col items-center gap-1 py-2 transition-colors',
              pathname === '/sentence-builder' ? 'text-[rgb(var(--color-accent))]' : 'text-gray-400',
            ].join(' ')}
          >
            <span className="text-xl leading-none">✍️</span>
            <span>Constructor</span>
          </Link>

          <Link
            to="/historial"
            className={[
              'flex flex-col items-center gap-1 py-2 transition-colors',
              isHistory ? 'text-[rgb(var(--color-accent))]' : 'text-gray-400',
            ].join(' ')}
          >
            <img
              src={sandClockIcon}
              alt="Historial"
              className={[
                'h-6 w-6 sm:h-7 sm:w-7',
                isHistory ? 'filter-none' : 'grayscale opacity-70',
              ].join(' ')}
            />
            <span>Historial</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
