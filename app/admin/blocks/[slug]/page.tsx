"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Package, Component, User, Hash, Info } from "lucide-react";
import Link from "next/link";
import { PathInstructionCard } from "./components/path-instruction-card";
import { BuildControlCard } from "./components/build-control-card";
import { DistributionCard } from "./components/distribution-card";
import { PreviewSection } from "./components/preview-section";

export default function BlockDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const block = useQuery(api.blocks.getBlock, { name: slug });

    if (block === undefined) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (block === null) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-destructive/10 p-4">
                    <Info className="h-8 w-8 text-destructive" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Block Not Found</h1>
                    <p className="text-muted-foreground">The block with slug "{slug}" does not exist.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/admin/blocks">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blocks
                    </Link>
                </Button>
            </div>
        );
    }

    const getTypeIcon = (type: string) => {
        return type === "ui" ? (
            <Package className="h-4 w-4" />
        ) : (
            <Component className="h-4 w-4" />
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/admin/blocks">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{block.title}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/admin/blocks/${block.name}/edit`}>
                            Edit Block
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/r/${block.name}.json`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Registry JSON
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <PreviewSection slug={block.name} type={block.type} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {block.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <PathInstructionCard slug={block.name} type={block.type} />
                    <BuildControlCard block={block} />
                    <DistributionCard slug={block.name} />

                    <Card>
                        <CardHeader>
                            <CardTitle>Block Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Hash className="h-4 w-4" />
                                    <span>Slug</span>
                                </div>
                                <span className="font-medium">{block.name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Author</span>
                                </div>
                                <span className="font-medium">{block.author}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Version</span>
                                </div>
                                <Badge variant="outline">{block.version}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Type</span>
                                </div>
                                <Badge className="flex items-center gap-1">
                                    {getTypeIcon(block.type)}
                                    {block.type.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Status</span>
                                </div>
                                <Badge variant={block.isActive ? "default" : "secondary"}>
                                    {block.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Code Status</span>
                                </div>
                                <Badge variant={block.codeStatus === "available" ? "default" : "secondary"}>
                                    {block.codeStatus === "available" ? "Available" : "Coming Soon"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {block.categories.map((category) => (
                                    <Badge key={category} variant="outline">
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {block.figmaUrl && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Resources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href={block.figmaUrl} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Open in Figma
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
