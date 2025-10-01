"use client";

import { useState } from "react";
import {
  PageHeader,
  InteractionStatsCards,
  QuickActions,
  InteractionsFilters,
  BlockInteractionsTable,
  EngagementInsights,
} from "./components";

export default function InteractionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <PageHeader onRefresh={handleRefresh} />

      <InteractionStatsCards />

      <QuickActions />

      <InteractionsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <BlockInteractionsTable />

      <EngagementInsights />
    </div>
  );
}
