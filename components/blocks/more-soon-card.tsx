import type * as React from "react";
import { PixelTerminalIcon } from "@/components/icons/pixel-terminal-icon";

export function MoreSoonCard() {
  return (
    <div className="relative  h-full min-h-[100px] sm:min-h-[140px] md:min-h-[280px] overflow-hidden rounded-lg border bg-card flex items-center justify-center px-4 xl:col-span-2 [--pix-cell:1.5px] [--pix-gap:0.5px] md:[--pix-cell:4px] md:[--pix-gap:2px]">
      <span className="absolute top-2 right-2 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-medium leading-tight [background-clip:padding-box] dark:border-neutral-800/40 dark:bg-neutral-900 sm:top-3 sm:right-3 sm:px-2.5 sm:text-xs md:px-3 md:py-1 md:text-sm">
        <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-pink-300 dark:via-purple-300 dark:to-cyan-300">
          ComingSoon
        </span>
      </span>
      <div className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-4">
        <div className="">
          <PixelTerminalIcon
            className="shrink-0"
            style={
              {
                "--cell": "var(--pix-cell)",
                "--gap": "var(--pix-gap)",
              } as React.CSSProperties
            }
          />
        </div>
        <h2 className="font-sans text-xl md:text-5xl translate-y-1 md:translate-y-4 lg:translate-y-0 lg:text-7xl font-bold tracking-tight text-foreground border-b sm:border-b-2 border-blue-500 pb-0.5 sm:pb-1">
          More
        </h2>
      </div>
    </div>
  );
}
