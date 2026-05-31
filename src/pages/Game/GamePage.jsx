import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SessionProgressCard from '../../components/gameplay/SessionProgressCard';
import { supabase } from '../../services/supabase/client';
import { useAuthSession } from '../../hooks/useAuthSession';
import avatarRimuruRedPink from '../../img/avatar_rimuru_version_red-pink.svg';

const players = [
  { name: 'Hana (Tú)', xp: 2350, tone: 'from-[#d95f76] to-[#8b2d3f]' },
  { name: 'Kenji', xp: 1980, tone: 'from-[#5d95c7] to-[#2f5375]' },
  { name: 'Yuki', xp: 1570, tone: 'from-[#c97b8a] to-[#7f4f63]' },
];

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

  return [word?.translation, word?.romaji].filter(Boolean);
};

const getModeLabel = (value) => (value === 'translate' ? 'Traducir' : 'Reconocer');

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

function Avatar({ label, tone }) {
  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} text-sm font-semibold text-white shadow-sm`}>
      {label}
    </div>
  );
}

function CatIllustration() {
  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-full bg-[#f5dbe0] shadow-[0_10px_25px_rgba(128,43,56,0.12)]">
      <img
        src={avatarRimuruRedPink}
        alt="Avatar de Rimuru"
        className="h-[130px] w-[130px] max-w-none object-contain drop-shadow-[0_10px_12px_rgba(128,43,56,0.15)]"
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
  const [rankingProfiles, setRankingProfiles] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingModalOpen, setRankingModalOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);

  const rankingEntries = useMemo(
    () => (rankingProfiles.length ? rankingProfiles : players),
    [rankingProfiles]
  );

  const podiumRanking = useMemo(() => rankingEntries.slice(0, 3), [rankingEntries]);
  const listRanking = useMemo(() => rankingEntries.slice(3, 6), [rankingEntries]);
  const modalRanking = useMemo(() => rankingEntries.slice(0, 10), [rankingEntries]);

  useEffect(() => {
    if (!rankingModalOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setRankingModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rankingModalOpen]);

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

  useEffect(() => {
    let isMounted = true;

    const loadRanking = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id,username,avatar_url,level,experience,games_played,correct_answers,wrong_answers,created_at')
          .order('experience', { ascending: false })
          .order('level', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (isMounted) {
          setRankingProfiles(data ?? []);
        }
      } catch (error) {
        console.warn('No se pudo cargar el ranking:', error?.message ?? error);
        if (isMounted) {
          setRankingProfiles([]);
        }
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

  useEffect(() => {
    let isMounted = true;

    const loadWords = async () => {
      try {
        const { data, error } = await supabase
          .from('words')
          .select('id,japanese,hiragana,katakana,romaji,translation,accepted_answers,difficulty,type_id,level,experience_reward')
          .limit(200);
        if (error) throw error;

        const rows = data ?? [];
        const shuffled = [...rows].sort(() => Math.random() - 0.5);

         const recognize = shuffled.map((row) => ({
          wordId: row.id,
          prompt: row.japanese || row.hiragana || row.katakana,
          answers: getAnswersFromWord(row, 'recognize'),
          instruction: 'Escribe la lectura (hiragana o katakana).',
        }));

        const translate = shuffled.map((row) => ({
          wordId: row.id,
          prompt: row.translation || row.romaji || row.japanese,
          answers: getAnswersFromWord(row, 'recognize') ,
          instruction: 'Escribe la palabra en japonés (hiragana, katakana o kanji).',
        }));

        if (isMounted) {
          setDeckData(recognize.length || translate.length ? { recognize, translate } : null);
        }
      } catch (error) {
        console.warn('No se pudo cargar el deck desde Supabase:', error?.message ?? error);
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

  const fallbackDeck = useMemo(
    () => ({
      recognize: [
        { prompt: '猫', answers: ['gato', 'neko', 'cat'], instruction: 'Escribe el significado (español o romaji).' },
        { prompt: '水', answers: ['agua', 'mizu', 'water'], instruction: 'Escribe el significado (español o romaji).' },
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
  useEffect(() => {
    let isMounted = true;

    const loadReviewItems = async () => {
      if (!user?.id) {
        if (isMounted) {
          setReviewItems([]);
          setReviewLoading(false);
        }
        return;
      }

      setReviewLoading(true);

      try {
        const { data, error } = await supabase
          .from('progress')
          .select(
            'id,mode,correct,last_attempt,word:word_id(id,japanese,hiragana,katakana,romaji,translation)'
          )
          .eq('user_id', user.id)
          .order('last_attempt', { ascending: false })
          .limit(6);

        if (error) throw error;

        const items = (data ?? []).map((row) => {
          const word = row.word ?? {};
          const wordLabel = word.japanese || word.hiragana || word.katakana || word.romaji || word.translation || '—';
          const translation = word.translation || word.romaji || word.japanese || word.hiragana || word.katakana || '';

          return {
            id: row.id,
            thumbnail: '🀄',
            word: wordLabel,
            translation,
            correct: Boolean(row.correct),
            mode: row.mode,
          };
        });

        if (isMounted) {
          setReviewItems(items);
        }
      } catch (error) {
        console.warn('No se pudo cargar el historial desde Supabase:', error?.message ?? error);
        if (isMounted) {
          setReviewItems([]);
        }
      } finally {
        if (isMounted) {
          setReviewLoading(false);
        }
      }
    };

    loadReviewItems();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const sessionStats = {
    streak,
    questionNumber: deck.length ? index + 1 : 0,
    totalQuestions: deck.length,
    score,
    progress: deck.length ? ((index + 1) / deck.length) * 100 : 0,
  };

  const modeCards = [
    {
      id: 'recognize',
      label: 'Reconocer',
      crown: true,
      active: mode === 'recognize',
      description: 'Kana / Kanji → Lectura (hiragana o katakana)',
    },
    {
      id: 'translate',
      label: 'Traducir',
      crown: false,
      active: mode === 'translate',
      description: 'Español → palabra japonesa',
    },
  ];

  const promptIsJapanese = containsJapaneseScript(currentQuestion?.prompt ?? '');
  const promptSizeClass = promptIsJapanese ? 'text-[6.25rem] sm:text-[7.5rem]' : 'text-[2.4rem] sm:text-[3.2rem]';

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setIndex(0);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (canAdvance) {
      return;
    }

    const normalizedAnswer = normalize(answer);
    const acceptedAnswers = getAcceptedAnswers(currentQuestion?.answers ?? [], mode);
    const isCorrect = acceptedAnswers.some((item) => item && normalize(item) === normalizedAnswer);

    if (currentQuestion?.wordId) {
      const modeLabel = getModeLabel(mode);
      const translation = currentQuestion?.answers?.[0] ?? '';

      setReviewItems((items) => {
        const next = [
          {
            id: `${currentQuestion.wordId}-${mode}-${Date.now()}`,
            thumbnail: '🀄',
            word: currentQuestion?.prompt ?? '—',
            translation,
            correct: isCorrect,
            mode,
            modeLabel,
          },
          ...items.filter((item) => item.word !== currentQuestion?.prompt || item.mode !== mode),
        ];

        return next.slice(0, 6);
      });
    }

    if (user?.id && currentQuestion?.wordId) {
      const payload = {
        user_id: user.id,
        word_id: currentQuestion.wordId,
        mode,
        correct: isCorrect,
        attempts: 1,
        mastery_level: isCorrect ? 1 : 0,
        last_attempt: new Date().toISOString(),
      };

      const { data: existing, error: fetchError } = await supabase
        .from('progress')
        .select('attempts,mastery_level')
        .eq('user_id', user.id)
        .eq('word_id', currentQuestion.wordId)
        .eq('mode', mode)
        .maybeSingle();

      if (fetchError) {
        console.warn('No se pudo leer progreso:', fetchError.message);
      }

      const attempts = (existing?.attempts ?? 0) + 1;
      const masteryLevel = isCorrect ? (existing?.mastery_level ?? 0) + 1 : existing?.mastery_level ?? 0;

      const { error: upsertError } = await supabase
        .from('progress')
        .upsert({
          ...payload,
          attempts,
          mastery_level: masteryLevel,
        }, {
          onConflict: 'user_id,word_id,mode',
        });

      if (upsertError) {
        console.warn('No se pudo guardar progreso:', upsertError.message);
      }

      if (isCorrect) {
        const { error: awardError } = await supabase
          .from('word_experience_awards')
          .upsert(
            {
              user_id: user.id,
              word_id: currentQuestion.wordId,
            },
            {
              onConflict: 'user_id,word_id',
              ignoreDuplicates: true,
            },
          );

        if (awardError) {
          console.warn('No se pudo registrar la experiencia de la palabra:', awardError.message);
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username,level,experience')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          console.warn('No se pudo refrescar el perfil:', profileError.message);
        } else if (profileData) {
          window.dispatchEvent(
            new CustomEvent('kanaquest-profile-updated', {
              detail: profileData,
            }),
          );

          setRankingProfiles((players) =>
            players.map((player) =>
              player.user_id === user.id
                ? {
                    ...player,
                    ...profileData,
                  }
                : player,
            ),
          );
        }
      }
    }

    if (isCorrect) {
      setFeedback({ tone: 'success', message: 'Correcto. Sigue con la siguiente pregunta.' });
      setScore((value) => value + 50);
      setStreak((value) => value + 1);
      setCanAdvance(true);
      return;
    }

    setFeedback({ tone: 'error', message: 'Respuesta incorrecta. Revisa la lectura.' });
    setStreak(0);
    setCanAdvance(false);
  };

  const handleNext = () => {
    if (!deck.length) return;
    setIndex((value) => (value + 1) % deck.length);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  const handlePrev = () => {
    if (!deck.length) return;
    setIndex((value) => (value - 1 + deck.length) % deck.length);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  return (
    <section className="grid gap-3 lg:grid-cols-[250px_minmax(0,1fr)_320px] lg:gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <aside className="rounded-[1.6rem] bg-[rgb(var(--color-accent))] p-3 text-white shadow-[0_16px_34px_rgba(128,43,56,0.18)] lg:p-4">
        <div className="px-2 pt-1">
          <h2 className="text-[1.35rem] font-semibold tracking-tight">Repaso</h2>
          <p className="mt-1 text-xs text-white/80">Últimas preguntas</p>
        </div>

        <div className="mt-3 grid gap-2.5">
          {reviewLoading ? (
            <div className="rounded-2xl bg-white px-3 py-4 text-center text-xs text-[rgb(var(--color-neutral))]/70 shadow-sm">
              Cargando historial...
            </div>
          ) : null}

          {!reviewLoading && reviewItems.length === 0 ? (
            <div className="rounded-2xl bg-white px-3 py-4 text-center text-xs text-[rgb(var(--color-neutral))]/70 shadow-sm">
              Aun no hay respuestas registradas.
            </div>
          ) : null}

          {!reviewLoading
            ? reviewItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-[rgb(var(--color-neutral))] shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f6eadf] text-xl shadow-inner">
                    {item.thumbnail}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[1rem] font-semibold leading-none text-[rgb(var(--color-accent))]">{item.word}</div>
                    <div className="mt-1 text-xs text-[rgb(var(--color-neutral))]/75">
                      {item.mode ? getModeLabel(item.mode) : item.translation}
                    </div>
                  </div>
                  <div
                    className={[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                      item.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600',
                    ].join(' ')}
                  >
                    {item.correct ? '✓' : '✕'}
                  </div>
                </div>
              ))
            : null}
        </div>

        <Link
          to="/historial"
          className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Ver todos
        </Link>
      </aside>

      <div className="flex flex-col gap-2">
        <SessionProgressCard
          streak={sessionStats.streak}
          questionNumber={sessionStats.questionNumber}
          totalQuestions={sessionStats.totalQuestions}
          score={sessionStats.score}
          progress={sessionStats.progress}
          className="mb-0"
        />

        <section className="rounded-[1.6rem] border border-[#eaded6] bg-white p-4 shadow-[0_14px_32px_rgba(128,43,56,0.08)] sm:p-5 lg:p-5">
          {loading ? <p className="mb-4 text-center text-sm text-[rgb(var(--color-neutral))]/70">Cargando palabras desde Supabase...</p> : null}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px] xl:items-center">
            <div className="flex items-start justify-center xl:justify-start">
              <div className={[
                'pt-2 font-semibold leading-none text-[rgb(var(--color-accent))] sm:pt-3',
                promptSizeClass,
                promptIsJapanese ? 'font-jp' : '',
              ].join(' ')}>
                {currentQuestion?.prompt ?? '...'}
              </div>
            </div>

            <div className="flex justify-center xl:justify-end">
              <CatIllustration />
            </div>
          </div>

          <form className="mx-auto mt-3 max-w-2xl" onSubmit={handleSubmit}>
            <p className="text-center text-base font-semibold text-[rgb(var(--color-neutral))] sm:text-lg">{currentQuestion?.instruction ?? 'Escribe la respuesta:'}</p>

            <div className="relative mt-2.5">
              <input
                className="w-full rounded-[1.1rem] border border-[rgba(128,43,56,0.22)] bg-[#fffdfb] px-4 py-3.5 pr-14 text-base text-[rgb(var(--color-neutral))] outline-none transition placeholder:text-[rgb(var(--color-neutral))]/35 focus:border-[rgb(var(--color-accent))] focus:ring-2 focus:ring-[rgba(128,43,56,0.12)] sm:px-5 sm:py-4 sm:text-lg"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Escribe aquí..."
                autoComplete="off"
              />

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f6e7e0] sm:h-10 sm:w-10">
                  <KeyboardIcon />
                </div>
              </div>
            </div>

            {feedback ? (
              <p className={['mt-3 text-center text-sm font-medium', feedback.tone === 'success' ? 'text-emerald-700' : 'text-red-600'].join(' ')}>{feedback.message}</p>
            ) : null}

            <div className="mt-4 flex justify-center sm:mt-5">
              <button
                type="submit"
                className="inline-flex min-w-32 items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(128,43,56,0.18)] transition hover:bg-[rgb(var(--color-accent-dark))] sm:min-w-36 sm:px-6 sm:py-3"
              >
                Verificar
              </button>
            </div>
          </form>
        </section>

        <div className="grid grid-cols-2 gap-3 px-1 sm:gap-4">
          <button type="button" onClick={handlePrev} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.28)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0] sm:px-5 sm:py-3">
            <span aria-hidden="true">←</span>
            Atrás
          </button>
          <button type="button" onClick={handleNext} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.28)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0] sm:px-5 sm:py-3">
            Siguiente
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <aside className="grid gap-3">
        <section className="rounded-[1.3rem] border border-[#eaded6] bg-white p-3.5 shadow-[0_12px_30px_rgba(128,43,56,0.08)] sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[rgb(var(--color-accent))] sm:text-lg">Ranking de usuarios</h3>
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4">
            {rankingLoading ? (
              <div className="rounded-2xl border border-[#f0e2db] bg-[#fffdfb] px-3 py-3 text-sm text-[rgb(var(--color-neutral))]/70">Cargando ranking...</div>
            ) : null}

            {!rankingLoading && rankingProfiles.length === 0 ? (
              <div className="rounded-2xl border border-[#f0e2db] bg-[#fffdfb] px-3 py-3 text-sm text-[rgb(var(--color-neutral))]/70">Todavía no hay usuarios para mostrar.</div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.08fr_1fr] lg:items-end lg:gap-3">
              {podiumRanking[1] ? (
                <div className="order-2 flex min-h-[12.2rem] flex-col items-center justify-between gap-2 rounded-[1.15rem] border border-[#eaded6] bg-[#fff8f4] px-3 py-3 shadow-[0_8px_20px_rgba(128,43,56,0.06)] lg:order-1 lg:translate-y-1">
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#dce9f4] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#46688e]">
                    <span aria-hidden="true">🥈</span>
                    2do
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#5d95c7] to-[#2f5375] text-base font-semibold text-white shadow-sm ring-4 ring-[#eef5fb]">
                    {(podiumRanking[1]?.username || podiumRanking[1]?.name || 'Usuario').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="w-full rounded-2xl bg-white/80 px-2 py-1.5 text-center shadow-[0_4px_12px_rgba(128,43,56,0.04)]">
                    <div className="truncate text-[0.92rem] font-semibold text-[rgb(var(--color-neutral))]">
                      {podiumRanking[1]?.username || podiumRanking[1]?.name || 'Usuario'}
                    </div>
                    <div className="text-[11px] text-[rgb(var(--color-neutral))]/60">{podiumRanking[1]?.experience ?? podiumRanking[1]?.xp ?? 0} XP</div>
                  </div>
                </div>
              ) : <div className="hidden lg:block" />}

              {podiumRanking[0] ? (
                <div className="order-1 flex min-h-[13.6rem] flex-col items-center justify-between gap-2 rounded-[1.15rem] border border-[#eaded6] bg-[#fff3ed] px-4 py-4 shadow-[0_12px_24px_rgba(128,43,56,0.1)] lg:order-2 lg:-translate-y-1 lg:scale-[1.03] lg:origin-bottom">
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#ffe5a1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9d6d1d]">
                    <span aria-hidden="true">👑</span>
                    1ro
                  </div>
                  <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d95f76] to-[#8b2d3f] text-lg font-semibold text-white shadow-sm ring-4 ring-white sm:h-[5rem] sm:w-[5rem]">
                    {(podiumRanking[0]?.username || podiumRanking[0]?.name || 'Usuario').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="w-full rounded-2xl bg-white/85 px-3 py-1.5 text-center shadow-[0_4px_12px_rgba(128,43,56,0.05)]">
                    <div className="truncate text-[0.95rem] font-semibold text-[rgb(var(--color-neutral))]">
                      {podiumRanking[0]?.username || podiumRanking[0]?.name || 'Usuario'}
                    </div>
                    <div className="text-[11px] text-[rgb(var(--color-neutral))]/60">{podiumRanking[0]?.experience ?? podiumRanking[0]?.xp ?? 0} XP</div>
                  </div>
                </div>
              ) : <div className="hidden lg:block" />}

              {podiumRanking[2] ? (
                <div className="order-3 flex min-h-[12.2rem] flex-col items-center justify-between gap-2 rounded-[1.15rem] border border-[#eaded6] bg-[#fff8f4] px-3 py-3 shadow-[0_8px_20px_rgba(128,43,56,0.06)] lg:translate-y-1">
                  <div className="inline-flex items-center gap-1 rounded-full bg-[#efd4c8] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#8c5348]">
                    <span aria-hidden="true">🥉</span>
                    3ro
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#c97b8a] to-[#7f4f63] text-base font-semibold text-white shadow-sm ring-4 ring-[#f8eded]">
                    {(podiumRanking[2]?.username || podiumRanking[2]?.name || 'Usuario').slice(0, 1).toUpperCase()}
                  </div>
                  <div className="w-full rounded-2xl bg-white/80 px-2 py-1.5 text-center shadow-[0_4px_12px_rgba(128,43,56,0.04)]">
                    <div className="truncate text-[0.92rem] font-semibold text-[rgb(var(--color-neutral))]">
                      {podiumRanking[2]?.username || podiumRanking[2]?.name || 'Usuario'}
                    </div>
                    <div className="text-[11px] text-[rgb(var(--color-neutral))]/60">{podiumRanking[2]?.experience ?? podiumRanking[2]?.xp ?? 0} XP</div>
                  </div>
                </div>
              ) : <div className="hidden lg:block" />}
            </div>

            {listRanking.length ? (
              <div className="mt-2 border-t border-[#f0e2db] pt-4 space-y-2">
                {listRanking.map((player, indexRanking) => {
                  const isCurrentUser = user?.id && player.user_id === user.id;
                  const displayName = player.username || player.name || 'Usuario';
                  const initials = displayName.slice(0, 1).toUpperCase();
                  const xp = player.experience ?? player.xp ?? 0;

                  return (
                    <div
                      key={player.user_id ?? player.name ?? displayName}
                      className={[
                        'flex items-center gap-2.5 rounded-2xl border px-3 py-2.5',
                        isCurrentUser ? 'border-[rgba(128,43,56,0.28)] bg-[#fdf3ef]' : 'border-[#f0e2db] bg-[#fffdfb]'
                      ].join(' ')}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-accent))] text-xs font-bold text-white shadow-sm">
                        {indexRanking + 4}
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d95f76] to-[#8b2d3f] text-sm font-semibold text-white shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={['truncate text-sm font-semibold text-[rgb(var(--color-neutral))]', containsJapaneseScript(displayName) ? 'font-jp' : ''].join(' ')}>
                          {indexRanking + 4}. {displayName}
                          {isCurrentUser ? ' (Tú)' : ''}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-neutral))]/65">
                          Nivel {player.level ?? 1}
                          {isCurrentUser ? ' · actual' : ''}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[rgb(var(--color-neutral))]">{xp} XP</div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setRankingModalOpen(true)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-accent))] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-accent-dark))] sm:mt-4 sm:py-3"
          >
            Ver ranking completo
          </button>
        </section>

        <section className="rounded-[1.3rem] border border-[#eaded6] bg-[#fbefe8] p-3.5 shadow-[0_12px_30px_rgba(128,43,56,0.08)] sm:p-4">
          <h3 className="text-base font-semibold text-[rgb(var(--color-accent))] sm:text-lg">Modo de juego</h3>

          <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3">
            {modeCards.map((mode) => (
              <div
                key={mode.id}
                className={[
                  'rounded-2xl border p-3.5 sm:p-4',
                  mode.active ? 'border-transparent bg-[rgb(var(--color-accent))] text-white shadow-md' : 'border-[#eaded6] bg-white text-[rgb(var(--color-neutral))]',
                ].join(' ')}
                role="button"
                tabIndex={0}
                onClick={() => handleModeChange(mode.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleModeChange(mode.id);
                  }
                }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>{mode.label}</span>
                  {mode.crown ? <span aria-hidden="true">👑</span> : null}
                </div>
                <p className={['mt-1 text-xs sm:text-sm', mode.active ? 'text-white/80' : 'text-[rgb(var(--color-neutral))]/70'].join(' ')}>{mode.description}</p>
              </div>
            ))}
          </div>

          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(128,43,56,0.22)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-sm transition hover:bg-[#fcf4f0] sm:mt-4 sm:py-3">
            <span aria-hidden="true">⚙</span>
            Configuración del modo
          </button>
        </section>
      </aside>

      {rankingModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(53,18,25,0.45)] px-4 py-6 backdrop-blur-sm"
          onClick={() => setRankingModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Top 10 del ranking"
            className="w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-[#eaded6] bg-white shadow-[0_24px_60px_rgba(53,18,25,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#f0e2db] px-4 py-4 sm:px-6">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-accent))] sm:text-xl">Top 10 del ranking</h3>
                <p className="mt-1 text-sm text-[rgb(var(--color-neutral))]/60">Podio arriba y lista completa dentro del modal.</p>
              </div>
              <button
                type="button"
                onClick={() => setRankingModalOpen(false)}
                className="rounded-full px-3 py-2 text-sm font-semibold text-[rgb(var(--color-accent))] transition hover:bg-[#f9efea]"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-6">
              <div className="space-y-3">
                {modalRanking.map((player, indexRanking) => {
                  const isCurrentUser = user?.id && player.user_id === user.id;
                  const displayName = player.username || player.name || 'Usuario';
                  const initials = displayName.slice(0, 1).toUpperCase();
                  const xp = player.experience ?? player.xp ?? 0;

                  return (
                    <div
                      key={`modal-${player.user_id ?? player.name ?? displayName}`}
                      className={[
                        'flex items-center gap-3 rounded-2xl border px-3 py-3 sm:px-4',
                        isCurrentUser ? 'border-[rgba(128,43,56,0.28)] bg-[#fdf3ef]' : 'border-[#f0e2db] bg-[#fffdfb]'
                      ].join(' ')}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-accent))] text-sm font-bold text-white shadow-sm">
                        #{indexRanking + 1}
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#d95f76] to-[#8b2d3f] text-sm font-semibold text-white shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={['truncate text-sm font-semibold text-[rgb(var(--color-neutral))]', containsJapaneseScript(displayName) ? 'font-jp' : ''].join(' ')}>
                          {displayName}
                          {isCurrentUser ? ' (Tú)' : ''}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-neutral))]/65">
                          Nivel {player.level ?? 1}
                          {isCurrentUser ? ' · actual' : ''}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[rgb(var(--color-neutral))]">{xp} XP</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
