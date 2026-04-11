"use client";

import Link from "next/link";
import CopyButton from "./CopyButton";
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
  onDelete: () => void;
}

export default function LinkResultCard({ link, baseUrl, onDelete }: LinkResultCardProps) {
  const shortUrl = `${baseUrl}/${link.shortCode}`;

  const platformColors: Record<string, string> = {
    youtube: "bg-[#fee2e2] text-red-800",
    spotify: "bg-[#dcfce7] text-green-800",
    instagram: "bg-[#fce7f3] text-pink-800",
    twitter: "bg-[#e0f2fe] text-blue-800",
    reddit: "bg-[#ffedd5] text-orange-800",
    linkedin: "bg-[#dbeafe] text-indigo-800",
    facebook: "bg-[#dbeafe] text-blue-900",
    tiktok: "bg-[#f3f4f6] text-gray-800",
    pinterest: "bg-[#fee2e2] text-red-900",
  };

  const badgeColor = link.targetApp
    ? platformColors[link.targetApp] ?? "bg-[var(--bg-color)] text-[var(--text-muted)] border border-[var(--border-color)]"
    : "bg-[var(--bg-color)] text-[var(--text-muted)] border border-[var(--border-color)]";

  return (
    <div className="clay-card p-6 flex flex-col gap-5 relative h-full group hover:bg-[var(--card-bg)]/80 transition-colors">
      
      {/* Delete Button */}
      <button 
        onClick={onDelete}
        title="Remove Link"
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center clay-btn text-red-400 hover:text-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="flex flex-col gap-4 flex-1">
        
        {/* Header Badges */}
        <div className="flex items-center gap-2 pr-8 flex-wrap">
          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${badgeColor}`}>
            {getPlatformDisplayName(link.targetApp)}
          </span>
          <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-color)] px-2 py-1 rounded-full border border-[var(--border-color)]">
            {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Links & Copy */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-pastel-blue)] font-medium text-lg truncate hover:underline underline-offset-4 mix-blend-difference"
              style={{ filter: "brightness(0.6) saturate(2)" }} // subtle enhancement for pastel legibility
            >
              {shortUrl.replace(/^https?:\/\//, '')}
            </a>
            <CopyButton text={shortUrl} className="shrink-0 scale-90 sm:scale-100 origin-left" />
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)] truncate" title={link.originalUrl}>
            ↳ {link.originalUrl}
          </p>
        </div>

        {/* Spacer to push analytics to the bottom if cards stretch */}
        <div className="flex-1" />

        {/* OG Preview */}
        {(link.ogTitle || link.ogImage) && (
          <div className="flex gap-4 p-3 rounded-2xl bg-[var(--bg-color)] border border-[var(--border-color)] mt-4">
            {link.ogImage && (
              <img
                src={link.ogImage}
                alt={link.ogTitle ?? "Preview"}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="flex flex-col justify-center min-w-0">
              {link.ogTitle && (
                <p className="text-sm font-bold text-[var(--text-main)] truncate">
                  {link.ogTitle}
                </p>
              )}
              {link.ogDescription && (
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                  {link.ogDescription}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar: Clicks & Analytics Button */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <div className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-2">
            <span className="bg-[var(--bg-color)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              Clicks: <span className="font-bold text-[var(--text-main)]">{link._count?.clicks ?? 0}</span>
            </span>
          </div>

          <Link
            href={`/analytics/${link.shortCode}`}
            className="shrink-0"
          >
            <div className="text-sm px-4 py-2 cursor-pointer text-center text-[var(--text-main)] hover:bg-[var(--color-pastel-purple)] rounded-full transition-colors border border-[rgba(255,255,255,0.1)] group flex items-center gap-2">
              <span className="font-semibold">Analytics</span>
              <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
