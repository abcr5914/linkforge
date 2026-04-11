/**
 * Dashboard Page (Home)
 * Memphis Redesign
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
      setLinks((prev) => [newLink, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative Memphis Shapes */}
      <div className="absolute top-10 left-10 shape-circle animate-pop-in pointer-events-none" style={{ animationDelay: "0.1s" }} />
      <div className="absolute top-40 right-20 shape-triangle animate-pop-in pointer-events-none" style={{ animationDelay: "0.2s" }} />
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-[#00E5FF] border-4 border-black box-shadow-[4px_4px_0_0_#000] rotate-12 animate-pop-in pointer-events-none" style={{ animationDelay: "0.3s" }} />
      <div className="absolute top-20 right-1/4 w-8 h-8 rounded-full bg-[#39FF14] border-4 border-black animate-pop-in pointer-events-none" style={{ animationDelay: "0.4s" }} />

      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative pt-16 pb-8 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-3xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] transform -rotate-2 animate-pop-in">
            <span className="text-xl">🔗</span>
            <span className="text-sm font-black uppercase tracking-widest text-black">
              DeepLink App
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4 text-black uppercase animate-pop-in" style={{ WebkitTextStroke: "2px black", textShadow: "4px 4px 0px #FFD500, 8px 8px 0px #FF007F" }}>
            Smart Links
            <br />
            <span className="text-4xl sm:text-6xl text-white underline decoration-8 decoration-[#00E5FF]" style={{ WebkitTextStroke: "2px black", textShadow: "4px 4px 0px #000" }}>
              in seconds
            </span>
          </h1>

          <p className="text-black font-medium text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed bg-white border-4 border-black p-4 shadow-[6px_6px_0_0_#000] transform rotate-1 mt-6 animate-pop-in delay-150">
            Paste any app URL — YouTube, Spotify, Instagram — and get a
            smart short link that opens the native app on mobile!
          </p>

          {/* ─── Input Box ───────────────────────────────────── */}
          <div className="animate-pop-in" style={{ animationDelay: '0.3s' }}>
            <LinkInputBox onSubmit={handleCreateLink} isLoading={isLoading} />
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 p-4 bg-red-400 border-4 border-black text-black font-bold shadow-[6px_6px_0_0_#000] animate-pop-in transform -rotate-1">
              [!] {error}
            </div>
          )}
        </div>
      </section>

      {/* ─── Links List ────────────────────────────────────────── */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 pb-16 z-10 mt-10">
        <div className="max-w-3xl mx-auto">
          {links.length > 0 && (
            <div className="mb-6 flex items-center justify-between bg-white border-4 border-black p-3 shadow-[4px_4px_0_0_#000]">
              <h2 className="text-xl font-black text-black uppercase">
                Your Links
              </h2>
              <span className="text-sm font-bold bg-[#FFD500] px-3 py-1 border-2 border-black">
                {links.length} ITEM{links.length !== 1 ? "S" : ""}
              </span>
            </div>
          )}

          <div className="space-y-8">
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
            <div className="text-center py-16 bg-white border-4 border-black shadow-[8px_8px_0_0_#000] memphis-card mt-10 transform -rotate-1">
              <div className="text-7xl mb-6 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">🚀</div>
              <p className="text-black font-black text-xl uppercase">
                Waiting for your first link...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="border-t-4 border-black bg-white py-6 px-4 text-center z-10 relative">
        <p className="text-sm font-bold text-black uppercase tracking-widest">
          DeepLink Generator · Built with Style ⚡
        </p>
      </footer>
    </main>
  );
}
