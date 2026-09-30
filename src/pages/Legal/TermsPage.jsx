import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout from './LegalLayout';
import { usePageSeo } from '../../hooks/usePageSeo';

export default function TermsPage() {
  usePageSeo({
    title: 'Términos y Condiciones',
    description: 'Términos y condiciones de uso de KanaQuest. Contrato de adhesión para la plataforma de aprendizaje del idioma japonés.',
    canonicalPath: '/terminos',
  });
  return (
    <LegalLayout
      title="Términos y Condiciones de Uso"
      subtitle="Contrato de adhesión electrónico vinculante conforme a los artículos 89 al 95 del Código de Comercio y la Ley Federal de Protección al Consumidor en México."
      documentVersion="v1.0-2026"
    >
      <div className="space-y-6 text-sm text-[rgb(var(--color-neutral))]/85 leading-relaxed">
        <p className="font-medium text-[#38181e]">
          Bienvenido a <strong>KanaQuest</strong> (en adelante, la "Plataforma" o el "Servicio"), una aplicación web interactiva diseñada para la enseñanza, práctica y gamificación del idioma japonés (silabarios Hiragana, Katakana, caracteres Kanji, vocabulario y sintaxis).
        </p>

        <p>
          El presente documento regula el acceso, navegación y uso de la Plataforma entre cualquier persona que utilice o se registre en KanaQuest (el "Usuario") y el titular responsable de la Plataforma, de conformidad con la legislación federal aplicable en los Estados Unidos Mexicanos.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            1. Objeto y Alcance del Servicio
          </h2>
          <p>
            KanaQuest ofrece herramientas pedagógicas digitales orientadas al autoaprendizaje del idioma japonés a través de:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Reconocimiento:</strong> Identificación fonética y visual de caracteres kanji y kana.</li>
            <li><strong>Par-Parejas:</strong> Rondas de memoria asociativa entre kanji, lecturas y significados en español.</li>
            <li><strong>Constructor:</strong> Ensamblado sintáctico de oraciones respetando partículas y gramática japonesa.</li>
            <li><strong>Seguimiento de Progreso:</strong> Registro de puntos de experiencia (XP), niveles, rachas diarias y palabras dominadas.</li>
          </ul>
          <p className="text-xs text-[rgb(var(--color-neutral))]/70 italic">
            KanaQuest es una herramienta de apoyo didáctico y no otorga certificaciones oficiales de suficiencia lingüística (tales como las acreditaciones oficiales JLPT/Noken).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            2. Requisitos de Registro y Elegibilidad (+13 años)
          </h2>
          <p>
            La Plataforma está abierta a cualquier persona interesada en estudiar japonés:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Usuarios de 13 años o más:</strong> Pueden registrarse y crear su cuenta de forma autónoma para guardar su progreso y vocabulario.</li>
            <li><strong>Menores de 13 años:</strong> Deben utilizar la Plataforma bajo la supervisión o con el consentimiento expreso de su padre, madre o tutor legal.</li>
            <li><strong>Credenciales:</strong> La contraseña y el acceso a la cuenta son personales e intransferibles. El Usuario es responsable de resguardar su confidencialidad.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            3. Gratuidad, Donaciones y Servicios Futuros
          </h2>
          <p>
            El núcleo pedagógico de KanaQuest es actualmente gratuito y accesible sin costo obligatorio.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Donaciones Comunitarias:</strong> Cualquier aportación o contribución voluntaria realizada a través de plataformas de mecenazgo (como Ko-fi o GitHub Sponsors) es a título de gratitud para solventar costos de infraestructura de servidores y no constituye una compraventa mercantil forzosa.</li>
            <li><strong>Futuros Planes o Suscripciones:</strong> En caso de implementarse suscripciones o contenidos avanzados en el futuro, se requerirá el consentimiento expreso y previo del Usuario con total transparencia en precios, políticas de cancelación y sin cargos automáticos no autorizados, conforme al artículo 76 BIS de la Ley Federal de Protección al Consumidor (LFPC).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            4. Reglas de Conducta y Uso Aceptable
          </h2>
          <p>Queda estrictamente prohibido a los Usuarios:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Vulnerar, descompilar, realizar ingeniería inversa o extraer bases de datos y código de la Plataforma.</li>
            <li>Emplear bots, scrapers o automatizaciones para alterar puntuaciones, rankings o saturar peticiones hacia Supabase o Vercel.</li>
            <li>Enviar a través de módulos de feedback o nombres de usuario mensajes difamatorios, con expresiones de odio o violatorios de derechos de autor.</li>
            <li>Comercializar cuentas de usuario o explotar el material sin autorización previa por escrito.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            5. Propiedad Intelectual y Atribución de Terceros
          </h2>
          <p>
            <strong>Derechos de KanaQuest:</strong> El diseño de interfaz Seigaiha/Washi, código fuente del frontend, estilos visuales y la mascota Rimuru en sus expresiones originales son propiedad exclusiva del desarrollador de KanaQuest y están protegidos por la Ley Federal del Derecho de Autor (LFDA).
          </p>
          <p>
            <strong>Atribución Obligatoria a Recursos Abiertos:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>JMdict / EDICT:</strong> Los diccionarios y glosarios de vocabulario se utilizan bajo la licencia{' '}
              <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer" className="text-[#6b2832] font-semibold underline">
                Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
              </a>{' '}
              del <em>Electronic Dictionary Research and Development Group (EDRDG)</em>.
            </li>
            <li>
              <strong>KanjiVG:</strong> Los datos de trazo y diagramas de kanji provienen del proyecto KanjiVG creado por Ulrich Apel, bajo licencia{' '}
              <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer" className="text-[#6b2832] font-semibold underline">
                CC BY-SA 3.0
              </a>.
            </li>
            <li>
              <strong>Tipografías:</strong> Noto Sans JP, Noto Serif JP e Inter se distribuyen bajo la licencia{' '}
              <em>SIL Open Font License (OFL v1.1)</em>.
            </li>
          </ul>
          <p>
            <strong>Contenido y Feedback del Usuario:</strong> Al enviar sugerencias o reportes lingüísticos en la Plataforma, el Usuario concede a KanaQuest una licencia no exclusiva, gratuita y perpetua para incorporar dichas mejoras en beneficio de la comunidad.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            6. Limitación de Responsabilidad
          </h2>
          <p>
            KanaQuest se proporciona "tal cual" (*as is*). El Responsable realiza sus mejores esfuerzos para mantener la estabilidad del sistema, pero no responde por fallas imprevistas en la red de internet, mantenimientos de proveedores de nube o pequeñas discrepancias en interpretaciones idiomáticas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            7. Ley Aplicable y Jurisdicción
          </h2>
          <p>
            Estos Términos y Condiciones se rigen e interpretan de conformidad con las leyes federales de los Estados Unidos Mexicanos. Para cualquier controversia no resuelta amigablemente, las partes se someten a la competencia de los tribunales federales de la Ciudad de México, renunciando a cualquier otro fuero que pudiere corresponderles.
          </p>
          <p className="pt-2">
            Para dudas legales, escríbenos a:{' '}
            <a href="mailto:KanaQuest@izekki.me" className="font-bold text-[#6b2832] underline">
              KanaQuest@izekki.me
            </a>
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
