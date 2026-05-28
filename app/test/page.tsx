"use client";

import * as React from "react";
import {
  IconSparkle,
  IconAppStack,
  IconFiles,
  IconMagicWandSparkle,
  IconChartBar,
  IconUsers,
} from "nucleo-glass";
import { cn } from "@/lib/utils";

const navItems = [
  {
    id: "structured",
    label: "Structured Content",
    icon: IconAppStack,
    active: true,
  },
  { id: "summarizer", label: "Summarizer", icon: IconFiles },
  { id: "prompts", label: "Creative Prompts", icon: IconMagicWandSparkle },
  { id: "data", label: "Data Visualization", icon: IconChartBar },
  { id: "engagement", label: "User Engagement Strategies", icon: IconUsers },
];

export default function Block01() {
  const [activeTab, setActiveTab] = React.useState("structured");

  return (
    <section className="w-full min-h-screen bg-white dark:bg-[#000000] py-16 px-4 md:px-6 flex flex-col items-center gap-8 font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Header section */}
      <div className="flex flex-col items-center text-center gap-3 group cursor-default max-w-[700px]">
        <div className="flex items-center gap-2">
          <IconSparkle className="size-[28px] sm:size-[32px] text-zinc-900 dark:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#E3E3E3] dark:to-[#A3A3A3] transition-all duration-300 leading-tight">
            AI writing Assistant
          </h1>
        </div>
        <p className="text-zinc-500 dark:text-[#848484] text-base sm:text-lg font-normal transition-colors duration-300">
          Transform your ideas into polished content with AI-powered writing
          tools.
        </p>
      </div>

      {/* Navigation Bar (Glass effect) */}
      <div className="w-full max-w-[900px] overflow-x-auto no-scrollbar pb-2 flex justify-start lg:justify-center">
        <div
          className="h-[44px] bg-[#F9F9F9] dark:bg-[#111111] rounded-xl border border-[#D3D3D7] dark:border-[#2A2A2E] p-1 flex items-center gap-1 transition-all duration-300 flex-nowrap shadow-sm"
          style={{
            boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "h-[34px] px-3.5 flex items-center gap-2 rounded-lg text-[13px] font-medium transition-all duration-300 whitespace-nowrap outline-none",
                  isActive
                    ? "bg-white dark:bg-[#202020] text-zinc-900 dark:text-white border border-[#D3D3D7] dark:border-[#38383C] animate-giggle"
                    : "text-[#18181B]/50 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white",
                )}
                style={
                  isActive
                    ? {
                        filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1))",
                        boxShadow: "inset 0 -1px 2px rgba(0, 0, 0, 0.05)",
                      }
                    : {}
                }
              >
                <item.icon
                  className={cn(
                    "size-3.5",
                    isActive ? "opacity-100" : "opacity-50",
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className="w-full max-w-[1280px] pt-4 relative min-h-[580px]">
        {/* Structured Content Tab */}
        {activeTab === "structured" && (
          <div
            key="structured"
            className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-spring-in"
          >
            {/* Large Featured Card (Left) */}
            <div className="md:col-span-5 bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-1.5 transition-all duration-500 group/big hover:border-zinc-300 dark:hover:border-[#333]">
              <div className="w-full h-full bg-white dark:bg-[#161616] rounded-[24px] border border-zinc-100 dark:border-[#222] shadow-sm flex flex-col p-3 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex-1 w-full bg-zinc-50 dark:bg-[#0C0B0B] rounded-2xl border border-zinc-100 dark:border-[#1F1F1F] shadow-inner mb-4 flex flex-col p-2.5 gap-3 relative overflow-hidden group-hover/big:bg-zinc-100/30 dark:group-hover/big:bg-[#111] transition-colors duration-500">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-red-400/80" />
                    <div className="size-2.5 rounded-full bg-amber-400/80" />
                    <div className="size-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="w-3/4 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
                  <div className="space-y-2.5">
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full opacity-60" />
                    <div className="w-5/6 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full opacity-40" />
                    <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="size-7 rounded-full border border-white dark:border-[#161616] bg-zinc-200 dark:bg-zinc-800"
                        />
                      ))}
                    </div>
                    <div className="px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700 text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                      Status: Active
                    </div>
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    Structured
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover/big:translate-x-1 transition-transform">
                    Long-form Articles
                  </h3>
                  <p className="text-zinc-500 dark:text-white/60 text-sm leading-relaxed">
                    Perfectly formatted articles with headers and section
                    metadata.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Cards Column (Right) */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <div className="flex-1 bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-1.5 group/item hover:border-zinc-300 dark:hover:border-[#333] transition-all duration-500">
                <div className="w-full h-full bg-white dark:bg-[#161616] rounded-[24px] border border-zinc-100 dark:border-[#222] shadow-sm p-3 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="size-20 bg-zinc-100/50 dark:bg-[#0C0B0B] rounded-2xl border border-zinc-200/50 dark:border-[#1F1F1F] flex-shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <IconFiles className="size-10 text-blue-500 dark:text-blue-400 relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Smart Summarizer
                    </h3>
                    <p className="text-zinc-500 dark:text-white/60 text-sm leading-relaxed">
                      Condense complex academic papers or long reports into key
                      digestible points.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-1.5 group/item hover:border-zinc-300 dark:hover:border-[#333] transition-all duration-500">
                <div className="w-full h-full bg-white dark:bg-[#161616] rounded-[24px] border border-zinc-100 dark:border-[#222] shadow-sm p-3 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="size-20 bg-zinc-100/50 dark:bg-[#0C0B0B] rounded-2xl border border-zinc-200/50 dark:border-[#1F1F1F] flex-shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <IconMagicWandSparkle className="size-10 text-purple-500 dark:text-purple-400 relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      Creative Prompts
                    </h3>
                    <p className="text-zinc-500 dark:text-white/60 text-sm leading-relaxed">
                      Unlock creative potential with contextual prompt
                      suggestions tailored to your style.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summarizer Tab */}
        {activeTab === "summarizer" && (
          <div
            key="summarizer"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-spring-in"
          >
            <div className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-3">
              <div className="h-full bg-white dark:bg-[#161616] rounded-[24px] border border-zinc-100 dark:border-[#222] p-4 flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-xl bg-zinc-50 dark:bg-[#0C0B0B] flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                    <IconFiles className="size-6 text-zinc-400" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Source
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Document Analysis
                </h3>
                <div className="space-y-3 opacity-60">
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                  <div className="h-2 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                </div>
              </div>
            </div>
            <div className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-3">
              <div className="h-full bg-[#FAFAFF] dark:bg-[#111116] rounded-[24px] border border-blue-100 dark:border-blue-900/20 p-4 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <IconSparkle className="size-6 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                    AI Summary
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Insights Synthesized
                </h3>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex gap-3">
                      <div className="mt-1.5 size-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-full bg-blue-100 dark:bg-zinc-800 rounded-full" />
                        {item === 1 && (
                          <div className="h-2 w-2/3 bg-blue-100/40 rounded-full" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-blue-500/80 font-medium">
                    94% Synthesized
                  </span>
                  <button className="px-3.5 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Creative Prompts Tab */}
        {activeTab === "prompts" && (
          <div
            key="prompts"
            className="w-full flex justify-center animate-spring-in"
          >
            <div className="w-full max-w-[900px] bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-5 flex flex-col gap-10">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                  Creative Spark
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Suggested prompts based on your historical writing patterns.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Story", icon: "📖", color: "bg-orange-400" },
                  { label: "Work", icon: "💼", color: "bg-blue-400" },
                  { label: "Study", icon: "🎓", color: "bg-emerald-400" },
                  { label: "Poetry", icon: "✨", color: "bg-pink-400" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="group/prompt aspect-square bg-white dark:bg-[#161616] rounded-[20px] border border-zinc-100 dark:border-[#222] flex flex-col items-center justify-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <div
                      className={cn(
                        "size-12 rounded-2xl flex items-center justify-center text-xl shadow-md",
                        t.color,
                      )}
                    >
                      {t.icon}
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[13px]">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Visualization Tab */}
        {activeTab === "data" && (
          <div
            key="data"
            className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-2.5 animate-spring-in"
          >
            <div className="w-full bg-white dark:bg-[#161616] rounded-[24px] border border-zinc-100 dark:border-[#222] p-5 flex flex-col justify-between gap-8 relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                    Engagement Metrics
                  </h3>
                  <p className="text-xs font-medium text-blue-500">
                    +12.4% Increase
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-[10px] font-bold border border-zinc-200/50">
                    WEEK
                  </div>
                  <div className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[10px] font-bold">
                    PDF
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-4 h-40 mt-8 items-stretch">
                {[40, 75, 55, 100, 85, 95, 60, 80, 70, 90, 85, 95].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500/10 to-blue-500/80 rounded-t-lg transition-all duration-1000 origin-bottom"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Engagement Strategies Tab */}
        {activeTab === "engagement" && (
          <div
            key="engagement"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-spring-in"
          >
            {[
              {
                title: "Hook Mastery",
                desc: "Reduce bounce rates with high-contrast openers.",
                icon: "⚡",
              },
              {
                title: "Personalization",
                desc: "Adaptive paths based on user segments.",
                icon: "👤",
              },
              {
                title: "Visual Rhythm",
                desc: "Maintain velocity with visual anchors.",
                icon: "🎨",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[32px] border border-zinc-200 dark:border-[#1F1F1F] p-1.5 group/strat flex flex-col"
              >
                <div className="bg-white dark:bg-[#161616] rounded-[24px] p-4 flex flex-col gap-5 flex-1 shadow-sm">
                  <div className="size-14 rounded-2xl bg-zinc-50 dark:bg-[#0C0B0B] border border-zinc-100 flex items-center justify-center text-2xl shadow-inner group-hover/strat:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-zinc-500 dark:text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                  <button className="mt-6 text-blue-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:underline">
                    Explore <IconSparkle className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes spring-in {
          0% {
            transform: scale(0.95) translateY(10px);
            opacity: 0;
          }
          80% {
            transform: scale(1.02) translateY(-2px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes giggle {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(0.95) rotate(-1deg);
          }
          50% {
            transform: scale(1.05) rotate(1deg);
          }
          75% {
            transform: scale(0.98) rotate(-0.5deg);
          }
        }

        .animate-spring-in {
          animation: spring-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-giggle {
          animation: giggle 0.4s ease-in-out;
        }
      `}</style>
    </section>
  );
}
