import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DownloadSource {
  source: string;
  downloads: number;
  percentage: number;
}

export function DownloadSourcesCard() {
  // This would ideally come from a query that aggregates downloads by source
  const downloadSources: DownloadSource[] = [
    { source: "CLI", downloads: 1250, percentage: 45 },
    { source: "Website", downloads: 890, percentage: 32 },
    { source: "API", downloads: 540, percentage: 19 },
    { source: "Direct", downloads: 110, percentage: 4 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Download Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {downloadSources.map((item) => (
            <div key={item.source} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {item.source.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.source}</p>
                  <p className="text-xs text-muted-foreground">{item.downloads} downloads</p>
                </div>
              </div>
              <Badge variant="outline">{item.percentage}%</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
