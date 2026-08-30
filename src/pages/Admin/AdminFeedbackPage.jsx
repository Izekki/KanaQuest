import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchAdminFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
} from '../../services/supabase/feedback';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  reviewed: {
    label: 'Revisado',
    badge: 'bg-sky-50 text-sky-800 border-sky-200/80',
    dot: 'bg-sky-500',
  },
  resolved: {
    label: 'Resuelto',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  discarded: {
    label: 'Descartado',
    badge: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    dot: 'bg-neutral-400',
  },
};

const CATEGORY_CONFIG = {
  bug: {
    label: 'Bug / Técnico',
    badge: 'bg-rose-50 text-rose-800 border-rose-200/80',
  },
  word_error: {
    label: 'Vocabulario / Kanji',
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
  },
  suggestion: {
    label: 'Sugerencia',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  },
  other: {
    label: 'General / Otro',
    badge: 'bg-purple-50 text-purple-800 border-purple-200/80',
  },
};

function formatTimestamp(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { playSuccess, playError } = useSoundEffects();

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchErr } = await fetchAdminFeedbacks({
        status: statusFilter,
        category: categoryFilter,
      });

      if (fetchErr) throw fetchErr;
      setFeedbacks(data ?? []);
    } catch (err) {
      console.error('Error cargando feedbacks:', err);
      setError('No se pudieron cargar los reportes. Revisa la consola o tu conexión.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleStatusChange = async (feedbackId, nextStatus) => {
    setActionLoadingId(feedbackId);
    try {
      const { data, error: updateErr } = await updateFeedbackStatus(feedbackId, {
        status: nextStatus,
      });

      if (updateErr) throw updateErr;

      playSuccess();
      setFeedbacks((prev) =>
        prev.map((item) => (item.id === feedbackId ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      console.error('Error actualizando estado:', err);
      playError();
      alert('Error al actualizar estado: ' + (err?.message || err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveNotes = async (feedbackId) => {
    setActionLoadingId(feedbackId);
    try {
      const { data, error: updateErr } = await updateFeedbackStatus(feedbackId, {
        adminNotes: notesDraft.trim(),
      });

      if (updateErr) throw updateErr;

      playSuccess();
      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === feedbackId ? { ...item, admin_notes: notesDraft.trim() } : item
        )
      );
      setEditingNotesId(null);
      setNotesDraft('');
    } catch (err) {
      console.error('Error guardando notas:', err);
      playError();
      alert('Error al guardar notas: ' + (err?.message || err));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('¿Seguro que deseas eliminar permanentemente este reporte?')) {
      return;
    }

    setActionLoadingId(feedbackId);
    try {
      const { error: delErr } = await deleteFeedback(feedbackId);
      if (delErr) throw delErr;

      playSuccess();
      setFeedbacks((prev) => prev.filter((item) => item.id !== feedbackId));
    } catch (err) {
      console.error('Error eliminando feedback:', err);
      playError();
      alert('Error al eliminar: ' + (err?.message || err));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = feedbacks.length;
    const pending = feedbacks.filter((f) => f.status === 'pending').length;
    const reviewed = feedbacks.filter((f) => f.status === 'reviewed').length;
    const resolved = feedbacks.filter((f) => f.status === 'resolved').length;
    const discarded = feedbacks.filter((f) => f.status === 'discarded').length;
    return { total, pending, reviewed, resolved, discarded };
  }, [feedbacks]);

  // Filtered list
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const username = item.profile?.username?.toLowerCase() || '';
        const msg = item.message?.toLowerCase() || '';
        const route = item.route?.toLowerCase() || '';
        const wordJp = item.word?.japanese?.toLowerCase() || '';
        const wordTrans = item.word?.translation?.toLowerCase() || '';
        const sentJp = item.sentence?.full_japanese?.toLowerCase() || '';
        return (
          username.includes(query) ||
          msg.includes(query) ||
          route.includes(query) ||
          wordJp.includes(query) ||
          wordTrans.includes(query) ||
          sentJp.includes(query)
        );
      }
      return true;
    });
  }, [feedbacks, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-[#eaded6] bg-white/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(128,43,56,0.04)] backdrop-blur">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--color-surface-alt))] text-[rgb(var(--color-accent))] shadow-inner">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[rgb(var(--color-neutral))]">
                Panel de Feedbacks
              </h1>
              <span className="rounded-md bg-[rgb(var(--color-accent))] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-xs text-[rgb(var(--color-accent))]/75">
              Revisión y triaje de reportes de usuarios y sugerencias
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadFeedbacks}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl border border-[#eaded6] bg-white px-3.5 py-2 text-xs font-semibold text-[rgb(var(--color-accent))] shadow-xs hover:bg-[#faf5f2] transition disabled:opacity-50"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualizar</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`text-left rounded-2xl border p-3.5 transition-all ${
            statusFilter === 'all'
              ? 'border-[rgb(var(--color-accent))] bg-white shadow-xs ring-1 ring-[rgb(var(--color-accent))]'
              : 'border-[#eaded6] bg-white/70 hover:bg-white'
          }`}
        >
          <div className="text-[11px] font-medium text-neutral-500">Total</div>
          <div className="mt-1 text-2xl font-bold text-[rgb(var(--color-neutral))]">
            {metrics.total}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`text-left rounded-2xl border p-3.5 transition-all ${
            statusFilter === 'pending'
              ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500'
              : 'border-[#eaded6] bg-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Pendientes</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-900">{metrics.pending}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('reviewed')}
          className={`text-left rounded-2xl border p-3.5 transition-all ${
            statusFilter === 'reviewed'
              ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-500'
              : 'border-[#eaded6] bg-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-sky-800">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>Revisados</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-sky-900">{metrics.reviewed}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('resolved')}
          className={`text-left rounded-2xl border p-3.5 transition-all ${
            statusFilter === 'resolved'
              ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
              : 'border-[#eaded6] bg-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Resueltos</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-900">{metrics.resolved}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('discarded')}
          className={`text-left rounded-2xl border p-3.5 transition-all col-span-2 sm:col-span-1 ${
            statusFilter === 'discarded'
              ? 'border-neutral-400 bg-neutral-100 shadow-xs ring-1 ring-neutral-400'
              : 'border-[#eaded6] bg-white/70 hover:bg-white'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-600">
            <span className="h-2 w-2 rounded-full bg-neutral-400" />
            <span>Descartados</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-neutral-700">{metrics.discarded}</div>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-2xl border border-[#eaded6] bg-white p-3 shadow-xs">
        {/* Category selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              categoryFilter === 'all'
                ? 'bg-[rgb(var(--color-accent))] text-white shadow-xs'
                : 'bg-[#faf5f2] text-neutral-600 hover:bg-[#f3e7e1]'
            }`}
          >
            Todas
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategoryFilter(key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === key
                  ? 'bg-[rgb(var(--color-accent))] text-white shadow-xs'
                  : 'bg-[#faf5f2] text-neutral-600 hover:bg-[#f3e7e1]'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por usuario, mensaje, ruta o palabra..."
            className="w-full rounded-xl border border-[#eaded6] bg-[#fdfaf8] pl-8 pr-7 py-1.5 text-xs text-[rgb(var(--color-neutral))] placeholder-neutral-400 focus:border-[rgb(var(--color-accent))] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-accent))]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Feedbacks Content List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-[#eaded6] bg-white/80 py-16 text-center">
          <svg className="animate-spin h-7 w-7 text-[rgb(var(--color-accent))] mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="text-xs font-semibold text-[rgb(var(--color-accent))]">
            Cargando reportes...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
          <p className="text-xs font-semibold">{error}</p>
          <button
            type="button"
            onClick={loadFeedbacks}
            className="mt-3 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
          >
            Reintentar
          </button>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#eaded6] bg-white/50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8ebe6] text-[rgb(var(--color-accent))] mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[rgb(var(--color-neutral))]">
            No hay reportes que mostrar
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-0.5">
            No se encontraron feedbacks coincidentes con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFeedbacks.map((item) => {
            const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.other;
            const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const isEditingThisNotes = editingNotesId === item.id;
            const isActionBusy = actionLoadingId === item.id;

            return (
              <div
                key={item.id}
                className="relative rounded-2xl border border-[#eaded6] bg-white p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all space-y-3"
              >
                {/* Top Row: Category + Status + Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f5ede8] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold ${cat.badge}`}
                    >
                      {cat.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${status.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      <span>{status.label}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-400 font-medium">
                    {formatTimestamp(item.created_at)}
                  </div>
                </div>

                {/* Author & Context row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f5d2dd,#b86773)] text-[10px] font-bold text-white shadow-xs">
                      {(item.profile?.username || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <span className="font-semibold text-[rgb(var(--color-neutral))]">
                      {item.profile?.username || 'Usuario'}
                    </span>
                    {item.profile?.role === 'admin' && (
                      <span className="rounded-md bg-[rgb(var(--color-accent))] px-1.5 py-0.2 text-[9px] font-bold text-white">
                        Admin
                      </span>
                    )}
                    {item.profile?.title && (
                      <span className="text-[10px] text-neutral-400">
                        ({item.profile.title})
                      </span>
                    )}
                  </div>

                  {item.route && (
                    <div className="flex items-center gap-1 font-mono text-[11px] bg-[#faf5f2] px-2 py-0.5 rounded border border-[#ede0d8] text-[rgb(var(--color-accent))]">
                      <span className="text-neutral-400">Ruta:</span>
                      <span>{item.route}</span>
                    </div>
                  )}
                </div>

                {/* Linked Content (Word or Sentence) */}
                {item.word && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50/70 border border-amber-200/80 px-3 py-1.5 text-xs text-amber-900">
                    <span className="font-semibold text-amber-700">Palabra:</span>
                    <span className="font-bold font-jp text-sm">{item.word.japanese}</span>
                    {item.word.romaji && <span className="text-amber-700">({item.word.romaji})</span>}
                    <span className="text-amber-600">→</span>
                    <span>{item.word.translation}</span>
                  </div>
                )}

                {item.sentence && (
                  <div className="flex items-center gap-2 rounded-xl bg-indigo-50/70 border border-indigo-200/80 px-3 py-1.5 text-xs text-indigo-900">
                    <span className="font-semibold text-indigo-700">Oración:</span>
                    <span className="font-bold font-jp text-xs">{item.sentence.full_japanese}</span>
                    <span className="text-indigo-600">→</span>
                    <span>{item.sentence.translation}</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="rounded-xl bg-[#fdfaf8] border border-[#f0e4de] p-3 text-xs sm:text-sm text-[rgb(var(--color-neutral))] leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </div>

                {/* Admin Notes Section */}
                <div className="rounded-xl border border-[#ede0d8] bg-[#faf6f3] p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[rgb(var(--color-accent))]">
                    <span>Notas administrativas</span>
                    {!isEditingThisNotes && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesId(item.id);
                          setNotesDraft(item.admin_notes || '');
                        }}
                        className="text-[11px] text-[rgb(var(--color-accent))] hover:underline font-semibold"
                      >
                        {item.admin_notes ? 'Editar nota' : '+ Agregar nota'}
                      </button>
                    )}
                  </div>

                  {isEditingThisNotes ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={2}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Escribe comentarios internos o solución aplicada..."
                        className="w-full rounded-lg border border-[#eaded6] bg-white p-2 text-xs text-[rgb(var(--color-neutral))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-accent))]"
                        disabled={isActionBusy}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          disabled={isActionBusy}
                          className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-neutral-500 hover:bg-neutral-200/50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(item.id)}
                          disabled={isActionBusy}
                          className="rounded-md bg-[rgb(var(--color-accent))] px-3 py-1 text-[11px] font-bold text-white hover:bg-[rgb(var(--color-accent-dark))]"
                        >
                          Guardar Nota
                        </button>
                      </div>
                    </div>
                  ) : item.admin_notes ? (
                    <p className="text-xs text-neutral-700 bg-white/80 p-2 rounded-lg border border-[#ebdcd3]">
                      {item.admin_notes}
                    </p>
                  ) : (
                    <p className="text-[11px] text-neutral-400 italic">
                      Sin notas registradas.
                    </p>
                  )}
                </div>

                {/* Bottom Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400 mr-1">
                      Estado:
                    </span>
                    {item.status !== 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'pending')}
                        disabled={isActionBusy}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition disabled:opacity-50"
                      >
                        Marcar pendiente
                      </button>
                    )}
                    {item.status !== 'reviewed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'reviewed')}
                        disabled={isActionBusy}
                        className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800 hover:bg-sky-100 transition disabled:opacity-50"
                      >
                        Marcar revisado
                      </button>
                    )}
                    {item.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'resolved')}
                        disabled={isActionBusy}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-50"
                      >
                        Marcar resuelto
                      </button>
                    )}
                    {item.status !== 'discarded' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'discarded')}
                        disabled={isActionBusy}
                        className="rounded-lg border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-200 transition disabled:opacity-50"
                      >
                        Descartar
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isActionBusy}
                    className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
