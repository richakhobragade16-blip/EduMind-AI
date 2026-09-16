import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, X } from "lucide-react";

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<"focus" | "break" | "longBreak">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const durations: Record<"focus" | "break" | "longBreak", number> = {
    focus: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (soundEnabled) {
        playBeep();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, soundEnabled]);

  // Click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const handleModeChange = (newMode: "focus" | "break" | "longBreak") => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  return (
    <div className="relative" ref={popoverRef}>
      {/* Header Pill */}
      <button
        id="pomodoro-timer-pill"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
          isRunning
            ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
            : "bg-neutral-100 dark:bg-neutral-800 border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        }`}
        title="Study Focus Timer"
      >
        <Timer className={`w-3.5 h-3.5 ${isRunning ? "text-indigo-600 dark:text-indigo-400 animate-pulse" : ""}`} />
        <span className="font-mono">{formattedTime}</span>
        {isRunning && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        )}
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <Timer className="w-4 h-4 text-indigo-600" />
              <span>Study Focus Timer</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium">
            <button
              onClick={() => handleModeChange("focus")}
              className={`py-1 rounded-lg transition-colors ${
                mode === "focus"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => handleModeChange("break")}
              className={`py-1 rounded-lg transition-colors ${
                mode === "break"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              5m Break
            </button>
            <button
              onClick={() => handleModeChange("longBreak")}
              className={`py-1 rounded-lg transition-colors ${
                mode === "longBreak"
                  ? "bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              15m Rest
            </button>
          </div>

          {/* Timer Clock */}
          <div className="text-center py-2">
            <div className="text-3xl font-mono font-bold tracking-tight text-neutral-900 dark:text-white">
              {formattedTime}
            </div>
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={soundEnabled ? "Mute notification" : "Unmute notification"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={resetTimer}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
