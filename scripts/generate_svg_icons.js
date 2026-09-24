import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'src', 'img', 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

const icons = {
  'chart-progress.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
  <polyline points="16 7 22 7 22 13"></polyline>
</svg>`,

  'trophy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a5 5 0 0 0 4.38 4.96A6 6 0 0 0 11 16.91V19H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-3v-2.09a6 6 0 0 0 4.62-2.95A5 5 0 0 0 22 9V7a3 3 0 0 0-3-3zM4 9V7a1 1 0 0 1 1-1h2v4.83A3 3 0 0 1 4 9zm16 0a3 3 0 0 1-3 1.83V6h2a1 1 0 0 1 1 1z"/>
</svg>`,

  'coin-koban.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <rect x="5" y="2" width="14" height="20" rx="7" fill="currentColor" opacity="0.9"/>
  <rect x="7" y="4" width="10" height="16" rx="5" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/>
  <circle cx="12" cy="12" r="2.5" fill="#fff" opacity="0.8"/>
  <line x1="8" y1="8" x2="16" y2="8" stroke="#fff" stroke-width="1" opacity="0.5"/>
  <line x1="8" y1="16" x2="16" y2="16" stroke="#fff" stroke-width="1" opacity="0.5"/>
</svg>`,

  'fire-streak.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.12 2.65-8.8 6.57-11.75a1 1 0 0 1 1.48.56c.43 2.1 1.7 3.52 3.16 4.39.22-1.35.79-2.58 1.63-3.61a1 1 0 0 1 1.66.27C19.12 7.7 21 11.23 21 14c0 4.97-4.03 9-9 9zm0-15.5c-1.57 1.54-2.84 3.73-2.98 6.22a1 1 0 0 1-1.02.94 1 1 0 0 1-.98-1.02c.16-3.23 1.62-5.91 3.56-7.85-2.67 2.47-4.58 6.04-4.58 9.21 0 3.86 3.14 7 7 7s7-3.14 7-7c0-2.31-1.39-5.18-3.41-7.53-.38.74-.88 1.42-1.48 2a1 1 0 0 1-1.63-.58c-.46-1.59-1.04-2.67-1.48-3.39z"/>
</svg>`,

  'volume-high.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.54 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.54l4.82-4.54A1 1 0 0 1 14 3.23zm4.5 4.27a1 1 0 0 1 1.41.09 7.97 7.97 0 0 1 0 8.82 1 1 0 1 1-1.5-1.32 5.98 5.98 0 0 0 0-6.18 1 1 0 0 1 .09-1.41zm2.5-2.5a1 1 0 0 1 1.41.08A11.97 11.97 0 0 1 22.4 17a1 1 0 0 1-1.5-1.32 9.98 9.98 0 0 0 0-11.36 1 1 0 0 1 .1-1.41z"/>
</svg>`,

  'volume-mute.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M14 3.23v17.54a1 1 0 0 1-1.64.77L7.54 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3.54l4.82-4.54A1 1 0 0 1 14 3.23zm7.71 6.06a1 1 0 0 1 0 1.42L20.41 12l1.3 1.29a1 1 0 0 1-1.42 1.42L19 13.41l-1.29 1.3a1 1 0 0 1-1.42-1.42L17.59 12l-1.3-1.29a1 1 0 0 1 1.42-1.42L19 10.59l1.29-1.3a1 1 0 0 1 1.42 0z"/>
</svg>`,

  'cards-memory.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <rect x="2" y="4" width="13" height="17" rx="2" fill="currentColor" opacity="0.85"/>
  <rect x="9" y="3" width="13" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="8.5" cy="12.5" r="2.5" fill="#fff" opacity="0.6"/>
</svg>`,

  'puzzle-blocks.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/>
</svg>`,

  'target-accuracy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="12" cy="12" r="2" fill="currentColor"/>
</svg>`,

  'star-mastery.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>`,

  'torii-gate.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M2 5c4 1 8 1 10 1s6 0 10-1v2h-2v2h1v2h-1v9h-2V11H6v8H4V11H3V9h1V7H2V5zm4 4h12V7H6v2z"/>
</svg>`,

  'heart.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
</svg>`,

  'hourglass.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zM12 11.5l-4-4V4h8v3.5l-4 4z"/>
</svg>`,

  'sparkles.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M9.5 2l1.6 4.9L16 8.5l-4.9 1.6L9.5 15l-1.6-4.9L3 8.5l4.9-1.6L9.5 2zm8 11l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>
</svg>`,

  'check-circle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
</svg>`,

  'cross-circle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
</svg>`
};

for (const [filename, content] of Object.entries(icons)) {
  const filePath = path.join(ICONS_DIR, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Saved icon: ${filename}`);
}

console.log('All SVG icons generated successfully!');
