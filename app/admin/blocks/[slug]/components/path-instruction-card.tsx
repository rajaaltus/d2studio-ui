"use client";

import { copyText } from "@/lib/utils";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Folder, FileCode } from "lucide-react";
import { toast } from "sonner";

interface PathInstructionCardProps {
    slug: string;
    type: string;
}

export function PathInstructionCard({ slug, type }: PathInstructionCardProps) {
    const [copiedMkdir, setCopiedMkdir] = useState(false);
    const [copiedTouch, setCopiedTouch] = useState(false);

    const targetFolder = type === "ui" ? "registry/default/ui" : "registry/default/components";
    const targetFile = `${targetFolder}/${slug}.tsx`;

    const mkdirCommand = `mkdir -p ${targetFolder}`;
    const touchCommand = `touch ${targetFile}`;

    const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
        try {
            await copyText(text);
            setCopied(true);
            toast.success("Command copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy command");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    File Placement
                </CardTitle>
                <CardDescription>
                    Run these commands in your terminal to scaffold the component files.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">1. Create directory</p>
                    <div className="relative group">
                        <pre className="p-3 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
                            {mkdirCommand}
                        </pre>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(mkdirCommand, setCopiedMkdir)}
                        >
                            {copiedMkdir ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">2. Create component file</p>
                    <div className="relative group">
                        <pre className="p-3 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
                            {touchCommand}
                        </pre>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => copyToClipboard(touchCommand, setCopiedTouch)}
                        >
                            {copiedTouch ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground border-t">
                    <FileCode className="h-3.5 w-3.5" />
                    <span>Target path: <span className="font-mono text-primary">{targetFile}</span></span>
                </div>
            </CardContent>
        </Card>
    );
}
