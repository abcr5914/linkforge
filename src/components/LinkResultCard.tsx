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

  const badge = link.targetApp
    ? chipStyles[link.targetApp] ?? "bg-[var(--bg-inset)] text-[var(--text-2)]"
    : "bg-[var(--bg-inset)] text-[var(--text-2)]";

  return (
    <div className="card p-5 flex flex-col gap-3 relative h-full group">

      {/* Delete */}
      <button
        onClick={onDelete}
        title="Remove"
        className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-3)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] opacity-0 group-hover:opacity-100 transition-all"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="flex flex-col gap-3 flex-1">

        {/* Platform + Date */}
        <div className="flex items-center gap-2 pr-6">
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wide ${badge}`}>
            {getPlatformDisplayName(link.targetApp)}
          </span>
          <span className="text-[10px] text-[var(--text-3)]">
            {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* URL + Copy */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] font-medium text-sm truncate hover:underline underline-offset-2"
            >
              {shortUrl.replace(/^https?:\/\//, '')}
            </a>
            <CopyButton text={shortUrl} />
          </div>
          <p className="text-[11px] text-[var(--text-3)] truncate" title={link.originalUrl}>
            ↳ {link.originalUrl}
          </p>
        </div>

        <div className="flex-1" />

        {/* OG Preview */}
        {(link.ogTitle || link.ogImage) && (
          <div className="flex gap-3 p-2.5 rounded-xl card-inset">
            {link.ogImage && (
              <img
                src={link.ogImage}
                alt={link.ogTitle ?? "Preview"}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div className="flex flex-col justify-center min-w-0">
              {link.ogTitle && <p className="text-xs font-medium text-[var(--text-1)] truncate">{link.ogTitle}</p>}
              {link.ogDescription && <p className="text-[10px] text-[var(--text-3)] mt-0.5 line-clamp-2">{link.ogDescription}</p>}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-1 text-xs text-[var(--text-2)]">
            <span className="font-semibold text-[var(--text-1)]">{link._count?.clicks ?? 0}</span>
            clicks
          </div>
          <Link href={`/analytics/${link.shortCode}`}>
            <span className="btn btn-outline text-xs px-3 py-1 gap-1">
              Analytics
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
