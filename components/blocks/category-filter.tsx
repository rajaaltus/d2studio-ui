"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const BLOCK_TYPES = [
  { value: "all", label: "All" },
  { value: "headers", label: "Headers" },
  { value: "hero-sections", label: "Hero Sections" },
  { value: "bento", label: "Bento" },
  { value: "cta", label: "CTA" },
  { value: "footer", label: "Footer" },
] as const;

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "all";

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

  return (
    <div className="w-full border-x max-w-6xl mx-auto screen-line-after screen-line-before">
      <div className="px-4 py-3">
        <Tabs
          value={currentType}
          onValueChange={handleTypeChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-1">
            {BLOCK_TYPES.map((type) => (
              <TabsTrigger
                key={type.value}
                value={type.value}
                className={cn(
                  "h-9 px-4 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm",
                  "data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground",
                  "hover:text-foreground transition-colors",
                )}
              >
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

