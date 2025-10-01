"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  onSeedData: () => void;
}

export function DashboardHeader({ onSeedData }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your blocks library performance and analytics
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onSeedData} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Seed Data
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
