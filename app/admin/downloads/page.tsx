"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  PageHeader,
  DownloadStatsCards,
  QuickActions,
  DownloadsFilters,
  RecentDownloadsTable,
} from "./components";

export const dynamic = "force-dynamic";

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <div className="space-y-6">
      <PageHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <DownloadStatsCards />

      <QuickActions />

      <DownloadsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
      />

      <RecentDownloadsTable
        searchTerm={searchTerm}
        sourceFilter={sourceFilter}
      />
    </div>
  );
}
