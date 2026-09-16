import React from "react";
import {
  X,
  Compass,
  MessageSquare,
  Code,
  FileCheck2,
  Calendar,
  Lightbulb,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { StudyMode } from "../types";

interface StudyToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTool: (initialPrompt: string, mode: StudyMode) => void;
}

export const StudyToolsModal: React.FC<StudyToolsModalProps> = ({
  isOpen,
  onClose,
  onLaunchTool,
}) => {
  if (!isOpen) return null;

  const tools = [
    {
      id: "chat",
      name: "AI Study Chat",
      tagline: "Free-form academic Q&A and tutoring",
      description: "Ask open-ended questions about any college subject, from physics to literature, with step-by-step guidance.",
      mode: "general" as StudyMode,
      icon: MessageSquare,
      samplePrompt: "I am studying for my college midterm. Can you act as my academic tutor and answer my questions step-by-step?",
      badge: "Core AI",
    },
    {
      id: "code",
      name: "Code Assistant",
      tagline: "Algorithm design, syntax & debugging",
      description: "Understand code logic, trace runtime exceptions, review best practices, and optimize time/space complexity.",
      mode: "code" as StudyMode,
      icon: Code,
      samplePrompt: "Explain Python variables and functions to a beginner with practical code snippets and common errors to avoid.",
      badge: "Programming",
    },
    {
      id: "concept",
      name: "Concept Explainer",
      tagline: "Deep conceptual clarity & intuition",
      description: "Deconstruct abstract theories, mathematical derivations, or systems using intuitive analogies and structured breakdowns.",
      mode: "concept" as StudyMode,
      icon: Lightbulb,
      samplePrompt: "Explain the concept of Recursion vs Iteration with a simple real-world analogy and diagrammatic explanation.",
      badge: "Foundations",
    },
    {
      id: "exam",
      name: "Exam Preparation",
      tagline: "High-yield revision & active recall",
      description: "Formulate practice quizzes, flashcard-style rapid fire questions, and summary cheat sheets for exams.",
      mode: "exam" as StudyMode,
      icon: FileCheck2,
      samplePrompt: "Generate 5 high-yield multiple-choice questions with detailed explanations to test my comprehension of Database Indexing.",
      badge: "Assessment",
    },
    {
      id: "planner",
      name: "Study Planner",
      tagline: "Custom revision schedule generator",
      description: "Break down large course syllabi into balanced daily milestones with built-in spaced repetition intervals.",
      mode: "planner" as StudyMode,
      icon: Calendar,
      samplePrompt: "Create a structured 7-day revision schedule for a Computer Science finals week covering 4 key modules.",
      badge: "Productivity",
    },
    {
      id: "interview",
      name: "Interview Coach",
      tagline: "Technical & behavioral practice",
      description: "Practice answering challenging technical interview questions with constructive critique on clarity and logic.",
      mode: "interview" as StudyMode,
      icon: Briefcase,
      samplePrompt: "Conduct a mock technical interview with me for an entry-level software engineer role. Ask me one question at a time.",
      badge: "Career Prep",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        id="study-tools-modal-card"
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                EduMind Study Tools
              </h3>
              <p className="text-[11px] text-neutral-500">
                Specialized study modes engineered for college coursework
              </p>
            </div>
          </div>
          <button
            id="close-study-tools-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close study tools"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                id={`study-tool-card-${tool.id}`}
                className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {tool.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                      {tool.tagline}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <button
                  id={`launch-tool-btn-${tool.id}`}
                  onClick={() => {
                    onLaunchTool(tool.samplePrompt, tool.mode);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-2xs transition-colors"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex justify-between items-center text-xs">
          <span className="text-neutral-500 text-[11px]">
            All 6 tools are active and powered by Gemini Flash
          </span>
          <button
            id="study-tools-close-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
