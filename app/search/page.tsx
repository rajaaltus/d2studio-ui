"use client";

import { ComponentSearch } from "@/components/search/component-search"
import { useEffect } from "react";

export default function SearchPage() {
  // Set page metadata using useEffect for client components
  useEffect(() => {
    document.title = "Search Components | D2 Studio";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Search through our collection of React components built with shadcn/ui and Tailwind CSS');
    }
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Search Components</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find the perfect component for your project. Search by name, description, or browse by category and tags.
        </p>
      </div>

      <ComponentSearch />
    </div>
  )
}