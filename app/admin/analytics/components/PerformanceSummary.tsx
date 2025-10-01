import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalBlocks: number;
  totalDownloads: number;
  downloadsToday: number;
  downloadsThisWeek: number;
  topBlocks: Array<{
    name: string;
    downloads: number;
    trend: string;
  }>;
  topCategories: Array<{
    category: string;
    downloads: number;
  }>;
}

interface PerformanceSummaryProps {
  dashboardStats: DashboardStats;
}

export function PerformanceSummary({ dashboardStats }: PerformanceSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Performance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.topBlocks[0]?.name || "N/A"}
            </div>
            <p className="text-sm text-muted-foreground">Top Performing Block</p>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.topBlocks[0]?.downloads || 0} downloads
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.topCategories[0]?.category || "N/A"}
            </div>
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.topCategories[0]?.downloads || 0} downloads
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(dashboardStats.totalDownloads / dashboardStats.totalBlocks) || 0}
            </div>
            <p className="text-sm text-muted-foreground">Avg Downloads/Block</p>
            <p className="text-xs text-muted-foreground">
              Across all {dashboardStats.totalBlocks} blocks
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
