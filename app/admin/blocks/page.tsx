"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PageHeader } from "./components/PageHeader";
import { StatsCards } from "./components/StatsCards";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export const dynamic = "force-dynamic";

export default function BlocksPage() {
  const blocks = useQuery(api.blocks.listBlocks, {
    limit: 100,
  });

  const handleRefresh = () => {
    // Convex handles reactivity automatically
    // Force refetch if needed by toggling a state
  };

  if (!blocks) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const stats = {
    total: blocks.length,
    ui: blocks.filter((b) => b.type === "ui").length,
    component: blocks.filter((b) => b.type === "component").length,
    active: blocks.filter((b) => b.isActive).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader onRefresh={handleRefresh} />

      <StatsCards stats={stats} />

      <DataTable columns={columns} data={blocks} />
    </div>
  );
}
