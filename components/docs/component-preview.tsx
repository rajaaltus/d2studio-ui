"use client";

import * as React from "react";
import { ExternalLink, RotateCw } from "lucide-react";
import { SlidingTabs } from "@/components/ui/sliding-tabs";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "preview", label: "Preview" },
  { value: "code", label: "Code" },
];

/**
 * The demo, live, in an iframe so its styles and portals stay inside the frame,
 * beside its source. Both panes stay mounted: flipping to Code and back does not
 * reload the demo. The switch itself is instant — it is flipped constantly, and
 * a fade there would only slow the reader down.
 */
export function ComponentPreview({
  name,
  height,
  code,
}: {
  name: string;
  height: number;
  /** The Code pane, already highlighted on the server. */
  code: React.ReactNode;
}) {
  const [tab, setTab] = React.useState("preview");
  const [loaded, setLoaded] = React.useState(false);
  const [nonce, setNonce] = React.useState(0);
  const [spun, setSpun] = React.useState(0);
  const src = `/preview/${name}?type=example`;
  const frameRef = React.useRef<HTMLIFrameElement>(null);

  // A server-rendered iframe can finish loading before hydration attaches
  // onLoad, and then the event never arrives. Check once on mount instead.
  React.useEffect(() => {
    if (frameRef.current?.contentDocument?.readyState === "complete") setLoaded(true);
  }, [nonce]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <SlidingTabs value={tab} onValueChange={setTab} tabs={TABS} aria-label="View" />
        <div className={cn("flex items-center gap-1", tab !== "preview" && "invisible")}>
          <button
            type="button"
            aria-label="Reload preview"
            onClick={() => {
              setLoaded(false);
              setNonce((n) => n + 1);
              setSpun((s) => s + 1);
            }}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:bg-foreground/5 hover:text-foreground active:scale-[0.94]"
          >
            <RotateCw
              className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
              style={{ transform: `rotate(${spun * 360}deg)` }}
            />
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open preview in a new tab"
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:bg-foreground/5 hover:text-foreground active:scale-[0.94]"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      <div hidden={tab !== "preview"} className="relative overflow-hidden rounded-xl border" style={{ height }}>
        {/* Skeleton → content: the frame cross-fades in with a short blur once
            it has loaded, rather than flashing white then popping the demo. */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out",
            loaded ? "opacity-0" : "opacity-100",
          )}
        >
          <div className="h-10 w-40 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        </div>
        <iframe
          key={nonce}
          ref={frameRef}
          src={src}
          title={`${name} preview`}
          onLoad={() => setLoaded(true)}
          className={cn(
            "relative size-full border-0 transition-[opacity,filter] duration-300 ease-out motion-reduce:transition-none",
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-[4px]",
          )}
        />
      </div>

      <div hidden={tab !== "code"}>{code}</div>
    </div>
  );
}
