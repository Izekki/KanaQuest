import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParParejasGame from '../../components/gameplay/PairMatch/ParParejasGame';
import { usePageSeo } from '../../hooks/usePageSeo';

export default function PairMatchPage() {
  const navigate = useNavigate();

  usePageSeo({
    title: 'Par-Parejas · Juego de Memoria',
    description: 'Empareja kanji, lecturas hiragana y significados en español en este juego de memoria ágil de KanaQuest.',
    canonicalPath: '/pair-match',
  });

  return (
    <div className="w-full">
      <ParParejasGame onBackToLobby={() => navigate('/game')} />
    </div>
  );
}
