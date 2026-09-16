import React, { useState } from "react";
import {
  X,
  Rocket,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Server,
  Cloud,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"share" | "cloudrun" | "render" | "github">("share");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://ais-pre-w4x45msgtv6ocrr5obkfol-364503247798.asia-southeast1.run.app";

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(label);
      setTimeout(() => setCopiedLink(null), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="deploy-modal-card"
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Deploy & Share App
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold tracking-wide uppercase">
                  100% Free of Cost
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Zero-cost hosting options, instant share links & step-by-step instructions
              </p>
            </div>
          </div>
          <button
            id="close-deploy-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close deploy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            id="tab-share-link"
            onClick={() => setActiveTab("share")}
            className={`pb-2.5 px-2 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "share"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Instant Live Link</span>
          </button>

          <button
            id="tab-cloudrun"
            onClick={() => setActiveTab("cloudrun")}
            className={`pb-2.5 px-2 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "cloudrun"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Google Cloud Run (Recommended)</span>
          </button>

          <button
            id="tab-render"
            onClick={() => setActiveTab("render")}
            className={`pb-2.5 px-2 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "render"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Render.com (Free Tier)</span>
          </button>

          <button
            id="tab-github"
            onClick={() => setActiveTab("github")}
            className={`pb-2.5 px-2 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "github"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>GitHub & ZIP Export</span>
          </button>
        </div>

        {/* Modal Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm flex-1">
          {/* TAB 1: Instant Live Link */}
          {activeTab === "share" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Your App Is Already Live on Google Cloud Run!</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Through Google AI Studio, this application is already provisioned on a high-speed Cloud Run container with an active HTTPS certificate. You can copy the URL below to immediately test, present, or share with teachers and peers at zero cost.
                </p>
              </div>

              {/* URL Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Live Application URL (Production HTTPS)
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <Globe className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="flex-1 font-mono text-xs text-neutral-800 dark:text-neutral-200 truncate select-all">
                    {currentOrigin}
                  </span>
                  <button
                    id="copy-live-link-btn"
                    onClick={() => handleCopy(currentOrigin, "live")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors shadow-2xs"
                  >
                    {copiedLink === "live" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={currentOrigin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Free-of-cost guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 space-y-1">
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                    $0 Server Hosting
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Google Cloud Run provides 2M requests/month free on its Always-Free tier.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 space-y-1">
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                    $0 AI API Costs
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Gemini Flash models are 100% free for educational and developer usage.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 space-y-1">
                  <div className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                    Automatic SSL & CDN
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Includes automated Let's Encrypt HTTPS certificates and global low-latency CDN.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Google Cloud Run via AI Studio */}
          {activeTab === "cloudrun" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50">
                <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-950 dark:text-blue-200 text-xs sm:text-sm">
                    1-Click Deployment via Google AI Studio
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    AI Studio connects directly to Google Cloud. You can deploy this exact applet permanently to your personal or academic Google Cloud account with zero setup charges.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-xs text-neutral-900 dark:text-white uppercase tracking-wider">
                  How to Deploy in 3 Simple Steps:
                </h5>
                <ol className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/70">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-neutral-900 dark:text-white">Click "Deploy" or "Share"</strong>:
                      In the top-right header of Google AI Studio Build, click the <strong>Deploy</strong> button.
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/70">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-neutral-900 dark:text-white">Select Google Cloud Project</strong>:
                      Choose any existing GCP project or let AI Studio automatically provision the default project. Cloud Run will build and compile the Docker container automatically.
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/70">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-neutral-900 dark:text-white">Enjoy Permanent Zero-Cost Hosting</strong>:
                      Your app receives a permanent <code className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded font-mono text-[11px]">.run.app</code> domain. When no users are accessing it, it automatically scales down to 0 instances, incurring exactly $0.00 in charges.
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: Render.com Free Tier */}
          {activeTab === "render" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50">
                <h4 className="font-semibold text-purple-950 dark:text-purple-200 text-xs sm:text-sm">
                  Render.com Free Web Service (No Credit Card Required)
                </h4>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Render offers a generous 100% free tier for Node.js full-stack applications with free SSL and continuous deployment from GitHub.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Build Command:
                  </label>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                    <span>npm run build</span>
                    <button
                      onClick={() => handleCopy("npm run build", "cmd-build")}
                      className="p-1 hover:text-emerald-500"
                    >
                      {copiedLink === "cmd-build" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Start Command:
                  </label>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                    <span>npm start</span>
                    <button
                      onClick={() => handleCopy("npm start", "cmd-start")}
                      className="p-1 hover:text-emerald-500"
                    >
                      {copiedLink === "cmd-start" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Environment Variables to add in Render dashboard:
                  </label>
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200 space-y-1">
                    <div>GEMINI_API_KEY = (Your free key from Google AI Studio)</div>
                    <div>NODE_ENV = production</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GitHub & ZIP Export */}
          {activeTab === "github" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <h4 className="font-semibold text-neutral-900 dark:text-white text-xs sm:text-sm">
                  Export to GitHub or Download as ZIP
                </h4>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  You can export this entire codebase directly to your personal GitHub repository for university evaluation, resume portfolios, or local offline development.
                </p>
              </div>

              <div className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>How to Export via Google AI Studio:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 leading-relaxed pl-1">
                    <li>Click the <strong>Settings</strong> gear or project dropdown in the top header.</li>
                    <li>Select <strong>"Export to GitHub"</strong> to link your GitHub account and create a repository automatically.</li>
                    <li>Alternatively, select <strong>"Export ZIP"</strong> to download the complete source code archive to your computer.</li>
                  </ol>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <span className="font-semibold text-neutral-900 dark:text-white">Local Run Instructions:</span>
                  <pre className="p-2.5 rounded bg-neutral-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`npm install
npm run build
npm start`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-850 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guaranteed Free Tier Compatible</span>
          </div>
          <button
            id="close-deploy-footer-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
