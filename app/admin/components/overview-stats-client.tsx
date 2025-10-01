"use client";
import { StatCard } from "./stat-card";
import { BarChart3, Blocks, Download, Eye } from "lucide-react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface OverviewStatsClientProps {
  dashboardStats: Preloaded<typeof api.blocks.getDashboardStats>;
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
        trend="up"
        trendValue="+12.5%"
        href="/admin/downloads"
      />
      <StatCard
        title="Downloads Today"
        value={stats.downloadsToday}
        icon={BarChart3}
        trend="up"
        trendValue="+2.1%"
      />
      <StatCard
        title="Downloads This Week"
        value={stats.downloadsThisWeek}
        icon={Eye}
        trend="stable"
        trendValue="0%"
      />
    </div>
  );
}
