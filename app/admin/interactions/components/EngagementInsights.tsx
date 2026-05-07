"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

function formatPct(value: number) {
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
}

export function EngagementInsights() {
  const stats = useQuery(api.blocks.getInteractionStats, {});

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span>Loading insights...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = stats.totalViews > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {hasData ? formatPct(stats.avgEngagementRate) : "—"}
            </div>
            <p className="text-sm text-muted-foreground">Average Engagement Rate</p>
            <p className="text-xs text-muted-foreground">
              Across all blocks
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {hasData ? formatPct(stats.copyToViewRatio) : "—"}
            </div>
            <p className="text-sm text-muted-foreground">Copy-to-View Ratio</p>
            <p className="text-xs text-muted-foreground">
              Users copying code after viewing
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {hasData ? formatPct(stats.installToViewRatio) : "—"}
            </div>
            <p className="text-sm text-muted-foreground">Install-to-View Ratio</p>
            <p className="text-xs text-muted-foreground">
              Users installing after viewing
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
