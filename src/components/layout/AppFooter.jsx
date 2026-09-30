import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { openComplianceSettings } from '../../utils/storagePreferences';

export default function AppFooter() {
  return (
    <footer className="mt-12 sm:mt-16 pt-8 pb-10 border-t border-[#ebdcd3]/80 text-xs text-[#5c4447]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Fila Principal de Navegación y Legal */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          {/* Identidad de Marca */}
          <div className="space-y-1.5 max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-sm tracking-tight text-[#38181e]">KanaQuest</span>
              <span className="text-[10px] font-bold text-[#6b2832] bg-[#faf0eb] border border-[#ebdcd3] px-2 py-0.5 rounded-full">
                Japonés Gamificado
              </span>
            </div>
            <p className="text-[11px] text-[rgb(var(--color-neutral))]/70 leading-relaxed">
              Plataforma didáctica para aprender, practicar y dominar Hiragana, Katakana, Kanji y vocabulario japonés a tu propio ritmo.
            </p>
          </div>

          {/* Enlaces de Práctica */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b2832]">
              Práctica y Juego
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 text-xs">
              <Link to="/game" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Aprender
              </Link>
              <Link to="/pair-match" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Par-Parejas
              </Link>
              <Link to="/sentence-builder" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Constructor
              </Link>
              <Link to="/vocabulary" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Vocabulario
              </Link>
            </div>
          </div>

          {/* Enlaces Legales (México) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b2832]">
              Cumplimiento Legal (México)
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 sm:gap-4 text-xs font-medium">
              <Link to="/terminos" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Términos y Condiciones
              </Link>
              <Link to="/privacidad" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Aviso de Privacidad
              </Link>
              <Link to="/cookies" className="hover:text-[#6b2832] hover:underline underline-offset-2">
                Política de Cookies
              </Link>
              <button
                type="button"
                onClick={openComplianceSettings}
                className="inline-flex items-center gap-1 text-[#6b2832] hover:underline underline-offset-2 cursor-pointer font-semibold"
              >
                <Icon name="cookie" className="w-3.5 h-3.5" />
                <span>Configurar cookies</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fila Secundaria: Atribución de Terceros y Copyright */}
        <div className="pt-4 border-t border-[#f0e4dd] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[rgb(var(--color-neutral))]/60">
          <div>
            © 2026 <strong className="text-[#38181e] font-semibold">KanaQuest</strong> · Todos los derechos reservados.
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2.5">
            <span>Vocabulario: <a href="https://www.edrdg.org/jmdict/j_jmdict.html" target="_blank" rel="noreferrer" className="hover:underline">JMdict (EDRDG)</a></span>
            <span aria-hidden="true">·</span>
            <span>Trazos: <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noreferrer" className="hover:underline">KanjiVG</a></span>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/Izekki/KanaQuest"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#6b2832] hover:underline inline-flex items-center gap-1"
            >
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
