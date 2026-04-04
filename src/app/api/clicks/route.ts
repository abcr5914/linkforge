/**
 * API Route: /api/clicks
 *
 * POST - Records a click event for analytics.
 *        Called via navigator.sendBeacon() from the client-side redirect
 *        handler to avoid blocking the user's redirect experience.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shortCode, osType } = body as {
      shortCode?: string;
      osType?: string;
    };

    if (!shortCode || !osType) {
      return NextResponse.json(
        { error: "Missing shortCode or osType." },
        { status: 400 }
      );
    }

    // Find the link by short code
    const link = await prisma.link.findUnique({
      where: { shortCode },
      select: { id: true },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found." },
        { status: 404 }
      );
    }

    // Record the click
    await prisma.click.create({
      data: {
        linkId: link.id,
        osType,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/clicks] Error:", error);
    return NextResponse.json(
      { error: "Failed to record click." },
      { status: 500 }
    );
  }
}
