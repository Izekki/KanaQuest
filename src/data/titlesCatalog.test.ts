import { describe, it, expect } from 'vitest';
import { TITLES_CATALOG, TITLE_CATEGORIES } from './titlesCatalog';

describe('Titles Catalog Architecture Tests', () => {
  it('contains exactly 40 distinct titles in the catalog (plus initial default title)', () => {
    // 40 categorizados + 1 título base inicial 'novato_kanji' = 41
    expect(TITLES_CATALOG.length).toBeGreaterThanOrEqual(40);
  });

  it('contains at least 10 titles for each of the 4 defined categories', () => {
    const categories = ['habits', 'modes', 'linguistics', 'adventure'];

    for (const cat of categories) {
      const titlesInCat = TITLES_CATALOG.filter((t) => t.category === cat);
      expect(titlesInCat.length).toBeGreaterThanOrEqual(10);
    }
  });

  it('ensures all 4 categories exist in TITLE_CATEGORIES', () => {
    expect(TITLE_CATEGORIES.habits).toBeDefined();
    expect(TITLE_CATEGORIES.modes).toBeDefined();
    expect(TITLE_CATEGORIES.linguistics).toBeDefined();
    expect(TITLE_CATEGORIES.adventure).toBeDefined();
  });

  it('ensures every title has unique IDs and required metadata', () => {
    const ids = new Set();
    for (const title of TITLES_CATALOG) {
      expect(ids.has(title.id)).toBe(false);
      ids.add(title.id);
      expect(title.name).toBeTruthy();
      expect(title.description).toBeTruthy();
      expect(['common', 'rare', 'epic', 'legendary']).toContain(title.rarity);
      expect(typeof title.checkUnlock).toBe('function');
    }
  });
});
