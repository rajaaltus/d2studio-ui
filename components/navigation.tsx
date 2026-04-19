"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { Code2, Coffee, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./logo";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Blocks", href: "/blocks" },
    { name: "Spinners", href: "/spinners", badge: "New" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="w-full max-w-6xl border-x mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {/* <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center rounded-md text-sm">
              D2
            </div>
            <span>Studio</span>
          </Link> */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#ffdd00] px-2.5 py-1.5 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              <Coffee size={14} />
              Buy me a coffee
            </a>

            <ThemeToggle />

            <Button
              size="sm"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <Code2 size={16} />
              <span className="hidden sm:inline">Get Started</span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <Card className="m-4 p-4 bg-card border-border">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="inline-flex items-center rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Github size={16} />
                    GitHub
                  </Button>
                  <ThemeToggle />
                </div>
              </div>
            </Card>
          </div>
        )}
      </nav>
    </header>
  );
}
