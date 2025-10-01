"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Calendar } from "lucide-react";
import { TimeFrame } from "./PopularBlocksAnalytics";

interface PageHeaderProps {
  timeframe: TimeFrame;
  onTimeframeChange: (value: TimeFrame) => void;
  onRefresh: () => void;
}

export function PageHeader({ timeframe, onTimeframeChange, onRefresh }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track performance and usage metrics for your blocks library
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={timeframe}
          onValueChange={(value) => onTimeframeChange(value as TimeFrame)}
        >
          <SelectTrigger className="w-[140px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="total">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
