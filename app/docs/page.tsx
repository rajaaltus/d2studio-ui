import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { PUBLISHED_SPINNERS } from "@/lib/blocks";
import { PRO_LINK_PROPS, proShelfHref } from "@/lib/pro";
import { GITHUB_REPO_URL, SHADCN_DIRECTORY_URL } from "@/lib/site";
import registry from "@/registry.json";
import { DocsNav, type DocsNavGroup } from "./_components/docs-nav";
import { InstallCommand } from "./_components/install-command";
import { CodeSnippet } from "./_components/code-snippet";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Install D2 Studio blocks and components with the shadcn CLI. @d2 is listed in the official shadcn registry directory — no registry config needed.",
};

const ITEM_COUNT = registry.items.length;
const REGISTRY_URL = "https://ui.d2studio.dev/r/{name}.json";

const NAV: DocsNavGroup[] = [
  {
    title: "Get started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "installation", label: "Installation" },
      { id: "usage", label: "Usage" },
    ],
  },
  {
    title: "Registry",
    items: [
      { id: "namespace", label: "The @d2 namespace" },
      { id: "explore", label: "Search & view" },
      { id: "mcp", label: "MCP server" },
      { id: "configuration", label: "Configuration" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "library", label: "Library" },
      { id: "theming", label: "Theming" },
      { id: "pro", label: "Free & Pro" },
    ],
  },
  {
    title: "Resources",
    items: [
      { id: "open-source", label: "Open source" },
      { id: "changelog", label: "Changelog" },
      { id: "support", label: "Support" },
    ],
  },
];

const USAGE_SNIPPET = `import PricingSection from "@/components/pricing-01";

export default function Page() {
  return <PricingSection />;
}`;

const CONFIG_SNIPPET = `{
  "registries": {
    "@d2": "${REGISTRY_URL}"
  }
}`;

