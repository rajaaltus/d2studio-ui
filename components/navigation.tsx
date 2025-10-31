"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/registry/default/ui/button";
import { Card } from "@/registry/default/ui/card";
import { Code2, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./logo";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Blocks", href: "/blocks" },
    { name: "Docs", href: "/docs" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="max-w-6xl border-x mx-auto px-4 w-full">
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
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
