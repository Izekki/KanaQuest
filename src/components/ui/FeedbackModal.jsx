import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { submitFeedback } from '../../services/supabase/feedback';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const CATEGORIES = [
  {
    id: 'bug',
    label: 'Error Técnico / Bug',
    desc: 'Fallo visual, de audio, botones o bloqueo inesperado del juego',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-4m4-4h2m-6 0h-4M6 16H4m2-4H4m14-5l1.5-1.5M6 7L4.5 5.5m15 13l-1.5-1.5M6 17l-1.5 1.5M9 9a3 3 0 016 0v6a3 3 0 01-6 0V9z" />
      </svg>
    ),
  },
  {
    id: 'word_error',
    label: 'Vocabulario / Kanji',
    desc: 'Lecturas erróneas (romaji/kana), kanji o traducción en español',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    id: 'suggestion',
    label: 'Sugerencia o Idea',
    desc: 'Propuestas de nuevos modos, mecánicas o mejoras de estudio',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'other',
    label: 'Otro Comentario',
    desc: 'Consultas generales, dudas o comentarios libres de la app',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function FeedbackModal({
  isOpen,
  onClose,
  initialCategory = 'bug',
  wordId = null,
  sentenceId = null,
}) {
  const location = useLocation();
  const [category, setCategory] = useState(initialCategory);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { playSuccess, playError } = useSoundEffects();

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory);
      setMessage('');
      setError('');
      setShowToast(false);
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setError('Por favor describe tu reporte con al menos 5 caracteres.');
      playError();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: submitErr } = await submitFeedback({
        category,
        message: message.trim(),
        wordId,
        sentenceId,
        route: location.pathname,
      });

      if (submitErr) throw submitErr;

      playSuccess();
      setShowToast(true);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      console.error('Error al enviar feedback:', err);
      setError(err?.message || 'Ocurrió un error al enviar tu reporte. Intenta de nuevo.');
      playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] animate-toastSlideIn">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/95 px-5 py-3 shadow-xl shadow-emerald-900/10 backdrop-blur">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-emerald-950 text-sm">Feedback enviado</p>
              <p className="text-xs text-emerald-800 font-medium">
                Gracias por ayudarnos a mejorar KanaQuest.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!loading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[1.8rem] border border-[#e8d7cf] bg-white p-5 sm:p-7 shadow-[0_20px_50px_rgba(128,43,56,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#f0e4de] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--color-surface-alt))] text-[rgb(var(--color-accent))] shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-lg sm:text-xl font-bold text-[rgb(var(--color-neutral))]">
                Enviar Feedback
              </h2>
              <p className="text-xs text-[rgb(var(--color-accent))]/75 mt-0.5">
                Reporta incidencias técnicas o comparte sugerencias para la plataforma
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-[#f8ebe6] hover:text-[rgb(var(--color-accent))] transition focus:outline-none"
            aria-label="Cerrar modal"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-accent))]/80 mb-2.5">
              Categoría del reporte
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <label
                    key={cat.id}
                    className={`relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none min-h-[82px] ${
                      isSelected
                        ? 'border-[rgb(var(--color-accent))] bg-[#fdf6f3] shadow-xs ring-1 ring-[rgb(var(--color-accent))]'
                        : 'border-[#ede0d8] bg-white hover:border-[#dfcec4] hover:bg-[#faf5f2]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={isSelected}
                      onChange={() => setCategory(cat.id)}
                      className="sr-only"
                    />
                    {/* Centered Icon Container */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-[rgb(var(--color-accent))] text-white shadow-xs'
                          : 'bg-[#f7ece7] text-[rgb(var(--color-accent))]'
                      }`}
                    >
                      {cat.icon}
                    </div>

                    {/* Text Container with full visibility and clear hierarchy */}
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs sm:text-[13px] font-bold leading-tight ${isSelected ? 'text-[rgb(var(--color-accent))]' : 'text-[rgb(var(--color-neutral))]'}`}>
                        {cat.label}
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-600 leading-snug mt-1 font-normal">
                        {cat.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Route info */}
          <div className="flex items-center justify-between rounded-xl bg-[#f8f1ec] px-3.5 py-2.5 text-xs text-neutral-600 border border-[#ecd9ce]">
            <span className="font-semibold text-[rgb(var(--color-accent))] flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[rgb(var(--color-accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Ubicación actual:</span>
            </span>
            <code className="font-mono text-xs bg-white px-2.5 py-0.5 rounded-lg border border-[#e2d0c5] text-[rgb(var(--color-neutral))] font-bold">
              {location.pathname}
            </code>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="feedback-message" className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-accent))]/80">
                Detalle del reporte
              </label>
              <span className="text-[11px] text-neutral-400 font-mono">
                {message.length}/1000
              </span>
            </div>
            <textarea
              id="feedback-message"
              rows={4}
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                category === 'bug'
                  ? 'Describe qué sucedió y los pasos para reproducir el fallo...'
                  : category === 'word_error'
                  ? 'Indica el kanji o término y la corrección necesaria...'
                  : category === 'suggestion'
                  ? 'Comparte tu propuesta o idea de mejora...'
                  : 'Escribe tu mensaje...'
              }
              className="w-full rounded-2xl border border-[#eaded6] bg-[#fdfaf8] p-3.5 text-xs sm:text-sm text-[rgb(var(--color-neutral))] placeholder-neutral-400 focus:border-[rgb(var(--color-accent))] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-accent))] transition resize-none leading-relaxed"
              disabled={loading || showToast}
              required
            />
          </div>

          {/* Error notice */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-[#f8ebe6] transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || showToast}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-accent))] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[rgb(var(--color-accent-dark))] active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar Reporte</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
