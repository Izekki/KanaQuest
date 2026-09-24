import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWords } from '../../../services/supabase/words';
import { submitWordAnswer, createGameSession, fetchUserProfile } from '../../../services/supabase/progress';
import { useAuthSession } from '../../../hooks/useAuthSession';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import ParParejasCard from './ParParejasCard';
import Icon from '../../ui/Icon';

const DIFFICULTIES = [
  { id: 'beginner', label: 'Principiante', pairs: 6, cols: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' },
  { id: 'intermediate', label: 'Intermedio', pairs: 8, cols: 'grid-cols-2 sm:grid-cols-4' },
  { id: 'advanced', label: 'Avanzado', pairs: 10, cols: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-5' },
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
  const navigate = useNavigate();
  const { playFlip, playSuccess, playError, playComplete, isMuted, toggleSound, playCardAudio } = useSoundEffects();

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

    const shuffledWords = shuffle(wordsPool).slice(0, targetPairsCount);

    const generatedCards = [];
    shuffledWords.forEach((word) => {
      const jpText = word.japanese || word.hiragana || word.romaji;
      const esText = word.translation;

      // Japanese Card
      generatedCards.push({
        id: `${word.id}-jp`,
        wordId: word.id,
        content: jpText,
        subtext: word.hiragana !== word.japanese ? word.hiragana : word.romaji,
        type: 'kanji',
        japaneseText: jpText,
        spanishText: esText,
        isFlipped: false,
        isMatched: false,
      });

      // Translation Card
      generatedCards.push({
        id: `${word.id}-es`,
        wordId: word.id,
        content: esText,
        subtext: word.romaji,
        type: 'translation',
        japaneseText: jpText,
        spanishText: esText,
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
    setIsTimerRunning(false);
    setIsGameOver(false);

    if (timerRef.current) clearInterval(timerRef.current);
  }, [wordsPool, targetPairsCount]);

  useEffect(() => {
    if (wordsPool.length > 0) {
      startNewGame();
    }
  }, [wordsPool, difficulty, startNewGame]);

  // 3. Timer Control
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

  // 4. Card Click Handler
  const handleCardClick = (clickedCard) => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched || isGameOver) return;

    if (!isTimerRunning && attempts === 0 && flippedCards.length === 0) {
      setIsTimerRunning(true);
    }

    playFlip();

    if (clickedCard.type === 'kanji' && clickedCard.japaneseText) {
      playCardAudio(clickedCard.japaneseText);
    }

    const updatedCards = cards.map((c) =>
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setAttempts((prev) => prev + 1);

      const [firstCard, secondCard] = newFlipped;
      const isMatch = firstCard.wordId === secondCard.wordId && firstCard.id !== secondCard.id;

      if (isMatch) {
        playSuccess();

        const xpReward = 15;
        setEarnedXp((prev) => prev + xpReward);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.wordId === firstCard.wordId ? { ...c, isFlipped: true, isMatched: true } : c
            )
          );
          setMatchedWordIds((prev) => {
            const next = new Set(prev);
            next.add(firstCard.wordId);
            return next;
          });
          setFlippedCards([]);
          setIsLocked(false);
        }, 300);

        if (user?.id) {
          submitWordAnswer(firstCard.wordId, 'pair_match', true, false).catch((err) =>
            console.warn('Error registrando acierto:', err)
          );
        }

        // Check if finished
        if (matchedWordIds.size + 1 >= targetPairsCount) {
          setIsGameOver(true);
          setIsTimerRunning(false);
          playComplete();

          if (user?.id) {
            const finalScore = (matchedWordIds.size + 1) * 15;
            createGameSession({
              user_id: user.id,
              game_mode: 'pair_match',
              difficulty,
              score: finalScore,
              correct_answers: targetPairsCount,
              wrong_answers: Math.max(0, attempts + 1 - targetPairsCount),
              duration: timerSeconds,
            }).catch((err) => console.warn('Error guardando sesión:', err));
          }
        }
      } else {
        // Mismatch: quick 650ms inspection then flip back
        playError();

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 650);
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6b2832] border-t-transparent" />
          <p className="text-sm font-semibold text-[#6b2832]/70">Preparando tablero de memoria...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-[#eaded6] text-center space-y-4">
        <h3 className="text-lg font-bold text-[#6b2832]">Error de carga</h3>
        <p className="text-sm text-[rgb(var(--color-neutral))]/70">{errorMessage}</p>
        <button
          type="button"
          onClick={loadWords}
          className="px-6 py-2.5 rounded-xl bg-[#6b2832] text-white font-bold text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-4 space-y-3 sm:space-y-5">
      {/* 1. TOP HEADER & STREAMLINED STATUS STRIP */}
      <header className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBackToLobby || (() => navigate('/'))}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6b2832]/75 hover:text-[#6b2832] transition py-1 px-2 rounded-lg hover:bg-black/5"
            aria-label="Volver"
          >
            <span className="text-base leading-none">←</span>
            <span>Salir</span>
          </button>

          {/* Difficulty Selector as Flat Tabs */}
          <div className="inline-flex items-center p-1 bg-[#f5ebe6]/80 border border-[#eaded6] rounded-xl text-xs font-semibold">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
                  difficulty === d.id
                    ? 'bg-[#6b2832] text-white shadow-xs'
                    : 'text-[#6b2832]/70 hover:text-[#6b2832]'
                }`}
              >
                <span>{d.label}</span>
                <span className="hidden sm:inline text-[10px] ml-1 opacity-75">
                  ({d.pairs} p.)
                </span>
              </button>
            ))}
          </div>

          {/* Sound / Restart actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl text-[#6b2832]/70 hover:text-[#6b2832] hover:bg-black/5 transition cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            >
              <Icon name={isMuted ? 'volume-mute' : 'volume-high'} className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={startNewGame}
              className="p-2 rounded-xl text-[#6b2832]/70 hover:text-[#6b2832] hover:bg-black/5 transition cursor-pointer"
              title="Reiniciar partida"
            >
              <Icon name="arrow-path" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimal Stats Strip: "3 parejas · 8 intentos · 00:42" */}
        <div className="flex items-center justify-between py-1 text-xs sm:text-sm font-semibold text-[#6b2832]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span>
              <strong>{matchedPairsCount}</strong> / {targetPairsCount} parejas
            </span>
            <span className="text-[#eaded6]">·</span>
            <span className="text-[rgb(var(--color-neutral))]/70 font-normal">
              <strong>{attempts}</strong> intentos
            </span>
            <span className="text-[#eaded6]">·</span>
            <span className="font-mono text-[rgb(var(--color-neutral))]/80">
              {formatTime(timerSeconds)}
            </span>
          </div>

          {earnedXp > 0 && (
            <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 text-xs">
              +{earnedXp} XP
            </span>
          )}
        </div>

        {/* Clean Progress Bar */}
        <div className="w-full bg-[#f0e4de] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. THE ABSOLUTE PROTAGONIST: THE GAME BOARD */}
      <main className="w-full">
        {isGameOver ? (
          /* Victory Summary Screen */
          <div className="max-w-lg mx-auto p-6 sm:p-10 rounded-3xl border border-[#eaded6] bg-white text-center space-y-6 shadow-sm animate-fadeIn">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              🎉
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#6b2832]">
                ¡Tablero Completado!
              </h2>
              <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
                Has emparejado todas las palabras con éxito.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-y border-[#f2e7e1] py-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#6b2832]">
                  {formatTime(timerSeconds)}
                </div>
                <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase">
                  Tiempo
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#6b2832]">
                  {attempts}
                </div>
                <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase">
                  Intentos
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  +{earnedXp}
                </div>
                <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase">
                  XP Ganada
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={startNewGame}
                className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-[#6b2832] text-white font-bold text-sm hover:bg-[#581f27] active:scale-98 transition cursor-pointer"
              >
                Jugar de nuevo
              </button>
              {onBackToLobby && (
                <button
                  type="button"
                  onClick={onBackToLobby}
                  className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl border border-[#eaded6] bg-white text-[#6b2832] font-semibold text-sm hover:bg-[#faf4f2] active:scale-98 transition cursor-pointer"
                >
                  Volver a aprender
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Memory Cards Grid */
          <div
            className={[
              'grid gap-2.5 sm:gap-4 md:gap-5 w-full',
              activeDifficulty.cols,
            ].join(' ')}
          >
            {cards.map((card) => (
              <ParParejasCard
                key={card.id}
                card={card}
                onCardClick={handleCardClick}
                disabled={isLocked}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
