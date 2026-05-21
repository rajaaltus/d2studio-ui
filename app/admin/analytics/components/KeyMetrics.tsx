"use client";

import { Download, Target, Activity, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface DashboardStats {
  totalBlocks: number;
  totalDownloads: number;
  downloadsToday: number;
  downloadsThisWeek: number;
  downloadsTodayChangePct: number;
  downloadsThisWeekChangePct: number;
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

function pctTrend(pct: number): "up" | "down" | "stable" {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "stable";
}

function describePct(pct: number, period: string): string {
  if (pct === 0) return `Unchanged ${period}`;
  const rounded = Math.round(pct * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}% ${period}`;
}

export function KeyMetrics({ dashboardStats }: KeyMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Downloads"
        value={dashboardStats.totalDownloads.toLocaleString()}
        icon={Download}
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
        trend={pctTrend(dashboardStats.downloadsTodayChangePct)}
        description={describePct(
          dashboardStats.downloadsTodayChangePct,
          "vs yesterday",
        )}
      />
      <MetricCard
        title="Weekly Downloads"
        value={dashboardStats.downloadsThisWeek}
        icon={BarChart3}
        trend={pctTrend(dashboardStats.downloadsThisWeekChangePct)}
        description={describePct(
          dashboardStats.downloadsThisWeekChangePct,
          "vs last week",
        )}
      />
    </div>
  );
}
