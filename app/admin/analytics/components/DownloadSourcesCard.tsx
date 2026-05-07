"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

const SOURCE_LABELS: Record<string, string> = {
  cli: "CLI",
  website: "Website",
  api: "API",
  direct: "Direct",
};

export function DownloadSourcesCard() {
  const sources = useQuery(api.blocks.getDownloadSourceBreakdown, {});

  if (!sources) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Download Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalDownloads = sources.reduce((sum, s) => sum + s.downloads, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Download Sources</CardTitle>
      </CardHeader>
      <CardContent>
        {totalDownloads === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No downloads tracked yet.
          </p>
        ) : (
          <div className="space-y-4">
            {sources.map((item) => {
              const label = SOURCE_LABELS[item.source] ?? item.source;
              return (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {label.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.downloads.toLocaleString()} downloads
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{Math.round(item.percentage)}%</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
