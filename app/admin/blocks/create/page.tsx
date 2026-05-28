"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ImageIcon, Loader2, X } from "lucide-react";
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
  figmaUrl: string;
  codeStatus: "coming_soon" | "available";
  codeUrl?: string;
  categories: string;
  tags?: string;
}

export default function CreateBlockPage() {
  const router = useRouter();
  const createBlock = useMutation(api.blocks.createBlock);
  const generateUploadUrl = useMutation(api.blocks.generateUploadUrl);
  const getFileUrlFromStorageId = useMutation(
    api.blocks.getFileUrlFromStorageId,
  );
  const categoriesList = useQuery(api.categories.get);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(
    null,
  );

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
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedName = watch("name");

  const handleImageChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      setIsUploading(true);

      try {
        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("Failed to upload file");
        }

        const { storageId } = await result.json();

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
    setIsSubmitting(true);
    setError(null);

    try {
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

      const finalPreviewImage =
        previewImageUrl || data.previewImage || "/placeholder.svg";

      await createBlock({
        name: data.name,
        type: data.type,
        title: data.title,
        description: data.description,
        author: data.author,
        version: data.version,
        blockType: data.blockType,
        previewImage: finalPreviewImage,
        figmaUrl: data.figmaUrl,
        codeStatus: data.codeStatus,
        codeUrl: data.codeStatus === "available" ? data.codeUrl : undefined,
        categories,
        tags,
      });

      router.push("/admin/blocks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create block");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!categoriesList) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/blocks">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Blocks</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Block
            </h1>
            <p className="text-sm text-muted-foreground">
              Add a new block to the D2 Studio library
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blocks")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Block
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
              <CardDescription>
                Identifying details for this block.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Block Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Block name is required",
                    })}
                    placeholder="e.g., hero-01"
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
                    defaultValue="component"
                  >
                    <SelectTrigger id="type" className="w-full">
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
                  placeholder="A brief description of the block"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                    {...register("version", {
                      required: "Version is required",
                    })}
                    placeholder="1.0.0"
                  />
                  {errors.version && (
                    <p className="text-sm text-destructive">
                      {errors.version.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Taxonomy</CardTitle>
              <CardDescription>
                Where this block lives and how it&apos;s discovered.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blockType">
                  Block Type/Category{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("blockType", value)}
                  required
                >
                  <SelectTrigger id="blockType" className="w-full">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
              <CardDescription>
                Source links and availability status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="figmaUrl">
                  Figma URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="figmaUrl"
                  type="url"
                  {...register("figmaUrl", {
                    required: "Figma URL is required",
                  })}
                  placeholder="https://www.figma.com/file/..."
                />
                {errors.figmaUrl && (
                  <p className="text-sm text-destructive">
                    {errors.figmaUrl.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codeStatus">Code Status</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "codeStatus",
                        value as "coming_soon" | "available",
                      )
                    }
                    defaultValue="coming_soon"
                  >
                    <SelectTrigger id="codeStatus" className="w-full">
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview Image</CardTitle>
              <CardDescription>
                PNG or JPG. Used as the card thumbnail.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {previewImageUrl ? (
                <div className="relative overflow-hidden rounded-md border">
                  <Image
                    src={previewImageUrl}
                    alt="Preview"
                    className="aspect-video w-full object-cover"
                    width={1920}
                    height={1080}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => {
                      setPreviewImageUrl(null);
                      setValue("previewImage", "");
                    }}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-xs">No preview uploaded yet</p>
                </div>
              )}
              {errors.previewImage && (
                <p className="text-sm text-destructive">
                  {errors.previewImage.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Preview</CardTitle>
              <CardDescription>
                How this block will appear in listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border">
                <div className="relative aspect-video w-full bg-muted">
                  {previewImageUrl ? (
                    <Image
                      src={previewImageUrl}
                      alt="Card preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <p className="text-sm font-medium">
                    {watchedTitle || "Untitled block"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {watchedName ? `@${watchedName}` : "block-name"}
                  </p>
                  <p className="line-clamp-2 pt-1 text-xs text-muted-foreground">
                    {watchedDescription ||
                      "Description will appear here as you type."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
