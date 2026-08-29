import React from 'react';
import { useAuthSession } from '../../hooks/useAuthSession';
import UserDashboard from './UserDashboard';
import PublicLanding from './PublicLanding';

export default function HomePage() {
  const { user, loading } = useAuthSession();

  if (loading) {
    return (
      <div className="flex min-h-[420px] w-full items-center justify-center py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-[#eaded6] bg-white px-6 py-4 shadow-sm text-sm font-semibold text-[#6b2832]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#6b2832] border-t-transparent" />
          <span>Cargando KanaQuest...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <UserDashboard user={user} />;
  }

  return <PublicLanding />;
}
