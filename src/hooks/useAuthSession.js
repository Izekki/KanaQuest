import { useEffect, useState } from 'react';
import { getSession, onAuthStateChange } from '../services/supabase/auth';

export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      const { data, error } = await getSession();

      if (!mounted) {
        return;
      }

      if (!error) {
        setSession(data.session ?? null);
      }

      setLoading(false);
    };

    initializeSession();

    const { data: subscription } = onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
  };
}
