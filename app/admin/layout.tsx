import { Metadata } from "next";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Toaster } from "@/components/ui/sonner";
export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | D2 Studio",
    template: "%s | Admin | D2 Studio",
  },
  description:
    "Manage blocks, analytics, and system configuration for D2 Studio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="flex-1">
          <div className="border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="container mx-auto px-4 py-3"></div>
          </div>
          <main className="max-w-6xl mx-auto px-4 py-6">
            <AdminBreadcrumb />
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </AdminGuard>
  );
}
