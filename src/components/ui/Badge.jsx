const variants = {
  solid: 'bg-accent text-white',
  subtle: 'bg-[#f7ebe5] text-[rgb(var(--color-accent))]',
  outline: 'border border-[rgba(128,43,56,0.2)] text-[rgb(var(--color-accent))]',
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
