import React from 'react';
import { Link } from 'react-router-dom';
import avatarRimuruRedPink from '../../img/avatar_rimuru_version_red-pink.svg';

export default function PublicLanding() {
  const learningModes = [
    {
      id: 'recognize',
      title: 'Reconocimiento',
      kanji: '認識',
      badgeColor: 'bg-[#fbeae5] text-[#6b2832] border-[#f3d3ce]',
      tag: 'Lectura y Kanji',
      description: 'Identifica kanji y caracteres kana reconociendo su lectura exacta en romaji o hiragana al instante.',
    },
    {
      id: 'translate',
      title: 'Traducción',
      kanji: '翻訳',
      badgeColor: 'bg-[#fff6e6] text-[#9c6615] border-[#fae2be]',
      tag: 'Vocabulario Activo',
      description: 'Refuerza tu vocabulario escribiendo las palabras directamente en japonés a partir de su significado en español.',
    },
    {
      id: 'pair_match',
      title: 'Par-Parejas',
      kanji: '🎴',
      badgeColor: 'bg-[#eef3fb] text-[#2c5282] border-[#d2e1f5]',
      tag: 'Desafío de Memoria',
      description: 'Entrena tu memoria visual y agilidad mental volteando y emparejando palabras japonesas con su traducción.',
    },
    {
      id: 'sentence_builder',
      title: 'Constructor',
      kanji: '⛩️',
      badgeColor: 'bg-[#eef8f2] text-[#22633e] border-[#cfe9d8]',
      tag: 'Estructura & Gramática',
      description: 'Construye frases reales y comprende el orden gramatical arrastrando fichas interactivas paso a paso.',
    },
  ];

  const features = [
    { icon: '⚡', title: 'Rondas Rápidas', desc: 'Sesiones cortas de 5 a 10 preguntas para estudiar a tu propio ritmo.' },
    { icon: '📈', title: 'Progreso Diario', desc: 'Guarda tus aciertos, historial de maestría y racha diaria de estudio.' },
    { icon: '🏆', title: 'Ranking Semanal', desc: 'Gana XP con cada acierto y compite amistosamente en el podio.' },
  ];

  const handleScrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById('modos-aprendizaje');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 sm:space-y-10 py-2 sm:py-4">
      {/* 1. HERO DE BIENVENIDA */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-[#eaded6] bg-white p-6 sm:p-10 shadow-[0_14px_34px_rgba(107,40,50,0.06)]">
        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left Column: Headline & Call To Action */}
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fbf0ec] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#6b2832] border border-[#f2d2cc]">
              <span>⛩️</span>
              <span>Plataforma Interactiva</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#6b2832] tracking-tight leading-tight">
                KanaQuest
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-[rgb(var(--color-neutral))]/90">
                Domina el japonés paso a paso
              </p>
            </div>

            <p className="text-sm sm:text-base text-[rgb(var(--color-neutral))]/75 leading-relaxed">
              Aprende kanji, vocabulario y gramática con rondas dinámicas de práctica, desafíos de memoria interactivos y seguimiento continuo de tu progreso diario.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b2832] px-7 py-3 text-sm sm:text-base font-bold text-white shadow-[0_10px_22px_rgba(107,40,50,0.22)] transition-all hover:bg-[#581f27] hover:-translate-y-0.5 active:scale-98"
              >
                <span>Comenzar gratis</span>
                <span aria-hidden="true">→</span>
              </Link>

              <button
                type="button"
                onClick={handleScrollToFeatures}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#6b2832]/25 bg-white/80 px-6 py-3 text-sm sm:text-base font-semibold text-[#6b2832] shadow-xs transition-all hover:bg-white hover:border-[#6b2832]/45 active:scale-98"
              >
                <span>Ver características</span>
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>

          {/* Right Column: Mascot & Interactive Badge */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 items-center justify-center overflow-hidden rounded-full bg-[#fbeae5] border-4 border-white shadow-[0_14px_32px_rgba(107,40,50,0.14)] hover:scale-105 transition-transform duration-300">
              <img
                src={avatarRimuruRedPink}
                alt="Mascota KanaQuest"
                className="h-24 w-24 sm:h-28 sm:w-28 lg:h-36 lg:w-36 max-w-none object-contain drop-shadow-[0_8px_16px_rgba(107,40,50,0.18)]"
                loading="eager"
              />
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#6b2832] border border-[#eaded6] shadow-xs">
              <span>✨</span>
              <span>¡Aprende jugando!</span>
            </div>
          </div>

        </div>

        {/* Feature Highlights Strip */}
        <div className="mt-8 pt-6 border-t border-[#f2e6df] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl bg-[#fffdfb] border border-[#f2e6df] p-3.5 shadow-2xs transition hover:bg-white"
            >
              <span className="text-2xl select-none" aria-hidden="true">{feat.icon}</span>
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#6b2832]">
                  {feat.title}
                </div>
                <div className="text-[11px] sm:text-xs text-[rgb(var(--color-neutral))]/70 leading-relaxed">
                  {feat.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SECCIÓN: SHOWCASE DE MODOS DE APRENDIZAJE */}
      <section id="modos-aprendizaje" className="space-y-4">
        <div className="text-center sm:text-left px-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#6b2832]/80">
            <span>Metodología</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#6b2832] tracking-tight">
            Modos de Aprendizaje
          </h2>
          <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70 mt-0.5">
            Una suite completa de entrenamiento interactivo para todas las etapas del estudio:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {learningModes.map((mode) => (
            <Link
              key={mode.id}
              to="/login"
              className="group flex flex-col justify-between h-full rounded-2xl border border-[#eaded6] bg-white p-5 sm:p-6 shadow-[0_6px_20px_rgba(107,40,50,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#dfc3be] cursor-pointer"
            >
              <div>
                {/* Header Icon + Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={[
                      'flex h-11 w-11 items-center justify-center rounded-2xl border font-bold text-base shadow-2xs font-jp transition-transform duration-200 group-hover:scale-105',
                      mode.badgeColor,
                    ].join(' ')}
                  >
                    {mode.kanji}
                  </div>

                  <span className="rounded-full bg-[#fbf5f2] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6b2832]/80 border border-[#eaded6]">
                    {mode.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-4 space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-[#6b2832] group-hover:text-[#581f27] transition-colors">
                    {mode.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/75 leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-5 pt-3 border-t border-[#f6eae4] flex items-center justify-between text-[11px] font-semibold text-[#6b2832]/75">
                <span>Modo interactivo</span>
                <span aria-hidden="true" className="text-xs group-hover:translate-x-0.5 transition-transform duration-200">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="rounded-2xl border border-[#eaded6] bg-white/70 backdrop-blur p-4 text-center text-xs text-[rgb(var(--color-neutral))]/70 shadow-2xs">
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
