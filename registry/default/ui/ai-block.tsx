"use client";

import * as React from "react";
import {
  IconSparkle,
  IconAppStack,
  IconFiles,
  IconMagicWandSparkle,
  IconChartBar,
  IconUsers,
  IconBookOpen,
  IconSuitcase,
  IconRulerPen,
  IconFeather,
  IconBolt,
  IconUser,
  IconColorPalette,
} from "nucleo-glass";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";

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

const collaborators = [
  { name: "shadcn", handle: "shadcn" },
  { name: "Lee Robinson", handle: "leerob" },
  { name: "Evil Rabbit", handle: "evilrabbit" },
];

const engagement = [
  { month: "Jan", reads: 40 },
  { month: "Feb", reads: 75 },
  { month: "Mar", reads: 55 },
  { month: "Apr", reads: 100 },
  { month: "May", reads: 85 },
  { month: "Jun", reads: 95 },
  { month: "Jul", reads: 60 },
  { month: "Aug", reads: 80 },
  { month: "Sep", reads: 70 },
  { month: "Oct", reads: 90 },
  { month: "Nov", reads: 85 },
  { month: "Dec", reads: 95 },
];

export default function Block01() {
  const [activeTab, setActiveTab] = React.useState("structured");
  const [revealed, setRevealed] = React.useState(false);

  // Stand-in for a fetch: let the skeleton pulse once, then show the draft.
  React.useEffect(() => {
    if (activeTab !== "structured") return setRevealed(false);
    const id = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(id);
  }, [activeTab]);

  return (
    <section className="w-full min-h-screen bg-card dark:bg-background py-16 px-4 md:px-6 flex flex-col items-center gap-4 font-sans overflow-x-hidden">
      {/* Header section */}
      <div className="flex flex-col items-center text-center gap-3 group cursor-default max-w-[700px]">
        <div className="flex items-center gap-2">
          <IconSparkle className="size-[28px] sm:size-[32px] text-zinc-900 dark:text-zinc-50 group-hover:scale-105 group-hover:rotate-12 transition-[rotate,scale] duration-200 group-hover:duration-[250ms] ease-[ease] motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100" />
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-[#E3E3E3] dark:to-[#A3A3A3] leading-tight">
            AI writing Assistant
          </h1>
        </div>
        <p className="text-zinc-500 dark:text-[#848484] text-base sm:text-lg font-normal">
          Transform your ideas into polished content with AI-powered writing
          tools.
        </p>
      </div>

      {/* Navigation Bar (Glass effect) */}
      <div className="w-full max-w-[900px] overflow-x-auto no-scrollbar pb-2 flex justify-start lg:justify-center">
        <div
          className="h-[44px] bg-[#F9F9F9] dark:bg-[#111111] rounded-xl border border-[#D3D3D7] dark:border-[#2A2A2E] p-1 flex items-center gap-1 flex-nowrap shadow-sm"
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
                  "h-[34px] px-3.5 flex items-center gap-2 rounded-lg text-[13px] font-medium transition-[color,background-color,border-color] duration-150 ease-[ease] whitespace-nowrap outline-none",
                  isActive
                    ? "bg-card dark:bg-[#202020] text-zinc-900 dark:text-zinc-50 border border-[#D3D3D7] dark:border-[#38383C]"
                    : "text-[#18181B]/50 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50",
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
      <div className="w-full max-w-[1024px] pt-2 relative min-h-[460px]">
        {/* Structured Content Tab */}
        {activeTab === "structured" && (
          <div
            key="structured"
            className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-spring-in"
          >
            {/* Large Featured Card (Left) */}
            <div className="md:col-span-5 bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2 transition-[border-color] duration-200 ease-[ease] group/big hover:border-zinc-300 dark:hover:border-[#333]">
              <div className="wada wada-shell w-full aspect-[4/5] bg-card dark:bg-[#161616] rounded-[16px] border border-zinc-100 dark:border-[#222] shadow-sm flex flex-col p-6 overflow-hidden relative">
                <div className="flex-1 w-full bg-zinc-50 dark:bg-[#0C0B0B] rounded-xl border border-zinc-100 dark:border-[#1F1F1F] shadow-inner mb-5 flex flex-col p-5 gap-3 relative overflow-hidden group-hover/big:bg-zinc-100/30 dark:group-hover/big:bg-[#111] group-hover/big:-skew-y-[2deg] transition-[transform,background-color] duration-200 group-hover/big:duration-[250ms] ease-[ease] motion-reduce:transition-none motion-reduce:group-hover/big:skew-0">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-red-400/80" />
                    <div className="size-2.5 rounded-full bg-amber-400/80" />
                    <div className="size-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  {/* Skeleton pulses once, then cross-fades to the draft (transitions.dev skeleton reveal). */}
                  <div className={cn("t-skel", revealed && "is-revealed")}>
                    <div className="t-skel-skeleton is-pulsing flex flex-col gap-3" aria-hidden>
                      <div className="w-3/4 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                      <div className="space-y-2.5">
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full opacity-60" />
                        <div className="w-5/6 h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full opacity-40" />
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
                      </div>
                    </div>
                    <div className="t-skel-content flex flex-col gap-2">
                      <p className="text-[13px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                        Designing calm interfaces
                      </p>
                      <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Start with an outline: one idea per section, short
                        paragraphs, and headings that read like a table of
                        contents.
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        6 min read · 1,240 words
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {collaborators.map((person) => (
                        <div
                          key={person.handle}
                          className="size-7 rounded-full border border-card dark:border-[#161616] bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://github.com/${person.handle}.png?size=56`}
                            alt={person.name}
                            className={cn(
                              "size-full object-cover transition-[opacity,filter] duration-[400ms] ease-in-out motion-reduce:transition-none",
                              revealed ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
                            )}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="px-3 py-1.5 bg-card dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700 text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                      Status: Active
                    </div>
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    Structured
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Long-form Articles
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-50/60 text-sm leading-relaxed">
                    Perfectly formatted articles with headers and section
                    metadata.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Cards Column (Right) */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex-1 bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2 group/item hover:border-zinc-300 dark:hover:border-[#333] transition-[border-color] duration-200 ease-[ease]">
                <div className="wada wada-lemon w-full h-full bg-card dark:bg-[#161616] rounded-[16px] border border-zinc-100 dark:border-[#222] shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="size-16 bg-zinc-100/50 dark:bg-[#0C0B0B] rounded-xl border border-zinc-200/50 dark:border-[#1F1F1F] flex-shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
                    {/* Optical nudge: the dark back sheet sits top-left, so the box centre reads high-left. */}
                    <IconFiles className="size-7 relative z-10 translate-x-[1.5px] translate-y-[1.5px] group-hover/item:-rotate-6 group-hover/item:scale-[1.06] transition-[rotate,scale] duration-200 group-hover/item:duration-[250ms] ease-[ease] motion-reduce:transition-none motion-reduce:group-hover/item:rotate-0 motion-reduce:group-hover/item:scale-100" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Smart Summarizer
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-50/60 text-sm leading-relaxed">
                      Condense complex academic papers or long reports into key
                      digestible points.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2 group/item hover:border-zinc-300 dark:hover:border-[#333] transition-[border-color] duration-200 ease-[ease]">
                <div className="wada wada-lilac w-full h-full bg-card dark:bg-[#161616] rounded-[16px] border border-zinc-100 dark:border-[#222] shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="size-16 bg-zinc-100/50 dark:bg-[#0C0B0B] rounded-xl border border-zinc-200/50 dark:border-[#1F1F1F] flex-shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <IconMagicWandSparkle className="size-7 relative z-10 group-hover/item:rotate-12 group-hover/item:scale-[1.06] transition-[rotate,scale] duration-200 group-hover/item:duration-[250ms] ease-[ease] motion-reduce:transition-none motion-reduce:group-hover/item:rotate-0 motion-reduce:group-hover/item:scale-100" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Creative Prompts
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-50/60 text-sm leading-relaxed">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-spring-in"
          >
            <div className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2 min-h-[320px]">
              <div className="wada wada-turq h-full bg-card dark:bg-[#161616] rounded-[16px] border border-zinc-100 dark:border-[#222] p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-xl bg-zinc-50 dark:bg-[#0C0B0B] flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                    <IconFiles className="size-6 text-zinc-400" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Source
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
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
            <div className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2 min-h-[320px]">
              <div className="wada wada-glaucous h-full bg-card dark:bg-[#161616] rounded-[16px] border border-zinc-100 dark:border-[#222] p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <IconSparkle className="size-6 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                    AI Summary
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Insights Synthesized
                </h3>
                <ul className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex gap-3">
                      <div className="mt-1.5 size-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-full bg-blue-100 dark:bg-zinc-800 rounded-full" />
                        {item === 1 && (
                          <div className="h-2 w-2/3 bg-blue-100/40 dark:bg-zinc-800/60 rounded-full" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-blue-500/80 font-medium">
                    94% Synthesized
                  </span>
                  <button className="px-3.5 py-1.5 bg-blue-500 text-zinc-50 rounded-lg text-xs font-semibold hover:bg-blue-600 active:scale-[0.97] transition-[background-color,scale] duration-150 ease-out motion-reduce:active:scale-100">
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
            <div className="w-full max-w-[900px] bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-6 flex flex-col gap-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Creative Spark
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Suggested prompts based on your historical writing patterns.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Story", icon: IconBookOpen, wada: "wada-shell" },
                  { label: "Work", icon: IconSuitcase, wada: "wada-lemon" },
                  { label: "Study", icon: IconRulerPen, wada: "wada-rose" },
                  { label: "Poetry", icon: IconFeather, wada: "wada-shell" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className={cn("wada", t.wada, "group/prompt aspect-square bg-card dark:bg-[#161616] rounded-[20px] border border-zinc-100 dark:border-[#222] flex flex-col items-center justify-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-[translate,box-shadow] duration-[250ms] ease-[ease] motion-reduce:transition-none motion-reduce:hover:translate-y-0 shadow-sm cursor-pointer")}
                  >
                    <div className="size-12 rounded-xl bg-zinc-100/50 dark:bg-[#0C0B0B] border border-zinc-200/50 dark:border-[#1F1F1F] flex items-center justify-center shadow-inner">
                      <t.icon className="size-6" />
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
          <div key="data" className="mx-auto w-full max-w-[720px] animate-spring-in">
            <div className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2">
              <div className="wada wada-shell bg-card dark:bg-[#161616] rounded-[16px] border border-zinc-100 dark:border-[#222] p-5 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Engagement Metrics
                    </h3>
                    <p className="text-xs font-medium text-blue-500">
                      +12.4% Increase
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-md text-[10px] font-bold border border-zinc-200/50 dark:border-zinc-700">
                      WEEK
                    </div>
                    <div className="px-2.5 py-1 bg-blue-500 text-zinc-50 rounded-md text-[10px] font-bold">
                      PDF
                    </div>
                  </div>
                </div>
                <BarChart data={engagement} xDataKey="month" aspectRatio="5 / 2" barGap={0.35}>
                  <Grid horizontal numTicksRows={4} />
                  <Bar dataKey="reads" fill="var(--color-blue-500)" lineCap={4} />
                  <BarXAxis />
                  <ChartTooltip />
                </BarChart>
              </div>
            </div>
          </div>
        )}

        {/* User Engagement Strategies Tab */}
        {activeTab === "engagement" && (
          <div
            key="engagement"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-spring-in"
          >
            {[
              {
                title: "Hook Mastery",
                desc: "Reduce bounce rates with high-contrast openers.",
                icon: IconBolt,
                wada: "wada-shell",
              },
              {
                title: "Personalization",
                desc: "Adaptive paths based on user segments.",
                icon: IconUser,
                wada: "wada-lemon",
              },
              {
                title: "Visual Rhythm",
                desc: "Maintain velocity with visual anchors.",
                icon: IconColorPalette,
                wada: "wada-rose",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F9F9F9] dark:bg-[#0F0E0E] rounded-[24px] border border-zinc-200 dark:border-[#1F1F1F] p-2 group/strat flex flex-col"
              >
                <div className={cn("wada", item.wada, "bg-card dark:bg-[#161616] rounded-[16px] p-6 flex flex-col gap-5 flex-1 shadow-sm")}>
                  <div className="size-12 rounded-xl bg-zinc-100/50 dark:bg-[#0C0B0B] border border-zinc-200/50 dark:border-[#1F1F1F] flex items-center justify-center shadow-inner">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-zinc-500 dark:text-zinc-50/60 leading-relaxed">
                    {item.desc}
                  </p>
                  <button className="group/explore mt-auto self-start pt-2 text-zinc-500 dark:text-zinc-400 font-semibold text-[11px] leading-none uppercase tracking-wider inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-150 ease-[ease]">
                    Explore
                    <ArrowRight className="size-3.5 transition-[translate] duration-200 ease-[ease] group-hover/explore:translate-x-0.5 motion-reduce:transition-none" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`

        /* Sanzo Wada pairs (A Dictionary of Color Combinations). Each card's pair
           rises from its bottom edge and is gone by mid-card, so titles and icons
           sit on clean white and the colour pools at the base. */
        .wada {
          --wada-o: 0.18;
          background-image: linear-gradient(
            to top,
            rgb(var(--wada-a) / var(--wada-o)),
            rgb(var(--wada-b) / calc(var(--wada-o) * 0.6)) 30%,
            transparent 60%
          );
        }
        .dark .wada {
          --wada-o: 0.06;
        }
        .wada-shell { --wada-a: 171 213 220; --wada-b: 249 216 199; }
        .wada-lemon { --wada-a: 244 227 161; --wada-b: 169 200 214; }
        .wada-rose { --wada-a: 241 194 201; --wada-b: 200 184 220; }
        .wada-lilac { --wada-a: 213 200 230; --wada-b: 198 226 209; }
        .wada-turq { --wada-a: 166 216 212; --wada-b: 247 220 203; --wada-o: 0.12; }
        .wada-glaucous { --wada-a: 191 214 234; --wada-b: 213 200 230; --wada-o: 0.12; }
        .dark .wada-turq,
        .dark .wada-glaucous { --wada-o: 0.04; }

        /* transitions.dev skeleton reveal. The two layers share one grid cell,
           so the slot sizes to the taller of them and the swap never shifts layout. */
        .t-skel {
          --pulse-dur: 1000ms;
          --pulse-count: 1;
          --pulse-min: 0.5;
          --reveal-dur: 400ms;
          --reveal-blur: 2px;
          --reveal-ease: ease-in-out;
          display: grid;
        }
        .t-skel-skeleton,
        .t-skel-content {
          grid-area: 1 / 1;
        }
        .t-skel-skeleton {
          z-index: 1;
          opacity: 1;
          filter: blur(0);
          transition:
            opacity var(--reveal-dur) var(--reveal-ease),
            filter var(--reveal-dur) var(--reveal-ease);
        }
        .t-skel-content {
          z-index: 2;
          opacity: 0;
          filter: blur(var(--reveal-blur));
          transition:
            opacity var(--reveal-dur) var(--reveal-ease),
            filter var(--reveal-dur) var(--reveal-ease);
        }
        .t-skel.is-revealed .t-skel-skeleton {
          opacity: 0;
          filter: blur(var(--reveal-blur));
        }
        .t-skel.is-revealed .t-skel-content {
          opacity: 1;
          filter: blur(0);
        }
        .t-skel-skeleton.is-pulsing > * {
          animation: t-skel-pulse var(--pulse-dur) ease-in-out var(--pulse-count);
        }
        @keyframes t-skel-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: var(--pulse-min);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-skel-skeleton,
          .t-skel-content {
            transition: none !important;
          }
          .t-skel-skeleton.is-pulsing > * {
            animation: none !important;
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Tab content entrance: short, no overshoot. Tabs switch often, so it
           stays near-imperceptible; reduced motion keeps only the fade. */
        @keyframes spring-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }


        .animate-spring-in {
          animation: spring-in 250ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-spring-in {
            animation: fade-in 200ms ease both;
          }
        }

      `}</style>
    </section>
  );
}
