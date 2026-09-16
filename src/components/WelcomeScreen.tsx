import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Lightbulb,
  Code,
  FileCheck2,
  FileText,
  Calendar,
  Briefcase,
  ArrowRight,
  Bot,
  Zap,
  CheckCircle2,
  BookOpen,
  Layers,
  Search,
  User,
  Palette,
  Bookmark,
  Rocket,
  ChevronRight,
  History,
  MessageSquare,
  Clock,
  Trash2,
} from "lucide-react";
import { Conversation, StudyMode, UserProfile } from "../types";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string, mode: StudyMode) => void;
  onOpenStudyTools: () => void;
  onOpenAbout: () => void;
  onOpenFlashcards: (topic: string) => void;
  onOpenQuiz: (topic: string) => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onOpenCustomizer?: () => void;
  onOpenDeploy?: () => void;
  onOpenSavedInsights?: () => void;
  savedInsightsCount?: number;
  onOpenHistory?: () => void;
  conversationsCount?: number;
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPrompt,
  onOpenStudyTools,
  onOpenAbout,
  onOpenFlashcards,
  onOpenQuiz,
  userProfile,
  onOpenProfile,
  onOpenCustomizer,
  onOpenDeploy,
  onOpenSavedInsights,
  savedInsightsCount = 0,
  onOpenHistory,
  conversationsCount = 0,
  conversations = [],
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");

  const popularTopics = [
    "Binary Search Trees",
    "Python OOP",
    "SQL Joins & Indexing",
    "Operating Systems Paging",
    "RESTful APIs",
    "Dynamic Programming",
  ];

  const quickCards = [
    {
      id: "concept",
      category: "cs",
      title: "Explain a Concept",
      description: "Break down complex topics step-by-step with intuitive real-world analogies",
      prompt: "Explain how recursion works with a simple real-world analogy and base case explanation.",
      mode: "concept" as StudyMode,
      icon: Lightbulb,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200/80 dark:border-amber-900/50",
    },
    {
      id: "code",
      category: "cs",
      title: "Debug My Code",
      description: "Analyze bugs, trace variable values, and optimize logic for speed",
      prompt: "Can you help me trace and debug a common Null Pointer or Index Out of Bounds exception in code?",
      mode: "code" as StudyMode,
      icon: Code,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200/80 dark:border-blue-900/50",
    },
    {
      id: "exam",
      category: "exam",
      title: "Prepare for Exams",
      description: "Generate high-yield revision summaries, formulas & active recall questions",
      prompt: "Help me prepare for my upcoming exam with high-yield review questions and step-by-step solutions.",
      mode: "exam" as StudyMode,
      icon: FileCheck2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200/80 dark:border-emerald-900/50",
    },
    {
      id: "summary",
      category: "exam",
      title: "Summarize Lecture Notes",
      description: "Convert dense lecture transcripts into structured, digestible study notes",
      prompt: "Summarize the key architectural differences between TCP and UDP in a clean markdown table.",
      mode: "summary" as StudyMode,
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200/80 dark:border-purple-900/50",
    },
    {
      id: "planner",
      category: "planning",
      title: "Create a Study Plan",
      description: "Design a realistic daily timetable tailored to your syllabus and deadlines",
      prompt: "Create an effective 7-day study timetable to cover a university syllabus before finals.",
      mode: "planner" as StudyMode,
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      border: "border-orange-200/80 dark:border-orange-900/50",
    },
    {
      id: "interview",
      category: "cs",
      title: "Practice Interview Questions",
      description: "Simulate technical coding interviews, conceptual questions and behavioral tips",
      prompt: "Quiz me on common Data Structures and Algorithms interview questions with feedback.",
      mode: "interview" as StudyMode,
      icon: Briefcase,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-200/80 dark:border-rose-900/50",
    },
  ];

  const filteredCards =
    selectedCategory === "all"
      ? quickCards
      : quickCards.filter((card) => card.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>College Academic Project Demonstration</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          EDUMIND AI
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400">
          Your Intelligent AI Study Companion
        </p>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Ask questions, understand concepts, debug code, prepare for exams, and learn faster with real-time Gemini AI.
        </p>

        {/* Student Quick Status & Actions Bar */}
        {userProfile && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-750 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div
              onClick={onOpenProfile}
              className="flex items-center gap-3 cursor-pointer group flex-1"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ring-2 ring-indigo-100 dark:ring-indigo-900/60">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {userProfile.name}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      userProfile.isLoggedIn
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {userProfile.isLoggedIn ? "Logged In" : "Guest Mode"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {userProfile.email} • {userProfile.institution}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              {onOpenHistory && (
                <button
                  id="welcome-history-btn"
                  onClick={onOpenHistory}
                  className="px-2.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="View saved chat history"
                >
                  <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>History</span>
                  {conversationsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                      {conversationsCount}
                    </span>
                  )}
                </button>
              )}

              {onOpenCustomizer && (
                <button
                  id="welcome-customize-btn"
                  onClick={onOpenCustomizer}
                  className="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 transition-colors"
                  title="Customize student chatbox"
                >
                  <Palette className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Customize</span>
                </button>
              )}
              {onOpenSavedInsights && (
                <button
                  id="welcome-saved-insights-btn"
                  onClick={onOpenSavedInsights}
                  className="px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5 transition-colors"
                  title="Saved Insights"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                  <span>Saved</span>
                  {savedInsightsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                      {savedInsightsCount}
                    </span>
                  )}
                </button>
              )}
              {onOpenDeploy && (
                <button
                  id="welcome-deploy-btn"
                  onClick={onOpenDeploy}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Deploy Free Guide"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy Free</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Topic Pills */}

        <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[11px] font-semibold text-neutral-400 mr-1">
            Popular Topics:
          </span>
          {popularTopics.map((top, idx) => (
            <button
              key={idx}
              id={`popular-topic-${idx}`}
              onClick={() =>
                onSelectPrompt(
                  `Explain ${top} with clear conceptual explanations, key formulas or code examples, and practice tips.`,
                  "concept"
                )
              }
              className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 border border-neutral-200/60 dark:border-neutral-700/60 text-[11px] text-neutral-600 dark:text-neutral-300 transition-all font-medium"
            >
              {top}
            </button>
          ))}
        </div>
      </div>

      {/* 📚 SAVED STUDY SESSIONS & CHAT HISTORY (Directly visible to students) */}
      {conversations && conversations.length > 0 && (
        <section
          id="welcome-saved-conversations-section"
          className="p-5 sm:p-6 rounded-3xl bg-linear-to-b from-indigo-50/70 via-white to-neutral-50/60 dark:from-indigo-950/30 dark:via-neutral-850 dark:to-neutral-900 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                <History className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                    Saved Study History & Chats
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    {conversations.length} Saved
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3" /> Auto-Synced to Cloud
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Click any past session below to continue studying where you left off
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {conversations.length > 3 && (
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Filter saved chats..."
                    className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              {onOpenHistory && (
                <button
                  id="welcome-view-all-history-btn"
                  onClick={onOpenHistory}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap"
                >
                  <span>Open Full History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversations
              .filter((c) => {
                if (!historySearchQuery.trim()) return true;
                const q = historySearchQuery.toLowerCase();
                return (
                  c.title.toLowerCase().includes(q) ||
                  c.messages.some((m) => m.content.toLowerCase().includes(q))
                );
              })
              .slice(0, 6)
              .map((conv) => {
                const messageCount = conv.messages?.length || 0;
                const lastMsg =
                  conv.messages && conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1]
                    : null;
                const previewText = lastMsg
                  ? lastMsg.content.slice(0, 110).replace(/[*#`_]/g, "").trim() + "..."
                  : "No messages yet";

                const dateStr = new Date(
                  conv.updatedAt || conv.createdAt
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={conv.id}
                    id={`welcome-history-card-${conv.id}`}
                    onClick={() => {
                      if (onSelectConversation) onSelectConversation(conv.id);
                    }}
                    className="group relative p-3.5 rounded-2xl bg-white dark:bg-neutral-800/90 border border-neutral-200/90 dark:border-neutral-700/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                            {conv.studyMode || "Study"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dateStr}
                          </span>
                          {onDeleteConversation && (
                            <button
                              id={`welcome-delete-conv-${conv.id}`}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all ml-1"
                              title="Delete this chat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {conv.title}
                      </h3>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {previewText}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-700/50 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-neutral-400">
                        {messageCount} {messageCount === 1 ? "turn" : "turns"}
                      </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Continue Study</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Direct Interactive Modules Quick Launcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          id="hero-launch-flashcards-btn"
          onClick={() => onOpenFlashcards("Computer Science Fundamentals")}
          className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-700 flex items-center justify-between text-left transition-all group shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Active Recall Flashcards
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Flip cards, test memory & reinforce key definitions
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          id="hero-launch-quiz-btn"
          onClick={() => onOpenQuiz("Data Structures and Algorithms")}
          className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 flex items-center justify-between text-left transition-all group shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Interactive Practice Quiz
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Multiple-choice questions with instant scoring & feedback
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Quick-Action Study Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Select a Study Direction
            </h2>
            <p className="text-xs text-neutral-400">
              Tailored prompts designed for college academic learning
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-[11px] font-medium self-start sm:self-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === "all"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("cs")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === "cs"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Coding & CS
            </button>
            <button
              onClick={() => setSelectedCategory("exam")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === "exam"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Exams
            </button>
            <button
              onClick={() => setSelectedCategory("planning")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === "planning"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Planning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                id={`quick-action-card-${card.id}`}
                onClick={() => onSelectPrompt(card.prompt, card.mode)}
                className="group text-left p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 hover:border-indigo-300 dark:hover:border-indigo-700/80 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-700/40 text-[11px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 italic truncate">
                  "{card.prompt}"
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Study Tools Banner (Teacher-Impressive Section) */}
      <div className="rounded-3xl bg-linear-to-br from-indigo-50/80 via-white to-neutral-50 dark:from-indigo-950/30 dark:via-neutral-900 dark:to-neutral-900 border border-indigo-100 dark:border-indigo-900/50 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Academic Architecture & Features
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                Production Ready
              </span>
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Built for College Students & Academic Evaluators
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-xl leading-relaxed">
              Equipped with specialized system prompts for Code Debugging, Concept Explanation, Exam Revision, Study Planning, and Mock Technical Interviews.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              id="view-all-study-tools-btn"
              onClick={onOpenStudyTools}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors whitespace-nowrap"
            >
              Explore Tools
            </button>
            <button
              id="view-about-project-btn"
              onClick={onOpenAbout}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs transition-colors whitespace-nowrap"
            >
              About Project
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-indigo-100/70 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Google Gemini Flash Engine</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Active Recall Flashcards</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Interactive Practice Quiz</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Pomodoro Focus Timer</span>
          </div>
        </div>
      </div>

      {/* Academic Mission Note */}
      <div className="text-center text-xs text-neutral-400 dark:text-neutral-500 max-w-xl mx-auto pb-6">
        <p>
          EduMind AI is an AI-powered educational companion designed to empower students to understand concepts deeply, practice programming, prepare for examinations, and improve their learning efficiency.
        </p>
      </div>
    </div>
  );
};
