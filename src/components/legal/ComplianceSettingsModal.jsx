import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import {
  getStoragePreferences,
  saveStoragePreferences,
  acceptAllPreferences,
  acceptEssentialPreferencesOnly,
} from '../../utils/storagePreferences';
import { useAuthSession } from '../../hooks/useAuthSession';

export default function ComplianceSettingsModal({ isOpen, onClose }) {
  const { user } = useAuthSession();
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getStoragePreferences();
      setPreferences(Boolean(current.preferences));
      setAnalytics(Boolean(current.analytics));
    }
  }, [isOpen]);

  // Listener para cerrar con tecla ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSave = () => {
    saveStoragePreferences({ preferences, analytics }, user?.id);
    onClose();
  };

  const handleAcceptAll = () => {
    acceptAllPreferences(user?.id);
    onClose();
  };

  const handleRejectNonEssential = () => {
    acceptEssentialPreferencesOnly(user?.id);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compliance-settings-title"
    >
      {/* Backdrop con blur */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del Modal */}
      <div
        className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-2xl border border-[#e8ded6] bg-[#fdfbf7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e4dd] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#faf0eb] text-[#6b2832]">
              <Icon name="cookie" className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#6b2832]/70">
                Cumplimiento LFPDPPP · México
              </span>
              <h2 id="compliance-settings-title" className="text-base sm:text-lg font-bold text-[#6b2832]">
                Preferencias de Cookies y Privacidad
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b2832]/70 hover:bg-[#faf4f2] transition-colors"
            aria-label="Cerrar configuración"
          >
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/80 leading-relaxed">
            En KanaQuest respetamos tu derecho a la privacidad. Conforme a la legislación mexicana, puedes elegir qué tecnologías permites almacenar en tu navegador. Puedes revisar la descripción detallada en nuestra{' '}
            <Link
              to="/cookies"
              onClick={onClose}
              className="font-bold text-[#6b2832] hover:underline underline-offset-2"
            >
              Política de Cookies
            </Link>.
          </p>

          <div className="space-y-3">
            {/* Categoría 1: Esenciales */}
            <div className="p-3.5 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#38181e]">
                    Cookies Técnicas y Esenciales
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Siempre Activas
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--color-neutral))]/70 leading-relaxed">
                Indispensables para la autenticación segura con Supabase (<code className="text-[11px] bg-neutral-100 px-1 py-0.5 rounded text-[#6b2832]">sb-*-auth-token</code>), protección CSRF y persistencia del ejercicio activo en la sesión. No se pueden desactivar.
              </p>
            </div>

            {/* Categoría 2: Preferencias y Gamificación */}
            <div className="p-3.5 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="sliders" className="w-3.5 h-3.5 text-[#6b2832]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#38181e]">
                    Preferencias de Juego y Sonido
                  </h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences}
                    onChange={(e) => setPreferences(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6b2832]"></div>
                </label>
              </div>
              <p className="text-xs text-[rgb(var(--color-neutral))]/70 leading-relaxed">
                Permiten recordar en tu dispositivo si silenciaste los efectos de audio, filtros de vocabulario y la caché cosmética de tu avatar para un inicio de sesión instantáneo.
              </p>
            </div>

            {/* Categoría 3: Rendimiento y Analítica */}
            <div className="p-3.5 rounded-xl border border-[#ebdcd3] bg-white space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="chart-progress" className="w-3.5 h-3.5 text-[#1e8289]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#38181e]">
                    Rendimiento y Métricas Anónimas
                  </h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e8289]"></div>
                </label>
              </div>
              <p className="text-xs text-[rgb(var(--color-neutral))]/70 leading-relaxed">
                Métricas estadísticas 100% anónimas sobre tiempos de carga de kanji y rendimiento de respuesta. No recopilan datos personales ni te rastrean en otros sitios.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#f0e4dd] bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="text-xs font-semibold text-[#6b2832]/75 hover:text-[#6b2832] hover:underline"
          >
            Solo esenciales
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSave}
              className="text-xs sm:text-sm px-3.5 py-2 min-h-[38px]"
            >
              Guardar selección
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleAcceptAll}
              className="text-xs sm:text-sm px-4 py-2 min-h-[38px]"
            >
              Aceptar todas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
