"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

interface BlockCardProps {
  block: Doc<"blocks">;
}

export function BlockCard({ block }: BlockCardProps) {
  return (
    <Link href={`/blocks/${block.name}`}>
      <Card className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all hover:border-foreground/20 h-full flex flex-col p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={block.previewImage || "/placeholder.svg"}
            alt={block.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {block.codeStatus === "coming_soon" && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {block.title}
            </h3>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {block.description}
          </p>
          <div className="mt-auto flex flex-wrap gap-1">
            {block.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {block.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{block.categories.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
