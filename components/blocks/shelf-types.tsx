import Link from "next/link";
import { Boxes, Component, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const SHELF_TYPES = [
  { key: "blocks", label: "Blocks", icon: Boxes, href: "/blocks" },
  { key: "components", label: "Components", icon: Component, href: "/components" },
  { key: "illustrations", label: "Illustrations", icon: ImageIcon, href: "/illustration" },
  { key: "templates", label: "Templates", icon: FileText, href: "/templates" },
] as const;

/**
 * The shelf switcher at the top of every browse sidebar. /blocks draws a filter
 * browser and /components a docs index, but both open on this same block in
 * the same place, so crossing between them moves nothing the eye was resting on.
 */
export function ShelfTypes({ active }: { active: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Types
      </span>
      <div className="flex flex-wrap gap-1.5">
        {SHELF_TYPES.map((t) => {
          const current = t.key === active;
          const Icon = t.icon;
          return (
            <Link
              key={t.key}
              href={t.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm transition-colors duration-150",
                current
                  ? "border-foreground/30 bg-muted font-medium text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
