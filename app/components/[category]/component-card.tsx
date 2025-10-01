"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { SyntaxHighlighter } from "@/components/ui/syntax-highlighter"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Terminal,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImperativePanelHandle } from "react-resizable-panels"

// Component imports for previews
import Comp001 from "@/registry/default/components/comp-001"
import Comp002 from "@/registry/default/components/comp-002"
import Comp003 from "@/registry/default/components/comp-003"
import Comp010 from "@/registry/default/components/comp-010"
import Comp011 from "@/registry/default/components/comp-011"
import Comp012 from "@/registry/default/components/comp-012"
import Comp020 from "@/registry/default/components/comp-020"
import Comp021 from "@/registry/default/components/comp-021"
import Comp030 from "@/registry/default/components/comp-030"
import Comp040 from "@/registry/default/components/comp-040"
import Comp050 from "@/registry/default/components/comp-050"

const componentRegistry: Record<string, {
  component: React.ComponentType
  description: string
  tags: string[]
  code?: string
}> = {
  "comp-001": {
    component: Comp001,
    description: "Simple newsletter subscription form with email input",
    tags: ["form", "newsletter"],
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
}`
  },
  "comp-002": {
    component: Comp002,
    description: "Feature showcase card with checklist and CTA",
    tags: ["card", "marketing"],
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
}`
  },
  "comp-003": {
    component: Comp003,
    description: "Complete login form with email and password",
    tags: ["form", "auth"],
    code: `"use client"

// Login form component
export default function Component() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="w-full p-2 border rounded" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" className="w-full p-2 border rounded" />
      </div>
      <button className="w-full bg-primary text-white p-2 rounded">
        Sign In
      </button>
    </div>
  )
}`
  },
  "comp-010": {
    component: Comp010,
    description: "Modern hero section with gradient text",
    tags: ["hero", "marketing"],
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
}`
  },
  "comp-011": {
    component: Comp011,
    description: "Two-column features section with icons",
    tags: ["features", "marketing"],
    code: `"use client"

// Features section component
export default function Component() {
  return (
    <section className="py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Fast Development</h3>
          <p className="text-muted-foreground">Build faster with pre-made components</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Modern Design</h3>
          <p className="text-muted-foreground">Beautiful and responsive components</p>
        </div>
      </div>
    </section>
  )
}`
  },
  "comp-012": {
    component: Comp012,
    description: "Three-tier pricing table with comparisons",
    tags: ["pricing", "marketing"],
    code: `"use client"

// Pricing table component
export default function Component() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold">Basic</h3>
        <p className="text-2xl font-bold">$9/mo</p>
        <button className="w-full mt-4 bg-primary text-white p-2 rounded">Choose Plan</button>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold">Pro</h3>
        <p className="text-2xl font-bold">$19/mo</p>
        <button className="w-full mt-4 bg-primary text-white p-2 rounded">Choose Plan</button>
      </div>
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold">Enterprise</h3>
        <p className="text-2xl font-bold">$39/mo</p>
        <button className="w-full mt-4 bg-primary text-white p-2 rounded">Choose Plan</button>
      </div>
    </div>
  )
}`
  },
  "comp-020": {
    component: Comp020,
    description: "Comprehensive contact form with validation",
    tags: ["form", "contact"],
    code: `"use client"

// Contact form component
export default function Component() {
  return (
    <form className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" className="w-full p-2 border rounded" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="w-full p-2 border rounded" />
      </div>
      <div className="space-y-2">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={4} className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="w-full bg-primary text-white p-2 rounded">
        Send Message
      </button>
    </form>
  )
}`
  },
  "comp-021": {
    component: Comp021,
    description: "Advanced search with tag-based filtering",
    tags: ["search", "filter"],
    code: `"use client"

// Search component with filters
export default function Component() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <input type="text" placeholder="Search..." className="w-full p-2 pl-8 border rounded" />
        <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-primary text-white rounded text-sm">All</button>
        <button className="px-3 py-1 border rounded text-sm">Design</button>
        <button className="px-3 py-1 border rounded text-sm">Code</button>
      </div>
    </div>
  )
}`
  },
  "comp-030": {
    component: Comp030,
    description: "E-commerce product card with wishlist",
    tags: ["product", "ecommerce"],
    code: `"use client"

// Product card component
export default function Component() {
  return (
    <div className="w-full max-w-sm border rounded-lg overflow-hidden">
      <div className="aspect-square bg-gray-100"></div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold">Product Name</h3>
        <p className="text-sm text-muted-foreground">Product description here</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">$99</span>
          <button className="bg-primary text-white px-4 py-2 rounded">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}`
  },
  "comp-040": {
    component: Comp040,
    description: "Responsive navigation with mobile menu",
    tags: ["nav", "header"],
    code: `"use client"

// Navigation component
export default function Component() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="font-bold text-xl">Logo</div>
      <div className="hidden md:flex space-x-6">
        <a href="#" className="hover:text-primary">Home</a>
        <a href="#" className="hover:text-primary">About</a>
        <a href="#" className="hover:text-primary">Services</a>
        <a href="#" className="hover:text-primary">Contact</a>
      </div>
      <button className="md:hidden">
        <svg className="h-6 w-6" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  )
}`
  },
  "comp-050": {
    component: Comp050,
    description: "Blog article cards with author info",
    tags: ["article", "blog"],
    code: `"use client"

