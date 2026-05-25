export default function Card({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={['rounded-3xl border border-cream/10 bg-surface p-8 shadow-2xl shadow-black/20', className].join(' ')}>
      {eyebrow ? <p className="text-sm uppercase tracking-[0.35em] text-cream/70">{eyebrow}</p> : null}
      {title ? <h1 className="mt-4 text-3xl font-semibold text-neutral md:text-5xl">{title}</h1> : null}
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-neutral/80 md:text-lg">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
