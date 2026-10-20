import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CodeFrame } from "@/components/docs/code-frame";
import { InstallCommand } from "@/components/docs/install-command";
import { highlight } from "@/lib/highlight";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { IllustrationPlayer } from "@/components/illustration-player";
import RawChip from "@/registry/default/components/raw-chip";
import { ProGrid, ProCta } from "@/components/blocks/pro-grid";
import { proItemsFor } from "@/lib/catalog";
import { proShelfHref } from "@/lib/pro";

export const metadata: Metadata = {
  title: "Illustrations — D2 Studio",
  description:
    "Power Chip, an animated SVG of a RAW chip powering six tiles, ready to copy and paste. Plus the full illustration library: isometric scenes, particle portraits, logos and screens.",
};

export default async function IllustrationPage() {
  const [source, chipSource] = await Promise.all(
    ["power-chip", "raw-chip"].map((name) =>
      readFile(
        path.join(
          process.cwd(),
          "registry",
          "default",
          "components",
          `${name}.tsx`,
        ),
        "utf8",
      ),
    ),
  );
  const [sourceHtml, chipSourceHtml] = await Promise.all([
    highlight(source),
    highlight(chipSource),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <section className="max-w-7xl w-full border-x mx-auto px-4 lg:px-0 bg-border">
        <div className="bg-background border rounded-xl m-0 px-6 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-foreground/60" />
            Custom illustration
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            Power Chip
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            A RAW chip wired to six tiles. Press Animate to watch it charge and
            send power out to every tile.
          </p>
        </div>
      </section>

      <section className="relative max-w-7xl w-full border-x mx-auto bg-background flex justify-center px-4 pt-12 pb-20 lg:py-16">
        <IllustrationPlayer />
      </section>

      <section className="max-w-7xl w-full border-x mx-auto px-4 lg:px-0 bg-border">
        <div className="bg-background border rounded-xl m-0 px-4 md:px-10 lg:px-16 py-10 lg:py-12 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-medium">Install</h2>
            <p className="text-xs text-muted-foreground mt-2">
              One self-contained component with no dependencies. Add it with the
              shadcn CLI, or copy the source below into{" "}
              <code className="font-mono">components/power-chip.tsx</code>. It
              scales to its container on any screen.
            </p>
          </div>
          <InstallCommand args="add @d2/power-chip" />
          <CodeFrame
            html={sourceHtml}
            code={source}
            filename="components/power-chip.tsx"
            collapsible
            className="min-w-0"
          />
        </div>
      </section>

      <section className="max-w-7xl w-full border-x mx-auto px-4 lg:px-0 bg-border mt-px">
        <div className="bg-background border rounded-xl m-0 px-4 md:px-10 lg:px-16 py-10 lg:py-12 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-medium">RAW Chip</h2>
            <p className="text-xs text-muted-foreground mt-2">
              The chip on its own, still. Same artwork as Power Chip, cropped to
              the chip, for an icon, a card or an empty state.
            </p>
          </div>
          <div className="flex justify-center py-10 lg:py-14">
            <RawChip aria-hidden="true" className="h-auto w-32 sm:w-40" />
          </div>
          <InstallCommand args="add @d2/raw-chip" />
          <CodeFrame
            html={chipSourceHtml}
            code={chipSource}
            filename="components/raw-chip.tsx"
            collapsible
            className="min-w-0"
          />
        </div>
      </section>

      <ProIllustrationWall />

      <SiteFooter />
    </div>
  );
}

// The rest of the library, which lives on pro.d2studio.dev.
//
// One flat wall rather than a heading per category: eighteen pieces spread over
// ten categories left most rows holding a single card with two empty columns
// beside it, and the category is already on every card. Grouping earns its keep
// on /blocks, where the categories have ten items each.
function ProIllustrationWall() {
  const items = proItemsFor("illustrations", "illustration");
  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl w-full border-x mx-auto bg-background mt-px">
      <div className="px-4 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col gap-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              The full library
            </span>
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
              {items.length} illustrations
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Isometric scenes, particle portraits, logo systems and device
              screens. Each one is a single React component with no page layout
              of its own, so it drops into a card, a hero or an empty state.
            </p>
          </div>
          <ProCta href={proShelfHref("/illustrations", "illustration")}>
            Browse on D2 Pro
          </ProCta>
        </div>

        <ProGrid items={items} />
      </div>
    </section>
  );
}
