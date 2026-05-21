import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PageHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function PageHeader({ onRefresh, isRefreshing = false }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Downloads Tracking</h1>
        <p className="text-muted-foreground">
          Monitor download activity and track usage patterns across all blocks
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
