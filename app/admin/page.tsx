import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { DashboardHeader } from "./components/dashboard-header";
import { QuickActions } from "./components/quick-actions";
import { OverviewStatsClient } from "./components/overview-stats-client";
import { TopBlocksCardClient } from "./components/top-blocks-card-client";
import { TopCategoriesCardClient } from "./components/top-categories-card-client";

const AdminDashboard = async () => {
  const dashboardStats = await preloadQuery(api.blocks.getDashboardStats, {});

  const handleSeedData = async () => {
    "use server";
    try {
      // TODO: Implement seed data functionality
      console.log("Seed data functionality to be implemented");
    } catch (error) {
      console.error("Failed to seed data:", error);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader onSeedData={handleSeedData} />
      <OverviewStatsClient dashboardStats={dashboardStats} />

      <div className="grid gap-6 md:grid-cols-2">
        <TopBlocksCardClient dashboardStats={dashboardStats} />
        <TopCategoriesCardClient dashboardStats={dashboardStats} />
      </div>

      <QuickActions />
    </div>
  );
};

export default AdminDashboard;
