import React from "react";
import {
  X,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Code2,
  Server,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        id="about-modal-card"
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                About EduMind AI
              </h3>
              <span className="text-[11px] text-neutral-500">College Academic Project</span>
            </div>
          </div>
          <button
            id="close-about-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close about modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Tagline & Core Statement */}
          <div className="p-4 rounded-xl bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
              "Learn Smarter. Code Better. Prepare Better."
            </h4>
            <p className="mt-2 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              EduMind AI is an AI-powered educational assistant designed to help students understand concepts, practice programming, prepare for examinations and improve their learning workflow.
            </p>
          </div>

          {/* Demonstration Highlights for Teachers */}
          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-white mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Project Key Highlights</span>
            </h5>
            <div className="space-y-2 text-neutral-600 dark:text-neutral-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Full-Stack Architecture:</strong> Decoupled React frontend with a secure Node.js Express backend ensuring API secrets never touch client code.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Official Google Gemini API:</strong> Integrated with <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px]">gemini-3.6-flash</code> for lightning-fast, high-accuracy educational explanations.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Conversation Context Memory:</strong> Remembers past turns within a study session while using a sliding context window to prevent quota wastage.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Developer-Grade Code Experience:</strong> Syntax highlighted code blocks with instantaneous one-click clipboard copying and line-by-line debugging logic.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-Cost Free Tier Engineering:</strong> Zero paid third-party dependencies, local storage indexing, and defensive input limits.
                </span>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-white mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Full-Stack Technology Stack</span>
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Frontend</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">React 19, TypeScript, Tailwind CSS</span>
              </div>
              <div className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Backend</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Node.js, Express, ESBuild CJS</span>
              </div>
              <div className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">AI Engine</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">@google/genai (Gemini Flash)</span>
              </div>
              <div className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Storage</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Client-Side Indexed LocalStorage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Powered by Google Gemini
          </span>
          <button
            id="about-close-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
