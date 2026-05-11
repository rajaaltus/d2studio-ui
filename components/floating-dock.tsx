"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Boxes,
  Check,
  ChevronUp,
  Gem,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Tag,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";

type IconComponent = React.ComponentType<{ className?: string }>;

type BlockCategory = {
  name: string;
  slug: string;
  description: string;
  icon: IconComponent;
};

const blockCategories: BlockCategory[] = [
  {
    name: "Hero",
    slug: "hero",
    description: "Landing-page hero sections",
    icon: LayoutTemplate,
  },
  {
    name: "Bento",
    slug: "bento",
    description: "Bento-style grid layouts",
    icon: LayoutGrid,
  },
  {
    name: "AI",
    slug: "ai",
    description: "AI-driven UI patterns",
    icon: Sparkles,
  },
  {
    name: "Mini Components",
    slug: "mini",
    description: "Small reusable pieces",
    icon: Boxes,
  },
  {
    name: "Dashboard",
    slug: "dashboard",
    description: "Admin & analytics layouts",
    icon: LayoutDashboard,
  },
];

type TierOption = {
  value: "all" | "free" | "pro";
  label: string;
  description: string;
  icon: IconComponent;
  dot: string;
};

const tierOptions: TierOption[] = [
  {
    value: "all",
    label: "All",
    description: "Show every block",
    icon: Tag,
    dot: "bg-muted-foreground",
  },
  {
    value: "free",
    label: "Free",
    description: "Free, open-source blocks",
    icon: Tag,
    dot: "bg-emerald-500",
  },
  {
    value: "pro",
    label: "Pro",
    description: "Premium paid blocks",
    icon: Gem,
    dot: "bg-amber-500",
  },
];

function Divider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px bg-border/70" />;
}

function PricingDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tier");
  const current: TierOption["value"] =
    raw === "free" || raw === "pro" ? raw : "all";
  const currentOption =
    tierOptions.find((t) => t.value === current) ?? tierOptions[0];

  const setTier = (next: TierOption["value"]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") params.delete("tier");
    else params.set("tier", next);
    const query = params.toString();
    router.push(query ? `/blocks?${query}` : "/blocks");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <span
            aria-hidden
            className={`inline-flex h-1.5 w-1.5 rounded-full ${currentOption.dot} shadow-[0_0_8px_currentColor]`}
          />
          {currentOption.label === "All" ? "Pricing" : currentOption.label}
          <ChevronUp className="h-3.5 w-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={12}
        className="w-60 rounded-2xl border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
      >
        <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing
        </div>
        <div className="grid gap-0.5">
          {tierOptions.map((t) => {
            const Icon = t.icon;
            const active = t.value === current;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTier(t.value)}
                className={`group flex items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
                  active ? "bg-muted" : "hover:bg-muted"
                }`}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground/80">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-medium leading-tight text-foreground">
                    {t.label}
                  </span>
                  <span className="text-xs leading-tight text-muted-foreground">
                    {t.description}
                  </span>
                </span>
                {active && (
                  <Check
                    className="h-4 w-4 text-foreground"
                    aria-label="Selected"
                  />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DockInner() {
  const pathname = usePathname() ?? "";
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  if (pathname.startsWith("/preview") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <nav
        aria-label="Quick navigation"
        className="pointer-events-auto flex h-12 items-center gap-1 rounded-full border border-border/60 bg-background/70 px-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35),0_4px_12px_-4px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60 dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      >
        {/* Blocks dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
            >
              <span
                aria-hidden
                className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_currentColor]"
              />
              Blocks
              <ChevronUp className="h-3.5 w-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={12}
            className="w-72 rounded-2xl border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
          >
            <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </div>
            <div className="grid gap-0.5">
              {blockCategories.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.slug}
                    href={`/blocks?category=${c.slug}`}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground/80 transition-colors group-hover:text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium leading-tight text-foreground">
                        {c.name}
                      </span>
                      <span className="text-xs leading-tight text-muted-foreground">
                        {c.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Divider />

        <PricingDropdown />

        <Divider />

        {/* Illustrations */}
        <Link
          href="/illustrations"
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          <Palette className="h-4 w-4 opacity-70" />
          Illustrations
        </Link>

        <Divider />

        {/* Theme toggle (last) */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
          suppressHydrationWarning
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          {mounted ? (
            <>
              <Sun
                suppressHydrationWarning
                className={`h-4 w-4 transition-all duration-300 ${
                  isDark
                    ? "scale-0 -rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              />
              <Moon
                suppressHydrationWarning
                className={`absolute h-4 w-4 transition-all duration-300 ${
                  isDark
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-0 rotate-90 opacity-0"
                }`}
              />
            </>
          ) : null}
        </button>
      </nav>
    </div>
  );
}

export function FloatingDock() {
  return (
    <React.Suspense fallback={null}>
      <DockInner />
    </React.Suspense>
  );
}
