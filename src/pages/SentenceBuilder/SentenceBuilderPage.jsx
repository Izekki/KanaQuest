import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import SentenceBuilderGame from '../../components/gameplay/SentenceBuilder/SentenceBuilderGame';

export default function SentenceBuilderPage() {
  const { user } = useAuthSession();

  return (
    <div className="w-full space-y-6 py-4">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/game"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accentDark transition-colors"
        >
          <span>←</span> Volver a Modos de Juego
        </Link>
        <div className="text-xs uppercase font-bold tracking-widest text-neutral/50">
          Modo: Constructor de Oraciones
        </div>
      </div>

      {/* Main Game Interface */}
      <SentenceBuilderGame
        userId={user?.id}
        onFinishSession={(results) => {
          console.log('Sesión completada:', results);
        }}
      />
    </div>
  );
}
