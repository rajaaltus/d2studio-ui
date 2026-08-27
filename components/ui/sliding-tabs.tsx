"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SlidingTab = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

/**
 * A segmented control whose active pill slides between options.
 *
 * transitions.dev's tabs-sliding: JS measures the active tab and writes its
 * `offsetLeft` / `offsetWidth` onto the pill, CSS owns the tween. The styling
 * lives in globals.css under the snippet's own `t-tabs` names so the tuning
 * stays where the rest of it is.
 *
 * The measurement is the whole reason this cannot be pure CSS: a pill sized to
 * whichever label happens to be selected has to be told, in pixels, what that
 * label measures.
 */
export function SlidingTabs({
  value,
  onValueChange,
  tabs,
  className,
  ...props
}: {
  value: string;
  onValueChange: (value: string) => void;
  tabs: SlidingTab[];
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const barRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLSpanElement>(null);
  // First paint and resize place the pill without a tween — otherwise it flies
  // in from translateX(0) with width 0 every time the bar is laid out.
  const placed = React.useRef(false);

  const move = React.useCallback((animate: boolean) => {
    const bar = barRef.current;
    const pill = pillRef.current;
    if (!bar || !pill) return;
    const active = bar.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!active) return;

    const write = () => {
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.height = `${active.offsetHeight}px`;
    };

    if (animate) {
      write();
      return;
    }
    const prev = pill.style.transition;
    pill.style.transition = "none";
    write();
    void pill.offsetWidth; // reflow, so the restored transition has nothing to catch up on
    pill.style.transition = prev;
  }, []);

  React.useLayoutEffect(() => {
    move(placed.current);
    placed.current = true;
  }, [value, tabs, move]);

  React.useEffect(() => {
    const onResize = () => move(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [move]);

  return (
    <div ref={barRef} role="tablist" className={cn("t-tabs", className)} {...props}>
      <span ref={pillRef} className="t-tabs-pill" aria-hidden />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onValueChange(tab.value)}
          className="t-tab"
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
