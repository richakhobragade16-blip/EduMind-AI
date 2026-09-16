import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  GraduationCap,
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  User,
  AlertCircle,
  Sparkles,
  Trash2,
  Edit2,
  Plus,
  Volume2,
  VolumeX,
  Layers,
  BookOpen,
  Download,
  Search,
  X,
  Bookmark,
  Palette,
  Rocket,
  Sun,
  Moon,
  Bot,
  Brain,
  History,
  CheckCircle2,
  ChevronDown,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  Conversation,
  Message,
  StudyMode,
  UserProfile,
  ChatCustomization,
  ThemeMode,
} from "../types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { PomodoroTimer } from "./PomodoroTimer";

interface ChatAreaProps {
  title: string;
  studyMode: StudyMode;
  messages: Message[];
  isGenerating: boolean;
  streamingContent: string;
  errorMessage: string | null;
  onOpenSidebar: () => void;
  onNewChat: () => void;
  onRegenerate: () => void;
  onFeedback: (messageId: string, feedback: "like" | "dislike") => void;
  onRenameChat: () => void;
  onDeleteChat: () => void;
  onOpenFlashcards: (topic: string, context?: string) => void;
  onOpenQuiz: (topic: string, context?: string) => void;
  // Enhanced Student & Customization props
  userProfile?: UserProfile;
  chatCustomization?: ChatCustomization;
  onOpenCustomizer?: () => void;
  onOpenProfile?: () => void;
  onOpenDeploy?: () => void;
  onOpenSavedInsights?: () => void;
  savedInsightsCount?: number;
  onBookmarkInsight?: (msg: Message) => void;
  isInsightSaved?: (msgId: string) => boolean;
  onOpenHistory?: () => void;
  conversationsCount?: number;
  conversations?: Conversation[];
  activeConversationId?: string;
  onSelectConversation?: (id: string) => void;
  themeMode?: ThemeMode;
  onToggleTheme?: (mode: ThemeMode) => void;
}

const ACCENT_COLOR_MAP: Record<
  string,
  { userBg: string; avatarBg: string; textAccent: string; ringColor: string }
