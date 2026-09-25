import React from 'react';
import { RimuruMascot } from './RimuruMascot';
import './rimuru-animations.css';

/**
 * Panel de Personalización y Control Interactivo para Rimuru.
 * Funciona de manera independiente o conectado a useRimuruController().
 */
export const RimuruPanel = ({ controller, onClose, isFloating = true }) => {
  if (!controller) return null;

  const {
    isJumping,
    isArmWaving,
    isArmExtended,
    isMelting,
    isMeltedFlat,
    paletteMode,
    sizeMode,
    autoJumpEnabled,
    autoJumpInterval,
    streamAnimType,
    triggerJump,
    triggerWave,
    triggerMelt,
    toggleArmExtended,
    toggleMeltedFlat,
    handleAnimationEnd,
    handleArmAnimationEnd,
    handleMeltAnimationEnd,
    changePalette,
    changeSize,
    changeIntervalSetting,
    changeAnimType,
    shadowGradient,
  } = controller;

  return (
    <div
      className="rimuru-panel-container"
      style={{
        position: isFloating ? 'relative' : 'static',
      }}
    >
      {/* 1. Header con botón cerrar */}
      <div className="rimuru-panel-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>🎭</span> Personalizador Rimuru
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rimuru-panel-close"
            title="Cerrar panel"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Escenario de vista previa interactiva */}
      <div className="rimuru-preview-box">
        <div className="rimuru-preview-stage">
          {/* Suelo punteado */}
          <div className="rimuru-preview-ground" />

          {/* Mascota interactiva */}
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
            style={{ width: '6rem', height: 'auto', position: 'relative', zIndex: 10, cursor: 'pointer' }}
            onClick={triggerJump}
            title="Haz clic aquí o en los botones para probar animaciones"
          />

          {/* Sombra de contacto sincronizada */}
          <div
            className={`rounded-full pointer-events-none ${
              isJumping ? 'rimuru-shadow-jump' : isMelting ? 'rimuru-shadow-melt' : ''
            }`}
            style={{
              width: isMeltedFlat ? '6rem' : '5rem',
              height: isMeltedFlat ? '0.35rem' : '0.5rem',
              marginTop: isMeltedFlat ? '-0.15rem' : '-0.25rem',
              borderRadius: '9999px',
              position: 'relative',
              zIndex: 0,
              background: shadowGradient,
              filter: 'blur(1.5px)',
            }}
          />
        </div>
        <span style={{ fontSize: '0.55rem', opacity: 0.65, marginTop: '0.25rem', fontFamily: 'monospace' }}>
          transform-origin: bottom center
        </span>
      </div>

      {/* 3. Botones de acción principales */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={triggerJump}
            disabled={isJumping || isArmWaving || isMelting}
            className="rimuru-btn rimuru-btn-action-jump"
          >
            <span style={{ fontSize: '0.9rem' }}>{isJumping ? '💨' : '🦘'}</span>
            <span>{isJumping ? 'Saltando...' : 'Salto'}</span>
          </button>

          <button
            type="button"
            onClick={triggerWave}
            disabled={isJumping || isArmWaving || isMelting}
            className="rimuru-btn rimuru-btn-action-wave"
          >
            <span style={{ fontSize: '0.9rem' }}>{isArmWaving ? '✨' : '👋'}</span>
            <span>{isArmWaving ? 'Saludando...' : 'Brazo'}</span>
          </button>

          <button
            type="button"
            onClick={triggerMelt}
            disabled={isJumping || isArmWaving || isMelting}
            className="rimuru-btn rimuru-btn-action-melt"
          >
            <span style={{ fontSize: '0.9rem' }}>{isMelting ? '💧' : '🫠'}</span>
            <span>{isMelting ? 'Derritiendo...' : 'Derretirse'}</span>
          </button>
        </div>

        {/* Interruptores continuos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={toggleArmExtended}
            className="rimuru-btn"
            style={{
              padding: '0.35rem 0.5rem',
              fontSize: '0.65rem',
              gap: '0.25rem',
              background: isArmExtended ? '#2D2245' : '#F7F3FA',
              color: isArmExtended ? '#FFFFFF' : '#2D2245',
              borderColor: isArmExtended ? '#2D2245' : 'rgba(196, 181, 253, 0.5)',
            }}
          >
            <span>{isArmExtended ? '🖐️' : '🤚'}</span>
            <span>{isArmExtended ? 'Brazo ON' : 'Brazo Ext.'}</span>
          </button>

          <button
            type="button"
            onClick={toggleMeltedFlat}
            className="rimuru-btn"
            style={{
              padding: '0.35rem 0.5rem',
              fontSize: '0.65rem',
              gap: '0.25rem',
              background: isMeltedFlat ? '#A78BFA' : '#F7F3FA',
              color: isMeltedFlat ? '#FFFFFF' : '#2D2245',
              borderColor: isMeltedFlat ? '#A78BFA' : 'rgba(196, 181, 253, 0.5)',
            }}
          >
            <span>🫠</span>
            <span>{isMeltedFlat ? 'Charco ON' : 'Charco Plano'}</span>
          </button>
        </div>
      </div>

      {/* 4. Control de Animaciones Periódicas (Stream / OBS) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          padding: '0.5rem',
          borderRadius: '0.75rem',
          background: 'rgba(247, 243, 250, 0.85)',
          border: '1px solid rgba(196, 181, 253, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔄 Automático (Stream):
          </span>
          <span
            style={{
              fontSize: '0.6rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              background: autoJumpEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: autoJumpEnabled ? '#047857' : '#BE123C',
              border: `1px solid ${autoJumpEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            }}
          >
            {autoJumpEnabled ? `Activo (${autoJumpInterval}s)` : 'Pausado'}
          </span>
        </div>

        {/* Tipo de animación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.6rem', opacity: 0.75, fontWeight: 600 }}>Tipo de animación:</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.2rem' }}>
            {[
              { id: 'jump', label: '🦘 Salto' },
              { id: 'wave', label: '👋 Brazo' },
              { id: 'melt', label: '🫠 Derretir' },
              { id: 'alternate', label: '✨ Alt. (3)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => changeAnimType(t.id)}
                className="rimuru-btn"
                style={{
                  padding: '0.25rem 0.1rem',
                  fontSize: '0.6rem',
                  background: streamAnimType === t.id ? '#A78BFA' : '#FFFFFF',
                  color: streamAnimType === t.id ? '#FFFFFF' : '#2D2245',
                  borderColor: streamAnimType === t.id ? '#A78BFA' : 'rgba(196, 181, 253, 0.4)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Frecuencia */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.6rem', opacity: 0.75, fontWeight: 600 }}>Frecuencia:</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.2rem' }}>
            {[
              { label: '8s', val: 8 },
              { label: '10s ★', val: 10 },
              { label: '15s', val: 15 },
              { label: 'Off', val: 0 },
            ].map((opt) => {
              const isActive = (opt.val === 0 && !autoJumpEnabled) || (autoJumpEnabled && autoJumpInterval === opt.val);
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => changeIntervalSetting(opt.val)}
                  className="rimuru-btn"
                  style={{
                    padding: '0.25rem 0.1rem',
                    fontSize: '0.6rem',
                    background: isActive ? '#A78BFA' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#2D2245',
                    borderColor: isActive ? '#A78BFA' : 'rgba(196, 181, 253, 0.4)',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Selector de Paleta / Color */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8 }}>
          Color Slime (Cara intacta):
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem' }}>
          {[
            { id: 'branding', icon: '🟣', label: 'Rolero Pastel', activeBg: '#A78BFA', textLight: true },
            { id: 'branding-pink', icon: '🌸', label: 'Rosa Rolero', activeBg: '#F286D2', textLight: true },
            { id: 'branding-cyan', icon: '💧', label: 'Cyan Rolero', activeBg: '#8BDFF2', textLight: false },
            { id: 'original', icon: '✨', label: 'Original Azul', activeBg: '#0284C7', textLight: true },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => changePalette(c.id)}
              className="rimuru-btn"
              style={{
                padding: '0.35rem 0.25rem',
                fontSize: '0.65rem',
                background: paletteMode === c.id ? c.activeBg : '#F7F3FA',
                color: paletteMode === c.id ? (c.textLight ? '#FFFFFF' : '#2D2245') : '#2D2245',
                borderColor: paletteMode === c.id ? c.activeBg : 'rgba(196, 181, 253, 0.4)',
                gap: '0.25rem',
              }}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Selector de Tamaño */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8 }}>
          Tamaño:
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[
            { id: 'small', label: 'Pequeño' },
            { id: 'medium', label: 'Mediano ★' },
            { id: 'large', label: 'Grande' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => changeSize(s.id)}
              className="rimuru-btn"
              style={{
                flex: 1,
                padding: '0.3rem 0.2rem',
                fontSize: '0.65rem',
                background: sizeMode === s.id ? '#2D2245' : '#F7F3FA',
                color: sizeMode === s.id ? '#FFFFFF' : '#2D2245',
                borderColor: sizeMode === s.id ? '#2D2245' : 'rgba(196, 181, 253, 0.4)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
