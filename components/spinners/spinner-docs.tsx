"use client";

import { BookOpen, ChevronRight } from "lucide-react";
import { CodeSnippet } from "@/components/docs/code-snippet";
import { InstallCommand } from "@/components/docs/install-command";
import { Code } from "@/components/docs/prose";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { componentName, snippetFor } from "@/components/spinners/spinner-snippet";
import { FREE_SPINNERS } from "@/lib/free-spinners";

// How to use a free spinner, in a drawer beside the wall rather than a long
// section under it. Every part folds, and only the first step starts open, so
// the whole procedure reads as one short list of headings. Worked through one
// real spinner, so the example is the exact code its card copies.
const EXAMPLE = FREE_SPINNERS.find((s) => s.label === "Hourglass") ?? FREE_SPINNERS[0];
const NAME = componentName(EXAMPLE);
const FILE = `spinner-${EXAMPLE.label.toLowerCase()}`;

const USAGE = `import { ${NAME} } from "@/components/${FILE}";

export function SavingState() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <${NAME} />
      Saving...
    </span>
  );
}`;

const PROPS: [prop: string, preset: string, note: string][] = [
  ["cellSize", "2", "Width of one cell in px."],
  ["gap", "1", "Space between cells in px."],
  ["customColor", '"currentColor"', "Lit cell colour. Any CSS colour or var(--token)."],
  ["effect", '"none"', '"none", "light" or "wave". Glow over lit cells.'],
  ["shape", '"square"', '"rounded", "circle", "diamond" and more.'],
  ["intervalOverride", "pattern's own", "Milliseconds per frame. Lower is faster."],
  ["className", "none", "Classes on the grid element."],
];

// One folding part: a numbered or plain heading that opens its body.
function Part({
  n,
  title,
  open = false,
  children,
}: {
  n?: number;
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group border-b border-border/60 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-3 text-sm font-medium text-foreground outline-none select-none focus-visible:underline [&::-webkit-details-marker]:hidden">
        {n !== undefined && (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md border bg-background font-mono text-[11px] text-muted-foreground">
            {n}
          </span>
        )}
        <span className="flex-1">{title}</span>
        <ChevronRight
          aria-hidden
          className="size-4 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-90 motion-reduce:transition-none"
        />
      </summary>
      <div className="flex flex-col gap-3 pb-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </details>
  );
}

export function SpinnerDocsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <BookOpen />
          How to use
        </Button>
      </SheetTrigger>
      {/* Floats as a card inset from the viewport, like the illustration code
          drawer; tailwind-merge replaces the sheet's edge-pinned defaults. */}
      <SheetContent className="inset-y-2 right-2 h-auto w-[calc(100%-1rem)] gap-0 overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45),0_8px_20px_-8px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:max-w-xl dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="text-base font-medium">Using a spinner</SheetTitle>
          <SheetDescription className="text-xs">
            Each spinner is a short component over the @d2/pixel-spinner engine. Needs React, Tailwind
            and a shadcn <Code>components.json</Code>.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
          <Part n={1} title="Install the engine" open>
            <p>
              Once per project. Adds <Code>components/ui/pixel-spinner.tsx</Code> and its stylesheet.
            </p>
            <InstallCommand args="add @d2/pixel-spinner" />
          </Part>

          <Part n={2} title="Copy a spinner">
            <p>Press the copy button on any card. Its code is now on your clipboard.</p>
          </Part>

          <Part n={3} title="Save it as a component">
            <p>
              Paste it into a new file, for {EXAMPLE.label} <Code>{`components/${FILE}.tsx`}</Code>:
            </p>
            <CodeSnippet filename={`components/${FILE}.tsx`} code={snippetFor(EXAMPLE).trimEnd()} />
          </Part>

          <Part n={4} title="Render it">
            <p>Lit cells take the text colour around them, so set the colour on the parent.</p>
            <CodeSnippet filename="app/saving-state.tsx" code={USAGE} />
          </Part>

          <Part n={5} title="Adjust it">
            <p>
              Any prop you pass overrides the copied value. <Code>{`<${NAME} cellSize={4} />`}</Code> draws
              it twice as large.
            </p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[26rem] text-left text-xs">
                <thead className="border-b bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Prop</th>
                    <th className="px-3 py-2 font-medium">Copied value</th>
                    <th className="px-3 py-2 font-medium">What it does</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {PROPS.map(([prop, preset, note]) => (
                    <tr key={prop} className="align-top">
                      <td className="px-3 py-2 font-mono text-foreground">{prop}</td>
                      <td className="px-3 py-2 font-mono">{preset}</td>
                      <td className="px-3 py-2">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Part>

          <Part title="Accessibility">
            <p>
              The engine renders with <Code>role=&quot;status&quot;</Code> and the label &quot;Loading&quot;.
              Keep visible text beside it so the state is clear without the animation.
            </p>
          </Part>
        </div>
      </SheetContent>
    </Sheet>
  );
}
