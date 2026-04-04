/**
 * Open Graph Tag Scraper
 *
 * Fetches and extracts OG meta tags (title, description, image)
 * from a given URL. This runs at link-creation time so the
 * redirect page doesn't incur scraping latency.
 */

import ogs from "open-graph-scraper";

export interface OgData {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

/**
 * Scrapes Open Graph tags from the provided URL.
 * Returns null values on failure—link creation should still succeed.
 */
export async function scrapeOgTags(url: string): Promise<OgData> {
  try {
    const { result } = await ogs({
      url,
      timeout: 8000, // 8-second timeout to avoid blocking too long
      fetchOptions: {
        headers: {
          // Some sites block requests without a browser-like User-Agent
          "User-Agent":
            "Mozilla/5.0 (compatible; DeepLinkBot/1.0; +https://deeplink.app)",
        },
      },
    });

    // open-graph-scraper returns ogImage as an array of objects
    const imageUrl =
      result.ogImage && result.ogImage.length > 0
        ? result.ogImage[0].url
        : null;

    return {
      ogTitle: result.ogTitle ?? null,
      ogDescription: result.ogDescription ?? null,
      ogImage: imageUrl ?? null,
    };
  } catch (error) {
    console.warn(`[og-scraper] Failed to scrape OG tags for ${url}:`, error);
    return {
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
    };
  }
}
