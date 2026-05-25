export default function ProfilePage() {
  return (
    <section className="rounded-3xl border border-cream/10 bg-surface p-8 shadow-2xl shadow-black/20">
      <p className="text-sm uppercase tracking-[0.35em] text-cream/70">Profile</p>
      <h1 className="mt-4 text-3xl font-semibold text-neutral md:text-5xl">Progress dashboard</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-neutral/80 md:text-lg">
        User stats, mastery, and session history will appear here.
      </p>
    </section>
  );
}
