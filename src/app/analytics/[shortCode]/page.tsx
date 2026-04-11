import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Link from "next/link";
import { CopyButtonProps } from "@/components/CopyButton";

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
    <main className="min-h-screen bg-[#f4f4f0] p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-10 right-10 shape-circle animate-pop-in pointer-events-none" />
      <div className="absolute bottom-10 left-10 shape-triangle animate-pop-in pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_#000] transform -rotate-1 animate-pop-in">
            <h1 className="text-4xl font-black uppercase text-[#FF007F] drop-shadow-[2px_2px_0_#000]">
              Supercharged Analytics
            </h1>
            <p className="font-bold text-lg text-black mt-1">
              Link: <span className="bg-[#FFD500] px-1 border-2 border-black">/{link.shortCode}</span>
            </p>
          </div>

          <Link href="/" className="memphis-button px-6 py-3 text-lg shrink-0">
            ← BACK TO DASHBOARD
          </Link>
        </div>

        {/* Top summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <div className="memphis-card p-6 flex flex-col items-center justify-center bg-[#FFD500]">
            <span className="text-sm font-black uppercase border-2 border-black bg-white px-2 py-1 transform -rotate-2">Total Clicks</span>
            <span className="text-6xl font-black mt-2 drop-shadow-[2px_2px_0_#000] text-black">{clicks.length}</span>
          </div>

          <div className="memphis-card p-6 flex flex-col items-center justify-center bg-[#00E5FF]">
            <span className="text-sm font-black uppercase border-2 border-black bg-white px-2 py-1 transform rotate-2">Platform Target</span>
            <span className="text-3xl font-black mt-2 drop-shadow-[2px_2px_0_#000] text-black uppercase">
              {link.targetApp || "Web Link"}
            </span>
          </div>

          <div className="memphis-card p-6 flex flex-col items-center justify-center bg-[#39FF14]">
            <span className="text-sm font-black uppercase border-2 border-black bg-white px-2 py-1 transform -rotate-2">Created</span>
            <span className="text-2xl font-black mt-2 drop-shadow-[2px_2px_0_#000] text-black uppercase">
              {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="animate-pop-in" style={{ animationDelay: '0.2s' }}>
          <AnalyticsDashboard timeData={timeData} osData={osData} />
        </div>

      </div>
    </main>
  );
}
