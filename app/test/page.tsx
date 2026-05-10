"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Bed,
  DollarSign,
  User,
  Star,
  ChefHat,
  Car,
  CheckCircle,
  Users,
  Lock,
  Settings,
  ChevronDown,
  Search,
  Calendar,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Users2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Booking {
  guestName: string;
  bookingId: string;
  guestCount: number;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  payment: string;
  status: "Confirmed" | "Checked - In" | "Cancelled";
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const bookings: Booking[] = [
  {
    guestName: "Mr. John Smith",
    bookingId: "#25145",
    guestCount: 4,
    roomNumber: "No.07",
    roomType: "Suit Room",
    checkIn: "Aug 20, 2025",
    checkOut: "Aug 24, 2025",
    payment: "1400.00",
    status: "Confirmed",
  },
  {
    guestName: "Ms. Nathan Zboncak",
    bookingId: "#25146",
    guestCount: 3,
    roomNumber: "No.12",
    roomType: "Deluxe Room",
    checkIn: "Aug 21, 2025",
    checkOut: "Aug 25, 2025",
    payment: "345.00",
    status: "Confirmed",
  },
  {
    guestName: "Mr. Howard Goodwin",
    bookingId: "#25147",
    guestCount: 1,
    roomNumber: "No.30",
    roomType: "Premium Room",
    checkIn: "Aug 22, 2025",
    checkOut: "Aug 26, 2025",
    payment: "173.00",
    status: "Checked - In",
  },
  {
    guestName: "Cornelius Davis Sr.",
    bookingId: "#25148",
    guestCount: 1,
    roomNumber: "No.001",
    roomType: "Villa VIP",
    checkIn: "Aug 23, 2025",
    checkOut: "Aug 27, 2025",
    payment: "740.00",
    status: "Confirmed",
  },
  {
    guestName: "Mrs. Cecelia Oberbrunner",
    bookingId: "#25149",
    guestCount: 2,
    roomNumber: "No.55",
    roomType: "Economic",
    checkIn: "Aug 24, 2025",
    checkOut: "Aug 28, 2025",
    payment: "85.00",
    status: "Cancelled",
  },
  {
    guestName: "Ms. Jodi Carter",
    bookingId: "#25150",
    guestCount: 2,
    roomNumber: "No.24",
    roomType: "Suit Room",
    checkIn: "Aug 25, 2025",
    checkOut: "Aug 29, 2025",
    payment: "214.00",
    status: "Checked - In",
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Booking["status"] }) {
  const variants = {
    Confirmed: "bg-[#E8F5E9] text-[#2E7D32] border-[#4CAF50]",
    "Checked - In": "bg-[#F3E5F5] text-[#7B1FA2] border-[#9C27B0]",
    Cancelled: "bg-[#FFEBEE] text-[#C62828] border-[#E53935]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] sm:text-xs font-medium whitespace-nowrap",
        variants[status],
      )}
    >
      {status}
    </span>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors text-left",
        active
          ? "bg-gray-50 text-gray-900"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
      )}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#FF6B47] rounded-r-md" />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function MetricCard({
  title,
  value,
  change,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <Card className="bg-white border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-xl">
      <CardContent className="p-4 sm:p-5">
        <div className="text-xs sm:text-sm text-gray-500 mb-1.5">{title}</div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
          {value}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs sm:text-sm font-medium",
            trend === "up" ? "text-[#2E7D32]" : "text-[#C62828]",
          )}
        >
          {trend === "up" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sidebar Nav Content ────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {/* Logo and Branding */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-[#4A4A4A] rounded flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-xs">D2</span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            Studio Management
          </span>
        </div>
        <Button
          variant="outline"
          className="w-full justify-between border-gray-200 rounded-md bg-white hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-700">D2 Studio</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="mb-5">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Hotel Management
          </h3>
          <div className="space-y-0.5">
            <NavItem icon={Clock} label="Overview" onClick={onClose} />
            <NavItem icon={Bed} label="Rooms" onClick={onClose} />
            <NavItem icon={DollarSign} label="Expenditures" onClick={onClose} />
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Guest Booking
          </h3>
          <div className="space-y-0.5">
            <NavItem
              icon={User}
              label="Guest Booking"
              active
              onClick={onClose}
            />
            <NavItem icon={Star} label="Special Request" onClick={onClose} />
            <NavItem icon={ChefHat} label="Food Orders" onClick={onClose} />
            <NavItem icon={Car} label="Transport Booking" onClick={onClose} />
            <NavItem
              icon={CheckCircle}
              label="Do not Disturb"
              onClick={onClose}
            />
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Control Panel
          </h3>
          <div className="space-y-0.5">
            <NavItem icon={Users} label="User Accounts" onClick={onClose} />
            <NavItem
              icon={Lock}
              label="System and Security"
              onClick={onClose}
            />
            <NavItem icon={Settings} label="Roles" onClick={onClose} />
            <NavItem icon={Settings} label="Settings" onClick={onClose} />
          </div>
        </div>
      </nav>
    </>
  );
}

// ─── Mobile Card Row ────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {booking.guestName}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            ID: {booking.bookingId}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="text-gray-700">
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700">
                Edit Booking
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Cancel Booking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <span className="text-gray-400">Room</span>
          <div className="font-medium text-gray-800">
            {booking.roomNumber} · {booking.roomType}
          </div>
        </div>
        <div>
          <span className="text-gray-400">Guests</span>
          <div className="font-medium text-gray-800 flex items-center gap-1">
            <Users2 className="h-3.5 w-3.5 text-gray-400" />
            {booking.guestCount}
          </div>
        </div>
        <div>
          <span className="text-gray-400">Check-in</span>
          <div className="font-medium text-gray-800">{booking.checkIn}</div>
        </div>
        <div>
          <span className="text-gray-400">Check-out</span>
          <div className="font-medium text-gray-800">{booking.checkOut}</div>
        </div>
        <div className="col-span-2">
          <span className="text-gray-400">Payment</span>
          <div className="font-semibold text-gray-900">${booking.payment}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Default Export ────────────────────────────────────────────────────────

export default function Dashboard01() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-sans">
      {/* ── Desktop Sidebar (lg+) ─────────────────────────── */}
      <aside className="hidden lg:flex w-60 xl:w-64 bg-white shadow-[2px_0_4px_rgba(0,0,0,0.04)] flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer Overlay ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ─────────────────────────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-sm font-semibold text-gray-700">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#4A4A4A] rounded flex items-center justify-center">
                <span className="text-white font-semibold text-[10px]">D2</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Studio
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-medium">Guest Booking</div>
        </div>

        <div className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Header with breadcrumb + date picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-600 hidden sm:block">
              <span className="text-gray-400">Home</span>
              <span className="mx-2">›</span>
              <span className="text-gray-700 font-medium">Guest Booking</span>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-gray-200 bg-white hover:bg-gray-50 gap-2 px-4 h-9 shadow-[0_1px_1px_rgba(0,0,0,0.04)] text-sm w-full sm:w-auto justify-center"
            >
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-gray-700 truncate">
                Aug 20 – Sep 09, 2025
              </span>
            </Button>
          </div>

          {/* Metric cards — 2-col on mobile, 4-col on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard
              title="Total Vacancy"
              value="12"
              change="+ 14.3%"
              trend="up"
            />
            <MetricCard
              title="Total Booked"
              value="44"
              change="+ 14.3%"
              trend="up"
            />
            <MetricCard
              title="Pending Check-outs"
              value="15"
              change="- 8.1%"
              trend="down"
            />
            <MetricCard
              title="Total Guests"
              value="58"
              change="+ 16.4%"
              trend="up"
            />
          </div>

          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by booking ID, guest..."
                className="pl-10 h-10 rounded-full border-gray-200 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.04)] text-sm"
              />
            </div>
            {/* Filter chips — scroll horizontally on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
              {["Special request", "Duration", "Booking date"].map((label) => (
                <Button
                  key={label}
                  variant="outline"
                  className="rounded-full border-gray-200 bg-white hover:bg-gray-50 gap-1.5 px-3 h-10 shadow-[0_1px_1px_rgba(0,0,0,0.04)] text-xs sm:text-sm whitespace-nowrap shrink-0"
                >
                  <span className="text-gray-400 font-light">+</span>
                  <span className="text-gray-700">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* ── Mobile / tablet: card list (hidden on xl) ── */}
          <div className="xl:hidden space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                All Bookings
                <Badge variant="secondary" className="ml-2 text-[10px] py-0">
                  {bookings.length}
                </Badge>
              </h2>
            </div>
            {bookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>

          {/* ── Desktop: full table (hidden below xl) ── */}
          <div className="hidden xl:block">
            <Card className="bg-white border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-transparent bg-gray-50/60">
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Guest
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5"></TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Room
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Check-in
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Check-out
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Payment
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Status
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold py-4 px-5">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow
                        key={booking.bookingId}
                        className="border-gray-100 hover:bg-gray-50/50"
                      >
                        <TableCell className="py-4 px-5">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {booking.guestName}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              ID: {booking.bookingId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-5">
                          <div className="relative inline-flex items-center">
                            <Users2 className="h-5 w-5 text-gray-400" />
                            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-700">
                              {String(booking.guestCount).padStart(2, "0")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-5">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {booking.roomNumber}
                            </div>
                            <div className="text-xs text-gray-400">
                              {booking.roomType}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-5 text-gray-700 text-sm">
                          {booking.checkIn}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-gray-700 text-sm">
                          {booking.checkOut}
                        </TableCell>
                        <TableCell className="py-4 px-5 text-gray-900 font-semibold text-sm">
                          ${booking.payment}
                        </TableCell>
                        <TableCell className="py-4 px-5">
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="py-4 px-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-600"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-gray-700">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-700">
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-700">
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
