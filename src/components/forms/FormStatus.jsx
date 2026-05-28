const tones = {
  default: 'text-[rgb(var(--color-accent))]',
  success: 'text-emerald-700',
  error: 'text-red-600',
};

export default function FormStatus({ children, className = '', tone = 'default' }) {
  if (!children) {
    return null;
  }

  return <p className={['text-sm', tones[tone] ?? tones.default, className].join(' ')}>{children}</p>;
}
