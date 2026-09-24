import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';

export default function MobileNavigation() {
  const { pathname } = useLocation();
  const isGame = pathname === '/game' || pathname.startsWith('/game') || pathname === '/aprender';
  const isPairMatch = pathname === '/pair-match' || pathname === '/par-parejas';
  const isSentenceBuilder = pathname === '/sentence-builder' || pathname.startsWith('/sentence-builder') || pathname === '/constructor';
  const isHistory = pathname === '/vocabulary' || pathname.startsWith('/vocabulary') || pathname === '/vocabulario' || pathname.startsWith('/vocabulario') || pathname === '/historial' || pathname.startsWith('/historial');

  return (
    <nav
      role="navigation"
      aria-label="Navegación inferior móvil"
      className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#eaded6] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto w-full max-w-md px-1 py-1">
        <div className="grid grid-cols-4 items-center text-xs font-semibold">
          <Link
            to="/game"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-all active:scale-95',
              isGame ? 'text-[#6b2832] font-bold' : 'text-[rgb(var(--color-neutral))]/60 hover:text-[rgb(var(--color-neutral))]',
            ].join(' ')}
          >
            <Icon
              name="target-accuracy"
              className={[
                'h-5 w-5 transition-transform',
                isGame ? 'scale-110 text-[#6b2832]' : 'opacity-65',
              ].join(' ')}
            />
            <span className="text-[10px] leading-tight">Aprender</span>
          </Link>

          <Link
            to="/pair-match"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-all active:scale-95',
              isPairMatch ? 'text-[#6b2832] font-bold' : 'text-[rgb(var(--color-neutral))]/60 hover:text-[rgb(var(--color-neutral))]',
            ].join(' ')}
          >
            <Icon
              name="cards-memory"
              className={[
                'h-5 w-5 transition-transform',
                isPairMatch ? 'scale-110 text-[#6b2832]' : 'opacity-65',
              ].join(' ')}
            />
            <span className="text-[10px] leading-tight">Parejas</span>
          </Link>

          <Link
            to="/sentence-builder"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-all active:scale-95',
              isSentenceBuilder ? 'text-[#6b2832] font-bold' : 'text-[rgb(var(--color-neutral))]/60 hover:text-[rgb(var(--color-neutral))]',
            ].join(' ')}
          >
            <Icon
              name="puzzle-blocks"
              className={[
                'h-5 w-5 transition-transform',
                isSentenceBuilder ? 'scale-110 text-[#6b2832]' : 'opacity-65',
              ].join(' ')}
            />
            <span className="text-[10px] leading-tight">Constructor</span>
          </Link>

          <Link
            to="/vocabulary"
            className={[
              'flex flex-col items-center justify-center gap-1 py-1.5 min-h-[48px] rounded-xl transition-all active:scale-95',
              isHistory ? 'text-[#6b2832] font-bold' : 'text-[rgb(var(--color-neutral))]/60 hover:text-[rgb(var(--color-neutral))]',
            ].join(' ')}
          >
            <Icon
              name="book-open"
              className={[
                'h-5 w-5 transition-transform',
                isHistory ? 'scale-110 text-[#6b2832]' : 'opacity-65',
              ].join(' ')}
            />
            <span className="text-[10px] leading-tight">Vocabulario</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
