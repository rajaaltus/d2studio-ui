"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { brandData } from "./brand-data";
import GoldenRatioSpiral from "./golden-ratio-spiral";
import { BoltTvIcon } from "./icons/bolt-tv-icon";
import { MetalButtonSlide } from "./metal-button-slide";

const HeroSection2 = () => {
  const docsRef = React.useRef<HTMLAnchorElement>(null);
  return (
    <div className="w-full mx-auto h-full [--pattern-fg:var(--color-black)]/10 dark:bg-background dark:[--pattern-fg:var(--color-white)]/10 overflow-x-hidden">
      {/* 8x7 Grid Container with max-w-6xl */}
      <div className="w-full border-x min-h-[2.5rem] h-full screen-line-after mx-auto">
        <div className="w-full h-[2.5rem] max-w-6xl border-x mx-auto"></div>
      </div>
      <div className="max-w-6xl  border-x min-h-[20rem] h-full screen-line-after mx-auto relative bg-border">
        {/* <GoldenRatioSpiral
          opacity={0.2}
          className="w-auto h-full text-blue-500 absolute left-1/2 -translate-x-1/2 -rotate-90"
        /> */}
        <div className="grid grid-cols-[1fr_auto_1fr] w-full h-full grid-rows-[auto_auto_auto] gap-px bg-border lg:rounded-xl border overflow-hidden m-0">
          <div className="col-start-1 row-start-1 bg-background rounded-r-xl"></div>
          <div className="col-start-1 row-start-2 bg-background rounded-r-xl"></div>
          <div className="col-start-1 row-start-3 bg-background rounded-r-xl"></div>
          <div className="z-10 col-start-2 row-start-1 lg:min-w-3xl  flex flex-col items-center justify-center gap-2 px-4 py-10 sm:p-8 lg:p-14 bg-background h-full relative lg:rounded-xl">
            <div className="rounded-full inline-flex justify-center gap-2 items-center border py-1 px-4 shadow-sm">
              <BoltTvIcon aria-label="New blocks" />
              <span className="text-sm font-medium text-muted-foreground">
                New Blocks & Tools Every Weekend
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl tracking-tighter font-sans lg:text-5xl py-2 font-semibold text-center">
              Modern Components For
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold pb-4 text-center">
              Designers & Developers
            </h2>
            <p className="max-w-lg text-center font-mono text-sm md:text-base px-4">
              A premium Collection of copy and paste components built with
              React, TailWind CSS, & Shadcn/UI. Beautiful, accessible, and ready
              for production.
            </p>
          </div>
          <div className="col-start-2 row-start-2 min-h-[5rem]  h-full relative z-0 bg-background lg:rounded-xl">
            <div className="flex h-full gap-4 w-1/2 sm:w-full max-w-xs sm:max-w-none items-stretch mx-auto p-4 md:p-0 justify-center flex-col sm:flex-row sm:items-center">
              <MetalButtonSlide href="/blocks" reflectionTargets={[docsRef]}>
                Explore Blocks
              </MetalButtonSlide>
              <Button
                variant="outline"
                className="h-11 w-full sm:w-auto px-5"
                asChild
              >
                <Link ref={docsRef} href="/docs">
                  Documentation
                </Link>
              </Button>
            </div>
          </div>

          <div className="col-start-2 row-start-3 min-h-[8rem] lg:min-w-3xl w-full h-full flex flex-col items-center justify-center bg-background lg:rounded-xl">
            <div className="max-w-sm flex -space-x-3 ">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <div
                  className="w-12 h-12 rounded-full hover:-translate-y-1 duration-200 border bg-background flex items-center justify-center text-sm font-medium text-muted-foreground/50"
                  key={index}
                >
                  <span>{["A", "D", "R", "G", "99+"][index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-start-3 row-start-1 bg-background rounded-l-xl"></div>
          <div className="col-start-3 row-start-2 bg-background rounded-l-xl"></div>
          <div className="col-start-3 row-start-3 bg-background rounded-l-xl"></div>
        </div>
      </div>

      <div className="w-full border-x min-h-[2.5rem] screen-line-after mx-auto">
        <div className="w-full h-[2.5rem] max-w-6xl border-x mx-auto flex items-center justify-center">
          <h2 className="text-sm">Greatly inspired from</h2>
        </div>
      </div>

      <BrandShowcase />
    </div>
  );
};

function BrandShowcase() {
  const SET_SIZE = 6;
  const sets = React.useMemo(() => {
    const chunks: (typeof brandData)[] = [];
    for (let i = 0; i < brandData.length; i += SET_SIZE) {
      chunks.push(brandData.slice(i, i + SET_SIZE));
    }
    return chunks.filter((chunk) => chunk.length > 0);
  }, []);

  const [activeSet, setActiveSet] = React.useState(0);

  React.useEffect(() => {
    if (sets.length <= 1) return;
    const id = setInterval(() => {
      setActiveSet((s) => (s + 1) % sets.length);
    }, 3200);
    return () => clearInterval(id);
  }, [sets.length]);

  const currentSet = sets[activeSet] ?? [];

  return (
    <div className="relative w-full max-w-6xl  border-x min-h-[7.5rem] h-full mx-auto bg-border">
      {sets.map((set, setIndex) => {
        const isActive = setIndex === activeSet;
        return (
          <div
            key={setIndex}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 bg-border gap-px transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] lg:rounded-xl border m-0 overflow-hidden",
              isActive
                ? "opacity-100 scale-100 blur-0"
                : "opacity-0 scale-[0.985] blur-[2px] pointer-events-none"
            )}
          >
            {set.map((brand, index) => {
              const IconComponent = brand.icon;
              return (
                <div
                  key={index}
                  className="relative group w-full duration-200 hover:bg-accent bg-background h-full min-h-[7.5rem] flex items-center justify-center"
                >
                  <IconComponent
                    className={`w-auto max-w-[7rem] mx-auto group-hover:scale-95 duration-200 dark:brightness-200 ${
                      brand.name === "Vercel"
                        ? "h-3.5"
                        : brand.name === "Next.js"
                          ? "h-6"
                          : "h-5"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default HeroSection2;

export function GoldenRatioHero() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
      <GoldenRatioSpiral />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6 text-center">
          Golden Ratio Design
        </h1>
        <p className="text-xl md:text-2xl text-amber-800 text-center max-w-2xl mb-8">
          Nature&apos;s perfect proportion, now in your design
        </p>
        <Button className="px-8 py-4 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors shadow-lg">
          Get Started
        </Button>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
    </div>
  );
}