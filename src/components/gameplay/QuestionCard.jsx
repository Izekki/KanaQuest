import Badge from '../ui/Badge';
import Card from '../ui/Card';

export default function QuestionCard({ modeLabel, prompt, answer, hint }) {
  return (
    <Card eyebrow="Current prompt" title={prompt} description={hint}>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="solid">{modeLabel}</Badge>
        <Badge variant="outline">Target answer: {answer}</Badge>
      </div>
    </Card>
  );
}
