const variants = {
  solid: 'bg-accent text-white',
  subtle: 'bg-cream/10 text-cream',
  outline: 'border border-cream/20 text-neutral',
};

export default function Badge({ className = '', variant = 'solid', children, ...props }) {
  return (
    <span
      className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]', variants[variant] ?? variants.solid, className].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
