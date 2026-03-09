"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Loader2, AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { buildRegistryAction } from "../actions";
import { toast } from "sonner";

export function BuildControlCard({ block }: { block: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; output?: string; error?: string } | null>(null);

    const handleBuild = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const res = await buildRegistryAction(block);
            setResult(res);
            if (res.success) {
                toast.success("Registry build completed successfully");
            } else {
                toast.error("Registry build failed");
            }
        } catch (error) {
            toast.error("An error occurred while triggering the build");
            setResult({
                success: false,
                error: error instanceof Error ? error.message : "Failed to execute server action",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    Registry Build
                </CardTitle>
                <CardDescription>
                    Compile component metadata into the registry JSON files.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button
                    onClick={handleBuild}
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Building Registry...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4" />
                            Generate Registry Build
                        </>
                    )}
                </Button>

                {result && (
                    <div className={`p-4 rounded-lg border text-sm space-y-2 ${result.success ? "bg-green-500/5 border-green-500/20" : "bg-destructive/5 border-destructive/20"}`}>
                        <div className="flex items-center gap-2 font-medium">
                            {result.success ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                            {result.success ? "Build Successful" : "Build Failed"}
                        </div>

                        {(result.output || result.error) && (
                            <pre className="mt-2 p-2 bg-muted rounded font-mono text-xs overflow-x-auto max-h-[400px] whitespace-pre-wrap">
                                {result.output}
                                {result.error && `\nError Output:\n${result.error}`}
                            </pre>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
