// The free catalogue: every item this site publishes to its own registry.
//
// This file is the source of truth. The build script reads it, walks
// registry/default for each item's files and rewrites registry.json from
// scratch, so a block is added by dropping its source in and writing an entry
// here. Nothing else.
//
// Keep it pure data with no imports: a node script imports it from outside a
// tsconfig, so anything beyond types and literals will not compile there.

export type BlockDef = {
  /** Registry item name. [a-z0-9-] only: it is the install URL and the route. */
  name: string;
  title: string;
  /** Card copy and the registry description at once, so the two cannot disagree. */
  description: string;
  /** Slugs the category filter matches, and what shadcn writes into the item. */
  categories: string[];
  /** npm packages, in shadcn's "pkg@range" form. */
  dependencies?: string[];
  /** Other registry items this one installs alongside itself. */
  registryDependencies?: string[];
  /** Global CSS the item needs; shadcn merges it into the consumer's stylesheet. */
  css?: Record<string, unknown>;
  cssVars?: Record<string, unknown>;
  /**
   * Which browse shelf draws it. An item with no shelf is installable but never
   * listed: a ui primitive, or a part some other block pulls in.
   */
  shelf?: "blocks";
  /** Card art under public/. Only read for shelved items. */
  image?: string;
  status?: "available" | "coming_soon";
  /** Rank on the home page showcase. Unset means it is not featured. */
  featured?: number;
  author?: string;
  version?: string;
};

