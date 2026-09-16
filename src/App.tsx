import React, { useState, useEffect, useRef, useTransition } from "react";
import { Sidebar } from "./components/Sidebar";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatArea } from "./components/ChatArea";
import { ChatInput } from "./components/ChatInput";
import { SettingsModal } from "./components/SettingsModal";
import { AboutModal } from "./components/AboutModal";
import { StudyToolsModal } from "./components/StudyToolsModal";
import { RenameDialog } from "./components/RenameDialog";
import { FlashcardsModal } from "./components/FlashcardsModal";
import { QuizModal } from "./components/QuizModal";
import { ProfileModal } from "./components/ProfileModal";
import { ChatCustomizeModal } from "./components/ChatCustomizeModal";
import { DeployModal } from "./components/DeployModal";
import { SavedInsightsModal } from "./components/SavedInsightsModal";
import { HistoryModal } from "./components/HistoryModal";
import { CheckCircle2 } from "lucide-react";
import {
  Conversation,
  Message,
  StudyMode,
  ThemeMode,
  ServerInfo,
  UserProfile,
  ChatCustomization,
  SavedInsight,
} from "./types";
import {
  loadConversations,
  saveConversations,
  syncConversationsWithServer,
  deleteConversationFromStorage,
  clearAllConversationsFromStorage,
  getActiveConversationId,
  setActiveConversationId,
  loadThemeMode,
  saveThemeMode,
  getStudyStats,
  incrementQuestionCount,
  incrementConversationCount,
  clearAllData,
  StudyStats,
  loadUserProfile,
  saveUserProfile,
  loadChatCustomization,
  saveChatCustomization,
  loadSavedInsights,
  saveSavedInsights,
} from "./utils/storage";


