/**
 * API Route: /api/links/[shortCode]/analytics
 *
 * GET - Returns analytics data for a specific short link:
 *       total click count, OS breakdown, and recent clicks.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Find the link by short code
    const link = await prisma.link.findUnique({
      where: { shortCode },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found." },
        { status: 404 }
      );
    }

    // Get OS breakdown (group clicks by osType)
    const osBreakdown = await prisma.click.groupBy({
      by: ["osType"],
      where: { linkId: link.id },
      _count: {
        osType: true,
      },
    });

    // Format the OS breakdown into a cleaner structure
    const osCounts = osBreakdown.reduce(
      (acc, item) => {
        acc[item.osType] = item._count.osType;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      targetApp: link.targetApp,
      totalClicks: link._count.clicks,
      osCounts,
      createdAt: link.createdAt,
    });
  } catch (error) {
    console.error("[GET /api/links/[shortCode]/analytics] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}
