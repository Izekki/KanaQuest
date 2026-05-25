export default function HomePage() {
  return (
    <section className="rounded-3xl border border-cream/10 bg-surface p-8 shadow-2xl shadow-black/20">
      <p className="text-sm uppercase tracking-[0.35em] text-cream/70">Home</p>
      <h1 className="mt-4 text-3xl font-semibold text-neutral md:text-5xl">
        Learn Japanese through focused gameplay.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-neutral/80 md:text-lg">
        This landing page will introduce the learning modes, progress tracking, and daily review
        flow.
      </p>
    </section>
  );
}