export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadConversations()
  );
  const [activeId, setActiveId] = useState<string | null>(() =>
    getActiveConversationId()
  );
  const [currentMode, setCurrentMode] = useState<StudyMode>("general");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Navigation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [studyToolsOpen, setStudyToolsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [flashcardsTopic, setFlashcardsTopic] = useState("Computer Science");
  const [flashcardsContext, setFlashcardsContext] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState("Data Structures");
  const [quizContext, setQuizContext] = useState("");

  // Student Profile, Chat Customizer, Deploy & Insights Modals
  const [profileOpen, setProfileOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [savedInsightsOpen, setSavedInsightsOpen] = useState(false);

  // Student Profile, Customization & Insights Data
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadUserProfile()
  );
  const [chatCustomization, setChatCustomization] = useState<ChatCustomization>(
    () => loadChatCustomization()
  );
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>(() =>
    loadSavedInsights()
  );

  // Theme & Telemetry
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => loadThemeMode());
  const [stats, setStats] = useState<StudyStats>(() => getStudyStats());
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const triggerSaveToast = (msg = "Chat saved to history ✓") => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((current) => (current === msg ? null : current));
    }, 3000);
  };

  const abortControllerRef = useRef<AbortController | null>(null);

  // Apply theme class to document & body reliably
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const applyDark = (isDark: boolean) => {
      if (isDark) {
        root.classList.add("dark");
        body.classList.add("dark");
      } else {
        root.classList.remove("dark");
        body.classList.remove("dark");
      }
    };

    if (themeMode === "dark") {
      applyDark(true);
    } else if (themeMode === "light") {
      applyDark(false);
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyDark(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => applyDark(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [themeMode]);


  // Fetch Server Info on startup
  useEffect(() => {
    fetch("/api/info")
      .then((res) => res.json())
      .then((data: ServerInfo) => setServerInfo(data))
      .catch((err) => console.error("Could not fetch /api/info", err));

    // Seamlessly sync conversation history between browser localStorage and cloud server
    syncConversationsWithServer()
      .then((synced) => {
        if (synced && synced.length > 0) {
          setConversations(synced);
          setActiveId((prev) => {
            if (prev && synced.some((c) => c.id === prev)) return prev;
            const saved = getActiveConversationId();
            if (saved && synced.some((c) => c.id === saved)) return saved;
            return synced[0].id;
          });
        }
      })
      .catch((err) => console.warn("Could not sync conversations on load:", err));
  }, []);

  // Sync active conversation persistence
  useEffect(() => {
    setActiveConversationId(activeId);
  }, [activeId]);

  // Find active conversation object
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Change Theme
  const handleToggleTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemeMode(mode);
  };

  // Student Profile Updates
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  // Chatbox Customization Updates
  const handleUpdateCustomization = (updated: ChatCustomization) => {
    setChatCustomization(updated);
    saveChatCustomization(updated);
  };

  // Bookmark / Save Insight
  const handleBookmarkInsight = (msg: Message) => {
    const exists = savedInsights.some((item) => item.id === msg.id);
    let updated: SavedInsight[];
    if (exists) {
      updated = savedInsights.filter((item) => item.id !== msg.id);
    } else {
      const newInsight: SavedInsight = {
        id: msg.id,
        title: activeConversation?.title || "Key Academic Concept",
        content: msg.content,
        timestamp: Date.now(),
        studyMode: activeConversation?.studyMode || "concept",
        conversationId: activeConversation?.id,
      };
      updated = [newInsight, ...savedInsights];
    }
    setSavedInsights(updated);
    saveSavedInsights(updated);
  };

  const isInsightSaved = (msgId: string) => {
    return savedInsights.some((item) => item.id === msgId);
  };

  const handleDeleteInsight = (id: string) => {
    const updated = savedInsights.filter((item) => item.id !== id);
    setSavedInsights(updated);
    saveSavedInsights(updated);
  };

  const handleClearInsights = () => {
    setSavedInsights([]);
    saveSavedInsights([]);
  };

  // Create a brand new conversation

  const handleNewChat = (mode: StudyMode = "general") => {
    if (isGenerating) {
      handleStopGeneration();
    }
    setActiveId(null);
    setCurrentMode(mode);
    setErrorMessage(null);
    setStreamingContent("");
  };

  // Select existing conversation
  const handleSelectConversation = (id: string) => {
    if (isGenerating) {
      handleStopGeneration();
    }
    setActiveId(id);
    const found = conversations.find((c) => c.id === id);
    if (found) {
      setCurrentMode(found.studyMode || "general");
    }
    setErrorMessage(null);
    setStreamingContent("");
  };

  // Rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c
    );
    setConversations(updated);
    saveConversations(updated);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string) => {
    if (isGenerating && activeId === id) {
      handleStopGeneration();
    }
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    deleteConversationFromStorage(id, updated);

    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setCurrentMode(updated[0].studyMode || "general");
      } else {
        setActiveId(null);
      }
    }
  };

  // Clear all conversations
  const handleClearAll = () => {
    if (isGenerating) {
      handleStopGeneration();
    }
    clearAllConversationsFromStorage();
    clearAllData();
    setConversations([]);
    setActiveId(null);
    setStats({ totalQuestions: 0, totalConversations: 0, lastActive: Date.now() });
    setErrorMessage(null);
  };

  // Feedback on message
  const handleFeedback = (messageId: string, feedback: "like" | "dislike") => {
    if (!activeId) return;
    const updated = conversations.map((conv) => {
      if (conv.id !== activeId) return conv;
      const updatedMessages = conv.messages.map((m) =>
        m.id === messageId
          ? { ...m, feedback: m.feedback === feedback ? null : feedback }
          : m
      );
      return { ...conv, messages: updatedMessages };
    });
    setConversations(updated);
    saveConversations(updated);
  };

  // Send message to Gemini via server-side endpoint
  const handleSendMessage = async (userText: string, mode: StudyMode) => {
    if (!userText.trim() || isGenerating) return;

    setErrorMessage(null);

    let targetConvId = activeId;
    let targetConv = activeConversation;
    let currentMessages: Message[] = targetConv ? [...targetConv.messages] : [];

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: userText,
      timestamp: Date.now(),
      studyMode: mode,
    };

    // If starting a fresh chat, construct conversation
    if (!targetConvId || !targetConv) {
      const generatedTitle =
        userText.length > 36
          ? `${userText.slice(0, 36).trim()}...`
          : userText.trim();

      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: generatedTitle,
        messages: [userMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        studyMode: mode,
      };

      targetConvId = newConv.id;
      const newConversations = [newConv, ...conversations];
      setConversations(newConversations);
      saveConversations(newConversations);
      setActiveId(newConv.id);
      incrementConversationCount();
    } else {
      // Append to existing
      const updatedMessages = [...currentMessages, userMessage];
      const updated = conversations.map((c) =>
        c.id === targetConvId
          ? { ...c, messages: updatedMessages, updatedAt: Date.now() }
          : c
      );
      setConversations(updated);
      saveConversations(updated);
    }

    incrementQuestionCount();
    setStats(getStudyStats());

    // Prepare API request history (convert internal format to API history format)
    const historyPayload = currentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setIsGenerating(true);
    setStreamingContent("");

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let fullGeneratedText = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          studyMode: mode,
          studentName: userProfile.name,
          academicLevel: userProfile.year,
          major: userProfile.major,
          stream: true,
        }),

        signal: abortController.signal,
      });

      if (!response.ok) {
        let errDesc = "Failed to communicate with AI study assistant.";
        try {
          const errData = await response.json();
          if (errData?.error) errDesc = errData.error;
        } catch {
          // fallback
        }
        throw new Error(errDesc);
      }

      if (!response.body) {
        throw new Error("No response body stream received from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ")) {
            const dataStr = trimmedLine.slice(6).trim();
            if (!dataStr || dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              if (parsed.text) {
                fullGeneratedText += parsed.text;
                setStreamingContent(fullGeneratedText);
              }
              if (parsed.done) {
                break;
              }
            } catch (e: any) {
              if (e?.message && !e.message.includes("JSON")) {
                throw e;
              }
            }
          }
        }
      }

      // Finalize and store message
      if (fullGeneratedText.trim()) {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: "assistant",
          content: fullGeneratedText,
          timestamp: Date.now(),
          studyMode: mode,
        };

        setConversations((prev) => {
          const updated = prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: [...c.messages, assistantMessage],
                updatedAt: Date.now(),
              };
            }
            return c;
          });
          saveConversations(updated);
          triggerSaveToast("Chat saved to history ✓");
          return updated;
        });
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        // User aborted manually
        if (fullGeneratedText.trim()) {
          const assistantMessage: Message = {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            role: "assistant",
            content: `${fullGeneratedText} *(Generation paused)*`,
            timestamp: Date.now(),
            studyMode: mode,
          };
          setConversations((prev) => {
            const updated = prev.map((c) =>
              c.id === targetConvId
                ? {
                    ...c,
                    messages: [...c.messages, assistantMessage],
                    updatedAt: Date.now(),
                  }
                : c
            );
            saveConversations(updated);
            triggerSaveToast("Chat saved to history ✓");
            return updated;
          });
        }
      } else {
        console.error("Chat error:", err);
        const errText =
          err?.message ||
          "AI usage limit reached or network error. Please try again later.";
        setErrorMessage(errText);
      }
    } finally {
      setIsGenerating(false);
      setStreamingContent("");
      abortControllerRef.current = null;
    }
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (!activeConversation || isGenerating) return;
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const userMsgToRerun = msgs[lastUserIndex];
    // Remove everything after this user message
    const trimmedMsgs = msgs.slice(0, lastUserIndex);

    const updated = conversations.map((c) =>
      c.id === activeId ? { ...c, messages: trimmedMsgs } : c
    );
    setConversations(updated);
    saveConversations(updated);

    // Resend
    handleSendMessage(userMsgToRerun.content, userMsgToRerun.studyMode || currentMode);
  };

  // Launch tool from Study Tools modal or Welcome card
  const handleLaunchStudyAction = (promptText: string, mode: StudyMode) => {
    setCurrentMode(mode);
    handleSendMessage(promptText, mode);
  };

  const handleOpenFlashcards = (topic?: string, context?: string) => {
    setFlashcardsTopic(topic || activeConversation?.title || "Computer Science Core");
    setFlashcardsContext(context || "");
    setFlashcardsOpen(true);
  };

  const handleOpenQuiz = (topic?: string, context?: string) => {
    setQuizTopic(topic || activeConversation?.title || "Data Structures and Algorithms");
    setQuizContext(context || "");
    setQuizOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={handleSelectConversation}
        onNewChat={() => handleNewChat("general")}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onClearAll={handleClearAll}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenStudyTools={() => setStudyToolsOpen(true)}
        onOpenFlashcards={handleOpenFlashcards}
        onOpenQuiz={handleOpenQuiz}
        userProfile={userProfile}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
        onOpenDeploy={() => setDeployOpen(true)}
        onOpenSavedInsights={() => setSavedInsightsOpen(true)}
        savedInsightsCount={savedInsights.length}
        onOpenHistory={() => setHistoryOpen(true)}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Study Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {activeConversation && activeConversation.messages.length > 0 ? (
          <>
            <ChatArea
              title={activeConversation.title}
              studyMode={activeConversation.studyMode || currentMode}
              messages={activeConversation.messages}
              isGenerating={isGenerating}
              streamingContent={streamingContent}
              errorMessage={errorMessage}
              onOpenSidebar={() => setSidebarOpen(true)}
              onNewChat={() => handleNewChat("general")}
              onRegenerate={handleRegenerate}
              onFeedback={handleFeedback}
              onRenameChat={() => setRenameDialogOpen(true)}
              onDeleteChat={() => handleDeleteConversation(activeConversation.id)}
              onOpenFlashcards={handleOpenFlashcards}
              onOpenQuiz={handleOpenQuiz}
              userProfile={userProfile}
              chatCustomization={chatCustomization}
              onOpenCustomizer={() => setCustomizerOpen(true)}
              onOpenProfile={() => setProfileOpen(true)}
              onOpenDeploy={() => setDeployOpen(true)}
              onOpenSavedInsights={() => setSavedInsightsOpen(true)}
              savedInsightsCount={savedInsights.length}
              onBookmarkInsight={handleBookmarkInsight}
              isInsightSaved={isInsightSaved}
              onOpenHistory={() => setHistoryOpen(true)}
              conversationsCount={conversations.length}
              conversations={conversations}
              activeConversationId={activeConversation.id}
              onSelectConversation={handleSelectConversation}
              themeMode={themeMode}
              onToggleTheme={handleToggleTheme}
            />
            <ChatInput
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              onStopGeneration={handleStopGeneration}
              currentMode={currentMode}
              onChangeMode={setCurrentMode}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-y-auto">
            {/* Mobile Header for empty state */}
            <div className="md:hidden flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-800">
              <button
                id="mobile-open-sidebar-btn"
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Open menu"
              >
                <SidebarIcon className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                EduMind AI
              </span>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto">
              <WelcomeScreen
                onSelectPrompt={handleLaunchStudyAction}
                onOpenStudyTools={() => setStudyToolsOpen(true)}
                onOpenAbout={() => setAboutOpen(true)}
                onOpenFlashcards={handleOpenFlashcards}
                onOpenQuiz={handleOpenQuiz}
                userProfile={userProfile}
                onOpenProfile={() => setProfileOpen(true)}
                onOpenCustomizer={() => setCustomizerOpen(true)}
                onOpenDeploy={() => setDeployOpen(true)}
                onOpenSavedInsights={() => setSavedInsightsOpen(true)}
                savedInsightsCount={savedInsights.length}
                onOpenHistory={() => setHistoryOpen(true)}
                conversationsCount={conversations.length}
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
              />
            </div>


            <ChatInput
              onSendMessage={handleSendMessage}
              isGenerating={isGenerating}
              onStopGeneration={handleStopGeneration}
              currentMode={currentMode}
              onChangeMode={setCurrentMode}
            />
          </div>
        )}

        {/* Floating Auto-Save Notification Toast */}
        {saveToast && (
          <div
            id="chat-save-toast"
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{saveToast}</span>
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        serverInfo={serverInfo}
        stats={stats}
        onClearHistory={handleClearAll}
      />

      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      <StudyToolsModal
        isOpen={studyToolsOpen}
        onClose={() => setStudyToolsOpen(false)}
        onLaunchTool={handleLaunchStudyAction}
      />

      <FlashcardsModal
        isOpen={flashcardsOpen}
        onClose={() => setFlashcardsOpen(false)}
        initialTopic={flashcardsTopic}
        initialContext={flashcardsContext}
      />

      <QuizModal
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        initialTopic={quizTopic}
        initialContext={quizContext}
      />

      <RenameDialog
        isOpen={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        currentTitle={activeConversation?.title || ""}
        onSave={(newTitle) => {
          if (activeConversation) {
            handleRenameConversation(activeConversation.id, newTitle);
          }
        }}
      />

      {/* Student Profile Modal (Email, Phone, Login/Logout, ID Card) */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onLogout={() => {
          const updated = { ...userProfile, isLoggedIn: false };
          handleUpdateProfile(updated);
        }}
        onLogin={(name, email, phone, institution) => {
          const updated = {
            ...userProfile,
            name,
            email,
            phone,
            institution,
            isLoggedIn: true,
          };
          handleUpdateProfile(updated);
        }}
        totalQuestions={stats.totalQuestions}
        totalConversations={stats.totalConversations}
      />

      {/* Student Chatbox Customization Modal */}
      <ChatCustomizeModal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        customization={chatCustomization}
        onUpdateCustomization={handleUpdateCustomization}
        onResetCustomization={() => {
          const defaultCustom = {
            accentTheme: "indigo" as const,
            fontSize: "normal" as const,
            bubbleStyle: "modern" as const,
            bgPattern: "none" as const,
            showTimestamps: true,
            streamSpeed: "natural" as const,
            aiAvatar: "sparkles" as const,
          };
          handleUpdateCustomization(defaultCustom);
        }}
      />

      {/* 100% Free Deployment & Sharing Guide */}
      <DeployModal
        isOpen={deployOpen}
        onClose={() => setDeployOpen(false)}
      />

      {/* Saved Study Insights & Bookmarks */}
      <SavedInsightsModal
        isOpen={savedInsightsOpen}
        onClose={() => setSavedInsightsOpen(false)}
        insights={savedInsights}
        onRemoveInsight={handleDeleteInsight}
      />

      {/* Comprehensive Chat History Modal with Search & Export */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={(id) => {
          setActiveId(id);
          const selected = conversations.find((c) => c.id === id);
          if (selected?.studyMode) {
            setCurrentMode(selected.studyMode);
          }
        }}
        onDeleteConversation={handleDeleteConversation}
        onClearAll={handleClearAll}
        onNewChat={() => handleNewChat("general")}
      />
    </div>
  );
}


function SidebarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}
