"use client"

import {
  BarChart3Icon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { Separator } from "@/registry/default/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/default/ui/sidebar"

const nav = [
  { title: "Overview", icon: LayoutDashboardIcon, active: true },
  { title: "Inbox", icon: InboxIcon, badge: 12 },
  { title: "Customers", icon: UsersIcon },
  { title: "Reports", icon: BarChart3Icon },
]

export default function SidebarDemo() {
  return (
    // The preview frame is the viewport, so the sidebar sizes to it rather
    // than to the page; the panel is pinned inside this box instead.
    <SidebarProvider className="relative min-h-[520px] w-full max-w-4xl overflow-hidden rounded-xl border [&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                  N
                </div>
                <div className="grid text-left text-sm leading-tight">
                  <span className="truncate font-medium">Northwind</span>
                  <span className="truncate text-xs text-muted-foreground">Workspace</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Overview</span>
        </header>
        <div className="grid flex-1 grid-cols-3 gap-3 p-4">
          <div className="aspect-video rounded-lg bg-muted" />
          <div className="aspect-video rounded-lg bg-muted" />
          <div className="aspect-video rounded-lg bg-muted" />
          <div className="col-span-3 min-h-40 rounded-lg bg-muted/60" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
