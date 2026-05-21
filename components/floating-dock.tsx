"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronUp,
  Gem,
  MoonStar,
  Sun,
  Tag,
} from "lucide-react";
import { PixelIconSpinnerPattern1 } from "@/components/pixel-icon-spinner/pattern-1";
import { PixelIconSpinnerStarsFall } from "@/components/pixel-icon-spinner/stars-fall";
import { PixelIconSpinnerTools } from "@/components/pixel-icon-spinner/tools";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { NavIcons } from "@/components/ui/nav-icons";
import { PixelIconSpinnerPricing } from "@/components/pixel-icon-spinner/pricing";

type IconComponent = React.ComponentType<{ className?: string }>;

type BlockCategory = {
  name: string;
  slug: string;
  description: string;
  icon: IconComponent;
};

type ToolItem = {
  name: string;
  href: string;
  description: string;
  icon: IconComponent;
  tag?: { label: string; tone: "new" | "updated" };
};

const toolItems: ToolItem[] = [
  {
    name: "Spinners",
    href: "/spinners",
    description: "Pixel glow loaders",
    icon: PixelIconSpinnerPattern1,
    tag: { label: "Updated", tone: "updated" },
  },
  {
    name: "Cosma",
    href: "/cosma",
    description: "Cosma",
    icon: PixelIconSpinnerStarsFall,
    tag: { label: "New", tone: "new" },
  },
];

const tagToneClasses: Record<"new" | "updated", string> = {
  new: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  updated: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

const blockCategories: BlockCategory[] = [
  {
    name: "All",
    slug: "all",
    description: "Browse every block",
    icon: NavIcons.blockicon,
  },
  {
    name: "Hero",
    slug: "hero",
    description: "Landing-page hero sections",
    icon: NavIcons.heroicon,
  },
  {
    name: "AI components",
    slug: "ai-components",
    description: "AI-driven UI patterns",
    icon: NavIcons.aiicon,
  },
  {
    name: "Blocks",
    slug: "blocks",
    description: "General-purpose UI blocks",
    icon: NavIcons.blocksicon,
  },
  {
    name: "Bento",
    slug: "bento",
    description: "Bento-style grid layouts",
    icon: NavIcons.bentoicon,
  },
  {
    name: "Dashboard",
    slug: "dashboard",
    description: "Admin & analytics layouts",
    icon: NavIcons.dashboardicon,
  },
];

type TierValue = "free" | "pro";

type TierOption = {
  value: TierValue;
  label: string;
  description: string;
  icon: IconComponent;
  dot: string;
};

const tierOptions: TierOption[] = [
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
  const [open, setOpen] = React.useState(false);
  const raw = searchParams.get("tier");
  const current: TierValue = raw === "pro" ? "pro" : "free";
  const currentOption =
    tierOptions.find((t) => t.value === current) ?? tierOptions[0];

  const setTier = (next: TierValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tier", next);
    router.push(`/blocks?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
        >
          <span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center"
          >
            {current === "free" ? (
              <PixelIconSpinnerPricing />
            ) : (
              <span
                className={`inline-flex h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor] ${currentOption.dot}`}
              />
            )}
          </span>
          <span className="grid">
            <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
              Pricing
            </span>
            <span className="col-start-1 row-start-1 whitespace-nowrap">
              {currentOption.label}
            </span>
          </span>
          <ChevronUp className="inline-block h-3.5 w-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={12}
        className="w-[min(15rem,calc(100vw-1.5rem))] rounded-2xl border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
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
                  {t.value === "free" ? (
                    <PixelIconSpinnerPricing />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
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
  const searchParams = useSearchParams();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;

  const isOnBlocksPage = pathname.startsWith("/blocks");
  const activeCategorySlug = isOnBlocksPage
    ? (searchParams.get("type") ?? "all")
    : null;
  const activeCategory = activeCategorySlug
    ? blockCategories.find((c) => c.slug === activeCategorySlug)
    : undefined;
  const BlocksTriggerIcon = activeCategory?.icon ?? NavIcons.blockicon;
  const blocksTriggerLabel = activeCategory?.name ?? "Blocks";
  const longestBlocksLabel = React.useMemo(
    () =>
      blockCategories.reduce(
        (longest, c) => (c.name.length > longest.length ? c.name : longest),
        "Blocks",
      ),
    [],
  );
  const [blocksOpen, setBlocksOpen] = React.useState(false);
  const [toolsOpen, setToolsOpen] = React.useState(false);

  const activeTool = toolItems.find((t) => pathname.startsWith(t.href));
  const ToolsTriggerIcon = activeTool?.icon ?? PixelIconSpinnerTools;
  const toolsTriggerLabel = activeTool?.name ?? "Tools";
  const longestToolsLabel = React.useMemo(
    () =>
      toolItems.reduce(
        (longest, t) => (t.name.length > longest.length ? t.name : longest),
        "Tools",
      ),
    [],
  );

  if (
    pathname.startsWith("/preview") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login")
  ) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <nav
        aria-label="Quick navigation"
        className="pointer-events-auto flex h-12 items-center gap-1 rounded-full border border-border/60 bg-background px-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35),0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      >
        {/* Blocks dropdown */}
        <Popover open={blocksOpen} onOpenChange={setBlocksOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
            >
              <span
                aria-hidden
                className="hidden h-5 w-5 items-center justify-center md:inline-flex"
              >
                <BlocksTriggerIcon className="h-4 w-4" />
              </span>
              <span className="grid">
                <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
                  {longestBlocksLabel}
                </span>
                <span className="col-start-1 row-start-1 whitespace-nowrap">
                  {blocksTriggerLabel}
                </span>
              </span>
              <ChevronUp className="inline-block h-3.5 w-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={12}
            className="w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
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
                    href={c.slug === "all" ? "/blocks" : `/blocks?type=${c.slug}`}
                    onClick={() => setBlocksOpen(false)}
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

        {/* Tools dropdown */}
        <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="group inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
            >
              <span
                aria-hidden
                className="hidden h-5 w-5 items-center justify-center md:inline-flex"
              >
                <ToolsTriggerIcon className="h-4 w-4" />
              </span>
              <span className="grid">
                <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
                  {longestToolsLabel}
                </span>
                <span className="col-start-1 row-start-1 whitespace-nowrap">
                  {toolsTriggerLabel}
                </span>
              </span>
              <span
                className={cn(
                  "relative inline-flex h-[18px] items-center overflow-hidden rounded-full border px-1.5 text-[9px] font-semibold uppercase tracking-wider",
                  tagToneClasses.new,
                )}
              >
                <span className="relative z-10">New</span>
              </span>
              <ChevronUp className="inline-block h-3.5 w-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl"
          >
            <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tools
            </div>
            <div className="grid gap-0.5">
              {toolItems.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setToolsOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-background text-foreground/80 transition-colors group-hover:text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium leading-tight text-foreground">
                        {t.name}
                      </span>
                      <span className="text-xs leading-tight text-muted-foreground">
                        {t.description}
                      </span>
                    </span>
                    {t.tag && (
                      <span
                        className={cn(
                          "ml-auto inline-flex h-[18px] items-center rounded-full border px-1.5 text-[9px] font-semibold uppercase tracking-wider",
                          tagToneClasses[t.tag.tone],
                        )}
                      >
                        {t.tag.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

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
            isDark ? (
              <MoonStar className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )
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
