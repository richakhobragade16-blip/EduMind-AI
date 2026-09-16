import React from "react";
import {
  X,
  Palette,
  Type,
  Layout,
  Grid,
  Sparkles,
  Bot,
  GraduationCap,
  Brain,
  RotateCcw,
  Check,
  CheckCircle2,
} from "lucide-react";
import {
  ChatCustomization,
  ChatAccentTheme,
  ChatFontSize,
  BubbleStyle,
  BackgroundPattern,
} from "../types";

interface ChatCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: ChatCustomization;
  onUpdateCustomization: (custom: ChatCustomization) => void;
  onResetCustomization: () => void;
}

const THEME_OPTIONS: Array<{
  id: ChatAccentTheme;
  name: string;
  colorClass: string;
  pillClass: string;
}> = [
  { id: "indigo", name: "Classic Indigo", colorClass: "bg-indigo-600", pillClass: "border-indigo-600 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300" },
  { id: "emerald", name: "Forest Focus", colorClass: "bg-emerald-600", pillClass: "border-emerald-600 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300" },
  { id: "violet", name: "Royal Violet", colorClass: "bg-violet-600", pillClass: "border-violet-600 text-violet-700 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-300" },
  { id: "amber", name: "Sunset Amber", colorClass: "bg-amber-500", pillClass: "border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300" },
  { id: "rose", name: "Vibrant Rose", colorClass: "bg-rose-600", pillClass: "border-rose-600 text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300" },
  { id: "cyan", name: "Ocean Cyan", colorClass: "bg-cyan-600", pillClass: "border-cyan-600 text-cyan-700 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-300" },
  { id: "slate", name: "Clean Monochrome", colorClass: "bg-slate-700", pillClass: "border-slate-700 text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200" },
];

const FONT_SIZES: Array<{ id: ChatFontSize; label: string; desc: string }> = [
  { id: "compact", label: "Compact (13px)", desc: "Best for reading long code & formulas" },
  { id: "normal", label: "Standard (15px)", desc: "Balanced for daily university studying" },
  { id: "spacious", label: "Spacious (17px)", desc: "Large comfortable typography" },
];

const BUBBLE_STYLES: Array<{ id: BubbleStyle; label: string; desc: string }> = [
  { id: "modern", label: "Modern Rounded", desc: "Soft curved bubbles with subtle border" },
  { id: "card", label: "Structured Card", desc: "Defined cards with clear header bar" },
  { id: "high-contrast", label: "High Contrast", desc: "Crisp dark & light distinct borders" },
  { id: "minimal", label: "Minimal Stream", desc: "Borderless flowing background" },
];

const PATTERNS: Array<{ id: BackgroundPattern; label: string; previewClass: string }> = [
  { id: "none", label: "Clean Plain", previewClass: "bg-neutral-100 dark:bg-neutral-800" },
  { id: "dots", label: "Academic Dots", previewClass: "chat-pattern-dots bg-neutral-100 dark:bg-neutral-800" },
  { id: "grid", label: "Graph Grid", previewClass: "chat-pattern-grid bg-neutral-100 dark:bg-neutral-800" },
  { id: "mesh", label: "Gradient Aura", previewClass: "chat-pattern-mesh bg-neutral-100 dark:bg-neutral-800" },
];

const AVATAR_OPTIONS: Array<{ id: ChatCustomization["aiAvatar"]; label: string; icon: any }> = [
  { id: "sparkles", label: "Sparkles", icon: Sparkles },
  { id: "robot", label: "Curious Bot", icon: Bot },
  { id: "owl", label: "Academic Owl", icon: GraduationCap },
  { id: "brain", label: "Neural Brain", icon: Brain },
];

