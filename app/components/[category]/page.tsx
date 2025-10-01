import { categories } from "@/config/components"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import ComponentCard from "./component-card"
import InstallCommand from "./install-command"

export async function generateStaticParams() {
  return Object.keys(categories).map((category) => ({
    category,
  }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categoryKey } = await params
  const category = categories[categoryKey as keyof typeof categories]

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/components" className="hover:text-foreground transition-colors">
          Components
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          {category.badge && (
            <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {category.badge}
            </span>
          )}
        </div>
        <p className="text-lg text-muted-foreground">{category.description}</p>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1  gap-6 mb-8">
        {category.components.map((componentName) => (
          <ComponentCard key={componentName} componentName={componentName} />
        ))}
      </div>

      {/* Installation Section */}
      <div className="rounded-lg border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold mb-2">Quick Installation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Install components from this category using the shadcn CLI:
        </p>
        <InstallCommand componentName={category.components[0]} />
      </div>
    </div>
  )
}