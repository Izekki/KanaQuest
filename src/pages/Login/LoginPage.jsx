import LoginForm from '../../components/auth/LoginForm';
import Badge from '../../components/ui/Badge';
import { useAuthSession } from '../../hooks/useAuthSession';

export default function LoginPage() {
  const { user, loading } = useAuthSession();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <LoginForm />
      <section className="rounded-[1.75rem] border border-[#eaded6] bg-[#fbefe8] p-8 shadow-[0_14px_34px_rgba(128,43,56,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[rgb(var(--color-accent))]/70">Session</p>
        <h2 className="mt-4 text-2xl font-semibold text-[rgb(var(--color-accent))]">Current auth state</h2>
        <div className="mt-4 grid gap-3 text-sm text-[rgb(var(--color-neutral))]/80">
          <div className="rounded-2xl bg-white p-4">
            Status: <Badge variant="subtle">{loading ? 'Loading' : user ? 'Signed in' : 'Signed out'}</Badge>
          </div>
          <div className="rounded-2xl bg-white p-4">
            User: {user?.email ?? 'No user session yet'}
          </div>
        </div>
      </section>
    </div>
  );
}
