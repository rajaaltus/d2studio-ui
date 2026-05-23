"use client";

import Image from "next/image";
import Link from "next/link";
import { MetalButtonSlide } from "@/components/metal-button-slide";
import { FeaturedComponents } from "@/components/showcase/featured-components";
import { Navigation } from "@/components/navigation";
import HeroSection2 from "@/components/hero-section";
import { SiteFooter } from "@/components/site-footer";
import { CommunitySection } from "@/components/community-section";
import { PixelIconCmd } from "@/components/pixel-icon-cmd";
import { PixelIconChevron } from "@/components/pixel-icon-chevron";
import { PixelIconRocket } from "@/components/pixel-icon-rocket";
import CodeIcon from "@/components/icons/code-icon";
import { CosmoMorph } from "@/components/cosma/cosmo-morph";
import { SpinnerMorph } from "@/components/spinners/spinner-morph";

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
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />
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
      <section className="max-w-6xl w-full border-x mx-auto  lg:px-0 bg-border">
        <CosmoMorph />

        <div className="flex flex-col gap-px bg-border lg:rounded-xl border overflow-hidden m-0">
          <div className="flex items-center justify-center bg-[#ffffff] dark:bg-[#000000] min-h-[160px] sm:min-h-[224px] lg:min-h-[294px] overflow-hidden px-3 sm:px-6 gap-2 sm:gap-10 md:gap-16 lg:gap-24 md:[mask-image:linear-gradient(to_right,rgba(0,0,0,0.6),black_10%,black_90%,rgba(0,0,0,0.6))] md:dark:[mask-image:linear-gradient(to_right,rgba(0,0,0,0.3),black_10%,black_90%,rgba(0,0,0,0.3))]">
            <IsoCodeIcon />
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
                <div className="size-8 flex items-center justify-center">
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

      {/* Pixel Spinner Section */}
      <section className="max-w-6xl w-full border-x mx-auto lg:px-0 bg-border">
        <SpinnerMorph />
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

      {/* Community Section */}
      <CommunitySection />

      {/* CTA Section */}
      <section className="max-w-6xl w-full border-x mx-auto  lg:px-0 bg-border">
        <div className="lg:rounded-xl border m-0 bg-background py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-12 py-6 md:py-0 md:pr-10 lg:pr-16 md:border-r md:border-dashed md:border-border">
            <IsoIcon
              src="/Heart Icon 2.svg"
              label="Heart Icon 2"
              mobileSide="left"
            />
            <PixelIconRocket />
            <IsoIcon
              src="/Close Fullscreen Icon 4.svg"
              label="Close Fullscreen Icon 4"
              mobileSide="right"
            />
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left px-6 md:pl-16 lg:pl-20 md:pr-6 gap-3 max-w-xl">
            <h2 className="text-xl md:text-2xl font-medium">
              Start Building Today
            </h2>
            <p className="text-sm text-muted-foreground">
              Join thousands of developers using D2 Studio components to build
              amazing products faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <MetalButtonSlide href="/blocks">
                View All Components
              </MetalButtonSlide>
            </div>
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

  return (
    <div
      className={`shrink-0 opacity-80 brightness-150 dark:brightness-80 ${visibility}`.trim()}
    >
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

function IsoCodeIcon() {
  return (
    <div className="shrink-0 hidden sm:block text-[#71717a] opacity-80 brightness-150 dark:brightness-100">
      <CodeIcon className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] lg:w-[125px] lg:h-[125px]" />
    </div>
  );
}

function CenterPixelIcon() {
  return (
    <div className="group shrink-0 w-[96px] h-[96px] sm:w-[72px] sm:h-[72px] md:w-[96px] md:h-[96px] lg:w-[125px] lg:h-[125px] flex items-center justify-center">
      <div className="origin-center scale-[0.768] sm:scale-[0.576] md:scale-[0.768] lg:scale-100 brightness-110 dark:brightness-100">
        <PixelIconCmd />
      </div>
    </div>
  );
}
