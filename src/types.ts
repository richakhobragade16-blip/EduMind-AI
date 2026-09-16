export type Role = "user" | "assistant";

export type StudyMode =
  | "general"
  | "concept"
  | "code"
  | "exam"
  | "summary"
  | "planner"
  | "interview";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  studyMode?: StudyMode;
  feedback?: "like" | "dislike" | null;
  isSaved?: boolean;
}

export interface SavedInsight {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  studyMode?: StudyMode;
  conversationId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  studyMode: StudyMode;
}

export type ThemeMode = "light" | "dark" | "system";

export interface ServerInfo {
  status: string;
  app: string;
  model: string;
  isApiKeyConfigured: boolean;
  quotaFriendly: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SummaryDigest {
  keyTakeaways: string[];
  coreConcepts: Array<{ term: string; definition: string }>;
  examTips: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  major: string;
  year: string;
  avatarColor: string; // "indigo" | "emerald" | "violet" | "amber" | "rose" | "cyan"
  avatarIcon: string; // "graduation-cap" | "brain" | "code" | "sparkles" | "user"
  isLoggedIn: boolean;
  joinedDate: string;
}

export type ChatAccentTheme =
  | "indigo"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "cyan"
  | "slate";

export type ChatFontSize = "compact" | "normal" | "spacious";
export type BubbleStyle = "modern" | "card" | "high-contrast" | "minimal";
export type BackgroundPattern = "none" | "dots" | "grid" | "mesh";

export interface ChatCustomization {
  accentTheme: ChatAccentTheme;
  fontSize: ChatFontSize;
  bubbleStyle: BubbleStyle;
  bgPattern: BackgroundPattern;
  showTimestamps: boolean;
  streamSpeed: "natural" | "instant";
  aiAvatar: "sparkles" | "robot" | "owl" | "grad" | "brain";
}

