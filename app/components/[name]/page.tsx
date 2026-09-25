import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CodeFrame } from "@/components/docs/code-frame";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsNav } from "@/components/docs/docs-nav";
import { InstallCommand, PackageInstall } from "@/components/docs/install-command";
import { InstallTabs } from "@/components/docs/install-tabs";
import { Code, H2, Lead, P, Section, Step } from "@/components/docs/prose";
import {
  COMPONENT_ORDER,
  designedWith,
  findComponent,
  groupOf,
  neighbours,
} from "@/lib/components-docs";
import { asInstalled, highlight } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENT_ORDER.map((c) => ({ name: c.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const item = findComponent((await params).name);
  if (!item) return {};
  return { title: `${item.title} — Components`, description: item.description };
}

// Demos laid out like a page or a panel need the room; one control does not.
const TALL = new Set([
  "calendar", "chart", "command", "context-menu", "drawer", "field", "form", "sheet",
  "sidebar", "table", "message-scroller", "dropdown-menu", "combobox", "select", "tabs",
]);

type BuiltItem = {
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; content: string }[];
};

/** The built item: what `shadcn add @d2/<name>` serves, so Manual matches it. */
async function built(name: string): Promise<BuiltItem> {
  const raw = await readFile(path.join(process.cwd(), "public", "r", `${name}.json`), "utf8");
  return JSON.parse(raw);
}

async function demo(name: string) {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "registry", "default", "examples", `${name}-demo.tsx`),
      "utf8",
    );
    return asInstalled(raw);
  } catch {
    return undefined;
  }
}

/** What a file exports, for the Usage import line. */
function exportsOf(source: string): string[] {
  const block = source.match(/export\s*\{([^}]*)\}/);
  if (block) {
    return block[1]
      .split(",")
      .map((s) => s.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop()!)
      .filter((s) => /^[A-Z]/.test(s));
  }
  return [...source.matchAll(/export\s+function\s+([A-Z]\w*)/g)].map((m) => m[1]);
}

