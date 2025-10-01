"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentPreview } from "@/components/preview/component-preview";
import { categories } from "@/config/components";

// Component imports - dynamically loaded
import Comp001 from "@/registry/default/components/comp-001";
import Comp002 from "@/registry/default/components/comp-002";
import Comp010 from "@/registry/default/components/comp-010";

// Component registry
const componentRegistry: Record<
  string,
  {
    component: React.ComponentType;
    code: string;
    description: string;
    tags: string[];
  }
> = {
  "comp-001": {
    component: Comp001,
    code: `"use client"

import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { Button } from "@/registry/default/ui/button"
import { useState } from "react"

export default function Component() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Newsletter signup:", email)
    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-001">Email</Label>
        <Input
          id="email-001"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
      </Button>
    </form>
  )
}`,
    description:
      "Simple newsletter subscription form with email input and submit button",
    tags: ["form", "newsletter", "email", "input"],
  },
  "comp-002": {
    component: Comp002,
    code: `"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/default/ui/card"
import { Button } from "@/registry/default/ui/button"
import { ArrowRight } from "lucide-react"

export default function Component({
  title = "Premium Features",
  description = "Everything you need to build modern applications",
  features = [
    "Advanced analytics dashboard",
    "Real-time collaboration",
    "API access and webhooks",
    "Priority support"
  ],
  buttonText = "Get Started",
  onButtonClick = () => console.log("Button clicked")
}: ComponentProps = {}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button onClick={onButtonClick} className="w-full">
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}`,
    description:
      "Feature showcase card with checklist and call-to-action button",
    tags: ["card", "marketing", "features", "cta"],
  },
  "comp-010": {
    component: Comp010,
    code: `"use client"

import { Button } from "@/registry/default/ui/button"
import { Badge } from "@/registry/default/ui/badge"
import { ArrowRight, Star } from "lucide-react"

export default function Component() {
  return (
    <section className="w-full py-20 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              New Release
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Build Faster with
              <span className="block text-primary">Modern Components</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
              Copy and paste beautiful React components built with Tailwind CSS.
              No dependencies, fully customizable, and production ready.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8">
              View Components
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}`,
    description:
      "Modern hero section with badge, heading, and call-to-action buttons",
    tags: ["hero", "marketing", "landing", "cta"],
  },
};

export async function generateStaticParams() {
  const params = [];

  for (const [categoryKey, category] of Object.entries(categories)) {
    for (const component of category.components) {
      if (componentRegistry[component]) {
        params.push({
          category: categoryKey,
          component: component,
        });
      }
    }
  }

  return params;
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ category: string; component: string }>;
}) {
  const { category: categoryKey, component: componentKey } = await params;

  const category = categories[categoryKey as keyof typeof categories];
  const componentData = componentRegistry[componentKey];

  if (!category || !componentData) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/components"
          className="hover:text-foreground transition-colors"
        >
          Components
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/components/${categoryKey}`}
          className="hover:text-foreground transition-colors"
        >
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{componentKey}</span>
      </div>

      {/* Back Button */}
      <Button variant="outline" size="sm" className="mb-6" asChild>
        <Link href={`/components/${categoryKey}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {category.name}
        </Link>
      </Button>

      {/* Component Preview */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{componentKey}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {componentData.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {componentData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <ComponentPreview
          component={componentData.component}
          componentName={componentKey}
          code={componentData.code}
          description={componentData.description}
          tags={componentData.tags}
        />

        {/* Installation Instructions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Installation</h2>
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="font-medium mb-2">Using the CLI</h3>
            <pre className="rounded bg-background p-3 text-sm overflow-x-auto">
              <code>
                npx shadcn@latest add https://d2studio.dev/r/{componentKey}.json
              </code>
            </pre>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Usage</h2>
          <div className="rounded-lg border bg-muted/50 p-4">
            <pre className="rounded bg-background p-3 text-sm overflow-x-auto">
              <code>{`import Component from "@/components/ui/${componentKey}"

export default function Example() {
  return <Component />
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
