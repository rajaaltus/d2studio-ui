"use client";
import { StatCard } from "./stat-card";
import { BarChart3, Blocks, Download, Eye } from "lucide-react";

interface OverviewStatsProps {
  dashboardStats: {
    totalBlocks: number;
    totalDownloads: number;
    downloadsToday: number;
    downloadsThisWeek: number;
    downloadsTodayChangePct: number;
    downloadsThisWeekChangePct: number;
    topBlocks: Array<{ name: string; downloads: number; trend: string }>;
    topCategories: Array<{ category: string; downloads: number }>;
  };
}

function formatPct(pct: number): string {
  const rounded = Math.round(pct * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

function pctTrend(pct: number): "up" | "down" | "stable" {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "stable";
}

export function OverviewStats({ dashboardStats }: OverviewStatsProps) {
  const statsData = dashboardStats;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Blocks"
        value={statsData.totalBlocks}
        icon={Blocks}
        href="/admin/blocks"
      />
      <StatCard
        title="Total Downloads"
        value={statsData.totalDownloads.toLocaleString()}
        icon={Download}
        href="/admin/downloads"
      />
      <StatCard
        title="Downloads Today"
        value={statsData.downloadsToday}
        icon={BarChart3}
        trend={pctTrend(statsData.downloadsTodayChangePct)}
        trendValue={formatPct(statsData.downloadsTodayChangePct)}
        trendLabel="from yesterday"
      />
      <StatCard
        title="Downloads This Week"
        value={statsData.downloadsThisWeek}
        icon={Eye}
        trend={pctTrend(statsData.downloadsThisWeekChangePct)}
        trendValue={formatPct(statsData.downloadsThisWeekChangePct)}
      />
    </div>
  );
}
