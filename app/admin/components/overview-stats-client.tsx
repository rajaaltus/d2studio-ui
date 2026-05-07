"use client";
import { StatCard } from "./stat-card";
import { BarChart3, Blocks, Download, Eye } from "lucide-react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface OverviewStatsClientProps {
  dashboardStats: Preloaded<typeof api.blocks.getDashboardStats>;
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

export function OverviewStatsClient({
  dashboardStats,
}: OverviewStatsClientProps) {
  const stats = usePreloadedQuery(dashboardStats);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Blocks"
        value={stats.totalBlocks}
        icon={Blocks}
        href="/admin/blocks"
      />
      <StatCard
        title="Total Downloads"
        value={stats.totalDownloads.toLocaleString()}
        icon={Download}
        href="/admin/downloads"
      />
      <StatCard
        title="Downloads Today"
        value={stats.downloadsToday}
        icon={BarChart3}
        trend={pctTrend(stats.downloadsTodayChangePct)}
        trendValue={formatPct(stats.downloadsTodayChangePct)}
        trendLabel="from yesterday"
      />
      <StatCard
        title="Downloads This Week"
        value={stats.downloadsThisWeek}
        icon={Eye}
        trend={pctTrend(stats.downloadsThisWeekChangePct)}
        trendValue={formatPct(stats.downloadsThisWeekChangePct)}
      />
    </div>
  );
}
