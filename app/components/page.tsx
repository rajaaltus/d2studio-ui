import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlockCard } from "@/components/blocks/block-card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocsNav } from "@/components/docs/docs-nav";
import { InstallCommand } from "@/components/docs/install-command";
import { Eyebrow, H2, Lead, P, Section } from "@/components/docs/prose";
import { proItemsFor } from "@/lib/catalog";
import { COMPONENT_GROUPS, COMPONENT_ORDER } from "@/lib/components-docs";

export const metadata: Metadata = {
  title: "Components — D2 Studio",
  description:
    "Every shadcn/ui primitive, served from the @d2 registry, with live previews, source and install commands. Plus pro components for React and Tailwind CSS.",
};

// The overview is the index the rail summarises: one visual row per group, so a
// reader who does not know the name of what they want can find it by shape.
export default function ComponentsPage() {
  const pro = proItemsFor("components", "components", COMPONENT_ORDER.map((c) => c.name));
  const toc = [
    ...COMPONENT_GROUPS.map((g) => ({ id: g.slug, label: g.label })),
    ...(pro.length ? [{ id: "pro", label: "Pro" }] : []),
  ];

  return (
    <div className="grid gap-10 px-4 py-10 md:px-8 lg:py-12 xl:grid-cols-[minmax(0,1fr)_180px] xl:gap-12">
      <article className="min-w-0 space-y-14">
        <Section id="introduction">
          <Eyebrow>Components</Eyebrow>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {COMPONENT_ORDER.length} components, one namespace
          </h1>
          <div className="max-w-2xl space-y-5">
            <Lead>
              The complete shadcn/ui set, served from <code className="font-mono text-foreground">@d2</code> so
              every primitive and every designed D2 block installs from one place. Each page has a live
              preview, the source and the command.
            </Lead>
            <InstallCommand args="add @d2/button @d2/card" />
          </div>
        </Section>

        {COMPONENT_GROUPS.map((group) => (
          <Section key={group.slug} id={group.slug}>
            <H2 id={group.slug}>{group.label}</H2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.items.map((c) => (
                <Link
                  key={c.name}
                  href={`/components/${c.name}`}
                  className="group overflow-hidden rounded-xl border bg-card transition-[border-color] duration-150 hover:border-foreground/25 active:scale-[0.99]"
                >
                  <div className="relative aspect-video overflow-hidden border-b bg-muted">
                    <Image
                      src={`/ui/${c.name}.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="px-3 py-2 text-sm font-medium">{c.title}</p>
                </Link>
              ))}
            </div>
          </Section>
        ))}

        {pro.length > 0 && (
          <Section id="pro">
            <H2 id="pro">Pro</H2>
            <P className="mb-5 max-w-2xl">
              Hand-built controls sold on D2 Pro: sliders, pickers, toggles and more. Each opens on
              pro.d2studio.dev.
            </P>
            <TooltipProvider delayDuration={200}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pro.map((item) => (
                  <BlockCard key={item.name} item={item} />
                ))}
              </div>
            </TooltipProvider>
          </Section>
        )}
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <DocsNav groups={[{ title: "On this page", items: toc }]} />
        </div>
      </aside>
    </div>
  );
}