const TOC = [
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "use-cases", label: "Use cases" },
];

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const item = findComponent(name);
  if (!item) notFound();

  const [pkg, demoSource] = await Promise.all([built(name), demo(name)]);
  const file = pkg.files[0];
  const source = asInstalled(file.content);
  const target = file.path.includes("/hooks/") ? `hooks/${name}.ts` : `components/ui/${name}.tsx`;
  const exported = exportsOf(source);
  const usage = `import {\n${exported.map((e) => `  ${e},`).join("\n")}\n} from "@/components/ui/${name}"`;
  const siblings = (pkg.registryDependencies ?? []).map((u) => u.split("/").pop()!.replace(/\.json$/, ""));

  const [sourceHtml, usageHtml, demoHtml] = await Promise.all([
    highlight(source),
    highlight(usage),
    demoSource ? highlight(demoSource) : Promise.resolve(""),
  ]);

  const group = groupOf(name);
  const { prev, next } = neighbours(name);
  const useCases = designedWith(name);

  return (
    <div className="grid gap-10 px-4 py-10 md:px-8 lg:py-12 xl:grid-cols-[minmax(0,1fr)_180px] xl:gap-12">
      <article className="min-w-0 max-w-3xl space-y-14">
        <header>
          <div className="mb-4 flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link href="/components" className="transition-colors duration-150 hover:text-foreground">
                Components
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/50" />
              <span>{group?.label}</span>
            </nav>
            <div className="flex items-center gap-1">
              <PagerIcon href={prev && `/components/${prev.name}`} label={prev && `Previous: ${prev.title}`}>
                <ChevronLeft className="size-4" />
              </PagerIcon>
              <PagerIcon href={next && `/components/${next.name}`} label={next && `Next: ${next.title}`}>
                <ChevronRight className="size-4" />
              </PagerIcon>
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">{item.title}</h1>
          <Lead>{item.description}</Lead>
          {(pkg.dependencies?.length || siblings.length) ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {[...(pkg.dependencies ?? []), ...siblings.map((s) => `@d2/${s}`)].map((d) => (
                <span key={d} className="rounded-md border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <Section id="preview">
          <ComponentPreview
            name={name}
            height={TALL.has(name) ? 520 : 380}
            code={
              demoSource ? (
                <CodeFrame html={demoHtml} code={demoSource} filename={`${name}-demo.tsx`} collapsible />
              ) : null
            }
          />
        </Section>

        <Section id="installation">
          <H2 id="installation">Installation</H2>
          <InstallTabs
            cli={<InstallCommand args={`add @d2/${name}`} />}
            manual={
              <ol className="space-y-8">
                {pkg.dependencies?.length ? (
                  <Step n={1} title="Install the dependencies">
                    <PackageInstall packages={pkg.dependencies} />
                  </Step>
                ) : null}
                {siblings.length ? (
                  <Step n={pkg.dependencies?.length ? 2 : 1} title="Add the components it builds on">
                    <InstallCommand args={`add ${siblings.map((s) => `@d2/${s}`).join(" ")}`} />
                  </Step>
                ) : null}
                <Step
                  n={1 + (pkg.dependencies?.length ? 1 : 0) + (siblings.length ? 1 : 0)}
                  title="Copy the source into your project"
                >
                  <CodeFrame html={sourceHtml} code={source} filename={target} collapsible />
                  <P>Update the import paths if your aliases differ from the defaults.</P>
                </Step>
              </ol>
            }
          />
          {item.docs ? <P className="mt-5">{item.docs.replace(/`/g, "")}</P> : null}
        </Section>

        <Section id="usage">
          <H2 id="usage">Usage</H2>
          <CodeFrame html={usageHtml} code={usage} />
          <P className="mt-4">
            The Code tab above is a complete, working example. Once installed the file is yours: edit{" "}
            <Code>{target}</Code> as you would any component you wrote.
          </P>
        </Section>

        <Section id="use-cases">
          <H2 id="use-cases">Use cases</H2>
          {useCases.length ? (
            <>
              <P className="mb-5">Designed D2 blocks built on {item.title}, free to install.</P>
              <div className="grid gap-4 sm:grid-cols-2">
                {useCases.map((b) => (
                  <Link
                    key={b.name}
                    href={`/blocks/${b.name}`}
                    className="group overflow-hidden rounded-xl border transition-[border-color] duration-150 hover:border-foreground/25"
                  >
                    <div className="relative aspect-video overflow-hidden border-b bg-muted">
                      <Image
                        src={b.image ?? "/placeholder.svg"}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 360px, 100vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium">{b.title}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">@d2/{b.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed px-5 py-6">
              <P>
                Designed use cases for {item.title} are on the way. Until then, browse the{" "}
                <Link href="/blocks" className="font-medium text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground">
                  blocks
                </Link>{" "}
                built on the rest of the set.
              </P>
            </div>
          )}
        </Section>

        <nav aria-label="Pagination" className="grid grid-cols-2 gap-4 border-t pt-8">
          <Pager item={prev} href={prev && `/components/${prev.name}`} direction="prev" />
          <Pager item={next} href={next && `/components/${next.name}`} direction="next" />
        </nav>
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <DocsNav groups={[{ title: "On this page", items: TOC }]} />
        </div>
      </aside>
    </div>
  );
}

function PagerIcon({ href, label, children }: { href?: string; label?: string; children: React.ReactNode }) {
  const className =
    "inline-flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out";
  if (!href) {
    return (
      <span aria-hidden className={cn(className, "opacity-40")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(className, "hover:bg-muted hover:text-foreground active:scale-[0.94]")}>
      {children}
    </Link>
  );
}

function Pager({
  item,
  href,
  direction,
}: {
  item?: { title: string };
  href?: string;
  direction: "prev" | "next";
}) {
  if (!item || !href) return <span />;
  const next = direction === "next";
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-1 rounded-xl border px-4 py-3 transition-[border-color,background-color] duration-150 hover:border-foreground/25 hover:bg-muted/40",
        next && "col-start-2 items-end text-right",
      )}
    >
      <span className="text-xs text-muted-foreground">{next ? "Next" : "Previous"}</span>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium">
        {!next && (
          <ArrowLeft className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
        )}
        {item.title}
        {next && (
          <ArrowRight className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        )}
      </span>
    </Link>
  );
}
