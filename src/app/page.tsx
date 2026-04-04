/**
 * Dashboard Page (Home)
 *
 * The main landing page where users can:
 * 1. Paste a URL and generate a smart short link
 * 2. View their created links with OG previews
 * 3. See click analytics per link
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import LinkInputBox from "@/components/LinkInputBox";
import LinkResultCard from "@/components/LinkResultCard";

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

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  /** Fetch all existing links on mount */
  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error("Failed to fetch links:", err);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  /** Handle new link creation */
  const handleCreateLink = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? "Failed to create link");
      }

      const newLink = await res.json();
      // Prepend the new link to the list
      setLinks((prev) => [newLink, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo / Brand */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 animate-slide-down">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-semibold text-indigo-400 tracking-wide">
              DeepLink
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart App Links
            </span>
            <br />
            <span className="text-white/90 text-2xl sm:text-3xl font-semibold">
              in seconds
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Paste any app URL — YouTube, Spotify, Instagram — and get a
            smart short link that opens the native app on mobile or falls
            back to the browser.
          </p>

          {/* ─── Input Box ───────────────────────────────────── */}
          <LinkInputBox onSubmit={handleCreateLink} isLoading={isLoading} />

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-down">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ─── Links List ────────────────────────────────────────── */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {links.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">
                Your Links
              </h2>
              <span className="text-xs text-gray-500">
                {links.length} link{links.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="space-y-4">
            {links.map((link) => (
              <LinkResultCard
                key={link.id}
                link={link}
                baseUrl={baseUrl}
              />
            ))}
          </div>

          {/* Empty state */}
          {links.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-gray-500 text-sm">
                Paste a URL above to create your first smart link
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-6 px-4 text-center">
        <p className="text-xs text-gray-600">
          DeepLink Generator · Built with Next.js, Prisma & Neon
        </p>
      </footer>
    </main>
  );
}
