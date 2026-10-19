"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BorderBeam } from "border-beam";
import { ArrowUp, ChevronDown, Plus, Settings2 } from "lucide-react";
import * as React from "react";

const AI_MODELS = [
  {
    id: "gemini",
    name: "Gemini",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z"
          fill="#4285F4"
        />
        <path
          d="M12 3L14.5 9L21 12L14.5 15L12 21L9.5 15L3 12L9.5 9L12 3Z"
          fill="url(#gemini_grad)"
          fillOpacity="0.8"
        />
        <defs>
          <linearGradient
            id="gemini_grad"
            x1="3"
            y1="3"
            x2="21"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4285F4" />
            <stop offset="1" stopColor="#9B72CB" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          fill="#10A37F"
        />
        <path
          d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          fill="#10A37F"
        />
      </svg>
    ),
  },
  {
    id: "claude",
    name: "Claude",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="10" fill="#D97757" fillOpacity="0.2" />
        <path
          d="M12 8v8M8 12h8"
          stroke="#D97757"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "grok",
    name: "Grok",
    logo: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" fill="black" />
        <path
          d="M8 8l8 8M16 8l-8 8"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// Reads a client-only condition and re-reads it when it changes. The server
// snapshot assumes dark with motion, which is what the card renders first.
function useClientFlag(
  read: () => boolean,
  subscribe: (onChange: () => void) => () => void,
  server: boolean,
) {
  return React.useSyncExternalStore(subscribe, read, () => server);
}

const subscribeTheme = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => mo.disconnect();
};
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

// The composer's beam has three phases:
//   idle       slow ambient lap, soft glow
//   typing     lap glides to a stop, glow breathes bright to dim beside the text
//   generating after Enter or send: bright and fast until the reply lands
type BeamPhase = "idle" | "typing" | "generating";

const BEAM = {
  idle: { rate: 1, strength: 0.7, lightStrength: 0.9 },
  typing: { rate: 0, strength: 0.4, lightStrength: 0.4 },
  generating: { rate: 3.5, strength: 1, lightStrength: 1 },
} as const;

// The package's light preset draws the stroke at 12% opacity, which all but
// vanishes on white. These vars multiply each layer's preset opacity, so light
// mode raises them past 1. !important because the package sets them inline.
const BEAM_LIGHT_CSS = `
[data-beam="{id}"] {
  --beam-stroke-opacity: 3 !important;
  --beam-inner-opacity: 1.8 !important;
  --beam-bloom-opacity: 1.6 !important;
}
`;

// One lap at rate 1. Generating runs ~2s a lap.
const BEAM_LAP_SECONDS = 7;
// Quick to wake on submit, slower to settle back or glide to a stop.
const BEAM_WAKE_MS = 400;
const BEAM_SETTLE_MS = 1200;
// Stand-in for a real request in this demo.
const DEMO_GENERATION_MS = 3500;

// `strength` lands as an inline --beam-strength. Registering it as a number
// lets it transition instead of snapping between phases.
const BEAM_CSS = `
@property --beam-strength { syntax: "<number>"; inherits: true; initial-value: 1; }
[data-beam="{id}"] { transition: --beam-strength 500ms cubic-bezier(0.23, 1, 0.32, 1); }
`;

