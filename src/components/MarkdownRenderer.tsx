import React, { useState } from "react";
import Markdown from "react-markdown";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="text-sm sm:text-base leading-relaxed break-words space-y-3">
      <Markdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs sm:text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match ? match[1] : "code"} code={codeText} />
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mt-4 mb-2">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 dark:text-white mt-3 mb-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-3 mb-1">
                {children}
              </h3>
            );
          },
          p({ children }) {
            return <p className="mb-2 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-outside pl-5 space-y-1 mb-2">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-outside pl-5 space-y-1 mb-2">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-500/50 pl-4 py-1 italic my-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-r">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-left text-xs sm:text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-neutral-100 dark:bg-neutral-800/70 font-semibold text-neutral-800 dark:text-neutral-200">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return <th className="px-3 py-2">{children}</th>;
          },
          td({ children }) {
            return (
              <td className="px-3 py-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                {children}
              </td>
            );
          },
          hr() {
            return <hr className="my-4 border-neutral-200 dark:border-neutral-800" />;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 font-medium"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 shadow-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-950/80 border-b border-neutral-800 text-xs font-mono text-neutral-400">
        <span className="uppercase font-semibold tracking-wider text-[11px] text-neutral-300">
          {language || "code"}
        </span>
        <button
          id={`copy-code-${language}`}
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px] font-sans">Copy Code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-neutral-900 text-neutral-100">
        <pre>{code}</pre>
      </div>
    </div>
  );
};
