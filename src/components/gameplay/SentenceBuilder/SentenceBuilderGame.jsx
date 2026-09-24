import React, { useState, useEffect, useCallback } from 'react';
import { fetchSentences, recordSentenceProgress, fetchTopics } from '../../../services/supabase/sentences';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import SentenceDropZone from './SentenceDropZone';
import WordBank from './WordBank';
import GrammarColorLegend from './GrammarColorLegend';
import Icon from '../../ui/Icon';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getBlockText(block) {
  if (!block) return '';
  return (
    block.words?.hiragana ||
    block.hiragana ||
    block.words?.katakana ||
    block.katakana ||
    block.words?.japanese ||
    block.japanese ||
    ''
  );
}

function speakJapanese(text, rate = 0.85) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export default function SentenceBuilderGame({
  userId = null,
  initialTopicId = null,
  onBackToLobby = null,
  onFinishSession = null,
}) {
  const { playFlip, playSuccess, playError, playComplete } = useSoundEffects();
  const [loading, setLoading] = useState(true);
  const [sentences, setSentences] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId || 'all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Core Game State
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [placedBlocks, setPlacedBlocks] = useState([]);
  const [validationState, setValidationState] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [draggingBlockId, setDraggingBlockId] = useState(null);

  // Metrics & Tracking
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [failedSentences, setFailedSentences] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showGrammarDrawer, setShowGrammarDrawer] = useState(false);

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
    }
  }, [initialTopicId]);

  // 1. Fetch topics and sentences on mount / topic change
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setIsGameOver(false);
      setFailedSentences([]);
      setScore(0);
      setStreak(0);
      setAttempts(0);
      try {
        const [topicsRes, sentencesRes] = await Promise.all([
          fetchTopics(),
          fetchSentences({ topicId: selectedTopicId === 'all' ? null : selectedTopicId }),
        ]);

        if (topicsRes.data) setTopics(topicsRes.data);
        if (sentencesRes.data && sentencesRes.data.length > 0) {
          const shuffledSentences = shuffleArray(sentencesRes.data);
          setSentences(shuffledSentences);
          setCurrentIndex(0);
        } else {
          setSentences([]);
        }
      } catch (err) {
        console.error('Error cargando oraciones:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedTopicId]);

  // 2. Initialize Sentence when currentIndex or sentences array changes
  const currentSentence = sentences[currentIndex] || null;
  const rawBlocks = currentSentence?.sentence_blocks || currentSentence?.sentence_words || [];
  const totalBlocksCount = rawBlocks.length;

  const initSentence = useCallback((sentence) => {
    if (!sentence) return;

    const words = [...(sentence.sentence_blocks || sentence.sentence_words || [])];
    const initialPlaced = [];
    const initialAvailable = [];

    // Separate fixed vs draggable
    words.forEach((w) => {
      if (w.is_fixed) {
        initialPlaced.push(w);
      } else {
        initialAvailable.push(w);
      }
    });

    // Sort placed blocks by display_order or position_index
    initialPlaced.sort((a, b) => (a.display_order ?? a.position_index ?? 0) - (b.display_order ?? b.position_index ?? 0));

    // Shuffle available blocks
    const shuffledAvailable = shuffleArray(initialAvailable);

    setPlacedBlocks(initialPlaced);
    setAvailableBlocks(shuffledAvailable);
    setValidationState('idle');
  }, []);

  useEffect(() => {
    if (currentSentence) {
      initSentence(currentSentence);
    }
  }, [currentSentence, initSentence]);

  // 3. Move blocks between zones (Click & Tap interaction)
  const handleBlockClick = (block, location) => {
    if (block.is_fixed || validationState === 'correct') return;

    playFlip();

    if (location === 'available') {
      // Move from available bank to placed zone
      setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setPlacedBlocks((prev) => [...prev, block]);
      setValidationState('idle');
    } else if (location === 'placed') {
      // Return from placed zone to available bank
      setPlacedBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setAvailableBlocks((prev) => [...prev, block]);
      setValidationState('idle');
    }
  };

  // 4. Drag and Drop handlers
  const handleDragStart = (block) => {
    setDraggingBlockId(block.id);
  };

  const handleDragEnd = () => {
    setDraggingBlockId(null);
  };

  const handleDropToPlaced = (draggedItem, targetIndex) => {
    const { blockId, location: sourceLocation, index: sourceIndex } = draggedItem;
    let movedBlock = null;

    if (sourceLocation === 'available') {
      movedBlock = availableBlocks.find((b) => b.id === blockId);
      if (!movedBlock) return;
      playFlip();
      setAvailableBlocks((prev) => prev.filter((b) => b.id !== blockId));
      setPlacedBlocks((prev) => {
        const next = [...prev];
        const insertAt = typeof targetIndex === 'number' ? targetIndex : next.length;
        next.splice(insertAt, 0, movedBlock);
        return next;
      });
    } else if (sourceLocation === 'placed') {
      movedBlock = placedBlocks.find((b) => b.id === blockId);
      if (!movedBlock || sourceIndex === targetIndex) return;
      playFlip();
      setPlacedBlocks((prev) => {
        const next = [...prev];
        next.splice(sourceIndex, 1);
        const insertAt = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
        next.splice(insertAt, 0, movedBlock);
        return next;
      });
    }
    setValidationState('idle');
  };

  const handleDropToAvailable = (draggedItem) => {
    const { blockId, location: sourceLocation } = draggedItem;
    if (sourceLocation !== 'placed') return;

    const block = placedBlocks.find((b) => b.id === blockId);
    if (!block || block.is_fixed) return;

    playFlip();
    setPlacedBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setAvailableBlocks((prev) => [...prev, block]);
    setValidationState('idle');
  };

  // 5. Check Answer Validation
  const checkAnswer = async () => {
    if (!currentSentence) return;

    setAttempts((prev) => prev + 1);

    const userOrderedText = placedBlocks.map(getBlockText).join('');
    const expectedOrderedWords = [...rawBlocks].sort(
      (a, b) => (a.display_order ?? a.position_index ?? 0) - (b.display_order ?? b.position_index ?? 0)
    );
    const expectedText = expectedOrderedWords.map(getBlockText).join('');

    const isMatch = userOrderedText === expectedText;

    if (isMatch) {
      playSuccess();
      setValidationState('correct');
      setScore((prev) => prev + 20);
      setStreak((prev) => prev + 1);

      speakJapanese(currentSentence.full_japanese);

      if (userId) {
        await recordSentenceProgress({
          userId,
          sentenceId: currentSentence.id,
          correct: true,
        });
      }
    } else {
      playError();
      setValidationState('incorrect');
      setStreak(0);
      setFailedSentences((prev) => {
        if (prev.some((s) => s.id === currentSentence.id)) return prev;
        return [...prev, currentSentence];
      });

      if (userId) {
        await recordSentenceProgress({
          userId,
          sentenceId: currentSentence.id,
          correct: false,
        });
      }
    }
  };

  const handleReset = () => {
    playFlip();
    if (currentSentence) {
      initSentence(currentSentence);
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      playFlip();
      setCurrentIndex((prev) => prev + 1);
    } else {
      playComplete();
      setIsGameOver(true);
      if (onFinishSession) {
        onFinishSession({
          score,
          total: sentences.length,
          attempts,
          failedCount: failedSentences.length,
        });
      }
    }
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setFailedSentences([]);
    setIsGameOver(false);
    setCurrentIndex(0);
    const shuffled = shuffleArray(sentences);
    setSentences(shuffled);
    if (shuffled.length > 0) {
      initSentence(shuffled[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center p-8 text-center">
        <div className="space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6b2832] border-t-transparent mx-auto" />
          <p className="text-sm font-semibold text-[#6b2832]/70">Cargando oraciones y bloques...</p>
        </div>
      </div>
    );
  }

  if (sentences.length === 0) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto bg-white rounded-3xl border border-[#eaded6]">
        <Icon name="torii-gate" className="w-12 h-12 text-[#6b2832] mx-auto" />
        <h3 className="text-xl font-bold text-[#6b2832]">No hay oraciones disponibles</h3>
        <p className="text-sm text-[rgb(var(--color-neutral))]/70">
          No se encontraron oraciones para el tema seleccionado.
        </p>
        {onBackToLobby && (
          <button
            type="button"
            onClick={onBackToLobby}
            className="px-6 py-2.5 rounded-xl bg-[#6b2832] text-white font-bold text-sm"
          >
            ← Volver a Temas
          </button>
        )}
      </div>
    );
  }

  // 7. Render Game Over / Session Summary Screen
  if (isGameOver) {
    const accuracy =
      sentences.length > 0
        ? Math.max(0, Math.round(((sentences.length - failedSentences.length) / sentences.length) * 100))
        : 100;
    const isPerfect = failedSentences.length === 0;

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeIn py-4">
        <div className="rounded-3xl border border-[#eaded6] bg-white p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl mx-auto">
            {isPerfect ? '👑' : '🎉'}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#6b2832]">
              {isPerfect ? '¡Lección Perfecta!' : '¡Lección Completada!'}
            </h2>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-neutral))]/70">
              Has terminado de construir todas las oraciones de esta sesión.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-y border-[#f2e7e1] py-4 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-amber-600">+{score}</div>
              <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase">
                Puntos
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700">{accuracy}%</div>
              <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase">
                Precisión
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#6b2832]">{sentences.length}</div>
              <div className="text-[11px] font-semibold text-[rgb(var(--color-neutral))]/60 uppercase">
                Oraciones
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onBackToLobby && (
              <button
                type="button"
                onClick={onBackToLobby}
                className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-[#6b2832] text-white font-bold text-sm hover:bg-[#581f27] active:scale-98 transition cursor-pointer"
              >
                ← Volver a Temas
              </button>
            )}
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl border border-[#eaded6] bg-white text-[#6b2832] font-semibold text-sm hover:bg-[#faf4f2] active:scale-98 transition cursor-pointer"
            >
              ↻ Repetir Lección
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / sentences.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* 1. TOP HEADER & PROGRESS STRIP */}
      <header className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            type="button"
            onClick={onBackToLobby || (() => window.history.back())}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6b2832]/75 hover:text-[#6b2832] transition py-1 px-2 rounded-lg hover:bg-black/5"
            aria-label="Volver a selección de temas"
          >
            <span className="text-base leading-none">←</span>
            <span>Temas</span>
          </button>

          {/* Topic Badge if available */}
          {currentSentence?.topics?.title_es && (
            <span className="text-xs font-bold text-[#6b2832] bg-[#f5ebe6] border border-[#eaded6] px-3 py-1 rounded-xl truncate max-w-[180px]">
              {currentSentence.topics.title_es}
            </span>
          )}

          {/* Grammar Colors Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowGrammarDrawer(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#eaded6] bg-white px-2.5 py-1.5 text-xs font-bold text-[#6b2832] shadow-2xs hover:bg-[#fbf5f2] transition cursor-pointer"
            title="Ver guía de colores gramaticales"
            aria-label="Ver guía de colores gramaticales"
          >
            <Icon name="palette" className="w-3.5 h-3.5 text-[#6b2832]" />
            <span className="hidden sm:inline">Colores</span>
          </button>
        </div>

        {/* Clean Progress Strip: "Oración 3 / 10" */}
        <div className="w-full pt-1">
          <div className="flex items-center justify-between text-xs font-medium text-[rgb(var(--color-neutral))]/70 pb-1.5">
            <span className="font-semibold text-[#6b2832]">Construcción</span>
            <span className="font-mono font-bold text-[#6b2832]">
              Oración {currentIndex + 1} de {sentences.length}
            </span>
          </div>
          <div className="w-full bg-[#f0e4de] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#6b2832] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. THE ABSOLUTE PROTAGONIST: CONTRUCTION STAGE */}
      <main className="space-y-4 sm:space-y-6">
        {/* Context / Prompt */}
        <div className="text-center space-y-1.5 pt-1">
          <span className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-[#6b2832]/60">
            Construye la oración en japonés
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#6b2832] leading-snug px-2">
            "{currentSentence?.translation}"
          </h2>
        </div>

        {/* Drop Zone: Visual Protagonist Container */}
        <div className="w-full">
          <SentenceDropZone
            placedBlocks={placedBlocks}
            totalRequired={totalBlocksCount}
            validationState={validationState}
            onDropToPlaced={handleDropToPlaced}
            onBlockClick={handleBlockClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingBlockId={draggingBlockId}
          />
        </div>

        {/* Word Bank: Available Chips directly below */}
        <div className="w-full">
          <WordBank
            availableBlocks={availableBlocks}
            onDropToAvailable={handleDropToAvailable}
            onBlockClick={handleBlockClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingBlockId={draggingBlockId}
          />
        </div>

        {/* Semantic Feedback Banner */}
        {validationState === 'correct' && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 text-emerald-950 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-600">✓</span>
              <div>
                <span className="font-bold text-sm sm:text-base">¡Correcto!</span>
                <div className="font-bold text-base sm:text-lg text-emerald-900 mt-0.5">
                  {currentSentence?.full_japanese}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakJapanese(currentSentence?.full_japanese, 0.85)}
              className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-300 shadow-2xs hover:bg-emerald-100/50 cursor-pointer"
            >
              <Icon name="volume-high" className="w-3.5 h-3.5" />
              <span>Escuchar</span>
            </button>
          </div>
        )}

        {validationState === 'incorrect' && (
          <div className="rounded-2xl border border-rose-300 bg-rose-50/95 p-4 text-rose-950 flex items-center gap-2.5 animate-shake">
            <span className="text-xl font-bold text-rose-600">✕</span>
            <span className="text-sm font-semibold">
              El orden no es el correcto. Revisa las fichas e inténtalo de nuevo.
            </span>
          </div>
        )}

        {/* Action Buttons: Clean row */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={placedBlocks.length === 0 && validationState === 'idle'}
            className="w-1/3 sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl border border-[#eaded6] bg-white text-xs sm:text-sm font-semibold text-[#6b2832] hover:bg-[#faf4f2] active:scale-98 transition disabled:opacity-40 cursor-pointer"
          >
            ↺ Reiniciar
          </button>

          {validationState !== 'correct' ? (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={placedBlocks.length === 0}
              className="w-2/3 sm:w-auto sm:px-8 min-h-[48px] rounded-xl bg-[#6b2832] text-white text-sm font-bold shadow-md hover:bg-[#581f27] active:scale-98 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Comprobar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-2/3 sm:w-auto sm:px-8 min-h-[48px] rounded-xl bg-emerald-700 text-white text-sm font-bold shadow-md hover:bg-emerald-800 active:scale-98 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{currentIndex < sentences.length - 1 ? 'Siguiente Oración' : 'Finalizar Lección'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </main>

      {/* 3. GRAMMAR COLOR GUIDE MODAL / DRAWER */}
      {showGrammarDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setShowGrammarDrawer(false)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-md rounded-3xl border border-[#eaded6] bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[#f2e2da] pb-3">
              <div className="flex items-center gap-2">
                <Icon name="palette" className="w-5 h-5 text-[#6b2832]" />
                <h3 className="text-base sm:text-lg font-bold text-[#6b2832]">
                  Guía de Colores Gramaticales
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGrammarDrawer(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-[#fbf5f2] hover:text-[#6b2832] transition cursor-pointer"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
              <GrammarColorLegend className="border-0 shadow-none p-0 bg-transparent" showHeader={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
