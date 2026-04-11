/**
 * API Route: /api/links
 *
 * POST - Creates a new short link from a given URL.
 * Validates the URL, detects the platform, scrapes OG tags,
 * generates a unique short code, and saves everything to the DB.
 *
 * GET  - Returns all links with their click counts for the dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { validateUrl } from "@/lib/url-validation";
import { detectPlatform } from "@/lib/platform-detect";
import { scrapeOgTags } from "@/lib/og-scraper";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// POST /api/links — Create a new short link
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url?: string };

    // 1. Validate the URL
    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' in request body." },
        { status: 400 }
      );
    }

    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    // 2. Detect the target platform
    const targetApp = detectPlatform(trimmedUrl);

    // 3. Scrape OG tags (with a strict 3-second timeout to bypass Node DNS hangs)
    let ogData = { ogTitle: null, ogDescription: null, ogImage: null };
    try {
      ogData = await Promise.race([
        scrapeOgTags(trimmedUrl),
        new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error("Scraper timeout")), 3000)
        )
      ]);
    } catch (scraperError) {
      console.warn("[POST /api/links] Scraper timed out or failed, proceeding without OG tags.");
      // We catch the error but do NOT stop the function. The link will still generate.
    }

    // 4. Generate a unique short code (8 chars for a good balance)
    const shortCode = nanoid(8);

    // 5. Persist to the database
    const link = await prisma.link.create({
      data: {
        originalUrl: trimmedUrl,
        shortCode,
        targetApp,
        ogTitle: ogData.ogTitle,
        ogDescription: ogData.ogDescription,
        ogImage: ogData.ogImage,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("[POST /api/links] Error:", error);
    return NextResponse.json(
      { error: "Failed to create short link." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/links — List all links with click counts
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("[GET /api/links] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch links." },
      { status: 500 }
    );
  }
}