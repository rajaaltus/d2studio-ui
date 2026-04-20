"use client";

import {
  ArrowUp,
  BarChart3,
  Building2,
  Clock,
  Command,
  LayoutGrid,
  Plus,
  Settings,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import * as React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

// --- Data ---

const enrollmentData = [
  { value: 400 },
  { value: 300 },
  { value: 500 },
  { value: 280 },
  { value: 590 },
  { value: 320 },
  { value: 480 },
  { value: 850 }, // Peak
  { value: 400 },
  { value: 300 },
  { value: 200 },
  { value: 350 },
  { value: 250 },
  { value: 300 },
];

// --- Sub-Components ---

function StatRow({
  label,
  value,
  trend,
  subLabel,
}: {
  label: string;
  value: string;
  trend: string;
  subLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUp className="h-3 w-3" />
        {trend}
      </div>
    </div>
  );
}

function GlassIcon({
  icon: Icon,
}: {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 hover:scale-105 transition-transform cursor-default">
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
  );
}

function BentoSkeleton() {
  return (
    <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-12 gap-6 animate-pulse">
      {/* Card 1 Skeleton */}
      <div className="sm:col-span-6 lg:col-span-4 bg-gray-100 rounded-3xl h-[300px] p-6 flex flex-col">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 bg-white/50 rounded-2xl" />
          <div className="h-24 sm:h-auto sm:w-32 bg-white/50 rounded-2xl" />
        </div>
      </div>
      {/* Card 2 Skeleton */}
      <div className="sm:col-span-6 lg:col-span-4 bg-gray-100 rounded-3xl h-[300px] p-6 flex flex-col">
        <div className="flex-1 grid grid-cols-4 gap-3 place-content-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 w-12 bg-white/50 rounded-xl mx-auto" />
          ))}
        </div>
        <div className="h-6 w-48 bg-gray-200 rounded mt-4 mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>
      {/* Card 3 Skeleton */}
      <div className="sm:col-span-12 lg:col-span-4 bg-gray-100 rounded-3xl h-[300px] p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-full max-w-[200px] bg-white/50 rounded-full" />
        </div>
        <div className="h-6 w-40 bg-gray-200 rounded mt-4 mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>
      {/* Card 4 Skeleton */}
      <div className="sm:col-span-12 lg:col-span-6 bg-gray-100 rounded-3xl h-[300px] p-6 flex flex-col">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 bg-white/50 rounded-xl" />
          <div className="h-24 sm:h-auto sm:w-48 bg-white/50 rounded-xl" />
        </div>
      </div>
      {/* Card 5 Skeleton */}
      <div className="sm:col-span-12 lg:col-span-6 bg-gray-100 rounded-3xl h-[300px] p-6 flex flex-col">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="h-24 sm:h-auto sm:w-48 bg-white/50 rounded-xl" />
          <div className="flex-1 bg-white/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

