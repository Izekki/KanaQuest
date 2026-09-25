import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import RecognitionPreview from '../../components/landing/RecognitionPreview';
import TranslationPreview from '../../components/landing/TranslationPreview';
import PairMatchPreview from '../../components/landing/PairMatchPreview';
import SentenceBuilderPreview from '../../components/landing/SentenceBuilderPreview';
import HeroRimuru from '../../components/landing/HeroRimuru';

const LEARNING_STAGES = [
  {
    id: 'reconocimiento',
    stepNumber: '01',
    title: 'Reconocimiento',
    tag: 'Lectura y forma',
    desc: 'Identifica caracteres kanji y su lectura fonética en kana o romaji.',
    component: <RecognitionPreview />,
    route: '/game',
    actionLabel: 'Practicar Reconocimiento',
  },
  {
    id: 'traduccion',
    stepNumber: '02',
    title: 'Traducción',
    tag: 'Vocabulario activo',
    desc: 'Escribe y consolida el vocabulario desde el significado al japonés.',
    component: <TranslationPreview />,
    route: '/vocabulary',
    actionLabel: 'Explorar Vocabulario',
  },
  {
    id: 'parejas',
    stepNumber: '03',
    title: 'Par-Parejas',
    tag: 'Memoria asociativa',
    desc: 'Empareja kanji y lecturas correspondientes en rondas de agilidad.',
    component: <PairMatchPreview />,
    route: '/pair-match',
    actionLabel: 'Jugar Par-Parejas',
  },
  {
    id: 'constructor',
    stepNumber: '04',
    title: 'Constructor',
    tag: 'Estructura gramatical',
    desc: 'Ordena palabras y partículas en la secuencia natural de la oración.',
    component: <SentenceBuilderPreview />,
    route: '/sentence-builder',
    actionLabel: 'Construir Oraciones',
  },
];

