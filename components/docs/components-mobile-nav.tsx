"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { COMPONENT_ORDER } from "@/lib/components-docs";
import { ComponentsNav, type ProLink } from "./components-nav";
import type { ComponentGroup } from "@/lib/components-docs";

/** Below md the rail folds into a sheet behind a bar naming where you are. */
export function ComponentsMobileNav({ groups, pro }: { groups: ComponentGroup[]; pro: ProLink[] }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname() ?? "";
  const current =
    COMPONENT_ORDER.find((c) => pathname === `/components/${c.name}`)?.title ?? "Overview";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="sticky top-16 z-20 flex w-full items-center justify-between border-b bg-background/90 px-4 py-2.5 text-sm backdrop-blur md:hidden"
        >
          <span className="flex items-center gap-2">
            <span className="text-muted-foreground">Components</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium">{current}</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 overflow-y-auto p-4 pt-12"
        // Radix focuses the first field on open; on a phone that is the filter,
        // and the keyboard would cover the list the reader came to see.
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetTitle className="sr-only">Components</SheetTitle>
        <ComponentsNav groups={groups} pro={pro} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
