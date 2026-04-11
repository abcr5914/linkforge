/**
 * Dashboard Page (Home)
 * Claymorphism Style
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

  const handleDeleteLink = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this link? All analytics will be permanently deleted.");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete link");
      }

      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the link. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 z-10 w-full mb-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          
          <div className="inline-flex items-center gap-2 px-6 py-2 clay-pill mx-auto text-[var(--color-pastel-blue)]">
            <span className="text-xl animate-float inline-block">✨</span>
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
              Welcome to linkforge
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-main)] leading-tight">
            Create smart, <span className="text-[var(--text-muted)] italic font-medium">native</span> <br />
            app links
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Convert any app URL — YouTube, Spotify, Instagram — into a single smart short link that forces the native app to open on mobile devices.
          </p>

          {/* ─── Input Box ───────────────────────────────────── */}
          <div className="max-w-2xl mx-auto pt-6">
            <LinkInputBox onSubmit={handleCreateLink} isLoading={isLoading} />
            
            {/* Error message */}
            {error && (
              <div className="mt-6 p-4 clay-card bg-[var(--color-pastel-pink)] text-red-900 font-semibold text-sm animate-fade-in break-words">
                Oops: {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Links List Section ────────────────────────────────── */}
      <section className="flex-1 px-4 sm:px-6 lg:px-12 xl:px-16 pb-20 z-10 w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="max-w-[1400px] mx-auto w-full">
          
          {links.length > 0 && (
            <div className="mb-8 flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <h2 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
                Your Connections
                <span className="clay-pill bg-[var(--color-pastel-blue)] text-xs text-[var(--text-main)] px-3 py-1">
                  {links.length}
                </span>
              </h2>
            </div>
          )}

          {/* Render in a responsive grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {links.map((link) => (
              <div key={link.id} className="h-full">
                <LinkResultCard
                  link={link}
                  baseUrl={baseUrl}
                  onDelete={() => handleDeleteLink(link.id)}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {links.length === 0 && !isLoading && (
            <div className="text-center py-24 clay-card max-w-2xl mx-auto mt-12 bg-transparent border-none shadow-none">
              <div className="text-7xl mb-6 animate-float opacity-50">☁️</div>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">
                No links crafted yet
              </h3>
              <p className="text-[var(--text-muted)] text-lg">
                Paste your first link in the input above to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="w-full py-8 text-center text-[var(--text-muted)] text-sm font-medium border-t border-[var(--border-color)] bg-[var(--bg-color)]">
        Crafted with minimal clay & pastel dreams.
      </footer>
    </main>
  );
}
