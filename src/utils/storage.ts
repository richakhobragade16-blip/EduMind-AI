import {
  Conversation,
  ThemeMode,
  SavedInsight,
  UserProfile,
  ChatCustomization,
} from "../types";

const CONVERSATIONS_KEY = "edumind_conversations_v1";
const ACTIVE_CONV_ID_KEY = "edumind_active_conv_id_v1";
const THEME_KEY = "edumind_theme_mode_v1";
const STATS_KEY = "edumind_study_stats_v1";
const SAVED_INSIGHTS_KEY = "edumind_saved_insights_v1";
const USER_PROFILE_KEY = "edumind_user_profile_v1";
const CHAT_CUSTOM_KEY = "edumind_chat_custom_v1";

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "student_default",
  name: "Richa Khobragade",
  email: "richakhobragade16@gmail.com",
  phone: "+91 98765 43210",
  institution: "National Institute of Technology",
  major: "Computer Science & Engineering",
  year: "3rd Year",
  avatarColor: "indigo",
  avatarIcon: "graduation-cap",
  isLoggedIn: true,
  joinedDate: "September 2024",
};

export const DEFAULT_CHAT_CUSTOMIZATION: ChatCustomization = {
  accentTheme: "indigo",
  fontSize: "normal",
  bubbleStyle: "modern",
  bgPattern: "dots",
  showTimestamps: true,
  streamSpeed: "natural",
  aiAvatar: "sparkles",
};

export interface StudyStats {
  totalQuestions: number;
  totalConversations: number;
  lastActive: number;
}

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-dsa-trees",
    title: "DSA: Binary Search Tree & AVL Balancing",
    createdAt: Date.now() - 3600 * 1000 * 3,
    updatedAt: Date.now() - 3600 * 1000 * 2,
    studyMode: "concept",
    messages: [
      {
        id: "msg-seed-1",
        role: "user",
        content: "Explain Binary Search Tree (BST) operations and how AVL Trees prevent O(N) worst-case skewness.",
        timestamp: Date.now() - 3600 * 1000 * 3,
        studyMode: "concept",
      },
      {
        id: "msg-seed-2",
        role: "assistant",
        content: "### 🌲 Binary Search Tree (BST) vs AVL Tree\n\nIn a standard **Binary Search Tree (BST)**:\n- For any node $N$, values in the left subtree are $< N$ and right subtree are $> N$.\n- **Average Time Complexity**: $O(\\log N)$ for search, insertion, and deletion.\n- **Worst Case**: If elements are inserted in sorted order, the tree degenerates into a linked list with $O(N)$ height.\n\n### ⚖️ AVL Trees (Adelson-Velsky and Landis)\nAn AVL tree is a **Self-Balancing Binary Search Tree** that guarantees $O(\\log N)$ time complexity even in the worst case.\n\n- **Balance Factor ($BF$)**:\n  $$\\text{BF} = \\text{Height(Left Subtree)} - \\text{Height(Right Subtree)}$$\n  For every node, $BF \\in \\{-1, 0, +1\\}$.\n- When an insertion causes $|BF| > 1$, self-balancing rotations are performed:\n  1. **LL Rotation (Right Rotation)**: Inserted in left child of left subtree\n  2. **RR Rotation (Left Rotation)**: Inserted in right child of right subtree\n  3. **LR Rotation**: Left-Right double rotation\n  4. **RL Rotation**: Right-Left double rotation.",
        timestamp: Date.now() - 3600 * 1000 * 2.5,
        studyMode: "concept",
      },
    ],
  },
  {
    id: "conv-os-deadlock",
    title: "Operating Systems: Deadlock & Banker's Algorithm",
    createdAt: Date.now() - 3600 * 1000 * 24,
    updatedAt: Date.now() - 3600 * 1000 * 22,
    studyMode: "exam",
    messages: [
      {
        id: "msg-seed-3",
        role: "user",
        content: "What are Coffman's 4 conditions for deadlock, and how does Banker's Algorithm ensure a safe state?",
        timestamp: Date.now() - 3600 * 1000 * 24,
        studyMode: "exam",
      },
      {
        id: "msg-seed-4",
        role: "assistant",
        content: "### 🔒 Coffman's 4 Necessary Conditions for Deadlock\n\nA deadlock can occur if and only if **all 4 conditions** hold simultaneously:\n\n1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.\n2. **Hold and Wait**: A process is holding at least one resource and waiting to acquire additional resources held by other processes.\n3. **No Preemption**: Resources cannot be preempted; they can only be released voluntarily by the process holding them.\n4. **Circular Wait**: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.\n\n### 🏦 Banker's Algorithm for Deadlock Avoidance\n- Evaluates resource allocation requests dynamically by checking if granting the request leads to a **Safe State**.\n- If a safe sequence $\\langle P_1, P_2, \\dots, P_n \\rangle$ exists where all processes can finish executing, the allocation is granted; otherwise, the request is delayed.",
        timestamp: Date.now() - 3600 * 1000 * 23,
        studyMode: "exam",
      },
    ],
  },
];

export const loadConversations = (): Conversation[] => {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) {
      // Seed initial conversations for demonstration
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CONVERSATIONS;
  } catch (err) {
    console.error("Failed to load conversations from storage", err);
    return INITIAL_CONVERSATIONS;
  }
};

