import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import {
  hasUserDecidedPreferences,
  acceptAllPreferences,
  acceptEssentialPreferencesOnly,
  PREFERENCES_UPDATED_EVENT,
} from '../../utils/storagePreferences';
import { useAuthSession } from '../../hooks/useAuthSession';

export default function ComplianceBanner({ onOpenSettings }) {
  const { user } = useAuthSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Si el usuario ya tiene sesión (usuario registrado existente),
    // se le activa automáticamente la aceptación de cookies y se omite el banner
    if (user?.id) {
      if (!hasUserDecidedPreferences()) {
        acceptAllPreferences(user.id);
      }
      setIsVisible(false);
      return;
    }

    if (!hasUserDecidedPreferences()) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  useEffect(() => {
    const handleUpdated = () => {
      setIsVisible(false);
    };
    window.addEventListener(PREFERENCES_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(PREFERENCES_UPDATED_EVENT, handleUpdated);
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    acceptAllPreferences(user?.id);
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    acceptEssentialPreferencesOnly(user?.id);
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="Aviso de privacidad y gestión de almacenamiento"
      className="fixed bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-6 z-50 max-w-4xl mx-auto rounded-2xl border border-[#ebdcd3] bg-[#fdfbf7]/98 backdrop-blur-md p-4 sm:p-5 shadow-[0_12px_36px_rgba(107,40,50,0.16)] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Texto Informativo */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#faf0eb] text-[#6b2832] ring-1 ring-[#e8ded6]">
            <Icon name="cookie" className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6b2832]">Privacidad y Cookies</span>
              <span className="text-[10px] font-medium text-[#6b2832]/65 uppercase tracking-wider">
                LFPDPPP México
              </span>
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-[rgb(var(--color-neutral))]/80 max-w-2xl">
              Utilizamos cookies técnicas para mantener tu sesión de estudio y, con tu consentimiento, cookies de preferencias y rendimiento para recordar ajustes de audio. Consulta nuestra{' '}
              <Link
                to="/cookies"
                className="font-bold text-[#6b2832] underline underline-offset-2 hover:text-[#581f27]"
              >
                Política de Cookies
              </Link>{' '}
              y el{' '}
              <Link
                to="/privacidad"
                className="font-bold text-[#6b2832] underline underline-offset-2 hover:text-[#581f27]"
              >
                Aviso de Privacidad
              </Link>.
            </p>
          </div>
        </div>

        {/* Grupo de Acciones */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-1 md:pt-0 border-t md:border-t-0 border-[#ebdcd3]/70">
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-xs font-semibold text-[#6b2832] hover:text-[#581f27] hover:underline px-2.5 py-1.5"
          >
            Personalizar
          </button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAcceptEssential}
            className="text-xs px-3.5 py-2 min-h-[38px] flex-1 sm:flex-initial"
          >
            Solo esenciales
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleAcceptAll}
            className="text-xs px-4 py-2 min-h-[38px] flex-1 sm:flex-initial"
          >
            Aceptar todas
          </Button>
        </div>
      </div>
    </aside>
  );
}
