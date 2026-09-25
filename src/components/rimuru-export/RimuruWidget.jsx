import React from 'react';
import { RimuruMascot } from './RimuruMascot';
import { RimuruPanel } from './RimuruPanel';
import { useRimuruController } from './useRimuruController';
import './rimuru-animations.css';

/**
 * Componente Widget Todo-En-Uno de Rimuru.
 * Combina la mascota animada, su sombra de contacto y el panel minimizable.
 * 
 * Uso más sencillo:
 *   <RimuruWidget />
 * 
 * Con personalización:
 *   <RimuruWidget defaultPalette="branding-pink" defaultInterval={8} showPanelButton={true} />
 */
export const RimuruWidget = ({
  defaultPalette = 'branding',
  defaultSize = 'medium',
  defaultAutoPlay = true,
  defaultInterval = 10,
  defaultAnimType = 'alternate',
  showPanelButton = true,
  className = '',
  style = {},
}) => {
  const controller = useRimuruController({
    defaultPalette,
    defaultSize,
    defaultAutoPlay,
    defaultInterval,
    defaultAnimType,
  });

  const {
    isJumping,
    isArmWaving,
    isArmExtended,
    isMelting,
    isMeltedFlat,
    paletteMode,
    sizeStyle,
    showCustomizer,
    setShowCustomizer,
    triggerJump,
    handleAnimationEnd,
    handleArmAnimationEnd,
    handleMeltAnimationEnd,
    shadowGradient,
  } = controller;

  return (
    <div
      className={`rimuru-widget-root ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        ...style,
      }}
    >
      {/* 1. Contenedor de la Mascota y Sombra de Suelo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={triggerJump}
        title="Haz clic sobre Rimuru para que salte"
      >
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
          style={{
            width: sizeStyle.width,
            height: 'auto',
            position: 'relative',
            zIndex: 10,
          }}
        />

        {/* Sombra de contacto sincronizada con el suelo */}
        <div
          className={isJumping ? 'rimuru-shadow-jump' : isMelting ? 'rimuru-shadow-melt' : ''}
          style={{
            width: isMeltedFlat ? 'calc(' + sizeStyle.width + ' * 0.95)' : 'calc(' + sizeStyle.width + ' * 0.8)',
            height: isMeltedFlat ? '0.55rem' : '0.75rem',
            marginTop: isMeltedFlat ? '-0.25rem' : '-0.35rem',
            borderRadius: '9999px',
            position: 'relative',
            zIndex: 0,
            pointerEvents: 'none',
            background: shadowGradient,
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* 2. Botón minimizable y Panel de Control */}
      {showPanelButton && (
        <div style={{ marginTop: '0.75rem', zIndex: 40 }}>
          {!showCustomizer ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCustomizer(true);
              }}
              className="rimuru-trigger-badge"
            >
              <span>🎭</span>
              <span>Personalizar Mascota</span>
              <span style={{ color: '#F286D2', fontSize: '0.65rem' }}>✦</span>
            </button>
          ) : (
            <div style={{ position: 'absolute', top: '100%', marginTop: '0.5rem', right: 0 }}>
              <RimuruPanel
                controller={controller}
                onClose={() => setShowCustomizer(false)}
                isFloating={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
