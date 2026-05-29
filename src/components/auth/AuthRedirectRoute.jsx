import { Navigate } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';

export default function AuthRedirectRoute({ children, redirectTo = '/game' }) {
  const { user, loading } = useAuthSession();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-neutral">
        <div className="rounded-3xl border border-cream/10 bg-surface px-6 py-4 text-sm text-neutral/80 shadow-2xl shadow-black/20">
          Checking session...
        </div>
      </main>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
