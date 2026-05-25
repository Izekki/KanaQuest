const variants = {
  primary: 'bg-accent text-white hover:bg-accentDark',
  secondary: 'bg-surfaceAlt text-neutral hover:bg-surfaceAlt/80',
  ghost: 'bg-transparent text-neutral hover:bg-cream/10',
};

export default function Button({ as: Component = 'button', className = '', variant = 'primary', ...props }) {
  return (
    <Component
      className={[
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] ?? variants.primary,
        className,
      ].join(' ')}
      {...props}
    />
  );
}
