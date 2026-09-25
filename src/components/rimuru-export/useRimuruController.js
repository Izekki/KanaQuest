import { useState, useEffect, useRef, useCallback } from 'react';

export const SHADOW_GRADIENTS = {
  kanaquest: 'radial-gradient(ellipse at center, rgba(107, 40, 50, 0.55) 0%, rgba(156, 61, 75, 0.35) 45%, rgba(244, 183, 195, 0.20) 70%, transparent 95%)',
  branding: 'radial-gradient(ellipse at center, rgba(67, 47, 110, 0.65) 0%, rgba(112, 82, 172, 0.42) 45%, rgba(196, 181, 253, 0.20) 70%, transparent 95%)',
  'branding-pink': 'radial-gradient(ellipse at center, rgba(110, 42, 86, 0.65) 0%, rgba(184, 85, 150, 0.42) 45%, rgba(242, 134, 210, 0.20) 70%, transparent 95%)',
  'branding-cyan': 'radial-gradient(ellipse at center, rgba(22, 72, 92, 0.65) 0%, rgba(49, 139, 174, 0.42) 45%, rgba(139, 223, 242, 0.20) 70%, transparent 95%)',
  original: 'radial-gradient(ellipse at center, rgba(6, 46, 98, 0.65) 0%, rgba(51, 128, 176, 0.42) 45%, rgba(117, 206, 249, 0.20) 70%, transparent 95%)',
};

export const SIZE_CONFIG = {
  small: { width: '10rem', label: 'Pequeño' },
  medium: { width: '13rem', label: 'Mediano' },
  large: { width: '16rem', label: 'Grande' },
};

/**
 * Hook controlador completo de animaciones, temporizadores y estados de Rimuru.
 * Totalmente autocontenido para usar en cualquier proyecto React.
 */
