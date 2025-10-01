"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Blocks, Download, Eye } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/blocks">
              <Blocks className="h-4 w-4 mr-2" />
              Manage Blocks
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/downloads">
              <Download className="h-4 w-4 mr-2" />
              Download Reports
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/interactions">
              <Eye className="h-4 w-4 mr-2" />
              User Interactions
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