const Bento01 = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 sm:p-8 md:p-16 flex flex-col items-center">
      {/* Header */}
      <div className="max-w-5xl w-full mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
          Everything You Need for{" "}
          <span className="block sm:inline">Professional Growth</span>
        </h1>
        <p className="text-gray-500 max-w-2xl text-base sm:text-lg leading-relaxed">
          From interactive workshop to certification programs, our platforms
          provides comprehensive tools for faculty development and institutional
          growth.
        </p>
      </div>

      {isLoading ? (
        <BentoSkeleton />
      ) : (
        /* Bento Grid */
        <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
          {/* Card 1: Admin Overview — sm:6 / lg:4 */}
          <Card className="sm:col-span-6 lg:col-span-4 bg-gray-50/50 border-gray-100 shadow-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
            <CardContent className="p-5 sm:p-6 h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-900">Admin Overview</h3>
                <p className="text-sm text-gray-500">
                  Monitor platform health and revenue.
                </p>
              </div>

              {/* Stack vertically on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Stats Column */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                  <StatRow label="Active Programs" value="42" trend="8%" />
                  <StatRow label="Enrollments" value="3,214" trend="12%" />
                  <StatRow label="Enrollments" value="₹8.6L" trend="5%" />
                </div>

                {/* Chart Column — full width on mobile, fixed on sm+ */}
                <div className="sm:w-32 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-row sm:flex-col justify-between sm:justify-between gap-4 sm:gap-0">
                  <div>
                    <div className="text-[10px] font-semibold text-gray-900">
                      Enrollment Trend
                    </div>
                    <div className="text-[9px] text-gray-400">Last 14 days</div>
                    <div className="text-xl font-bold text-gray-900 mt-1 sm:mt-2">
                      1,521
                    </div>
                  </div>
                  <div className="h-16 flex-1 sm:flex-none sm:w-full mt-0 sm:mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={enrollmentData}>
                        <defs>
                          <linearGradient
                            id="colorGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#4f46e5"
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="100%"
                              stopColor="#4f46e5"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#colorGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Dashboard & Multi-Role Access — sm:6 / lg:4 */}
          <Card className="sm:col-span-6 lg:col-span-4 bg-gray-50/50 border-gray-100 shadow-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <CardContent className="p-5 sm:p-6 h-full flex flex-col">
              {/* Icon Grid */}
              <div className="flex-1 flex items-center justify-center py-6 sm:py-8">
                <div className="grid grid-cols-4 gap-3">
                  <GlassIcon icon={BarChart3} />
                  <GlassIcon icon={Clock} />
                  <GlassIcon icon={LayoutGrid} />
                  <GlassIcon icon={Users} />
                  <GlassIcon icon={Plus} />
                  <GlassIcon icon={Settings} />
                  <GlassIcon icon={Zap} />
                  <GlassIcon icon={Command} />
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="font-semibold text-gray-900">
                  Dashboard & Multi-Role Access
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Get real-time insights with dashboards tailored for every
                  user, from admin to faculty, using granular permissions for
                  simplified, secure access.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: A Complete Platform — sm:12 / lg:4 */}
          <Card className="sm:col-span-12 lg:col-span-4 bg-gray-50/50 border-gray-100 shadow-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both group">
            <CardContent className="p-5 sm:p-6 h-full flex flex-col relative">
              <style jsx global>{`
                @keyframes office-glow {
                  0%,
                  100% {
                    transform: scale(1);
                  }
                  10% {
                    transform: scale(1.05);
                  }
                  20% {
                    transform: scale(1);
                  }
                }
                @keyframes beam-travel-1 {
                  0%,
                  15% {
                    width: 0;
                    opacity: 0;
                    left: 0;
                  }
                  20% {
                    opacity: 1;
                  }
                  40% {
                    width: 100%;
                    opacity: 1;
                    left: 0;
                  }
                  45% {
                    width: 0;
                    opacity: 0;
                    left: 100%;
                  }
                  100% {
                    width: 0;
                    opacity: 0;
                    left: 100%;
                  }
                }
                @keyframes lightning-pulse {
                  0%,
                  40% {
                    transform: scale(1);
                  }
                  45% {
                    transform: scale(1.1);
                  }
                  55% {
                    transform: scale(1);
                  }
                  100% {
                    transform: scale(1);
                  }
                }
                @keyframes beam-travel-2 {
                  0%,
                  50% {
                    width: 0;
                    opacity: 0;
                    left: 0;
                  }
                  55% {
                    opacity: 1;
                  }
                  75% {
                    width: 100%;
                    opacity: 1;
                    left: 0;
                  }
                  80% {
                    width: 0;
                    opacity: 0;
                    left: 100%;
                  }
                  100% {
                    width: 0;
                    opacity: 0;
                    left: 100%;
                  }
                }
                @keyframes user-ripple {
                  0%,
                  75% {
                    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
                  }
                  80% {
                    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0.1);
                  }
                  100% {
                    box-shadow: 0 0 0 20px rgba(99, 102, 241, 0);
                  }
                }
                @keyframes animate-spin-blur {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }

                .loader-ring {
                  position: relative;
                  border-radius: 50%;
                  overflow: hidden;
                  box-shadow:
                    -2px -2px 5px rgba(255, 255, 255, 0.8),
                    3px 3px 5px rgba(0, 0, 0, 0.1);
                }
                .loader-ring::before {
                  content: "";
                  position: absolute;
                  top: 3px;
                  left: 3px;
                  right: 3px;
                  bottom: 3px;
                  z-index: 10;
                  background: white;
                  border-radius: 50%;
                  border: 1px solid #f3f4f6;
                }
                .loader-ring span {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  filter: blur(8px);
                  z-index: -1;
                  animation: animate-spin-blur 2s linear infinite;
                }
                .loader-ring.indigo span {
                  background-image: linear-gradient(
                    -225deg,
                    #4f46e5 0%,
                    #6366f1 50%,
                    #818cf8 100%
                  );
                }
                .loader-ring.green span {
                  background-image: linear-gradient(
                    -225deg,
                    #16a34a 0%,
                    #22c55e 50%,
                    #4ade80 100%
                  );
                }

                .animate-office-glow {
                  animation: office-glow 4s infinite;
                }
                .animate-beam-1 {
                  animation: beam-travel-1 4s infinite ease-in-out;
                }
                .animate-lightning-pulse {
                  animation: lightning-pulse 4s infinite;
                }
                .animate-beam-2 {
                  animation: beam-travel-2 4s infinite ease-in-out;
                }
                .animate-user-ripple {
                  animation: user-ripple 4s infinite;
                }
              `}</style>

              <DottedGlowBackground
                className="pointer-events-none z-0 [mask-image:radial-gradient(ellipse_at_center,white_25%,transparent_60%)]"
                opacity={0.5}
                gap={10}
                radius={1.2}
                colorLightVar="--color-indigo-200"
                glowColorLightVar="--color-indigo-400"
                backgroundOpacity={0}
                speedMin={0.3}
                speedMax={1.6}
                speedScale={1}
              />

              {/* Timeline Visual */}
              <div className="flex-1 flex items-center justify-center py-8 relative z-10">
                <div className="flex items-center gap-0 w-full max-w-xs sm:max-w-[320px]">
                  {/* Office Icon */}
                  <div className="relative z-10 shrink-0">
                    <div className="h-11 w-11 sm:h-14 sm:w-14 flex items-center justify-center loader-ring indigo animate-office-glow">
                      <span></span>
                      <div className="relative z-20">
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>

                  {/* Path 1: Office -> Lightning */}
                  <div className="flex-1 h-[2px] bg-gray-100 relative overflow-hidden mx-1 sm:mx-2">
                    <div className="absolute top-0 left-0 h-full bg-indigo-400 shadow-[0_0_15px_2px_rgba(99,102,241,1),0_0_30px_5px_rgba(99,102,241,0.5)] animate-beam-1 rounded-full" />
                  </div>

                  {/* Center: Lightning Icon */}
                  <div className="relative z-10 shrink-0">
                    <div className="h-13 w-13 sm:h-16 sm:w-16 flex items-center justify-center loader-ring green animate-lightning-pulse">
                      <span></span>
                      <div className="relative z-20">
                        <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-green-500 fill-green-500" />
                      </div>
                    </div>
                  </div>

                  {/* Path 2: Lightning -> User */}
                  <div className="flex-1 h-[2px] bg-gray-100 relative overflow-hidden mx-1 sm:mx-2 flex flex-col justify-center gap-[2px]">
                    <div className="absolute top-0 left-0 h-full bg-indigo-400 shadow-[0_0_15px_2px_rgba(99,102,241,1),0_0_30px_5px_rgba(99,102,241,0.5)] animate-beam-2 rounded-full" />
                  </div>

                  {/* User Icon */}
                  <div className="relative z-10 shrink-0">
                    <div className="h-11 w-11 sm:h-14 sm:w-14 flex items-center justify-center loader-ring indigo animate-user-ripple">
                      <span></span>
                      <div className="relative z-20">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto text-center sm:text-left">
                <h3 className="font-semibold text-gray-900">
                  A Complete Platform
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Seamless flow from institution to faculty.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Host College — sm:12 / lg:6 */}
          <Card className="sm:col-span-12 lg:col-span-6 bg-gray-50/50 border-gray-100 shadow-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <CardContent className="p-5 sm:p-6 h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-900">Host College</h3>
                <p className="text-sm text-gray-500">
                  Create, schedule, and manage program.
                </p>
              </div>

              {/* Stack on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left Panel: Sessions List */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-900">
                      Create Program
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Title, dates, fee, capacity
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg border border-gray-50 bg-gray-50/50"
                      >
                        <div className="min-w-0 mr-2">
                          <div className="text-[10px] font-medium text-gray-900 truncate">
                            Sessions 02 - Evaluating AI Tools
                          </div>
                          <div className="text-[9px] text-gray-400">
                            10:00 AM - 11:30 AM IST • Room B-301
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[9px] px-2 bg-white border-gray-200 shrink-0"
                        >
                          Mark Attendance
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Create Form — full width on mobile, fixed on sm+ */}
                <div className="sm:w-48 bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-2">
                  <div className="mb-1">
                    <div className="text-xs font-semibold text-gray-900">
                      Create Program
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Title, dates, fee, capacity
                    </div>
                  </div>
                  <Input
                    className="h-7 text-[10px] px-2"
                    placeholder="Program title"
                  />
                  <div className="flex gap-2">
                    <Input
                      className="h-7 text-[10px] px-2"
                      placeholder="Start"
                    />
                    <Input className="h-7 text-[10px] px-2" placeholder="End" />
                  </div>
                  <div className="flex gap-2">
                    <Input className="h-7 text-[10px] px-2" placeholder="Fee" />
                    <Input
                      className="h-7 text-[10px] px-2"
                      placeholder="Capacity"
                    />
                  </div>
                  <Button className="h-7 w-full bg-black hover:bg-gray-800 text-white text-[10px] mt-1">
                    Publish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Faculty View — sm:12 / lg:6 */}
          <Card className="sm:col-span-12 lg:col-span-6 bg-gray-50/50 border-gray-100 shadow-none rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <CardContent className="p-5 sm:p-6 h-full flex flex-col">
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-900">Faculty View</h3>
                <p className="text-sm text-gray-500">
                  Enroll, complete assignment, download certificate.
                </p>
              </div>

              {/* Stack on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left Panel: Enrollment — full width on mobile, fixed on sm+ */}
                <div className="sm:w-48 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-900">
                      Current Enrollment
                    </div>
                    <div className="text-[10px] text-green-600 font-medium">
                      2 active
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Modern Web",
                        time: "Tue 10:00",
                        progress: "70%",
                      },
                      {
                        name: "AI for Educators",
                        time: "Wed 14:00",
                        progress: "45%",
                      },
                      {
                        name: "Data Science Bootcamp",
                        time: "Thu 16:00",
                        progress: "60%",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="min-w-0 mr-2">
                          <div className="text-[10px] font-medium text-gray-900 truncate">
                            {item.name}
                          </div>
                          <div className="text-[9px] text-gray-400">
                            Next session: {item.time}
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-gray-700 shrink-0">
                          {item.progress}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Assignments */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-900">
                      Assignments
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Upload & track feedback
                    </div>
                  </div>
                  <div className="flex-1 min-h-[2rem]" /> {/* Spacer */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-medium text-gray-900">
                      Rubric draft
                    </div>
                    <Badge
                      variant="secondary"
                      className="h-5 text-[9px] bg-red-50 text-red-600 hover:bg-red-50 border-none"
                    >
                      Due Fri
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-7 rounded-md border border-gray-200 flex items-center px-2 text-[10px] text-gray-400">
                      Attach file...
                    </div>
                    <Button className="h-7 bg-black hover:bg-gray-800 text-white text-[10px] gap-1 px-3">
                      <Upload className="h-3 w-3" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Bento01;
