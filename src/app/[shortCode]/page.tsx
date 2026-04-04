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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-3xl max-w-md w-full text-center animate-slide-up">
        {/* Loading indicator */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white mb-2">
          Opening {link.targetApp ? link.targetApp.charAt(0).toUpperCase() + link.targetApp.slice(1) : "link"}...
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Redirecting you to the app. If nothing happens,{" "}
          <a
            href={link.originalUrl}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            click here
          </a>
          .
        </p>

        {/* OG Preview */}
        {link.ogTitle && (
          <div className="text-left p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
            {link.ogImage && (
              <img
                src={link.ogImage}
                alt={link.ogTitle}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <p className="text-sm font-medium text-gray-200">
              {link.ogTitle}
            </p>
            {link.ogDescription && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {link.ogDescription}
              </p>
            )}
          </div>
        )}

        {/* Client-side redirect handler */}
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
