import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SessionProgressCard from '../../components/gameplay/SessionProgressCard';
import { fetchWords } from '../../services/supabase/words';
import {
  fetchRankingProfiles,
  fetchUserProfile,
  submitWordAnswer,
} from '../../services/supabase/progress';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import avatarRimuruRedPink from '../../img/avatar_rimuru_version_red-pink.svg';

const normalize = (value) => value.trim().toLowerCase().normalize('NFKC');

const KATAKANA_START = 0x30a1;
const KATAKANA_END = 0x30f6;
const HIRAGANA_START = 0x3041;
const HIRAGANA_END = 0x3096;
const KANA_SHIFT = 0x60;

const containsJapaneseScript = (value = '') => /[\u3040-\u30ff\u3400-\u9fff]/.test(value);

const toHiragana = (value = '') =>
  Array.from(value)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= KATAKANA_START && code <= KATAKANA_END) {
        return String.fromCharCode(code - KANA_SHIFT);
      }
      return char;
    })
    .join('');

const toKatakana = (value = '') =>
  Array.from(value)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= HIRAGANA_START && code <= HIRAGANA_END) {
        return String.fromCharCode(code + KANA_SHIFT);
      }
      return char;
    })
    .join('');

const getAcceptedAnswers = (answers, mode) => {
  const base = (answers ?? []).filter(Boolean).map((item) => item.toString());

  if (mode !== 'translate') {
    return base;
  }

  const expanded = new Set();

  base.forEach((item) => {
    expanded.add(item);
    expanded.add(toHiragana(item));
    expanded.add(toKatakana(item));
  });

  return [...expanded];
};

const getAnswersFromWord = (word, mode) => {
  const modeAnswers = word?.accepted_answers?.[mode];

  if (Array.isArray(modeAnswers) && modeAnswers.length) {
    return modeAnswers;
  }

  if (mode === 'translate') {
    return [word?.japanese, word?.hiragana, word?.katakana, word?.romaji].filter(Boolean);
  }

  return [word?.hiragana, word?.katakana, word?.romaji, word?.translation].filter(Boolean);
};

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

function speakWord(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug('Speech synthesis error:', e);
  }
}

function CatIllustration({ animationState }) {
  const animationClass =
    animationState === 'success'
      ? 'animate-mascot-success'
      : animationState === 'error'
      ? 'animate-mascot-error'
      : '';

  return (
    <div
      className={[
        'relative flex h-24 w-24 sm:h-[180px] sm:w-[180px] items-center justify-center overflow-hidden rounded-full bg-[#f5dbe0] border-4 border-white shadow-[0_12px_28px_rgba(128,43,56,0.14)] transition-transform duration-300',
        animationClass,
      ].join(' ')}
    >
      <img
        src={avatarRimuruRedPink}
        alt="Avatar de Rimuru"
        className="h-16 w-16 sm:h-[115px] sm:w-[115px] max-w-none object-contain drop-shadow-[0_8px_12px_rgba(128,43,56,0.15)]"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

function KeyboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-[rgb(var(--color-accent))]">
      <path
        fill="currentColor"
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v8h16V8H4Zm2 1h2v2H6V9Zm3 0h2v2H9V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9ZM6 12h2v2H6v-2Zm3 0h8v2H9v-2Zm9 0h2v2h-2v-2Zm-12 3h12v2H6v-2Z"
      />
    </svg>
  );
}

