import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParParejasGame from '../../components/gameplay/PairMatch/ParParejasGame';

export default function PairMatchPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <ParParejasGame onBackToLobby={() => navigate('/game')} />
    </div>
  );
}
