import React from 'react';
import Icon from '../ui/Icon';
import mascotTransparent from '../../img/mascot_pink_slime_transparent.png';

export default function ProfileIdentityHero({
  profile,
  avatarPreviewUrl,
  onOpenEditModal,
  onOpenTitlesModal,
}) {
  const username = profile?.username || 'Jugador';
  const experience = profile?.experience ?? 0;
  const level = profile?.level ?? Math.max(1, Math.floor(experience / 100) + 1);
  const title = profile?.title || 'Novato del Kanji';
  const role = profile?.role || 'player';

  // Level progress calculation (100 XP per level as defined in database.sql calculate_profile_level)
  const currentLevelXP = experience % 100;
  const xpRemaining = 100 - currentLevelXP;
  const nextLevel = level + 1;

  return (
    <section
      aria-label="Identidad del jugador"
      className="relative overflow-hidden rounded-2xl border border-[#eaded6] bg-white/90 p-5 sm:p-7 shadow-[0_6px_24px_rgba(107,40,50,0.04)] backdrop-blur-xs transition-shadow hover:shadow-[0_8px_28px_rgba(107,40,50,0.07)]"
    >
      {/* Subtle Japanese ornamental ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#f8dcd6]/40 to-transparent blur-2xl"
      />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Avatar + Identity Information */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          {/* Avatar (Large, prominent & high contrast) */}
          <div className="relative shrink-0">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-[#f4e6e0] shadow-sm overflow-hidden bg-[#fbeae5] flex items-center justify-center">
              {avatarPreviewUrl ? (
                <img
                  src={avatarPreviewUrl}
                  alt={`Avatar de ${username}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={mascotTransparent}
                  alt="Mascota KanaQuest"
                  className="h-4/5 w-4/5 object-contain drop-shadow-[0_4px_8px_rgba(107,40,50,0.18)]"
                />
              )}
            </div>

            {/* Quick edit avatar indicator */}
            <button
              type="button"
              onClick={onOpenEditModal}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#eaded6] bg-white text-[#6b2832] shadow-sm hover:bg-[#faf3f0] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Cambiar foto de perfil"
              aria-label="Cambiar foto de perfil"
            >
              <Icon name="pencil" className="w-3.5 h-3.5 text-[#6b2832]" />
            </button>
          </div>

          {/* User Details */}
          <div className="space-y-2 min-w-0">
            {/* Username & Role Tag */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#6b2832] tracking-tight truncate max-w-[280px] sm:max-w-md">
                {username}
              </h2>
              {role === 'admin' ? (
                <span className="rounded-full bg-[#6b2832] px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-2xs">
                  Admin
                </span>
              ) : null}
            </div>

            {/* Level & Equipped Title in a coherent gamified hierarchy */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="rounded-lg bg-[#f0e4de] px-2.5 py-1 text-xs font-bold text-[#6b2832]">
                Nivel {level}
              </span>

              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#ebdcd3] bg-[#fbf6f2] px-2.5 py-1 text-xs font-semibold text-[#6b2832] shadow-2xs">
                <Icon name="sparkles" className="w-3.5 h-3.5 text-[#c98a2c]" />
                <span className="truncate max-w-[220px]">{title}</span>
                <button
                  type="button"
                  onClick={onOpenTitlesModal}
                  className="ml-1 text-[11px] text-[#6b2832]/70 hover:text-[#6b2832] hover:underline underline-offset-2 cursor-pointer"
                  title="Cambiar título equipado"
                >
                  Cambiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Level Progress & Edit Action */}
        <div className="flex flex-col items-center md:items-end gap-3.5 w-full md:w-auto md:min-w-[260px] md:max-w-xs">
          {/* Level Progress Bar: "¿Qué tan cerca estoy del siguiente nivel?" */}
          <div className="w-full space-y-1.5 bg-[#fbf8f5] border border-[#f0e4de] rounded-xl p-3 sm:p-3.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#6b2832]">Nivel {level}</span>
              <span className="font-mono text-[#6b2832]/80">{currentLevelXP} / 100 XP</span>
            </div>

            {/* Visual Bar */}
            <div
              role="progressbar"
              aria-valuenow={currentLevelXP}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso del nivel: ${currentLevelXP}%`}
              className="h-2.5 w-full overflow-hidden rounded-full bg-[#ebdcd3]"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8d2c3a] to-[#6b2832] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, currentLevelXP))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[rgb(var(--color-neutral))]/65">
              <span>{xpRemaining} XP para Nivel {nextLevel}</span>
              <span className="font-medium text-[#6b2832]">Próximo nivel</span>
            </div>
          </div>

          {/* Edit Profile Action */}
          <button
            type="button"
            onClick={onOpenEditModal}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#eaded6] bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-[#6b2832] shadow-2xs hover:bg-[#faf4f2] hover:border-[#dfcfc5] active:scale-98 transition-all cursor-pointer"
          >
            <Icon name="pencil" className="w-4 h-4 text-[#6b2832]" />
            <span>Editar perfil</span>
          </button>
        </div>
      </div>
    </section>
  );
}
