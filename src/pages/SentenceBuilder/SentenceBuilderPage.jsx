import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import SentenceBuilderGame from '../../components/gameplay/SentenceBuilder/SentenceBuilderGame';
import SentenceBuilderLobby from './SentenceBuilderLobby';
import { usePageSeo } from '../../hooks/usePageSeo';

export default function SentenceBuilderPage() {
  const { user } = useAuthSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get('topic');

  usePageSeo({
    title: 'Constructor de Oraciones · Sintaxis y Gramática',
    description: 'Aprende y practica la estructura gramatical de oraciones en japonés con partículas y vocabulario en contexto real.',
    canonicalPath: '/sentence-builder',
  });

  // If no topic is selected in query string, display the Topic Selection Lobby
  if (!topicId) {
    return <SentenceBuilderLobby />;
  }

  // If a topic is selected, display the Sentence Builder game for that topic
  return (
    <div className="w-full">
      <SentenceBuilderGame
        userId={user?.id}
        initialTopicId={topicId}
        onBackToLobby={() => setSearchParams({})}
        onFinishSession={(results) => {
          console.debug('Sesión completada:', results);
        }}
      />
    </div>
  );
}