// Blog card component
export default function Component() {
  return (
    <article className="w-full max-w-md border rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-100"></div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">Article Title</h3>
        <p className="text-sm text-muted-foreground">Brief description of the article content...</p>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-medium">Author Name</p>
            <p className="text-xs text-muted-foreground">Mar 15, 2024</p>
          </div>
        </div>
      </div>
    </article>
  )
}`
  }
}

export default function ComponentCard({ componentName }: { componentName: string }) {
  const params = useParams()
  const category = params?.category as string
  const [view, setView] = useState<"preview" | "code">("preview")
  const [deviceSize, setDeviceSize] = useState("100")
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [currentSize, setCurrentSize] = useState(100)
  const resizablePanelRef = useRef<ImperativePanelHandle>(null)

  const componentData = componentRegistry[componentName]

  if (!componentData) {
    return (
      <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all">
        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
          <span className="text-lg font-mono text-muted-foreground/50">
            {componentName}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">{componentName}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Component preview coming soon
          </p>
          <Button size="sm" className="w-full" disabled>
            Preview Not Available
          </Button>
        </div>
      </div>
    )
  }

  const Component = componentData.component
  const installCommand = `npx shadcn@latest add https://d2studio.dev/r/${componentName.toLowerCase()}.json`

  const handleCopyInstall = useCallback(async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }, [installCommand])

  const handleSizeChange = useCallback((value: string) => {
    const size = parseInt(value)
    setDeviceSize(value)
    setCurrentSize(size)
    if (resizablePanelRef?.current) {
      resizablePanelRef.current.resize(size)
    }
  }, [])

  const getPreviewScale = () => {
    const size = parseInt(deviceSize)
    if (size <= 30) return "scale-[0.4]"
    if (size <= 60) return "scale-[0.6]"
    return "scale-75"
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all">
      {/* Compact Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          {/* Preview/Code Toggle */}
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "preview" | "code")}
            className="flex"
          >
            <TabsList className="h-6 gap-0.5 rounded-md bg-muted p-0.5">
              <TabsTrigger
                value="preview"
                className="h-5 rounded-sm px-2 text-xs data-[state=active]:bg-background"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="h-5 rounded-sm px-2 text-xs data-[state=active]:bg-background"
              >
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Screen Size Selector - Only in preview */}
          {view === "preview" && (
            <>
              <div className="h-4 w-px bg-border" />
              <ToggleGroup
                type="single"
                value={deviceSize}
                onValueChange={handleSizeChange}
                className="gap-0.5"
              >
                <ToggleGroupItem
                  value="100"
                  className="h-6 w-6 rounded-sm p-0"
                  title="Desktop"
                >
                  <Monitor className="h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="60"
                  className="h-6 w-6 rounded-sm p-0"
                  title="Tablet"
                >
                  <Tablet className="h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="30"
                  className="h-6 w-6 rounded-sm p-0"
                  title="Mobile"
                >
                  <Smartphone className="h-3 w-3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </>
          )}
        </div>

        {/* Copy Install Command */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={handleCopyInstall}
          title="Copy install command"
        >
          {copiedInstall ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Terminal className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Preview Area */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/30 via-muted/20 to-background">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
            opacity: 0.2,
          }}
        />

        {view === "preview" ? (
          <ResizablePanelGroup
            direction="horizontal"
            className="relative z-10 h-full"
            onLayout={(sizes) => {
              setCurrentSize(Math.round(sizes[0] || 100))
            }}
          >
            <ResizablePanel
              ref={resizablePanelRef}
              className="relative aspect-[4/2.5] rounded-xl border bg-background md:aspect-auto"
              defaultSize={currentSize}
              minSize={30}
            >
              <div
                className={cn(
                  "relative flex h-full w-full items-center justify-center p-4 transition-transform duration-300",
                  getPreviewScale(),
                  "origin-center"
                )}
              >
                <Component />
              </div>

              {/* Size Indicator */}
              {currentSize < 100 && (
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white dark:bg-white/70 dark:text-black">
                  {Math.round((currentSize / 100) * 400)}px
                </div>
              )}
            </ResizablePanel>

            {/* Exact shadcn ResizableHandle implementation */}
            <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />

            <ResizablePanel defaultSize={0} minSize={0} />
          </ResizablePanelGroup>
        ) : (
          <div className="relative h-full">
            {componentData.code ? (
              <SyntaxHighlighter
                code={componentData.code}
                language="tsx"
                filename={`${componentName}.tsx`}
                withMeta={true}
                className="h-full [&>div]:rounded-none [&>div]:border-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground bg-zinc-950 rounded-xl border">
                Code preview not available
              </div>
            )}
          </div>
        )}

      </div>

      {/* Component Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {componentName}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {componentData.description}
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {componentData.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            asChild
          >
            <Link href={`/components/${category}/${componentName}`}>
              View Details
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleCopyInstall}
          >
            {copiedInstall ? (
              <>
                <Check className="mr-2 h-3 w-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-3 w-3" />
                Copy Install
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}