/**
 * API Route: /api/links/[id]/analytics
 *
 * GET - Returns analytics data for a specific short link:
 *       total click count, OS breakdown, and recent clicks.
 *
 * Note: This route uses [id] (the database ID) as the param to avoid
 * conflicting with the sibling [id] DELETE route. The shortCode is
 * also accepted as a fallback for backwards compatibility.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by database ID first, then fall back to shortCode
    // This supports both `/api/links/{cuid}/analytics` and
    // `/api/links/{shortCode}/analytics` patterns
    let link = await prisma.link.findUnique({
      where: { id },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    });

    // Fallback: try as shortCode (for backwards compatibility)
    if (!link) {
      link = await prisma.link.findUnique({
        where: { shortCode: id },
        include: {
          _count: {
            select: { clicks: true },
          },
        },
      });
    }

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
    console.error("[GET /api/links/[id]/analytics] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}
