/**
 * RedirectHandler (Client Component)
 *
 * Handles the actual deep link opening logic on the client side:
 *
 * 1. Detects the user's OS (iOS / Android / Desktop)
 * 2. Fires a tracking beacon to record the click (non-blocking)
 * 3. Attempts to open the native app via the appropriate URI scheme
 * 4. Falls back to the web URL after a 1500ms timeout
 *
 * The fallback uses a visibility-based approach: if the page is still
 * visible after the timeout, it means the app didn't open, so we
 * redirect to the web URL instead.
 */

"use client";

import { useEffect, useRef } from "react";
import { detectClientOS } from "@/lib/user-agent";

interface RedirectHandlerProps {
  shortCode: string;
  originalUrl: string;
  targetApp: string | null;
  iosDeepLink: string | null;
  androidDeepLink: string | null;
}

/** How long to wait for the app to open before falling back (ms) */
const FALLBACK_TIMEOUT = 1500;

export default function RedirectHandler({
  shortCode,
  originalUrl,
  targetApp,
  iosDeepLink,
  androidDeepLink,
}: RedirectHandlerProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double-execution in React Strict Mode
    if (hasRun.current) return;
    hasRun.current = true;

    const os = detectClientOS();

    // ── 1. Track the click (non-blocking) ────────────────────────
    try {
      const payload = JSON.stringify({ shortCode, osType: os });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/clicks", new Blob([payload], { type: "application/json" }));
      } else {
        // Fallback for browsers without sendBeacon
        fetch("/api/clicks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {}); // Fire and forget
      }
    } catch {
      // Analytics should never block the redirect
    }

    // ── 2. Determine the deep link URI ───────────────────────────
    const deepLinkUri = os === "iOS" ? iosDeepLink : os === "Android" ? androidDeepLink : null;

    // ── 3. Attempt to open the native app ────────────────────────
    if (deepLinkUri && targetApp) {
      // Track whether the page lost visibility (app opened successfully)
      let appOpened = false;

      const handleVisibility = () => {
        if (document.hidden) {
          appOpened = true;
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);

      // Try to open the app via the URI scheme
      window.location.href = deepLinkUri;

      // Set fallback timer
      const fallbackTimer = setTimeout(() => {
        document.removeEventListener("visibilitychange", handleVisibility);

        // If the page is still visible, the app didn't open → fallback
        if (!appOpened && !document.hidden) {
          window.location.href = originalUrl;
        }
      }, FALLBACK_TIMEOUT);

      // Clean up if the app does open
      return () => {
        clearTimeout(fallbackTimer);
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    } else {
      // ── 4. Desktop or unsupported platform → direct redirect ──
      window.location.href = originalUrl;
    }
  }, [shortCode, originalUrl, targetApp, iosDeepLink, androidDeepLink]);

  // This component renders nothing visible — its logic is pure side-effect
  return null;
}
