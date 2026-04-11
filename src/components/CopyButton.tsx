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
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-black uppercase border-2 border-black transition-all duration-200 ${copied
          ? "bg-[#39FF14] text-black shadow-[2px_2px_0_0_#000] translate-x-[2px] translate-y-[2px]"
          : "bg-white text-black shadow-[4px_4px_0_0_#000] hover:bg-[#FFD500] hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-[2px] hover:-translate-y-[2px]"
        } ${className}`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" stroke="currentColor" strokeWidth={3} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
          </svg>
          COPIED
        </>
      ) : (
        <>
          <svg className="w-4 h-4" stroke="currentColor" strokeWidth={2} fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          COPY
        </>
      )}
    </button>
  );
}
