"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`clay-btn inline-flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 ${
        copied
          ? "bg-[var(--color-pastel-green)] text-green-900 shadow-[var(--shadow-btn-active)]"
          : "bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--color-pastel-blue)]"
      } ${className}`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-green-700" stroke="currentColor" strokeWidth={3} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Copied</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" stroke="currentColor" strokeWidth={2} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Copy</span>
        </>
      )}
    </button>
  );
}
