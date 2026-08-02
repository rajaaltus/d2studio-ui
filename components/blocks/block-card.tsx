"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, copyText } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

interface BlockCardProps {
  block: Doc<"blocks">;
}

export function BlockCard({ block }: BlockCardProps) {
  const [copied, setCopied] = React.useState(false);
  const href = `/blocks/${block.name}`;
  const available = block.codeStatus !== "coming_soon";
  const category = block.categories?.[0];

  const copyInstall = React.useCallback(async () => {
    try {
      await copyText(
        `npx shadcn@latest add @d2/${block.name}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [block.name]);

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border bg-card p-2 transition-colors hover:border-foreground/20">
      {/* Preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gradient-to-b from-muted/40 to-muted">
        <Image
          src={block.previewImage || "/placeholder.svg"}
          alt={block.title}
          fill
          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Clickable overlay -> preview page */}
        <Link
          href={href}
          aria-label={`Open ${block.title}`}
          className="absolute inset-0"
        />

        {!available && (
          <span className="absolute right-2 top-2 rounded-md border bg-background/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
            Coming soon
          </span>
        )}

        {/* Hover action toolbar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur">
            <ToolbarLink href={href} label="Preview">
              <Eye className="size-4" />
            </ToolbarLink>
            {available && (
              <ToolbarButton
                onClick={copyInstall}
                label={copied ? "Copied!" : "Copy install command"}
              >
                {copied ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </ToolbarButton>
            )}
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-0.5 px-1 pb-1">
        <Link
          href={href}
          className="text-sm font-semibold leading-tight transition-colors hover:text-primary"
        >
          {block.title}
        </Link>
        {category && (
          <span className="text-xs capitalize text-muted-foreground">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}

function ToolbarLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          className="inline-flex size-7 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className="inline-flex size-7 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
