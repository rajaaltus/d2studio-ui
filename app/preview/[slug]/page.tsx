"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, Suspense } from "react";
import { useTheme } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";

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
        <div className="luminous-spinners min-h-screen bg-background p-4 sm:p-8">
            <Component />
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
