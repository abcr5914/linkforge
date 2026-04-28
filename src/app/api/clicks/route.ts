/**
 * API Route: /api/clicks
 *
 * POST - Records a click event for analytics.
 *        Called via navigator.sendBeacon() from the client-side redirect
 *        handler to avoid blocking the user's redirect experience.
 *
 * Guardrails:
 * - Bot requests are rejected immediately (no DB write)
 * - All DB operations are wrapped in a 2-second timeout
 * - Function hard-capped at 5 seconds via maxDuration
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBot } from "@/lib/bot-detect";

/** Hard limit: kill this function after 5 seconds no matter what */
export const maxDuration = 5;

/**
 * Wraps a promise with a strict timeout.
 * If the promise doesn't resolve within `ms`, it rejects with a timeout error.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`DB timeout after ${ms}ms`)), ms)
    ),
  ]);
}

/** Strict timeout for all DB operations in this route (ms) */
const DB_TIMEOUT_MS = 2000;

export async function POST(request: NextRequest) {
  try {
    // ── Bot filter: skip analytics for crawlers/preview bots ──────
    const userAgent = request.headers.get("user-agent");
    if (isBot(userAgent)) {
      console.log("[POST /api/clicks] Bot detected, skipping analytics:", userAgent?.slice(0, 80));
      return NextResponse.json({ skipped: true }, { status: 204 });
    }

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

    // ── DB operations wrapped in a strict 2s timeout ─────────────
    await withTimeout(
      (async () => {
        // Find the link by short code
        const link = await prisma.link.findUnique({
          where: { shortCode },
          select: { id: true },
        });

        if (!link) {
          // Not a real link — no point recording anything
          return;
        }

        // Record the click
        await prisma.click.create({
          data: {
            linkId: link.id,
            osType,
          },
        });
      })(),
      DB_TIMEOUT_MS
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    // Log the error but always return a response — never hang
    const message = error instanceof Error ? error.message : String(error);
    console.error("[POST /api/clicks] Error (non-fatal):", message);

    // Return 202 Accepted — analytics failures are non-critical
    // The client (sendBeacon) doesn't care about the response anyway
    return NextResponse.json({ error: "Analytics write failed." }, { status: 202 });
  }
}
