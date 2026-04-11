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
    // Implement an aggressive hard timeout to prevent serverless hanging
    const timeoutPromise = new Promise<{ result: any }>((_, reject) =>
      setTimeout(() => reject(new Error("OG Scrape Timeout")), 3000)
    );

    const ogsPromise = ogs({
      url,
      timeout: 3000,
      fetchOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; DeepLinkBot/1.0; +https://deeplink.app)",
        },
      },
    });

    const { result } = await Promise.race([ogsPromise, timeoutPromise]);

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
