"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface BlockFormData {
  name: string;
  type: "ui" | "component";
  title: string;
  description: string;
  author: string;
  version: string;
  blockType: string;
  previewImage: string;
  figmaUrl: string;
  codeStatus: "coming_soon" | "available";
  codeUrl?: string;
  categories: string;
  tags?: string;
}

const BLOCK_TYPES = [
  { value: "headers", label: "Headers" },
  { value: "hero-sections", label: "Hero Sections" },
  { value: "bento", label: "Bento" },
  { value: "cta", label: "CTA" },
  { value: "footer", label: "Footer" },
];

export default function CreateBlockPage() {
  const router = useRouter();
  const createBlock = useMutation(api.blocks.createBlock);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlockFormData>({
    defaultValues: {
      type: "component",
      codeStatus: "coming_soon",
      version: "1.0.0",
      author: "D2 Studio",
    },
  });

  const codeStatus = watch("codeStatus");

  const onSubmit = async (data: BlockFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const categories = data.categories
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      const tags = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        : undefined;

      await createBlock({
        name: data.name,
        type: data.type,
        title: data.title,
        description: data.description,
        author: data.author,
        version: data.version,
        blockType: data.blockType,
        previewImage: data.previewImage,
        figmaUrl: data.figmaUrl,
        codeStatus: data.codeStatus,
        codeUrl: data.codeStatus === "available" ? data.codeUrl : undefined,
        categories,
        tags,
      });

      router.push("/admin/blocks");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create block",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href="/admin/blocks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blocks
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Block</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Block Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: "Block name is required" })}
                  placeholder="e.g., hero-01"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("type", value as "ui" | "component")
                  }
                  defaultValue="component"
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="component">Component</SelectItem>
                    <SelectItem value="ui">UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g., Modern Hero Section"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                placeholder="A brief description of the block"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">
                  Author <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  {...register("author", { required: "Author is required" })}
                  placeholder="D2 Studio"
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">
                  Version <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="version"
                  {...register("version", { required: "Version is required" })}
                  placeholder="1.0.0"
                />
                {errors.version && (
                  <p className="text-sm text-destructive">{errors.version.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockType">
                Block Type/Category <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("blockType", value)}
                required
              >
                <SelectTrigger id="blockType">
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  {BLOCK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previewImage">
                Preview Image URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="previewImage"
                type="url"
                {...register("previewImage", {
                  required: "Preview image URL is required",
                })}
                placeholder="https://example.com/preview.png"
              />
              {errors.previewImage && (
                <p className="text-sm text-destructive">
                  {errors.previewImage.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="figmaUrl">
                Figma URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="figmaUrl"
                type="url"
                {...register("figmaUrl", { required: "Figma URL is required" })}
                placeholder="https://www.figma.com/file/..."
              />
              {errors.figmaUrl && (
                <p className="text-sm text-destructive">{errors.figmaUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeStatus">Code Status</Label>
              <Select
                onValueChange={(value) =>
                  setValue("codeStatus", value as "coming_soon" | "available")
                }
                defaultValue="coming_soon"
              >
                <SelectTrigger id="codeStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {codeStatus === "available" && (
              <div className="space-y-2">
                <Label htmlFor="codeUrl">
                  Code URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="codeUrl"
                  type="url"
                  {...register("codeUrl", {
                    required:
                      codeStatus === "available"
                        ? "Code URL is required when code is available"
                        : false,
                  })}
                  placeholder="https://d2studio.dev/r/block-name.json"
                />
                {errors.codeUrl && (
                  <p className="text-sm text-destructive">{errors.codeUrl.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="categories">
                Categories <span className="text-destructive">*</span>
              </Label>
              <Input
                id="categories"
                {...register("categories", { required: "Categories are required" })}
                placeholder="marketing, hero, landing (comma-separated)"
              />
              {errors.categories && (
                <p className="text-sm text-destructive">{errors.categories.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Separate multiple categories with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="newsletter, subscription, email (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple tags with commas
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Block
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blocks")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

