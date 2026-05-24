"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Gem,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  Loader2,
  Monitor,
  Moon,
  ScrollText,
  Sparkles,
  Sun,
  Tag,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "@/components/theme-provider";

type IconComponent = React.ComponentType<{ className?: string }>;

type PageEntry = {
  label: string;
  href: string;
  description?: string;
  icon: IconComponent;
};

type CategoryEntry = {
  label: string;
  slug: string;
  description: string;
  icon: IconComponent;
};

type TierEntry = {
  label: string;
  value: "all" | "free" | "pro";
  description: string;
  icon: IconComponent;
};

const PAGES: PageEntry[] = [
  { label: "Home", href: "/", icon: Home, description: "Landing page" },
  {
    label: "Blocks",
    href: "/blocks",
    icon: LayoutTemplate,
    description: "Browse all blocks",
  },
  {
    label: "Spinners",
    href: "/spinners",
    icon: Loader2,
    description: "Pixel glow loaders",
  },
  {
    label: "Docs",
    href: "/docs",
    icon: ScrollText,
    description: "Documentation",
  },
  {
    label: "Cosmo",
    href: "/cosmo",
    icon: Sparkles,
    description: "Cosmo",
  },
];

const CATEGORIES: CategoryEntry[] = [
  {
    label: "Hero",
    slug: "hero",
    icon: LayoutTemplate,
    description: "Landing-page hero sections",
  },
  {
    label: "Bento",
    slug: "bento",
    icon: LayoutGrid,
    description: "Bento-style grid layouts",
  },
  {
    label: "AI",
    slug: "ai",
    icon: Sparkles,
    description: "AI-driven UI patterns",
  },
  {
    label: "Mini Components",
    slug: "mini",
    icon: Boxes,
    description: "Small reusable pieces",
  },
  {
    label: "Dashboard",
    slug: "dashboard",
    icon: LayoutDashboard,
    description: "Admin & analytics layouts",
  },
];

const TIERS: TierEntry[] = [
  {
    label: "All blocks",
    value: "all",
    icon: Tag,
    description: "Free + premium",
  },
  {
    label: "Free blocks",
    value: "free",
    icon: Tag,
    description: "Open-source blocks",
  },
  {
    label: "Pro blocks",
    value: "pro",
    icon: Gem,
    description: "Premium paid blocks",
  },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isPaletteShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isPaletteShortcut) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable =
        target?.isContentEditable ||
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT";
      // ⌘K should always open the palette, even from inputs.
      if (isEditable && !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      setOpen((prev) => !prev);
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    // Defer so the dialog can begin closing before navigation.
    requestAnimationFrame(fn);
  }, []);

  const goTo = (href: string) => run(() => router.push(href));
  const goToTier = (tier: TierEntry["value"]) =>
    run(() => router.push(tier === "all" ? "/blocks" : `/blocks?tier=${tier}`));
  const goToCategory = (slug: string) =>
    run(() => router.push(`/blocks?category=${slug}`));

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search pages, categories, and actions"
      className="max-w-xl sm:max-w-2xl"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <CommandItem
                key={page.href}
                value={`${page.label} ${page.description ?? ""}`}
                onSelect={() => goTo(page.href)}
              >
                <Icon className="text-muted-foreground" />
                <span className="flex flex-col">
                  <span>{page.label}</span>
                  {page.description && (
                    <span className="text-xs text-muted-foreground">
                      {page.description}
                    </span>
                  )}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Block categories">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <CommandItem
                key={cat.slug}
                value={`category ${cat.label} ${cat.description}`}
                onSelect={() => goToCategory(cat.slug)}
              >
                <Icon className="text-muted-foreground" />
                <span className="flex flex-col">
                  <span>{cat.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {cat.description}
                  </span>
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Filter blocks">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <CommandItem
                key={tier.value}
                value={`filter ${tier.label} ${tier.description}`}
                onSelect={() => goToTier(tier.value)}
              >
                <Icon className="text-muted-foreground" />
                <span className="flex flex-col">
                  <span>{tier.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {tier.description}
                  </span>
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem
            value="theme light"
            onSelect={() => run(() => setTheme("light"))}
          >
            <Sun className="text-muted-foreground" />
            <span>Light mode</span>
          </CommandItem>
          <CommandItem
            value="theme dark"
            onSelect={() => run(() => setTheme("dark"))}
          >
            <Moon className="text-muted-foreground" />
            <span>Dark mode</span>
          </CommandItem>
          <CommandItem
            value="theme system"
            onSelect={() => run(() => setTheme("system"))}
          >
            <Monitor className="text-muted-foreground" />
            <span>System theme</span>
            <CommandShortcut>auto</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
