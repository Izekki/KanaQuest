import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWords } from '../../../services/supabase/words';
import { submitWordAnswer, createGameSession, fetchUserProfile } from '../../../services/supabase/progress';
import { useAuthSession } from '../../../hooks/useAuthSession';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import ParParejasCard from './ParParejasCard';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const DIFFICULTIES = [
  { id: 'beginner', label: 'Principiante', pairs: 6, cols: 'grid-cols-3 sm:grid-cols-4' },
  { id: 'intermediate', label: 'Intermedio', pairs: 8, cols: 'grid-cols-4' },
  { id: 'advanced', label: 'Avanzado', pairs: 10, cols: 'grid-cols-4 sm:grid-cols-5' },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ParParejasGame({ onBackToLobby }) {
  const { user } = useAuthSession();
  const { playFlip, playSuccess, playError, playComplete, isMuted, toggleSound } = useSoundEffects();

  const [difficulty, setDifficulty] = useState('beginner');
  const [wordsPool, setWordsPool] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedWordIds, setMatchedWordIds] = useState(new Set());
  const [isLocked, setIsLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const timerRef = useRef(null);

  const activeDifficulty = DIFFICULTIES.find((d) => d.id === difficulty) || DIFFICULTIES[0];
  const targetPairsCount = activeDifficulty.pairs;

  // 1. Fetch Words from Supabase
  const loadWords = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await fetchWords(100);
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No se encontraron palabras disponibles en el vocabulario.');
      }
      setWordsPool(data);
    } catch (err) {
      console.error('Error cargando vocabulario:', err);
      setErrorMessage(err.message || 'Error al cargar palabras');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  // 2. Initialize Game Board
  const startNewGame = useCallback(() => {
    if (!wordsPool.length) return;

    // Pick random N words
    const shuffledWords = shuffle(wordsPool).slice(0, targetPairsCount);

    // Generate Card Pairs (Japanese Kanji/Kana & Spanish Translation)
    const generatedCards = [];
    shuffledWords.forEach((word) => {
      // Japanese Card
      generatedCards.push({
        id: `${word.id}-jp`,
        wordId: word.id,
        content: word.japanese || word.hiragana || word.romaji,
        subtext: word.hiragana !== word.japanese ? word.hiragana : word.romaji,
        type: 'kanji',
        isFlipped: false,
        isMatched: false,
      });

      // Translation Card
      generatedCards.push({
        id: `${word.id}-es`,
        wordId: word.id,
        content: word.translation,
        subtext: word.romaji,
        type: 'translation',
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffle(generatedCards));
    setFlippedCards([]);
    setMatchedWordIds(new Set());
    setIsLocked(false);
    setAttempts(0);
    setEarnedXp(0);
    setTimerSeconds(0);
    setIsGameOver(false);
    setIsTimerRunning(true);
  }, [wordsPool, targetPairsCount]);

  useEffect(() => {
    if (wordsPool.length > 0) {
      startNewGame();
    }
  }, [wordsPool, difficulty, startNewGame]);

  // 3. Timer effect
  useEffect(() => {
    if (isTimerRunning && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isGameOver]);

  // 4. Card Click & Match Handler
  const handleCardClick = async (clickedCard) => {
    if (isLocked || isGameOver) return;
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    playFlip();

    // Flip card visually
    const nextCards = cards.map((c) => (c.id === clickedCard.id ? { ...c, isFlipped: true } : c));
    setCards(nextCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    // If 2 cards are flipped, check for match
    if (newFlipped.length === 2) {
      setIsLocked(true);
      setAttempts((prev) => prev + 1);

      const [firstCard, secondCard] = newFlipped;
      const isMatch = firstCard.wordId === secondCard.wordId;

      if (isMatch) {
        // MATCH!
        playSuccess();
        const nextMatched = new Set(matchedWordIds);
        nextMatched.add(firstCard.wordId);
        setMatchedWordIds(nextMatched);

        // Mark matched cards
        setCards((prev) =>
          prev.map((c) =>
            c.wordId === firstCard.wordId ? { ...c, isFlipped: true, isMatched: true } : c
          )
        );

        setFlippedCards([]);
        setIsLocked(false);

        // Record progress & experience via Supabase RPC
        if (user?.id) {
          try {
            const { data: rpcResult, error: rpcError } = await submitWordAnswer(firstCard.wordId, 'pair_match', true);
            if (rpcError) {
              console.warn('Error en RPC pair_match:', rpcError.message);
            } else if (rpcResult) {
              if (rpcResult.xp_awarded) {
                setEarnedXp((prev) => prev + rpcResult.xp_awarded);
              }
              window.dispatchEvent(
                new CustomEvent('kanaquest-profile-updated', {
                  detail: {
                    experience: rpcResult.new_total_xp,
                    level: rpcResult.new_level,
                  },
                })
              );
            }
            // Update full profile stats across UI
            const { data: profileData } = await fetchUserProfile(user.id);
            if (profileData) {
              window.dispatchEvent(
                new CustomEvent('kanaquest-profile-updated', {
                  detail: profileData,
                })
              );
            }
          } catch (err) {
            console.warn('Error registrando acierto de pareja:', err);
          }
        }

        // Check Victory condition
        if (nextMatched.size >= targetPairsCount) {
          setIsTimerRunning(false);
          setIsGameOver(true);
          playComplete();

          // Save game session to Supabase
          if (user?.id) {
            const finalScore = Math.max(
              100,
              Math.round((targetPairsCount * 1000) / Math.max(1, attempts + 1) - timerSeconds * 2)
            );

            createGameSession({
              user_id: user.id,
              mode: 'pair_match',
              difficulty,
              score: finalScore,
              correct_answers: targetPairsCount,
              wrong_answers: Math.max(0, attempts + 1 - targetPairsCount),
              duration: timerSeconds,
            }).catch((err) => console.warn('Error guardando sesión:', err));
          }
        }
      } else {
        // MISMATCH!
        playError();

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const matchedPairsCount = matchedWordIds.size;
  const progressPercent = Math.round((matchedPairsCount / targetPairsCount) * 100);

  if (loading) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgb(var(--color-accent))] border-t-transparent"></div>
          <p className="text-sm font-medium text-[rgb(var(--color-accent))]">Barajando cartas de memoria...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Card title="Error de carga" description={errorMessage}>
        <Button onClick={loadWords} variant="primary">
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Header & Controls */}
      <div className="rounded-[1.5rem] border border-[#eaded6] bg-white p-4 sm:p-5 shadow-[0_10px_30px_rgba(128,43,56,0.06)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎴</span>
              <h1 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-accent))]">
                Par-Parejas (Memory Match)
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
              Encuentra los pares haciendo coincidir cada palabra en japonés con su significado en español.
            </p>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-[#fbf5f2] p-1 border border-[#eaded6] self-start md:self-auto overflow-x-auto max-w-full">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                className={[
                  'rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap min-h-[36px]',
                  difficulty === d.id
                    ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
                    : 'text-[rgb(var(--color-neutral))]/70 hover:text-[rgb(var(--color-accent))] hover:bg-white',
                ].join(' ')}
              >
                {d.label} ({d.pairs} pares)
              </button>
            ))}
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="mt-4 pt-4 border-t border-[#f2e7e1] grid grid-cols-2 min-[480px]:grid-cols-4 gap-2.5 sm:gap-4 text-center">
          <div className="rounded-xl bg-[#fdf8f6] p-2 sm:p-3 border border-[#f0e4de]">
            <span className="text-[11px] sm:text-xs text-[rgb(var(--color-neutral))]/60 font-medium">⏱️ Tiempo</span>
            <div className="text-base sm:text-lg font-bold text-[rgb(var(--color-accent))] font-mono">
              {formatTime(timerSeconds)}
            </div>
          </div>

          <div className="rounded-xl bg-[#fdf8f6] p-2 sm:p-3 border border-[#f0e4de]">
            <span className="text-[11px] sm:text-xs text-[rgb(var(--color-neutral))]/60 font-medium">🔄 Intentos</span>
            <div className="text-base sm:text-lg font-bold text-[rgb(var(--color-neutral))]">
              {attempts}
            </div>
          </div>

          <div className="rounded-xl bg-[#fdf8f6] p-2 sm:p-3 border border-[#f0e4de]">
            <span className="text-[11px] sm:text-xs text-[rgb(var(--color-neutral))]/60 font-medium">🎯 Parejas</span>
            <div className="text-base sm:text-lg font-bold text-emerald-600">
              {matchedPairsCount} / {targetPairsCount}
            </div>
          </div>

          <div className="rounded-xl bg-[#fdf8f6] p-2 sm:p-3 border border-[#f0e4de]">
            <span className="text-[11px] sm:text-xs text-[rgb(var(--color-neutral))]/60 font-medium">⭐ XP Ganada</span>
            <div className="text-base sm:text-lg font-bold text-amber-600">
              +{earnedXp} XP
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-[#f0e4de] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[rgb(var(--color-accent))] to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="rounded-[1.75rem] border border-[#eaded6] bg-white/80 backdrop-blur-sm p-3.5 sm:p-6 shadow-[0_14px_34px_rgba(128,43,56,0.06)]">
        <div className={`grid ${activeDifficulty.cols} gap-2.5 sm:gap-4`}>
          {cards.map((card) => (
            <ParParejasCard
              key={card.id}
              card={card}
              onCardClick={handleCardClick}
              disabled={isLocked || isGameOver}
            />
          ))}
        </div>
      </div>

      {/* Victory Modal */}
      {isGameOver ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(53,18,25,0.5)] p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-[#eaded6] bg-white p-6 shadow-[0_24px_60px_rgba(53,18,25,0.3)] text-center animate-scaleUp">
            <div className="text-5xl sm:text-6xl mb-2">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--color-accent))]">
              ¡Excelente Memoria!
            </h2>
            <p className="mt-1 text-sm text-[rgb(var(--color-neutral))]/75">
              Has descubierto todos los pares de palabras con éxito.
            </p>

            <div className="my-5 rounded-2xl bg-[#fdf7f4] border border-[#f0e4de] p-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--color-neutral))]/70">Dificultad:</span>
                <span className="font-semibold text-[rgb(var(--color-neutral))]">{activeDifficulty.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--color-neutral))]/70">Tiempo total:</span>
                <span className="font-semibold text-[rgb(var(--color-neutral))] font-mono">{formatTime(timerSeconds)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--color-neutral))]/70">Total de intentos:</span>
                <span className="font-semibold text-[rgb(var(--color-neutral))]">{attempts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[rgb(var(--color-neutral))]/70">Precisión estimada:</span>
                <span className="font-semibold text-emerald-600">
                  {Math.min(100, Math.round((targetPairsCount / Math.max(1, attempts)) * 100))}%
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-[#ebdcd4] pt-2">
                <span className="font-bold text-[rgb(var(--color-accent))]">XP Ganada:</span>
                <span className="font-bold text-amber-600">+{earnedXp} XP</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button onClick={startNewGame} variant="primary" className="flex-1">
                Jugar de nuevo
              </Button>
              {onBackToLobby ? (
                <Button onClick={onBackToLobby} variant="outline" className="flex-1">
                  Volver
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
