"use client";

import { useState } from "react";
import {
  PageHeader,
  DownloadStatsCards,
  QuickActions,
  DownloadsFilters,
  RecentDownloadsTable,
} from "./components";

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <PageHeader onRefresh={handleRefresh} />

      <DownloadStatsCards />

      <QuickActions />

      <DownloadsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
      />

      <RecentDownloadsTable />
    </div>
  );
}
