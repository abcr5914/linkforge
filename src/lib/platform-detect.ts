/**
 * Platform Detection Utility
 *
 * Detects the target platform (e.g., YouTube, Spotify) from a URL
 * by matching against known hostnames.
 */

/** Map of hostname patterns to platform identifiers */
const PLATFORM_PATTERNS: Record<string, string[]> = {
  youtube: [
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "music.youtube.com",
  ],
  spotify: [
    "open.spotify.com",
    "spotify.com",
    "play.spotify.com",
  ],
  instagram: [
    "instagram.com",
    "www.instagram.com",
  ],
  twitter: [
    "twitter.com",
    "www.twitter.com",
    "x.com",
    "www.x.com",
    "mobile.twitter.com",
  ],
  reddit: [
    "reddit.com",
    "www.reddit.com",
    "old.reddit.com",
    "new.reddit.com",
  ],
  linkedin: [
    "linkedin.com",
    "www.linkedin.com",
  ],
  facebook: [
    "facebook.com",
    "www.facebook.com",
    "m.facebook.com",
    "fb.com",
  ],
  tiktok: [
    "tiktok.com",
    "www.tiktok.com",
    "vm.tiktok.com",
  ],
  pinterest: [
    "pinterest.com",
    "www.pinterest.com",
    "pin.it",
  ],
};

/**
 * Detects the platform from a given URL.
 * @returns The platform identifier (e.g. "youtube") or null if unrecognized.
 */
export function detectPlatform(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    for (const [platform, hostnames] of Object.entries(PLATFORM_PATTERNS)) {
      if (hostnames.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
        return platform;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/** Returns a user-friendly display name for a platform identifier */
export function getPlatformDisplayName(platform: string | null): string {
  const names: Record<string, string> = {
    youtube: "YouTube",
    spotify: "Spotify",
    instagram: "Instagram",
    twitter: "Twitter / X",
    reddit: "Reddit",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    tiktok: "TikTok",
    pinterest: "Pinterest",
  };
  return platform ? names[platform] ?? "Unknown" : "Other";
}
