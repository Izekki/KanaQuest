export default function Card({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={['rounded-[1.75rem] border border-[#eaded6] bg-white p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]', className].join(' ')}>
      {eyebrow ? <p className="text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">{eyebrow}</p> : null}
      {title ? <h1 className="mt-4 text-3xl font-semibold text-[rgb(var(--color-accent))] md:text-5xl">{title}</h1> : null}
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-[rgb(var(--color-neutral))]/75 md:text-lg">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
