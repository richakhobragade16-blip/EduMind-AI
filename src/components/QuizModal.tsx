import React, { useState, useEffect } from "react";
import {
  X,
  RotateCw,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { QuizQuestion } from "../types";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialContext?: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  initialTopic = "",
  initialContext = "",
}) => {
  const [topic, setTopic] = useState(initialTopic || "Data Structures and Algorithms");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTopic) setTopic(initialTopic);
      if (questions.length === 0) {
        generateQuiz(initialTopic || topic);
      }
    }
  }, [isOpen]);

  const generateQuiz = async (quizTopic: string) => {
    setIsLoading(true);
    setError(null);
    setNotice(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswered(false);
    setIsCompleted(false);

    try {
      const res = await fetch("/api/study-tools/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quizTopic,
          context: initialContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate quiz.");
      }

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        if (data.notice) {
          setNotice(data.notice);
        }
      } else {
        throw new Error("No quiz questions could be generated.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const userSelectedIndex = selectedAnswers[currentIndex];
  const isCurrentAnswered = userSelectedIndex !== undefined;

  const handleSelectOption = (index: number) => {
    if (isCurrentAnswered) return; // Prevent changing after answer
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: index }));
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      setIsCompleted(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div
      id="quiz-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quiz-modal-container"
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Interactive Practice Quiz
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Test and benchmark your topic mastery
              </p>
            </div>
          </div>

          <button
            id="close-quiz-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Input */}
        {!isCompleted && (
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 flex gap-2">
            <input
              id="quiz-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  generateQuiz(topic);
                }
              }}
              placeholder="Enter subject or topic to quiz..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              id="generate-quiz-btn"
              onClick={() => generateQuiz(topic)}
              disabled={isLoading || !topic.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Quiz</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Quiz Content Viewport */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[300px] flex flex-col justify-center">
          {isLoading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Generating challenge questions...
              </p>
              <p className="text-xs text-neutral-400">
                Formulating multi-choice problems and explanations
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8 space-y-3 max-w-sm mx-auto">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </p>
              <button
                onClick={() => generateQuiz(topic)}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
              >
                Try Again
              </button>
            </div>
          ) : isCompleted ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Quiz Completed!
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Topic: <span className="font-semibold text-neutral-700 dark:text-neutral-200">{topic}</span>
                </p>
              </div>

              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <div className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {calculateScore()} / {questions.length}
                </div>
                <div className="text-xs font-medium text-neutral-500 mt-1">
                  {Math.round((calculateScore() / questions.length) * 100)}% Accuracy
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                  {calculateScore() === questions.length
                    ? "🌟 Perfect score! Outstanding mastery."
                    : calculateScore() >= questions.length / 2
                    ? "👍 Solid effort! Review explanations below."
                    : "📚 Keep studying and re-take for better retention."}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  id="retake-quiz-btn"
                  onClick={() => generateQuiz(topic)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Take Another Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : currentQ ? (
            /* Active Question Screen */
            <div className="space-y-5">
              {notice && (
                <div className="px-3.5 py-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span>{notice}</span>
                  </div>
                  <button
                    onClick={() => generateQuiz(topic)}
                    className="underline hover:text-emerald-900 dark:hover:text-emerald-100 shrink-0 font-medium ml-2"
                  >
                    Refresh
                  </button>
                </div>
              )}

              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>
                  Question <strong className="text-emerald-600 dark:text-emerald-400">{currentIndex + 1}</strong> of {questions.length}
                </span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                  Multiple Choice
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Statement */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700">
                <h4 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = userSelectedIndex === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const showResult = isCurrentAnswered;

                  let btnStyle =
                    "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-emerald-300 dark:hover:border-emerald-700";

                  if (showResult) {
                    if (isCorrect) {
                      btnStyle =
                        "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold";
                    } else if (isSelected && !isCorrect) {
                      btnStyle =
                        "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold";
                    } else {
                      btnStyle =
                        "border-neutral-200 dark:border-neutral-800 opacity-50 bg-neutral-50 dark:bg-neutral-900 text-neutral-500";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`quiz-opt-${optIdx}`}
                      disabled={isCurrentAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>

                      {showResult && (
                        <div className="shrink-0 ml-2">
                          {isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card (Revealed after selection) */}
              {isCurrentAnswered && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1 animate-in fade-in duration-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isCurrentAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    id="quiz-next-btn"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>
                      {currentIndex === questions.length - 1
                        ? "View Final Score"
                        : "Next Question"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 text-center">No questions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
