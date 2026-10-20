import type { Metadata } from "next";
import type React from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { CodeFrame } from "@/components/docs/code-frame";
import { InstallCommand } from "@/components/docs/install-command";
import { IllustrationCodeSheet } from "@/components/illustration-code-sheet";
import { highlight } from "@/lib/highlight";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { IllustrationPlayer } from "@/components/illustration-player";
import RawChip from "@/registry/default/components/raw-chip";
import MoonTile from "@/registry/default/components/moon-tile-01";
import MoonWindow from "@/registry/default/components/moon-tile-02";
import MoonCard from "@/registry/default/components/moon-tile-03";
import { ProCta } from "@/components/blocks/pro-grid";
import { IllustrationReel } from "@/components/illustration-reel";
import { proShelfHref } from "@/lib/pro";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Illustrations — D2 Studio",
  description:
    "Power Chip, an animated SVG of a RAW chip powering six tiles, ready to copy and paste. Plus the full illustration library: isometric scenes, particle portraits, logos and screens.",
};

export default async function IllustrationPage() {
  const [
    source,
    chipSource,
    moonSource,
    moonCss,
    windowSource,
    windowCss,
    cardSource,
    cardCss,
  ] = await Promise.all(
    [
      "power-chip.tsx",
      "raw-chip.tsx",
      "moon-tile-01.tsx",
      "moon-tile-01/moon-tile-01.css",
      "moon-tile-02.tsx",
      "moon-tile-02/moon-tile-02.css",
      "moon-tile-03.tsx",
      "moon-tile-03/moon-tile-03.css",
    ].map((file) =>
      readFile(
        path.join(process.cwd(), "registry", "default", "components", file),
        "utf8",
      ),
    ),
  );
  const [
    sourceHtml,
    chipSourceHtml,
    moonSourceHtml,
    moonCssHtml,
    windowSourceHtml,
    windowCssHtml,
    cardSourceHtml,
    cardCssHtml,
  ] = await Promise.all([
    highlight(source),
    highlight(chipSource),
    highlight(moonSource),
    highlight(moonCss, "css"),
    highlight(windowSource),
    highlight(windowCss, "css"),
    highlight(cardSource),
    highlight(cardCss, "css"),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <h1 className="sr-only">Illustrations</h1>

      <section className="max-w-7xl w-full border-x mx-auto bg-background px-4 lg:px-8 py-8 lg:py-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <IllustrationRow
          title="Power Chip"
          featured
          name="power-chip"
          files={[
            {
              html: sourceHtml,
              code: source,
              filename: "components/power-chip.tsx",
            },
          ]}
        >
          <IllustrationPlayer />
        </IllustrationRow>

        <IllustrationRow
          title="RAW Chip"
          name="raw-chip"
          files={[
            {
              html: chipSourceHtml,
              code: chipSource,
              filename: "components/raw-chip.tsx",
            },
          ]}
        >
          <RawChip aria-hidden="true" className="h-auto w-32 sm:w-40" />
        </IllustrationRow>

        <IllustrationRow
          title="Moon Tile"
          name="moon-tile-01"
          files={[
            {
              html: moonSourceHtml,
              code: moonSource,
              filename: "components/moon-tile-01.tsx",
            },
            {
              html: moonCssHtml,
              code: moonCss,
              filename: "components/moon-tile-01/moon-tile-01.css",
            },
          ]}
        >
          <MoonTile />
        </IllustrationRow>

        <IllustrationRow
          title="Moon Window"
          name="moon-tile-02"
          files={[
            {
              html: windowSourceHtml,
              code: windowSource,
              filename: "components/moon-tile-02.tsx",
            },
            {
              html: windowCssHtml,
              code: windowCss,
              filename: "components/moon-tile-02/moon-tile-02.css",
            },
          ]}
        >
          <MoonWindow />
        </IllustrationRow>

        <IllustrationRow
          title="Moon Card"
          name="moon-tile-03"
          files={[
            {
              html: cardSourceHtml,
              code: cardSource,
              filename: "components/moon-tile-03.tsx",
            },
            {
              html: cardCssHtml,
              code: cardCss,
              filename: "components/moon-tile-03/moon-tile-03.css",
            },
          ]}
        >
          <MoonCard />
        </IllustrationRow>
      </section>

      <ProIllustrationWall />

      <SiteFooter />
    </div>
  );
}

// One free illustration as a card: the drawing on top, then its title and
// install, three across on lg with the featured one taking a 2x2 block. The
// code opens in a side sheet.
function IllustrationRow({
  title,
  name,
  featured = false,
  files,
  children,
}: {
  title: string;
  name: string;
  featured?: boolean;
  files: { html: string; code: string; filename: string }[];
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-card",
        featured && "md:col-span-2 lg:row-span-2",
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center border-b bg-muted/30 p-4",
          featured ? "min-h-80 flex-1 md:p-8" : "aspect-[4/3]",
        )}
      >
        {children}
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-medium">{title}</h2>
          <IllustrationCodeSheet title={title} files={files} />
        </div>
        <InstallCommand args={`add @d2/${name}`} />
      </div>
    </article>
  );
}

// The rest of the library, which lives on pro.d2studio.dev, shown as a screen
// recording of it with the way in laid over the recording.
//
// The count is the pro source's own (`group: "illustrations"` in
// ../pro-d2/lib/blocks.ts), not the mirror's: the mirror only carries what the
// live site serves, which is a fraction of the library. Recount after a pro
// release.
const PRO_ILLUSTRATION_COUNT = 74;

function ProIllustrationWall() {
  return (
    <section className="max-w-7xl w-full border-x mx-auto bg-background mt-px">
      <div className="px-4 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            The full library
          </span>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
            {PRO_ILLUSTRATION_COUNT} illustrations
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Isometric scenes, particle portraits, logo systems and device
            screens. Each one is a single React component with no page layout of
            its own, so it drops into a card, a hero or an empty state.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-black">
          <IllustrationReel className="block aspect-[1892/1080] w-full object-cover" />
          {/* A scrim under the button, so it reads over any frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-6 flex justify-center md:bottom-10">
            <ProCta href={proShelfHref("/illustrations", "illustration")}>
              Browse all {PRO_ILLUSTRATION_COUNT} on D2 Pro
            </ProCta>
          </div>
        </div>
      </div>
    </section>
  );
}
