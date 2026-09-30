import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'KanaQuest - Aprende Japonés Jugando | Hiragana, Katakana y Kanji';
const DEFAULT_DESC =
  'Aprende y repasa japonés gratis con KanaQuest. Domina Hiragana, Katakana, Kanji y vocabulario esencial con minijuegos interactivos, práctica espaciada y gamificación.';
const BASE_URL = 'https://kanaquest.izekki.me';

/**
 * Hook para actualizar de forma reactiva y limpia los metadatos de la página:
 * - document.title
 * - meta description
 * - link canonical
 * - Open Graph & Twitter Cards
 */
export function usePageSeo({
  title,
  description,
  canonicalPath,
} = {}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Título
    const fullTitle = title
      ? title.includes('KanaQuest')
        ? title
        : `${title} | KanaQuest`
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // 2. Meta descripción
    const finalDesc = description || DEFAULT_DESC;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', finalDesc);
    }

    // 3. Link Canónico dinámico
    const path = canonicalPath || location.pathname;
    const cleanPath = path === '/' ? '' : path;
    const canonicalUrl = `${BASE_URL}${cleanPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // 4. Open Graph dinámico
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', finalDesc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // 5. Twitter Cards
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', finalDesc);

    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', canonicalUrl);
  }, [title, description, canonicalPath, location.pathname]);
}
