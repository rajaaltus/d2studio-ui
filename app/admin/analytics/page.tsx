"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PageHeader,
  LoadingState,
  KeyMetrics,
  PopularBlocksAnalytics,
  DownloadSourcesCard,
  PerformanceSummary,
  type TimeFrame,
} from "./components";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<TimeFrame>("total");
  const [refreshKey, setRefreshKey] = useState(0);

  const dashboardStats = useQuery(api.blocks.getDashboardStats, {});

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!dashboardStats) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onRefresh={handleRefresh}
      />

      <KeyMetrics dashboardStats={dashboardStats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PopularBlocksAnalytics timeframe={timeframe} />
        </div>
        <div>
          <DownloadSourcesCard />
        </div>
      </div>

      <PerformanceSummary dashboardStats={dashboardStats} />
    </div>
  );
}