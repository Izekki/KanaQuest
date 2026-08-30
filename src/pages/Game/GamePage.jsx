import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import SessionProgressCard from '../../components/gameplay/SessionProgressCard';
import { fetchWords } from '../../services/supabase/words';
import {
  fetchRankingProfiles,
  fetchUserProfile,
  fetchUserProgress,
  submitWordAnswer,
} from '../../services/supabase/progress';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import avatarRimuruRedPink from '../../img/avatar_rimuru_version_red-pink.svg';

const ROUND_SIZE = 10;

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

function getInitials(player) {
  const name = player?.username || player?.name || 'U';
  return name.slice(0, 1).toUpperCase();
}

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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-[#6b2832]">
      <path
        fill="currentColor"
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v8h16V8H4Zm2 1h2v2H6V9Zm3 0h2v2H9V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9Zm3 0h2v2h-2V9ZM6 12h2v2H6v-2Zm3 0h8v2H9v-2Zm9 0h2v2h-2v-2Zm-12 3h12v2H6v-2Z"
      />
    </svg>
  );
}

export default function GamePage() {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { playFlip, playSuccess, playError, playComplete } = useSoundEffects();

  const [mode, setMode] = useState('recognize');
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Round and Queue Management
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewWordIds, setReviewWordIds] = useState([]);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  // Round Statistics
  const [roundStats, setRoundStats] = useState({
    correctCount: 0,
    wrongCount: 0,
    xpEarned: 0,
    missedQuestions: [],
  });

  // Current Question State
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [combo, setCombo] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState('');

  // Ranking State for Sidebar
  const [rankingProfiles, setRankingProfiles] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingModalOpen, setRankingModalOpen] = useState(false);

  const inputRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Helper to map raw word rows to question objects
  const mapWordsToQuestions = useCallback((rows, targetMode) => {
    return rows.map((row) => {
      const isRecognize = targetMode === 'recognize';
      return {
        wordId: row.id,
        prompt: isRecognize
          ? row.japanese || row.hiragana || row.katakana
          : row.translation || row.romaji || row.japanese,
        hiragana: row.hiragana,
        katakana: row.katakana,
        romaji: row.romaji,
        translation: row.translation,
        difficulty: row.difficulty,
        experienceReward: row.experience_reward ?? 10,
        answers: getAnswersFromWord(row, targetMode),
        instruction: isRecognize
          ? 'Escribe la lectura (hiragana, katakana o romaji).'
          : 'Escribe la palabra en japonés (hiragana, katakana o kanji).',
      };
    });
  }, []);

  // Initialize a new round queue (10 questions or custom deck)
  const initRound = useCallback(
    (wordsSource, targetMode, customWordIds = null, continuous = false) => {
      let filtered = [...wordsSource];

      if (customWordIds && customWordIds.length > 0) {
        filtered = filtered.filter((w) => customWordIds.includes(w.id));
      }

      if (!filtered.length) {
        filtered = [...wordsSource];
      }

      // Shuffle
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const selected = continuous ? shuffled : shuffled.slice(0, ROUND_SIZE);
      const mapped = mapWordsToQuestions(selected, targetMode);

      setRoundQuestions(mapped);
      setRoundIndex(0);
      setIsRoundFinished(false);
      setIsContinuousMode(continuous);
      setRoundStats({
        correctCount: 0,
        wrongCount: 0,
        xpEarned: 0,
        missedQuestions: [],
      });
      setAnswer('');
      setFeedback(null);
      setHintUsed(false);
      setHintText('');
    },
    [mapWordsToQuestions]
  );

  // Load words from Supabase & configure Review Mode if triggered
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchWords(200);
        if (error) throw error;

        const rows = data ?? [];
        if (!isMounted) return;
        setAllWords(rows);

        // Check if navigated with review state or query param
        const reviewRequested =
          location.state?.reviewMode === 'errors' ||
          searchParams.get('review') === 'errors';

        let targetMode = location.state?.sourceMode || 'recognize';
        if (targetMode === 'pair_match') targetMode = 'recognize';
        setMode(targetMode);

        if (reviewRequested) {
          setIsReviewMode(true);
          let targetWordIds = location.state?.wordIds || [];

          if (!targetWordIds.length && user?.id) {
            // Fetch failed words from progress table
            const { data: progressData } = await fetchUserProgress(user.id);
            if (progressData) {
              targetWordIds = progressData
                .filter((p) => !p.correct || (p.mastery_level ?? 0) === 0)
                .map((p) => p.word_id);
            }
          }

          setReviewWordIds(targetWordIds);
          initRound(rows, targetMode, targetWordIds, false);
        } else {
          setIsReviewMode(false);
          setReviewWordIds([]);
          initRound(rows, targetMode, null, false);
        }
      } catch (err) {
        console.warn('Error cargando mazo de palabras:', err?.message ?? err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [location.state, searchParams, user?.id, initRound]);

  // Load Ranking Profiles for Sidebar
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

  const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : (rankingProfiles.length ? rankingProfiles.length + 1 : 1);
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

  const currentQuestion = roundQuestions[roundIndex] ?? roundQuestions[0];

  const sessionStats = {
    streak: combo,
    questionNumber: roundQuestions.length ? roundIndex + 1 : 0,
    totalQuestions: roundQuestions.length,
    score: roundStats.xpEarned,
    progress: roundQuestions.length ? ((roundIndex + 1) / roundQuestions.length) * 100 : 0,
  };

  const promptIsJapanese = containsJapaneseScript(currentQuestion?.prompt ?? '');
  const promptSizeClass = promptIsJapanese ? 'text-6xl sm:text-7xl md:text-8xl' : 'text-3xl sm:text-4xl md:text-5xl';

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setIsReviewMode(false);
    setReviewWordIds([]);
    initRound(allWords, nextMode, null, false);
  };

  // Trigger Hint Feature
  const handleUseHint = () => {
    if (hintUsed || feedback !== null || !currentQuestion) return;

    playFlip();
    setHintUsed(true);

    // Speak audio
    speakWord(currentQuestion.hiragana || currentQuestion.prompt);

    // Generate helpful text clue
    const mainAnswer = currentQuestion.answers?.[0] || '';
    let clue = '';
    if (mode === 'recognize') {
      const reading = currentQuestion.hiragana || currentQuestion.romaji || mainAnswer;
      clue = `Comienza con "${reading.slice(0, 1)}..." (${currentQuestion.romaji ? currentQuestion.romaji.slice(0, 2) + '..' : ''})`;
    } else {
      clue = `Comienza con "${mainAnswer.slice(0, 1)}..."`;
    }
    setHintText(clue);
  };

  // Next Question / Finish Round Handler
  const handleNext = useCallback(() => {
    if (!roundQuestions.length) return;

    playFlip();

    const nextIdx = roundIndex + 1;
    if (!isContinuousMode && nextIdx >= roundQuestions.length) {
      setIsRoundFinished(true);
      playComplete();
      return;
    }

    setRoundIndex((val) => (val + 1) % roundQuestions.length);
    setAnswer('');
    setFeedback(null);
    setHintUsed(false);
    setHintText('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [roundIndex, roundQuestions.length, isContinuousMode, playFlip, playComplete]);

  // Round completion action handlers
  const handleStartNextRound = () => {
    playFlip();
    initRound(allWords, mode, isReviewMode ? reviewWordIds : null, false);
  };

  const handleStartContinuousMode = () => {
    playFlip();
    initRound(allWords, mode, isReviewMode ? reviewWordIds : null, true);
  };

  const handleReviewRoundErrors = () => {
    playFlip();
    const missedIds = roundStats.missedQuestions.map((q) => q.wordId);
    initRound(allWords, mode, missedIds, false);
  };

  const handleExitReviewMode = () => {
    setIsReviewMode(false);
    setReviewWordIds([]);
    initRound(allWords, mode, null, false);
  };

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
    if (!feedback && !isRoundFinished) {
      inputRef.current?.focus();
    }
  }, [roundIndex, feedback, isRoundFinished]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (feedback) {
      handleNext();
      return;
    }

    if (!answer.trim() || !currentQuestion) return;

    const normalizedAnswer = normalize(answer);
    const acceptedAnswers = getAcceptedAnswers(currentQuestion?.answers ?? [], mode);
    const isCorrect = acceptedAnswers.some((item) => item && normalize(item) === normalizedAnswer);

    const xpForWord = currentQuestion.experienceReward ?? 10;

    if (isCorrect) {
      playSuccess();
      if (hintUsed) {
        setFeedback({
          tone: 'success',
          message: '¡Correcto con pista! Has acertado el término (0 XP en esta palabra).',
          hintUsed: true,
        });
        setRoundStats((prev) => ({
          ...prev,
          correctCount: prev.correctCount + 1,
        }));
      } else {
        setFeedback({
          tone: 'success',
          message: `¡Correcto! Excelente trabajo (+${xpForWord} XP).`,
          hintUsed: false,
        });
        setRoundStats((prev) => ({
          ...prev,
          correctCount: prev.correctCount + 1,
          xpEarned: prev.xpEarned + xpForWord,
        }));
      }
      setCombo((value) => value + 1);
    } else {
      playError();
      setFeedback({ tone: 'error', message: 'Respuesta incorrecta.' });
      setCombo(0);
      setRoundStats((prev) => ({
        ...prev,
        wrongCount: prev.wrongCount + 1,
        missedQuestions: [...prev.missedQuestions, currentQuestion],
      }));
    }

    if (user?.id && currentQuestion?.wordId) {
      try {
        const { data: rpcResult, error: rpcError } = await submitWordAnswer(
          currentQuestion.wordId,
          mode,
          isCorrect,
          hintUsed
        );

        if (rpcError) {
          console.warn('Error registrando respuesta:', rpcError.message);
        } else if (rpcResult) {
          window.dispatchEvent(
            new CustomEvent('kanaquest-profile-updated', {
              detail: {
                experience: rpcResult.new_total_xp,
                level: rpcResult.new_level,
                current_streak: rpcResult.current_streak,
                last_active_date: rpcResult.last_active_date,
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
      {/* 2-Column Layout: Main Exercise (Left) + Compact Podium Ranking (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px] gap-5 items-start">
        {/* LEFT COLUMN: Main Practice Flow */}
        <div className="w-full max-w-2xl mx-auto lg:max-w-none space-y-3.5">
          {/* Review Mode Notice Banner */}
          {isReviewMode && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-2.5 text-xs text-rose-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="font-bold">⚡ Modo Repaso Inteligente:</span>
                <span>{roundQuestions.length} palabras pendientes</span>
              </div>
              <button
                type="button"
                onClick={handleExitReviewMode}
                className="font-bold underline text-rose-800 hover:text-rose-950"
              >
                Volver a práctica normal
              </button>
            </div>
          )}

          {/* Mode Selector Pills & Mode Indicator */}
          <div className="flex items-center justify-between gap-2.5">
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
                      ? 'bg-[#6b2832] text-white shadow-sm'
                      : 'text-[#6b2832]/75 hover:text-[#6b2832] hover:bg-white',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {isContinuousMode && (
              <span className="rounded-full bg-[#fdf6f3] border border-[#eaded6] px-3 py-1 text-[11px] font-bold text-[rgb(var(--color-accent))]">
                ♾️ Práctica Continua
              </span>
            )}
          </div>

          {/* Top Progress Bar */}
          <SessionProgressCard
            streak={sessionStats.streak}
            questionNumber={sessionStats.questionNumber}
            totalQuestions={sessionStats.totalQuestions}
            score={sessionStats.score}
            progress={sessionStats.progress}
            className="mb-0"
          />

          {/* Central Stage: Either Round Summary Card OR Question Card */}
          {isRoundFinished ? (
            <div className="rounded-[1.75rem] border border-[#eaded6] bg-white p-6 sm:p-8 shadow-[0_14px_32px_rgba(107,40,50,0.06)] text-center space-y-6 animate-fadeIn">
              <div className="flex flex-col items-center justify-center">
                <CatIllustration animationState={roundStats.wrongCount === 0 ? 'success' : 'default'} />
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-[#6b2832]">
                  ¡Ronda Completada!
                </h2>
                <p className="text-xs sm:text-sm text-[rgb(var(--color-accent))]/75 mt-1">
                  {roundStats.wrongCount === 0
                    ? '¡Puntuación perfecta! Has dominado todas las palabras de esta ronda.'
                    : `Has finalizado los ${roundQuestions.length} ejercicios de esta ronda.`}
                </p>
              </div>

              {/* Round metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                    Aciertos
                  </div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">
                    {roundStats.correctCount} / {roundQuestions.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                    Fallos
                  </div>
                  <div className="text-2xl font-bold text-rose-900 mt-1">
                    {roundStats.wrongCount}
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                    XP Obtenida
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">
                    +{roundStats.xpEarned} XP
                  </div>
                </div>

                <div className="rounded-2xl border border-[#eaded6] bg-[#fdfaf8] p-3.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6b2832]">
                    Precisión
                  </div>
                  <div className="text-2xl font-bold text-[#6b2832] mt-1">
                    {roundQuestions.length > 0
                      ? Math.round((roundStats.correctCount / roundQuestions.length) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartNextRound}
                  className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#6b2832] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#581f27] active:scale-98 transition"
                >
                  <span>Siguiente ronda rápida (10 preguntas)</span>
                  <span>→</span>
                </button>

                {roundStats.missedQuestions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReviewRoundErrors}
                    className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-5 py-3 text-xs sm:text-sm font-bold text-rose-900 hover:bg-rose-100 active:scale-98 transition"
                  >
                    <span>Repasar errores de esta ronda ({roundStats.missedQuestions.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartContinuousMode}
                  className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#eaded6] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-[#6b2832] hover:bg-[#faf5f2] active:scale-98 transition"
                >
                  <span>Modo práctica continua / Infinita</span>
                </button>
              </div>
            </div>
          ) : (
            /* Central Question Card */
            <section className="rounded-[1.75rem] border border-[#eaded6] bg-white p-5 sm:p-7 shadow-[0_14px_32px_rgba(107,40,50,0.06)]">
              {loading ? (
                <p className="py-8 text-center text-sm font-semibold text-[#6b2832]/60 animate-pulse">
                  Cargando palabras desde Supabase...
                </p>
              ) : null}

              {/* Top Card Utilities: Reward Badge + Hint Button */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {/* EXP Reward Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f8ebe6]/90 px-3 py-1 text-xs font-bold text-[rgb(var(--color-accent))] border border-[#eaded6]/60 opacity-60 shadow-2xs">
                  <span>✨</span>
                  <span>+{currentQuestion?.experienceReward ?? 10} XP</span>
                </div>

                {/* Hint Button */}
                <button
                  type="button"
                  onClick={handleUseHint}
                  disabled={hintUsed || feedback !== null}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition-all ${hintUsed
                      ? 'border-amber-300 bg-amber-50 text-amber-800 opacity-90 cursor-default'
                      : 'border-amber-200/90 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 active:scale-98'
                    }`}
                  title="Revela una pista a cambio de no recibir XP en esta palabra"
                >
                  <span>💡</span>
                  <span>
                    {hintUsed
                      ? 'Pista activa'
                      : `Pista (-${currentQuestion?.experienceReward ?? 10} XP)`}
                  </span>
                </button>
              </div>

              {/* Prompt + Mascot Section */}
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 items-center text-center sm:text-left">
                <div className="flex flex-col justify-center min-h-[130px] sm:min-h-[160px]">
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <div
                      className={[
                        'font-bold leading-tight text-[#6b2832] tracking-tight select-none',
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

              {/* Hint Revealed Callout Banner */}
              {hintUsed && hintText && (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-800">💡 Pista:</span>
                    <span className="font-semibold">{hintText}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakWord(currentQuestion?.hiragana || currentQuestion?.prompt)}
                    className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-amber-900 border border-amber-200 shadow-2xs hover:bg-amber-100/50"
                  >
                    <span>🔊 Escuchar</span>
                  </button>
                </div>
              )}

              {/* Practice Form */}
              <form className="mx-auto mt-4 max-w-xl" onSubmit={handleSubmit}>
                <p className="text-center text-sm sm:text-base font-semibold text-[rgb(var(--color-neutral))]">
                  {currentQuestion?.instruction ?? 'Escribe la respuesta:'}
                </p>

                <div className="relative mt-3">
                  <input
                    ref={inputRef}
                    className="w-full min-h-[50px] rounded-[1.2rem] border border-[rgba(107,40,50,0.22)] bg-[#fffdfb] px-4 py-3.5 pr-14 text-base text-[rgb(var(--color-neutral))] outline-none transition placeholder:text-[rgb(var(--color-neutral))]/35 focus:border-[#6b2832] focus:bg-white focus:ring-2 focus:ring-[rgba(107,40,50,0.12)] disabled:bg-stone-50 disabled:opacity-80 sm:px-5 sm:py-4 sm:text-lg"
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

                          {/* Detailed word explanation revealed ONLY after answering */}
                          <div className="mt-1.5 text-xs sm:text-sm space-y-0.5">
                            {currentQuestion?.hiragana || currentQuestion?.romaji ? (
                              <div className="font-medium text-[rgb(var(--color-neutral))]/80">
                                Lectura:{' '}
                                <span className="font-semibold">
                                  {currentQuestion.hiragana || currentQuestion.romaji}
                                </span>
                                {currentQuestion.romaji && currentQuestion.hiragana
                                  ? ` (${currentQuestion.romaji})`
                                  : ''}
                              </div>
                            ) : null}

                            {currentQuestion?.translation && mode === 'recognize' ? (
                              <div className="text-[rgb(var(--color-neutral))]/70">
                                Significado:{' '}
                                <span className="font-semibold">{currentQuestion.translation}</span>
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
                        {feedback.tone === 'success' && !feedback.hintUsed ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 tracking-wider">
                            +{currentQuestion?.experienceReward ?? 10} XP
                          </span>
                        ) : null}

                        {/* Audio pronunciation button */}
                        <button
                          type="button"
                          onClick={() =>
                            speakWord(currentQuestion?.hiragana || currentQuestion?.prompt)
                          }
                          className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-[#eaded6] px-2.5 py-1 text-xs font-semibold text-[#6b2832] hover:bg-white transition shadow-2xs"
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
                        'inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl px-6 py-3.5 text-base font-bold text-white shadow-md transition-all duration-150 active:scale-98',
                        feedback.tone === 'success'
                          ? 'bg-emerald-700 hover:bg-emerald-800 shadow-[0_10px_22px_rgba(4,120,87,0.25)]'
                          : 'bg-[#6b2832] hover:bg-[#581f27] shadow-[0_10px_22px_rgba(107,40,50,0.2)]',
                      ].join(' ')}
                    >
                      <span>
                        {!isContinuousMode && roundIndex + 1 >= roundQuestions.length
                          ? 'Ver resumen de ronda'
                          : 'Siguiente pregunta'}
                      </span>
                      <span aria-hidden="true">→</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#6b2832] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_22px_rgba(107,40,50,0.2)] transition-all duration-150 hover:bg-[#581f27] active:scale-98 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                    >
                      <span>Verificar</span>
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Compact Podium Ranking Sidebar */}
        <aside className="w-full max-w-2xl mx-auto lg:max-w-[300px] xl:max-w-[320px] rounded-[1.6rem] border border-[#eaded6] bg-white p-4 sm:p-4.5 shadow-[0_14px_32px_rgba(107,40,50,0.06)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#f2e2da]">
            <h3 className="text-base font-bold text-[#6b2832] tracking-tight">
              Ranking de usuarios
            </h3>
          </div>

          {/* Compact Podium (Top 3) */}
          <div className="mt-3">
            {rankingLoading ? (
              <div className="py-6 text-center text-xs text-[rgb(var(--color-neutral))]/60">
                Cargando ranking...
              </div>
            ) : (
              <div className="grid grid-cols-3 items-end gap-1.5 pt-1">
                {/* 2DO LUGAR */}
                {top3[1] ? (
                  <div className="flex h-[132px] flex-col items-center justify-between rounded-2xl border border-[#eaded6] bg-[#fff8f4] p-2 shadow-2xs">
                    <div className="inline-flex items-center gap-0.5 rounded-full bg-[#dce9f4] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#46688e]">
                      <span aria-hidden="true">🥈</span>
                      <span>2°</span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b86773] text-xs font-bold text-white shadow-xs">
                      {getInitials(top3[1])}
                    </div>
                    <div className="w-full text-center">
                      <div className="truncate text-[11px] font-bold text-[#6b2832]">
                        {top3[1].username || 'Usuario'}
                      </div>
                      <div className="text-[10px] text-[rgb(var(--color-neutral))]/60 font-mono font-medium">
                        {top3[1].experience ?? 0} XP
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[132px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#eaded6] bg-[#faf6f3]/60 p-2 text-center text-[10px] text-[rgb(var(--color-neutral))]/40">
                    Disponible
                  </div>
                )}

                {/* 1ER LUGAR */}
                {top3[0] ? (
                  <div className="flex h-[154px] flex-col items-center justify-between rounded-2xl border border-[#d98b96] bg-[linear-gradient(180deg,#fff2eb,#ffe4d6)] p-2 shadow-xs">
                    <div className="inline-flex items-center gap-0.5 rounded-full bg-[#fde9a8] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#825c0e]">
                      <span aria-hidden="true">👑</span>
                      <span>1°</span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-sm font-bold text-white shadow-sm ring-2 ring-[#e3b8b1]">
                      {getInitials(top3[0])}
                    </div>
                    <div className="w-full text-center">
                      <div className="truncate text-xs font-extrabold text-[#6b2832]">
                        {top3[0].username || 'Usuario'}
                      </div>
                      <div className="text-[10px] text-[#6b2832]/80 font-mono font-bold">
                        {top3[0].experience ?? 0} XP
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[154px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#eaded6] bg-[#faf6f3]/60 p-2 text-center text-[10px] text-[rgb(var(--color-neutral))]/40">
                    Disponible
                  </div>
                )}

                {/* 3ER LUGAR */}
                {top3[2] ? (
                  <div className="flex h-[120px] flex-col items-center justify-between rounded-2xl border border-[#eaded6] bg-[#fff8f4] p-2 shadow-2xs">
                    <div className="inline-flex items-center gap-0.5 rounded-full bg-[#fae1cf] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#8b5a37]">
                      <span aria-hidden="true">🥉</span>
                      <span>3°</span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#caa09b] text-xs font-bold text-white shadow-xs">
                      {getInitials(top3[2])}
                    </div>
                    <div className="w-full text-center">
                      <div className="truncate text-[11px] font-bold text-[#6b2832]">
                        {top3[2].username || 'Usuario'}
                      </div>
                      <div className="text-[10px] text-[rgb(var(--color-neutral))]/60 font-mono font-medium">
                        {top3[2].experience ?? 0} XP
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#eaded6] bg-[#faf6f3]/60 p-2 text-center text-[10px] text-[rgb(var(--color-neutral))]/40">
                    Disponible
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current User Standing Box */}
          {user ? (
            <div className="mt-3.5 rounded-2xl border border-[#eaded6] bg-[#faf6f3] p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6b2832] text-[10px] font-bold text-white">
                    {getInitials(currentUserProfile)}
                  </div>
                  <div className="truncate text-xs font-bold text-[#6b2832] max-w-[100px]">
                    {currentUserProfile?.username || 'Tú'}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[rgb(var(--color-neutral))]/60">Puesto:</span>
                  <span className="rounded-md bg-white border border-[#eaded6] px-1.5 py-0.2 text-[10px] font-extrabold text-[#6b2832]">
                    #{currentUserRank}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#eaded6]/60 text-[10px]">
                <span className="text-[rgb(var(--color-neutral))]/70 font-mono font-medium">
                  {currentUserXP} XP
                </span>
                {xpToNext > 0 ? (
                  <span className="text-amber-800/90 font-medium">
                    +{xpToNext} XP para subir 🔺
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">¡En la cima! 🌟</span>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-3.5 rounded-2xl border border-dashed border-[#eaded6] bg-[#faf6f3] p-3 text-center text-[11px] text-[rgb(var(--color-neutral))]/70">
              <Link to="/login" className="font-bold text-[#6b2832] hover:underline">
                Inicia sesión
              </Link>{' '}
              para competir en el ranking.
            </div>
          )}

          {/* Ver más ranking completo */}
          <div className="mt-3 pt-2 border-t border-[#f2e2da] text-center">
            <button
              type="button"
              onClick={() => setRankingModalOpen(true)}
              className="text-xs font-bold text-[#6b2832] hover:text-[#581f27] hover:underline transition"
            >
              Ver tabla completa de líderes →
            </button>
          </div>
        </aside>
      </div>

      {/* Full Leaderboard Modal */}
      {rankingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setRankingModalOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-md rounded-3xl border border-[#eaded6] bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[#f2e2da] pb-3">
              <h3 className="text-lg font-bold text-[#6b2832]">Tabla de Líderes</h3>
              <button
                type="button"
                onClick={() => setRankingModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-[#fbf5f2] hover:text-[#6b2832] transition"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {rankingProfiles.map((p, idx) => {
                const isCurrent = p.user_id === user?.id;
                return (
                  <div
                    key={p.user_id || idx}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition ${isCurrent
                        ? 'border-[#d98b96] bg-[#fff2eb] shadow-xs'
                        : 'border-[#eaded6]/70 bg-[#faf6f3]/60'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-bold text-[#6b2832]">
                        {idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6b2832] text-xs font-bold text-white shadow-2xs">
                        {getInitials(p)}
                      </div>
                      <div className="text-xs font-bold text-[#6b2832]">
                        {p.username || 'Jugador'}
                        {isCurrent ? (
                          <span className="ml-1 text-[10px] text-amber-800">(Tú)</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#6b2832]">
                      {p.experience ?? 0} XP
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
