import Badge from '../ui/Badge';
import Card from '../ui/Card';

const reviewItems = [
  { word: '猫', reading: 'ねこ', priority: 'High' },
  { word: '水', reading: 'みず', priority: 'Medium' },
  { word: 'りんご', reading: 'ringo', priority: 'Low' },
];

export default function SessionSidebar() {
  return (
    <div className="grid gap-6">
      <Card eyebrow="Session" title="Today’s progress" description="Track the current learning state while you play.">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-black/10 p-4">
            <div className="text-sm text-neutral/70">Score</div>
            <div className="mt-2 text-2xl font-semibold text-neutral">120</div>
          </div>
          <div className="rounded-2xl bg-black/10 p-4">
            <div className="text-sm text-neutral/70">Correct</div>
            <div className="mt-2 text-2xl font-semibold text-neutral">8</div>
          </div>
          <div className="rounded-2xl bg-black/10 p-4">
            <div className="text-sm text-neutral/70">Streak</div>
            <div className="mt-2 text-2xl font-semibold text-neutral">4</div>
          </div>
        </div>
      </Card>

      <Card eyebrow="Review" title="Queue" description="Words that need attention will be surfaced here.">
        <div className="grid gap-3">
          {reviewItems.map((item) => (
            <div key={item.word} className="rounded-2xl border border-cream/10 bg-black/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-neutral">{item.word}</div>
                  <div className="text-sm text-neutral/70">{item.reading}</div>
                </div>
                <Badge variant="subtle">{item.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
