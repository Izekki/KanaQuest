import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthSession } from '../../hooks/useAuthSession';
import { fetchUserProfile } from '../../services/supabase/progress';

export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuthSession();
  const [role, setRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async () => {
      if (!user?.id) {
        if (isMounted) {
          setRole(null);
          setCheckingRole(false);
        }
        return;
      }

      try {
        const { data, error } = await fetchUserProfile(user.id);
        if (error) throw error;
        if (isMounted) {
          setRole(data?.role ?? 'player');
        }
      } catch (err) {
        console.warn('Error verificando rol de administrador:', err);
        if (isMounted) {
          setRole('player');
        }
      } finally {
        if (isMounted) {
          setCheckingRole(false);
        }
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading]);

  if (authLoading || checkingRole) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-[#eaded6] bg-white px-6 py-4 text-sm font-semibold text-[rgb(var(--color-accent))] shadow-lg">
          <svg className="animate-spin h-5 w-5 text-[rgb(var(--color-accent))]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Verificando permisos de administrador...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
