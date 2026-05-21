"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { DashboardHeader } from "./components/dashboard-header";
import { QuickActions } from "./components/quick-actions";
import { OverviewStats } from "./components/overview-stats";
import { TopBlocksCard } from "./components/top-blocks-card";
import { TopCategoriesCard } from "./components/top-categories-card";

export const dynamic = "force-dynamic";

const AdminDashboard = () => {
  const dashboardStats = useQuery(api.blocks.getDashboardStats, {});
  const seedSampleBlocks = useMutation(api.initializeBlocks.seedSampleBlocks);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await seedSampleBlocks({});
      if (result.created > 0) {
        toast.success(result.message);
      } else {
        toast.info("Sample blocks already seeded.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to seed data: ${message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  if (!dashboardStats) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader onSeedData={handleSeedData} isSeeding={isSeeding} />
      <OverviewStats dashboardStats={dashboardStats} />

      <div className="grid gap-6 md:grid-cols-2">
        <TopBlocksCard dashboardStats={dashboardStats} />
        <TopCategoriesCard dashboardStats={dashboardStats} />
      </div>

      <QuickActions />
    </div>
  );
};

export default AdminDashboard;
