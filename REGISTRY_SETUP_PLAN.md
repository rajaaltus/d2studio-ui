# D2Studio v2 - Component Library Registry Setup Plan

## Project Overview
Transform D2Studio v2 into a shadcn component library with registry system similar to Origin UI, enabling component distribution via CLI installation.

## Current Status
- ✅ Registry directory structure created
- ⏳ Components.json has basic registry configuration (@d2)
- 🔄 Next steps: Complete registry infrastructure and build system

## Origin UI Analysis Summary
Origin UI implements a sophisticated shadcn registry with:
- 600+ components in numbered system (comp-01 to comp-600+)
- Registry JSON files in `/public/r/` for CLI distribution
- Dynamic category pages with component previews
- Tag-based categorization system (130+ tags)
- Build automation using `shadcn build` command
- Installation via: `npx shadcn@latest add https://originui.com/r/comp-01.json`

## Implementation Phases

### Phase 1: Registry Infrastructure Setup ✅ (Partially Complete)

#### 1.1 Directory Structure Creation ✅
```bash
# Already created:
registry/
├── default/
│   ├── components/    # Custom components
│   ├── ui/           # Base UI components
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utility functions
public/r/              # For generated registry JSON files
config/                # Configuration files
```

#### 1.2 Registry Configuration 🔄 (In Progress)
- [ ] Update `components.json` with full registry settings
- [ ] Create main `registry.json` with schema validation
- [ ] Configure registry metadata structure

### Phase 2: Build System Configuration

#### 2.1 Package Dependencies
```bash
# Install required packages
pnpm add -D shadcn@^2.7.0
pnpm add @radix-ui/react-accordion @radix-ui/react-alert-dialog
pnpm add @radix-ui/react-aspect-ratio @radix-ui/react-avatar
pnpm add @radix-ui/react-checkbox @radix-ui/react-collapsible
# ... other Radix UI components as needed
```

#### 2.2 Build Scripts to Add
```json
{
  "scripts": {
    "registry:build": "shadcn build",
    "registry:watch": "shadcn build --watch",
    "registry:validate": "shadcn validate",
    "registry:clean": "rm -rf public/r/*.json"
  }
}
```

### Phase 3: Component Organization System

#### 3.1 Component Naming Convention
Options to decide:
1. **Numbered System** (like Origin UI): `comp-001.tsx`, `comp-002.tsx`
2. **Semantic Names**: `hero-section.tsx`, `pricing-table.tsx`
3. **Hybrid**: Categories with numbers: `form-001.tsx`, `layout-001.tsx`

