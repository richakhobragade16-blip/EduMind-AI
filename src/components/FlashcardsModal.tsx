import React, { useState, useEffect } from "react";
import {
  X,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Layers,
} from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialContext?: string;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  initialTopic = "",
  initialContext = "",
}) => {
  const [topic, setTopic] = useState(initialTopic || "Computer Science Fundamentals");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      if (initialTopic) setTopic(initialTopic);
      // If we don't have cards yet or topic changed, generate
      if (cards.length === 0) {
        generateFlashcards(initialTopic || topic);
      }
    }
  }, [isOpen]);

  const generateFlashcards = async (studyTopic: string) => {
    setIsLoading(true);
    setError(null);
    setNotice(null);
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(0);
    setMasteredIds(new Set());

    try {
      const res = await fetch("/api/study-tools/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: studyTopic,
          context: initialContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate flashcards.");
      }

      if (Array.isArray(data.flashcards) && data.flashcards.length > 0) {
        setCards(data.flashcards);
        if (data.notice) {
          setNotice(data.notice);
        }
      } else {
        throw new Error("No flashcards could be generated for this topic.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentCard = cards[currentIndex];
  const isMastered = currentCard ? masteredIds.has(currentCard.id) : false;

  const toggleMastered = (cardId: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      id="flashcards-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="flashcards-modal-container"
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Active Recall Flashcards
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Spaced repetition & memory reinforcement
              </p>
            </div>
          </div>

          <button
            id="close-flashcards-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Input Bar */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 flex gap-2">
          <input
            id="flashcards-topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                generateFlashcards(topic);
              }
            }}
            placeholder="Enter any topic or subject to study..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            id="generate-flashcards-btn"
            onClick={() => generateFlashcards(topic)}
            disabled={isLoading || !topic.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Deck</span>
              </>
            )}
          </button>
        </div>

        {/* Main Card Viewport */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Generating smart flashcards...
              </p>
              <p className="text-xs text-neutral-400">
                Extracting core definitions and recall points with Gemini
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8 space-y-3 max-w-sm">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </p>
              <button
                onClick={() => generateFlashcards(topic)}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              >
                Try Again
              </button>
            </div>
          ) : currentCard ? (
            <div className="w-full space-y-5">
              {notice && (
                <div className="px-3.5 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>{notice}</span>
                  </div>
                  <button
                    onClick={() => generateFlashcards(topic)}
                    className="underline hover:text-indigo-900 dark:hover:text-indigo-100 shrink-0 font-medium ml-2"
                  >
                    Refresh
                  </button>
                </div>
              )}

              {/* Progress & Deck Status */}
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>
                  Card <strong className="text-indigo-600 dark:text-indigo-400">{currentIndex + 1}</strong> of {cards.length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Mastered: {masteredIds.size}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
              </div>

              {/* Interactive Flip Card Container */}
              <div
                id="interactive-flip-card"
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer select-none relative min-h-[220px] sm:min-h-[240px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 transition-all duration-300 shadow-sm hover:shadow-md bg-linear-to-b from-white to-neutral-50/50 dark:from-neutral-800 dark:to-neutral-850 border-indigo-100 dark:border-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/40">
                    {isFlipped ? "Answer" : "Question"}
                  </span>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <RotateCw className="w-3 h-3" />
                    <span>Click card to flip</span>
                  </span>
                </div>

                <div className="my-auto py-4 text-center">
                  <p className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white leading-relaxed">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </p>

                  {/* Hint Toggle */}
                  {!isFlipped && currentCard.hint && (
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                      {showHint ? (
                        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 px-3 py-1.5 rounded-xl inline-block max-w-md">
                          💡 Hint: {currentCard.hint}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowHint(true)}
                          className="text-xs text-neutral-400 hover:text-amber-500 inline-flex items-center gap-1 transition-colors"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Show hint</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-750 text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMastered(currentCard.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-medium transition-colors ${
                      isMastered
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60"
                        : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isMastered ? "Mastered" : "Mark as Mastered"}</span>
                  </button>

                  <span className="text-[11px] text-neutral-400">
                    {isFlipped ? "Flip back" : "Tap for answer"}
                  </span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  id="prev-flashcard-btn"
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  id="flip-flashcard-btn"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                >
                  Flip Card
                </button>

                <button
                  id="next-flashcard-btn"
                  onClick={nextCard}
                  disabled={currentIndex === cards.length - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">No cards to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};
