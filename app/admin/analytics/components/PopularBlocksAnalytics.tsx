"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

export type TimeFrame = "daily" | "weekly" | "monthly" | "total";

interface PopularBlocksAnalyticsProps {
  timeframe: TimeFrame;
}

export function PopularBlocksAnalytics({ timeframe }: PopularBlocksAnalyticsProps) {
  const popularBlocks = useQuery(api.blocks.getPopularBlocks, {
    limit: 10,
    timeframe,
  });

  const formatDownloads = (downloads: number) => {
    return downloads.toLocaleString();
  };

  const getTrendBadge = (trend: string) => {
    const variant = trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary";
    return (
      <Badge variant={variant} className="text-xs">
        {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
        {trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
        {trend === "stable" && <Minus className="h-3 w-3 mr-1" />}
        {trend}
      </Badge>
    );
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "daily":
        return "Daily Downloads";
      case "weekly":
        return "Weekly Downloads";
      case "monthly":
        return "Monthly Downloads";
      default:
        return "Total Downloads";
    }
  };

  if (!popularBlocks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Popular Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span>Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Popular Blocks - {getTimeframeLabel()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Block Name</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularBlocks.map((block, index) => (
                <TableRow key={block.blockName}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{block.blockName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {timeframe === "daily" && formatDownloads(block.dailyDownloads)}
                      {timeframe === "weekly" && formatDownloads(block.weeklyDownloads)}
                      {timeframe === "monthly" && formatDownloads(block.monthlyDownloads)}
                      {timeframe === "total" && formatDownloads(block.totalDownloads)}
                    </div>
                  </TableCell>
                  <TableCell>{getTrendBadge(block.downloadTrend)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(block.lastUpdated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
