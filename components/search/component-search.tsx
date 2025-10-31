"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/registry/default/ui/input";
import { Button } from "@/registry/default/ui/button";
import { Badge } from "@/registry/default/ui/badge";
import { Card, CardContent } from "@/registry/default/ui/card";
import { PreviewWrapper } from "@/components/preview/preview-wrapper";
import { Search, X, Filter } from "lucide-react";
import Link from "next/link";
import { categories } from "@/config/components";

// Component imports for search results
import Comp001 from "@/registry/default/components/comp-001";
import Comp002 from "@/registry/default/components/comp-002";
import Comp003 from "@/registry/default/components/comp-003";
import Comp010 from "@/registry/default/components/hero-01";
import Comp011 from "@/registry/default/components/comp-011";
import Comp012 from "@/registry/default/components/pricing-01";
import Comp013 from "@/registry/default/components/comp-013";
import Comp020 from "@/registry/default/components/comp-020";
import Comp021 from "@/registry/default/components/comp-021";
import Comp030 from "@/registry/default/components/comp-030";
import Comp040 from "@/registry/default/components/comp-040";
import Comp050 from "@/registry/default/components/comp-050";

const componentRegistry: Record<
  string,
  {
    component: React.ComponentType;
    description: string;
    tags: string[];
    category: string;
    title: string;
  }
> = {
  "comp-001": {
    component: Comp001,
    title: "Newsletter Form",
    description:
      "Simple newsletter subscription form with email input and submit button",
    tags: ["form", "newsletter", "email", "input", "subscription"],
    category: "forms",
  },
  "comp-002": {
    component: Comp002,
    title: "Feature Card",
    description:
      "Feature showcase card with checklist and call-to-action button",
    tags: ["card", "marketing", "features", "cta", "checklist"],
    category: "forms",
  },
  "comp-003": {
    component: Comp003,
    title: "Login Form",
    description: "Complete login form with email and password fields",
    tags: ["form", "auth", "login", "authentication", "signin"],
    category: "forms",
  },
  "comp-010": {
    component: Comp010,
    title: "Hero Section",
    description:
      "Modern hero section with gradient text and call-to-action buttons",
    tags: ["hero", "marketing", "landing", "cta", "gradient"],
    category: "layouts",
  },
  "comp-011": {
    component: Comp011,
    title: "Features Section",
    description: "Two-column features section with icons and descriptions",
    tags: ["features", "marketing", "landing", "icons", "grid"],
    category: "layouts",
  },
  "comp-012": {
    component: Comp012,
    title: "Pricing Table",
    description:
      "Three-tier pricing table with feature comparison and popular plan highlighting",
    tags: ["pricing", "marketing", "saas", "plans", "comparison"],
    category: "layouts",
  },
  "comp-013": {
    component: Comp013,
    title: "Feature Section",
    description:
      "Modern feature section with stats, call-to-action buttons, and feature cards",
    tags: ["features", "section", "stats", "cta", "cards", "modern"],
    category: "layouts",
  },
  "comp-020": {
    component: Comp020,
    title: "Contact Form",
    description:
      "Comprehensive contact form with validation and contact information",
    tags: ["form", "contact", "validation", "support", "inquiry"],
    category: "marketing",
  },
  "comp-021": {
    component: Comp021,
    title: "Search Filter",
    description: "Advanced search with tag-based filtering and suggestions",
    tags: ["search", "filter", "tags", "autocomplete", "suggestions"],
    category: "marketing",
  },
  "comp-030": {
    component: Comp030,
    title: "Product Card",
    description: "E-commerce product card with wishlist and quick actions",
    tags: ["product", "ecommerce", "card", "wishlist", "shop"],
    category: "ecommerce",
  },
  "comp-040": {
    component: Comp040,
    title: "Navigation Header",
    description: "Responsive navigation with mobile menu and search",
    tags: ["nav", "header", "navigation", "mobile", "responsive"],
    category: "navigation",
  },
  "comp-050": {
    component: Comp050,
    title: "Article Card",
    description: "Blog article cards with author info and reading time",
    tags: ["article", "blog", "card", "author", "content"],
    category: "display",
  },
};

interface ComponentSearchProps {
  showFilters?: boolean;
  compact?: boolean;
}

export function ComponentSearch({
  showFilters = true,
  compact = false,
}: ComponentSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Add keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search"]',
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Get all available tags from components
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(componentRegistry).forEach((comp) => {
      comp.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter components based on search query and filters
  const filteredComponents = useMemo(() => {
    return Object.entries(componentRegistry).filter(([key, comp]) => {
      // Text search
      const searchLower = query.toLowerCase();
      const matchesSearch =
        query === "" ||
        key.toLowerCase().includes(searchLower) ||
        comp.title.toLowerCase().includes(searchLower) ||
        comp.description.toLowerCase().includes(searchLower) ||
        comp.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(comp.category);

      // Tag filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => comp.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [query, selectedCategories, selectedTags]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    query !== "" || selectedCategories.length > 0 || selectedTags.length > 0;

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search components..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-16"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        {filteredComponents.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {filteredComponents.length} component
            {filteredComponents.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search components by name, description, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
                className="h-5 w-5 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {!query && (
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            )}
          </div>
        </div>

        {/* Results count and clear filters */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredComponents.length} component
            {filteredComponents.length !== 1 ? "s" : ""} found
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Category filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categories).map(([key, category]) => (
                <Badge
                  key={key}
                  variant={
                    selectedCategories.includes(key) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleCategory(key)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tag filters */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Tags</span>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/10 text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-6">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No components found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredComponents.map(([key, comp]) => {
              const Component = comp.component;
              const categoryData = Object.entries(categories).find(
                ([, cat]) => cat.name.toLowerCase() === comp.category,
              );
              const categoryKey = categoryData?.[0] || comp.category;

              return (
                <Card
                  key={key}
                  className="group overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Live Preview */}
                  <div className="aspect-video border-b">
                    <PreviewWrapper
                      componentName={key}
                      minHeight="200px"
                      className="border-none"
                    >
                      <div className="scale-75 origin-center">
                        <Component />
                      </div>
                    </PreviewWrapper>
                  </div>

                  {/* Component Info */}
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {comp.title}
                          </h3>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {key}
                          </code>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {categories[categoryKey as keyof typeof categories]
                            ?.name || comp.category}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {comp.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {comp.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {comp.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{comp.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/components/${categoryKey}/${key}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const command = `npx shadcn@latest add https://d2studio.dev/r/${key}.json`;
                            navigator.clipboard.writeText(command);
                          }}
                        >
                          Copy Install
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