export const ChatCustomizeModal: React.FC<ChatCustomizeModalProps> = ({
  isOpen,
  onClose,
  customization,
  onUpdateCustomization,
  onResetCustomization,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof ChatCustomization>(
    key: K,
    value: ChatCustomization[K]
  ) => {
    onUpdateCustomization({
      ...customization,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="chat-customize-modal-card"
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Customize Student Chatbox
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Personalize themes, bubble styles, fonts, and background aesthetics.
              </p>
            </div>
          </div>
          <button
            id="close-customize-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Live Preview Box */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Live Preview
            </label>
            <div
              className={`p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 relative transition-all ${
                customization.bgPattern === "dots"
                  ? "chat-pattern-dots bg-neutral-50 dark:bg-neutral-950"
                  : customization.bgPattern === "grid"
                  ? "chat-pattern-grid bg-neutral-50 dark:bg-neutral-950"
                  : customization.bgPattern === "mesh"
                  ? "chat-pattern-mesh bg-neutral-50 dark:bg-neutral-950"
                  : "bg-neutral-50 dark:bg-neutral-950"
              }`}
            >
              <div className="space-y-2.5">
                {/* User message preview */}
                <div className="flex justify-end">
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium ${
                      customization.accentTheme === "emerald"
                        ? "bg-emerald-600 text-white"
                        : customization.accentTheme === "violet"
                        ? "bg-violet-600 text-white"
                        : customization.accentTheme === "amber"
                        ? "bg-amber-500 text-white"
                        : customization.accentTheme === "rose"
                        ? "bg-rose-600 text-white"
                        : customization.accentTheme === "cyan"
                        ? "bg-cyan-600 text-white"
                        : customization.accentTheme === "slate"
                        ? "bg-slate-700 text-white"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    Can you explain Time Complexity of Binary Search?
                  </div>
                </div>

                {/* AI response preview */}
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                      customization.accentTheme === "emerald"
                        ? "bg-emerald-600"
                        : customization.accentTheme === "violet"
                        ? "bg-violet-600"
                        : customization.accentTheme === "amber"
                        ? "bg-amber-500"
                        : customization.accentTheme === "rose"
                        ? "bg-rose-600"
                        : customization.accentTheme === "cyan"
                        ? "bg-cyan-600"
                        : customization.accentTheme === "slate"
                        ? "bg-slate-700"
                        : "bg-indigo-600"
                    }`}
                  >
                    {customization.aiAvatar === "robot" ? (
                      <Bot className="w-4 h-4" />
                    ) : customization.aiAvatar === "owl" ? (
                      <GraduationCap className="w-4 h-4" />
                    ) : customization.aiAvatar === "brain" ? (
                      <Brain className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] p-3 text-xs sm:text-sm ${
                      customization.bubbleStyle === "card"
                        ? "rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-sm"
                        : customization.bubbleStyle === "high-contrast"
                        ? "rounded-xl bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-200"
                        : customization.bubbleStyle === "minimal"
                        ? "rounded-lg bg-transparent text-neutral-800 dark:text-neutral-200"
                        : "rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs"
                    }`}
                  >
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Time Complexity: O(log n)
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-300 text-[11px] sm:text-xs mt-0.5">
                      Because the search space is divided in half at each step.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Theme Accent Colors */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              1. Chat Accent Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_OPTIONS.map((theme) => {
                const isActive = customization.accentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    id={`theme-accent-${theme.id}`}
                    type="button"
                    onClick={() => handleChange("accentTheme", theme.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-left ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 font-semibold shadow-xs"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${theme.colorClass} shrink-0`} />
                    <span className="text-xs text-neutral-800 dark:text-neutral-200 truncate">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Font Size */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              2. Reading Typography & Font Size
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FONT_SIZES.map((fs) => {
                const isActive = customization.fontSize === fs.id;
                return (
                  <button
                    key={fs.id}
                    id={`fontsize-${fs.id}`}
                    type="button"
                    onClick={() => handleChange("fontSize", fs.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 font-semibold"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-neutral-900 dark:text-white font-medium">
                        {fs.label}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                      {fs.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Message Bubble Style */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              3. Message Bubble Layout
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BUBBLE_STYLES.map((style) => {
                const isActive = customization.bubbleStyle === style.id;
                return (
                  <button
                    key={style.id}
                    id={`bubble-style-${style.id}`}
                    type="button"
                    onClick={() => handleChange("bubbleStyle", style.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 font-semibold"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-neutral-900 dark:text-white font-medium">
                        {style.label}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                      {style.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Background Pattern */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              4. Chat Canvas Background
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PATTERNS.map((p) => {
                const isActive = customization.bgPattern === p.id;
                return (
                  <button
                    key={p.id}
                    id={`bg-pattern-${p.id}`}
                    type="button"
                    onClick={() => handleChange("bgPattern", p.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? "border-indigo-600 ring-1 ring-indigo-500 font-semibold"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg mb-1.5 border border-neutral-300 dark:border-neutral-700 ${p.previewClass}`} />
                    <span className="text-xs text-neutral-800 dark:text-neutral-200">
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. AI Avatar Persona */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              5. AI Companion Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((av) => {
                const IconComponent = av.icon;
                const isActive = customization.aiAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    id={`ai-avatar-${av.id}`}
                    type="button"
                    onClick={() => handleChange("aiAvatar", av.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 font-semibold"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs text-neutral-800 dark:text-neutral-200 truncate">
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Behavioral Toggles */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              <div>
                <span className="text-xs font-medium text-neutral-900 dark:text-white block">
                  Show Message Timestamps
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  Displays precise time badges under each study message
                </span>
              </div>
              <input
                id="toggle-timestamps"
                type="checkbox"
                checked={customization.showTimestamps}
                onChange={(e) => handleChange("showTimestamps", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 flex items-center justify-between">
          <button
            id="reset-customization-btn"
            type="button"
            onClick={onResetCustomization}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
          <button
            id="apply-customization-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