export default function DocsPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      <section className="mx-auto w-full max-w-7xl border-x px-4 lg:px-0">
        <div className="grid gap-8 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-14">
          <aside className="hidden min-w-0 lg:sticky lg:top-24 lg:block lg:self-start">
            <DocsNav groups={NAV} />
          </aside>

          <article className="min-w-0 max-w-3xl space-y-16">
            {/* ─── Get started ─────────────────────────────── */}
            <Section id="introduction">
              <Eyebrow>Documentation</Eyebrow>
              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-balance">
                D2 Studio
              </h1>
              <Lead>
                Copy-and-own React blocks, components and pixel spinners for
                shadcn/ui and Tailwind CSS v4. Every item installs through the
                shadcn CLI as source you can read and edit — no package to
                depend on, no runtime to upgrade.
              </Lead>

              <DirectoryCallout />

              <dl className="mt-6 grid grid-cols-3 divide-x rounded-xl border">
                <Stat label="Items" value={String(ITEM_COUNT)} />
                <Stat
                  label="Spinners"
                  value={String(PUBLISHED_SPINNERS.length)}
                />
                <Stat label="License" value="MIT" />
              </dl>
            </Section>

            <Section id="installation">
              <H2 id="installation">Installation</H2>
              <P>
                D2 Studio installs into any project already set up for
                shadcn/ui. Starting fresh? Initialise first.
              </P>

              <ol className="mt-6 space-y-8">
                <Step n={1} title="Initialise shadcn/ui">
                  <P>Skip this if your project has a components.json.</P>
                  <InstallCommand args="init" />
                </Step>
                <Step n={2} title="Add an item">
                  <P>
                    Prefix any item name with <Code>@d2/</Code>. The CLI
                    resolves the namespace from the shadcn directory, then
                    installs the file, its npm dependencies and any registry
                    items it builds on.
                  </P>
                  <InstallCommand args="add @d2/pricing-01" />
                </Step>
                <Step n={3} title="Add several at once">
                  <P>Names can be listed together, across registries too.</P>
                  <InstallCommand args="add @d2/bento-02 @d2/progress-bar" />
                </Step>
              </ol>
            </Section>

            <Section id="usage">
              <H2 id="usage">Usage</H2>
              <P>
                Items land under your <Code>components</Code> alias — sections
                in <Code>components/</Code>, primitives in{" "}
                <Code>components/ui/</Code>. Import them like any file you
                wrote yourself.
              </P>
              <div className="mt-5">
                <CodeSnippet filename="app/page.tsx" code={USAGE_SNIPPET} />
              </div>
              <P className="mt-5">
                The code is yours from here. Edit the markup, swap the copy,
                delete what you don&apos;t need. To see what changed upstream
                since, run <Code>add</Code> again with <Code>--diff</Code>.
              </P>
            </Section>

            {/* ─── Registry ────────────────────────────────── */}
            <Section id="namespace">
              <H2 id="namespace">The @d2 namespace</H2>
              <P>
                <Code>@d2</Code> is a community registry listed in the{" "}
                <TextLink href={SHADCN_DIRECTORY_URL} external>
                  shadcn registry directory
                </TextLink>
                . Every item is a JSON file served from:
              </P>
              <div className="mt-5 rounded-xl border bg-muted/30 px-4 py-3.5 font-mono text-[13px]">
                <span className="text-muted-foreground">
                  https://ui.d2studio.dev/r/
                </span>
                <span className="text-foreground">{"{name}"}</span>
                <span className="text-muted-foreground">.json</span>
              </div>
              <P className="mt-5">
                The item name is the same slug you see in the URL of a block on
                this site: <Code>/blocks/bento-02</Code> installs as{" "}
                <Code>@d2/bento-02</Code>.
              </P>
            </Section>

            <Section id="explore">
              <H2 id="explore">Search &amp; view</H2>
              <P>
                Browse the registry from your terminal before installing
                anything.
              </P>
              <div className="mt-5 space-y-6">
                <div>
                  <H3>Search by keyword</H3>
                  <InstallCommand args={`search @d2 -q "bento"`} />
                </div>
                <div>
                  <H3>Inspect an item&apos;s files and dependencies</H3>
                  <InstallCommand args="view @d2/bento-02" />
                </div>
                <div>
                  <H3>List everything</H3>
                  <InstallCommand args="list @d2" />
                </div>
              </div>
            </Section>

            <Section id="mcp">
              <H2 id="mcp">MCP server</H2>
              <P>
                The shadcn MCP server lets an AI assistant search and install
                from <Code>@d2</Code> in plain language. Set it up once for
                your client — <Code>claude</Code>, <Code>cursor</Code>,{" "}
                <Code>vscode</Code>, <Code>codex</Code> or{" "}
                <Code>opencode</Code>:
              </P>
              <div className="mt-5">
                <InstallCommand args="mcp init --client claude" />
              </div>
              <Quote>
                Add the pricing section from the @d2 registry to my home page.
              </Quote>
            </Section>

            <Section id="configuration">
              <H2 id="configuration">Configuration</H2>
              <P>
                None required. To pin the namespace to its URL — for an older
                CLI, an offline mirror or a locked-down CI — declare it in{" "}
                <Code>components.json</Code>:
              </P>
              <div className="mt-5">
                <CodeSnippet filename="components.json" code={CONFIG_SNIPPET} />
              </div>
              <P className="mt-5">
                Or skip namespaces entirely and install straight from the URL:
              </P>
              <div className="mt-5">
                <InstallCommand args="add https://ui.d2studio.dev/r/pricing-01.json" />
              </div>
            </Section>

            {/* ─── Guides ──────────────────────────────────── */}
            <Section id="library">
              <H2 id="library">Library</H2>
              <P>
                Every item has a live preview, its source and a one-click
                install command.
              </P>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <LibraryCard
                  href="/blocks"
                  title="Blocks"
                  body="Composed sections — heroes, bentos, pricing, dashboards."
                />
                <LibraryCard
                  href="/components"
                  title="Components"
                  body="Smaller pieces — buttons, progress, cards, text effects."
                />
                <LibraryCard
                  href="/spinners"
                  title="Spinners"
                  body="Pixel-grid loaders. Tune colour, size and speed, then copy."
                />
                <LibraryCard
                  href="/cosmo"
                  title="Cosmo"
                  body="A particle motion playground for shaping cosmic fields."
                />
              </div>
            </Section>

            <Section id="theming">
              <H2 id="theming">Theming</H2>
              <P>
                Items read the shadcn/ui tokens — <Code>--background</Code>,{" "}
                <Code>--foreground</Code>, <Code>--muted</Code>,{" "}
                <Code>--border</Code> and the rest — so they follow your palette
                and switch with your <Code>.dark</Code> class.
              </P>
              <P className="mt-4">
                A few items need styles of their own, such as keyframes or
                scoped variables. Those ship inside the item, and the CLI
                merges them into your global stylesheet on install. Motion
                respects <Code>prefers-reduced-motion</Code> throughout.
              </P>
            </Section>

            <Section id="pro">
              <H2 id="pro">Free &amp; Pro</H2>
              <P>
                Everything in <Code>@d2</Code> is free and MIT-licensed. D2 Pro
                adds premium blocks, illustrations and templates, marked{" "}
                <span className="font-medium text-foreground">Pro</span> across
                this site.
              </P>
              <div className="mt-5">
                <a
                  href={proShelfHref("/blocks", "docs")}
                  {...PRO_LINK_PROPS}
                  className="group inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-[border-color,transform] duration-150 ease-out hover:border-foreground/25 active:scale-[0.97]"
                >
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--d2-flash-gradient)" }}
                  >
                    Explore D2 Pro
                  </span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
              </div>
            </Section>

            {/* ─── Resources ───────────────────────────────── */}
            <Section id="open-source">
              <H2 id="open-source">Open source</H2>
              <P>
                The site, the registry and every free item live in one public
                repository. The registry is generated from source on each
                deploy, so what you read on GitHub is what the CLI installs.
              </P>
              <div className="mt-5">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-[border-color,transform] duration-150 ease-out hover:border-foreground/25 active:scale-[0.99]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-sm text-foreground">
                      rajaaltus/d2studio-ui
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      MIT License · Issues and pull requests welcome
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
              </div>
            </Section>

            <Section id="changelog">
              <H2 id="changelog">Changelog</H2>
              <ol className="mt-5 space-y-5">
                <ChangelogEntry date="2026-09-16" title="Listed in the shadcn directory">
                  <Code>@d2</Code> joined the official registry directory.
                  Install with <Code>@d2/&lt;name&gt;</Code> — no{" "}
                  <Code>components.json</Code> entry needed.
                </ChangelogEntry>
                <ChangelogEntry date="2026-09-15" title="Open-sourced under MIT">
                  The repository went public, and every registry item now
                  declares the npm packages it imports.
                </ChangelogEntry>
              </ol>
            </Section>

            <Section id="support">
              <H2 id="support">Support</H2>
              <P>
                Found a bug or an install that fails? Open an issue with the
                item name and the command you ran.
              </P>
              <div className="mt-5">
                <TextLink href={`${GITHUB_REPO_URL}/issues/new`} external>
                  Open an issue on GitHub
                </TextLink>
              </div>
            </Section>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/* ─── Building blocks ─────────────────────────────────────── */

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 className="group mb-3 flex items-baseline gap-2 text-2xl font-medium tracking-tight">
      <a href={`#${id}`} className="outline-none focus-visible:underline">
        {children}
      </a>
      <span
        aria-hidden
        className="font-mono text-base text-muted-foreground/50 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
      >
        #
      </span>
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-sm font-medium text-foreground">{children}</h3>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed text-pretty text-muted-foreground">
      {children}
    </p>
  );
}

