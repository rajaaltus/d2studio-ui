"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { CategoryFilter } from "@/components/blocks/category-filter";
import { BlocksList } from "@/components/blocks/blocks-list";
import { SiteFooter } from "@/components/site-footer";

function BlocksContent() {
  const searchParams = useSearchParams();
  const blockType = searchParams.get("type") || "all";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      
      {/* Header Section */}
      <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-0">
        <div className="py-12 lg:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold font-sans mb-4">
            Explore Blocks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of beautifully designed blocks. Each block
            includes a Figma file and code (when available).
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Blocks Grid */}
      <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-0 py-8">
        <BlocksList blockType={blockType} />
      </section>

      <SiteFooter />
    </div>
  );
}

export default function BlocksPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen overflow-x-hidden">
          <Navigation />
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center space-y-2">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <BlocksContent />
    </Suspense>
  );
}

