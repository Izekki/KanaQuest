import { useMemo, useState } from 'react';
import GameModeTabs from '../../components/gameplay/GameModeTabs';
import PracticeCard from '../../components/gameplay/PracticeCard';
import SessionSidebar from '../../components/gameplay/SessionSidebar';
import ReviewPanel from '../../components/history/ReviewPanel';

const gameDeck = {
  recognize: [
    { prompt: '猫', answers: ['ねこ', 'neko'], instruction: 'Escribe la lectura en hiragana.' },
    { prompt: '水', answers: ['みず', 'mizu'], instruction: 'Escribe la lectura en hiragana.' },
    { prompt: '花', answers: ['はな', 'hana'], instruction: 'Escribe la lectura en hiragana.' },
  ],
  translate: [
    { prompt: 'ねこ', answers: ['gato'], instruction: 'Escribe el significado en español.' },
    { prompt: 'りんご', answers: ['manzana'], instruction: 'Escribe el significado en español.' },
    { prompt: 'みず', answers: ['agua'], instruction: 'Escribe el significado en español.' },
  ],
};

const modeLabels = {
  recognize: 'Reconocer',
  translate: 'Traducir',
};

const normalize = (value) => value.trim().toLowerCase().normalize('NFKC');

export default function GamePage() {
  const [mode, setMode] = useState('recognize');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);

  const deck = useMemo(() => gameDeck[mode], [mode]);
  const current = deck[index];

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setIndex(0);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (canAdvance) {
      return;
    }

    const normalizedAnswer = normalize(answer);
    const isCorrect = current.answers.some((item) => normalize(item) === normalizedAnswer);

    if (isCorrect) {
      setFeedback({ tone: 'success', message: 'Correcto. Presiona Siguiente para continuar.' });
      setScore((prev) => prev + 50);
      setStreak((prev) => prev + 1);
      setCanAdvance(true);
      return;
    }

    setFeedback({ tone: 'error', message: 'Respuesta incorrecta. Intenta de nuevo.' });
    setStreak(0);
  };

  const handleNext = () => {
    const nextIndex = (index + 1) % deck.length;
    setIndex(nextIndex);
    setAnswer('');
    setFeedback(null);
    setCanAdvance(false);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr_0.9fr]">
      <ReviewPanel />
      <div className="grid gap-6">
        <div className="grid gap-4 rounded-3xl border border-cream/10 bg-surface/70 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral/70">
            <span>Racha: {streak}</span>
            <span>
              Pregunta {index + 1} de {deck.length}
            </span>
            <span>Puntuación: {score} XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${((index + 1) / deck.length) * 100}%` }}
            />
          </div>
        </div>

        <PracticeCard
          modeLabel={modeLabels[mode]}
          prompt={current.prompt}
          instruction={current.instruction}
          answerValue={answer}
          onAnswerChange={(event) => setAnswer(event.target.value)}
          onSubmit={handleSubmit}
          onNext={handleNext}
          canAdvance={canAdvance}
          feedback={feedback}
          questionNumber={index + 1}
          totalQuestions={deck.length}
        />
      </div>

      <div className="grid gap-6">
        <GameModeTabs value={mode} onChange={handleModeChange} />
        <SessionSidebar />
      </div>
    </section>
  );
}
