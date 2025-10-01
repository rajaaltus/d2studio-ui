import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader({ onRefresh }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Interactions</h1>
        <p className="text-muted-foreground">
          Track how users interact with your blocks - views, copies, installs, and previews
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
