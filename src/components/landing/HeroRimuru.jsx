import React from 'react';
import { RimuruMascot, useRimuruController } from '../rimuru-export';

/**
 * HeroRimuru - Mascota interactiva de KanaQuest en la sección Hero de la landing page.
 *
 * Características:
 * - Integrada 100% con la paleta de identidad KanaQuest (vino tinto tradicional y sakura rosado).
 * - Animaciones básicas periódicas en ciclo automático: Saludo (Brazo) -> Salto (Squash & Stretch).
 * - Sombra de contacto sincronizada dinámicamente con la física del suelo.
 * - Resplandor cálido ambiental integrado al fondo washi japonés, sin marcos ni tarjetas de configuración.
 * - Soporte interactivo por clic y teclado (Enter / Espacio).
 */
export default function HeroRimuru() {
  const {
    isJumping,
    isArmWaving,
    isArmExtended,
    isMelting,
    isMeltedFlat,
    paletteMode,
    shadowGradient,
    triggerNext,
    handleAnimationEnd,
    handleArmAnimationEnd,
    handleMeltAnimationEnd,
  } = useRimuruController({
    defaultPalette: 'kanaquest',
    defaultInterval: 6,
    defaultAutoPlay: true,
    defaultAnimType: 'alternate',
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerNext();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full py-4 select-none">
      {/* Resplandor ambiental cálido (armonizado con la paleta KanaQuest) */}
      <div
        className="absolute pointer-events-none w-64 h-64 sm:w-80 sm:h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(223, 124, 141, 0.22) 0%, rgba(244, 183, 195, 0.10) 45%, rgba(107, 40, 50, 0.04) 70%, transparent 85%)',
          filter: 'blur(32px)',
          transform: 'translateY(-15px)',
        }}
        aria-hidden="true"
      />

      {/* Contenedor interactivo de Rimuru */}
      <div
        role="button"
        tabIndex={0}
        onClick={triggerNext}
        onKeyDown={handleKeyDown}
        title="Rimuru, mascota de KanaQuest — ¡Haz clic para interactuar!"
        aria-label="Rimuru, mascota de KanaQuest. Presiona o haz clic para interactuar con sus animaciones."
        className="relative flex flex-col items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6b2832]/40 rounded-3xl p-2 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
      >
        {/* SVG Mascota Rimuru con paleta kanaquest y estados animados */}
        <RimuruMascot
          variant={paletteMode}
          isJumping={isJumping}
          onAnimationEnd={handleAnimationEnd}
          isArmWaving={isArmWaving}
          isArmExtended={isArmExtended}
          onArmAnimationEnd={handleArmAnimationEnd}
          isMelting={isMelting}
          isMeltedFlat={isMeltedFlat}
          onMeltAnimationEnd={handleMeltAnimationEnd}
          glow={true}
          className="w-[230px] sm:w-[275px] md:w-[290px] lg:w-[325px] h-auto relative z-10"
        />

        {/* Sombra de contacto sincronizada en el piso */}
        <div
          className={`w-[190px] sm:w-[225px] md:w-[240px] lg:w-[265px] h-3.5 -mt-3.5 sm:-mt-4 rounded-full pointer-events-none relative z-0 ${
            isJumping ? 'rimuru-shadow-jump' : isMelting ? 'rimuru-shadow-melt' : 'transition-all duration-300'
          }`}
          style={{
            background: shadowGradient,
            filter: 'blur(2.5px)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
