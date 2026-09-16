import React, { useState } from "react";
import {
  X,
  Bookmark,
  Trash2,
  Copy,
  Check,
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { SavedInsight } from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface SavedInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: SavedInsight[];
  onRemoveInsight: (id: string) => void;
}

export const SavedInsightsModal: React.FC<SavedInsightsModalProps> = ({
  isOpen,
  onClose,
  insights,
  onRemoveInsight,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = insights.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="saved-insights-modal"
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Saved Study Insights ({insights.length})
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Your bookmarked key concepts, formulas & review summaries
              </p>
            </div>
          </div>
          <button
            id="close-insights-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close saved insights"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar if insights exist */}
        {insights.length > 0 && (
          <div className="px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your saved insights..."
              className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
            />
          </div>
        )}

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {insights.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                No saved insights yet
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Click the <strong>Bookmark</strong> button under any AI response in your study chat to save important formulas, algorithms, or definitions here for quick review!
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No matching insights found for "{searchQuery}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 border-b border-neutral-200/60 dark:border-neutral-700/60 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {item.title}
                    </h5>
                    {item.studyMode && (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {item.studyMode}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(item.id, item.content)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-700"
                      title="Copy insight"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onRemoveInsight(item.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-neutral-700 dark:text-neutral-300 max-h-60 overflow-y-auto pr-1">
                  <MarkdownRenderer content={item.content} />
                </div>
                <div className="text-[10px] text-neutral-400 pt-1">
                  Saved on {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
