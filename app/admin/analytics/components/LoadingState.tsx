import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center space-x-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>Loading analytics...</span>
      </div>
    </div>
  );
}
