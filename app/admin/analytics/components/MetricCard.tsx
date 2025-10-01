import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

export type TrendType = "up" | "down" | "stable";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: TrendType;
  description?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
            {getTrendIcon()}
            <span>{trend} trend</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
