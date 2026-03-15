"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "@/convex/_generated/dataModel";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";
import { useState } from "react";

// Extracted into a proper React component to satisfy Rules of Hooks
function CategoryRowActions({ category }: { category: Doc<"categories"> }) {
    const removeCategory = useMutation(api.categories.remove);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const onDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
            return;
        }
        try {
            await removeCategory({ id: category._id });
            toast.success("Category deleted");
        } catch {
            toast.error("Failed to delete category");
        }
    };

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    initialData={category}
                    onSuccess={() => setIsEditDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export const columns: ColumnDef<Doc<"categories">>[] = [
    {
        accessorKey: "sortOrder",
        header: "Order",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        id: "actions",
        cell: ({ row }) => <CategoryRowActions category={row.original} />,
    },
];
