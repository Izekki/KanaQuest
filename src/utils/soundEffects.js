/**
 * Web Audio API Sound Synthesizer & Effect Manager
 * Provides latency-free, synthetic sound effects with fallback and mute persistence.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

const SOUND_STORAGE_KEY = 'kanaquest_sound_muted';

export function isSoundMuted() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSoundMuted(muted) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, muted ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('kanaquest-sound-toggle', { detail: { muted } }));
  } catch {}
}

/**
 * Synthesizes a soft card flip / block snap sound
 */
export function playSyntheticFlip() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (err) {
    console.debug('Audio playback error:', err);
  }
}

/**
 * Synthesizes an uplifting harmonic chime arpeggio (C5 -> E5 -> G5 -> C6)
 */
export function playSyntheticSuccess() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const startTime = now + index * 0.07;
      const duration = 0.28;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.debug('Audio playback error:', err);
  }
}

/**
 * Synthesizes a soft, gentle error buzz (dual descending pulses)
 */
export function playSyntheticError() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const pulses = [0, 0.12];

    pulses.forEach((offset) => {
      const startTime = now + offset;
      const duration = 0.1;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.linearRampToValueAtTime(120, startTime + duration);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.debug('Audio playback error:', err);
  }
}

/**
 * Synthesizes a victory fanfare celebration arpeggio
 */
export function playSyntheticComplete() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Major chord flourish with sparkle
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.25 }, // C5
      { freq: 659.25, time: 0.08, dur: 0.25 }, // E5
      { freq: 783.99, time: 0.16, dur: 0.30 }, // G5
      { freq: 1046.50, time: 0.24, dur: 0.45 }, // C6
      { freq: 1318.51, time: 0.36, dur: 0.60 }, // E6
      { freq: 1567.98, time: 0.48, dur: 0.80 }, // G6
    ];

    notes.forEach((item) => {
      const startTime = now + item.time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.24, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + item.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + item.dur);
    });
  } catch (err) {
    console.debug('Audio playback error:', err);
  }
}
