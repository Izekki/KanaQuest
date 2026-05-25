export default function TextField({ className = '', ...props }) {
  return (
    <input
      className={[
        'rounded-2xl border border-cream/10 bg-background px-4 py-3 text-neutral outline-none transition-colors placeholder:text-neutral/40 focus:border-accent',
        className,
      ].join(' ')}
      {...props}
    />
  );
}
