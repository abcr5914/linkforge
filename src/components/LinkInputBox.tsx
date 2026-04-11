"use client";

import { useState, FormEvent } from "react";
import { getPlatformDisplayName } from "@/lib/platform-detect";

interface LinkInputBoxProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export default function LinkInputBox({ onSubmit, isLoading }: LinkInputBoxProps) {
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setUrl(value);

    try {
      const hostname = new URL(value.trim()).hostname.toLowerCase();
      const platforms: Record<string, string> = {
        "youtube.com": "youtube", "youtu.be": "youtube", "music.youtube.com": "youtube",
        "open.spotify.com": "spotify", "spotify.com": "spotify",
        "instagram.com": "instagram", "www.instagram.com": "instagram",
        "twitter.com": "twitter", "x.com": "twitter",
        "reddit.com": "reddit", "www.reddit.com": "reddit",
        "linkedin.com": "linkedin", "www.linkedin.com": "linkedin",
        "facebook.com": "facebook", "www.facebook.com": "facebook", "fb.com": "facebook",
        "tiktok.com": "tiktok", "www.tiktok.com": "tiktok",
        "pinterest.com": "pinterest", "www.pinterest.com": "pinterest",
      };
      const match = Object.entries(platforms).find(([h]) =>
        hostname === h || hostname.endsWith(`.${h}`)
      );
      setDetectedPlatform(match ? match[1] : null);
    } catch {
      setDetectedPlatform(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    await onSubmit(url.trim());
    setUrl("");
    setDetectedPlatform(null);
  };

  const platformColors: Record<string, string> = {
    youtube: "bg-[#fee2e2] text-red-700",
    spotify: "bg-[#dcfce7] text-green-700",
    instagram: "bg-[#fce7f3] text-pink-700",
    twitter: "bg-[#e0f2fe] text-blue-700",
    reddit: "bg-[#ffedd5] text-orange-700",
    linkedin: "bg-[#dbeafe] text-indigo-700",
    facebook: "bg-[#dbeafe] text-blue-800",
    tiktok: "bg-[#f3f4f6] text-gray-800",
    pinterest: "bg-[#fee2e2] text-red-800",
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-20">
      <div className="clay-card p-3 flex flex-col sm:flex-row items-center gap-4 transition-all w-full backdrop-blur-sm">
        
        {detectedPlatform && (
          <span
            className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold uppercase transition-fade-in ${platformColors[detectedPlatform] ?? "bg-[var(--card-bg)] text-[var(--text-muted)]"}`}
          >
            {getPlatformDisplayName(detectedPlatform)}
          </span>
        )}

        <input
          type="text"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste app URL here..."
          className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] font-medium outline-none text-base px-2 py-3 min-w-0"
          disabled={isLoading}
          autoFocus
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="clay-btn clay-btn-primary w-full sm:w-auto px-8 py-3 text-base flex-shrink-0"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Crafting...
            </span>
          ) : "Generate"}
        </button>

      </div>
    </form>
  );
}
