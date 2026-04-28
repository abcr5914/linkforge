/**
 * Dashboard — Clean, minimal
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
        let errorMessage = "Failed to create link";
        try {
          const errData = await res.json();
          errorMessage = errData.error ?? errorMessage;
        } catch {
          errorMessage = `Server Error: ${res.status} ${res.statusText}. Please try again later.`;
        }
        throw new Error(errorMessage);
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
    const isConfirmed = window.confirm("Remove this link? Analytics will be permanently deleted.");
    if (!isConfirmed) return;
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--bg)]">

      {/* Nav */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.654a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.934" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[var(--text-1)]" style={{ fontFamily: "var(--font-heading)" }}>
            LinkForge
          </span>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost text-xs px-3 py-1.5">
          Logout
        </button>
      </header>

      {/* Hero */}
      <section className="pt-14 pb-10 px-6 text-center fade-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-1)] leading-[1.1] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Create smart,{" "}
          <span className="text-gradient">native</span>
          <br />
          app links
        </h1>
        <p className="text-base text-[var(--text-2)] max-w-md mx-auto leading-relaxed mb-8">
          Paste any app URL. Get a short link that opens the native app on mobile.
        </p>

        <div className="max-w-xl mx-auto">
          <LinkInputBox onSubmit={handleCreateLink} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-[var(--danger-light)] text-[var(--danger)] text-sm font-medium fade-in break-words">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Links */}
      <section className="flex-1 px-4 sm:px-6 lg:px-12 pb-20 fade-up d2">
        <div className="max-w-[1300px] mx-auto">

          {links.length > 0 && (
            <div className="mb-5 flex items-center gap-3 pb-3 border-b border-[var(--border)]">
              <h2 className="text-base font-bold text-[var(--text-1)]" style={{ fontFamily: "var(--font-heading)" }}>
                Your Links
              </h2>
              <span className="pill text-[10px]">{links.length}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {links.map((link, i) => (
              <div key={link.id} className="fade-up" style={{ animationDelay: `${Math.min(i * 0.04, 0.25)}s` }}>
                <LinkResultCard
                  link={link}
                  baseUrl={baseUrl}
                  onDelete={() => handleDeleteLink(link.id)}
                />
              </div>
            ))}
          </div>

          {links.length === 0 && !isLoading && (
            <div className="text-center py-20 fade-up d2">
              <div className="text-4xl mb-4 opacity-30">🔗</div>
              <p className="text-sm text-[var(--text-2)]">
                Paste your first URL above to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="w-full py-5 text-center text-[var(--text-3)] text-xs border-t border-[var(--border)]">
        LinkForge
      </footer>
    </main>
  );
}
