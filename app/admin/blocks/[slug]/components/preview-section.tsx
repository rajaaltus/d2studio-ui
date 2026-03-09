"use client";

import { useState } from "react";
import { PreviewIframe } from "./preview-iframe";
import { Button } from "@/components/ui/button";
import {
    Monitor,
    Tablet,
    Smartphone,
    Moon,
    Sun,
    RefreshCw,
    Maximize2
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PreviewSectionProps {
    slug: string;
    type: string;
}

export function PreviewSection({ slug, type }: PreviewSectionProps) {
    const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop" | "full">("desktop");
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [refreshKey, setRefreshKey] = useState(0);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const openFullscreen = () => {
        const queryParams = new URLSearchParams({
            theme,
            type,
        });
        window.open(`/preview/${slug}?${queryParams.toString()}`, "_blank");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                    <ToggleGroup
                        type="single"
                        value={viewport}
                        onValueChange={(value) => value && setViewport(value as any)}
                        className="bg-background border rounded-md p-0.5"
                    >
                        <ToggleGroupItem value="mobile" className="h-8 w-8 p-0" title="Mobile (375px)">
                            <Smartphone className="h-4 w-4" />
                        </ToggleGroupItem>

                        <ToggleGroupItem value="tablet" className="h-8 w-8 p-0" title="Tablet (768px)">
                            <Tablet className="h-4 w-4" />
                        </ToggleGroupItem>

                        <ToggleGroupItem value="desktop" className="h-8 w-8 p-0" title="Desktop (1280px)">
                            <Monitor className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={openFullscreen}
                        className="h-9 w-9"
                        title="Open Full Preview"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9"
                    >
                        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        className="h-9 w-9"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <PreviewIframe
                key={`${slug}-${refreshKey}`}
                slug={slug}
                type={type}
                theme={theme}
                width={viewport}
            />
        </div>
    );
}
