import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "./components/PageHeader";
import { StatsCards } from "./components/StatsCards";
import { LoadingState } from "./components/LoadingState";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";

export default async function BlocksPage() {
  const data = await preloadQuery(api.blocks.listBlocks, {
    limit: 100,
  });

  const blocks = preloadedQueryResult(data);

  const handleRefresh = async () => {
    "use server";
    // Trigger a re-render by toggling a boolean state if needed
    // Currently, Convex handles reactivity automatically
  };

  const stats = {
    total: blocks?.length || 0,
    ui: blocks?.filter((b) => b.type === "ui").length || 0,
    component: blocks?.filter((b) => b.type === "component").length || 0,
    active: blocks?.filter((b) => b.isActive).length || 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader onRefresh={handleRefresh} />

      <StatsCards stats={stats} />

      <DataTable columns={columns} data={blocks} />
    </div>
  );
}
