"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Coffee } from "lucide-react";
import Link from "next/link";
import Logo from "./logo";

export function Navigation() {
  const navigation = [
    { name: "Blocks", href: "/blocks" },
    { name: "Spinners", href: "/spinners", badge: "New" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="w-full max-w-6xl border-x mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Logo />

          {/* Navigation links */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
                {item.badge && (
                  <span className="relative inline-flex items-center overflow-hidden rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-[0_0_12px_oklch(0.7_0.2_255/0.5)]">
                    <span className="relative z-10">{item.badge}</span>
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shimmer_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://buymeacoffee.com/godwindev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy me a coffee"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#ffdd00] px-2.5 py-1.5 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              <Coffee size={14} />
              <span>Buy me a coffee</span>
            </a>

            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
