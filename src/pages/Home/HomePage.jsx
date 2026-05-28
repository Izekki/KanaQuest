export default function HomePage() {
  return (
    <section className="rounded-[1.75rem] border border-[#eaded6] bg-white p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
      <p className="text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">Home</p>
      <h1 className="mt-4 text-3xl font-semibold text-[rgb(var(--color-accent))] md:text-5xl">
        Learn Japanese through focused gameplay.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[rgb(var(--color-neutral))]/75 md:text-lg">
        This landing page will introduce the learning modes, progress tracking, and daily review
        flow.
      </p>
    </section>
  );
}
