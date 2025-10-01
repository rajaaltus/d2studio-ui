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

  const handleRefresh = () => {
    // Refresh handled by Convex reactivity
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
