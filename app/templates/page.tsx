import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { ProGrid, ProCta } from "@/components/blocks/pro-grid";
import { proItemsFor, type CatalogItem } from "@/lib/catalog";
import { proShelfHref } from "@/lib/pro";

export const metadata: Metadata = {
  title: "Templates — D2 Studio",
  description:
    "Whole pages rather than sections: landing pages built from the block library, in React, TypeScript and Tailwind CSS.",
};

// The one template this site hosts itself. It is a page, not a registry item,
// so it is written here rather than pulled from a catalogue — a second one
// would be the moment to give these a data file of their own.
const OWN_TEMPLATES: CatalogItem[] = [
  {
    name: "marketing-grid",
    title: "Marketing Grid",
    subtitle: "Landing",
    description:
      "A landing page laid out as one grid with a 1px gap, so the page colour is only ever seen through the seams between panels.",
    categories: ["landing"],
    tier: "free",
    status: "available",
    image: "/templates/marketing-grid.jpg",
    fit: "cover",
    href: "/templates/marketing-grid",
    external: false,
    keywords: "marketing grid landing page seams panels free",
  },
];

export default function TemplatesPage() {
  const proTemplates = proItemsFor("templates", "templates");
  const templates = [...OWN_TEMPLATES, ...proTemplates];

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <section className="mx-auto w-full max-w-7xl border-x">
        <div className="flex flex-col gap-4 px-4 py-16 md:px-10 lg:px-16 lg:py-24">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Whole pages
          </span>
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
            Templates
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            A block is a section; a template is the page it belongs to. Each one
            is assembled from the same registry, so a section you like on a
            template is a section you can install on its own.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl flex-1 border-x border-t">
        <div className="flex flex-col gap-10 p-4 md:p-6">
          <ProGrid items={templates} />

          <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">More templates on D2 Pro</p>
              <p className="text-sm text-muted-foreground">
                Full pages built from the Pro block library, with the licence
                that installs every section in them.
              </p>
            </div>
            <ProCta href={proShelfHref("/blocks", "templates")}>
              Browse D2 Pro
            </ProCta>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
