import LoginForm from '../../components/auth/LoginForm';
import Badge from '../../components/ui/Badge';
import { useAuthSession } from '../../hooks/useAuthSession';

export default function LoginPage() {
  const { user, loading } = useAuthSession();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <LoginForm />
      <section className="rounded-3xl border border-cream/10 bg-surfaceAlt p-8 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.35em] text-cream/70">Session</p>
        <h2 className="mt-4 text-2xl font-semibold text-neutral">Current auth state</h2>
        <div className="mt-4 grid gap-3 text-sm text-neutral/80">
          <div className="rounded-2xl bg-black/10 p-4">
            Status: <Badge variant="subtle">{loading ? 'Loading' : user ? 'Signed in' : 'Signed out'}</Badge>
          </div>
          <div className="rounded-2xl bg-black/10 p-4">
            User: {user?.email ?? 'No user session yet'}
          </div>
        </div>
      </section>
    </div>
  );
}