#### 3.2 Import Path Configuration
Update `tsconfig.json` paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/registry/*": ["./registry/*"],
      "@/registry/default/*": ["./registry/default/*"]
    }
  }
}
```

### Phase 4: Core Files to Create

#### 4.1 Main Registry Configuration
**File: `/registry.json`**
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "d2studio",
  "homepage": "https://d2studio.com",
  "registries": {
    "@d2": {
      "url": "https://d2studio.com/r/{name}.json"
    }
  },
  "items": []
}
```

#### 4.2 Category Configuration
**File: `/config/components.ts`**
```typescript
export const categories = {
  forms: {
    name: "Forms",
    description: "Form components and inputs",
    components: ["comp-001", "comp-002", "comp-003"],
    icon: "FileText",
    badge: null
  },
  layouts: {
    name: "Layouts",
    description: "Page layouts and sections",
    components: ["comp-010", "comp-011", "comp-012"],
    icon: "Layout",
    badge: "New"
  },
  marketing: {
    name: "Marketing",
    description: "Landing page components",
    components: ["comp-020", "comp-021", "comp-022"],
    icon: "Megaphone",
    badge: null
  },
  ecommerce: {
    name: "E-commerce",
    description: "Shopping and product components",
    components: ["comp-030", "comp-031", "comp-032"],
    icon: "ShoppingCart",
    badge: null
  },
  navigation: {
    name: "Navigation",
    description: "Headers, footers, and menus",
    components: ["comp-040", "comp-041", "comp-042"],
    icon: "Menu",
    badge: null
  }
}
```

#### 4.3 Tag System
**File: `/registry/registry-tags.ts`**
```typescript
export const registryTags = [
  // Forms
  "input", "textarea", "select", "checkbox", "radio",
  "form", "validation", "search", "autocomplete",

  // Layouts
  "grid", "flexbox", "container", "section", "hero",
  "sidebar", "split-view", "masonry",

  // Navigation
  "navbar", "menu", "breadcrumb", "tabs", "stepper",
  "pagination", "footer", "header",

  // Display
  "card", "list", "table", "accordion", "carousel",
  "modal", "drawer", "tooltip", "popover",

  // Marketing
  "pricing", "testimonial", "cta", "feature",
  "stats", "team", "faq", "newsletter",

  // E-commerce
  "product", "cart", "checkout", "payment",
  "review", "wishlist", "filter", "sort"
] as const

export type RegistryTag = typeof registryTags[number]
```

### Phase 5: Sample Components Structure

#### 5.1 Base UI Component Example
**File: `/registry/default/ui/button.tsx`**
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        destructive: "bg-destructive text-destructive-foreground...",
        // ... other variants
      }
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 5.2 Custom Component Example
**File: `/registry/default/components/comp-001.tsx`**
```typescript
"use client"

import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { Button } from "@/registry/default/ui/button"

export default function Component() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
        />
      </div>
      <Button className="w-full">Subscribe</Button>
    </div>
  )
}
```

#### 5.3 Registry Item JSON Example
**File: `/public/r/comp-001.json`**
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "comp-001",
  "type": "registry:component",
  "registryDependencies": [
    "https://d2studio.com/r/input.json",
    "https://d2studio.com/r/label.json",
    "https://d2studio.com/r/button.json"
  ],
  "files": [
    {
      "path": "registry/default/components/comp-001.tsx",
      "content": "/* actual component code */",
      "type": "registry:component"
    }
  ],
  "meta": {
    "tags": ["form", "input", "newsletter"]
  }
}
```

### Phase 6: Web Interface Pages

#### 6.1 Homepage Gallery
**File: `/app/page.tsx`**
```typescript
import { categories } from "@/config/components"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Component Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([slug, category]) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {category.name}
              {category.badge && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  {category.badge}
                </span>
              )}
            </h2>
            <p className="text-muted-foreground mb-4">
              {category.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {category.components.length} components
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

#### 6.2 Dynamic Category Pages
**File: `/app/[category]/page.tsx`**
```typescript
import { categories } from "@/config/components"
import { notFound } from "next/navigation"

export default function CategoryPage({
  params
}: {
  params: { category: string }
}) {
  const category = categories[params.category]

  if (!category) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.components.map((componentName) => (
          <div key={componentName} className="border rounded-lg p-4">
            <div className="aspect-video bg-muted mb-4 rounded" />
            <h3 className="font-semibold mb-2">{componentName}</h3>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              npx shadcn@latest add https://d2studio.com/r/{componentName}.json
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Phase 7: Testing & Validation

#### 7.1 Build Process Testing
```bash
# Test registry build
pnpm registry:build

# Validate generated JSON files
pnpm registry:validate

# Test installation locally
npx shadcn@latest add ./public/r/comp-001.json
```

#### 7.2 Deployment Checklist
- [ ] All components have registry JSON files
- [ ] Registry dependencies are properly configured
- [ ] Component previews are generated
- [ ] Installation commands work correctly
- [ ] Search functionality is implemented
- [ ] Category navigation works
- [ ] Dark/light mode previews available

## Timeline

### Week 1: Infrastructure & Build System
- Day 1-2: Complete registry configuration
- Day 3-4: Set up build system and scripts
- Day 5: Test build process

### Week 2: Component Development
- Day 1-2: Create base UI components
- Day 3-4: Create sample custom components
- Day 5: Generate registry JSON files

### Week 3: Web Interface
- Day 1-2: Homepage and navigation
- Day 3-4: Category pages and component display
- Day 5: Search and filtering

### Week 4: Polish & Testing
- Day 1-2: Component previews
- Day 3-4: Documentation
- Day 5: Final testing and deployment

## Next Immediate Steps (Continue Tomorrow)

1. **Update components.json** with complete registry configuration
2. **Create registry.json** main configuration file
3. **Install shadcn CLI** and required dependencies
4. **Add build scripts** to package.json
5. **Create category configuration** in config/components.ts
6. **Create tag system** in registry/registry-tags.ts
7. **Create first sample components** (both UI and custom)
8. **Test registry build** process
9. **Create gallery homepage**
10. **Implement category pages**

## Resources & References

- [shadcn/ui Registry Docs](https://ui.shadcn.com/docs/registry)
- [Origin UI Repository](https://github.com/origin-space/originui)
- [Registry Schema](https://ui.shadcn.com/schema/registry.json)
- [Registry Item Schema](https://ui.shadcn.com/schema/registry-item.json)

## Notes

- The registry system allows components to be installed via CLI
- Each component can have dependencies on other registry components
- The build process embeds component code directly in JSON files
- Components should be self-contained with proper imports
- Consider using preview images for better UX
- Tag system helps with search and discovery
- Category organization improves navigation

## Commands Reference

```bash
# Development
pnpm dev                    # Start Next.js dev server
pnpm registry:build         # Build registry JSON files
pnpm registry:watch         # Watch mode for registry
pnpm registry:validate      # Validate registry files

# Installation (for users)
npx shadcn@latest add https://d2studio.com/r/[component-name].json

# Local testing
npx shadcn@latest add ./public/r/[component-name].json
```

---

*This plan is based on the comprehensive analysis of Origin UI and adapted for D2Studio v2 project requirements.*