const variants = {
  primary: 'bg-accent text-white hover:bg-accentDark',
  secondary: 'border border-[rgba(128,43,56,0.22)] bg-white text-[rgb(var(--color-accent))] hover:bg-[#fcf4f0]',
  ghost: 'bg-transparent text-[rgb(var(--color-accent))] hover:bg-[#f7ebe5]',
};

export default function Button({ as: Component = 'button', className = '', variant = 'primary', ...props }) {
  return (
    <Component
      className={[
        'inline-flex min-h-[44px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 active:scale-98',
        variants[variant] ?? variants.primary,
        className,
      ].join(' ')}
      {...props}
    />
  );
}
