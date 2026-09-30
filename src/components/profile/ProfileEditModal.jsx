import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../ui/Icon';
import mascotTransparent from '../../img/mascot_pink_slime_transparent.png';

export default function ProfileEditModal({
  isOpen,
  onClose,
  username,
  onUsernameChange,
  avatarPreviewUrl,
  hasCustomAvatar,
  uploadingAvatar,
  saving,
  error,
  info,
  currentTitleName,
  onOpenTitlesModal,
  onFileSelect,
  onAvatarDelete,
  onSave,
}) {
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg flex flex-col rounded-2xl border border-[#e8ded6] bg-[#fdfbf7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e4dd] bg-white">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#6b2832]/70">
              Configuración de cuenta
            </span>
            <h2 id="edit-profile-modal-title" className="text-lg font-bold text-[#6b2832]">
              Editar Perfil
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5c4447] hover:bg-[#f5ede7] hover:text-[#38181e] transition-colors"
            title="Cerrar ventana"
            aria-label="Cerrar ventana"
          >
            <span className="text-lg leading-none" aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSave} className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* Notifications */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50/90 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {error}
            </div>
          )}
          {info && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-3.5 py-2.5 text-xs font-medium text-emerald-800"
            >
              {info}
            </div>
          )}

          {/* Section 1: Avatar / Photo Management */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6b2832]/80">
              Foto de Perfil
            </label>
            <div className="flex items-center gap-4 bg-white/70 border border-[#f0e4de] rounded-xl p-3">
              {/* Avatar Preview */}
              <div className="relative shrink-0">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full ring-2 ring-[#f4e6e0] shadow-2xs overflow-hidden bg-[#fbeae5] flex items-center justify-center">
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Avatar seleccionado"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={mascotTransparent}
                      alt="Mascota KanaQuest"
                      className="h-4/5 w-4/5 object-contain"
                    />
                  )}

                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload & Delete Controls */}
              <div className="flex flex-col gap-2 min-w-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="modal-avatar-file-input"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelect(file);
                  }}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar || saving}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#eaded6] bg-white px-3 py-1.5 text-xs font-semibold text-[#6b2832] transition hover:bg-[#faf4f2] disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>{avatarPreviewUrl ? 'Cambiar foto' : 'Subir foto'}</span>
                  </button>

                  {/* Discrete delete photo button (secondary danger action) */}
                  {hasCustomAvatar && (
                    <button
                      type="button"
                      onClick={onAvatarDelete}
                      disabled={uploadingAvatar || saving}
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition disabled:opacity-50"
                      title="Eliminar avatar personalizado y volver a la mascota"
                    >
                      <span>Eliminar foto</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-[rgb(var(--color-neutral))]/55">
                  PNG, JPG o WebP. Máx. 2 MB.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Public Username */}
          <div className="space-y-1.5">
            <label htmlFor="edit-username-input" className="text-xs font-bold uppercase tracking-wider text-[#6b2832]/80">
              Nombre de Usuario Público
            </label>
            <input
              ref={inputRef}
              id="edit-username-input"
              type="text"
              value={username}
              maxLength={30}
              onChange={(e) => onUsernameChange(e.target.value)}
              className="w-full rounded-xl border border-[#eaded6] bg-white px-3.5 py-2.5 min-h-[44px] text-sm text-[rgb(var(--color-neutral))] outline-none focus:border-[#6b2832] focus:ring-2 focus:ring-[#6b2832]/10 transition"
              placeholder="Tu nombre en KanaQuest"
              required
            />
            <p className="text-[11px] text-[rgb(var(--color-neutral))]/55">
              Visible públicamente en tu perfil y rankings.
            </p>
          </div>

          {/* Section 3: Equipped Title & Title Selector Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6b2832]/80">
              Título de Rol Activo
            </label>
            <div className="flex items-center justify-between rounded-xl border border-[#f0e4de] bg-white/70 p-3">
              <div className="flex items-center gap-2">
                <Icon name="sparkles" className="w-4 h-4 text-[#c98a2c]" />
                <span className="text-sm font-semibold text-[#6b2832]">
                  {currentTitleName || 'Novato del Kanji'}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenTitlesModal}
                className="inline-flex items-center gap-1 rounded-lg border border-[#eaded6] bg-white px-3 py-1 text-xs font-semibold text-[#6b2832] hover:bg-[#faf4f2] transition"
              >
                <span>Cambiar título</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0e4dd]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploadingAvatar}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#eaded6] bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[rgb(var(--color-neutral))]/70 hover:bg-[#faf4f2] active:scale-98 transition disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving || uploadingAvatar}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#6b2832] px-6 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#581f27] active:scale-98 transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
