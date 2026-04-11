"use client";

import Link from "next/link";
import CopyButton from "./CopyButton";
import AnalyticsCard from "./AnalyticsCard";
import { getPlatformDisplayName } from "@/lib/platform-detect";

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  targetApp: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  createdAt: string;
  _count?: { clicks: number };
}

interface LinkResultCardProps {
  link: LinkData;
  baseUrl: string;
}

export default function LinkResultCard({ link, baseUrl }: LinkResultCardProps) {
  const shortUrl = `${baseUrl}/${link.shortCode}`;

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

  const badgeColor = link.targetApp
    ? platformColors[link.targetApp] ?? "bg-[#e0e0e0] text-black"
    : "bg-[#e0e0e0] text-black";

  return (
    <div className="memphis-card p-6 flex flex-col gap-4 animate-pop-in relative z-20">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-black uppercase border-2 border-black transform rotate-1 ${badgeColor}`}>
              {getPlatformDisplayName(link.targetApp)}
            </span>
            <span className="text-xs font-bold bg-[#39FF14] px-2 py-1 border-2 border-black">
              {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black bg-[#00E5FF] px-3 py-1 font-mono text-lg font-bold border-2 border-black truncate hover:bg-[#FFD500] transition-colors"
            >
              {shortUrl}
            </a>
            <CopyButton text={shortUrl} />
          </div>

          <p className="text-sm font-bold text-gray-700 truncate" title={link.originalUrl}>
            → {link.originalUrl}
          </p>
        </div>

        {/* Analytics Link Button for each link */}
        <Link 
          href={`/analytics/${link.shortCode}`}
          className="shrink-0 block mt-2 sm:mt-0"
        >
          <div className="memphis-button text-sm px-6 py-3 cursor-pointer text-center bg-[#FF007F] text-white">
            Supercharged Analytics 🚀
          </div>
        </Link>

      </div>

      {/* OG Preview */}
      {(link.ogTitle || link.ogImage) && (
        <div className="flex gap-4 p-4 bg-[#f4f4f0] border-4 border-black border-dashed mt-2 transform -rotate-1">
          {link.ogImage && (
            <img
              src={link.ogImage}
              alt={link.ogTitle ?? "Preview"}
              className="w-24 h-24 object-cover border-4 border-black shrink-0 shadow-[4px_4px_0_0_#000]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div className="flex flex-col justify-center min-w-0">
            {link.ogTitle && (
              <p className="text-lg font-black text-black truncate underline decoration-[#FFD500] decoration-4 text-underline-offset-4">
                {link.ogTitle}
              </p>
            )}
            {link.ogDescription && (
              <p className="text-sm font-semibold text-gray-800 mt-2 line-clamp-2">
                {link.ogDescription}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Simple Inline Analytics (old view fallback if wanted, or hidden) */}
      <div className="mt-2 text-sm font-bold text-black flex items-center gap-2">
        <span className="bg-[#FFD500] px-2 py-1 border-2 border-black">Clicks: {link._count?.clicks ?? 0}</span>
      </div>

    </div>
  );
}
