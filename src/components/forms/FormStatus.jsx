const tones = {
  default: 'text-cream',
  success: 'text-emerald-300',
  error: 'text-red-300',
};

export default function FormStatus({ children, className = '', tone = 'default' }) {
  if (!children) {
    return null;
  }

  return <p className={['text-sm', tones[tone] ?? tones.default, className].join(' ')}>{children}</p>;
}
