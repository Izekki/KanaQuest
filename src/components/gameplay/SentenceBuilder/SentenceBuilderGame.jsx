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

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
    }
  }, [initialTopicId]);

  // Core Game State
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [placedBlocks, setPlacedBlocks] = useState([]);
  const [validationState, setValidationState] = useState('idle'); // 'idle' | 'correct' | 'incorrect'
  const [draggingBlockId, setDraggingBlockId] = useState(null);

  // Metrics
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // 1. Fetch topics and sentences on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
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

    // Verify sequential display_order: block at index i must have display_order === i + 1
    const isCorrect = placedBlocks.every((block, idx) => block.display_order === idx + 1);

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

      if (userId) {
        await recordSentenceProgress({
          userId,
          sentenceId: currentSentence.id,
          correct: false,
        });
      }
    }
  };

  // 6. Navigation and Reset
  const handleReset = () => {
    if (currentSentence) {
      initSentence(currentSentence);
    }
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (onFinishSession) {
      onFinishSession({ score, total: sentences.length, attempts });
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
      </Card>
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
