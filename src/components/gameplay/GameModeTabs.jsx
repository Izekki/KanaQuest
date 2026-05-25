const modes = [
  { id: 'recognize', label: 'Reconocer', description: 'Read the character or image' },
  { id: 'translate', label: 'Traducir', description: 'Translate the word to meaning' },
];

export default function GameModeTabs({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {modes.map((mode) => {
        const active = value === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={[
              'rounded-3xl border px-4 py-4 text-left transition-colors',
              active
                ? 'border-accent bg-accent/15 shadow-lg shadow-black/10'
                : 'border-cream/10 bg-black/10 hover:border-cream/20 hover:bg-cream/5',
            ].join(' ')}
          >
            <div className="text-sm uppercase tracking-[0.3em] text-cream/70">{mode.label}</div>
            <div className="mt-2 text-base font-semibold text-neutral">{mode.description}</div>
          </button>
        );
      })}
    </div>
  );
}
