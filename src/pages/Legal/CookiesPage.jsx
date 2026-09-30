import React from 'react';
import LegalLayout from './LegalLayout';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import { openComplianceSettings } from '../../utils/storagePreferences';

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de Cookies y Tecnologías de Almacenamiento"
      subtitle="Explicación detallada de las tecnologías técnicas, de preferencias y analíticas empleadas en KanaQuest conforme a la LFPDPPP de México."
      documentVersion="v1.0-2026"
    >
      <div className="space-y-6 text-sm text-[rgb(var(--color-neutral))]/85 leading-relaxed">
        {/* Callout Interactivo para Configurar Cookies */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#ebdcd3] bg-[#faf0eb]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6b2832] shadow-2xs">
              <Icon name="cookie" className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#38181e] text-xs sm:text-sm">
                Gestiona tus preferencias en cualquier momento
              </p>
              <p className="text-xs text-[rgb(var(--color-neutral))]/70">
                Puedes cambiar o retirar tu consentimiento de cookies opcionales con un solo clic.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={openComplianceSettings}
            className="text-xs px-4 py-2 min-h-[38px] whitespace-nowrap w-full sm:w-auto"
          >
            Configurar Cookies
          </Button>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            1. ¿Qué son las Cookies y el Almacenamiento Local?
          </h2>
          <p>
            Una cookie es un pequeño archivo de texto que un sitio web almacena en su navegador. Las tecnologías similares incluyen el <em>almacenamiento local (localStorage)</em>, que permite guardar información en el dispositivo del usuario sin saturar las transmisiones al servidor en cada clic.
          </p>
          <p>
            En KanaQuest no utilizamos cookies de publicidad dirigida ni rastreadores de redes sociales que recopilen tus hábitos de navegación en otros sitios web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            2. Clasificación de Cookies en KanaQuest
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#38181e]">A. Cookies Técnicas y Esenciales (Obligatorias)</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Siempre Activas
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--color-neutral))]/80 leading-relaxed">
                Son estrictamente necesarias para el funcionamiento del sitio y la autenticación con Supabase. Sin ellas, no es posible acceder a tu cuenta ni guardar tu progreso.
              </p>
              <ul className="text-xs text-[rgb(var(--color-neutral))]/70 list-disc pl-5 space-y-1">
                <li><code className="text-[#6b2832]">sb-*-auth-token</code>: Token criptográfico JWT de sesión segura.</li>
                <li><code className="text-[#6b2832]">kanaquest_cookie_consent_v1</code>: Registro de tu consentimiento para no volver a mostrar el banner de forma invasiva.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#38181e]">B. Cookies y Preferencias de Juego (Opcionales)</span>
                <span className="text-[10px] font-bold text-[#6b2832] bg-[#faf0eb] border border-[#ebdcd3] px-2 py-0.5 rounded-full">
                  Consentimiento
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--color-neutral))]/80 leading-relaxed">
                Permiten recordar tus elecciones lúdicas para mejorar la experiencia pedagógica en cada sesión.
              </p>
              <ul className="text-xs text-[rgb(var(--color-neutral))]/70 list-disc pl-5 space-y-1">
                <li><code className="text-[#6b2832]">kanaquest-sound-muted</code>: Recuerda si los efectos sonoros están activos o silenciados.</li>
                <li><code className="text-[#6b2832]">kanaquest_profile_snapshot:*</code>: Caché local de tu avatar y nivel para renderizado instantáneo.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#38181e]">C. Cookies de Rendimiento y Analítica (Opcionales)</span>
                <span className="text-[10px] font-bold text-[#1e8289] bg-[#ebf6f7] border border-[#c4e3e6] px-2 py-0.5 rounded-full">
                  Consentimiento
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--color-neutral))]/80 leading-relaxed">
                Métricas globales y 100% anónimas de tiempos de carga de kanji y rendimiento de respuesta en la navegación. No recopilan correos ni datos identificables.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#38181e] border-b border-[#f0e4dd] pb-2">
            3. Cómo Deshabilitar Cookies en tu Navegador
          </h2>
          <p>
            Además de configurar las opciones en KanaQuest, puedes eliminar o bloquear cookies desde tu navegador:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Brave Browser:</strong> Configuración ➔ Escudos y Privacidad ➔ Cookies y datos de sitios.</li>
            <li><strong>Google Chrome:</strong> Configuración ➔ Privacidad y seguridad ➔ Cookies de terceros.</li>
            <li><strong>Mozilla Firefox:</strong> Ajustes ➔ Privacidad y Seguridad ➔ Cookies y datos del sitio.</li>
            <li><strong>Microsoft Edge:</strong> Configuración ➔ Permisos del sitio ➔ Cookies y datos del sitio.</li>
          </ul>
        </section>
      </div>
    </LegalLayout>
  );
}
