/**
 * Smart Redirect Page: /[shortCode]
 *
 * This is the heart of the deep link engine. When someone opens a
 * short link, this page:
 *
 * 1. (Server) Looks up the link data + OG tags from the database.
 * 2. (Server) Renders OG meta tags in <head> for social media previews.
 * 3. (Client) Fires a click-tracking beacon (non-blocking).
 * 4. (Client) Attempts to open the native app via URI scheme.
 * 5. (Client) Falls back to the web URL after a 1500ms timeout.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RedirectHandler from "./RedirectHandler";
import { getDeepLinkUri } from "@/lib/deeplink-schemes";

// ---------------------------------------------------------------------------
// ISR: Cache this page at the edge for 24 hours.
// After the first render, Vercel serves all subsequent requests (including
// bot swarms from Discord/Twitter/iMessage) from CDN — zero function
// invocations. The page revalidates in the background after 24h.
// ---------------------------------------------------------------------------
export const revalidate = 86400;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PageProps {
  params: Promise<{ shortCode: string }>;
}

// ---------------------------------------------------------------------------
// Dynamic metadata (OG tags for social media previews)
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return { title: "Link Not Found" };
  }

  return {
    title: link.ogTitle ?? "DeepLink Redirect",
    description: link.ogDescription ?? `Open ${link.originalUrl}`,
    openGraph: {
      title: link.ogTitle ?? "DeepLink Redirect",
      description: link.ogDescription ?? `Open ${link.originalUrl}`,
      ...(link.ogImage && {
        images: [{ url: link.ogImage, width: 1200, height: 630 }],
      }),
      type: "website",
      url: link.originalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: link.ogTitle ?? "DeepLink Redirect",
      description: link.ogDescription ?? `Open ${link.originalUrl}`,
      ...(link.ogImage && { images: [link.ogImage] }),
    },
  };
}

// ---------------------------------------------------------------------------
// Page Component (Server)
// ---------------------------------------------------------------------------
export default async function ShortCodePage({ params }: PageProps) {
  const { shortCode } = await params;

  // Look up the link from the database
  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    notFound();
  }

  // Pre-compute deep link URIs for both platforms
  const iosDeepLink = getDeepLinkUri(link.originalUrl, link.targetApp, "iOS");
  const androidDeepLink = getDeepLinkUri(link.originalUrl, link.targetApp, "Android");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
      <div className="card p-8 sm:p-10 max-w-sm w-full text-center fade-up">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--accent)] flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </div>

        <h1 className="text-lg font-bold text-[var(--text-1)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Opening {link.targetApp ? link.targetApp.charAt(0).toUpperCase() + link.targetApp.slice(1) : "link"}...
        </h1>
        <p className="text-sm text-[var(--text-2)] mb-6">
          Redirecting you to the app. If nothing happens,{" "}
          <a
            href={link.originalUrl}
            className="text-[var(--accent)] hover:underline underline-offset-2"
          >
            click here
          </a>
          .
        </p>

        {/* OG Preview */}
        {link.ogTitle && (
          <div className="text-left p-3 rounded-xl card-inset mb-4">
            {link.ogImage && (
              <img src={link.ogImage} alt={link.ogTitle} className="w-full h-36 object-cover rounded-lg mb-3" />
            )}
            <p className="text-sm font-medium text-[var(--text-1)]">{link.ogTitle}</p>
            {link.ogDescription && (
              <p className="text-xs text-[var(--text-3)] mt-1 line-clamp-2">{link.ogDescription}</p>
            )}
          </div>
        )}

        <RedirectHandler
          shortCode={shortCode}
          originalUrl={link.originalUrl}
          targetApp={link.targetApp}
          iosDeepLink={iosDeepLink}
          androidDeepLink={androidDeepLink}
        />
      </div>
    </div>
  );
}
