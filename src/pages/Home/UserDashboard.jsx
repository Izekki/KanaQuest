import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserProfile, fetchUserProgress } from '../../services/supabase/progress';
import { getSignedAvatarUrl } from '../../services/supabase/storage';
import avatarRimuruRedPink from '../../img/avatar_rimuru_version_red-pink.svg';

const getStreakStorageKey = (userId) => `kanaquest-streak:${userId}`;

export default function UserDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [streak, setStreak] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [learnedCount, setLearnedCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const resolveAvatarUrl = async (storedAvatar) => {
    if (!storedAvatar) return '';
    if (storedAvatar.startsWith('http://') || storedAvatar.startsWith('https://') || storedAvatar.startsWith('blob:')) {
      return storedAvatar;
    }
    try {
      const fn = await getSignedAvatarUrl(storedAvatar, 60);
      return fn?.data?.signedUrl ?? '';
    } catch (err) {
      console.warn('No se pudo resolver el avatar en dashboard:', err);
      return '';
    }
  };

  // Load User Stats & Profile from Supabase
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!user?.id) {
        if (isMounted) setLoadingStats(false);
        return;
      }

      try {
        const [profileRes, progressRes] = await Promise.all([
          fetchUserProfile(user.id),
          fetchUserProgress(user.id),
        ]);

        if (isMounted) {
          if (profileRes.data) {
            setProfile(profileRes.data);
            if (profileRes.data.avatar_url) {
              resolveAvatarUrl(profileRes.data.avatar_url).then((url) => {
                if (isMounted) setAvatarUrl(url);
              });
            }
          }
          if (progressRes.data) {
            const rows = progressRes.data;
            setProgressCount(rows.length);
            const learned = rows.filter((r) => r.correct || (r.mastery_level ?? 0) >= 1).length;
            setLearnedCount(learned);
          }
        }
      } catch (err) {
        console.warn('Error al cargar datos del dashboard:', err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Sync Streak with Session Storage
  useEffect(() => {
    if (!user?.id) {
      setStreak(0);
      return;
    }
    const saved = Number(sessionStorage.getItem(getStreakStorageKey(user.id)) ?? 0);
    setStreak(Number.isFinite(saved) ? saved : 0);
  }, [user?.id]);

  const username = profile?.username || user?.user_metadata?.username || 'Viajero';
  const experience = profile?.experience ?? 0;
  const level = profile?.level ?? 1;

  // Level progress calculation (100 XP per level)
  const currentLevelProgress = experience % 100;
  const xpNeededNext = 100 - currentLevelProgress;

  const secondaryModes = [
    {
      id: 'translate',
      title: 'Traducir',
      badge: '翻訳',
      badgeColor: 'bg-[#fff6e6] text-[#9c6615] border-[#fae2be]',
      description: 'Español → Escribe en caracteres japoneses.',
      to: '/aprender',
    },
    {
      id: 'pair_match',
      title: 'Par-Parejas',
      badge: '🎴',
      badgeColor: 'bg-[#eef3fb] text-[#2c5282] border-[#d2e1f5]',
      description: 'Juego de memoria: empareja caracteres y significados.',
      to: '/par-parejas',
    },
    {
      id: 'sentence_builder',
      title: 'Constructor de Oraciones',
      badge: '⛩️',
      badgeColor: 'bg-[#eef8f2] text-[#22633e] border-[#cfe9d8]',
      description: 'Arrastra y ordena fichas para formar frases reales.',
      to: '/constructor',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-2">
      {/* 2-COLUMN DASHBOARD LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Study Flow (col-span-7 / 8) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          
          {/* Main Action Banner: Active Mode ("Continuar lección") */}
          <div className="rounded-[1.6rem] border border-[#e3b8b1] bg-gradient-to-r from-[#fff9f6] via-[#fffdfc] to-[#fbf0ec] p-5 sm:p-7 shadow-[0_10px_28px_rgba(107,40,50,0.06)] flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#6b2832] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs">
                <span>✦</span>
                <span>Continuar lección</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#6b2832] tracking-tight">
                Reconocimiento de Kana & Kanji
              </h2>

              <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/80 leading-relaxed max-w-xl">
                Entrena la lectura e identificación rápida de kanji y vocabulario con retroalimentación instantánea para afianzar tu memoria.
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between gap-3">
              <Link
                to="/aprender"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b2832] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-[#581f27] hover:-translate-y-0.5 active:scale-98"
              >
                <span>Comenzar ronda</span>
                <span aria-hidden="true">→</span>
              </Link>
              <span className="text-[11px] font-semibold text-[#6b2832]/70">
                +50 XP por acierto
              </span>
            </div>
          </div>

          {/* Subsection: Explore Other Practice Modes */}
          <div className="space-y-3">
            <div className="px-1">
              <h3 className="text-sm sm:text-base font-bold text-[#6b2832] tracking-tight">
                Explorar otros modos de práctica
              </h3>
              <p className="text-xs text-[rgb(var(--color-neutral))]/65">
                Diversifica tu entrenamiento con dinámicas complementarias:
              </p>
            </div>

            <div className="space-y-2.5">
              {secondaryModes.map((mode) => (
                <Link
                  key={mode.id}
                  to={mode.to}
                  className="group flex items-center justify-between gap-3.5 rounded-2xl border border-[#eaded6] bg-white p-3.5 sm:p-4 shadow-2xs transition-all duration-200 hover:border-[#dfc3be] hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={[
                        'flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border font-bold text-sm shadow-2xs font-jp transition-transform duration-200 group-hover:scale-105',
                        mode.badgeColor,
                      ].join(' ')}
                    >
                      {mode.badge}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#6b2832] group-hover:text-[#581f27] transition-colors truncate">
                        {mode.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[rgb(var(--color-neutral))]/70 truncate">
                        {mode.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-50/70 text-[#6b2832] transition-colors group-hover:bg-[#6b2832] group-hover:text-white shadow-2xs">
                    <span aria-hidden="true" className="text-xs font-bold transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: User Progress Sidebar (col-span-5 / 4) */}
        <aside className="lg:col-span-5 xl:col-span-4 rounded-[1.75rem] border border-[#eaded6] bg-white p-5 sm:p-6 shadow-[0_12px_32px_rgba(107,40,50,0.06)] space-y-4">
          
          {/* Header with Mascot & Greeting */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-[#f2e6df]">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fbeae5] border-2 border-[#e3b8b1] shadow-xs">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Avatar de ${username}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={avatarRimuruRedPink}
                  alt="Avatar Rimuru"
                  className="h-10 w-10 object-contain drop-shadow-[0_4px_8px_rgba(107,40,50,0.15)]"
                  loading="eager"
                />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#6b2832] truncate">
                ¡Hola de nuevo, {username}!
              </h3>
              <p className="text-xs text-[rgb(var(--color-neutral))]/65">
                Nivel {level} · Aprendiz activo
              </p>
            </div>
          </div>

          {/* Widget 1: Racha Activa */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#fffdfb] border border-[#f2e6df] shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xl select-none" aria-hidden="true">🔥</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-neutral))]/60">
                  Racha de Estudio
                </div>
                <div className="text-sm font-bold text-[#6b2832]">
                  {streak} {streak === 1 ? 'día activo' : 'días activos'}
                </div>
              </div>
            </div>
            <span className="rounded-full bg-[#faece9] px-2 py-0.5 text-[10px] font-bold text-[#6b2832]">
              {streak > 0 ? 'Activo' : 'Comienza'}
            </span>
          </div>

          {/* Widget 2: Nivel y Progreso de XP */}
          <div className="p-3.5 rounded-xl bg-[#fffdfb] border border-[#f2e6df] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#6b2832]">
                Nivel {level}
              </span>
              <span className="font-mono text-[11px] font-bold text-[rgb(var(--color-neutral))]/70">
                {experience} XP
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#faece9]">
              <div
                className="h-full rounded-full bg-[#6b2832] transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>

            <div className="text-[10px] text-[rgb(var(--color-neutral))]/60 text-right">
              +{xpNeededNext} XP para alcanzar el Nivel {level + 1}
            </div>
          </div>

          {/* Widget 3: Palabras Dominadas */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#fffdfb] border border-[#f2e6df] shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xl select-none" aria-hidden="true">📚</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-neutral))]/60">
                  Palabras Dominadas
                </div>
                <div className="text-sm font-bold text-emerald-800">
                  {loadingStats ? '—' : `${learnedCount} aprendidas`}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-[rgb(var(--color-neutral))]/60 font-medium">
              {progressCount} practicadas
            </span>
          </div>

          {/* Footer Action: History Link */}
          <div className="pt-2">
            <Link
              to="/vocabulary"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#6b2832]/30 bg-[#fffdfb] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#6b2832] shadow-2xs transition-all hover:bg-[#faece9] hover:border-[#6b2832]/50 active:scale-98"
            >
              <span>Ver vocabulario</span>
              <span aria-hidden="true">📖</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="rounded-2xl border border-[#eaded6] bg-white/70 backdrop-blur p-3.5 text-center text-xs text-[rgb(var(--color-neutral))]/70 shadow-2xs">
        © 2026 KanaQuest · Plataforma interactiva para el aprendizaje del idioma japonés ·{' '}
        <a
          href="https://github.com/Izekki/KanaQuest"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#6b2832] hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
