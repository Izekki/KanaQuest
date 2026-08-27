import React, { useState, useEffect, useCallback } from 'react';
import { fetchSentences, recordSentenceProgress, fetchTopics } from '../../../services/supabase/sentences';
import SentenceDropZone from './SentenceDropZone';
import WordBank from './WordBank';
import GrammarColorLegend from './GrammarColorLegend';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Card from '../../ui/Card';

/**
 * Utility to shuffle an array immutably
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Resolves the display text of a word block (Hiragana -> Katakana -> Japanese fallback)
 */
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

/**
 * Speaks Japanese text using the native Web Speech API
 * @param {string} text
 * @param {number} [rate=0.85]
 */
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

/**
 * SentenceBuilderGame Component
 *
 * Main game controller for the Sentence Builder mode in KanaQuest.
 * Handles state management, drag & drop, Supabase data fetching, and answer validation.
 */
export default function SentenceBuilderGame({
  userId = null,
  initialTopicId = null,
  onBackToLobby = null,
  onFinishSession = null,
}) {
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
          setSentences(sentencesRes.data);
          setCurrentIndex(0);
        } else {
          setSentences([]);
        }
      } catch (err) {
        console.error('Failed to load Sentence Builder content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedTopicId]);

  // 2. Initialize blocks whenever current sentence changes
  const initSentence = useCallback((sentence) => {
    if (!sentence || !sentence.sentence_blocks) {
      setAvailableBlocks([]);
      setPlacedBlocks([]);
      setValidationState('idle');
      return;
    }

    const rawBlocks = sentence.sentence_blocks;
    const initialPlaced = [];
    const initialAvailable = [];

    // Separate fixed blocks vs free draggable blocks
    rawBlocks.forEach((block) => {
      if (block.is_fixed) {
        initialPlaced.push(block);
      } else {
        initialAvailable.push(block);
      }
    });

    setPlacedBlocks(initialPlaced);
    setAvailableBlocks(shuffleArray(initialAvailable));
    setValidationState('idle');
  }, []);

  useEffect(() => {
    if (sentences.length > 0 && sentences[currentIndex]) {
      initSentence(sentences[currentIndex]);
    }
  }, [sentences, currentIndex, initSentence]);

  const currentSentence = sentences[currentIndex] || null;
  const totalBlocksCount = currentSentence?.sentence_blocks?.length || 0;

  // 3. Move Handlers (Click / Tap)
  const handleBlockClick = (block, location, index) => {
    if (validationState === 'correct') return; // Locked once answered correctly
    if (block.is_fixed) return; // Cannot move fixed blocks

    if (location === 'available') {
      // Move from available to placed
      setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setPlacedBlocks((prev) => [...prev, block]);
      setValidationState('idle');
    } else if (location === 'placed') {
      // Move from placed back to available
      setPlacedBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setAvailableBlocks((prev) => [...prev, block]);
      setValidationState('idle');
    }
  };

  // 4. Drag and Drop Handlers
  const handleDragStart = (block) => {
    setDraggingBlockId(block.id);
  };

  const handleDragEnd = () => {
    setDraggingBlockId(null);
  };

  const handleDropToPlaced = (dragData, targetIndex) => {
    const { blockId, location, index: sourceIndex } = dragData;
    setValidationState('idle');

    if (location === 'available') {
      // Dragged from bank into placed zone
      const block = availableBlocks.find((b) => b.id === blockId);
      if (!block) return;

      setAvailableBlocks((prev) => prev.filter((b) => b.id !== blockId));
      setPlacedBlocks((prev) => {
        const next = [...prev];
        const insertAt = Math.min(targetIndex, next.length);
        next.splice(insertAt, 0, block);
        return next;
      });
    } else if (location === 'placed') {
      // Reordering within placed zone
      if (sourceIndex === targetIndex) return;

      setPlacedBlocks((prev) => {
        const next = [...prev];
        const [movedItem] = next.splice(sourceIndex, 1);
        const insertAt = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
        next.splice(insertAt, 0, movedItem);
        return next;
      });
    }
  };

  const handleDropToAvailable = (dragData) => {
    const { blockId, location } = dragData;
    if (location !== 'placed') return;

    const block = placedBlocks.find((b) => b.id === blockId);
    if (!block || block.is_fixed) return;

    setPlacedBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setAvailableBlocks((prev) => [...prev, block]);
    setValidationState('idle');
  };

  // 5. Validation Logic (checkAnswer)
  const checkAnswer = async () => {
    if (!currentSentence) return;

    // Must place all blocks first
    if (placedBlocks.length !== totalBlocksCount) {
      setValidationState('incorrect');
      return;
    }

    setAttempts((prev) => prev + 1);

    const sortedExpectedBlocks = [...(currentSentence.sentence_blocks || [])].sort(
      (a, b) => a.display_order - b.display_order
    );

    // Verify sequential correctness: allows interchangeable duplicate words (e.g. multiple identical 'は' particles)
    const isCorrect =
      placedBlocks.length === sortedExpectedBlocks.length &&
      placedBlocks.every((block, idx) => {
        const expectedBlock = sortedExpectedBlocks[idx];
        if (!expectedBlock) return false;

        // 1. Direct display_order match
        if (block.display_order === expectedBlock.display_order) return true;

        // 2. Same vocabulary word (word_id)
        if (block.word_id && expectedBlock.word_id && block.word_id === expectedBlock.word_id) {
          return true;
        }

        // 3. Exact text content match
        return getBlockText(block) === getBlockText(expectedBlock);
      });

    if (isCorrect) {
      setValidationState('correct');
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);

      // Pronounce full Japanese sentence via Web Speech API (rate: 0.85, lang: ja-JP)
      speakJapanese(currentSentence.full_japanese, 0.85);

      if (userId) {
        await recordSentenceProgress({
          userId,
          sentenceId: currentSentence.id,
          correct: true,
        });
      }
    } else {
      setValidationState('incorrect');
      setStreak(0);

      // Track failed sentences for final session summary
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

  // 6. Navigation, Restart, and Finish
  const handleReset = () => {
    if (currentSentence) {
      initSentence(currentSentence);
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
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
    if (sentences.length > 0) {
      initSentence(sentences[0]);
    }
  };

  if (loading) {
    return (
      <Card className="flex min-h-[300px] items-center justify-center p-8 text-center">
        <div className="space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto" />
          <p className="text-sm font-medium text-neutral/70">Cargando oraciones y bloques...</p>
        </div>
      </Card>
    );
  }

  if (sentences.length === 0) {
    return (
      <Card className="p-8 text-center space-y-4">
        <span className="text-4xl">⛩️</span>
        <h3 className="text-xl font-bold text-neutral">No hay oraciones disponibles</h3>
        <p className="text-sm text-neutral/70">
          No se encontraron oraciones para el tema seleccionado. Prueba cambiando de tema o agregando oraciones a la base de datos.
        </p>
        {onBackToLobby && (
          <div className="pt-2">
            <Button type="button" variant="primary" onClick={onBackToLobby}>
              ← Volver al Lobby
            </Button>
          </div>
        )}
      </Card>
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
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn py-2">
        {/* Main Victory Card */}
        <div className="rounded-3xl border border-[#eaded6] bg-white/95 p-8 sm:p-10 shadow-[0_14px_40px_rgba(128,43,56,0.1)] text-center space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-rose-100 to-accent/20 text-4xl shadow-inner mx-auto">
            {isPerfect ? '👑' : '🌸'}
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[rgb(var(--color-neutral))]">
              {isPerfect ? '¡Lección Perfecta!' : '¡Lección Completada!'}
            </h2>
            <p className="text-sm sm:text-base text-[rgb(var(--color-neutral))]/70 max-w-md mx-auto">
              Has terminado de construir todas las oraciones de esta sesión.
            </p>
          </div>

          {/* Stats Bar Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto pt-2">
            <div className="rounded-2xl border border-[#eaded6] bg-[#faf6f4] p-4 text-center">
              <span className="text-xl">⭐</span>
              <div className="text-xl sm:text-2xl font-bold text-accent mt-1">+{score}</div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-[rgb(var(--color-neutral))]/60">
                Puntaje Total
              </div>
            </div>

            <div className="rounded-2xl border border-[#eaded6] bg-[#faf6f4] p-4 text-center">
              <span className="text-xl">🎯</span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">{accuracy}%</div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-[rgb(var(--color-neutral))]/60">
                Precisión
              </div>
            </div>

            <div className="rounded-2xl border border-[#eaded6] bg-[#faf6f4] p-4 text-center">
              <span className="text-xl">⛩️</span>
              <div className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-neutral))] mt-1">
                {sentences.length}
              </div>
              <div className="text-[11px] uppercase font-bold tracking-wider text-[rgb(var(--color-neutral))]/60">
                Oraciones
              </div>
            </div>
          </div>

          {/* Review of Failed Sentences or Perfect Message */}
          {isPerfect ? (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-5 text-emerald-900 text-sm font-medium text-center">
              🎉 <strong className="font-bold">¡Perfecto! Ningún error.</strong> Has completado todas las oraciones de forma impecable.
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-[#eaded6]/60 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[rgb(var(--color-neutral))] flex items-center gap-2">
                  <span>📝</span> Oraciones para Repasar ({failedSentences.length})
                </h3>
                <span className="text-xs text-[rgb(var(--color-neutral))]/60">
                  Escucha la pronunciación correcta
                </span>
              </div>

              <div className="space-y-3">
                {failedSentences.map((sentence, idx) => (
                  <div
                    key={sentence.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 transition hover:bg-amber-50"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[rgb(var(--color-neutral))]/65">
                        "{sentence.translation}"
                      </div>
                      <div className="text-lg font-bold text-[rgb(var(--color-neutral))] font-sans">
                        {sentence.full_japanese}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakJapanese(sentence.full_japanese, 0.85)}
                      className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-xl border border-[#eaded6] bg-white px-3 py-2 text-xs font-semibold text-accent shadow-sm hover:bg-[#f8ebe6] transition-colors cursor-pointer"
                      title="Escuchar pronunciación"
                    >
                      <span>🔊</span> Escuchar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {onBackToLobby && (
              <Button
                type="button"
                variant="primary"
                onClick={onBackToLobby}
                className="w-full sm:w-auto px-8"
              >
                ← Volver al Lobby
              </Button>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={handleRestart}
              className="w-full sm:w-auto px-6"
            >
              ↻ Repetir Lección
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Interactive Construction Zone (Left Column) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-surface/90 border border-cream/50 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Badge variant="accent">
                Oración {currentIndex + 1} de {sentences.length}
              </Badge>
              {currentSentence.topics && (
                <Badge variant="cream">
                  {currentSentence.topics.title_es}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm font-semibold text-neutral">
              <span>Puntaje: <strong className="text-accent">{score}</strong></span>
              <span>Racha: <strong className="text-emerald-700">🔥 {streak}</strong></span>
            </div>
          </div>

          {/* Main Prompt Card */}
          <div className="rounded-3xl border border-cream/80 bg-surface p-6 sm:p-8 shadow-md text-center space-y-4">
            <div className="text-xs uppercase font-bold tracking-[0.2em] text-neutral/50">
              Traduce y construye la oración en japonés
            </div>

            {/* Spanish Translation Prompt */}
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral">
              "{currentSentence.translation}"
            </h2>

            {/* Optional Image */}
            {currentSentence.image_url && (
              <img
                src={currentSentence.image_url}
                alt={currentSentence.translation}
                className="mx-auto h-36 rounded-2xl object-cover shadow-sm border border-cream/30"
              />
            )}

            {/* Drop Zone (Response Construction Area) */}
            <div className="pt-4">
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

            {/* Word Bank (Available Options) */}
            <div className="pt-2">
              <WordBank
                availableBlocks={availableBlocks}
                onDropToAvailable={handleDropToAvailable}
                onBlockClick={handleBlockClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggingBlockId={draggingBlockId}
              />
            </div>

            {/* Feedback Message */}
            {validationState === 'correct' && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-800 text-sm font-medium animate-fadeIn">
                <div className="text-left">
                  🎉 ¡Excelente! Orden correcto: <strong className="font-bold text-base ml-1">{currentSentence.full_japanese}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => speakJapanese(currentSentence.full_japanese, 0.85)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm hover:bg-emerald-100 transition-colors cursor-pointer"
                  title="Volver a escuchar pronunciación"
                >
                  <span>🔊</span> Escuchar
                </button>
              </div>
            )}

            {validationState === 'incorrect' && (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-800 text-sm font-medium animate-shake">
                ❌ El orden de las palabras no es el correcto. ¡Inténtalo de nuevo!
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={placedBlocks.length === 0 && validationState === 'idle'}
              >
                ↺ Reiniciar Fichas
              </Button>

              {validationState !== 'correct' ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={checkAnswer}
                  disabled={placedBlocks.length === 0}
                >
                  ✓ Comprobar Respuesta
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                >
                  {currentIndex < sentences.length - 1 ? 'Siguiente Oración ➔' : 'Finalizar Sesión 🏁'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Grammar Color Legend */}
        <div className="lg:col-span-4 sticky top-6 space-y-6">
          <GrammarColorLegend />
        </div>
      </div>
    </div>
  );
}
