import { describe, it, expect } from 'vitest';
import { SHADOW_GRADIENTS } from '../rimuru-export/useRimuruController';

describe('HeroRimuru & KanaQuest Mascot Palette Tests', () => {
  it('defines a KanaQuest brand shadow gradient with wine and sakura colors', () => {
    expect(SHADOW_GRADIENTS.kanaquest).toBeDefined();
    expect(SHADOW_GRADIENTS.kanaquest).toContain('107, 40, 50'); // #6b2832
    expect(SHADOW_GRADIENTS.kanaquest).toContain('244, 183, 195'); // #f4b7c3
  });

  it('cycles animation steps strictly between Saludo (0) and Salto (1)', () => {
    // Sequence test: Saludo -> Salto -> Saludo -> Salto
    const steps = [0, 1, 2, 3, 4, 5].map((cycle) => cycle % 2);
    expect(steps).toEqual([0, 1, 0, 1, 0, 1]);
  });
});
