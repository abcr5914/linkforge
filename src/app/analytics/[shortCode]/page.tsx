import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Link from "next/link";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { shortCode } = await params;

  // Fetch the link and all its clicks
  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      clicks: {
        orderBy: { clickedAt: "asc" }
      }
    }
  });

  if (!link) {
    notFound();
  }

  // Pre-process data to pass down to client charts
  const clicks = link.clicks;

  // Aggregate OS data
  const osDataMap: Record<string, number> = {};
  clicks.forEach(c => {
    osDataMap[c.osType] = (osDataMap[c.osType] || 0) + 1;
  });
  const osData = Object.entries(osDataMap).map(([name, value]) => ({ name, value }));

  // Aggregate clicks over time (group by day)
  const timeDataMap: Record<string, number> = {};
  clicks.forEach(c => {
    const dateStr = new Date(c.clickedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
    timeDataMap[dateStr] = (timeDataMap[dateStr] || 0) + 1;
  });

  // Format for Recharts
  const timeData = Object.entries(timeDataMap).map(([date, count]) => ({
    date,
    clicks: count
  }));

  // Ensure we have at least something to show if clicks are 0
  if (timeData.length === 0) {
    timeData.push({
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      clicks: 0
    });
  }

  return (
    <main className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] p-4 sm:p-8 relative overflow-hidden transition-colors duration-300">

      <div className="max-w-[1400px] mx-auto relative z-10 w-full animate-fade-in">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="clay-card-flat p-6 border border-[var(--border-color)]">
            <h1 className="text-3xl font-bold text-[var(--color-pastel-blue)] mb-2" style={{ filter: "brightness(0.8) saturate(1.5)" }}>
              Analytics Overview
            </h1>
            <p className="font-medium text-lg text-[var(--text-muted)] flex items-center gap-2">
              Link: <span className="clay-pill bg-[var(--color-pastel-yellow)] text-yellow-900 border-yellow-200">/{link.shortCode}</span>
            </p>
          </div>

          <Link href="/" className="clay-btn px-6 py-3 text-sm shrink-0 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="clay-card p-6 flex flex-col items-start justify-center bg-[var(--card-bg)]">
            <span className="text-sm font-semibold text-[var(--text-muted)] mb-1">Total Clicks</span>
            <span className="text-5xl font-bold text-[var(--color-pastel-blue)]" style={{ filter: "brightness(0.8) saturate(1.5)" }}>
              {clicks.length}
            </span>
          </div>

          <div className="clay-card p-6 flex flex-col items-start justify-center bg-[var(--card-bg)]">
            <span className="text-sm font-semibold text-[var(--text-muted)] mb-1">Platform Target</span>
            <span className="text-2xl font-bold text-[var(--color-pastel-pink)] uppercase" style={{ filter: "brightness(0.9) saturate(1.5)" }}>
              {link.targetApp || "Web Link"}
            </span>
          </div>

          <div className="clay-card p-6 flex flex-col items-start justify-center bg-[var(--card-bg)] sm:col-span-2 lg:col-span-1">
            <span className="text-sm font-semibold text-[var(--text-muted)] mb-1">Created Date</span>
            <span className="text-2xl font-bold text-[var(--color-pastel-green)]" style={{ filter: "brightness(0.7) saturate(2)" }}>
              {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <AnalyticsDashboard timeData={timeData} osData={osData} />
        </div>

      </div>
    </main>
  );
}
