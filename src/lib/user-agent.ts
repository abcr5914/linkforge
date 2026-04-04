/**
 * User-Agent Parsing Utility
 *
 * Determines the visitor's OS type from a User-Agent string.
 * Used both server-side (for analytics) and client-side (for
 * deep link scheme selection).
 */

import { UAParser } from 'ua-parser-js';;

export type OSType = "iOS" | "Android" | "Desktop";

/**
 * Parses a User-Agent string and returns the detected OS type.
 * Falls back to "Desktop" for any unrecognized or missing UA.
 */
export function parseOSType(userAgent: string | null | undefined): OSType {
  if (!userAgent) return "Desktop";

  const parser = new UAParser(userAgent);
  const osName = parser.getOS().name?.toLowerCase() ?? "";

  if (osName.includes("ios") || osName.includes("mac os")) {
    // Check if it's actually a mobile device (iPhone/iPad)
    const device = parser.getDevice().type;
    if (device === "mobile" || device === "tablet") {
      return "iOS";
    }
    // macOS desktop
    return "Desktop";
  }

  if (osName.includes("android")) {
    return "Android";
  }

  return "Desktop";
}

/**
 * Client-side OS detection using navigator.userAgent.
 * Simpler heuristic for quick client-side checks.
 */
export function detectClientOS(): OSType {
  if (typeof navigator === "undefined") return "Desktop";

  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";

  return "Desktop";
}
