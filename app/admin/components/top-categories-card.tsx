"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TopCategoriesCardProps {
  dashboardStats: Preloaded<typeof api.blocks.getDashboardStats>;
}

export function TopCategoriesCard({ dashboardStats }: TopCategoriesCardProps) {
  const statsData = usePreloadedQuery(dashboardStats);
  const categories = statsData.topCategories;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div
              key={category.category}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">
                    {category.category}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.downloads} downloads
                  </p>
                </div>
              </div>
              <Badge variant="outline">{category.downloads}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
