"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MIN_HEIGHT = 600;

// A same-origin preview iframe that grows to its document's height, so a block
// shows at its real size instead of scrolling inside a fixed 600px window.
export function AutoHeightFrame({
  src,
  title,
  minHeight,
}: {
  src: string;
  title: string;
  minHeight?: number;
}) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = React.useState(minHeight ?? MIN_HEIGHT);
  const [loaded, setLoaded] = React.useState(false);
  const stop = React.useRef(() => {});

  const onLoad = React.useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc || doc.URL === "about:blank") return;
    stop.current();
    setLoaded(true);
    // Inside a frame 100vh is the frame's own height, so a min-h-screen block
    // would grow with every resize. Pin the screen utilities to the real window.
    // shortcut: arbitrary vh values (h-[80vh], dvh) still track the frame; pin those too if a block uses them.
    // A block with its own floor is compact, so the screen utilities pin to that floor instead.
    const vh = `${minHeight ?? window.innerHeight}px`;
    const pin = doc.createElement("style");
    pin.textContent = `.min-h-screen{min-height:${vh}!important}.h-screen{height:${vh}!important}.max-h-screen{max-height:${vh}!important}`;
    doc.head.appendChild(pin);
    const measure = () =>
      setHeight(
        Math.max(minHeight ?? MIN_HEIGHT, doc.documentElement.scrollHeight),
      );
    measure();
    // Blocks reflow after load (fonts, tabs, lazy media), so keep tracking.
    const ro = new ResizeObserver(measure);
    ro.observe(doc.body);
    stop.current = () => ro.disconnect();
  }, [minHeight]);

  // A server-rendered iframe can finish loading before hydration attaches
  // onLoad, and then the event never arrives. Check once on mount instead.
  React.useEffect(() => {
    if (ref.current?.contentDocument?.readyState === "complete") onLoad();
    return () => stop.current();
  }, [onLoad]);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      onLoad={onLoad}
      sandbox="allow-scripts allow-same-origin"
      style={{ height }}
      className={cn(
        // transitions.dev card-resize curve for height; skeleton-reveal blur fade on load.
        "block w-full border-none transition-[height,opacity,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-[4px]",
      )}
    />
  );
}
