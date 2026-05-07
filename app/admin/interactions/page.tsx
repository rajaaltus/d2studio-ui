"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
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

      <InteractionStatsCards />

      <QuickActions />

      <InteractionsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <BlockInteractionsTable
        searchTerm={searchTerm}
        typeFilter={typeFilter}
      />

      <EngagementInsights />
    </div>
  );
}
