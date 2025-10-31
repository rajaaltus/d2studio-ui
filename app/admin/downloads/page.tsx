"use client";

import { useState } from "react";
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

  const handleRefresh = () => {
    // Refresh handled by Convex reactivity
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
