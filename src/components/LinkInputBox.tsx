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
    youtube: "bg-[#FF0000] text-white",
    spotify: "bg-[#1DB954] text-black",
    instagram: "bg-[#E1306C] text-white",
    twitter: "bg-[#1DA1F2] text-white",
    reddit: "bg-[#FF4500] text-white",
    linkedin: "bg-[#0A66C2] text-white",
    facebook: "bg-[#1877F2] text-white",
    tiktok: "bg-[#000000] text-white",
    pinterest: "bg-[#E60023] text-white",
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-20">
      <div className="memphis-input p-2 flex flex-col sm:flex-row items-center gap-4 transition-all">
        {detectedPlatform && (
          <span
            className={`shrink-0 px-4 py-2 text-sm font-black uppercase border-4 border-black shadow-[4px_4px_0_0_#000] transform -rotate-2 ${
              platformColors[detectedPlatform] ?? "bg-gray-300 text-black"
            }`}
          >
            {getPlatformDisplayName(detectedPlatform)}
          </span>
        )}

        <input
          type="text"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="PASTE URL HERE..."
          className="flex-1 bg-transparent text-black placeholder-gray-500 font-bold outline-none text-lg px-4 py-3 min-w-0"
          disabled={isLoading}
          autoFocus
        />

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="memphis-button w-full sm:w-auto px-8 py-4 text-lg"
        >
          {isLoading ? "CREATING..." : "GENERATE"}
        </button>
      </div>
    </form>
  );
}
