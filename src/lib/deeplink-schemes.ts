/**
 * Deep Link URI Scheme Mappings
 *
 * Maps platform names to their native app URI schemes and provides
 * functions to convert standard web URLs into deep link URIs that
 * trigger native app opens on mobile devices.
 */

import type { OSType } from "./user-agent";

interface PlatformScheme {
  /** Custom URI scheme for iOS / Android (e.g., "vnd.youtube://") */
  uriScheme: string;
  /** Android intent URL format (fallback for newer Android versions) */
  androidIntent?: string;
  /** iOS universal link host (some apps use these instead of custom schemes) */
  iosUniversalLink?: string;
}

/**
 * URI scheme mappings for supported platforms.
 *
 * These schemes trigger a native app open if the app is installed.
 * If the app isn't installed, the OS will show an error or do nothing,
 * and our timer-based fallback redirects to the web URL instead.
 */
const SCHEME_MAP: Record<string, PlatformScheme> = {
  youtube: {
    uriScheme: "vnd.youtube://",
    androidIntent:
      "intent://www.youtube.com/#Intent;package=com.google.android.youtube;scheme=https;end",
  },
  spotify: {
    uriScheme: "spotify://",
    androidIntent:
      "intent://open.spotify.com/#Intent;package=com.spotify.music;scheme=https;end",
  },
  instagram: {
    uriScheme: "instagram://",
    androidIntent:
      "intent://www.instagram.com/#Intent;package=com.instagram.android;scheme=https;end",
  },
  twitter: {
    uriScheme: "twitter://",
    androidIntent:
      "intent://twitter.com/#Intent;package=com.twitter.android;scheme=https;end",
  },
  reddit: {
    uriScheme: "reddit://",
    androidIntent:
      "intent://www.reddit.com/#Intent;package=com.reddit.frontpage;scheme=https;end",
  },
  linkedin: {
    uriScheme: "linkedin://",
    androidIntent:
      "intent://www.linkedin.com/#Intent;package=com.linkedin.android;scheme=https;end",
  },
  facebook: {
    uriScheme: "fb://",
    androidIntent:
      "intent://www.facebook.com/#Intent;package=com.facebook.katana;scheme=https;end",
  },
  tiktok: {
    uriScheme: "snssdk1233://",
    androidIntent:
      "intent://www.tiktok.com/#Intent;package=com.zhiliaoapp.musically;scheme=https;end",
  },
  pinterest: {
    uriScheme: "pinterest://",
    androidIntent:
      "intent://www.pinterest.com/#Intent;package=com.pinterest;scheme=https;end",
  },
};

/**
 * Converts a standard web URL to a deep link URI for the given platform and OS.
 *
 * @param originalUrl - The original web URL (e.g., "https://www.youtube.com/watch?v=abc")
 * @param platform   - The detected platform identifier (e.g., "youtube")
 * @param os         - The target OS ("iOS", "Android", or "Desktop")
 * @returns The deep link URI, or null if no scheme is available
 */
export function getDeepLinkUri(
  originalUrl: string,
  platform: string | null,
  os: OSType
): string | null {
  if (!platform || os === "Desktop") return null;

  const scheme = SCHEME_MAP[platform];
  if (!scheme) return null;

  try {
    const parsed = new URL(originalUrl);

    // For Android, prefer intent URLs for more reliable behavior
    if (os === "Android" && scheme.androidIntent) {
      // Replace the generic host in the intent with the actual URL path
      return scheme.androidIntent.replace(
        /intent:\/\/[^/]+\//,
        `intent://${parsed.host}${parsed.pathname}${parsed.search}/`
      );
    }

    // For iOS, construct a URI scheme URL preserving the path
    return `${scheme.uriScheme}${parsed.host}${parsed.pathname}${parsed.search}`;
  } catch {
    // If URL parsing fails, return the basic scheme
    return scheme.uriScheme;
  }
}

/**
 * Returns the list of supported platform identifiers.
 */
export function getSupportedPlatforms(): string[] {
  return Object.keys(SCHEME_MAP);
}
