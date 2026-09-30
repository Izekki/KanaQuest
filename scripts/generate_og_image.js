import puppeteer from 'puppeteer-core';
import path from 'path';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const outputPath = 'C:\\Proyectos\\KanaQuest\\public\\og-image.png';

async function captureRealLanding() {
  console.log('Capturing exact KanaQuest landing page for og-image.png (1200x630)...');
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    // 1200x630 exact standard Open Graph aspect ratio
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    
    // Set legal consent in localStorage so the cookie modal/banner is completely suppressed
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem(
        'kq_storage_prefs_v1',
        JSON.stringify({
          essential: true,
          preferences: true,
          analytics: true,
          version: 'v1.0-2026',
          decided: true,
          updatedAt: new Date().toISOString(),
        })
      );
    });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    // Wait for fonts to be ready
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });

    // Wait for Mascot Rimuru and Petals animation to settle nicely
    await new Promise((r) => setTimeout(r, 600));

    // Refine DOM for a clean 1200x630 Open Graph showcase
    await page.evaluate(() => {
      // 1. Ensure any lingering compliance banner or dialog is removed
      document.querySelectorAll('.fixed.bottom-0, [role="dialog"], aside').forEach((el) => {
        el.remove();
      });

      // 2. Hide sections below the hero (#ruta, footer, etc.) so nothing is cut off at the bottom
      const ruta = document.querySelector('#ruta');
      if (ruta) {
        ruta.style.display = 'none';
        let sibling = ruta.nextElementSibling;
        while (sibling) {
          sibling.style.display = 'none';
          sibling = sibling.nextElementSibling;
        }
      }

      const footer = document.querySelector('footer');
      if (footer) footer.style.display = 'none';

      // 3. Vertically balance the hero section for the 630px frame height
      const hero = document.querySelector('section');
      if (hero) {
        hero.style.paddingTop = '28px';
        hero.style.paddingBottom = '36px';
      }
    });

    await new Promise((r) => setTimeout(r, 200));

    await page.screenshot({
      path: outputPath,
      type: 'png',
    });

    console.log('Successfully captured REAL landing page to:', outputPath);
  } finally {
    await browser.close();
  }
}

captureRealLanding().catch((err) => {
  console.error('Error capturing real landing:', err);
  process.exit(1);
});
