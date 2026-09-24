import React from 'react';

/**
 * Reusable vector Icon component for KanaQuest
 * Uses clean SVGs from src/img/icons/ to eliminate all emojis
 */
export default function Icon({ name, className = 'w-4 h-4', 'aria-label': ariaLabel, ...props }) {
  const icons = {
    lightning: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    'chart-progress': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    trophy: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a5 5 0 0 0 4.38 4.96A6 6 0 0 0 11 16.91V19H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-2.09a6 6 0 0 0 4.62-2.95A5 5 0 0 0 22 9V7a3 3 0 0 0-3-3zM4 9V7a1 1 0 0 1 1-1h2v4.83A3 3 0 0 1 4 9zm16 0a3 3 0 0 1-3 1.83V6h2a1 1 0 0 1 1 1z" />
      </svg>
    ),
    'coin-koban': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <rect x="5" y="2" width="14" height="20" rx="7" fill="currentColor" opacity="0.9" />
        <rect x="7" y="4" width="10" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.9" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    'fire-streak': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.12 2.65-8.8 6.57-11.75a1 1 0 0 1 1.48.56c.43 2.1 1.7 3.52 3.16 4.39.22-1.35.79-2.58 1.63-3.61a1 1 0 0 1 1.66.27C19.12 7.7 21 11.23 21 14c0 4.97-4.03 9-9 9zm0-15.5c-1.57 1.54-2.84 3.73-2.98 6.22a1 1 0 0 1-1.02.94 1 1 0 0 1-.98-1.02c.16-3.23 1.62-5.91 3.56-7.85-2.67 2.47-4.58 6.04-4.58 9.21 0 3.86 3.14 7 7 7s7-3.14 7-7c0-2.31-1.39-5.18-3.41-7.53-.38.74-.88 1.42-1.48 2a1 1 0 0 1-1.63-.58c-.46-1.59-1.04-2.67-1.48-3.39z" />
      </svg>
    ),
    'volume-high': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.54 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.54l4.82-4.54A1 1 0 0 1 14 3.23zm4.5 4.27a1 1 0 0 1 1.41.09 7.97 7.97 0 0 1 0 8.82 1 1 0 1 1-1.5-1.32 5.98 5.98 0 0 0 0-6.18 1 1 0 0 1 .09-1.41zm2.5-2.5a1 1 0 0 1 1.41.08A11.97 11.97 0 0 1 22.4 17a1 1 0 0 1-1.5-1.32 9.98 9.98 0 0 0 0-11.36 1 1 0 0 1 .1-1.41z" />
      </svg>
    ),
    'volume-mute': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.54 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.54l4.82-4.54A1 1 0 0 1 14 3.23zm7.71 6.06a1 1 0 0 1 0 1.42L20.41 12l1.3 1.29a1 1 0 0 1-1.42 1.42L19 13.41l-1.29 1.3a1 1 0 0 1-1.42-1.42L17.59 12l-1.3-1.29a1 1 0 0 1 1.42-1.42L19 10.59l1.29-1.3a1 1 0 0 1 1.42 0z" />
      </svg>
    ),
    'cards-memory': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <rect x="3" y="5" width="12" height="16" rx="2" fill="currentColor" opacity="0.85" />
        <rect x="9" y="3" width="12" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="9" cy="13" r="2" fill="#fff" opacity="0.6" />
      </svg>
    ),
    'puzzle-blocks': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
      </svg>
    ),
    'target-accuracy': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    'star-mastery': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    'torii-gate': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M2 5c4 1 8 1 10 1s6 0 10-1v2h-2v2h1v2h-1v9h-2V11H6v8H4V11H3V9h1V7H2V5zm4 4h12V7H6v2z" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    hourglass: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zM12 11.5l-4-4V4h8v3.5l-4 4z" />
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M9.5 2l1.6 4.9L16 8.5l-4.9 1.6L9.5 15l-1.6-4.9L3 8.5l4.9-1.6L9.5 2zm8 11l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
      </svg>
    ),
    'check-circle': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    'cross-circle': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    ),
    'book-open': (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 4.5C10.5 3.5 8 3 5 3 3.5 3 2.5 3.5 2 4v14.5c.5-.5 1.5-1 3-1 3 0 5.5.5 7 1.5 1.5-1 4-1.5 7-1.5 1.5 0 2.5.5 3 1V4c-.5-.5-1.5-1-3-1-3 0-5.5.5-7 1.5zm-1 12c-1.5-1-3.5-1.5-6-1.5V5.5c2.5 0 4.5.5 6 1.5v9.5zm8-1.5c-2.5 0-4.5.5-6 1.5V7c1.5-1 3.5-1.5 6-1.5V15z" />
      </svg>
    ),
    crown: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M2 19h20v2H2v-2zm1-8.5l3.5 3.5L12 6l5.5 8 3.5-3.5L20 18H4l-1-7.5zm3.5 1.5L4.7 16h14.6l-1.8-4-4.5 4.5L12 9.5l-3.5 5.5-2-3z" />
      </svg>
    ),
    medal: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <circle cx="12" cy="15" r="6" />
        <path d="M7 2h3l2 5-2 1-3-6zm7 0h3l-3 6-2-1 2-5z" />
      </svg>
    ),
    magnifier: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16" y2="16" />
      </svg>
    ),
    filter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
    lightbulb: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-2 18h4v1h-4v-1zm1-1.5h2v-.5h-2v.5z" />
      </svg>
    ),
    gamepad: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    palette: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.46 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    pencil: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
    ),
    sprout: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M12 22v-6c0-3.31-2.69-6-6-6H3c0 4.97 4.03 9 9 9v3h2v-3c4.97 0 9-4.03 9-9h-3c-3.31 0-6 2.69-6 6v3h-2zm-6-8c1.66 0 3-1.34 3-3V7c0-2.21-1.79-4-4-4S1 4.79 1 7v4c0 1.66 1.34 3 3 3h2z" />
      </svg>
    ),
    pin: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
      </svg>
    ),
    infinity: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <path d="M18.178 8c5.096 0 5.096 8 0 8-2.616 0-3.874-1.92-5.178-4-1.304 2.08-2.562 4-5.178 4-5.096 0-5.096-8 0-8 2.616 0 3.874 1.92 5.178 4 1.304-2.08 2.562-4 5.178-4z" />
      </svg>
    ),
  };

  const rendered = icons[name] || null;
  if (!rendered) return null;

  return (
    <span
      className="inline-flex items-center justify-center shrink-0 leading-none select-none"
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
    >
      {rendered}
    </span>
  );
}
