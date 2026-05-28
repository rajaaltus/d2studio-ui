"use client";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";

export function AdminTopbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <div className="min-w-0 flex-1">
        <AdminBreadcrumb />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="hidden text-xs sm:inline-flex">
          Development
        </Badge>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full p-0 px-1 text-[10px] leading-none"
          >
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