function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm leading-relaxed text-pretty text-muted-foreground ${className}`}
    >
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border bg-muted/50 px-1 py-px font-mono text-[0.8125rem] text-foreground">
      {children}
    </code>
  );
}

function TextLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground";
  if (!external) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight aria-hidden className="size-3.5 text-muted-foreground" />
    </a>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-0 top-0 flex size-6 items-center justify-center rounded-md border bg-background font-mono text-xs text-muted-foreground"
      >
        {n}
      </span>
      <h3 className="mb-1.5 text-base font-medium leading-6 text-foreground">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-xl tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 border-l-2 pl-4 text-sm italic text-muted-foreground">
      &ldquo;{children}&rdquo;
    </p>
  );
}

function LibraryCard({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border p-4 transition-[border-color,transform] duration-150 ease-out hover:border-foreground/25 active:scale-[0.99]"
    >
      <span className="flex items-center justify-between text-sm font-medium text-foreground">
        {title}
        <span
          aria-hidden
          className="text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
        {body}
      </span>
    </Link>
  );
}

function ChangelogEntry({
  date,
  title,
  children,
}: {
  date: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="grid gap-1 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6">
      <time dateTime={date} className="font-mono text-xs leading-6 text-muted-foreground">
        {date}
      </time>
      <div>
        <p className="text-sm font-medium leading-6 text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {children}
        </p>
      </div>
    </li>
  );
}

/**
 * The listing announcement. Carries the same D2 mark shadcn shows beside the
 * entry in its directory, so the two surfaces are recognisably one thing.
 */
function DirectoryCallout() {
  return (
    <a
      href={SHADCN_DIRECTORY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 flex items-center gap-4 rounded-xl border bg-muted/30 p-4 transition-[border-color,transform] duration-150 ease-out hover:border-foreground/25 active:scale-[0.99]"
    >
      <svg
        aria-hidden
        viewBox="0 0 41 30"
        fill="none"
        className="h-8 w-auto shrink-0"
      >
        <rect x="0.5" y="0.5" width="40" height="29" rx="5.5" fill="var(--foreground)" />
        <path
          d="M9.86 22V7.8H13.52C14.8533 7.8 15.9867 8.07333 16.92 8.62C17.8667 9.16667 18.5933 9.97333 19.1 11.04C19.6067 12.0933 19.86 13.38 19.86 14.9C19.86 16.42 19.6067 17.7067 19.1 18.76C18.5933 19.8133 17.8667 20.62 16.92 21.18C15.9867 21.7267 14.8533 22 13.52 22H9.86ZM12.72 19.44H13.54C14.6467 19.44 15.4867 19.0667 16.06 18.32C16.6467 17.56 16.94 16.42 16.94 14.9C16.94 13.3933 16.6467 12.26 16.06 11.5C15.4867 10.74 14.6467 10.36 13.54 10.36H12.72V19.44ZM20.5722 22C20.5722 20.8533 20.7189 19.8467 21.0122 18.98C21.3189 18.1 21.8455 17.3 22.5922 16.58C23.3522 15.86 24.3855 15.16 25.6922 14.48C26.1855 14.2267 26.5922 13.98 26.9122 13.74C27.2322 13.5 27.4722 13.2333 27.6322 12.94C27.7922 12.6467 27.8722 12.2867 27.8722 11.86C27.8722 11.4733 27.7989 11.1467 27.6522 10.88C27.5055 10.6 27.2922 10.3867 27.0122 10.24C26.7322 10.08 26.3789 10 25.9522 10C25.2322 10 24.6855 10.2067 24.3122 10.62C23.9522 11.02 23.7055 11.6 23.5722 12.36L20.6322 12.18C20.7789 10.7267 21.2989 9.58 22.1922 8.74C23.0989 7.9 24.3655 7.48 25.9922 7.48C27.0589 7.48 27.9455 7.66 28.6522 8.02C29.3722 8.36667 29.9122 8.85333 30.2722 9.48C30.6322 10.1067 30.8122 10.8467 30.8122 11.7C30.8122 12.46 30.6922 13.1133 30.4522 13.66C30.2122 14.2067 29.8189 14.7067 29.2722 15.16C28.7255 15.6133 27.9789 16.1 27.0322 16.62C26.2722 17.0333 25.6589 17.4133 25.1922 17.76C24.7389 18.0933 24.4055 18.4 24.1922 18.68C23.9789 18.9467 23.8589 19.2 23.8322 19.44H30.8122V22H20.5722Z"
          fill="var(--background)"
        />
      </svg>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-foreground">
            Now in the shadcn registry directory
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-px font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Live
          </span>
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          Install anything with <Code>@d2/&lt;name&gt;</Code> — no registry
          config.
        </span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:-translate-y-px group-hover:translate-x-px"
      />
    </a>
  );
}
