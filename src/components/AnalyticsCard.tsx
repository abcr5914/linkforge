/**
 * AnalyticsCard Component
 *
 * Displays click analytics for a specific short link:
 * - Total click count
 * - OS breakdown (iOS / Android / Desktop)
 */

"use client";

import { useEffect, useState, useCallback } from "react";

interface AnalyticsData {
  totalClicks: number;
  osCounts: Record<string, number>;
}

interface AnalyticsCardProps {
  shortCode: string;
}

export default function AnalyticsCard({ shortCode }: AnalyticsCardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`/api/links/${shortCode}/analytics`);
      if (res.ok) {
        const json = await res.json();
        setData({
          totalClicks: json.totalClicks,
          osCounts: json.osCounts,
        });
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [shortCode]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="glass-card-sm p-4 rounded-xl animate-pulse">
        <div className="h-4 bg-white/10 rounded w-20 mb-3"></div>
        <div className="h-8 bg-white/10 rounded w-12"></div>
      </div>
    );
  }

  if (!data) return null;

  /** Colors for each OS type */
  const osConfig: Record<string, { color: string; icon: string }> = {
    iOS: { color: "text-blue-400", icon: "📱" },
    Android: { color: "text-green-400", icon: "🤖" },
    Desktop: { color: "text-purple-400", icon: "🖥️" },
  };

  return (
    <div className="glass-card-sm p-4 rounded-xl">
      {/* Total clicks */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Clicks
        </span>
        <button
          onClick={fetchAnalytics}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          title="Refresh"
        >
          ↻
        </button>
      </div>
      <div className="text-2xl font-bold text-white mb-3">
        {data.totalClicks.toLocaleString()}
      </div>

      {/* OS breakdown */}
      {data.totalClicks > 0 && (
        <div className="flex gap-3 flex-wrap">
          {Object.entries(data.osCounts).map(([os, count]) => {
            const config = osConfig[os] ?? { color: "text-gray-400", icon: "❓" };
            return (
              <div
                key={os}
                className="flex items-center gap-1.5 text-xs"
              >
                <span>{config.icon}</span>
                <span className={`font-medium ${config.color}`}>
                  {os}
                </span>
                <span className="text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
