import Link from "next/link";
import registry from "@/registry.json";

export const metadata = { title: "Component Showcase" };

export default function DemoPage() {
    // The "ui" category marks shadcn primitives — nothing to show standalone.
    const items = registry.items.filter((i) => !i.categories?.includes("spinner"));
    const primitives = items.filter((i) => i.categories?.includes("ui"));
    const showcased = items.filter((i) => !i.categories?.includes("ui"));

    return (
        <div className="min-h-screen bg-background px-6 py-10 sm:px-10">
            <header className="mx-auto max-w-5xl">
                <h1 className="text-2xl font-semibold">Component Showcase</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {showcased.length} of {items.length} registry items rendered below.
                </p>
            </header>

            <div className="mx-auto mt-10 max-w-5xl space-y-12">
                {showcased.map((item) => (
                    <section key={item.name} id={item.name} className="scroll-mt-8">
                        <div className="mb-3 flex items-baseline justify-between gap-4">
                            <div>
                                <h2 className="font-medium">{item.title ?? item.name}</h2>
                                <p className="font-mono text-xs text-muted-foreground">{item.name}</p>
                            </div>
                            <Link
                                href={`/preview/${item.name}?type=${item.type}`}
                                target="_blank"
                                className="shrink-0 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                            >
                                Open full page
                            </Link>
                        </div>
                        {item.description && (
                            <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <iframe
                            src={`/preview/${item.name}?type=${item.type}`}
                            title={item.name}
                            loading="lazy"
                            className="h-[560px] w-full rounded-lg border bg-background"
                        />
                    </section>
                ))}
            </div>

            <section className="mx-auto mt-16 max-w-5xl border-t pt-8">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Primitives ({primitives.length})
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Named exports with no standalone demo.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {primitives.map((item) => (
                        <span
                            key={item.name}
                            className="rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground"
                        >
                            {item.name}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
}