export default function AIContentCreatorCard() {
  // The beam needs its theme passed in, so follow the `dark` class the card's own styles key off.
  const isDark = useClientFlag(
    () => document.documentElement.classList.contains("dark"),
    subscribeTheme,
    true,
  );
  // Rotating beams ignore reduced motion on their own.
  const reducedMotion = useClientFlag(
    () => window.matchMedia(REDUCE).matches,
    subscribeMotion,
    false,
  );
  const [selectedModel, setSelectedModel] = React.useState(AI_MODELS[0]);
  // Structured inputs stay folded until asked for, so the card opens at prompt size.
  const [expanded, setExpanded] = React.useState(false);
  const panelId = React.useId();
  const [fieldsKey, setFieldsKey] = React.useState(0);

  const [focused, setFocused] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const phase: BeamPhase = generating
    ? "generating"
    : focused
      ? "typing"
      : "idle";
  const beamRef = React.useRef<HTMLDivElement>(null);
  const promptRef = React.useRef<HTMLTextAreaElement>(null);

  function submit() {
    if (generating || !promptRef.current?.value.trim()) return;
    setGenerating(true);
  }

  React.useEffect(() => {
    if (!generating) return;
    const id = setTimeout(() => setGenerating(false), DEMO_GENERATION_MS);
    return () => clearTimeout(id);
  }, [generating]);

  // Ramp the beam's own CSS animations with updatePlaybackRate, which keeps
  // each one's current position. Changing `duration` instead would restart
  // the keyframes and make the light jump around the border.
  React.useEffect(() => {
    const el = beamRef.current;
    if (!el || reducedMotion) return;
    const anims = el
      .getAnimations({ subtree: true })
      .filter(
        (a): a is CSSAnimation =>
          a instanceof CSSAnimation &&
          a.animationName.startsWith("beam-") &&
          !a.animationName.startsWith("beam-fade"),
      );
    if (anims.length === 0) return;
    const from = anims[0].playbackRate;
    const to = BEAM[phase].rate;
    if (from === to) return;
    const ms = to > from ? BEAM_WAKE_MS : BEAM_SETTLE_MS;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      const rate = from + (to - from) * eased;
      for (const a of anims) a.updatePlaybackRate(rate);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // isDark: a theme flip regenerates the beam's keyframes, so re-apply the rate.
  }, [phase, isDark, reducedMotion]);

  // While typing the beam holds still and breathes bright to dim. WAAPI rather
  // than a CSS rule: an `animation` declaration on the wrapper would replace
  // the package's own spin and fade-in running on that same element.
  React.useEffect(() => {
    const el = beamRef.current;
    if (!el || reducedMotion || phase !== "typing") return;
    const breathe = el.animate(
      [{ "--beam-strength": 0.4 }, { "--beam-strength": 0.75 }],
      {
        duration: 2400,
        delay: 500, // let the strength ease down from idle first
        iterations: Infinity,
        direction: "alternate",
        easing: "cubic-bezier(0.37, 0, 0.63, 1)", // sine in-out, a breath has no hard edge
      },
    );
    return () => breathe.cancel();
  }, [phase, reducedMotion]);

  return (
    <div className="flex items-center justify-center p-4">
      {/* Outer frame matching the designers #F9F9F9 rect with rx=32 */}
      <div className="w-full max-w-[571px] rounded-[32px] border border-[#E3E3E6] bg-[#F9F9F9] p-[8px] dark:bg-background dark:border-border">
        {/* Inner white card matching the white rect with rx=24 */}
        <div className="rounded-[24px] border border-[#D3D3D7] bg-white p-8 shadow-[0_2px_2px_0_rgba(0,0,0,0.12)] dark:bg-card dark:border-border dark:shadow-none">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            {/* Pro Badge */}
            <div className="flex items-center gap-1 rounded-md border border-[#E4E4E4] bg-[#F5F5F5] pl-1 pr-2 py-0.5 dark:border-border dark:bg-muted">
              <svg
                width={20}
                height={21}
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 scale-90"
              >
                <g clipPath="url(#clip0_pro_icon)">
                  <mask
                    id="mask0_pro_icon"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x={0}
                    y={0}
                    width={20}
                    height={21}
                  >
                    <path d="M20 0H0V21H20V0Z" fill="white" />
                    <path
                      d="M10 7.56011V1.64993C10 0.777385 8.84367 0.483345 8.43308 1.25149L3.34149 10.7766C2.92607 11.6142 3.53062 12.5999 4.45965 12.6001H10V7.56011Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0_pro_icon)">
                    <path
                      d="M10 12.6V19.3502C10 20.2228 11.1563 20.5168 11.5669 19.7487L16.6585 10.2236C17.0739 9.38595 16.4694 8.40021 15.5403 8.40004H10V5.04004C7.91667 7.14004 6.56123 8.93503 6.25 12.6H10Z"
                      fill="url(#paint0_linear_pro_icon)"
                    />
                  </g>
                  <mask
                    id="mask1_pro_icon"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x={3}
                    y={0}
                    width={7}
                    height={13}
                  >
                    <path
                      d="M10 7.56011V1.64993C10 0.777385 8.84367 0.483345 8.43308 1.25149L3.34149 10.7766C2.92607 11.6142 3.53062 12.5999 4.45965 12.6001H10V7.56011Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask1_pro_icon)">
                    <g filter="url(#filter0_f_pro_icon)">
                      <path
                        d="M10 12.6V19.3502C10 20.2228 11.1563 20.5168 11.5669 19.7487L16.6585 10.2236C17.0739 9.38595 16.4694 8.40021 15.5403 8.40004H10V5.04004C7.91667 7.14004 6.56123 8.93503 6.25 12.6H10Z"
                        fill="url(#paint1_linear_pro_icon)"
                      />
                    </g>
                  </g>
                  <path
                    d="M10 7.56011V1.64993C10 0.777385 8.84367 0.483345 8.43308 1.25149L3.34149 10.7766C2.92607 11.6142 3.53062 12.5999 4.45965 12.6001H10V7.56011Z"
                    fill="url(#paint2_linear_pro_icon)"
                  />
                  <path
                    d="M8.43342 1.25055C8.84425 0.483413 9.99959 0.777297 10 1.64923V10.0796H9.375V1.64923C9.37492 1.57895 9.35392 1.54013 9.3335 1.51552C9.309 1.48612 9.26934 1.45892 9.21792 1.44579C9.16642 1.43272 9.11825 1.43734 9.08284 1.45153C9.05325 1.46344 9.01675 1.488 8.98359 1.54997L4.42302 10.0796H3.71338L8.43342 1.25055Z"
                    fill="url(#paint3_linear_pro_icon)"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_f_pro_icon"
                    x={2.25}
                    y={1.04004}
                    width={18.542}
                    height={23.1516}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feGaussianBlur
                      stdDeviation={2}
                      result="effect1_foregroundBlur_pro_icon"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_pro_icon"
                    x1={11.5208}
                    y1={5.04004}
                    x2={11.5208}
                    y2={22.68}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#575757" />
                    <stop offset={1} stopColor="#151515" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_pro_icon"
                    x1={11.5208}
                    y1={5.04004}
                    x2={11.5208}
                    y2={22.68}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#575757" />
                    <stop offset={1} stopColor="#151515" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_pro_icon"
                    x1={6.60417}
                    y1={-1.67989}
                    x2={6.60417}
                    y2={12.6001}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#6AFF34" stopOpacity={0.6} />
                    <stop offset={1} stopColor="#91FF0A" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_pro_icon"
                    x1={6.85667}
                    y1={0.808807}
                    x2={6.85667}
                    y2={9.23989}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset={1} stopColor="white" stopOpacity={0} />
                  </linearGradient>
                  <clipPath id="clip0_pro_icon">
                    <rect width={20} height={21} fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[12px] font-bold text-black dark:text-white">
                Pro
              </span>
            </div>

            {/* Token count */}
            <span className="text-[13px] font-medium text-[#371CFF] dark:text-[#8A7BFF]">
              12514 tokens left
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-[18px] font-semibold leading-tight tracking-tight text-[#18181B] dark:text-[#00FFA1]">
              Structured Content Generator
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#71717A] dark:text-zinc-400">
              Generate specific types of content with clear objectives and
              structured inputs
            </p>
          </div>

          {/* Prompt Textarea Section */}
          {/* Siri-style glow circling the composer. md clips its wrapper, so spacing and shadow live here, not on the box */}
          <BorderBeam
            size="md"
            colorVariant="colorful"
            strength={isDark ? BEAM[phase].strength : BEAM[phase].lightStrength}
            saturation={isDark ? undefined : 2}
            theme={isDark ? "dark" : "light"}
            duration={BEAM_LAP_SECONDS}
            css={isDark ? BEAM_CSS : BEAM_CSS + BEAM_LIGHT_CSS}
            active={!reducedMotion}
            ref={beamRef}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
            }}
            className="mb-8 rounded-2xl shadow-sm dark:shadow-none"
          >
            <div className="overflow-hidden rounded-2xl border border-[#E3E3E6] bg-white dark:border-border dark:bg-background">
              <div className="p-4">
                <textarea
                  ref={promptRef}
                  aria-label="Content prompt"
                  aria-busy={generating}
                  onKeyDown={(e) => {
                    // Enter sends, Shift+Enter keeps a newline. Skip while an IME is composing.
                    if (
                      e.key !== "Enter" ||
                      e.shiftKey ||
                      e.nativeEvent.isComposing
                    )
                      return;
                    e.preventDefault();
                    submit();
                  }}
                  placeholder="Describe the content you want to generate..."
                  className="min-h-[100px] w-full resize-none bg-transparent p-0 text-[14px] text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100 placeholder:dark:text-zinc-600"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#F4F4F5] bg-white px-4 py-3 dark:border-border dark:bg-muted">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Plus
                    size={18}
                    className="cursor-pointer hover:text-zinc-900 dark:hover:text-white"
                  />
                  <button
                    type="button"
                    aria-label="Structured inputs"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setExpanded((v) => !v)}
                    className={`-m-1 rounded-md p-1 transition-[color,transform] duration-150 ease-out hover:text-zinc-900 active:scale-[0.97] dark:hover:text-white ${expanded ? "text-zinc-900 dark:text-[#00FFA1]" : ""}`}
                  >
                    <Settings2 size={18} />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex cursor-pointer items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white">
                        {selectedModel.logo}
                        <ChevronDown size={12} strokeWidth={3} />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[160px] dark:bg-card dark:border-border"
                    >
                      {AI_MODELS.map((model) => (
                        <DropdownMenuItem
                          key={model.id}
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setSelectedModel(model)}
                        >
                          {model.logo}
                          <span className="text-sm font-medium">
                            {model.name}
                          </span>
                          {selectedModel.id === model.id && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#00FFA1]" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-1.5 text-[11px] font-medium sm:flex">
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, #71717A 0%, #CFCFE0 50%, #71717A 100%)",
                        backgroundSize: "200% auto",
                        animation: "light-beam 3s linear infinite",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Upgrade to Team to unlock
                    </span>
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
                                          @keyframes light-beam {
                                              from { background-position: 200% 0; }
                                              to { background-position: -200% 0; }
                                          }
                                      `,
                      }}
                    />
                    <span className="cursor-pointer text-[#371CFF] hover:underline dark:text-[#85B4FF]">
                      Upgrade Plan
                    </span>
                  </div>
                  {/* Decorative: the shortcut is announced on the button itself */}
                  <kbd
                    aria-hidden
                    className="hidden h-5 min-w-5 items-center justify-center rounded-[5px] border border-[#E3E3E6] bg-[#F4F4F5] px-1 font-sans text-[11px] leading-none text-zinc-500 shadow-[0_1px_0_rgba(0,0,0,0.06)] sm:inline-flex dark:border-input dark:bg-input/30 dark:text-zinc-400 dark:shadow-none"
                  >
                    ↵
                  </kbd>
                  <button
                    type="button"
                    aria-label="Generate"
                    aria-keyshortcuts="Enter"
                    title="Send (Enter). Shift+Enter for a new line"
                    onClick={submit}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] dark:bg-zinc-800 dark:text-[#00FFA1]"
                  >
                    <ArrowUp size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </BorderBeam>

          {/* Divider doubles as the disclosure for the structured form */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E3E3E6] dark:bg-border" />
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400 transition-[color,transform] duration-150 ease-out hover:text-zinc-900 active:scale-[0.97] dark:text-zinc-500 dark:hover:text-white"
            >
              {expanded ? "Hide structured inputs" : "Or use structured inputs"}
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
              />
            </button>
            <div className="h-px flex-1 bg-[#E3E3E6] dark:bg-border" />
          </div>

          {/* 0fr -> 1fr tweens to the form's natural height with no measuring; folding is quicker than unfolding */}
          <div
            id={panelId}
            inert={!expanded}
            className={`grid transition-[grid-template-rows] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${expanded ? "grid-rows-[1fr] duration-300" : "grid-rows-[0fr] duration-200"}`}
          >
            {/* Side padding keeps field focus rings clear of the clip */}
            <div className="-mx-1 min-h-0 overflow-hidden px-1">
              <div
                className={`pt-8 pb-1 transition-[opacity,transform] ease-out motion-reduce:transform-none ${expanded ? "translate-y-0 opacity-100 duration-300" : "-translate-y-1 opacity-0 duration-150"}`}
              >
                {/* Form; Reset remounts it so every field, Radix selects included, returns to its default */}
                <div key={fieldsKey} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                      Content Type
                    </Label>
                    <Select defaultValue="social-media">
                      <SelectTrigger className="h-[40px] rounded-lg border-[#E3E3E6] bg-white text-[14px] shadow-sm focus:ring-1 focus:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent
                        side="bottom"
                        align="start"
                        className="rounded-lg dark:bg-card dark:border-border"
                      >
                        <SelectItem value="social-media">
                          Social Media Post
                        </SelectItem>
                        <SelectItem value="blog-post">Blog Post</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="email">Email Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                      Topic / Product
                    </Label>
                    <Input
                      defaultValue="Benefits of Remote Jobs"
                      className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                      Key Points (oner per line)
                    </Label>
                    <Textarea
                      defaultValue={`Increased flexibility and work-life balance\nAccess to a global talent pool for companies\nReduced commuting time and costs`}
                      className="min-h-[120px] resize-none rounded-lg border-[#E3E3E6] py-3 text-[14px] leading-relaxed shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                      Target Audience
                    </Label>
                    <Input
                      defaultValue="Benefits of Remote Jobs"
                      className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                        Tone
                      </Label>
                      <Select defaultValue="informative">
                        <SelectTrigger className="h-[40px] rounded-lg border-[#E3E3E6] bg-white text-[14px] shadow-sm focus:ring-1 focus:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          align="start"
                          className="rounded-lg dark:bg-card dark:border-border"
                        >
                          <SelectItem value="informative">
                            Informative
                          </SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                        Length
                      </Label>
                      <Input
                        defaultValue="500 words"
                        className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-[#18181B] dark:text-zinc-500">
                      Keywords (Optional)
                    </Label>
                    <Input
                      defaultValue="remote work, productivity"
                      className="h-[40px] rounded-lg border-[#E3E3E6] text-[14px] shadow-sm focus-visible:ring-1 focus-visible:ring-black/5 dark:border-input dark:bg-input/30 dark:text-zinc-200"
                    />
                  </div>
                </div>

                {/* Fields feed the prompt's send, so the panel only saves or resets them */}
                <div className="mt-8 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setFieldsKey((k) => k + 1)}
                    className="h-9 px-4 text-[13px] font-medium text-zinc-500 transition-[color,transform] duration-150 ease-out active:scale-[0.97] dark:text-zinc-400"
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setExpanded(false);
                      promptRef.current?.focus();
                    }}
                    className="h-9 rounded-lg px-4 text-[13px] font-medium transition-[transform,opacity] duration-150 ease-out active:scale-[0.97]"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
