import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: { clicks: { orderBy: { clickedAt: "asc" } } }
  });

  if (!link) notFound();

  const clicks = link.clicks;

  const osDataMap: Record<string, number> = {};
  clicks.forEach(c => { osDataMap[c.osType] = (osDataMap[c.osType] || 0) + 1; });
  const osData = Object.entries(osDataMap).map(([name, value]) => ({ name, value }));

  const timeDataMap: Record<string, number> = {};
  clicks.forEach(c => {
    const d = new Date(c.clickedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    timeDataMap[d] = (timeDataMap[d] || 0) + 1;
  });
  const timeData = Object.entries(timeDataMap).map(([date, clicks]) => ({ date, clicks }));
  if (timeData.length === 0) {
    timeData.push({ date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), clicks: 0 });
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-[var(--bg)]">
      <div className="max-w-[1400px] mx-auto fade-up">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
              Analytics
            </h1>
            <p className="text-sm text-[var(--text-2)] flex items-center gap-2">
              <span className="pill pill-accent">/{link.shortCode}</span>
            </p>
          </div>
          <Link href="/" className="btn btn-ghost text-sm">
            ← Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 fade-up d1">
          <div className="card p-5">
            <span className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wider block mb-1">Total Clicks</span>
            <span className="text-3xl font-extrabold text-[var(--accent)]" style={{ fontFamily: "var(--font-heading)" }}>{clicks.length}</span>
          </div>
          <div className="card p-5">
            <span className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wider block mb-1">Platform</span>
            <span className="text-lg font-bold text-[var(--cta)] uppercase" style={{ fontFamily: "var(--font-heading)" }}>{link.targetApp || "Web"}</span>
          </div>
          <div className="card p-5">
            <span className="text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-wider block mb-1">Created</span>
            <span className="text-lg font-bold text-[var(--success)]" style={{ fontFamily: "var(--font-heading)" }}>
              {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="fade-up d2">
          <AnalyticsDashboard timeData={timeData} osData={osData} />
        </div>
      </div>
    </main>
  );
}
