import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { fetchWords } from '../../services/supabase/words';
import {
  fetchRankingProfiles,
  fetchUserProfile,
  fetchUserProgress,
  submitWordAnswer,
} from '../../services/supabase/progress';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import Icon from '../../components/ui/Icon';
import MultipleChoiceGrid from '../../components/gameplay/MultipleChoiceGrid';
import {
  createExercise,
  generateMultipleChoiceOptions,
  calculateAwardXp,
  isAnswerCorrect,
} from '../../utils/gameplayLogic';

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

  // Learning Mode & Current Question State
  const [isLearningMode, setIsLearningMode] = useState(() => {
    try {
      const saved = localStorage.getItem('kanaquest_learning_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      const diff = localStorage.getItem('kanaquest_difficulty_mode');
      if (diff !== null) {
        return diff === 'apprentice';
      }
      return true;
    } catch {
      return true;
    }
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [combo, setCombo] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState('');

  // Ranking Drawer / Modal State
  const [rankingProfiles, setRankingProfiles] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingDrawerOpen, setRankingDrawerOpen] = useState(false);

  const inputRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Helper to map raw word rows to pedagogical exercise objects
  const mapWordsToQuestions = useCallback((rows, targetMode, learningActive, wordPool) => {
    const diffMode = learningActive ? 'apprentice' : 'master';
    const pool = wordPool || rows;
    return rows.map((row) => {
      const exercise = createExercise(row, pool, diffMode, targetMode);
      if (exercise) return exercise;

      const isRecognize = targetMode === 'recognize';
      return {
        id: row.id,
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
          ? 'Escribe la lectura (hiragana o romaji)'
          : 'Escribe la palabra en japonés',
        presentation: learningActive ? 'multiple_choice' : 'open_input',
        options: null,
        _rawItem: row,
      };
    });
  }, []);

  // Initialize a new round queue (10 questions or custom deck)
  const initRound = useCallback(
    (wordsSource, targetMode, customWordIds = null, continuous = false, learningActive = isLearningMode) => {
      let filtered = [...wordsSource];

      if (customWordIds && customWordIds.length > 0) {
        filtered = filtered.filter((w) => customWordIds.includes(w.id));
      }

      if (!filtered.length) {
        filtered = [...wordsSource];
      }

      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      const selected = continuous ? shuffled : shuffled.slice(0, ROUND_SIZE);
      const mapped = mapWordsToQuestions(selected, targetMode, learningActive, wordsSource);

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
      setSelectedOption(null);
      setFeedback(null);
      setHintUsed(false);
      setHintText('');
    },
    [mapWordsToQuestions, isLearningMode]
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

  // Load Ranking Profiles for Leaderboard
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

  const top3 = useMemo(() => rankingProfiles.slice(0, 3), [rankingProfiles]);
  const currentUserIndex = useMemo(() => {
    if (!user?.id) return -1;
    return rankingProfiles.findIndex((p) => p.user_id === user.id);
  }, [rankingProfiles, user?.id]);

  const currentUserRank = currentUserIndex >= 0 ? currentUserIndex + 1 : rankingProfiles.length + 1;
  const currentUserProfile = currentUserIndex >= 0 ? rankingProfiles[currentUserIndex] : null;

  const currentQuestion = roundQuestions[roundIndex] ?? roundQuestions[0];

  // Dynamic Options for Learning Mode (Cards)
  const activeOptions = useMemo(() => {
    if (!isLearningMode || !currentQuestion) return [];
    if (currentQuestion.options && currentQuestion.options.length > 0) {
      return currentQuestion.options;
    }
    if (allWords.length > 0) {
      return generateMultipleChoiceOptions(currentQuestion, allWords, mode);
    }
    return [];
  }, [isLearningMode, currentQuestion, allWords, mode]);

  const sessionStats = {
    streak: combo,
    questionNumber: roundQuestions.length ? roundIndex + 1 : 0,
    totalQuestions: roundQuestions.length,
    score: roundStats.xpEarned,
    progress: roundQuestions.length ? ((roundIndex + 1) / roundQuestions.length) * 100 : 0,
  };

  const promptIsJapanese = containsJapaneseScript(currentQuestion?.prompt ?? '');

  const handleToggleLearningMode = () => {
    playFlip();
    const nextMode = !isLearningMode;
    setIsLearningMode(nextMode);
    const diffMode = nextMode ? 'apprentice' : 'master';
    try {
      localStorage.setItem('kanaquest_learning_mode', nextMode ? 'true' : 'false');
      localStorage.setItem('kanaquest_difficulty_mode', diffMode);
    } catch (e) {
      console.debug('Error saving learning mode preference:', e);
    }

    setRoundQuestions((prev) =>
      prev.map((q) => {
        const raw = q._rawItem || q.rawRow || q;
        return createExercise(raw, allWords, diffMode, mode) || q;
      })
    );

    setAnswer('');
    setSelectedOption(null);
    setFeedback(null);
    setHintUsed(false);
    setHintText('');
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setIsReviewMode(false);
    setReviewWordIds([]);
    initRound(allWords, nextMode, null, false, isLearningMode);
  };

  const handleUseHint = () => {
    if (hintUsed || feedback !== null || !currentQuestion) return;

    playFlip();
    setHintUsed(true);
    speakWord(currentQuestion.hiragana || currentQuestion.prompt);

    const mainAnswer = currentQuestion.answers?.[0] || '';
    let clue = '';
    if (mode === 'recognize') {
      const reading = currentQuestion.hiragana || currentQuestion.romaji || mainAnswer;
      clue = `Empieza con "${reading.slice(0, 1)}..." (${currentQuestion.romaji ? currentQuestion.romaji.slice(0, 2) + '..' : ''})`;
    } else {
      clue = `Empieza con "${mainAnswer.slice(0, 1)}..."`;
    }
    setHintText(clue);
  };

  const handleSelectOption = async (option) => {
    if (feedback !== null || !currentQuestion) return;

    setSelectedOption(option);
    const isCorrect = option.isCorrect;
    const diffMode = isLearningMode ? 'apprentice' : 'master';
    const xpBase = currentQuestion.experienceReward ?? 10;
    const xpEarned = calculateAwardXp(xpBase, diffMode);

    if (isCorrect) {
      playSuccess();
      setFeedback({
        tone: 'success',
        message: '¡Correcto!',
        hintUsed: false,
      });
      setCombo((c) => c + 1);
      setRoundStats((prev) => ({
        ...prev,
        correctCount: prev.correctCount + 1,
        xpEarned: prev.xpEarned + xpEarned,
      }));
    } else {
      playError();
      setFeedback({
        tone: 'error',
        message: 'No exactamente',
      });
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
          false
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
    setSelectedOption(null);
    setFeedback(null);
    setHintUsed(false);
    setHintText('');

    if (!isLearningMode) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [roundIndex, roundQuestions.length, isContinuousMode, isLearningMode, playFlip, playComplete]);

  const handleStartNextRound = () => {
    playFlip();
    initRound(allWords, mode, isReviewMode ? reviewWordIds : null, false, isLearningMode);
  };

  const handleStartContinuousMode = () => {
    playFlip();
    initRound(allWords, mode, isReviewMode ? reviewWordIds : null, true, isLearningMode);
  };

  const handleReviewRoundErrors = () => {
    playFlip();
    const missedIds = roundStats.missedQuestions.map((q) => q.wordId);
    initRound(allWords, mode, missedIds, false, isLearningMode);
  };

  const handleExitReviewMode = () => {
    setIsReviewMode(false);
    setReviewWordIds([]);
    initRound(allWords, mode, null, false, isLearningMode);
  };

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

  useEffect(() => {
    if (!feedback && !isRoundFinished && !isLearningMode) {
      inputRef.current?.focus();
    }
  }, [roundIndex, feedback, isRoundFinished, isLearningMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (feedback) {
      handleNext();
      return;
    }

    if (!answer.trim() || !currentQuestion) return;

    const normalizedAnswer = normalize(answer);
    const acceptedAnswers = getAcceptedAnswers(currentQuestion?.answers ?? [], mode);
    const isCorrect =
      isAnswerCorrect(answer, currentQuestion) ||
      acceptedAnswers.some((item) => item && normalize(item) === normalizedAnswer);

    const diffMode = isLearningMode ? 'apprentice' : 'master';
    const xpBase = currentQuestion.experienceReward ?? 10;
    const xpForWord = calculateAwardXp(xpBase, diffMode);

    if (isCorrect) {
      playSuccess();
      if (hintUsed) {
        setFeedback({
          tone: 'success',
          message: '¡Correcto con pista!',
          hintUsed: true,
        });
        setRoundStats((prev) => ({
          ...prev,
          correctCount: prev.correctCount + 1,
        }));
      } else {
        setFeedback({
          tone: 'success',
          message: '¡Correcto!',
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
      setFeedback({
        tone: 'error',
        message: 'No exactamente',
      });
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
    <div className="mx-auto w-full max-w-2xl px-4 py-3 sm:py-6 flex flex-col min-h-[calc(100vh-100px)] justify-between">
      {/* 1. TOP BAR: Navigation, Mode Switcher & Progress */}
      <header className="w-full space-y-3">
        {/* Review Mode Banner (if active) */}
        {isReviewMode && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs text-rose-900 shadow-2xs">
            <span className="font-semibold">
              Repaso de errores: <strong>{roundQuestions.length} palabras</strong>
            </span>
            <button
              type="button"
              onClick={handleExitReviewMode}
              className="font-bold underline hover:text-rose-950 cursor-pointer"
            >
              Salir del repaso
            </button>
          </div>
        )}

        {/* Top Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Exit / Back */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6b2832]/75 hover:text-[#6b2832] transition py-1 px-2 rounded-lg hover:bg-black/5"
            aria-label="Salir de la práctica"
          >
            <span className="text-base leading-none">←</span>
            <span>Salir</span>
          </button>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1 bg-[#f5ebe6]/80 border border-[#eaded6] rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleModeChange('recognize')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === 'recognize'
                  ? 'bg-[#6b2832] text-white shadow-xs'
                  : 'text-[#6b2832]/70 hover:text-[#6b2832]'
              }`}
            >
              Reconocer
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('translate')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === 'translate'
                  ? 'bg-[#6b2832] text-white shadow-xs'
                  : 'text-[#6b2832]/70 hover:text-[#6b2832]'
              }`}
            >
              Traducir
            </button>
          </div>

          {/* Ranking Button (Opens slide-over modal) */}
          <button
            type="button"
            onClick={() => setRankingDrawerOpen(true)}
            className="inline-flex items-center gap-1 rounded-xl border border-[#eaded6] bg-white px-2.5 py-1.5 text-xs font-bold text-[#6b2832] shadow-2xs hover:bg-[#fbf5f2] transition active:scale-98"
            title="Ver tabla de líderes"
            aria-label="Ver ranking de usuarios"
          >
            <Icon name="crown" className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Ranking</span>
          </button>
        </div>

        {/* Clean Progress Strip + Modo Aprendizaje Switch */}
        <div className="w-full pt-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-[rgb(var(--color-neutral))]/70">
            {/* The Modo Aprendizaje Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={isLearningMode}
                onClick={handleToggleLearningMode}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-[#eaded6] transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6b2832] ${
                  isLearningMode ? 'bg-[#6b2832]' : 'bg-[#e5d8d0]'
                }`}
                title={
                  isLearningMode
                    ? 'Modo aprendizaje activo: Opciones múltiples'
                    : 'Modo aprendizaje desactivado: Escritura libre (+50% XP)'
                }
              >
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    isLearningMode ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={handleToggleLearningMode}
                className="text-xs font-semibold text-[#6b2832] hover:text-[#581f27] flex items-center gap-1.5 cursor-pointer select-none"
              >
                <span>Modo aprendizaje</span>
                {!isLearningMode ? (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-1.5 py-0.2 rounded-full font-mono">
                    ⚡ +50% XP
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-[rgb(var(--color-neutral))]/60 bg-[#f5ebe6] border border-[#eaded6] px-1.5 py-0.2 rounded-full">
                    Tarjetas
                  </span>
                )}
              </button>
            </div>

            {/* Question Counter */}
            <span className="font-mono font-bold text-[#6b2832]">
              {sessionStats.questionNumber} / {sessionStats.totalQuestions}
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-[#f0e4de] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#6b2832] h-full transition-all duration-300 rounded-full"
              style={{ width: `${sessionStats.progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. MAIN INTERACTIVE AREA: Focus Mode */}
      <main className="my-auto w-full py-4 sm:py-6">
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-[#6b2832]/60 animate-pulse">
            Cargando ejercicio...
          </div>
        ) : isRoundFinished ? (
          /* Round Completed Summary */
          <div className="rounded-3xl border border-[#eaded6] bg-white p-6 sm:p-10 shadow-sm text-center space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fceee9] text-2xl text-amber-600 shadow-inner">
                {roundStats.wrongCount === 0 ? '🏆' : '✨'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#6b2832]">
                {roundStats.wrongCount === 0 ? '¡Ronda Perfecta!' : '¡Ronda Completada!'}
              </h2>
              <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
                Has completado las {roundQuestions.length} preguntas de esta sesión.
              </p>
            </div>

            {/* Flat Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 border-y border-[#f2e7e1] py-4">
              <div>
                <div className="text-2xl font-bold text-emerald-700">
                  {roundStats.correctCount}
                </div>
                <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase tracking-wider">
                  Aciertos
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-rose-600">
                  {roundStats.wrongCount}
                </div>
                <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase tracking-wider">
                  Fallos
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-[#6b2832]">
                  +{roundStats.xpEarned}
                </div>
                <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase tracking-wider">
                  XP Ganada
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleStartNextRound}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#6b2832] text-white text-sm font-bold shadow-md hover:bg-[#581f27] active:scale-98 transition cursor-pointer"
              >
                Siguiente ronda (10 preguntas) →
              </button>

              {roundStats.missedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleReviewRoundErrors}
                  className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-sm font-bold hover:bg-rose-100 active:scale-98 transition cursor-pointer"
                >
                  Repasar errores ({roundStats.missedQuestions.length})
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Single Question Focus Stage */
          <div className="space-y-6">
            {/* The absolute protagonist: Giant Japanese prompt / word */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative group inline-flex items-center justify-center gap-3">
                <span
                  className={`font-bold text-[#6b2832] select-none tracking-tight leading-none ${
                    promptIsJapanese
                      ? 'text-6xl sm:text-7xl md:text-8xl font-jp py-2'
                      : 'text-3xl sm:text-4xl md:text-5xl py-3'
                  }`}
                >
                  {currentQuestion?.prompt ?? '...'}
                </span>

                {/* Subtle speech button */}
                <button
                  type="button"
                  onClick={() =>
                    speakWord(currentQuestion?.hiragana || currentQuestion?.prompt)
                  }
                  className="rounded-full p-2 text-[#6b2832]/60 hover:text-[#6b2832] hover:bg-[#f5ebe6] transition active:scale-95 cursor-pointer"
                  title="Escuchar pronunciación"
                  aria-label="Escuchar pronunciación"
                >
                  <Icon name="volume-high" className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Clean single instruction */}
              <p className="text-xs sm:text-sm font-medium text-[rgb(var(--color-neutral))]/70">
                {currentQuestion?.instruction ?? 'Escribe la lectura'}
              </p>

              {/* Discreet Hint Option */}
              {!hintUsed && !feedback && (
                <button
                  type="button"
                  onClick={handleUseHint}
                  className="inline-flex items-center gap-1 text-xs text-amber-800/80 hover:text-amber-900 hover:underline pt-0.5 cursor-pointer"
                >
                  <Icon name="lightbulb" className="w-3.5 h-3.5 text-amber-600" />
                  <span>¿Necesitas una pista?</span>
                </button>
              )}

              {hintUsed && hintText && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200/80 px-3 py-1 text-xs text-amber-900 animate-fadeIn">
                  <Icon name="lightbulb" className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold">{hintText}</span>
                </div>
              )}
            </div>

            {/* Response Area: Multiple Choice (Modo Aprendizaje) vs Open Input (Modo Maestro) */}
            {isLearningMode ? (
              <div className="w-full space-y-4 pt-1">
                <MultipleChoiceGrid
                  options={activeOptions}
                  selectedOption={selectedOption}
                  feedback={feedback}
                  onSelectOption={handleSelectOption}
                  disabled={feedback !== null}
                />

                {/* Semantic Feedback Banner for Learning Mode */}
                {feedback && (
                  <div
                    className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 animate-fadeIn border ${
                      feedback.tone === 'success'
                        ? 'border-emerald-200 bg-emerald-50/90 text-emerald-950'
                        : 'border-rose-200 bg-rose-50/90 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-bold">
                          {feedback.tone === 'success' ? '✓' : '✕'}
                        </span>
                        <div>
                          <div className="font-bold text-sm sm:text-base">
                            {feedback.tone === 'success'
                              ? '¡Correcto!'
                              : 'No exactamente'}
                          </div>
                          <div className="text-xs sm:text-sm font-medium opacity-85 mt-0.5">
                            {feedback.tone === 'success' ? (
                              <span>
                                {currentQuestion?.prompt} →{' '}
                                <strong className="font-bold">
                                  {currentQuestion?.correctOptionLabel ||
                                    currentQuestion?.hiragana ||
                                    currentQuestion?.romaji ||
                                    currentQuestion?.translation}
                                </strong>
                              </span>
                            ) : (
                              <span>
                                Respuesta correcta:{' '}
                                <strong className="font-bold">
                                  {currentQuestion?.correctOptionLabel ||
                                    currentQuestion?.hiragana ||
                                    currentQuestion?.romaji ||
                                    currentQuestion?.answers?.[0]}
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {feedback.tone === 'success' && !feedback.hintUsed && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            +{calculateAwardXp(currentQuestion?.experienceReward ?? 10, 'apprentice')} XP
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            speakWord(currentQuestion?.hiragana || currentQuestion?.prompt)
                          }
                          className="rounded-full p-2 text-stone-600 hover:bg-black/5 transition cursor-pointer"
                          title="Escuchar"
                          aria-label="Escuchar pronunciación"
                        >
                          <Icon name="volume-high" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Next Button for Learning Mode */}
                {feedback && (
                  <div className="pt-2 animate-fadeIn">
                    <button
                      type="button"
                      ref={nextButtonRef}
                      onClick={handleNext}
                      className={`w-full min-h-[54px] rounded-2xl text-base sm:text-lg font-bold text-white shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                        feedback.tone === 'success'
                          ? 'bg-emerald-700 hover:bg-emerald-800'
                          : 'bg-[#6b2832] hover:bg-[#581f27]'
                      }`}
                    >
                      <span>
                        {!isContinuousMode && roundIndex + 1 >= roundQuestions.length
                          ? 'Ver resultados'
                          : 'Siguiente'}
                      </span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Master Mode: Open Text Input (+50% XP Bonus) */
              <form onSubmit={handleSubmit} className="w-full space-y-4 pt-2">
                <div className="relative">
                  <input
                    ref={inputRef}
                    className="w-full min-h-[58px] sm:min-h-[64px] rounded-2xl border-2 border-[#eaded6] bg-white px-5 text-center text-xl sm:text-2xl text-[rgb(var(--color-neutral))] outline-none transition focus:border-[#6b2832] focus:ring-4 focus:ring-[#6b2832]/10 placeholder:text-[rgb(var(--color-neutral))]/30 disabled:bg-[#fbf9f7] disabled:opacity-90 font-medium"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={
                      mode === 'translate'
                        ? 'Escribe en japonés o romaji...'
                        : 'Escribe aquí...'
                    }
                    autoComplete="off"
                    disabled={feedback !== null}
                  />
                </div>

                {/* Semantic Feedback Banner for Master Mode */}
                {feedback && (
                  <div
                    className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 animate-fadeIn border ${
                      feedback.tone === 'success'
                        ? 'border-emerald-200 bg-emerald-50/90 text-emerald-950'
                        : 'border-rose-200 bg-rose-50/90 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-bold">
                          {feedback.tone === 'success' ? '✓' : '✕'}
                        </span>
                        <div>
                          <div className="font-bold text-sm sm:text-base">
                            {feedback.tone === 'success'
                              ? '¡Correcto!'
                              : 'No exactamente'}
                          </div>
                          <div className="text-xs sm:text-sm font-medium opacity-85 mt-0.5">
                            {feedback.tone === 'success' ? (
                              <span>
                                {currentQuestion?.prompt} →{' '}
                                <strong className="font-bold">
                                  {currentQuestion?.hiragana || currentQuestion?.romaji || currentQuestion?.translation}
                                </strong>
                              </span>
                            ) : (
                              <span>
                                Respuesta correcta:{' '}
                                <strong className="font-bold">
                                  {currentQuestion?.hiragana || currentQuestion?.romaji || currentQuestion?.answers?.[0]}
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {feedback.tone === 'success' && !feedback.hintUsed && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            +{calculateAwardXp(currentQuestion?.experienceReward ?? 10, 'master')} XP ⚡
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            speakWord(currentQuestion?.hiragana || currentQuestion?.prompt)
                          }
                          className="rounded-full p-2 text-stone-600 hover:bg-black/5 transition cursor-pointer"
                          title="Escuchar"
                          aria-label="Escuchar pronunciación"
                        >
                          <Icon name="volume-high" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic Action Button for Master Mode */}
                <div className="pt-2">
                  {feedback ? (
                    <button
                      type="button"
                      ref={nextButtonRef}
                      onClick={handleNext}
                      className={`w-full min-h-[54px] rounded-2xl text-base sm:text-lg font-bold text-white shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                        feedback.tone === 'success'
                          ? 'bg-emerald-700 hover:bg-emerald-800'
                          : 'bg-[#6b2832] hover:bg-[#581f27]'
                      }`}
                    >
                      <span>
                        {!isContinuousMode && roundIndex + 1 >= roundQuestions.length
                          ? 'Ver resultados'
                          : 'Siguiente'}
                      </span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="w-full min-h-[54px] rounded-2xl bg-[#6b2832] text-white text-base sm:text-lg font-bold shadow-md transition-all hover:bg-[#581f27] active:scale-98 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none cursor-pointer"
                    >
                      Verificar
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* 3. FOOTER / META: Combo & Help Hint */}
      <footer className="w-full text-center py-2 text-xs text-[rgb(var(--color-neutral))]/50">
        {combo > 1 ? (
          <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50/70 border border-amber-200/60 px-3 py-1 rounded-full">
            <Icon name="fire-streak" className="w-3.5 h-3.5 text-amber-600" />
            <span>Racha de {combo} aciertos</span>
          </span>
        ) : (
          <span>Pulsa Enter para verificar o continuar</span>
        )}
      </footer>

      {/* 4. SLIDE-OVER / MODAL: Leaderboard Ranking Drawer */}
      {rankingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setRankingDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-md rounded-3xl border border-[#eaded6] bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[#f2e2da] pb-3">
              <div className="flex items-center gap-2">
                <Icon name="crown" className="w-5 h-5 text-amber-600" />
                <h3 className="text-base sm:text-lg font-bold text-[#6b2832]">
                  Ranking de Estudiantes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRankingDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-[#fbf5f2] hover:text-[#6b2832] transition cursor-pointer"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {rankingLoading ? (
                <div className="py-8 text-center text-xs text-stone-500 animate-pulse">
                  Cargando clasificación...
                </div>
              ) : (
                rankingProfiles.map((p, idx) => {
                  const isCurrent = p.user_id === user?.id;
                  return (
                    <div
                      key={p.user_id || idx}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                        isCurrent
                          ? 'border-[#d98b96] bg-[#fff2eb] shadow-2xs'
                          : 'border-[#eaded6]/70 bg-[#faf6f3]/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs font-bold text-[#6b2832]">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6b2832] text-xs font-bold text-white shadow-2xs">
                          {getInitials(p)}
                        </div>
                        <div className="text-xs font-bold text-[#6b2832]">
                          {p.username || 'Estudiante'}
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
                })
              )}
            </div>

            {/* Current user footer if logged in */}
            {user && currentUserProfile && (
              <div className="pt-2 border-t border-[#f2e2da] flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-neutral))]/70">
                  Tu puesto actual: <strong className="text-[#6b2832]">#{currentUserRank}</strong>
                </span>
                <span className="font-mono font-bold text-[#6b2832]">
                  {currentUserProfile.experience ?? 0} XP
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
