import { categories } from "@/config/components"
import { ComponentSearch } from "@/components/search/component-search"
import Link from "next/link"
import { Button } from "@/registry/default/ui/button"
import {
  FileText,
  Layout,
  Megaphone,
  ShoppingCart,
  Menu,
  Grid,
  MessageCircle,
  Lock,
  Search
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Layout,
  Megaphone,
  ShoppingCart,
  Menu,
  Grid,
  MessageCircle,
  Lock
}

export default function ComponentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Component Library</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Browse our collection of beautifully designed components built with Radix UI and Tailwind CSS.
            </p>
          </div>
          <Button asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Search Components
            </Link>
          </Button>
        </div>

        {/* Quick Search */}
        <div className="mb-8">
          <ComponentSearch compact={true} showFilters={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([slug, category]) => {
          const Icon = iconMap[category.icon] || Grid

          return (
            <Link
              key={slug}
              href={`/components/${slug}`}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-lg transition-all hover:border-foreground/20"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="h-8 w-8 text-primary" />
                {category.badge && (
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {category.badge}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h2>

              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {category.components.length} components
                </p>
                <svg
                  className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold mb-2">Installation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Install individual components using the shadcn CLI:
        </p>
        <pre className="rounded-md bg-background p-4 overflow-x-auto">
          <code className="text-sm">npx shadcn@latest add https://d2studio.dev/r/comp-001.json</code>
        </pre>
      </div>
    </div>
  )
}