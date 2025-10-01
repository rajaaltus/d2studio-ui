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
    components: ["comp-010", "comp-011", "comp-012", "comp-013"],
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
  },
  display: {
    name: "Display",
    description: "Cards, tables, and data display",
    components: ["comp-050", "comp-051", "comp-052"],
    icon: "Grid",
    badge: null
  },
  feedback: {
    name: "Feedback",
    description: "Alerts, toasts, and modals",
    components: ["comp-060", "comp-061", "comp-062"],
    icon: "MessageCircle",
    badge: null
  },
  authentication: {
    name: "Authentication",
    description: "Sign in, sign up, and auth flows",
    components: ["comp-070", "comp-071", "comp-072"],
    icon: "Lock",
    badge: "Popular"
  }
} as const

export type CategoryKey = keyof typeof categories
export type Category = typeof categories[CategoryKey]