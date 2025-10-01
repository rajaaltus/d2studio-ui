"use client";

import { Download, Target, Activity, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface DashboardStats {
  totalBlocks: number;
  totalDownloads: number;
  downloadsToday: number;
  downloadsThisWeek: number;
  topBlocks: Array<{
    name: string;
    downloads: number;
    trend: string;
  }>;
  topCategories: Array<{
    category: string;
    downloads: number;
  }>;
}

interface KeyMetricsProps {
  dashboardStats: DashboardStats;
}

export function KeyMetrics({ dashboardStats }: KeyMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Downloads"
        value={dashboardStats.totalDownloads.toLocaleString()}
        icon={Download}
        trend="up"
        description="All-time downloads across all blocks"
      />
      <MetricCard
        title="Active Blocks"
        value={dashboardStats.totalBlocks}
        icon={Target}
        trend="stable"
        description="Currently published blocks"
      />
      <MetricCard
        title="Downloads Today"
        value={dashboardStats.downloadsToday}
        icon={Activity}
        trend="up"
        description="Downloads in the last 24 hours"
      />
      <MetricCard
        title="Weekly Downloads"
        value={dashboardStats.downloadsThisWeek}
        icon={BarChart3}
        trend="up"
        description="Downloads in the last 7 days"
      />
    </div>
  );
}
