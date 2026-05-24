import * as React from "react";
import { PixelTerminalIcon } from "@/components/icons/pixel-terminal-icon";

export function MoreSoonCard() {
  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-lg border bg-card flex items-center justify-center md:col-span-2 xl:col-span-2">
      <div className="relative inline-flex items-center gap-4">
        <PixelTerminalIcon
          style={
            {
              "--cell": "4px",
              "--gap": "2px",
            } as React.CSSProperties
          }
        />
        <h2 className="font-sans text-6xl md:text-7xl font-bold tracking-tight text-foreground border-b-2 border-blue-500 pb-1">
          More
        </h2>
        <span className="absolute -top-3 -right-6 translate-x-full rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium [background-clip:padding-box] dark:border-neutral-800/40 dark:bg-neutral-900">
          <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-pink-300 dark:via-purple-300 dark:to-cyan-300">
            ComingSoon
          </span>
        </span>
      </div>
    </div>
  );
}
