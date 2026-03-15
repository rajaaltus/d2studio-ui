"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

interface CategoryFormData {
    name: string;
    slug: string;
    sortOrder: number;
}

interface CategoryFormProps {
    initialData?: {
        _id: Id<"categories">;
        name: string;
        slug: string;
        sortOrder: number;
    };
    onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
    const createCategory = useMutation(api.categories.create);
    const updateCategory = useMutation(api.categories.update);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>({
        defaultValues: {
            name: initialData?.name || "",
            slug: initialData?.slug || "",
            sortOrder: initialData?.sortOrder || 0,
        },
    });

    const onSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        try {
            if (initialData) {
                await updateCategory({
                    id: initialData._id,
                    ...data,
                });
                toast.success("Category updated successfully");
            } else {
                await createCategory(data);
                toast.success("Category created successfully");
            }
            onSuccess?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g. Hero Sections"
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    {...register("slug", {
                        required: "Slug is required",
                        pattern: {
                            value: /^[a-z0-9-]+$/,
                            message: "Slug must be lowercase alphanumeric with dashes"
                        }
                    })}
                    placeholder="e.g. hero-sections"
                />
                {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                    id="sortOrder"
                    type="number"
                    {...register("sortOrder", { valueAsNumber: true })}
                    placeholder="0"
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Category" : "Create Category"}
            </Button>
        </form>
    );
}
