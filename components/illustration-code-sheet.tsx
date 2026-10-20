"use client";

import { Code } from "lucide-react";
import { CodeFrame } from "@/components/docs/code-frame";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// The /illustration cards keep their code out of the page: a button opens the
// files in a side sheet. A client component so the trigger and the sheet
// hydrate together rather than across the server boundary.
export function IllustrationCodeSheet({
  title,
  files,
}: {
  title: string;
  files: { html: string; code: string; filename: string }[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Code />
          View code
        </Button>
      </SheetTrigger>
      {/* Floats as a card inset from the viewport rather than a full-height
          panel; tailwind-merge replaces the sheet's edge-pinned defaults. */}
      <SheetContent className="inset-y-2 right-2 h-auto w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45),0_8px_20px_-8px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:max-w-2xl dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="text-base font-medium">{title}</SheetTitle>
          <SheetDescription className="text-xs">
            {files.length === 1 ? "1 file" : `${files.length} files`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4">
          {files.map((f) => (
            <CodeFrame
              key={f.filename}
              html={f.html}
              code={f.code}
              filename={f.filename}
              className="min-w-0 shrink-0"
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
