"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Eye, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyText } from "@/lib/utils";
import { PRO_LINK_PROPS } from "@/lib/pro";
import type { CatalogItem } from "@/lib/catalog";

interface BlockCardProps {
  item: CatalogItem;
}

export function BlockCard({ item }: BlockCardProps) {
  const [copied, setCopied] = React.useState(false);
  const available = item.status !== "coming_soon";
  const isPro = item.tier === "pro";

  const copyInstall = React.useCallback(async () => {
    try {
      await copyText(`npx shadcn@latest add @d2/${item.name}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [item.name]);

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border bg-card p-2 transition-colors duration-200 hover:border-foreground/20">
      {/* Preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gradient-to-b from-muted/40 to-muted">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className={cn(
            "transition-transform duration-200 ease-out group-hover:scale-[1.02]",
            item.fit === "contain" ? "object-contain object-center p-2" : "object-cover object-top",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={item.image.endsWith(".svg")}
        />

        <CardLink item={item} className="absolute inset-0" aria-label={`Open ${item.title}`} />

        {isPro && <ProBadge />}

        {!available && (
          <span className="absolute right-2 top-2 rounded-md border bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
            Coming soon
          </span>
        )}

        {/* Hover action toolbar. Tailwind scopes `group-hover:` to devices that
            actually hover, so on touch this never latches open over the art —
            the whole preview is the link there. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur">
            <ToolbarSlot label={item.external ? "Open on D2 Pro" : "Preview"}>
              <CardLink
                item={item}
                aria-label={item.external ? "Open on D2 Pro" : "Preview"}
                className="inline-flex size-7 items-center justify-center rounded-md text-foreground/80 transition-[color,background-color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-95"
              >
                {item.external ? (
                  <ArrowUpRight className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </CardLink>
            </ToolbarSlot>

            {available && (
              <ToolbarSlot label={copied ? "Copied!" : "Copy install command"}>
                <button
                  type="button"
                  onClick={copyInstall}
                  aria-label="Copy install command"
                  className="inline-flex size-7 items-center justify-center rounded-md text-foreground/80 transition-[color,background-color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-95"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </ToolbarSlot>
            )}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-0.5 px-1 pb-1">
        <CardLink
          item={item}
          className="inline-flex items-center gap-1 text-sm font-semibold leading-tight transition-colors duration-150 hover:text-primary"
        >
          {item.title}
          {item.external && (
            <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-px" />
          )}
        </CardLink>
        {item.subtitle && (
          <span className="text-xs capitalize text-muted-foreground">
            {item.subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

// A free block opens in place; a pro one opens on the site that sells it, in a
// new tab. One component so no caller has to remember which kind it is holding.
function CardLink({
  item,
  className,
  children,
  ...props
}: {
  item: CatalogItem;
  className?: string;
  children?: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (item.external) {
    return (
      <a href={item.href} className={className} {...PRO_LINK_PROPS} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} {...props}>
      {children}
    </Link>
  );
}

// The brand gradient on a hairline ring rather than a filled chip: a solid
// badge on every second card turns the grid into a wall of labels, and what has
// to read here is "not free", not "look at me".
function ProBadge() {
  return (
    <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-md bg-background/85 p-px backdrop-blur">
      <span
        className="rounded-[5px] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-transparent"
        style={{
          backgroundImage: "var(--d2-flash-gradient)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        Pro
      </span>
    </span>
  );
}

function ToolbarSlot({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export { CardLink };
