import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import SentenceBuilderGame from '../../components/gameplay/SentenceBuilder/SentenceBuilderGame';
import SentenceBuilderLobby from './SentenceBuilderLobby';

export default function SentenceBuilderPage() {
  const { user } = useAuthSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get('topic');

  // If no topic is selected in query string, display the Topic Selection Lobby
  if (!topicId) {
    return <SentenceBuilderLobby />;
  }

  // If a topic is selected, display the Sentence Builder game for that topic
  return (
    <div className="w-full space-y-6 py-4">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSearchParams({})}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accentDark transition-colors"
        >
          <span>←</span> Volver a Selección de Temas
        </button>
        <div className="text-xs uppercase font-bold tracking-widest text-neutral/50">
          Modo: Constructor de Oraciones
        </div>
      </div>

      {/* Main Game Interface */}
      <SentenceBuilderGame
        userId={user?.id}
        initialTopicId={topicId}
        onBackToLobby={() => setSearchParams({})}
        onFinishSession={(results) => {
          console.log('Sesión completada:', results);
        }}
      />
    </div>
  );
}
