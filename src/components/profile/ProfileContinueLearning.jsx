import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';

const MODE_LABELS = {
  recognize: 'Reconocimiento y Vocabulario',
  translate: 'Traducción Japonés - Español',
  pair_match: 'Par-Parejas',
  sentence_builder: 'Constructor de Oraciones',
};

const MODE_ROUTES = {
  recognize: '/aprender',
  translate: '/aprender',
  pair_match: '/par-parejas',
  sentence_builder: '/constructor',
};

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = Date.now();
  const past = new Date(dateString).getTime();
  if (isNaN(past)) return '';
  const diffSec = Math.floor((now - past) / 1000);
  if (diffSec < 60) return 'hace un momento';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'ayer';
  if (diffDays < 30) return `hace ${diffDays} días`;
  return new Date(dateString).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

export default function ProfileContinueLearning({ recentActivity }) {
  const modeKey = recentActivity?.mode || 'recognize';
  const modeName = MODE_LABELS[modeKey] || 'Práctica interactiva';
  const targetRoute = MODE_ROUTES[modeKey] || '/aprender';
  const word = recentActivity?.word;
  const timeAgo = formatRelativeTime(recentActivity?.last_attempt);

  return (
    <section aria-label="Continuar aprendiendo" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6b2832]/80">
          Continúa Aprendiendo
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#eaded6]/80 bg-white/80 p-4 sm:p-5 shadow-2xs backdrop-blur-xs transition hover:border-[#dfcfc5] hover:bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-xs font-semibold text-[rgb(var(--color-neutral))]/60">
              {recentActivity ? 'Última actividad registrada' : 'Comienza tu viaje'}
            </span>
            {timeAgo ? (
              <span className="text-[11px] text-[rgb(var(--color-neutral))]/50">
                · {timeAgo}
              </span>
            ) : null}
          </div>

          <h4 className="text-base font-bold text-[#6b2832]">
            {recentActivity ? modeName : 'Aprende tus primeros caracteres'}
          </h4>

          {word ? (
            <p className="text-xs text-[rgb(var(--color-neutral))]/70 font-medium">
              Último vocablo: <strong className="font-jp text-[#6b2832]">{word.japanese}</strong>
              {word.translation ? ` (${word.translation})` : ''}
            </p>
          ) : (
            <p className="text-xs text-[rgb(var(--color-neutral))]/60">
              Practica a tu propio ritmo y acumula experiencia para subir de nivel.
            </p>
          )}
        </div>

        <Link
          to={targetRoute}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6b2832] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#581f27] active:scale-98 transition-all"
        >
          <span>{recentActivity ? 'Continuar práctica' : 'Iniciar práctica'}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
