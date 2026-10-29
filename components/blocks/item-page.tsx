import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { PreviewWrapper } from "@/components/preview/preview-wrapper";
import { AutoHeightFrame } from "@/components/preview/auto-height-frame";
import { Badge } from "@/components/ui/badge";
import { SHELVED, findBlock } from "@/lib/blocks";

type Shelf = "blocks";

// The /blocks detail page. /components/<name> has its own docs page
// (app/components/[name]/page.tsx); this stays keyed by shelf so another
// gallery-style shelf can reuse it. Its back link lives in the floating dock.

export const shelfParams = (shelf: Shelf) =>
  SHELVED.filter((b) => b.shelf === shelf).map((b) => ({ name: b.name }));

export async function shelfMetadata(params: Promise<{ name: string }>) {
  const block = findBlock((await params).name);
  if (!block) return {};
  return { title: block.title, description: block.description };
}

/**
 * The built item, read off disk. It is what the install command actually
 * serves, so the Code tab shows the shipped file rather than the working tree,
 * and `type` decides whether the preview loads from ui/ or components/ without
 * that being written down a second time in lib/blocks.ts.
 */
async function builtItem(name: string) {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "public", "r", `${name}.json`),
      "utf8",
    );
    const item = JSON.parse(raw) as {
      type: string;
      files: { path: string; content: string }[];
    };
    const source =
      item.files.length === 1
        ? item.files[0].content
        : item.files.map((f) => `// ${f.path}\n\n${f.content}`).join("\n\n");
    return { kind: item.type === "registry:ui" ? "ui" : "component", source };
  } catch {
    return { kind: "component", source: undefined };
  }
}

export async function ItemPage({ name, shelf }: { name: string; shelf: Shelf }) {
  const block = findBlock(name);
  if (!block || block.shelf !== shelf) notFound();

  const { kind, source } = await builtItem(block.name);
  // A block that draws nothing without props (button-beam) gets a site-only demo,
  // the same examples/ route the primitives' docs use.
  const hasDemo = existsSync(
    path.join(process.cwd(), "registry", "default", "examples", `${block.name}-demo.tsx`),
  );
  const previewType = hasDemo ? "example" : kind;
  const comingSoon = block.status === "coming_soon";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      {/* Header Section */}
      <section className="w-full max-w-7xl border-x mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-2 py-6">
          <h1 className="text-base font-medium font-sans">{block.title}</h1>
          {comingSoon && <Badge variant="secondary">Code Coming Soon</Badge>}
        </div>
      </section>

      {/* Preview Section */}
      <section className="w-full">
        <PreviewWrapper
          componentName={block.name}
          code={comingSoon ? undefined : source}
          codeStatus={block.status}
          minHeight={`${block.previewHeight ?? 600}px`}
        >
          <AutoHeightFrame
            src={`/preview/${block.name}?type=${previewType}`}
            title={`Preview for ${block.name}`}
            minHeight={block.previewHeight}
          />
        </PreviewWrapper>
      </section>

      <SiteFooter />
    </div>
  );
}