> = {
  indigo: {
    userBg: "bg-indigo-600 text-white",
    avatarBg: "bg-indigo-600 text-white",
    textAccent: "text-indigo-600 dark:text-indigo-400",
    ringColor: "ring-indigo-500",
  },
  emerald: {
    userBg: "bg-emerald-600 text-white",
    avatarBg: "bg-emerald-600 text-white",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    ringColor: "ring-emerald-500",
  },
  violet: {
    userBg: "bg-violet-600 text-white",
    avatarBg: "bg-violet-600 text-white",
    textAccent: "text-violet-600 dark:text-violet-400",
    ringColor: "ring-violet-500",
  },
  amber: {
    userBg: "bg-amber-500 text-white",
    avatarBg: "bg-amber-500 text-white",
    textAccent: "text-amber-600 dark:text-amber-400",
    ringColor: "ring-amber-500",
  },
  rose: {
    userBg: "bg-rose-600 text-white",
    avatarBg: "bg-rose-600 text-white",
    textAccent: "text-rose-600 dark:text-rose-400",
    ringColor: "ring-rose-500",
  },
  cyan: {
    userBg: "bg-cyan-600 text-white",
    avatarBg: "bg-cyan-600 text-white",
    textAccent: "text-cyan-600 dark:text-cyan-400",
    ringColor: "ring-cyan-500",
  },
  slate: {
    userBg: "bg-slate-700 text-white",
    avatarBg: "bg-slate-700 text-white",
    textAccent: "text-slate-700 dark:text-slate-300",
    ringColor: "ring-slate-500",
  },
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  title,
  studyMode,
  messages,
  isGenerating,
  streamingContent,
  errorMessage,
  onOpenSidebar,
  onNewChat,
  onRegenerate,
  onFeedback,
  onRenameChat,
  onDeleteChat,
  onOpenFlashcards,
  onOpenQuiz,
  userProfile,
  chatCustomization,
  onOpenCustomizer,
  onOpenProfile,
  onOpenDeploy,
  onOpenSavedInsights,
  savedInsightsCount = 0,
  onBookmarkInsight,
  isInsightSaved,
  onOpenHistory,
  conversationsCount = 0,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  themeMode = "light",
  onToggleTheme,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);

  // Auto-scroll on new message or streaming chunk
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent]);

  // Clean up speech synthesis when unmounting
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopyMessage = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const plainText = text
        .replace(/```[\s\S]*?```/g, " [Code block omitted] ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[#*_~>]/g, "");

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingId(id);
    }
  };

  const handleExportMarkdown = () => {
    if (messages.length === 0) return;
    const header = `# ${title || "EduMind AI Study Session"}\n*Student: ${userProfile?.name || "Student"}* | *Mode: ${studyMode}* | *Date: ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    const content = messages
      .map(
        (m) =>
          `### ${m.role === "user" ? `👤 ${userProfile?.name || "Student"}` : "🎓 EduMind AI"}\n\n${m.content}\n\n`
      )
      .join("---\n\n");

    const blob = new Blob([header + content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "EduMind_Study_Notes").replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const modeBadgeText: Record<StudyMode, string> = {
    general: "General Study",
    concept: "Concept Explainer",
    code: "Code Assistant",
    exam: "Exam Prep",
    summary: "Note Summarizer",
    planner: "Study Planner",
    interview: "Interview Coach",
  };

  // Filter messages if search is active
  const displayedMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Customization mappings
  const themeKey = chatCustomization?.accentTheme || "indigo";
  const colors = ACCENT_COLOR_MAP[themeKey] || ACCENT_COLOR_MAP.indigo;

  // Font size classes
  const fontSizeClass =
    chatCustomization?.fontSize === "compact"
      ? "text-xs sm:text-[13px] leading-relaxed"
      : chatCustomization?.fontSize === "spacious"
      ? "text-base sm:text-lg leading-relaxed"
      : "text-sm sm:text-base leading-relaxed";

  // Background pattern classes
  const bgPatternClass =
    chatCustomization?.bgPattern === "dots"
      ? "chat-pattern-dots bg-neutral-50/80 dark:bg-neutral-950/80"
      : chatCustomization?.bgPattern === "grid"
      ? "chat-pattern-grid bg-neutral-50/80 dark:bg-neutral-950/80"
      : chatCustomization?.bgPattern === "mesh"
      ? "chat-pattern-mesh bg-neutral-50/80 dark:bg-neutral-950/80"
      : "bg-neutral-50/60 dark:bg-neutral-900/60";

  // Render AI Avatar icon
  const renderAiAvatar = () => {
    switch (chatCustomization?.aiAvatar) {
      case "robot":
        return <Bot className="w-4 h-4" />;
      case "brain":
        return <Brain className="w-4 h-4" />;
      case "sparkles":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  // Student initials
  const studentInitial = userProfile?.name
    ? userProfile.name.trim().charAt(0).toUpperCase()
    : "S";
  const studentColorKey = userProfile?.avatarColor || "indigo";
  const studentColorConfig =
    ACCENT_COLOR_MAP[studentColorKey] || ACCENT_COLOR_MAP.indigo;

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${bgPatternClass}`}>
      {/* Top Header */}
      <header className="h-14 px-3 sm:px-4 border-b border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between shrink-0 gap-2 z-10 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            id="mobile-menu-btn"
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[130px] sm:max-w-[220px]">
                {title || "Study Session"}
              </h2>
              <button
                id="header-rename-btn"
                onClick={onRenameChat}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-0.5 shrink-0"
                title="Rename conversation"
              >
                <Edit2 className="w-3 h-3" />
              </button>

              {/* Quick History Switcher dropdown toggle */}
              {conversations && conversations.length > 1 && (
                <div className="relative">
                  <button
                    id="header-quick-switcher-btn"
                    onClick={() => setIsQuickSwitcherOpen(!isQuickSwitcherOpen)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold border border-indigo-200/80 dark:border-indigo-800/60 transition-colors"
                    title="Switch to another saved chat"
                  >
                    <span>Chats</span>
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>

                  {isQuickSwitcherOpen && (
                    <div
                      id="header-quick-switcher-menu"
                      className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-neutral-850 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 z-50 space-y-1"
                    >
                      <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Your Saved Chats</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {conversations.length}
                        </span>
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-1">
                        {conversations.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => {
                              if (onSelectConversation) onSelectConversation(conv.id);
                              setIsQuickSwitcherOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                              conv.id === activeConversationId
                                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
                            }`}
                          >
                            <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span className="truncate flex-1">{conv.title}</span>
                            {conv.id === activeConversationId && (
                              <Check className="w-3 h-3 text-indigo-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                      {onOpenHistory && (
                        <div className="pt-1 border-t border-neutral-100 dark:border-neutral-800">
                          <button
                            onClick={() => {
                              setIsQuickSwitcherOpen(false);
                              onOpenHistory();
                            }}
                            className="w-full text-center py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1"
                          >
                            <History className="w-3 h-3" />
                            <span>Open Full History Search</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className={`font-semibold ${colors.textAccent}`}>
                {modeBadgeText[studyMode] || "Study Assistant"}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded font-medium border border-emerald-200/60 dark:border-emerald-800/40">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                <span>Auto-Saved</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Action Bar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Study Focus Pomodoro Timer */}
          <div className="hidden lg:block">
            <PomodoroTimer />
          </div>

          {/* New Chat Quick Button */}
          <button
            id="header-new-chat-btn"
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors shadow-2xs"
            title="Start a new chat"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Study History Modal Button - ALWAYS prominent */}
          {onOpenHistory && (
            <button
              id="header-history-btn"
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors shadow-2xs"
              title="View all saved chat history & study sessions"
            >
              <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>History</span>
              {conversationsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {conversationsCount}
                </span>
              )}
            </button>
          )}

          {/* Chatbox Customization Button */}
          {onOpenCustomizer && (
            <button
              id="header-customize-btn"
              type="button"
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-colors shadow-2xs"
              title="Customize student chatbox (theme, fonts, bubbles, patterns)"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          )}

          {/* Saved Insights Modal Button */}
          {onOpenSavedInsights && (
            <button
              id="header-saved-insights-btn"
              type="button"
              onClick={onOpenSavedInsights}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium transition-colors"
              title="View saved study insights and bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-500/20 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline">Saved</span>
              {savedInsightsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {savedInsightsCount}
                </span>
              )}
            </button>
          )}

          {/* Flashcards Shortcut Button */}
          <button
            id="header-flashcards-btn"
            type="button"
            onClick={() => onOpenFlashcards(title || "Study Topic")}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            title="Create Active Recall Flashcards"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          {/* Practice Quiz Shortcut Button */}
          <button
            id="header-quiz-btn"
            type="button"
            onClick={() => onOpenQuiz(title || "Study Topic")}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            title="Generate Practice Quiz"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>

          {/* Deploy Free Button */}
          {onOpenDeploy && (
            <button
              id="header-deploy-btn"
              type="button"
              onClick={onOpenDeploy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors"
              title="Deploy or Share App (100% Free)"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deploy</span>
              <span className="hidden md:inline px-1 py-0.2 rounded bg-emerald-800/60 text-[9px] font-bold uppercase tracking-wider">
                Free
              </span>
            </button>
          )}

          {/* Direct Light / Dark Mode Toggle in Header */}
          {onToggleTheme && (
            <button
              id="header-theme-toggle-btn"
              type="button"
              onClick={() => onToggleTheme(themeMode === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} mode`}
            >
              {themeMode === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>
          )}

          {/* Export Notes Button */}
          {messages.length > 0 && (
            <button
              id="header-export-btn"
              onClick={handleExportMarkdown}
              className="p-1.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Export Study Notes as Markdown (.md)"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Search Toggle */}
          <button
            id="header-search-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded-xl transition-colors ${
              isSearchOpen
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
            title="Search inside conversation"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* New Chat */}
          <button
            id="header-new-chat-btn"
            onClick={onNewChat}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">New Chat</span>
          </button>

          {/* Student Profile Avatar Chip */}
          {onOpenProfile && (
            <button
              id="header-profile-pill-btn"
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 shadow-2xs"
              title="Manage student profile, email, phone and login"
            >
              <div
                className={`w-6 h-6 rounded-lg ${studentColorConfig.avatarBg} text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/30`}
              >
                {studentInitial}
              </div>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden sm:inline truncate max-w-[80px]">
                {userProfile?.name ? userProfile.name.split(" ")[0] : "Profile"}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  userProfile?.isLoggedIn ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
            </button>
          )}

          {/* Delete Conversation */}
          <button
            id="header-delete-chat-btn"
            onClick={onDeleteChat}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Delete current conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* In-Chat Search Bar */}
      {isSearchOpen && (
        <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords in this session..."
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-6 space-y-6 max-w-3xl mx-auto w-full"
      >
        {displayedMessages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isLastMessage = index === displayedMessages.length - 1;
          const wordCount = msg.content.trim().split(/\s+/).length;
          const readTime = Math.max(1, Math.round(wordCount / 180));
          const bubbleStyle = chatCustomization?.bubbleStyle || "modern";
          const isSaved = isInsightSaved ? isInsightSaved(msg.id) : false;

          // Bubble Style Classes
          let bubbleClass = "";
          if (isUser) {
            bubbleClass = `${colors.userBg} ${
              bubbleStyle === "high-contrast"
                ? "rounded-2xl border-2 border-neutral-900 dark:border-white"
                : bubbleStyle === "card"
                ? "rounded-2xl rounded-tr-xs shadow-md"
                : bubbleStyle === "minimal"
                ? "rounded-xl"
                : "rounded-3xl rounded-tr-xs shadow-2xs"
            }`;
          } else {
            bubbleClass = `${
              bubbleStyle === "high-contrast"
                ? "rounded-2xl bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-white shadow-md"
                : bubbleStyle === "card"
                ? "rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm"
                : bubbleStyle === "minimal"
                ? "rounded-xl bg-transparent text-neutral-900 dark:text-neutral-100 border-0"
                : "rounded-3xl rounded-tl-xs bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-750 text-neutral-900 dark:text-neutral-100 shadow-2xs"
            }`;
          }

          return (
            <div
              key={msg.id}
              id={`message-${msg.id}`}
              className={`flex gap-3 sm:gap-4 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div
                  className={`w-8 h-8 rounded-xl ${colors.avatarBg} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
                >
                  {renderAiAvatar()}
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[85%] p-4 sm:p-5 ${bubbleClass} ${fontSizeClass}`}
              >
                {isUser ? (
                  <div>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                    {chatCustomization?.showTimestamps && (
                      <div className="text-[10px] text-white/70 text-right mt-1.5">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <MarkdownRenderer content={msg.content} />

                    {/* AI Message Meta & Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-750 text-xs text-neutral-400 gap-2">
                      {/* Left: Tools, Bookmark & Copy */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {/* Copy */}
                        <button
                          id={`copy-msg-btn-${msg.id}`}
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* Save / Bookmark Insight */}
                        {onBookmarkInsight && (
                          <button
                            id={`bookmark-btn-${msg.id}`}
                            onClick={() => onBookmarkInsight(msg)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                              isSaved
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold shadow-2xs"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400"
                            }`}
                            title={isSaved ? "Saved in study insights" : "Bookmark this explanation"}
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isSaved
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-neutral-400"
                              }`}
                            />
                            <span>{isSaved ? "Saved" : "Save Insight"}</span>
                          </button>
                        )}

                        {/* Read Aloud Text-to-Speech */}
                        {"speechSynthesis" in window && (
                          <button
                            id={`speak-btn-${msg.id}`}
                            onClick={() => handleToggleSpeak(msg.id, msg.content)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                              speakingId === msg.id
                                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-medium"
                                : "hover:bg-neutral-100 dark:hover:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400"
                            }`}
                            title={speakingId === msg.id ? "Stop voice audio" : "Listen aloud (Text-to-Speech)"}
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Convert to Flashcards */}
                        <button
                          id={`card-convert-btn-${msg.id}`}
                          onClick={() =>
                            onOpenFlashcards(
                              title || "Key Concepts",
                              msg.content.slice(0, 1500)
                            )
                          }
                          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-300 transition-colors"
                          title="Turn this explanation into Flashcards"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Flashcards</span>
                        </button>

                        {/* Regenerate if last message */}
                        {isLastMessage && !isGenerating && (
                          <button
                            id={`regenerate-btn-${msg.id}`}
                            onClick={onRegenerate}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                            title="Regenerate response"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>
                        )}
                      </div>

                      {/* Right: Stats, Timestamps & Feedback */}
                      <div className="flex items-center gap-2">
                        {chatCustomization?.showTimestamps && (
                          <span className="text-[10px] text-neutral-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}

                        <span className="text-[10px] text-neutral-400 hidden sm:inline">
                          ~{wordCount} words • {readTime} min read
                        </span>

                        <div className="flex items-center gap-0.5">
                          <button
                            id={`like-btn-${msg.id}`}
                            onClick={() => onFeedback(msg.id, "like")}
                            className={`p-1 rounded-lg transition-colors ${
                              msg.feedback === "like"
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            }`}
                            title="Helpful response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`dislike-btn-${msg.id}`}
                            onClick={() => onFeedback(msg.id, "dislike")}
                            className={`p-1 rounded-lg transition-colors ${
                              msg.feedback === "dislike"
                                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40"
                                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                            }`}
                            title="Unsatisfactory response"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div
                  className={`w-8 h-8 rounded-xl ${studentColorConfig.avatarBg} text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs ring-1 ring-white/30 mt-0.5`}
                  title={userProfile?.name || "Student"}
                >
                  {studentInitial}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Streaming Assistant Message */}
        {isGenerating && streamingContent && (
          <div className="flex gap-3 sm:gap-4 justify-start">
            <div
              className={`w-8 h-8 rounded-xl ${colors.avatarBg} flex items-center justify-center shrink-0 shadow-xs mt-0.5 animate-pulse`}
            >
              {renderAiAvatar()}
            </div>
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-3xl rounded-tl-xs p-4 sm:p-5 bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-750 shadow-2xs text-neutral-900 dark:text-neutral-100 ${fontSizeClass}`}
            >
              <MarkdownRenderer content={streamingContent} />
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700/40 text-xs text-indigo-600 dark:text-indigo-400">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>EduMind AI is thinking and formulating response...</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator (Waiting for initial chunk) */}
        {isGenerating && !streamingContent && (
          <div className="flex gap-3 sm:gap-4 justify-start">
            <div
              className={`w-8 h-8 rounded-xl ${colors.avatarBg} flex items-center justify-center shrink-0 shadow-xs mt-0.5 animate-pulse`}
            >
              {renderAiAvatar()}
            </div>
            <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-750 shadow-2xs flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.3s]" />
              </div>
              <span>Connecting to EduMind AI Engine...</span>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Notice:
                </p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              id="retry-error-action-btn"
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-xs transition-colors shrink-0"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Question</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
