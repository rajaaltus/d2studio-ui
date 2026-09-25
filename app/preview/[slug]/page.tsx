"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, Suspense } from "react";
import { useTheme } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";
import { TooltipProvider } from "@/registry/default/ui/tooltip";

// 48px diagonal hatch: 1px lines 6px apart, running bottom-left to top-right.
const HATCH_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g stroke="#000">' +
    // Ends on .5 so each 1px stroke sits on one pixel row; 17 lines cover the
    // tile, and 48 being a multiple of 6 makes it repeat seamlessly.
    Array.from({ length: 17 }, (_, i) => -49.5 + i * 6)
        .map((x) => `<path d="M${x + 50} -1.5L${x} 48.5"/>`)
        .join("") +
    "</g></svg>";
const HATCH = `url("data:image/svg+xml,${encodeURIComponent(HATCH_SVG)}")`;

// Many registry items export a single named component instead of a default.
function resolveComponent(mod: Record<string, unknown>) {
    if (mod.default) return { default: mod.default as React.ComponentType };
    const found = Object.values(mod).find(
        (v) => typeof v === "function" && /^[A-Z]/.test(v.name)
    );
    if (!found) throw new Error("no component export");
    return { default: found as React.ComponentType };
}

function PreviewContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { setTheme } = useTheme();
    const slug = params.slug as string;
    const theme = searchParams.get("theme");
    const type = searchParams.get("type") || "component";

    useEffect(() => {
        // Handle theme from URL
        if (theme === "dark" || theme === "light") {
            setTheme(theme);
        }
    }, [theme, setTheme]);

    const Component = useMemo(() => {
        if (!slug) return null;

        // Clean up the type if it has a prefix (like registry:ui -> ui)
        const cleanType = type.split(":").pop() || "component";
        const folder = (cleanType === "ui" || cleanType === "registry:ui") ? "ui" : "components";

        // A primitive's demo, drawn for the /components shelf.
        if (cleanType === "example") {
            return dynamic(() => import(`@/registry/default/examples/${slug}-demo`).then(resolveComponent).catch((err) => {
                console.error(`Failed to load example: ${slug}`, err);
                return function ExampleNotFound() {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg text-muted-foreground gap-2">
                            <p className="font-medium text-destructive">Example Not Found</p>
                            <p className="text-sm">Could not find &quot;@registry/default/examples/${slug}-demo.tsx&quot;</p>
                        </div>
                    );
                };
            }), { ssr: false });
        }

        if (folder === "ui") {
            return dynamic(() => import(`@/registry/default/ui/${slug}`).then(resolveComponent).catch((err) => {
                console.error(`Failed to load UI component: ${slug}`, err);
                return function UIComponentNotFound() {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg text-muted-foreground gap-2">
                            <p className="font-medium text-destructive">UI Component Not Found</p>
                            <p className="text-sm">Could not find &quot;@registry/default/ui/${slug}.tsx&quot;</p>
                        </div>
                    );
                };
            }), { ssr: false });
        } else {
            return dynamic(() => import(`@/registry/default/components/${slug}`).then(resolveComponent).catch((err) => {
                console.error(`Failed to load component: ${slug}`, err);
                return function ComponentNotFound() {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg text-muted-foreground gap-2">
                            <p className="font-medium text-destructive">Component Not Found</p>
                            <p className="text-sm">Could not find &quot;@registry/default/components/${slug}.tsx&quot;</p>
                        </div>
                    );
                };
            }), { ssr: false });
        }
    }, [slug, type]);

    if (!Component) return null;

    return (
        // .luminous-spinners scopes the .cell/.spinner-grid rules in globals.css
        <div
            className={
                type === "example"
                    // A demo is one control; centred on a muted, hatched stage it
                    // reads as a specimen lifted off the page, not more of the page.
                    ? "luminous-spinners relative isolate flex min-h-screen items-center justify-center bg-muted/60 p-4 sm:p-8"
                    : "luminous-spinners min-h-screen bg-background p-4 sm:p-8"
            }
        >
            {type === "example" && (
                // The hatch is a mask over a foreground-coloured layer rather than
                // a tinted image, so the lines follow the theme instead of staying
                // dark-on-light in dark mode.
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 bg-foreground opacity-15"
                    style={{ maskImage: HATCH, WebkitMaskImage: HATCH, maskSize: "48px 48px", WebkitMaskSize: "48px 48px" }}
                />
            )}
            {/* shadcn's tooltip expects a provider at the app root; a demo gets the same. */}
            <TooltipProvider>
                <Component />
            </TooltipProvider>
        </div>
    );
}

export default function PreviewPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <PreviewContent />
        </Suspense>
    );
}
