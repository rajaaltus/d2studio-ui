"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import PowerChip from "@/registry/default/components/power-chip";

/**
 * The illustration held still until asked: the button plays and pauses the
 * power cycle in place. Sits in a `relative` parent; the button pins to its
 * bottom-right corner.
 */
export function IllustrationPlayer() {
  const [playing, setPlaying] = React.useState(false);

  return (
    <>
      <PowerChip
        aria-hidden="true"
        paused={!playing}
        className="h-auto w-full max-w-[559px]"
      />
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-pressed={playing}
        className="absolute bottom-4 right-4 inline-flex h-8 items-center gap-1.5 rounded-full border bg-background/80 px-3 text-xs font-medium text-muted-foreground backdrop-blur transition-[color,background-color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className="t-icon-swap"
          data-state={playing ? "b" : "a"}
          aria-hidden
        >
          <Play className="t-icon size-3.5" data-icon="a" />
          <Pause className="t-icon size-3.5" data-icon="b" />
        </span>
        {playing ? "Pause" : "Animate"}
      </button>
    </>
  );
}
