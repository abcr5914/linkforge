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

  const chipStyles: Record<string, string> = {
    youtube: "bg-[var(--yt-bg)] text-[var(--yt-text)]",
    spotify: "bg-[var(--sp-bg)] text-[var(--sp-text)]",
    instagram: "bg-[var(--ig-bg)] text-[var(--ig-text)]",
    twitter: "bg-[var(--tw-bg)] text-[var(--tw-text)]",
    reddit: "bg-[var(--rd-bg)] text-[var(--rd-text)]",
    linkedin: "bg-[var(--li-bg)] text-[var(--li-text)]",
    facebook: "bg-[var(--fb-bg)] text-[var(--fb-text)]",
    tiktok: "bg-[var(--tk-bg)] text-[var(--tk-text)]",
    pinterest: "bg-[var(--pt-bg)] text-[var(--pt-text)]",
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="card p-1.5 flex flex-col sm:flex-row items-center gap-1.5">

        {detectedPlatform && (
          <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide fade-in ${chipStyles[detectedPlatform] ?? "bg-[var(--bg-inset)] text-[var(--text-2)]"}`}>
            {getPlatformDisplayName(detectedPlatform)}
          </span>
        )}

        <input
          type="text"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste any app URL..."
          className="flex-1 bg-transparent text-[var(--text-1)] placeholder-[var(--text-3)] outline-none text-sm px-3 py-2.5 min-w-0"
          disabled={isLoading}
          autoFocus
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="btn btn-primary w-full sm:w-auto px-5 py-2 text-sm"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating...
            </span>
          ) : "Generate"}
        </button>
      </div>
    </form>
  );
}
