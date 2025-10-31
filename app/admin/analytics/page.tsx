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

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<TimeFrame>("total");

  const dashboardStats = useQuery(api.blocks.getDashboardStats, {});

  if (!dashboardStats) {
    return <LoadingState />;
  }

  const handleRefresh = () => {
    // TODO
  };

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