// Order is what /blocks draws. Shelved items lead, in the order they were
// published; everything under them is registry-only and never listed.
export const BLOCK_LIBRARY: BlockDef[] = [
  {
    name: "ai-block",
    title: "AI Block",
    description: "AI prompt template grid with creative prompts, summarizer, story, poetry and study presets.",
    categories: ["blocks", "ai-components"],
    dependencies: ["nucleo-glass"],
    shelf: "blocks",
    image: "/blocks/ai-block.png",
    status: "available",
    author: "@uxgodwin",
    version: "1.0.0",
  },
  {
    name: "ai-content-creator-card-v2",
    title: "AI Content Creator Card v2",
    description: "Glassmorphic AI content generator card with content type and tone pickers and a prompt field.",
    categories: ["ai-components"],
    dependencies: ["nucleo-glass"],
    registryDependencies: ["button", "input", "label", "select", "textarea"],
    shelf: "blocks",
    image: "/blocks/ai-content-creator-card-v2.png",
    status: "available",
    author: "Admin",
    version: "1.0.0",
  },
  {
    name: "ai-content-creator-card",
    title: "AI Content Creator Card",
    description: "Pro version content creation card",
    categories: ["card", "bento"],
    dependencies: ["lucide-react", "nucleo-glass"],
    registryDependencies: ["button", "dropdown-menu", "input", "label", "select", "textarea"],
    shelf: "blocks",
    image: "/placeholder.svg",
    status: "coming_soon",
    author: "Admin",
    version: "1.0.0",
  },
  {
    name: "dashboard-01",
    title: "Dashboard 01",
    description: "Hotel booking dashboard with guest and vacancy stats, booking search and a check-in and check-out table.",
    categories: ["dashboard"],
    dependencies: ["lucide-react"],
    registryDependencies: ["badge", "button", "card", "dropdown-menu", "input", "table"],
    shelf: "blocks",
    image: "/blocks/dashboard-01.png",
    status: "available",
    author: "Admin",
    version: "1.0.0",
  },
  {
    name: "bento-01",
    title: "Bento 01",
    description: "Bento grid for an education program platform with admin overview, faculty view and a program form.",
    categories: ["bento"],
    dependencies: ["lucide-react", "recharts"],
    registryDependencies: ["badge", "button", "card", "input", "https://ui.aceternity.com/registry/dotted-glow-background.json"],
    shelf: "blocks",
    image: "/blocks/bento-01.png",
    status: "available",
    author: "Admin",
    version: "1.0.0",
  },
  {
    name: "ai-v2",
    title: "AI Tabs",
    description: "Tabbed AI prompt input with assistant, blog and pro modes plus file upload.",
    categories: ["ai-components"],
    dependencies: ["lucide-react", "nucleo-glass"],
    registryDependencies: ["button", "dropdown-menu"],
    shelf: "blocks",
    image: "/blocks/ai-v2.png",
    status: "available",
    author: "Admin",
    version: "1.0.0",
  },
  {
    name: "hero-01",
    title: "Hero 01",
    description: "Startup mentorship landing hero with a headline, call to action and mentor avatar group.",
    categories: ["hero"],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "badge", "avatar"],
    shelf: "blocks",
    image: "/blocks/hero-01.png",
    status: "available",
    author: "Admin",
    version: "1.0.0",
  },
  {
    name: "input",
    title: "Input",
    description: "Displays a form input field or a component that looks like an input field.",
    categories: ["ui"],
  },
  {
    name: "label",
    title: "Label",
    description: "Renders an accessible label associated with controls.",
    categories: ["ui"],
    dependencies: ["@radix-ui/react-label", "class-variance-authority"],
  },
  {
    name: "card",
    title: "Card",
    description: "Displays a card with header, content, and footer.",
    categories: ["ui"],
  },
  {
    name: "select",
    title: "Select",
    description: "Displays a list of options for the user to pick from—triggered by a button.",
    categories: ["ui"],
    dependencies: ["@radix-ui/react-select", "lucide-react"],
    registryDependencies: ["button"],
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description: "A control that allows the user to toggle between checked and not checked.",
    categories: ["ui"],
    dependencies: ["@radix-ui/react-checkbox", "lucide-react"],
  },
  {
    name: "progress",
    title: "Progress",
    description: "Displays an indicator showing the completion progress of a task.",
    categories: ["ui"],
    dependencies: ["@radix-ui/react-progress"],
  },
  {
    name: "alert",
    title: "Alert",
    description: "Displays a callout for user attention.",
    categories: ["ui"],
    dependencies: ["class-variance-authority"],
  },
  {
    name: "drawer",
    title: "Drawer",
    description: "A drawer component that slides in from the bottom or sides of the screen.",
    categories: ["ui"],
    dependencies: ["vaul"],
  },
  {
    name: "pricing-01",
    title: "Pricing Cards",
    description: "Responsive three-tier pricing cards with feature comparison and popular plan highlighting",
    categories: ["marketing", "pricing"],
    dependencies: ["lucide-react"],
    registryDependencies: [
      "button",
      "badge",
      "https://ui.d2studio.dev/r/d2-card.json",
    ],
  },
  {
    name: "hero-section-01",
    title: "Hero Section 01",
    description: "Premium landing page hero with a serif accent headline, badge and mentor avatar group.",
    categories: ["landing"],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "badge", "avatar"],
  },
  {
    name: "hero-section-02",
    title: "Hero Section 02",
    description: "Modern landing page hero section with badge, headline and avatar social proof.",
    categories: ["landing"],
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "badge", "avatar"],
  },
  {
    name: "ai-writing-assistance",
    title: "AI Writing Assistant",
    description: "AI writing assistant panel with assistant, blog and pro modes and a prompt field.",
    categories: ["ai-tab"],
    dependencies: ["lucide-react", "nucleo-glass"],
    registryDependencies: ["button", "dropdown-menu"],
  },
  {
    name: "block-01",
    title: "Block 01",
    description: "AI feature showcase with smart summarizer, creative prompts, document analysis and engagement metrics cards.",
    categories: ["blocks"],
    dependencies: ["nucleo-glass"],
  },
  {
    name: "notification-bento",
    title: "Notification Bento",
    description: "A four-panel notification bento: a pure-CSS metallic bell on a lit dot-matrix field, recent activity feed, unread counter and delivery-channel toggles, with drifting holographic smoke on hover.",
    categories: ["bento", "blocks"],
    dependencies: ["motion", "lucide-react"],
    css: {
      ".d2-smoke": {
        "pointer-events": "none",
        "opacity": "0",
        "background": "linear-gradient(135deg, #785cff 0%, #dc28af 50%, #ff683a 100%)",
        "mix-blend-mode": "multiply",
        "-webkit-mask-image": "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%3E%3Cfilter%20id='s'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.011'%20numOctaves='3'%20seed='6'%20stitchTiles='stitch'/%3E%3CfeGaussianBlur%20stdDeviation='4'/%3E%3CfeComponentTransfer%3E%3CfeFuncA%20type='gamma'%20exponent='3.4'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect%20width='500'%20height='500'%20filter='url(%23s)'/%3E%3C/svg%3E\")",
        "mask-image": "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='500'%20height='500'%3E%3Cfilter%20id='s'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.011'%20numOctaves='3'%20seed='6'%20stitchTiles='stitch'/%3E%3CfeGaussianBlur%20stdDeviation='4'/%3E%3CfeComponentTransfer%3E%3CfeFuncA%20type='gamma'%20exponent='3.4'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect%20width='500'%20height='500'%20filter='url(%23s)'/%3E%3C/svg%3E\")",
        "-webkit-mask-size": "320% 320%",
        "mask-size": "320% 320%",
        "-webkit-mask-repeat": "no-repeat",
        "mask-repeat": "no-repeat",
        "-webkit-mask-position": "46% 74%",
        "mask-position": "46% 74%",
        "transition": "opacity 0.8s ease",
        "will-change": "mask-position, opacity"
      },
      ".dark .d2-smoke": {
        "background": "linear-gradient(135deg, #7dcfff 0%, #56daff 50%, #b8e5ff 100%)",
        "mix-blend-mode": "plus-lighter"
      },
      "[data-hovered=\"true\"] .d2-smoke": {
        "opacity": "0.55",
        "transition-duration": "0s"
      },
      ".dark [data-hovered=\"true\"] .d2-smoke": {
        "opacity": "0.4"
      },
      ".d2-dots": {
        "mix-blend-mode": "multiply",
        "transition": "opacity 0.5s, filter 0.5s"
      },
      ".dark .d2-dots": {
        "mix-blend-mode": "plus-lighter"
      },
      ".dark .d2-bright .d2-dots": {
        "opacity": "0.9"
      },
      "[data-hovered=\"true\"] .d2-dots": {
        "opacity": "1",
        "transition-duration": "0s"
      },
      ".dark .d2-bright [data-hovered=\"true\"] .d2-dots": {
        "opacity": "1",
        "filter": "brightness(1.6) saturate(1.25)"
      },
      "[data-hovered=\"true\"] .d2-hero-dots": {
        "opacity": "0.85"
      }
    },
  },
  {
    name: "bento-02",
    title: "Bento 02",
    description: "A five-card feature bento with metallic-gradient glyphs on lifting icon tiles, a dot-matrix texture and color-dodged glow revealed on hover, and a holographic brand ring tracing each card. Motion-driven, theme-aware, and reduced-motion aware.",
    categories: ["bento", "blocks"],
    dependencies: ["motion"],
    css: {
      ".bento2-card": {
        "position": "relative",
        "box-shadow": "0 2px 3.8px 0 rgba(0, 0, 0, 0.12)",
        "transition": "box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
      },
      ".dark .bento2-card": {
        "box-shadow": "0 8px 24px 0 rgba(0, 0, 0, 0.6)"
      },
      ".bento2-card::before": {
        "content": "\"\"",
        "position": "absolute",
        "inset": "0",
        "border-radius": "inherit",
        "padding": "1px",
        "background": "linear-gradient(105deg, #56daff 0%, #a8ff80 20%, #fff4a3 38%, #ff9cc8 56%, #c28aff 74%, #56daff 100%)",
        "-webkit-mask": "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        "-webkit-mask-composite": "xor",
        "mask": "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        "mask-composite": "exclude",
        "opacity": "0",
        "transition": "opacity 0.3s ease",
        "pointer-events": "none"
      },
      ".bento2-tile": {
        "box-shadow": "6px 5px 0.6px 0 rgba(0, 0, 0, 0.2)",
        "transition": "box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
      },
      ".dark .bento2-tile": {
        "box-shadow": "6px 5px 0.6px 0 rgba(0, 0, 0, 0.5)"
      },
      "@media (hover: hover)": {
        ".bento2-card:hover": {
          "box-shadow": "0 12px 28px 0 rgba(0, 0, 0, 0.16)"
        },
        ".dark .bento2-card:hover": {
          "box-shadow": "0 16px 36px 0 rgba(0, 0, 0, 0.7)"
        },
        ".bento2-card:hover::before": {
          "opacity": "0.9"
        },
        ".bento2-card:hover .bento2-tile": {
          "box-shadow": "10px 13px 16.5px 0 rgba(0, 0, 0, 0.18)"
        },
        ".dark .bento2-card:hover .bento2-tile": {
          "box-shadow": "10px 13px 18px 0 rgba(0, 0, 0, 0.55)"
        }
      }
    },
    cssVars: {
      "light": {
        "d2-flash-gradient": "radial-gradient(circle at center, #12D132 0%, #785CFF 27%, #FF683A 57%, #DC28AF 75%, #15588B 100%)"
      },
      "dark": {
        "d2-flash-gradient": "linear-gradient(270deg, #56DAFF 0%, #A8FF80 18%, #FFF4A3 35%, #FF9CC8 55%, #C28AFF 75%, #56DAFF 100%)"
      }
    },
  },
  {
    name: "bento-03",
    title: "Bento 03",
    description: "A flat 3×2 feature grid on thin edge-masked rules — no cards, no fills. Each cell pairs a recessed keycap icon tile with a sans-serif title and monospace description; on hover the tile's inner shadow flips inward and the icon cross-fades from grey to the D2 holographic gradient. Motion-driven, reduced-motion aware.",
    categories: ["bento", "blocks"],
    dependencies: ["lucide-react", "motion"],
  },
  {
    name: "bento-04",
    title: "Bento 04",
    description: "A four-card services bento on marching dashed blueprint frames. Hover blooms each card's icon from blue to the D2 holographic gradient, scrambles the Clean Code snippet from grey to syntax colour, brightens the Web Design screen wash and speeds up the Future Forward brand marquees. Responsive down to mobile — the grid restacks and the card illustrations shift rather than shrink — and below lg, where there is no pointer, a tap plays the hover state for a few seconds instead. GSAP-driven, theme-aware and reduced-motion aware.",
    categories: ["bento", "blocks"],
    dependencies: ["gsap", "@gsap/react"],
  },
  {
    name: "bento-05",
    title: "Bento 05",
    description: "A four-card studio bento on a masked dot field. Each card is a Figma gradient export carrying its own glass fill and 16px border; an ambilight sampled from the artwork blooms behind the grid as the section scrolls through, and the cards rise and brighten on the same switch. The bolt card lights its own grain with a radar ping, the AI card runs five out-of-phase sweeps down its stripes, and the globe card spins a cobe sphere with projected visitor chips. Below lg the section becomes a still picture — no ambilight, no ripple, no sphere — and the artwork is rasterised to a canvas once instead of re-running eighteen SVG blurs per paint; the globe card swaps the sphere for the stat deck it was carrying. Theme-aware and reduced-motion aware throughout.",
    categories: ["bento", "blocks"],
    dependencies: ["cobe@^0.6.4", "motion", "lucide-react"],
  },
  {
    name: "metallic-shimmer",
    title: "Metallic Shimmer",
    description: "Brushed-metal text: a bright band travels across the glyphs like a reflection, not a glow. Wraps any inline content, flips its stops per theme, and holds still under reduced motion.",
    categories: ["text", "blocks"],
    css: {
      "@keyframes d2-metallic-shimmer": {
        "0%, 100%": {
          "background-position": "0% 50%"
        },
        "50%": {
          "background-position": "100% 50%"
        }
      },
      ".d2-metallic-shimmer": {
        "background-size": "200% 100%",
        "animation": "d2-metallic-shimmer 6s ease-in-out infinite"
      },
      "@media (prefers-reduced-motion: reduce)": {
        ".d2-metallic-shimmer": {
          "animation": "none"
        }
      }
    },
  },
  {
    name: "progress-bar",
    title: "Progress Bar",
    description: "A frosted-glass progress pill with technical-drawing leader lines bracketing a monospace readout. Three levels of chrome — full, bar, plain — and two fill styles: a 6px beam or a three-row dot matrix. Every surface property is themeable — fill (solid or gradient), stroke, backdrop blur, drop and inner shadow — with glass and opaque presets shipped for light and dark. All colours resolve to oklch(), and fillFilter dresses the gradient alone so a caller can animate the value without touching the type or the ticks.",
    categories: ["progress", "blocks"],
  },
  {
    name: "button-matt",
    title: "Matte Button",
    description: "A matte chip button with a holographic rim: three blurred glows pinned under the top edge, a bounce light along the bottom, and a gradient-clipped label and mask-painted icon. Four shadcn sizes with the corner curvature held constant, an expo-out hover that lifts the chip and pushes the ink, and a light theme that is the same layer stack with swapped tokens and a multiplied rim. Every custom property is defined on the button, so it needs nothing from the host stylesheet.",
    categories: ["button", "blocks"],
  },
  {
    name: "d2-card",
    title: "D2 Card",
    description: "The card surface pricing-01 is built on: header, content, footer and a title/description pair.",
    categories: ["ui"],
  },
  {
    name: "pixel-spinner",
    title: "Pixel Spinner",
    description: "The pixel-grid spinner engine every spinner preset builds on.",
    categories: ["spinner"],
  },
];

/**
 * Spinner presets from lib/spinner-patterns.ts that ship as installable items.
 * Named rather than taken wholesale: the whole `pro-*` set is sold on
 * pro.d2studio.dev and is only advertised here, so publishing one is a decision
 * rather than a side effect of it existing in the library.
 */
export const PUBLISHED_SPINNERS: string[] = [
  "spiral-in-5",
  "ring-4-cw",
  "dual-ring-5",
  "vortex-in",
  "col-wave-5",
  "swell-roll",
  "rain-4",
  "tide-roll",
  "billboard-tiles",
  "ripple-out",
];

/** The half of the library the browse shelf draws. */
export const SHELVED: BlockDef[] = BLOCK_LIBRARY.filter((b) => b.shelf);

export const findBlock = (name: string): BlockDef | undefined =>
  BLOCK_LIBRARY.find((b) => b.name === name);
