import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://kanaquest.izekki.me';
const currentDate = new Date().toISOString();

/**
 * Rutas públicas indexables de KanaQuest (App.jsx).
 * - Excluidas explícitamente: /admin/feedback, /reset-password, /profile
 */
const routes = [
  // 1. Landing Principal
  { path: '/', priority: '1.0', changefreq: 'daily' },

  // 2. Modos de Práctica y Aprendizaje (Principales y alias)
  { path: '/game', priority: '0.9', changefreq: 'weekly' },
  { path: '/aprender', priority: '0.8', changefreq: 'weekly' },
  { path: '/pair-match', priority: '0.8', changefreq: 'weekly' },
  { path: '/par-parejas', priority: '0.8', changefreq: 'weekly' },
  { path: '/sentence-builder', priority: '0.8', changefreq: 'weekly' },
  { path: '/constructor', priority: '0.8', changefreq: 'weekly' },

  // 3. Catálogo de Vocabulario
  { path: '/vocabulary', priority: '0.8', changefreq: 'weekly' },
  { path: '/vocabulario', priority: '0.8', changefreq: 'weekly' },
  { path: '/historial', priority: '0.7', changefreq: 'weekly' },

  // 4. Autenticación
  { path: '/login', priority: '0.6', changefreq: 'monthly' },
  { path: '/register', priority: '0.6', changefreq: 'monthly' },
  { path: '/forgot-password', priority: '0.5', changefreq: 'monthly' },

  // 5. Marco Legal (México)
  { path: '/terminos', priority: '0.4', changefreq: 'monthly' },
  { path: '/terms', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacidad', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'monthly' },
  { path: '/cookies', priority: '0.4', changefreq: 'monthly' },
];

function generateSitemapXml() {
  const xmlUrls = routes
    .map(
      (r) => `  <url>
    <loc>${DOMAIN}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlUrls}
</urlset>
`;
}

function writeSitemap() {
  const xml = generateSitemapXml();

  // 1. Escribir en public/ (fuente de verdad para Vite)
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicPath, xml, 'utf8');
  console.log(`[Sitemap] Escrito con éxito en: ${publicPath}`);

  // 2. Si dist/ existe (build previo o en curso), actualizarlo también
  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, xml, 'utf8');
    console.log(`[Sitemap] Sincronizado también en: ${distPath}`);
  }

  console.log(`[Sitemap] Total de URLs indexables generadas: ${routes.length}`);
}

writeSitemap();
