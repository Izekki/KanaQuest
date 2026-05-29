export default function TextField({ className = '', ...props }) {
  return (
    <input
      className={[
        'rounded-2xl border border-[rgba(128,43,56,0.18)] bg-white px-4 py-3 text-[rgb(var(--color-neutral))] outline-none transition-colors placeholder:text-[rgb(var(--color-neutral))]/40 focus:border-accent focus:ring-2 focus:ring-[rgba(128,43,56,0.12)]',
        className,
      ].join(' ')}
      {...props}
    />
  );
}
