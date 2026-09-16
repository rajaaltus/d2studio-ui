"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowUpRight, Coffee, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { PRO_LINK_PROPS, proShelfHref } from "@/lib/pro";
import { GITHUB_REPO_URL } from "@/lib/site";
import { GitHubIcon } from "@/components/icons/github-icon";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type BadgeTone = "orange" | "green" | "blue";

type NavItem = {
  name: string;
  href: string;
  badge?: string;
  badgeTone?: BadgeTone;
  /** Off this site, in a new tab — pro.d2studio.dev. */
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { name: "Blocks", href: "/blocks" },
  // badges hidden for now — restore by putting back badge/badgeTone
  { name: "Components", href: "/components" },
  { name: "Illustrations", href: "/illustration" },
  { name: "Templates", href: "/templates" },
  { name: "Spinners", href: "/spinners" },
  { name: "Cosmo", href: "/cosmo" },
  { name: "Docs", href: "/docs" },
  { name: "Pro", href: proShelfHref("/blocks", "nav"), external: true },
];

const BADGE_TONES: Record<BadgeTone, string> = {
  orange:
    "bg-orange-500 text-white shadow-[0_0_12px_oklch(0.7_0.2_255/0.5)]",
  green:
    "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blue: "border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

function Badge({ label, tone = "orange" }: { label: string; tone?: BadgeTone }) {
  return (
    <span
      className={`relative inline-flex items-center overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${BADGE_TONES[tone]}`}
    >
      <span className="relative z-10">{label}</span>
      <span
        aria-hidden
        className="animate-badge-shimmer pointer-events-none absolute inset-y-0 -inset-x-2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />
    </span>
  );
}

// /illustration must not light up for /illustrations, and / must not light up
// for everything — so a prefix match is only right when it stops at a segment.
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-border bg-background">
      <nav className="w-full max-w-7xl border-x mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {NAV_ITEMS.map((item) => {
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    {...PRO_LINK_PROPS}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: "var(--d2-flash-gradient)" }}
                    >
                      {item.name}
                    </span>
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-px" />
                  </a>
                );
              }
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <Badge label={item.badge} tone={item.badgeTone} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://buymeacoffee.com/godwindev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy me a coffee"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#ffdd00] px-2.5 py-1.5 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              <Coffee size={14} />
              <span>Buy me a coffee</span>
            </a>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="D2 Studio on GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/80 transition-[color,background-color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>

            <ThemeToggle />

            {/* Mobile menu trigger */}
            <Drawer open={open} onOpenChange={setOpen} direction="right">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="lg:hidden">
                <DrawerHeader className="flex flex-row items-center justify-between text-left">
                  <div className="flex flex-col gap-0.5">
                    <DrawerTitle>Menu</DrawerTitle>
                    <DrawerDescription className="text-xs">
                      Browse D2 Studio
                    </DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DrawerClose>
                </DrawerHeader>
                <div className="flex flex-col gap-1 p-4 pt-0">
                  {NAV_ITEMS.map((item) => {
                    if (item.external) {
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          {...PRO_LINK_PROPS}
                          className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground/80"
                        >
                          <span
                            className="bg-clip-text font-semibold text-transparent"
                            style={{ backgroundImage: "var(--d2-flash-gradient)" }}
                          >
                            D2 {item.name}
                          </span>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </a>
                      );
                    }
                    const active = isActive(pathname, item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-muted text-foreground"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <Badge label={item.badge} tone={item.badgeTone} />
                          )}
                        </span>
                        {active && (
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 rounded-full bg-foreground"
                          />
                        )}
                      </Link>
                    );
                  })}

                  <div className="my-3 h-px bg-border/60" />

                  <a
                    href="https://buymeacoffee.com/godwindev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#ffdd00] px-3 py-3 text-sm font-semibold text-black"
                  >
                    <Coffee size={16} />
                    Buy me a coffee
                  </a>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </nav>
    </header>
  );
}
