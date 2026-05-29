export default function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = '',
}) {
  return (
    <label className={['grid gap-2 text-sm text-[rgb(var(--color-neutral))]/80', className].join(' ')} htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {error ? <span className="text-sm text-red-500">{error}</span> : null}
      {!error && hint ? <span className="text-sm text-[rgb(var(--color-neutral))]/55">{hint}</span> : null}
    </label>
  );
}
