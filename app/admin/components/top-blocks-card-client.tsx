"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TopBlocksCardClientProps {
  dashboardStats: Preloaded<typeof api.blocks.getDashboardStats>;
}

export function TopBlocksCardClient({
  dashboardStats,
}: TopBlocksCardClientProps) {
  const stats = usePreloadedQuery(dashboardStats);
  const blocks = stats.topBlocks;

  const getTrendBadge = (trend: string) => {
    const variant =
      trend === "up"
        ? "default"
        : trend === "down"
          ? "destructive"
          : "secondary";
    return (
      <Badge variant={variant} className="text-xs">
        {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
        {trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
        {trend === "stable" && <Minus className="h-3 w-3 mr-1" />}
        {trend}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Performing Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={block.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{block.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {block.downloads} downloads
                  </p>
                </div>
              </div>
              {getTrendBadge(block.trend)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
