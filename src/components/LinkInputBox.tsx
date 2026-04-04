/**
 * LinkInputBox Component
 *
 * A sleek input field for pasting URLs, with a submit button
 * and real-time platform detection indicator.
 */

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

  /** Detect the platform as the user types */
  const handleChange = (value: string) => {
    setUrl(value);

    try {
      const hostname = new URL(value.trim()).hostname.toLowerCase();
      // Simple client-side platform detection for the indicator
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

  /** Platform badge colors */
  const platformColors: Record<string, string> = {
    youtube: "bg-red-500/20 text-red-400 border-red-500/30",
    spotify: "bg-green-500/20 text-green-400 border-green-500/30",
    instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    twitter: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    reddit: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    linkedin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    facebook: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    tiktok: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    pinterest: "bg-red-600/20 text-red-300 border-red-600/30",
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-card p-2 flex items-center gap-2 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:shadow-lg focus-within:shadow-indigo-500/10">
        {/* Platform indicator badge */}
        {detectedPlatform && (
          <span
            className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all animate-fade-in ${
              platformColors[detectedPlatform] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"
            }`}
          >
            {getPlatformDisplayName(detectedPlatform)}
          </span>
        )}

        {/* URL Input */}
        <input
          type="text"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste any app URL here — YouTube, Spotify, Instagram..."
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base px-3 py-3 min-w-0"
          disabled={isLoading}
          autoFocus
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </span>
          ) : (
            "Generate Link"
          )}
        </button>
      </div>
    </form>
  );
}
