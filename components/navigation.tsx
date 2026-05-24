"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Coffee, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";
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
};

const NAV_ITEMS: NavItem[] = [
  { name: "Blocks", href: "/blocks" },
  { name: "Spinners", href: "/spinners", badge: "Updated", badgeTone: "blue" },
  { name: "Cosmo", href: "/cosma", badge: "New", badgeTone: "green" },
  { name: "Docs", href: "/docs" },
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

export function Navigation() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="w-full max-w-6xl border-x mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6 md:gap-8">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
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

            <ThemeToggle />

            {/* Mobile menu trigger */}
            <Drawer open={open} onOpenChange={setOpen} direction="right">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="md:hidden">
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
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
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
