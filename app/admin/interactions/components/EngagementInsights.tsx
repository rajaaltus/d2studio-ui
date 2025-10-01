import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EngagementInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Engagement Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24.5%</div>
            <p className="text-sm text-muted-foreground">Average Engagement Rate</p>
            <p className="text-xs text-muted-foreground">
              Across all blocks
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">15.2%</div>
            <p className="text-sm text-muted-foreground">Copy-to-View Ratio</p>
            <p className="text-xs text-muted-foreground">
              Users copying code after viewing
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">8.7%</div>
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
