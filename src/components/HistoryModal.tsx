import React, { useState, useMemo } from "react";
import {
  X,
  History,
  Search,
  MessageSquare,
  Calendar,
  Trash2,
  Download,
  ExternalLink,
  CheckCircle2,
  Cloud,
  FileText,
  Clock,
  Sparkles,
  BookOpen,
  Code,
  GraduationCap,
  ListOrdered,
  Briefcase,
  Layers,
} from "lucide-react";
import { Conversation, StudyMode } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onNewChat: () => void;
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  general: <Sparkles className="w-3.5 h-3.5 text-indigo-500" />,
  concept: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
  code: <Code className="w-3.5 h-3.5 text-emerald-500" />,
  exam: <GraduationCap className="w-3.5 h-3.5 text-amber-500" />,
  summary: <FileText className="w-3.5 h-3.5 text-rose-500" />,
  planner: <ListOrdered className="w-3.5 h-3.5 text-cyan-500" />,
  interview: <Briefcase className="w-3.5 h-3.5 text-violet-500" />,
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectConversation,
  onDeleteConversation,
  onClearAll,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchContent = c.messages.some((m) =>
        m.content.toLowerCase().includes(q)
      );
      return matchTitle || matchContent;
    });
  }, [conversations, searchQuery]);

  if (!isOpen) return null;

  const totalMessages = conversations.reduce(
    (acc, c) => acc + c.messages.length,
    0
  );

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(conversations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `edumind-study-history-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportMarkdown = () => {
    let md = `# EduMind AI - Study Sessions History\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
    conversations.forEach((conv, idx) => {
      md += `## ${idx + 1}. ${conv.title}\n`;
      md += `- **Date:** ${new Date(conv.updatedAt || conv.createdAt).toLocaleString()}\n`;
      md += `- **Mode:** ${conv.studyMode || "general"}\n`;
      md += `- **Messages:** ${conv.messages.length}\n\n`;

      conv.messages.forEach((m) => {
        const sender = m.role === "user" ? "**Student:**" : "**EduMind AI:**";
        md += `${sender}\n${m.content}\n\n`;
      });
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edumind-study-notes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="chat-history-modal"
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-850/50 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  Study Chat History
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <Cloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Auto-Saved
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                All previous study questions, codes, and explanations are securely saved.
              </p>
            </div>
          </div>

          <button
            id="close-history-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync & Stats Overview Card */}
        <div className="px-4 sm:px-5 pt-3 pb-2 shrink-0">
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Saved Chats: </span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  {conversations.length}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Total Q&As: </span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {totalMessages}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cloud Server + Browser Storage Active</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                id="export-markdown-btn"
                onClick={handleExportMarkdown}
                disabled={conversations.length === 0}
                className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-[11px] font-medium text-neutral-700 dark:text-neutral-200 transition-colors disabled:opacity-40 flex items-center gap-1"
                title="Download as Markdown study notes"
              >
                <FileText className="w-3 h-3 text-rose-500" />
                <span>Notes (.md)</span>
              </button>
              <button
                id="export-json-btn"
                onClick={handleExportJson}
                disabled={conversations.length === 0}
                className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-[11px] font-medium text-neutral-700 dark:text-neutral-200 transition-colors disabled:opacity-40 flex items-center gap-1"
                title="Backup full history as JSON"
              >
                <Download className="w-3 h-3 text-indigo-500" />
                <span>Backup (.json)</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mt-2.5">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="history-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search through previous questions, explanations, codes..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2">
          {conversations.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                No saved chats yet
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
                Ask any question or launch a study mode. Every question and answer is automatically saved both to local browser and cloud server.
              </p>
              <button
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Start Your First Chat
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
              No conversations match "{searchQuery}"
            </div>
          ) : (
            filtered.map((conv) => {
              const isActive = conv.id === activeId;
              const mode = conv.studyMode || "general";
              const lastUpdated = new Date(
                conv.updatedAt || conv.createdAt
              ).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const firstUserMessage =
                conv.messages.find((m) => m.role === "user")?.content || "";
              const firstAiMessage =
                conv.messages.find((m) => m.role === "assistant")?.content || "";

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                    isActive
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-2xs"
                      : "bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-750"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        {MODE_ICONS[mode] || MODE_ICONS.general}
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate max-w-[280px] sm:max-w-md ${
                          isActive
                            ? "text-indigo-900 dark:text-indigo-200"
                            : "text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        }`}
                      >
                        {conv.title}
                      </h4>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Preview snippets */}
                    {firstUserMessage && (
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1 italic">
                        "{firstUserMessage.slice(0, 110)}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-400 dark:text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lastUpdated}
                      </span>
                      <span>•</span>
                      <span>{conv.messages.length} messages</span>
                      <span>•</span>
                      <span className="capitalize font-medium text-neutral-600 dark:text-neutral-300">
                        {mode} Mode
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectConversation(conv.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
                      title="Open this conversation"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 sm:p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 flex items-center justify-between gap-3 shrink-0">
          <div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-medium">Clear all?</span>
                <button
                  id="confirm-clear-history-btn"
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-1 rounded-md bg-rose-600 text-white text-[11px] font-bold"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="clear-all-history-btn"
                onClick={() => setShowClearConfirm(true)}
                disabled={conversations.length === 0}
                className="text-xs text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors disabled:opacity-30 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="history-start-new-chat-btn"
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
