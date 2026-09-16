import React, { useState } from "react";
import {
  X,
  Sun,
  Moon,
  Laptop,
  Cpu,
  ShieldCheck,
  Trash2,
  Database,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ThemeMode, ServerInfo } from "../types";
import { StudyStats } from "../utils/storage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onToggleTheme: (mode: ThemeMode) => void;
  serverInfo: ServerInfo | null;
  stats: StudyStats;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themeMode,
  onToggleTheme,
  serverInfo,
  stats,
  onClearHistory,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        id="settings-modal-card"
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Settings & Preferences
          </h3>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Appearance */}
          <div>
            <label className="block font-semibold text-neutral-900 dark:text-white mb-2">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                id="setting-theme-light"
                onClick={() => onToggleTheme("light")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-colors ${
                  themeMode === "light"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                id="setting-theme-dark"
                onClick={() => onToggleTheme("dark")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-colors ${
                  themeMode === "dark"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                id="setting-theme-system"
                onClick={() => onToggleTheme("system")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-colors ${
                  themeMode === "system"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* AI Model & Engine Status */}
          <div>
            <label className="block font-semibold text-neutral-900 dark:text-white mb-2">
              Gemini AI Engine
            </label>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Current Model:</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                  {serverInfo?.model || "gemini-3.6-flash"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">API Status:</span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Free-Tier Friendly & Optimized</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Context Strategy:</span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  Pruned sliding window (8 turns max)
                </span>
              </div>
            </div>
          </div>

          {/* Local Study Analytics */}
          <div>
            <label className="block font-semibold text-neutral-900 dark:text-white mb-2">
              Local Study History
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80">
                <span className="text-neutral-400 text-xs block">Questions Asked</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {stats.totalQuestions}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80">
                <span className="text-neutral-400 text-xs block">Total Study Sessions</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {stats.totalConversations}
                </span>
              </div>
            </div>

            {showClearConfirm ? (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2">
                <p className="text-xs text-red-800 dark:text-red-300 font-medium">
                  Are you sure you want to permanently clear all study chat sessions?
                </p>
                <div className="flex gap-2">
                  <button
                    id="settings-confirm-clear-btn"
                    onClick={() => {
                      onClearHistory();
                      setShowClearConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-medium text-xs hover:bg-red-700"
                  >
                    Yes, Clear All
                  </button>
                  <button
                    id="settings-cancel-clear-btn"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="settings-clear-history-btn"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-red-200/80 dark:border-red-900/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Saved Conversations</span>
              </button>
            )}
          </div>

          {/* Privacy & Security Architecture */}
          <div>
            <label className="block font-semibold text-neutral-900 dark:text-white mb-2">
              Privacy & Security Architecture
            </label>
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-neutral-600 dark:text-neutral-300 leading-relaxed text-xs">
              <div className="flex items-center gap-2 font-medium text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Strict Server-Side Secret Management</span>
              </div>
              <p>
                API credentials are strictly protected on the backend Node.js server. The Gemini API key is never bundled in frontend JavaScript, never stored in client localStorage, and never exposed in browser requests.
              </p>
              <p>
                Conversations are preserved in your browser's private local storage, providing high-speed search without incurring extra server database charges.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex justify-end">
          <button
            id="settings-close-done-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
