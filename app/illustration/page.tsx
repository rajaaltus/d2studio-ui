import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { FooterIllustrationCard } from "@/components/footer-illustration-card";
import { ProGrid, ProCta } from "@/components/blocks/pro-grid";
import { proItemsFor } from "@/lib/catalog";
import { proShelfHref } from "@/lib/pro";

export const metadata: Metadata = {
  title: "Illustrations — D2 Studio",
  description:
    "The D2 Studio wordmark with its chromatic spotlight reveal, and the full illustration library: isometric scenes, particle portraits, logos and screens.",
};

const META = [
  { label: "Type", value: "Wordmark" },
  { label: "Format", value: "CSS / React" },
  { label: "Theme", value: "Light + Dark" },
  { label: "Last updated", value: "May 15, 2026" },
];

const NOTES = [
  "Cursor reveals a chromatic spotlight that paints the holographic brand gradient over the dim base.",
  "Leaving the wordmark triggers a one-shot sweep across the glyphs before settling back to gray.",
  "Hover state composites a vertical stripe pattern, masked by the cursor, to add a subtle CRT shimmer.",
  "Touch devices fall back to the static base wordmark — no interaction is required to render the brand.",
];

export default function IllustrationPage() {
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
            D2 Studio Wordmark
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            A hover-reactive brand illustration built from layered CSS masks,
            mix-blend modes, and a holographic gradient. Move your cursor across
            the wordmark below to reveal it.
          </p>
        </div>
      </section>

      <section className="max-w-7xl w-full border-x mx-auto bg-background">
        <FooterIllustrationCard />
      </section>

      <section className="max-w-7xl w-full border-x mx-auto px-4 lg:px-0 bg-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl border overflow-hidden m-0">
          {META.map((item) => (
            <div
              key={item.label}
              className="bg-background p-5 lg:p-6 flex flex-col gap-1"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl w-full border-x mx-auto px-4 lg:px-0 bg-border mt-px">
        <div className="bg-background border rounded-xl m-0 px-6 md:px-10 lg:px-16 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-lg font-medium">About this piece</h2>
            <p className="text-xs text-muted-foreground mt-2">
              Notes on how the wordmark is composed and how it responds to
              input.
            </p>
          </div>
          <ul className="md:col-span-2 flex flex-col gap-3 text-sm text-muted-foreground">
            {NOTES.map((note, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-1 size-1.5 rounded-full bg-foreground/40" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
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
