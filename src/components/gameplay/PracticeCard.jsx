import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';

export default function PracticeCard({
  modeLabel,
  prompt,
  instruction,
  answerValue,
  onAnswerChange,
  onSubmit,
  onNext,
  canAdvance,
  feedback,
  questionNumber,
  totalQuestions,
}) {
  return (
    <Card
      eyebrow="Práctica"
      title={`Pregunta ${questionNumber} de ${totalQuestions}`}
      description={instruction}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="solid">{modeLabel}</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-3xl border border-cream/10 bg-black/10 p-6 sm:p-8 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-cream/60">Prompt</div>
          <div className="mt-3 sm:mt-4 text-5xl sm:text-6xl md:text-7xl font-semibold text-neutral break-words max-w-full">{prompt}</div>
        </div>

        <form className="grid gap-4" onSubmit={onSubmit}>
          <FormField label="Tu respuesta" htmlFor="practice-answer">
            <TextField
              id="practice-answer"
              name="answer"
              type="text"
              value={answerValue}
              onChange={onAnswerChange}
              placeholder="Escribe aquí..."
              autoComplete="off"
              disabled={canAdvance}
              required
              className="min-h-[44px]"
            />
          </FormField>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button type="submit" disabled={canAdvance} className="min-h-[44px] w-full sm:w-auto">
              Verificar
            </Button>
            {canAdvance ? (
              <Button type="button" variant="secondary" onClick={onNext} className="min-h-[44px] w-full sm:w-auto">
                Siguiente
              </Button>
            ) : null}
          </div>
          <FormStatus tone={feedback?.tone}>{feedback?.message}</FormStatus>
        </form>
      </div>
    </Card>
  );
}
