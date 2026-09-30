import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../components/ui/Icon';

const LEGAL_DOCS = [
  { path: '/terminos', label: 'Términos de Uso' },
  { path: '/privacidad', label: 'Aviso de Privacidad' },
  { path: '/cookies', label: 'Política de Cookies' },
];

export default function LegalLayout({ title, subtitle, documentVersion = 'v1.0-2026', children }) {
  const location = useLocation();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4 sm:py-6">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Ruta de navegación" className="flex items-center justify-between text-xs text-[#5c4447]">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-[#6b2832] transition-colors">
            Inicio
          </Link>
          <span className="text-[#eaded6]" aria-hidden="true">/</span>
          <span className="font-semibold text-[#6b2832]">Marco Legal</span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 font-medium text-[#6b2832] hover:underline cursor-pointer"
        >
          <Icon name="pencil" className="w-3.5 h-3.5" />
          <span>Imprimir / PDF</span>
        </button>
      </nav>

      {/* Hero Header */}
      <header className="rounded-2xl border border-[#ebdcd3] bg-[#fdfbf7] p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf0eb] border border-[#ebdcd3] text-[11px] font-bold text-[#6b2832]">
            <Icon name="shield-check" className="w-3.5 h-3.5" />
            <span>Marco Regulatorio Mexicano</span>
          </span>
          <span className="text-[11px] font-mono text-[rgb(var(--color-neutral))]/60">
            Versión: {documentVersion} · Vigente 2026
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#38181e] tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/75 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}

        {/* Tab Navigation entre documentos legales */}
        <div className="pt-3 border-t border-[#f0e4dd] flex flex-wrap gap-2">
          {LEGAL_DOCS.map((doc) => {
            const isActive = location.pathname.startsWith(doc.path);
            return (
              <Link
                key={doc.path}
                to={doc.path}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#6b2832] text-white shadow-2xs'
                    : 'bg-white border border-[#ebdcd3] text-[#5c4447] hover:bg-[#faf4f2] hover:text-[#6b2832]'
                }`}
              >
                {doc.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Contenido Editorial del Documento */}
      <article className="rounded-2xl border border-[#ebdcd3] bg-white p-6 sm:p-10 shadow-xs prose prose-sm max-w-none prose-headings:text-[#38181e] prose-headings:font-bold prose-h2:border-b prose-h2:border-[#f0e4dd] prose-h2:pb-2 prose-h2:mt-8 prose-h3:text-[#6b2832] prose-p:text-[rgb(var(--color-neutral))]/85 prose-p:leading-relaxed prose-li:text-[rgb(var(--color-neutral))]/85 prose-strong:text-[#38181e] prose-a:text-[#6b2832] prose-a:underline">
        {children}
      </article>

      {/* Nota de pie legal */}
      <div className="p-4 rounded-xl border border-[#ebdcd3] bg-[#fbf6f2] text-center text-xs text-[rgb(var(--color-neutral))]/70 space-y-1">
        <p className="font-semibold text-[#6b2832]">
          Aviso sobre Asesoría Legal
        </p>
        <p>
          Este documento ha sido redactado de conformidad con la normativa de derecho digital y protección de datos vigente en México (LFPDPPP, LFPC y Código de Comercio). Se recomienda su revisión periódica por un abogado especializado ante cualquier evolución operativa o legislativa.
        </p>
      </div>
    </div>
  );
}
