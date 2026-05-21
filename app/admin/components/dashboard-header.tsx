"use client";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  onSeedData: () => void;
  isSeeding?: boolean;
}

export function DashboardHeader({ onSeedData, isSeeding = false }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your blocks library performance and analytics
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onSeedData}
          variant="outline"
          size="sm"
          disabled={isSeeding}
        >
          {isSeeding ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isSeeding ? "Seeding..." : "Seed Data"}
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
