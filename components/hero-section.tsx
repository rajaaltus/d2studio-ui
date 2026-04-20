"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { brandData } from "./brand-data";
import GoldenRatioSpiral from "./golden-ratio-spiral";

const HeroSection2 = () => {
  return (
    <div className="w-full mx-auto h-full [--pattern-fg:var(--color-black)]/10 dark:bg-background dark:[--pattern-fg:var(--color-white)]/10 overflow-x-hidden">
      {/* 8x7 Grid Container with max-w-6xl */}
      <div className=" w-full border-x min-h-[2.5rem] h-full  screen-line-after  mx-auto border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed">
        <div className="w-full h-[2.5rem] max-w-6xl b border-x mx-auto"></div>
      </div>
      <div className="max-w-6xl  border-x min-h-[20rem] h-full screen-line-after mx-auto relative">
        {/* <GoldenRatioSpiral
          opacity={0.2}
          className="w-auto h-full text-blue-500 absolute left-1/2 -translate-x-1/2 -rotate-90"
        /> */}
        <div className="grid grid-cols-[1fr_auto_1fr] w-full h-full grid-rows-[auto_auto_auto]">
          <div className="col-start-1 row-start-1 row-span-3 border-r"></div>
          <div className="z-10 col-start-2 row-start-1 md:min-w-3xl  flex flex-col items-center justify-center gap-2 px-4 py-10 sm:p-8 lg:p-14 bg-accent/50 h-full relative">
            <div className="rounded-full inline-flex justify-center  gap-2 items-center border py-1 px-4 shadow-sm">
              <Sparkles size={16} />
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
            <GridPlus position="bottom-left" />
            <GridPlus position="bottom-right" />
          </div>
          <div className="col-start-2 row-start-2 min-h-[5rem]  p-px h-full screen-line-before screen-line-after relative z-0">
            <div className="flex  h-full gap-4 w-full items-center  p-4 md:p-0 justify-center flex-col sm:flex-row">
              <Button className="h-12 w-full sm:w-auto" asChild>
                <Link href="/blocks">
                  Explore Blocks
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-12 w-full sm:w-auto"
                asChild
              >
                <Link href="/docs">
                  Documentation
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
            <GridPlus position="bottom-left" />
            <GridPlus position="bottom-right" />
          </div>

          <div className="col-start-2 row-start-3 min-h-[8rem] md:min-w-3xl w-full h-full screen-line-before flex flex-col items-center justify-center">
            <div className="max-w-sm flex -space-x-3">
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

          <div className="col-start-3 row-start-1 row-span-3 border-l"></div>
        </div>
      </div>

      <div className="w-full border-x min-h-[2.5rem]  screen-line-after  mx-auto border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed">
        <div className="w-full h-[2.5rem] max-w-6xl  border-x mx-auto">
          <div className="w-full max-w-[384px] translate-x-[19px] border-x -skew-x-45  mx-auto h-[2.5rem] bg-background flex items-center justify-center">
            <h2 className="skew-x-45">Greatly inspired from</h2>
          </div>
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
    <div className="relative w-full max-w-6xl border-x min-h-[7.5rem] h-full screen-line-after mx-auto overflow-hidden">
      {sets.map((set, setIndex) => {
        const isActive = setIndex === activeSet;
        return (
          <div
            key={setIndex}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 bg-border gap-px transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
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

function GridPlus({ position }: { position: string }) {
  return (
    <div
      className={cn("absolute  grid h-3 w-3 grid-cols-2 grid-rows-2", {
        "bottom-0 left-0 -translate-x-[7px] translate-y-[7px]":
          position === "bottom-left",
        "bottom-0 right-0 translate-x-[6px] translate-y-[7px]":
          position === "bottom-right",
      })}
    >
      <div className="border-b border-gray-400 dark:border-gray-600"></div>
      <div className="border-b border-l  border-gray-400 dark:border-gray-600"></div>
      <div className=" border-gray-400 dark:border-gray-600"></div>
      <div className="border-l border-gray-400 dark:border-gray-600"></div>
    </div>
  );
}