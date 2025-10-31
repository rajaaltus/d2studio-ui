"use client";
import { StatCard } from "./stat-card";
import { BarChart3, Blocks, Download, Eye } from "lucide-react";

interface OverviewStatsProps {
  dashboardStats: {
    totalBlocks: number;
    totalDownloads: number;
    downloadsToday: number;
    downloadsThisWeek: number;
    topBlocks: Array<{ name: string; downloads: number; trend: string }>;
    topCategories: Array<{ category: string; downloads: number }>;
  };
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
        trend="up"
        trendValue="+12.5%"
        href="/admin/downloads"
      />
      <StatCard
        title="Downloads Today"
        value={statsData.downloadsToday}
        icon={BarChart3}
        trend="up"
        trendValue="+2.1%"
      />
      <StatCard
        title="Downloads This Week"
        value={statsData.downloadsThisWeek}
        icon={Eye}
        trend="stable"
        trendValue="0%"
      />
    </div>
  );
}
