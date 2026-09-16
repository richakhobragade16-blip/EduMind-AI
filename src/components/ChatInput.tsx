import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Square,
  Sparkles,
  Lightbulb,
  Code,
  FileCheck2,
  FileText,
  Calendar,
  Briefcase,
  Layers,
} from "lucide-react";
import { StudyMode } from "../types";

interface ChatInputProps {
  onSendMessage: (content: string, mode: StudyMode) => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  currentMode: StudyMode;
  onChangeMode: (mode: StudyMode) => void;
}

const MAX_CHARS = 4000;

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isGenerating,
  onStopGeneration,
  currentMode,
  onChangeMode,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modeDetails: Record<
    StudyMode,
    { label: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    general: { label: "General Study", icon: Sparkles },
    concept: { label: "Concept Explainer", icon: Lightbulb },
    code: { label: "Code Assistant", icon: Code },
    exam: { label: "Exam Prep", icon: FileCheck2 },
    summary: { label: "Note Summarizer", icon: FileText },
    planner: { label: "Study Planner", icon: Calendar },
    interview: { label: "Interview Coach", icon: Briefcase },
  };

  const CurrentIcon = modeDetails[currentMode].icon;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    const trimmed = input.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CHARS) return;

    onSendMessage(trimmed, currentMode);
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remainingChars = MAX_CHARS - input.length;
  const isTooLong = remainingChars < 0;

  const quickChips = [
    { label: "💡 Give an example", prompt: "Can you provide a clear real-world example of this?" },
    { label: "🐛 Help me debug", prompt: "I have an error in my code. How do I trace and debug it?" },
    { label: "📝 Key takeaways", prompt: "Summarize the 3 most critical points to remember." },
    { label: "⚡ Quiz me", prompt: "Give me 2 practice questions to test my understanding." },
    { label: "🎯 Big-O Complexity", prompt: "What is the Time and Space complexity (Big-O) of this?" },
  ];

  const handleChipClick = (chipPrompt: string) => {
    if (input.trim()) {
      setInput((prev) => `${prev.trim()} ${chipPrompt}`);
    } else {
      setInput(chipPrompt);
    }
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-neutral-200/90 dark:border-neutral-800/90 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-3 sm:p-4">
      <div className="max-w-3xl mx-auto space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              id={`quick-chip-${idx}`}
              type="button"
              onClick={() => handleChipClick(chip.prompt)}
              className="px-2.5 py-1 rounded-full bg-neutral-100/80 dark:bg-neutral-800/70 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 border border-neutral-200/60 dark:border-neutral-700/60 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium transition-all shrink-0 whitespace-nowrap"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-neutral-400 shrink-0 mr-1">
            Focus Mode:
          </span>
          {(
            [
              "general",
              "concept",
              "code",
              "exam",
              "summary",
              "planner",
              "interview",
            ] as StudyMode[]
          ).map((mode) => {
            const isSelected = currentMode === mode;
            const item = modeDetails[mode];
            const Icon = item.icon;
            return (
              <button
                key={mode}
                id={`mode-pill-${mode}`}
                type="button"
                onClick={() => onChangeMode(mode)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs font-semibold"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input box */}
        <div className="relative rounded-2xl border border-neutral-300 dark:border-neutral-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:focus-within:border-indigo-500 bg-white dark:bg-neutral-800/90 shadow-2xs transition-all">
          <textarea
            id="chat-message-input"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask EduMind AI anything... (${modeDetails[currentMode].label})`}
            className="w-full pl-4 pr-14 py-3 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden resize-none max-h-48 leading-relaxed"
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {isGenerating ? (
              <button
                id="stop-generation-btn"
                type="button"
                onClick={onStopGeneration}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
                title="Stop generating"
                aria-label="Stop generation"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                id="send-message-btn"
                type="button"
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isTooLong}
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all shadow-xs ${
                  input.trim() && !isTooLong
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed"
                }`}
                title="Send message (Enter)"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Input footer & limits */}
        <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400 dark:text-neutral-500">
          <div className="flex items-center gap-2">
            <span>
              Press <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">Enter</kbd> to send
            </span>
            <span>•</span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-[10px]">Shift+Enter</kbd> for newline
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={isTooLong ? "text-red-500 font-medium" : ""}>
              {input.length} / {MAX_CHARS}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
