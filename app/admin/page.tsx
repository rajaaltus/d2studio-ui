"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DashboardHeader } from "./components/dashboard-header";
import { QuickActions } from "./components/quick-actions";
import { OverviewStats } from "./components/overview-stats";
import { TopBlocksCard } from "./components/top-blocks-card";
import { TopCategoriesCard } from "./components/top-categories-card";

export const dynamic = "force-dynamic";

const AdminDashboard = () => {
  const dashboardStats = useQuery(api.blocks.getDashboardStats, {});

  const handleSeedData = () => {
    try {
      // TODO: Implement seed data functionality
      console.log("Seed data functionality to be implemented");
    } catch (error) {
      console.error("Failed to seed data:", error);
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
      <DashboardHeader onSeedData={handleSeedData} />
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
