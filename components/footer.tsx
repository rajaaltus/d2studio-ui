"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Twitter, ArrowUpRight } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Product: [
      { name: "Components", href: "/components" },
      { name: "Documentation", href: "/docs" },
      { name: "Examples", href: "/examples" },
      { name: "Registry", href: "/registry" },
    ],
    Resources: [
      { name: "GitHub", href: "https://github.com", external: true },
      { name: "Changelog", href: "/changelog" },
      { name: "Contributing", href: "/contributing" },
      { name: "License", href: "/license" },
    ],
    Community: [
      { name: "Discord", href: "https://discord.gg", external: true },
      { name: "Twitter", href: "https://twitter.com", external: true },
      { name: "Blog", href: "/blog" },
      { name: "Newsletter", href: "/newsletter" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">

          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-bold text-xl">
                <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center rounded-md text-sm">
                  D2
                </div>
                <span>Studio</span>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Ultra modern, monospace-first component library built for developers who value
                precision and clarity. Copy, paste, and customize components to build faster.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2 px-0">
                  <Github size={16} />
                  GitHub
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 px-0">
                  <Twitter size={16} />
                  Twitter
                </Button>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Stay Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when we release new components and features.
                </p>
              </div>
              <Card className="p-4 bg-card/30 border-border/50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                    Subscribe
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-medium text-sm">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                        {...(link && { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {link.name}
                        {link && <ArrowUpRight size={12} />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              © 2025 D2 Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4 sm:mt-0">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Build Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/60 font-mono">
              Built with Next.js • shadcn/ui • Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}