export function useRimuruController(initialConfig = {}) {
  const {
    defaultPalette = 'kanaquest',
    defaultSize = 'medium',
    defaultAutoPlay = true,
    defaultInterval = 10,
    defaultAnimType = 'alternate',
    persistKey = null, // e.g. 'rimuru_prefs' si se quiere persistencia
  } = initialConfig;

  const [paletteMode, setPaletteMode] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        return localStorage.getItem(`${persistKey}_palette`) || defaultPalette;
      } catch {}
    }
    return defaultPalette;
  });

  const [sizeMode, setSizeMode] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        return localStorage.getItem(`${persistKey}_size`) || defaultSize;
      } catch {}
    }
    return defaultSize;
  });

  const [autoJumpEnabled, setAutoJumpEnabled] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${persistKey}_autojump`);
        return saved !== null ? saved === 'true' : defaultAutoPlay;
      } catch {}
    }
    return defaultAutoPlay;
  });

  const [autoJumpInterval, setAutoJumpInterval] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${persistKey}_interval`);
        return saved ? parseInt(saved, 10) || defaultInterval : defaultInterval;
      } catch {}
    }
    return defaultInterval;
  });

  const [streamAnimType, setStreamAnimType] = useState(() => {
    if (persistKey && typeof window !== 'undefined') {
      try {
        return localStorage.getItem(`${persistKey}_anim`) || defaultAnimType;
      } catch {}
    }
    return defaultAnimType;
  });

  const [isJumping, setIsJumping] = useState(false);
  const [isArmWaving, setIsArmWaving] = useState(false);
  const [isArmExtended, setIsArmExtended] = useState(false);
  const [isMelting, setIsMelting] = useState(false);
  const [isMeltedFlat, setIsMeltedFlat] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const jumpTimeoutRef = useRef(null);
  const hasInitialJumpedRef = useRef(false);
  const animCycleRef = useRef(0);

  const triggerJump = useCallback(() => {
    if (isJumping || isArmWaving || isMelting) return;
    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
      jumpTimeoutRef.current = null;
    }
    hasInitialJumpedRef.current = true;
    setIsJumping(true);
  }, [isJumping, isArmWaving, isMelting]);

  const triggerWave = useCallback(() => {
    if (isArmWaving || isJumping || isMelting) return;
    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
      jumpTimeoutRef.current = null;
    }
    hasInitialJumpedRef.current = true;
    setIsArmWaving(true);
  }, [isArmWaving, isJumping, isMelting]);

  const triggerMelt = useCallback(() => {
    if (isMelting || isJumping || isArmWaving) return;
    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
      jumpTimeoutRef.current = null;
    }
    hasInitialJumpedRef.current = true;
    setIsMelting(true);
  }, [isMelting, isJumping, isArmWaving]);

  const triggerNext = useCallback(() => {
    if (isJumping || isArmWaving || isMelting) return;
    if (jumpTimeoutRef.current) {
      clearTimeout(jumpTimeoutRef.current);
      jumpTimeoutRef.current = null;
    }
    hasInitialJumpedRef.current = true;
    const step = animCycleRef.current % 2;
    if (step === 0) {
      setIsArmWaving(true);
    } else {
      setIsJumping(true);
    }
    animCycleRef.current += 1;
  }, [isJumping, isArmWaving, isMelting]);

  // Resguardos de tiempo para garantizar que los estados activos siempre terminen limpiamente
  useEffect(() => {
    if (!isJumping) return;
    const t = setTimeout(() => setIsJumping(false), 2600);
    return () => clearTimeout(t);
  }, [isJumping]);

  useEffect(() => {
    if (!isArmWaving) return;
    const t = setTimeout(() => setIsArmWaving(false), 2900);
    return () => clearTimeout(t);
  }, [isArmWaving]);

  useEffect(() => {
    if (!isMelting) return;
    const t = setTimeout(() => setIsMelting(false), 4400);
    return () => clearTimeout(t);
  }, [isMelting]);

  const handleAnimationEnd = useCallback(() => {
    setIsJumping(false);
  }, []);

  const handleArmAnimationEnd = useCallback(() => {
    setIsArmWaving(false);
  }, []);

  const handleMeltAnimationEnd = useCallback(() => {
    setIsMelting(false);
  }, []);

  const toggleArmExtended = useCallback(() => {
    setIsArmExtended((prev) => !prev);
  }, []);

  const toggleMeltedFlat = useCallback(() => {
    setIsMeltedFlat((prev) => !prev);
  }, []);

  const changePalette = useCallback((mode) => {
    setPaletteMode(mode);
    if (persistKey && typeof window !== 'undefined') {
      try { localStorage.setItem(`${persistKey}_palette`, mode); } catch {}
    }
  }, [persistKey]);

  const changeSize = useCallback((size) => {
    setSizeMode(size);
    if (persistKey && typeof window !== 'undefined') {
      try { localStorage.setItem(`${persistKey}_size`, size); } catch {}
    }
  }, [persistKey]);

  const changeIntervalSetting = useCallback((seconds) => {
    if (seconds === 0) {
      setAutoJumpEnabled(false);
      if (persistKey && typeof window !== 'undefined') {
        try { localStorage.setItem(`${persistKey}_autojump`, 'false'); } catch {}
      }
    } else {
      setAutoJumpEnabled(true);
      setAutoJumpInterval(seconds);
      if (persistKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`${persistKey}_autojump`, 'true');
          localStorage.setItem(`${persistKey}_interval`, seconds.toString());
        } catch {}
      }
    }
  }, [persistKey]);

  const changeAnimType = useCallback((type) => {
    setStreamAnimType(type);
    if (persistKey && typeof window !== 'undefined') {
      try { localStorage.setItem(`${persistKey}_anim`, type); } catch {}
    }
  }, [persistKey]);

  // Temporizador para activar animaciones periódicamente de forma automática
  useEffect(() => {
    if (!autoJumpEnabled) {
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
        jumpTimeoutRef.current = null;
      }
      return;
    }

    if (!isJumping && !isArmWaving && !isMelting) {
      const delay = hasInitialJumpedRef.current ? autoJumpInterval * 1000 : 3500;
      jumpTimeoutRef.current = setTimeout(() => {
        hasInitialJumpedRef.current = true;
        if (streamAnimType === 'wave') {
          setIsArmWaving(true);
        } else if (streamAnimType === 'jump') {
          setIsJumping(true);
        } else if (streamAnimType === 'melt') {
          setIsMelting(true);
        } else {
          // 'alternate': Saludo (Brazo) -> Salto
          const step = animCycleRef.current % 2;
          if (step === 0) {
            setIsArmWaving(true);
          } else {
            setIsJumping(true);
          }
          animCycleRef.current += 1;
        }
      }, delay);
    }

    return () => {
      if (jumpTimeoutRef.current) {
        clearTimeout(jumpTimeoutRef.current);
      }
    };
  }, [autoJumpEnabled, autoJumpInterval, isJumping, isArmWaving, isMelting, streamAnimType]);

  return {
    // Estados activos
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
    showCustomizer,
    setShowCustomizer,

    // Disparadores
    triggerJump,
    triggerWave,
    triggerMelt,
    triggerNext,
    toggleArmExtended,
    toggleMeltedFlat,

    // Fin de animaciones
    handleAnimationEnd,
    handleArmAnimationEnd,
    handleMeltAnimationEnd,

    // Configuración
    changePalette,
    changeSize,
    changeIntervalSetting,
    changeAnimType,

    // Constantes auxiliares
    shadowGradient: SHADOW_GRADIENTS[paletteMode] || SHADOW_GRADIENTS.branding,
    sizeStyle: SIZE_CONFIG[sizeMode] || SIZE_CONFIG.medium,
  };
}