export default function PublicLanding() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = LEARNING_STAGES[activeStageIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 sm:space-y-16 py-4 sm:py-6">
      {/* 1. HERO COMPACTO Y EDITORIAL */}
      <section className="py-4 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Jerarquía Clara y CTA Dominante */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#6b2832]/75">
              Plataforma educativa
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold text-[#38181e] tracking-tight leading-[1.12]">
              Domina el japonés <br className="hidden sm:inline" />
              <span className="text-[#6b2832]">paso a paso.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5c4447] max-w-lg leading-relaxed">
              Aprende kana, vocabulario y gramática con lecciones interactivas cortas.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/game"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b2832] px-8 py-3.5 text-base font-semibold text-white shadow-xs hover:bg-[#561f27] transition-all active:scale-[0.98] min-h-[48px]"
              >
                <span>Comenzar gratis</span>
                <span aria-hidden="true" className="text-sm">→</span>
              </Link>

              <a
                href="#ruta"
                className="text-xs sm:text-sm font-medium text-[#6b2832]/80 hover:text-[#38181e] py-2 px-2 hover:underline underline-offset-4"
              >
                Ver cómo funciona ↓
              </a>
            </div>
          </div>

          {/* Columna Derecha: Mascota Rimuru con paleta KanaQuest y animaciones periódicas */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <HeroRimuru />
          </div>

        </div>
      </section>

      {/* 2. RUTA DE APRENDIZAJE: SISTEMA INTERACTIVO EN 4 ETAPAS */}
      <section id="ruta" className="pt-8 sm:pt-10 border-t border-[#ebdcd3]/70 space-y-6">
        {/* Cabecera de la Sección con Jerarquía Limpia */}
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#6b2832]/75">
            Ruta de aprendizaje
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#38181e] tracking-tight">
            4 etapas para dominar el idioma
          </h2>
          <p className="text-xs sm:text-sm text-[#5c4447] max-w-xl">
            Desde la lectura del carácter hasta la construcción de oraciones reales.
          </p>
        </div>

        {/* Selector de Etapas en Móvil (Pestañas Segmentadas) */}
        <div className="flex md:hidden items-center gap-1.5 p-1 rounded-xl bg-[#f5ede7] border border-[#e8ded6] overflow-x-auto">
          {LEARNING_STAGES.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={[
                  'flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] flex items-center justify-center gap-1.5',
                  isActive
                    ? 'bg-white text-[#6b2832] shadow-xs'
                    : 'text-[#6b2832]/70 hover:text-[#6b2832]',
                ].join(' ')}
              >
                <span className="font-mono text-[11px] opacity-70">{stage.stepNumber}</span>
                <span>{stage.title}</span>
              </button>
            );
          })}
        </div>

        {/* Layout en Escritorio: Lista de Etapas (Izquierda) + Estudio Interactivo (Derecha) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Columna Izquierda: Los 4 Pasos del Plan de Estudio */}
          <div className="hidden md:flex md:col-span-5 flex-col space-y-2">
            {LEARNING_STAGES.map((stage, idx) => {
              const isActive = idx === activeStageIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={[
                    'w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5',
                    isActive
                      ? 'bg-white border-[#d8c2b7] shadow-xs ring-1 ring-[#d8c2b7]/60'
                      : 'bg-transparent border-transparent hover:bg-white/60 hover:border-[#ebdcd3]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors',
                      isActive
                        ? 'bg-[#6b2832] text-white'
                        : 'bg-[#f0e4dd] text-[#6b2832]/70',
                    ].join(' ')}
                  >
                    {stage.stepNumber}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold text-[#38181e]">
                        {stage.title}
                      </span>
                      <span className="text-[10px] font-medium text-[#6b2832]/65">
                        {stage.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c4447] mt-0.5 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Columna Derecha: Estudio Interactivo Activo */}
          <div className="md:col-span-7 flex flex-col">
            <div className="rounded-2xl border border-[#e4d4cb] bg-white p-4 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[360px]">
              
              <div>
                {/* Header del Estudio */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f2e6df]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#6b2832] bg-[#fbf3f0] px-2 py-0.5 rounded-md border border-[#f0ded8]">
                      Etapa {activeStage.stepNumber}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#38181e]">
                      {activeStage.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-medium text-[#6b2832]/70">
                    {activeStage.tag}
                  </span>
                </div>

                {/* Área de Interacción Activa */}
                <div className="py-1">
                  {activeStage.component}
                </div>
              </div>

              {/* Pie con Acción Directa */}
              <div className="mt-4 pt-3 border-t border-[#f2e6df] flex items-center justify-end">
                <Link
                  to={activeStage.route}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b2832] hover:text-[#4d1c23] hover:underline underline-offset-4 py-1"
                >
                  <span>{activeStage.actionLabel}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. ACCESO DIRECTO / CONTINUAR PRÁCTICA */}
      <section className="rounded-2xl border border-[#ebdcd3] bg-[#fbf6f2] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6b2832]">
            Comienza hoy
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-[#38181e]">
            Listo para tu primera ronda de 5 minutos
          </h3>
          <p className="text-xs sm:text-sm text-[#5c4447]">
            Rondas cortas diseñadas para memorización sin fatiga mental.
          </p>
        </div>

        <Link
          to="/game"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#6b2832] px-6 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-[#561f27] transition-all whitespace-nowrap min-h-[46px]"
        >
          <span>Iniciar sesión de juego</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* 4. FOOTER EDITORIAL Y CALMO */}
      <footer className="pt-6 pb-4 border-t border-[#ebdcd3]/70 text-xs text-[#5c4447] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          © 2026 <span className="font-semibold text-[#38181e]">KanaQuest</span> · Plataforma para aprender japonés a tu ritmo.
        </div>
        <div className="flex items-center gap-4 text-[#6b2832]">
          <Link to="/game" className="hover:underline">Aprender</Link>
          <Link to="/vocabulary" className="hover:underline">Vocabulario</Link>
          <Link to="/login" className="hover:underline">Iniciar sesión</Link>
          <a
            href="https://github.com/Izekki/KanaQuest"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
