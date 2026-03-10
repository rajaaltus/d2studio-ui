"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface DistributionCardProps {
    slug: string;
}

export function DistributionCard({ slug }: DistributionCardProps) {
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000");
    const registryUrl = `${baseUrl}/r/${slug}.json`;
    const installCommand = `npx shadcn@latest add ${registryUrl}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(installCommand);
            setCopied(true);
            toast.success("Installation command copied");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy command");
        }
    };

    if (!mounted) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Distribution
                </CardTitle>
                <CardDescription>
                    Share this component with other developers using the shadcn CLI.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Installation Command</p>
                    <div className="relative group">
                        <pre className="p-3 bg-muted rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap pr-12">
                            {installCommand}
                        </pre>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={copyToClipboard}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="pt-2 flex items-center gap-4 text-xs text-muted-foreground border-t">
                    <div className="flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <a
                            href={registryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                        >
                            View JSON Metadata
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
