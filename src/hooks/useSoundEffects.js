import { useState, useEffect, useCallback } from 'react';
import {
  isSoundMuted,
  setSoundMuted,
  playSyntheticFlip,
  playSyntheticSuccess,
  playSyntheticError,
  playSyntheticComplete,
  playCardAudio as playCardAudioUtil,
} from '../utils/soundEffects';

/**
 * Reusable hook for triggering audio effects and managing global audio toggle state.
 */
export function useSoundEffects() {
  const [muted, setMutedState] = useState(() => isSoundMuted());

  useEffect(() => {
    const handleToggle = (e) => {
      if (typeof e.detail?.muted === 'boolean') {
        setMutedState(e.detail.muted);
      } else {
        setMutedState(isSoundMuted());
      }
    };

    window.addEventListener('kanaquest-sound-toggle', handleToggle);
    return () => window.removeEventListener('kanaquest-sound-toggle', handleToggle);
  }, []);

  const toggleSound = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  }, []);

  const playFlip = useCallback(() => {
    if (!muted) playSyntheticFlip();
  }, [muted]);

  const playSuccess = useCallback(() => {
    if (!muted) playSyntheticSuccess();
  }, [muted]);

  const playError = useCallback(() => {
    if (!muted) playSyntheticError();
  }, [muted]);

  const playComplete = useCallback(() => {
    if (!muted) playSyntheticComplete();
  }, [muted]);

  const playCardAudio = useCallback((text, lang = 'ja') => {
    if (!muted) playCardAudioUtil(text, lang);
  }, [muted]);

  return {
    isMuted: muted,
    toggleSound,
    playFlip,
    playSuccess,
    playError,
    playComplete,
    playCardAudio,
  };
}

export default useSoundEffects;
