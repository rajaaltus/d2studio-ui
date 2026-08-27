"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockCard } from "./block-card";
import { cn } from "@/lib/utils";
import { PRO_LINK_PROPS } from "@/lib/pro";
import type { CatalogItem } from "@/lib/catalog";

/**
 * A plain wall of catalogue cards, for the routes that show one shelf rather
 * than run a browser over it — illustrations and templates. Items are computed
 * on the server and handed down as data; the client half exists only for the
 * card's tooltips and copy button.
 */
export function ProGrid({
  items,
  className,
}: {
  items: CatalogItem[];
  className?: string;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {items.map((item) => (
          <BlockCard key={item.name} item={item} />
        ))}
      </div>
    </TooltipProvider>
  );
}

/**
 * The way off this site and onto the one that sells the thing. A hairline of
 * the brand gradient rather than a filled button: it sits at the end of a wall
 * of art and should read as the next step, not compete with what is above it.
 */
export function ProCta({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <a
      href={href}
      {...PRO_LINK_PROPS}
      className="group/cta relative inline-flex items-center gap-2 rounded-lg p-px transition-transform duration-150 ease-out active:scale-[0.98]"
    >
      {/* The gradient is the border: a padded parent painted with it, and an
          opaque child sitting on top of all but one pixel of it. */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-lg opacity-60 transition-opacity duration-200 ease-out group-hover/cta:opacity-100"
        style={{ backgroundImage: "var(--d2-flash-gradient)" }}
      />
      <span className="relative inline-flex items-center gap-2 rounded-[7px] bg-background px-4 py-2.5 text-sm font-medium">
        {children}
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 ease-out group-hover/cta:-translate-y-px group-hover/cta:translate-x-px" />
      </span>
      {label && <span className="sr-only">{label}</span>}
    </a>
  );
}
