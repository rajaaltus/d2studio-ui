"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedComponents } from "@/components/showcase/featured-components";
import { Navigation } from "@/components/navigation";
import HeroSection2 from "@/components/hero-section";
import { SiteFooter } from "@/components/site-footer";
import { PixelIconCmd } from "@/components/pixel-icon-cmd";
import { PixelIconChevron } from "@/components/pixel-icon-chevron";

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
  const features: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[] = [
    {
      title: "Copy & Paste",
      description:
        "No packages to install. Just copy and paste components into your project.",
      icon: <PixelIconChevron />,
    },
    {
      title: "Regular Updates",
      description:
        "New components added weekly. Stay up to date with the latest UI trends.",
      icon: <PixelIconChevron />,
    },
    {
      title: "Production Ready",
      description:
        "Fully typed, accessible, and optimized for performance out of the box.",
      icon: <PixelIconChevron />,
    },
    {
      title: "shadcn Compatible",
      description:
        "Built on shadcn/ui conventions. Works seamlessly with your existing setup.",
      icon: <PixelIconChevron />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">
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
      <section className="max-w-6xl w-full border-x mx-auto px-4 lg:px-0 bg-border">
        <div className="text-center py-16 lg:py-24 flex flex-col items-center justify-center gap-6 rounded-xl border m-0 bg-background">
          <h3 className="text-xl md:text-2xl font-medium font-sans">
            Copy. Paste. Ship.
          </h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Production-ready components built on shadcn/ui. No package install,
            no abstraction — just code you own.
          </p>
          <Button className="h-11" asChild>
            <Link href="/blocks">
              Browse components <ArrowUpRight />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-px bg-border rounded-xl border overflow-hidden m-0">
          <div className="flex items-center justify-center bg-[#000000] min-h-[160px] sm:min-h-[224px] lg:min-h-[294px] overflow-hidden px-3 sm:px-6 gap-2 sm:gap-10 md:gap-16 lg:gap-24 md:[mask-image:linear-gradient(to_right,rgba(0,0,0,0.5),black_10%,black_90%,rgba(0,0,0,0.5))]">
            <IsoIcon src="/Cozy Icon 6.svg" label="Cozy Icon 6" />
            <IsoIcon src="/Heart Icon 2.svg" label="Heart Icon 2" mobileSide="left" />
            <CenterPixelIcon />
            <IsoIcon src="/Isocons Rocket 2.svg" label="Isocons Rocket 2" mobileSide="right" />
            <IsoIcon src="/Close Fullscreen Icon 4.svg" label="Close Fullscreen ..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background p-5 lg:p-6 flex flex-col gap-2"
              >
                <div className="size-5 flex items-center justify-center">
                  {feature.icon ?? (
                    <div className="size-5 rounded-sm bg-foreground/10" />
                  )}
                </div>
                <h3 className="font-semibold text-sm font-sans">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
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
              <Link href="/blocks">
                View All Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function IsoIcon({
  src,
  label,
  mobileSide,
}: {
  src: string;
  label: string;
  mobileSide?: "left" | "right";
}) {
  const visibility = mobileSide ? "" : "hidden sm:block";
  const mask =
    mobileSide === "left"
      ? "[mask-image:linear-gradient(to_right,transparent,black_70%)] sm:[mask-image:none]"
      : mobileSide === "right"
        ? "[mask-image:linear-gradient(to_left,transparent,black_70%)] sm:[mask-image:none]"
        : "";

  return (
    <div className={`shrink-0 opacity-80 ${visibility} ${mask}`.trim()}>
      <Image
        src={src}
        alt={label}
        width={125}
        height={125}
        className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] lg:w-[125px] lg:h-[125px]"
      />
    </div>
  );
}

function CenterPixelIcon() {
  return (
    <div className="shrink-0 w-[96px] h-[96px] sm:w-[72px] sm:h-[72px] md:w-[96px] md:h-[96px] lg:w-[125px] lg:h-[125px] flex items-center justify-center">
      <div className="origin-center scale-[0.768] sm:scale-[0.576] md:scale-[0.768] lg:scale-100">
        <PixelIconCmd />
      </div>
    </div>
  );
}
