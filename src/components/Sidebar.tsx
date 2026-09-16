import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Settings,
  Info,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  FolderSync,
  Compass,
  Layers,
  BookOpen,
  User,
  Palette,
  Bookmark,
  Rocket,
  ChevronRight,
  History,
  Cloud,
} from "lucide-react";
import { Conversation, ThemeMode, UserProfile } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenStudyTools: () => void;
  onOpenFlashcards?: (topic: string) => void;
  onOpenQuiz?: (topic: string) => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onOpenCustomizer?: () => void;
  onOpenDeploy?: () => void;
  onOpenSavedInsights?: () => void;
  savedInsightsCount?: number;
  onOpenHistory?: () => void;
  themeMode: ThemeMode;
  onToggleTheme: (mode: ThemeMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onClearAll,
  onOpenSettings,
  onOpenAbout,
  onOpenStudyTools,
  onOpenFlashcards,
  onOpenQuiz,
  userProfile,
  onOpenProfile,
  onOpenCustomizer,
  onOpenDeploy,
  onOpenSavedInsights,
  savedInsightsCount = 0,
  onOpenHistory,
  themeMode,
  onToggleTheme,
}) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchMessage = c.messages.some((m) =>
        m.content.toLowerCase().includes(q)
      );
      return matchTitle || matchMessage;
    });
  }, [conversations, searchQuery]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups: {
      today: Conversation[];
      yesterday: Conversation[];
      previousWeek: Conversation[];
      older: Conversation[];
    } = {
      today: [],
      yesterday: [],
      previousWeek: [],
      older: [],
    };

    filteredConversations.forEach((conv) => {
      const convDate = new Date(conv.updatedAt || conv.createdAt);
      if (convDate >= today) {
        groups.today.push(conv);
      } else if (convDate >= yesterday) {
        groups.yesterday.push(conv);
      } else if (convDate >= sevenDaysAgo) {
        groups.previousWeek.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEditing = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(id);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 sm:w-80 flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header Branding */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 dark:text-white tracking-tight text-base">
                  EduMind AI
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                  College v1.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                Intelligent Study Companion
              </p>
            </div>
          </div>
          <button
            id="mobile-close-sidebar-btn"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Card (User requested rich email, phone, login/logout) */}
        {userProfile && (
          <div className="px-3 pt-3">
            <button
              id="sidebar-student-card-btn"
              type="button"
              onClick={() => {
                if (onOpenProfile) onOpenProfile();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors flex items-center justify-between group"
              title="Click to view/edit student profile, email ID, phone & account"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-1 ring-white/20`}
                >
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-white truncate block">
                      {userProfile.name || "Student"}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        userProfile.isLoggedIn ? "bg-emerald-500" : "bg-amber-400"
                      }`}
                      title={userProfile.isLoggedIn ? "Logged In" : "Guest Mode"}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate block">
                    {userProfile.email}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
            </button>
          </div>
        )}

        {/* New Chat & History launcher */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <button
              id="new-chat-sidebar-btn"
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>

            {onOpenHistory && (
              <button
                id="sidebar-all-history-btn"
                type="button"
                onClick={() => {
                  onOpenHistory();
                  if (window.innerWidth < 768) onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium text-xs transition-colors"
                title="View full chat history & backup"
              >
                <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">History</span>
                {conversations.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                    {conversations.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Quick Action Pills: Customize Chatbox, Saved Insights, Deploy */}
          <div className="grid grid-cols-2 gap-1.5">
            {onOpenCustomizer && (
              <button
                id="sidebar-customize-chat-btn"
                type="button"
                onClick={() => {
                  onOpenCustomizer();
                  if (window.innerWidth < 768) onClose();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs"
                title="Customize student chatbox"
              >
                <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate">Customize</span>
              </button>
            )}

            {onOpenSavedInsights && (
              <button
                id="sidebar-saved-insights-btn"
                type="button"
                onClick={() => {
                  onOpenSavedInsights();
                  if (window.innerWidth < 768) onClose();
                }}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-[11px] font-medium text-amber-800 dark:text-amber-300 transition-colors shadow-2xs"
                title="Saved study insights and bookmarks"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="truncate">Saved</span>
                </span>
                {savedInsightsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                    {savedInsightsCount}
                  </span>
                )}
              </button>
            )}
          </div>

          <button
            id="study-tools-btn"
            onClick={onOpenStudyTools}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Explore Study Tools</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900/70 font-semibold">
              6 Modes
            </span>
          </button>

          {/* Quick interactive study apps */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              id="sidebar-quick-flashcards-btn"
              onClick={() => {
                if (onOpenFlashcards) onOpenFlashcards("Core Concepts");
                if (window.innerWidth < 768) onClose();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Active Recall Flashcards"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Flashcards</span>
            </button>

            <button
              id="sidebar-quick-quiz-btn"
              onClick={() => {
                if (onOpenQuiz) onOpenQuiz("College Study Practice");
                if (window.innerWidth < 768) onClose();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Interactive Practice Quiz"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Practice Quiz</span>
            </button>
          </div>
        </div>


        {/* Search bar */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="search-conversations-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {conversations.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                No conversations yet
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Start by asking a question or selecting a study prompt.
              </p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-6 px-4 text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No chats match "{searchQuery}"
              </p>
            </div>
          ) : (
            <>
              {groupedConversations.today.length > 0 && (
                <ConversationSection
                  title="Today"
                  conversations={groupedConversations.today}
                  activeId={activeConversationId}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onSelect={(id) => {
                    onSelectConversation(id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={cancelEditing}
                  onDelete={handleDelete}
                />
              )}

              {groupedConversations.yesterday.length > 0 && (
                <ConversationSection
                  title="Yesterday"
                  conversations={groupedConversations.yesterday}
                  activeId={activeConversationId}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onSelect={(id) => {
                    onSelectConversation(id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={cancelEditing}
                  onDelete={handleDelete}
                />
              )}

              {groupedConversations.previousWeek.length > 0 && (
                <ConversationSection
                  title="Previous 7 Days"
                  conversations={groupedConversations.previousWeek}
                  activeId={activeConversationId}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onSelect={(id) => {
                    onSelectConversation(id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={cancelEditing}
                  onDelete={handleDelete}
                />
              )}

              {groupedConversations.older.length > 0 && (
                <ConversationSection
                  title="Older"
                  conversations={groupedConversations.older}
                  activeId={activeConversationId}
                  editingId={editingId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onSelect={(id) => {
                    onSelectConversation(id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={cancelEditing}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>

        {/* Clear confirmation alert banner */}
        {showClearConfirm && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
            <p className="text-xs text-red-800 dark:text-red-300 font-medium mb-2">
              Clear all {conversations.length} conversations?
            </p>
            <div className="flex gap-2">
              <button
                id="confirm-clear-all-btn"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-1 text-xs rounded bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Yes, Clear
              </button>
              <button
                id="cancel-clear-all-btn"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-1 text-xs rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer controls: Settings, About, Theme */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1.5">
          {/* Deploy & Share App Button */}
          {onOpenDeploy && (
            <button
              id="open-deploy-footer-btn"
              onClick={onOpenDeploy}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Rocket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Deploy & Share App</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/70 font-semibold">
                100% Free
              </span>
            </button>
          )}

          {conversations.length > 0 && !showClearConfirm && (
            <button
              id="clear-all-chats-btn"
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear chat history</span>
            </button>
          )}


          <div className="grid grid-cols-2 gap-1 pt-1">
            <button
              id="open-settings-btn"
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            <button
              id="open-about-btn"
              onClick={onOpenAbout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
          </div>

          {/* Theme mode toggle */}
          <div className="flex items-center justify-between px-3 py-1.5 mt-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/70 text-xs">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
              Theme
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 p-0.5 rounded-md border border-neutral-200 dark:border-neutral-700/60">
              <button
                id="theme-light-btn"
                onClick={() => onToggleTheme("light")}
                className={`p-1 rounded ${
                  themeMode === "light"
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                }`}
                title="Light mode"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                id="theme-dark-btn"
                onClick={() => onToggleTheme("dark")}
                className={`p-1 rounded ${
                  themeMode === "dark"
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                }`}
                title="Dark mode"
              >
                <Moon className="w-3 h-3" />
              </button>
              <button
                id="theme-system-btn"
                onClick={() => onToggleTheme("system")}
                className={`p-1 rounded ${
                  themeMode === "system"
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                }`}
                title="System default"
              >
                <Laptop className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

interface ConversationSectionProps {
  title: string;
  conversations: Conversation[];
  activeId: string | null;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (val: string) => void;
  onSelect: (id: string) => void;
  onStartEditing: (c: Conversation, e: React.MouseEvent) => void;
  onSaveEditing: (id: string, e?: React.FormEvent) => void;
  onCancelEditing: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const ConversationSection: React.FC<ConversationSectionProps> = ({
  title,
  conversations,
  activeId,
  editingId,
  editTitle,
  setEditTitle,
  onSelect,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onDelete,
}) => {
  return (
    <div>
      <h4 className="px-2 mb-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
        {title}
      </h4>
      <div className="space-y-1">
        {conversations.map((conv) => {
          const isActive = conv.id === activeId;
          const isEditing = conv.id === editingId;

          if (isEditing) {
            return (
              <form
                key={conv.id}
                onSubmit={(e) => onSaveEditing(conv.id, e)}
                className="flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-neutral-800 rounded-lg border border-indigo-300 dark:border-indigo-700"
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-white outline-hidden py-1"
                />
                <button
                  type="submit"
                  className="p-1 text-emerald-600 hover:text-emerald-700"
                  title="Save title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onCancelEditing}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            );
          }

          return (
            <div
              key={conv.id}
              id={`conv-item-${conv.id}`}
              onClick={() => onSelect(conv.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-medium border border-indigo-200/80 dark:border-indigo-900/50"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <MessageSquare
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                  }`}
                />
                <span className="truncate">{conv.title}</span>
              </div>

              {/* Action buttons (Rename & Delete) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 shrink-0">
                <button
                  id={`rename-conv-${conv.id}`}
                  onClick={(e) => onStartEditing(conv, e)}
                  className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  id={`delete-conv-${conv.id}`}
                  onClick={(e) => onDelete(conv.id, e)}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
