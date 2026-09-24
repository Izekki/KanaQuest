import React from 'react';
import { useSearchParams } from 'react-router-dom';
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
