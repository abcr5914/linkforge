/**
 * LinkResultCard Component
 *
 * Displays a generated short link with:
 * - The short URL and copy button
 * - Detected platform badge
 * - OG preview (title, description, image)
 * - Inline analytics
 */

"use client";

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

  const badgeColor = link.targetApp
    ? platformColors[link.targetApp] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"
    : "bg-gray-500/20 text-gray-400 border-gray-500/30";

  return (
    <div className="glass-card p-5 rounded-2xl space-y-4 animate-slide-up">
      {/* Header: Short URL + Copy + Platform badge */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          {/* Platform badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${badgeColor}`}>
              {getPlatformDisplayName(link.targetApp)}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Short URL */}
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-mono text-sm truncate transition-colors"
            >
              {shortUrl}
            </a>
            <CopyButton text={shortUrl} />
          </div>

          {/* Original URL (truncated) */}
          <p className="text-xs text-gray-500 mt-1 truncate" title={link.originalUrl}>
            → {link.originalUrl}
          </p>
        </div>
      </div>

      {/* OG Preview */}
      {(link.ogTitle || link.ogImage) && (
        <div className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {link.ogImage && (
            <img
              src={link.ogImage}
              alt={link.ogTitle ?? "Preview"}
              className="w-20 h-20 object-cover rounded-lg shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div className="min-w-0">
            {link.ogTitle && (
              <p className="text-sm font-medium text-gray-200 truncate">
                {link.ogTitle}
              </p>
            )}
            {link.ogDescription && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {link.ogDescription}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Analytics */}
      <AnalyticsCard shortCode={link.shortCode} />
    </div>
  );
}
