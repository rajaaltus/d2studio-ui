import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import { PreviewWrapper } from "@/components/preview/preview-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SHELVED, findBlock } from "@/lib/blocks";

export const dynamicParams = false;

export function generateStaticParams() {
  return SHELVED.map((b) => ({ name: b.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
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

export default async function BlockPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const block = findBlock((await params).name);
  if (!block) notFound();

  const { kind, source } = await builtItem(block.name);
  const comingSoon = block.status === "coming_soon";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="outline-none" />

      {/* Header Section */}
      <section className="w-full max-w-7xl border-x mx-auto px-4 lg:px-8">
        <div className="py-8">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
            <Link href="/blocks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blocks
            </Link>
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold font-sans mb-2">
              {block.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {block.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {block.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
              {comingSoon && <Badge variant="secondary">Code Coming Soon</Badge>}
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="w-full">
        <PreviewWrapper
          componentName={block.name}
          code={comingSoon ? undefined : source}
          codeStatus={block.status}
          minHeight="500px"
        >
          <div className="w-full h-full min-h-[600px] bg-background">
            <iframe
              src={`/preview/${block.name}?type=${kind}`}
              className="w-full h-full min-h-[600px] border-none"
              title={`Preview for ${block.name}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </PreviewWrapper>
      </section>

      {/* Metadata Section */}
      <section className="w-full max-w-7xl border-x mx-auto px-4 lg:px-8 py-8">
        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Block Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Author</p>
              <p className="font-medium">{block.author ?? "D2 Studio"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Version</p>
              <p className="font-medium">{block.version ?? "1.0.0"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <p className="font-medium capitalize">{kind}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Code Status</p>
              <p className="font-medium">
                {comingSoon ? "Coming Soon" : "Available"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