export const saveConversations = (conversations: Conversation[]): void => {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (err) {
    console.error("Failed to save conversations to local storage", err);
  }

  // Also persist to server in the background so history is never lost even if browser storage is cleared
  try {
    fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversations }),
    }).catch(() => {
      // Background sync silent catch
    });
  } catch {
    // Network silent catch
  }
};

// Sync local storage with server storage and merge seamlessly
export const syncConversationsWithServer = async (): Promise<Conversation[]> => {
  const localList = loadConversations();
  try {
    const res = await fetch("/api/conversations");
    if (!res.ok) return localList;
    const data = await res.json();
    if (!data.success || !Array.isArray(data.conversations)) return localList;

    const serverList: Conversation[] = data.conversations;
    if (serverList.length === 0 && localList.length > 0) {
      // Server is empty, upload local list to server
      fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversations: localList }),
      }).catch(() => {});
      return localList;
    }

    // Merge: Map by ID, picking the one with latest updatedAt
    const map = new Map<string, Conversation>();
    for (const c of serverList) {
      if (c && c.id) map.set(c.id, c);
    }
    for (const c of localList) {
      if (c && c.id) {
        const existing = map.get(c.id);
        if (!existing || (c.updatedAt || 0) >= (existing.updatedAt || 0)) {
          map.set(c.id, c);
        }
      }
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)
    );

    // Update local storage with merged truth
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(merged));
    } catch {}

    return merged;
  } catch (err) {
    console.warn("Could not sync with server conversations endpoint, using local:", err);
    return localList;
  }
};

export const deleteConversationFromStorage = (id: string, remaining: Conversation[]): void => {
  saveConversations(remaining);
  fetch(`/api/conversations/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
};

export const clearAllConversationsFromStorage = (): void => {
  try {
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(ACTIVE_CONV_ID_KEY);
  } catch {}
  fetch("/api/conversations", { method: "DELETE" }).catch(() => {});
};

export const getActiveConversationId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_CONV_ID_KEY);
  } catch {
    return null;
  }
};

export const setActiveConversationId = (id: string | null): void => {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_CONV_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CONV_ID_KEY);
    }
  } catch (err) {
    console.error("Failed to set active conversation id", err);
  }
};

export const loadThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return "system";
  } catch {
    return "system";
  }
};

export const saveThemeMode = (theme: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error("Failed to save theme", err);
  }
};

export const getStudyStats = (): StudyStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return { totalQuestions: 0, totalConversations: 0, lastActive: Date.now() };
    }
    return JSON.parse(raw);
  } catch {
    return { totalQuestions: 0, totalConversations: 0, lastActive: Date.now() };
  }
};

export const incrementQuestionCount = (): void => {
  try {
    const stats = getStudyStats();
    stats.totalQuestions += 1;
    stats.lastActive = Date.now();
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to increment stats", err);
  }
};

export const incrementConversationCount = (): void => {
  try {
    const stats = getStudyStats();
    stats.totalConversations += 1;
    stats.lastActive = Date.now();
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to update stats", err);
  }
};

export const loadSavedInsights = (): SavedInsight[] => {
  try {
    const raw = localStorage.getItem(SAVED_INSIGHTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load saved insights", err);
    return [];
  }
};

export const saveSavedInsights = (insights: SavedInsight[]): void => {
  try {
    localStorage.setItem(SAVED_INSIGHTS_KEY, JSON.stringify(insights));
  } catch (err) {
    console.error("Failed to save insights list", err);
  }
};

export const saveInsight = (insight: SavedInsight): void => {

  try {
    const list = loadSavedInsights();
    const exists = list.some((item) => item.id === insight.id);
    const updated = exists
      ? list.map((item) => (item.id === insight.id ? insight : item))
      : [insight, ...list];
    localStorage.setItem(SAVED_INSIGHTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save insight", err);
  }
};

export const removeInsight = (id: string): void => {
  try {
    const list = loadSavedInsights();
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(SAVED_INSIGHTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to remove insight", err);
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(ACTIVE_CONV_ID_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(SAVED_INSIGHTS_KEY);
  } catch (err) {
    console.error("Failed to clear storage", err);
  }
};

export const loadUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_USER_PROFILE, ...parsed };
  } catch (err) {
    console.error("Failed to load user profile", err);
    return DEFAULT_USER_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save user profile", err);
  }
};

export const logoutUserProfile = (): UserProfile => {
  try {
    const current = loadUserProfile();
    const updated: UserProfile = {
      ...current,
      isLoggedIn: false,
    };
    saveUserProfile(updated);
    return updated;
  } catch (err) {
    console.error("Failed to logout", err);
    return { ...DEFAULT_USER_PROFILE, isLoggedIn: false };
  }
};

export const loadChatCustomization = (): ChatCustomization => {
  try {
    const raw = localStorage.getItem(CHAT_CUSTOM_KEY);
    if (!raw) return DEFAULT_CHAT_CUSTOMIZATION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CHAT_CUSTOMIZATION, ...parsed };
  } catch (err) {
    console.error("Failed to load chat customization", err);
    return DEFAULT_CHAT_CUSTOMIZATION;
  }
};

export const saveChatCustomization = (custom: ChatCustomization): void => {
  try {
    localStorage.setItem(CHAT_CUSTOM_KEY, JSON.stringify(custom));
  } catch (err) {
    console.error("Failed to save chat customization", err);
  }
};

