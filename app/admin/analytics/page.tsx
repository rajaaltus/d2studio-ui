"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dashboardStats = useQuery(api.blocks.getDashboardStats, {});
  const updatePopularityRanks = useAction(
    api.initializeBlocks.updatePopularityRanks,
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await updatePopularityRanks({});
      toast.success(result.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Refresh failed: ${message}`);
    } finally {
      setIsRefreshing(false);
    }
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
        isRefreshing={isRefreshing}
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
