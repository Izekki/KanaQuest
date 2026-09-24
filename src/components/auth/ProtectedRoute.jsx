import { Navigate, useLocation } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthSession();
  const location = useLocation();

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-background px-6 text-neutral">
        <div className="rounded-2xl border border-[#eaded6] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-[#6b2832]/80 shadow-sm animate-pulse">
          Cargando entorno de estudio...
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

