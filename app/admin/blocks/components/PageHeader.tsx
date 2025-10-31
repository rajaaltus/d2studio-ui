"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader({ onRefresh }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Blocks Management
        </h1>
        <p className="text-muted-foreground">
          Manage your UI components and composite blocks
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button asChild>
          <Link href="/admin/blocks/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Block
          </Link>
        </Button>
      </div>
    </div>
  );
}
