import Button from '../ui/Button';
import Card from '../ui/Card';

const reviewItems = [
  { id: 1, word: 'ねこ', translation: 'gato', status: 'correct' },
  { id: 2, word: 'がっこう', translation: 'escuela', status: 'correct' },
  { id: 3, word: 'りんご', translation: 'manzana', status: 'wrong' },
  { id: 4, word: 'みず', translation: 'agua', status: 'correct' },
  { id: 5, word: 'はな', translation: 'flor', status: 'wrong' },
];

const statusStyles = {
  correct: 'bg-emerald-400/20 text-emerald-200',
  wrong: 'bg-red-400/20 text-red-200',
};

export default function ReviewPanel() {
  return (
    <Card eyebrow="Repaso" title="Últimas preguntas" description="Refuerza lo que ya practicaste.">
      <div className="grid gap-3">
        {reviewItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-black/10 p-4">
            <div>
              <div className="text-lg font-semibold text-neutral">{item.word}</div>
              <div className="text-sm text-neutral/70">{item.translation}</div>
            </div>
            <span className={['rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', statusStyles[item.status]].join(' ')}>
              {item.status === 'correct' ? 'Bien' : 'Error'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="ghost" className="w-full justify-center">
          Ver todos
        </Button>
      </div>
    </Card>
  );
}
