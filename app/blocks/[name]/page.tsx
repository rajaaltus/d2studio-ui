"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { PreviewWrapper } from "@/components/preview/preview-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BlockPage() {
  const params = useParams();
  const blockName = params.name as string;

  const block = useQuery(api.blocks.getBlock, { name: blockName });

  if (block === undefined) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center space-y-2">
            <p>Loading block...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (block === null) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <Navigation />
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
          <p className="text-lg font-semibold">Block not found</p>
          <Button asChild variant="outline">
            <Link href="/blocks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blocks
            </Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />

      {/* Header Section */}
      <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-8">
        <div className="py-8">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
            <Link href="/blocks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blocks
            </Link>
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold font-sans mb-2">
              {block.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {block.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {block.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
              {block.blockType && (
                <Badge variant="secondary">{block.blockType}</Badge>
              )}
              {block.codeStatus === "coming_soon" && (
                <Badge variant="secondary">Code Coming Soon</Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="w-full">
        <PreviewWrapper
          componentName={block.name}
          code={undefined}
          figmaUrl={block.figmaUrl}
          codeStatus={block.codeStatus}
          isNew={block.isNew}
          minHeight="500px"
        >
          <div className="w-full h-full min-h-[600px] bg-background">
            <iframe
              src={`/preview/${block.name}?type=${block.type}`}
              className="w-full h-full min-h-[600px] border-none"
              title={`Preview for ${block.name}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </PreviewWrapper>
      </section>

      {/* Metadata Section */}
      <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-8 py-8">
        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Block Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Author</p>
              <p className="font-medium">{block.author}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Version</p>
              <p className="font-medium">{block.version}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <p className="font-medium capitalize">{block.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Code Status</p>
              <p className="font-medium capitalize">
                {block.codeStatus === "coming_soon"
                  ? "Coming Soon"
                  : "Available"}
              </p>
            </div>
          </div>
          {block.tags && block.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {block.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
