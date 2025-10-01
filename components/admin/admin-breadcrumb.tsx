"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  admin: "Dashboard",
  blocks: "Blocks",
  analytics: "Analytics",
  downloads: "Downloads",
  interactions: "Interactions",
  settings: "Settings",
  create: "Create",
  edit: "Edit",
  view: "View",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Remove 'admin' from segments since it's our base
  const adminSegments = segments.slice(1);

  const breadcrumbItems = [
    {
      label: "Dashboard",
      href: "/admin",
      isLast: adminSegments.length === 0,
    },
  ];

  // Build breadcrumb from URL segments
  adminSegments.forEach((segment, index) => {
    const href = `/admin/${adminSegments.slice(0, index + 1).join("/")}`;
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === adminSegments.length - 1;

    breadcrumbItems.push({
      label,
      href,
      isLast,
    });
  });

  if (breadcrumbItems.length === 1) {
    return null; // Don't show breadcrumb on dashboard
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin" className="flex items-center">
              <Home className="mr-1 h-3 w-3" />
              Dashboard
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {adminSegments.map((segment, index) => {
          const href = `/admin/${adminSegments.slice(0, index + 1).join("/")}`;
          const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          const isLast = index === adminSegments.length - 1;

          return (
            <div key={segment} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}