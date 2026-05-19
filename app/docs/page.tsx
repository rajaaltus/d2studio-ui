import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Documentation for D2 Studio components, blocks, and utilities.",
};

type SectionLink = { id: string; label: string };
type NavGroup = { title: string; items: SectionLink[] };

const NAV: NavGroup[] = [
  {
    title: "Get Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "components", label: "Components" },
      { id: "blocks", label: "Blocks" },
      { id: "theming", label: "Theming" },
    ],
  },
  {
    title: "Resources",
    items: [
      { id: "spinners", label: "Spinners" },
      { id: "registry", label: "Registry" },
      { id: "support", label: "Support" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <section className="w-full max-w-6xl border-x mx-auto px-4 lg:px-0">
        <div className="grid gap-8 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:py-14 lg:px-8">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <nav className="space-y-6 text-sm">
              {NAV.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.title}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 max-w-none space-y-14">
            <section id="introduction" className="scroll-mt-24">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Documentation
              </p>
              <h1 className="mb-4 text-4xl font-semibold tracking-tight">
                D2 Studio
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                D2 Studio is a collection of copy-and-paste React components,
                blocks, and utilities built with shadcn/ui, Tailwind CSS, and
                TypeScript. Everything is open source, accessible, and designed
                to be production-ready.
              </p>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Installation
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Pull any component into your project using the shadcn CLI. Make
                sure you have the CLI initialized first.
              </p>
              <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs">
                <code>pnpm dlx shadcn@latest add @d2studio/hero-section</code>
              </pre>
            </section>

            <section id="quick-start" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Quick Start
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Import the component in any page or layout. It works out of the
                box with shadcn&apos;s theme tokens.
              </p>
              <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs">
                <code>{`import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return <HeroSection />;
}`}</code>
              </pre>
            </section>

            <section id="components" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Components
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The component library includes navigation, hero sections,
                pricing cards, testimonials, and more. Every component is
                accessible, themeable, and TypeScript-first.
              </p>
            </section>

            <section id="blocks" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Blocks
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Blocks are fully composed page sections ready to drop into your
                project. Browse the{" "}
                <Link href="/blocks" className="underline hover:text-foreground">
                  Blocks gallery
                </Link>
                .
              </p>
            </section>

            <section id="theming" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Theming
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every component uses shadcn/ui design tokens —
                <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --background
                </code>
                ,
                <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --foreground
                </code>
                ,
                <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  --primary
                </code>
                — so light and dark modes work automatically.
              </p>
            </section>

            <section id="spinners" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Spinners
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                The Pixel Glow Spinners tool lets you tune color, size, spacing,
                speed, and glow — then copy the HTML, CSS, or React snippet.
              </p>
              <Link
                href="/spinners"
                className="inline-flex items-center gap-2 rounded-md border bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Open Spinners →
              </Link>
            </section>

            <section id="registry" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Registry
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Components are distributed through a shadcn-compatible
                registry. Each item ships with its dependencies, styles, and
                TypeScript types.
              </p>
            </section>

            <section id="support" className="scroll-mt-24">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight">
                Support
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Found a bug or have a feature request? Open an issue on GitHub
                and we&apos;ll take a look.
              </p>
            </section>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