export default function GamePage() {
  const { user } = useAuthSession();
  const [mode, setMode] = useState('recognize');
  const [deckData, setDeckData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { playFlip, playSuccess, playError } = useSoundEffects();

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // null | { tone: 'success' | 'error', message: string, masteryLevel?: number }
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Ranking State
  const [rankingProfiles, setRankingProfiles] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingModalOpen, setRankingModalOpen] = useState(false);

  const inputRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Sync Streak with Session Storage
  useEffect(() => {
    if (!user?.id) {
      setStreak(0);
      return;
    }

    const savedStreak = sessionStorage.getItem(getStreakStorageKey(user.id));
    const nextStreak = Number(savedStreak);

    setStreak(Number.isFinite(nextStreak) ? nextStreak : 0);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    sessionStorage.setItem(getStreakStorageKey(user.id), String(streak));
    window.dispatchEvent(new Event('kanaquest-streak-change'));
  }, [streak, user?.id]);

  // Load Word Deck
  useEffect(() => {
    let isMounted = true;

    const loadWords = async () => {
      try {
        const { data, error } = await fetchWords(200);
        if (error) throw error;

        const rows = data ?? [];
        const shuffled = [...rows].sort(() => Math.random() - 0.5);

        const recognize = shuffled.map((row) => ({
          wordId: row.id,
          prompt: row.japanese || row.hiragana || row.katakana,
          hiragana: row.hiragana,
          romaji: row.romaji,
          translation: row.translation,
          difficulty: row.difficulty,
          answers: getAnswersFromWord(row, 'recognize'),
          instruction: 'Escribe la lectura (hiragana, katakana o romaji).',
        }));

        const translate = shuffled.map((row) => ({
          wordId: row.id,
          prompt: row.translation || row.romaji || row.japanese,
          hiragana: row.hiragana,
          romaji: row.romaji,
          translation: row.translation,
          difficulty: row.difficulty,
          answers: getAnswersFromWord(row, 'translate'),
          instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).',
        }));

        if (isMounted) {
          setDeckData({ recognize, translate });
        }
      } catch (error) {
        console.warn('No se pudo cargar el mazo de Supabase:', error?.message ?? error);
        if (isMounted) {
          setDeckData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWords();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load Ranking Profiles
  useEffect(() => {
    let isMounted = true;

    const loadRanking = async () => {
      try {
        const { data, error } = await fetchRankingProfiles(10);
        if (error) throw error;
        if (isMounted) {
          setRankingProfiles(data ?? []);
        }
      } catch (error) {
        console.warn('No se pudo cargar el ranking:', error?.message ?? error);
      } finally {
        if (isMounted) {
          setRankingLoading(false);
        }
      }
    };

    loadRanking();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync profile XP changes with ranking live
  useEffect(() => {
    const handleProfileUpdate = (e) => {
      const updatedXP = e?.detail?.experience;
      const updatedLevel = e?.detail?.level;
      if (updatedXP !== undefined && user?.id) {
        setRankingProfiles((prev) => {
          const updated = prev.map((p) =>
            p.user_id === user.id
              ? { ...p, experience: updatedXP, level: updatedLevel ?? p.level }
              : p
          );
          return updated.sort((a, b) => (b.experience ?? 0) - (a.experience ?? 0));
        });
      }
    };

    window.addEventListener('kanaquest-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('kanaquest-profile-updated', handleProfileUpdate);
  }, [user?.id]);

  // Ranking Computations
  const top3 = useMemo(() => rankingProfiles.slice(0, 3), [rankingProfiles]);
  const currentUserIndex = useMemo(() => {
    if (!user?.id) return -1;
    return rankingProfiles.findIndex((p) => p.user_id === user.id);
  }, [rankingProfiles, user?.id]);

  const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : null;
  const isUserInTop3 = currentUserIndex >= 0 && currentUserIndex < 3;
  const currentUserProfile = currentUserIndex >= 0 ? rankingProfiles[currentUserIndex] : null;
  const currentUserXP = currentUserProfile?.experience ?? 0;

  const xpToNext = useMemo(() => {
    if (currentUserIndex > 0 && rankingProfiles[currentUserIndex - 1]) {
      const prevXP = rankingProfiles[currentUserIndex - 1].experience ?? 0;
      return Math.max(10, prevXP - currentUserXP + 10);
    }
    return 0;
  }, [currentUserIndex, rankingProfiles, currentUserXP]);

  const fallbackDeck = useMemo(
    () => ({
      recognize: [
        { prompt: 'あ', answers: ['a'], instruction: 'Escribe la lectura (romaji o kana).' },
        { prompt: 'い', answers: ['i'], instruction: 'Escribe la lectura (romaji o kana).' },
        { prompt: 'う', answers: ['u'], instruction: 'Escribe la lectura (romaji o kana).' },
      ],
      translate: [
        { prompt: 'gato', answers: ['猫', 'ねこ', 'ネコ', 'neko'], instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).' },
        { prompt: 'agua', answers: ['水', 'みず', 'ミズ', 'mizu'], instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).' },
      ],
    }),
    []
  );

  const activeDeckData = deckData?.[mode]?.length ? deckData : null;
  const deck = activeDeckData?.[mode] ?? fallbackDeck[mode];
  const currentQuestion = deck[index] ?? deck[0];

  const sessionStats = {
    streak,
    questionNumber: deck.length ? index + 1 : 0,
    totalQuestions: deck.length,
    score,
    progress: deck.length ? ((index + 1) / deck.length) * 100 : 0,
  };

  const promptIsJapanese = containsJapaneseScript(currentQuestion?.prompt ?? '');
  const promptSizeClass = promptIsJapanese ? 'text-6xl sm:text-7xl md:text-8xl' : 'text-3xl sm:text-4xl md:text-5xl';

  const handleModeChange = (nextMode) => {
    if (nextMode === 'pair_match') {
      navigate('/pair-match');
      return;
    }
    setMode(nextMode);
    setIndex(0);
    setAnswer('');
    setFeedback(null);
  };

  const handleNext = useCallback(() => {
    if (!deck.length) return;
    playFlip();
    setIndex((value) => (value + 1) % deck.length);
    setAnswer('');
    setFeedback(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [deck.length, playFlip]);

  // Global Enter Key Handler when feedback is active
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter' && feedback) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [feedback, handleNext]);

  // Auto focus input on question load
  useEffect(() => {
    if (!feedback) {
      inputRef.current?.focus();
    }
  }, [index, feedback]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (feedback) {
      handleNext();
      return;
    }

    if (!answer.trim()) return;

    const normalizedAnswer = normalize(answer);
    const acceptedAnswers = getAcceptedAnswers(currentQuestion?.answers ?? [], mode);
    const isCorrect = acceptedAnswers.some((item) => item && normalize(item) === normalizedAnswer);

    if (isCorrect) {
      playSuccess();
      setFeedback({ tone: 'success', message: '¡Correcto! Excelente trabajo.' });
      setScore((value) => value + 50);
      setStreak((value) => value + 1);
    } else {
      playError();
      setFeedback({ tone: 'error', message: 'Respuesta incorrecta.' });
      setStreak(0);
    }

    if (user?.id && currentQuestion?.wordId) {
      try {
        const { data: rpcResult, error: rpcError } = await submitWordAnswer(currentQuestion.wordId, mode, isCorrect);
        if (rpcError) {
          console.warn('Error registrando respuesta:', rpcError.message);
        } else if (rpcResult) {
          window.dispatchEvent(
            new CustomEvent('kanaquest-profile-updated', {
              detail: {
                experience: rpcResult.new_total_xp,
                level: rpcResult.new_level,
              },
            })
          );
        }

        const { data: profileData } = await fetchUserProfile(user.id);
        if (profileData) {
          window.dispatchEvent(
            new CustomEvent('kanaquest-profile-updated', {
              detail: profileData,
            })
          );
        }
      } catch (err) {
        console.warn('Error en la llamada RPC:', err);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl py-2">
      {/* Asymmetrical 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px] gap-5 items-start">
        {/* Main Column: Game & Practice Session */}
        <div className="w-full max-w-2xl mx-auto lg:max-w-none space-y-3.5">
          {/* Top Bar with Compact Mode Selector and Quick Links */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Mode Selector Pills */}
            <div className="flex items-center gap-1 rounded-2xl bg-[#fbf5f2] p-1 border border-[#eaded6] shadow-xs">
              {[
                { id: 'recognize', label: 'Reconocer' },
                { id: 'translate', label: 'Traducir' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleModeChange(option.id)}
                  className={[
                    'rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all',
                    mode === option.id
                      ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
                      : 'text-[rgb(var(--color-neutral))]/70 hover:text-[rgb(var(--color-accent))] hover:bg-white',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => navigate('/pair-match')}
                className="rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[rgb(var(--color-neutral))]/70 hover:text-[rgb(var(--color-accent))] hover:bg-white transition-all"
              >
                Parejas 🎴
              </button>
            </div>

            {/* Quick Link to Historial */}
            <Link
              to="/historial"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#eaded6] bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[rgb(var(--color-accent))] shadow-xs transition hover:bg-white hover:shadow-sm"
            >
              <span>Historial</span>
              <span aria-hidden="true">⏱</span>
            </Link>
          </div>

          {/* Top Progress Bar Component */}
          <SessionProgressCard
            streak={sessionStats.streak}
            questionNumber={sessionStats.questionNumber}
            totalQuestions={sessionStats.totalQuestions}
            score={sessionStats.score}
            progress={sessionStats.progress}
            className="mb-0"
          />

          {/* Central Game Card */}
          <section className="rounded-[1.75rem] border border-[#eaded6] bg-white p-5 sm:p-7 shadow-[0_16px_36px_rgba(128,43,56,0.08)]">
            {loading ? (
              <p className="mb-4 text-center text-sm text-[rgb(var(--color-neutral))]/70">
                Cargando palabras desde Supabase...
              </p>
            ) : null}

            {/* Prompt + Mascot Section */}
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center text-center sm:text-left">
              <div className="flex flex-col justify-center min-h-[140px] sm:min-h-[180px]">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div
                    className={[
                      'font-bold leading-tight text-[rgb(var(--color-accent))] tracking-tight select-none',
                      promptSizeClass,
                      promptIsJapanese ? 'font-jp' : '',
                    ].join(' ')}
                  >
                    {currentQuestion?.prompt ?? '...'}
                  </div>
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <CatIllustration animationState={feedback?.tone} />
              </div>
            </div>

            {/* Practice Form */}
            <form className="mx-auto mt-5 max-w-xl" onSubmit={handleSubmit}>
              <p className="text-center text-sm sm:text-base font-semibold text-[rgb(var(--color-neutral))]">
                {currentQuestion?.instruction ?? 'Escribe la respuesta:'}
              </p>

              <div className="relative mt-3">
                <input
                  ref={inputRef}
                  className="w-full min-h-[50px] rounded-[1.2rem] border border-[rgba(128,43,56,0.22)] bg-[#fffdfb] px-4 py-3.5 pr-14 text-base text-[rgb(var(--color-neutral))] outline-none transition placeholder:text-[rgb(var(--color-neutral))]/35 focus:border-[rgb(var(--color-accent))] focus:bg-white focus:ring-2 focus:ring-[rgba(128,43,56,0.12)] disabled:bg-stone-50 disabled:opacity-80 sm:px-5 sm:py-4 sm:text-lg"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Escribe aquí..."
                  autoComplete="off"
                  disabled={feedback !== null}
                />

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f6e7e0] sm:h-10 sm:w-10">
                    <KeyboardIcon />
                  </div>
                </div>
              </div>

              {/* Answer Feedback Banner */}
              {feedback ? (
                <div
                  className={[
                    'mt-4 rounded-2xl p-4 transition-all duration-300 shadow-xs animate-fadeIn',
                    feedback.tone === 'success'
                      ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/90 border border-rose-200 text-rose-900',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl select-none" aria-hidden="true">
                        {feedback.tone === 'success' ? '🎉' : '❌'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm sm:text-base">{feedback.message}</p>

                        {/* Detailed word info revealed ONLY after answering */}
                        <div className="mt-1.5 text-xs sm:text-sm space-y-0.5">
                          {currentQuestion?.hiragana || currentQuestion?.romaji ? (
                            <div className="font-medium text-[rgb(var(--color-neutral))]/80">
                              Lectura: <span className="font-semibold">{currentQuestion.hiragana || currentQuestion.romaji}</span>
                              {currentQuestion.romaji && currentQuestion.hiragana ? ` (${currentQuestion.romaji})` : ''}
                            </div>
                          ) : null}

                          {currentQuestion?.translation && mode === 'recognize' ? (
                            <div className="text-[rgb(var(--color-neutral))]/70">
                              Significado: <span className="font-semibold">{currentQuestion.translation}</span>
                            </div>
                          ) : null}

                          {feedback.tone === 'error' && currentQuestion?.answers?.length ? (
                            <p className="pt-0.5 text-xs sm:text-sm font-medium text-rose-800">
                              Respuesta aceptada:{' '}
                              <strong className="font-bold text-rose-950">
                                {currentQuestion.answers[0]}
                              </strong>
                              {currentQuestion.answers.length > 1 ? (
                                <span className="text-rose-700/80 font-normal">
                                  {' '}
                                  (o {currentQuestion.answers.slice(1, 3).join(', ')})
                                </span>
                              ) : null}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {feedback.tone === 'success' ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 tracking-wider">
                          +50 XP
                        </span>
                      ) : null}

                      {/* Audio button in feedback */}
                      <button
                        type="button"
                        onClick={() => speakWord(currentQuestion?.hiragana || currentQuestion?.prompt)}
                        className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-[#eaded6] px-2.5 py-1 text-xs font-semibold text-[rgb(var(--color-accent))] hover:bg-white transition shadow-2xs"
                        title="Escuchar pronunciación"
                        aria-label="Escuchar pronunciación"
                      >
                        <span aria-hidden="true">🔊</span>
                        <span className="hidden sm:inline text-[11px]">Audio</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Dynamic Action Button: Verificar / Siguiente pregunta */}
              <div className="mt-5 flex justify-center">
                {feedback ? (
                  <button
                    type="button"
                    ref={nextButtonRef}
                    onClick={handleNext}
                    className={[
                      'inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-white shadow-md transition-all duration-150 active:scale-98',
                      feedback.tone === 'success'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_10px_22px_rgba(5,150,105,0.28)]'
                        : 'bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-dark))] shadow-[0_10px_22px_rgba(128,43,56,0.22)]',
                    ].join(' ')}
                  >
                    <span>Siguiente pregunta</span>
                    <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!answer.trim()}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-accent))] px-6 py-3 text-base font-bold text-white shadow-[0_12px_24px_rgba(128,43,56,0.18)] transition-all duration-150 hover:bg-[rgb(var(--color-accent-dark))] active:scale-98 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                  >
                    <span>Verificar</span>
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Compact Weekly Ranking */}
        <aside className="w-full max-w-2xl mx-auto lg:max-w-[310px] rounded-[1.6rem] border border-[#eaded6] bg-white p-4 sm:p-5 shadow-[0_12px_30px_rgba(128,43,56,0.06)]">
          {/* Ranking Header */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#f3e7e0]">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg select-none" aria-hidden="true">🏆</span>
              <h3 className="text-sm sm:text-base font-bold text-[rgb(var(--color-accent))] tracking-tight">
                Ranking Semanal
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setRankingModalOpen(true)}
              className="text-[11px] font-semibold text-[rgb(var(--color-accent))]/75 hover:text-[rgb(var(--color-accent))] hover:underline transition"
            >
              Ver detalles
            </button>
          </div>

          {/* Compact Top 3 List */}
          <div className="mt-3.5 space-y-2">
            {rankingLoading ? (
              <div className="py-6 text-center text-xs text-[rgb(var(--color-neutral))]/60">
                Cargando ranking...
              </div>
            ) : top3.length === 0 ? (
              <div className="py-4 text-center text-xs text-[rgb(var(--color-neutral))]/60">
                Aún no hay puntuaciones esta semana.
              </div>
            ) : (
              top3.map((player, idx) => {
                const isCurrent = user?.id && player.user_id === user.id;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                const name = player.username || player.name || `Jugador ${idx + 1}`;
                const xp = player.experience ?? player.xp ?? 0;

                return (
                  <div
                    key={player.user_id || idx}
                    className={[
                      'flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-xs transition-all',
                      isCurrent
                        ? 'bg-[#fcf1ed] border border-[rgb(var(--color-accent))]/35 shadow-2xs font-semibold'
                        : 'bg-[#fdfaf8] border border-[#f2e6df] hover:bg-white',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0 select-none" aria-hidden="true">{medal}</span>
                      <span className={['truncate font-semibold text-[rgb(var(--color-neutral))]', containsJapaneseScript(name) ? 'font-jp' : ''].join(' ')}>
                        {name} {isCurrent ? '(Tú)' : ''}
                      </span>
                    </div>
                    <span className="font-bold text-[rgb(var(--color-accent))] shrink-0 font-mono">
                      {xp} <span className="text-[10px] font-normal text-[rgb(var(--color-neutral))]/60">XP</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* User's Position Row (if not in Top 3) */}
          {!rankingLoading && !isUserInTop3 && currentUserRank ? (
            <div className="mt-3 pt-3 border-t border-[#f3e7e0]">
              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#fbf0ec] border border-[rgb(var(--color-accent))]/25 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="rounded-full bg-[rgb(var(--color-accent))] text-white text-[10px] font-bold px-1.5 py-0.5 shrink-0">
                    #{currentUserRank}
                  </span>
                  <span className="truncate font-bold text-[rgb(var(--color-accent))]">
                    Tu posición
                  </span>
                </div>
                <span className="font-bold text-[rgb(var(--color-accent))] shrink-0 font-mono">
                  {currentUserXP} <span className="text-[10px] font-normal text-[rgb(var(--color-neutral))]/60">XP</span>
                </span>
              </div>
            </div>
          ) : null}

          {/* Motivational Indicator Footer */}
          {!rankingLoading && (
            <div className="mt-3.5 rounded-xl bg-[#faf3ef] p-2.5 text-center text-[11px] text-[rgb(var(--color-neutral))]/80 border border-[#f0e2db]">
              {currentUserRank === 1 ? (
                <span className="font-semibold text-emerald-800">
                  ¡Estás en el puesto #1 del podio! 👑
                </span>
              ) : xpToNext > 0 ? (
                <span>
                  🚀 <strong>+{xpToNext} XP</strong> para subir de puesto
                </span>
              ) : (
                <span>
                  🎯 ¡Gana partidas para escalar en el ranking!
                </span>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Full Ranking Modal */}
      {rankingModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(53,18,25,0.45)] px-4 py-6 backdrop-blur-sm"
          onClick={() => setRankingModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Top 10 del ranking"
            className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-[#eaded6] bg-white shadow-[0_24px_60px_rgba(53,18,25,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f0e2db] px-5 py-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[rgb(var(--color-accent))]">
                  🏆 Top 10 del Ranking
                </h3>
                <p className="mt-0.5 text-xs text-[rgb(var(--color-neutral))]/65">
                  Tabla de clasificación de la comunidad KanaQuest.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRankingModalOpen(false)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 space-y-2">
              {rankingProfiles.map((player, idx) => {
                const isCurrentUser = user?.id && player.user_id === user.id;
                const displayName = player.username || player.name || `Jugador ${idx + 1}`;
                const xp = player.experience ?? player.xp ?? 0;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                return (
                  <div
                    key={player.user_id || idx}
                    className={[
                      'flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-xs sm:text-sm',
                      isCurrentUser
                        ? 'border-[rgba(128,43,56,0.3)] bg-[#fdf3ef] shadow-xs font-semibold'
                        : 'border-[#f0e2db] bg-[#fffdfb]'
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-center font-bold text-sm shrink-0">{medal}</span>
                      <div className="min-w-0">
                        <div className={['truncate font-semibold text-[rgb(var(--color-neutral))]', containsJapaneseScript(displayName) ? 'font-jp' : ''].join(' ')}>
                          {displayName} {isCurrentUser ? '(Tú)' : ''}
                        </div>
                        <div className="text-[11px] text-[rgb(var(--color-neutral))]/60">
                          Nivel {player.level ?? 1}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-[rgb(var(--color-accent))] shrink-0 font-mono">
                      {xp} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
