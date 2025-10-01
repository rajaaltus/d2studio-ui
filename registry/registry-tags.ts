export const registryTags = [
  // Forms
  "input",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "form",
  "validation",
  "search",
  "autocomplete",
  "datepicker",
  "timepicker",
  "slider",
  "switch",
  "toggle",

  // Layouts
  "grid",
  "flexbox",
  "container",
  "section",
  "hero",
  "sidebar",
  "split-view",
  "masonry",
  "columns",
  "stack",

  // Navigation
  "navbar",
  "menu",
  "breadcrumb",
  "tabs",
  "stepper",
  "pagination",
  "footer",
  "header",
  "sidenav",
  "mobilemenu",

  // Display
  "card",
  "list",
  "table",
  "accordion",
  "carousel",
  "modal",
  "drawer",
  "tooltip",
  "popover",
  "badge",
  "avatar",
  "skeleton",
  "spinner",
  "progress",

  // Marketing
  "pricing",
  "testimonial",
  "cta",
  "feature",
  "stats",
  "team",
  "faq",
  "newsletter",
  "hero-section",
  "landing",

  // E-commerce
  "product",
  "cart",
  "checkout",
  "payment",
  "review",
  "wishlist",
  "filter",
  "sort",
  "product-grid",
  "product-card",

  // Authentication
  "signin",
  "signup",
  "forgot-password",
  "reset-password",
  "verify-email",
  "two-factor",
  "oauth",
  "profile",

  // Data
  "chart",
  "graph",
  "dashboard",
  "analytics",
  "metrics",
  "report",
  "visualization",

  // Communication
  "chat",
  "comments",
  "notifications",
  "messages",
  "inbox",
  "email",

  // Media
  "image",
  "video",
  "audio",
  "gallery",
  "lightbox",
  "upload",
  "file-manager",

  // Utility
  "dark-mode",
  "responsive",
  "accessible",
  "animated",
  "interactive",
  "customizable",
  "typescript",
  "monospace",
  "modern",
  "minimal"
] as const

export type RegistryTag = typeof registryTags[number]

// Helper function to validate tags
export function validateTags(tags: string[]): RegistryTag[] {
  return tags.filter((tag): tag is RegistryTag =>
    (registryTags as readonly string[]).includes(tag)
  )
}

// Category to tags mapping
export const categoryTags: Record<string, RegistryTag[]> = {
  forms: ["form", "input", "textarea", "select", "checkbox", "radio", "validation", "switch"],
  layouts: ["grid", "flexbox", "container", "section", "hero", "sidebar", "columns"],
  marketing: ["pricing", "testimonial", "cta", "feature", "stats", "landing", "hero-section"],
  ecommerce: ["product", "cart", "checkout", "payment", "product-grid", "product-card"],
  navigation: ["navbar", "menu", "breadcrumb", "tabs", "header", "footer", "sidenav"],
  display: ["card", "list", "table", "accordion", "carousel", "modal", "badge", "avatar"],
  feedback: ["modal", "drawer", "tooltip", "popover", "notifications", "spinner", "progress"],
  authentication: ["signin", "signup", "forgot-password", "profile", "oauth", "two-factor"]
}