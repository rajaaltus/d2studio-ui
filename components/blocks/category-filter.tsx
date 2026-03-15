"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "all";

  const categoriesList = useQuery(api.categories.get);

  const handleTypeChange = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("type");
      } else {
        params.set("type", value);
      }
      router.push(`/blocks?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  if (!categoriesList) {
    return (
      <div className="w-full border-x max-w-6xl mx-auto screen-line-after screen-line-before">
        <div className="px-4 py-3 h-15 flex items-center">
          <div className="h-9 w-64 animate-pulse bg-muted rounded-md" />
        </div>
      </div>
    );
  }

  const allTypes = [
    { slug: "all", name: "All" },
    ...categoriesList
  ];

  return (
    <div className="w-full border-x max-w-6xl mx-auto screen-line-after screen-line-before">
      <div className="px-4 py-3 overflow-x-auto no-scrollbar">
        <Tabs
          value={currentType}
          onValueChange={handleTypeChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-1 flex-nowrap">
            {allTypes.map((type) => (
              <TabsTrigger
                key={type.slug}
                value={type.slug}
                className={cn(
                  "h-9 px-4 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm",
                  "data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground",
                  "hover:text-foreground transition-colors whitespace-nowrap",
                )}
              >
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
