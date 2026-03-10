"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface PreviewIframeProps {
    slug: string;
    type: string;
    theme?: "light" | "dark";
    width: "mobile" | "tablet" | "desktop" | "full";
}

const VIEWPORT_WIDTHS = {
    mobile: "max-w-[375px]",
    tablet: "max-w-[768px]",
    desktop: "max-w-[1280px]",
    full: "max-w-full",
};

export function PreviewIframe({ slug, type, theme = "light", width }: PreviewIframeProps) {
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = `/preview/${slug}`;
    const queryParams = new URLSearchParams({
        theme,
        type,
    });
    const iframeSrc = `${baseUrl}?${queryParams.toString()}`;

    useEffect(() => {
        setIsLoading(true);
    }, [iframeSrc]);

    return (
        <div className="flex flex-col items-center w-full min-h-[500px] bg-muted/30 rounded-xl border border-border/50 overflow-hidden">
            <div className={cn(
                "w-full h-[600px] transition-all duration-300 ease-in-out relative bg-background border shadow-sm my-4 rounded-lg",
                VIEWPORT_WIDTHS[width]
            )}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                <iframe
                    src={iframeSrc}
                    className="w-full h-full border-none"
                    onLoad={() => setIsLoading(false)}
                    sandbox="allow-scripts allow-same-origin"
                    title={`Preview for ${slug}`}
                />
            </div>
            <div className="py-2 px-4 w-full flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest bg-muted/50 border-t">
                <span>Interactive Sandbox</span>
                <span>{slug}.tsx</span>
            </div>
        </div>
    );
}
