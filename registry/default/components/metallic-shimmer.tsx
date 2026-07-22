// Brushed metal type: a highlight panning across the letters, not a glow — the
// two dark stops either side are what makes the bright band read as a
// reflection travelling over the glyphs rather than the text lighting up.
//
// .d2-metallic-shimmer pans a 200%-wide background; bg-clip-text with
// transparent text points it at the glyphs instead of the box. The stops flip
// per theme: dark letters with a light sweep on the pale page, light letters
// with a bright sweep on the dark one.

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export default function MetallicShimmer({
  children = "SCROLL DOWN ↓",
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "d2-metallic-shimmer bg-gradient-to-r from-zinc-400 via-zinc-800 to-zinc-400 bg-clip-text text-transparent dark:from-zinc-700 dark:via-zinc-200 dark:to-zinc-700",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
