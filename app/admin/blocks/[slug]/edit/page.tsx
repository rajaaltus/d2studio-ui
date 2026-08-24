"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlockFormData {
  name: string;
  type: "ui" | "component";
  title: string;
  description: string;
  author: string;
  version: string;
  blockType: string;
  previewImage: string;
  codeStatus: "coming_soon" | "available";
  codeUrl?: string;
  categories: string;
  tags?: string;
  isFeatured: boolean;
  featuredOrder?: number;
}



export default function EditBlockPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const updateBlock = useMutation(api.blocks.updateBlock);
  const generateUploadUrl = useMutation(api.blocks.generateUploadUrl);
  const getFileUrlFromStorageId = useMutation(
    api.blocks.getFileUrlFromStorageId,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const categoriesList = useQuery(api.categories.get);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(
    null,
  );

  // Fetch block data using the slug (name)
  const block = useQuery(api.blocks.getBlock, { name: slug });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlockFormData>({
    values: block
      ? {
        name: block.name,
        type: block.type,
        title: block.title,
        description: block.description,
        author: block.author,
        version: block.version,
        blockType: block.blockType || "",
        previewImage: block.previewImage || "",
        codeStatus: block.codeStatus || "coming_soon",
        codeUrl: block.codeUrl,
        categories: block.categories.join(", "),
        tags: block.tags?.join(", ") || "",
        isFeatured: block.isFeatured ?? false,
        featuredOrder: block.featuredOrder,
      }
      : undefined,
  });

  const codeStatus = watch("codeStatus");

  React.useEffect(() => {
    if (block) {
      setValue("name", block.name);
      setValue("type", block.type);
      setValue("title", block.title);
      setValue("description", block.description);
      setValue("author", block.author);
      setValue("version", block.version);
      setValue("blockType", block.blockType || "");
      setValue("previewImage", block.previewImage || "");
      setValue("codeStatus", block.codeStatus || "coming_soon");
      setValue("codeUrl", block.codeUrl);
      setValue("categories", block.categories.join(", "));
      setValue("tags", block.tags?.join(", ") || "");
      setValue("isFeatured", block.isFeatured ?? false);
      setValue("featuredOrder", block.featuredOrder);
      setPreviewImageUrl(block.previewImage || null);
    }
  }, [block, setValue]);

  const handleImageChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      setIsUploading(true);

      try {
        // Generate upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("Failed to upload file");
        }

        const { storageId } = await result.json();

        // Get the file URL from Convex
        // storageId from upload response needs to be cast to Id<"_storage">
        const fileUrl = await getFileUrlFromStorageId({
          storageId: storageId as Id<"_storage">,
        });

        if (fileUrl) {
          setPreviewImageUrl(fileUrl);
          setValue("previewImage", fileUrl);
        } else {
          throw new Error("Failed to get file URL");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to upload image. Please try again.",
        );
        setPreviewImageUrl(null);
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl, getFileUrlFromStorageId, setValue],
  );

  const onSubmit = async (data: BlockFormData) => {
    if (!block) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure type is valid
      if (!data.type || (data.type !== "ui" && data.type !== "component")) {
        setError("Please select a valid type (UI or Component)");
        setIsSubmitting(false);
        return;
      }

      // Ensure codeStatus is valid
      if (
        !data.codeStatus ||
        (data.codeStatus !== "coming_soon" && data.codeStatus !== "available")
      ) {
        setError("Please select a valid code status");
        setIsSubmitting(false);
        return;
      }

      const categories = data.categories
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      const tags = data.tags
        ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
        : undefined;

      // Use uploaded image URL, or existing preview image, or placeholder as fallback
      const finalPreviewImage =
        previewImageUrl || data.previewImage || "/placeholder.svg";

      await updateBlock({
        id: block._id,
        name: data.name,
        type: data.type as "ui" | "component",
        title: data.title,
        description: data.description,
        author: data.author,
        version: data.version,
        blockType: data.blockType,
        previewImage: finalPreviewImage,
        codeStatus: data.codeStatus as "coming_soon" | "available",
        codeUrl: data.codeStatus === "available" ? data.codeUrl : undefined,
        categories,
        tags,
        isFeatured: data.isFeatured,
        featuredOrder:
          data.isFeatured && data.featuredOrder !== undefined && !Number.isNaN(Number(data.featuredOrder))
            ? Number(data.featuredOrder)
            : undefined,
      });

      router.push("/admin/blocks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update block");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!block || !categoriesList) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-4 w-4 animate-spin mx-auto" stroke="currentColor" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/blocks">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Blocks</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Block</h1>
            <p className="text-sm text-muted-foreground">
              {block.title}
            </p>
          </div>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Block Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-4 font-semibold">Update Code Status</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codeStatus">Code Status</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "codeStatus",
                        value as "coming_soon" | "available",
                      )
                    }
                    value={codeStatus || block?.codeStatus || "coming_soon"}
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
                      <p className="text-sm text-destructive">
                        {errors.codeUrl.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-4 font-semibold">Landing Page Feature</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="isFeatured">Feature on landing page</Label>
                    <p className="text-xs text-muted-foreground">
                      When enabled, this block renders in the Featured Components
                      section on the home page.
                    </p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={watch("isFeatured") ?? false}
                    onCheckedChange={(value) => setValue("isFeatured", value)}
                  />
                </div>

                {watch("isFeatured") && (
                  <div className="space-y-2">
                    <Label htmlFor="featuredOrder">Display order (optional)</Label>
                    <Input
                      id="featuredOrder"
                      type="number"
                      min={0}
                      {...register("featuredOrder", { valueAsNumber: true })}
                      placeholder="Lower numbers appear first"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to fall back to most recently created.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Block Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: "Block name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
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
                  value={watch("type") || block?.type || "component"}
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
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
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
                />
                {errors.author && (
                  <p className="text-sm text-destructive">
                    {errors.author.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">
                  Version <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="version"
                  {...register("version", { required: "Version is required" })}
                />
                {errors.version && (
                  <p className="text-sm text-destructive">
                    {errors.version.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockType">
                Block Type/Category <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("blockType", value)}
                value={watch("blockType")}
              >
                <SelectTrigger id="blockType">
                  <SelectValue placeholder="Select block type" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesList.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="previewImage">
                Preview Image <span className="text-destructive">*</span>
              </Label>
              {previewImageUrl && (
                <div className="mb-2 relative inline-block">
                  <Image
                    src={previewImageUrl}
                    alt="Current preview"
                    className="h-96 w-full rounded-md border object-cover"
                    width={1280}
                    height={750}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => {
                      setPreviewImageUrl(null);
                      setValue("previewImage", "");
                    }}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current preview image - Click X to remove
                  </p>
                </div>
              )}
              <Input
                id="previewImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
                className="cursor-pointer"
              />
              {isUploading && (
                <p className="text-sm text-muted-foreground">
                  Uploading image...
                </p>
              )}
              {errors.previewImage && (
                <p className="text-sm text-destructive">
                  {errors.previewImage.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {previewImageUrl
                  ? "Upload a new image file to replace the current preview (PNG, JPG, etc.)"
                  : "Upload an image file (PNG, JPG, etc.)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">
                Categories <span className="text-destructive">*</span>
              </Label>
              <Input
                id="categories"
                {...register("categories", {
                  required: "Categories are required",
                })}
                placeholder="marketing, hero, landing (comma-separated)"
              />
              {errors.categories && (
                <p className="text-sm text-destructive">
                  {errors.categories.message}
                </p>
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
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Block
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
