import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Sparkles,
  Package,
  Zap,
  Shield,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeaturedComponents } from "@/components/showcase/featured-components";
import HeroSection2 from "./components/hero-section";
import { Navigation } from "@/components/navigation";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "D2 Studio Component Library",
  description:
    "Premium collection of 50+ copy-and-paste React components built with shadcn/ui, Tailwind CSS, and TypeScript. Beautiful, accessible, and production-ready.",
  url: "https://d2studio.dev",
  author: {
    "@type": "Organization",
    name: "D2 Studio",
  },
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  screenshot: "https://d2studio.dev/og-image.jpg",
};

export default function HomePage() {

  const features = [
    {
      icon: <Code2 className="h-5 w-5" />,
      title: "Copy & Paste",
      description:
        "No packages to install. Just copy and paste components into your project.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Beautifully Designed",
      description:
        "Modern, minimal components designed with attention to detail and usability.",
    },
    {
      icon: <Package className="h-5 w-5" />,
      title: "shadcn Compatible",
      description:
        "Built on shadcn/ui conventions. Works seamlessly with your existing setup.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Production Ready",
      description:
        "Fully typed, accessible, and optimized for performance out of the box.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Open Source",
      description:
        "MIT licensed. Use it in personal and commercial projects without restrictions.",
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      title: "Regular Updates",
      description:
        "New components added weekly. Stay up to date with the latest UI trends.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Background gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" /> */}

      {/* Hero Section */}
      <HeroSection2 />

      {/* Features Section */}
      <section className="max-w-6xl w-full border-x   mx-auto px-4 lg:px-0 ">
        <div className="text-center py-16 lg:py-24 flex flex-col items-center justify-center gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold  font-sans">
            Why Choose D2 Studio Components?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built by developers, for developers. Every component is crafted with
            care and optimized for real-world use.
          </p>
          <Button className="h-12">
            Explore blocks <ArrowUpRight />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 bg-border screen-line-before screen-line-after py-px gap-px max-w-6xl  mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative rounded-none border-0 shadow-none overflow-hidden hover:scale-99 group hover:rounded-lg transition-all"
            >
              <CardContent className="p-6">
                <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Separator Section */}
      <section className="grid grid-rows-[2.5rem_2.5rem_2.5rem] [--pattern-fg:var(--color-black)]/10 dark:bg-background dark:[--pattern-fg:var(--color-white)]/10 ">
        <div className="screen-line-after h-full">
          <div className="max-w-6xl mx-auto border-x h-full"></div>
        </div>
        <div className="w-full border-x min-h-[2.5rem]  screen-line-after  mx-auto border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed">
          <div className="w-full h-[2.5rem] max-w-6xl b border-x mx-auto"></div>
        </div>
        <div className="h-full">
          <div className="max-w-6xl mx-auto border-x h-full"></div>
        </div>
      </section>

      {/* Featured Components with Live Previews */}
      <FeaturedComponents />

      {/* Categories Preview */}
      {/* <section className="container mx-auto px-4 py-20 border-t">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Component Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From forms to layouts, we&apos;ve got everything you need to build
            beautiful interfaces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            "Forms",
            "Layouts",
            "Marketing",
            "E-commerce",
            "Navigation",
            "Display",
            "Feedback",
            "Authentication",
          ].map((category) => (
            <Link
              key={category}
              href={`/components/${category.toLowerCase()}`}
              className="rounded-lg border bg-card p-4 text-center hover:shadow-md hover:border-foreground/20 transition-all"
            >
              <div className="font-medium">{category}</div>
              <div className="text-xs text-muted-foreground mt-1">
                View components →
              </div>
            </Link>
          ))}
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="w-full max-w-6xl border-x mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers using D2 Studio components to build
            amazing products faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/components">
                View All Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8"
              asChild
            >
              <a
                href="https://github.com/d2studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 D2 Studio. Built with ❤️ for the community.
            </div>
            <div className="flex gap-6 text-sm">
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/components"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Components
              </Link>
              <a
                href="https://github.com/d2studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/d2studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
